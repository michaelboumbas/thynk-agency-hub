// Copy sourced verbatim from `Website Content/01-hero.md` … `05-work-customers.md`.
// Do not invent copy here — edit the markdown source and mirror it.

export const brand = {
  name: "THYNK.",
  kicker: "Digital Agency",
  established: "established 2026",
  location: "Ιωάννινα, Ελλάδα",
};

export const hero = {
  headline: "Σκέψη πίσω από κάθε κίνηση.",
  subheadline:
    "Marketing και Digital Transformation για επιχειρήσεις της Ηπείρου, με σκέψη πίσω από κάθε κίνηση. Πρώτα κάνουμε audit, μετά σου λέμε τι πραγματικά χρειάζεσαι.",
  altLine: "Ιωάννινα. Τεχνογνωσία αθηναϊκού επιπέδου.",
  ctaPrimary: "Κλείσε Demo",
  ctaSecondary: "Δες τι κάνουμε",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "solutions", label: "Solutions" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

export type ViewId = "home" | (typeof nav)[number]["id"];

export const about = {
  headline: "Γιατί υπάρχει η Thynk",
  body: [
    "Στα Ιωάννινα υπάρχει ένα κενό: οι τοπικές επιχειρήσεις δεν έχουν εύκολη πρόσβαση στο επίπεδο τεχνογνωσίας που κυκλοφορεί στην Αθήνα. Η Thynk γεννήθηκε για να το καλύψει — φέρνοντας μαζί το digital marketing know-how αθηναϊκού επιπέδου και το business/data κομμάτι, σε ένα agency με μία αρχή: σκέψη πίσω από κάθε κίνηση.",
    "Δεν μπαίνουμε με έναν κατάλογο να διαλέξεις. Κάνουμε audit, βρίσκουμε τι χρειάζεσαι πραγματικά, και προχωράμε κλιμακωτά — πρώτα το πιο κρίσιμο, μετά τα υπόλοιπα. Αν κάτι δεν πρόκειται να δουλέψει, θα σου το πούμε πρώτοι εμείς.",
  ],
  founders: [
    {
      initials: "MB",
      name: "Mike Boumpas",
      role: "digital, marketing & creative",
      bio: "Τεχνογνωσία από agency της Αθήνας (e-commerce, CRO, data), εμπειρία σε place branding (myMetsovo.gr) και web/social για επιχειρήσεις της Ηπείρου.",
    },
    {
      initials: "ΔΧ",
      name: "Δημήτρης Χρυσοχόου",
      role: "business & data",
      bio: "Founder του Anadelta Education (Ιωάννινα), background σε Μαθηματικά & Οικονομικά, στατιστική, growth hacking & digital business transformation.",
    },
  ],
  tagline: "Ιωάννινα. Ήπειρος.",
};

export const pillars = [
  {
    id: "marketing",
    tag: "Marketing",
    intro:
      "Το κλασικό: φέρνουμε πελάτες, χτίζουμε παρουσία, μετράμε ό,τι κάνουμε. Ads, content, automation — δεμένα μεταξύ τους, όχι σκόρπια.",
    groups: [
      {
        title: "Performance Marketing",
        items: [
          "Ξέρω να τρέξω Google Ads (Search, Shopping, Performance Max) που φέρνουν πελάτες, όχι απλά κλικ.",
          "Ξέρω να βάλω τα προϊόντα σου στο Google Shopping με φωτογραφία και τιμή, έτοιμα για αγορά.",
          "Ξέρω να δοκιμάσω TikTok Ads για να φτάσεις κοινό που το Google/Meta δεν πιάνει.",
          "Ξέρω να σχεδιάσω καμπάνια πριν ξοδέψεις το πρώτο ευρώ — στόχος, budget, κοινό, ξεκάθαρα.",
          "Ξέρω να κάνω A/B testing σε κείμενα, εικόνες, CTA — αποφασίζουμε με δεδομένα, όχι μαντεψιά.",
          "Ξέρω να σου δίνω αναφορές που καταλαβαίνεις με μια ματιά, όχι σελίδες με αριθμούς.",
        ],
      },
      {
        title: "Social, Content & Creative",
        items: [
          "Ξέρω να χτίσω content calendar και στρατηγική βάσει του brand σου, όχι γενικές συνταγές.",
          "Ξέρω να διαχειριστώ Facebook, Instagram, TikTok, LinkedIn — καμία ερώτηση πελάτη αναπάντητη.",
          "Ξέρω να γράψω κείμενα (site, ads, email, blog) που πείθουν, όχι απλά περιγράφουν.",
          "Ξέρω να φτιάξω graphic design με συνέπεια στην ταυτότητα του brand σου.",
          "Ξέρω να παράξω UGC και short-form video (Reels/TikTok/Shorts) — το format που σήμερα φέρνει reach.",
          "Ξέρω να χτίσω AI-generated «πρόσωπα» brand, αν αυτό ταιριάζει στη στρατηγική σου.",
          "Ξέρω να αυτοματοποιήσω τη ροή δημοσιεύσεων, ώστε η παρουσία σου να μη σταματάει ποτέ.",
        ],
      },
      {
        title: "Email, SMS & Marketing Automation",
        items: [
          "Ξέρω να στήσω αυτόματα μηνύματα (καλάθι που εγκαταλείφθηκε, upsell, επαναγορά) που δουλεύουν 24/7.",
          "Ξέρω να χτίσω Klaviyo flows και Mailchimp newsletters που ανοίγονται, όχι που διαγράφονται.",
          "Ξέρω να τρέξω SMS campaigns για προσφορές που δεν περιμένουν.",
          "Ξέρω να οργανώσω τη λίστα επαφών σου (HubSpot/Brevo) ώστε κάθε μήνυμα να είναι σχετικό.",
        ],
      },
    ],
  },
  {
    id: "transformation",
    tag: "Digital Transformation",
    intro:
      "Εδώ κάνουμε την καθημερινότητά σου πιο εύκολη: συστήματα που δουλεύουν μόνα τους, δεδομένα που έχουν νόημα, και στρατηγική που σε ανεβάζει από «έχω agency» σε «έχω σύμβουλο». Περιλαμβάνει και το web (landing pages/μικρά sites — όχι e-shops).",
    groups: [
      {
        title: "AI Automation & Data Analytics",
        items: [
          "Ξέρω να φτιάξω AI chatbot που απαντάει και κλείνει ραντεβού μέσα από το site ή τα social, 24/7.",
          "Ξέρω να συνδέσω τα εργαλεία σου ώστε οι επαναλαμβανόμενες δουλειές να τρέχουν μόνες τους.",
          "Ξέρω να στήσω φωνητικό βοηθό που απαντάει τηλέφωνα εκτός ωραρίου.",
          "Ξέρω να χτίσω custom AI agents και GPTs εκπαιδευμένα στα δικά σου δεδομένα.",
          "Ξέρω να σε ετοιμάσω για GEO — να σε βρίσκουν το ChatGPT και τα Google AI Overviews.",
          "Ξέρω να στήσω σωστά Google Analytics (GA4), GTM και Looker Studio dashboards, ώστε οι αποφάσεις σου να βασίζονται σε σωστά νούμερα.",
        ],
      },
      {
        title: "Business Consulting & Growth",
        items: [
          "Ξέρω να σου φτιάξω roadmap για να περάσεις από χειροκίνητες διαδικασίες σε αυτοματοποιημένα συστήματα.",
        ],
      },
      {
        title: "Web Design & Landing Pages",
        items: [
          "Ξέρω να φτιάξω landing page ή μικρό site που μετατρέπει επισκέπτες σε πελάτες.",
          "Δεν χτίζω e-shops από το μηδέν — αν έχεις ήδη κατάστημα, δουλεύω πάνω σε αυτό (Shopping ads, Klaviyo flows, cart-recovery).",
        ],
      },
    ],
  },
] as const;

// Rotating "Ξέρω να..." lines for the floating hero card.
export const knowHowTicker = [
  "Ξέρω να φτιάξω AI chatbot που απαντάει και κλείνει ραντεβού μέσα από το site ή τα social, 24/7.",
  "Ξέρω να τρέξω Google Ads (Search, Shopping, Performance Max) που φέρνουν πελάτες, όχι απλά κλικ.",
  "Ξέρω να στήσω αυτόματα μηνύματα (καλάθι που εγκαταλείφθηκε, upsell, επαναγορά) που δουλεύουν 24/7.",
  "Ξέρω να στήσω φωνητικό βοηθό που απαντάει τηλέφωνα εκτός ωραρίου.",
  "Ξέρω να φτιάξω landing page ή μικρό site που μετατρέπει επισκέπτες σε πελάτες.",
];

export const work = {
  headline: "Work",
  teaser:
    "Ετοιμάζουμε case studies — μίλα μαζί μας για να δεις πώς δουλεύουμε.",
  note: "Πελάτες εμφανίζονται εδώ μόνο με ρητή άδεια. Χωρίς λογότυπα-βιτρίνα, χωρίς testimonials που δεν έχουν γραφτεί από τους ίδιους.",
};

export const contact = {
  headline: "Contact",
  intro: "Πες μας τι θέλεις να πετύχεις. Ξεκινάμε με audit.",
  emails: [
    "hello@thynkagency.gr",
    "mike@thynkagency.gr",
    "dimitris@thynkagency.gr",
  ],
  copyright: "© 2026 Thynk Digital Agency. Με σκέψη, από τα Γιάννενα.",
};
