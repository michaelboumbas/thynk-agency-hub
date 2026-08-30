# Base prompt για τον Lovable agent — να σταλεί ΜΕΤΑ τη σύνδεση με GitHub

Αυτό είναι το prompt-πρόχειρο για ό,τι δεν περνάει μέσω GitHub commit (αρχική δομή/components/design system/interaction model). Το περιεχόμενο (κείμενα) έρχεται από τα άλλα αρχεία σε αυτόν τον φάκελο και θα ζήσει σε GitHub, όχι hardcoded εδώ.

> **v3 — ενημερώθηκε μετά από 2ο interactive mockup που επιβεβαιώθηκε.** Το site ΔΕΝ είναι long-form scrolling σελίδα. Είναι fixed-viewport εφαρμογή: intro splash → home hero → τα nav items αλλάζουν "view" επί τόπου (χωρίς page-scroll, χωρίς νέα σελίδα). Το v3 προσθέτει το επιβεβαιωμένο οπτικό ύφος: dark-first "precision SaaS" (Linear/Stripe/Vercel αίσθηση), πορτοκαλί accent που λάμπει, restrained-αλλά-crisp micro-interactions.

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

## 5. Design system — ΕΠΙΒΕΒΑΙΩΜΕΝΟ (v3, μετά από 2 γύρους feedback)

**Κατεύθυνση:** "Precision SaaS" — αίσθηση Linear / Stripe / Vercel. Σκούρο, ήρεμο, technical-clean, με ένα ζωντανό σημείο φωτός (το accent) που κατευθύνει το μάτι.

- **Palette — dark-first, ΣΤΑΘΕΡΟ (όχι light/dark toggle ανάλογα με το σύστημα).** Το σκούρο ΕΙΝΑΙ το design, ίδια λογική με Linear/Stripe: near-black background (`#0B0C0E` περίπου), δύο επίπεδα "raised" surface για κάρτες/panels λίγο πιο ανοιχτά, λεπτές γκρι γραμμές-όρια (hairlines), ζεστό λευκό/off-white για το κείμενο.
- **Accent: πορτοκαλί που λάμπει.** Το πορτοκαλί του λογότυπου, αλλά με πραγματικό glow (soft box-shadow/blur), όχι επίπεδο χρώμα. Το glow μπαίνει με μέτρο σε: το βελάκι μέσα στα CTA buttons, το ενεργό dot στο accordion, μικρές highlight λεπτομέρειες (π.χ. μία λέξη στον τίτλο), τους κόμβους του "δικτύου σκέψης" (Μούσα placeholder visual).
- **Τυπογραφία — ισορροπημένη, editorial (όχι oversized, όχι dashboard-dense):**
  - Open Sans (locked, υποστηρίζει ελληνικά) για ΟΛΟΥΣ τους τίτλους και το σώμα κειμένου — bold/extrabold για headlines, regular για body.
  - Ένα δεύτερο, monospace typeface (π.χ. JetBrains Mono) ΜΟΝΟ για μικρές, καθαρά λατινικές διακοσμητικές ετικέτες — nav items (About/Solutions/Work/Contact), tags όπως "Marketing"/"Digital Transformation", υπο-ενότητες μέσα στο Solutions accordion. **Ποτέ σε κείμενο που περιέχει ελληνικά** — π.χ. όχι στο "Established 2026 · Ιωάννινα" ή στο "Ξέρω να...".
- **Micro-interactions, restrained αλλά crisp (Linear/Stripe αίσθηση, όχι θεαματικά):**
  - Το ενεργό nav item έχει ένα pill background που **γλιστράει** (slide, ~0.3-0.4s) στη σωστή θέση κάθε φορά που αλλάζει το view, αντί να εμφανίζεται/εξαφανίζεται απότομα.
  - Ήπιο glow στο hover/focus πάνω σε buttons, κάρτες, floating cards.
  - Πολύ ήπια 3D κλίση (tilt, μερικές μοίρες μόνο) στο persona visual panel όταν κινείται το ποντίκι πάνω του — καθρεφτίζει το mouse position, επιστρέφει ομαλά όταν φεύγει το ποντίκι. Απενεργοποιείται σε touch συσκευές και σε `prefers-reduced-motion`.
  - Λεπτό grid-texture (πολύ χαμηλή αδιαφάνεια) πίσω από το persona visual panel, για πιο "τεχνικό"/precision αίσθημα.
- **Στυλ κουμπιών:** pill-shaped, σκούρο/ουδέτερο background (όχι γεμάτο πορτοκαλί — το πορτοκαλί μένει accent, όχι fill), με το μικρό βελάκι-κύκλο πάντα σε πορτοκαλί με glow.
- **Nav highlight:** το ενεργό tab ξεχωρίζει με το sliding pill παραπάνω· σε mobile (hamburger dropdown) αρκεί έντονο text color στο ενεργό item.
- **Reduced motion:** όλα τα animations (splash, ticker, tilt, canvas movement) πρέπει να έχουν ήσυχο fallback όταν είναι ενεργό το `prefers-reduced-motion`.

## 6. Περιεχόμενο
Θα μπει μέσω GitHub commit από τα αρχεία `01-hero.md` έως `05-work-customers.md` σε αυτόν τον φάκελο — μην γράψεις γενικό/placeholder copy πέρα από ό,τι χρειάζεται για το σκελετό.

## 7. Μην βάλεις
Trust bar νούμερα, stats card νούμερα, testimonials, ή μασκότ — αυτά είναι σκόπιμα κενά μέχρι νεωτέρας (βλ. `00-README.md`).

## 8. Σημείωση για το UI/UX polish
Το interaction model (fixed viewport, splash → home → pinned-visual view switching) ΚΑΙ το οπτικό ύφος (§5, dark-first precision SaaS + πορτοκαλί glow + micro-interactions) είναι πλέον και τα δύο επιβεβαιωμένα/κλειδωμένα μέσω 2 γύρων interactive HTML mockups. Ό,τι μικροδιαφορές προκύψουν στο πρώτο πραγματικό build (π.χ. ακριβές μέγεθος glow, ταχύτητα animations) είναι φυσιολογικό fine-tuning πάνω σε ήδη συμφωνημένη κατεύθυνση — όχι ανοιχτό ερώτημα.
