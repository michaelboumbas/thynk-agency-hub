import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, type ViewId } from "@/content/site";
import { cn } from "@/lib/utils";
import { CtaButton } from "./CtaButton";

export function TopNav({
  view,
  onNavigate,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = itemRefs.current[view];
    const list = listRef.current;
    if (!el || !list) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ left: a.left - b.left, width: a.width, visible: true });
  }, [view]);

  useEffect(() => {
    const onResize = () => {
      const el = itemRefs.current[view];
      const list = listRef.current;
      if (!el || !list) return;
      const a = el.getBoundingClientRect();
      const b = list.getBoundingClientRect();
      setPill({ left: a.left - b.left, width: a.width, visible: true });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [view]);

  const go = (v: ViewId) => {
    onNavigate(v);
    setOpen(false);
  };

  return (
    <header className="relative z-30 border-b border-hairline bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={() => go("home")}
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Thynk — αρχική"
        >
          <img src="/Logos/logo%201.1%20wb.png" alt="" className="h-7 w-auto" aria-hidden="true" />
          <span className="text-lg font-extrabold tracking-tight">
            THYNK<span className="text-glow">.</span>
          </span>
        </button>

        <div ref={listRef} className="relative hidden items-center gap-1 md:flex">
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-y-1 rounded-full bg-surface-raised transition-all duration-350 ease-out",
              pill.visible ? "opacity-100" : "opacity-0",
            )}
            style={{ left: pill.left, width: pill.width }}
          />
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              ref={(el) => {
                itemRefs.current[item.id] = el;
              }}
              onClick={() => go(item.id)}
              aria-current={view === item.id ? "page" : undefined}
              className={cn(
                "mono-label relative z-10 rounded-full px-4 py-2.5 transition-colors duration-200",
                view === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaButton onClick={() => go("contact")} />
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Μενού"
            className="rounded-full border border-hairline p-2 text-foreground transition-colors hover:border-accent/50 md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-16 z-30 border-b border-hairline bg-background/98 px-5 py-4 backdrop-blur md:hidden">
          <nav className="flex flex-col">
            {nav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  "mono-label rounded-lg px-3 py-3 text-left transition-colors",
                  view === item.id
                    ? "bg-surface-raised text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-3 sm:hidden">
            <CtaButton onClick={() => go("contact")} full />
          </div>
        </div>
      )}
    </header>
  );
}
