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
  text: "Thynk Digital Agency is based in Ioannina, Greece, and specializes in marketing and digital transformation with artificial intelligence. We design and build solutions that cut repetitive work and bring in measurable customers. We work with businesses across Greece and abroad, and in every engagement the founders are directly responsible.",
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
  lead: "A selection of the solutions Thynk designs and builds. Client projects are shown only with their explicit permission.",
  note: "Hover over the first four to see how they work. Illustrative examples, not client projects.",
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
  lead: "A short description of your business and your priorities.",
  name: { label: "NAME", placeholder: "Your name", error: "Please enter your name." },
  biz: { label: "BUSINESS", placeholder: "Company name", error: "Please enter your business." },
  email: { label: "EMAIL", placeholder: "name@company.com", error: "Please enter a valid email." },
  pain: { label: "WHAT SHOULD WE LOOK AT FIRST", options: ["Calls & appointments", "Messages & email", "Social media", "Customer acquisition", "Invoices & documents", "Quotes"] },
  submit: "Send",
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
      q: "Do you only work with businesses in Ioannina?",
      a: "No. We are based in Ioannina, but we work with businesses across Greece and abroad.",
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
  city: "Ioannina, Greece",
  year: "© 2026",
  faq: "FAQ",
  contactLabel: "Contact",
};

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
    foot: "Illustrative example · leads",
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
