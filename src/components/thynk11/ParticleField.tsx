import { useEffect, useRef } from "react";

/**
 * Light particle field behind the whole site (idea from liberators.ai, redrawn for a white page).
 * The same dots change shape as you scroll down the page:
 *   wave → ring → sphere → network → cube → the THYNK. wordmark (at the very end).
 * Each shape "holds" for a while, then the dots glide to the next one.
 * Grey dots, Thynk orange on the hot parts. Canvas 2D, ~8.7k points (3.5k on phones),
 * paused when the tab is hidden. prefers-reduced-motion: one static wave, no morph.
 */

const STAGES = 6; // 0 wave (live), 1 ring, 2 sphere, 3 network, 4 cube, 5 wordmark

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

    let s = 1;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;

    // stage 0 grid
    const gx = new Float32Array(N);
    const gz = new Float32Array(N);
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        gx[i] = (c / (COLS - 1)) * 2 - 1 + (rnd() - 0.5) * 0.01;
        gz[i] = r / (ROWS - 1);
      }

    // static shapes 1..5: x, y, z (centred on 0,0,0), hot 0..1
    const SX = Array.from({ length: STAGES }, () => new Float32Array(N));
    const SY = Array.from({ length: STAGES }, () => new Float32Array(N));
    const SZ = Array.from({ length: STAGES }, () => new Float32Array(N));
    const SH = Array.from({ length: STAGES }, () => new Float32Array(N));
    const order = new Uint32Array(N);
    for (let i = 0; i < N; i++) order[i] = i;
    // shuffle so every shape draws from the whole wave (the morph looks like a swirl, not a slide)
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = order[i];
      order[i] = order[j];
      order[j] = t;
    }

    // 1 ring (tilted galaxy)
    for (let k = 0; k < N; k++) {
      const i = order[k];
      const band = rnd();
      const r = 2.6 + band * band * 2.9 + (rnd() - 0.5) * 0.4;
      const a = rnd() * Math.PI * 2;
      SX[1][i] = Math.cos(a) * r;
      SZ[1][i] = Math.sin(a) * r * 0.9;
      SY[1][i] = Math.sin(a) * r * 0.22 + (rnd() - 0.5) * 0.28 * (1 + band);
      SH[1][i] = Math.max(0, 1 - (r - 2.6) / 1.6);
    }
    // 2 sphere (fibonacci)
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let k = 0; k < N; k++) {
      const i = order[k];
      const y = 1 - (k / (N - 1)) * 2;
      const rr = Math.sqrt(1 - y * y);
      const th = golden * k;
      const R = 3.4 + (rnd() - 0.5) * 0.07;
      SX[2][i] = Math.cos(th) * rr * R;
      SY[2][i] = y * R;
      SZ[2][i] = Math.sin(th) * rr * R;
      SH[2][i] = rnd() < 0.1 ? 1 : 0;
    }
    // 3 network: nodes + edges
    const nodes: [number, number, number][] = [];
    for (let n = 0; n < 10; n++) {
      const u = rnd() * 2 - 1;
      const a = rnd() * Math.PI * 2;
      const rr = Math.sqrt(1 - u * u);
      const R = 1.9 + rnd() * 1.9;
      nodes.push([Math.cos(a) * rr * R * 1.35, u * R * 0.9, Math.sin(a) * rr * R]);
    }
    const edges: [number, number][] = [];
    nodes.forEach((p, a) => {
      const d = nodes
        .map((q, b) => [b, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2] as [number, number])
        .filter(([b]) => b !== a)
        .sort((x, y) => x[1] - y[1]);
      for (let m = 0; m < 2; m++) {
        const b = d[m][0];
        if (!edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) edges.push([a, b]);
      }
    });
    for (let k = 0; k < N; k++) {
      const i = order[k];
      if (k < N * 0.22) {
        const p = nodes[k % nodes.length];
        const sp = 0.16;
        SX[3][i] = p[0] + gauss() * sp;
        SY[3][i] = p[1] + gauss() * sp;
        SZ[3][i] = p[2] + gauss() * sp;
        SH[3][i] = 1;
      } else {
        const [a, b] = edges[k % edges.length];
        const t = rnd();
        const j = 0.03;
        SX[3][i] = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * t + gauss() * j;
        SY[3][i] = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * t + gauss() * j;
        SZ[3][i] = nodes[a][2] + (nodes[b][2] - nodes[a][2]) * t + gauss() * j;
        SH[3][i] = 0;
      }
    }
    // 4 cube: edges + a few face dots, hot corners
    const C = 2.6;
    const cubeEdges: [number[], number[]][] = [];
    const corners = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
    corners.forEach((p, a) =>
      corners.forEach((q, b) => {
        if (b > a && Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) === 2) cubeEdges.push([p, q]);
      }),
    );
    for (let k = 0; k < N; k++) {
      const i = order[k];
      if (k < N * 0.75) {
        const [p, q] = cubeEdges[k % 12];
        const t = rnd();
        SX[4][i] = (p[0] + (q[0] - p[0]) * t) * C + gauss() * 0.025;
        SY[4][i] = (p[1] + (q[1] - p[1]) * t) * C + gauss() * 0.025;
        SZ[4][i] = (p[2] + (q[2] - p[2]) * t) * C + gauss() * 0.025;
        SH[4][i] = t < 0.07 || t > 0.93 ? 1 : 0;
      } else {
        const face = Math.floor(rnd() * 6);
        const ax = face % 3;
        const sgn = face < 3 ? -1 : 1;
        const v = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1];
        v[ax] = sgn;
        SX[4][i] = v[0] * C * 0.999;
        SY[4][i] = v[1] * C * 0.999;
        SZ[4][i] = v[2] * C * 0.999;
        SH[4][i] = 0;
      }
    }

    let W = 0;
    let H = 0;
    let dpr = 1;

    // 5 wordmark "THYNK." sampled from text, the dot in orange
    const buildWord = () => {
      const tw = 900;
      const th = 220;
      const oc = document.createElement("canvas");
      oc.width = tw;
      oc.height = th;
      const o = oc.getContext("2d");
      if (!o) return;
      o.fillStyle = "#000";
      o.textBaseline = "middle";
      o.font = `800 170px "Anton", "Open Sans", Arial, sans-serif`;
      const word = "THYNK";
      const ww = o.measureText(word + ".").width;
      const x0 = (tw - ww) / 2;
      o.fillText(word + ".", x0, th / 2 + 6);
      const dotX = x0 + o.measureText(word).width;
      const data = o.getImageData(0, 0, tw, th).data;
      const px: number[] = [];
      for (let y = 0; y < th; y += 2) for (let x = 0; x < tw; x += 2) if (data[(y * tw + x) * 4 + 3] > 128) px.push(x, y);
      const count = px.length / 2;
      if (!count) return;
      const half = Math.min(5.4, ((5 * W) / H) * 0.9);
      const scale = (half * 2) / ww;
      for (let k = 0; k < N; k++) {
        const i = order[k];
        const p = Math.floor(rnd() * count);
        const x = px[p * 2];
        const y = px[p * 2 + 1];
        SX[5][i] = (x - tw / 2) * scale + (rnd() - 0.5) * scale * 2;
        SY[5][i] = -(y - th / 2) * scale + (rnd() - 0.5) * scale * 2;
        SZ[5][i] = (rnd() - 0.5) * 0.25;
        SH[5][i] = x >= dotX ? 1 : 0;
      }
    };

    const COLORS = [0, 1, 2, 3, 4, 5].map((k) => {
      const t = k / 5;
      const r = Math.round(150 + (255 - 150) * t);
      const g = Math.round(158 + (106 - 158) * t);
      const b = Math.round(172 + (26 - 172) * t);
      const a = 0.42 + t * 0.35;
      return `rgba(${r},${g},${b},${a})`;
    });
    COLORS.push("rgba(34,38,48,0.92)"); // 6 = ink, used for the THYNK. letters
    const bx = COLORS.map(() => new Float32Array(N));
    const by = COLORS.map(() => new Float32Array(N));
    const bs = COLORS.map(() => new Float32Array(N));
    const bn = new Int32Array(COLORS.length);

    const resize = () => {
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      cvs.style.width = `${W}px`;
      cvs.style.height = `${H}px`;
      buildWord();
    };
    resize();

    const smoothstep = (x: number) => {
      const t = Math.min(1, Math.max(0, x));
      return t * t * (3 - 2 * t);
    };
    const plateau = (x: number) => {
      const t = Math.min(1, Math.max(0, (x - 0.3) / 0.4));
      return t * t * (3 - 2 * t);
    };

    // one point of a stage, in camera space (shapes sit at z = 9, turning slowly)
    const out = { x: 0, y: 0, z: 0, h: 0 };
    const stagePoint = (st: number, i: number, t: number) => {
      if (st === 0) {
        const spread = W / H > 1 ? 7.5 : 4.2;
        const X0 = gx[i] * spread;
        const Z0 = 2.2 + gz[i] * 12;
        const w1 = Math.sin(X0 * 0.75 + t * 0.55) * Math.cos(Z0 * 0.45 - t * 0.35);
        const w2 = Math.sin(X0 * 1.6 + Z0 * 1.1 + t * 0.8) * 0.35;
        out.x = X0;
        out.y = -1.05 + (w1 + w2) * 0.32;
        out.z = Z0;
        out.h = Math.max(0, (w1 + w2 - 0.55) / 0.8);
        return;
      }
      let x = SX[st][i];
      let y = SY[st][i];
      let z = SZ[st][i];
      const fit = W / H < 0.8 ? 0.6 : 1; // phones: shapes a bit smaller
      if (st !== 5) {
        const a = t * (st === 1 ? 0.06 : 0.16);
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const nx = x * ca - z * sa;
        z = x * sa + z * ca;
        x = nx;
        if (st === 4) {
          // tilt the cube so it reads as 3D
          const b = 0.45;
          const cb = Math.cos(b);
          const sb = Math.sin(b);
          const ny = y * cb - z * sb;
          z = y * sb + z * cb;
          y = ny;
        }
        x *= fit;
        y *= fit;
        z *= fit;
      } else {
        const sway = Math.sin(t * 0.4) * 0.12;
        z += x * sway;
      }
      out.x = x;
      out.y = y;
      out.z = 9 + z;
      out.h = SH[st][i];
    };

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      const t = reduced ? 8 : (now - start) / 1000;
      // shapes 0..4 spread over the page; the last one (THYNK.) forms exactly while the empty
      // outro space before the footer is on screen, so no content card hides it
      const maxS = Math.max(1, document.documentElement.scrollHeight - H);
      const outro = document.querySelector<HTMLElement>(".t11-outro");
      let end = maxS;
      let outroY = H * 0.47; // where the outro's middle is on screen right now
      if (outro) {
        const r = outro.getBoundingClientRect();
        // the letters settle just above the footer's glowing line
        const settle = r.bottom - Math.min(150, H * 0.17);
        end = Math.min(maxS, window.scrollY + settle - H * 0.47);
        outroY = settle;
      }
      const endA = Math.max(1, end - H * 0.9);
      const sy0 = window.scrollY;
      const g = reduced
        ? 0
        : sy0 < endA
          ? (sy0 / endA) * (STAGES - 2)
          : STAGES - 2 + Math.min(1, (sy0 - endA) / Math.max(1, end - endA));
      const a = Math.min(STAGES - 2, Math.floor(g));
      // the last transition runs linearly with the outro; the others hold, then glide
      const m = a === STAGES - 2 && sy0 >= endA ? smoothstep(g - a) : plateau(g - a);
      const f = H * 0.9;
      bn.fill(0);

      for (let i = 0; i < N; i++) {
        stagePoint(a, i, t);
        const ax = out.x;
        const ay = out.y;
        const az = out.z;
        const ah = out.h;
        let X = ax;
        let Y = ay;
        let Z = az;
        let hot = ah;
        if (m > 0) {
          stagePoint(a + 1, i, t);
          X = ax + (out.x - ax) * m;
          Y = ay + (out.y - ay) * m;
          Z = az + (out.z - az) * m;
          hot = ah + (out.h - ah) * m;
        }
        if (Z < 0.5) continue;
        const sx = W / 2 + (X * f) / Z;
        // the wordmark rides with the outro space, so it never sits behind the footer
        const lift = a === STAGES - 2 ? m * (outroY - H * 0.47) : 0;
        const sy = H * 0.47 + lift - (Y * f) / Z;
        if (sx < -4 || sx > W + 4 || sy < -4 || sy > H + 4) continue;
        // wordmark weight: how far we are into the last shape
        const word = a === STAGES - 2 ? m : 0;
        const k = word > 0.15 && hot < 0.5 ? 6 : Math.min(5, Math.floor(hot * 6));
        const base = Math.max(0.9, Math.min(2.4, (10 / Z) * (small ? 1.1 : 1)));
        // the THYNK. letters: dark and chunky so the word reads clearly
        const size = base + word * (small ? 1.6 : 2.2);
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
          const sz = ss[j];
          ctx.fillRect(xs[j] - sz / 2, ys[j] - sz / 2, sz, sz);
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
    // the wordmark font may arrive late: rebuild once fonts are ready
    document.fonts?.ready.then(() => buildWord()).catch(() => {});
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return <canvas ref={ref} className="t11-field" aria-hidden="true" />;
}
