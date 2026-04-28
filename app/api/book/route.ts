import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { format } from "date-fns";
import { addBooking, type Booking } from "@/lib/bookings-store";
import { getConfirmationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  business_name: string;
  city: string;
  industry: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  interests: string[];
  challenge: string;
  referral: string;
  referral_other: string;
  date: string; // ISO day
  time: string; // "HH:mm" local (Toronto)
};

const TZ = "America/Toronto";
const NOTIFY_TO = process.env.NOTIFICATION_EMAIL || "ano@anovaco.ca";
const FROM = "Anova Co. <ano@anovaco.ca>";

/* ───────────── Helpers ───────────── */

// Format a JS Date into "YYYY-MM-DDTHH:mm:ss" without UTC shift.
// Google Calendar accepts this + explicit timeZone and interprets it as local.
function toLocalISOForDay(dateISO: string, time: string): string {
  const d = new Date(dateISO);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}T${time}:00`;
}
function addMinutesLocalISO(isoLocal: string, mins: number): string {
  const [datePart, timePart] = isoLocal.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, m] = timePart.split(":").map(Number);
  const dt = new Date(y, mo - 1, d, h, m + mins, 0);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const mins2 = String(dt.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd}T${hh}:${mins2}:00`;
}
function formatTime12(t: string): string {
  const [hRaw, mRaw] = t.split(":");
  const h = parseInt(hRaw, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mRaw} ${period}`;
}
function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || "there";
}

/* ───────────── Google Calendar ───────────── */

async function createCalendarEvent(p: Payload): Promise<{ meetLink: string; eventId: string } | null> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!clientEmail || !privateKey || !calendarId) {
    console.warn("[book] Google credentials missing — skipping calendar event");
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

    const startLocal = toLocalISOForDay(p.date, p.time);
    const endLocal = addMinutesLocalISO(startLocal, 30);

    const descLines = [
      `Business: ${p.business_name}`,
      `Location: ${p.city}`,
      `Industry: ${p.industry}`,
      "",
      "CONTACT",
      `Name: ${p.name}`,
      `Role: ${p.role}`,
      `Email: ${p.email}`,
      `Phone: ${p.phone}`,
      "",
      "SERVICES INTERESTED IN",
      ...(p.interests.length ? p.interests.map((i) => `• ${i}`) : ["None specified"]),
      "",
      "BIGGEST CHALLENGE",
      p.challenge || "Not provided",
      "",
      "HOW THEY FOUND US",
      p.referral + (p.referral === "Other" && p.referral_other ? ` — ${p.referral_other}` : ""),
    ];

    const res = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "all",
      requestBody: {
        summary: `Anova Co. Audit — ${p.business_name}`,
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
    console.error("[book] Google Calendar error:", err);
    return null;
  }
}

/* ───────────── Emails (Resend) ───────────── */

function renderNotifyEmail(
  p: Payload,
  humanDate: string,
  humanTime: string,
  calendarSucceeded: boolean,
  meetLink: string
): string {
  const servicesList = p.interests.length ? p.interests.map((i) => `  • ${i}`).join("\n") : "  (none)";
  return `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:#111;background:#fff;padding:20px;border:1px solid #eee;white-space:pre-wrap;">NEW BOOKING

Business: ${p.business_name}
Location: ${p.city}
Industry: ${p.industry}
Date:     ${humanDate}
Time:     ${humanTime}

CONTACT
  Name:  ${p.name}
  Role:  ${p.role}
  Email: ${p.email}
  Phone: ${p.phone}

SERVICES INTERESTED IN
${servicesList}

BIGGEST CHALLENGE
  ${p.challenge || "Not provided"}

HOW THEY FOUND US
  ${p.referral}${p.referral === "Other" && p.referral_other ? ` — ${p.referral_other}` : ""}

Google Calendar event created: ${calendarSucceeded ? "Yes" : "No"}
Google Meet link: ${meetLink || "Not generated"}
</pre>`;
}

async function sendEmails(
  p: Payload,
  meetLink: string,
  humanDate: string,
  humanTime: string,
  calendarSucceeded: boolean
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[book] RESEND_API_KEY missing — skipping emails");
    return;
  }
  const resend = new Resend(apiKey);

  // Client confirmation — branded template
  try {
    const startLocal = toLocalISOForDay(p.date, p.time);
    const bookingDateTime = new Date(startLocal).toISOString();
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
    console.error("[book] Client email error:", err);
  }

  // Internal notification
  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `New Audit Booked — ${p.business_name} — ${humanDate} at ${humanTime}`,
      html: renderNotifyEmail(p, humanDate, humanTime, calendarSucceeded, meetLink),
    });
  } catch (err) {
    console.error("[book] Notify email error:", err);
  }
}

/* ───────────── Route handler ───────────── */

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic server-side validation
  const required: (keyof Payload)[] = [
    "business_name",
    "city",
    "industry",
    "name",
    "role",
    "email",
    "phone",
    "date",
    "time",
  ];
  for (const k of required) {
    const v = payload[k];
    if (typeof v !== "string" || !v.trim()) {
      return NextResponse.json(
        { success: false, error: `Missing required field: ${k}` },
        { status: 400 }
      );
    }
  }
  if (!Array.isArray(payload.interests) || payload.interests.length === 0) {
    return NextResponse.json(
      { success: false, error: "Select at least one service" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
  }

  // Human-formatted date/time for emails & subjects
  const dayDate = new Date(payload.date);
  const humanDate = format(dayDate, "EEEE, MMMM d, yyyy");
  const humanTime = formatTime12(payload.time);

  // Calendar (non-blocking on failure)
  const calResult = await createCalendarEvent(payload);
  const meetLink = calResult?.meetLink || "";
  const calendarSucceeded = !!calResult;

  // Emails
  await sendEmails(payload, meetLink, humanDate, humanTime, calendarSucceeded);

  // Persist booking + scheduled email timestamps so the cron job can send
  // reminders and the post-call follow-up.
  try {
    const startLocal = toLocalISOForDay(payload.date, payload.time);
    const bookingDateTime = new Date(startLocal); // interpreted in server local TZ
    const minute = 60 * 1000;
    const booking: Booking = {
      id: randomUUID(),
      clientName: firstName(payload.name),
      clientEmail: payload.email,
      businessName: payload.business_name,
      date: humanDate,
      time: humanTime,
      meetLink,
      bookingDateTime: bookingDateTime.toISOString(),
      scheduledEmails: {
        reminder24h: {
          scheduledFor: new Date(bookingDateTime.getTime() - 24 * 60 * minute).toISOString(),
          sent: false,
        },
        reminder1h: {
          scheduledFor: new Date(bookingDateTime.getTime() - 60 * minute).toISOString(),
          sent: false,
        },
        followUp: {
          scheduledFor: new Date(bookingDateTime.getTime() + 90 * minute).toISOString(),
          sent: false,
        },
      },
    };
    await addBooking(booking);
  } catch (err) {
    console.error("[book] Failed to persist booking for scheduled emails:", err);
  }

  return NextResponse.json({
    success: true,
    meetLink,
    calendarSucceeded,
  });
}
