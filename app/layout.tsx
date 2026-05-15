import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ScrollProgress } from "@/components/scroll-progress";
import { FloatingCTA } from "@/components/floating-cta";

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
  "AI-powered digital growth agency in Toronto. Custom AI Systems, websites, SEO, ads, and reputation management for local businesses.";

export const metadata: Metadata = {
  title: "Anova Co. | AI-Powered Digital Growth Agency Toronto",
  description: OG_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Anova Co. | AI-Powered Digital Growth Agency Toronto",
    description: OG_DESCRIPTION,
    url: SITE_URL,
    siteName: "Anova Co.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anova Co. | AI-Powered Digital Growth Agency Toronto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anova Co. | AI-Powered Digital Growth Agency Toronto",
    description: OG_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Anova Co.",
  description:
    "AI-powered digital growth agency helping local service businesses grow through AI automation, web design, Google & Meta Ads, SEO, social media management, and reputation management.",
  url: "https://anovaco.ca",
  email: "ano@anovaco.ca",
  areaServed: {
    "@type": "City",
    name: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  serviceType: [
    "AI Automation",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body>
        <ScrollProgress />
        {children}
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
