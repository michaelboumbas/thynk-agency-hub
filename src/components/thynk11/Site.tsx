import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import {
  allServices,
  audit,
  calculatorCopy,
  caps,
  cta,
  faq,
  forWhom,
  hero,
  pains,
  rules,
  team,
  type PainId,
} from "@/content/site-v9";
import {
  finalBand,
  footerLinks,
  homeAudit,
  homeCalc,
  homeFaq,
  moreIdeas,
  nav,
  pages,
  routes,
  values,
} from "@/content/site-v11";
import { footer } from "@/content/site-v9";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Calculator } from "@/components/thynk5/Calculator";
import { HandsHero } from "@/components/thynk10/HandsHero";
import {
  Arrow,
  AuditForm,
  Examples,
  ServicesSteps,
  Wordmark,
  useReveal,
} from "@/components/thynk9/ThynkSiteV9";
import { ParticleField } from "./ParticleField";

/**
 * v11 — the site as real pages (30/09/2026): Αρχική · Υπηρεσίες · Παραδείγματα · Audit · Ποιοι είμαστε.
 * Built on v9/v10 pieces (plural voice, AI-first hero with the hands, examples, three steps).
 * A light particle field (wave → ring) sits behind every page.
 * Public host: every page shows Coming Soon until launch (same rule as before; ?site=1 overrides).
 */

/* ---------------- gate: Coming Soon on the public site ---------------- */
let gateCache: boolean | null = null;
function shouldShowSite(): boolean {
  const { hostname, search } = window.location;
  const q = new URLSearchParams(search);
  if (q.has("soon")) return false;
  if (q.has("site")) return true;
  return (
    hostname.startsWith("id-preview--") ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}
export function useSiteGate() {
  // first render = Coming Soon (matches the server render); client-side navigations reuse the answer
  const [show, setShow] = useState(gateCache === true);
  useEffect(() => {
    if (gateCache === null) gateCache = shouldShowSite();
    setShow(gateCache);
  }, []);
  return show;
}

const SERIF_HREF = "https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@1,500;1,600&display=swap";

/* ---------------- shell: header, background, footer, sticky CTA ---------------- */
function Shell({ children, pathname }: { children: ReactNode; pathname: string }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useReveal(rootRef, pathname);

  useEffect(() => {
    if (document.querySelector(`link[href="${SERIF_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = SERIF_HREF;
    document.head.appendChild(l);
  }, []);

  // the app shell locks scrolling for v5: unlock while the site is mounted
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

  // new page: close the menu; go to #hash if there is one, else to the top
  useEffect(() => {
    setMenuOpen(false);
    const id = (hash || "").replace(/^#/, "");
    const t = window.setTimeout(() => {
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 12);
      const form = document.getElementById("book");
      const atForm = form ? form.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setSticky(window.scrollY > window.innerHeight * 0.8 && !atForm);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  return (
    <div className="t8 t9 t10 t11" ref={rootRef} lang="el">
      <ParticleField reduced={reduced} />
      <CursorGlow reduced={reduced} />
      <a className="t8-skip" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>
      <header className={`t8-header${scrolled ? " scrolled" : ""}`}>
        <Link to={routes.home} className="t8-brand" aria-label="Thynk, αρχική">
          <Wordmark />
        </Link>
        <nav className={`t8-nav${menuOpen ? " open" : ""}`} aria-label="Κύριο μενού">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={pathname === n.to ? "on" : ""} aria-current={pathname === n.to ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
          <Link to={routes.audit} hash="book" className="t8-btn t8-btn-sm t8-nav-cta">
            {cta.primary}
          </Link>
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

      <main id="main" className="t11-main">
        {children}
      </main>

      {/* open space at the end of every page: the background dots form the THYNK. wordmark here */}
      <div className="t11-outro" aria-hidden="true" />

      <footer className="t11-footer">
        {/* glowing "horizon": the THYNK. dots above land on it */}
        <div className="t11-horizon" aria-hidden="true" />
        <div className="t11-foot">
          <CircuitTraces />
          <div className="t11-foot-grid">
            <div className="t11-foot-brand">
              <Wordmark />
              <p>{footer.small}</p>
              <Link to={routes.audit} hash="book" className="t8-btn t8-btn-sm">
                {cta.primary}
                <Arrow />
              </Link>
            </div>
            <nav aria-label="Σελίδες" className="t11-foot-col">
              <span className="t11-foot-h">{caps("Σελίδες")}</span>
              <Link to={routes.home}>Αρχική</Link>
              {nav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="t11-foot-col">
              <span className="t11-foot-h">{caps("Επικοινωνία")}</span>
              <a href={`mailto:${footerLinks.contact}`}>{footerLinks.contact}</a>
              <a href="mailto:dimitris@thynkagency.gr">dimitris@thynkagency.gr</a>
              <a href="mailto:mike@thynkagency.gr">mike@thynkagency.gr</a>
              <span className="t11-foot-note">Έδρα Ιωάννινα · Συνεργασίες σε όλη την Ελλάδα και το εξωτερικό</span>
            </div>
          </div>
          <p className="t11-footer-line">
            <span className="t11-live" aria-hidden="true" />
            {footer.line}
          </p>
        </div>
      </footer>

      <div className={`t8-sticky${sticky ? " show" : ""}`} aria-hidden={!sticky}>
        <Link to={routes.audit} hash="book" className="t8-btn t8-btn-block" tabIndex={sticky ? 0 : -1}>
          {cta.primary}
          <Arrow />
        </Link>
      </div>
    </div>
  );
}

/* Thin orange "circuit" traces behind the footer, with light pulses running along them
   (same language as the robot arm's circuits). Decorative only. */
function CircuitTraces() {
  const paths = [
    "M0 40 H180 L210 70 H420 L450 40 H700",
    "M1200 30 H980 L950 60 H760 L730 90 H560",
    "M0 150 H120 L150 120 H330 L360 150 H520",
    "M1200 160 H1040 L1010 130 H860 L830 160 H700",
    "M600 0 V30 L630 60 V110",
  ];
  const nodes = [
    [180, 40], [420, 70], [700, 40], [980, 30], [760, 60], [560, 90], [330, 120], [520, 150], [860, 130], [700, 160], [630, 110],
  ];
  return (
    <svg className="t11-circuit" viewBox="0 0 1200 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <g key={i}>
          <path className="t11-trace" d={d} />
          <path className="t11-pulse" d={d} style={{ animationDelay: `${i * 0.9}s` }} />
        </g>
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} className="t11-node" cx={x} cy={y} r="3.2" />
      ))}
    </svg>
  );
}

/* A soft Thynk-orange light that follows the cursor behind the content (desktop only).
   The background dots near the cursor also light up and make room (see ParticleField). */
function CursorGlow({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = -500;
    let y = -500;
    let tx = x;
    let ty = y;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const on = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const off = () => {
      el.style.opacity = "0";
    };
    window.addEventListener("pointermove", on, { passive: true });
    document.addEventListener("pointerleave", off);
    return () => {
      window.removeEventListener("pointermove", on);
      document.removeEventListener("pointerleave", off);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  return (
    <div className="t11-cursor" ref={ref} aria-hidden="true">
      <i />
    </div>
  );
}

/** Glowing horizon line between sections (same as the footer's). */
function HLine() {
  return <div className="t11-hline" aria-hidden="true" />;
}

/* ---------------- shared blocks ---------------- */
function PageHero({ p }: { p: { eyebrow: string; titleStart: string; titleAccent: string; titleEnd: string; lead: string } }) {
  return (
    <section className="t11-phero">
      <nav className="t11-crumbs" aria-label="Διαδρομή">
        <Link to={routes.home}>Αρχική</Link>
        <span aria-hidden="true">/</span>
        <span>{p.eyebrow}</span>
      </nav>
      <h1 className="t11-ptitle">
        {p.titleStart}
        <em className="t9-em">{p.titleAccent}</em>
        {p.titleEnd}
      </h1>
      <p className="t11-plead">{p.lead}</p>
    </section>
  );
}

function Faq({ items, title, id }: { items: { q: string; a: string }[]; title: string; id?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="t8-section t8-narrow" id={id}>
      <div className="t8-head" data-reveal>
        <h2 className="t8-h2">{title}</h2>
      </div>
      <div className="t8-faq">
        {items.map((f, i) => {
          const on = open === i;
          return (
            <div key={f.q} className={`t8-faq-item${on ? " open" : ""}`} data-reveal>
              <button type="button" aria-expanded={on} aria-controls={`faq-${id}-${i}`} onClick={() => setOpen(on ? null : i)}>
                {f.q}
                <span className="t8-plus" aria-hidden="true" />
              </button>
              {on && <p id={`faq-${id}-${i}`}>{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalBand() {
  return (
    <section className="t8-section t11-final">
      <div className="t11-band" data-reveal>
        <div>
          <h2>{finalBand.title}</h2>
          <p>{finalBand.text}</p>
        </div>
        <div className="t11-band-actions">
          <Link to={routes.audit} hash="book" className="t8-btn">
            {finalBand.button}
            <Arrow />
          </Link>
          <a href={`mailto:${footerLinks.contact}`} className="t11-band-mail">
            {finalBand.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}

function AllServices({ highlight }: { highlight?: string | null }) {
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  return (
    <section className="t8-section t9-all" id="all-services">
      <div className="t8-head" data-reveal>
        <span className="t8-eyebrow">{caps(allServices.eyebrow)}</span>
        <h2 className="t8-h2">{allServices.title}</h2>
        <p className="t8-lead">{allServices.lead}</p>
      </div>
      <div className="t8-acc">
        {allServices.pillars.map((p) => {
          const open = openPillar === p.id;
          return (
            <div key={p.id} className={`t8-acc-item${open ? " open" : ""}${highlight === p.id ? " hl" : ""}`} data-reveal>
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
  );
}

function useStepGo() {
  const navigate = useNavigate();
  return (to: string) => {
    if (to === "book") navigate({ to: routes.audit, hash: "book" });
    else if (to === "faq") navigate({ to: routes.home, hash: "faq" });
    else document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* ---------------- pages ---------------- */
function HomePage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const stepGo = useStepGo();
  const [pain, setPain] = useState<PainId | null>(null);
  const picked = pains.find((p) => p.id === pain) ?? null;

  return (
    <>
      <HandsHero
        reduced={reduced}
        onBook={() => navigate({ to: routes.audit, hash: "book" })}
        onExamples={() => navigate({ to: routes.examples })}
      />

      <section className="t8-section t10-ask-sec">
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
                <Link to={routes.audit} search={{ focus: picked.id }} hash="book" className="t8-link">
                  {hero.replyAudit} <Arrow />
                </Link>
                <Link to={routes.audit} search={{ focus: picked.id }} hash="calculator" className="t8-link t8-link-muted">
                  {hero.replyCalc}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

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

      <HLine />
      <Examples reduced={reduced} />
      <div className="t11-more-link">
        <Link to={routes.examples} className="t8-link">
          Όλα τα παραδείγματα <Arrow />
        </Link>
      </div>

      <HLine />
      <ServicesSteps reduced={reduced} onGo={stepGo} />
      <div className="t9-thread" aria-hidden="true" />
      <AllServices highlight={picked?.pillar} />
      <HLine />

      {/* ---- rebuilt lower half (30/09) ---- */}
      <section className="t8-section">
        <div className="t11-audit-card" data-reveal>
          <div className="t11-audit-text">
            <span className="t8-eyebrow">{caps(homeAudit.eyebrow)}</span>
            <h2 className="t8-h2">{homeAudit.title}</h2>
            <p>{homeAudit.text}</p>
            <ol className="t11-mini-steps">
              {audit.steps.map((s) => (
                <li key={s.n}>
                  <span>{s.n}</span>
                  {s.title}
                </li>
              ))}
            </ol>
            <div className="t8-ctas">
              <Link to={routes.audit} hash="book" className="t8-btn">
                {cta.primary}
                <Arrow />
              </Link>
              <Link to={routes.audit} className="t8-btn t8-btn-ghost">
                {homeAudit.more}
              </Link>
            </div>
          </div>
          <figure className="t8-sample t11-sample" aria-label={audit.sample.label}>
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
      </section>

      <section className="t8-section">
        <div className="t11-calc-band" data-reveal>
          <div>
            <h2>{homeCalc.title}</h2>
            <p>{homeCalc.text}</p>
          </div>
          <Link to={routes.audit} hash="calculator" className="t8-btn t8-btn-ghost">
            {homeCalc.button}
            <Arrow />
          </Link>
        </div>
      </section>

      <HLine />
      <Faq items={homeFaq} title="Συχνές ερωτήσεις" id="faq" />
      <FinalBand />
    </>
  );
}

function ServicesPage() {
  const reduced = useReducedMotion();
  const stepGo = useStepGo();
  return (
    <>
      <PageHero p={pages.services} />
      <HLine />
      <ServicesSteps reduced={reduced} onGo={stepGo} />
      <div className="t9-thread" aria-hidden="true" />
      <AllServices />
      <FinalBand />
    </>
  );
}

function ExamplesPage() {
  const reduced = useReducedMotion();
  return (
    <>
      <PageHero p={pages.examples} />
      <HLine />
      <Examples reduced={reduced} />
      <section className="t8-section">
        <div className="t8-head" data-reveal>
          <h2 className="t8-h2">{moreIdeas.title}</h2>
          <p className="t8-lead">{moreIdeas.lead}</p>
        </div>
        <div className="t11-ideas">
          {moreIdeas.groups.map((g) => (
            <div key={g.tag} className="t11-ideas-col" data-reveal>
              <span className="t8-tag">{caps(g.tag)}</span>
              <ul>
                {g.items.map((it) => (
                  <li key={it.t}>
                    <strong>{it.t}</strong>
                    <span>{it.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="t11-more-link">
          <Link to={routes.services} className="t8-link">
            Όλες οι υπηρεσίες <Arrow />
          </Link>
        </div>
      </section>
      <FinalBand />
    </>
  );
}

function AuditPage() {
  const search = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });
  const focus = typeof search?.focus === "string" ? (search.focus as PainId) : null;
  const picked = pains.find((p) => p.id === focus) ?? null;

  return (
    <>
      <PageHero p={pages.audit} />
      <HLine />
      <section className="t8-section t11-first">
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
        <ol className="t8-flow" aria-label="Η διαδικασία του audit">
          {audit.steps.map((s) => (
            <li key={s.n} data-reveal>
              <span className="t8-flow-n">{s.n}</span>
              <strong>{s.title}</strong>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="t8-section" id="calculator">
        <div className="t8-head" data-reveal>
          <span className="t8-eyebrow">{caps(calculatorCopy.eyebrow)}</span>
          <h2 className="t8-h2">{calculatorCopy.headline}</h2>
          <p className="t8-lead">{calculatorCopy.intro}</p>
        </div>
        <div className="t8-card t8-calc t5 t5-embed" data-reveal>
          <Calculator key={focus ?? "none"} initialTasks={picked?.calc} formal />
        </div>
        <p className="t11-calc-note">{calculatorCopy.cta}</p>
      </section>

      <Faq items={faq.items} title="Ερωτήσεις για το audit και τις τιμές" id="audit-faq" />

      <section className="t8-section" id="book">
        <div className="t11-book">
          <div className="t11-book-side">
            <h2>{finalBand.title}</h2>
            <p>{finalBand.text}</p>
            <ol className="t11-mini-steps">
              {audit.steps.map((s) => (
                <li key={s.n}>
                  <span>{s.n}</span>
                  {s.title}
                </li>
              ))}
            </ol>
            <p className="t11-book-mail">
              Προτιμάτε email; <a href={`mailto:${footerLinks.contact}`}>{footerLinks.contact}</a>
            </p>
          </div>
          <div className="t8-book-form">
            <AuditForm pain={focus} />
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero p={pages.about} />
      <HLine />
      <section className="t8-section t11-first">
        <div className="t8-people t11-people">
          {team.founders.map((f) => (
            <article key={f.name} className="t8-person" data-reveal>
              <div className="t8-portrait" aria-hidden="true">
                <span>{f.initials}</span>
              </div>
              <div className="t8-person-body">
                <h2 className="t8-h3">{f.name}</h2>
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
        <p className="t11-where" data-reveal>
          {team.where}
        </p>
      </section>

      <section className="t8-section">
        <div className="t8-head" data-reveal>
          <h2 className="t8-h2">
            Αρχές <em className="t9-em">συνεργασίας</em>
          </h2>
        </div>
        <ul className="t11-values">
          {values.items.map((v, i) => (
            <li key={v.t} data-reveal>
              <span className="t8-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </li>
          ))}
        </ul>
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
      <FinalBand />
    </>
  );
}

/* ---------------- route entry points ---------------- */
const PAGES = {
  [routes.home]: HomePage,
  [routes.services]: ServicesPage,
  [routes.examples]: ExamplesPage,
  [routes.audit]: AuditPage,
  [routes.about]: AboutPage,
} as const;

export function SitePage({ path }: { path: keyof typeof PAGES }) {
  const show = useSiteGate();
  if (!show) return <ComingSoon />;
  const Page = PAGES[path];
  return (
    <Shell pathname={path}>
      <Page />
    </Shell>
  );
}
