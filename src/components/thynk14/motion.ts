import { useEffect, type RefObject } from "react";
import { clamp, ease, progress } from "./shared";

/**
 * All scroll-driven motion of the v14 pages, in one rAF loop. Scans the page for the pieces it knows:
 *   .t14-reveal  words light up as the paragraph passes
 *   .t14-method  ghost word letters light up, four cards fly in on a diagonal, then leave together
 *   .t14-hz      the panel track slides left over the title
 *   .t14-giant   the giant word fills the content width exactly (re-fit when Inter loads and on resize)
 * Re-scans when `key` changes (a new page). Phones (≤900px) get the same stages: the method cards slide in
 * from the left on a diagonal, the panel track slides left. .t14-seq rows arrive one by one. prefers-reduced-motion: everything shown at rest.
 */
export function useCleanMotion(rootRef: RefObject<HTMLElement | null>, key: string) {
  // giant words
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll<HTMLElement>(".t14-giant")];
    // ghost words (Method, How we work, Αρχές συνεργασίας…) must fit the stage on desktop
    const ghosts = [...root.querySelectorAll<HTMLElement>(".t14-ghost")];
    const fitGhost = (el: HTMLElement) => {
      el.style.fontSize = "";
      const room = el.clientWidth * 0.94;
      if (el.scrollWidth > room) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room) / el.scrollWidth}px`;
    };
    if (!els.length && !ghosts.length) return;
    const fit = (el: HTMLElement) => {
      const par = el.parentElement!;
      const cs = getComputedStyle(par);
      const box = par.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const w = el.getBoundingClientRect().width;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (w > 0 && box > 0) el.style.fontSize = `${(fs * box) / w}px`;
    };
    // two passes: the first gets close, the second corrects for letter-spacing in em
    const refit = () => {
      els.forEach((el) => (fit(el), fit(el)));
      ghosts.forEach(fitGhost);
    };
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
    // the giant THYNK. in the footer: letters rise one after another as you reach the bottom
    const footWord = root.querySelector<HTMLElement>(".t14-foot-word");
    const footLetters = footWord ? [...footWord.querySelectorAll<HTMLElement>(".t14-foot-word-in > span")] : [];
    const tracks = [...root.querySelectorAll<HTMLElement>(".t14-hz")].map((el) => ({
      el,
      track: el.querySelector<HTMLElement>(".t14-hz-track")!,
    }));
    // lists whose rows arrive one by one (solutions)
    const seqRows = reduced
      ? []
      : [...root.querySelectorAll<HTMLElement>(".t14-seq")].flatMap((ul) => {
          ul.classList.add("ready");
          return [...ul.querySelectorAll<HTMLElement>(":scope > li")];
        });

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
        const p = progress(el);
        const lit = p * letters.length * 1.6;
        letters.forEach((l, i) => {
          const d = lit - i;
          l.className = reduced ? "on" : d > 2.2 ? "lit" : d > 0 ? "on" : "";
        });
        if (narrow) {
          // phones: a deck on a diagonal, each card slides in from the left, then all leave upwards
          const n = cards.length;
          const cw = cards[0]?.offsetWidth ?? 0;
          const gut = 20;
          const spread = Math.max(0, W - cw - gut * 2);
          const exit = reduced ? 0 : ease(clamp((p - 0.88) / 0.12, 0, 1));
          cards.forEach((c, i) => {
            const start = 0.1 + i * 0.18;
            const k = reduced ? 1 : ease(clamp((p - start) / 0.16, 0, 1));
            const x = gut + (n > 1 ? (i * spread) / (n - 1) : 0);
            const y = H * 0.12 + i * H * 0.075;
            c.style.transform = `translate3d(${x - (1 - k) * (x + cw + 40)}px,${y - exit * H * 1.1}px,0)`;
          });
          return;
        }
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
        const p = progress(el);
        track.style.transform = `translate3d(${-ease(p) * Math.max(0, track.scrollWidth - W)}px,0,0)`;
      });

      if (footWord && footLetters.length) {
        const r = footWord.getBoundingClientRect();
        const p = reduced ? 1 : clamp((H - r.top) / (r.height * 1.1), 0, 1);
        footLetters.forEach((l, i) => {
          const k = ease(clamp((p - i * 0.07) / 0.5, 0, 1));
          l.style.transform = `translate3d(0,${((1 - k) * 105).toFixed(2)}%,0)`;
        });
      }

      seqRows.forEach((li) => {
        if (!li.classList.contains("in") && li.getBoundingClientRect().top < H * 0.9) li.classList.add("in");
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [rootRef, key]);
}
