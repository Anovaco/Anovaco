"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, addMonths, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AnovaLogo } from "@/components/anova-logo";
import { PageTransition } from "@/components/page-transition";

const DRAFT_KEY = "anova_audit_form_draft";

/* ───────── Types & constants ───────── */

type FormState = {
  business_name: string;
  city: string;
  industry: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  interests: string[];
  challenge: string;
  referral: string;
  referral_other: string;
  date: Date | undefined;
  time: string; // "HH:mm" 24h
};

const initialState: FormState = {
  business_name: "",
  city: "",
  industry: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  interests: [],
  challenge: "",
  referral: "",
  referral_other: "",
  date: undefined,
  time: "",
};

const INDUSTRIES = [
  "Restaurant / Café",
  "Salon / Spa / Barbershop",
  "Health & Wellness / Gym",
  "Home Services",
  "Retail Store",
  "Real Estate",
  "Legal / Accounting",
  "Dental / Medical",
  "Contractor / Trades",
  "Other",
];
const ROLES = ["Owner", "Co-owner / Partner", "General Manager", "Marketing Manager", "Other"];
const INTERESTS = [
  "AI Automation",
  "Website Design & Build",
  "Google & Meta Ads",
  "Local SEO",
  "Social Media Management",
  "Reputation Management",
];
const REFERRAL_SOURCES = [
  "Google Search",
  "Instagram",
  "Facebook",
  "Referral",
  "Cold email",
  "Other",
];

const STEP_TITLES = ["About you", "Your goals", "Pick a time"];
const STEP_LABELS = ["About You", "Your Goals", "Pick a Time"];
const TOTAL_STEPS = 3;

/* ───────── Time slots ───────── */

function slotsForDate(date: Date | undefined): string[] {
  if (!date) return [];
  const d = date.getDay(); // 0 Sun ... 6 Sat
  if (d === 0) return []; // Sunday closed
  const [startH, endH] = d === 6 ? [10, 14] : [9, 17]; // Sat 10–2, Mon–Fri 9–5
  const out: string[] = [];
  for (let h = startH; h < endH; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}
function formatTime12(t: string): string {
  const [hRaw, mRaw] = t.split(":");
  const h = parseInt(hRaw, 10);
  const m = mRaw;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

/* ───────── Page ───────── */

type Step1FieldKey =
  | "name"
  | "email"
  | "business_name"
  | "industry"
  | "city"
  | "role"
  | "phone";

const STEP1_ORDER: Step1FieldKey[] = [
  "name",
  "email",
  "business_name",
  "industry",
  "city",
  "role",
  "phone",
];

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [current, setCurrent] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Step1FieldKey, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [draftSaved, setDraftSaved] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const firstSaveSkipped = useRef(false);

  /* ───────── Auto-save (localStorage, debounced) ───────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((f) => ({
          ...f,
          ...parsed,
          date: parsed.date ? new Date(parsed.date) : undefined,
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const serializable = {
          ...form,
          date: form.date ? form.date.toISOString() : undefined,
        };
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
        if (firstSaveSkipped.current) {
          setDraftSaved(true);
          window.setTimeout(() => setDraftSaved(false), 2000);
        } else {
          firstSaveSkipped.current = true;
        }
      } catch {}
    }, 500);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [form]);

  /* ───────── Field helpers ───────── */
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors([]);
    setFieldErrors((fe) => {
      if (!(k in fe)) return fe;
      const next = { ...fe };
      delete next[k as Step1FieldKey];
      return next;
    });
  };
  const toggleInterest = (val: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter((i) => i !== val)
        : [...f.interests, val],
    }));
    setErrors([]);
  };

  /* ───────── Validation ───────── */
  const validateStep1Fields = (): Partial<Record<Step1FieldKey, string>> => {
    const e: Partial<Record<Step1FieldKey, string>> = {};
    const name = form.name.trim();
    if (!name) e.name = "Please enter your name";
    else if (name.length < 2) e.name = "Name must be at least 2 characters";

    const email = form.email.trim();
    if (!email) e.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address";

    const bn = form.business_name.trim();
    if (!bn) e.business_name = "Please enter your business name";
    else if (bn.length < 2) e.business_name = "Business name must be at least 2 characters";

    if (!form.industry) e.industry = "Please select your industry";

    const city = form.city.trim();
    if (!city) e.city = "Please enter your city or neighbourhood";
    else if (city.length < 2) e.city = "Must be at least 2 characters";

    if (!form.role) e.role = "Please select your role";

    const phone = form.phone.trim();
    if (!phone) e.phone = "Please enter your phone number";
    else if (!/^[\d\s\-()+]{7,}$/.test(phone))
      e.phone = "Please enter a valid phone number";

    return e;
  };

  const validateStep = (idx: number): string[] => {
    const missing: string[] = [];
    if (idx === 0) {
      const fe = validateStep1Fields();
      for (const k of STEP1_ORDER) if (fe[k]) missing.push(fe[k]!);
    } else if (idx === 1) {
      if (form.interests.length === 0) missing.push("At least one service");
      if (!form.referral) missing.push("How you heard about us");
      if (form.referral === "Other" && !form.referral_other.trim())
        missing.push("Please tell us where");
    } else if (idx === 2) {
      if (!form.date) missing.push("A date");
      if (!form.time) missing.push("A time");
    }
    return missing;
  };

  const goTo = (target: number) => {
    if (target < 0 || target > TOTAL_STEPS - 1) return;
    if (target > current) {
      for (let i = current; i < target; i++) {
        if (i === 0) {
          const fe = validateStep1Fields();
          if (Object.keys(fe).length > 0) {
            setCurrent(0);
            setFieldErrors(fe);
            setErrors([]);
            return;
          }
        }
        const miss = validateStep(i);
        if (miss.length) {
          setCurrent(i);
          setErrors(miss);
          return;
        }
      }
    }
    setCurrent(target);
    setMaxReached((m) => Math.max(m, target));
    setErrors([]);
  };
  const goNext = () => {
    if (current === 0) {
      const fe = validateStep1Fields();
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        setErrors([]);
        if (typeof window !== "undefined") {
          const firstKey = STEP1_ORDER.find((k) => fe[k]);
          if (firstKey) {
            requestAnimationFrame(() => {
              const el = document.querySelector(
                `[data-field="${firstKey}"]`,
              ) as HTMLElement | null;
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                const focusable = el.querySelector(
                  "input, select, textarea",
                ) as HTMLElement | null;
                if (focusable) focusable.focus({ preventScroll: true });
              }
            });
          }
        }
        return;
      }
      setFieldErrors({});
    }
    const miss = validateStep(current);
    if (miss.length) {
      setErrors(miss);
      return;
    }
    goTo(current + 1);
  };
  const goBack = () => goTo(current - 1);

  /* ───────── Submit ───────── */
  const canSubmit = !!form.date && !!form.time;
  const handleSubmit = () => {
    // Final validation across all steps
    const allMissing: string[] = [];
    for (let i = 0; i < TOTAL_STEPS; i++) allMissing.push(...validateStep(i));
    if (allMissing.length) {
      for (let i = 0; i < TOTAL_STEPS; i++) {
        if (validateStep(i).length) {
          setCurrent(i);
          setErrors(validateStep(i));
          break;
        }
      }
      return;
    }

    const payload = {
      business_name: form.business_name.trim(),
      city: form.city.trim(),
      industry: form.industry,
      name: form.name.trim(),
      role: form.role,
      email: form.email.trim(),
      phone: form.phone.trim(),
      interests: form.interests,
      challenge: form.challenge.trim(),
      referral: form.referral,
      referral_other: form.referral_other.trim(),
      date: form.date!.toISOString(),
      time: form.time,
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setSubmitError(data.error || "Something went wrong. Please try again.");
          return;
        }
        // Persist details for the thank-you page
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "anova:booking",
            JSON.stringify({
              date: payload.date,
              time: payload.time,
              businessName: payload.business_name,
              meetLink: data.meetLink || "",
            })
          );
          try {
            window.localStorage.removeItem(DRAFT_KEY);
          } catch {}
        }
        const params = new URLSearchParams();
        if (data.meetLink) params.set("meet", data.meetLink);
        params.set("date", payload.date);
        params.set("time", payload.time);
        router.push(`/thank-you?${params.toString()}`);
      } catch (err) {
        console.error(err);
        setSubmitError("Network error. Please try again.");
      }
    });
  };

  /* ───────── Step dots ───────── */
  const barPct = (current / (TOTAL_STEPS - 1)) * 100;

  return (
    <PageTransition>
    <div className="contact-page">
      {/* Nav */}
      <nav id="contactNav" aria-label="Contact">
        <div className="contact-nav-l">
          <Link href="/" className="nav-logo" aria-label="Anova Co. — Home">
            <AnovaLogo variant="outlined" size={28} />
            <span className="nav-logo-text" style={{ color: "rgba(244,241,237,0.85)" }}>
              Anova&nbsp;&nbsp;<span className="co">Co.</span>
            </span>
          </Link>
        </div>
        <div className="contact-nav-r">
          <Link href="/" className="back-link">
            ← Back to site
          </Link>
        </div>
      </nav>

      <div className="contact-shell">
        {/* Left panel */}
        <aside className="contact-left">
          <div>
            <div className="contact-rule" />
            <span className="eyebrow">Complimentary Audit</span>
            <h1 className="contact-headline">
              Let&apos;s grow your
              <br />
              business <em>together.</em>
            </h1>
            <p className="contact-sub">
              Fill in the form and we&apos;ll review your entire online presence — then hop on a
              free 30-minute call to show you exactly what we&apos;d do.
            </p>

            <div className="expect-list">
              <div className="expect-item">
                <div className="expect-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6" />
                    <line x1="15.5" y1="15.5" x2="20" y2="20" />
                  </svg>
                </div>
                <div>
                  <div className="expect-title">Full presence audit.</div>
                  <p className="expect-body">
                    We review your site, SEO, ads, social, and reputation before we speak.
                  </p>
                </div>
              </div>
              <div className="expect-item">
                <div className="expect-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 8h14M5 12h14M5 16h8" />
                  </svg>
                </div>
                <div>
                  <div className="expect-title">Clear, tailored insights.</div>
                  <p className="expect-body">
                    Specific recommendations for your business — no templated advice.
                  </p>
                </div>
              </div>
              <div className="expect-item">
                <div className="expect-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="4" y="5" width="16" height="14" rx="1" />
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="9" y1="2" x2="9" y2="6" />
                    <line x1="15" y1="2" x2="15" y2="6" />
                  </svg>
                </div>
                <div>
                  <div className="expect-title">30-minute strategy call.</div>
                  <p className="expect-body">
                    Walk through the findings together. No pressure, no commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-left-bottom">
            <span>Toronto / MMXXVI</span>
            <em>Growth, engineered.</em>
          </div>
        </aside>

        {/* Right form panel */}
        <main className="contact-right">
          <div className="form-head">
            <h2 className="form-title">
              Book your <em>complimentary audit.</em>
            </h2>
            <p className="form-subtitle">Takes about 2 minutes.</p>
          </div>

          {/* Progress */}
          <div className="msf-progress" role="presentation">
            <div className="msf-dots" id="msfDots">
              {STEP_LABELS.map((label, i) => {
                const cls = i === current ? "current" : i < current ? "done" : "";
                return (
                  <button
                    key={label}
                    type="button"
                    className={`msf-dot ${cls}`}
                    aria-label={`Step ${i + 1}: ${label}`}
                    disabled={i > maxReached}
                    onClick={() => !(i > maxReached) && goTo(i)}
                  >
                    <span className="msf-dot-bullet" />
                    <span className="msf-dot-label">{label}</span>
                  </button>
                );
              })}
            </div>
            <div className="msf-bar">
              <div className="msf-bar-fill" style={{ width: `${barPct}%` }} />
            </div>
            <div className={`draft-saved${draftSaved ? " is-on" : ""}`} aria-live="polite">
              Draft saved
            </div>
          </div>

          {/* Step panels */}
          <div className="msf-steps">
            {current === 0 && (
              <Step1 form={form} set={set} fieldErrors={fieldErrors} />
            )}
            {current === 1 && (
              <Step2
                form={form}
                set={set}
                toggleInterest={toggleInterest}
                errors={errors}
              />
            )}
            {current === 2 && <Step3 form={form} set={set} />}
          </div>

          {/* Errors */}
          {(errors.length > 0 || submitError) && (
            <div className="form-errors show" role="alert">
              <strong>{submitError ? "Couldn't submit" : "Please complete the following:"}</strong>
              {submitError || `${errors.join(", ")}.`}
            </div>
          )}

          {/* Nav buttons */}
          <div className="msf-nav">
            <button
              type="button"
              className="msf-btn msf-back"
              onClick={goBack}
              disabled={current === 0}
            >
              <span className="arrow">←</span> Back
            </button>
            {current < TOTAL_STEPS - 1 ? (
              <button type="button" className="msf-btn msf-next" onClick={goNext}>
                Next <span className="arrow">→</span>
              </button>
            ) : (
              <button
                type="button"
                className="msf-btn msf-submit"
                onClick={handleSubmit}
                disabled={!canSubmit || isPending}
              >
                {isPending ? (
                  <>
                    <span className="msf-spinner" /> Confirming…
                  </>
                ) : (
                  <>
                    Confirm Your Audit <span className="arrow">→</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="msf-counter">
            Step {current + 1} of {TOTAL_STEPS}  ·  <em>{STEP_TITLES[current]}</em>
          </div>
        </main>
      </div>
    </div>
    </PageTransition>
  );
}

/* ═══════════ Step components ═══════════ */

function Step1({
  form,
  set,
  fieldErrors,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  fieldErrors: Partial<Record<Step1FieldKey, string>>;
}) {
  return (
    <section className="msf-step animate-[msfIn_420ms_cubic-bezier(0.4,0,0.2,1)_both]">
      <div className="msf-step-head">
        <span className="msf-step-num">01</span>
        <div>
          <h3 className="msf-step-title">
            About <em>you.</em>
          </h3>
          <p className="msf-step-sub">
            Tell us who you are and where your business operates.
          </p>
        </div>
      </div>
      <div className="form-row">
        <Field
          label="Your name"
          required
          kind="text"
          error={fieldErrors.name}
          fieldName="name"
        >
          <input
            className={`input${fieldErrors.name ? " border-red-500" : ""}`}
            placeholder=" "
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field
          label="Email address"
          required
          kind="text"
          error={fieldErrors.email}
          fieldName="email"
        >
          <input
            className={`input${fieldErrors.email ? " border-red-500" : ""}`}
            type="email"
            placeholder=" "
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
      </div>
      <div className="form-row">
        <Field
          label="Business name"
          required
          kind="text"
          error={fieldErrors.business_name}
          fieldName="business_name"
        >
          <input
            className={`input${fieldErrors.business_name ? " border-red-500" : ""}`}
            placeholder=" "
            value={form.business_name}
            onChange={(e) => set("business_name", e.target.value)}
          />
        </Field>
        <Field
          label="Industry"
          required
          error={fieldErrors.industry}
          fieldName="industry"
        >
          <select
            className={`select${fieldErrors.industry ? " border-red-500" : ""}`}
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
          >
            <option value="">Select one…</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="form-row">
        <Field
          label="City / Neighbourhood"
          required
          kind="text"
          error={fieldErrors.city}
          fieldName="city"
        >
          <input
            className={`input${fieldErrors.city ? " border-red-500" : ""}`}
            placeholder=" "
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field
          label="Your role"
          required
          error={fieldErrors.role}
          fieldName="role"
        >
          <select
            className={`select${fieldErrors.role ? " border-red-500" : ""}`}
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
          >
            <option value="">Select one…</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div
        className="form-row"
        style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}
      >
        <Field
          label="Phone number"
          required
          kind="text"
          error={fieldErrors.phone}
          fieldName="phone"
        >
          <input
            className={`input${fieldErrors.phone ? " border-red-500" : ""}`}
            type="tel"
            placeholder=" "
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <p
          style={{
            alignSelf: "center",
            fontSize: 12,
            color: "var(--muted)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          We&apos;ll never share your number.
        </p>
      </div>
    </section>
  );
}

function Step2({
  form,
  set,
  toggleInterest,
  errors,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleInterest: (v: string) => void;
  errors: string[];
}) {
  return (
    <section className="msf-step animate-[msfIn_420ms_cubic-bezier(0.4,0,0.2,1)_both]">
      <div className="msf-step-head">
        <span className="msf-step-num">02</span>
        <div>
          <h3 className="msf-step-title">
            Your <em>goals.</em>
          </h3>
          <p className="msf-step-sub">
            What you want help with — and which services you&apos;re interested in.
          </p>
        </div>
      </div>
      <div className="check-grid">
        {INTERESTS.map((v) => {
          const checked = form.interests.includes(v);
          return (
            <label key={v} className={`check-item ${checked ? "checked" : ""}`}>
              <span className="box">
                <svg viewBox="0 0 16 16">
                  <polyline points="3 8 7 12 13 4" />
                </svg>
              </span>
              <input
                type="checkbox"
                hidden
                checked={checked}
                onChange={() => toggleInterest(v)}
              />
              <span className="label">{v}</span>
            </label>
          );
        })}
      </div>
      <div className="form-row" style={{ gridTemplateColumns: "1fr", marginTop: 22, marginBottom: 22 }}>
        <Field label="Biggest challenge" optional kind="text">
          <textarea
            className="textarea"
            placeholder=" "
            value={form.challenge}
            onChange={(e) => set("challenge", e.target.value)}
          />
        </Field>
      </div>
      <div className="form-row" style={{ gridTemplateColumns: "1fr" }}>
        <Field label="How did you hear about Anova Co.?" required errored={errors.includes("How you heard about us")}>
          <select
            className="select"
            value={form.referral}
            onChange={(e) => set("referral", e.target.value)}
          >
            <option value="">Select one…</option>
            {REFERRAL_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className={`ref-other ${form.referral === "Other" ? "open" : ""}`}>
        <div
          className={`form-field float-field${
            errors.includes("Please tell us where") ? " is-invalid" : ""
          }`}
          style={{ marginTop: 14 }}
        >
          <input
            className="input"
            placeholder=" "
            value={form.referral_other}
            onChange={(e) => set("referral_other", e.target.value)}
          />
          <label className="float-label">
            Please tell us where <span className="req">*</span>
          </label>
          <span className="field-warn" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <line x1="8" y1="4.5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}

function Step3({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const toMonth = useMemo(() => addMonths(today, 6), [today]);
  const slots = useMemo(() => slotsForDate(form.date), [form.date]);

  const isTodayLocal = useMemo(() => {
    const t = new Date();
    const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    return (date: Date) => {
      const cellStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return todayStr === cellStr;
    };
  }, []);

  // Booked slots for the selected date — fetched from /api/availability,
  // which queries Google Calendar freebusy as the source of truth.
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [availLoading, setAvailLoading] = useState(false);

  useEffect(() => {
    if (!form.date) {
      setBookedSlots([]);
      return;
    }
    const y = form.date.getFullYear();
    const mo = String(form.date.getMonth() + 1).padStart(2, "0");
    const d = String(form.date.getDate()).padStart(2, "0");
    const dateStr = `${y}-${mo}-${d}`;
    const ctrl = new AbortController();
    setAvailLoading(true);
    fetch(`/api/availability?date=${dateStr}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((data: { bookedSlots?: string[] }) => {
        setBookedSlots(Array.isArray(data.bookedSlots) ? data.bookedSlots : []);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setBookedSlots([]);
      })
      .finally(() => setAvailLoading(false));
    return () => ctrl.abort();
  }, [form.date]);

  // If the currently-selected time becomes booked (date changed, or another
  // user just took it), clear it so the form can't submit a stale slot.
  useEffect(() => {
    if (form.time && bookedSlots.includes(form.time)) {
      set("time", "");
    }
  }, [bookedSlots, form.time, set]);

  const selectedLabel =
    form.date && form.time
      ? `${format(form.date, "EEEE, MMMM d")} at ${formatTime12(form.time)}`
      : form.date
        ? `${format(form.date, "EEEE, MMMM d")} — pick a time`
        : "";

  return (
    <section className="msf-step animate-[msfIn_420ms_cubic-bezier(0.4,0,0.2,1)_both]">
      <div className="msf-step-head">
        <span className="msf-step-num">03</span>
        <div>
          <h3 className="msf-step-title">
            Pick a <em>time.</em>
          </h3>
          <p className="msf-step-sub">
            Choose a date and time that works for your schedule — we&apos;ll confirm within 24 hours.
          </p>
        </div>
      </div>

      <div className="booking-grid">
        <Calendar
          mode="single"
          selected={form.date}
          onSelect={(d) => {
            set("date", d ?? undefined);
            set("time", "");
          }}
          disabled={[{ before: today }, { dayOfWeek: [0] }]}
          startMonth={today}
          endMonth={toMonth}
          weekStartsOn={1}
          today={today}
          modifiers={{ today: isTodayLocal }}
        />

        <div className="time-panel">
          <div className="time-panel-head">
            {form.date ? format(form.date, "EEEE, MMM d") : "Select a date first"}
          </div>
          {!form.date ? (
            <div className="time-empty">Pick a day from the calendar to see available times.</div>
          ) : slots.length === 0 ? (
            <div className="time-empty">No availability on this day — please choose another.</div>
          ) : (
            <>
              <div className="time-list">
                {slots.map((t) => {
                  const isBooked = bookedSlots.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`time-btn ${form.time === t ? "selected" : ""} ${isBooked ? "is-booked" : ""}`}
                      onClick={() => !isBooked && set("time", t)}
                      disabled={isBooked}
                      aria-disabled={isBooked}
                      title={isBooked ? "Already booked" : undefined}
                    >
                      {formatTime12(t)}
                      {isBooked && <span className="time-btn-tag">Booked</span>}
                    </button>
                  );
                })}
              </div>
              {availLoading && <div className="time-loading">Checking availability…</div>}
            </>
          )}
        </div>
      </div>

      {selectedLabel && (
        <div className="booking-summary">
          <div className="label">Your slot</div>
          <div className="when">{selectedLabel}</div>
        </div>
      )}
    </section>
  );
}

/* ═══════════ Tiny field wrapper ═══════════ */

function Field({
  label,
  required,
  optional,
  kind = "select",
  errored,
  error,
  fieldName,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  kind?: "select" | "text";
  errored?: boolean;
  error?: string;
  fieldName?: string;
  children: React.ReactNode;
}) {
  const isInvalid = !!error || errored;
  const errorNode = error ? (
    <p
      className="field-error"
      style={{
        color: "#ef4444",
        fontSize: 12,
        lineHeight: 1.4,
        margin: "6px 0 0",
      }}
    >
      {error}
    </p>
  ) : null;
  if (kind === "text") {
    return (
      <div
        data-field={fieldName}
        className={`form-field float-field${isInvalid ? " is-invalid" : ""}`}
      >
        {children}
        <label className="float-label">
          {label}{" "}
          {required && <span className="req">*</span>}
          {optional && <span className="opt">— optional</span>}
        </label>
        <span className="field-warn" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <line x1="8" y1="4.5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
          </svg>
        </span>
        {errorNode}
      </div>
    );
  }
  return (
    <div
      data-field={fieldName}
      className={`form-field${isInvalid ? " is-invalid" : ""}`}
    >
      <label className="form-label">
        {label}{" "}
        {required && <span className="req">*</span>}
        {optional && <span className="opt">— optional</span>}
      </label>
      {children}
      {errorNode}
    </div>
  );
}
