import Link from "next/link";

type FinalCtaProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function FinalCta({
  eyebrow = "The Invitation",
  title = (
    <>
      Ready to <em>grow?</em>
    </>
  ),
  subtitle = "Book a complimentary 30-minute audit. We'll review your entire online presence and show you exactly what we'd do.",
  ctaLabel = "Book Your Free Audit",
  ctaHref = "/contact",
}: FinalCtaProps) {
  return (
    <section id="finalCta">
      <div className="section-container">
        <div className="cta-inner">
          <div className="cta-rule" />
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="cta-title">{title}</h2>
          <p className="cta-sub">{subtitle}</p>
          <Link href={ctaHref} className="btn btn-gold" style={{ marginTop: 12 }}>
            {ctaLabel} <span className="arrow">→</span>
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
  );
}
