import { Fragment, useEffect, useRef, useState, type FormEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "@/components/thynk14/i18n";
import { Head16, Mk, MkCircle, caps } from "./bits";
export { Head16, Mk };
import { CaseLink, Logo, Wordmark } from "@/components/thynk14/work";
import { ThynkMap } from "@/components/thynk14/map";
import { v16Copy, type Service, type Step } from "@/content/site-v16";
import { v14Routes, v14Social } from "@/content/site-v14";
import { caseText, publishedCases } from "@/content/work-v14";
import { submitAuditRequest } from "@/lib/audit-leads";
import { privacyCopy } from "@/content/privacy-v14";
import { cookiesCopy } from "@/content/cookies-v16";
import { companyRows } from "@/content/company";

/**
 * v16 pages (26/11/2026, Mike): the redesign approved on the Design canvas, built here 1:1.
 * Home · Services · AI Audit · About · Contact. The Clients wall (/work), Press, Careers and the legal pages
 * keep their own components but sit in the same shell and use the v16 heading.
 * Motion «A + B» (approved on the canvas): sections rise into view on scroll (`.t16-rv`, see useV16Reveal) and
 * client/example cards tilt towards the mouse (`useTilt`, desktop pointers only). Both off with reduced motion.
 * Styles: src/components/thynk16/thynk16.css (the `t16-` block).
 */

export function useV16() {
  const { lang, href } = useCopy();
  return { t: v16Copy[lang], lang, href };
}

/* ---------- brand bits ---------- */

/** the six squares in front of the eyebrow (first one orange) */
function Sq() {
  return (
    <span className="t16-sq" aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </span>
  );
}

/** the quiet water circles on lake grounds */
function Ripples() {
  return (
    <svg className="t16-ripples" aria-hidden="true" width="560" height="560" viewBox="0 0 560 560">
      <g fill="none" stroke="#ffffff" strokeOpacity=".09" strokeWidth="2">
        <circle cx="280" cy="280" r="90" />
        <circle cx="280" cy="280" r="170" />
        <circle cx="280" cy="280" r="250" />
      </g>
    </svg>
  );
}

/** the hand-drawn orange arrow next to «Let's talk» */
function Arrow() {
  return (
    <svg className="t16-arrow" width="110" height="84" viewBox="0 0 160 120" aria-hidden="true">
      <path d="M8 14 C 70 12, 122 40, 138 98" />
      <path d="M114 86 L 139 102 L 153 74" />
    </svg>
  );
}

/* ---------- motion ---------- */

/**
 * A · reveal on scroll: every `.t16-rv` rises in once it enters the viewport. CSS scroll timelines are not in
 * Safari/Firefox yet, so this uses IntersectionObserver and a class. Elements already on screen show at once.
 */
export function useV16Reveal(rootRef: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = [...root.querySelectorAll<HTMLElement>(".t16-rv:not(.in)")];
    if (!els.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    root.classList.add("t16-motion");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef, key]);
}

/** B · depth with the mouse: the card leans towards the pointer (fine pointers only, not with reduced motion) */
function useTilt(max = 7) {
  const ok = useRef(false);
  useEffect(() => {
    ok.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!ok.current || e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * max * 1.2).toFixed(2)}deg`);
      el.classList.add("tilt");
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      el.classList.remove("tilt");
    },
  };
}

/* ---------- shared sections ---------- */

/** «Let's talk» button: on pages with the form it scrolls there, elsewhere it goes to /contact#talk */
export function TalkButton({ className = "t16-btn", children }: { className?: string; children?: ReactNode }) {
  const { t, href } = useV16();
  return (
    <Link className={className} to={href(v14Routes.contact)} hash="talk">
      {children ?? <>{t.nav.talk} <i aria-hidden="true">→</i></>}
    </Link>
  );
}

function Steps({ title, steps, className = "" }: { title: string; steps: Step[]; className?: string }) {
  return (
    <section className={`t16-wrap t16-steps ${className}`}>
      <h2 className="t16-h2 t16-rv">{title}</h2>
      <ol>
        {steps.map((s, i) => (
          <li key={s.title} className="t16-rv" style={{ transitionDelay: `${i * 0.08}s` }}>
            <span className="t16-n">{String(i + 1).padStart(2, "0")}</span>
            <strong>{s.title}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** the lake band that closes an inner page */
function Band({ title, text }: { title: string; text?: string }) {
  return (
    <section className="t16-wrap t16-band-wrap">
      <div className="t16-band t16-rv">
        <Ripples />
        <div>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <TalkButton className="t16-btn light" />
      </div>
    </section>
  );
}

/** the contact form: our database + HubSpot (src/lib/audit-leads.ts), consent stored with the request */
export function TalkForm({ idPrefix }: { idPrefix: string }) {
  const { t, lang, href } = useV16();
  const f = t.form;
  const [form, setForm] = useState({ name: "", biz: "", email: "", phone: "", focus: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trap, setTrap] = useState("");
  const shownAt = useRef(Date.now());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = f.name.error;
    if (!form.biz.trim()) errs.biz = f.biz.error;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = f.email.error;
    if (form.phone.replace(/\D/g, "").length < 10) errs.phone = f.phone.error;
    if (!form.focus) errs.focus = f.focus.error;
    if (!consent) errs.consent = f.consentError;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${idPrefix}-${first}`)?.focus();
      return;
    }
    if (state === "sending") return;
    if (trap || Date.now() - shownAt.current < 3000) {
      setState("sent");
      return;
    }
    setState("sending");
    // one «full name» field: first word → first name, the rest → last name (the table keeps both)
    const parts = form.name.trim().split(/\s+/);
    submitAuditRequest({
      first: parts[0] ?? "",
      last: parts.slice(1).join(" ") || "-",
      email: form.email,
      phone: form.phone,
      biz: form.biz,
      industry: "",
      focus: form.focus,
      lang,
      consentText: `${f.consentA} ${f.consentLink}${f.consentB}`,
    })
      .then((r) => setState(r.ok ? "sent" : "error"))
      .catch(() => setState("error"));
  };

  const input = (k: "name" | "biz" | "email" | "phone", type: string, auto: string) => (
    <div className="t16-f">
      <label htmlFor={`${idPrefix}-${k}`}>{f[k].label}</label>
      <input
        id={`${idPrefix}-${k}`}
        type={type}
        autoComplete={auto}
        placeholder={f[k].placeholder}
        value={form[k]}
        aria-invalid={!!errors[k]}
        aria-describedby={`${idPrefix}-${k}-e`}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
      />
      <span className="t16-err" id={`${idPrefix}-${k}-e`}>{errors[k] ?? ""}</span>
    </div>
  );

  if (state === "sent") {
    return (
      <div className="t16-form t16-form-done" role="status">
        <span className="t16-done-mark" aria-hidden="true">✓</span>
        <p>{f.sent}</p>
      </div>
    );
  }

  return (
    <form className="t16-form" onSubmit={submit} noValidate>
      {input("name", "text", "name")}
      {input("biz", "text", "organization")}
      {input("email", "email", "email")}
      {input("phone", "tel", "tel")}
      <div className="t16-f wide">
        <label htmlFor={`${idPrefix}-focus`}>{f.focus.label}</label>
        <select
          id={`${idPrefix}-focus`}
          value={form.focus}
          aria-invalid={!!errors.focus}
          aria-describedby={`${idPrefix}-focus-e`}
          onChange={(e) => setForm({ ...form, focus: e.target.value })}
        >
          <option value="">{f.focus.placeholder}</option>
          {f.focus.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="t16-err" id={`${idPrefix}-focus-e`}>{errors.focus ?? ""}</span>
      </div>
      <div className="t16-f wide t16-consent">
        <label htmlFor={`${idPrefix}-consent`}>
          <input
            id={`${idPrefix}-consent`}
            type="checkbox"
            checked={consent}
            aria-invalid={!!errors.consent}
            aria-describedby={`${idPrefix}-consent-e`}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {f.consentA} <Link to={href(v14Routes.privacy)} target="_blank">{f.consentLink}</Link>
            {f.consentB}
          </span>
        </label>
        <span className="t16-err" id={`${idPrefix}-consent-e`}>{errors.consent ?? ""}</span>
      </div>
      <div className="t16-trap" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>{f.trap}</label>
        <input id={`${idPrefix}-website`} type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>
      <div className="t16-f wide">
        <button className="t16-btn full" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? f.sending : f.submit}
        </button>
        <p className="t16-micro">{f.micro}</p>
        {state === "error" && <p className="t16-fail" role="alert">{f.error}</p>}
      </div>
    </form>
  );
}

/** the lake «Let's talk» section with the form (home) */
function TalkSection() {
  const { t } = useV16();
  return (
    <section id="talk" className="t16-talk">
      <Ripples />
      <div className="t16-wrap t16-talk-in">
        <div className="t16-talk-l t16-rv">
          <div className="t16-talk-h">
            <h2 className="t16-h2" lang="en">{t.form.title}</h2>
            <Arrow />
          </div>
          <p>{t.form.lead}</p>
        </div>
        <TalkForm idPrefix="talk" />
      </div>
    </section>
  );
}

/** clients as cards: a 3-up grid on desktop, a swipe row of all on phones */
function ClientCards() {
  const { t, lang } = useV16();
  const tilt = useTilt();
  return (
    <>
      <ul className="t16-cards" aria-label={t.home.clientsTitle}>
        {publishedCases.map((cs) => {
          const x = caseText(cs, lang);
          const logo = cs.logos?.[0];
          return (
            <li key={cs.slug}>
              <CaseLink cs={cs} className="t16-card">
                <span className="t16-card-in" {...tilt}>
                  <span className="t16-card-logo">
                    {logo ? <Logo l={logo} decorative /> : cs.wordmark ? <Wordmark wm={cs.wordmark} /> : <b>{x.client}</b>}
                  </span>
                  <strong>{x.client}</strong>
                  <span className="t16-card-meta">{x.sector} · {x.area}</span>
                </span>
              </CaseLink>
            </li>
          );
        })}
      </ul>
      <p className="t16-swipe" aria-hidden="true">{t.home.swipe}</p>
    </>
  );
}

/** the service list on the home page: rows that link to the service on /services (titles only on phones) */
function ServiceLinks({ n, name, list }: { n: string; name: string; list: Service[] }) {
  const { href } = useV16();
  return (
    <div className="t16-pillar">
      <div className="t16-pillar-h t16-rv">
        <span className="t16-n">{n}</span>
        <h3>{name}</h3>
      </div>
      <div className="t16-rows">
        {list.map((s, i) => (
          <Link key={s.id} className="t16-row t16-rv" to={href(v14Routes.services)} hash={s.id}>
            <span className="t16-row-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="t16-row-name">{s.name}</span>
            <span className="t16-row-line">{s.line}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================================ Home ================================ */

export function Home16() {
  const { t, href } = useV16();
  const h = t.home;
  return (
    <>
      <section className="t16-hero t16-wrap">
        <div className="t16-eyebrow">
          <Sq />
          <span className="t16-lbl" lang="en">{h.eyebrow}</span>
        </div>
        <h1 className="t16-h1 t16-h1-hero">
          {h.h1a} <Mk>{h.h1b}</Mk>
        </h1>
        <div className="t16-head-row">
          <p className="t16-lead t16-hero-lead">{h.leadA}<MkCircle>{h.leadWord}</MkCircle>.</p>
          <div className="t16-ctas">
            <a className="t16-btn" href="#talk">{t.nav.talk} <i aria-hidden="true">→</i></a>
            <Link className="t16-ghost" to={href(v14Routes.services)}>{h.seeServices}</Link>
          </div>
        </div>
      </section>

      {/* the client ribbon: it keeps moving, also on phones (Mike). 27/11 (Mike): the brands' logos, not their names */}
      <section className="t16-ribbon" aria-label={h.clientsAria}>
        <div className="t16-tick">
          {[0, 1].map((k) => (
            <div key={k} className="t16-tick-set" aria-hidden={k === 1 ? true : undefined}>
              {publishedCases.map((cs) => {
                const name = caseText(cs, "en").client;
                const logo = cs.logos?.[0];
                return (
                  <span key={cs.slug} className="t16-tick-item">
                    <span className="t16-tick-logo">
                      {logo ? <Logo l={logo} decorative={k === 1} /> : cs.wordmark ? <Wordmark wm={cs.wordmark} /> : name}
                    </span>
                    <b className="t16-dot" aria-hidden="true" />
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="t16-white">
        <div className="t16-wrap t16-sec">
          <div className="t16-sec-h t16-rv">
            <h2 className="t16-h2"><Mk>{h.servicesTitle}</Mk></h2>
            <Link className="t16-ghost" to={href(v14Routes.services)}>{h.allServices}</Link>
          </div>
          <ServiceLinks n={t.pillars.dm.n} name={t.pillars.dm.name} list={t.dm} />
          <ServiceLinks n={t.pillars.ai.n} name={t.pillars.ai.name} list={t.ai} />
        </div>
      </section>

      <section className="t16-wrap t16-sec" id="work">
        <div className="t16-sec-h t16-rv">
          <h2 className="t16-h2">{h.clientsTitle}</h2>
          <Link className="t16-ghost" to={href(v14Routes.work)}>{h.allClients}</Link>
        </div>
        <ClientCards />
      </section>

      <Steps title={h.stepsTitle} steps={t.steps} />

      <TalkSection />
    </>
  );
}

/* ================================ Services ================================ */
function Accordion({ pillar, list, open, setOpen }: {
  pillar: { n: string; name: string; line: string };
  list: Service[];
  open: string | null;
  setOpen: (id: string | null) => void;
}) {
  return (
    <div className="t16-acc-list">
      {list.map((s, i) => {
        const on = open === s.id;
        return (
          <div key={s.id} id={s.id} className={`t16-acc${on ? " open" : ""}`}>
            <h3 className="t16-acc-h">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${s.id}-p`}
                onClick={() => setOpen(on ? null : s.id)}
                onPointerEnter={(e) => {
                  // 26/11 (Mike): on a computer the service opens on hover; on touch it needs a tap
                  if (e.pointerType === "mouse" && !on) setOpen(s.id);
                }}
              >
                <span className="t16-row-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="t16-acc-name">{s.name}</span>
                <span className="t16-acc-line">{s.line}</span>
                <span className="t16-plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="t16-acc-p" id={`${s.id}-p`} role="region" aria-label={`${pillar.name} · ${s.name}`}>
              <div>
                <p className="t16-acc-line-m">{s.line}</p>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Services16() {
  const { t, href } = useV16();
  const s = t.services;
  const [open, setOpen] = useState<string | null>("performance");
  const [hover, setHover] = useState(true);
  const tilt = useTilt(6);
  useEffect(() => {
    setHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    // /services#social etc. (from the home list): open that service
    const id = window.location.hash.replace(/^#/, "");
    if (id && [...t.dm, ...t.ai].some((x) => x.id === id)) setOpen(id);
  }, [t]);
  return (
    <>
      <Head16 eyebrow={s.eyebrow} title={<>{s.h1a} <Mk>{s.h1b}</Mk>.</>} lead={`${s.lead} ${hover ? s.leadHover : s.leadTap}`}>
        <nav className="t16-chips" aria-label={s.pillarsAria}>
          <a href="#dm">{t.pillars.dm.n} {t.pillars.dm.name}</a>
          <a href="#ai">{t.pillars.ai.n} {t.pillars.ai.name}</a>
        </nav>
      </Head16>

      <section id="dm" className="t16-white">
        <div className="t16-wrap t16-sec t16-sec-tight">
          <div className="t16-pillar-head t16-rv">
            <span className="t16-n">{t.pillars.dm.n}</span>
            <h2 className="t16-h2">{t.pillars.dm.name}</h2>
            <span>{t.pillars.dm.line}</span>
          </div>
          <Accordion pillar={t.pillars.dm} list={t.dm} open={open} setOpen={setOpen} />
        </div>
      </section>

      <section id="ai" className="t16-wrap t16-sec t16-sec-tight">
        <div className="t16-pillar-head t16-rv">
          <span className="t16-n">{t.pillars.ai.n}</span>
          <h2 className="t16-h2">{t.pillars.ai.name}</h2>
          <span>{t.pillars.ai.line}</span>
        </div>
        <Accordion pillar={t.pillars.ai} list={t.ai} open={open} setOpen={setOpen} />
        <Link className="t16-ghost t16-more" to={href(v14Routes.audit)}>{s.auditLink}</Link>

        <div className="t16-examples" id="examples">
          <h3 className="t16-rv">{s.examplesTitle}</h3>
          <ul>
            {s.examples.map((ex, i) => (
              <li key={ex.t} className="t16-rv" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="t16-ex" {...tilt}>
                  <strong>{ex.t}</strong>
                  <span>{ex.d}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Band title={s.bandTitle} text={s.bandText} />
    </>
  );
}

/* ================================ AI Audit (/audit) ================================ */
function Calc16() {
  const { t } = useV16();
  const c = t.audit.calc;
  const [p, setP] = useState(3);
  const [h, setH] = useState(8);
  const [r, setR] = useState(12);
  const year = Math.round(p * h * 4.33 * r * 12);
  const num = (id: string, label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <div className="t16-f">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={v}
        onChange={(e) => set(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
      />
    </div>
  );
  return (
    <section className="t16-wrap t16-sec t16-calc">
      <div className="t16-calc-l t16-rv">
        <h2 className="t16-h2">{c.title}</h2>
        <p className="t16-lead sm">{c.lead}</p>
        <div className="t16-calc-in">
          {num("calc-p", c.people, p, setP, 1, 200)}
          {num("calc-h", c.hours, h, setH, 1, 60)}
          {num("calc-r", c.rate, r, setR, 1, 200)}
        </div>
      </div>
      <div className="t16-calc-out t16-rv" aria-live="polite">
        <span className="t16-lbl light">{c.out}</span>
        <b>€{year.toLocaleString(c.locale)}</b>
        <p>{c.how(p, h, r)}</p>
      </div>
    </section>
  );
}

export function Audit16() {
  const { t, href } = useV16();
  const a = t.audit;
  return (
    <>
      <Head16
        eyebrow=""
        back={<Link className="t16-lbl t16-back" to={href(v14Routes.services)} hash="ai">{a.back}</Link>}
        title={<>{a.h1a} <Mk>{a.h1b}</Mk>.</>}
        lead={a.lead}
      >
        <TalkButton />
      </Head16>

      <section className="t16-white">
        <div className="t16-wrap t16-sec">
          <h2 className="t16-h2 t16-rv">{a.looksTitle}</h2>
          <ol className="t16-tiles">
            {a.looks.map((x, i) => (
              <li key={x.title} className="t16-rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="t16-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{x.title}</strong>
                <span>{x.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="t16-wrap t16-sec t16-split">
        <div>
          <h2 className="t16-h2 t16-rv">{a.howTitle}</h2>
          <ol className="t16-flow">
            {a.how.map((x, i) => (
              <li key={x.title} className="t16-rv">
                <span className="t16-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{x.title}</strong>
                  <span>{x.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className="t16-sample t16-rv">
          <figcaption className="t16-lbl">{a.sample.label}</figcaption>
          <ul>
            {a.sample.rows.map((row) => (
              <li key={row.tag}>
                <span className={`t16-tag ${row.tone}`}>{row.tag}</span>
                <span>
                  {row.text}
                  {"note" in row && row.note ? <small>{row.note}</small> : null}
                </span>
              </li>
            ))}
          </ul>
          <p>{a.sample.foot}</p>
        </figure>
      </section>

      <Calc16 />

      <section className="t16-wrap t16-sec t16-faq">
        <h2 className="t16-h2 t16-rv">{a.faqTitle}</h2>
        <div>
          {a.faq.map((q) => (
            <details key={q.q} className="t16-rv">
              <summary>
                {q.q}
                <span className="t16-plus" aria-hidden="true" />
              </summary>
              <p>{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Band title={a.bandTitle} text={a.bandText} />
    </>
  );
}

/* ================================ About ================================ */
export function About16() {
  const { t } = useV16();
  const { c } = useCopy();
  const a = t.about;
  const team = c.aboutPage.founders;
  const tilt = useTilt(5);
  return (
    <>
      <Head16 eyebrow={a.eyebrow} title={<>{a.h1a} <Mk>{a.h1b}</Mk>.</>} lead={a.lead} />

      <section className="t16-white">
        <div className="t16-wrap t16-sec">
          <h2 className="t16-h2 t16-rv">{a.teamTitle}</h2>
          <ul className="t16-team">
            {team.map((f, i) => (
              <li key={f.name} className="t16-rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="t16-photo" {...tilt}>
                  {f.photo ? <img src={f.photo} alt={f.name} loading="lazy" /> : <span aria-hidden="true">{f.initials}</span>}
                </div>
                <strong>{f.name}</strong>
                <span className="t16-role" lang="en">{f.role}</span>
                <a className="t16-ghost sm" href={f.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${f.name} ${c.aboutPage.linkedinAria}`}>
                  LinkedIn <i aria-hidden="true">↗</i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="t16-wrap t16-sec">
        <h2 className="t16-h2 t16-rv">{a.valuesA} <Mk>{a.valuesB}</Mk></h2>
        <ul className="t16-values">
          {a.values.map((v, i) => (
            <li key={v.title} className="t16-rv" style={{ transitionDelay: `${i * 0.06}s` }}>
              <strong>{v.title}</strong>
              <span>{v.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="t16-lake">
        <Ripples />
        <div className="t16-wrap t16-sec">
          <h2 className="t16-h2 t16-rv">{a.aiTitle}</h2>
          <ol className="t16-tiles dark">
            {a.ai.map((x, i) => (
              <li key={x.title} className="t16-rv" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="t16-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{x.title}</strong>
                <span>{x.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="t16-wrap t16-sec t16-closer">
        <h2 className="t16-h2 t16-rv">{a.bandTitle}</h2>
        <TalkButton />
      </section>
    </>
  );
}

/* ================================ Contact ================================ */
export function Contact16() {
  const { t, lang } = useV16();
  const { c } = useCopy();
  const k = t.contact;
  const phone = "+30 698 388 7522";
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.contactPage.mapsQuery)}`;
  return (
    <>
      <Head16 eyebrow={k.eyebrow} title={<span lang="en">Let's <Mk>talk</Mk>.</span>} lead={k.lead} />

      <section className="t16-wrap t16-contact" id="talk">
        <TalkForm idPrefix="contact" />
        <aside className="t16-info">
          <div>
            <span className="t16-lbl">{k.email}</span>
            <a href="mailto:hello@thynkagency.gr">hello@thynkagency.gr</a>
          </div>
          <div>
            <span className="t16-lbl">{k.phone}</span>
            <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
          </div>
          <div>
            <span className="t16-lbl">{k.office}</span>
            <span>{k.address}</span>
            <a className="sm" href={maps} target="_blank" rel="noopener noreferrer">{k.directions}</a>
          </div>
          <div>
            <span className="t16-lbl">{k.hours}</span>
            <span>{k.hoursValue}</span>
            <small>{k.hoursNote}</small>
          </div>
          <div>
            <span className="t16-lbl">{k.social}</span>
            <span className="t16-social">
              {v14Social.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              ))}
            </span>
          </div>
        </aside>
      </section>

      <section className="t16-wrap t16-map-wrap">
        <div className="t16-map">
          <ThynkMap lang={lang} title={k.mapTitle} />
          <span className="t16-map-pin" aria-hidden="true">
            <svg viewBox="0 0 40 52" width="40" height="52">
              <path d="M20 51C20 51 38 31.5 38 19A18 18 0 0 0 2 19C2 31.5 20 51 20 51Z" fill="#ff6a1a" stroke="#fff" strokeWidth="2.5" />
              <circle cx="20" cy="19" r="6.5" fill="#fff" />
            </svg>
          </span>
        </div>
      </section>

      <Steps title={k.stepsTitle} steps={t.steps} />
    </>
  );
}

/* ================================ /work heading ================================ */
export function WorkHead16() {
  const { t } = useV16();
  const w = t.work;
  return (
    <Head16
      eyebrow={w.eyebrow}
      title={<span lang="en">{w.h1a} <Mk>{w.h1b}</Mk> {w.h1c}</span>}
      lead={w.lead}
    />
  );
}

/* ================================ legal pages (Privacy, Cookies) ================================ */
type LegalSection = { id?: string; h: string; p?: string[]; list?: string[]; after?: string[]; table?: { head: [string, string, string, string]; rows: { name: string; kind: string; purpose: string; kept: string }[] } };

const slug = (_h: string, i: number) => `s${i + 1}`;

/** a legal page: heading, a sticky table of contents, the text on a white card; «Who we are» gets the company card */
function LegalPage({ label, title, lead, updated, toc, sections, companyAt }: {
  label: string;
  title: string;
  lead: string;
  updated: string;
  toc: string;
  sections: LegalSection[];
  /** index of the section that shows the company's details */
  companyAt?: number;
}) {
  const { lang } = useV16();
  const rows = companyRows(lang);
  return (
    <>
      <Head16 eyebrow={caps(label)} title={<><Mk>{title}</Mk>.</>} lead={lead} />
      <div className="t16-wrap t16-legal">
        <nav className="t16-legal-toc" aria-label={toc}>
          <b>{toc}</b>
          {sections.map((s, i) => (
            <a key={s.h} href={`#${s.id ?? slug(s.h, i)}`}>{s.h}</a>
          ))}
        </nav>
        <article className="t16-legal-body">
          <p className="t16-updated">{updated}</p>
          {sections.map((s, i) => (
            <section key={s.h} id={s.id ?? slug(s.h, i)}>
              <h2>{s.h}</h2>
              {s.p?.map((x) => <p key={x}>{x}</p>)}
              {i === companyAt && rows.length > 0 && (
                <dl className="t16-company-card">
                  {rows.map((r) => (
                    <Fragment key={r.k}>
                      <dt>{r.k}</dt>
                      <dd>{r.v}</dd>
                    </Fragment>
                  ))}
                </dl>
              )}
              {s.table && (
                <table>
                  <thead>
                    <tr>{s.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r) => (
                      <tr key={r.name}>
                        <td><code>{r.name}</code></td>
                        <td>{r.kind}</td>
                        <td>{r.purpose}</td>
                        <td>{r.kept}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {s.list && (
                <ul>
                  {s.list.map((x) => <li key={x}>{x}</li>)}
                </ul>
              )}
              {s.after?.map((x) => <p key={x}>{x}</p>)}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

export function Privacy16() {
  const { lang } = useV16();
  const p = privacyCopy[lang];
  return <LegalPage {...p} toc={lang === "el" ? "ΣΕ ΑΥΤΗ ΤΗ ΣΕΛΙΔΑ" : "ON THIS PAGE"} companyAt={0} />;
}

export function Cookies16() {
  const { lang } = useV16();
  const p = cookiesCopy[lang];
  return <LegalPage {...p} />;
}
