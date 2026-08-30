import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/content/site";
import { Splash } from "@/components/thynk/Splash";
import { TopNav } from "@/components/thynk/TopNav";
import { PersonaVisual } from "@/components/thynk/PersonaVisual";
import { HomeView, KnowHowCard } from "@/components/thynk/HomeView";
import { AboutView } from "@/components/thynk/AboutView";
import { SolutionsView } from "@/components/thynk/SolutionsView";
import { WorkView } from "@/components/thynk/WorkView";
import { ContactView } from "@/components/thynk/ContactView";

const title = "Thynk Digital Agency — Σκέψη πίσω από κάθε κίνηση";
const description =
  "Marketing και Digital Transformation για επιχειρήσεις της Ηπείρου. Ιωάννινα, established 2026. Πρώτα audit, μετά στρατηγική.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [splashDone, setSplashDone] = useState(false);
  const [view, setView] = useState<ViewId>("home");
  const [entering, setEntering] = useState(true);

  const isHome = view === "home";

  const navigate = useCallback(
    (next: ViewId) => {
      if (next === view) return;
      setEntering(false);
      setView(next);
    },
    [view],
  );

  useEffect(() => {
    const t = setTimeout(() => setEntering(true), 20);
    return () => clearTimeout(t);
  }, [view]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}

      <TopNav view={view} onNavigate={navigate} />

      <main className="relative min-h-0 flex-1">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 78% 20%, oklch(0.735 0.176 52 / 7%), transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div
          className={cn(
            "mx-auto grid h-full w-full max-w-[1400px] min-h-0 gap-8 px-5 py-6 sm:px-8",
            isHome
              ? "lg:grid-cols-[1.05fr_0.95fr]"
              : "lg:grid-cols-[minmax(280px,0.62fr)_1.38fr]",
          )}
        >
          {/* Left column: home copy, or the pinned persona visual on inner views */}
          <div className="relative min-h-0 overflow-hidden">
            {isHome ? (
              <div className="scroll-slim h-full overflow-y-auto pr-1">
                <HomeView onNavigate={navigate} />
              </div>
            ) : (
              <div className="hidden h-full flex-col justify-center gap-5 lg:flex">
                <PersonaVisual className="h-[min(52vh,420px)] w-full" />
                <KnowHowCard />
              </div>
            )}
          </div>

          {/* Right column: persona visual on home, content panel on inner views */}
          <div className="relative min-h-0">
            {isHome ? (
              <div className="hidden h-full flex-col items-center justify-center gap-5 lg:flex">
                <PersonaVisual className="h-[min(58vh,520px)] w-full" />
                <KnowHowCard />
                {/* Stats card slot — intentionally reserved/empty. */}
              </div>
            ) : (
              <section
                key={view}
                className={cn(
                  "panel scroll-slim h-full overflow-y-auto rounded-3xl p-6 transition-all duration-500 ease-out sm:p-8",
                  entering ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {view === "about" && <AboutView />}
                {view === "solutions" && <SolutionsView />}
                {view === "work" && <WorkView />}
                {view === "contact" && <ContactView />}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
