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

function renderClientEmail(p: Payload, meetLink: string, humanDate: string, humanTime: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your Anova Co. audit is confirmed</title>
</head>
<body style="margin:0;padding:0;background:#F4F1ED;font-family:Helvetica,Arial,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1ED;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid rgba(51,51,51,0.08);">
        <tr><td style="background:#1B2B21;padding:28px 32px;border-bottom:1px solid #D4AF37;">
          <table role="presentation" width="100%"><tr>
            <td style="vertical-align:middle;">
              <svg width="32" height="32" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="5" fill="#1B2B21"/>
                <path d="M20 8 L32 30 H26.5 L20 18 L13.5 30 H8 Z" fill="#F4F1ED"/>
                <rect x="14" y="22" width="12" height="2" rx="1" fill="#D4AF37"/>
              </svg>
            </td>
            <td style="text-align:right;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#D4AF37;font-weight:400;">
              Growth, engineered.
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:40px 32px 24px;">
          <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#D4AF37;">
            Your audit is confirmed
          </p>
          <h1 style="margin:0 0 24px;font-family:Georgia,'Playfair Display',serif;font-weight:400;font-size:30px;line-height:1.1;color:#1B2B21;letter-spacing:-0.02em;">
            Hi ${firstName(p.name)}, we&rsquo;re <i style="color:#D4AF37;">looking forward</i> to it.
          </h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#333333;">
            Your complimentary Business Growth Audit with Anova Co. is confirmed.
          </p>
          <table role="presentation" width="100%" style="border-left:2px solid #D4AF37;padding:14px 18px;background:rgba(212,175,55,0.05);margin:0 0 24px;">
            <tr><td style="font-size:13px;line-height:1.7;color:#1B2B21;">
              <strong style="font-weight:500;">Date:</strong> ${humanDate}<br/>
              <strong style="font-weight:500;">Time:</strong> ${humanTime} Eastern Time<br/>
              <strong style="font-weight:500;">Format:</strong> Google Meet<br/>
              <strong style="font-weight:500;">Duration:</strong> 30 minutes
            </td></tr>
          </table>
          ${
            meetLink
              ? `<p style="margin:0 0 28px;"><a href="${meetLink}" style="display:inline-block;background:#D4AF37;color:#1B2B21;text-decoration:none;padding:14px 24px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:500;">Join Google Meet &rarr;</a></p>`
              : ""
          }
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#333333;">
            Before our call, we&rsquo;ll review your entire online presence — your website, Google
            listing, social media, and reviews — so we arrive with specific insights for
            <strong>${p.business_name}</strong>.
          </p>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#888880;">What to expect</p>
          <ul style="margin:0 0 24px;padding:0;list-style:none;font-size:14px;line-height:1.8;color:#333333;">
            <li>— A full audit of your current online presence</li>
            <li>— Clear, honest recommendations specific to your business</li>
            <li>— A bespoke growth strategy if we&rsquo;re the right fit</li>
          </ul>
          <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#333333;">
            If you need to reschedule, reply to this email and we&rsquo;ll find another time that
            works.
          </p>
          <p style="margin:0 0 4px;font-family:Georgia,'Playfair Display',serif;font-style:italic;color:#D4AF37;font-size:16px;">
            Growth, engineered.
          </p>
          <p style="margin:0;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#1B2B21;font-weight:500;">
            Anova Co. &nbsp;·&nbsp; <a href="https://anovaco.ca" style="color:#D4AF37;text-decoration:none;">anovaco.ca</a>
          </p>
        </td></tr>

        <tr><td style="padding:20px 32px;border-top:1px solid rgba(51,51,51,0.08);font-size:11px;color:#888880;letter-spacing:0.04em;">
          &copy; 2026 Anova Co. &nbsp;·&nbsp; Toronto, Canada
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

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
    const { subject, html } = getConfirmationEmail({
      clientName: firstName(p.name),
      businessName: p.business_name,
      date: humanDate,
      time: humanTime,
      meetLink,
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
    addBooking(booking);
  } catch (err) {
    console.error("[book] Failed to persist booking for scheduled emails:", err);
  }

  return NextResponse.json({
    success: true,
    meetLink,
    calendarSucceeded,
  });
}
