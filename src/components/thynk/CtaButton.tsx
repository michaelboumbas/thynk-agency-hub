import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { hero } from "@/content/site";

export function CtaButton({
  onClick,
  label = hero.ctaPrimary,
  full,
  size = "sm",
}: {
  onClick?: () => void;
  label?: string;
  full?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full border border-hairline bg-surface-raised font-semibold text-foreground transition-all duration-300",
        "hover:border-accent/40 hover:glow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2 text-sm",
        full && "w-full justify-center",
      )}
    >
      {label}
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:translate-x-0.5 glow-accent",
          size === "lg" ? "size-8" : "size-6",
        )}
      >
        <ArrowUpRight className={size === "lg" ? "size-4" : "size-3.5"} />
      </span>
    </button>
  );
}
