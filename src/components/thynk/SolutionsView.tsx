import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pillars } from "@/content/site";
import { cn } from "@/lib/utils";

export function SolutionsView() {
  const [open, setOpen] = useState<string | null>(pillars[0].id);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="mono-label text-accent">Solutions</p>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Δύο πυλώνες. <span className="text-glow">Μία</span> σκέψη.
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Δεν διαλέγεις από κατάλογο. Ξεκινάμε με audit και προχωράμε κλιμακωτά — πρώτα το πιο
          κρίσιμο.
        </p>
      </div>

      <div className="space-y-4">
        {pillars.map((p) => {
          const isOpen = open === p.id;
          return (
            <div
              key={p.id}
              className={cn(
                "panel overflow-hidden rounded-2xl transition-shadow duration-300",
                isOpen && "glow-soft",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full transition-all duration-300",
                    isOpen ? "bg-accent glow-accent" : "bg-muted-foreground/40",
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span className="mono-label block text-foreground">{p.tag}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {p.intro}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180 text-accent",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-400 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-6 border-t border-hairline px-5 py-5">
                    {p.groups.map((g) => (
                      <div key={g.title}>
                        <p className="mono-label mb-3 text-accent">{g.title}</p>
                        <ul className="space-y-2.5">
                          {g.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                className="mt-2 size-1 shrink-0 rounded-full bg-accent/70"
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
