// Copy for the v5 interface (fixed viewport, dark-first, pinned Muse).
// Source: Website Content/01–05 + the approved v5 prototype (Website Content/prototype-v5).
// Edit copy here; components only render it.

export type ViewId = "home" | "about" | "solutions" | "method" | "calculator" | "contact";

export const nav: { id: Exclude<ViewId, "home">; label: string }[] = [
  { id: "about", label: "About" },
  { id: "solutions", label: "Solutions" },
  { id: "method", label: "Method" },
  { id: "calculator", label: "Calculator" },
  { id: "contact", label: "Contact" },
];

export const assets = {
  wordmark: "/v5/wordmark-light.png",
  poses: {
    home: "/v5/muse-hero.jpg",
    about: "/v5/muse-hero.jpg",
    solutions: "/v5/muse-ipad.jpg",
    method: "/v5/muse-thoughts.jpg",
    calculator: "/v5/muse-ipad.jpg",
    contact: "/v5/muse-hero.jpg",
  } satisfies Record<ViewId, string>,
};

export const hero = {
  eyebrow: "Est. 2026 · Ioannina",
  headlineStart: "Σκέψη πίσω από κάθε ",
  headlineAccent: "κίνηση.",
  lead: "Marketing και AI αυτοματισμοί για επιχειρήσεις της Ηπείρου. Πρώτα βλέπουμε πού χάνεις χρόνο και πελάτες, μετά σου λέμε τι πραγματικά χρειάζεσαι.",
  ctaPrimary: "Κλείσε Demo",
  ctaSecondary: "Υπολόγισε τι χάνεις σε αγγαρείες",
  trust: [
    "Οι λογαριασμοί μένουν δικοί σου",
    "Άνθρωπος εγκρίνει πριν το AI",
    "Αν δεν αποδίδει, στο λέμε πρώτοι",
  ],
};

export const knowHow = [
  "φτιάξω AI βοηθό που απαντάει και κλείνει ραντεβού, 24/7.",
  "τρέξω Google Ads που φέρνουν πελάτες, όχι απλά κλικ.",
  "σηκώσω το τηλέφωνο όταν εσύ έχεις κλείσει.",
  "συνδέσω τα εργαλεία σου ώστε οι αγγαρείες να τρέχουν μόνες τους.",
  "σε κάνω να σε προτείνει το ChatGPT.",
  "γράψω κείμενα που πείθουν, όχι απλά περιγράφουν.",
  "σου δώσω αναφορά που καταλαβαίνεις με μια ματιά.",
];

export const about = {
  headline: "Γιατί υπάρχει η Thynk",
  body: [
    "Δεν χρειάζεται να ψάξεις στην Αθήνα για σοβαρό marketing και αυτοματισμούς. Η Thynk τα φέρνει εδώ, από δύο ανθρώπους που θα συναντήσεις στα Γιάννενα: ο ένας με μυαλό για business και νούμερα, ο άλλος με χρόνια σε agency της Αθήνας.",
    "Δεν μπαίνουμε με κατάλογο να διαλέξεις. Κάνουμε audit, βρίσκουμε τι χρειάζεσαι και προχωράμε κλιμακωτά: πρώτα το πιο κρίσιμο, μετά τα υπόλοιπα. Αν κάτι δεν πρόκειται να δουλέψει, θα στο πούμε εμείς πρώτοι.",
  ],
  founders: [
    {
      initials: "ΔΧ",
      name: "Δημήτρης Χρυσοχόου",
      bio: "Business & data. Founder του Anadelta Education, Μαθηματικά & Οικονομικά, στατιστική, growth και digital transformation.",
    },
    {
      initials: "ΜΜ",
      name: "Μιχαήλ Μπούμπας",
      bio: "Digital, marketing & creative. Agency εμπειρία από την Αθήνα σε e-commerce, CRO και data, place branding με το myMetsovo.gr.",
    },
  ],
  signoff: "Ιωάννινα. Ήπειρος.",
};

export const solutions = {
  headline: "Δύο πόρτες. Εσύ διαλέγεις από πού μπαίνεις.",
  intro:
    "Πάτα έναν πυλώνα για να δεις τι κάνουμε μέσα του. Στην πράξη ξεκινάμε από αυτό που βγάζει το audit ως πιο επείγον.",
  pillars: [
    {
      id: "marketing",
      tag: "Περισσότεροι πελάτες",
      title: "Φέρνουμε πελάτες και το μετράμε",
      sub: "Ads, content, email. Δεμένα μεταξύ τους, όχι σκόρπια.",
      groups: [
        {
          title: "Διαφήμιση που μετριέται",
          items: [
            "Google Ads (Search, Shopping, Performance Max) που φέρνουν πελάτες, όχι απλά κλικ.",
            "Τα προϊόντα σου στο Google Shopping με φωτογραφία και τιμή.",
            "TikTok Ads για κοινό που το Google και η Meta δεν πιάνουν.",
            "Σχέδιο καμπάνιας πριν το πρώτο ευρώ: στόχος, budget, κοινό.",
            "A/B testing σε κείμενα, εικόνες, CTA. Αποφασίζουμε με δεδομένα.",
            "Αναφορές που καταλαβαίνεις με μια ματιά.",
          ],
        },
        {
          title: "Social & περιεχόμενο",
          items: [
            "Content calendar και στρατηγική πάνω στο δικό σου brand.",
            "Διαχείριση Facebook, Instagram, TikTok, LinkedIn χωρίς αναπάντητα μηνύματα.",
            "Κείμενα για site, ads, email και blog που πείθουν.",
            "Graphic design με συνέπεια στην ταυτότητά σου.",
            "UGC και short-form video για Reels, TikTok, Shorts.",
            "AI «πρόσωπα» brand, αν ταιριάζουν στη στρατηγική σου.",
          ],
        },
        {
          title: "Email, SMS & αυτόματα μηνύματα",
          items: [
            "Αυτόματα μηνύματα για εγκαταλειμμένο καλάθι, upsell, επαναγορά.",
            "Klaviyo flows και Mailchimp newsletters που ανοίγονται.",
            "SMS campaigns για προσφορές που δεν περιμένουν.",
            "Οργάνωση επαφών σε HubSpot ή Brevo, ώστε κάθε μήνυμα να είναι σχετικό.",
          ],
        },
      ],
    },
    {
      id: "transformation",
      tag: "Λιγότερη χειρωνακτική δουλειά",
      title: "Συστήματα που δουλεύουν μόνα τους",
      sub: "AI αυτοματισμοί, δεδομένα, στρατηγική, landing pages.",
      groups: [
        {
          title: "AI αυτοματισμοί & δεδομένα",
          items: [
            "AI chatbot που απαντάει και κλείνει ραντεβού από το site ή τα social.",
            "Φωνητικό βοηθό που σηκώνει το τηλέφωνο εκτός ωραρίου.",
            "Σύνδεση των εργαλείων σου ώστε οι επαναλαμβανόμενες δουλειές να τρέχουν μόνες τους.",
            "Custom AI agents και GPTs πάνω στα δικά σου δεδομένα.",
            "GEO: να σε προτείνουν το ChatGPT και τα Google AI Overviews.",
            "GA4, GTM και Looker Studio dashboards με σωστά νούμερα.",
          ],
        },
        {
          title: "Συμβουλευτική & ανάπτυξη",
          items: [
            "Roadmap από τις χειροκίνητες διαδικασίες στα αυτοματοποιημένα συστήματα.",
            "Audit που δείχνει πού χάνεις χρόνο και χρήμα.",
            "Workshops για να δουλεύει η ομάδα σου με AI κάθε μέρα.",
            "Growth session από το οποίο φεύγεις με συγκεκριμένο πλάνο.",
          ],
        },
        {
          title: "Site & landing pages",
          items: [
            "Landing page ή μικρό site που κάνει τους επισκέπτες πελάτες.",
          ],
          note: "E-shops από το μηδέν δεν χτίζουμε. Αν έχεις ήδη κατάστημα, δουλεύουμε πάνω του.",
        },
      ],
    },
  ],
};

export const method = {
  headline: "Πρώτα κοιτάμε. Μετά δοκιμάζουμε. Μετά μεγαλώνουμε.",
  intro:
    "Δεν σου πουλάμε πακέτο. Κάθε βήμα έχει δική του καθαρή τιμή και δικό του σημείο όπου αποφασίζεις αν συνεχίζουμε.",
  steps: [
    {
      n: "01",
      title: "Audit",
      text: "Σκανάρουμε παρουσία και διαδικασίες. Φεύγεις με λίστα: τι χάνεις σήμερα, τι φτιάχνεται πρώτο, τι μπορεί να περιμένει.",
      chips: ["Μικρό, πληρωμένο", "Λίστα προτεραιοτήτων"],
    },
    {
      n: "02",
      title: "Πιλοτικό",
      text: "Μία ροή, η πιο κρίσιμη. Τρέχει πρώτα παράλληλα με την ομάδα σου, για να δούμε σε νούμερα ότι δουλεύει πριν της δώσουμε το τιμόνι.",
      chips: ["Μία ροή", "Παράλληλη δοκιμή", "Μετράμε πριν και μετά"],
    },
    {
      n: "03",
      title: "Κλιμάκωση",
      text: "Προσθέτουμε υπηρεσίες μία-μία, όσο αποδεικνύουν ότι αξίζουν. Με το Thynk Care έχεις διαθεσιμότητα, support και σειρά προτεραιότητας.",
      chips: ["Μία υπηρεσία τη φορά", "Thynk Care"],
    },
  ],
  rulesTitle: "Οι κανόνες μας για το AI",
  rules: [
    {
      title: "Τα κλειδιά είναι δικά σου",
      text: "Λογαριασμοί, API keys και δεδομένα στο όνομά σου. Αν φύγεις, φεύγουν μαζί σου.",
    },
    {
      title: "Άνθρωπος στη μέση",
      text: "Ό,τι είναι ευαίσθητο ή αρνητικό, το AI το ετοιμάζει ως πρόχειρο και το εγκρίνει άνθρωπος.",
    },
    {
      title: "Διακόπτης στο χέρι σου",
      text: "Όρια, λίστες εγκρίσεων και ένα κουμπί που σταματάει τα πάντα.",
    },
  ],
  faqTitle: "Συχνές ερωτήσεις",
  faq: [
    {
      q: "Πόσο κοστίζει;",
      a: "Κάθε υπηρεσία έχει δική της τιμή, ανάλογα με την επιχείρηση και τον όγκο. Τη μαθαίνεις μετά το audit, γραμμένη ανά γραμμή. Πακέτα «όλα μαζί» δεν έχουμε.",
    },
    {
      q: "Γιατί το audit δεν είναι δωρεάν;",
      a: "Γιατί είναι πραγματική δουλειά και φεύγεις με κάτι που χρησιμοποιείς ακόμα κι αν δεν συνεχίσουμε μαζί. Αν θες μια πρώτη ιδέα χωρίς κόστος, δοκίμασε τον υπολογιστή.",
    },
    {
      q: "Πρέπει να αλλάξω τα προγράμματα που ήδη έχω;",
      a: "Συνήθως όχι. Συνδεόμαστε με ό,τι ήδη δουλεύεις: ημερολόγιο, email, λογιστικό, CRM. Αλλαγή προτείνουμε μόνο όταν το εργαλείο σε κρατάει πίσω.",
    },
    {
      q: "Φτιάχνετε e-shop;",
      a: "Όχι από το μηδέν. Αν έχεις ήδη κατάστημα, τρέχουμε πάνω του Shopping ads, Klaviyo flows και cart recovery.",
    },
    {
      q: "Πού είναι τα case studies;",
      a: "Είμαστε νέοι και δεν δημοσιεύουμε πελάτη χωρίς τη ρητή άδειά του. Τα πρώτα έρχονται μόλις κλείσουν τα πρώτα πιλοτικά.",
    },
  ],
};

// Calculator — ⚠️ the automation shares are working assumptions, to be validated (Δημήτρης).
export const calculator = {
  headline: "Πόσο σου κοστίζουν οι αγγαρείες;",
  intro:
    "Βάλε τα νούμερα της ομάδας σου. Η εκτίμηση βγαίνει αμέσως. Είναι ενδεικτική και δεν αντικαθιστά το audit.",
  industries: [
    { id: "clinic", label: "Ιατρείο / κλινική" },
    { id: "office", label: "Λογιστικό / νομικό γραφείο" },
    { id: "hosp", label: "Ξενοδοχείο / εστίαση" },
    { id: "retail", label: "Λιανική / e-shop" },
    { id: "build", label: "Κατασκευές / τεχνικές υπηρεσίες" },
    { id: "other", label: "Κάτι άλλο" },
  ],
  defaultIndustry: "hosp",
  tasks: {
    phone: { label: "Τηλέφωνα & ραντεβού", opp: "AI βοηθός για τηλέφωνα & ραντεβού", share: 0.45 },
    msg: { label: "Email & μηνύματα", opp: "Αυτόματη διαλογή email & μηνυμάτων", share: 0.4 },
    docs: { label: "Τιμολόγια & παραστατικά", opp: "Εξαγωγή στοιχείων από τιμολόγια", share: 0.55 },
    reports: { label: "Αναφορές & Excel", opp: "Αναφορές που βγαίνουν μόνες τους", share: 0.55 },
    social: { label: "Social media", opp: "Ροή παραγωγής & δημοσίευσης content", share: 0.3 },
    quotes: { label: "Προσφορές & follow-up", opp: "Προσφορές & αυτόματο follow-up", share: 0.4 },
  },
  defaultTasks: ["phone", "msg", "social"],
  weights: {
    clinic: { phone: 1.5, msg: 1.1, docs: 1, reports: 0.8, social: 0.7, quotes: 0.6 },
    office: { docs: 1.5, msg: 1.2, reports: 1.2, phone: 1, quotes: 0.9, social: 0.6 },
    hosp: { msg: 1.4, phone: 1.3, social: 1.1, reports: 0.8, docs: 0.8, quotes: 0.7 },
    retail: { msg: 1.3, social: 1.3, reports: 1, docs: 0.9, quotes: 0.7, phone: 0.8 },
    build: { quotes: 1.5, docs: 1.2, phone: 1.1, reports: 1, msg: 0.9, social: 0.5 },
    other: { phone: 1, msg: 1, docs: 1, reports: 1, social: 1, quotes: 1 },
  } as Record<string, Record<string, number>>,
  weeksPerMonth: 4.33,
  sendNote: "Θα λάβεις αναλυτική αναφορά και πλάνο 90 ημερών.",
  sendPending:
    "Η αποστολή αναφοράς ενεργοποιείται με το back-end. Μέχρι τότε, γράψε μας στο hello@thynkagency.gr.",
};

export const contact = {
  headline: "Πες μας τι σε τρώει. Σου λέμε αν μπορούμε να το λύσουμε.",
  emails: [
    { label: "Γενικά", email: "hello@thynkagency.gr" },
    { label: "Δημήτρης · business & data", email: "dimitris@thynkagency.gr" },
    { label: "Μιχαήλ · marketing & creative", email: "mike@thynkagency.gr" },
  ],
  demoTitle: "Κλείσε Demo",
  demoIntro:
    "30 λεπτά. Μας δείχνεις πώς δουλεύεις, σου δείχνουμε τι θα κοιτάζαμε στο audit.",
  demoPending:
    "Η φόρμα ενεργοποιείται με το back-end. Μέχρι τότε, στείλε μας στο hello@thynkagency.gr.",
  copyright: "© 2026 Thynk Digital Agency · Με σκέψη, από τα Γιάννενα.",
};
