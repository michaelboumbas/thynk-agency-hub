import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  allServices,
  audit,
  auditForm,
  calculatorCopy,
  caps,
  cta,
  examples,
  faq,
  finalCta,
  footer,
  forWhom,
  hero,
  pains,
  rules,
  servicesSteps,
  team,
  v9Assets,
  v9Nav,
  type Example,
  type PainId,
  type ServiceStep,
} from "@/content/site-v9";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Calculator } from "@/components/thynk5/Calculator";
import { HandsHero } from "@/components/thynk10/HandsHero";

/**
 * v9 — "Thynk Clear" + the service presentation of liberators.ai (UX only, none of their copy).
 * Plural / formal voice everywhere (decision 30/09/2026).
 * New vs v8:
 *  - Example systems: dark text panel + light mini-app that "runs" step by step. Desktop: pinned
 *    horizontal scroll. Mobile: native swipe with snap. Every card is labelled as an example.
 *  - Services as three steps (Audit → Υλοποίηση → Thynk Care) with a progress line. Desktop: pinned,
 *    the line fills as you scroll and the panel swaps. Mobile / reduced motion: stacked.
 *  - Serif-italic accent word in the headlines (Noto Serif Display has Greek).
 * The rest (who, audit detail, calculator, team, FAQ, form) is the v8 layout with plural copy.
 */

const DESKTOP = "(min-width: 981px)";
const pad = (n: number) => String(n).padStart(2, "0");

export function useMedia(q: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setOn(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [q]);
  return on;
}

/** 0 → 1 while a tall section scrolls past a sticky child. */
export function usePinProgress(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const v = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      setP(v);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
  return p;
}

export function useReveal(root: RefObject<HTMLElement | null>, dep: unknown) {
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])");
    if (!els?.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root, dep]);
}

/** Reveals the steps of a mini-screen one by one while its card is active, then loops. */
function useStepper(active: boolean, total: number, reduced: boolean) {
  const [shown, setShown] = useState(total);
  useEffect(() => {
    if (reduced || !active) {
      setShown(total);
      return;
    }
    let n = 0;
    let t = 0;
    setShown(0);
    const tick = () => {
      if (n < total) {
        n += 1;
        setShown(n);
        t = window.setTimeout(tick, n === total ? 3400 : 1050);
      } else {
        n = 0;
        setShown(0);
        t = window.setTimeout(tick, 500);
      }
    };
    t = window.setTimeout(tick, 450);
    return () => window.clearTimeout(t);
  }, [active, total, reduced]);
  return shown;
}

export function Wordmark() {
  return (
    <span className="t8-word" aria-label="Thynk">
      THYNK<i>.</i>
    </span>
  );
}

export function Arrow() {
  return (
    <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check() {
  return (
    <svg className="t9-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

export function Title({ start, accent, end, id }: { start: string; accent: string; end: string; id?: string }) {
  return (
    <h2 className="t8-h2" id={id}>
      {start}
      <em className="t9-em">{accent}</em>
      {end}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* Hero Muse (same as v8)                                              */
/* ------------------------------------------------------------------ */
function Muse({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(v9Assets.muse);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const on = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => {
      window.removeEventListener("pointermove", on);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div className="t8-muse" ref={ref}>
      <div className="t8-muse-glow" aria-hidden="true" />
      <div className="t8-muse-card" aria-hidden="true" />
      <div className="t8-muse-clip">
        <div className="t8-muse-float">
          <img
            className="t8-muse-img"
            src={src}
            onError={() => setSrc(v9Assets.museFallback)}
            alt="Η Μούσα, το ψηφιακό πρόσωπο της Thynk"
            width={786}
            height={1000}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
      <div className="t8-muse-tag" aria-hidden="true">
        <span className="t8-dot" />Η Μούσα
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Example systems                                                     */
/* ------------------------------------------------------------------ */
function Screen({ ex, active, reduced }: { ex: Example; active: boolean; reduced: boolean }) {
  const total = ex.steps.length;
  const shown = useStepper(active, total, reduced);
  const done = shown >= total;

  return (
    <div className="t9-app" aria-hidden="true">
      <div className="t9-app-bar">
        <span className="t9-app-logo">T</span>
        <strong>{ex.app}</strong>
        <span className="t9-app-pill">{examples.label}</span>
      </div>
      <div className="t9-app-status">
        <span className={`t9-spin${done ? " done" : ""}`} />
        {ex.status}
      </div>

      {ex.kind === "chat" && (
        <div className="t9-chat">
          {ex.steps.map((s, i) =>
            s.state === "wait" ? (
              <div key={i} className={`t9-chat-sys${i < shown ? " in" : ""}`}>
                <span className="t9-dot-wait" />
                <span>
                  <strong>{s.title}</strong> · {s.detail}
                </span>
                <span className="t9-fake-btn">Έγκριση</span>
              </div>
            ) : (
              <div key={i} className={`t9-bubble t9-bubble-${s.detail}${i < shown ? " in" : ""}`}>
                {s.title}
              </div>
            ),
          )}
          {!done && shown > 0 && (
            <div className={`t9-typing t9-typing-${ex.steps[shown]?.detail === "guest" ? "guest" : "bot"}`}>
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
      )}

      {ex.kind === "timeline" && (
        <ol className="t9-tl">
          {ex.steps.map((s, i) => (
            <li key={i} className={`${i < shown ? "in" : ""} ${s.state ?? ""}`}>
              <span className="t9-tl-node">{s.state === "wait" ? <span className="t9-dot-wait" /> : <Check />}</span>
              <div>
                <strong>{s.title}</strong>
                <small>{s.detail}</small>
              </div>
            </li>
          ))}
        </ol>
      )}

      {ex.kind === "report" && (
        <div className="t9-report">
          <div className="t9-report-head">
            <span>Επαφές ανά κανάλι, αυτή την εβδομάδα</span>
          </div>
          <ul>
            {ex.steps.map((s, i) => {
              const v = Number(s.detail) || 0;
              return (
                <li key={i} className={`${i < shown ? "in" : ""} ${s.state ?? ""}`}>
                  <span className="t9-report-name">{s.title}</span>
                  <span className="t9-report-bar">
                    <i style={{ width: i < shown ? `${v}%` : "0%" }} />
                  </span>
                  <span className="t9-report-val">
                    {v} {examples.reportLegend.unit}
                  </span>
                  <span className={`t9-report-tag ${s.state === "flag" ? "cut" : "keep"}`}>
                    {s.state === "flag" ? examples.reportLegend.cut : examples.reportLegend.keep}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {ex.kind === "docs" && (
        <ul className="t9-docs">
          {ex.steps.map((s, i) => (
            <li key={i} className={`${i < shown ? "in" : ""} ${s.state ?? ""}`}>
              <span className="t9-doc-ico" />
              <strong>{s.title}</strong>
              <span className="t9-doc-val">{s.detail}</span>
              <span className="t9-doc-state">{s.state === "flag" ? "Για έλεγχο" : "Καταχωρήθηκε"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExampleCard({ ex, i, active, reduced }: { ex: Example; i: number; active: boolean; reduced: boolean }) {
  return (
    <article className={`t9-card t9-tint-${ex.tint}${active ? " on" : ""}`} aria-labelledby={`ex-${ex.id}`}>
      <div className="t9-card-text">
        <div className="t9-card-top">
          <span className="t9-kicker">
            {caps(examples.counter)} {pad(i + 1)}
          </span>
          <span className="t9-cat">{caps(ex.tag)}</span>
        </div>
        <h3 id={`ex-${ex.id}`}>{ex.title}</h3>
        <p>{ex.text}</p>
        <p className="t9-punch">{ex.punch}</p>
        <span className="t9-bignum" aria-hidden="true">
          {pad(i + 1)}
        </span>
      </div>
      <div className="t9-card-screen">
        <Screen ex={ex} active={active} reduced={reduced} />
      </div>
    </article>
  );
}

export function Examples({ reduced }: { reduced: boolean }) {
  const desktop = useMedia(DESKTOP);
  const pinned = desktop && !reduced;
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = usePinProgress(secRef, pinned);
  const n = examples.items.length;
  const [shift, setShift] = useState(0);
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      // one "step" = card width + gap, so the active card always lines up with the page grid
      const card = trackRef.current?.querySelector<HTMLElement>(".t9-card");
      if (!card) return;
      const gap = parseFloat(getComputedStyle(trackRef.current!).columnGap) || 0;
      setShift(card.offsetWidth + gap);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned]);

  const onSwipe = () => {
    const t = trackRef.current;
    if (!t || pinned) return;
    const card = t.querySelector<HTMLElement>(".t9-card");
    const w = card ? card.offsetWidth + 16 : t.clientWidth;
    setSwipeIdx(Math.min(n - 1, Math.max(0, Math.round(t.scrollLeft / w))));
  };

  const goTo = (i: number) => {
    const t = trackRef.current;
    if (pinned && secRef.current) {
      const el = secRef.current;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + (i / (n - 1)) * span, behavior: reduced ? "auto" : "smooth" });
    } else if (t) {
      const card = t.querySelectorAll<HTMLElement>(".t9-card")[i];
      if (card) t.scrollTo({ left: card.offsetLeft - t.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
    }
  };

  // hold on each card for a while, then glide to the next (instead of a linear drift)
  const raw = progress * (n - 1);
  const base = Math.min(n - 2, Math.floor(raw));
  const f = Math.min(1, Math.max(0, (raw - base - 0.3) / 0.4));
  const pos = base + f * f * (3 - 2 * f);
  const active = pinned ? Math.round(pos) : swipeIdx;

  return (
    <section
      id="examples"
      ref={secRef}
      className={`t9-ex${pinned ? " pinned" : ""}`}
      style={pinned ? { height: `${100 + (n - 1) * 70}vh` } : undefined}
      aria-labelledby="ex-title"
    >
      <div className="t9-ex-sticky">
        <div className="t9-ex-head">
          <div>
            <span className="t8-eyebrow">{caps(examples.eyebrow)}</span>
            <Title id="ex-title" start={examples.titleStart} accent={examples.titleAccent} end={examples.titleEnd} />
          </div>
          <div className="t9-ex-side">
            <p className="t8-muted">{examples.lead}</p>
            <div className="t9-dots" role="group" aria-label="Επιλογή παραδείγματος">
              {examples.items.map((ex, i) => (
                <button
                  key={ex.id}
                  type="button"
                  className={i === active ? "on" : ""}
                  aria-label={`${examples.counter} ${i + 1}: ${ex.title}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="t9-ex-viewport">
          <div
            className="t9-ex-track"
            ref={trackRef}
            onScroll={onSwipe}
            style={pinned ? { transform: `translate3d(${(-pos * shift).toFixed(1)}px,0,0)` } : undefined}
          >
            {examples.items.map((ex, i) => (
              <ExampleCard key={ex.id} ex={ex} i={i} active={inView && i === active} reduced={reduced} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services as three steps                                             */
/* ------------------------------------------------------------------ */
function DiagramMap() {
  const d = servicesSteps.diagrams.map;
  const pts = [
    [70, 60],
    [190, 38],
    [310, 70],
    [260, 170],
    [110, 165],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0],
    [1, 4],
    [1, 3],
  ];
  return (
    <div className="t9-dia">
      <svg viewBox="0 0 380 220" className="t9-dia-svg" aria-hidden="true">
        {edges.map(([a, b], i) => (
          <line key={i} className="t9-edge" x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
        ))}
        {pts.map(([x, y], i) => {
          const hot = d.hot.includes(i);
          return (
            <g key={i} className={`t9-node${hot ? " hot" : ""}`} style={{ ["--d" as string]: `${0.25 + i * 0.18}s` }}>
              {hot && <circle className="t9-node-glow" cx={x} cy={y} r="22" />}
              <circle className="t9-node-dot" cx={x} cy={y} r="11" />
              {hot && <path className="t9-node-check" d={`M${x - 5} ${y}l3.5 3.6 6.5-7`} />}
              <text x={x} y={y + 30} textAnchor="middle">
                {d.nodes[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <span className="t9-dia-label">
        <i />
        {caps(d.label)}
      </span>
    </div>
  );
}

function DiagramBranch() {
  const d = servicesSteps.diagrams.branch;
  const ys = [62, 158];
  return (
    <div className="t9-dia">
      <svg viewBox="0 0 380 220" className="t9-dia-svg" aria-hidden="true">
        <rect className="t9-root" x="14" y="92" width="96" height="36" rx="18" />
        <text className="t9-root-t" x="62" y="115" textAnchor="middle">
          {d.root}
        </text>
        {d.branches.map((b, bi) => (
          <g key={b.title} className="t9-branch" style={{ ["--d" as string]: `${0.2 + bi * 0.35}s` }}>
            <path className="t9-flow" d={`M110 110 C150 110 150 ${ys[bi]} 190 ${ys[bi]}`} />
            <circle className="t9-node-dot t9-b-dot" cx="196" cy={ys[bi]} r="7" />
            <text className="t9-b-title" x="210" y={ys[bi] - 12}>
              {b.title}
            </text>
            {b.items.map((it, ii) => (
              <g key={it} className="t9-leaf" style={{ ["--d" as string]: `${0.6 + bi * 0.35 + ii * 0.2}s` }}>
                <circle className="t9-leaf-dot" cx="216" cy={ys[bi] + 8 + ii * 22} r="7" />
                <path className="t9-node-check" d={`M${212.5} ${ys[bi] + 8 + ii * 22}l2.4 2.4 4.4-4.8`} />
                <text x="230" y={ys[bi] + 12 + ii * 22}>
                  {it}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <span className="t9-dia-label">
        <i />
        {caps(d.label)}
      </span>
    </div>
  );
}

function DiagramCare() {
  const d = servicesSteps.diagrams.care;
  return (
    <div className="t9-dia t9-dia-care">
      <div className="t9-care-head">
        <span className="t9-pulse" />
        <strong>Όλα τρέχουν</strong>
      </div>
      <ul>
        {d.rows.map((r, i) => (
          <li key={r.t} style={{ ["--d" as string]: `${0.2 + i * 0.25}s` }}>
            <span>{r.t}</span>
            <em>{r.s}</em>
          </li>
        ))}
      </ul>
      <span className="t9-dia-label">
        <i />
        {caps(d.label)}
      </span>
    </div>
  );
}

function StepPanel({
  s,
  i,
  on,
  hidden,
  onGo,
}: {
  s: ServiceStep;
  i: number;
  on: boolean;
  hidden: boolean;
  onGo: (to: ServiceStep["button"]["to"]) => void;
}) {
  return (
    <div className={`t9-panel${on ? " on" : ""}`} inert={hidden ? true : undefined} aria-hidden={hidden || undefined}>
      <div className="t9-panel-text">
        <span className="t9-panel-step">
          <b>{i + 1}</b>
          {caps(`${servicesSteps.stepWord} ${i + 1} · ${s.eyebrow}`)}
        </span>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <ul>
          {s.bullets.map((b) => (
            <li key={b}>
              <Check />
              {b}
            </li>
          ))}
        </ul>
        <button type="button" className={`t8-btn${s.button.to === "book" ? "" : " t8-btn-ghost"}`} onClick={() => onGo(s.button.to)}>
          {s.button.label}
          <Arrow />
        </button>
      </div>
      <div className="t9-panel-visual">
        {s.diagram === "map" && <DiagramMap />}
        {s.diagram === "branch" && <DiagramBranch />}
        {s.diagram === "care" && <DiagramCare />}
      </div>
    </div>
  );
}

export function ServicesSteps({ reduced, onGo }: { reduced: boolean; onGo: (to: string) => void }) {
  const desktop = useMedia(DESKTOP);
  const pinned = desktop && !reduced;
  const secRef = useRef<HTMLElement>(null);
  const progress = usePinProgress(secRef, pinned);
  const steps = servicesSteps.steps;
  const n = steps.length;
  const step = pinned ? Math.min(n - 1, Math.floor(progress * n)) : -1;
  const frac = pinned ? Math.min(1, progress * n - step) : 0;
  const fill = pinned ? Math.min(100, ((step + (step < n - 1 ? frac * 0.55 : 1)) / (n - 1)) * 100) : 100;

  const toStep = (i: number) => {
    const el = secRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.15) / n) * span, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      id="services"
      ref={secRef}
      className={`t9-svc${pinned ? " pinned" : ""}`}
      style={pinned ? { height: `${100 + (n - 1) * 85}vh` } : undefined}
      aria-labelledby="svc-title"
    >
      <div className="t9-svc-sticky">
        <div className="t9-svc-head">
          <span className="t8-eyebrow">{caps(servicesSteps.eyebrow)}</span>
          <Title id="svc-title" start={servicesSteps.titleStart} accent={servicesSteps.titleAccent} end={servicesSteps.titleEnd} />
          <p className="t8-muted">{servicesSteps.lead}</p>
        </div>

        {pinned && (
          <div className="t9-bar">
            <div className="t9-bar-line" aria-hidden="true">
              <i style={{ width: `${fill}%` }} />
            </div>
            <ol>
              {steps.map((s, i) => (
                <li key={s.key} className={`${i <= step ? "lit" : ""}${i === step ? " cur" : ""}`}>
                  <button type="button" onClick={() => toStep(i)} aria-current={i === step ? "step" : undefined}>
                    <span className="t9-bar-node">{i < step ? <Check /> : i + 1}</span>
                    <span className="t9-bar-txt">
                      <small>{caps(`${servicesSteps.stepWord} ${i + 1}`)}</small>
                      {s.short}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="t9-panels">
          {steps.map((s, i) => (
            <StepPanel key={s.key} s={s} i={i} on={!pinned || i === step} hidden={pinned && i !== step} onGo={onGo} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Audit form (v8, plural copy)                                        */
/* ------------------------------------------------------------------ */
export function AuditForm({ pain }: { pain: PainId | null }) {
  const [focus, setFocus] = useState<string>(pain ?? "any");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  useEffect(() => {
    if (pain) setFocus(pain);
  }, [pain]);

  const F = auditForm.fields;
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const val = (id: string) => (f.querySelector<HTMLInputElement>(`#${id}`)?.value ?? "").trim();
    const next: Record<string, string> = {};
    if (!val("a-name")) next["a-name"] = auditForm.errorRequired;
    if (!val("a-biz")) next["a-biz"] = auditForm.errorRequired;
    const em = f.querySelector<HTMLInputElement>("#a-email");
    if (!em?.value || !em.checkValidity()) next["a-email"] = auditForm.errorEmail;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      f.querySelector<HTMLInputElement>(`#${first}`)?.focus();
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("done"), 500);
  };

  const field = (
    id: string,
    label: string,
    type: string,
    opts: { required?: boolean; auto?: string; mode?: "tel" | "email" | "url" } = {},
  ) => (
    <div className="t8-field">
      <label htmlFor={id}>
        {label}
        {opts.required ? <span aria-hidden="true"> *</span> : <span className="t8-opt"> ({auditForm.optional})</span>}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={opts.auto}
        inputMode={opts.mode}
        aria-required={opts.required || undefined}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={errors[id] ? `${id}-err` : undefined}
      />
      {errors[id] && (
        <p className="t8-err" id={`${id}-err`}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <form className="t8-form" noValidate onSubmit={onSubmit} aria-labelledby="audit-form-title">
      <h2 id="audit-form-title" className="t8-h3">
        {auditForm.title}
      </h2>
      <p className="t8-muted">{auditForm.lead}</p>
      <div className="t8-grid2">
        {field("a-name", F.name, "text", { required: true, auto: "name" })}
        {field("a-biz", F.biz, "text", { required: true, auto: "organization" })}
        {field("a-email", F.email, "email", { required: true, auto: "email", mode: "email" })}
        {field("a-phone", F.phone, "tel", { auto: "tel", mode: "tel" })}
      </div>
      {field("a-site", F.site, "url", { auto: "url", mode: "url" })}
      <div className="t8-field">
        <label htmlFor="a-focus">{F.focus}</label>
        <select id="a-focus" value={focus} onChange={(e) => setFocus(e.target.value)}>
          {pains.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          <option value="any">{auditForm.focusAny}</option>
        </select>
      </div>
      <div className="t8-field">
        <label htmlFor="a-msg">
          {F.msg} <span className="t8-opt">({auditForm.optional})</span>
        </label>
        <textarea id="a-msg" rows={3} />
      </div>
      <p className="t8-req">{auditForm.required}</p>
      <button className="t8-btn t8-btn-block" type="submit" disabled={state === "sending"}>
        {state === "sending" ? auditForm.sending : auditForm.submit}
        {state !== "sending" && <Arrow />}
      </button>
      <p className="t8-form-note" role="status" aria-live="polite">
        {state === "done" ? auditForm.pending : ""}
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const SERIF_HREF = "https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@1,500;1,600&display=swap";

export function ThynkSiteV9({ handsHero = false }: { handsHero?: boolean } = {}) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pain, setPain] = useState<PainId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState<string | null>(null);

  useReveal(rootRef, pain);

  // serif italic for the accent words (only v9 needs it)
  useEffect(() => {
    if (document.querySelector(`link[href="${SERIF_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = SERIF_HREF;
    document.head.appendChild(l);
  }, []);

  // long page: the app shell locks scrolling for v5, unlock while mounted
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const prev = els.map((e) => e.style.overflow);
    els.forEach((e) => (e.style.overflow = "visible"));
    document.documentElement.style.overflowY = "auto";
    return () => {
      els.forEach((e, i) => (e.style.overflow = prev[i]));
      document.documentElement.style.overflowY = "";
    };
  }, []);

  useEffect(() => {
    const heroEl = document.getElementById("top");
    const form = document.getElementById("book");
    const on = () => {
      setScrolled(window.scrollY > 12);
      const past = heroEl ? heroEl.getBoundingClientRect().bottom < 0 : false;
      const atForm = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setSticky(past && !atForm);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const picked = pains.find((p) => p.id === pain) ?? null;

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };
  const book = () => go("book");

  const copy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(email);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const onStepGo = (to: string) => {
    if (to === "all-services") setOpenPillar((p) => p ?? "marketing");
    go(to);
  };

  const askBlock = (
          <div className="t8-ask">
            <p className="t8-ask-q">
              <strong>{hero.question}</strong> <span>{hero.questionHint}</span>
            </p>
            <div className="t8-chips" role="group" aria-label={hero.question}>
              {pains.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`t8-chip${pain === p.id ? " on" : ""}`}
                  aria-pressed={pain === p.id}
                  onClick={() => setPain(pain === p.id ? null : p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {picked && (
              <div className="t8-reply" role="status">
                <p>{picked.reply}</p>
                <div className="t8-reply-actions">
                  <button type="button" className="t8-link" onClick={book}>
                    {hero.replyAudit} <Arrow />
                  </button>
                  <button type="button" className="t8-link t8-link-muted" onClick={() => go("calculator")}>
                    {hero.replyCalc}
                  </button>
                </div>
              </div>
            )}
          </div>
  );

  return (
    <div className={`t8 t9${handsHero ? " t10" : ""}`} ref={rootRef} lang="el">
      <a className="t8-skip" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>

      <header className={`t8-header${scrolled ? " scrolled" : ""}`}>
        <a
          href="#top"
          className="t8-brand"
          aria-label="Thynk, αρχή σελίδας"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
        >
          <Wordmark />
        </a>
        <nav className={`t8-nav${menuOpen ? " open" : ""}`} aria-label="Κύριο μενού">
          {v9Nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#book"
            className="t8-btn t8-btn-sm t8-nav-cta"
            onClick={(e) => {
              e.preventDefault();
              book();
            }}
          >
            {cta.primary}
          </a>
        </nav>
        <button
          type="button"
          className="t8-burger"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="main">
        {/* ---------- 1. Hero ---------- */}
        {handsHero ? (
          <>
            <HandsHero reduced={reduced} onBook={book} onExamples={() => go("examples")} />
            <section className="t8-section t10-ask-sec">{askBlock}</section>
          </>
        ) : (
        <section className="t8-hero" id="top">
          <div className="t8-blob t8-blob-a" aria-hidden="true" />
          <div className="t8-blob t8-blob-b" aria-hidden="true" />
          <div className="t8-hero-grid">
            <div className="t8-hero-text">
              <span className="t8-eyebrow">{caps(hero.eyebrow)}</span>
              <h1 className="t8-h1">
                {hero.headlineStart}
                <em className="t9-em">{hero.headlineAccent}</em>
                {hero.headlineEnd}
              </h1>
              <p className="t8-sub">{hero.sub}</p>
              <div className="t8-ctas">
                <button type="button" className="t8-btn" onClick={book}>
                  {cta.primary}
                  <Arrow />
                </button>
                <button type="button" className="t8-btn t8-btn-ghost" onClick={() => go("calculator")}>
                  {cta.secondary}
                </button>
              </div>
              <p className="t8-note">{hero.note}</p>
            </div>
            <Muse reduced={reduced} />
          </div>

          {askBlock}
        </section>
        )}

        {/* ---------- 2. Who it's for ---------- */}
        <section className="t8-section t8-who">
          <div className="t8-who-text" data-reveal>
            <h2 className="t8-h2">{forWhom.title}</h2>
            <p className="t8-lead">{forWhom.lead}</p>
          </div>
          <ul className="t8-who-list">
            {forWhom.segments.map((s) => (
              <li key={s.title} data-reveal>
                <h3>{s.title}</h3>
                <p>{s.pain}</p>
              </li>
            ))}
            <li className="t8-who-more" data-reveal>
              <p>{forWhom.more}</p>
            </li>
          </ul>
        </section>

        {/* ---------- 3. Example systems (new) ---------- */}
        <Examples reduced={reduced} />

        {/* ---------- 4. Services as three steps (new) ---------- */}
        <ServicesSteps reduced={reduced} onGo={onStepGo} />

        <div className="t9-thread" aria-hidden="true" />

        {/* ---------- 5. All services + AI rules ---------- */}
        <section className="t8-section t9-all" id="all-services">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps(allServices.eyebrow)}</span>
            <h2 className="t8-h2">{allServices.title}</h2>
            <p className="t8-lead">{allServices.lead}</p>
          </div>
          <div className="t8-acc">
            {allServices.pillars.map((p) => {
              const open = openPillar === p.id;
              const highlighted = picked?.pillar === p.id;
              return (
                <div key={p.id} className={`t8-acc-item${open ? " open" : ""}${highlighted ? " hl" : ""}`} data-reveal>
                  <button
                    type="button"
                    className="t8-acc-head"
                    aria-expanded={open}
                    aria-controls={`pillar-${p.id}`}
                    onClick={() => setOpenPillar(open ? null : p.id)}
                  >
                    <span className="t8-acc-title">
                      <span className="t8-tag">{caps(p.tag)}</span>
                      <strong>{p.title}</strong>
                      <span className="t8-muted">{p.sub}</span>
                    </span>
                    <span className="t8-plus" aria-hidden="true" />
                  </button>
                  {open && (
                    <div className="t8-acc-body" id={`pillar-${p.id}`}>
                      {p.groups.map((g) => (
                        <div key={g.title} className="t8-sub-card">
                          <h4>{g.title}</h4>
                          <ul>
                            {g.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                          </ul>
                          {"note" in g && g.note && <p className="t8-note-s">{g.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="t8-rules" data-reveal>
            <h3>{rules.title}</h3>
            <dl>
              {rules.items.map((r) => (
                <div key={r.title}>
                  <dt>{r.title}</dt>
                  <dd>{r.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 6. The audit in detail ---------- */}
        <section className="t8-section" id="audit">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps(audit.eyebrow)}</span>
            <h2 className="t8-h2">{audit.title}</h2>
            <p className="t8-lead">{audit.lead}</p>
          </div>
          <div className="t8-audit">
            <div className="t8-audit-main">
              <ol className="t8-looks">
                {audit.looks.map((l, i) => (
                  <li key={l.title} data-reveal>
                    <span className="t8-num">{pad(i + 1)}</span>
                    <div>
                      <h3>{l.title}</h3>
                      <p>{l.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="t8-get" data-reveal>
                <h3>{audit.youGet}</h3>
                <p>{audit.youGetText}</p>
              </div>
            </div>
            <figure className="t8-sample" data-reveal aria-label={audit.sample.label}>
              <figcaption>
                <span className="t8-eyebrow">{caps(audit.sample.label)}</span>
                <strong>{audit.sample.business}</strong>
              </figcaption>
              <ul>
                {audit.sample.items.map((it) => (
                  <li
                    key={it.text}
                    className={`t8-sample-${it.tag === "Πρώτο" ? "first" : it.tag === "Μετά" ? "next" : "later"}`}
                  >
                    <span className="t8-sample-tag">{it.tag}</span>
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
              <p className="t8-sample-foot">{audit.sample.foot}</p>
            </figure>
          </div>
          <ol className="t8-flow" aria-label="Πώς γίνεται το audit">
            {audit.steps.map((s) => (
              <li key={s.n} data-reveal>
                <span className="t8-flow-n">{s.n}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="t8-inline-cta" data-reveal>
            <button type="button" className="t8-btn" onClick={book}>
              {cta.primary}
              <Arrow />
            </button>
            <span className="t8-muted">{hero.note}</span>
          </div>
        </section>

        {/* ---------- 7. Calculator ---------- */}
        <section className="t8-section" id="calculator">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps(calculatorCopy.eyebrow)}</span>
            <h2 className="t8-h2">{calculatorCopy.headline}</h2>
            <p className="t8-lead">{calculatorCopy.intro}</p>
          </div>
          <div className="t8-card t8-calc t5 t5-embed" data-reveal>
            <Calculator key={pain ?? "none"} initialTasks={picked?.calc} formal />
          </div>
          <div className="t8-inline-cta" data-reveal>
            <span>{calculatorCopy.cta}</span>
            <button type="button" className="t8-btn" onClick={book}>
              {cta.primary}
              <Arrow />
            </button>
          </div>
        </section>

        {/* ---------- 8. Who we are ---------- */}
        <section className="t8-section" id="team">
          <div className="t8-team">
            <div className="t8-team-intro" data-reveal>
              <span className="t8-eyebrow">{caps(team.eyebrow)}</span>
              <h2 className="t8-h2">{team.title}</h2>
              <p className="t8-lead">{team.lead}</p>
              <p className="t8-where">{team.where}</p>
            </div>
            <div className="t8-people">
              {team.founders.map((f) => (
                <article key={f.name} className="t8-person" data-reveal>
                  <div className="t8-portrait" aria-hidden="true">
                    <span>{f.initials}</span>
                  </div>
                  <div className="t8-person-body">
                    <h3>{f.name}</h3>
                    <p className="t8-role">{f.role}</p>
                    <p>{f.bio}</p>
                    <p className="t8-ask-him">{f.ask}</p>
                    <a className="t8-link" href={`mailto:${f.email}`}>
                      {f.write} <Arrow />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 9. FAQ ---------- */}
        <section className="t8-section t8-narrow" id="faq">
          <div className="t8-head" data-reveal>
            <h2 className="t8-h2">{faq.title}</h2>
          </div>
          <div className="t8-faq">
            {faq.items.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`t8-faq-item${open ? " open" : ""}`} data-reveal>
                  <button type="button" aria-expanded={open} aria-controls={`faq-${i}`} onClick={() => setOpenFaq(open ? null : i)}>
                    {f.q}
                    <span className="t8-plus" aria-hidden="true" />
                  </button>
                  {open && <p id={`faq-${i}`}>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- 10. Book the audit ---------- */}
        <section className="t8-section" id="book">
          <div className="t8-book">
            <div className="t8-book-side">
              <h2>{finalCta.title}</h2>
              <p>{finalCta.text}</p>
              <ol className="t8-book-steps">
                {audit.steps.map((s) => (
                  <li key={s.n}>
                    <span>{s.n}</span>
                    {s.title}
                  </li>
                ))}
              </ol>
              <div className="t8-direct">
                <p>{auditForm.direct}</p>
                <ul>
                  {auditForm.emails.map((c) => (
                    <li key={c.email}>
                      <span>{c.label}</span>
                      <a href={`mailto:${c.email}`}>{c.email}</a>
                      <button type="button" className="t8-copy" onClick={() => copy(c.email)} aria-label={`Αντιγραφή ${c.email}`}>
                        {copied === c.email ? "Αντιγράφηκε" : "Αντιγραφή"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="t8-book-form">
              <AuditForm pain={pain} />
            </div>
          </div>
        </section>
      </main>

      <footer className="t8-footer">
        <Wordmark />
        <span>{footer.line}</span>
        <span className="t8-muted">{footer.small}</span>
      </footer>

      <div className={`t8-sticky${sticky ? " show" : ""}`} aria-hidden={!sticky}>
        <button type="button" className="t8-btn t8-btn-block" onClick={book} tabIndex={sticky ? 0 : -1}>
          {cta.primary}
          <Arrow />
        </button>
      </div>
    </div>
  );
}
