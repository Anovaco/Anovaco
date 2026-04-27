"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, addMinutes } from "date-fns";
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

function toICSTime(d: Date): string {
  // YYYYMMDDTHHmmssZ in UTC
  const pad = (n: number) => String(n).padStart(2, "0");
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

function buildICS(start: Date, meetLink: string): string {
  const end = addMinutes(start, 30);
  const now = new Date();
  const uid = `anova-${now.getTime()}@anovaco.ca`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anova Co.//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSTime(now)}`,
    `DTSTART:${toICSTime(start)}`,
    `DTEND:${toICSTime(end)}`,
    "SUMMARY:Anova Co. Growth Audit",
    "DESCRIPTION:Your complimentary 30-minute business growth audit with Anova Co.",
    meetLink ? `LOCATION:${meetLink}` : "LOCATION:Google Meet",
    meetLink ? `URL:${meetLink}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
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

  const startsAt =
    booking?.date && booking?.time
      ? (() => {
          const d = new Date(booking.date);
          const [h, m] = booking.time.split(":").map(Number);
          // Build local-time date preserving calendar day
          return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0);
        })()
      : null;

  const humanWhen = startsAt
    ? `${format(startsAt, "EEEE, MMMM d")} at ${formatTime12(booking!.time)}`
    : null;

  const downloadIcs = () => {
    if (!startsAt) return;
    const ics = buildICS(startsAt, booking?.meetLink || "");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anova-growth-audit.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          {startsAt && (
            <button type="button" className="btn btn-gold" onClick={downloadIcs}>
              Add to Calendar <span className="arrow">↓</span>
            </button>
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
