import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { useCopy } from "./i18n";
import { Link } from "@tanstack/react-router";
import {
  v14Routes,
  type ScreenId,
} from "@/content/site-v14";

/* small helpers shared by the v14 pages */
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const ease = (t: number) => t * t * (3 - 2 * t);
export function progress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
}
/** smooth in-page jump (anchors on the same page) */
export function go(e: MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Logo({ size }: { size?: number }) {
  return (
    <span className="t14-logo" style={size ? { fontSize: size } : undefined} aria-label="Thynk">
      THYNK<b>.</b>
    </span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="t14-lbl">{children}</div>;
}

/** page opener: small label, a word that fills the width, the lead on the right */
export function PageHead({ p }: { p: { label: string; title: string; lead: string } }) {
  return (
    <section className="t14-wrap t14-phead">
      <div className="t14-sol-top">
        <p>{p.lead}</p>
      </div>
      <h1 className="t14-giant">{p.title}</h1>
    </section>
  );
}

/** words light up as the paragraph scrolls past (see motion.ts) */
export function Reveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`t14-reveal ${className}`}>
      {text.split(/\s+/).map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

/* ---------- the little UI screens (example systems) ---------- */
export function Screen({ id }: { id: ScreenId }) {
  const { c } = useCopy();
  if (id === "bookings") {
    const d = c.screens.bookings;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.chat.map((m, k) => (
          <div key={k} className={`t14-bub${m.me ? " me" : ""}`}>{m.t}</div>
        ))}
        <div className="t14-row"><b><span className="t14-dot w" />{d.status}</b></div>
        <div className="t14-card-f">{d.foot}</div>
      </div>
    );
  }
  if (id === "followup") {
    const d = c.screens.followup;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.rows.map((r) => (
          <div key={r.t} className="t14-row"><b><span className={`t14-dot${r.s === "wait" ? " w" : ""}`} />{r.t}</b></div>
        ))}
      </div>
    );
  }
  if (id === "report") {
    const d = c.screens.report;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        <div className="t14-bars">
          {d.bars.map((b) => (
            <div key={b.t} className="t14-bar">
              <span>{b.t}</span>
              <s className={b.flag ? "f" : ""} style={{ width: `${b.v}%` }} />
              <span>{b.v}</span>
            </div>
          ))}
        </div>
        <div className="t14-card-f">{d.foot}</div>
      </div>
    );
  }
  if (id === "invoices") {
    const d = c.screens.invoices;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.rows.map((r) => (
          <div key={r.t} className="t14-row">
            <b>{r.flag && <span className="t14-dot f" />}{r.t}</b>
            <span>{r.v}</span>
          </div>
        ))}
      </div>
    );
  }
  const d = c.screens.audit;
  return (
    <div className="t14-card">
      <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
      {d.rows.map((r) => (
        <div key={r.t} className="t14-row">
          <b>{r.t}</b>
          <span className={`t14-tag${r.tone ? " " + r.tone : ""}`}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Method: ghost word + four flying stage cards ---------- */
/** ghost word + four cards that fly in on a diagonal (motion.ts drives `.t14-method`) */
export function FlyCards({
  id,
  title,
  word,
  items,
}: {
  id: string;
  title: string;
  word: string;
  items: readonly { title: string; text: string }[];
}) {
  return (
    <section className="t14-method" id={id} aria-label={title}>
      <div className="t14-method-stage">
        <h2 className="t14-ghost">
          {[...title].map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </h2>
        {items.map((s, i) => (
          <article key={s.title} className="t14-mcard">
            <small>( 0{i + 1} · {word} )</small>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <div className="t14-num"><sup>#.</sup>0{i + 1}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MethodSection({ id = "method" }: { id?: string }) {
  const { c } = useCopy();
  return <FlyCards id={id} title={c.method.title} word={c.method.stepWord} items={c.method.steps} />;
}

/* ---------- list of solutions with a peek card that follows the cursor ---------- */
export function SolutionsList({ withHead = true }: { withHead?: boolean }) {
  const { c } = useCopy();
  const [peek, setPeek] = useState<ScreenId | null>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = peekRef.current;
      if (!p) return;
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <>
      {withHead && (
        <>
          <Label>{c.solutions.label}</Label>
          <div className="t14-sol-top"><p>{c.solutions.lead}</p></div>
          <h2 className="t14-giant">{c.solutions.title}</h2>
        </>
      )}
      <ul className="t14-list t14-seq t14-sol-d">
        {c.solutions.items.map((it) => (
          <li
            key={it.name}
            onPointerEnter={(e) => it.screen && e.pointerType === "mouse" && setPeek(it.screen)}
            onPointerLeave={() => setPeek(null)}
          >
            <span className="n">{it.name}</span>
            <span className="t">{it.tags}</span>
            <span className="y">{it.pillar}</span>
          </li>
        ))}
      </ul>
      {/* phones: the same solutions grouped under their two services, names only (Mike 02/10) */}
      <div className="t14-sol-m">
        {["Marketing", "Digital Transformation"].map((pl) => {
          const list = c.solutions.items.filter((it) => it.pillar === pl);
          return (
            <div key={pl} className="t14-sol-g">
              <h3>
                {pl} <span>{String(list.length).padStart(2, "0")}</span>
              </h3>
              <ul className="t14-seq">
                {list.map((it) => (
                  <li key={it.name}>{it.name}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="t14-sol-note">{c.solutions.note}</p>
      <div className={`t14-peek${peek ? " on" : ""}`} ref={peekRef} aria-hidden="true">
        {peek && <Screen id={peek} />}
      </div>
    </>
  );
}

/* ---------- the audit: horizontal panels over the title ---------- */
/** a title the cards slide over horizontally (motion.ts drives `.t14-hz`) */
export function HzPanels({
  id,
  label,
  titleStart,
  titleAccent,
  panels,
}: {
  id: string;
  label: string;
  titleStart: string;
  titleAccent: string;
  panels: readonly { kicker: string; sub?: string; title: string; text: string; key?: boolean }[];
}) {
  return (
    <section className="t14-hz" id={id} aria-label={label}>
      <div className="t14-hz-stage">
        <h2 className="t14-hz-title">
          {titleStart}<em>{titleAccent}</em>
        </h2>
        <div className="t14-hz-track">
          <div className="t14-spacer" aria-hidden="true" />
          {panels.map((p) => {
            const n = /^\d+/.exec(p.kicker)?.[0];
            return (
              <article key={p.title} className={`t14-panel${p.key ? " key" : ""}`}>
                <small>{p.kicker}{p.sub && <i>{p.sub}</i>}</small>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
                <div className="t14-num"><sup>#.</sup>{n ?? "AI"}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AuditPanels({ id = "audit" }: { id?: string }) {
  const { c } = useCopy();
  return (
    <HzPanels
      id={id}
      label={c.ui.auditAria}
      titleStart={c.audit.titleStart}
      titleAccent={c.audit.titleAccent}
      panels={c.audit.panels.map((p) => ({ ...p, key: p.tone === "orange" }))}
    />
  );
}

/* ---------- FAQ (accordion) ---------- */
export function Faq({
  title,
  grey,
  note,
  items,
  id = "faq",
}: {
  title: string;
  grey?: string;
  note?: string;
  items: readonly { q: string; a: string }[];
  id?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="t14-faq t14-wrap" id={id}>
      <div className="t14-faq-side">
        <h2>
          {title}
          {grey && (
            <>
              <br />
              <span>{grey}</span>
            </>
          )}
        </h2>
        {note && <p>{note}</p>}
      </div>
      <div>
        {items.map((q, i) => (
          <div key={q.q} className={`t14-qa${open === i ? " open" : ""}`}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              {q.q}
              <i />
            </button>
            <div className="t14-a">
              <div>
                <p>{q.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- audit request form (front-end only until the back-end exists) ---------- */
type BookKey = "first" | "last" | "email" | "phone" | "biz";

export function BookForm({ idPrefix = "t14" }: { idPrefix?: string }) {
  const { c } = useCopy();
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", biz: "", industry: "", pain: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.first.trim()) errs.first = c.book.first.error;
    if (!form.last.trim()) errs.last = c.book.last.error;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = c.book.email.error;
    if (form.phone.replace(/\D/g, "").length < 10) errs.phone = c.book.phone.error;
    if (!form.biz.trim()) errs.biz = c.book.biz.error;
    if (!form.industry) errs.industry = c.book.industry.error;
    if (!form.pain) errs.pain = c.book.pain.error;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first === "pain" ? `${idPrefix}-pain-0` : `${idPrefix}-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  const field = (k: BookKey, type: string, auto: string, optional = false) => {
    const f = c.book[k];
    return (
      <div className="t14-f">
        <label htmlFor={`${idPrefix}-${k}`}>
          {f.label}
          {optional && <em className="t14-opt"> · {c.book.optional}</em>}
        </label>
        <input
          id={`${idPrefix}-${k}`}
          type={type}
          autoComplete={auto}
          placeholder={f.placeholder}
          value={form[k]}
          aria-invalid={!!errors[k]}
          aria-describedby={`${idPrefix}-${k}-e`}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
        <span className="t14-err" id={`${idPrefix}-${k}-e`}>{errors[k] ?? ""}</span>
      </div>
    );
  };

  return (
    <form className="t14-form" onSubmit={submit} noValidate>
      <div className="t14-form-head">
        <h2>{c.book.title}</h2>
        <p>{c.book.lead}</p>
      </div>
      <div className="t14-fgrid">
        {field("first", "text", "given-name")}
        {field("last", "text", "family-name")}
        {field("email", "email", "email")}
        {field("phone", "tel", "tel")}
        {field("biz", "text", "organization")}
        <div className="t14-f">
          <label htmlFor={`${idPrefix}-industry`}>
            {c.book.industry.label}
          </label>
          <select
            id={`${idPrefix}-industry`}
            value={form.industry}
            aria-invalid={!!errors.industry}
            aria-describedby={`${idPrefix}-industry-e`}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          >
            <option value="">{c.book.industry.placeholder}</option>
            {c.book.industry.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="t14-err" id={`${idPrefix}-industry-e`}>{errors.industry ?? ""}</span>
        </div>
        <div className="t14-f t14-f-wide">
          <span className="t14-flabel" id={`${idPrefix}-pain-l`}>{c.book.pain.label}</span>
          <div className="t14-tasks t14-pains" role="radiogroup" aria-labelledby={`${idPrefix}-pain-l`}>
            {c.book.pain.options.map((o, i) => (
              <label key={o} className={form.pain === o ? "on" : undefined}>
                <input id={`${idPrefix}-pain-${i}`} type="radio" name={`${idPrefix}-pain`} value={o} checked={form.pain === o} aria-invalid={!!errors.pain} onChange={() => setForm({ ...form, pain: o })} />
                {o}
              </label>
            ))}
          </div>
          <span className="t14-err" role="alert">{errors.pain ?? ""}</span>
        </div>
      </div>
      <div className="t14-form-foot">
        <button className="t14-pill lg" type="submit">{c.book.submit}</button>
        {sent && <div className="t14-ok" role="status">{c.book.sent}</div>}
      </div>
    </form>
  );
}

/** a quiet closing line with the audit button, at the end of the inner pages */
export function FinalBand() {
  const { c, href } = useCopy();
  return (
    <section className="t14-final t14-wrap">
      <h2>{c.final.title}</h2>
      <Link to={href(v14Routes.audit)} hash="book" className="t14-pill lg">
        {c.final.button}
      </Link>
    </section>
  );
}

/** "→" link under a home section, to the page that covers it in full */
export function MoreLink({ to, children }: { to: (typeof v14Routes)[keyof typeof v14Routes]; children: ReactNode }) {
  const { href } = useCopy();
  return (
    <div className="t14-more">
      <Link to={href(to)}>{children}</Link>
    </div>
  );
}
