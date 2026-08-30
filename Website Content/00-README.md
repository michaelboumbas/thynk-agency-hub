# Thynk Website — Content Package (v1, draft)

Αυτός ο φάκελος περιέχει το **web-ready copy** για το website της Thynk (thynkagency.gr), γραμμένο στη φωνή της Thynk (βλ. project doc `05 · Brand & Voice`) — όχι το raw service menu.

## Πώς δουλεύεται

Ακολουθούμε το ίδιο workflow με Sotiria / Imperator Winery:
1. Το Lovable project για το site είναι ήδη δημιουργημένο ως **σκελετός** (βλ. link στο chat) — δεν έχει γραφτεί κώδικας ακόμα.
2. Συνδέεις το project με **GitHub** μέσα από το Lovable (Settings → GitHub).
3. Αντιγράφεις/κάνεις commit αυτά τα αρχεία (κείμενα) + τα logos στο repo, εκεί που θα υποδείξει η δομή που θα βγάλει το Lovable (συνήθως κάτω από `src/content/` ή `src/data/`).
4. Ό,τι **δεν** μπορεί να περάσει μέσω GitHub (αρχικό scaffolding, sections/components, Lovable Cloud αν χρειαστεί, integrations) το στέλνουμε ως ένα prompt στον Lovable agent — έτοιμο να γραφτεί μόλις πεις "πάμε".

## Αρχεία

- `01-hero.md` — hero section (headline, subheadline, CTA, trust bar)
- `02-nav-footer.md` — navigation, footer, επικοινωνία
- `03-services.md` — οι 2 macro-πυλώνες (Marketing / Digital Transformation) + η αναδιπλούμενη λίστα υπηρεσιών ("Ξέρω να...")
- `04-about.md` — about section (positioning + ιδρυτές)
- `05-work-customers.md` — **ανοιχτό/placeholder**, μη δημοσιεύσιμο ακόμα (βλ. παρακάτω)
- `06-lovable-base-prompt.md` — το prompt που θα στείλουμε στον Lovable agent μετά τη σύνδεση με GitHub, για το design system/routes

## ⚠️ Ανοιχτά — δεν τα έχω κλειδώσει, χρειάζονται δική σας απόφαση

Αυτά **δεν** τα εφηύρα — τα σημειώνω ως ανοιχτά όπως και στο `07 · Website & Brand Assets`:

1. **Μασκότ** — αν θα είναι κεντρικό ή υποστηρικτικό στοιχείο στο site. Στο copy παρακάτω δεν την εμφανίζω πουθενά μέχρι να αποφασιστεί.
2. **"AI readiness" στατιστικό** — το template δείχνει ένα stats-card (π.χ. "98.4% Tasks Automated"). Αυτό ήταν placeholder του γενικού template — **δεν βάζω κανέναν αριθμό** μέχρι να βρούμε 2+ αξιόπιστες πηγές, όπως λέει το `07`. Το άφησα σαν TODO στο `01-hero.md`.
3. **Πελάτες/Work section** — δεν γράφω testimonials ή λογότυπα πελατών χωρίς άδεια. Το `05-work-customers.md` είναι δομή + οδηγίες, όχι περιεχόμενο.
4. **Instagram handle mismatch** (`@thinkagency.gr` με "i" vs domain με "y") — δεν το αγγίζω, απλά το σημειώνω· αν το site θα κάνει link σε Instagram, αξίζει να αποφασιστεί πρώτα.

Ό,τι δεν είναι σημειωμένο ως ανοιχτό, είναι **έτοιμο για χρήση/commit**.
