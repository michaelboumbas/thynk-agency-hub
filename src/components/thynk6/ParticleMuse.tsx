import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * The Muse as a cloud of warm particles (WebGL points, canvas-2D fallback).
 * Points come pre-baked from scripts/build-muse-points.py (public/v6/muse-points.bin):
 * shoulders extended past the photo frame, a depth map for a real 3D feel, detail-weighted sampling.
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
  let o = 12;
  for (let i = 0; i < n; i++, o += 11) {
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
    const ang = Math.random() * Math.PI * 2;
    const rad = 900 + Math.random() * 2100;
    start[i * 3] = Math.cos(ang) * rad;
    start[i * 3 + 1] = (Math.random() - 0.5) * 3000;
    start[i * 3 + 2] = Math.sin(ang) * rad;
  }
  return { n, w, h, target, start, color, misc };
}

const VS = `
#define PIVOT -160.0
attribute vec3 aTarget;
attribute vec3 aStart;
attribute vec4 aColor;
attribute vec3 aMisc;
uniform float uP, uT, uScale, uRotY, uRotX, uDpr, uF;
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
  p.z -= PIVOT; // turn around the middle of the bust, not its front surface
  vec3 q = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
  q.z += PIVOT;
  float f = uF / max(uF + q.z, uF * 0.3);
  vec2 px = uCenter + q.xy * uScale * f;
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);
  gl_PointSize = max(1.0, aMisc.x * f * uDpr * (0.85 + uScale * 1.4));
  float light = clamp(0.72 + 0.5 * (-q.z / 600.0), 0.3, 1.35); // surfaces facing the viewer glow more
  vColor = vec4(aColor.rgb, aColor.a * (0.22 + 0.78 * k) * clamp(f, 0.45, 1.35) * mix(1.0, light, k));
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
}: {
  src: string;
  progressRef: MutableRefObject<number>;
  reduced: boolean;
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

    const small = window.innerWidth < 700;
    const gl = cv.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    const max = gl ? (small ? 36000 : 90000) : small ? 5000 : 9000;
    let ro: ResizeObserver | null = null;

    const view = (w: number, h: number) => {
      const p = reduced ? 1 : clamp(progressRef.current);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      return {
        p,
        // auto-fit: largest size that fits both height and width of the stage, whatever the screen shape
        scale: Math.min((H * 0.84) / h, (W * (W < 700 ? 1.4 : 0.8)) / w),
        cx: W / 2,
        cy: H / 2 + H * 0.03,
        // turn on scroll-in, follow the pointer, and sway gently once formed so the volume reads as 3D
        rotY: (1 - ease(p)) * 1.1 + mouse.x * 0.42 + (reduced ? 0 : Math.sin(performance.now() * 0.00035) * 0.26 * ease(p)),
        rotX: mouse.y * 0.16,
      };
    };

    loadCloud(src, max)
      .then((c) => {
        if (!alive) return;

        const resize = () => {
          const r = cv.getBoundingClientRect();
          dpr = Math.min(window.devicePixelRatio || 1, 2);
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
            const u = (n: string) => gl.getUniformLocation(prog, n);
            const U = {
              p: u("uP"),
              t: u("uT"),
              scale: u("uScale"),
              rotY: u("uRotY"),
              rotX: u("uRotX"),
              dpr: u("uDpr"),
              f: u("uF"),
              res: u("uRes"),
              center: u("uCenter"),
            };
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE); // additive glow
            gl.clearColor(0, 0, 0, 0);

            const frame = (time: number) => {
              if (!alive) return;
              const v = view(c.w, c.h);
              gl.viewport(0, 0, cv.width, cv.height);
              gl.clear(gl.COLOR_BUFFER_BIT);
              gl.uniform1f(U.p, v.p);
              gl.uniform1f(U.t, reduced ? 0 : time * 0.001);
              gl.uniform1f(U.scale, v.scale);
              gl.uniform1f(U.rotY, v.rotY);
              gl.uniform1f(U.rotX, v.rotX);
              gl.uniform1f(U.dpr, dpr);
              gl.uniform1f(U.f, CAM);
              gl.uniform2f(U.res, W, H);
              gl.uniform2f(U.center, v.cx, v.cy);
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
          const v = view(c.w, c.h);
          cx2.setTransform(dpr, 0, 0, dpr, 0, 0);
          cx2.clearRect(0, 0, W, H);
          cx2.globalCompositeOperation = "lighter";
          const t = reduced ? 0 : time * 0.001;
          const cy = Math.cos(v.rotY);
          const sy = Math.sin(v.rotY);
          for (let i = 0; i < c.n; i++) {
            const k = ease(clamp(v.p * 1.35 - c.misc[i * 3 + 1] * 0.35));
            const drift = (1 - k * 0.9) * 22;
            const ph = c.misc[i * 3 + 2];
            const x = c.start[i * 3] + (c.target[i * 3] - c.start[i * 3]) * k + Math.sin(t * 0.7 + ph) * drift;
            const y = c.start[i * 3 + 1] + (c.target[i * 3 + 1] - c.start[i * 3 + 1]) * k + Math.cos(t * 0.6 + ph) * drift;
            const z = c.start[i * 3 + 2] + (c.target[i * 3 + 2] - c.start[i * 3 + 2]) * k + 160;
            const qx = x * cy + z * sy;
            const qz = -x * sy + z * cy - 160;
            const f = CAM / Math.max(CAM + qz, CAM * 0.3);
            const px = v.cx + qx * v.scale * f;
            const py = v.cy + y * v.scale * f;
            const a = c.color[i * 4 + 3] * (0.22 + 0.78 * k);
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
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, progressRef, reduced]);

  return <canvas ref={ref} className="t6-particles" aria-hidden="true" />;
}
