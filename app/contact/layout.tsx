import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Audit — Anova Co.",
  description:
    "Book a free 30-minute strategy audit with Anova Co. We'll identify your biggest growth opportunities and show you exactly how we'd approach them.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
