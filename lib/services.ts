export type ProcessStep = { title: string; body: string };
export type Outcome = { title: string; body: string };

export type ServiceDefinition = {
  num: string;
  slug: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  included: string[];
  processSteps: ProcessStep[];
  outcomes: Outcome[];
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
    processSteps: [
      {
        title: "Systems Audit",
        body: "We map every manual touchpoint in your business: how leads arrive, how they're followed up, how clients are onboarded and communicated with. We identify every point of revenue leakage.",
      },
      {
        title: "Architecture Design",
        body: "We design the full automation architecture: which tools, which triggers, which sequences. You review and approve before a single workflow is built.",
      },
      {
        title: "Build & Integration",
        body: "We build and integrate every workflow into your existing CRM, calendar, and communication stack. No disruption to your current operations during the transition.",
      },
      {
        title: "Testing & Handover",
        body: "Every workflow is stress-tested before going live. We document the full system and walk you through it so you understand exactly what is running on your behalf.",
      },
    ],
    outcomes: [
      {
        title: "Leads followed up within minutes, not days.",
        body: "Every enquiry triggers an immediate, personalised response sequence. No lead goes cold because someone forgot to call back.",
      },
      {
        title: "Your calendar fills itself.",
        body: "Booking confirmations, reminders, and follow-ups run automatically. Your clients experience a professional, consistent process every time.",
      },
      {
        title: "You know exactly what's running.",
        body: "Full documentation of every workflow. No black boxes, no dependency on us to explain what your own systems are doing.",
      },
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
    processSteps: [
      {
        title: "Discovery & Audit",
        body: "We audit your current web presence, review your competitors, and map the conversion objectives your site needs to achieve. We establish what a successful outcome looks like in measurable terms.",
      },
      {
        title: "UX & Design",
        body: "We design the full site architecture and visual language before writing a line of code. You see and approve every page at wireframe stage, then at full fidelity.",
      },
      {
        title: "Development & Optimisation",
        body: "We build on a modern, performant stack with Core Web Vitals and on-page SEO baked in from the start — not retrofitted at the end.",
      },
      {
        title: "Launch & Support",
        body: "We manage the full launch sequence and provide 30 days of post-launch support to address any issues before handing over full control.",
      },
    ],
    outcomes: [
      {
        title: "A site that loads in under 2 seconds.",
        body: "Performance is not aesthetic — it is a ranking and conversion factor. Every site we deliver is built to pass Core Web Vitals without compromise.",
      },
      {
        title: "Visitors know what to do next.",
        body: "Every page is structured around a single conversion objective. No confusion, no dead ends, no visitors who leave without taking action.",
      },
      {
        title: "You own it completely.",
        body: "Full handover of all assets, credentials, and documentation. No ongoing dependency on us to make basic changes.",
      },
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
    processSteps: [
      {
        title: "Account & Market Audit",
        body: "We review your existing account structure, your competitor activity, and your market's search behaviour. We establish your cost-per-acquisition target before spending a pound.",
      },
      {
        title: "Campaign Architecture",
        body: "We build the campaign structure, keyword strategy, audience targeting, and creative brief. Everything is approved before any budget is committed.",
      },
      {
        title: "Launch & Attribution",
        body: "We configure full conversion tracking before launch. Every click, call, and form submission is attributed back to a specific campaign and ad creative.",
      },
      {
        title: "Monthly Optimisation",
        body: "Every month we review performance against your CPA target, retire underperforming creatives, scale what is working, and report in plain language.",
      },
    ],
    outcomes: [
      {
        title: "You know exactly where every pound went.",
        body: "Full attribution from click to conversion. No estimated results, no vague impressions — actual revenue outcomes tied to actual spend.",
      },
      {
        title: "Campaigns that improve over time.",
        body: "Continuous creative testing means your cost-per-lead decreases as the campaign matures. The longer we run it, the more efficient it becomes.",
      },
      {
        title: "No surprises on the invoice.",
        body: "Your budget is agreed in advance and spent as directed. We never request increases without presenting the data that justifies it.",
      },
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
    processSteps: [
      {
        title: "Visibility Audit",
        body: "We audit your current local rankings, Google Business Profile health, citation consistency, and on-page optimisation across every relevant search term in your area.",
      },
      {
        title: "Strategy & Prioritisation",
        body: "We identify the highest-value search terms and the fastest routes to ranking improvement. We build a 90-day roadmap with clear milestones.",
      },
      {
        title: "Execution",
        body: "We implement every technical and content change: GBP optimisation, citation building, schema markup, on-page updates. No waiting for approvals on routine work.",
      },
      {
        title: "Monthly Reporting",
        body: "You receive a plain-language ranking report every month showing exactly where you moved, what we did, and what is planned next.",
      },
    ],
    outcomes: [
      {
        title: "Ranking for searches that have buying intent.",
        body: "Near-me and location-specific searches convert at a far higher rate than generic terms. We target the queries that bring clients, not visitors.",
      },
      {
        title: "A Google Business Profile that works for you.",
        body: "A fully optimised GBP generates calls, direction requests, and website visits without any paid spend. Most businesses leave this entirely uncaptured.",
      },
      {
        title: "Compounding returns over time.",
        body: "Unlike paid ads, SEO rankings compound. The work done in month one continues to generate value in month twelve and beyond.",
      },
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
    processSteps: [
      {
        title: "Brand & Audience Audit",
        body: "We review your existing presence, define your audience segments, and establish the content pillars that will resonate with them. We set the posting cadence and platform mix.",
      },
      {
        title: "Content Planning",
        body: "We build a monthly content calendar for your approval before any content is produced. You see the direction before we execute.",
      },
      {
        title: "Production & Scheduling",
        body: "We produce all graphics and copy, schedule everything in advance, and manage the publishing calendar without requiring your input on routine posts.",
      },
      {
        title: "Reporting & Refinement",
        body: "Monthly analytics report covering reach, engagement, and follower growth. We adjust the content mix based on what is performing.",
      },
    ],
    outcomes: [
      {
        title: "Consistent output without consuming your time.",
        body: "A regular posting cadence signals credibility to both your audience and the algorithm. We maintain it without requiring your involvement.",
      },
      {
        title: "Content that reflects your actual standard.",
        body: "Everything we produce is reviewed against your brand guidelines before publication. Your social presence will look like the business you actually run.",
      },
      {
        title: "You stay in control.",
        body: "You approve the content calendar every month. Nothing goes out that you haven't seen. You can redirect the strategy at any time.",
      },
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
    processSteps: [
      {
        title: "Reputation Audit",
        body: "We audit your current review profile across all relevant platforms, identify any negative content, and establish your baseline score and review velocity.",
      },
      {
        title: "System Design",
        body: "We design the review generation sequence: who gets asked, when, through which channel, and what the follow-up looks like if they don't respond.",
      },
      {
        title: "Implementation & Monitoring",
        body: "We implement the review system and configure real-time alerts so you are notified the moment a new review is posted anywhere.",
      },
      {
        title: "Ongoing Management",
        body: "We manage responses to all reviews on your behalf, escalate anything requiring your attention, and report on your reputation score monthly.",
      },
    ],
    outcomes: [
      {
        title: "A review profile that closes deals before you pick up the phone.",
        body: "Prospective clients read your reviews before they contact you. A strong, recent, well-responded review profile is the difference between a call and a scroll-past.",
      },
      {
        title: "Negative reviews handled before they compound.",
        body: "A single unaddressed negative review damages more than the client it references. We monitor and respond within 24 hours, every time.",
      },
      {
        title: "Reviews generated at the moment of highest satisfaction.",
        body: "The best time to ask for a review is immediately after delivery. Our automated sequences capture that moment systematically, not sporadically.",
      },
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
