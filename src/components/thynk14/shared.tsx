import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  v14Audit,
  v14Book,
  v14Final,
  v14Method,
  v14Routes,
  v14Screens,
  v14Solutions,
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
  if (id === "bookings") {
    const d = v14Screens.bookings;
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
    const d = v14Screens.followup;
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
    const d = v14Screens.report;
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
    const d = v14Screens.invoices;
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
  const d = v14Screens.audit;
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
export function MethodSection({ id = "method" }: { id?: string }) {
  return (
    <section className="t14-method" id={id} aria-label={v14Method.title}>
      <div className="t14-method-stage">
        <h2 className="t14-ghost">
          {[...v14Method.title].map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h2>
        {v14Method.steps.map((s, i) => (
          <article key={s.title} className="t14-mcard">
            <small>( 0{i + 1} · {v14Method.stepWord} )</small>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <div className="t14-num"><sup>#.</sup>0{i + 1}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- list of solutions with a peek card that follows the cursor ---------- */
export function SolutionsList({ withHead = true }: { withHead?: boolean }) {
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
          <Label>{v14Solutions.label}</Label>
          <div className="t14-sol-top"><p>{v14Solutions.lead}</p></div>
          <h2 className="t14-giant">{v14Solutions.title}</h2>
        </>
      )}
      <ul className="t14-list">
        {v14Solutions.items.map((it) => (
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
      <p className="t14-sol-note">{v14Solutions.note}</p>
      <div className={`t14-peek${peek ? " on" : ""}`} ref={peekRef} aria-hidden="true">
        {peek && <Screen id={peek} />}
      </div>
    </>
  );
}

/* ---------- the audit: horizontal panels over the title ---------- */
export function AuditPanels({ id = "audit" }: { id?: string }) {
  return (
    <section className="t14-hz" id={id} aria-label="The audit">
      <div className="t14-hz-stage">
        <h2 className="t14-hz-title">
          {v14Audit.titleStart}<em>{v14Audit.titleAccent}</em>
        </h2>
        <div className="t14-hz-track">
          <div className="t14-spacer" aria-hidden="true" />
          {v14Audit.panels.map((p) => (
            <article key={p.title} className={`t14-panel ${p.tone}`}>
              <small>{p.kicker}<i>{p.sub}</i></small>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
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
export function BookForm({ idPrefix = "t14" }: { idPrefix?: string }) {
  const [form, setForm] = useState({ name: "", biz: "", email: "", pain: v14Book.pain.options[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = v14Book.name.error;
    if (!form.biz.trim()) errs.biz = v14Book.biz.error;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = v14Book.email.error;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${idPrefix}-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  const field = (k: "name" | "biz" | "email", type: string, auto: string) => {
    const c = v14Book[k];
    return (
      <div className="t14-f">
        <label htmlFor={`${idPrefix}-${k}`}>{c.label}</label>
        <input
          id={`${idPrefix}-${k}`}
          type={type}
          autoComplete={auto}
          placeholder={c.placeholder}
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
      <h2>{v14Book.title}</h2>
      <p>{v14Book.lead}</p>
      <div className="t14-fgrid">
        {field("name", "text", "name")}
        {field("biz", "text", "organization")}
      </div>
      {field("email", "email", "email")}
      <div className="t14-f">
        <label htmlFor={`${idPrefix}-pain`}>{v14Book.pain.label}</label>
        <select id={`${idPrefix}-pain`} value={form.pain} onChange={(e) => setForm({ ...form, pain: e.target.value })}>
          {v14Book.pain.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <button className="t14-pill lg" type="submit">{v14Book.submit}</button>
      {sent && <div className="t14-ok" role="status">{v14Book.sent}</div>}
    </form>
  );
}

/** a quiet closing line with the audit button, at the end of the inner pages */
export function FinalBand() {
  return (
    <section className="t14-final t14-wrap">
      <h2>{v14Final.title}</h2>
      <Link to={v14Routes.audit} hash="book" className="t14-pill lg">
        {v14Final.button}
      </Link>
    </section>
  );
}

/** "→" link under a home section, to the page that covers it in full */
export function MoreLink({ to, children }: { to: (typeof v14Routes)[keyof typeof v14Routes]; children: ReactNode }) {
  return (
    <div className="t14-more">
      <Link to={to}>{children}</Link>
    </div>
  );
}
