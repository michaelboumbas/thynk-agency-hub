import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { useCopy } from "./i18n";
import { Link } from "@tanstack/react-router";
import {
  v14Routes,
  type ScreenId,
} from "@/content/site-v14";
import { submitAuditRequest } from "@/lib/audit-leads";

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

/** The THYNK wordmark, traced from the original logo (logo 1.2, 4000 px) for the 2026 brand. viewBox 0 0 3436 682. */
const WORDMARK_LETTERS =
  "M100.8,679.1L97.5,676.2 97.2,468.1L97,260 53.5,260C4.7,260 4.1,259.9 1.5,253.6C0.2,250.6 0,233.1 0,129.5C0,0.4 -0.1,3.7 4.8,1.1C6.3,0.3 79.9,0 257.5,0L508.2,0 511.1,2.9L514,5.8 514,129.4L514,253 511.1,256.2L508.2,259.5 462.6,259.8L417,260.1 416.8,468.6L416.5,677.2 413.7,679.6L410.9,682 257.5,682L104,682 100.8,679.1Z M534.8,679.1L531.5,676.2 531.2,345.8C531,164.1 531.2,13.2 531.5,10.3C532,6.6 532.9,4.4 534.7,2.6L537.3,0 691.7,0L846.2,0 849.1,2.9L852,5.8 852,128.9L852,252 859.5,252L867,252 867,131.2C867,52.8 867.4,9.2 868,6.9C868.6,4.8 870.1,2.5 871.5,1.6L873.9,0 1028,0L1182.2,0 1185.1,2.9L1188,5.8 1188,341L1188,676.2 1185.1,679.1L1182.2,682 1028.1,682L874,682 870.8,679.1L867.5,676.2 867.2,558.1L867,440 859.5,440L852,440 852,558.1L852,676.2 849.1,679.1L846.2,682 692.1,682L538,682 534.8,679.1Z M1379.1,680.6C1374,677.8 1374.1,679.4 1374,605.5L1373.9,536.5 1289.9,435.2L1206,334 1206,169.8L1206,5.6 1208.7,2.8L1211.4,-0 1366,-0L1520.6,-0 1523.6,3.1L1526.5,6.1 1526.8,129.2L1527,252.2 1530.2,256.6C1531.9,259 1533.6,261 1534,261C1534.4,261 1536.3,258.6 1538.3,255.7L1542,250.4 1542,127.8L1542,5.3 1544.6,2.6L1547.3,0 1701.9,0L1856.6,0 1859.3,2.8L1862,5.6 1862,169.8L1862,334.1 1778,435.5L1694,536.9 1694,605.5C1694,679 1694,678.3 1689.1,681C1687.8,681.7 1637.3,682 1534.3,682C1409.4,681.9 1381.1,681.7 1379.1,680.6Z M1882.9,679.1L1880,676.2 1880,341L1880,5.8 1882.9,2.9L1885.8,0 2020,0L2154.2,0 2157,1.6C2158.5,2.5 2160.6,4.7 2161.6,6.4C2162.6,8.1 2191.2,61 2225.1,124L2286.9,238.5 2293.4,238.8C2297,239 2300,238.9 2300,238.7C2300,238.5 2285.4,208.6 2267.5,172.4L2235,106.5 2235,56.3L2235,6.2 2237.6,3.1L2240.2,0 2384.1,0L2528,0 2531.2,2.9L2534.5,5.8 2534.8,335.7C2535,517.1 2534.8,667.9 2534.5,670.9C2534,675 2533.1,677 2531,679.2L2528.2,682 2393.1,682L2258,682 2254.6,678.8C2252.2,676.5 2231.5,638.9 2188,557.8C2153.2,493.1 2124.3,439.4 2123.6,438.5C2122.7,437.3 2121.1,437 2116.9,437.2L2111.4,437.5 2144.7,506L2177.9,574.5 2177.9,625.3L2178,676.2 2175.1,679.1L2172.2,682 2029,682L1885.8,682 1882.9,679.1Z M2554.9,679.1L2552,676.2 2552,341L2552,5.8 2554.9,2.9L2557.8,0 2711.3,0L2864.8,0 2867.4,3.1L2870,6.2 2870,129.3L2870.1,252.5 2878.5,243.7L2887,234.9 2887,120.1L2887,5.3 2889.6,2.6L2892.3,0 3045.7,0L3199.2,0 3202.1,2.9L3205,5.8 3205,142.7L3205,279.5 3167.9,311.9L3130.8,344.3 3167.9,380.7L3205,417.2 3205,546.7L3205,676.2 3202.1,679.1L3199.2,682 3046,682L2892.8,682 2889.9,679.1L2887,676.2 2887,566.8L2886.9,457.5 2878.5,448.5L2870.1,439.5 2870,557.8L2870,676.2 2867.1,679.1L2864.2,682 2711,682L2557.8,682 2554.9,679.1Z";

/**
 * The logo (2026 brand, 23/10): the real wordmark in ink, with the square dot in lake as its own <b>, so the
 * home intro can land on it (intro.tsx measures the <b>). The size is the font size (22px in the header).
 */
export function Logo({ size }: { size?: number }) {
  return (
    <span className="t14-logo" style={size ? { fontSize: size } : undefined} role="img" aria-label="Thynk">
      <svg viewBox="0 0 3436 682" aria-hidden="true" focusable="false">
        <path d={WORDMARK_LETTERS} fill="currentColor" />
      </svg>
      <b aria-hidden="true" />
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

/* ---------- audit request form ----------
 * 12/10/2026: connected. Each request is saved in our database and sent to HubSpot (see src/lib/audit-leads.ts).
 * GDPR: a required consent checkbox, linked to /privacy; the sentence is stored with the request.
 * Spam: a hidden field people never see (bots fill it in) and a minimum time on the form; both get a quiet
 * «thank you» and nothing is sent. The database also limits repeated requests. */
/** the footer's «what should we look at first» choice travels to the form (Mike 10/10):
 *  another page → sessionStorage, read when the form mounts · the audit page itself → a window event */
export const PAIN_KEY = "t14-pain";
export const PAIN_EVENT = "t14:pain";

type BookKey = "first" | "last" | "email" | "phone" | "biz";

/** industry: a landing page can start the form with its sector chosen (/irha → hotels, 21/10); must be one of c.book.industry.options */
export function BookForm({ idPrefix = "t14", industry = "" }: { idPrefix?: string; industry?: string }) {
  const { c, lang, href } = useCopy();
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", biz: "", industry, pain: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trap, setTrap] = useState("");
  const shownAt = useRef(Date.now());
  const painOptions = c.book.pain.options;
  useEffect(() => {
    const apply = (i: number) => {
      const o = painOptions[i];
      if (o) setForm((f) => ({ ...f, pain: o }));
    };
    try {
      const v = window.sessionStorage.getItem(PAIN_KEY);
      if (v !== null) {
        window.sessionStorage.removeItem(PAIN_KEY);
        apply(Number(v));
      }
    } catch {
      /* storage blocked: the form simply starts without a choice */
    }
    const on = (e: Event) => apply(Number((e as CustomEvent<number>).detail));
    window.addEventListener(PAIN_EVENT, on);
    return () => window.removeEventListener(PAIN_EVENT, on);
  }, [painOptions]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form['first'].trim()) errs['first'] = c.book['first'].error;
    if (!form['last'].trim()) errs['last'] = c.book['last'].error;
    if (!/^\S+@\S+\.\S+$/.test(form['email'])) errs['email'] = c.book['email'].error;
    if (form['phone'].replace(/\D/g, "").length < 10) errs['phone'] = c.book['phone'].error;
    if (!form['biz'].trim()) errs['biz'] = c.book['biz'].error;
    if (!form['industry']) errs['industry'] = c.book['industry'].error;
    if (!form['pain']) errs['pain'] = c.book['pain'].error;
    if (!consent) errs['consent'] = c.book.consentError;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first === "pain" ? `${idPrefix}-pain-0` : `${idPrefix}-${first}`)?.focus();
      return;
    }
    if (state === "sending") return;
    // a bot: the hidden field is filled in, or the form was sent within 3 seconds of appearing
    if (trap || Date.now() - shownAt.current < 3000) {
      setState("sent");
      return;
    }
    setState("sending");
    submitAuditRequest({
      first: form.first,
      last: form.last,
      email: form.email,
      phone: form.phone,
      biz: form.biz,
      industry: form.industry,
      focus: form.pain,
      lang,
      consentText: `${c.book.consentA} ${c.book.consentLink}${c.book.consentB}`,
    })
      .then((r) => setState(r.ok ? "sent" : "error"))
      .catch(() => setState("error"));
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
            value={form['industry']}
            aria-invalid={!!errors['industry']}
            aria-describedby={`${idPrefix}-industry-e`}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          >
            <option value="">{c.book.industry.placeholder}</option>
            {c.book.industry.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="t14-err" id={`${idPrefix}-industry-e`}>{errors['industry'] ?? ""}</span>
        </div>
        <div className="t14-f t14-f-wide">
          <span className="t14-flabel" id={`${idPrefix}-pain-l`}>{c.book.pain.label}</span>
          <div className="t14-tasks t14-pains" role="radiogroup" aria-labelledby={`${idPrefix}-pain-l`}>
            {c.book.pain.options.map((o, i) => (
              <label key={o} className={form['pain'] === o ? "on" : undefined}>
                <input id={`${idPrefix}-pain-${i}`} type="radio" name={`${idPrefix}-pain`} value={o} checked={form['pain'] === o} aria-invalid={!!errors['pain']} onChange={() => setForm({ ...form, pain: o })} />
                {o}
              </label>
            ))}
          </div>
          <span className="t14-err" role="alert">{errors['pain'] ?? ""}</span>
        </div>
      </div>
      <div className="t14-consent">
        <label htmlFor={`${idPrefix}-consent`}>
          <input
            id={`${idPrefix}-consent`}
            type="checkbox"
            checked={consent}
            aria-invalid={!!errors['consent']}
            aria-describedby={`${idPrefix}-consent-e`}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {c.book.consentA}{" "}
            <Link to={href(v14Routes.privacy)} target="_blank">{c.book.consentLink}</Link>
            {c.book.consentB}
          </span>
        </label>
        <span className="t14-err" id={`${idPrefix}-consent-e`}>{errors['consent'] ?? ""}</span>
      </div>
      {/* anti-spam: off-screen, out of the tab order, hidden from screen readers */}
      <div className="t14-trap" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>{c.book.trap}</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>
      <div className="t14-form-foot">
        <button className="t14-pill lg" type="submit" disabled={state === "sending" || state === "sent"} aria-busy={state === "sending"}>
          {state === "sending" ? c.book.sending : c.book.submit}
        </button>
        {state === "sent" && <div className="t14-ok" role="status">{c.book.sent}</div>}
        {state === "error" && <div className="t14-ok t14-fail" role="alert">{c.book.error}</div>}
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
