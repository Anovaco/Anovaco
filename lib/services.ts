export type ProcessStep = { title: string; body: string };
export type Outcome = { title: string; body: string };

export type FeatureBlock = {
  title: string;
  body1: string;
  body2: string;
  panelLabel: string;
  panelMetric: string;
  panelRows: string[];
};

export type IndustryApplication = {
  name: string;
  context: string;
  useCases: string[];
  panelLabel: string;
  panelRows: string[];
};

export type FaqItem = { q: string; a: string };

export type DeliverableCard = { title: string; body: string };

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
  /** Optional richer sections — when present, the service page renders
   *  the alternating-features, industry-tabs, and FAQ blocks, and uses
   *  the redesigned 3-column card grid for "What's Included". */
  features?: FeatureBlock[];
  industryApplications?: IndustryApplication[];
  faqs?: FaqItem[];
  /** Per-item bodies for the redesigned 3-column card grid. When absent,
   *  the cards fall back to the strings in `included`. */
  includedDetails?: DeliverableCard[];
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
    includedDetails: [
      {
        title: "CRM architecture & integration",
        body: "We configure or build your CRM from the ground up — contact records, pipeline stages, tags, and automation triggers — so every lead is tracked and nothing falls through the cracks.",
      },
      {
        title: "Automated lead capture and nurture sequences",
        body: "From the moment a lead submits a form or calls your number, a personalised multi-step sequence begins. Email, SMS, or both — timed, written, and deployed without manual input.",
      },
      {
        title: "Booking, scheduling & confirmation systems",
        body: "We connect your booking system to your calendar, configure confirmation messages, and build reminder sequences that reduce no-shows and keep your calendar full automatically.",
      },
      {
        title: "Client onboarding and offboarding workflows",
        body: "Every new client triggers a structured onboarding sequence — welcome message, document collection, calendar confirmation, and CRM record creation. Every departing client receives a professional close-out and review request.",
      },
      {
        title: "Review solicitation pipelines",
        body: "A timed review request sequence triggers automatically after service delivery, directed to the platform that matters most for your business. No manual chasing, no missed opportunities.",
      },
      {
        title: "Operational audit & system documentation",
        body: "We map every automated touchpoint and deliver full written documentation of your system — what runs, when it runs, and what to do if anything needs adjusting. You own it completely.",
      },
    ],
    features: [
      {
        panelLabel: "LEAD RESPONSE TIME",
        panelMetric: "4 minutes",
        panelRows: [
          "Before: 6–48 hours · After: Under 4 min",
          "Automated across email, SMS, and phone",
          "Zero manual intervention required",
        ],
        title:
          "Every lead gets a response before your competitors pick up the phone.",
        body1:
          "Most businesses lose enquiries not because they don't have a good service, but because they're slow. The first business to respond wins the majority of leads. We automate that response to happen within minutes of every enquiry, regardless of when it arrives.",
        body2:
          "The sequence is triggered the moment a lead lands — whether through your website form, your Google Business Profile, or a direct call that goes unanswered. No lead goes cold because someone was busy.",
      },
      {
        panelLabel: "MONTHLY SYSTEM REPORT",
        panelMetric: "147 actions",
        panelRows: [
          "Leads captured · 147",
          "Follow-ups sent · 203",
          "Bookings confirmed · 61",
          "Reviews requested · 44",
        ],
        title: "You see exactly what your systems are doing, every month.",
        body1:
          "Every automation we build is fully documented and reported on. You receive a plain-language monthly report showing every action your system took, every lead it captured, and every touchpoint it managed on your behalf.",
        body2:
          "No black boxes. No dependency on us to explain what your own infrastructure is doing. Full visibility, every month, in language that doesn't require a technical background to understand.",
      },
      {
        panelLabel: "CLIENT ONBOARDING",
        panelMetric: "Day 1",
        panelRows: [
          "Welcome sequence · Sent automatically",
          "Documents requested · Via secure form",
          "Calendar invite · Confirmed",
          "CRM record · Created",
        ],
        title:
          "Your clients experience a professional process from the first touchpoint.",
        body1:
          "The onboarding experience is where clients form their lasting impression of your business. We build the sequences that make every new client feel expected, prepared, and in good hands — without requiring any manual effort from your team.",
        body2:
          "Every new client triggers the same professional sequence: a welcome message, a document request if needed, a calendar confirmation, and a CRM record. Consistent, automatic, and indistinguishable from a manually managed process.",
      },
    ],
    industryApplications: [
      {
        name: "Restaurant & Café",
        context:
          "Food and hospitality businesses live and die on reputation and repeat custom. Every missed enquiry and unanswered follow-up is a customer walking to the competitor down the street.",
        useCases: [
          "Automated booking confirmations and reminders",
          "Enquiry response within 4 minutes of contact",
          "Post-visit review request sequences",
          "Unanswered call follow-up automation",
          "Monthly reporting on every lead touchpoint",
        ],
        panelLabel: "AUTOMATION SNAPSHOT",
        panelRows: [
          "Enquiries auto-responded · 94",
          "Bookings confirmed · 61",
          "Review requests sent · 44",
          "Missed calls followed up · 17",
        ],
      },
      {
        name: "Salon, Spa & Barbershop",
        context:
          "Personal care businesses depend on repeat bookings and word-of-mouth. A structured follow-up system turns one-time clients into regulars without any manual effort.",
        useCases: [
          "Post-appointment review request automation",
          "Rebooking reminder sequences at 4 and 6 weeks",
          "New client welcome sequences",
          "Unanswered enquiry follow-up",
          "CRM integration with booking system",
        ],
        panelLabel: "RETENTION SYSTEM",
        panelRows: [
          "Rebooking reminders sent · 94",
          "Clients rebooked · 61",
          "Reviews generated · 11",
          "Welcome sequences triggered · 34",
        ],
      },
      {
        name: "Health & Wellness / Gym",
        context:
          "Fitness and wellness businesses need fast lead response and consistent follow-up. A prospect who doesn't hear back within an hour will book with someone else.",
        useCases: [
          "Instant lead response for trial and membership enquiries",
          "New member onboarding sequences",
          "Lapsed member reactivation campaigns",
          "Class booking confirmation and reminders",
          "Review requests after milestone achievements",
        ],
        panelLabel: "LEAD PIPELINE",
        panelRows: [
          "Enquiries responded in 4 min · 28",
          "Trial sessions booked · 19",
          "Members onboarded automatically · 11",
          "Lapsed members reactivated · 6",
        ],
      },
      {
        name: "Home Services",
        context:
          "Trades and home service businesses win on availability. A lead response system that operates outside business hours captures the jobs your competitors miss.",
        useCases: [
          "Out-of-hours lead capture and auto-response",
          "Quote request follow-up sequences",
          "Job completion review requests",
          "Appointment confirmation and reminder sequences",
          "CRM integration with job management software",
        ],
        panelLabel: "QUOTE PIPELINE",
        panelRows: [
          "Out-of-hours enquiries captured · 18",
          "Quote requests followed up · 28",
          "Jobs confirmed via automation · 23",
          "Reviews requested post-job · 23",
        ],
      },
      {
        name: "Retail Store",
        context:
          "Retail businesses have high enquiry volume and low follow-up rates. Automation captures the revenue that falls through the cracks between enquiry and purchase.",
        useCases: [
          "Website enquiry auto-response",
          "Abandoned enquiry follow-up sequences",
          "Post-purchase review requests",
          "Stock notification automations",
          "CRM integration with point-of-sale",
        ],
        panelLabel: "REVENUE CAPTURE",
        panelRows: [
          "Enquiries auto-responded · 147",
          "Abandoned enquiries followed up · 34",
          "Reviews requested · 67",
          "Repeat purchase sequences active · Yes",
        ],
      },
      {
        name: "Real Estate",
        context:
          "Property enquiries have a short window. A lead that doesn't receive a response within 5 minutes is statistically likely to contact another agent. Automation closes that window.",
        useCases: [
          "Instant response to portal and website enquiries",
          "Viewing confirmation and reminder sequences",
          "Post-transaction review requests",
          "Referral follow-up sequences",
          "CRM integration with property management software",
        ],
        panelLabel: "LEAD RESPONSE",
        panelRows: [
          "Enquiries responded in under 5 min · 41",
          "Viewings confirmed automatically · 28",
          "Post-transaction reviews requested · 18",
          "Referral sequences active · Yes",
        ],
      },
      {
        name: "Legal & Accounting",
        context:
          "Professional services enquiries are high-value and time-sensitive. A structured intake and follow-up process ensures no prospective client is lost to slow response or inconsistent communication.",
        useCases: [
          "Consultation booking automation",
          "Intake form sequences",
          "Follow-up for non-responsive leads",
          "Document request and collection workflows",
          "CRM integration with practice management software",
        ],
        panelLabel: "INTAKE SYSTEM",
        panelRows: [
          "Consultation requests auto-responded · 34",
          "Intake forms completed · 28",
          "Follow-up sequences active · Yes",
          "Documents collected automatically · 21",
        ],
      },
      {
        name: "Dental & Medical",
        context:
          "Healthcare providers lose patients to practices with faster response and better follow-up. Automated systems capture appointments that would otherwise go to competitors.",
        useCases: [
          "New patient enquiry auto-response",
          "Appointment confirmation and reminder sequences",
          "Lapsed patient reactivation",
          "Post-appointment review requests",
          "CASL-compliant communication sequences",
        ],
        panelLabel: "PATIENT PIPELINE",
        panelRows: [
          "New enquiries responded in 4 min · 34",
          "Appointments confirmed automatically · 89",
          "Lapsed patients reactivated · 14",
          "Reviews requested post-appointment · 89",
        ],
      },
      {
        name: "Contractor & Trade",
        context:
          "Contractors miss revenue by being unavailable during jobs. An automated lead response and follow-up system captures quotes and confirms bookings without interrupting the work on site.",
        useCases: [
          "Out-of-hours enquiry capture and response",
          "Quote follow-up sequences",
          "Job confirmation and reminder sequences",
          "Post-completion review requests",
          "CRM integration with estimating software",
        ],
        panelLabel: "JOB PIPELINE",
        panelRows: [
          "Enquiries captured out-of-hours · 18",
          "Quotes followed up automatically · 28",
          "Jobs confirmed via automation · 16",
          "Reviews requested post-completion · 16",
        ],
      },
      {
        name: "Other",
        context:
          "Whatever industry you operate in, the same principle applies — the business that responds fastest and follows up most consistently wins the majority of available work. Automation makes that possible at scale.",
        useCases: [
          "Custom enquiry response sequences",
          "Lead capture and follow-up automation",
          "Booking and appointment confirmation",
          "Review request automation",
          "Monthly reporting across all touchpoints",
        ],
        panelLabel: "GROWTH SYSTEMS",
        panelRows: [
          "Leads captured · Automated",
          "Follow-ups sent · Systematic",
          "Bookings confirmed · Automatic",
          "Reviews requested · Every time",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to build and deploy the automations?",
        a: "The majority of automation systems are fully operational within 2–3 weeks of our kickoff session. More complex multi-system integrations can take up to 4–5 weeks. We provide a fixed timeline at the end of your free audit before any work begins.",
      },
      {
        q: "Do I need to change the tools I'm currently using?",
        a: "Not necessarily. We audit your existing stack and build around it wherever possible. If we identify a tool that is significantly limiting what we can achieve, we'll tell you directly — but we never recommend changes unless the case for doing so is clear.",
      },
      {
        q: "What happens if something breaks after launch?",
        a: "Every system we build includes a testing phase and a full documentation handover. For the first 30 days post-launch, we monitor and resolve any issues at no additional charge. After that, we offer ongoing maintenance retainers or you can manage it internally using our documentation.",
      },
      {
        q: "Can automated follow-ups feel personal rather than generic?",
        a: "Yes — and this is one of the most important parts of what we do. Every sequence we write is personalised using the client's name, the service they enquired about, and the context of their enquiry. Done correctly, automated follow-up is indistinguishable from a personal response sent quickly.",
      },
      {
        q: "Do you work with our existing CRM?",
        a: "We work with the majority of CRM platforms including HubSpot, Salesforce, GoHighLevel, Zoho, and most booking systems. If you're on a less common platform, we'll assess compatibility during the audit and tell you clearly what is and isn't possible.",
      },
    ],
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
