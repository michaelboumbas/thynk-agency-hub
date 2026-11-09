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
    lead: "We're hiring a Social Media Storyteller (Content Creator & Social Media Manager) based in Ioannina. We also accept applications in the other areas listed below.",
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
    title: "Social Media Storyteller",
    meta: "Content Creator & Social Media Manager · Ioannina · Hybrid (remote & on-location shoots)",
    text: "At Thynk we believe a good idea deserves good execution. We're looking for a Social Media Storyteller based in Ioannina to plan, shoot and run our clients' content from the first idea to publication. If you enjoy setting up and running the social media of different brands, have a feel for short-form video and know what works on Meta and TikTok, we'd like to meet you.",
    doLabel: "What you'll do",
    tasks: [
      "Plan the monthly content calendar for Instagram, Facebook, TikTok and LinkedIn",
      "Propose concepts and new content, based on each client's needs",
      "Organise and run shoots (photo, video) at our clients' locations",
      "Edit video, photos and graphics",
      "Write copy and captions in each brand's voice",
      "Schedule and publish posts",
      "Adapt content based on client feedback",
      "Follow each platform's trends and suggest new formats",
      "Use AI tools every day in research, production and optimisation",
      "Track performance and report results monthly",
    ],
    alsoLabel: "You'll also contribute to",
    also: [
      "Shaping each client's content strategy",
      "Planning shoots, so they happen on time and with what they need",
      "Improving our internal processes",
      "Client presentations, with ideas and examples of work",
    ],
    needLabel: "What we're looking for",
    need: [
      "Based in Ioannina or the wider area, able to travel to shoots",
      "Experience creating content and managing business social media accounts",
      "A sense of storytelling through short-form video",
      "Experience running shoots, from planning to the final edit",
      "Shooting and editing video on phone or camera (CapCut, Adobe Premiere Pro or similar)",
      "Comfort with AI tools for content production, and the curiosity to try new ones",
      "Social media copywriting skills",
      "A portfolio of content you've created for brands",
      "Creativity, openness to feedback and attention to detail",
      "Strong organisation and reliability with deadlines",
    ],
    niceLabel: "Nice to have",
    nice: [
      "Agency experience",
      "Experience writing video scripts",
      "Basic graphic design or motion graphics skills",
      "Experience with scheduling and analytics tools (e.g. Metricool, Meta Business Suite)",
    ],
    offerLabel: "What we offer",
    offer: [
      "Pay in line with your experience. We share the range with you before the interview.",
      "Hybrid work: from home, with shoots in the Ioannina area",
      "A pleasant working environment and a team that works closely together",
      "Team nights",
      "Room to grow in a team that is growing",
      "Work with brands across sectors, from hospitality to events",
      "Working directly with the founders, with a real role from day one",
      "Daily work with AI tools and current marketing practice",
    ],
    button: "Apply for this role",
    /** the choice in the form's AREA list; stored in English */
    option: "Open role: Social Media Storyteller (Content Creator & Social Media Manager)",
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
    lead: "Αναζητούμε Social Media Storyteller (Content Creator & Social Media Manager) με έδρα τα Ιωάννινα. Δεχόμαστε επίσης αιτήσεις συνεργασίας στους τομείς που θα βρείτε πιο κάτω.",
  },
  areasLabel: "Τομείς συνεργασίας",
  areas: ["Performance marketing", "Social media management", "Design", "Video editing", "Web development", "AI automation"],
  areasNote: "Freelance, μερική ή πλήρης απασχόληση. Επιλέξτε τον τομέα σας στη φόρμα παραπάνω.",
  role: {
    label: "Ανοιχτή θέση",
    badge: "Ανοιχτή · δεχόμαστε αιτήσεις",
    title: "Social Media Storyteller",
    meta: "Content Creator & Social Media Manager · Ιωάννινα · Υβριδική εργασία (εξ αποστάσεως & γυρίσματα)",
    text: "Στη Thynk πιστεύουμε ότι μια καλή ιδέα αξίζει και καλή εκτέλεση. Αναζητούμε Social Media Storyteller με έδρα τα Ιωάννινα, για να σχεδιάζει, να γυρίζει και να τρέχει το περιεχόμενο των πελατών μας από την αρχή μέχρι τη δημοσίευση. Αν σας αρέσει να στήνετε και να τρέχετε τα social media διαφορετικών brands, έχετε αίσθηση του short-form βίντεο και ξέρετε τι δουλεύει σε Meta και TikTok, θα θέλαμε να σας γνωρίσουμε.",
    doLabel: "Τι θα κάνετε",
    tasks: [
      "Σχεδιασμός του μηνιαίου πλάνου περιεχομένου για Instagram, Facebook, TikTok και LinkedIn",
      "Προτάσεις για concepts και νέο περιεχόμενο, με βάση τις ανάγκες κάθε πελάτη",
      "Οργάνωση και υλοποίηση γυρισμάτων (φωτογραφία, βίντεο) στους χώρους των πελατών",
      "Μοντάζ και επεξεργασία βίντεο, φωτογραφιών και γραφικών",
      "Σύνταξη κειμένων και λεζαντών στη φωνή κάθε brand",
      "Προγραμματισμός και δημοσίευση αναρτήσεων",
      "Προσαρμογή του περιεχομένου με βάση το feedback των πελατών",
      "Παρακολούθηση των τάσεων κάθε πλατφόρμας και προτάσεις για νέα formats",
      "Καθημερινή χρήση εργαλείων AI στην έρευνα, την παραγωγή και τη βελτιστοποίηση",
      "Παρακολούθηση της απόδοσης και μηνιαία αναφορά αποτελεσμάτων",
    ],
    alsoLabel: "Θα συνεισφέρετε επίσης σε",
    also: [
      "Τη διαμόρφωση της στρατηγικής περιεχομένου κάθε πελάτη",
      "Τον προγραμματισμό των γυρισμάτων, ώστε να γίνονται στην ώρα τους και με ό,τι χρειάζεται",
      "Τη βελτίωση των εσωτερικών διαδικασιών μας",
      "Παρουσιάσεις σε πελάτες, με ιδέες και δείγματα δουλειάς",
    ],
    needLabel: "Τι ζητάμε",
    need: [
      "Κατοικία στα Ιωάννινα ή στην ευρύτερη περιοχή και δυνατότητα μετακίνησης για γυρίσματα",
      "Εμπειρία στη δημιουργία περιεχομένου και στη διαχείριση επαγγελματικών λογαριασμών social media",
      "Αίσθηση του storytelling μέσα από short-form βίντεο",
      "Εμπειρία σε γυρίσματα, από τον σχεδιασμό μέχρι το τελικό μοντάζ",
      "Λήψη και μοντάζ βίντεο με κινητό ή κάμερα (CapCut, Adobe Premiere Pro ή αντίστοιχα)",
      "Άνεση με εργαλεία AI για την παραγωγή περιεχομένου και διάθεση να δοκιμάζετε καινούργια",
      "Δεξιότητες copywriting για social media",
      "Portfolio με περιεχόμενο που έχετε δημιουργήσει για brands",
      "Δημιουργικότητα, δεκτικότητα στο feedback και προσοχή στη λεπτομέρεια",
      "Οργανωτικότητα και συνέπεια σε χρονοδιαγράμματα",
    ],
    niceLabel: "Επιθυμητά (αλλά όχι απαραίτητα)",
    nice: [
      "Εμπειρία σε agency",
      "Εμπειρία στη συγγραφή σεναρίων για βίντεο",
      "Βασικές γνώσεις graphic design ή motion graphics",
      "Εμπειρία σε εργαλεία προγραμματισμού και analytics (π.χ. Metricool, Meta Business Suite)",
    ],
    offerLabel: "Τι προσφέρουμε",
    offer: [
      "Αμοιβή ανάλογη με την εμπειρία σας. Το εύρος της σας το γνωστοποιούμε πριν από τη συνέντευξη.",
      "Υβριδική εργασία: από το σπίτι, με γυρίσματα στην περιοχή των Ιωαννίνων",
      "Ευχάριστο περιβάλλον εργασίας και ομάδα που δουλεύει κοντά",
      "Team nights",
      "Περιθώρια εξέλιξης μέσα σε μια ομάδα που μεγαλώνει",
      "Συνεργασία με brands από διαφορετικούς κλάδους, από τη φιλοξενία μέχρι τα events",
      "Απευθείας συνεργασία με τους ιδρυτές και ουσιαστικό ρόλο από την πρώτη μέρα",
      "Καθημερινή δουλειά με εργαλεία AI και τις νέες πρακτικές του marketing",
    ],
    button: "Κάντε αίτηση για τη θέση",
    option: "Ανοιχτή θέση: Social Media Storyteller (Content Creator & Social Media Manager)",
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
