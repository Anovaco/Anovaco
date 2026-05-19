import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FinalCta } from "@/components/final-cta";
import { ServiceIndustries } from "@/components/service-industries";
import { ServiceFaq } from "@/components/service-faq";
import type { ServiceDefinition } from "@/lib/services";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function ServicePage({ service }: { service: ServiceDefinition }) {
  // Services that supply the richer data sets opt into the redesigned card grid,
  // the visual-anchor process steps, and the additional sections.
  const enhanced = Boolean(service.features);

  // Dynamic section numbering. I / II / III are always present; the rest depend
  // on which data the service ships with.
  let n = 3; // 1: What's Included, 2: How It Works, 3: What You Can Expect
  const featuresNum = service.features ? ROMAN[n++] : null;
  const industriesNum = service.industryApplications ? ROMAN[n++] : null;
  const faqsNum = service.faqs ? ROMAN[n++] : null;
  const audienceNum = ROMAN[n];

  return (
    <>
      {/* SiteNav is intentionally left to its scroll-based detection.
          The hero below carries id="hero" so the nav reads as on-dark at the
          top of the page and only flips to on-light after the hero scrolls past. */}
      <SiteNav />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section id="hero" className="svc-hero hero-grain">
        <div className="svc-hero-inner">
          <div className="svc-hero-num">{service.num}</div>
          <div>
            <span className="svc-hero-eyebrow">Service / {service.num}</span>
            <h1 className="svc-hero-title">{service.name}</h1>
            <p className="svc-hero-sub">{service.subtitle}</p>
            <p className="svc-hero-desc">{service.description}</p>
            <div className="svc-hero-ctas">
              <Link href="/contact" className="btn btn-gold">
                Book a Free Audit <span className="arrow">→</span>
              </Link>
              <Link href="/#services" className="btn btn-underline">
                All services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION I — WHAT'S INCLUDED ────────────────────────── */}
      <section className="section-pad svc-included">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">I</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">What&apos;s Included</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                The full scope of
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>
                  the engagement.
                </em>
              </h2>
            </div>
          </div>

          {enhanced ? (
            <div className="svc-included-cards">
              {(
                service.includedDetails ??
                service.included.map((title) => ({ title, body: "" }))
              ).map((card, i) => (
                <article key={card.title} className="svc-included-card">
                  <span className="svc-included-card-rule" aria-hidden="true" />
                  <span className="svc-included-card-num">
                    Deliverable&nbsp;&nbsp;·&nbsp;&nbsp;
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="svc-included-card-title">{card.title}</h3>
                  {card.body && (
                    <p className="svc-included-card-body">{card.body}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="svc-included-grid">
              {service.included.map((item, i) => (
                <div key={item} className="svc-included-item">
                  <span className="svc-included-label">
                    Deliverable&nbsp;&nbsp;·&nbsp;&nbsp;
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="svc-included-body">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION II — HOW IT WORKS (timeline) ───────────────── */}
      <section
        className={`section-pad svc-process${enhanced ? " svc-process--anchored" : ""}`}
      >
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">II</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">How It Works</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Four movements.
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>
                  One outcome.
                </em>
              </h2>
            </div>
          </div>

          <ol className="svc-process-timeline">
            {service.processSteps.map((step, i) => {
              const idx = String(i + 1).padStart(2, "0");
              return (
                <li key={step.title} className="svc-process-step">
                  {enhanced && (
                    <span
                      className="svc-process-watermark"
                      aria-hidden="true"
                    >
                      {idx}
                    </span>
                  )}
                  <span className="svc-process-marker" aria-hidden="true">
                    {idx}
                  </span>
                  <div className="svc-process-content">
                    {enhanced && (
                      <span className="svc-process-rule" aria-hidden="true" />
                    )}
                    <h3 className="svc-process-title">{step.title}</h3>
                    <p className="svc-process-body">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── SECTION III — WHAT YOU CAN EXPECT ──────────────────── */}
      <section className="section-pad svc-outcomes grain grain-dark">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num" style={{ color: "var(--gold)" }}>
              III
            </div>
            <div className="section-title-group">
              <span className="eyebrow">What You Can Expect</span>
              <h2 className="display-lg" style={{ color: "var(--canvas)" }}>
                The shape of
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>
                  the result.
                </em>
              </h2>
            </div>
          </div>

          <div className="svc-outcomes-grid">
            {service.outcomes.map((o, i) => (
              <article key={o.title} className="svc-outcome-card">
                <span className="svc-outcome-rule" aria-hidden="true" />
                <span className="svc-outcome-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="svc-outcome-title">&ldquo;{o.title}&rdquo;</h3>
                <p className="svc-outcome-body">{o.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION IV — ALTERNATING FEATURES ──────────────────── */}
      {service.features && featuresNum && (
        <section className="section-pad svc-features">
          <div className="section-container">
            <div className="section-header">
              <div className="section-num">{featuresNum}</div>
              <div className="section-title-group">
                <span className="eyebrow on-light">In Practice</span>
                <h2 className="display-lg" style={{ color: "var(--green)" }}>
                  What the system
                  <br />
                  <em className="italic" style={{ color: "var(--gold)" }}>
                    actually does.
                  </em>
                </h2>
              </div>
            </div>

            <div className="svc-feature-list">
              {service.features.map((f, i) => (
                <div
                  key={f.title}
                  className="svc-feature-block"
                  data-flip={i % 2 === 1 ? "true" : "false"}
                >
                  <aside className="svc-feature-panel svc-panel svc-panel--dark hero-grain">
                    <span className="svc-panel-label">{f.panelLabel}</span>
                    <span className="svc-panel-metric">{f.panelMetric}</span>
                    <span className="svc-panel-rule" aria-hidden="true" />
                    <ul className="svc-panel-rows">
                      {f.panelRows.map((r) => (
                        <li key={r} className="svc-panel-row">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </aside>
                  <div className="svc-feature-content">
                    <span className="svc-feature-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="svc-feature-title">{f.title}</h3>
                    <p className="svc-feature-body">{f.body1}</p>
                    <p className="svc-feature-body">{f.body2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION V — INDUSTRY APPLICATIONS (tabs/select) ───── */}
      {service.industryApplications && industriesNum && (
        <section className="section-pad svc-industries grain grain-dark">
          <div className="section-container">
            <div className="section-header">
              <div className="section-num" style={{ color: "var(--gold)" }}>
                {industriesNum}
              </div>
              <div className="section-title-group">
                <span className="eyebrow">Industry Applications</span>
                <h2 className="display-lg" style={{ color: "var(--canvas)" }}>
                  Built around the
                  <br />
                  <em className="italic" style={{ color: "var(--gold)" }}>
                    shape of your market.
                  </em>
                </h2>
              </div>
            </div>

            <ServiceIndustries industries={service.industryApplications} />
          </div>
        </section>
      )}

      {/* ── SECTION VI — FAQ ───────────────────────────────────── */}
      {service.faqs && faqsNum && (
        <section className="section-pad svc-faq">
          <div className="section-container">
            <div className="section-header">
              <div className="section-num">{faqsNum}</div>
              <div className="section-title-group">
                <span className="eyebrow on-light">Frequently Asked</span>
                <h2 className="display-lg" style={{ color: "var(--green)" }}>
                  Questions worth
                  <br />
                  <em className="italic" style={{ color: "var(--gold)" }}>
                    answering directly.
                  </em>
                </h2>
              </div>
            </div>

            <ServiceFaq faqs={service.faqs} />
          </div>
        </section>
      )}

      {/* ── WHO IT'S FOR ───────────────────────────────────────── */}
      <section className="section-pad svc-audience">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">{audienceNum}</div>
            <div className="section-title-group">
              <span className="eyebrow on-light">Who It&apos;s For</span>
              <h2 className="display-lg" style={{ color: "var(--green)" }}>
                Designed for a
                <br />
                <em className="italic" style={{ color: "var(--gold)" }}>
                  specific kind of operator.
                </em>
              </h2>
            </div>
          </div>

          <div className="svc-audience-inner">
            <div className="svc-audience-body">
              <p>{service.whoItsFor}</p>
              <p>
                If that sounds like your business, the audit will tell us whether {service.shortName.toLowerCase()} is
                the right place to begin — and what an engagement would look like, specific to your market.
              </p>
            </div>
            <aside className="svc-audience-aside">
              <span className="svc-audience-aside-eyebrow">Best Suited To</span>
              <p className="svc-audience-aside-text">
                Operators serious about compounding the asset, not chasing the trend.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE / STATEMENT ─────────────────────────────── */}
      <section className="svc-statement section-pad grain grain-dark">
        <div className="svc-statement-inner">
          <span className="svc-statement-rule" aria-hidden="true" />
          <span className="svc-statement-cite">A Working Principle</span>
          <p className="svc-statement-text">&ldquo;{service.pullQuote}&rdquo;</p>
          <span className="svc-statement-rule" aria-hidden="true" />
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <FinalCta
        eyebrow="Begin the Engagement"
        title={
          <>
            Start with the <em>audit.</em>
          </>
        }
        subtitle={`Book a complimentary 30-minute audit. We'll review where ${service.shortName.toLowerCase()} fits within your business, and show you exactly what we'd do.`}
        ctaLabel="Book Your Free Audit"
      />

      <SiteFooter />
    </>
  );
}
