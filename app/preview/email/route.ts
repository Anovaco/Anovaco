import {
  getConfirmationEmail,
  getReminderEmail24h,
  getReminderEmail1h,
  getFollowUpEmail,
  type EmailData,
  type RenderedEmail,
} from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sample: EmailData = {
  clientName: "Alex",
  businessName: "Maple Avenue Dental",
  date: "Monday, June 2 2025",
  time: "10:00 AM",
  meetLink: "https://meet.google.com/abc-defg-hij",
  calendarLink: "https://calendar.google.com/calendar/u/0/r/eventedit",
};

const renderers: Record<string, () => RenderedEmail> = {
  confirmation: () => getConfirmationEmail(sample),
  "reminder-24h": () => getReminderEmail24h(sample),
  "reminder-1h": () => getReminderEmail1h(sample),
  "follow-up": () => getFollowUpEmail(sample),
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "confirmation";
  const fn = renderers[type];
  if (!fn) {
    return new Response(
      `Unknown preview "${type}". Try ?type=${Object.keys(renderers).join(" | ")}`,
      { status: 404, headers: { "content-type": "text/plain" } },
    );
  }
  const { html } = fn();
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
