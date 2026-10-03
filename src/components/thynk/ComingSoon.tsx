import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PlanetField } from "@/components/thynk13/PlanetField";

/**
 * Coming Soon (03/10, Mike): the public face until launch, now in the v14 «Thynk Clean» style:
 * white page, the dot planet + space dust behind, TikTok Sans titles, Inter text, ink + Thynk orange.
 * No Muse image any more. Uses the .t14 tokens from components/thynk14/thynk14.css (global stylesheet).
 */
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Anton&family=Inter:opsz,wght@14..32,300..700&family=TikTok+Sans:opsz,wdth,wght@12..36,75..150,300..900&display=swap";

const EMAIL = "hello@thynkagency.gr";
const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/thynkagency.gr/",
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/thynkagency.gr/",
    d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];
const TICKER = ["Marketing", "Digital Transformation", "Τεχνητή νοημοσύνη", "Αυτοματισμοί", "Διαφήμιση", "Δεδομένα & αναφορές"];

export function ComingSoon() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!document.querySelector(`link[href="${FONTS_HREF}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONTS_HREF;
      document.head.appendChild(l);
    }
    const prev = document.documentElement.lang;
    document.documentElement.lang = "el";
    return () => {
      document.documentElement.lang = prev;
    };
  }, []);

  const words = [...TICKER, ...TICKER];
  return (
    <div className="t14 t14-cs" lang="el">
      <PlanetField reduced={reduced} />

      <header className="t14-cs-top">
        <span className="t14-logo" aria-label="Thynk">THYNK<b>.</b></span>
        <a className="t14-cs-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </header>

      <main className="t14-cs-main">
        <div className="t14-cs-lbl"><i aria-hidden="true" /> Established 2026 · Ιωάννινα</div>
        <h1 className="t14-cs-h1">
          <span>Κάτι ωραίο</span>
          <span className="t14-cs-acc">έρχεται<b>.</b></span>
        </h1>
        <p className="t14-cs-formula" lang="en">
          <b>Human Intelligence</b> + <span>Artificial Intelligence.</span>
        </p>
        <p className="t14-cs-lead">
          Χτίζουμε το site μας με την ίδια σκέψη που βάζουμε σε ό,τι φτιάχνουμε για τους πελάτες μας. Μέχρι τότε,
          μιλήστε μας απευθείας ή ακολουθήστε μας.
        </p>
        <div className="t14-cs-act">
          <a className="t14-pill lg" href={`mailto:${EMAIL}`}>Στείλτε μας email <i aria-hidden="true">→</i></a>
          {SOCIAL.map((s) => (
            <a key={s.label} className="t14-cs-soc" href={s.href} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.d} /></svg>
              {s.label}
            </a>
          ))}
        </div>
      </main>

      <footer className="t14-cs-foot">
        <div className="t14-foot-ticker" aria-hidden="true">
          <div>
            {[0, 1].map((k) => (
              <span key={k}>
                {words.map((w, i) => (
                  <em key={i}>{w}<b>✳</b></em>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="t14-cs-legal">
          <span>© 2026 Thynk Digital Agency · Ιωάννινα</span>
          <span lang="en">Let's Thynk<b>.</b> Together</span>
        </div>
      </footer>
    </div>
  );
}
