import { useEffect, useRef, useState, type ReactNode } from "react";
import { caps } from "@/content/site-v8";
import { headlines, typeHero as T, type HeadlineId } from "@/content/site-v12";

/**
 * v12 hero — typography first (01/10/2026).
 * - Four thin stage bars on top (Audit · Στρατηγική · Υλοποίηση · Κλιμάκωση); one lights up orange at a time.
 * - A very large display line, revealed word by word.
 * - A giant outlined "Y" (the "you" in Thynk) behind everything, drifting slowly with the scroll.
 * Mechanics borrowed from the Decide AI / SVZ references; palette stays ours (light, orange used sparingly).
 */
export function TypeHero({
  reduced,
  variant,
  onBook,
  onExamples,
}: {
  reduced: boolean;
  variant: HeadlineId;
  onBook: () => void;
  onExamples: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [stage, setStage] = useState(0);
  const H = headlines[variant] ?? headlines.bi;

  useEffect(() => {
    const t = window.setTimeout(() => setInView(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  // the active stage walks 1 → 4 and starts over
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % T.stages.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  // the big Y drifts up a little slower than the page
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      el.style.setProperty("--scroll", String(Math.min(window.scrollY, window.innerHeight * 1.2)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // word-by-word reveal: each word slides up out of a mask
  let n = 0;
  const word = (text: string, extra?: ReactNode) => {
    const i = n++;
    return (
      <span key={`${text}-${i}`} className="t12-word" style={{ transitionDelay: `${0.25 + i * 0.09}s` }}>
        <span>{text}</span>
        {extra}
      </span>
    );
  };

  return (
    <section className={`t12-hero${inView ? " in" : ""}`} id="top" ref={ref} aria-labelledby="t12-title">
      <div className="t12-bigy" aria-hidden="true">
        Y
      </div>

      <div className="t12-inner">
        <ol className="t12-stages" aria-label="Η μέθοδος σε τέσσερα στάδια">
          {T.stages.map((s, i) => (
            <li key={s} className={i === stage ? "on" : i < stage ? "done" : ""}>
              <i aria-hidden="true" />
              <span>
                <b>{String(i + 1).padStart(2, "0")}</b> {s}
              </span>
            </li>
          ))}
        </ol>

        <span className="t12-eyebrow">{caps(T.eyebrow)}</span>

        <h1 id="t12-title" className="t12-title" lang="en">
          <span className="t12-line t12-line-lead">{H.lead.split(" ").map((w) => word(w))}</span>
          <span className="t12-line">{word(H.word)}</span>
          <span className="t12-line">{word(H.last, <sup className="t12-tag">({H.tag})</sup>)}</span>
        </h1>

        <hr className="t12-rule" />

        <div className="t12-bottom">
          <p className="t12-lead">
            <strong>{T.leadStrong}</strong> {T.lead}
          </p>
          <div className="t12-ctas">
            <button type="button" className="t8-btn" onClick={onBook}>
              {T.primary}
              <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button type="button" className="t12-arrowlink" onClick={onExamples}>
              {T.secondary} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
