"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { AnovaLogo } from "@/components/anova-logo";
import { PageTransition } from "@/components/page-transition";

type Booking = {
  date: string; // ISO
  time: string; // HH:mm
  businessName?: string;
  meetLink?: string;
};

function formatTime12(t: string): string {
  const [hRaw, mRaw] = t.split(":");
  const h = parseInt(hRaw, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mRaw} ${period}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

// "YYYYMMDDTHHmmssZ" — UTC, used for DTSTAMP and the Google Calendar template URL
function toUTCStamp(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

// "YYYYMMDDTHHmmss" — floating local time, paired with TZID parameter in .ics
function toLocalStamp(y: number, mo: number, d: number, h: number, mi: number): string {
  return `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(mi)}00`;
}

// .ics escaping per RFC 5545 — backslashes, commas, semicolons, newlines
function ics(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");
}

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

type TimeParts = { y: number; mo: number; d: number; h: number; mi: number };

function buildICS(parts: TimeParts, meetLink: string): string {
  const start = toLocalStamp(parts.y, parts.mo, parts.d, parts.h, parts.mi);
  // Use Date arithmetic so the 30-min end correctly rolls into the next day
  // when the start sits near midnight. Local-tz cancels out because we feed
  // the same getters back into toLocalStamp.
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
  const description = ics("Your complimentary 30-minute business growth audit with Anova Co. — anovaco.ca");
  const location = ics(meetLink || "Google Meet");

  const lines = [
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
  ].filter(Boolean);
  return lines.join("\r\n");
}

// Returns the UTC offset (in minutes) that America/Toronto is from UTC
// at the given UTC moment. May = -240 (EDT), December = -300 (EST).
function torontoOffsetMinutesAt(utcMs: number): number {
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

// Convert a Toronto wall-clock moment to a UTC Date.
function torontoToUTCDate(parts: TimeParts): Date {
  const naive = Date.UTC(parts.y, parts.mo - 1, parts.d, parts.h, parts.mi);
  const offset = torontoOffsetMinutesAt(naive);
  return new Date(naive - offset * 60000);
}

function buildGoogleCalendarUrl(parts: TimeParts, meetLink: string): string {
  const startUtc = torontoToUTCDate(parts);
  const endUtc = new Date(startUtc.getTime() + 30 * 60 * 1000);
  const start = toUTCStamp(startUtc);
  const end = toUTCStamp(endUtc);
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=Anova+Co.+Growth+Audit" +
    `&dates=${start}/${end}` +
    "&details=" +
    encodeURIComponent(
      `Your complimentary 30-minute business growth audit with Anova Co.\n\nJoin here: ${meetLink}`,
    ) +
    `&location=${encodeURIComponent(meetLink || "Google Meet")}`
  );
}

export default function ThankYouPage() {
  const params = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fromParams: Partial<Booking> = {
      date: params.get("date") ?? undefined,
      time: params.get("time") ?? undefined,
      meetLink: params.get("meet") ?? undefined,
    };
    let next: Booking | null = null;
    if (fromParams.date && fromParams.time) {
      next = fromParams as Booking;
    } else if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("anova:booking");
        if (raw) next = JSON.parse(raw);
      } catch {}
    }
    setBooking(next);
  }, [params]);

  const timeParts =
    booking?.date && booking?.time
      ? (() => {
          const d = new Date(booking.date);
          const [h, mi] = booking.time.split(":").map(Number);
          return { y: d.getFullYear(), mo: d.getMonth() + 1, d: d.getDate(), h, mi };
        })()
      : null;

  const startsAt = timeParts
    ? new Date(timeParts.y, timeParts.mo - 1, timeParts.d, timeParts.h, timeParts.mi, 0)
    : null;

  const humanWhen = startsAt
    ? `${format(startsAt, "EEEE, MMMM d")} at ${formatTime12(booking!.time)}`
    : null;

  const downloadIcs = () => {
    if (!timeParts) return;
    const icsContent = buildICS(timeParts, booking?.meetLink || "");
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anova-growth-audit.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const googleCalendarUrl = timeParts
    ? buildGoogleCalendarUrl(timeParts, booking?.meetLink || "")
    : null;

  return (
    <PageTransition>
    <div className="thankyou-page">
      {/* Top nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: "22px 44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(244,241,237,0.75)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <Link href="/" className="nav-logo">
          <AnovaLogo size={28} />
          <span className="nav-logo-text">
            Anova&nbsp;&nbsp;<span className="co">Co.</span>
          </span>
        </Link>
        <Link href="/" className="back-link">
          ← Back to home
        </Link>
      </nav>

      <div className="ty-shell">
        <div className="ty-check" aria-hidden="true">
          <svg viewBox="0 0 46 46">
            <polyline className="check-path" points="12 24 20 32 34 16" />
          </svg>
        </div>
        <span className="eyebrow on-light">Audit Request Received</span>
        <h1 className="ty-title">
          You&apos;re on our radar.
          <br />
          Expect to <em>hear from us.</em>
        </h1>
        <p className="ty-sub">
          We&apos;ve confirmed your complimentary 30-minute business growth audit. A calendar
          invite and confirmation email are on their way.
        </p>

        {humanWhen && (
          <div className="ty-meet">
            <div className="ty-meet-label">Your audit</div>
            <div className="ty-meet-when">{humanWhen}</div>
            {booking?.meetLink ? (
              <a href={booking.meetLink} className="ty-meet-link" target="_blank" rel="noreferrer">
                {booking.meetLink}
              </a>
            ) : (
              <div className="ty-meet-link" style={{ color: "var(--muted)" }}>
                Google Meet link arriving by email
              </div>
            )}
          </div>
        )}

        <div className="ty-steps">
          <div className="ty-step">
            <span className="ty-step-num">01</span>
            <div className="ty-step-content">
              <h3 className="ty-step-title">Check your inbox.</h3>
              <p className="ty-step-body">
                A confirmation is on its way with everything you need before the call.
              </p>
            </div>
          </div>
          <div className="ty-step">
            <span className="ty-step-num">02</span>
            <div className="ty-step-content">
              <h3 className="ty-step-title">We audit your presence.</h3>
              <p className="ty-step-body">
                We come fully prepared — no generic questions, no wasted minutes on the call.
              </p>
            </div>
          </div>
          <div className="ty-step">
            <span className="ty-step-num">03</span>
            <div className="ty-step-content">
              <h3 className="ty-step-title">Your strategy call.</h3>
              <p className="ty-step-body">
                A clear path to more customers, mapped specifically to your business and market.
              </p>
            </div>
          </div>
        </div>

        <div className="ty-ctas">
          {timeParts && (
            <button type="button" className="btn btn-gold" onClick={downloadIcs}>
              Add to Calendar <span className="arrow">↓</span>
            </button>
          )}
          {googleCalendarUrl && (
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost on-light"
              style={{ borderColor: "#D4AF37", color: "#1B2B21", background: "transparent" }}
            >
              Add to Google Calendar <span className="arrow">→</span>
            </a>
          )}
          <Link href="/" className="btn btn-ghost on-light">
            Back to Home
          </Link>
        </div>
      </div>

      <footer className="site-footer" style={{ marginTop: "auto" }}>
        <div className="section-container">
          <div className="foot">
            <div className="foot-left">
              <AnovaLogo variant="ghost" size={20} />
              <span className="foot-logo-txt">
                Anova <span className="co">Co.</span>
              </span>
            </div>
            <div className="foot-center">
              © MMXXVI  ·  Anova Co.  ·  Toronto, Canada
            </div>
            <div className="foot-right">
              <Link href="/" className="foot-link">
                Home
              </Link>
              <Link href="/contact" className="foot-link">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}
