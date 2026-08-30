import { Mail } from "lucide-react";
import { brand, contact } from "@/content/site";
import { CtaButton } from "./CtaButton";

export function ContactView() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="mono-label text-accent">Contact</p>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ξεκινάμε με <span className="text-glow">audit</span>.
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{contact.intro}</p>
      </div>

      <ul className="space-y-2">
        {contact.emails.map((email) => (
          <li key={email}>
            <a
              href={`mailto:${email}`}
              className="panel group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 hover:border-accent/40 hover:glow-soft"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Mail className="size-3.5" />
              </span>
              {email}
            </a>
          </li>
        ))}
      </ul>

      <CtaButton size="lg" onClick={() => (window.location.href = `mailto:${contact.emails[0]}`)} />

      <div className="space-y-2 border-t border-hairline pt-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">
          THYNK<span className="text-glow">.</span> {brand.kicker}
        </p>
        <p>Σκέψη πίσω από κάθε κίνηση.</p>
        <p>
          {brand.location} · Established 2026
        </p>
        <p className="pt-2 text-xs">{contact.copyright}</p>
      </div>
    </div>
  );
}
