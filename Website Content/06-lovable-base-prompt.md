# Base prompt για τον Lovable agent — να σταλεί ΜΕΤΑ τη σύνδεση με GitHub

Αυτό είναι το prompt-πρόχειρο για ό,τι δεν περνάει μέσω GitHub commit (αρχική δομή/components/design system/interaction model). Το περιεχόμενο (κείμενα) έρχεται από τα άλλα αρχεία σε αυτόν τον φάκελο και θα ζήσει σε GitHub, όχι hardcoded εδώ.

> **v2 — ενημερώθηκε μετά από interactive mockup που επιβεβαιώθηκε.** Το site ΔΕΝ είναι long-form scrolling σελίδα. Είναι fixed-viewport εφαρμογή: intro splash → home hero → τα nav items αλλάζουν "view" επί τόπου (χωρίς page-scroll, χωρίς νέα σελίδα).

---

Χτίσε ένα **fixed-viewport, single-screen site** για τη Thynk Digital Agency (Ιωάννινα) — όχι παραδοσιακό scrolling one-pager.

## 1. Intro / splash (παίζει μία φορά στο πρώτο load)
Fullscreen οθόνη: λογότυπο THYNK. στο κέντρο (μεγάλο) + το persona visual (Μούσα — θα μπει εικόνα αργότερα μέσω GitHub, βάλε προς το παρόν ένα ουδέτερο placeholder panel) + tagline "Digital Agency · Ιωάννινα". Μετά από ~1.5-2 δευτερόλεπτα (ή αν ο χρήστης πατήσει "Παράλειψη"), κάνει fade/scale-out και αποκαλύπτει το home.

## 2. Home (hero) — η προεπιλεγμένη "αρχική" όψη
- Sticky top nav (μένει ορατό σε όλες τις όψεις): λογότυπο THYNK. (αριστερά, πατώντας γυρνάει σε Home) · ABOUT / SOLUTIONS / WORK / CONTACT (κέντρο) · "Κλείσε Demo" pill button (δεξιά, μαύρο background). Σε mobile, το μενού γίνεται hamburger (τα links δεν πρέπει να εξαφανίζονται χωρίς εναλλακτικό τρόπο πρόσβασης).
- Κάτω από το nav, η οθόνη χωρίζεται σε δύο στήλες, ΧΩΡΙΣ page-scroll (`overflow:hidden` στο body):
  - Αριστερά: headline + subheadline + CTA + trust line (reserved κενό).
  - Δεξιά: persona visual panel (Μούσα placeholder) + floating "Ξέρω να..." animated card + reserved κενό slot για stats card.

## 3. Πλοήγηση: About / Solutions / Work / Contact — ΟΧΙ scroll σε section, ΟΧΙ νέα σελίδα
Όταν ο χρήστης πατάει ένα από αυτά τα 4 nav items:
- Το persona visual (Μούσα) **μετακινείται μία φορά** σε σταθερή θέση (αριστερά, μικρότερο) και **μένει εκεί ακίνητο** σε όλες τις επόμενες εναλλαγές μεταξύ About/Solutions/Work/Contact — δεν ξανακινείται κάθε φορά που αλλάζεις tab, μόνο στη μετάβαση Home → inner view (και το αντίστροφο όταν γυρνάς σε Home).
- Στα δεξιά εμφανίζεται (με fade/slide-in, ~0.4-0.6s) το περιεχόμενο του section που επιλέχθηκε, μέσα σε δικό του πλαίσιο.
- Αν το περιεχόμενο ενός section είναι ψηλότερο από το viewport (π.χ. Solutions με ανοιχτά accordions), **μόνο αυτό το δεξί πλαίσιο κάνει scroll εσωτερικά** (`overflow-y:auto` στο content panel) — η Μούσα, το nav, όλο το υπόλοιπο layout μένουν σταθερά, καμία κίνηση.
- Switching μεταξύ About ↔ Solutions ↔ Work ↔ Contact είναι απλό εναλλαγή περιεχομένου στο ίδιο δεξί πλαίσιο, όχι re-render όλης της σελίδας.

## 4. Sections (περιεχόμενο δεξιού πλαισίου)
- **About**: manifesto κείμενο + 2 founder cards (μονόγραμμα, όχι φωτογραφία μέχρι νεωτέρας).
- **Solutions**: 2 macro-πυλώνες (Marketing, Digital Transformation) ως clickable κάρτες/accordion — πατάς, ανοίγει λίστα υπηρεσιών από κάτω, μέσα στο ίδιο section (όχι νέα σελίδα).
- **Work**: reserved/teaser (θα ενεργοποιηθεί αργότερα, χωρίς fake λογότυπα πελατών).
- **Contact**: επικοινωνία + copyright (λειτουργεί σαν το "footer" — δεν υπάρχει ξεχωριστό footer band σε αυτό το μοντέλο, όλα ζουν μέσα στις όψεις).

## 5. Design system
- Palette: λευκό background, μαύρο text, πορτοκαλί accent (κοντά στο πορτοκαλί του logo), προαιρετικό ανθρακί/γκρι δεύτερο accent.
- Τυπογραφία: Open Sans (υποστηρίζει ελληνικά) — bold/extrabold για headlines, regular για body.
- Στυλ κουμπιών: μαύρα pill buttons με πορτοκαλί μικρή λεπτομέρεια.
- Καθαρό, πολύ λευκό χώρο.
- Nav highlight: το ενεργό tab (π.χ. "SOLUTIONS") να ξεχωρίζει οπτικά (π.χ. ελαφρύ background) ώστε ο χρήστης να ξέρει πού βρίσκεται.

## 6. Περιεχόμενο
Θα μπει μέσω GitHub commit από τα αρχεία `01-hero.md` έως `05-work-customers.md` σε αυτόν τον φάκελο — μην γράψεις γενικό/placeholder copy πέρα από ό,τι χρειάζεται για το σκελετό.

## 7. Μην βάλεις
Trust bar νούμερα, stats card νούμερα, testimonials, ή μασκότ — αυτά είναι σκόπιμα κενά μέχρι νεωτέρας (βλ. `00-README.md`).

## 8. Σημείωση για το UI/UX polish
Το interaction model (fixed viewport, splash → home → pinned-visual view switching) είναι επιβεβαιωμένο και κλειδωμένο. Το ακριβές οπτικό ύφος (χρώματα, spacing, τυπογραφικές λεπτομέρειες, animation feel) είναι ακόμα ανοιχτό για fine-tuning — αναμένεται επόμενος γύρος feedback πάνω στο πρώτο build.
