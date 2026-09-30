/**
 * Particle targets for the Muse stage. Every shape has exactly N points so any two can morph
 * point-for-point (i -> i). Layout per point: x, y, z, w (Float32Array, n * 4).
 *   - world units: the "hero" size of a shape is about +-1; y up; z grows AWAY from the camera
 *   - w = tone 0..0.95 (brightness in dark mode / ink density in light mode)
 *         1.0 = orange glow point, 1.5 = bright orange glow point (Metsovo)
 *
 * Correspondence: every shape is sorted by the same 2D Morton (Z-order) code over its own bounding
 * box, then re-shuffled with ONE shared permutation. The sort makes neighbours go to neighbours
 * (the morph flows instead of exploding); the shared shuffle keeps that pairing but spreads every
 * region evenly over the index range, so drawing only the first M points (fps governor) still
 * shows the whole shape.
 */

export type ShapeKey = "face" | "chaos" | "clock" | "streams" | "stairs" | "grid" | "epirus";

export const SHAPE_KEYS: ShapeKey[] = [
  "face",
  "chaos",
  "clock",
  "streams",
  "stairs",
  "grid",
  "epirus",
];

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function gauss(rng: Rng) {
  // Box-Muller
  const u = Math.max(1e-9, rng());
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

/** Fixed-size point writer: extra pushes are ignored, `fill` tops up the remainder. */
class Pts {
  readonly d: Float32Array;
  readonly n: number;
  i = 0;
  constructor(n: number) {
    this.n = n;
    this.d = new Float32Array(n * 4);
  }
  get full() {
    return this.i >= this.n;
  }
  push(x: number, y: number, z: number, w: number) {
    if (this.i >= this.n) return;
    const o = this.i * 4;
    this.d[o] = x;
    this.d[o + 1] = y;
    this.d[o + 2] = z;
    this.d[o + 3] = w;
    this.i++;
  }
  /** call `gen` until the buffer is full (keeps the exact N contract whatever the rounding) */
  fill(gen: () => void) {
    let guard = this.n * 20;
    while (!this.full && guard-- > 0) gen();
    while (!this.full) this.push(0, 0, 0, 0);
  }
}

// ---------------------------------------------------------------- ordering

function part1by1(v: number) {
  v &= 0x7fff;
  v = (v | (v << 8)) & 0x00ff00ff;
  v = (v | (v << 4)) & 0x0f0f0f0f;
  v = (v | (v << 2)) & 0x33333333;
  v = (v | (v << 1)) & 0x55555555;
  return v >>> 0;
}

const permCache = new Map<number, Uint32Array>();
/** one shared shuffle per N (seeded, so every shape gets the same one) */
export function sharedPermutation(n: number): Uint32Array {
  const hit = permCache.get(n);
  if (hit) return hit;
  const p = new Uint32Array(n);
  for (let i = 0; i < n; i++) p[i] = i;
  const rng = mulberry32(0x7417);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = p[i]!;
    p[i] = p[j]!;
    p[j] = t;
  }
  permCache.set(n, p);
  return p;
}

/** Morton-sort by (x, y) in the shape's own bounding box, then apply the shared permutation. */
export function orderShape(src: Float32Array, n: number): Float32Array {
  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = src[i * 4]!;
    const y = src[i * 4 + 1]!;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const sx = 32767 / Math.max(1e-6, x1 - x0);
  const sy = 32767 / Math.max(1e-6, y1 - y0);
  // key * 65536 + index fits a float64 exactly (30 + 16 bits) -> native numeric sort, no comparator
  const keys = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const qx = Math.round((src[i * 4]! - x0) * sx);
    const qy = Math.round((y1 - src[i * 4 + 1]!) * sy);
    const m = (part1by1(qx) | (part1by1(qy) << 1)) >>> 0;
    keys[i] = m * 65536 + i;
  }
  keys.sort();
  const perm = sharedPermutation(n);
  const out = new Float32Array(n * 4);
  for (let j = 0; j < n; j++) {
    const k = keys[perm[j]!]!;
    const s = (k % 65536) * 4;
    const o = j * 4;
    out[o] = src[s]!;
    out[o + 1] = src[s + 1]!;
    out[o + 2] = src[s + 2]!;
    out[o + 3] = src[s + 3]!;
  }
  return out;
}

// ---------------------------------------------------------------- face (from the baked Muse)

/**
 * Decode public/v6/muse-points-m.bin (same format as ParticleMuse: 12-byte header "MUS2", u32 count,
 * u16 w, u16 h; then 14 bytes/point: i16 xyz, u8 rgba, u8 size, i8 normal xyz) and resample to n.
 * One draw pass has no depth test, so only points facing the camera are kept (a front shell) —
 * that replaces the old depth pass. Tone = soft key light + glowing rim, like the v6 "light sculpture".
 */
export function decodeFace(buf: ArrayBuffer, n: number, rng: Rng): Float32Array {
  const dv = new DataView(buf);
  const total = dv.getUint32(4, true);
  const S = 1 / 1100;
  const pool: number[] = [];
  let o = 12;
  for (let i = 0; i < total; i++, o += 14) {
    const nz = dv.getInt8(o + 13) / 127;
    if (-nz < -0.05) continue; // turned away from the viewer
    const x = dv.getInt16(o, true) * S;
    const y = -dv.getInt16(o + 2, true) * S + 0.03;
    const z = dv.getInt16(o + 4, true) * S;
    const r = dv.getUint8(o + 6) / 255;
    const g = dv.getUint8(o + 7) / 255;
    const nx = dv.getInt8(o + 11) / 127;
    const ny = dv.getInt8(o + 12) / 127;
    const glow = g < 0.72 && r > 0.9;
    const lum = clamp((r - 0.78) / 0.22);
    const rim = 1 - Math.abs(nz);
    const key = Math.max(0, -0.45 * nx + 0.5 * ny - 0.75 * nz); // light from upper left, y flipped
    const tone = glow
      ? 1
      : clamp((0.18 + 0.3 * lum + 0.55 * rim * rim) * (0.7 + 0.45 * key), 0.05, 0.95);
    pool.push(x, y, z, tone);
  }
  const P = pool.length / 4;
  const out = new Pts(n);
  if (P === 0) {
    out.fill(() => out.push(gauss(rng) * 0.5, gauss(rng) * 0.6, 0, 0.4));
    return out.d;
  }
  // resample: a random subset when the pool is big enough, otherwise repeat with a hair of jitter
  const idx = new Uint32Array(P);
  for (let i = 0; i < P; i++) idx[i] = i;
  for (let i = P - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = t;
  }
  for (let j = 0; j < n; j++) {
    const s = idx[j % P]! * 4;
    const jit = j >= P ? 0.004 : 0;
    out.push(
      pool[s]! + gauss(rng) * jit,
      pool[s + 1]! + gauss(rng) * jit,
      pool[s + 2]! + gauss(rng) * jit,
      pool[s + 3]!,
    );
  }
  return out.d;
}

// ---------------------------------------------------------------- chaos

/** a turbulent three-arm vortex plus loose dust, big enough to fill the screen */
export function makeChaos(n: number, rng: Rng): Float32Array {
  const p = new Pts(n);
  p.fill(() => {
    const glow = rng() < 0.025; // stray orange "notifications"
    const tone = glow ? 1 : 0.12 + 0.5 * rng();
    if (rng() < 0.62) {
      const arm = Math.floor(rng() * 3);
      const r = 0.12 + Math.pow(rng(), 0.75) * 2.5;
      const th = (arm * TAU) / 3 + r * 1.7 + gauss(rng) * (0.18 + 0.1 * r);
      p.push(Math.cos(th) * r * 1.1, Math.sin(th) * r * 0.85, gauss(rng) * 0.35, tone);
    } else {
      const th = rng() * TAU;
      const r = Math.sqrt(rng());
      p.push(Math.cos(th) * r * 2.9, Math.sin(th) * r * 2.3, (rng() - 0.5) * 1.6, tone * 0.8);
    }
  });
  return p.d;
}

// ---------------------------------------------------------------- clock

/** a clock ring with ticks, hands at 10:10 and an orange wedge of "lost hours" */
export function makeClock(n: number, rng: Rng): Float32Array {
  const p = new Pts(n);
  const z = () => gauss(rng) * 0.015;
  const polar = (a: number, r: number, w: number) =>
    p.push(Math.cos(a) * r, Math.sin(a) * r, z(), w);
  const hand = (ang: number, len: number, width: number, w: number) => {
    const t = Math.pow(rng(), 0.8) * len;
    const s = (rng() - 0.5) * width * (1 - (0.5 * t) / len);
    p.push(
      Math.cos(ang) * t - Math.sin(ang) * s,
      Math.sin(ang) * t + Math.cos(ang) * s,
      z() - 0.02,
      w,
    );
  };
  const deg = (d: number) => (d * Math.PI) / 180;
  const cN = (f: number) => Math.round(n * f);
  const ring = cN(0.38),
    ticks = cN(0.15),
    hour = cN(0.09),
    minute = cN(0.11),
    wedge = cN(0.1),
    center = cN(0.025);
  for (let i = 0; i < ring; i++)
    polar(rng() * TAU, 0.93 + 0.07 * Math.pow(rng(), 1.5), 0.55 + 0.35 * rng());
  for (let i = 0; i < ticks; i++) {
    const k = Math.floor(rng() * 60);
    const major = k % 5 === 0;
    const len = major ? 0.13 : 0.05;
    const a = (k / 60) * TAU + (rng() - 0.5) * (major ? 0.022 : 0.01);
    polar(a, 0.87 - rng() * len, major ? 0.9 : 0.6);
  }
  for (let i = 0; i < hour; i++) hand(deg(150), 0.5, 0.05, 0.85); // 10 o'clock
  for (let i = 0; i < minute; i++) hand(deg(30), 0.78, 0.035, 1); // 2 o'clock, orange
  for (let i = 0; i < wedge; i++) {
    // the time that goes to phone calls: 12 -> 2, sparse orange sector
    const a = deg(30 + rng() * 60);
    const r = 0.2 + Math.sqrt(rng()) * 0.62;
    polar(a, r, rng() < 0.55 ? 1 : 0.35);
  }
  for (let i = 0; i < center; i++) p.push(gauss(rng) * 0.018, gauss(rng) * 0.018, -0.03, 1);
  p.fill(() => {
    const r = Math.sqrt(rng()) * 0.86; // faint dial
    polar(rng() * TAU, r, 0.08 + 0.1 * rng());
  });
  return p.d;
}

// ---------------------------------------------------------------- streams

/** two parallel channels: left carries orange "customers", right the repeated chores */
export function makeStreams(n: number, rng: Rng): Float32Array {
  const p = new Pts(n);
  const W = 0.3;
  p.fill(() => {
    const side = rng() < 0.5 ? -1 : 1;
    const y = -1.15 + 2.3 * rng();
    const cx = side * 0.48 + Math.sin(y * 2.4 + (side > 0 ? 1.1 : 0)) * 0.07;
    const zz = y * 0.35; // the top recedes
    if (rng() < 0.3) {
      // banks
      const e = rng() < 0.5 ? -1 : 1;
      p.push(cx + (e * W) / 2 + gauss(rng) * 0.004, y, zz, 0.7 + 0.25 * rng());
    } else {
      // flow lanes
      const lane = Math.floor(rng() * 7);
      const across = (lane / 6 - 0.5) * W * 0.82 + gauss(rng) * 0.006;
      const glow = side < 0 && rng() < 0.2;
      p.push(cx + across, y, zz + gauss(rng) * 0.01, glow ? 1 : 0.22 + 0.3 * rng());
    }
  });
  return p.d;
}

// ---------------------------------------------------------------- stairs

/** three steps rising left -> right, drawn as treads, risers, side faces and bright edges */
export function makeStairs(n: number, rng: Rng): Float32Array {
  const p = new Pts(n);
  const base = -0.55;
  const D = 0.45; // half depth
  const step = (i: number) => {
    const x0 = -0.9 + 0.6 * i;
    return { x0, x1: x0 + 0.6, top: base + 0.45 * (i + 1), prev: i === 0 ? base : base + 0.45 * i };
  };
  const off = -0.12; // centre vertically
  p.fill(() => {
    const i = Math.floor(rng() * 3);
    const s = step(i);
    const r = rng();
    const zr = (rng() * 2 - 1) * D;
    const last = i === 2;
    if (r < 0.33) {
      // tread (the top)
      const glow = last && rng() < 0.4;
      p.push(s.x0 + rng() * 0.6, s.top + off, zr, glow ? 1 : 0.3 + 0.25 * rng());
    } else if (r < 0.53) {
      // riser
      p.push(s.x0, s.prev + rng() * (s.top - s.prev) + off, zr, 0.35 + 0.2 * rng());
    } else if (r < 0.68) {
      // front side face of the block (sparse)
      p.push(s.x0 + rng() * 0.6, base + rng() * (s.top - base) + off, -D, 0.12 + 0.12 * rng());
    } else {
      // edges: nose, front-top, front-riser
      const e = rng();
      const glow = last && rng() < 0.5;
      const w = glow ? 1 : 0.85 + 0.1 * rng();
      const j = () => gauss(rng) * 0.004;
      if (e < 0.45) p.push(s.x0 + j(), s.top + off + j(), zr, w);
      else if (e < 0.75) p.push(s.x0 + rng() * 0.6, s.top + off + j(), -D + j(), w);
      else p.push(s.x0 + j(), s.prev + rng() * (s.top - s.prev) + off, -D + j(), w);
    }
  });
  return p.d;
}

// ---------------------------------------------------------------- grid

/** order: a calm dot lattice; three orange dots = the accounts that stay in your name */
export function makeGrid(n: number, rng: Rng): Float32Array {
  const p = new Pts(n);
  const C = 28;
  const keys = new Set([6 * C + 20, 17 * C + 7, 21 * C + 22]);
  const per = Math.max(1, Math.floor(n / (C * C)));
  for (let r = 0; r < C; r++)
    for (let c = 0; c < C; c++) {
      const x = -0.95 + (1.9 * c) / (C - 1);
      const y = 0.95 - (1.9 * r) / (C - 1);
      const key = keys.has(r * C + c);
      for (let k = 0; k < per; k++)
        p.push(
          x + gauss(rng) * 0.0065,
          y + gauss(rng) * 0.0065,
          gauss(rng) * 0.006,
          key ? 1.5 : 0.45 + 0.3 * rng(),
        );
    }
  p.fill(() => {
    const c = Math.floor(rng() * C);
    const r = Math.floor(rng() * C);
    p.push(
      -0.95 + (1.9 * c) / (C - 1) + gauss(rng) * 0.0065,
      0.95 - (1.9 * r) / (C - 1) + gauss(rng) * 0.0065,
      0,
      0.5,
    );
  });
  return p.d;
}

// ---------------------------------------------------------------- Epirus

/** Simplified outline of the Epirus region (lat, lon), clockwise from Sagiada. Hand-drawn, ~38 vertices. */
export const EPIRUS_OUTLINE: [number, number][] = [
  [39.62, 20.18],
  [39.7, 20.26],
  [39.76, 20.31],
  [39.84, 20.3],
  [39.92, 20.33],
  [39.98, 20.4],
  [40.03, 20.47],
  [40.08, 20.56],
  [40.12, 20.62],
  [40.18, 20.66],
  [40.26, 20.7],
  [40.35, 20.8],
  [40.3, 20.9],
  [40.22, 20.98],
  [40.1, 21.1],
  [39.98, 21.15],
  [39.88, 21.22],
  [39.8, 21.3],
  [39.7, 21.28],
  [39.58, 21.32],
  [39.45, 21.36],
  [39.32, 21.3],
  [39.2, 21.24],
  [39.1, 21.18],
  [39.02, 21.1],
  [39.04, 21.0],
  [39.02, 20.9],
  [38.99, 20.8],
  [38.95, 20.75],
  [39.0, 20.7],
  [39.08, 20.62],
  [39.16, 20.52],
  [39.24, 20.44],
  [39.28, 20.4],
  [39.34, 20.33],
  [39.42, 20.28],
  [39.5, 20.26],
  [39.56, 20.21],
];

const EP_K = 1.35;
const EP_LAT0 = 39.65;
const EP_LON0 = 20.76;
const EP_COS = Math.cos((39.6 * Math.PI) / 180);
/** equirectangular is plenty at this scale */
export function epirusXY(lat: number, lon: number): [number, number] {
  return [(lon - EP_LON0) * EP_COS * EP_K, (lat - EP_LAT0) * EP_K];
}

type City = { lat: number; lon: number; share: number; sigma: number; w: number };
const CITIES: City[] = [
  { lat: 39.665, lon: 20.845, share: 0.035, sigma: 0.022, w: 1 }, // Ioannina
  { lat: 39.77, lon: 21.18, share: 0.03, sigma: 0.018, w: 1.5 }, // Metsovo (brighter)
  { lat: 39.16, lon: 20.985, share: 0.011, sigma: 0.014, w: 1 }, // Arta
  { lat: 38.965, lon: 20.755, share: 0.011, sigma: 0.012, w: 1 }, // Preveza
  { lat: 39.505, lon: 20.285, share: 0.011, sigma: 0.012, w: 1 }, // Igoumenitsa
  { lat: 40.045, lon: 20.75, share: 0.011, sigma: 0.012, w: 1 }, // Konitsa
  { lat: 39.285, lon: 20.41, share: 0.011, sigma: 0.012, w: 1 }, // Parga
];

export function makeEpirus(n: number, rng: Rng): Float32Array {
  const poly = EPIRUS_OUTLINE.map(([la, lo]) => epirusXY(la, lo));
  const inside = (x: number, y: number) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i]!;
      const [xj, yj] = poly[j]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  // lake Pamvotida: a small tilted ellipse just east of Ioannina
  const [lx, ly] = epirusXY(39.663, 20.895);
  const la = Math.PI / 4;
  const inLake = (x: number, y: number) => {
    const dx = x - lx;
    const dy = y - ly;
    const u = dx * Math.cos(la) - dy * Math.sin(la);
    const v = dx * Math.sin(la) + dy * Math.cos(la);
    return (u / 0.07) ** 2 + (v / 0.026) ** 2 < 1;
  };
  let bx0 = Infinity,
    bx1 = -Infinity,
    by0 = Infinity,
    by1 = -Infinity;
  const seg: number[] = [0];
  for (let i = 0; i < poly.length; i++) {
    const [x, y] = poly[i]!;
    bx0 = Math.min(bx0, x);
    bx1 = Math.max(bx1, x);
    by0 = Math.min(by0, y);
    by1 = Math.max(by1, y);
    const [x2, y2] = poly[(i + 1) % poly.length]!;
    seg.push(seg[i]! + Math.hypot(x2 - x, y2 - y));
  }
  const perim = seg[seg.length - 1]!;
  const p = new Pts(n);
  const zj = () => gauss(rng) * 0.01;

  // cities first (glow clusters), then the outline, then the fill tops it up
  for (const c of CITIES) {
    const [cx, cy] = epirusXY(c.lat, c.lon);
    const m = Math.round(n * c.share);
    for (let i = 0; i < m; i++) {
      const x = cx + gauss(rng) * c.sigma;
      const y = cy + gauss(rng) * c.sigma;
      if (inLake(x, y)) {
        i--;
        continue;
      }
      p.push(x, y, zj() - 0.01, c.w);
    }
  }
  const outline = Math.round(n * 0.55);
  for (let i = 0; i < outline; i++) {
    const t = rng() * perim;
    let s = 0;
    while (s < poly.length - 1 && seg[s + 1]! < t) s++;
    const [x1, y1] = poly[s]!;
    const [x2, y2] = poly[(s + 1) % poly.length]!;
    const f = (t - seg[s]!) / Math.max(1e-9, seg[s + 1]! - seg[s]!);
    p.push(
      x1 + (x2 - x1) * f + gauss(rng) * 0.004,
      y1 + (y2 - y1) * f + gauss(rng) * 0.004,
      zj(),
      0.75 + 0.2 * rng(),
    );
  }
  p.fill(() => {
    const x = bx0 + rng() * (bx1 - bx0);
    const y = by0 + rng() * (by1 - by0);
    if (!inside(x, y) || inLake(x, y)) return;
    p.push(x, y, zj(), 0.14 + 0.2 * rng());
  });
  return p.d;
}

export const GENERATORS: Record<
  Exclude<ShapeKey, "face">,
  (n: number, rng: Rng) => Float32Array
> = {
  chaos: makeChaos,
  clock: makeClock,
  streams: makeStreams,
  stairs: makeStairs,
  grid: makeGrid,
  epirus: makeEpirus,
};

/** N for this device: 60k desktop, 28k on small screens or low-memory devices */
export function pointBudget(): number {
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return window.innerWidth < 768 || (typeof mem === "number" && mem <= 4) ? 28000 : 60000;
}
