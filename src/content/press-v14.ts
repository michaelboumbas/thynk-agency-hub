import type { Lang } from "./site-v14";

/**
 * Press (17/10/2026, Mike): what others have written about Thynk, plus a kit for journalists.
 * Page: src/components/thynk14/press.tsx · routes /press and /el/press.
 *
 * Rules for an entry (agreed with Mike 17/10):
 * - Only the outlet, the headline as published and a link. Never the article's text or its photo.
 * - `note` is our own one line, in both languages, never the article's words.
 * - The outlet's name is set in our type, not its logo (no permission questions, one look for all).
 * - One press release picked up by many sites counts once: list the source that matters most.
 * - Keep a PDF of every article in Drive; if a link dies, set `published: false` or point `url` to an archive.
 *
 * To add one: a new object at the top of `pressItems`. The page sorts by date, newest first.
 */

export type PressType = "article" | "interview" | "podcast" | "tv" | "radio";

export type PressItem = {
  id: string;
  outlet: string;
  /** the domain shown in the link text */
  site: string;
  url: string;
  /** YYYY-MM-DD, the outlet's own publication date */
  date: string;
  type: PressType;
  /** the language the piece is written in */
  lang: Lang;
  /** the headline exactly as published, in its own language */
  headline: string;
  /** our own line about it */
  note: Record<Lang, string>;
  published: boolean;
};

export const pressItems: PressItem[] = [
  {
    id: "marketing-week-2026-10",
    outlet: "Marketing Week",
    site: "marketingweek.gr",
    url: "https://marketingweek.gr/neo-digital-agency-stin-elliniki-agora/",
    date: "2026-10-15",
    type: "article",
    lang: "el",
    headline: "Νέο digital agency στην ελληνική αγορά",
    note: {
      en: "The Greek trade magazine for marketing and communications reported on the launch of Thynk in Ioannina and the two fields we work in: digital marketing, and digital transformation with AI and automation.",
      el: "Το περιοδικό του κλάδου marketing και επικοινωνίας έγραψε για το ξεκίνημα της Thynk στα Ιωάννινα και για τα δύο πεδία στα οποία δουλεύουμε: το digital marketing και τον ψηφιακό μετασχηματισμό με AI και αυτοματισμούς.",
    },
    published: true,
  },
];

/** what the page shows: published entries, newest first */
export const publishedPress = pressItems
  .filter((p) => p.published)
  .sort((a, b) => b.date.localeCompare(a.date));

/** the press kit (contact: hello@, so both founders see it — Mike 17/10) */
export const pressKit = {
  email: "hello@thynkagency.gr",
  zip: "/press/thynk-press-kit.zip",
};

const en = {
  head: {
    label: "Press",
    title: "Press",
    lead: "What the press has written about Thynk. Every entry links to the original publication, in the words of those who wrote it.",
  },
  listLabel: "Articles about Thynk",
  types: { article: "Article", interview: "Interview", podcast: "Podcast", tv: "TV", radio: "Radio" },
  inLang: { en: "In English", el: "In Greek" },
  read: "Read on {site}",
  newTab: "(opens in a new tab)",
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  /** the line on the About page that leads here */
  aboutLine: "In the press:",
  kit: {
    label: "Press kit",
    title: "For journalists",
    intro: "Everything you need to write about Thynk: a contact, a short description and our logo files.",
    spelling: "Our name is written Thynk, with a y.",
    contactLabel: "Press contact",
    aboutLabel: "About Thynk",
    about:
      "Thynk Digital Agency is a marketing and digital transformation agency based in Ioannina, Greece. It was founded in 2026 by Dimitris Chrysochoou and Michael Boumpas and works with businesses across Greece and abroad. Its services cover digital marketing (advertising, social media, content and email) and digital transformation with AI (automation, data and reporting), along with consulting and web design. Every collaboration starts with an audit that shows where a business stands today and which steps will make the biggest difference first. thynkagency.gr",
    copy: "Copy text",
    copied: "Copied",
    logosLabel: "Logo pack",
    download: "Download the logo pack",
    logosNote: "ZIP, about 150 KB. The wordmark in dark and white, on transparent and solid backgrounds, and the icon. PNG.",
  },
};

type PressCopy = typeof en;

const el: PressCopy = {
  head: {
    label: "Στον Τύπο",
    title: "Press",
    lead: "Όσα έχει γράψει ο Τύπος για τη Thynk. Κάθε δημοσίευμα οδηγεί στην αρχική του πηγή, με τα λόγια όσων το έγραψαν.",
  },
  listLabel: "Δημοσιεύματα για τη Thynk",
  types: { article: "Άρθρο", interview: "Συνέντευξη", podcast: "Podcast", tv: "Τηλεόραση", radio: "Ραδιόφωνο" },
  inLang: { en: "Στα αγγλικά", el: "Στα ελληνικά" },
  read: "Διαβάστε το στο {site}",
  newTab: "(ανοίγει σε νέα καρτέλα)",
  months: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαΐ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
  aboutLine: "Στον Τύπο:",
  kit: {
    label: "Υλικό Τύπου",
    title: "Για δημοσιογράφους",
    intro: "Ό,τι χρειάζεστε για να γράψετε για τη Thynk: επαφή, σύντομη περιγραφή και τα αρχεία του λογότυπου.",
    spelling: "Το όνομά μας γράφεται Thynk, με y.",
    contactLabel: "Επικοινωνία για τον Τύπο",
    aboutLabel: "Σχετικά με τη Thynk",
    about:
      "Η Thynk Digital Agency είναι εταιρεία marketing και ψηφιακού μετασχηματισμού με έδρα τα Ιωάννινα. Ιδρύθηκε το 2026 από τον Δημήτρη Χρυσοχόου και τον Μιχαήλ Μπούμπα και συνεργάζεται με επιχειρήσεις σε όλη την Ελλάδα και στο εξωτερικό. Οι υπηρεσίες της καλύπτουν το digital marketing (διαφήμιση, social media, περιεχόμενο και email) και τον ψηφιακό μετασχηματισμό με AI (αυτοματισμοί, δεδομένα και αναφορές), καθώς και συμβουλευτική και κατασκευή ιστοσελίδων. Κάθε συνεργασία ξεκινά με ένα audit, που δείχνει πού βρίσκεται σήμερα η επιχείρηση και ποια βήματα θα κάνουν πρώτα τη μεγαλύτερη διαφορά. thynkagency.gr",
    copy: "Αντιγραφή κειμένου",
    copied: "Αντιγράφηκε",
    logosLabel: "Λογότυπα",
    download: "Λήψη των λογοτύπων",
    logosNote: "ZIP, περίπου 150 KB. Το λογότυπο σε σκούρο και λευκό, σε διάφανο και συμπαγές φόντο, και το εικονίδιο. PNG.",
  },
};

export const pressCopy: Record<Lang, PressCopy> = { en, el };

/** "15 Oct 2026" / "15 Οκτ 2026", without Intl, so server and browser always agree */
export function pressDate(iso: string, lang: Lang) {
  const [y, m = 0, d] = iso.split("-").map(Number);
  return `${d} ${pressCopy[lang].months[m - 1]} ${y}`;
}
