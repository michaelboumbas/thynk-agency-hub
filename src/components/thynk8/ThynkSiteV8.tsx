import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  about,
  calculator,
  commitments,
  ctaBand,
  epirus,
  extraFaq,
  footerV8,
  forWhom,
  heroV8,
  method,
  methodV8,
  pains,
  promiseStats,
  servicesV8,
  solutions,
  teamV8,
  v8Assets,
  v8Nav,
  type PainId,
} from "@/content/site-v8";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Calculator } from "@/components/thynk5/Calculator";
import { ContactView } from "@/components/thynk5/Views";

/**
 * v8 — "Thynk Clear". Calm, light and card-based (style benchmark: sleed.com), written for
 * business owners. No dark intro and no particle Muse: she appears as her real render.
 * Personality stays in the copy, the orange, the "where do you lose time" chips and the calculator.
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

/** Minimal line icons (24px, stroke = currentColor). */
function Icon({ name }: { name: string }) {
  const p: Record<string, ReactNode> = {
    hotel: (
      <>
        <path d="M3 21V7l9-4 9 4v14" />
        <path d="M9 21v-5h6v5M8 10h2M14 10h2" />
      </>
    ),
    office: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    store: (
      <>
        <path d="M4 9l1.5-5h13L20 9" />
        <path d="M4 9h16v2a3 3 0 0 1-5.3 2 3 3 0 0 1-5.4 0A3 3 0 0 1 4 11z" />
        <path d="M6 13.5V21h12v-7.5" />
      </>
    ),
    marketing: (
      <>
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M15 8h5v5" />
      </>
    ),
    transformation: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };
  return (
    <svg className="t8-icon" viewBox="0 0 24 24" aria-hidden="true">
      {p[name]}
    </svg>
  );
}

export function ThynkSiteV8() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pain, setPain] = useState<PainId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<string | null>("marketing");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [imgSrc, setImgSrc] = useState(v8Assets.muse);

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

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const picked = pains.find((p) => p.id === pain) ?? null;
  const faq = useMemo(() => [...method.faq, ...extraFaq], []);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id, reduced);
  };

  return (
    <div className="t8" ref={rootRef}>
      <a className="t8-skip" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>

      {/* ---------- Header ---------- */}
      <header className={`t8-header${scrolled ? " scrolled" : ""}`}>
        <button type="button" className="t8-brand" onClick={() => go("top")} aria-label="Thynk, αρχή σελίδας">
          <Wordmark />
        </button>
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
            href="#contact"
            className="t8-btn t8-btn-sm t8-nav-cta"
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
          >
            {heroV8.ctaPrimary}
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
        {/* ---------- Hero ---------- */}
        <section className="t8-hero" id="top">
          <div className="t8-blob t8-blob-a" aria-hidden="true" />
          <div className="t8-blob t8-blob-b" aria-hidden="true" />
          <div className="t8-hero-grid">
            <div className="t8-hero-text">
              <span className="t8-eyebrow">{heroV8.eyebrow}</span>
              <h1 className="t8-h1">
                {heroV8.headlineStart}
                <em>{heroV8.headlineAccent}</em>
              </h1>
              <p className="t8-sub">{heroV8.sub}</p>
              <div className="t8-ctas">
                <button type="button" className="t8-btn" onClick={() => go("contact")}>
                  {heroV8.ctaPrimary}
                  <Icon name="arrow" />
                </button>
                <button type="button" className="t8-btn t8-btn-ghost" onClick={() => go("calculator")}>
                  {heroV8.ctaSecondary}
                </button>
              </div>
            </div>
            <figure className="t8-muse">
              <img
                src={imgSrc}
                onError={() => setImgSrc(v8Assets.museFallback)}
                alt="Η Μούσα, το ψηφιακό πρόσωπο της Thynk: γυναικείο android με πορτοκαλί κυκλώματα στο πρόσωπο"
                width={900}
                height={1205}
                fetchPriority="high"
              />
              <figcaption>{heroV8.museCaption}</figcaption>
            </figure>
          </div>

          {/* where do you lose time: picks pre-fill the calculator */}
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
                <button type="button" className="t8-link" onClick={() => go("calculator")}>
                  Δες πόσο σου κοστίζει <Icon name="arrow" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ---------- Commitments strip (in place of partner logos) ---------- */}
        <section className="t8-strip" aria-label="Οι δεσμεύσεις μας">
          <ul>
            {commitments.map((c) => (
              <li key={c}>
                <Icon name="check" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- For whom ---------- */}
        <section className="t8-section" id="for-whom">
          <Head eyebrow={forWhom.eyebrow} title={forWhom.title} lead={forWhom.lead} />
          <div className="t8-cards3">
            {forWhom.segments.map((s) => (
              <article key={s.title} className="t8-card" data-reveal>
                <span className="t8-icon-box">
                  <Icon name={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p className="t8-muted">{s.who}</p>
                <p>{s.pain}</p>
                <p className="t8-start">
                  <span>Συνήθως ξεκινάμε από</span>
                  {s.start}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Services accordion ---------- */}
        <section className="t8-section" id="services">
          <Head eyebrow={servicesV8.eyebrow} title={servicesV8.title} lead={servicesV8.lead} />
          <div className="t8-acc">
            {solutions.pillars.map((p) => {
              const open = openPillar === p.id;
              const highlighted = picked?.pillar === p.id;
              return (
                <div
                  key={p.id}
                  className={`t8-acc-item${open ? " open" : ""}${highlighted ? " hl" : ""}`}
                  data-reveal
                >
                  <button
                    type="button"
                    className="t8-acc-head"
                    aria-expanded={open}
                    aria-controls={`pillar-${p.id}`}
                    onClick={() => setOpenPillar(open ? null : p.id)}
                  >
                    <span className="t8-icon-box">
                      <Icon name={p.id} />
                    </span>
                    <span className="t8-acc-title">
                      <span className="t8-tag">{p.tag}</span>
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
                          {"note" in g && g.note && <p className="t8-note">{g.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Method ---------- */}
        <section className="t8-section" id="method">
          <Head eyebrow={methodV8.eyebrow} title={method.headline} lead={method.intro} />
          <ol className="t8-steps">
            {method.steps.map((s, i) => (
              <li key={s.n} className="t8-card t8-step" data-reveal>
                <span className="t8-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="t8-pills">
                  {s.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <p className="t8-decide">{methodV8.decisions[i]}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Promise stats ---------- */}
        <section className="t8-section t8-band">
          <div className="t8-blob t8-blob-c" aria-hidden="true" />
          <Head eyebrow={promiseStats.eyebrow} title={promiseStats.title} lead={promiseStats.lead} center />
          <div className="t8-stats">
            {promiseStats.items.map((s) => (
              <div key={s.label} className="t8-card t8-stat" data-reveal>
                <strong>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Calculator ---------- */}
        <section className="t8-section" id="calculator">
          <Head eyebrow="Υπολογιστής" title={calculator.headline} lead={calculator.intro} />
          <div className="t8-card t8-calc t5 t5-embed" data-reveal>
            <Calculator key={pain ?? "none"} initialTasks={picked?.calc} />
          </div>
        </section>

        {/* ---------- AI rules ---------- */}
        <section className="t8-section">
          <Head eyebrow="AI με όρια" title={method.rulesTitle} />
          <div className="t8-cards3">
            {method.rules.map((r) => (
              <article key={r.title} className="t8-card" data-reveal>
                <span className="t8-icon-box">
                  <Icon name="check" />
                </span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Team + Epirus ---------- */}
        <section className="t8-section" id="team">
          <Head eyebrow={teamV8.eyebrow} title={teamV8.title} lead={teamV8.note} />
          <div className="t8-team">
            <div className="t8-founders">
              {about.founders.map((f) => (
                <article key={f.name} className="t8-card t8-founder" data-reveal>
                  <span className="t8-avatar" aria-hidden="true">
                    {f.initials}
                  </span>
                  <div>
                    <h3>{f.name}</h3>
                    <p>{f.bio}</p>
                  </div>
                </article>
              ))}
              <p className="t8-muted t8-epirus-text" data-reveal>
                {epirus.text}
              </p>
            </div>
            <EpirusMap />
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="t8-section t8-narrow">
          <Head eyebrow="FAQ" title={method.faqTitle} center />
          <div className="t8-faq">
            {faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`t8-faq-item${open ? " open" : ""}`} data-reveal>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    {f.q}
                    <span className="t8-plus" aria-hidden="true" />
                  </button>
                  {open && <p>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- CTA band + contact ---------- */}
        <section className="t8-section" id="contact">
          <div className="t8-cta-band" data-reveal>
            <h2>{ctaBand.title}</h2>
            <p>{ctaBand.text}</p>
          </div>
          <div className="t8-card t5 t5-embed t8-contact" data-reveal>
            <ContactView />
          </div>
        </section>
      </main>

      <footer className="t8-footer">
        <Wordmark />
        <span>{footerV8.line}</span>
        <span className="t8-muted">{footerV8.small}</span>
      </footer>
    </div>
  );
}

function Head({ eyebrow, title, lead, center }: { eyebrow: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={`t8-head${center ? " center" : ""}`} data-reveal>
      <span className="t8-eyebrow">{eyebrow}</span>
      <h2 className="t8-h2">{title}</h2>
      <span className="t8-rule" aria-hidden="true" />
      {lead && <p className="t8-lead">{lead}</p>}
    </div>
  );
}

function EpirusMap() {
  const W = 480;
  const H = 440;
  const lon0 = 20.05;
  const lon1 = 21.45;
  const lat0 = 38.85;
  const lat1 = 40.2;
  const k = Math.cos((39.5 * Math.PI) / 180);
  const px = (lon: number) => 40 + ((lon - lon0) / (lon1 - lon0)) * (W - 80) * k * 1.25;
  const py = (lat: number) => 26 + ((lat1 - lat) / (lat1 - lat0)) * (H - 52);
  const home = epirus.places.find((p) => p.home)!;
  const dots = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = [];
    const hx = px(home.lon);
    const hy = py(home.lat);
    for (let y = 16; y < H; y += 16)
      for (let x = 16; x < W; x += 16) {
        const d = Math.hypot(x - hx, y - hy);
        if (d < 230) out.push({ x, y, o: Math.max(0.08, 0.45 - d / 520) });
      }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <figure className="t8-card t8-map" data-reveal>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Χάρτης: Ιωάννινα στο κέντρο της Ηπείρου">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.5} className="t8-map-dot" style={{ opacity: d.o }} />
        ))}
        {epirus.places
          .filter((p) => !p.home)
          .map((p) => (
            <line key={`l${p.name}`} x1={px(home.lon)} y1={py(home.lat)} x2={px(p.lon)} y2={py(p.lat)} className="t8-map-line" />
          ))}
        {epirus.places.map((p) => (
          <g key={p.name} transform={`translate(${px(p.lon)},${py(p.lat)})`}>
            {p.home && <circle r={16} className="t8-map-pulse" />}
            <circle r={p.home ? 6.5 : 4} className={p.home ? "t8-map-home" : "t8-map-town"} />
            <text x={p.home ? 13 : 8} y={4} className={p.home ? "t8-map-label home" : "t8-map-label"}>
              {p.name}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
