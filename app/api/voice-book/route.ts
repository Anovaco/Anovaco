import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import * as chrono from "chrono-node";
import { getConfirmationEmail } from "@/lib/email-templates";
import { isSlotTaken, torontoLocalToUTC } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ───────────── Config ───────────── */

const TZ = "America/Toronto";
const FROM = "Anova Co. <ano@anovaco.ca>";
const NOTIFY_TO = "ano@anovaco.ca";

type VoicePayload = {
  name: string;
  email: string;
  business_name: string;
  industry: string;
  services_interested?: string;
  preferred_datetime: string; // natural language, e.g. "next Monday at 3 PM"
};

// What we hand to the calendar / email layer — same contract as before.
type ResolvedBooking = {
  name: string;
  email: string;
  business_name: string;
  industry: string;
  services_interested: string;
  preferred_date: string; // "YYYY-MM-DD" (Toronto local)
  preferred_time: string; // "HH:MM" 24h (Toronto local)
};

/* ───────────── Helpers ───────────── */

function formatTime12(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${period}`;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || "there";
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Local "YYYY-MM-DDTHH:mm:ss" string `mins` minutes after the given y/mo/d/h/mi.
// Google Calendar interprets this + an explicit timeZone as local wall-clock.
function localISOPlusMinutes(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  mins: number,
): string {
  const dt = new Date(y, mo - 1, d, h, mi + mins, 0);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd}T${hh}:${min}:00`;
}

/* ───────────── Google Calendar ───────────── */

async function createCalendarEvent(
  p: ResolvedBooking,
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
): Promise<{ meetLink: string; eventId: string } | null> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!clientEmail || !privateKey || !calendarId) {
    console.warn("[voice-book] Google credentials missing — skipping calendar event");
    return null;
  }
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
      subject: "ano@anovaco.ca",
    });
    const calendar = google.calendar({ version: "v3", auth });

    const startLocal = `${p.preferred_date}T${p.preferred_time}:00`;
    const endLocal = localISOPlusMinutes(y, mo, d, h, mi, 30);

    const descLines = [
      `Business: ${p.business_name}`,
      `Industry: ${p.industry}`,
      "",
      "CONTACT",
      `Name: ${p.name}`,
      `Email: ${p.email}`,
      "",
      "SERVICES INTERESTED IN",
      p.services_interested?.trim() || "Not specified",
      "",
      "REQUESTED SLOT",
      `Date: ${p.preferred_date}`,
      `Time: ${p.preferred_time} (America/Toronto)`,
      "",
      "Booked via ElevenLabs voice agent",
    ];

    const res = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "none",
      requestBody: {
        summary: `Anova Co. Audit — ${p.business_name} [Voice]`,
        description: descLines.join("\n"),
        start: { dateTime: startLocal, timeZone: TZ },
        end: { dateTime: endLocal, timeZone: TZ },
        attendees: [{ email: p.email, displayName: p.name }],
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "email", minutes: 60 },
            { method: "popup", minutes: 15 },
          ],
        },
      },
    });

    const meetLink =
      res.data.hangoutLink ||
      res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
      "";
    return { meetLink, eventId: res.data.id || "" };
  } catch (err) {
    console.error("[voice-book] Google Calendar error:", err);
    return null;
  }
}

/* ───────────── Emails (Resend) ───────────── */

function renderNotifyEmail(
  p: ResolvedBooking,
  humanDate: string,
  humanTime: string,
  calendarSucceeded: boolean,
  meetLink: string,
): string {
  return `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:#111;background:#fff;padding:20px;border:1px solid #eee;white-space:pre-wrap;">NEW VOICE BOOKING

Business: ${escapeHtml(p.business_name)}
Industry: ${escapeHtml(p.industry)}
Date:     ${escapeHtml(humanDate)}
Time:     ${escapeHtml(humanTime)}

CONTACT
  Name:  ${escapeHtml(p.name)}
  Email: ${escapeHtml(p.email)}

SERVICES INTERESTED IN
  ${escapeHtml(p.services_interested?.trim() || "Not specified")}

Source:   Booked via ElevenLabs voice agent
Google Calendar event created: ${calendarSucceeded ? "Yes" : "No"}
Google Meet link: ${escapeHtml(meetLink || "Not generated")}
</pre>`;
}

async function sendEmails(
  p: ResolvedBooking,
  meetLink: string,
  humanDate: string,
  humanTime: string,
  bookingDateTime: string,
  calendarSucceeded: boolean,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[voice-book] RESEND_API_KEY missing — skipping emails");
    return;
  }
  const resend = new Resend(apiKey);

  // Client confirmation — branded template
  try {
    const { subject, html } = getConfirmationEmail({
      clientName: firstName(p.name),
      businessName: p.business_name,
      date: humanDate,
      time: humanTime,
      meetLink,
      bookingDateTime,
    });
    await resend.emails.send({ from: FROM, to: p.email, subject, html });
  } catch (err) {
    console.error("[voice-book] Client email error:", err);
  }

  // Internal notification
  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `New Voice Booking — ${p.business_name} — ${humanDate} at ${humanTime}`,
      html: renderNotifyEmail(p, humanDate, humanTime, calendarSucceeded, meetLink),
    });
  } catch (err) {
    console.error("[voice-book] Notify email error:", err);
  }
}

/* ───────────── Route handler ───────────── */

function badRequest(message: string) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function POST(req: Request) {
  // 1. Auth — shared secret header
  const secret = req.headers.get("x-elevenlabs-secret");
  const expected = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // 2. Parse body
  let payload: VoicePayload;
  try {
    payload = (await req.json()) as VoicePayload;
  } catch {
    return badRequest("Invalid JSON body");
  }

  // 3. Validate required string fields
  const required: (keyof VoicePayload)[] = [
    "name",
    "email",
    "business_name",
    "industry",
    "preferred_datetime",
  ];
  for (const k of required) {
    const v = payload[k];
    if (typeof v !== "string" || !v.trim()) {
      return badRequest(`Missing required field: ${k}`);
    }
  }
  if (
    payload.services_interested !== undefined &&
    typeof payload.services_interested !== "string"
  ) {
    return badRequest("Invalid field: services_interested must be a string");
  }

  // Normalise
  const name = payload.name.trim();
  const email = payload.email.trim();
  const business_name = payload.business_name.trim();
  const industry = payload.industry.trim();
  const services_interested = payload.services_interested?.trim() || "";
  const preferred_datetime = payload.preferred_datetime.trim();

  // 4. Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email address");
  }

  // 5. Resolve the natural-language datetime in Toronto wall-clock.
  // Anchor chrono to "now in Toronto" — pulled as a wall-clock string and re-
  // parsed by Date, so the components come back as Toronto-local regardless of
  // the server's actual timezone. DST is handled by toLocaleString.
  const torontoNowString = new Date().toLocaleString("en-US", { timeZone: TZ });
  const referenceDate = new Date(torontoNowString);
  const parsedResults = chrono.parse(preferred_datetime, referenceDate, {
    forwardDate: true,
  });
  if (parsedResults.length === 0) {
    return badRequest(
      "I didn't catch the date and time — could you say it again?",
    );
  }
  const start = parsedResults[0].start;
  const year = start.get("year");
  const month = start.get("month"); // 1-indexed
  const day = start.get("day");
  const hour = start.get("hour"); // 0-23
  const minute = start.get("minute") ?? 0;

  if (
    year == null ||
    month == null ||
    day == null
  ) {
    return badRequest(
      "I didn't catch the date — could you say it again?",
    );
  }
  if (hour == null) {
    return badRequest(
      "I didn't catch the time — could you say it again?",
    );
  }

  // Past-check: compare actual UTC instants so DST and server-TZ can't fool us.
  // The resolved components are Toronto wall-clock → convert to a true UTC
  // instant via torontoLocalToUTC, then compare against the real "now".
  const resolvedUTC = torontoLocalToUTC(year, month, day, hour, minute);
  if (resolvedUTC.getTime() < Date.now()) {
    return badRequest(
      "That time is in the past — could you pick a future date?",
    );
  }

  // 6. Convert to the calendar/email contract: YYYY-MM-DD + HH:MM (24h).
  const preferred_date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const preferred_time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  // 7. Human-readable strings for the agent to read back and for emails.
  // Build a UTC-noon Date from the components so the weekday is derived from
  // the resolved date itself — no timezone off-by-one possible.
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const confirmedDate = utcNoon.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const confirmedTime = formatTime12(hour, minute);

  const resolved: ResolvedBooking = {
    name,
    email,
    business_name,
    industry,
    services_interested,
    preferred_date,
    preferred_time,
  };

  // 8. Block double-bookings. Google Calendar is the source of truth.
  try {
    const taken = await isSlotTaken(year, month, day, hour, minute);
    if (taken) {
      return NextResponse.json(
        {
          success: false,
          error: "That time slot is already booked. Please choose another time.",
        },
        { status: 409 },
      );
    }
  } catch (err) {
    // Fail-open: if freebusy is unreachable, proceed rather than hard-fail.
    console.error("[voice-book] freebusy preflight failed — proceeding:", err);
  }

  // 9. Create the calendar event (non-blocking on failure)
  const calResult = await createCalendarEvent(resolved, year, month, day, hour, minute);
  const meetLink = calResult?.meetLink || "";
  const calendarSucceeded = !!calResult;

  // 10. Send confirmation + internal notification emails
  const bookingDateTime = resolvedUTC.toISOString();
  await sendEmails(
    resolved,
    meetLink,
    confirmedDate,
    confirmedTime,
    bookingDateTime,
    calendarSucceeded,
  );

  // 11. Success response — echo back the resolved date/time so the agent
  // reads back exactly what the backend booked.
  return NextResponse.json({
    success: true,
    meetLink,
    calendarSucceeded,
    confirmedDate,
    confirmedTime,
    message: `Booking confirmed for ${confirmedDate} at ${confirmedTime}.`,
  });
}
