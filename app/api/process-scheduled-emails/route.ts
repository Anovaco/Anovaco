import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getPendingEmails,
  markEmailSent,
  type EmailType,
} from "@/lib/bookings-store";
import {
  getReminderEmail24h,
  getReminderEmail1h,
  getFollowUpEmail,
  getConfirmationEmail,
  type RenderedEmail,
  type EmailData,
} from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = "Anova Co. <ano@anovaco.ca>";

function firstName(full: string): string {
  return (full || "").trim().split(/\s+/)[0] || "there";
}

function render(emailType: EmailType, data: EmailData): RenderedEmail {
  if (emailType === "confirmation") return getConfirmationEmail(data);
  if (emailType === "reminder_24h") return getReminderEmail24h(data);
  if (emailType === "reminder_1h") return getReminderEmail1h(data);
  return getFollowUpEmail(data);
}

// Reconstruct booking start time from scheduled_for + email-type offset.
function bookingDateTimeFor(emailType: EmailType, scheduledFor: string): string {
  const t = new Date(scheduledFor).getTime();
  if (emailType === "reminder_24h") return new Date(t + 24 * 60 * 60 * 1000).toISOString();
  if (emailType === "reminder_1h") return new Date(t + 60 * 60 * 1000).toISOString();
  if (emailType === "followup") return new Date(t - 60 * 60 * 1000).toISOString();
  return new Date(t).toISOString();
}

type PendingRow = {
  id: number;
  booking_id: number;
  email_type: EmailType;
  recipient_email: string;
  scheduled_for: string;
  sent_at: string | null;
  name?: string;
  email?: string;
  date?: string;
  time?: string;
  meet_link?: string | null;
  business_name?: string | null;
};

async function handle(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "RESEND_API_KEY missing" },
      { status: 500 },
    );
  }
  const resend = new Resend(apiKey);

  const due = (await getPendingEmails()) as unknown as PendingRow[];
  const results: { id: number; type: EmailType; ok: boolean; error?: string }[] = [];

  for (const row of due) {
    const data: EmailData = {
      clientName: firstName(row.name ?? ""),
      businessName: row.business_name ?? "",
      date: row.date ?? "",
      time: row.time ?? "",
      meetLink: row.meet_link ?? "",
      bookingDateTime: bookingDateTimeFor(row.email_type, row.scheduled_for),
    };
    const { subject, html } = render(row.email_type, data);
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: row.recipient_email,
        subject,
        html,
      });
      if (error) {
        results.push({ id: row.id, type: row.email_type, ok: false, error: String(error) });
        continue;
      }
      await markEmailSent(row.id);
      results.push({ id: row.id, type: row.email_type, ok: true });
    } catch (err) {
      results.push({
        id: row.id,
        type: row.email_type,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ success: true, processed: results.length, results });
}

// Vercel Cron uses GET. Allow POST too for manual testing via curl.
export const GET = (req: Request) => handle(req);
export const POST = (req: Request) => handle(req);
