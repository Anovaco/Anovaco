import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're Booked — Anova Co.",
  description:
    "Your strategy audit is confirmed. Check your email for the meeting details and what to prepare.",
  robots: "noindex, nofollow",
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
