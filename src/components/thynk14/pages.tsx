import { useMemo, useState, type FormEvent } from "react";
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

      <section className="t14-about t14-wrap" id="about">
        <Label>{c.about.label}</Label>
        <Reveal text={c.about.text} />
        <div className="t14-team-line">
          <h3>{c.about.founders}</h3>
          <p>{c.about.foundersNote}</p>
        </div>
      </section>

      <MethodSection />
      <div className="t14-wrap"><MoreLink to={href(v14Routes.services)}>{c.more.method}</MoreLink></div>

      <section className="t14-wrap" id="solutions">
        <SolutionsList />
        <MoreLink to={href(v14Routes.solutions)}>{c.more.solutions}</MoreLink>
      </section>

      <AuditPanels />
      <div className="t14-wrap"><MoreLink to={href(v14Routes.audit)}>{c.more.audit}</MoreLink></div>

      <section className="t14-team t14-wrap" id="team">
        <Label>{c.team.label}</Label>
        <ul className="t14-list">
          {c.team.people.map((p) => (
            <li key={p.name}>
              <span className="n">{p.name}<small>{p.role}</small></span>
              <span className="t">{p.focus}</span>
              <span className="y"><a href={`mailto:${p.email}`}>{p.email}</a></span>
            </li>
          ))}
        </ul>
        <MoreLink to={href(v14Routes.about)}>{c.more.team}</MoreLink>
      </section>

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
                <span>0{i + 1}</span> {ex.tag} · {c.examples.label}
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

function Calculator() {
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
      <form className="t14-calc-form" onSubmit={(e: FormEvent) => e.preventDefault()}>
        <div className="t14-f">
          <label htmlFor="calc-ind">{c.calc.industry}</label>
          <select id="calc-ind" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {c.calc.industries.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
        </div>
        <Range id="calc-team" label={c.calc.team} value={team} min={1} max={40} display={String(team)} onChange={setTeam} />
        <Range id="calc-hours" label={c.calc.hours} value={hours} min={1} max={25} display={String(hours)} onChange={setHours} />
        <Range id="calc-rate" label={c.calc.rate} value={rate} min={5} max={40} display={`€${rate}`} onChange={setRate} />
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
          <p>{s.sample.foot}</p>
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

      <section className="t14-wrap" id="calculator">
        <Label>{c.calc.label}</Label>
        <h2 className="t14-h2">{c.calc.title}</h2>
        <p className="t14-lead">{c.calc.lead}</p>
        <Calculator />
        <p className="t14-sol-note">{c.calc.note}</p>
      </section>

      <Faq title={s.faqTitle} items={s.faq} id="audit-faq" />

      <section className="t14-book t14-book-split t14-wrap" id="book">
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
      <section className="t14-wrap">
        <ul className="t14-list t14-founders">
          {a.founders.map((f) => (
            <li key={f.name}>
              <span className="t14-initials" aria-hidden="true">{f.initials}</span>
              <div className="t14-founder">
                <h2>{f.name}</h2>
                <small>{f.role}</small>
                <p>{f.bio}</p>
                <p className="t14-ask">{f.ask}</p>
              </div>
              <span className="y"><a href={`mailto:${f.email}`}>{f.email}</a></span>
            </li>
          ))}
        </ul>
        <p className="t14-sol-note">{a.where}</p>
      </section>

      <section className="t14-wrap">
        <Label>{a.valuesTitle}</Label>
        <ol className="t14-values">
          {a.values.map((v, i) => (
            <li key={v.t}>
              <span className="t14-num"><sup>#.</sup>0{i + 1}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="t14-wrap t14-rules-sec">
        <Label>{a.rulesTitle}</Label>
        <div className="t14-rules">
          {a.rules.map((r, i) => (
            <article key={r.title} className={`t14-panel ${i === 1 ? "orange" : i === 0 ? "ink" : "paper"}`}>
              <small>0{i + 1}</small>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </section>
      <FinalBand />
    </>
  );
}
