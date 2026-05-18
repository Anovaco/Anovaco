"use client";

import Link from "next/link";
import { AnovaLogo } from "./anova-logo";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-container">
        <p className="foot-tagline" aria-hidden="true">
          Growth, engineered.
        </p>
        <div className="foot">
          <div className="foot-left">
            <AnovaLogo variant="ghost" size={20} />
            <span className="foot-logo-txt">
              Anova <span className="co">Co.</span>
            </span>
          </div>
          <div className="foot-center">© MMXXVI  ·  Anova Co.</div>
          <div className="foot-right">
            <Link
              href="/#services"
              className="foot-link"
              onClick={(e) => { if (scrollToAnchor("/#services")) e.preventDefault(); }}
            >
              Services
            </Link>
            <Link
              href="/#investment"
              className="foot-link"
              onClick={(e) => { if (scrollToAnchor("/#investment")) e.preventDefault(); }}
            >
              Investment
            </Link>
            <Link href="/contact" className="foot-link">Contact</Link>
            <Link href="/privacy" className="foot-link foot-link-fine">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
