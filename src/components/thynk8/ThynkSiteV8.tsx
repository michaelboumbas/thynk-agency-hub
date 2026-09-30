import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  afterAudit,
  audit,
  auditForm,
  calcCta,
  calculator,
  caps,
  cta,
  faqV8,
  finalCta,
  footerV8,
  forWhom,
  heroV8,
  method,
  pains,
  servicesV8,
  solutions,
  teamV8,
  v8Assets,
  v8Nav,
  type PainId,
} from "@/content/site-v8";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Calculator } from "@/components/thynk5/Calculator";

/**
 * v8 — "Thynk Clear". One goal: book the audit. Order follows the lead-magnet pattern:
 * benefit hero → who it's for → what the audit is and what you get (preview) → what it can lead to →
 * how we work after it → calculator (low-commitment step) → who we are → FAQ → audit form.
 * The Muse is a transparent cutout that breaks out of her card, on three parallax layers (no WebGL).
 */

function scrollToId(id: string, reduced: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function useReveal(root: RefObject<HTMLElement | null>, dep: unknown) {
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

function Wordmark() {
  return (
    <span className="t8-word" aria-label="Thynk">
      THYNK<i>.</i>
    </span>
  );
}

function Arrow() {
  return (
    <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The Muse, on three layers: card (back), body (middle), tag (front). Pointer moves them by different amounts. */
function Muse({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(v8Assets.muse);

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
            onError={() => setSrc(v8Assets.museFallback)}
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

function AuditForm({ pain }: { pain: PainId | null }) {
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

  const field = (id: string, label: string, type: string, opts: { required?: boolean; auto?: string; mode?: "tel" | "email" | "url" } = {}) => (
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
      <p className="t8-req">* υποχρεωτικό</p>
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

export function ThynkSiteV8() {
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

  // header state + mobile sticky CTA (after the hero, hidden once the form is on screen)
  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("book");
    const on = () => {
      setScrolled(window.scrollY > 12);
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : false;
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
    scrollToId(id, reduced);
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

  return (
    <div className="t8" ref={rootRef} lang="el">
      <a className="t8-skip" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>

      {/* ---------- Header ---------- */}
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
          {v8Nav.map((n) => (
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
        {/* ---------- 1. Hero: benefit + one action ---------- */}
        <section className="t8-hero" id="top">
          <div className="t8-blob t8-blob-a" aria-hidden="true" />
          <div className="t8-blob t8-blob-b" aria-hidden="true" />
          <div className="t8-hero-grid">
            <div className="t8-hero-text">
              <span className="t8-eyebrow">{caps(heroV8.eyebrow)}</span>
              <h1 className="t8-h1">
                {heroV8.headlineStart}
                <em>{heroV8.headlineAccent}</em>
                {heroV8.headlineEnd}
              </h1>
              <p className="t8-sub">{heroV8.sub}</p>
              <div className="t8-ctas">
                <button type="button" className="t8-btn" onClick={book}>
                  {cta.primary}
                  <Arrow />
                </button>
                <button type="button" className="t8-btn t8-btn-ghost" onClick={() => go("calculator")}>
                  {cta.secondary}
                </button>
              </div>
              <p className="t8-note">{heroV8.note}</p>
            </div>
            <Muse reduced={reduced} />
          </div>

          {/* what eats your time: pre-fills the calculator and the audit form */}
          <div className="t8-ask">
            <p className="t8-ask-q">
              <strong>{heroV8.question}</strong> <span>{heroV8.questionHint}</span>
            </p>
            <div className="t8-chips" role="group" aria-label={heroV8.question}>
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
                    Να το κοιτάξουμε στο audit <Arrow />
                  </button>
                  <button type="button" className="t8-link t8-link-muted" onClick={() => go("calculator")}>
                    Πόσο μου κοστίζει;
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

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

        {/* ---------- 3. The audit: the product ---------- */}
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
                    <span className="t8-num">{String(i + 1).padStart(2, "0")}</span>
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
            {/* preview of the deliverable (pattern: show the lead magnet before the form) */}
            <figure className="t8-sample" data-reveal aria-label={audit.sample.label}>
              <figcaption>
                <span className="t8-eyebrow">{caps(audit.sample.label)}</span>
                <strong>{audit.sample.business}</strong>
              </figcaption>
              <ul>
                {audit.sample.items.map((it) => (
                  <li key={it.text} className={`t8-sample-${it.tag === "Πρώτο" ? "first" : it.tag === "Μετά" ? "next" : "later"}`}>
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
            <span className="t8-muted">{heroV8.note}</span>
          </div>
        </section>

        {/* ---------- 4. What it can lead to ---------- */}
        <section className="t8-section" id="services">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps(servicesV8.eyebrow)}</span>
            <h2 className="t8-h2">{servicesV8.title}</h2>
            <p className="t8-lead">{servicesV8.lead}</p>
          </div>
          <div className="t8-acc">
            {solutions.pillars.map((p) => {
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
        </section>

        {/* ---------- 5. After the audit ---------- */}
        <section className="t8-section">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps(afterAudit.eyebrow)}</span>
            <h2 className="t8-h2">{afterAudit.title}</h2>
            <p className="t8-lead">{afterAudit.lead}</p>
          </div>
          <ol className="t8-after">
            {afterAudit.steps.map((s) => (
              <li key={s.title} data-reveal>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <p className="t8-decide">{s.decide}</p>
              </li>
            ))}
          </ol>
          <div className="t8-rules" data-reveal>
            <h3>{afterAudit.rulesTitle}</h3>
            <dl>
              {method.rules.map((r) => (
                <div key={r.title}>
                  <dt>{r.title}</dt>
                  <dd>{r.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 6. Calculator: the low-commitment step ---------- */}
        <section className="t8-section" id="calculator">
          <div className="t8-head" data-reveal>
            <span className="t8-eyebrow">{caps("Υπολογιστής")}</span>
            <h2 className="t8-h2">{calculator.headline}</h2>
            <p className="t8-lead">{calculator.intro}</p>
          </div>
          <div className="t8-card t8-calc t5 t5-embed" data-reveal>
            <Calculator key={pain ?? "none"} initialTasks={picked?.calc} />
          </div>
          <div className="t8-inline-cta" data-reveal>
            <span>{calcCta.text}</span>
            <button type="button" className="t8-btn" onClick={book}>
              {calcCta.button}
              <Arrow />
            </button>
          </div>
        </section>

        {/* ---------- 7. Who we are ---------- */}
        <section className="t8-section" id="team">
          <div className="t8-team">
            <div className="t8-team-intro" data-reveal>
              <span className="t8-eyebrow">{caps(teamV8.eyebrow)}</span>
              <h2 className="t8-h2">{teamV8.title}</h2>
              <p className="t8-lead">{teamV8.lead}</p>
              <p className="t8-where">{teamV8.where}</p>
            </div>
            <div className="t8-people">
              {teamV8.founders.map((f) => (
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
                      Γράψε στον {f.firstName} <Arrow />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 8. FAQ ---------- */}
        <section className="t8-section t8-narrow" id="faq">
          <div className="t8-head" data-reveal>
            <h2 className="t8-h2">Ό,τι ρωτάνε συνήθως</h2>
          </div>
          <div className="t8-faq">
            {faqV8.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`t8-faq-item${open ? " open" : ""}`} data-reveal>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {f.q}
                    <span className="t8-plus" aria-hidden="true" />
                  </button>
                  {open && <p id={`faq-${i}`}>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- 9. Book the audit ---------- */}
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
        <span>{footerV8.line}</span>
        <span className="t8-muted">{footerV8.small}</span>
      </footer>

      {/* mobile: the one action, always one tap away (hidden over the hero and the form) */}
      <div className={`t8-sticky${sticky ? " show" : ""}`} aria-hidden={!sticky}>
        <button type="button" className="t8-btn t8-btn-block" onClick={book} tabIndex={sticky ? 0 : -1}>
          {cta.primary}
          <Arrow />
        </button>
      </div>
    </div>
  );
}
