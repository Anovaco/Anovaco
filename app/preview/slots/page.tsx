"use client";

// Dev preview of the slot picker with a known booked slot — used for
// screenshots and visual QA. Mirrors the layout of Step 5 on /contact.

import { useEffect, useState } from "react";

function slotsForDate(date: Date): string[] {
  const d = date.getDay();
  if (d === 0) return [];
  const [startH, endH] = d === 6 ? [10, 14] : [9, 17];
  const out: string[] = [];
  for (let h = startH; h < endH; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}
function formatTime12(t: string): string {
  const [hRaw, mRaw] = t.split(":");
  const h = parseInt(hRaw, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mRaw} ${period}`;
}

export default function SlotsPreview() {
  // Friday May 22 2026 — has a known 10:00 booking.
  const date = new Date(2026, 4, 22);
  const slots = slotsForDate(date);

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/availability?date=2026-05-22", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { bookedSlots?: string[] }) => {
        setBookedSlots(Array.isArray(data.bookedSlots) ? data.bookedSlots : []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--canvas)", minHeight: "100vh", padding: "60px 32px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--muted)",
            margin: "0 0 8px",
          }}
        >
          Slot picker — preview
        </p>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 32,
            color: "var(--green)",
            margin: "0 0 28px",
          }}
        >
          Friday, May 22 2026
        </h1>

        <div className="time-panel" style={{ background: "#fff", padding: 24, border: "1px solid var(--rule)" }}>
          <div className="time-panel-head">Friday, May 22</div>
          <div className="time-list">
            {slots.map((t) => {
              const isBooked = bookedSlots.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  className={`time-btn ${selected === t ? "selected" : ""} ${isBooked ? "is-booked" : ""}`}
                  onClick={() => !isBooked && setSelected(t)}
                  disabled={isBooked}
                  aria-disabled={isBooked}
                  title={isBooked ? "Already booked" : undefined}
                >
                  {formatTime12(t)}
                  {isBooked && <span className="time-btn-tag">Booked</span>}
                </button>
              );
            })}
          </div>
          {loading && <div className="time-loading">Checking availability…</div>}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: "var(--muted)" }}>
          Booked slots returned from /api/availability:{" "}
          <strong>{bookedSlots.length ? bookedSlots.join(", ") : "none"}</strong>
        </p>
      </div>
    </div>
  );
}
