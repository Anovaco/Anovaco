export type ServiceDefinition = {
  num: string;
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  included: string[];
  whoItsFor: string;
  pullQuote: string;
};

export const SERVICES: ServiceDefinition[] = [
  {
    num: "01",
    slug: "automation-systems",
    name: "Automation & Systems",
    shortName: "Automation & Systems",
    subtitle: "Operational infrastructure that runs without you.",
    description:
      "Most revenue leaks happen after the enquiry — not before it. We design and implement the backend systems that ensure every lead is captured, every client is followed up, and every operational touchpoint runs on schedule. From CRM configuration to multi-step communication workflows, we build the infrastructure your business runs on.",
    included: [
      "CRM architecture & integration",
      "Automated lead capture and nurture sequences",
      "Booking, scheduling & confirmation systems",
      "Client onboarding and offboarding workflows",
      "Review solicitation pipelines",
      "Operational audit & system documentation",
    ],
    whoItsFor:
      "Service businesses, clinics, consultancies, and agencies generating inbound leads who are losing revenue to slow follow-up, missed bookings, or manual processes that don't scale.",
    pullQuote:
      "The difference between a business that scales and one that stalls is rarely the product. It's the systems behind it.",
  },
  {
    num: "02",
    slug: "website-design",
    name: "Website Design & Build",
    shortName: "Website Design",
    subtitle: "Engineered to perform. Designed to convert.",
    description:
      "A website is a business asset, not a brochure. We design and build bespoke web properties that are architected for search visibility, optimised for Core Web Vitals, and structured around a single objective — turning qualified visitors into booked consultations. No themes, no page builders, no inherited technical debt.",
    included: [
      "Bespoke UX and visual design",
      "Mobile-first responsive development",
      "Core Web Vitals and performance optimisation",
      "On-page SEO architecture",
      "Conversion-optimised contact and booking flows",
      "30-day post-launch technical support",
    ],
    whoItsFor:
      "Established businesses whose current website is underperforming, newly launched companies that need a credible web presence, and any operator who has been sold a templated site and knows it.",
    pullQuote:
      "Your website is the first thing a prospective client judges you by. It should be the last thing they question.",
  },
  {
    num: "03",
    slug: "google-meta-ads",
    name: "Google & Meta Ads",
    shortName: "Google & Meta Ads",
    subtitle: "Paid media managed with precision, not guesswork.",
    description:
      "We design and manage performance advertising campaigns on Google Search and Meta platforms with full attribution tracking, clear reporting, and spend accountability at every stage. No inflated budgets, no vanity metrics. Every campaign is built around your margins, your conversion targets, and your local market.",
    included: [
      "Campaign architecture and keyword strategy",
      "Ad creative and copy development",
      "Conversion tracking and pixel configuration",
      "Weekly performance reporting with plain-English commentary",
      "Multivariate creative testing",
      "Monthly budget review and allocation optimisation",
    ],
    whoItsFor:
      "Businesses with a defined service offering and an appetite to grow through paid acquisition — particularly those who have run ads before and found them expensive and opaque.",
    pullQuote: "Media spend without attribution is not marketing. It's a wager.",
  },
  {
    num: "04",
    slug: "local-seo",
    name: "Local SEO",
    shortName: "Local SEO",
    subtitle: "Rank where your customers are already searching.",
    description:
      "Local search is the highest-intent acquisition channel available to a service business. We build and execute the technical and content strategies that position your business prominently in Google's local pack, Maps results, and near-me queries — capturing demand that already exists in your market.",
    included: [
      "Google Business Profile audit, optimisation and management",
      "Local keyword mapping and on-page optimisation",
      "NAP citation building and consistency remediation",
      "Schema markup implementation",
      "Monthly local ranking and visibility reporting",
      "Competitive gap analysis",
    ],
    whoItsFor:
      "Any business that serves a defined geographic area — trades, clinics, hospitality, professional services, retail — where proximity and trust signals drive purchasing decisions.",
    pullQuote:
      "Visibility in local search is not a marketing expense. It is a revenue infrastructure decision.",
  },
  {
    num: "05",
    slug: "social-media",
    name: "Social Media Management",
    shortName: "Social Media",
    subtitle: "A consistent, credible presence. Executed without consuming your time.",
    description:
      "Social media managed well is a trust-building and retention channel — not a lead generation lottery. We handle strategy, content production, scheduling, and community management across the platforms that matter for your audience, maintaining brand consistency and posting cadence without requiring your time or attention.",
    included: [
      "Platform strategy and audience mapping",
      "Monthly content calendar development",
      "Graphic design and copywriting to brand standards",
      "Scheduled publishing across relevant platforms",
      "Community and comment management",
      "Monthly analytics and engagement reporting",
    ],
    whoItsFor:
      "Businesses that understand the value of a consistent social presence but cannot dedicate internal resource to it — and those whose current social output does not reflect the standard of their actual service.",
    pullQuote:
      "Inconsistency is a signal. Your social presence should communicate the same standard as your work.",
  },
  {
    num: "06",
    slug: "reputation-management",
    name: "Reputation Management",
    shortName: "Reputation Management",
    subtitle: "Protect and compound the most valuable asset your business owns.",
    description:
      "Your reputation precedes every conversation you have with a prospective client. We implement the systems and strategies that generate authentic reviews at scale, monitor your standing across all relevant platforms, and ensure that what appears when someone searches your business name reflects the quality of what you deliver.",
    included: [
      "Structured review generation system and outreach sequences",
      "Real-time review monitoring and alert configuration",
      "Platform-specific response strategy and management",
      "Negative review assessment and mitigation approach",
      "Reputation analytics dashboard",
      "Coverage across Google, Yelp, Facebook, and industry-specific directories",
    ],
    whoItsFor:
      "Any business where trust is a precondition of purchase — healthcare, legal, financial services, home services, hospitality — and any operator who has worked hard to build a quality service but whose online reputation does not yet reflect it.",
    pullQuote:
      "A single unanswered negative review costs more than the client it references. A systematic approach to reputation is not optional at scale.",
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
