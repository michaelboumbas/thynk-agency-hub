// Copy for the v8 interface — "Thynk Clear": calm, light, card-based (style benchmark: sleed.com),
// written for business owners (B2B). No particle Muse, no dark intro.
// Services, method, calculator and contact copy are shared with v5/v7; only v8-specific blocks live here.
export { about, calculator, contact, method, solutions } from "./site-v5";
export { epirus, pains, type PainId } from "./site-v7";

export const v8Nav = [
  { id: "for-whom", label: "Για ποιον" },
  { id: "services", label: "Υπηρεσίες" },
  { id: "method", label: "Πώς δουλεύουμε" },
  { id: "calculator", label: "Υπολογιστής" },
  { id: "team", label: "Ομάδα" },
] as const;

export const v8Assets = {
  muse: "/v8/muse-hero.webp",
  museFallback: "/avatar/muse-hero.png",
};

export const heroV8 = {
  eyebrow: "Digital agency · Ιωάννινα · Est. 2026",
  headlineStart: "Marketing και αυτοματισμοί που ",
  headlineAccent: "μετριούνται.",
  sub: "Για επιχειρήσεις της Ηπείρου έως 20 άτομα. Φέρνουμε πελάτες και βγάζουμε από τη μέση τις αγγαρείες της ομάδας σου. Πρώτα audit, μετά πρόταση με τιμή ανά γραμμή.",
  ctaPrimary: "Κλείσε Demo",
  ctaSecondary: "Υπολόγισε το κόστος των αγγαρειών",
  museCaption: "Η Μούσα · το πρόσωπο της Thynk",
  question: "Πού χάνει χρόνο η επιχείρησή σου;",
  questionHint: "Διάλεξε ένα. Ο υπολογιστής θα το έχει ήδη επιλεγμένο.",
};

/** The Sleed "partners" row, but with what we commit to instead of logos we don't have. */
export const commitments = [
  "Audit πριν από κάθε πρόταση",
  "Τιμή ανά γραμμή, όχι πακέτα",
  "Λογαριασμοί & δεδομένα στο όνομά σου",
  "Αν δεν αποδίδει, στο λέμε πρώτοι",
];

/** Who it's for: the verticals of file 04, each with the pain and where we usually start. */
export const forWhom = {
  eyebrow: "Για ποιον",
  title: "Για επιχειρήσεις που βγάζουν αρκετά για να επενδύσουν, αλλά δεν έχουν δικό τους marketer.",
  lead: "Ο ιδιοκτήτης τα κάνει σχεδόν όλα μόνος. Εκεί μπαίνουμε εμείς: στο κομμάτι που σου τρώει τον χρόνο και στο κομμάτι που φέρνει πελάτες.",
  segments: [
    {
      icon: "hotel",
      title: "Τουρισμός & φιλοξενία",
      who: "Ξενοδοχεία, καταλύματα, εστιατόρια",
      pain: "Μηνύματα και τηλέφωνα όλη μέρα, κρατήσεις από παντού, social που ανεβαίνουν «όποτε προλάβουμε».",
      start: "Βοηθός για μηνύματα & κρατήσεις · social με πρόγραμμα",
    },
    {
      icon: "office",
      title: "Επαγγελματικά γραφεία",
      who: "Λογιστικά, δικηγορικά, τεχνικά γραφεία",
      pain: "Παραστατικά, ραντεβού και ερωτήσεις πελατών που επαναλαμβάνονται κάθε εβδομάδα.",
      start: "Αυτόματη ροή εγγράφων · υπενθυμίσεις & ραντεβού",
    },
    {
      icon: "store",
      title: "Τοπικές επιχειρήσεις",
      who: "Καταστήματα, υπηρεσίες, παραγωγοί",
      pain: "Το Google δεν σε βρίσκει σωστά, οι διαφημίσεις «καίνε» λεφτά χωρίς να ξέρεις τι φέρνουν.",
      start: "Google Business Profile · ads που μετριούνται",
    },
  ],
};

export const servicesV8 = {
  eyebrow: "Υπηρεσίες",
  title: "Δύο πυλώνες. Ξεκινάμε από αυτόν που πονάει περισσότερο.",
  lead: "Άνοιξε έναν για να δεις τι περιέχει. Στην πράξη, τη σειρά την ορίζει το audit.",
};

export const methodV8 = {
  eyebrow: "Πώς δουλεύουμε",
  // each step ends with a decision point that belongs to the client (B2B: who decides, when)
  decisions: [
    "Αποφασίζεις αν προχωράμε, με τη λίστα στο χέρι.",
    "Αποφασίζεις με βάση τα νούμερα του πιλοτικού.",
    "Αποφασίζεις για κάθε νέα υπηρεσία ξεχωριστά.",
  ],
};

/** The Sleed "what Sleed truly means" stat block — numbers that are true by policy, not by claim. */
export const promiseStats = {
  eyebrow: "Τι σημαίνει Thynk",
  title: "Νούμερα που ισχύουν από την πρώτη μέρα.",
  lead: "Νούμερα απόδοσης θα δείξουμε όταν τα έχουμε μετρήσει στους πρώτους πελάτες μας. Μέχρι τότε, αυτά είναι τα δικά μας.",
  items: [
    { value: "0", label: "πακέτα «όλα μαζί». Πληρώνεις μόνο ό,τι χρειάζεσαι." },
    { value: "1", label: "ροή τη φορά. Η επόμενη μπαίνει όταν η πρώτη αποδείξει ότι αξίζει." },
    { value: "100%", label: "των λογαριασμών, κλειδιών και δεδομένων στο όνομα της επιχείρησής σου." },
    { value: "2", label: "ιδρυτές. Όποιον πάρεις τηλέφωνο, μιλάς με αυτόν που κάνει τη δουλειά." },
  ],
};

export const teamV8 = {
  eyebrow: "Ομάδα",
  title: "Δύο ιδρυτές, στα Γιάννενα.",
  note: "Κανένας account manager ανάμεσα. Business και νούμερα από τη μία πλευρά, marketing αθηναϊκού agency από την άλλη.",
};

export const extraFaq = [
  {
    q: "Ποιος από την ομάδα μου πρέπει να εμπλακεί;",
    a: "Αυτός που αποφασίζει και αυτός που κάνει σήμερα τη δουλειά. Ο πρώτος για να συμφωνήσουμε τι μετράμε, ο δεύτερος για να δούμε πώς γίνεται στην πράξη.",
  },
];

export const ctaBand = {
  title: "Ας δούμε πού χάνει χρόνο και πελάτες η επιχείρησή σου.",
  text: "30 λεπτά. Μας δείχνεις πώς δουλεύετε, σου δείχνουμε τι θα κοιτάζαμε στο audit. Αν δεν μπορούμε να βοηθήσουμε, θα στο πούμε.",
  cta: "Κλείσε Demo",
};

export const footerV8 = {
  line: "Thynk Digital Agency · Ιωάννινα · Est. 2026",
  small: "Με σκέψη, από τα Γιάννενα.",
};
