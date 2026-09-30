import { useEffect, useRef, useState } from "react";
import { caps } from "@/content/site-v8";
import { handsHero as H } from "@/content/site-v10";

/**
 * v10 hero — "άνθρωπος + AI". A human hand (left) and a robotic hand with Thynk-orange circuits (right)
 * reach for each other over a soft iridescent glass orb, like the Creation of Adam.
 * Load: the hands slide in. Scroll (first ~60% of the hero): they close the gap and the orb lights up.
 * The headline says the idea in words: the AI does the work, people decide (our "human in the loop" rule).
 * Inspired by a UI8 concept shot the founders liked (layout/motion only; copy and assets are ours).
 */
export function HandsHero({
  reduced,
  onBook,
  onExamples,
}: {
  reduced: boolean;
  onBook: () => void;
  onExamples: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setInView(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const span = Math.max(1, el.offsetHeight * 0.6);
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section className={`t10-hero${inView ? " in" : ""}`} id="top" ref={ref} aria-labelledby="t10-title">
      <div className="t10-orb" aria-hidden="true">
        <i className="t10-orb-ring" />
        <i className="t10-orb-core" />
        <i className="t10-orb-spark" />
      </div>

      <div className="t10-hand t10-hand-l" aria-hidden="true">
        <img src={H.human} alt="" width={1024} height={688} decoding="async" fetchPriority="high" />
      </div>
      <div className="t10-hand t10-hand-r" aria-hidden="true">
        <img src={H.robot} alt="" width={1024} height={688} decoding="async" fetchPriority="high" />
      </div>

      <div className="t10-center">
        <span className="t10-eyebrow">{caps(H.eyebrow)}</span>
        <h1 id="t10-title" className="t10-title">
          <span className="t10-line">{H.line1}</span>
          <span className="t10-line">
            <span className="t10-soft">{H.line2Soft}</span> {H.line2}
          </span>
        </h1>
      </div>

      <div className="t10-bottom">
        <div className="t10-intro">
          <span className="t10-kicker">{caps(H.kicker)}</span>
          <p>{H.sub}</p>
        </div>
        <div className="t10-ctas">
          <button type="button" className="t8-btn" onClick={onBook}>
            {H.primary}
            <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button type="button" className="t8-btn t8-btn-ghost" onClick={onExamples}>
            {H.secondary}
          </button>
        </div>
      </div>
    </section>
  );
}
