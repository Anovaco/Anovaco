/**
 * Anova Co. branded email templates.
 *
 * Brand tokens
 *   Forest Green:  #1B2B21
 *   Gold:          #D4AF37
 *   Canvas:        #F4F1ED
 *   Ink:           #333333
 *   Muted:         #888880
 *
 * All styles are inline because email clients drop <style> tags unreliably.
 */

export type EmailData = {
  clientName: string;       // first name only
  businessName: string;
  date: string;             // "Monday, June 2 2025"
  time: string;             // "10:00 AM"
  meetLink: string;
  calendarLink?: string;    // .ics or Google Calendar add-link
};

export type RenderedEmail = { subject: string; html: string };

/* ───────────── Shared building blocks ───────────── */

const FOREST = "#1B2B21";
const GOLD = "#D4AF37";
const CANVAS = "#F4F1ED";
const INK = "#333333";
const MUTED = "#888880";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const logoMarkSvg = `
<svg width="28" height="28" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <rect width="40" height="40" rx="5" fill="${FOREST}"/>
  <path d="M20 8 L32 30 H26.5 L20 18 L13.5 30 H8 Z" fill="${CANVAS}"/>
  <rect x="14" y="22" width="12" height="2" rx="1" fill="${GOLD}"/>
</svg>`.trim();

const header = `
<tr>
  <td style="background:${FOREST};padding:32px 40px;border-bottom:1px solid rgba(212,175,55,0.2);">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="left" style="vertical-align:middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;padding-right:12px;">${logoMarkSvg}</td>
            <td style="vertical-align:middle;font-family:'DM Sans',Arial,Helvetica,sans-serif;font-weight:300;font-size:13px;letter-spacing:0.2em;color:${CANVAS};text-transform:uppercase;">
              ANOVA CO.
            </td>
          </tr></table>
        </td>
        <td align="right" style="vertical-align:middle;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:12px;color:rgba(212,175,55,0.6);">
          Growth, engineered.
        </td>
      </tr>
    </table>
  </td>
</tr>`;

const footer = `
<tr>
  <td style="background:${FOREST};padding:24px 40px;border-top:1px solid rgba(212,175,55,0.15);text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.1em;color:rgba(244,241,237,0.4);">
    &copy; 2025 Anova Co. &middot; Toronto, Canada &middot; anovaco.ca
  </td>
</tr>`;

const goldDivider = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr><td style="width:40px;height:2px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>
</table>`;

const ctaButton = (label: string, href: string, opts: { ghost?: boolean; large?: boolean } = {}) => {
  const padding = opts.large ? "16px 36px" : "14px 32px";
  const fontSize = opts.large ? "14px" : "13px";
  if (opts.ghost) {
    return `<a href="${href}" style="display:inline-block;background:transparent;color:${GOLD};border:1px solid ${GOLD};padding:${padding};border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:${fontSize};letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">${label}</a>`;
  }
  return `<a href="${href}" style="display:inline-block;background:${FOREST};color:${CANVAS};padding:${padding};border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:${fontSize};letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">${label}</a>`;
};

const detailRow = (label: string, value: string, isLink = false) => `
<tr>
  <td style="padding-top:12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">
    ${label}
  </td>
</tr>
<tr>
  <td style="padding-top:2px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${FOREST};">
    ${isLink ? `<a href="${value}" style="color:${GOLD};text-decoration:none;word-break:break-all;">${value}</a>` : value}
  </td>
</tr>`;

const bookingDetailsBox = (rows: { label: string; value: string; isLink?: boolean }[]) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${CANVAS};border-left:3px solid ${GOLD};border-radius:4px;margin-bottom:32px;">
  <tr><td style="padding:20px 24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${rows.map((r) => detailRow(r.label, r.value, r.isLink)).join("")}
    </table>
  </td></tr>
</table>`;

const bulletList = (items: string[]) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 8px;">
  ${items
    .map(
      (item) => `
  <tr>
    <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#555555;">
      <span style="color:${GOLD};margin-right:10px;">&mdash;</span>${item}
    </td>
  </tr>`,
    )
    .join("")}
</table>`;

const heading = (text: string) =>
  `<h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.2;color:${FOREST};">${text}</h1>`;

const subheading = (text: string) =>
  `<p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${MUTED};">${text}</p>`;

const sectionHeading = (text: string) =>
  `<h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:18px;color:${FOREST};">${text}</h2>`;

const para = (text: string) =>
  `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${INK};">${text}</p>`;

const shell = (title: string, bodyInner: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${CANVAS};">
          ${header}
          <tr>
            <td style="background:#FFFFFF;padding:40px 40px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${INK};">
              ${bodyInner}
            </td>
          </tr>
          ${footer}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/* ───────────── Email 1 — Instant confirmation ───────────── */

export function getConfirmationEmail(data: EmailData): RenderedEmail {
  const subject = `Your Anova Co. audit is confirmed — ${data.date} at ${data.time}`;
  const calendarHref = data.calendarLink || data.meetLink;

  const body = `
${goldDivider}
${heading("You&rsquo;re confirmed.")}
${subheading("Your complimentary Business Growth Audit with Anova Co.")}

${bookingDetailsBox([
  { label: "DATE", value: escape(data.date) },
  { label: "TIME", value: `${escape(data.time)} Eastern Time` },
  { label: "FORMAT", value: "Google Meet &mdash; 30 minutes" },
  { label: "MEET LINK", value: data.meetLink, isLink: true },
])}

${para(
  `Before our call, we&rsquo;ll review your entire online presence &mdash; your website, Google listing, social media, and reviews &mdash; so we arrive with specific insights for <strong>${escape(
    data.businessName,
  )}</strong>, not generic advice.`,
)}

${goldDivider}
${sectionHeading("What to expect")}
${bulletList([
  "A full audit of your current online presence",
  "Clear, honest recommendations specific to your business",
  "A bespoke growth strategy if we&rsquo;re the right fit",
])}

${goldDivider}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding:8px 0 16px;">
      ${ctaButton("Add to Calendar", calendarHref)}
    </td>
  </tr>
  <tr>
    <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">
      If you need to reschedule, simply reply to this email.
    </td>
  </tr>
</table>`;

  return { subject, html: shell(subject, body) };
}

/* ───────────── Email 2 — 24-hour reminder ───────────── */

export function getReminderEmail24h(data: EmailData): RenderedEmail {
  const subject = `Your Anova Co. audit is tomorrow — ${data.time} ET`;

  const body = `
${goldDivider}
${heading("Your audit is tomorrow.")}
${subheading("A quick reminder of your booking details.")}

${bookingDetailsBox([
  { label: "DATE", value: escape(data.date) },
  { label: "TIME", value: `${escape(data.time)} Eastern Time` },
  { label: "FORMAT", value: "Google Meet &mdash; 30 minutes" },
  { label: "MEET LINK", value: data.meetLink, isLink: true },
])}

${para(
  `We&rsquo;ve already begun reviewing <strong>${escape(
    data.businessName,
  )}</strong>&rsquo;s online presence so our time together is focused and specific. No generic questions. No wasted minutes.`,
)}

${goldDivider}
${sectionHeading("To make the most of your 30 minutes")}
${bulletList([
  "Think about your biggest frustration with your current online presence",
  "Have your website URL and Google Business listing ready to discuss",
  "Come with any questions you&rsquo;d like answered",
])}

${goldDivider}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding:8px 0;">
      ${ctaButton("Join Google Meet", data.meetLink)}
    </td>
  </tr>
</table>`;

  return { subject, html: shell(subject, body) };
}

/* ───────────── Email 3 — 1-hour reminder ───────────── */

export function getReminderEmail1h(data: EmailData): RenderedEmail {
  const subject = "Your audit starts in 1 hour — join link inside";

  const body = `
${goldDivider}
${heading("Your call starts in one hour.")}

${bookingDetailsBox([
  { label: "TIME", value: `${escape(data.time)} Eastern Time today` },
  { label: "MEET LINK", value: data.meetLink, isLink: true },
])}

${para("We&rsquo;re ready. See you shortly.")}

<p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:${INK};">
  The Anova Co. Team<br/>
  <a href="mailto:ano@anovaco.ca" style="color:${GOLD};text-decoration:none;">ano@anovaco.ca</a><br/>
  <a href="https://anovaco.ca" style="color:${GOLD};text-decoration:none;">anovaco.ca</a>
</p>

${goldDivider}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding:8px 0;">
      ${ctaButton("Join Google Meet Now", data.meetLink, { large: true })}
    </td>
  </tr>
</table>`;

  return { subject, html: shell(subject, body) };
}

/* ───────────── Email 4 — Post-call follow-up ───────────── */

// In future: replace generic "what we covered" bullets with personalised
// notes captured during/after the call.
export function getFollowUpEmail(data: EmailData): RenderedEmail {
  const subject = `Thank you, ${data.clientName} — next steps from today's call`;
  // Placeholder — swap once the real Google review URL is available.
  const reviewLink = "https://g.page/r/PLACEHOLDER_GOOGLE_REVIEW_LINK/review";

  const body = `
${goldDivider}
${heading("Thank you for your time today.")}

${para(
  `It was a pleasure learning about <strong>${escape(
    data.businessName,
  )}</strong>. Below is a summary of what we discussed and the clearest path forward.`,
)}

${goldDivider}
${sectionHeading("What we covered")}
${bulletList([
  "Your current online presence and where the gaps are",
  "The growth opportunities most relevant to your market",
  "A bespoke strategy outline for moving forward",
])}

${goldDivider}
${sectionHeading("Your next step")}
${para(
  `If you&rsquo;d like to move forward, simply reply to this email and we&rsquo;ll put together a tailored proposal for <strong>${escape(
    data.businessName,
  )}</strong>. No obligation &mdash; we only work with businesses we know we can genuinely help.`,
)}

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding:8px 0;">
      ${ctaButton("Reply to Get Started", "mailto:ano@anovaco.ca")}
    </td>
  </tr>
</table>

${goldDivider}
${sectionHeading("One small favour")}
${para(
  "If you found today&rsquo;s conversation valuable, we&rsquo;d be grateful if you left us a quick Google review. It takes 30 seconds and helps other local businesses find us.",
)}

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr>
    <td align="center" style="padding:8px 0;">
      ${ctaButton("Leave a Google Review &rarr;", reviewLink, { ghost: true })}
    </td>
  </tr>
</table>`;

  return { subject, html: shell(subject, body) };
}
