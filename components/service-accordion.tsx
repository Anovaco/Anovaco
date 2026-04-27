"use client";

import { useState } from "react";
import Link from "next/link";

type Kind = "ai" | "web" | "ads" | "seo" | "social" | "rep";

type Service = {
  id: Kind;
  num: string;
  name: string;
  hook: string;
  paragraphs: string[];
};

const SERVICES: Service[] = [
  {
    id: "ai",
    num: "01",
    name: "AI Automation",
    hook: "While you're working, your AI handles everything.",
    paragraphs: [
      "Most businesses lose revenue every day because humans can't be everywhere at once. Calls go unanswered. Messages sit unread. Leads go cold because no one followed up fast enough.",
      "Custom AI Systems combines three layers of intelligence into one unified system — working around the clock like a member of staff who never sleeps, never takes a day off, and never misses a lead.",
      "Voice AI answers every call instantly — day, night, weekend, holiday. It books appointments directly into your calendar, qualifies leads, and handles FAQs so you never have to repeat yourself again. No voicemail. No missed calls. No lost revenue.",
      "Chat AI works across every channel your customers use — your website, Facebook, Instagram, WhatsApp, and SMS. Responding instantly, booking appointments, and nurturing leads automatically from one unified system.",
      "AI Agents work behind the scenes — following up with every lead, sending review requests after every completed job, re-engaging cold leads, and sending appointment reminders that eliminate no-shows.",
      "Every system is fully bespoke — built around how your business runs. Choose your involvement: self-managed, monitored monthly by Anova Co., or fully hands-off.",
    ],
  },
  {
    id: "web",
    num: "02",
    name: "Website Design & Build",
    hook: "Your most important first impression, built to convert.",
    paragraphs: [
      "When a potential customer finds your business online, your website tells them everything in under three seconds. An outdated design, a slow mobile experience, or a page that doesn't clearly explain what you do — any of these costs you customers before you even know they were there.",
      "Whether you have no website, one that hasn't been touched in years, one that gets no traffic, or one that doesn't convert — we build something that does all three: looks premium and builds instant trust, ranks on Google so the right people find you, and turns visitors into paying customers.",
      "Every website includes a full booking or contact system, is built mobile-first, and comes with SEO foundations built in from day one. Features, design, and timeline are built entirely around what your business needs. Nothing templated. Nothing generic.",
    ],
  },
  {
    id: "ads",
    num: "03",
    name: "Google & Meta Ads",
    hook: "The right people, at the right moment, every time.",
    paragraphs: [
      "Most local businesses that have tried advertising either boosted a post on Facebook and got nothing, or set up Google Ads without knowing what they were doing and burned through budget with no results.",
      "Paid advertising done wrong is expensive. Done right, it's the fastest way to put your business in front of people who are actively looking for exactly what you offer — right now, in your city.",
      "We run fully managed Google Search Ads, Meta Ads across Facebook and Instagram, and Google Maps Ads that put you at the top of local search results. We handle everything — strategy, creative, targeting, setup, weekly optimisation, and monthly reporting in plain English so you always know what your money is doing.",
      "You set the budget. We make every dollar work as hard as it possibly can toward your specific goal — more calls, more bookings, more foot traffic, or more sales.",
    ],
  },
  {
    id: "seo",
    num: "04",
    name: "Local SEO",
    hook: "Page one. Right where your customers are looking.",
    paragraphs: [
      "Right now someone in your city is searching for exactly what you offer. If your business isn't showing up on page one — or in the top three map results — that customer is calling your competitor instead.",
      "Most local businesses are invisible on Google because their Google Business Profile is incomplete, they're not listed on the directories Google uses to verify local businesses, their website isn't optimised for local searches, or they don't have enough reviews to compete.",
      "We fix all of it. Google Business Profile setup and optimisation, directory listings across Yelp, Yellow Pages, Apple Maps and more, on-page SEO for local keywords, local backlink and citation building, and a review strategy that builds your ranking consistently.",
      "The outcome: page one rankings for your main service and city, a spot in the Google Maps 3-pack, and a steady stream of organic calls and website visits without paying for ads.",
    ],
  },
  {
    id: "social",
    num: "05",
    name: "Social Media Management",
    hook: "Consistent presence. Real growth. Zero effort from you.",
    paragraphs: [
      "Every local business knows they should be on social media. Almost none of them are doing it consistently. Either accounts don't exist, they were started and abandoned, posts go up occasionally with no strategy, or content is being created but getting no traction.",
      "Social media managed properly builds awareness with people who haven't found you yet, keeps you front of mind with people who have, and drives real customers through the door or to your website.",
      "We manage every platform your customers use — Instagram, Facebook, TikTok, LinkedIn, or any combination that fits your business. We create everything: graphics designed from scratch, captions written in your brand voice, Reels and TikToks shot and edited, or content built from what you already have. We post everything, engage with your comments and DMs, and run a strategy built around your brand, audience, and growth goals.",
      "The outcome is all three — awareness so locals know who you are, engagement that builds a genuine community, and conversions that turn followers into customers.",
    ],
  },
  {
    id: "rep",
    num: "06",
    name: "Reputation Management",
    hook: "Your reputation is your most valuable asset. We protect it.",
    paragraphs: [
      "Before almost anyone spends money with a local business they've never used, they read the reviews. Your star rating and review count can be the difference between a new customer calling you or calling someone else.",
      "Most businesses have one of these problems: too few reviews to look established, bad reviews they don't know how to handle, good reviews but no system to get more, or they never respond and look disengaged.",
      "We fix your reputation from every angle. Automated review requests go out after every job or visit. Every review — good or bad — gets a professional response. Negative reviews are addressed strategically. We monitor mentions of your business online and build your rating across Google, Yelp, Facebook, and every platform your customers use.",
      "The outcome: a higher star rating that makes new customers choose you, enough reviews to dominate your category, and the trust that comes from a business that clearly takes care of the people it serves.",
    ],
  },
];

export function ServiceAccordion() {
  const [openId, setOpenId] = useState<Kind | null>(null);

  return (
    <div className="acc">
      {SERVICES.map((s) => {
        const open = openId === s.id;
        return (
          <div key={s.id} className={`acc-row${open ? " is-open" : ""}`}>
            <button
              type="button"
              className="acc-head"
              aria-expanded={open}
              aria-controls={`acc-panel-${s.id}`}
              onClick={() => setOpenId(open ? null : s.id)}
            >
              <span className="acc-num">{s.num}</span>
              <span className="acc-titles">
                <span className="acc-name">{s.name}</span>
                <span className="acc-hook">{s.hook}</span>
              </span>
              <span className="acc-toggle" aria-hidden="true">
                <span className="acc-bar acc-bar-h" />
                <span className="acc-bar acc-bar-v" />
              </span>
            </button>
            <div
              id={`acc-panel-${s.id}`}
              role="region"
              className="acc-panel"
              aria-hidden={!open}
            >
              <div className="acc-panel-inner">
                <div className="acc-graphic">
                  <div className="service-preview" aria-hidden="true">
                    <Preview kind={s.id} />
                  </div>
                </div>
                <div className="acc-body">
                  <span className="acc-body-label">{s.name}</span>
                  <div className="acc-body-text">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <Link href="/contact" className="acc-link">
                    Begin with a complimentary audit <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────── Preview graphics ────────── */

function Preview({ kind }: { kind: Kind }) {
  switch (kind) {
    case "ai":
      return <PreviewAI />;
    case "web":
      return <PreviewWeb />;
    case "ads":
      return <PreviewAds />;
    case "seo":
      return <PreviewSeo />;
    case "social":
      return <PreviewSocial />;
    case "rep":
      return <PreviewRep />;
  }
}

function PreviewAI() {
  return (
    <div className="prv prv-ai">
      <div className="prv-head">
        <span className="prv-pulse" />
        <span>AI Assistant · Online</span>
      </div>
      <div className="prv-chat">
        <div className="prv-bubble prv-bubble-user">Do you have availability tomorrow?</div>
        <div className="prv-bubble prv-bubble-ai">Yes! I have 2pm and 4pm open. Which works best?</div>
        <div className="prv-bubble prv-bubble-user">2pm works perfectly 👍</div>
      </div>
      <div className="prv-input">Type a message...</div>
    </div>
  );
}

function PreviewWeb() {
  return (
    <div className="prv prv-web">
      <div className="prv-chrome">
        <span className="prv-dot" style={{ background: "#FF5F57" }} />
        <span className="prv-dot" style={{ background: "#FEBC2E" }} />
        <span className="prv-dot" style={{ background: "#28C840" }} />
        <span className="prv-url">anovaco.ca</span>
      </div>
      <div className="prv-nav">
        <span>ANOVA</span>
        <span>·</span>
        <span>CO.</span>
      </div>
      <div className="prv-hero">
        <div className="prv-h1">Growth,</div>
        <div className="prv-h1-it">engineered.</div>
        <div className="prv-cta">BOOK AUDIT</div>
      </div>
    </div>
  );
}

function PreviewAds() {
  return (
    <div className="prv prv-ads">
      <div className="prv-ads-head">Campaign Performance</div>
      <Bar label="Impressions" value="12,450" pct={80} />
      <Bar label="Clicks" value="847" pct={40} />
      <Bar label="Conversions" value="63" pct={25} />
      <div className="prv-roi">
        <span>ROI</span>
        <span className="prv-roi-num">+340%</span>
        <svg viewBox="0 0 60 16" className="prv-roi-line" preserveAspectRatio="none">
          <path d="M0 14 L12 11 L24 12 L36 6 L48 4 L60 1" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );
}

function Bar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="prv-bar">
      <div className="prv-bar-row">
        <span>{label}</span>
        <span>· {value}</span>
      </div>
      <div className="prv-bar-track">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PreviewSeo() {
  return (
    <div className="prv prv-seo">
      <div className="prv-search">best [service] toronto</div>
      <div className="prv-seo-grid">
        <div className="prv-results">
          <div className="prv-result is-top">
            <span className="prv-rank">#1</span>
            <span className="prv-result-name">Anova Co.</span>
            <span className="prv-badge">★ 4.9</span>
          </div>
          <div className="prv-result">
            <span className="prv-rank">#2</span>
            <span className="prv-result-name">Competitor A</span>
          </div>
          <div className="prv-result">
            <span className="prv-rank">#3</span>
            <span className="prv-result-name">Competitor B</span>
          </div>
        </div>
        <div className="prv-map">
          <span className="prv-pin" />
        </div>
      </div>
    </div>
  );
}

function PreviewSocial() {
  const tones = ["a", "b", "c", "a", "b", "c"];
  return (
    <div className="prv prv-social">
      <div className="prv-grid">
        {tones.map((t, i) => (
          <div key={i} className={`prv-cell prv-cell-${t}`}>
            {i === 1 ? <span className="prv-cell-tag">New Post</span> : null}
          </div>
        ))}
      </div>
      <div className="prv-pills">
        <span>↑ 3.2k followers</span>
        <span>↑ 847 reach</span>
      </div>
    </div>
  );
}

function PreviewRep() {
  return (
    <div className="prv prv-rep">
      <div className="prv-rep-head">
        <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <text x="12" y="16" fontSize="11" fontFamily="serif" textAnchor="middle" fill="#D4AF37">G</text>
        </svg>
        <span>Google Reviews</span>
      </div>
      <div className="prv-rep-score">
        <span className="prv-rep-num">4.9</span>
        <div className="prv-rep-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" width="9" height="9">
              <path fill="#D4AF37" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="prv-rep-list">
        {["Sarah M.", "James T.", "Aisha O."].map((n, i) => (
          <div key={i} className="prv-rep-item">
            <span className="prv-avatar" />
            <div className="prv-rep-meta">
              <span className="prv-rep-name">{n}</span>
              <span className="prv-rep-stars sm">
                {[0, 1, 2, 3, 4].map((j) => (
                  <svg key={j} viewBox="0 0 24 24" width="6" height="6">
                    <path fill="#D4AF37" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="prv-rep-foot">67 reviews · +23 this month</div>
    </div>
  );
}
