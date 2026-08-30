import { about } from "@/content/site";

export function AboutView() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="mono-label text-accent">About</p>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{about.headline}</h2>
        {about.body.map((p) => (
          <p key={p.slice(0, 24)} className="text-base leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {about.founders.map((f) => (
          <div
            key={f.name}
            className="panel rounded-2xl p-5 transition-shadow duration-300 hover:glow-soft"
          >
            <div className="mb-3 flex size-11 items-center justify-center rounded-full border border-accent/35 bg-accent-soft text-sm font-bold text-accent">
              {f.initials}
            </div>
            <p className="text-base font-bold">{f.name}</p>
            <p className="mono-label mt-1 text-muted-foreground">{f.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.bio}</p>
          </div>
        ))}
      </div>

      <p className="border-l-2 border-accent/50 pl-4 text-sm italic text-muted-foreground">
        {about.tagline}
      </p>
    </div>
  );
}
