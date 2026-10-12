import { useEffect, useRef } from "react";

/**
 * «Η τελεία» intro (12/10/2026, Mike): on the first load of the home page the screen is black and the orange
 * square brand dot sits in the middle. Then the black lifts to reveal the site, and the dot travels up to
 * the header and lands as the full stop of «THYNK.» (it becomes the logo's dot).
 * - Home page only, once per page load (moving around the site never replays it). ~1.6s in total.
 * - A click, tap, key or scroll skips it. Reduced motion: no travel, a quick fade.
 * - The server renders the first frame (<IntroFrame/>: black + the dot), so there is no white flash before
 *   the page hydrates; the client then plays the rest from that same frame.
 * The landing spot is measured from the real header logo: the ink box of the «.» glyph (Anton) at the
 * logo's font size, so the travelling dot ends exactly on top of it; the real dot is hidden until then.
 */
let played = false;
export const introPending = () => !played;

const DOT = 26; // px, the dot at rest (the same proportions as the favicon)
const INK = "#0f1012";

/** the first frame, also what the server sends: black screen, the dot in the middle */
export function IntroFrame() {
  return (
    <div className="t14-intro" aria-hidden="true">
      <div className="t14-intro-ink" style={{ background: INK }} />
      <div className="t14-intro-dot t14-intro-dot-in" style={{ width: DOT, height: DOT }} />
    </div>
  );
}

/** where the header logo's «.» is drawn on screen: the ink box of the glyph, measured, not guessed */
function logoDotBox(): DOMRect | null {
  const b = document.querySelector<HTMLElement>(".t14-hdr .t14-logo b");
  if (!b) return null;
  const cs = getComputedStyle(b);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText(".");
  // the baseline: an empty inline-block's bottom edge sits on it
  const probe = document.createElement("span");
  probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
  b.appendChild(probe);
  const baseline = probe.getBoundingClientRect().top;
  probe.remove();
  const x = b.getBoundingClientRect().left;
  const left = x - m.actualBoundingBoxLeft;
  const right = x + m.actualBoundingBoxRight;
  const top = baseline - m.actualBoundingBoxAscent;
  const bottom = baseline + m.actualBoundingBoxDescent;
  if (!(right > left && bottom > top)) return null;
  return new DOMRect(left, top, right - left, bottom - top);
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
    // the real logo dot waits until ours lands on it
    const realDot = document.querySelector<HTMLElement>(".t14-hdr .t14-logo b");
    realDot?.style.setProperty("visibility", "hidden");
    const anims: Animation[] = [];
    let finished = false;
    let cancelled = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      played = true;
      html.style.overflow = prevOverflow;
      realDot?.style.removeProperty("visibility");
      cleanup();
      onDone();
    };
    const fadeOut = (ms: number) => {
      anims.forEach((a) => a.pause());
      realDot?.style.removeProperty("visibility");
      const a = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: "forwards" });
      a.finished.then(finish, finish);
    };
    const skip = () => fadeOut(160);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    const cleanup = () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, skip));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fadeOut(250);
      return cleanup;
    }

    // wait for the logo face, so the landing spot is measured on the real glyph
    const ready = document.fonts?.ready ?? Promise.resolve();
    Promise.race([ready, new Promise((r) => window.setTimeout(r, 900))]).then(() => {
      if (cancelled || finished) return;
      const box = logoDotBox();
      if (!box) {
        fadeOut(300);
        return;
      }
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const tx = box.left + box.width / 2 - cx;
      const ty = box.top + box.height / 2 - cy;
      const sx = box.width / DOT, sy = box.height / DOT;
      const HOLD = 420; // the dot rests in the middle for a beat
      anims.push(
        // the black lifts and the site shows through
        ink.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 700,
          delay: HOLD,
          easing: "cubic-bezier(.4,0,.2,1)",
          fill: "forwards",
        }),
        // the dot travels to the logo and becomes its full stop
        dot.animate(
          [
            { transform: "translate(0px, 0px) scale(1, 1)", borderRadius: "3px" },
            { transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`, borderRadius: "0px" },
          ],
          { duration: 1050, delay: HOLD, easing: "cubic-bezier(.65,0,.2,1)", fill: "forwards" },
        ),
      );
      Promise.all(anims.map((a) => a.finished)).then(finish, () => {});
    });
    return cleanup;
    // a one-shot intro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="t14-intro" ref={rootRef} aria-hidden="true">
      <div className="t14-intro-ink" ref={inkRef} style={{ background: INK }} />
      <div className="t14-intro-dot" ref={dotRef} style={{ width: DOT, height: DOT }} />
    </div>
  );
}
