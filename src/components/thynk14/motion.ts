import { useEffect, type RefObject } from "react";
import { clamp, ease, progress } from "./shared";

/**
 * All scroll-driven motion of the v14 pages, in one rAF loop. Scans the page for the pieces it knows:
 *   .t14-reveal  words light up as the paragraph passes
 *   .t14-method  ghost word letters light up, four cards fly in on a diagonal, then leave together
 *   .t14-hz      the panel track slides left over the title
 *   .t14-giant   the giant word fills the content width exactly (re-fit when Inter loads and on resize)
 * Re-scans when `key` changes (a new page). On phones (≤900px) the sticky stages are a normal flow in CSS
 * and the loop leaves them alone. prefers-reduced-motion: everything shown at rest.
 */
export function useCleanMotion(rootRef: RefObject<HTMLElement | null>, key: string) {
  // giant words
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll<HTMLElement>(".t14-giant")];
    if (!els.length) return;
    const fit = (el: HTMLElement) => {
      const par = el.parentElement!;
      const cs = getComputedStyle(par);
      const box = par.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const w = el.getBoundingClientRect().width;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (w > 0 && box > 0) el.style.fontSize = `${(fs * box) / w}px`;
    };
    // two passes: the first gets close, the second corrects for letter-spacing in em
    const refit = () => els.forEach((el) => (fit(el), fit(el)));
    refit();
    const fonts = document.fonts;
    fonts?.ready.then(refit);
    fonts?.addEventListener?.("loadingdone", refit);
    window.addEventListener("resize", refit);
    return () => {
      fonts?.removeEventListener?.("loadingdone", refit);
      window.removeEventListener("resize", refit);
    };
  }, [rootRef, key]);

  // scroll stages
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowQ = window.matchMedia("(max-width: 900px)");

    const reveals = [...root.querySelectorAll<HTMLElement>(".t14-reveal")].map((el) => ({
      el,
      words: [...el.querySelectorAll<HTMLElement>("span")],
    }));
    const methods = [...root.querySelectorAll<HTMLElement>(".t14-method")].map((el) => ({
      el,
      letters: [...el.querySelectorAll<HTMLElement>(".t14-ghost span")],
      cards: [...el.querySelectorAll<HTMLElement>(".t14-mcard")],
    }));
    const tracks = [...root.querySelectorAll<HTMLElement>(".t14-hz")].map((el) => ({
      el,
      track: el.querySelector<HTMLElement>(".t14-hz-track")!,
    }));

    if (reduced) {
      reveals.forEach((r) => r.words.forEach((w) => w.classList.add("on")));
    }

    let raf = 0;
    const frame = () => {
      const H = window.innerHeight, W = window.innerWidth;
      const narrow = narrowQ.matches;

      if (!reduced) {
        reveals.forEach(({ el, words }) => {
          const r = el.getBoundingClientRect();
          const p = clamp((H * 0.85 - r.top) / (r.height + H * 0.35), 0, 1);
          const n = Math.round(p * words.length);
          words.forEach((w, i) => w.classList.toggle("on", i < n));
        });
      }

      methods.forEach(({ el, letters, cards }) => {
        if (narrow) {
          letters.forEach((l) => (l.className = "on"));
          cards.forEach((c) => (c.style.transform = ""));
          return;
        }
        const p = progress(el);
        const lit = p * letters.length * 1.6;
        letters.forEach((l, i) => {
          const d = lit - i;
          l.className = reduced ? "on" : d > 2.2 ? "lit" : d > 0 ? "on" : "";
        });
        const xs = [0.05, 0.29, 0.53, 0.77], ys = [0.12, 0.3, 0.48, 0.3];
        cards.forEach((c, i) => {
          const start = 0.12 + i * 0.13;
          const k = reduced ? 1 : ease(clamp((p - start) / 0.22, 0, 1));
          const x = xs[i % 4] * W, y = ys[i % 4] * H;
          const outY = H * 1.1 - y + 80;
          const exit = reduced ? 0 : ease(clamp((p - 0.86) / 0.14, 0, 1));
          c.style.transform = `translate3d(${x}px,${y + (1 - k) * outY - exit * H * 1.1}px,0)`;
        });
      });

      tracks.forEach(({ el, track }) => {
        if (narrow) {
          track.style.transform = "";
          return;
        }
        const p = progress(el);
        track.style.transform = `translate3d(${-ease(p) * Math.max(0, track.scrollWidth - W)}px,0,0)`;
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rootRef, key]);
}
