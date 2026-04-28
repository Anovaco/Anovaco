// Mirrors the helpers in app/thank-you/page.tsx so we can verify .ics output
// and the Google Calendar URL without rendering the page client-side.

const pad = (n) => String(n).padStart(2, "0");
const toUTCStamp = (d) =>
  d.getUTCFullYear().toString() +
  pad(d.getUTCMonth() + 1) +
  pad(d.getUTCDate()) +
  "T" +
  pad(d.getUTCHours()) +
  pad(d.getUTCMinutes()) +
  pad(d.getUTCSeconds()) +
  "Z";

const toLocalStamp = (y, mo, d, h, mi) => `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(mi)}00`;

const ics = (v) =>
  v.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");

const TORONTO_VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:America/Toronto",
  "BEGIN:STANDARD",
  "DTSTART:19701101T020000",
  "TZOFFSETFROM:-0400",
  "TZOFFSETTO:-0500",
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
  "TZNAME:EST",
  "END:STANDARD",
  "BEGIN:DAYLIGHT",
  "DTSTART:19700308T020000",
  "TZOFFSETFROM:-0500",
  "TZOFFSETTO:-0400",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
  "TZNAME:EDT",
  "END:DAYLIGHT",
  "END:VTIMEZONE",
].join("\r\n");

function buildICS(parts, meetLink) {
  const start = toLocalStamp(parts.y, parts.mo, parts.d, parts.h, parts.mi);
  const endLocal = new Date(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi + 30);
  const end = toLocalStamp(
    endLocal.getFullYear(),
    endLocal.getMonth() + 1,
    endLocal.getDate(),
    endLocal.getHours(),
    endLocal.getMinutes(),
  );
  const now = new Date();
  const uid = `anova-${now.getTime()}@anovaco.ca`;
  const description = ics(
    "Your complimentary 30-minute business growth audit with Anova Co. — anovaco.ca",
  );
  const location = ics(meetLink || "Google Meet");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anova Co.//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    TORONTO_VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUTCStamp(now)}`,
    `DTSTART;TZID=America/Toronto:${start}`,
    `DTEND;TZID=America/Toronto:${end}`,
    "SUMMARY:Anova Co. Growth Audit",
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    meetLink ? `URL:${meetLink}` : "",
    "ORGANIZER;CN=Anova Co.:mailto:ano@anovaco.ca",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function torontoOffsetMinutesAt(utcMs) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Toronto",
    timeZoneName: "shortOffset",
  }).formatToParts(new Date(utcMs));
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] ?? "0", 10));
}

function torontoToUTCDate(parts) {
  const naive = Date.UTC(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi);
  const offset = torontoOffsetMinutesAt(naive);
  return new Date(naive - offset * 60000);
}

function buildGoogleCalendarUrl(parts, meetLink) {
  const startUtc = torontoToUTCDate(parts);
  const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000);
  const dates = `${toUTCStamp(startUtc)}/${toUTCStamp(endUtc)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Anova Co. Growth Audit",
    dates,
    details: "Your complimentary audit with Anova Co.",
    location: meetLink || "Google Meet",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Test scenarios
const cases = [
  { label: "May 15 2026 10:00 (DST, EDT, UTC-4)", parts: { y: 2026, mo: 5, d: 15, h: 10, mi: 0 } },
  { label: "Dec 10 2026 14:30 (EST, UTC-5)", parts: { y: 2026, mo: 12, d: 10, h: 14, mi: 30 } },
  { label: "23:50 → end overflows to 00:20 next day", parts: { y: 2026, mo: 7, d: 1, h: 23, mi: 50 } },
];

const meet = "https://meet.google.com/hwx-kvaa-hsf";

for (const c of cases) {
  console.log("\n=== " + c.label + " ===");
  console.log("\n.ics:\n" + buildICS(c.parts, meet));
  console.log("\nGoogle Calendar URL:\n" + buildGoogleCalendarUrl(c.parts, meet));
}
