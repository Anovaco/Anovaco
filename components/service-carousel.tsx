"use client";

import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Service = {
  num: string;
  name: string;
  hook: string;
  body: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    name: "Automation & Systems",
    hook: "The right systems running behind your business, 24/7.",
    body:
      "Most businesses lose revenue because the right systems aren't in place. Calls go unanswered, leads go cold, and follow-ups never happen. We build the automation infrastructure that keeps your business running around the clock — booking systems, lead follow-up, review requests, and client communication, all handled without manual effort from you.",
  },
  {
    num: "02",
    name: "Website Design & Build",
    hook: "Your most important first impression, built to convert.",
    body:
      "We design and build websites that look premium, rank on Google, and turn visitors into paying customers. Every site is mobile-first, comes with a booking or contact system out of the box, and is engineered around your industry and goals. Nothing templated.",
  },
  {
    num: "03",
    name: "Google & Meta Ads",
    hook: "The right people, at the right moment, every time.",
    body:
      "Fully managed Google Search, Meta, and Maps ad campaigns that put your business in front of people actively looking right now. We handle strategy, creative, targeting, weekly optimisation, and clear monthly reporting. Every dollar of your budget works toward a specific outcome.",
  },
  {
    num: "04",
    name: "Local SEO",
    hook: "Page one. Right where your customers are looking.",
    body:
      "We fix the foundation that decides whether locals find you — Google Business Profile, directory listings, on-page SEO, citations, and a review strategy that compounds. The outcome: page-one rankings, the Google Maps three-pack, and a steady stream of organic calls and visits.",
  },
  {
    num: "05",
    name: "Social Media Management",
    hook: "Consistent presence. Real growth. Zero effort from you.",
    body:
      "We manage every platform your customers actually use — Instagram, Facebook, TikTok, LinkedIn — with graphics, captions, Reels, and a strategy built around your brand voice. We post, we engage, and we report. You stay focused on running the business.",
  },
  {
    num: "06",
    name: "Reputation Management",
    hook: "Your reputation is your most valuable asset. We protect it.",
    body:
      "Automated review requests after every job, professional responses to every review (good or bad), strategic handling of negatives, and active monitoring of mentions across Google, Yelp, Facebook, and beyond. A higher rating and the trust to win every comparison.",
  },
];

const variants: Variants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function ServiceCarousel() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % SERVICES.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SERVICES.length) % SERVICES.length),
    [],
  );

  const swipeStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return;
    const dx = swipeStartX.current - e.clientX;
    if (dx > 50) next();
    else if (dx < -50) prev();
    swipeStartX.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const s = SERVICES[index];
  const activeVariants = reduced ? reducedVariants : variants;

  return (
    <div className="svc-carousel">
      <div className="svc-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={s.num}
            className="svc-card"
            variants={activeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: "easeInOut" }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="svc-card-left">
              <div className="svc-num">{s.num}</div>
              <h3 className="svc-name">{s.name}</h3>
              <p className="svc-hook">{s.hook}</p>
            </div>
            <div className="svc-card-right">
              <span className="svc-eyebrow">
                {s.num} — {s.name.toUpperCase()}
              </span>
              <div className="svc-rule" aria-hidden="true" />
              <p className="svc-body">{s.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <Link href="/contact" className="svc-pill">
          Book a Free Audit <span aria-hidden="true">→</span>
        </Link>

        <div className="svc-actions">
          <button
            type="button"
            className="svc-arrow svc-arrow-left"
            aria-label="Previous service"
            onClick={prev}
          >
            <ChevronLeft size={22} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className="svc-arrow svc-arrow-right"
            aria-label="Next service"
            onClick={next}
          >
            <ChevronRight size={22} strokeWidth={1.6} />
          </button>
        </div>

        <div className="svc-dots" role="tablist" aria-label="Service slides">
          {SERVICES.map((item, i) => (
            <button
              key={item.num}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${item.name}`}
              className={`svc-dot${i === index ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
