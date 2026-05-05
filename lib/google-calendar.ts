import { google, type calendar_v3 } from "googleapis";

export const TORONTO_TZ = "America/Toronto";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

let cachedClient: calendar_v3.Calendar | null = null;

export function getCalendarClient(): calendar_v3.Calendar | null {
  if (cachedClient) return cachedClient;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!clientEmail || !privateKey || !calendarId) return null;
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: SCOPES,
    subject: "ano@anovaco.ca",
  });
  cachedClient = google.calendar({ version: "v3", auth });
  return cachedClient;
}

// Returns Toronto's UTC offset (in minutes) at the given UTC moment.
// May ≈ -240 (EDT), December = -300 (EST).
export function torontoOffsetMinutesAt(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO_TZ,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date(utcMs));
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] ?? "0", 10));
}

// Convert a Toronto wall-clock moment to a UTC Date (DST-aware).
export function torontoLocalToUTC(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
): Date {
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  const offset = torontoOffsetMinutesAt(naive);
  return new Date(naive - offset * 60000);
}

// Parse "YYYY-MM-DD" into y/mo/d ints; returns null if malformed.
export function parseISODate(s: string): { y: number; mo: number; d: number } | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: +m[1], mo: +m[2], d: +m[3] };
}

// Booking-window bounds for a Toronto date.
// Sundays are closed; Saturdays are 10:00–14:00; weekdays are 9:00–17:00.
// Returns null if the day is fully closed.
export function bookingHoursForDay(y: number, mo: number, d: number) {
  // dow in Toronto local (use the Toronto 12:00 anchor to avoid DST ambiguity)
  const probe = torontoLocalToUTC(y, mo, d, 12, 0);
  const dowStr = new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO_TZ,
    weekday: "short",
  }).format(probe);
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dowStr);
  if (dow === 0) return null; // Sunday closed
  if (dow === 6) return { startH: 10, endH: 14 };
  return { startH: 9, endH: 17 };
}

// Generate the 30-minute slot starts ("HH:mm") for the day's working window.
export function slotsForHours(startH: number, endH: number): string[] {
  const out: string[] = [];
  for (let h = startH; h < endH; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}

// Query Google Calendar freebusy for a UTC range. Returns busy intervals.
export async function freebusy(
  timeMinUtc: Date,
  timeMaxUtc: Date,
): Promise<{ start: Date; end: Date }[]> {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendar || !calendarId) return [];
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMinUtc.toISOString(),
      timeMax: timeMaxUtc.toISOString(),
      timeZone: "UTC",
      items: [{ id: calendarId }],
    },
  });
  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: new Date(b.start as string), end: new Date(b.end as string) }));
}

// Returns the booked "HH:mm" slot starts for a Toronto date.
export async function bookedSlotsForDate(
  y: number,
  mo: number,
  d: number,
): Promise<string[]> {
  const hours = bookingHoursForDay(y, mo, d);
  if (!hours) return [];
  // Widen the window slightly so a busy block that starts before 09:00 still
  // intersects the 09:00 slot.
  const winStart = torontoLocalToUTC(y, mo, d, hours.startH, 0);
  const winEnd = torontoLocalToUTC(y, mo, d, hours.endH, 0);
  const busy = await freebusy(winStart, winEnd);

  const booked: string[] = [];
  for (const slot of slotsForHours(hours.startH, hours.endH)) {
    const [h, mi] = slot.split(":").map(Number);
    const slotStart = torontoLocalToUTC(y, mo, d, h, mi);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
    const conflict = busy.some(
      (b) => b.start < slotEnd && b.end > slotStart,
    );
    if (conflict) booked.push(slot);
  }
  return booked;
}

// Returns true if the specific 30-min Toronto slot conflicts with anything on
// the calendar.
export async function isSlotTaken(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
): Promise<boolean> {
  const slotStart = torontoLocalToUTC(y, mo, d, h, mi);
  const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
  const busy = await freebusy(slotStart, slotEnd);
  return busy.some((b) => b.start < slotEnd && b.end > slotStart);
}
