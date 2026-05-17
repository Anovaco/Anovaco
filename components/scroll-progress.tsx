"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Thin gold bar fixed at the top that fills as the page scrolls.
// Uses scaleX (transform-only) so paint stays cheap.
export function ScrollProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (pathname !== "/" || reduced) return;
    let raf = 0;
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.max(0, Math.min(1, p)));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname, reduced]);

  if (pathname !== "/" || reduced) return null;

  return (
    <div
      className="scroll-progress"
      aria-hidden="true"
      style={{
        width: "100%",
        transform: `scaleX(${progress})`,
        transformOrigin: "0 0",
        transition: "none",
        willChange: "transform",
      }}
    />
  );
}
