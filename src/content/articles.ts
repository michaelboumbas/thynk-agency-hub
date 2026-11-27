import type { Lang } from "./site-v14";

/**
 * Thynk Notes, the articles section (27/11/2026, Mike approved the canvas: list, article, mobile).
 * One entry per article. `published: false` keeps it off the site; a draft is visible only with ?preview=1.
 * The «Άρθρα» link in the menu, the pages in the sitemap and the indexing all switch on by themselves once at least
 * one article is published (ARTICLES_LIVE), so there is never an empty blog on the site.
 * Body: sections of paragraphs; an optional pull quote after a section's paragraphs.
 * ⚠️ Write real articles only, signed by whoever actually wrote or approved them.
 */
export type AuthorId = "dimitris" | "michael" | "romanna";
export type ArticleSection = { id: string; h: string; p: string[]; quote?: string };
export type Article = {
  slug: string;
  lang: Lang;
  published: boolean;
  category: string;
  title: string;
  /** the title split for the marker: these words get the orange underline (must be the start of `title`) */
  mark?: string;
  excerpt: string;
  author: AuthorId;
  /** ISO date, YYYY-MM-DD */
  date: string;
  minutes: number;
  lead: string;
  takeaways: string[];
  sections: ArticleSection[];
  /** big words on the lake cover (list + article head) */
  cover: string;
};

export const authors: Record<AuthorId, { name: Record<Lang, string>; role: string; photo: string }> = {
  dimitris: { name: { el: "Δημήτρης Χρυσοχόου", en: "Dimitris Chrysochoou" }, role: "Co-founder · AI & Automation Lead", photo: "/team/dimitris-chrysochoou.webp" },
  michael: { name: { el: "Μιχαήλ Μπούμπας", en: "Michael Boumpas" }, role: "Co-founder · Marketing & Growth Lead", photo: "/team/michael-boumpas.webp" },
  romanna: { name: { el: "Romanna Lobach", en: "Romanna Lobach" }, role: "Creative Director", photo: "/team/romanna-lobach-v2.webp" },
};

export const articles: Article[] = [
  {
    // DRAFT (27/11): the sample from the canvas. Needs the author's own read and OK before `published: true`.
    slug: "agentic-ai-gia-mikres-epiheiriseis",
    lang: "el",
    published: false,
    category: "AI",
    title: "Agentic AI για μικρές επιχειρήσεις: τι είναι και τι όχι",
    mark: "Agentic AI",
    excerpt: "Τι κάνει ένας AI agent στην πράξη, πού βοηθά μια επιχείρηση στην Ήπειρο και πού δεν αξίζει ακόμα.",
    author: "dimitris",
    date: "2026-11-27",
    minutes: 6,
    cover: "Agentic AI",
    lead: "Το «Agentic AI» είναι η λέξη της χρονιάς στην τεχνολογία. Για μια επιχείρηση στα Γιάννενα, η ερώτηση είναι πιο απλή: τι μπορεί να κάνει για μένα από τη Δευτέρα;",
    takeaways: [
      "Ένας agent κάνει εργασίες, δεν απαντά μόνο.",
      "Δουλεύει με τα δικά σας δεδομένα και εργαλεία.",
      "Ό,τι έχει ρίσκο το εγκρίνει άνθρωπος.",
    ],
    sections: [
      {
        id: "ti-einai",
        h: "Τι είναι ένας AI agent",
        p: [
          "Ένας AI agent είναι ένα πρόγραμμα που δεν απαντά μόνο σε ερωτήσεις, αλλά κάνει και κάτι: διαβάζει ένα μήνυμα, ελέγχει το ημερολόγιο, κλείνει ένα ραντεβού και ενημερώνει το CRM. Δουλεύει πάνω σε ένα υπάρχον γλωσσικό μοντέλο, όπως αυτά πίσω από το ChatGPT ή το Claude, και το προσαρμόζουμε στη γνώση και στις διαδικασίες της δικής σας επιχείρησης.",
          "Η διαφορά από έναν απλό αυτοματισμό είναι ότι ο agent μπορεί να χειριστεί και ό,τι δεν είναι πάντα ίδιο: ένα μήνυμα γραμμένο με τον δικό του τρόπο, μια ερώτηση που δεν είχαμε προβλέψει.",
        ],
        quote: "Ο agent ετοιμάζει, ο άνθρωπος εγκρίνει. Αυτός είναι ο κανόνας μας σε κάθε AI που στήνουμε.",
      },
      {
        id: "ti-den-einai",
        h: "Τι δεν είναι",
        p: [
          "Δεν είναι υπάλληλος που αποφασίζει μόνος του. Κάθε ενέργεια που έχει ρίσκο, όπως μια έκπτωση, μια ακύρωση ή μια πληρωμή, την ετοιμάζει ο agent και την εγκρίνει άνθρωπος. Δεν είναι ούτε «δικό σας AI» που εκπαιδεύτηκε από το μηδέν: είναι ένα υπάρχον μοντέλο, δεμένο με τα δικά σας δεδομένα.",
        ],
      },
      {
        id: "pou-voitha",
        h: "Πού βοηθά μια μικρή επιχείρηση",
        p: [
          "Εκεί όπου η ίδια εργασία επαναλαμβάνεται πολλές φορές την ημέρα και θέλει λίγη κρίση: απαντήσεις σε μηνύματα για διαθεσιμότητα και τιμές, αλλαγές ραντεβού, πρώτη καταγραφή ενός αιτήματος πριν φτάσει σε άνθρωπο, ταξινόμηση παραστατικών.",
          "Αντίθετα, δεν αξίζει ακόμα σε εργασίες που γίνονται σπάνια ή που κάθε φορά θέλουν απόφαση από τον ιδιοκτήτη.",
        ],
      },
      {
        id: "pos-xekiname",
        h: "Πώς ξεκινάμε με ασφάλεια",
        p: [
          "Ξεκινάμε από μία εργασία, όχι από όλη την επιχείρηση. Ορίζουμε τι επιτρέπεται να κάνει ο agent και τι όχι, τον δοκιμάζουμε με πραγματικά παραδείγματα και μετράμε τον χρόνο που γλιτώνει. Αν δεν φαίνεται όφελος, σταματάμε εκεί.",
        ],
      },
    ],
  },
];

export const ARTICLES_LIVE = articles.some((a) => a.published);

/** the articles a visitor may see in this language (drafts too with ?preview=1) */
export function visibleArticles(lang: Lang, preview = false): Article[] {
  return articles
    .filter((a) => a.lang === lang && (a.published || preview))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function formatDate(iso: string, lang: Lang, long = false) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === "el" ? "el-GR" : "en-GB", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  });
}
