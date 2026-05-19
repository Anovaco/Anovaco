"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FaqItem } from "@/lib/services";

export function ServiceFaq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="svc-faq-grid">
      <div className="svc-faq-list">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-faq-panel-${i}`;
          const triggerId = `${baseId}-faq-trigger-${i}`;
          return (
            <div
              key={item.q}
              className={`svc-faq-item${isOpen ? " is-open" : ""}`}
            >
              <button
                type="button"
                id={triggerId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="svc-faq-trigger"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="svc-faq-q">{item.q}</span>
                <span className="svc-faq-chevron" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M2 5l5 5 5-5" />
                  </svg>
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="svc-faq-panel"
                data-open={isOpen ? "true" : "false"}
              >
                <div className="svc-faq-panel-inner">
                  <p className="svc-faq-a">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="svc-faq-aside">
        <div className="svc-panel svc-panel--dark">
          <span className="svc-panel-label">FREE AUDIT INCLUDES</span>
          <span className="svc-panel-rule" aria-hidden="true" />
          <ul className="svc-panel-rows">
            <li className="svc-panel-row">Online presence review · Complete</li>
            <li className="svc-panel-row">Competitor analysis · Included</li>
            <li className="svc-panel-row">Gap identification · Documented</li>
            <li className="svc-panel-row">Recommended strategy · Presented</li>
            <li className="svc-panel-row">No obligation · Guaranteed</li>
          </ul>
          <Link href="/contact" className="btn btn-gold svc-faq-cta">
            Book Your Free Audit <span className="arrow">→</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
