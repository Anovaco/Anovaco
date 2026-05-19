"use client";

import { useId, useState } from "react";
import type { IndustryApplication } from "@/lib/services";

export function ServiceIndustries({ industries }: { industries: IndustryApplication[] }) {
  const [active, setActive] = useState(0);
  const selectId = useId();
  const current = industries[active];

  return (
    <div className="svc-industries-shell">
      {/* Mobile select */}
      <label htmlFor={selectId} className="svc-industries-select-label">
        Select an industry
      </label>
      <select
        id={selectId}
        className="svc-industries-select"
        value={active}
        onChange={(e) => setActive(Number(e.target.value))}
      >
        {industries.map((ind, i) => (
          <option key={ind.name} value={i}>
            {ind.name}
          </option>
        ))}
      </select>

      {/* Desktop tab bar */}
      <div className="svc-industries-tabbar" role="tablist" aria-label="Industries">
        <div
          className="svc-industries-tabs"
          style={{ "--active-index": active } as React.CSSProperties}
        >
          {industries.map((ind, i) => (
            <button
              key={ind.name}
              type="button"
              role="tab"
              id={`svc-ind-tab-${i}`}
              aria-controls={`svc-ind-panel-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className={`svc-industries-tab${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              {ind.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active panel */}
      <div
        id={`svc-ind-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`svc-ind-tab-${active}`}
        className="svc-industries-content"
        key={current.name}
      >
        <div className="svc-industries-left">
          <h3 className="svc-industries-title">{current.name}</h3>
          <p className="svc-industries-context">{current.context}</p>
          <ul className="svc-industries-usecases">
            {current.useCases.map((u) => (
              <li key={u} className="svc-industries-usecase">
                <span className="svc-industries-check" aria-hidden="true">
                  ✓
                </span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="svc-panel svc-panel--soft">
          <span className="svc-panel-label">{current.panelLabel}</span>
          <span className="svc-panel-rule" aria-hidden="true" />
          <ul className="svc-panel-rows">
            {current.panelRows.map((r) => (
              <li key={r} className="svc-panel-row">
                {r}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
