import type { Lang } from "./site-v14";

/**
 * Cookie policy, /cookies and /el/cookies (26/11/2026, Mike).
 * Written from what the site actually does today (checked in the code on 26/11):
 *  - it sets no cookies of its own, and loads no analytics or advertising scripts (no GA4, no Meta pixel, no HubSpot tracking code);
 *  - it keeps a few functional entries in the browser's storage (the list below);
 *  - the browser connects to Google Fonts, and on /contact to OpenFreeMap + jsDelivr (Google Maps only as a fallback).
 * Because only strictly necessary/functional storage is used, no consent banner is needed today.
 * ⚠️ The day analytics (e.g. GA4) or an ads pixel is added, this page changes and a consent banner (accept/reject) comes first.
 */
export type CookieRow = { name: string; kind: string; purpose: string; kept: string };
export type CookiesCopy = {
  label: string;
  title: string;
  lead: string;
  updated: string;
  toc: string;
  sections: { id: string; h: string; p?: string[]; table?: { head: [string, string, string, string]; rows: CookieRow[] }; list?: string[] }[];
};

const el: CookiesCopy = {
  label: "Νομικά",
  title: "Cookies",
  lead: "Τι αποθηκεύει το site στον browser σας, με ποιες υπηρεσίες συνδέεται και πώς το ελέγχετε.",
  updated: "Τελευταία ενημέρωση: 26 Νοεμβρίου 2026",
  toc: "ΣΕ ΑΥΤΗ ΤΗ ΣΕΛΙΔΑ",
  sections: [
    {
      id: "short",
      h: "Με λίγα λόγια",
      p: [
        "Το site της Thynk δεν χρησιμοποιεί cookies διαφήμισης ή στατιστικών και δεν σας παρακολουθεί από site σε site. Γι' αυτό δεν σας ζητάμε συναίνεση με παράθυρο cookies.",
        "Κρατάμε στον browser σας μόνο λίγες λειτουργικές πληροφορίες, όπως τη γλώσσα που διαλέξατε, ώστε το site να δουλεύει όπως το περιμένετε.",
      ],
    },
    {
      id: "storage",
      h: "Τι αποθηκεύεται στον browser σας",
      p: ["Οι παρακάτω πληροφορίες μένουν μόνο στη συσκευή σας. Δεν περιέχουν προσωπικά στοιχεία και δεν μας στέλνονται."],
      table: {
        head: ["Όνομα", "Τύπος", "Σκοπός", "Διάρκεια"],
        rows: [
          { name: "thynk-lang", kind: "Local storage", purpose: "Θυμάται αν διαλέξατε ελληνικά ή αγγλικά.", kept: "Μέχρι να το διαγράψετε" },
          { name: "thynk-lang-now", kind: "Session storage", purpose: "Κρατά τη γλώσσα της σελίδας που διαβάζετε, όσο είναι ανοιχτή η καρτέλα.", kept: "Μέχρι να κλείσει η καρτέλα" },
          { name: "t15-talk-min", kind: "Local storage", purpose: "Θυμάται ότι μικρύνατε το κουμπί «Let's talk».", kept: "Μέχρι να το διαγράψετε" },
          { name: "thynk:newsletter", kind: "Local storage", purpose: "Θυμάται ότι γραφτήκατε στις ενημερώσεις, ώστε να μη σας το ξαναζητάμε.", kept: "Μέχρι να το διαγράψετε" },
        ],
      },
    },
    {
      id: "third",
      h: "Υπηρεσίες με τις οποίες συνδέεται ο browser σας",
      p: [
        "Για να φορτώσουν ορισμένα μέρη του site, ο browser σας συνδέεται με servers τρίτων, που λαμβάνουν τη διεύθυνση IP σας όπως σε κάθε σύνδεση στο internet:",
      ],
      list: [
        "Google Fonts: για τις γραμματοσειρές του site, σε κάθε σελίδα.",
        "OpenFreeMap και jsDelivr: για τον χάρτη της σελίδας Επικοινωνίας. Αν ο χάρτης δεν φορτώσει, εμφανίζεται στη θέση του χάρτης του Google Maps.",
        "Google Calendar: μόνο αν πατήσετε για να κλείσετε κλήση, οπότε ανοίγει η σελίδα κρατήσεων της Google.",
      ],
    },
    {
      id: "control",
      h: "Πώς το ελέγχετε",
      p: [
        "Μπορείτε να διαγράψετε τα παραπάνω από τις ρυθμίσεις του browser σας (ιστορικό ή δεδομένα ιστότοπων) ή να μπλοκάρετε την αποθήκευση για το thynkagency.gr. Το site θα συνεχίσει να λειτουργεί· απλώς δεν θα θυμάται τις επιλογές σας.",
      ],
    },
    {
      id: "changes",
      h: "Αλλαγές",
      p: [
        "Αν προσθέσουμε ποτέ εργαλεία στατιστικών ή διαφήμισης, θα ενημερώσουμε αυτή τη σελίδα και θα σας ζητήσουμε πρώτα τη συναίνεσή σας. Για οτιδήποτε άλλο, γράψτε μας στο hello@thynkagency.gr. Περισσότερα για τα προσωπικά σας δεδομένα θα βρείτε στην Πολιτική Απορρήτου.",
      ],
    },
  ],
};

const en: CookiesCopy = {
  label: "Legal",
  title: "Cookies",
  lead: "What this site keeps in your browser, which services it connects to and how you control it.",
  updated: "Last updated: 26 November 2026",
  toc: "ON THIS PAGE",
  sections: [
    {
      id: "short",
      h: "In short",
      p: [
        "The Thynk website uses no advertising or analytics cookies and does not track you from site to site. That is why we don't ask for consent with a cookie banner.",
        "We keep only a few functional details in your browser, such as the language you picked, so the site works as you expect.",
      ],
    },
    {
      id: "storage",
      h: "What is stored in your browser",
      p: ["These stay on your device only. They contain no personal data and are not sent to us."],
      table: {
        head: ["Name", "Type", "Purpose", "Kept for"],
        rows: [
          { name: "thynk-lang", kind: "Local storage", purpose: "Remembers whether you chose Greek or English.", kept: "Until you delete it" },
          { name: "thynk-lang-now", kind: "Session storage", purpose: "Keeps the language of the page you are reading while the tab is open.", kept: "Until the tab closes" },
          { name: "t15-talk-min", kind: "Local storage", purpose: "Remembers that you minimised the «Let's talk» button.", kept: "Until you delete it" },
          { name: "thynk:newsletter", kind: "Local storage", purpose: "Remembers that you signed up for updates, so we don't ask again.", kept: "Until you delete it" },
        ],
      },
    },
    {
      id: "third",
      h: "Services your browser connects to",
      p: ["To load some parts of the site, your browser connects to third-party servers, which receive your IP address like any connection on the internet:"],
      list: [
        "Google Fonts: for the site's fonts, on every page.",
        "OpenFreeMap and jsDelivr: for the map on the Contact page. If the map can't load, a Google Maps map is shown instead.",
        "Google Calendar: only if you click to book a call, which opens Google's booking page.",
      ],
    },
    {
      id: "control",
      h: "How to control it",
      p: [
        "You can delete the above in your browser settings (history or site data), or block storage for thynkagency.gr. The site keeps working; it just won't remember your choices.",
      ],
    },
    {
      id: "changes",
      h: "Changes",
      p: [
        "If we ever add analytics or advertising tools, we will update this page and ask for your consent first. For anything else, write to hello@thynkagency.gr. More on your personal data is in our Privacy Policy.",
      ],
    },
  ],
};

export const cookiesCopy: Record<Lang, CookiesCopy> = { el, en };
