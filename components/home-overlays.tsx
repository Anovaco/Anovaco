"use client";

import { useEffect, useState } from "react";

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Growth" },
  { id: "problem", label: "The Problem" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "investment", label: "Investment" },
  { id: "results", label: "Results" },
  { id: "finalCta", label: "Get Started" },
];

export function HomeOverlays() {
  const [activeId, setActiveId] = useState<string>("hero");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  // Hero parallax background
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile || reduced) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const offset = Math.max(-120, Math.min(120, -y * 0.4));
        hero.style.setProperty("--hero-bg-y", `${offset}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  // Section labels via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
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
      <div className="section-label" aria-hidden="true">
        <span key={activeLabel} className="section-label-text">
          {activeLabel}
        </span>
      </div>

    </>
  );
}
