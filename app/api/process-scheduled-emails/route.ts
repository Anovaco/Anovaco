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
  type RenderedEmail,
  type EmailData,
} from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = "Anova Co. <ano@anovaco.ca>";

function render(emailType: EmailType, data: EmailData): RenderedEmail {
  if (emailType === "reminder24h") return getReminderEmail24h(data);
  if (emailType === "reminder1h") return getReminderEmail1h(data);
  return getFollowUpEmail(data);
}

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

  const due = await getPendingEmails();
  const results: { id: string; type: EmailType; ok: boolean; error?: string }[] = [];

  for (const { booking, emailType } of due) {
    const data: EmailData = {
      clientName: booking.clientName,
      businessName: booking.businessName,
      date: booking.date,
      time: booking.time,
      meetLink: booking.meetLink,
      bookingDateTime: booking.bookingDateTime,
    };
    const { subject, html } = render(emailType, data);
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: booking.clientEmail,
        subject,
        html,
      });
      if (error) {
        results.push({ id: booking.id, type: emailType, ok: false, error: String(error) });
        continue;
      }
      await markEmailSent(booking.id, emailType);
      results.push({ id: booking.id, type: emailType, ok: true });
    } catch (err) {
      results.push({
        id: booking.id,
        type: emailType,
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
