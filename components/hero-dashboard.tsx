"use client";

export function HeroDashboard() {
  return (
    <aside className="hero-dash" aria-label="Live client dashboard">
      <div className="hero-dash-inner">
        {/* WIDGET 1 — Google Reviews */}
        <div className="hd-widget">
          <div className="hd-label">Google Reviews</div>
          <div className="hd-row">
            <div className="hd-num">4.9</div>
            <div className="hd-stars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 24 24" width="14" height="14">
                  <path
                    fill="#D4AF37"
                    d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className="hd-sub">↑ 23 new reviews this month</div>
          <div className="hd-spark" aria-hidden="true">
            {[28, 36, 32, 48, 60, 78].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* WIDGET 2 — Monthly Visitors */}
        <div className="hd-widget">
          <div className="hd-label">Monthly Visitors</div>
          <div className="hd-num">2,840</div>
          <div className="hd-sub hd-sub-up">↑ 74% vs last month</div>
          <svg
            className="hd-line"
            viewBox="0 0 240 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="hdFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(212,175,55,0.18)" />
                <stop offset="100%" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 50 L40 44 L80 46 L120 34 L160 28 L200 16 L240 8 L240 60 L0 60 Z"
              fill="url(#hdFill)"
            />
            <path
              d="M0 50 L40 44 L80 46 L120 34 L160 28 L200 16 L240 8"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="hd-axis">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* WIDGET 3 — AI Automation */}
        <div className="hd-widget">
          <div className="hd-label">Leads Captured (AI)</div>
          <div className="hd-num">147</div>
          <div className="hd-sub">This month · 24/7 automated</div>
          <div className="hd-dots" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className={i >= 2 ? "on" : ""} />
            ))}
          </div>
        </div>

        <div className="hd-foot">
          <span className="hd-pulse" aria-hidden="true" />
          <span className="hd-foot-text">Live client dashboard</span>
        </div>
      </div>
    </aside>
  );
}
