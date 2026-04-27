"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { HeroDashboard } from "@/components/hero-dashboard";
import { ServiceAccordion } from "@/components/service-accordion";
import { HomeOverlays } from "@/components/home-overlays";
import { PageTransition } from "@/components/page-transition";
import { TrustBar } from "@/components/trust-bar";

export default function HomePage() {
  // Entrance animation: gate on sessionStorage + reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("anova:home-loaded");
    const root = document.documentElement;
    if (reduced || seen) {
      root.classList.add("is-loaded", "skip-intro");
    } else {
      const id = requestAnimationFrame(() => {
        root.classList.add("is-loaded");
        sessionStorage.setItem("anova:home-loaded", "1");
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return (
    <PageTransition>
      <SiteNav />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="hero" className="hero-grain">
        <div className="hero-top">
          <span className="hero-pill intro-pill">
            <span className="dot" />
            AI-Powered Growth Agency — Toronto
          </span>
          <div className="hero-meta">Toronto, Canada</div>
        </div>

        <div className="hero-grid">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="hero-title-line intro-t1">Growth,</span>
              <span className="hero-title-line intro-t2">
                <em>
                  engineered<span className="gold">.</span>
                </em>
              </span>
            </h1>
            <p className="hero-body intro-body">
              Anova Co. helps local businesses dominate online through smart digital strategy,
              AI automation, and hands-on execution that drives real revenue.
            </p>
            <div className="hero-ctas intro-ctas">
              <Link href="/contact" className="btn btn-gold">
                Book a Free Audit <span className="arrow">→</span>
              </Link>
              <Link href="#services" className="btn btn-underline">
                See what we do
              </Link>
            </div>
          </div>
          <div className="hero-right intro-right">
            <HeroDashboard />
          </div>
        </div>

        <HeroStats />
      </section>

      {/* ═══════════════════ TICKER ═══════════════════ */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((k) => (
            <div key={k} className="ticker-item">
              <span className="ticker-text">AI Automation</span>
              <span className="ticker-diamond" />
              <span className="ticker-text">Website Design</span>
              <span className="ticker-diamond" />
              <span className="ticker-text">Local SEO</span>
              <span className="ticker-diamond" />
              <span className="ticker-text">Google Ads</span>
              <span className="ticker-diamond" />
              <span className="ticker-text">Email Marketing</span>
              <span className="ticker-diamond" />
              <span className="ticker-text">Reputation Management</span>
              <span className="ticker-diamond" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════ TRUST BAR ═══════════════════ */}
      <TrustBar />

      {/* ═══════════════════ PROBLEM ═══════════════════ */}
      <section id="problem" className="section-pad">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">01</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">The Problem</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Most local businesses
                <br />
                are <em className="italic" style={{ color: "var(--gold)" }}>invisible online.</em>
              </h2>
            </div>
          </div>

          <div className="problem-grid">
            <div className="pain-list">
              <PainItem
                icon={
                  <>
                    <circle cx="11" cy="11" r="6" />
                    <line x1="15.5" y1="15.5" x2="20" y2="20" />
                  </>
                }
                title="Customers can't find you."
                body="Your competitors rank on Google while your business buries itself on page three. Every missed search is a paying customer walking into someone else's shop."
              />
              <PainItem
                icon={
                  <>
                    <rect x="4" y="5" width="16" height="14" rx="1" />
                    <line x1="4" y1="10" x2="20" y2="10" />
                    <circle cx="8" cy="14.5" r="0.8" fill="currentColor" stroke="none" />
                  </>
                }
                title="Your website doesn't convert."
                body="Slow load times, outdated design, and unclear messaging turn visitors away within seconds. Traffic means nothing without revenue attached to it."
              />
              <PainItem
                icon={
                  <>
                    <path d="M4 17l5-5 4 4 7-7" />
                    <polyline points="16 9 20 9 20 13" />
                  </>
                }
                title="Ads burn cash with no ROI."
                body="You're spending on Google and Meta without clear tracking, clear strategy, or clear returns. Every dollar should be accounted for — and too often, it isn't."
              />
              <PainItem
                icon={
                  <>
                    <path d="M4 11a8 8 0 1 1 16 0v5l-2 2H6l-2-2z" />
                    <line x1="9" y1="19" x2="15" y2="19" />
                  </>
                }
                title="Leads slip through the cracks."
                body="Inquiries go unanswered after hours. Reviews aren't being requested. Follow-ups never happen. Opportunity leaks from every corner of your business."
              />
            </div>

            <aside className="problem-card">
              <div className="problem-card-eyebrow">Our Purpose</div>
              <h3 className="problem-card-title">
                That&apos;s exactly what
                <br />
                Anova Co. was built to solve.
              </h3>
              <p className="problem-card-body">
                We build the online presence, automation, and attention your business needs to be
                found, chosen, and remembered — with a level of craft usually reserved for
                enterprise brands.
              </p>
              <div className="problem-card-sig">
                <div className="problem-card-sig-left">— Growth, engineered.</div>
                <div className="problem-card-sig-right">Toronto / MMXXVI</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section id="services" className="section-pad">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">02</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">What We Do</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Every service your business
                <br />
                needs to <em className="italic" style={{ color: "var(--gold)" }}>dominate locally.</em>
              </h2>
            </div>
          </div>

          <div className="services-intro">
            <p className="body-lg" style={{ maxWidth: "44ch" }}>
              Six disciplines. One agency. Every engagement designed around your market, your
              customers, and the specific shape of your growth ambition.
            </p>
            <p className="label-tiny" style={{ textAlign: "right" }}>
              Six practices / One standard
            </p>
          </div>

          <ServiceAccordion />
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section id="process" className="section-pad">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">03</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">How It Works</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Simple process.
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>Real results.</em>
              </h2>
            </div>
          </div>

          <div className="process-intro">
            <p className="body-lg" style={{ maxWidth: "52ch" }}>
              Every engagement begins the same way — a thorough audit, a tailored strategy, full
              execution, and monthly refinement. Four movements. No templates.
            </p>
            <p className="label-tiny" style={{ textAlign: "right" }}>
              Four stages / One outcome
            </p>
          </div>

          <div className="process-timeline">
            {processSteps.map((s) => (
              <div key={s.num} className="process-step">
                <div className="process-num">
                  {s.num}
                  <span className="dot">.</span>
                </div>
                <div className="process-content">
                  <h3 className="process-title" dangerouslySetInnerHTML={{ __html: s.title }} />
                  <p className="process-body">{s.body}</p>
                  <span className="process-tag">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ INVESTMENT ═══════════════════ */}
      <section id="investment" className="section-pad-lg grain grain-dark">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num" style={{ color: "var(--gold)" }}>
              04
            </div>
            <div className="section-title-group">
              <span className="eyebrow">Investment</span>
              <h2 className="display-lg">
                Every engagement is
                <br />
                <em className="italic">built around you.</em>
              </h2>
            </div>
          </div>

          <div className="invest-intro">
            <p className="invest-intro-body">
              We don&apos;t do packages. After your free audit, we design a bespoke growth strategy
              priced specifically for your business, your market, and your goals. Nothing templated,
              nothing inherited from someone else&apos;s quote.
            </p>
            <p
              className="label-tiny"
              style={{ textAlign: "right", color: "rgba(244,241,237,0.4)" }}
            >
              No tiers / No surprises
            </p>
          </div>

          <div className="invest-blocks">
            <InvestBlock
              num="1"
              title="The Audit."
              body="Every engagement begins with a complimentary 30-minute audit. We review your entire online presence before we ever discuss investment."
            />
            <InvestBlock
              num="2"
              title="The Strategy."
              body="We build a custom growth plan tailored to your industry, your competitors, and your specific goals. Nothing templated, nothing inherited."
            />
            <InvestBlock
              num="3"
              title="The Partnership."
              body="Ongoing execution, reporting, and refinement. You focus on running your business. We focus on growing it — quietly, consistently, demonstrably."
            />
          </div>

          <div className="invest-cta-wrap">
            <Link href="/contact" className="btn btn-gold">
              Begin With a Free Audit <span className="arrow">→</span>
            </Link>
            <p className="invest-cta-note">
              No commitment required  ·  No packages  ·  No surprises
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="testimonials" className="section-pad">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">05</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">Results</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Businesses that
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>chose to grow.</em>
              </h2>
            </div>
          </div>

          <figure className="pull-quote">
            <span className="pull-quote-rule" aria-hidden="true" />
            <blockquote className="pull-quote-text">
              Every engagement begins with understanding your business deeply.
              Our clients don&apos;t get templates — they get strategies built
              specifically for their market, their customers, and their goals.
            </blockquote>
            <span className="pull-quote-rule" aria-hidden="true" />
            <figcaption className="pull-quote-cite">— Anova Co.</figcaption>
          </figure>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section id="finalCta">
        <div className="section-container">
          <div className="cta-inner">
            <div className="cta-rule" />
            <span className="eyebrow">The Invitation</span>
            <h2 className="cta-title">
              Ready to <em>grow?</em>
            </h2>
            <p className="cta-sub">
              Book a complimentary 30-minute audit. We&apos;ll review your entire online presence
              and show you exactly what we&apos;d do.
            </p>
            <Link href="/contact" className="btn btn-gold" style={{ marginTop: 12 }}>
              Book Your Free Audit <span className="arrow">→</span>
            </Link>
            <p className="cta-note">
              <span>No commitment required</span>
              <span className="sep" />
              <span>Free 30-min call</span>
              <span className="sep" />
              <span>Results in 30 days</span>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
      <HomeOverlays />
    </PageTransition>
  );
}

/* ─── Hero stats with scroll-triggered count up ─── */

function HeroStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [n3, setN3] = useState(0);
  const [n4Visible, setN4Visible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN1(3);
      setN2(40);
      setN3(30);
      setN4Visible(true);
      return;
    }
    const animateNumber = (
      target: number,
      duration: number,
      setter: (v: number) => void,
      delay: number
    ) => {
      const start = performance.now() + delay;
      let raf = 0;
      const step = (now: number) => {
        if (now < start) {
          raf = requestAnimationFrame(step);
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setter(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            animateNumber(3, 1200, setN1, 0);
            animateNumber(40, 1400, setN2, 150);
            animateNumber(30, 1200, setN3, 300);
            setTimeout(() => setN4Visible(true), 450);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: [0.5] }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hero-stats intro-stats" ref={ref}>
      <div className="hero-stat">
        <div className="hero-stat-num">
          {n1}
          <em>×</em>
        </div>
        <div className="hero-stat-label">Online reach</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">
          +{n2}
          <em>%</em>
        </div>
        <div className="hero-stat-label">Inbound leads</div>
      </div>
      <div className="hero-stat">
        <div className="hero-stat-num">
          {n3}
          <em>d</em>
        </div>
        <div className="hero-stat-label">Results</div>
      </div>
      <div
        className="hero-stat"
        style={{ opacity: n4Visible ? 1 : 0, transition: "opacity 600ms ease" }}
      >
        <div className="hero-stat-num">
          24<em>/</em>7
        </div>
        <div className="hero-stat-label">AI automation</div>
      </div>
    </div>
  );
}

/* ─── Inline subcomponents ─── */

function PainItem({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="pain-item">
      <div className="pain-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {icon}
        </svg>
      </div>
      <div>
        <h3 className="pain-title">{title}</h3>
        <p className="pain-desc">{body}</p>
      </div>
    </div>
  );
}

function InvestBlock({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="invest-block">
      <div className="invest-num">{num}</div>
      <h3 className="invest-title">{title}</h3>
      <p className="invest-body">{body}</p>
    </div>
  );
}

const processSteps = [
  {
    num: "01",
    title: "Free <em>Audit</em>",
    body: "We analyse your entire online presence — website, SEO, reviews, ads, social — and identify exactly where you are losing customers today.",
    tag: "30-minute consultation",
  },
  {
    num: "02",
    title: "Custom <em>Strategy</em>",
    body: "A tailored growth plan specific to your business, industry, and local market — mapped against the exact shape of your competition.",
    tag: "Bespoke deliverable",
  },
  {
    num: "03",
    title: "We <em>Execute</em>",
    body: "Our team handles everything — design, build, campaigns, automation, content. Zero technical knowledge required on your end.",
    tag: "End-to-end delivery",
  },
  {
    num: "04",
    title: "Track <em>&amp; Scale</em>",
    body: "Monthly reporting. We double down on what works, retire what doesn't, and continuously refine the system as your business grows.",
    tag: "Always optimising",
  },
];
