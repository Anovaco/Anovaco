"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Floating "Book a Free Audit" pill — visible on all screen sizes once the
// user scrolls past 70% of the page. Hidden on /contact and any sub-route
// so we don't redirect users mid-booking.
export function FloatingCTA() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname.startsWith("/contact")) return null;
  return <FloatingCTAInner />;
}

function FloatingCTAInner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setVisible(p >= 0.7);
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
  }, []);

  return (
    <Link
      href="/contact"
      className={`floating-cta${visible ? " is-visible" : ""}`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      Book a Free Audit <span>→</span>
    </Link>
  );
}
