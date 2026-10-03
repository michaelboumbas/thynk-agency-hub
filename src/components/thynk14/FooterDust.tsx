import { useEffect, useRef } from "react";

/**
 * The footer wordmark as space dust (03/10, Mike): THYNK. drawn by a few thousand particles, like the dot
 * planet behind the site. Scattered while the footer comes in, they gather into the letters as you reach
 * the bottom; the pointer pushes them away and they drift back. The dot after THYNK is orange.
 * Canvas 2D, runs only while visible; prefers-reduced-motion: the letters, formed and still.
 */
type P = { x: number; y: number; hx: number; hy: number; sx: number; sy: number; vx: number; vy: number; s: number; o: boolean; tw: number };

export function FooterDust() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, cv = canvasRef.current;
    if (!wrap || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, pts: P[] = [], raf = 0, visible = false, t0 = performance.now();
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = Math.round(W * 0.26);
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.height = H + "px";
      // draw the word off-screen and sample its pixels
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d")!;
      const word = "THYNK";
      let fs = H * 1.02;
      o.font = `${fs}px Anton, "Bebas Neue", Impact, sans-serif`;
      const dotW = o.measureText(".").width;
      const w = o.measureText(word).width + dotW;
      fs *= Math.min(1, (W * 0.98) / w);
      o.font = `${fs}px Anton, "Bebas Neue", Impact, sans-serif`;
      o.textBaseline = "alphabetic";
      const tw = o.measureText(word).width;
      const total = tw + o.measureText(".").width;
      const x0 = (W - total) / 2, base = H * 0.9;
      o.fillStyle = "#fff";
      o.fillText(word, x0, base);
      o.fillStyle = "#f60";
      o.fillText(".", x0 + tw, base);
      const data = o.getImageData(0, 0, W, H).data;
      const step = W > 900 ? 4 : 3;
      pts = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const i = (y * W + x) * 4;
          if (data[i + 3] < 128) continue;
          const orange = data[i + 2] < 60; // the dot is the only non-white fill
          const ang = Math.random() * Math.PI * 2, r = (0.35 + Math.random() * 0.9) * W * 0.5;
          const sx = W / 2 + Math.cos(ang) * r, sy = H / 2 + Math.sin(ang) * r * 0.6;
          pts.push({ x: sx, y: sy, hx: x + (Math.random() - 0.5) * step, hy: y + (Math.random() - 0.5) * step, sx, sy, vx: 0, vy: 0, s: 0.8 + Math.random() * 1.3, o: orange, tw: Math.random() * Math.PI * 2 });
        }
      }
    };

    const progress = () => {
      if (reduced) return 1;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the dust enters the screen, 1 once it is fully in view
      return Math.min(1, Math.max(0, (vh - r.top - r.height * 0.15) / (r.height * 0.95)));
    };
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const k = ease(progress());
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        // target: between the scattered start and the home position in the letters
        const tx = p.sx + (p.hx - p.sx) * k + (reduced ? 0 : Math.sin(t * 0.8 + p.tw) * (1 - k) * 6);
        const ty = p.sy + (p.hy - p.sy) * k + (reduced ? 0 : Math.cos(t * 0.7 + p.tw) * (1 - k) * 6);
        if (!reduced) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const f = (9000 - d2) / 9000;
            p.vx += (dx / Math.sqrt(d2 + 0.01)) * f * 2.4;
            p.vy += (dy / Math.sqrt(d2 + 0.01)) * f * 2.4;
          }
          p.vx += (tx - p.x) * 0.09;
          p.vy += (ty - p.y) * 0.09;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = tx;
          p.y = ty;
        }
        const a = 0.35 + 0.65 * k * (0.75 + 0.25 * Math.sin(t * 2 + p.tw));
        ctx.fillStyle = p.o ? `rgba(255,106,26,${a})` : `rgba(255,255,255,${a})`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => ((mouse.x = -9999), (mouse.y = -9999));
    const onResize = () => (build(), start());
    const onScroll = () => reduced && visible && start();

    const init = () => {
      build();
      io.observe(wrap);
      start();
    };
    // wait for Anton so the letters are sampled from the brand face
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.load) fonts.load('100px "Anton"').then(init, init);
    else init();
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="t14-foot-dust" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
