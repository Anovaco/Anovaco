"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Growth" },
  { id: "problem", label: "The Problem" },
  { id: "services", label: "What We Do" },
  { id: "process", label: "How It Works" },
  { id: "investment", label: "Investment" },
  { id: "testimonials", label: "Results" },
  { id: "finalCta", label: "Get Started" },
];

export function HomeOverlays() {
  const [progress, setProgress] = useState(0);
  const [pillVisible, setPillVisible] = useState(false);
  const [pillDismissed, setPillDismissed] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");
  const [reduced, setReduced] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  // Scroll progress + pill visibility + parallax background
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hero = document.getElementById("hero");
    const footer = document.querySelector("footer.site-footer") as HTMLElement | null;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        setProgress(h > 0 ? (y / h) * 100 : 0);
        // Parallax
        if (hero && !isMobile && !reduced) {
          hero.style.setProperty("--hero-bg-y", `${-y * 0.3}px`);
        }
        // Pill
        if (h > 0) {
          const past70 = y / h > 0.7;
          let nearFooter = false;
          if (footer) {
            const top = footer.getBoundingClientRect().top;
            nearFooter = top < window.innerHeight + 200;
          }
          if (past70 && !nearFooter) {
            setPillVisible((prev) => {
              if (!prev && !pillDismissed) {
                if (hideTimer.current) window.clearTimeout(hideTimer.current);
                hideTimer.current = window.setTimeout(() => setPillDismissed(true), 8000);
                return true;
              }
              return prev;
            });
          } else {
            setPillVisible(false);
          }
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [pillDismissed, reduced]);

  // Section labels via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1280px)").matches) return;
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { threshold: [0.3, 0.5, 0.7] }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  const activeLabel = SECTIONS.find((s) => s.id === activeId)?.label ?? "";

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <Link
        href="/contact"
        className={`floating-cta${pillVisible && !pillDismissed ? " is-visible" : ""}`}
        aria-hidden={!pillVisible || pillDismissed}
      >
        Ready to grow? Book your audit <span aria-hidden="true">→</span>
      </Link>

      <div className="section-label" aria-hidden="true">
        <span key={activeLabel} className="section-label-text">
          {activeLabel}
        </span>
      </div>

      <div className="mobile-cta-bar" aria-hidden={false}>
        <Link href="/contact" className="btn btn-gold mobile-cta-btn">
          Book a Free Audit <span className="arrow">→</span>
        </Link>
      </div>
    </>
  );
}
