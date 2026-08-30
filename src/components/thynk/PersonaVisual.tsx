import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Placeholder persona visual ("Μούσα"): a generative "thought network"
 * rendered on canvas in the brand orange with glow.
 * Replaced later by the final asset.
 */
export function PersonaVisual({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1.2 + Math.random() * 1.9,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const pts = nodes.map((n) => ({ ...n, px: n.x * width, py: n.y * height }));

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i]!;
          const b = pts[j]!;
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const dist = Math.hypot(dx, dy);
          const max = Math.min(width, height) * 0.34;
          if (dist < max) {
            ctx.strokeStyle = `rgba(255, 150, 60, ${0.24 * (1 - dist / max)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }

      }

      ctx.shadowColor = "rgba(255, 145, 50, 0.9)";
      ctx.shadowBlur = 14;
      for (const p of pts) {
        ctx.fillStyle = "rgba(255, 176, 102, 0.95)";
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const tick = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.02 || n.x > 0.98) n.vx *= -1;
        if (n.y < 0.02 || n.y > 0.98) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    draw();
    if (!reduced) raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 5, y: px * 5 });
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className={cn("relative select-none [perspective:1200px]", className)}
    >
      <div
        className="panel relative h-full w-full overflow-hidden rounded-3xl transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="grid-texture absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 45%, oklch(0.735 0.176 52 / 12%), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <span className="mono-label absolute bottom-3 left-4 text-muted-foreground/80">
          Persona visual — placeholder
        </span>
      </div>
    </div>
  );
}
