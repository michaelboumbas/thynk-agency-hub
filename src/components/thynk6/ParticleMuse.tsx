import { useEffect, useRef, type MutableRefObject } from "react";

type P = {
  tx: number; // target (image space, centred, px at scale 1)
  ty: number;
  tz: number;
  sx: number; // scattered start
  sy: number;
  sz: number;
  d: number; // per-particle delay 0..1
  ph: number; // phase for idle drift
  r: number;
  g: number;
  b: number;
  a: number;
  s: number; // size
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * The Muse as a cloud of warm particles. `progressRef.current` (0..1) is driven by scroll:
 * 0 = scattered dust, 1 = fully formed portrait.
 */
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
    const cx = cv.getContext("2d");
    if (!cx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let parts: P[] = [];
    let imgW = 1;
    let imgH = 1;
    let raf = 0;
    let alive = true;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = (img: HTMLImageElement) => {
      const off = document.createElement("canvas");
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      off.width = imgW;
      off.height = imgH;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.drawImage(img, 0, 0);
      const data = o.getImageData(0, 0, imgW, imgH).data;
      const lum = (x: number, y: number) => {
        const i = (y * imgW + x) * 4;
        return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      };
      const small = window.innerWidth < 700;
      const target = small ? 5200 : 9500;
      const cand: { x: number; y: number; w: number }[] = [];
      for (let y = 1; y < imgH - 1; y++) {
        for (let x = 1; x < imgW - 1; x++) {
          const i = (y * imgW + x) * 4;
          if (data[i + 3] < 110) continue;
          const edge = Math.abs(lum(x + 1, y) - lum(x - 1, y)) + Math.abs(lum(x, y + 1) - lum(x, y - 1));
          const orange = data[i] > 170 && data[i] - data[i + 2] > 70 ? 1 : 0;
          cand.push({ x, y, w: 0.18 + edge * 3.2 + orange * 1.2 + lum(x, y) * 0.25 });
        }
      }
      const total = cand.reduce((s, c) => s + c.w, 0);
      const k = target / total;
      const out: P[] = [];
      for (const c of cand) {
        if (Math.random() > c.w * k) continue;
        const i = (c.y * imgW + c.x) * 4;
        const R = data[i];
        const G = data[i + 1];
        const B = data[i + 2];
        const isOrange = R > 170 && R - B > 70;
        const l = lum(c.x, c.y);
        const ang = Math.random() * Math.PI * 2;
        const rad = 380 + Math.random() * 900;
        out.push({
          tx: c.x - imgW / 2 + (Math.random() - 0.5) * 0.8,
          ty: c.y - imgH / 2 + (Math.random() - 0.5) * 0.8,
          tz: (l - 0.5) * 26 + (Math.random() - 0.5) * 6,
          sx: Math.cos(ang) * rad,
          sy: (Math.random() - 0.5) * 900,
          sz: Math.sin(ang) * rad,
          d: Math.random(),
          ph: Math.random() * Math.PI * 2,
          r: isOrange ? 255 : 226 + Math.round(l * 26),
          g: isOrange ? 110 + Math.round(Math.random() * 50) : 214 + Math.round(l * 30),
          b: isOrange ? 40 : 200 + Math.round(l * 36),
          a: isOrange ? 0.95 : 0.25 + l * 0.55,
          s: isOrange ? 1.6 : 0.9 + Math.random() * 0.9,
        });
      }
      parts = out;
    };

    const frame = (time: number) => {
      if (!alive) return;
      const p = reduced ? 1 : clamp(progressRef.current);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      cx.clearRect(0, 0, W, H);

      const scale = (H * 0.8) / imgH;
      const cxp = W / 2;
      const cyp = H / 2 + H * 0.02;
      const rotY = (1 - ease(p)) * 1.1 + mouse.x * 0.22;
      const rotX = mouse.y * 0.12;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const t = time * 0.001;
      const F = 900;

      cx.globalCompositeOperation = "lighter";
      for (let i = 0; i < parts.length; i++) {
        const q = parts[i];
        const k = ease(clamp((p * 1.35 - q.d * 0.35) / 1));
        const drift = reduced ? 0 : (1 - k * 0.85) * 6;
        let x = q.sx + (q.tx - q.sx) * k + Math.sin(t * 0.7 + q.ph) * drift;
        let y = q.sy + (q.ty - q.sy) * k + Math.cos(t * 0.6 + q.ph) * drift;
        let z = q.sz + (q.tz - q.sz) * k;
        // rotate Y then X
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        x = x1;
        y = y1;
        z = z2;
        const f = F / (F + z / scale);
        const px = cxp + x * scale * f;
        const py = cyp + y * scale * f;
        if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
        const alpha = q.a * (0.25 + 0.75 * k) * clamp(f, 0.4, 1.4);
        cx.fillStyle = `rgba(${q.r},${q.g},${q.b},${alpha.toFixed(3)})`;
        const sz = q.s * f * (scale > 2 ? 1.15 : 1);
        cx.fillRect(px, py, sz, sz);
      }
      cx.globalCompositeOperation = "source-over";
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    resize();
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      if (!alive) return;
      build(img);
      raf = requestAnimationFrame(frame);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) raf = requestAnimationFrame(frame);
    });
    ro.observe(cv);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, progressRef, reduced]);

  return <canvas ref={ref} className="t6-particles" aria-hidden="true" />;
}
