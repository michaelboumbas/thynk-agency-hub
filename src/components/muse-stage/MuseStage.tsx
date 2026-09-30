import { useEffect, useRef, type RefObject } from "react";
import type { Cam, SceneDef } from "./scenes";
import {
  GENERATORS,
  SHAPE_KEYS,
  decodeFace,
  mulberry32,
  orderShape,
  pointBudget,
  type ShapeKey,
} from "./shapes";

/**
 * MuseStage: ONE fixed, full-viewport canvas behind the page (aria-hidden, no pointer events).
 * Raw WebGL2 (WebGL1 fallback), ONE draw pass, no depth buffer.
 *
 * Scene director (inside this component, no Lenis / GSAP / scroll-jacking):
 *   - every `<section data-scene>` in DOM order is one scene (SCENES[i] gives shape, theme, camera)
 *   - each frame: reference line = scrollY + 35% of the viewport -> scene i and progress t (0..1)
 *   - the morph shape[i] -> shape[i+1] runs over 55..95% of the scene: target G = i + smoothstep(t)
 *   - the rendered G is damped toward the target (frame-rate independent exponential damping), so
 *     a fast scroll or a station jump glides instead of snapping; A/B buffers = floor(G), floor(G)+1
 *   - camera keyframes, the ink uniform (dark glow -> ink on paper) and the page background all
 *     follow the same G
 *
 * Budget: pause when document.hidden; once everything has settled, redraw at <=30fps for the
 * "breath"; still mode (prefers-reduced-motion, the "no motion" button, or no WebGL) draws one static
 * frame per scene and never loops. fps governor: if the average drops below 40fps for 2s while
 * animating, draw fewer points and drop to DPR 1.
 */

const FACE_URL = "/v6/muse-points-m.bin";

const VS = `
attribute vec4 aA;
attribute vec4 aB;
attribute vec2 aSeed;
uniform float uMix, uT, uInk, uDpr, uSize, uFade, uAgitA, uAgitB, uBreath, uZoom;
uniform vec2 uRes, uRot;
uniform vec3 uCam; // centre x, centre y (css px), scale (css px per world unit)
varying vec4 vCol;
const float PI = 3.14159265;

// slow rigid turn + a bounded, radius-dependent wobble: the arms stay readable (an unbounded
// differential rotation would smear the spiral into uniform snow after a few seconds)
vec2 swirl(vec2 p, float t) {
  float r = length(p);
  float a = t * 0.12 + 0.35 * sin(t * 0.45) / (0.4 + r * 0.8);
  float c = cos(a), sn = sin(a);
  return vec2(p.x * c - p.y * sn, p.x * sn + p.y * c);
}

void main() {
  // staggered morph: every particle leaves at its own moment
  float k = clamp(uMix * 1.35 - aSeed.x * 0.35, 0.0, 1.0);
  k = k * k * (3.0 - 2.0 * k);
  vec3 a = aA.xyz;
  vec3 b = aB.xyz;
  // the chaos shape keeps turning like a vortex (same formula on both sides -> continuous at swaps)
  float spin = uT * uBreath;
  a.xy = mix(a.xy, swirl(a.xy, spin), uAgitA);
  b.xy = mix(b.xy, swirl(b.xy, spin), uAgitB);
  vec3 p = mix(a, b, k);

  // mid-morph scatter: particles lift off into a noisy cloud, then settle
  float mid = sin(k * PI);
  vec3 n = vec3(
    sin(aSeed.x * 91.7 + a.y * 2.3 + uT * 0.35),
    sin(aSeed.x * 57.3 + b.x * 2.1 + uT * 0.3),
    cos(aSeed.x * 33.1 + a.x * 1.7 + uT * 0.25));
  p += n * mid * 0.24;

  // breath + gentle drift; chaos jitters more
  float ph = aSeed.x * 6.2831;
  float agit = mix(uAgitA, uAgitB, k);
  p += vec3(sin(uT * 0.7 + ph), cos(uT * 0.6 + ph * 1.3), sin(uT * 0.5 + ph)) * (0.006 + 0.03 * agit) * uBreath;
  p *= 1.0 + 0.012 * sin(uT * 0.9) * uBreath;

  // camera: turn (y), tilt (x), soft perspective
  float cy = cos(uRot.x), sy = sin(uRot.x), cx = cos(uRot.y), sx = sin(uRot.y);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  q = vec3(q.x, q.y * cx + q.z * sx, -q.y * sx + q.z * cx);
  float f = 5.0 / max(5.0 + q.z, 1.5);
  vec2 px = uCam.xy + vec2(q.x, -q.y) * uCam.z * f;
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);

  float gA = step(0.97, aA.w), gB = step(0.97, aB.w);
  float glow = mix(gA, gB, k);
  float bright = mix(step(1.4, aA.w), step(1.4, aB.w), k);
  float tone = mix(min(aA.w, 1.0), min(aB.w, 1.0), k);
  vec3 base = mix(vec3(1.0, 0.93, 0.86), vec3(0.07, 0.07, 0.08), uInk);
  vec3 col = mix(base, vec3(1.0, 0.42, 0.1), glow);
  float aDark = mix(tone * 0.5, 0.9, glow);
  float aLight = mix(0.16 + 0.7 * tone, 0.95, glow);
  float al = mix(aDark, aLight, uInk) * (1.0 - mid * 0.35) * uFade;
  al = min(1.0, al * (1.0 + bright * 0.6));
  // premultiplied colour; alpha scaled by uInk: blend(ONE, ONE_MINUS_SRC_ALPHA) is then additive on
  // the dark stage (uInk 0) and normal "over" compositing on paper (uInk 1), continuous in between
  vCol = vec4(col * al, al * uInk);
  gl_PointSize = max(1.0, uSize * uDpr * f * (0.7 + 0.6 * aSeed.y) * (0.65 + 0.35 * uZoom) * (1.0 + 0.3 * glow + 0.7 * bright));
}`;

const FS = `
precision mediump float;
varying vec4 vCol;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if (r > 0.25) discard;
  gl_FragColor = vCol * smoothstep(0.25, 0.03, r);
}`;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const DARK = [14, 14, 16];
const PAPER = [251, 250, 247];

type Status = "loading" | "ready" | "off";

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[MuseStage]", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

const idle = (fn: () => void) => {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 500 });
  else window.setTimeout(fn, 16);
};

export function MuseStage({
  scenes,
  still,
  themeRef,
  onScene,
  onStatus,
}: {
  scenes: SceneDef[];
  /** true = no animation: one static frame per scene */
  still: boolean;
  /** element whose background / data-theme follow the scene theme */
  themeRef: RefObject<HTMLElement | null>;
  /** current station index (called only when it changes) */
  onScene?: (i: number) => void;
  onStatus?: (s: Status) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef(still);
  const cbRef = useRef({ onScene, onStatus });
  cbRef.current = { onScene, onStatus };
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    stillRef.current = still;
    kickRef.current();
  }, [still]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    let alive = true;
    const S = scenes.length;
    const N = pointBudget();
    const isSmall = () => window.innerWidth < 768;

    // ------------------------------------------------------------ director
    let secs: HTMLElement[] = [];
    let tops: number[] = [];
    let hs: number[] = [];
    const measure = () => {
      secs = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const sy = window.scrollY;
      tops = secs.map((s) => s.getBoundingClientRect().top + sy);
      hs = secs.map((s) => Math.max(1, s.offsetHeight));
    };
    measure();
    const target = () => {
      const count = Math.min(S, secs.length);
      if (!count) return 0;
      const y = window.scrollY + window.innerHeight * 0.35;
      let i = 0;
      while (i < count - 1 && y >= tops[i + 1]!) i++;
      const t = clamp((y - tops[i]!) / hs[i]!);
      return i + (i < count - 1 ? smooth(0.55, 0.95, t) : 0);
    };

    let lastIdx = -1;
    let lastTheme = "";
    const applyDom = (g: number) => {
      const a = clamp(Math.floor(g), 0, S - 1);
      const b = Math.min(S - 1, a + 1);
      const ink = lerp(scenes[a]!.theme, scenes[b]!.theme, g - a);
      const el = themeRef.current;
      if (el) {
        const c = DARK.map((d, j) => Math.round(lerp(d, PAPER[j]!, ink)));
        el.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
        const th = ink < 0.5 ? "dark" : "light";
        if (th !== lastTheme) {
          lastTheme = th;
          el.dataset["theme"] = th;
        }
      }
      const idx = Math.round(g);
      if (idx !== lastIdx) {
        lastIdx = idx;
        cbRef.current.onScene?.(idx);
      }
      return ink;
    };

    // ------------------------------------------------------------ WebGL
    // opaque canvas that paints the scene background itself: the shader's "additive on dark" trick
    // writes premultiplied colour with alpha 0, which Chrome/ANGLE (Metal) drops when compositing a
    // transparent canvas (SwiftShader happened to show it)
    const opts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    };
    let gl = (cv.getContext("webgl2", opts) ??
      cv.getContext("webgl", opts)) as WebGLRenderingContext | null;
    let prog: WebGLProgram | null = null;
    if (gl) {
      const vs = compile(gl, gl.VERTEX_SHADER, VS);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
      prog = gl.createProgram();
      if (vs && fs && prog) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "aSeed");
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          console.warn("[MuseStage]", gl.getProgramInfoLog(prog));
          prog = null;
        }
      } else prog = null;
      if (!prog) gl = null;
    }
    let glOk = !!gl;
    cbRef.current.onStatus?.(glOk ? "loading" : "off");

    const U: Record<string, WebGLUniformLocation | null> = {};
    let locA = -1;
    let locB = -1;
    const bufs = new Map<ShapeKey, WebGLBuffer>();
    let seedBuf: WebGLBuffer | null = null;
    if (gl && prog) {
      gl.useProgram(prog);
      for (const n of [
        "uMix",
        "uT",
        "uInk",
        "uDpr",
        "uSize",
        "uFade",
        "uAgitA",
        "uAgitB",
        "uBreath",
        "uZoom",
        "uRes",
        "uRot",
        "uCam",
      ])
        U[n] = gl.getUniformLocation(prog, n);
      locA = gl.getAttribLocation(prog, "aA");
      locB = gl.getAttribLocation(prog, "aB");
      const locS = gl.getAttribLocation(prog, "aSeed");
      const seeds = new Float32Array(N * 2);
      const r = mulberry32(99);
      for (let i = 0; i < N * 2; i++) seeds[i] = r();
      seedBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
      gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(locS);
      gl.vertexAttribPointer(locS, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(locA);
      gl.enableVertexAttribArray(locB);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
    }

    let W = 1;
    let H = 1;
    let dpr = 1;
    let dprCap = isSmall() ? 1.25 : 1.5;
    let drawCount = N;
    const resize = () => {
      W = Math.max(1, cv.clientWidth);
      H = Math.max(1, cv.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.round(W * dpr);
      const h = Math.round(H * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
    };
    resize();

    const camAt = (g: number): Cam => {
      const key = isSmall() ? "camM" : "cam";
      const a = Math.min(S - 1, Math.floor(g));
      const b = Math.min(S - 1, a + 1);
      const t = g - a;
      const A = scenes[a]![key];
      const B = scenes[b]![key];
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        zoom: lerp(A.zoom, B.zoom, t),
        ry: lerp(A.ry, B.ry, t),
        rx: lerp(A.rx, B.rx, t),
      };
    };

    let fade = 0;
    const draw = (g: number, time: number, motion: boolean) => {
      if (!gl || !glOk) return;
      const ink = applyDom(g);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(
        lerp(DARK[0]!, PAPER[0]!, ink) / 255,
        lerp(DARK[1]!, PAPER[1]!, ink) / 255,
        lerp(DARK[2]!, PAPER[2]!, ink) / 255,
        1,
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
      const a = Math.min(S - 1, Math.floor(g));
      const b = Math.min(S - 1, a + 1);
      const face = bufs.get("face");
      const bA = bufs.get(scenes[a]!.shape) ?? face;
      const bB = bufs.get(scenes[b]!.shape) ?? face;
      if (!bA || !bB) return;
      const cam = camAt(g);
      const t = motion ? time * 0.001 : 0;
      const sway = motion ? Math.sin(t * 0.25) * 0.06 : 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, bA);
      gl.vertexAttribPointer(locA, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bB);
      gl.vertexAttribPointer(locB, 4, gl.FLOAT, false, 0, 0);
      const chaosA = bufs.has(scenes[a]!.shape) && scenes[a]!.shape === "chaos" ? 1 : 0;
      const chaosB = bufs.has(scenes[b]!.shape) && scenes[b]!.shape === "chaos" ? 1 : 0;
      gl.uniform1f(U["uMix"]!, a === b ? 0 : g - a);
      gl.uniform1f(U["uT"]!, t);
      gl.uniform1f(U["uInk"]!, ink);
      gl.uniform1f(U["uDpr"]!, dpr);
      gl.uniform1f(U["uSize"]!, isSmall() ? 1.9 : 2.1);
      gl.uniform1f(U["uFade"]!, fade);
      gl.uniform1f(U["uAgitA"]!, chaosA);
      gl.uniform1f(U["uAgitB"]!, chaosB);
      gl.uniform1f(U["uBreath"]!, motion ? 1 : 0);
      gl.uniform1f(U["uZoom"]!, cam.zoom);
      gl.uniform2f(U["uRes"]!, W, H);
      gl.uniform2f(U["uRot"]!, cam.ry + sway, cam.rx);
      gl.uniform3f(
        U["uCam"]!,
        W * (0.5 + cam.x),
        H * (0.5 + cam.y),
        Math.min(W, H) * 0.42 * cam.zoom,
      );
      gl.drawArrays(gl.POINTS, 0, drawCount);
    };

    // ------------------------------------------------------------ loop
    let raf = 0;
    let gc = target();
    let last = performance.now();
    let lastDraw = 0;
    let allLoaded = false;
    let loadedAt = 0;
    let govStart = 0;
    let govFrames = 0;
    let govLevel = 0;

    const governor = (now: number, settled: boolean) => {
      if (!allLoaded || now - loadedAt < 1500 || settled || govLevel >= 2) {
        govStart = 0;
        return;
      }
      if (!govStart) {
        govStart = now;
        govFrames = 0;
        return;
      }
      govFrames++;
      const span = now - govStart;
      if (span >= 2000) {
        const fps = (govFrames * 1000) / span;
        if (fps < 40) {
          govLevel++;
          drawCount = Math.floor(N * (govLevel === 1 ? 0.6 : 0.4));
          dprCap = 1;
          resize();
          console.info(`[MuseStage] ${fps.toFixed(0)}fps -> ${drawCount} points, DPR 1`);
        }
        govStart = 0;
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!alive || stillRef.current || !glOk) return;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const tg = target();
      gc += (tg - gc) * (1 - Math.exp(-dt * 4.5));
      if (Math.abs(tg - gc) < 1e-4) gc = tg;
      if (bufs.has("face")) fade = Math.min(1, fade + dt / 0.9);
      const settled = gc === tg && fade >= 1;
      // settled: keep breathing, but at <=30fps
      if (!settled || now - lastDraw >= 33) {
        lastDraw = now;
        draw(gc, now, true);
      }
      governor(now, settled);
      raf = requestAnimationFrame(loop);
    };

    // still: one static frame per scene (no loop at all)
    let stillRaf = 0;
    const drawStill = () => {
      if (stillRaf || !alive) return;
      stillRaf = requestAnimationFrame(() => {
        stillRaf = 0;
        gc = Math.round(target());
        fade = 1;
        if (glOk) draw(gc, 0, false);
        else applyDom(gc);
      });
    };

    const kick = () => {
      if (!alive) return;
      if (stillRef.current || !glOk) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        drawStill();
        return;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    kickRef.current = kick;

    const onScroll = () => kick();
    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else kick();
    };
    const onResize = () => {
      measure();
      resize();
      if (stillRef.current || !glOk) drawStill();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    // sections change height (fonts, images, chips) -> re-measure
    const ro = new ResizeObserver(() => {
      measure();
      resize();
      if (stillRef.current || !glOk) drawStill();
    });
    ro.observe(document.body);
    ro.observe(cv);

    const onLost = (e: Event) => {
      e.preventDefault();
      glOk = false;
      cv.style.display = "none";
      cbRef.current.onStatus?.("off");
      kick();
    };
    cv.addEventListener("webglcontextlost", onLost);

    // ------------------------------------------------------------ shapes (face first, the rest in idle slices)
    const upload = (k: ShapeKey, data: Float32Array) => {
      if (!alive || !gl) return;
      const b = gl.createBuffer();
      if (!b) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      bufs.set(k, b);
      if (stillRef.current) drawStill();
    };
    if (gl) {
      const rest = SHAPE_KEYS.filter((k): k is Exclude<ShapeKey, "face"> => k !== "face");
      const next = () => {
        const k = rest.shift();
        if (!alive) return;
        if (!k) {
          allLoaded = true;
          loadedAt = performance.now();
          return;
        }
        idle(() => {
          if (!alive) return;
          upload(k, orderShape(GENERATORS[k](N, mulberry32(k.length * 7919 + k.charCodeAt(0))), N));
          next();
        });
      };
      fetch(FACE_URL)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .catch((e) => {
          console.warn("[MuseStage] face points failed to load", e);
          return new ArrayBuffer(12); // -> soft blob stand-in
        })
        .then((buf) =>
          idle(() => {
            if (!alive) return;
            upload("face", orderShape(decodeFace(buf, N, mulberry32(7)), N));
            cbRef.current.onStatus?.("ready");
            next();
          }),
        );
    }

    kick();

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      if (stillRaf) cancelAnimationFrame(stillRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      kickRef.current = () => {};
      // free GPU memory but keep the context: React StrictMode re-runs this effect on the same canvas,
      // and a lost context would make the second run fail
      if (gl) {
        bufs.forEach((b) => gl?.deleteBuffer(b));
        if (seedBuf) gl.deleteBuffer(seedBuf);
        if (prog) gl.deleteProgram(prog);
      }
    };
    // scenes / themeRef are stable for the page's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="ms-canvas" aria-hidden="true" tabIndex={-1} />;
}
