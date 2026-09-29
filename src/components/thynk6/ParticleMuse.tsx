import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * The Muse as a cloud of warm particles (WebGL points, canvas-2D fallback).
 * Points come pre-baked from a real 3D model of the Muse (Higgsfield / Hunyuan3D GLB) by
 * scripts/glb-to-muse-points.py (public/v6/muse-points.bin): surface samples with texture colour
 * and normals, so she reads correctly from every angle.
 * `progressRef.current` (0..1, driven by scroll): 0 = scattered dust, 1 = fully formed bust.
 */

type Cloud = {
  n: number;
  w: number; // source canvas width (px)
  h: number; // source canvas height (px)
  target: Float32Array; // x,y,z
  start: Float32Array; // x,y,z
  color: Float32Array; // r,g,b,a (0..1)
  misc: Float32Array; // size, delay, phase
  normal: Float32Array; // surface normal (x, y down, z toward the back)
};

// Camera distance. Far enough that the nose/face aren't magnified against the body (no fish-eye bulge).
const CAM = 7000;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

async function loadCloud(src: string, max: number): Promise<Cloud> {
  const buf = await (await fetch(src)).arrayBuffer();
  const dv = new DataView(buf);
  const total = dv.getUint32(4, true);
  const w = dv.getUint16(8, true);
  const h = dv.getUint16(10, true);
  const n = Math.min(total, max);
  const target = new Float32Array(n * 3);
  const start = new Float32Array(n * 3);
  const color = new Float32Array(n * 4);
  const misc = new Float32Array(n * 3);
  const normal = new Float32Array(n * 3);
  let o = 12;
  for (let i = 0; i < n; i++, o += 14) {
    target[i * 3] = dv.getInt16(o, true);
    target[i * 3 + 1] = dv.getInt16(o + 2, true);
    target[i * 3 + 2] = dv.getInt16(o + 4, true);
    color[i * 4] = dv.getUint8(o + 6) / 255;
    color[i * 4 + 1] = dv.getUint8(o + 7) / 255;
    color[i * 4 + 2] = dv.getUint8(o + 8) / 255;
    color[i * 4 + 3] = dv.getUint8(o + 9) / 255;
    misc[i * 3] = dv.getUint8(o + 10) / 20;
    misc[i * 3 + 1] = Math.random();
    misc[i * 3 + 2] = Math.random() * Math.PI * 2;
    normal[i * 3] = dv.getInt8(o + 11) / 127;
    normal[i * 3 + 1] = dv.getInt8(o + 12) / 127;
    normal[i * 3 + 2] = dv.getInt8(o + 13) / 127;
    const ang = Math.random() * Math.PI * 2;
    const rad = 900 + Math.random() * 2100;
    start[i * 3] = Math.cos(ang) * rad;
    start[i * 3 + 1] = (Math.random() - 0.5) * 3000;
    start[i * 3 + 2] = Math.sin(ang) * rad;
  }
  return { n, w, h, target, start, color, misc, normal };
}

const VS = `
attribute vec3 aTarget;
attribute vec3 aStart;
attribute vec4 aColor;
attribute vec3 aMisc;
attribute vec3 aNormal;
uniform float uP, uT, uScale, uRotY, uRotX, uDpr, uF, uPass, uInk;
uniform vec2 uRes, uCenter;
varying vec4 vColor;
void main() {
  float k = clamp(uP * 1.35 - aMisc.y * 0.35, 0.0, 1.0);
  k = 1.0 - pow(1.0 - k, 3.0);
  float drift = (1.0 - k * 0.9) * 22.0;
  vec3 p = mix(aStart, aTarget, k);
  p.x += sin(uT * 0.7 + aMisc.z) * drift;
  p.y += cos(uT * 0.6 + aMisc.z) * drift;
  float cy = cos(uRotY), sy = sin(uRotY), cx = cos(uRotX), sx = sin(uRotX);
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  vec3 nq = vec3(aNormal.x * cy + aNormal.z * sy, aNormal.y, -aNormal.x * sy + aNormal.z * cy);
  nq = vec3(nq.x, nq.y * cx - nq.z * sx, nq.y * sx + nq.z * cx);
  float f = uF / max(uF + q.z, uF * 0.3);
  vec2 px = uCenter + q.xy * uScale * f;
  // two passes: (0) formed points write depth as fat, slightly pushed-back occluders; (1) colour
  // pass with depth test, so whatever sits behind the head/neck is hidden like a real solid
  float zn = clamp(q.z / 2500.0, -0.98, 0.98);
  float size = max(1.0, aMisc.x * f * uDpr * (0.6 + uScale * 1.1));
  if (uPass < 0.5) {
    zn = k > 0.97 ? zn + 0.03 : 0.999;
    size = max(3.5 * uDpr, size * 3.2); // wide enough to leave no gaps: nothing behind her shows through
  }
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, zn, 1.0);
  gl_PointSize = size;
  // real surface normals: the side facing away fades (no see-through face), a soft key light
  // from the upper left models the volume
  float facing = -nq.z;
  float vis = smoothstep(-0.15, 0.12, facing); // surfaces turned away are fully hidden, not just dimmed
  float key = max(dot(nq, normalize(vec3(-0.45, -0.5, -0.75))), 0.0);
  float light = 0.45 + 0.85 * key;
  // "light sculpture": fine dust, surfaces facing the viewer stay faint, the outline (rim) glows,
  // so the form and the face read like a figure drawn in light
  bool glowPt = aColor.g < 0.72 && aColor.r > 0.9;
  float lumn0 = clamp((aColor.r - 0.78) / 0.22, 0.0, 1.0);
  float rim = 1.0 - abs(nq.z);
  float formed = glowPt ? 0.9 : (0.2 + 0.35 * lumn0 + 0.6 * rim * rim) * (0.75 + 0.5 * key); // a solid, readable surface + a glowing outline
  vec3 warm = glowPt ? vec3(1.0, 0.45, 0.1) : vec3(1.0, 0.93, 0.86);
  vColor = vec4(mix(aColor.rgb, warm, k), mix(aColor.a * 0.5, formed * vis, k) * (0.3 + 0.7 * k) * clamp(f, 0.45, 1.35));
  if (uInk > 0.5) {
    // ink on paper: dark points where the texture is dark, highlights stay paper, circuitry stays orange
    bool glow = aColor.g < 0.72 && aColor.r > 0.9;
    float lumn = clamp((aColor.r - 0.78) / 0.22, 0.0, 1.0);
    float a = glow ? 0.95 : (0.2 + 0.8 * (1.0 - lumn)) * (1.3 - 0.5 * key);
    vec3 c = glow ? vec3(1.0, 0.39, 0.08) : vec3(0.07, 0.07, 0.08);
    vColor = vec4(c, a * (0.3 + 0.7 * k) * mix(1.0, vis, k));
  }
}`;

const FS = `
precision mediump float;
varying vec4 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  if (r > 0.25) discard;
  float soft = smoothstep(0.25, 0.02, r);
  gl_FragColor = vec4(vColor.rgb * vColor.a * soft, vColor.a * soft);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export function ParticleMuse({
  src,
  progressRef,
  reduced,
  ink = false,
  box = false,
  camRef,
  pausedRef,
  maxPoints,
}: {
  src: string;
  progressRef: MutableRefObject<number>;
  reduced: boolean;
  /** dark ink on a light page instead of glowing light on a dark one */
  ink?: boolean;
  /** the canvas is a box in the layout (fit fully inside), not a full-screen stage */
  box?: boolean;
  /** optional scroll-driven camera: extra turn (rad), zoom (×), horizontal shift and lift (fractions of the stage) */
  camRef?: MutableRefObject<{ rot: number; zoom: number; shift: number; lift: number }>;
  /** true = skip drawing (e.g. the stage is covered by the next section, though still "in view") */
  pausedRef?: MutableRefObject<boolean>;
  /** cap the point count (small boxes don't need the full cloud) */
  maxPoints?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let alive = true;
    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // don't spend GPU time while the stage is scrolled out of view
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);

    const small = window.innerWidth < 700;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true, depth: true });
    const max = Math.min(maxPoints ?? Infinity, gl ? (small ? 90000 : 170000) : small ? 5000 : 9000);
    let ro: ResizeObserver | null = null;

    const view = (w: number, h: number) => {
      const p = reduced ? 1 : clamp(progressRef.current);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const cam = camRef?.current ?? { rot: 0, zoom: 1, shift: 0, lift: 0 };
      return {
        p,
        // auto-fit: largest size that fits both height and width of the stage, whatever the screen shape
        scale:
          cam.zoom *
          (box ? Math.min((H * 0.94) / h, (W * 0.98) / w) : Math.min((H * 0.84) / h, (W * (W < 700 ? 1.4 : 0.8)) / w)),
        cx: W / 2 + cam.shift * W,
        cy: (box ? H / 2 : H / 2 + H * 0.03) + cam.lift * H,
        // turn on scroll-in, follow the pointer, and sway gently once formed so the volume reads as 3D
        // a full turn while forming (so you see her all around), then follow the pointer + gentle sway
        rotY:
          (1 - ease(p)) * Math.PI * 2 +
          cam.rot +
          mouse.x * 1.1 +
          (reduced ? 0 : Math.sin(performance.now() * 0.0003) * 0.5 * ease(p)),
        rotX: mouse.y * 0.18,
      };
    };

    // phones get a lighter cloud file (same shape, fewer points)
    loadCloud(small && gl ? src.replace(".bin", "-m.bin") : src, max)
      .then((c) => {
        if (!alive) return;

        const resize = () => {
          const r = cv.getBoundingClientRect();
          dpr = Math.min(window.devicePixelRatio || 1, 1.5); // retina at 2× quadruples the fill cost for little gain on dust
          W = r.width;
          H = r.height;
          cv.width = Math.round(W * dpr);
          cv.height = Math.round(H * dpr);
        };
        resize();

        // ---------- WebGL ----------
        if (gl) {
          const vs = compile(gl, gl.VERTEX_SHADER, VS);
          const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
          const prog = gl.createProgram();
          if (vs && fs && prog) {
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            gl.useProgram(prog);
            const attr = (name: string, data: Float32Array, size: number) => {
              const b = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, b);
              gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
              const loc = gl.getAttribLocation(prog, name);
              gl.enableVertexAttribArray(loc);
              gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
            };
            attr("aTarget", c.target, 3);
            attr("aStart", c.start, 3);
            attr("aColor", c.color, 4);
            attr("aMisc", c.misc, 3);
            attr("aNormal", c.normal, 3);
            const u = (n: string) => gl.getUniformLocation(prog, n);
            const U = {
              p: u("uP"),
              t: u("uT"),
              scale: u("uScale"),
              rotY: u("uRotY"),
              rotX: u("uRotX"),
              dpr: u("uDpr"),
              f: u("uF"),
              pass: u("uPass"),
              ink: u("uInk"),
              res: u("uRes"),
              center: u("uCenter"),
            };
            gl.enable(gl.BLEND);
            // additive glow on dark; normal "over" compositing for ink on paper
            if (ink) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            else gl.blendFunc(gl.ONE, gl.ONE);
            gl.depthFunc(gl.LEQUAL);
            gl.clearColor(0, 0, 0, 0);
            gl.clearDepth(1);

            const frame = (time: number) => {
              if (!alive) return;
              if ((!visible || pausedRef?.current) && !reduced) {
                raf = requestAnimationFrame(frame);
                return;
              }
              const v = view(c.w, c.h);
              gl.viewport(0, 0, cv.width, cv.height);
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
              gl.uniform1f(U.p, v.p);
              gl.uniform1f(U.t, reduced ? 0 : time * 0.001);
              gl.uniform1f(U.scale, v.scale);
              gl.uniform1f(U.rotY, v.rotY);
              gl.uniform1f(U.rotX, v.rotX);
              gl.uniform1f(U.dpr, dpr);
              gl.uniform1f(U.f, CAM);
              gl.uniform1f(U.ink, ink ? 1 : 0);
              gl.uniform2f(U.res, W, H);
              gl.uniform2f(U.center, v.cx, v.cy);
              // pass 0: depth only
              gl.enable(gl.DEPTH_TEST);
              gl.disable(gl.BLEND);
              gl.colorMask(false, false, false, false);
              gl.depthMask(true);
              gl.uniform1f(U.pass, 0);
              gl.drawArrays(gl.POINTS, 0, c.n);
              // pass 1: glowing points, hidden where something is in front
              gl.enable(gl.BLEND);
              gl.colorMask(true, true, true, true);
              gl.depthMask(false);
              gl.uniform1f(U.pass, 1);
              gl.drawArrays(gl.POINTS, 0, c.n);
              if (!reduced) raf = requestAnimationFrame(frame);
            };
            ro = new ResizeObserver(() => {
              resize();
              if (reduced) raf = requestAnimationFrame(frame);
            });
            ro.observe(cv);
            raf = requestAnimationFrame(frame);
            return;
          }
        }

        // ---------- Canvas 2D fallback ----------
        const cx2 = cv.getContext("2d");
        if (!cx2) return;
        const frame2 = (time: number) => {
          if (!alive) return;
          if ((!visible || pausedRef?.current) && !reduced) {
            raf = requestAnimationFrame(frame2);
            return;
          }
          const v = view(c.w, c.h);
          cx2.setTransform(dpr, 0, 0, dpr, 0, 0);
          cx2.clearRect(0, 0, W, H);
          cx2.globalCompositeOperation = ink ? "source-over" : "lighter";
          const t = reduced ? 0 : time * 0.001;
          const cy = Math.cos(v.rotY);
          const sy = Math.sin(v.rotY);
          for (let i = 0; i < c.n; i++) {
            const k = ease(clamp(v.p * 1.35 - c.misc[i * 3 + 1] * 0.35));
            const drift = (1 - k * 0.9) * 22;
            const ph = c.misc[i * 3 + 2];
            const x = c.start[i * 3] + (c.target[i * 3] - c.start[i * 3]) * k + Math.sin(t * 0.7 + ph) * drift;
            const y = c.start[i * 3 + 1] + (c.target[i * 3 + 1] - c.start[i * 3 + 1]) * k + Math.cos(t * 0.6 + ph) * drift;
            const z = c.start[i * 3 + 2] + (c.target[i * 3 + 2] - c.start[i * 3 + 2]) * k;
            const qx = x * cy + z * sy;
            const qz = -x * sy + z * cy;
            const f = CAM / Math.max(CAM + qz, CAM * 0.3);
            const px = v.cx + qx * v.scale * f;
            const py = v.cy + y * v.scale * f;
            const nz = -c.normal[i * 3] * sy + c.normal[i * 3 + 2] * cy;
            const vis = 0.06 + 0.94 * clamp((-nz + 0.2) / 0.55);
            const a = c.color[i * 4 + 3] * (0.22 + 0.78 * k) * (1 - k + k * vis);
            if (ink) {
              const glow = c.color[i * 4 + 1] < 0.72 && c.color[i * 4] > 0.9;
              const ia = glow ? 0.95 : (0.2 + 0.8 * (1 - clamp((c.color[i * 4] - 0.78) / 0.22))) * (0.3 + 0.7 * k) * (1 - k + k * vis);
              cx2.fillStyle = glow ? `rgba(255,100,20,${ia.toFixed(2)})` : `rgba(18,18,20,${ia.toFixed(2)})`;
            } else
              cx2.fillStyle = `rgba(${(c.color[i * 4] * 255) | 0},${(c.color[i * 4 + 1] * 255) | 0},${(c.color[i * 4 + 2] * 255) | 0},${a.toFixed(2)})`;
            const s = Math.max(1, c.misc[i * 3] * f);
            cx2.fillRect(px, py, s, s);
          }
          cx2.globalCompositeOperation = "source-over";
          if (!reduced) raf = requestAnimationFrame(frame2);
        };
        ro = new ResizeObserver(() => {
          resize();
          if (reduced) raf = requestAnimationFrame(frame2);
        });
        ro.observe(cv);
        raf = requestAnimationFrame(frame2);
      })
      .catch((e) => console.warn("Muse particles failed to load", e));

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, progressRef, reduced, ink, box, camRef, pausedRef, maxPoints]);

  return <canvas ref={ref} className="t6-particles" aria-hidden="true" />;
}
