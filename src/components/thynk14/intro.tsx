import { useEffect, useRef } from "react";

/**
 * «Η τελεία» intro (12/10/2026, Mike): on the first load of the home page the screen is black, the orange
 * square brand dot appears in the middle, then we zoom into it and the site opens up through it.
 * - Home page only, once per page load (moving around the site never replays it). ~1.4s in total.
 * - A click, tap, key or scroll skips it. Reduced motion: no zoom, a quick fade.
 * - The server renders the first frame (<IntroFrame/>: black + the dot), so there is no white flash before
 *   the page hydrates; the client then plays the zoom from that same frame.
 * Mechanics: a black layer with a square hole (clip-path, even-odd) the size of the dot, and the orange dot
 * on top. Both grow together; the dot fades out on the way, so the site shows through the growing hole.
 */
let played = false;
export const introPending = () => !played;

const DOT = 26; // px, the dot at rest (the same proportions as the favicon)
const INK = "#0f1012";

/** clip-path for the black layer: the whole screen minus a centred square of half-size h px */
const hole = (h: number) =>
  `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ` +
  `calc(50% - ${h}px) calc(50% - ${h}px), calc(50% - ${h}px) calc(50% + ${h}px), ` +
  `calc(50% + ${h}px) calc(50% + ${h}px), calc(50% + ${h}px) calc(50% - ${h}px), calc(50% - ${h}px) calc(50% - ${h}px))`;

/** the first frame, also what the server sends: black screen, the dot in the middle */
export function IntroFrame() {
  return (
    <div className="t14-intro" aria-hidden="true">
      <div className="t14-intro-ink" style={{ background: INK, clipPath: hole(0) }} />
      <div className="t14-intro-dot t14-intro-dot-in" style={{ width: DOT, height: DOT }} />
    </div>
  );
}

export function DotIntro({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current, ink = inkRef.current, dot = dotRef.current;
    if (!root || !ink || !dot) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const anims: Animation[] = [];
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      played = true;
      html.style.overflow = prevOverflow;
      cleanup();
      onDone();
    };
    const fadeOut = (ms: number) => {
      anims.forEach((a) => a.pause());
      const a = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: "forwards" });
      a.finished.then(finish, finish);
    };
    const skip = () => fadeOut(160);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, skip));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fadeOut(250);
      return cleanup;
    }

    // grow until the dot covers the whole screen (its half-diagonal fits the screen's half-diagonal)
    const k = (Math.hypot(window.innerWidth, window.innerHeight) + 8) / DOT;
    const mid = k * 0.42;
    const timing: KeyframeAnimationOptions = {
      duration: 950,
      delay: 380, // the dot holds for a beat before we go in
      easing: "cubic-bezier(.75,0,.2,1)",
      fill: "forwards",
    };
    anims.push(
      dot.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: `scale(${mid})`, opacity: 1, offset: 0.55 },
          { transform: `scale(${k})`, opacity: 0 },
        ],
        timing,
      ),
      ink.animate(
        [
          { clipPath: hole(0) },
          { clipPath: hole((DOT / 2) * mid), offset: 0.55 },
          { clipPath: hole((DOT / 2) * k) },
        ],
        timing,
      ),
    );
    Promise.all(anims.map((a) => a.finished)).then(finish, () => {});
    return cleanup;
    // onDone is stable enough for a one-shot intro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="t14-intro" ref={rootRef} aria-hidden="true">
      <div className="t14-intro-ink" ref={inkRef} style={{ background: INK, clipPath: hole(0) }} />
      <div className="t14-intro-dot" ref={dotRef} style={{ width: DOT, height: DOT }} />
    </div>
  );
}
