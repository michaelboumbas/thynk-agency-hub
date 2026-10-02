// v14 «Thynk Clean» (02/10/2026, Mike): the ubernatural.io style on a white page, our colours, our copy.
// Every string here comes from the approved v9/v11/v12 copy (shortened where a card is small). Nothing new is claimed.
// Prototype it was approved from: https://claude.ai/artifact/M9Eqtsp9yAaiH1j7uykBJ9
import { homeFaq } from "@/content/site-v11";

export const v14Nav = [
  { id: "method", label: "Μεθοδολογία" },
  { id: "solutions", label: "Λύσεις" },
  { id: "audit", label: "Το audit" },
  { id: "team", label: "Ποιοι είμαστε" },
] as const;

export const v14Hero = {
  mark: "Thynk Digital Agency · Ιωάννινα",
  lead: "The future of ",
  accent: "Super",
  last: " Intelligence.",
  formulaStrong: "Human Intelligence + Artificial Intelligence.",
  formula: "Η κρίση και η εμπειρία της ομάδας σας, μαζί με την ταχύτητα της τεχνητής νοημοσύνης.",
  primary: "Κλείστε audit",
  secondary: "Η μεθοδολογία →",
};

export const v14About = {
  label: "Η Thynk",
  text: "Η Thynk Digital Agency εδρεύει στα Ιωάννινα και εξειδικεύεται σε marketing και digital transformation με τεχνητή νοημοσύνη. Σχεδιάζουμε και υλοποιούμε λύσεις που μειώνουν τις επαναλαμβανόμενες εργασίες και φέρνουν μετρήσιμους πελάτες. Συνεργαζόμαστε με επιχειρήσεις σε όλη την Ελλάδα και το εξωτερικό, και σε κάθε συνεργασία την ευθύνη έχουν απευθείας οι ιδρυτές.",
  founders: "Δημήτρης Χρυσοχόου & Μιχαήλ Μπούμπας",
  foundersNote: "Senior ομάδα, απευθείας επικοινωνία. Κάθε συνεργασία ξεκινά με audit.",
};

export const v14Method = {
  title: "Μεθοδολογία",
  stepWord: "Στάδιο",
  steps: [
    { title: "Audit", text: "Αναλύουμε τη σημερινή λειτουργία της επιχείρησής σας: πώς σας βρίσκουν οι πελάτες, πού χάνονται χρόνος και ευκαιρίες, και ποιους δείκτες παρακολουθείτε." },
    { title: "Στρατηγική", text: "Τα ευρήματα του audit γίνονται ιεραρχημένο πλάνο ενεργειών: τι υλοποιείται πρώτο, τι μπορεί να περιμένει και τι δεν συνιστάται." },
    { title: "Υλοποίηση", text: "Υλοποιούμε πρώτα την παρέμβαση με τη μεγαλύτερη αξία και τη δοκιμάζουμε πιλοτικά, παράλληλα με την υφιστάμενη λειτουργία." },
    { title: "Κλιμάκωση", text: "Μετράμε τα αποτελέσματα, βελτιστοποιούμε και επεκτείνουμε στην επόμενη προτεραιότητα του πλάνου, με το Thynk Care." },
  ],
};

export type ScreenId = "bookings" | "followup" | "report" | "invoices" | "audit";

export const v14Solutions = {
  label: "Λύσεις",
  title: "Λύσεις",
  lead: "Ενδεικτικές λύσεις από όσες σχεδιάζει και υλοποιεί η Thynk. Έργα πελατών παρουσιάζονται μόνο με τη ρητή έγκρισή τους.",
  note: "Περάστε τον κέρσορα πάνω από τις τέσσερις πρώτες για να δείτε πώς λειτουργούν. Ενδεικτικά παραδείγματα, όχι έργα πελατών.",
  items: [
    { name: "Ψηφιακός βοηθός κρατήσεων", tags: "Κρατήσεις · Website, Messenger, Instagram", pillar: "Digital Transformation", screen: "bookings" },
    { name: "Follow-up προσφορών", tags: "Πωλήσεις · CRM", pillar: "Digital Transformation", screen: "followup" },
    { name: "Εβδομαδιαία αναφορά απόδοσης", tags: "Google, Meta, πωλήσεις", pillar: "Marketing", screen: "report" },
    { name: "Αυτόματη καταχώριση παραστατικών", tags: "Διαχείριση · Λογιστικό αρχείο", pillar: "Digital Transformation", screen: "invoices" },
    { name: "Μετρήσιμη διαφήμιση", tags: "Google και Meta, συνδεδεμένες με πωλήσεις", pillar: "Marketing" },
    { name: "Οργανωμένα social media", tags: "Πρόγραμμα, παραγωγή με AI, μηνύματα", pillar: "Marketing" },
    { name: "Email marketing", tags: "Καλάθια, επαναγορές, ενημερώσεις", pillar: "Marketing" },
    { name: "Φωνητικός ψηφιακός βοηθός", tags: "Κλήσεις εκτός ωραρίου, ραντεβού", pillar: "Digital Transformation" },
    { name: "Dashboards απόδοσης", tags: "Οι βασικοί δείκτες σε μία σελίδα", pillar: "Digital Transformation" },
    { name: "Εσωτερικός AI βοηθός", tags: "Απαντήσεις από τα έγγραφα της επιχείρησης", pillar: "Digital Transformation" },
  ] as { name: string; tags: string; pillar: string; screen?: ScreenId }[],
};

export const v14Audit = {
  titleStart: "Πριν από κάθε πρόταση, ",
  titleAccent: "ανάλυση.",
  panels: [
    { kicker: "01 · Το audit εξετάζει", sub: "Ψηφιακή παρουσία", title: "Ψηφιακή παρουσία και προσέλκυση.", text: "Google, social media, website και διαφήμιση: από πού προέρχονται σήμερα οι πελάτες σας και σε ποιο σημείο χάνονται.", tone: "paper" },
    { kicker: "02 · Το audit εξετάζει", sub: "Διαδικασίες", title: "Λειτουργικές διαδικασίες.", text: "Τηλέφωνα, μηνύματα, παραστατικά, προσφορές: ποιες εργασίες γίνονται χειροκίνητα και μπορούν να αυτοματοποιηθούν.", tone: "ink" },
    { kicker: "03 · Το audit εξετάζει", sub: "Δεδομένα", title: "Μέτρηση και δεδομένα.", text: "Ποιοι δείκτες παρακολουθούνται, ποιοι λείπουν και κατά πόσο τα διαθέσιμα δεδομένα είναι αξιόπιστα.", tone: "paper" },
    { kicker: "04 · Παραδοτέο", sub: "Δικό σας", title: "Τι πρώτο, τι μετά, τι δεν συνιστάται.", text: "Αναφορά ευρημάτων με ιεράρχηση. Παρουσιάζεται σε συνάντηση με την ομάδα μας και παραμένει στην κατοχή σας, ανεξάρτητα από τη συνέχεια.", tone: "orange" },
    { kicker: "Αρχές χρήσης AI", sub: "Ανθρώπινη εποπτεία", title: "Το AI προετοιμάζει. Άνθρωπος εγκρίνει.", text: "Κάθε ευαίσθητη ενέργεια εγκρίνεται από άνθρωπο πριν εκτελεστεί. Οι λογαριασμοί και τα δεδομένα ανήκουν στην επιχείρησή σας.", tone: "ink" },
  ] as { kicker: string; sub: string; title: string; text: string; tone: "paper" | "ink" | "orange" }[],
};

export const v14Team = {
  label: "Ποιοι είμαστε",
  people: [
    { name: "Δημήτρης Χρυσοχόου", role: "Συνιδρυτής · Business, δεδομένα & αυτοματισμοί", focus: "Αυτοματισμοί, δεδομένα, κοστολόγηση, διαδικασίες", email: "dimitris@thynkagency.gr" },
    { name: "Μιχαήλ Μπούμπας", role: "Συνιδρυτής · Marketing, διαφήμιση & creative", focus: "Διαφήμιση, social media, περιεχόμενο, brand", email: "mike@thynkagency.gr" },
  ],
};

export const v14Book = {
  title: "Κλείστε audit",
  lead: "Μια σύντομη περιγραφή της επιχείρησης και των προτεραιοτήτων σας.",
  // labels in capitals: written without accents (no CSS uppercase, see build log 30/09)
  name: { label: "ΟΝΟΜΑ", placeholder: "Το όνομά σας", error: "Συμπληρώστε το όνομά σας." },
  biz: { label: "ΕΠΙΧΕΙΡΗΣΗ", placeholder: "Επωνυμία", error: "Συμπληρώστε την επιχείρηση." },
  email: { label: "EMAIL", placeholder: "name@company.gr", error: "Συμπληρώστε ένα έγκυρο email." },
  pain: { label: "ΤΙ ΝΑ ΚΟΙΤΑΞΟΥΜΕ ΠΡΩΤΑ", options: ["Κλήσεις & ραντεβού", "Μηνύματα & email", "Social media", "Προσέλκυση πελατών", "Τιμολόγια & παραστατικά", "Προσφορές"] },
  submit: "Αποστολή",
  // front-end only until the back-end (n8n / inbox) is connected
  sent: "Ευχαριστούμε. Η φόρμα δεν είναι ακόμη συνδεδεμένη με το back-end, οπότε στείλτε μας και στο hello@thynkagency.gr.",
};

export const v14Faq = {
  title: "Συχνές",
  titleGrey: "ερωτήσεις.",
  note: "Για ό,τι δεν καλύπτεται εδώ: hello@thynkagency.gr",
  items: homeFaq,
};

export const v14Footer = {
  contact: "hello@thynkagency.gr",
  city: "Ιωάννινα",
  year: "© 2026",
};

/* the small UI screens that float in the hero and peek over the solutions list (from site-v9 examples) */
export const v14Screens = {
  bookings: {
    app: "Βοηθός κρατήσεων",
    chip: "Instagram",
    chat: [
      { me: false, t: "Έχετε δίκλινο 14 με 16 Αυγούστου;" },
      { me: true, t: "Ναι, υπάρχει διαθέσιμο. Δύο νύχτες με πρωινό. Να σας το κρατήσω;" },
      { me: false, t: "Ναι, για δύο άτομα." },
    ],
    status: "Προσωρινή κράτηση",
    foot: "Περιμένει την έγκρισή σας",
  },
  followup: {
    app: "Προσφορές",
    chip: "#218",
    rows: [
      { t: "Η προσφορά στάλθηκε", s: "ok" },
      { t: "Καμία απάντηση για 3 μέρες", s: "ok" },
      { t: "Υπενθύμιση έτοιμη", s: "wait" },
      { t: "Καταχωρήθηκε στο CRM", s: "ok" },
    ],
  },
  report: {
    app: "Εβδομαδιαία αναφορά",
    chip: "Δευτέρα",
    bars: [
      { t: "Google Search", v: 82, flag: false },
      { t: "Meta · Reels", v: 64, flag: false },
      { t: "Meta · Εικόνες", v: 28, flag: true },
      { t: "Google Maps", v: 47, flag: false },
    ],
    foot: "Ενδεικτικό παράδειγμα · επαφές",
  },
  invoices: {
    app: "Εισερχόμενα τιμολόγια",
    chip: "4 νέα",
    rows: [
      { t: "Ρεύμα · Σεπτέμβριος", v: "€184,20", flag: false },
      { t: "Προμηθευτής χαρτικών", v: "€1.240,00", flag: false },
      { t: "Τηλεφωνία", v: "Για έλεγχο", flag: true },
      { t: "Συντήρηση κλιματισμού", v: "€320,00", flag: false },
    ],
  },
  audit: {
    app: "Παραδοτέο audit",
    chip: "Ξενοδοχείο, 14 δωμάτια",
    rows: [
      { t: "Μηνύματα κρατήσεων χειροκίνητα", tag: "Πρώτο", tone: "o" },
      { t: "Google Business Profile", tag: "Πρώτο", tone: "o" },
      { t: "Μέτρηση κρατήσεων", tag: "Μετά", tone: "" },
      { t: "Νέο website", tag: "Δεν συνιστάται", tone: "k" },
    ],
  },
} as const;
