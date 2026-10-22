import type { Lang } from "./site-v14";

/**
 * Newsletter / updates sign-up (22/10/2026, Mike): an email field in the footer (right of «What should we look
 * at first?», above Back to top) and a small window that slides in once a visitor has spent some time on the site.
 * The consent sentence is stored with every sign-up exactly as shown (same practice as the audit and careers forms).
 * Cadence and content of the emails are not decided yet, so the copy promises no frequency.
 */
export type NewsletterCopy = {
  /** footer column label (same style as «What should we look at first?») */
  label: string;
  lead: string;
  emailLabel: string;
  placeholder: string;
  button: string;
  sending: string;
  sent: string;
  error: string;
  emailError: string;
  consentA: string;
  consentLink: string;
  consentB: string;
  consentError: string;
  trap: string;
  pop: { eyebrow: string; title: string; close: string };
};

const en: NewsletterCopy = {
  label: "Updates by email",
  lead: "Practical ideas on marketing, automation and AI for businesses, and news from Thynk. No spam.",
  emailLabel: "Email",
  placeholder: "Your email",
  button: "Subscribe",
  sending: "Subscribing…",
  sent: "Thank you, you are on the list.",
  error: "Something went wrong. Please try again, or write to us at hello@thynkagency.gr.",
  emailError: "Please enter a valid email address.",
  consentA: "I agree to receive emails from Thynk and can unsubscribe at any time, as described in the",
  consentLink: "Privacy Policy",
  consentB: ".",
  consentError: "Please tick the box so we can send you our updates.",
  trap: "Leave this field empty",
  pop: {
    eyebrow: "Thynk updates",
    title: "Our updates, in your inbox",
    close: "Close",
  },
};

const el: NewsletterCopy = {
  label: "Ενημερώσεις με email",
  lead: "Πρακτικές ιδέες για marketing, αυτοματισμούς και AI για επιχειρήσεις, και νέα της Thynk. Χωρίς spam.",
  emailLabel: "Email",
  placeholder: "Το email σας",
  button: "Εγγραφή",
  sending: "Εγγραφή…",
  sent: "Ευχαριστούμε, είστε στη λίστα.",
  error: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή γράψτε μας στο hello@thynkagency.gr.",
  emailError: "Συμπληρώστε ένα έγκυρο email.",
  consentA: "Συμφωνώ να λαμβάνω email από τη Thynk και μπορώ να διαγραφώ οποιαδήποτε στιγμή, όπως περιγράφεται στην",
  consentLink: "Πολιτική Απορρήτου",
  consentB: ".",
  consentError: "Τσεκάρετε το κουτάκι, ώστε να μπορούμε να σας στέλνουμε τις ενημερώσεις μας.",
  trap: "Αφήστε αυτό το πεδίο κενό",
  pop: {
    eyebrow: "Ενημερώσεις Thynk",
    title: "Οι ενημερώσεις μας, στο email σας",
    close: "Κλείσιμο",
  },
};

export const newsletterCopy: Record<Lang, NewsletterCopy> = { en, el };
