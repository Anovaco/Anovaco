import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ScrollProgress } from "@/components/scroll-progress";
import VoiceWidget from "@/components/VoiceWidget";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anovaco.ca";
const OG_DESCRIPTION =
  "Anova Co. helps growing businesses build the systems, presence, and strategy they need to compete and win.";

export const metadata: Metadata = {
  title: "Anova Co. | Business Solutions Consulting Firm",
  description: OG_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Anova Co. | Business Solutions Consulting Firm",
    description: OG_DESCRIPTION,
    url: SITE_URL,
    siteName: "Anova Co.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anova Co. | Business Solutions Consulting Firm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anova Co. | Business Solutions Consulting Firm",
    description: OG_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Anova Co.",
  description:
    "Anova Co. helps growing businesses build the systems, presence, and strategy they need to compete and win.",
  url: "https://anovaco.ca",
  email: "ano@anovaco.ca",
  serviceType: [
    "Automation & Systems",
    "Website Design",
    "Google Ads",
    "Meta Ads",
    "Local SEO",
    "Social Media Management",
    "Reputation Management",
  ],
  priceRange: "$$",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: "html { background-color: #1B2B21; }" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <ScrollProgress />
        {children}
        <VoiceWidget />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
