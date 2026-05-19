"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnovaLogo } from "./anova-logo";
import { scrollToAnchor } from "@/lib/scroll-to-anchor";
import { SERVICES } from "@/lib/services";

interface SiteNavProps {
  /** If true, the nav stays in the "light" variant regardless of scroll (used on sub-pages). */
  forceLight?: boolean;
}

export function SiteNav({ forceLight = false }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(!forceLight);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesWrapRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (forceLight) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const hero = document.getElementById("hero");
      if (!hero) {
        setOnDark(false);
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight - 60;
      setOnDark(window.scrollY < heroBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceLight]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const drawer = document.getElementById("mobile-nav-drawer");
    const siblings: Element[] = [];
    Array.from(document.body.children).forEach((el) => {
      if (el === drawer) return;
      if (!el.hasAttribute("inert")) {
        el.setAttribute("inert", "");
        siblings.push(el);
      }
    });

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      siblings.forEach((el) => el.removeAttribute("inert"));
    };
  }, [drawerOpen]);

  // Close services dropdown on outside click + Escape
  useEffect(() => {
    if (!servicesOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!servicesWrapRef.current) return;
      if (!servicesWrapRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  const cls = [
    scrolled ? "scrolled" : "",
    forceLight ? "on-light" : onDark ? "on-dark" : "on-light",
  ]
    .filter(Boolean)
    .join(" ");

  const closeDrawer = () => {
    setDrawerOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <>
      <nav id="siteNav" className={cls} aria-label="Primary">
        <Link href="/" className="nav-logo" aria-label="Anova Co. — Home">
          <AnovaLogo size={30} />
          <span className="nav-logo-text">
            Anova&nbsp;&nbsp;<span className="co">Co.</span>
          </span>
        </Link>

        <div className="nav-links">
          <div
            className="nav-services-wrap"
            ref={servicesWrapRef}
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
          >
            <button
              type="button"
              className="nav-link nav-link-trigger"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              aria-controls="nav-services-menu"
              onClick={() => setServicesOpen((v) => !v)}
              onFocus={openServices}
            >
              Services
              <ChevronDown
                size={12}
                strokeWidth={1.6}
                aria-hidden="true"
                className="nav-link-chevron"
                style={{
                  transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <div
              id="nav-services-menu"
              role="menu"
              aria-label="Services"
              className="nav-dropdown"
              data-open={servicesOpen ? "true" : "false"}
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  role="menuitem"
                  className="nav-dropdown-item"
                  onClick={() => setServicesOpen(false)}
                >
                  <span className="nav-dropdown-num" aria-hidden="true">{s.num}</span>
                  <span className="nav-dropdown-name">{s.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <span className="nav-sep" aria-hidden="true">·</span>
          <Link
            href="/#process"
            className="nav-link"
            onClick={(e) => { if (scrollToAnchor("/#process")) e.preventDefault(); }}
          >
            Process
          </Link>
          <span className="nav-sep" aria-hidden="true">·</span>
          <Link
            href="/#investment"
            className="nav-link"
            onClick={(e) => { if (scrollToAnchor("/#investment")) e.preventDefault(); }}
          >
            Investment
          </Link>
          <span className="nav-sep" aria-hidden="true">·</span>
          <Link
            href="/#results"
            className="nav-link"
            onClick={(e) => { if (scrollToAnchor("/#results")) e.preventDefault(); }}
          >
            Results
          </Link>
        </div>

        <Link href="/contact" className="nav-cta">
          Book a Free Audit
        </Link>

        <button
          type="button"
          className="nav-menu-btn"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={22} strokeWidth={1.3} />
        </button>
      </nav>

      <div
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(13, 22, 16, 0.55)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 998,
        }}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(86vw, 360px)",
          background: "#1B2B21",
          color: "#F4F1ED",
          zIndex: 999,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "22px 28px max(32px, env(safe-area-inset-bottom))",
          boxShadow: "-24px 0 60px -20px rgba(13, 22, 16, 0.55)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            style={{
              background: "none",
              border: 0,
              color: "#D4AF37",
              cursor: "pointer",
              padding: 11,
              minWidth: 44,
              minHeight: 44,
            }}
          >
            <X size={22} strokeWidth={1.3} />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            marginTop: 24,
          }}
        >
          {/* Services accordion */}
          <div className="mobile-nav-accordion">
            <button
              type="button"
              className="mobile-nav-accordion-trigger"
              aria-expanded={mobileServicesOpen}
              aria-controls="mobile-services-list"
              onClick={() => setMobileServicesOpen((v) => !v)}
            >
              <span>Services</span>
              <ChevronDown
                size={16}
                strokeWidth={1.4}
                aria-hidden="true"
                style={{
                  transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  color: "#D4AF37",
                }}
              />
            </button>
            <div
              id="mobile-services-list"
              className="mobile-nav-accordion-panel"
              data-open={mobileServicesOpen ? "true" : "false"}
            >
              <div className="mobile-nav-accordion-inner">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={closeDrawer}
                    className="mobile-nav-sublink"
                  >
                    <span className="mobile-nav-sublink-num">{s.num}</span>
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {[
            { href: "/#process", label: "Process" },
            { href: "/#investment", label: "Investment" },
            { href: "/#results", label: "Results" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (scrollToAnchor(item.href)) {
                  e.preventDefault();
                  closeDrawer();
                }
              }}
              style={{
                color: "#F4F1ED",
                textDecoration: "none",
                fontSize: 20,
                letterSpacing: "-0.01em",
                padding: "14px 0",
                borderBottom: "1px solid rgba(212, 175, 55, 0.18)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          onClick={closeDrawer}
          style={{
            marginTop: "auto",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "14px 22px",
            border: "1px solid #D4AF37",
            color: "#D4AF37",
            textDecoration: "none",
            letterSpacing: "0.04em",
            fontSize: 14,
          }}
        >
          Book a Free Audit
        </Link>
      </aside>
    </>
  );
}
