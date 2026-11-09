import type { Lang } from "./site-v14";

/**
 * Careers (17/10/2026, Mike): open applications. No open position is shown unless one really exists
 * (Mike 17/10: no «fake» roles). 09/11/2026: the first real role is open (Content Creation & Social Media Management). We reply to every applicant, whether or not we move forward.
 * The CV (PDF) and the phone number are required (Mike 17/10); portfolio and LinkedIn links are optional.
 * Applications: our database (public.career_applications) + CV in the private bucket «career-cvs»
 * + HubSpot for the email notification. Kept 12 months (privacy policy).
 * Page: src/components/thynk14/careers.tsx · sending: src/lib/career-applications.ts.
 */

export type Engagement = "freelance" | "part-time" | "full-time";

/** the CV limit, the same as the bucket's (10 MB, PDF only — raised from 5 MB, Mike 17/10) */
export const CV_MAX_BYTES = 10 * 1024 * 1024;

const en = {
  head: {
    label: "Careers",
    title: "Careers",
    lead: "Thynk is hiring a Content Creator & Social Media Manager based in Ioannina. We also accept applications in the other areas listed below.",
  },
  areasLabel: "Who we work with",
  /** Mike 17/10: these six, in this order */
  areas: ["Performance marketing", "Social media management", "Design", "Video editing", "Web development", "AI automation"],
  areasNote: "Freelance, part-time or full-time. Choose your area in the form above.",
  /**
   * 09/11/2026 (Mike): the role is open (it was «planned» since 17/10). Based in Ioannina: from home
   * and on shoots with clients in Ioannina, Metsovo and the area. Part/full-time not shown and not pre-selected in the form (Mike 09/11). No pay range (Mike's call).
   * The LinkedIn post links to /el/careers?role=content: that pre-selects this role in the form.
   * When the role closes, change it here.
   */
  role: {
    label: "Open role",
    badge: "Open · accepting applications",
    title: "Content Creation & Social Media Management",
    meta: "Ioannina · Hybrid (remote & on-location shoots)",
    text: "Thynk Digital Agency is looking for a Content Creator & Social Media Manager based in Ioannina. The role covers planning and managing our clients' social media accounts and producing their content: short-form video, photography and posts. The work is hybrid: remote, with shoots at client locations in Ioannina, Metsovo and the wider area.",
    doLabel: "Responsibilities",
    tasks: [
      "Planning monthly content calendars for client accounts on Instagram, Facebook, TikTok and LinkedIn",
      "Producing short-form video and photography at client locations",
      "Editing video and visual material",
      "Writing copy and captions in each brand's voice",
      "Scheduling and publishing posts",
      "Tracking performance and reporting results monthly",
    ],
    needLabel: "Requirements",
    need: [
      "Based in Ioannina or the wider area, able to travel to shoots",
      "Experience managing business social media accounts",
      "Experience shooting and editing video on phone or camera (CapCut, Adobe Premiere Pro or similar)",
      "Social media copywriting skills in Greek",
      "A portfolio of your work",
      "Strong organisation and reliability with deadlines",
    ],
    niceLabel: "Nice to have",
    nice: [
      "Basic graphic design skills (Canva, Adobe)",
      "Experience with scheduling and analytics tools (e.g. Metricool, Meta Business Suite)",
      "Previous agency experience",
    ],
    button: "Apply for this role",
    /** the choice in the form's AREA list; stored in English */
    option: "Open role: Content Creation & Social Media Management",
  },
  side: {
    title: "Apply",
    text: "We read every application and reply to everyone, whether or not we move forward.",
    steps: ["You send your application", "We read it and reply to you, whatever the answer", "If there's a fit, we arrange a conversation"],
    mail: "Prefer email? Send your CV to",
  },
  form: {
    title: "Your application",
    lead: "Attach your CV as a PDF. A portfolio or your LinkedIn profile helps us get to know your work.",
    // labels are written in capitals in the copy (no CSS uppercase; Greek capitals have no accents)
    first: { label: "FIRST NAME", placeholder: "Your first name", error: "Please enter your first name." },
    last: { label: "LAST NAME", placeholder: "Your last name", error: "Please enter your last name." },
    email: { label: "EMAIL", placeholder: "name@example.com", error: "Please enter a valid email." },
    phone: { label: "PHONE", placeholder: "+30 …", error: "Please enter a valid phone number." },
    area: { label: "AREA", placeholder: "Choose an area", error: "Please choose an area.", other: "Other" },
    engagement: {
      label: "TYPE OF COLLABORATION",
      error: "Please choose one option.",
      options: { freelance: "Freelance", "part-time": "Part-time", "full-time": "Full-time" } as Record<Engagement, string>,
    },
    portfolio: { label: "PORTFOLIO", placeholder: "https://…", error: "Please enter a full link, starting with https://" },
    linkedin: { label: "LINKEDIN", placeholder: "https://www.linkedin.com/in/…", error: "Please enter a full link, starting with https://" },
    cv: {
      label: "CV (PDF)",
      choose: "Choose a PDF",
      hint: "Up to 10 MB",
      remove: "Remove",
      errorType: "Please choose a PDF file.",
      errorSize: "The file is larger than 10 MB.",
      required: "Please attach your CV as a PDF.",
    },
    message: { label: "A FEW WORDS ABOUT YOU", placeholder: "What you do, and what you would like to work on with us" },
    optional: "optional",
    consentA: "I agree that Thynk keeps my application for up to 12 months in order to consider a possible collaboration, as described in the",
    consentLink: "Privacy Policy",
    consentB: ".",
    consentError: "Please accept the Privacy Policy so we can review your application.",
    submit: "Send application",
    sending: "Sending…",
    sent: "Thank you, we've received your application. We'll read it and reply to you, whatever the answer.",
    error: "Something went wrong and your application wasn't sent. Please try again, or email it to hello@thynkagency.gr.",
    trap: "Leave this field empty",
  },
};

type CareersCopy = typeof en;

const el: CareersCopy = {
  head: {
    label: "Καριέρα",
    title: "Careers",
    lead: "Η Thynk αναζητά Content Creator & Social Media Manager με έδρα τα Ιωάννινα. Δεχόμαστε επίσης αιτήσεις συνεργασίας στους τομείς που θα βρείτε πιο κάτω.",
  },
  areasLabel: "Τομείς συνεργασίας",
  areas: ["Performance marketing", "Social media management", "Design", "Video editing", "Web development", "AI automation"],
  areasNote: "Freelance, μερική ή πλήρης απασχόληση. Επιλέξτε τον τομέα σας στη φόρμα παραπάνω.",
  role: {
    label: "Ανοιχτή θέση",
    badge: "Ανοιχτή · δεχόμαστε αιτήσεις",
    title: "Content Creation & Social Media Management",
    meta: "Ιωάννινα · Υβριδική εργασία (εξ αποστάσεως & γυρίσματα)",
    text: "Η Thynk Digital Agency αναζητά Content Creator & Social Media Manager με έδρα τα Ιωάννινα. Ο ρόλος καλύπτει τον σχεδιασμό και τη διαχείριση των λογαριασμών social media των πελατών μας, καθώς και την παραγωγή του περιεχομένου τους: short-form βίντεο, φωτογραφία και posts. Η εργασία είναι υβριδική: εξ αποστάσεως, με γυρίσματα στους χώρους των πελατών σε Ιωάννινα, Μέτσοβο και την ευρύτερη περιοχή.",
    doLabel: "Αρμοδιότητες",
    tasks: [
      "Σχεδιασμός μηνιαίου πλάνου περιεχομένου για τους λογαριασμούς των πελατών σε Instagram, Facebook, TikTok και LinkedIn",
      "Παραγωγή short-form βίντεο και φωτογραφιών σε γυρίσματα στους χώρους των πελατών",
      "Μοντάζ και επεξεργασία οπτικού υλικού",
      "Σύνταξη κειμένων και λεζαντών σύμφωνα με τη φωνή κάθε brand",
      "Προγραμματισμός και δημοσίευση αναρτήσεων",
      "Παρακολούθηση απόδοσης και μηνιαία αναφορά αποτελεσμάτων",
    ],
    needLabel: "Απαιτούμενα προσόντα",
    need: [
      "Κατοικία στα Ιωάννινα ή στην ευρύτερη περιοχή και δυνατότητα μετακίνησης για γυρίσματα",
      "Εμπειρία στη διαχείριση επαγγελματικών λογαριασμών social media",
      "Εμπειρία σε λήψη και μοντάζ βίντεο με κινητό ή κάμερα (CapCut, Adobe Premiere Pro ή αντίστοιχα)",
      "Δεξιότητες copywriting για social media",
      "Portfolio με δείγματα δουλειάς",
      "Οργανωτικότητα και συνέπεια σε χρονοδιαγράμματα",
    ],
    niceLabel: "Επιθυμητά προσόντα",
    nice: [
      "Βασικές γνώσεις graphic design (Canva, Adobe)",
      "Εμπειρία σε εργαλεία προγραμματισμού και analytics (π.χ. Metricool, Meta Business Suite)",
      "Προηγούμενη εμπειρία σε agency",
    ],
    button: "Κάντε αίτηση για τη θέση",
    option: "Ανοιχτή θέση: Content Creation & Social Media Management",
  },
  side: {
    title: "Αίτηση",
    text: "Διαβάζουμε κάθε αίτηση και απαντάμε σε όλους, είτε προχωρήσουμε είτε όχι.",
    steps: ["Στέλνετε την αίτησή σας", "Τη διαβάζουμε και σας απαντάμε, όποια κι αν είναι η απάντηση", "Αν ταιριάζουμε, κανονίζουμε μια συζήτηση"],
    mail: "Προτιμάτε email; Στείλτε το βιογραφικό σας στο",
  },
  form: {
    title: "Η αίτησή σας",
    lead: "Επισυνάψτε το βιογραφικό σας σε PDF. Ένα portfolio ή το προφίλ σας στο LinkedIn μάς βοηθά να γνωρίσουμε τη δουλειά σας.",
    first: { label: "ΟΝΟΜΑ", placeholder: "Το όνομά σας", error: "Συμπληρώστε το όνομά σας." },
    last: { label: "ΕΠΩΝΥΜΟ", placeholder: "Το επώνυμό σας", error: "Συμπληρώστε το επώνυμό σας." },
    email: { label: "EMAIL", placeholder: "name@example.com", error: "Συμπληρώστε ένα έγκυρο email." },
    phone: { label: "ΤΗΛΕΦΩΝΟ", placeholder: "69…", error: "Συμπληρώστε ένα έγκυρο τηλέφωνο." },
    area: { label: "ΤΟΜΕΑΣ", placeholder: "Επιλέξτε τομέα", error: "Επιλέξτε τομέα.", other: "Άλλο" },
    engagement: {
      label: "ΜΟΡΦΗ ΣΥΝΕΡΓΑΣΙΑΣ",
      error: "Επιλέξτε μία από τις επιλογές.",
      options: { freelance: "Freelance", "part-time": "Μερική απασχόληση", "full-time": "Πλήρης απασχόληση" },
    },
    portfolio: { label: "PORTFOLIO", placeholder: "https://…", error: "Συμπληρώστε ολόκληρο τον σύνδεσμο, που ξεκινά με https://" },
    linkedin: { label: "LINKEDIN", placeholder: "https://www.linkedin.com/in/…", error: "Συμπληρώστε ολόκληρο τον σύνδεσμο, που ξεκινά με https://" },
    cv: {
      label: "ΒΙΟΓΡΑΦΙΚΟ (PDF)",
      choose: "Επιλέξτε PDF",
      hint: "Έως 10 MB",
      remove: "Αφαίρεση",
      errorType: "Επιλέξτε αρχείο PDF.",
      errorSize: "Το αρχείο είναι μεγαλύτερο από 10 MB.",
      required: "Επισυνάψτε το βιογραφικό σας σε PDF.",
    },
    message: { label: "ΛΙΓΑ ΛΟΓΙΑ ΓΙΑ ΕΣΑΣ", placeholder: "Τι κάνετε και σε τι θα θέλατε να δουλέψουμε μαζί" },
    optional: "προαιρετικό",
    consentA: "Συμφωνώ να διατηρήσει η Thynk την αίτησή μου έως 12 μήνες, για να εξετάσει πιθανή συνεργασία, όπως περιγράφεται στην",
    consentLink: "Πολιτική Απορρήτου",
    consentB: ".",
    consentError: "Αποδεχτείτε την Πολιτική Απορρήτου, για να εξετάσουμε την αίτησή σας.",
    submit: "Αποστολή αίτησης",
    sending: "Αποστολή…",
    sent: "Ευχαριστούμε, λάβαμε την αίτησή σας. Θα τη διαβάσουμε και θα σας απαντήσουμε, όποια κι αν είναι η απάντηση.",
    error: "Κάτι πήγε στραβά και η αίτηση δεν στάλθηκε. Δοκιμάστε ξανά ή στείλτε τη στο hello@thynkagency.gr.",
    trap: "Αφήστε αυτό το πεδίο κενό",
  },
};

export const careersCopy: Record<Lang, CareersCopy> = { en, el };
