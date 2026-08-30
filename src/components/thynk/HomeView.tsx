import { useEffect, useState } from "react";
import { hero, brand, knowHowTicker, type ViewId } from "@/content/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CtaButton } from "./CtaButton";

export function HomeView({ onNavigate }: { onNavigate: (v: ViewId) => void }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((v) => (v + 1) % knowHowTicker.length);
        setFade(true);
      }, 350);
    }, 4200);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <div className="space-y-6">
        <p className="mono-label text-muted-foreground">
          {brand.kicker} — {brand.established}
        </p>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Σκέψη <span className="text-glow">πίσω</span> από κάθε κίνηση.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {hero.subheadline}
        </p>
        <p className="max-w-xl border-l-2 border-accent/50 pl-4 text-sm italic text-muted-foreground">
          {hero.altLine}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <CtaButton size="lg" onClick={() => onNavigate("contact")} />
          <button
            type="button"
            onClick={() => onNavigate("solutions")}
            className="rounded-full px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {hero.ctaSecondary} →
          </button>
        </div>

        {/* Trust line — intentionally reserved/empty until real material exists. */}
        <div className="min-h-6" aria-hidden="true" />
      </div>

      <div className="panel rounded-2xl p-4 lg:hidden">
        <p className="mono-label mb-2 text-accent">I know how to…</p>
        <p
          className={`text-sm leading-relaxed text-foreground transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {knowHowTicker[i]}
        </p>
      </div>
    </div>
  );
}

export function KnowHowCard() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((v) => (v + 1) % knowHowTicker.length);
        setFade(true);
      }, 350);
    }, 4200);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="panel w-[86%] max-w-sm rounded-2xl p-4 transition-shadow duration-300 hover:glow-soft">
      <p className="mono-label mb-2 text-accent">I know how to…</p>
      <p
        className={`min-h-16 text-sm leading-relaxed text-foreground transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {knowHowTicker[i]}
      </p>
    </div>
  );
}
