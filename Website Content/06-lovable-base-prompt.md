# Base prompt για τον Lovable agent — να σταλεί ΜΕΤΑ τη σύνδεση με GitHub

Αυτό είναι το prompt-πρόχειρο για ό,τι δεν περνάει μέσω GitHub commit (αρχική δομή/components/design system). Το περιεχόμενο (κείμενα) έρχεται από τα άλλα αρχεία σε αυτόν τον φάκελο και θα ζήσει σε GitHub, όχι hardcoded εδώ.

---

Χτίσε ένα one-page hero site για τη Thynk Digital Agency (Ιωάννινα).

**Δομή σελίδας (single-page, sticky nav):**
1. Sticky top nav: λογότυπο THYNK. (αριστερά) · ABOUT / SOLUTIONS / WORK / CONTACT (κέντρο) · "Κλείσε Demo" pill button (δεξιά, μαύρο background).
2. Hero: αριστερά headline + subheadline + CTA + (κενό reserved slot για trust bar), δεξιά στατικό persona visual (θα μπει εικόνα αργότερα μέσω GitHub) + animated "Ξέρω να..." service bar στο πλάι + reserved κενό slot για stats card.
3. Solutions section: 2 κάρτες/πυλώνες (Marketing, Digital Transformation) — clickable, expand σε λίστα υπηρεσιών από κάτω (accordion ή reveal, όχι νέα σελίδα).
4. About section.
5. Work section: reserved/teaser (θα ενεργοποιηθεί αργότερα).
6. Contact section + footer.

**Design system:**
- Palette: λευκό background, μαύρο text, πορτοκαλί accent (#accent — δώσε ένα ζεστό πορτοκαλί κοντά στο turuncu του logo), προαιρετικό ανθρακί/γκρι δεύτερο accent.
- Τυπογραφία: bold, γραμμικό/geometric sans για headlines (στυλ του λογότυπου), Open Sans για body (υποστηρίζει ελληνικά).
- Στυλ κουμπιών: μαύρα pill buttons με πορτοκαλί μικρή λεπτομέρεια (βλ. "Κλείσε Demo" στο reference).
- Καθαρό, πολύ λευκό χώρο — "όλοι παίζουν μαύρο, εμείς ξεχωρίζουμε στο λευκό".
- Mobile: service bar γίνεται στατικά images με εναλλαγή κειμένων.

**Περιεχόμενο:** θα μπει μέσω GitHub commit από τα αρχεία `01-hero.md` έως `05-work-customers.md` σε αυτόν τον φάκελο — μην γράψεις γενικό/placeholder copy πέρα από ό,τι χρειάζεται για το σκελετό.

**Μην βάλεις:** trust bar νούμερα, stats card νούμερα, testimonials, ή μασκότ — αυτά είναι σκόπιμα κενά μέχρι νεωτέρας (βλ. `00-README.md`).
