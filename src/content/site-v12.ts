// v12 = v11 + a typographic hero (01/10/2026, Mike: hero option «α» after the Decide AI / SVZ references).
// Big English display line on top, Greek lead + CTA underneath. The hands hero moves down as the
// "human in the loop" moment. Preview only: ?v=12 (headline variant with &h=bi | hi | si).

export type HeadlineId = "bi" | "hi" | "si";

export const headlines: Record<HeadlineId, { lead: string; word: string; last: string; tag: string }> = {
  // Business Intelligence is a real, established category (data, dashboards, KPIs) and fits our data pillar.
  bi: { lead: "The future of", word: "Business", last: "Intelligence.", tag: "BI" },
  // Our own twist: the AI does the work, people decide ("άνθρωπος στη μέση").
  hi: { lead: "The future of", word: "Human", last: "Intelligence.", tag: "HI" },
  // Chosen by Mike (01/10). Defined right under the title as Human + Artificial Intelligence, so it reads as
  // our "human in the loop" rule, not as a claim about superhuman AI.
  si: { lead: "The future of", word: "Super", last: "Intelligence.", tag: "SI" },
};

export const typeHero = {
  eyebrow: "Thynk Digital Agency · Ιωάννινα",
  // the four stages of the method (05 · Ορολογία)
  stages: ["Audit", "Στρατηγική", "Υλοποίηση", "Κλιμάκωση"],
  // the tagline under the title: what "Super Intelligence" means for us
  formula: [
    { label: "Human Intelligence", short: "HI" },
    { label: "Artificial Intelligence", short: "AI" },
    { label: "Super Intelligence", short: "SI" },
  ],
  formulaNote: "Η κρίση και η εμπειρία της ομάδας σας, μαζί με την ταχύτητα της τεχνητής νοημοσύνης.",
  leadStrong: "Marketing και Digital Transformation με AI, για επιχειρήσεις.",
  lead: "Η Thynk σχεδιάζει και υλοποιεί λύσεις που μειώνουν τις επαναλαμβανόμενες εργασίες και φέρνουν μετρήσιμους πελάτες. Κάθε συνεργασία ξεκινά με audit.",
  primary: "Κλείστε audit",
  secondary: "Δείτε τις λύσεις μας",
};

// the hands, further down: the rule in words
export const handsMoment = {
  eyebrow: "Ο κανόνας μας για το AI",
};
