"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AnovaLogo } from "./anova-logo";

interface SiteNavProps {
  /** If true, the nav stays in the "light" variant regardless of scroll (used on sub-pages). */
  forceLight?: boolean;
}

export function SiteNav({ forceLight = false }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(!forceLight);

  useEffect(() => {
    if (forceLight) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const hero = document.getElementById("hero");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 60 : 800;
      setOnDark(window.scrollY < heroBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceLight]);

  const cls = [
    scrolled ? "scrolled" : "",
    forceLight ? "on-light" : onDark ? "on-dark" : "on-light",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav id="siteNav" className={cls} aria-label="Primary">
      <Link href="/" className="nav-logo" aria-label="Anova Co. — Home">
        <AnovaLogo size={30} />
        <span className="nav-logo-text">
          Anova&nbsp;&nbsp;<span className="co">Co.</span>
        </span>
      </Link>

      <div className="nav-links">
        <Link href="/#services" className="nav-link">Services</Link>
        <span className="nav-sep" aria-hidden="true">·</span>
        <Link href="/#process" className="nav-link">Process</Link>
        <span className="nav-sep" aria-hidden="true">·</span>
        <Link href="/#investment" className="nav-link">Investment</Link>
        <span className="nav-sep" aria-hidden="true">·</span>
        <Link href="/#testimonials" className="nav-link">Results</Link>
      </div>

      <Link href="/contact" className="nav-cta">
        Book a Free Audit
      </Link>

      <Link href="/contact" className="nav-menu-btn" aria-label="Menu">
        <Menu size={22} strokeWidth={1.3} />
      </Link>
    </nav>
  );
}
