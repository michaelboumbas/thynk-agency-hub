// v14 «Thynk Clean» (02/10/2026, Mike): the ubernatural.io style on a white page, our colours, our copy.
// 02/10 (Mike): the whole website is in English. These strings are English translations of the approved
// Greek copy (v9/v11/v12, plural "you"). Nothing new is claimed.
// Prototype it was approved from: https://claude.ai/artifact/M9Eqtsp9yAaiH1j7uykBJ9

export const v14Nav = [
  { id: "method", label: "Method" },
  { id: "solutions", label: "Solutions" },
  { id: "audit", label: "The audit" },
  { id: "team", label: "About us" },
] as const;

export const v14Hero = {
  lead: "The future of",
  accent: "Super",
  last: " Intelligence.",
  formulaStrong: "Human Intelligence + Artificial Intelligence.",
  formula: "Your team's judgment and experience, combined with the speed of artificial intelligence.",
  primary: "Book an audit",
  secondary: "Our method →",
};

export const v14About = {
  label: "Thynk",
  text: "Your business gains more customers, more efficient operations and growth that shows in the results. We deliver it by combining strategic marketing with digital transformation, with artificial intelligence at the core of every solution. We work as a strategic partner: we take on your goals as our own and invest in achieving them.",
  founders: "Dimitris Chrysochoou & Michael Boumpas",
  foundersNote: "A senior team you talk to directly. Every engagement starts with an audit.",
};

export const v14Method = {
  title: "Method",
  stepWord: "Stage",
  steps: [
    { title: "Audit", text: "We analyze how your business runs today: how customers find you, where time and opportunities are lost, and which metrics you track." },
    { title: "Strategy", text: "The audit findings become a prioritized action plan: what to do first, what can wait, and what we don't recommend." },
    { title: "Implementation", text: "We build the highest-value change first and pilot it alongside the way you work today." },
    { title: "Scale", text: "We measure results, optimize, and move on to the next priority in the plan, with Thynk Care." },
  ],
};

export type ScreenId = "bookings" | "followup" | "report" | "invoices" | "audit";

export const v14Solutions = {
  label: "Solutions",
  title: "Solutions",
  lead: "A selection of the solutions Thynk designs and builds.",
  note: "Hover over the first four to see how they work.",
  items: [
    { name: "24/7 booking assistant", tags: "Bookings · Website, Messenger, Instagram", pillar: "Digital Transformation", screen: "bookings" },
    { name: "Quote follow-up", tags: "Sales · CRM", pillar: "Digital Transformation", screen: "followup" },
    { name: "Weekly performance report", tags: "Google, Meta, sales", pillar: "Marketing", screen: "report" },
    { name: "Automatic invoice entry", tags: "Admin · Accounting records", pillar: "Digital Transformation", screen: "invoices" },
    { name: "Measurable advertising", tags: "Google and Meta, tied to sales", pillar: "Marketing" },
    { name: "Organized social media", tags: "Content calendar, AI-assisted production, messages", pillar: "Marketing" },
    { name: "Email marketing", tags: "Abandoned carts, repeat purchases, updates", pillar: "Marketing" },
    { name: "AI voice assistant", tags: "After-hours calls, appointments", pillar: "Digital Transformation" },
    { name: "Performance dashboards", tags: "Your key metrics on one page", pillar: "Digital Transformation" },
    { name: "Internal AI assistant", tags: "Answers from your own company documents", pillar: "Digital Transformation" },
  ] as { name: string; tags: string; pillar: string; screen?: ScreenId }[],
};

export const v14Audit = {
  titleStart: "Before any proposal, ",
  titleAccent: "analysis.",
  panels: [
    { kicker: "01 · The audit looks at", sub: "Online presence", title: "Online presence and customer acquisition.", text: "Google, social media, website and advertising: where your customers come from today and where you lose them.", tone: "paper" },
    { kicker: "02 · The audit looks at", sub: "Processes", title: "Day-to-day operations.", text: "Calls, messages, invoices, quotes: which tasks are done by hand and could be automated.", tone: "ink" },
    { kicker: "03 · The audit looks at", sub: "Data", title: "Measurement and data.", text: "Which metrics you track, which are missing, and how reliable your data is.", tone: "paper" },
    { kicker: "04 · Deliverable", sub: "Yours to keep", title: "What first, what next, what not to do.", text: "A prioritized findings report, presented in a meeting with our team. It stays yours, whether or not we keep working together.", tone: "orange" },
    { kicker: "How we use AI", sub: "Human oversight", title: "AI prepares. A person approves.", text: "Every sensitive action is approved by a person before it runs. Accounts and data belong to your business.", tone: "ink" },
  ] as { kicker: string; sub: string; title: string; text: string; tone: "paper" | "ink" | "orange" }[],
};

export const v14Team = {
  label: "About us",
  people: [
    { name: "Dimitris Chrysochoou", role: "Co-founder · Business, data & automation", focus: "Automation, data, costing, processes", email: "dimitris@thynkagency.gr" },
    { name: "Michael Boumpas", role: "Co-founder · Marketing, advertising & creative", focus: "Advertising, social media, content, brand", email: "mike@thynkagency.gr" },
  ],
};

export const v14Book = {
  title: "Book an audit",
  lead: "Tell us a little about your business, so we come to the first conversation prepared.",
  // labels are written in capitals in the copy (no CSS uppercase; Greek capitals have no accents)
  first: { label: "FIRST NAME", placeholder: "Your first name", error: "Please enter your first name." },
  last: { label: "LAST NAME", placeholder: "Your last name", error: "Please enter your last name." },
  email: { label: "EMAIL", placeholder: "name@company.com", error: "Please enter a valid email." },
  phone: { label: "PHONE", placeholder: "+30 …", error: "Please enter a valid phone number." },
  biz: { label: "BUSINESS", placeholder: "Company name", error: "Please enter your business." },
  industry: {
    label: "INDUSTRY",
    placeholder: "Select your industry",
    error: "Please select your industry.",
    options: ["Hotel / hospitality", "Restaurant / café", "Retail / e-shop", "Clinic / health", "Professional services (accounting, legal, consulting)", "Construction / technical services", "Education / training", "Other"],
  },
  optional: "optional",
  pain: {
    label: "WHAT SHOULD WE LOOK AT FIRST",
    error: "Please choose one option.",
    options: ["Marketing: advertising, social media, content", "Digital transformation: automation, AI, data & reporting", "Both", "Not sure yet: a full review"],
  },
  submit: "Send request",
  // front-end only until the back-end (n8n / inbox) is connected
  sent: "Thank you. The form isn't connected to our inbox yet, so please also email hello@thynkagency.gr.",
};

export const v14Faq = {
  title: "Frequently asked",
  titleGrey: "questions.",
  note: "Anything else: hello@thynkagency.gr",
  items: [
    {
      q: "What does the audit include?",
      a: "It is a short, paid service: we analyze your online presence and your processes and deliver a list of actions in order of priority. The deliverable stays yours, whatever happens next.",
    },
    {
      q: "What kind of businesses do you work with?",
      a: "Businesses that already have customers and processes, but lose valuable time on repetitive tasks and don't have a clear picture of how their marketing performs. In any industry, across Greece and abroad.",
    },
    {
      q: "Will AI replace people in my business?",
      a: "That is not the goal. AI takes on repetitive tasks and prepares the next steps. Every sensitive decision is approved by a person, and control stays with your business.",
    },
    {
      q: "Do we need to change the systems we already use?",
      a: "Usually not. Our solutions connect to the tools you already have: calendar, email, accounting software, CRM.",
    },
  ],
};

export const v14Footer = {
  contact: "hello@thynkagency.gr",
  // office address + phone (Dimitris's mobile) confirmed by Mike (10/10).
  phone: "+30 698 399 7522",
  address: "Papazoglou 14D, 454\u00a044 Ioannina",
  year: "© 2026",
  faq: "FAQ",
  contactLabel: "Contact",
  phoneLabel: "Phone",
  addressLabel: "Address",
  // the same English line in both languages (Mike 03/10); the dot after Thynk is the brand dot
  ctaA: "Let's Thynk",
  ctaB: "Together",
  // footer v2 (Mike 10/10): the audit form's «what should we look at first» choices; the button names the choice
  startLabel: "What should we look at first?",
  picks: ["Marketing", "Digital transformation", "Marketing + digital transformation", "Full review"],
  followLabel: "Follow",
  visits: "Office visits by appointment",
  pagesLabel: "Pages",
  officeLabel: "Office",
  backTop: "Back to top",
  rights: "All rights reserved.",
};

/* social profiles in the footer (the same handles as the Coming Soon page) */
export const v14Social = [
  { label: "Instagram", href: "https://www.instagram.com/thynkagency.gr/" },
  { label: "Facebook", href: "https://www.facebook.com/thynkagency.gr/" },
] as const;

/* the small UI screens that peek over the solutions list (from the site-v9 examples) */
export const v14Screens = {
  bookings: {
    app: "Booking assistant",
    chip: "Instagram",
    chat: [
      { me: false, t: "Do you have a double room from 14 to 16 August?" },
      { me: true, t: "Yes, one is available. Two nights with breakfast. Shall I hold it for you?" },
      { me: false, t: "Yes, for two people." },
    ],
    status: "Provisional booking",
    foot: "Waiting for your approval",
  },
  followup: {
    app: "Quotes",
    chip: "#218",
    rows: [
      { t: "Quote sent", s: "ok" },
      { t: "No reply for 3 days", s: "ok" },
      { t: "Reminder ready", s: "wait" },
      { t: "Logged in the CRM", s: "ok" },
    ],
  },
  report: {
    app: "Weekly report",
    chip: "Monday",
    bars: [
      { t: "Google Search", v: 82, flag: false },
      { t: "Meta · Reels", v: 64, flag: false },
      { t: "Meta · Images", v: 28, flag: true },
      { t: "Google Maps", v: 47, flag: false },
    ],
    foot: "Leads by source",
  },
  invoices: {
    app: "Incoming invoices",
    chip: "4 new",
    rows: [
      { t: "Electricity · September", v: "€184.20", flag: false },
      { t: "Paper supplier", v: "€1,240.00", flag: false },
      { t: "Telecom", v: "To check", flag: true },
      { t: "A/C maintenance", v: "€320.00", flag: false },
    ],
  },
  audit: {
    app: "Audit deliverable",
    chip: "Hotel, 14 rooms",
    rows: [
      { t: "Booking messages answered by hand", tag: "First", tone: "o" },
      { t: "Google Business Profile", tag: "First", tone: "o" },
      { t: "Booking tracking", tag: "Next", tone: "" },
      { t: "New website", tag: "Not recommended", tone: "k" },
    ],
  },
} as const;

/* ======================= pages (02/10, Mike: whole site in the v14 style, in English) ======================= */

export const v14Routes = {
  home: "/",
  services: "/services",
  solutions: "/solutions",
  work: "/work",
  audit: "/audit",
  about: "/about",
  contact: "/contact",
} as const;

export const v14Menu = [
  { to: v14Routes.services, label: "Services" },
  { to: v14Routes.solutions, label: "Solutions" },
  { to: v14Routes.work, label: "Clients" },
  { to: v14Routes.audit, label: "Audit" },
  { to: v14Routes.about, label: "About" },
  { to: v14Routes.contact, label: "Contact" },
] as const;

export const v14More = {
  method: "All services →",
  solutions: "All solutions →",
  audit: "How the audit works →",
  team: "About →",
  work: "All clients →",
};

export const v14PageHeads = {
  services: {
    label: "Services",
    title: "Services",
    lead: "Marketing and digital transformation with AI. From advertising to automation, every service fits into a plan that starts with an audit.",
  },
  solutions: {
    label: "Solutions",
    title: "Solutions",
    lead: "Automation that works alongside your team, designed and built by Thynk.",
  },
  work: {
    label: "Clients",
    title: "Clients",
    lead: "From a 20-year business award institution to a monastic winery in the Pindus mountains: different worlds, one way of working. Every account below runs through Thynk: strategy, content, campaigns and the systems behind them.",
  },
  audit: {
    label: "The audit",
    title: "Audit",
    lead: "A short, paid service with a specific deliverable that stays yours, whatever happens next.",
  },
  about: {
    label: "About",
    title: "About",
    lead: "Thynk Digital Agency is based in Ioannina, Greece, and specializes in marketing and digital transformation with artificial intelligence. We work with every business as a strategic partner.",
  },
  contact: {
    label: "Contact",
    title: "Contact",
    lead: "Visit us at the office, call or send an email. For a full picture of your business, start with an audit.",
  },
};

/* the contact page (02/10, Mike). Address + phone confirmed 10/10. ⚠️ office hours are still DEMO values. */
export const v14ContactPage = {
  cardsLabel: "Get in touch",
  cards: [
    { id: "address", kicker: "Office", value: "Papazoglou 14D", sub: "454 44 Ioannina, Greece", action: "Get directions" },
    { id: "phone", kicker: "Phone", value: "+30 698 399 7522", sub: "Mon–Fri, 09:00–17:00", action: "Call us" },
    { id: "email", kicker: "Email", value: "hello@thynkagency.gr", sub: "For questions and proposals", action: "Send an email" },
  ],
  mapsQuery: "Papazoglou 14D, 454 44 Ioannina",
  hoursTitle: "Office hours",
  hours: [
    { d: "Monday – Friday", t: "09:00 – 17:00" },
    { d: "Saturday – Sunday", t: "Closed" },
  ],
  hoursNote: "Office visits by appointment, so the right person is there for you.",
  mapTitle: "Map: Thynk office in Ioannina",
  bookTitle: "Ready for a clear picture of your business?",
  bookText: "The audit shows where you lose time and customers, and what to fix first.",
  bookButton: "Book an audit",
  stepsTitle: "What happens next",
  steps: [
    { title: "You get in touch", text: "By phone, email or the audit form, whichever suits you." },
    { title: "A short call", text: "We get to know your business and what matters most to you right now." },
    { title: "The next step", text: "If there is a fit, we propose an audit with a clear scope and cost." },
  ],
};

export const v14Pillars = {
  note: "We don't build e-shops. For existing online stores we take on marketing and automation.",
  items: [
    {
      id: "marketing",
      tag: "Growing your customer base",
      title: "Marketing",
      sub: "Advertising, social media and email marketing, within one strategy.",
      groups: [
        {
          title: "Advertising you can measure",
          items: [
            "Google Ads (Search, Shopping, Performance Max) measured in customers, not just clicks.",
            "Products on Google Shopping with photo and price.",
            "TikTok Ads for audiences you can't reach through Google and Meta.",
            "Campaign planning before launch: goal, budget, audience.",
            "A/B testing on copy, images and calls to action.",
            "Clear, regular performance reports.",
          ],
        },
        {
          title: "Social & content",
          items: [
            "Content strategy and calendar built on your brand.",
            "Facebook, Instagram, TikTok and LinkedIn management, with timely replies to messages.",
            "Professional copy for website, ads, email and blog.",
            "Graphic design consistent with your identity.",
            "UGC and short-form video for Reels, TikTok and Shorts.",
            "AI brand ambassadors, where they serve the strategy.",
          ],
        },
        {
          title: "Email, SMS & automated messages",
          items: [
            "Automated messages for abandoned carts, upsell and repeat purchases.",
            "Klaviyo flows and Mailchimp newsletters.",
            "SMS campaigns for time-sensitive offers and updates.",
            "Contacts organized in HubSpot or Brevo, so every message is relevant.",
          ],
        },
      ],
    },
    {
      id: "transformation",
      tag: "Operational efficiency",
      title: "Digital Transformation",
      sub: "AI automation, data and reporting, consulting and landing pages.",
      groups: [
        {
          title: "AI automation & data",
          items: [
            "AI chatbot that answers questions and books appointments on your website and social media.",
            "Voice assistant for after-hours calls.",
            "Connecting your tools to automate repetitive tasks.",
            "Custom AI agents and GPTs built on your own data.",
            "GEO: optimizing to be cited by ChatGPT and Google AI Overviews.",
            "GA4 and GTM setup, Looker Studio dashboards with reliable data.",
          ],
        },
        {
          title: "Consulting & growth",
          items: [
            "A roadmap from manual processes to automated systems.",
            "Workshops that train your team to use AI day to day.",
            "Growth strategy sessions with a concrete action plan.",
          ],
        },
        {
          title: "Website & landing pages",
          items: ["Landing pages and company websites designed to convert."],
        },
      ],
    },
  ],
};

export const v14Examples = {
  label: "",
  items: [
    {
      id: "bookings" as ScreenId,
      tag: "Bookings",
      title: "A digital booking assistant, around the clock",
      text: "Answers questions about availability, prices and opening hours instantly on your website, Messenger and Instagram. Requests that need a person are passed to your team with the full history.",
      punch: "Instant service for the customer, full control for your team.",
    },
    {
      id: "followup" as ScreenId,
      tag: "Sales",
      title: "Automated quote follow-up",
      text: "Every quote is tracked. When the customer doesn't reply, the system prepares a reminder at the right moment and submits it for your approval in one click.",
      punch: "No quote left without a follow-up.",
    },
    {
      id: "report" as ScreenId,
      tag: "Marketing",
      title: "Weekly performance report",
      text: "Data from Google, Meta and your sales is gathered into one report every Monday: what worked, what didn't, and which changes we recommend.",
      punch: "Decisions based on data.",
    },
    {
      id: "invoices" as ScreenId,
      tag: "Admin",
      title: "Automatic invoice entry",
      text: "Invoices you receive by email are recognized, their details are entered into your accounting records, and discrepancies are flagged for review.",
      punch: "Less manual entry, full control.",
    },
  ],
};

export const v14MoreIdeas = {
  title: "More solutions",
  lead: "Every business has different needs. These are the most common starting points.",
  groups: [
    {
      tag: "Marketing",
      items: [
        { t: "Measurable advertising", d: "Google and Meta campaigns tied to bookings, calls and sales, not just clicks." },
        { t: "Organized social media", d: "A content calendar, AI-assisted production and timely replies to messages." },
        { t: "Email marketing", d: "Automated flows for abandoned carts, repeat purchases and updates." },
      ],
    },
    {
      tag: "Digital Transformation",
      items: [
        { t: "AI voice assistant", d: "Answers after-hours calls, logs requests and books appointments." },
        { t: "Performance dashboards", d: "Your key business metrics on one page, updated automatically." },
        { t: "Internal AI assistant", d: "Answers your team's questions based on your company documents and processes." },
      ],
    },
  ],
};

export const v14AuditPage = {
  sample: {
    label: "Sample deliverable",
    business: "Hotel, 14 rooms",
    items: [
      { tag: "First", tone: "o", text: "Booking messages are answered by hand, 2–3 hours a day." },
      { tag: "First", tone: "o", text: "The Google Business Profile shows the wrong hours and no photos." },
      { tag: "Next", tone: "", text: "Ads run without tracking bookings." },
      { tag: "Not recommended", tone: "k", text: "A new website. The current one covers today's needs." },
    ],
    foot: "",
  },
  stepsTitle: "How it works",
  steps: [
    { title: "Request", text: "A short description of your business and your priorities." },
    { title: "Analysis", text: "We review your presence and processes. Anything we need is requested in advance." },
    { title: "Presentation", text: "We present the findings, prioritized and explained. The decision on what comes next is yours." },
  ],
  faqTitle: "Questions about the audit and pricing",
  faq: [
    { q: "How much does the audit cost?", a: "The audit is a short, paid service and its cost is shared before we start. It isn't free, because it is real work with a deliverable you can use whatever happens next." },
    { q: "What if we don't continue after the audit?", a: "The deliverable stays yours and you can implement it with any partner you like. If you don't need a service, we'll tell you." },
    { q: "How are your services priced?", a: "Each service is priced separately, based on the size of the business and the workload. The detailed proposal is presented after the audit. We don't sell all-in-one packages." },
    { q: "Do you build e-shops?", a: "No. For existing online stores we take on advertising, email marketing and abandoned cart recovery." },
  ],
  bookSide: {
    title: "The first step is a clear picture of where you are today.",
    text: "Once the audit is done, you know what your business needs, in what order, and why.",
    mail: "Prefer email?",
  },
};

export const v14Calc = {
  label: "Calculator",
  open: "Calculate your cost",
  close: "Close",
  cta: "Book an audit",
  title: "What do repetitive tasks cost you?",
  lead: "Enter your team's numbers for an instant, indicative estimate. The exact figure comes from the audit.",
  industry: "INDUSTRY",
  industries: [
    { id: "clinic", label: "Clinic / medical practice" },
    { id: "office", label: "Accounting / law office" },
    { id: "hosp", label: "Hotel / restaurant" },
    { id: "retail", label: "Retail / e-shop" },
    { id: "build", label: "Construction / technical services" },
    { id: "other", label: "Other" },
  ],
  team: "People on the team",
  hours: "Hours per person per week on repetitive tasks",
  rate: "Hourly labor cost",
  where: "WHERE IS TIME LOST?",
  tasks: {
    phone: { label: "Calls & appointments", opp: "Digital assistant for calls & appointments" },
    msg: { label: "Messages & email", opp: "Automatic sorting of email & messages" },
    docs: { label: "Invoices & documents", opp: "Automatic invoice entry" },
    reports: { label: "Reports & Excel", opp: "Automated reports" },
    social: { label: "Social media", opp: "Organized content production & publishing" },
    quotes: { label: "Quotes & follow-up", opp: "Automated quote follow-up" },
  },
  yearLabel: "Yearly cost of repetitive tasks",
  perYear: "/ year",
  monthHours: "hours a month",
  autoHours: "hours/month that could be automated",
  start: "Suggested starting points",
  hoursShort: "h",
  how: (team: number, hours: number, rate: number) =>
    `${team} people × ${hours} hours × 4.33 weeks × €${rate}. The estimate assumes 25–40% of the tasks you picked can be automated. The real share is measured in the audit.`,
  note: "Estimate based on averages. In the audit, the numbers are calculated with your real data.",
};

export const v14AboutPage = {
  founders: [
    { initials: "DC", name: "Dimitris Chrysochoou", photo: "/team/dimitris-chrysochoou.webp", linkedin: "https://www.linkedin.com/in/dimitris-chrysochoou/" },
    { initials: "MB", name: "Michael Boumpas", photo: "/team/michael-boumpas.webp", linkedin: "https://www.linkedin.com/in/michael-boumpas/" },
  ],
  teamLabel: "The team",
  linkedinLabel: "LinkedIn",
  linkedinAria: "on LinkedIn",
  valuesTitle: "How we work",
  valueWord: "Principle",
  values: [
    { t: "Transparency", d: "We share every finding, even when it isn't what you expected." },
    { t: "Accountable for value", d: "If a service isn't delivering the value you're paying for, we'll be the first to say so." },
    { t: "Clarity", d: "No unnecessary jargon. Every proposal is understandable and measurable." },
    { t: "Collaboration", d: "Real collaboration is a precondition for any result." },
  ],
  rulesStart: "How we use ",
  rulesAccent: "AI.",
  rulesKicker: "How we use AI",
  rules: [
    { title: "Data ownership", text: "Accounts, access keys and data belong to your business and stay with it, in every case." },
    { title: "Human oversight", text: "Every sensitive action is prepared by AI and approved by a person before it runs." },
    { title: "Full control", text: "Operating limits, approval steps and the ability to switch everything off at once." },
  ],
};


/* the work page and the case pages (07/10, Mike): the cases themselves live in src/content/work-v14.ts */
export const v14Work = {
  title: "Brands we Thynk with.",
  titleGrey: "Thynk it. Build it. Run it.",
  homeLabel: "Clients",
  view: "View the case",
  back: "← All clients",
  next: "Next case",
  visit: "Visit",
  labels: {
    context: "Context",
    brief: "The brief",
    work: "What we do",
    workDone: "What we did",
    deliverables: "Deliverables",
    results: "Results",
    services: "Services",
  },
  status: {
    ongoing: "Ongoing",
    onboarding: "Onboarding",
    delivered: "Delivered",
  },
  // 09/10 (Mike): «Since 2026», no month, no «Ongoing»; an event shows its edition
  sinceLabel: "Since {year}",
  editionLabel: "{year} edition",
};


export const v14Final = {
  title: "The first step is a clear picture of where you are today.",
  button: "Book an audit",
};


/* ======================= two languages (02/10, Mike: Greek version next to English) ======================= */
export type Lang = "en" | "el";
export type V14Path = (typeof v14Routes)[keyof typeof v14Routes];
/** the same page in Greek lives under /el */
export type ElPath = "/el" | `/el${Exclude<V14Path, "/">}`;

const enRaw = {
  lang: "en",
  locale: "en-US",
  ui: {
    skip: "Skip to content",
    mainMenu: "Main menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Thynk, home",
    auditAria: "Audit",
    switchTo: "EL",
    switchAria: "Ελληνικά",
    homeLabel: "Home",
    contact: "Contact",
  },
  menu: v14Menu,
  more: v14More,
  hero: v14Hero,
  about: v14About,
  method: v14Method,
  solutions: v14Solutions,
  audit: v14Audit,
  team: v14Team,
  book: v14Book,
  faq: v14Faq,
  footer: v14Footer,
  screens: v14Screens,
  pageHeads: v14PageHeads,
  pillars: v14Pillars,
  examples: v14Examples,
  moreIdeas: v14MoreIdeas,
  auditPage: v14AuditPage,
  calc: v14Calc,
  aboutPage: v14AboutPage,
  contactPage: v14ContactPage,
  work: v14Work,
  final: v14Final,
};

// The Greek copy must have exactly the same shape as the English one. Strings are widened to `string`;
// ids, paths and tones keep their literal types (they drive the UI, not the words).
type Keep = "id" | "screen" | "to" | "tone" | "how";
type Widen<T> = T extends string
  ? string
  : T extends number | boolean
    ? T
    : T extends (...a: never[]) => unknown
      ? T
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { [K in keyof T]: K extends Keep ? T[K] : Widen<T[K]> };
export type Copy = Widen<typeof enRaw>;
export const en: Copy = enRaw;
