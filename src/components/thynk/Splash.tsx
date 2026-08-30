import { useEffect, useState } from "react";
import { brand } from "@/content/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Splash({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setLeaving(true), 1700);
    const t2 = setTimeout(onDone, 2350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone, reduced]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-600 ease-out ${
        leaving ? "scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="grid-texture absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 50%, oklch(0.735 0.176 52 / 10%), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <img
          src="/Logos/logo%201.1%20wb.png"
          alt="Thynk Digital Agency"
          className="h-24 w-auto drop-shadow-[0_0_36px_oklch(0.735_0.176_52/35%)] sm:h-32"
        />
        <p className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          THYNK<span className="text-glow">.</span>
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          {brand.kicker} · Ιωάννινα
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mono-label absolute bottom-8 rounded-full border border-hairline px-4 py-2 text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
      >
        Παράλειψη
      </button>
    </div>
  );
}
