import { useEffect, useRef } from "react";

/**
 * 23/10/2026 (2026 brand): the colour is lake, the colour of the logo's dot now; the move is unchanged.
 * «Η τελεία» intro (12/10/2026, Mike, v4): on the first load of the home page the whole screen is orange,
 * as if we were inside the dot. Then, in one continuous move, the orange shrinks straight towards the header
 * and lands as the full stop of «THYNK.» (it becomes the logo's dot), while the white site appears around it.
 * - Home page only, once per page load (moving around the site never replays it). ~1.5s once fonts are in.
 * - A click, tap, key or scroll skips it. Reduced motion: no zoom or travel, a quick fade.
 * - The server renders the first frame (<IntroFrame/>: full orange), so there is no white flash before the
 *   page hydrates; the client swaps it for the dot at full-screen size in the same frame and plays on.
 * The landing spot is measured from the real header logo: the ink box of the «.» glyph (Anton) at the
 * logo's font size, so the travelling dot ends exactly on top of it; the real dot is hidden until then.
 */
let played = false;
export const introPending = () => !played;

const DOT = 26; // px, the dot at rest in the middle (the same proportions as the favicon)
const ORANGE = "#1d5866"; // 2026 brand: the logo's dot is lake (the name stays, the colour changed)

/** the first frame, also what the server sends: the whole screen orange */
export function IntroFrame() {
  return (
    <div className="t14-intro" aria-hidden="true">
      <div className="t14-intro-fill" style={{ background: ORANGE }} />
    </div>
  );
}

/** where the header logo's «.» is drawn on screen: the ink box of the glyph, measured, not guessed */
function logoDotBox(): DOMRect | null {
  const b = document.querySelector<HTMLElement>(".t14-hdr .t14-logo b");
  if (!b) return null;
  // 2026 logo: the dot is a box of its own, so its rectangle is the landing spot
  const own = b.getBoundingClientRect();
  if (own.width > 0 && own.height > 0) return own;
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
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current, fill = fillRef.current, dot = dotRef.current;
    if (!root || !fill || !dot) return;
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

    // wait for the logo face, so the landing spot is measured on the real glyph (the screen stays orange)
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
      // at this scale the dot covers the whole screen, corners included
      const k = (Math.hypot(window.innerWidth, window.innerHeight) + 8) / DOT;
      // one continuous move (Mike 12/10): the orange shrinks straight towards the logo, no stop in the middle.
      // The scale steps geometrically (a steady zoom-out feel, not a sudden collapse) and the centre glides
      // to the logo dot; the whole move is eased.
      const STEPS = 16;
      const frames: Keyframe[] = [];
      for (let i = 0; i <= STEPS; i++) {
        const t = i / STEPS;
        const scx = k * Math.pow(sx / k, t), scy = k * Math.pow(sy / k, t);
        const pt = 1 - Math.pow(1 - t, 1.6); // the centre leaves a little earlier than the size settles
        frames.push({ transform: `translate(${tx * pt}px, ${ty * pt}px) scale(${scx}, ${scy})`, borderRadius: t < 1 ? "3px" : "0px" });
      }
      anims.push(dot.animate(frames, { duration: 1500, easing: "cubic-bezier(.55,0,.25,1)", fill: "both" }));
      // swap the server's full orange frame for the dot at full-screen size, in the same frame
      fill.style.display = "none";
      Promise.all(anims.map((a) => a.finished)).then(finish, () => {});
    });
    return cleanup;
    // a one-shot intro
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="t14-intro" ref={rootRef} aria-hidden="true">
      <div className="t14-intro-fill" ref={fillRef} style={{ background: ORANGE }} />
      <div className="t14-intro-dot" ref={dotRef} style={{ width: DOT, height: DOT }} />
    </div>
  );
}
