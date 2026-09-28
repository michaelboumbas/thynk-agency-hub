// Copy for the v6 interface (long scroll, particle-Muse intro).
// Reuses the approved v5 copy; only v6-specific blocks live here.
export { about, calculator, contact, hero, knowHow, method, solutions } from "./site-v5";

export const v6Nav = [
  { id: "about", label: "About" },
  { id: "solutions", label: "Solutions" },
  { id: "method", label: "Method" },
  { id: "calculator", label: "Calculator" },
  { id: "contact", label: "Contact" },
] as const;

export const v6Assets = {
  wordmark: "/v5/wordmark-light.png",
  points: "/v6/muse-points.bin?v=4", // bump when the cloud is re-baked (defeats browser cache)
  video: "/v6/muse-loop.mp4",
  poster: "/v6/muse-loop-poster.jpg",
};

export const intro = {
  left: "Thynk.",
  right: "Σκέψη πίσω από κάθε κίνηση. Digital agency, Ιωάννινα.",
  hint: "Κάνε scroll",
  skip: "Παράλειψη →",
};

export const heroV6 = {
  headlineTop: "Λιγότερες αγγαρείες.",
  headlineBottom: "Περισσότεροι πελάτες.",
  sub: "Marketing και αυτοματισμοί για επιχειρήσεις της Ηπείρου. Ξεκινάμε από το τι σε τρώει, όχι από το τι πουλάμε.",
  videoChip: "Η Μούσα · το πρόσωπο της Thynk",
  videoCaption: "Ιωάννινα · Est. 2026",
  ctaPrimary: "Κλείσε Demo",
  ctaSecondary: "Δες πώς δουλεύουμε",
};

export const processV6 = {
  eyebrow: "Method",
  titleTop: "Πρώτα κοιτάμε. Μετά δοκιμάζουμε.",
  titleBottom: "Μετά μεγαλώνουμε.",
  audit: {
    title: "Audit",
    tag: "Λίστα",
    items: ["Παρουσία online", "Διαδικασίες & εργαλεία", "Πού χάνεται χρόνος", "Λίστα προτεραιοτήτων"],
  },
  terminal: [
    "thynk pilot --ροή ραντεβού",
    "› τρέχει παράλληλα με την ομάδα σου",
    "› καταγράφουμε: χειροκίνητα vs αυτόματα",
    "› ό,τι ευαίσθητο → εγκρίνει άνθρωπος",
    "› απόφαση για συνέχεια: δική σου",
  ],
  chat: {
    label: "Παράδειγμα συνομιλίας",
    messages: [
      { from: "client", text: "Έχετε διαθεσιμότητα για Σάββατο;" },
      { from: "muse", text: "Ναι! Έχω 11:00 ή 13:30. Ποια ώρα σε βολεύει;" },
      { from: "client", text: "11:00, ευχαριστώ." },
    ],
  },
};

export const advantage = {
  title: "Εσύ κρατάς τον έλεγχο. Τα συστήματα κάνουν τις αγγαρείες.",
  sub: "Οι επαναλαμβανόμενες δουλειές τρέχουν μόνες τους, οι αποφάσεις μένουν σε σένα. Αν κάτι δεν αποδίδει, στο λέμε πρώτοι.",
};

export const sticky = {
  text: "Πες μας τι σε τρώει.",
  strong: "30 λεπτά, χωρίς δέσμευση.",
  cta: "Κλείσε Demo →",
};

export const teamV6 = {
  title: "Ποιοι είμαστε",
  note: "Είμαστε δύο. Όποιον από τους δύο πάρεις τηλέφωνο, μιλάς με ιδρυτή.",
};
