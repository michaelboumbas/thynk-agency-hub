import { useEffect, useRef } from "react";

/**
 * Light particle field behind the whole site (idea from liberators.ai, redrawn for a white page).
 * A wave "terrain" of dots sits in the lower half of the first screen; as you scroll it folds into
 * a slowly turning tilted ring (the "system"). Grey dots, Thynk orange on the crests / inner ring.
 * Canvas 2D, ~8k points on desktop (3.5k on phones), paused when the tab is hidden.
 * prefers-reduced-motion: one static frame, no scroll morph.
 */
export function ParticleField({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const small = window.matchMedia("(max-width: 760px)").matches;
    const COLS = small ? 84 : 150;
    const ROWS = small ? 42 : 58;
    const N = COLS * ROWS;
    const gx = new Float32Array(N);
    const gz = new Float32Array(N);
    const ra = new Float32Array(N); // ring angle
    const rr = new Float32Array(N); // ring radius
    const ry = new Float32Array(N); // ring height jitter
    const seed = (i: number) => {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        gx[i] = (c / (COLS - 1)) * 2 - 1 + (seed(i) - 0.5) * 0.01;
        gz[i] = r / (ROWS - 1);
        ra[i] = seed(i + 7) * Math.PI * 2;
        const band = seed(i + 3);
        rr[i] = 2.1 + band * band * 2.2 + (seed(i + 11) - 0.5) * 0.35;
        ry[i] = (seed(i + 5) - 0.5) * 0.28 * (1 + band);
      }
    }

    // colour buckets: 0 = grey … 5 = Thynk orange
    const COLORS = [0, 1, 2, 3, 4, 5].map((k) => {
      const t = k / 5;
      const r = Math.round(150 + (255 - 150) * t);
      const g = Math.round(158 + (106 - 158) * t);
      const b = Math.round(172 + (26 - 172) * t);
      const a = 0.42 + t * 0.3;
      return `rgba(${r},${g},${b},${a})`;
    });
    const bx = COLORS.map(() => new Float32Array(N));
    const by = COLORS.map(() => new Float32Array(N));
    const bs = COLORS.map(() => new Float32Array(N));
    const bn = new Int32Array(COLORS.length);

    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      cvs.style.width = `${W}px`;
      cvs.style.height = `${H}px`;
    };
    resize();

    const smooth = (x: number) => {
      const t = Math.min(1, Math.max(0, x));
      return t * t * (3 - 2 * t);
    };

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      const t = reduced ? 8 : (now - start) / 1000;
      const m = reduced ? 0 : smooth(window.scrollY / (H * 1.4));
      const f = H * 0.9;
      const spread = W / H > 1 ? 7.5 : 4.2;
      bn.fill(0);

      for (let i = 0; i < N; i++) {
        // wave terrain
        const X0 = gx[i] * spread;
        const Z0 = 2.2 + gz[i] * 12;
        const w1 = Math.sin(X0 * 0.75 + t * 0.55) * Math.cos(Z0 * 0.45 - t * 0.35);
        const w2 = Math.sin(X0 * 1.6 + Z0 * 1.1 + t * 0.8) * 0.35;
        const Y0 = -1.05 + (w1 + w2) * 0.32;

        // tilted ring
        const a = ra[i] + t * 0.06;
        const X1 = Math.cos(a) * rr[i];
        const Z1 = 9 + Math.sin(a) * rr[i] * 0.9;
        const Y1 = Math.sin(a) * rr[i] * 0.22 + ry[i];

        const X = X0 + (X1 - X0) * m;
        const Y = Y0 + (Y1 - Y0) * m;
        const Z = Z0 + (Z1 - Z0) * m;
        if (Z < 0.5) continue;

        const sx = W / 2 + (X * f) / Z;
        const sy = H * (0.47 - m * 0.04) - (Y * f) / Z;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;

        // orange on the crests (wave) / inner band (ring)
        const hot0 = Math.max(0, (w1 + w2 - 0.55) / 0.8);
        const hot1 = Math.max(0, 1 - (rr[i] - 2.1) / 1.4);
        const hot = hot0 + (hot1 - hot0) * m;
        const k = Math.min(5, Math.floor(hot * 6));
        const size = Math.max(0.6, Math.min(2.2, (7 / Z) * (small ? 1.1 : 1)));
        const n = bn[k]++;
        bx[k][n] = sx;
        by[k][n] = sy;
        bs[k][n] = size;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let k = 0; k < COLORS.length; k++) {
        ctx.fillStyle = COLORS[k];
        const xs = bx[k];
        const ys = by[k];
        const ss = bs[k];
        for (let j = 0, n = bn[k]; j < n; j++) {
          const s = ss[j];
          ctx.fillRect(xs[j] - s / 2, ys[j] - s / 2, s, s);
        }
      }
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      resize();
      if (reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className="t11-field" aria-hidden="true" />;
}
