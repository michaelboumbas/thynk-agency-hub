import { useEffect, useRef, useState } from "react";
import { caps } from "@/content/site-v8";
import { handsHero as H } from "@/content/site-v10";

/**
 * v10 hero — "άνθρωπος + AI". A human hand (left) and a robotic hand with Thynk-orange circuits (right)
 * reach for each other over a soft iridescent glass orb, like the Creation of Adam.
 * Load: the arms slide in. Scroll (first ~60% of the hero): the fingertips close the gap and touch,
 * and a small orange spark lights up at the contact point.
 * The headline says the idea in words: the AI does the work, people decide (our "human in the loop" rule).
 * Inspired by a UI8 concept shot the founders liked (layout/motion only; copy and assets are ours).
 */
export function HandsHero({
  reduced,
  onBook,
  onExamples,
  moment = false,
  eyebrow,
}: {
  reduced: boolean;
  onBook: () => void;
  onExamples: () => void;
  /** v12: shown further down the page (not as the hero): h2, enters on view, scroll measured from its own position, no CTAs */
  moment?: boolean;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (moment) {
      const el = ref.current;
      if (!el) return;
      let t2 = 0;
      const io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            setInView(true);
            t2 = window.setTimeout(() => setSettled(true), 1700);
            io.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        window.clearTimeout(t2);
      };
    }
    const t = window.setTimeout(() => setInView(true), 60);
    // after the entrance, the arms follow the scroll 1:1 (no easing lag)
    const t2 = window.setTimeout(() => setSettled(true), 1700);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const span = Math.max(1, el.offsetHeight * (window.innerWidth <= 860 ? 0.1 : 0.32)); // the fingertips touch after a short scroll, while still on screen
      const travelled = moment
        ? window.innerHeight * 0.75 - el.getBoundingClientRect().top // starts when the section is a quarter into view
        : window.scrollY;
      const p = Math.min(1, Math.max(0, travelled / (moment ? window.innerHeight * 0.55 : span)));
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
  }, [reduced, moment]);

  const titleId = moment ? "t10-moment-title" : "t10-title";
  const Heading = moment ? "h2" : "h1";

  return (
    <section
      className={`t10-hero${moment ? " t12-moment" : ""}${inView ? " in" : ""}${settled ? " scrolling" : ""}`}
      id={moment ? "human-in-the-loop" : "top"}
      ref={ref}
      aria-labelledby={titleId}
    >
      {/* soft light behind the headline (keeps it readable over the dots) */}
      <div className="t10-halo" aria-hidden="true" />

      <div className="t10-hand t10-hand-l" aria-hidden="true">
        <img src={H.human} alt="" width={1344} height={752} decoding="async" fetchPriority="high" />
      </div>
      <div className="t10-hand t10-hand-r" aria-hidden="true">
        <img src={H.robot} alt="" width={1344} height={752} decoding="async" fetchPriority="high" />
      </div>

      {/* the spark where the two fingertips meet (grows as they touch) */}
      <div className="t10-contact" aria-hidden="true">
        <i />
      </div>

      <div className="t10-center">
        <span className="t10-eyebrow">{caps(eyebrow ?? H.eyebrow)}</span>
        <Heading id={titleId} className="t10-title">
          <span className="t10-line">{H.line1}</span>
          <span className="t10-line">
            <span className="t10-soft">{H.line2Soft}</span> {H.line2}
          </span>
        </Heading>
      </div>

      <div className="t10-bottom">
        <div className="t10-intro">
          <span className="t10-kicker">{caps(H.kicker)}</span>
          <p>{H.sub}</p>
        </div>
        {!moment && <div className="t10-ctas">
          <button type="button" className="t8-btn" onClick={onBook}>
            {H.primary}
            <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button type="button" className="t8-btn t8-btn-ghost" onClick={onExamples}>
            {H.secondary}
          </button>
        </div>}
      </div>
    </section>
  );
}
