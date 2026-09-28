// Copy for the v7 interface — "Thynk Light": the site that thinks with you (the y in Thynk).
// White paper, ink, orange. Reuses the approved copy from v5/v6; only v7-specific blocks live here.
export { about, calculator, contact, method, solutions } from "./site-v5";
export { pinnedV6 } from "./site-v6";

export const v7Nav = [
  { id: "about", label: "Ποιοι είμαστε" },
  { id: "solutions", label: "Τι κάνουμε" },
  { id: "method", label: "Πώς δουλεύουμε" },
  { id: "calculator", label: "Υπολογιστής" },
  { id: "contact", label: "Επαφή" },
] as const;

export const v7Assets = {
  points: "/v6/muse-points.bin?v=5",
};

export type PainId = "phone" | "msg" | "social" | "clients" | "docs" | "quotes";

export const heroV7 = {
  eyebrow: "Thynk · Digital agency · Ιωάννινα",
  headlineTop: "Λιγότερες αγγαρείες.",
  headlineBottom: "Περισσότεροι πελάτες.",
  sub: "Marketing και αυτοματισμοί για επιχειρήσεις της Ηπείρου. Ξεκινάμε από το τι σε τρώει, όχι από το τι πουλάμε.",
  question: "Τι σε τρώει πιο πολύ αυτή την εβδομάδα;",
  questionHint: "Διάλεξε ένα. Η σελίδα θα σου δείξει πρώτα αυτό.",
  museLabel: "Η Μούσα",
  ctaCalc: "Δες πόσο σου κοστίζει",
  ctaTalk: "Πες μας γι' αυτό",
  founders: "Μιλάς απευθείας με τους ιδρυτές, τον Δημήτρη και τον Mike. Εδώ, στα Γιάννενα.",
};

/**
 * Each pain: chip label, the Muse's one-line answer (our voice: warm, direct, no promises we
 * can't measure), which calculator tasks to pre-select, which outcome to show first, which door.
 */
export const pains: {
  id: PainId;
  label: string;
  reply: string;
  calc: string[];
  outcome: number;
  pillar: "marketing" | "transformation";
}[] = [
  {
    id: "phone",
    label: "Τα τηλέφωνα",
    reply:
      "Α, τα τηλέφωνα. Χτυπάνε πάντα την ώρα που δεν μπορείς. Ένας βοηθός μπορεί να απαντάει, να κλείνει ραντεβού και να σου αφήνει σημείωμα. Εσύ σηκώνεις μόνο ό,τι χρειάζεται εσένα.",
    calc: ["phone"],
    outcome: 0,
    pillar: "transformation",
  },
  {
    id: "msg",
    label: "Μηνύματα & email",
    reply:
      "Τα μηνύματα που μένουν «για μετά», και το μετά δεν έρχεται ποτέ. Τα ταξινομούμε, απαντάμε στα απλά και σου κρατάμε μόνο τα σημαντικά.",
    calc: ["msg"],
    outcome: 3,
    pillar: "transformation",
  },
  {
    id: "social",
    label: "Τα social",
    reply:
      "Να ανεβάζεις κάτι «γιατί πρέπει» κουράζει. Στήνουμε πρόγραμμα, περιεχόμενο και απαντήσεις, και βλέπεις σε νούμερα τι σου φέρνει πελάτες.",
    calc: ["social"],
    outcome: 3,
    pillar: "marketing",
  },
  {
    id: "clients",
    label: "Δεν έρχονται αρκετοί πελάτες",
    reply:
      "Εκεί ξεκινάμε από τα νούμερα: από πού έρχονται σήμερα, πού χάνονται και πού αξίζει να πάει το πρώτο ευρώ. Χωρίς να σου τάξουμε φεγγάρια.",
    calc: ["quotes", "social"],
    outcome: 2,
    pillar: "marketing",
  },
  {
    id: "docs",
    label: "Τιμολόγια & χαρτιά",
    reply:
      "Τα χαρτιά δεν τελειώνουν ποτέ. Τα στοιχεία από τιμολόγια και παραστατικά μπορούν να περνάνε μόνα τους εκεί που πρέπει. Ο έλεγχος μένει σε σένα.",
    calc: ["docs", "reports"],
    outcome: 5,
    pillar: "transformation",
  },
  {
    id: "quotes",
    label: "Προσφορές & follow-up",
    reply:
      "Η προσφορά φεύγει και μετά… σιωπή. Βάζουμε το follow-up να γίνεται μόνο του, την ώρα που πρέπει, με τα δικά σου λόγια.",
    calc: ["quotes"],
    outcome: 2,
    pillar: "marketing",
  },
];

export const notDo = {
  eyebrow: "Για να ξέρεις από την αρχή",
  title: "Τι δεν κάνουμε",
  items: [
    { no: "Πακέτα «όλα μαζί».", yes: "Πληρώνεις μόνο ό,τι χρειάζεσαι, με τιμή ανά γραμμή." },
    { no: "E-shops από το μηδέν.", yes: "Αν έχεις ήδη κατάστημα, δουλεύουμε πάνω του." },
    { no: "Υποσχέσεις χωρίς νούμερα.", yes: "Ό,τι σου λέμε, το μετράμε και στο δείχνουμε." },
    { no: "Λογαριασμούς στο όνομά μας.", yes: "Κλειδιά, λογαριασμοί και δεδομένα μένουν δικά σου." },
  ],
};

export const epirus = {
  eyebrow: "Από εδώ",
  title: "Από τα Γιάννενα, για την Ήπειρο.",
  text: "Η έδρα μας είναι στα Γιάννενα και δουλεύουμε με επιχειρήσεις σε όλη την Ήπειρο, και όχι μόνο. Όποτε χρειάζεται, τα λέμε από κοντά.",
  // lat, lon of real places (projected in the component); home = Ioannina
  places: [
    { name: "Ιωάννινα", lat: 39.665, lon: 20.853, home: true },
    { name: "Μέτσοβο", lat: 39.77, lon: 21.182 },
    { name: "Κόνιτσα", lat: 40.045, lon: 20.748 },
    { name: "Ηγουμενίτσα", lat: 39.506, lon: 20.265 },
    { name: "Πάργα", lat: 39.285, lon: 20.4 },
    { name: "Πρέβεζα", lat: 38.959, lon: 20.751 },
    { name: "Άρτα", lat: 39.16, lon: 20.985 },
  ],
};

// Founders (Δημήτρης first, then Mike): initials are placeholders until photos + final bios arrive.
export const teamV7 = {
  eyebrow: "Ποιοι είμαστε",
  note: "Είμαστε δύο. Όποιον από τους δύο πάρεις τηλέφωνο, μιλάς με ιδρυτή.",
};

export const footerV7 = {
  line: "Thynk Digital Agency · Ιωάννινα · Est. 2026",
  small: "Με σκέψη, από τα Γιάννενα.",
};
