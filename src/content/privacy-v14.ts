/**
 * Privacy Policy, /privacy and /el/privacy (12/10/2026), written for the audit form (our database + HubSpot).
 * 17/10/2026: + applications from the Careers page (database + private CV storage + HubSpot, kept 12 months).
 * 22/10/2026: + updates by email (newsletter sign-up in the footer and the window; database + HubSpot, consent).
 * Not legal advice: have it reviewed, and add the legal name / VAT number once the general partnership is registered.
 * If anything changes (new tools, analytics, ads pixels, newsletter), this page changes with it.
 */
export type PrivacyCopy = {
  label: string;
  title: string;
  lead: string;
  updated: string;
  /** p: text before the list · list: bullet points · after: text after the list */
  sections: { h: string; p?: string[]; list?: string[]; after?: string[] }[];
};

const en: PrivacyCopy = {
  label: "Legal",
  title: "Privacy",
  lead: "What we collect when you contact us, why, where it is kept and what you can ask of us.",
  updated: "Last updated: 22 October 2026",
  sections: [
    {
      h: "Who we are",
      p: [
        "Thynk Digital Agency, Papazoglou 14D, 454 44 Ioannina, Greece. Email: hello@thynkagency.gr · Phone: +30 698 388 7522.",
        "We are responsible (the «controller») for the personal data described on this page. For anything about your data, write to hello@thynkagency.gr.",
      ],
    },
    {
      h: "What we collect",
      p: ["When you send an audit request through the form on this site, we collect:"],
      list: [
        "first and last name, email and phone number",
        "the name of your business and its industry",
        "what you would like us to look at first",
        "the date and time of the request, the page and language you sent it from, and the consent sentence you accepted",
      ],
    },
    {
      h: "Why we use it",
      p: [
        "Only to respond to your request: to contact you, arrange the first conversation and prepare the audit or an offer.",
        "Legal basis: steps taken at your request before a possible contract (Art. 6(1)(b) GDPR) and your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time without affecting what was done before.",
        "We do not send you newsletters or marketing emails unless you sign up for them separately (see «Updates by email» below), and we never sell your data.",
      ],
    },
    {
      h: "Where it is kept",
      list: [
        "Our database, hosted by Lovable Cloud (Supabase), so that no request is lost.",
        "Our CRM, HubSpot, where the request becomes a contact and we are notified by email.",
      ],
      after: [
        "Both act as processors on our behalf. Where data is processed outside the European Economic Area, this happens under the safeguards of the GDPR, such as the EU Standard Contractual Clauses. Only the founders of Thynk have access, and the database cannot be read from the website.",
      ],
    },
    {
      h: "How long we keep it",
      p: [
        "If we do not start working together, we delete your request within 24 months of our last contact, or sooner if you ask us to. If we do work together, your details become part of our client records and are kept for as long as the law requires.",
      ],
    },
    {
      h: "Applications through the Careers page",
      p: [
        "When you apply through the Careers page, we collect your first and last name, your email and phone number, the area and type of collaboration you are interested in, your CV (PDF), the links you add (portfolio, LinkedIn), the message you write, the date, page and language of the application, and the consent sentence you accepted.",
        "We use them only to consider a possible collaboration with you and to reply to you. Legal basis: your consent and steps taken at your request before a possible contract (Art. 6(1)(a) and (b) GDPR).",
        "Applications are kept in our database and CVs in private file storage on Lovable Cloud (Supabase); neither can be read from the website. We are notified by email through HubSpot, where your application also appears as a contact. Only the founders of Thynk have access.",
        "We keep an application, together with the CV, for 12 months from the day we receive it and then delete it, unless we have started working together. You can ask us to delete it sooner at any time.",
      ],
    },
    {
      h: "Updates by email",
      p: [
        "If you sign up for our updates, in the footer or in the small window on the site, we collect your email address, the language and page you signed up from, the date and time, and the consent sentence you accepted.",
        "We use your email only to send you our updates: practical ideas on marketing, automation and AI for businesses, and news from Thynk. Legal basis: your consent (Art. 6(1)(a) GDPR).",
        "Your email is kept in our database on Lovable Cloud (Supabase), which cannot be read from the website, and in our CRM, HubSpot. Only the founders of Thynk have access.",
        "Right after you sign up, we send you one email confirming the subscription, through our website platform (Lovable), from notify.thynkagency.gr.",
        "Every email we send has an unsubscribe link, and you can also unsubscribe by writing to hello@thynkagency.gr. We keep your email for as long as you are subscribed. When you unsubscribe, we stop sending and take you off the list, keeping only a note that you unsubscribed so that you are not added again by mistake.",
      ],
    },
    {
      h: "Fonts, cookies and storage",
      p: [
        "The site loads its fonts from Google Fonts, so your browser connects to Google's servers, which receive your IP address. We do not use advertising or analytics cookies. The site uses your browser's own storage only for functional purposes, for example to carry your choice from the footer to the audit form, or to remember that you closed the updates window so that it does not appear again for a while.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "You can ask to see, correct or delete your data, to restrict or object to its processing, to receive it in a portable format, and to withdraw your consent. Write to hello@thynkagency.gr and we will respond within one month.",
        "You can also lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).",
      ],
    },
  ],
};

const el: PrivacyCopy = {
  label: "Νομικά",
  title: "Απόρρητο",
  lead: "Τι συλλέγουμε όταν επικοινωνείτε μαζί μας, γιατί, πού φυλάσσεται και τι μπορείτε να μας ζητήσετε.",
  updated: "Τελευταία ενημέρωση: 22 Οκτωβρίου 2026",
  sections: [
    {
      h: "Ποιοι είμαστε",
      p: [
        "Thynk Digital Agency, Παπάζογλου 14Δ, 454 44 Ιωάννινα. Email: hello@thynkagency.gr · Τηλέφωνο: +30 698 388 7522.",
        "Είμαστε υπεύθυνοι επεξεργασίας για τα προσωπικά δεδομένα που περιγράφονται σε αυτή τη σελίδα. Για οτιδήποτε αφορά τα δεδομένα σας, γράψτε μας στο hello@thynkagency.gr.",
      ],
    },
    {
      h: "Τι συλλέγουμε",
      p: ["Όταν στέλνετε αίτημα για audit μέσω της φόρμας του site, συλλέγουμε:"],
      list: [
        "όνομα και επώνυμο, email και τηλέφωνο",
        "την επωνυμία της επιχείρησής σας και τον κλάδο της",
        "τι θέλετε να κοιτάξουμε πρώτα",
        "την ημερομηνία και ώρα του αιτήματος, τη σελίδα και τη γλώσσα από την οποία στάλθηκε, και τη φράση συναίνεσης που αποδεχτήκατε",
      ],
    },
    {
      h: "Γιατί τα χρησιμοποιούμε",
      p: [
        "Μόνο για να απαντήσουμε στο αίτημά σας: για να επικοινωνήσουμε μαζί σας, να κανονίσουμε την πρώτη συζήτηση και να ετοιμάσουμε το audit ή μια πρόταση.",
        "Νομική βάση: ενέργειες που γίνονται κατόπιν αιτήματός σας πριν από μια πιθανή σύμβαση (άρθρο 6 παρ. 1 στοιχ. β΄ ΓΚΠΔ) και η συναίνεσή σας (άρθρο 6 παρ. 1 στοιχ. α΄ ΓΚΠΔ), την οποία μπορείτε να ανακαλέσετε οποιαδήποτε στιγμή, χωρίς να επηρεάζεται ό,τι έγινε πριν.",
        "Δεν σας στέλνουμε newsletter ή διαφημιστικά email, εκτός αν εγγραφείτε χωριστά (βλ. «Ενημερώσεις με email» παρακάτω), και δεν πουλάμε ποτέ τα δεδομένα σας.",
      ],
    },
    {
      h: "Πού φυλάσσονται",
      list: [
        "Στη βάση δεδομένων μας, που φιλοξενείται στο Lovable Cloud (Supabase), ώστε να μη χάνεται κανένα αίτημα.",
        "Στο CRM μας, το HubSpot, όπου το αίτημα γίνεται επαφή και λαμβάνουμε ειδοποίηση με email.",
      ],
      after: [
        "Και οι δύο λειτουργούν ως εκτελούντες την επεξεργασία για λογαριασμό μας. Όπου τα δεδομένα επεξεργάζονται εκτός Ευρωπαϊκού Οικονομικού Χώρου, αυτό γίνεται με τις εγγυήσεις του ΓΚΠΔ, όπως οι Τυποποιημένες Συμβατικές Ρήτρες της ΕΕ. Πρόσβαση έχουν μόνο οι ιδρυτές της Thynk, και η βάση δεδομένων δεν διαβάζεται από το site.",
      ],
    },
    {
      h: "Για πόσο τα κρατάμε",
      p: [
        "Αν δεν ξεκινήσουμε συνεργασία, διαγράφουμε το αίτημά σας μέσα σε 24 μήνες από την τελευταία μας επικοινωνία, ή νωρίτερα αν μας το ζητήσετε. Αν συνεργαστούμε, τα στοιχεία σας γίνονται μέρος του αρχείου πελατών μας και φυλάσσονται όσο ορίζει ο νόμος.",
      ],
    },
    {
      h: "Αιτήσεις μέσω της σελίδας Καριέρα",
      p: [
        "Όταν κάνετε αίτηση μέσω της σελίδας Καριέρα, συλλέγουμε το όνομα και το επώνυμό σας, το email και το τηλέφωνό σας, τον τομέα και τη μορφή συνεργασίας που σας ενδιαφέρει, το βιογραφικό σας (PDF), τους συνδέσμους που προσθέτετε (portfolio, LinkedIn), το μήνυμα που γράφετε, την ημερομηνία, τη σελίδα και τη γλώσσα της αίτησης, και τη φράση συναίνεσης που αποδεχτήκατε.",
        "Τα χρησιμοποιούμε μόνο για να εξετάσουμε μια πιθανή συνεργασία μαζί σας και για να σας απαντήσουμε. Νομική βάση: η συναίνεσή σας και ενέργειες που γίνονται κατόπιν αιτήματός σας πριν από μια πιθανή σύμβαση (άρθρο 6 παρ. 1 στοιχ. α΄ και β΄ ΓΚΠΔ).",
        "Οι αιτήσεις φυλάσσονται στη βάση δεδομένων μας και τα βιογραφικά σε ιδιωτικό χώρο αρχείων στο Lovable Cloud (Supabase)· κανένα από τα δύο δεν διαβάζεται από το site. Λαμβάνουμε ειδοποίηση με email μέσω του HubSpot, όπου η αίτησή σας εμφανίζεται επίσης ως επαφή. Πρόσβαση έχουν μόνο οι ιδρυτές της Thynk.",
        "Κρατάμε μια αίτηση, μαζί με το βιογραφικό, για 12 μήνες από την ημέρα που τη λαμβάνουμε και έπειτα τη διαγράφουμε, εκτός αν έχουμε ξεκινήσει συνεργασία. Μπορείτε να μας ζητήσετε να τη διαγράψουμε νωρίτερα οποιαδήποτε στιγμή.",
      ],
    },
    {
      h: "Ενημερώσεις με email",
      p: [
        "Αν εγγραφείτε στις ενημερώσεις μας, στο footer ή στο μικρό παράθυρο του site, συλλέγουμε τη διεύθυνση email σας, τη γλώσσα και τη σελίδα από την οποία εγγραφήκατε, την ημερομηνία και ώρα, και τη φράση συναίνεσης που αποδεχτήκατε.",
        "Χρησιμοποιούμε το email σας μόνο για να σας στέλνουμε τις ενημερώσεις μας: πρακτικές ιδέες για marketing, αυτοματισμούς και AI για επιχειρήσεις, και νέα της Thynk. Νομική βάση: η συναίνεσή σας (άρθρο 6 παρ. 1 στοιχ. α΄ ΓΚΠΔ).",
        "Το email σας φυλάσσεται στη βάση δεδομένων μας στο Lovable Cloud (Supabase), που δεν διαβάζεται από το site, και στο CRM μας, το HubSpot. Πρόσβαση έχουν μόνο οι ιδρυτές της Thynk.",
        "Αμέσως μετά την εγγραφή σας, σας στέλνουμε ένα email που την επιβεβαιώνει, μέσω της πλατφόρμας του site μας (Lovable), από το notify.thynkagency.gr.",
        "Κάθε email που στέλνουμε έχει σύνδεσμο διαγραφής, και μπορείτε επίσης να διαγραφείτε γράφοντάς μας στο hello@thynkagency.gr. Κρατάμε το email σας όσο είστε εγγεγραμμένοι. Όταν διαγραφείτε, σταματάμε τις αποστολές και σας αφαιρούμε από τη λίστα, κρατώντας μόνο μια σημείωση ότι διαγραφήκατε, ώστε να μη σας προσθέσουμε ξανά κατά λάθος.",
      ],
    },
    {
      h: "Γραμματοσειρές, cookies και αποθήκευση",
      p: [
        "Το site φορτώνει τις γραμματοσειρές του από το Google Fonts, οπότε ο browser σας συνδέεται με servers της Google, που λαμβάνουν τη διεύθυνση IP σας. Δεν χρησιμοποιούμε cookies διαφήμισης ή στατιστικών. Το site χρησιμοποιεί την αποθήκευση του browser σας μόνο για λειτουργικούς σκοπούς, για παράδειγμα για να μεταφέρει την επιλογή σας από το footer στη φόρμα audit ή για να θυμάται ότι κλείσατε το παράθυρο των ενημερώσεων, ώστε να μην εμφανιστεί ξανά για ένα διάστημα.",
      ],
    },
    {
      h: "Τα δικαιώματά σας",
      p: [
        "Μπορείτε να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των δεδομένων σας, περιορισμό ή εναντίωση στην επεξεργασία, φορητότητα, και να ανακαλέσετε τη συναίνεσή σας. Γράψτε μας στο hello@thynkagency.gr και θα απαντήσουμε μέσα σε έναν μήνα.",
        "Μπορείτε επίσης να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).",
      ],
    },
  ],
};

export const privacyCopy = { en, el } as const;
