import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/** Ambient "network of thought" behind the Muse. Static when reduced motion is on. */
export function NetCanvas({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let raf = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      cv.width = W * d;
      cv.height = H * d;
      cx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.max(14, Math.min(46, (W * H) / 14000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const draw = () => {
      cx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            cx.strokeStyle = `rgba(255,106,26,${(1 - d / 120) * 0.22})`;
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(a.x, a.y);
            cx.lineTo(b.x, b.y);
            cx.stroke();
          }
        }
      }
      cx.shadowColor = "rgba(255,106,26,.9)";
      cx.shadowBlur = 8;
      cx.fillStyle = "rgba(255,140,70,.85)";
      for (const a of nodes) {
        cx.beginPath();
        cx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        cx.fill();
      }
      cx.shadowBlur = 0;
    };

    const tick = () => {
      for (const a of nodes) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    size();
    draw();
    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(cv);
    if (!reduced) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  return <canvas ref={ref} className="t5-net" aria-hidden="true" />;
}
