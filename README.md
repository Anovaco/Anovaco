# Anova Co. — Next.js app

Premium Next.js 14 (App Router, TypeScript, Tailwind) rebuild of the Anova Co. marketing + booking site. Calendar-powered audit booking that writes to Google Calendar, generates Google Meet links, and emails both client + team through Resend.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Routes

| Path          | File                            | Purpose                                        |
|---------------|---------------------------------|------------------------------------------------|
| `/`           | `app/page.tsx`                  | Home (hero → ticker → problem → services → process → investment → testimonials placeholder → CTA → footer) |
| `/contact`    | `app/contact/page.tsx`          | 5-step booking form (business → contact → interests → context → calendar)                                  |
| `/thank-you`  | `app/thank-you/page.tsx`        | Confirmation, Google Meet link, `.ics` download |
| `/api/book`   | `app/api/book/route.ts`         | POST: Google Calendar event + Meet + Resend emails |

## Brand tokens

Loaded in `tailwind.config.ts` + `app/globals.css`:

- `green` `#1B2B21` · `green-mid` `#2A4232` · `green-deep` `#0D1610`
- `gold` `#D4AF37` · `gold-lt` `#E8D07A`
- `canvas` `#F4F1ED` · `canvas-2` `#F0EDE8`
- `ink` `#333333` · `muted` `#888880`
- Serif: **Playfair Display** (400 + italic + 700) — `var(--font-playfair)`
- Sans: **DM Sans** (300, 400, 500) — `var(--font-dm-sans)`

Fonts are loaded via `next/font/google` in `app/layout.tsx`.

## Environment variables

Copy `.env.local` and fill in your real values. All are **required** for the booking flow to fully function — the API degrades gracefully if calendar creds are missing (emails still send), and emails are skipped if Resend is missing.

```bash
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
RESEND_API_KEY=
NOTIFICATION_EMAIL=ano@anovaco.ca
NEXT_PUBLIC_BASE_URL=https://anovaco.ca
```

### Google Calendar setup

1. Go to <https://console.cloud.google.com>.
2. Create a new project called **Anova Co.**
3. Enable the **Google Calendar API**.
4. Create a **Service Account**.
5. Download the JSON key file.
6. Copy `client_email` → `GOOGLE_CLIENT_EMAIL`.
7. Copy `private_key` → `GOOGLE_PRIVATE_KEY` (keep the literal `\n` escapes — the route converts them at runtime).
8. Open Google Calendar → target calendar **Settings and sharing** → **Share with specific people** → add the service-account email with **Make changes to events** permission.
9. Copy the Calendar ID (also in Settings) → `GOOGLE_CALENDAR_ID`.

### Resend setup

1. Sign up at <https://resend.com>.
2. Add and verify domain `anovaco.ca`.
3. Create an API key → `RESEND_API_KEY`.

### Deployment

1. Push to GitHub.
2. Connect the repo to Vercel (<https://vercel.com>).
3. Add all the env vars above in the Vercel project dashboard.
4. Deploy.

## Project structure

```
app/
  api/book/route.ts        # Google Calendar + Resend
  contact/page.tsx         # Multi-step booking (client)
  thank-you/page.tsx       # Confirmation + .ics download (client)
  layout.tsx               # Fonts + metadata
  page.tsx                 # Home
  globals.css              # Brand tokens + ported section styles
components/
  anova-logo.tsx           # SVG monogram
  site-nav.tsx             # Fixed nav with dark/light scroll state
  site-footer.tsx
  ui/button.tsx            # shadcn-style, brand-themed
  ui/card.tsx
  ui/calendar.tsx          # react-day-picker v9 with brand classNames
lib/utils.ts               # cn() helper
legacy/                    # Original index.html + tooling (kept for reference)
```

## Calendar rules

- Single-date selection (react-day-picker mode="single").
- **Past dates disabled**; **Sundays disabled** (closed).
- Mon–Fri: 9:00 AM – 5:00 PM in 30-min slots.
- Saturday: 10:00 AM – 2:00 PM in 30-min slots.
- Selected date: `#1B2B21` / `#F4F1ED`.
- Today indicator: `#D4AF37` dot under the number.
- Selected time slot: `#1B2B21` / `#F4F1ED`.
- Navigation arrows: `#1B2B21`.
- No Tailwind blue/indigo anywhere.

## Notes

- The `.ics` download on the thank-you page is generated client-side (`text/calendar` blob) so the user can add the audit to any calendar app.
- Calendar and email failures log but don't block the user — they still reach `/thank-you`.
- `legacy/` contains the previous single-file `index.html`, `serve.mjs`, and `screenshot.mjs` for reference; they aren't part of the Next.js build.
