// v14 Work / case studies (07/10/2026, Mike): the accounts that run through Thynk, shown as Thynk work.
// Source of the copy: Website Content/08-work-case-studies.md (approved in chat 07/10).
// Rules: no result numbers until we have measured them (leave `results` out). Figures inside `context`
// are the client's own public facts (e.g. "two decades", "since 2018"), never our results.
// `published: false` keeps a case off the site.
// 08/10 (Mike): the brand is written «μάιμέτσοβο» in both languages (slug and domain stay mymetsovo).
// 09/10 (Mike): the brands are shown as logos, not names (home strip, cards, case head). Files in public/clients/,
// captured from each brand's own site and turned into one-colour marks; `ratio` (width/height) sizes them to the same visual weight.
// 09/10 (Mike): θamõn is off the site until the engagement is final.
// 08/10 (Mike): services per case confirmed; Meta/Google/TikTok and Pixel/CAPI are implied by Performance Marketing, never listed.
import type { Lang } from "@/content/site-v14";

export type CaseStatus = "ongoing" | "onboarding" | "delivered";

export interface CaseText {
  client: string;
  sector: string;
  location: string;
  cardLine: string;
  tags: string[];
  context: string;
  brief: string;
  /** what we do (ongoing) or did (delivered) */
  work: string;
  deliverables?: string[];
  /** measured results only; leave out until measured */
  results?: string;
}

export interface ClientLogo {
  src: string;
  /** the brand name, read out instead of the picture */
  alt: string;
  /** width / height of the file */
  ratio: number;
}

export interface CaseStudy {
  slug: string;
  status: CaseStatus;
  /** YYYY-MM, when the engagement started (or the event took place) */
  since?: string;
  published: boolean;
  url: string;
  /** shown as the link text, e.g. "manageroftheyear.gr" */
  domain: string;
  /** the brand's logo(s), one-colour PNG in public/clients/ (MOTY carries two: the awards and the club) */
  logos?: ClientLogo[];
  images?: string[];
  en: CaseText;
  el: CaseText;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "manager-of-the-year",
    status: "ongoing",
    since: "2026-10",
    published: true,
    url: "https://manageroftheyear.gr",
    domain: "manageroftheyear.gr",
    logos: [
      { src: "/clients/manager-of-the-year.png", alt: "Manager of the Year", ratio: 3.033 },
      { src: "/clients/thought-leaders-club.png", alt: "Thought Leaders Club", ratio: 1.3 },
    ],
    en: {
      client: "Manager of the Year & Thought Leaders Club",
      sector: "Business awards & executive network",
      location: "Athens",
      cardLine: "Year-round digital presence for Greece's institution of excellence in management.",
      tags: ["Strategy", "Social Media Management", "Performance Marketing", "Event Coverage"],
      context:
        "For more than two decades, the Manager of the Year Awards have recognised the executives shaping Greek business. Around them sits the Thought Leaders Club, the institution's year-round executive network of winners, judges and business leaders.",
      brief:
        "An institution that peaks on one night a year needs a voice that works all year: for the awards, the community around them, and the conversations that happen between ceremonies.",
      work:
        "We set the digital strategy for the awards and the Thought Leaders Club, run social media management across channels with an editorial calendar, run paid campaigns, and cover the award ceremony and the club's events.",
    },
    el: {
      client: "Manager of the Year & Thought Leaders Club",
      sector: "Βραβεία επιχειρηματικότητας & δίκτυο στελεχών",
      location: "Αθήνα",
      cardLine: "Ψηφιακή παρουσία όλο τον χρόνο για τον θεσμό αριστείας στο management στην Ελλάδα.",
      tags: ["Στρατηγική", "Social Media Management", "Performance Marketing", "Κάλυψη εκδηλώσεων"],
      context:
        "Για περισσότερες από δύο δεκαετίες, τα βραβεία Manager of the Year αναδεικνύουν τα στελέχη που διαμορφώνουν την ελληνική επιχειρηματικότητα. Γύρω τους λειτουργεί όλο τον χρόνο το Thought Leaders Club, το δίκτυο στελεχών του θεσμού, με νικητές, κριτές και ηγέτες της αγοράς.",
      brief:
        "Ένας θεσμός που κορυφώνεται σε μία βραδιά τον χρόνο χρειάζεται φωνή που δουλεύει όλο τον χρόνο: για τα βραβεία, για την κοινότητα γύρω τους και για τις συζητήσεις ανάμεσα στις τελετές.",
      work:
        "Χαράζουμε την ψηφιακή στρατηγική των βραβείων και του Thought Leaders Club, κάνουμε social media management σε όλα τα κανάλια με ημερολόγιο δημοσιεύσεων, τρέχουμε διαφημιστικές καμπάνιες και καλύπτουμε την τελετή απονομής και τις εκδηλώσεις του club.",
    },
  },
  {
    slug: "slide2open-shipping-finance",
    status: "ongoing",
    since: "2026-10",
    published: true,
    // ⚠️ the 2026 edition has already taken place: switch to the next edition's page once it is online
    url: "https://www.slide2open.net/el/shipping-finance-2026/",
    domain: "slide2open.net",
    logos: [
      { src: "/clients/slide2open-shipping-finance.png", alt: "Slide2Open Shipping Finance", ratio: 3.832 },
    ],
    en: {
      client: "Slide2Open Shipping Finance",
      sector: "International shipping & finance conference",
      location: "Athens",
      cardLine: "Digital communication for one of Athens' leading shipping-finance conferences.",
      tags: ["Strategy", "Social Media Management", "Performance Marketing", "Event Coverage"],
      context:
        "Organised by Slide2Open Communications since 2018, Shipping Finance brings together ministers, shipowners, bankers and international experts to match shipping interests with finance opportunities.",
      brief:
        "A high-level international audience, a dense programme and a short window around each edition. Communication has to build anticipation before, carry the conversation during, and keep the content alive after.",
      work:
        "We set the conference's digital strategy, run its social media management and paid campaigns before, during and after each edition, and cover the conference itself: speakers, sponsors and content from the sessions.",
    },
    el: {
      client: "Slide2Open Shipping Finance",
      sector: "Διεθνές συνέδριο ναυτιλίας & χρηματοδότησης",
      location: "Αθήνα",
      cardLine: "Ψηφιακή επικοινωνία για ένα από τα κορυφαία συνέδρια ναυτιλιακής χρηματοδότησης στην Αθήνα.",
      tags: ["Στρατηγική", "Social Media Management", "Performance Marketing", "Κάλυψη εκδηλώσεων"],
      context:
        "Το Shipping Finance διοργανώνεται από τη Slide2Open Communications από το 2018 και φέρνει κοντά υπουργούς, εφοπλιστές, τραπεζίτες και διεθνείς ειδικούς, συνδέοντας τη ναυτιλία με ευκαιρίες χρηματοδότησης.",
      brief:
        "Ένα διεθνές κοινό υψηλού επιπέδου, ένα πυκνό πρόγραμμα και ένα στενό χρονικό παράθυρο γύρω από κάθε διοργάνωση. Η επικοινωνία πρέπει να χτίζει προσμονή πριν, να μεταφέρει τη συζήτηση κατά τη διάρκεια και να κρατά το περιεχόμενο ζωντανό μετά.",
      work:
        "Χαράζουμε την ψηφιακή στρατηγική του συνεδρίου, κάνουμε social media management και τρέχουμε διαφημιστικές καμπάνιες πριν, κατά τη διάρκεια και μετά από κάθε διοργάνωση, και καλύπτουμε το ίδιο το συνέδριο: ομιλητές, χορηγούς και περιεχόμενο από τις συνεδρίες.",
    },
  },
  {
    slug: "eel-hellenic-logistics-association",
    status: "ongoing",
    since: "2026-10",
    published: true,
    url: "https://eel.gr",
    domain: "eel.gr",
    logos: [
      { src: "/clients/eel-hellenic-logistics-association.png", alt: "EEL – Hellenic Logistics Association", ratio: 4.295 },
    ],
    en: {
      client: "EEL – Hellenic Logistics Association",
      sector: "Professional association, logistics & supply chain",
      location: "Athens",
      cardLine: "Digital campaign for the 27th Panhellenic Supply Chain Conference.",
      tags: ["Strategy", "Social Media Management", "Performance Marketing", "Event Coverage"],
      context:
        "Founded in 1994, the Hellenic Logistics Association (EEL) is one of Greece's leading scientific bodies for logistics and the supply chain. Its annual Panhellenic Conference is produced together with Slide2Open.",
      brief:
        "Turn a respected, industry-insider conference into a must-attend event for the wider supply-chain community, on a tight timeline.",
      work:
        "We set the conference's digital strategy, run its social media management and paid campaigns that drive registrations from across the supply-chain community, and cover the conference itself.",
    },
    el: {
      client: "EEL – Ελληνική Εταιρεία Logistics",
      sector: "Επιστημονικός φορέας, logistics & εφοδιαστική αλυσίδα",
      location: "Αθήνα",
      cardLine: "Ψηφιακή καμπάνια για το 27ο Πανελλήνιο Συνέδριο Εφοδιαστικής Αλυσίδας.",
      tags: ["Στρατηγική", "Social Media Management", "Performance Marketing", "Κάλυψη εκδηλώσεων"],
      context:
        "Η Ελληνική Εταιρεία Logistics (EEL), που ιδρύθηκε το 1994, είναι από τους σημαντικότερους επιστημονικούς φορείς για τα logistics και την εφοδιαστική αλυσίδα στην Ελλάδα. Το ετήσιο Πανελλήνιο Συνέδριό της υλοποιείται σε συνεργασία με τη Slide2Open.",
      brief:
        "Ένα καταξιωμένο συνέδριο του κλάδου να γίνει το ραντεβού που δεν χάνει κανείς στην ευρύτερη κοινότητα της εφοδιαστικής αλυσίδας, σε σύντομο χρονικό διάστημα.",
      work:
        "Χαράζουμε την ψηφιακή στρατηγική του συνεδρίου, κάνουμε social media management, τρέχουμε διαφημιστικές καμπάνιες που φέρνουν εγγραφές από όλη την κοινότητα της εφοδιαστικής αλυσίδας και καλύπτουμε το ίδιο το συνέδριο.",
    },
  },
  {
    slug: "imperator-winery",
    status: "ongoing",
    published: true,
    url: "https://im-votsas.gr",
    domain: "im-votsas.gr",
    logos: [
      { src: "/clients/imperator-winery.png", alt: "Imperator Winery", ratio: 0.779 },
    ],
    en: {
      client: "Imperator Winery",
      sector: "Monastic winery",
      location: "Metsovo & East Zagori, Epirus",
      cardLine: "A new website and voice for Greece's highest monastic vineyards.",
      tags: ["Web Design", "Brand Voice", "Social Media Management", "Content Creation", "Performance Marketing"],
      context:
        "Imperator is the winery of the Holy Monastery of Votsa, with the largest and highest monastic vineyards in Greece, inside a UNESCO World Heritage cultural landscape. Its wines carry international medals and include Vlachavona, a native Metsovo variety bottled at around 150 bottles a year.",
      brief:
        "A story more than 1,300 years old, six labels, a tasting room by appointment, and an international audience. The brand needed a digital home equal to the wine.",
      work:
        "We designed and built the bilingual website, documented the brand's foundation and voice, and run its social media management, content creation and paid campaigns.",
      deliverables: ["Bilingual website (GR/EN): design & build", "Brand foundation & voice", "Social media management", "Content creation", "Paid campaigns"],
    },
    el: {
      client: "Imperator Winery",
      sector: "Μοναστηριακό οινοποιείο",
      location: "Μέτσοβο & Ανατολικό Ζαγόρι, Ήπειρος",
      cardLine: "Νέο website και φωνή για τους ορεινότερους μοναστηριακούς αμπελώνες της Ελλάδας.",
      tags: ["Web Design", "Brand Voice", "Social Media Management", "Content Creation", "Performance Marketing"],
      context:
        "Το Imperator είναι το οινοποιείο της Ιεράς Μονής Βοτσάς, με τους μεγαλύτερους και ορεινότερους μοναστηριακούς αμπελώνες στην Ελλάδα, μέσα σε Πολιτιστικό Τοπίο Παγκόσμιας Κληρονομιάς της UNESCO. Τα κρασιά του έχουν διεθνείς διακρίσεις, ανάμεσά τους και η Βλαχαβόνα, γηγενής ποικιλία του Μετσόβου με περίπου 150 φιάλες τον χρόνο.",
      brief:
        "Μια ιστορία άνω των 1.300 χρόνων, έξι ετικέτες, γευσιγνωσία κατόπιν ραντεβού και διεθνές κοινό. Το brand χρειαζόταν ψηφιακό σπίτι αντάξιο του κρασιού.",
      work:
        "Σχεδιάσαμε και κατασκευάσαμε το δίγλωσσο website, καταγράψαμε τα θεμέλια και τη φωνή του brand, και κάνουμε social media management, content creation και διαφημιστικές καμπάνιες.",
      deliverables: ["Δίγλωσσο website (EL/EN): σχεδιασμός & κατασκευή", "Θεμέλια & φωνή brand", "Social media management", "Content creation", "Διαφημιστικές καμπάνιες"],
    },
  },
  {
    slug: "mymetsovo",
    status: "ongoing",
    published: true,
    url: "https://mymetsovo.gr",
    domain: "mymetsovo.gr",
    logos: [
      { src: "/clients/mymetsovo.png", alt: "μάιμέτσοβο", ratio: 4.776 },
    ],
    en: {
      client: "μάιμέτσοβο",
      sector: "Place branding & sustainable tourism",
      location: "Metsovo, Epirus",
      cardLine: "The digital guide to the highest village in Epirus.",
      tags: ["Web Design", "Strategy", "Social Media Management", "Performance Marketing"],
      context:
        "μάιμέτσοβο is the digital guide to Metsovo, bringing stays, food, sights, the Anilio ski centre and activities together in one place for visitors.",
      brief:
        "Give a destination one coherent digital voice, so a visitor finds everything they need in one place and local businesses gain visibility.",
      work:
        "We designed and built the guide's website, set the destination's digital strategy, and run its social media management and paid campaigns, putting Metsovo in front of the travellers planning their next mountain escape.",
      deliverables: ["Website: design & build", "Digital strategy", "Social media management", "Paid campaigns"],
    },
    el: {
      client: "μάιμέτσοβο",
      sector: "Place branding & βιώσιμος τουρισμός",
      location: "Μέτσοβο, Ήπειρος",
      cardLine: "Ο ψηφιακός οδηγός για το ορεινότερο χωριό της Ηπείρου.",
      tags: ["Web Design", "Στρατηγική", "Social Media Management", "Performance Marketing"],
      context:
        "Το μάιμέτσοβο είναι ο ψηφιακός οδηγός του Μετσόβου: διαμονή, φαγητό, αξιοθέατα, το χιονοδρομικό Ανηλίου και δραστηριότητες, όλα σε ένα σημείο.",
      brief:
        "Ένας προορισμός να αποκτήσει μία ενιαία ψηφιακή φωνή, ώστε ο επισκέπτης να βρίσκει ό,τι χρειάζεται σε ένα σημείο και οι τοπικές επιχειρήσεις να κερδίζουν προβολή.",
      work:
        "Σχεδιάσαμε και κατασκευάσαμε το website του οδηγού, χαράζουμε την ψηφιακή στρατηγική του προορισμού κάνουμε social media management και τρέχουμε τις διαφημιστικές καμπάνιες του, φέρνοντας το Μέτσοβο μπροστά στους ταξιδιώτες που σχεδιάζουν την επόμενη απόδρασή τους στο βουνό.",
      deliverables: ["Website: σχεδιασμός & κατασκευή", "Ψηφιακή στρατηγική", "Social media management", "Διαφημιστικές καμπάνιες"],
    },
  },
  {
    slug: "anadelta-edu",
    status: "ongoing",
    published: true,
    url: "https://anadelta.edu.gr",
    domain: "anadelta.edu.gr",
    logos: [
      { src: "/clients/anadelta-edu.png", alt: "The Anadelta Edu", ratio: 2.462 },
    ],
    en: {
      client: "The Anadelta Edu",
      sector: "Education & career guidance",
      location: "Greece",
      cardLine: "Performance marketing that turns interest in education into enrolments.",
      tags: ["Strategy", "Social Media Management", "Performance Marketing", "Tracking & Data"],
      context:
        "The Anadelta Edu supports students and young professionals with university course tutoring, vocational guidance, mentoring and career services.",
      brief:
        "Generate qualified leads and sales, starting with the Academy's university tutoring courses, and measure every euro along the way.",
      work:
        "We set the digital strategy, run social media management and paid campaigns, and build the tracking and data setup behind them, so every campaign is optimised against leads and sales, not clicks.",
    },
    el: {
      client: "The Anadelta Edu",
      sector: "Εκπαίδευση & επαγγελματικός προσανατολισμός",
      location: "Ελλάδα",
      cardLine: "Performance marketing που μετατρέπει το ενδιαφέρον για την εκπαίδευση σε εγγραφές.",
      tags: ["Στρατηγική", "Social Media Management", "Performance Marketing", "Tracking & δεδομένα"],
      context:
        "Το The Anadelta Edu στηρίζει φοιτητές και νέους επαγγελματίες με υποστήριξη σε πανεπιστημιακά μαθήματα, επαγγελματικό προσανατολισμό, mentoring και υπηρεσίες καριέρας.",
      brief:
        "Να φέρνει ποιοτικά leads και πωλήσεις, ξεκινώντας από τα πανεπιστημιακά μαθήματα του Academy, μετρώντας κάθε ευρώ στην πορεία.",
      work:
        "Χαράζουμε την ψηφιακή στρατηγική, κάνουμε social media management, τρέχουμε διαφημιστικές καμπάνιες και στήνουμε το tracking και τα δεδομένα πίσω τους, ώστε κάθε καμπάνια να βελτιστοποιείται με βάση leads και πωλήσεις, όχι clicks.",
    },
  },
  {
    slug: "youth-choice-epirus-forum",
    status: "delivered",
    since: "2026-07",
    published: true,
    url: "https://youthchoice.gr",
    domain: "youthchoice.gr",
    logos: [
      { src: "/clients/youth-choice-epirus-forum.png", alt: "Youth Choice Epirus Forum", ratio: 4.324 },
    ],
    en: {
      client: "Youth Choice Epirus Forum",
      sector: "Education & career event",
      location: "Ioannina",
      cardLine: "A new forum connecting the next generation of Epirus with education and careers.",
      tags: ["Strategy", "Social Media Management", "Performance Marketing"],
      context:
        "Youth Choice Epirus Forum, powered by Anadelta Education, brought universities, colleges, career experts and the business community of Epirus together for high-school students and parents, on 8 July 2026 at the Epirus Palace in Ioannina.",
      brief:
        "Launch a brand-new event from zero: fill a free event with students and parents, and give sponsors and educational partners a reason to be there.",
      work:
        "We built the launch strategy and ran the forum's social media management and paid campaigns, driving pre-registrations from students and parents across Epirus.",
    },
    el: {
      client: "Youth Choice Epirus Forum",
      sector: "Εκδήλωση εκπαίδευσης & καριέρας",
      location: "Ιωάννινα",
      cardLine: "Ένα νέο forum που συνδέει τη νέα γενιά της Ηπείρου με την εκπαίδευση και την καριέρα.",
      tags: ["Στρατηγική", "Social Media Management", "Performance Marketing"],
      context:
        "Το Youth Choice Epirus Forum, με τη στήριξη της Anadelta Education, έφερε κοντά πανεπιστήμια, κολέγια, συμβούλους καριέρας και την επιχειρηματική κοινότητα της Ηπείρου για μαθητές Λυκείου και γονείς, στις 8 Ιουλίου 2026 στο Epirus Palace στα Ιωάννινα.",
      brief:
        "Μια ολοκαίνουργια διοργάνωση να ξεκινήσει από το μηδέν: να γεμίσει μια δωρεάν εκδήλωση με μαθητές και γονείς, και να δώσει σε χορηγούς και εκπαιδευτικούς φορείς λόγο να είναι εκεί.",
      work:
        "Χτίσαμε τη στρατηγική του λανσαρίσματος και κάναμε το social media management και τις διαφημιστικές καμπάνιες του forum, φέρνοντας προεγγραφές μαθητών και γονέων από όλη την Ήπειρο.",
    },
  },
  {
    slug: "thamon",
    status: "onboarding",
    // 09/10 (Mike): off the site until the engagement is final (was live 08/10)
    published: false,
    url: "https://www.thamon.gr",
    domain: "thamon.gr",
    en: {
      client: "θamõn",
      sector: "Restaurant, Epirote cuisine",
      location: "Ioannina",
      cardLine: "Rooting a contemporary restaurant in the gastronomic tradition of Ioannina.",
      // ⚠️ "Podcast" is a new service: not yet on the Services page
      tags: ["Strategy", "Brand Positioning", "Social Media Management", "Performance Marketing", "Content Creation", "Podcast"],
      context:
        "θamõn is a restaurant in the heart of Ioannina that cooks the best local produce of Epirus, from farm to table, with cooking lessons, catering and private dining alongside it.",
      brief:
        "Connect θamõn with the city it cooks for: make it the restaurant most closely tied to the traditional cuisine of Ioannina and to the authenticity of Epirus.",
      work:
        "We set the brand positioning and strategy, run social media management, content creation and paid campaigns, and produce a podcast that tells the story of Epirote gastronomy through θamõn's kitchen.",
    },
    el: {
      client: "θamõn",
      sector: "Εστιατόριο, ηπειρώτικη κουζίνα",
      location: "Ιωάννινα",
      cardLine: "Ένα σύγχρονο εστιατόριο με ρίζες στη γαστρονομική παράδοση των Ιωαννίνων.",
      tags: ["Στρατηγική", "Brand Positioning", "Social Media Management", "Performance Marketing", "Content Creation", "Podcast"],
      context:
        "Το θamõn είναι εστιατόριο στην καρδιά των Ιωαννίνων που μαγειρεύει τα καλύτερα τοπικά προϊόντα της Ηπείρου, από το χωράφι στο τραπέζι, με μαθήματα μαγειρικής, catering και ιδιωτικά δείπνα.",
      brief:
        "Το θamõn να συνδεθεί με την πόλη για την οποία μαγειρεύει: να γίνει το εστιατόριο που δένεται περισσότερο με την παραδοσιακή κουζίνα των Ιωαννίνων και την αυθεντικότητα της Ηπείρου.",
      work:
        "Χαράζουμε το brand positioning και τη στρατηγική, κάνουμε social media management, content creation και διαφημιστικές καμπάνιες, και παράγουμε ένα podcast που αφηγείται την ηπειρώτικη γαστρονομία μέσα από την κουζίνα του θamõn.",
    },
  },
];

export const publishedCases = caseStudies.filter((c) => c.published);

/** a published case by slug, or undefined (unknown or hidden) */
export function getCase(slug: string): CaseStudy | undefined {
  return publishedCases.find((c) => c.slug === slug);
}

/** the case text in a language */
export function caseText(cs: CaseStudy, lang: Lang): CaseText {
  return cs[lang];
}

/** the next published case, wrapping around (for the "Next case" link) */
export function nextCase(slug: string): CaseStudy {
  const i = publishedCases.findIndex((c) => c.slug === slug);
  return publishedCases[(i + 1) % publishedCases.length];
}
