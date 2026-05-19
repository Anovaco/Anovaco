import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FinalCta } from "@/components/final-cta";
import type { ServiceDefinition } from "@/lib/services";

export function ServicePage({ service }: { service: ServiceDefinition }) {
  return (
    <>
      <SiteNav forceLight />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="svc-hero hero-grain">
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

      {/* ── WHAT'S INCLUDED ────────────────────────────────────── */}
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

          <div className="svc-included-grid">
            {service.included.map((item, i) => (
              <div key={item} className="svc-included-item">
                <span className="svc-included-label">
                  Deliverable&nbsp;&nbsp;·&nbsp;&nbsp;{String(i + 1).padStart(2, "0")}
                </span>
                <p className="svc-included-body">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ───────────────────────────────────────── */}
      <section className="section-pad svc-audience">
        <div className="section-container">
          <div className="section-header">
            <div className="section-num">II</div>
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
