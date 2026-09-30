import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { MuseStage } from "./MuseStage";
import { SCENES } from "./scenes";

/**
 * /lab: "From chaos to order" (storyboard direction B) on one fixed particle stage.
 * Every <section data-scene> is a station; the sticky card holds real HTML text.
 */

const STILL_KEY = "thynk-lab-still";
const PHONE_HREF = "tel:+300000000000"; // placeholder until the real number
const BOOK_HREF = "#epikoinonia";

const CHIPS = ["Τα τηλέφωνα", "Οι κρατήσεις", "Τα μηνύματα", "Τα χαρτιά", "Δεν έρχονται πελάτες"];

function Scene({ i, children, wide }: { i: number; children: ReactNode; wide?: boolean }) {
  const s = SCENES[i]!;
  return (
    <section id={s.id} data-scene={s.shape} className="ms-scene" aria-labelledby={`${s.id}-h`}>
      <div className={wide ? "ms-card ms-card-wide" : "ms-card"}>{children}</div>
    </section>
  );
}

export function MuseLab() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [userStill, setUserStill] = useState(false);
  const [glState, setGlState] = useState<"loading" | "ready" | "off">("loading");
  const [picked, setPicked] = useState<string[]>([]);

  // the app shell locks html/body scrolling (styles.css); unlock while mounted, like ThynkSiteV7
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const prev = els.map((e) => e.style.overflow);
    els.forEach((e) => (e.style.overflow = "visible"));
    document.documentElement.style.overflowY = "auto";
    return () => {
      els.forEach((e, i) => (e.style.overflow = prev[i] ?? ""));
      document.documentElement.style.overflowY = "";
    };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    try {
      setUserStill(window.localStorage.getItem(STILL_KEY) === "1");
    } catch {
      /* storage blocked: default to motion */
    }
    return () => mql.removeEventListener("change", on);
  }, []);

  const still = reduced || userStill;

  const toggleStill = () => {
    const v = !userStill;
    setUserStill(v);
    try {
      window.localStorage.setItem(STILL_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const go = (i: number) => {
    const el = document.getElementById(SCENES[i]!.id);
    if (!el) return;
    // land a little into the section so the card is in place and the shape has formed
    const y =
      el.getBoundingClientRect().top + window.scrollY + (i === 0 ? 0 : window.innerHeight * 0.1);
    window.scrollTo({ top: y, behavior: still ? "auto" : "smooth" });
  };

  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const i = SCENES.findIndex((s) => s.id === id);
    if (i < 0) return;
    e.preventDefault();
    go(i);
  };

  const cur = SCENES[Math.min(SCENES.length - 1, Math.max(0, scene))]!;
  const pad = (n: number) => String(n).padStart(2, "0");
  const stationText = `${pad(scene + 1)} / ${pad(SCENES.length)} · ${cur.label}`;

  return (
    <div
      ref={rootRef}
      className="ms-root"
      data-theme="dark"
      data-still={still ? "1" : "0"}
      data-gl={glState}
    >
      <MuseStage
        scenes={SCENES}
        still={still}
        themeRef={rootRef}
        onScene={setScene}
        onStatus={setGlState}
      />

      <a className="ms-skip" href="#arxi-h">
        Μετάβαση στο περιεχόμενο
      </a>

      <header className="ms-header">
        <a
          className="ms-logo"
          href="#arxi"
          onClick={(e) => onAnchor(e, "arxi")}
          aria-label="Thynk, αρχή"
        >
          THYNK<span>.</span>
        </a>
        <a
          className="ms-btn ms-btn-sm"
          href={BOOK_HREF}
          onClick={(e) => onAnchor(e, "epikoinonia")}
        >
          Κλείσε κουβέντα
        </a>
      </header>

      <nav className="ms-stations" aria-label="Σταθμοί">
        <p className="ms-stations-label" aria-live="polite">
          {stationText}
        </p>
        <ol>
          {SCENES.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className="ms-dot"
                aria-current={i === scene ? "step" : undefined}
                aria-label={`${pad(i + 1)}: ${s.label}`}
                onClick={() => go(i)}
              >
                <span />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="ms-main">
        {/* 1 · face */}
        <Scene i={0}>
          <p className="ms-kicker">THYNK · ΙΩΑΝΝΙΝΑ</p>
          <h1 id="arxi-h" className="ms-h1">
            Λιγότερες αγγαρείες. <em>Περισσότεροι πελάτες.</em>
          </h1>
          <p className="ms-lead">
            Marketing και αυτοματισμοί για επιχειρήσεις της Ηπείρου. Από δύο ανθρώπους, στα
            Γιάννενα.
          </p>
          <p className="ms-hint" aria-hidden="true">
            Κύλισε προς τα κάτω ↓
          </p>
        </Scene>

        {/* 2 · chaos */}
        <Scene i={1}>
          <h2 id="thoryvos-h" className="ms-h2">
            Η δουλειά σου έχει πολύ θόρυβο.
          </h2>
          <p>
            Τηλέφωνα που χτυπάνε στο σέρβις. Μηνύματα στο Viber, στο Instagram, στο email.
            Κρατήσεις, τιμολόγια, προσφορές. Ποιο σε τρώει πιο πολύ;
          </p>
          <div className="ms-chips" role="group" aria-label="Τι σε τρώει πιο πολύ">
            {CHIPS.map((c) => {
              const on = picked.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  className="ms-chip"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c]))}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Scene>

        {/* 3 · clock */}
        <Scene i={2}>
          <h2 id="kostos-h" className="ms-h2">
            Πόσο μου στοιχίζει;
          </h2>
          <p>
            Ένα ξενοδοχείο 14 δωματίων χάνει εύκολα{" "}
            <strong className="ms-accent">10-12 ώρες την εβδομάδα</strong> σε τηλέφωνα και ίδιες
            απαντήσεις.
          </p>
          <p className="ms-note">
            Παράδειγμα. Τα δικά σου νούμερα τα βγάζουμε μαζί, στην κουβέντα.
          </p>
        </Scene>

        {/* 4 · streams */}
        <Scene i={3} wide>
          <h2 id="ti-kanete-h" className="ms-h2">
            Δηλαδή τι κάνετε;
          </h2>
          <div className="ms-cols">
            <div className="ms-col">
              <span className="ms-col-mark ms-col-mark-glow" aria-hidden="true" />
              <p>Σου φέρνουμε πελάτες — και το μετράμε.</p>
            </div>
            <div className="ms-col">
              <span className="ms-col-mark" aria-hidden="true" />
              <p>Σου παίρνουμε τις δουλειές που επαναλαμβάνονται.</p>
            </div>
          </div>
        </Scene>

        {/* 5 · stairs */}
        <Scene i={4}>
          <h2 id="pos-xekiname-h" className="ms-h2">
            Και πώς ξεκινάμε;
          </h2>
          <ol className="ms-steps">
            <li>
              <span className="ms-step-n">1</span>
              <span>
                <strong>Κουβέντα 30΄</strong>, δωρεάν.
              </span>
            </li>
            <li>
              <span className="ms-step-n">2</span>
              <span>
                <strong>Έλεγχος (audit)</strong>, από €… — φεύγεις με λίστα.
              </span>
            </li>
            <li>
              <span className="ms-step-n">3</span>
              <span>
                <strong>Ένα πράγμα τη φορά</strong>, μετρημένο.
              </span>
            </li>
          </ol>
        </Scene>

        {/* 6 · grid */}
        <Scene i={5}>
          <h2 id="an-exafanisteite-h" className="ms-h2">
            Κι αν εξαφανιστείτε;
          </h2>
          <p>
            Λογαριασμοί, κωδικοί και δεδομένα είναι στο όνομά σου από την πρώτη μέρα. Πακέτα «όλα
            μαζί» δεν έχουμε. Υποσχέσεις χωρίς νούμερα, ούτε.
          </p>
        </Scene>

        {/* 7 · Epirus */}
        <Scene i={6}>
          <h2 id="ipeiros-h" className="ms-h2">
            Έχετε δουλέψει κάπου εδώ;
          </h2>
          <p>
            Ναι. Στο Μέτσοβο, με το <strong>myMetsovo.gr</strong>. Από τα Γιάννενα, για όλη την
            Ήπειρο.
          </p>
        </Scene>

        {/* 8 · face, calm and closer */}
        <Scene i={7} wide>
          <h2 id="anthropoi-h" className="ms-h2">
            Πίσω από τη Μούσα, δύο άνθρωποι.
          </h2>
          <div className="ms-founders">
            <figure className="ms-founder">
              <div className="ms-avatar" role="img" aria-label="Φωτογραφία σύντομα">
                <span>ΔΧ</span>
                <small>φωτογραφία σύντομα</small>
              </div>
              <figcaption>
                <strong>Δημήτρης Χρυσοχόου</strong>
                <span>νούμερα &amp; business</span>
              </figcaption>
            </figure>
            <figure className="ms-founder">
              <div className="ms-avatar" role="img" aria-label="Φωτογραφία σύντομα">
                <span>ΜΜ</span>
                <small>φωτογραφία σύντομα</small>
              </div>
              <figcaption>
                <strong>Μιχαήλ Μπούμπας</strong>
                <span>marketing &amp; creative</span>
              </figcaption>
            </figure>
          </div>
        </Scene>

        {/* 9 · contact, the face small in the corner */}
        <Scene i={8}>
          <h2 id="epikoinonia-h" className="ms-h2">
            Εντάξει. Πώς σας βρίσκω;
          </h2>
          <p>Πάρε μας τώρα ή άφησε το τηλέφωνό σου — σε παίρνουμε εμείς μέσα σε 24 ώρες.</p>
          <div className="ms-ctas">
            <a className="ms-btn" href={PHONE_HREF}>
              <span aria-hidden="true">📞</span> Πάρε τηλέφωνο
            </a>
            <a className="ms-btn ms-btn-ghost" href="#">
              Κλείσε κουβέντα 30΄
            </a>
          </div>
          <p className="ms-mail">
            ή γράψε μας: <a href="mailto:hello@thynk.gr">hello@thynk.gr</a>
          </p>
          <div className="ms-footer">
            <button
              type="button"
              className="ms-still"
              aria-pressed={still}
              onClick={toggleStill}
              disabled={reduced}
            >
              {reduced
                ? "Χωρίς κίνηση (από τη συσκευή σου)"
                : userStill
                  ? "Με κίνηση"
                  : "Χωρίς κίνηση"}
            </button>
            <span>© 2026 Thynk · Ιωάννινα</span>
          </div>
        </Scene>
      </main>

      <div className="ms-bar" role="navigation" aria-label="Γρήγορη επικοινωνία">
        <a className="ms-bar-call" href={PHONE_HREF}>
          <span aria-hidden="true">📞</span> Κάλεσε
        </a>
        <a className="ms-bar-book" href={BOOK_HREF} onClick={(e) => onAnchor(e, "epikoinonia")}>
          Κλείσε κουβέντα
        </a>
      </div>
    </div>
  );
}
