import { work } from "@/content/site";

export function WorkView() {
  return (
    <div className="space-y-6">
      <p className="mono-label text-accent">Work</p>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Σύντομα, <span className="text-glow">με άδεια</span>.
      </h2>
      <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{work.teaser}</p>

      <div className="panel rounded-2xl p-5">
        <div className="grid-texture h-32 rounded-xl border border-hairline opacity-50" aria-hidden="true" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{work.note}</p>
      </div>
    </div>
  );
}
