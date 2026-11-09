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
    lead: "We're hiring for our first role, based in Ioannina. Below it you'll find the other areas we work with: every good application is kept for when a project opens up.",
  },
  areasLabel: "Who we work with",
  /** Mike 17/10: these six, in this order */
  areas: ["Performance marketing", "Social media management", "Design", "Video editing", "Web development", "AI automation"],
  areasNote: "Freelance, part-time or full-time. Choose your area in the form above.",
  /**
   * 09/11/2026 (Mike): the role is open (it was «planned» since 17/10). Based in Ioannina: from home
   * and on shoots with clients in Ioannina, Metsovo and the area. Part- or full-time. No pay range (Mike's call).
   * The LinkedIn post links to /el/careers?role=content: that pre-selects this role in the form.
   * When the role closes, change it here.
   */
  role: {
    label: "Open role",
    badge: "Open · we're hiring",
    title: "Content Creation & Social Media Management",
    meta: "Ioannina · from home and on shoots with our clients · part- or full-time",
    text: "Our first hire. You'll run our clients' social media and create the content behind it: short videos, photos, posts. You'll work from home and on location with our clients in Ioannina, Metsovo and the wider area.",
    doLabel: "What you'll do",
    tasks: [
      "Plan and run our clients' monthly content on Instagram, Facebook, TikTok and LinkedIn",
      "Shoot and edit short videos and photos on location",
      "Write clear posts and captions in Greek",
      "Schedule and publish, and reply to comments and messages",
      "Follow the results and tell us what works",
    ],
    needLabel: "What we're looking for",
    need: [
      "You live in Ioannina or nearby and can get to shoots in the area",
      "You shoot and edit with a phone or a camera (CapCut, Premiere or similar)",
      "You write well in Greek",
      "A portfolio, even from your own accounts",
      "You organise your week and keep your deadlines",
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
    lead: "Ανοίγουμε την πρώτη μας θέση, με βάση τα Ιωάννινα. Πιο κάτω θα βρείτε και τους άλλους τομείς με τους οποίους συνεργαζόμαστε: κρατάμε κάθε καλή αίτηση για όταν ανοίξει ένα έργο.",
  },
  areasLabel: "Τομείς συνεργασίας",
  areas: ["Performance marketing", "Social media management", "Design", "Video editing", "Web development", "AI automation"],
  areasNote: "Freelance, μερική ή πλήρης απασχόληση. Επιλέξτε τον τομέα σας στη φόρμα παραπάνω.",
  role: {
    label: "Ανοιχτή θέση",
    badge: "Ανοιχτή · δεχόμαστε αιτήσεις",
    title: "Content Creation & Social Media Management",
    meta: "Ιωάννινα · από το σπίτι και σε γυρίσματα στους πελάτες μας · μερική ή πλήρης απασχόληση",
    text: "Η πρώτη μας πρόσληψη. Θα τρέχετε τα social media των πελατών μας και θα δημιουργείτε το περιεχόμενο πίσω από αυτά: σύντομα βίντεο, φωτογραφίες, posts. Η δουλειά γίνεται από το σπίτι και σε γυρίσματα στους πελάτες μας, στα Ιωάννινα, στο Μέτσοβο και στη γύρω περιοχή.",
    doLabel: "Τι θα κάνετε",
    tasks: [
      "Θα σχεδιάζετε και θα τρέχετε το μηνιαίο περιεχόμενο των πελατών μας σε Instagram, Facebook, TikTok και LinkedIn",
      "Θα γυρίζετε και θα μοντάρετε σύντομα βίντεο και φωτογραφίες, επί τόπου",
      "Θα γράφετε καθαρά posts και λεζάντες στα ελληνικά",
      "Θα προγραμματίζετε τις αναρτήσεις και θα απαντάτε σε σχόλια και μηνύματα",
      "Θα παρακολουθείτε τα αποτελέσματα και θα μας λέτε τι δουλεύει",
    ],
    needLabel: "Τι ζητάμε",
    need: [
      "Μένετε στα Ιωάννινα ή κοντά και μπορείτε να πηγαίνετε σε γυρίσματα στην περιοχή",
      "Γυρίζετε και μοντάρετε με κινητό ή κάμερα (CapCut, Premiere ή κάτι αντίστοιχο)",
      "Γράφετε καλά ελληνικά",
      "Portfolio, έστω και από δικούς σας λογαριασμούς",
      "Οργανώνετε την εβδομάδα σας και τηρείτε τις προθεσμίες",
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
