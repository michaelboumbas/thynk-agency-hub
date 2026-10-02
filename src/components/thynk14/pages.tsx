import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useCopy } from "./i18n";
import { Link } from "@tanstack/react-router";
import { calculator as C } from "@/content/site-v5";
import {
  en,
  v14Routes,
} from "@/content/site-v14";
import {
  AuditPanels,
  BookForm,
  FlyCards,
  HzPanels,
  Faq,
  FinalBand,
  Label,
  MethodSection,
  MoreLink,
  PageHead,
  Reveal,
  Screen,
  SolutionsList,
  go,
} from "./shared";

/* ================================ Home ================================ */
export function HomePage() {
  const { c, href } = useCopy();
  return (
    <>
      <section className="t14-hero" aria-label="Thynk">
        <div className="t14-hero-c">
          <h1>
            <span className="t14-h1-a">{c.hero.lead}</span>
            <strong className="t14-h1-b"><em>{c.hero.accent}</em>{c.hero.last}</strong>
          </h1>
          <p className="t14-formula">
            <b>{c.hero.formulaStrong}</b>
            <span>{c.hero.formula}</span>
          </p>
          <div className="t14-ctas">
            <Link className="t14-pill lg" to={href(v14Routes.audit)} hash="book">{c.hero.primary}</Link>
            <a className="t14-pill lg ghost" href="#method" onClick={(e) => go(e, "method")}>{c.hero.secondary}</a>
          </div>
        </div>
      </section>

      <section className="t14-about t14-about-c t14-wrap" id="about">
        <Label>{c.about.label}</Label>
        <Reveal text={c.about.text} />
      </section>

      <MethodSection />
      <div className="t14-wrap"><MoreLink to={href(v14Routes.services)}>{c.more.method}</MoreLink></div>

      <section className="t14-wrap" id="solutions">
        <SolutionsList />
        <MoreLink to={href(v14Routes.solutions)}>{c.more.solutions}</MoreLink>
      </section>

      <AuditPanels />
      <div className="t14-wrap"><MoreLink to={href(v14Routes.audit)}>{c.more.audit}</MoreLink></div>

      {/* 02/10 (Mike): the cost calculator on the home page too, right before the form: see the cost, then book */}
      <CalcSection className="t14-calc-sec" />

      <section className="t14-book t14-wrap" id="book">
        <BookForm idPrefix="home" />
      </section>

      <Faq title={c.faq.title} grey={c.faq.titleGrey} note={c.faq.note} items={c.faq.items} />
    </>
  );
}

/* ================================ Services ================================ */
export function ServicesPage() {
  const { c } = useCopy();
  return (
    <>
      <PageHead p={c.pageHeads.services} />
      {c.pillars.items.map((pl, k) => (
        <section key={pl.id} className="t14-pillar t14-wrap" id={pl.id}>
          <div className="t14-pillar-head">
            <span className="t14-pillar-n"><sup>#.</sup>0{k + 1}</span>
            <div>
              <small>{pl.tag}</small>
              <h2>{pl.title}</h2>
              <p>{pl.sub}</p>
            </div>
          </div>
          <ul className="t14-list t14-groups">
            {pl.groups.map((g) => (
              <li key={g.title}>
                <span className="n">{g.title}</span>
                <ul className="t14-items">
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {pl.id === "transformation" && <p className="t14-sol-note">{c.pillars.note}</p>}
        </section>
      ))}
      <MethodSection />
      <FinalBand />
    </>
  );
}

/* ================================ Solutions ================================ */
export function SolutionsPage() {
  const { c, href } = useCopy();
  return (
    <>
      <PageHead p={c.pageHeads.solutions} />
      <section className="t14-wrap t14-examples">
        {c.examples.items.map((ex, i) => (
          <article key={ex.id} className={`t14-example${i % 2 ? " flip" : ""}`}>
            <div className="t14-example-text">
              <small>
                <span>0{i + 1}</span> {ex.tag}{c.examples.label && <> · {c.examples.label}</>}
              </small>
              <h2>{ex.title}</h2>
              <p>{ex.text}</p>
              <p className="t14-punch">{ex.punch}</p>
            </div>
            <div className="t14-example-screen">
              <Screen id={ex.id} />
            </div>
          </article>
        ))}
      </section>
      <section className="t14-wrap">
        <Label>{c.moreIdeas.title}</Label>
        <p className="t14-lead">{c.moreIdeas.lead}</p>
        <div className="t14-ideas">
          {c.moreIdeas.groups.map((g) => (
            <div key={g.tag}>
              <h3>{g.tag}</h3>
              <ul className="t14-list">
                {g.items.map((it) => (
                  <li key={it.t}>
                    <span className="n">{it.t}</span>
                    <span className="t">{it.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <MoreLink to={href(v14Routes.services)}>{c.more.method}</MoreLink>
      </section>
      <FinalBand />
    </>
  );
}

/* ================================ Audit ================================ */
type TaskId = keyof typeof en.calc.tasks;
const TASK_IDS = Object.keys(en.calc.tasks) as TaskId[]; // same keys in both languages
// savings shown as a range (25–40% of the hours on the picked tasks), decision Mike 01/10/2026,
// until Dimitris validates per-task shares. Weights per industry come from the v5 calculator.
const RANGE = [0.25, 0.4] as const;


function Range({ id, label, value, min, max, display, onChange }: {
  id: string; label: string; value: number; min: number; max: number; display: string; onChange: (v: number) => void;
}) {
  return (
    <div className="t14-f t14-range">
      <label htmlFor={id}>{label} <output>{display}</output></label>
      <input type="range" id={id} min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function Calculator({ pre = "calc", sheet = false }: { pre?: string; sheet?: boolean }) {
  const { c } = useCopy();
  const [industry, setIndustry] = useState("hosp");
  const [team, setTeam] = useState(6);
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(9);
  const [tasks, setTasks] = useState<TaskId[]>(["phone", "msg", "social"]);

  const r = useMemo(() => {
    const picked = tasks.length ? tasks : TASK_IDS;
    const monthHours = team * hours * C.weeksPerMonth;
    const w = C.weights[industry] ?? {};
    const ranked = picked
      .map((k) => ({ k, score: C.tasks[k].share * (w[k] ?? 1) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    const tot = ranked.reduce((s, o) => s + o.score, 0) || 1;
    const lo = monthHours * RANGE[0];
    const hi = monthHours * RANGE[1];
    return {
      monthHours,
      lo,
      hi,
      yearCost: monthHours * 12 * rate,
      opps: ranked.map((o) => ({ label: c.calc.tasks[o.k].opp, lo: (lo * o.score) / tot, hi: (hi * o.score) / tot })),
    };
  }, [industry, team, hours, rate, tasks]);

  const fmt = (n: number) => Math.round(n).toLocaleString(c.locale);
  const toggle = (k: TaskId) => setTasks((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));

  return (
    <div className="t14-calc">
      {sheet && (
        <div className="t14-calc-sticky" aria-hidden="true">
          <small>{c.calc.yearLabel}</small>
          <b>€{fmt(r.yearCost)}</b> <span>{c.calc.perYear}</span>
        </div>
      )}
      <form className="t14-calc-form" onSubmit={(e: FormEvent) => e.preventDefault()}>
        <div className="t14-f">
          <label htmlFor={`${pre}-ind`}>{c.calc.industry}</label>
          <select id={`${pre}-ind`} value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {c.calc.industries.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
        </div>
        <Range id={`${pre}-team`} label={c.calc.team} value={team} min={1} max={40} display={String(team)} onChange={setTeam} />
        <Range id={`${pre}-hours`} label={c.calc.hours} value={hours} min={1} max={25} display={String(hours)} onChange={setHours} />
        <Range id={`${pre}-rate`} label={c.calc.rate} value={rate} min={5} max={40} display={`€${rate}`} onChange={setRate} />
        <fieldset className="t14-tasks">
          <legend>{c.calc.where}</legend>
          {TASK_IDS.map((k) => (
            <label key={k} className={tasks.includes(k) ? "on" : undefined}>
              <input type="checkbox" checked={tasks.includes(k)} onChange={() => toggle(k)} />
              {c.calc.tasks[k].label}
            </label>
          ))}
        </fieldset>
      </form>
      <aside className="t14-calc-out" aria-live="polite">
        <small>{c.calc.yearLabel}</small>
        <div className="t14-calc-big">€{fmt(r.yearCost)} <span>{c.calc.perYear}</span></div>
        <div className="t14-calc-kpis">
          <div><b>{fmt(r.monthHours)}</b><span>{c.calc.monthHours}</span></div>
          <div><b>{fmt(r.lo)}–{fmt(r.hi)}</b><span>{c.calc.autoHours}</span></div>
        </div>
        <small>{c.calc.start}</small>
        <ol className="t14-calc-opps">
          {r.opps.map((o) => (
            <li key={o.label}>
              <span>{o.label}</span>
              <span>{fmt(o.lo)}–{fmt(o.hi)} {c.calc.hoursShort}</span>
            </li>
          ))}
        </ol>
        <p className="t14-calc-how">{c.calc.how(team, hours, rate)}</p>
      </aside>
    </div>
  );
}

/** the calculator section: inline on desktop; on phones a short teaser that opens it as a bottom sheet */
function CalcSection({ className }: { className?: string }) {
  const { c } = useCopy();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      openRef.current?.focus();
    };
  }, [open]);
  const toBook = () => {
    setOpen(false);
    requestAnimationFrame(() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }));
  };
  return (
    <section className={`t14-wrap${className ? " " + className : ""}`} id="calculator">
      <Label>{c.calc.label}</Label>
      <h2 className="t14-h2">{c.calc.title}</h2>
      <p className="t14-lead">{c.calc.lead}</p>
      <div className="t14-calc-inline">
        <Calculator />
        <p className="t14-sol-note">{c.calc.note}</p>
      </div>
      <button ref={openRef} type="button" className="t14-pill lg t14-calc-open" onClick={() => setOpen(true)} aria-haspopup="dialog">
        {c.calc.open}
      </button>
      {open && (
        <div className="t14-sheet-back" onClick={() => setOpen(false)}>
          <div className="t14-sheet" role="dialog" aria-modal="true" aria-label={c.calc.title} onClick={(e) => e.stopPropagation()}>
            <div className="t14-sheet-head">
              <b>{c.calc.title}</b>
              <button ref={closeRef} type="button" className="t14-sheet-x" onClick={() => setOpen(false)} aria-label={c.calc.close}>×</button>
            </div>
            <Calculator pre="calc-m" sheet />
            <p className="t14-sol-note">{c.calc.note}</p>
            <button type="button" className="t14-pill lg t14-sheet-cta" onClick={toBook}>{c.calc.cta}</button>
          </div>
        </div>
      )}
    </section>
  );
}

export function AuditPage() {
  const { c } = useCopy();
  const s = c.auditPage;
  return (
    <>
      <PageHead p={c.pageHeads.audit} />
      <AuditPanels id="looks" />

      <section className="t14-wrap t14-sample-sec">
        <figure className="t14-sample">
          <figcaption>
            <small>{s.sample.label}</small>
            <strong>{s.sample.business}</strong>
          </figcaption>
          <ul>
            {s.sample.items.map((it) => (
              <li key={it.text}>
                <span className={`t14-tag${it.tone ? " " + it.tone : ""}`}>{it.tag}</span>
                <span>{it.text}</span>
              </li>
            ))}
          </ul>
          {s.sample.foot && <p>{s.sample.foot}</p>}
        </figure>
        <div className="t14-flow">
          <Label>{s.stepsTitle}</Label>
          <ol>
            {s.steps.map((st, i) => (
              <li key={st.title}>
                <span className="t14-num"><sup>#.</sup>0{i + 1}</span>
                <div>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CalcSection />

      <Faq title={s.faqTitle} items={s.faq} id="audit-faq" />

      <section className="t14-book t14-book-stack t14-wrap" id="book">
        <div className="t14-book-side">
          <h2>{s.bookSide.title}</h2>
          <p>{s.bookSide.text}</p>
          <ol>
            {s.steps.map((st, i) => (
              <li key={st.title}><span>0{i + 1}</span>{st.title}</li>
            ))}
          </ol>
          <p className="t14-book-mail">
            {s.bookSide.mail} <a href="mailto:hello@thynkagency.gr">hello@thynkagency.gr</a>
          </p>
        </div>
        <BookForm idPrefix="audit" />
      </section>
    </>
  );
}

/* ================================ About ================================ */
export function AboutPage() {
  const { c } = useCopy();
  const a = c.aboutPage;
  return (
    <>
      <PageHead p={c.pageHeads.about} />

      {/* founders: names and LinkedIn only (Mike 02/10) */}
      <section className="t14-wrap">
        <ul className="t14-list t14-founders">
          {a.founders.map((f) => (
            <li key={f.name}>
              <h2 className="t14-founder-name">{f.name}</h2>
              <a className="t14-in" href={f.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${f.name} ${a.linkedinAria}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
                <span>{a.linkedinLabel}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* how we work: the same fly-in cards as Method */}
      <FlyCards id="principles" title={a.valuesTitle} word={a.valueWord} items={a.values.map((v) => ({ title: v.t, text: v.d }))} />

      {/* how we use AI: cards sliding over the title, like the audit */}
      <HzPanels
        id="ai"
        label={a.rulesKicker}
        titleStart={a.rulesStart}
        titleAccent={a.rulesAccent}
        panels={a.rules.map((r, i) => ({ kicker: `0${i + 1} · ${a.rulesKicker}`, title: r.title, text: r.text, key: i === 1 }))}
      />
      <FinalBand />
    </>
  );
}
