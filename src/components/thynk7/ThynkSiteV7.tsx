import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  about,
  calculator,
  epirus,
  footerV7,
  heroV7,
  method,
  notDo,
  pains,
  pinnedV6,
  solutions,
  teamV7,
  v7Assets,
  v7Nav,
  type PainId,
} from "@/content/site-v7";
import { processV6 } from "@/content/site-v6";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ParticleMuse } from "@/components/thynk6/ParticleMuse";
import { AuditCard, ChatCard, TerminalCard } from "@/components/thynk6/Mocks";
import { usePinnedIndex } from "@/components/thynk6/Pinned";
import { Calculator } from "@/components/thynk5/Calculator";
import { ContactView } from "@/components/thynk5/Views";

/**
 * v7 — "Thynk Light": the site that thinks with you.
 * White paper, ink and orange (brand file 07). It opens with a question, not a presentation:
 * the visitor picks what eats their week, the Muse answers, and the rest of the page reorders
 * around that answer (first outcome, highlighted door, pre-filled calculator).
 */

function scrollToId(id: string, reduced: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/** data-in (not a class) so React re-renders never hide an element again */
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
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root, dep]);
}

/** Types a string out, a few characters per frame. */
function useTyped(text: string, reduced: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced) {
      setN(text.length);
      return;
    }
    setN(0);
    const t = setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), 18);
    return () => clearInterval(t);
  }, [text, reduced]);
  return text.slice(0, n);
}

function Wordmark() {
  return (
    <span className="t7-word" aria-label="Thynk">
      THYNK<i>.</i>
    </span>
  );
}

export function ThynkSiteV7() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pain, setPain] = useState<PainId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPillar, setOpenPillar] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const formRef = useRef(0);
  const inkRef = useRef(1); // the ink Muse is already drawn when the lights come on
  const runwayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const camRef = useRef({ rot: 0, zoom: 1, shift: 0.17, lift: 0 });

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

  // Dark 3D stage: scroll moves a camera (closer, turning to profile, drifting to centre), the
  // headline steps back, and at the end a sheet of paper rises: the lights come on.
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rw = runwayRef.current;
        const vh = window.innerHeight;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (!rw) return;
        const total = rw.offsetHeight - vh;
        const sp = total > 0 ? Math.min(1, Math.max(0, y / total)) : 1;
        const small = window.innerWidth < 900;
        const e = sp * sp * (3 - 2 * sp);
        camRef.current = {
          rot: reduced ? 0 : e * 1.05,
          zoom: 1 + (reduced ? 0 : e * 0.32),
          shift: small ? 0 : 0.17 * (1 - e),
          // as the camera closes in, lower her so the head (not the shoulders) stays in frame
          lift: (small ? 0.03 : 0) + (reduced ? 0 : e * 0.13),
        };
        const t = heroTextRef.current;
        if (t && !reduced) {
          t.style.opacity = String(Math.max(0, 1 - sp * 2.2));
          t.style.transform = `translateY(${-sp * 90}px)`;
        }
        // the light page itself slides up over the pinned dark stage (no empty white screen)
        const ask = document.getElementById("ask");
        setOnDark(ask ? ask.getBoundingClientRect().top > 60 : y < rw.offsetHeight - 70);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [reduced]);

  // cursor light on the dark stage (fine pointers only): reveals the Muse like a torch
  useEffect(() => {
    const el = spotRef.current;
    if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.style.opacity = "1";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);

  // the Muse draws herself on load (no scroll-gated intro: the promise is readable at once)
  useEffect(() => {
    if (reduced) {
      formRef.current = 1;
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      formRef.current = Math.min(1, (now - t0) / 2600);
      if (formRef.current < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const picked = pains.find((p) => p.id === pain) ?? null;
  const reply = useTyped(picked?.reply ?? "", reduced);
  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id, reduced);
  };

  return (
    <div className="t7" ref={rootRef} lang="el">
      <a className="t7-skiplink" href="#main">
        Μετάβαση στο περιεχόμενο
      </a>

      {/* ---------- Header ---------- */}
      <header className={`t7-header${scrolled ? " scrolled" : ""}${onDark ? " on-dark" : ""}`}>
        <button type="button" className="t7-brand" onClick={() => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}>
          <Wordmark />
        </button>
        <nav className="t7-nav" aria-label="Κύριο μενού">
          {v7Nav.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button type="button" className="t7-btn t7-btn-sm" onClick={() => go("contact")}>
          Κλείσε Demo
        </button>
        <button
          type="button"
          className="t7-burger"
          aria-label={menuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </header>
      {menuOpen && (
        <div className="t7-sheet" role="dialog" aria-label="Μενού">
          {v7Nav.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
          <button type="button" className="t7-btn" onClick={() => go("contact")}>
            Κλείσε Demo →
          </button>
        </div>
      )}

      <main id="main">
        {/* ---------- Dark 3D stage: the glowing Muse, a cursor torch, a camera on scroll ---------- */}
        <div className="t7-runway" ref={runwayRef} id="top">
          <div className="t7-stage">
            <div className="t7-stage-glow" aria-hidden="true" />
            <ParticleMuse src={v7Assets.points} progressRef={formRef} reduced={reduced} camRef={camRef} />
            <div className="t7-torch" ref={spotRef} aria-hidden="true">
              <i />
            </div>
            <div className="t7-stage-text" ref={heroTextRef}>
              <span className="t7-eyebrow">{heroV7.eyebrow}</span>
              <h1 className="t7-display t7-stage-h1">
                {heroV7.headlineTop.split(" ").map((w, i) => (
                  <span key={`a${i}`} className="t7-word-in" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                    {w}{" "}
                  </span>
                ))}
                <br />
                <span className="t7-under-glow">
                  {heroV7.headlineBottom.split(" ").map((w, i) => (
                    <span key={`b${i}`} className="t7-word-in" style={{ animationDelay: `${0.45 + i * 0.12}s` }}>
                      {w}{" "}
                    </span>
                  ))}
                </span>
              </h1>
              <p className="t7-stage-sub">{heroV7.sub}</p>
              <div className="t7-stage-ctas">
                <button type="button" className="t7-btn" onClick={() => go("contact")}>
                  Κλείσε Demo <span aria-hidden="true">→</span>
                </button>
                <button type="button" className="t7-btn t7-btn-dark" onClick={() => go("ask")}>
                  {heroV7.question.replace(" πιο πολύ αυτή την εβδομάδα", "")} <span aria-hidden="true">↓</span>
                </button>
              </div>
              <p className="t7-stage-founders">{heroV7.founders}</p>
            </div>
            <div className="t7-scrollcue" aria-hidden="true">
              <span>scroll</span>
              <i />
            </div>
          </div>
        </div>

        {/* ---------- The question: the page thinks with you ---------- */}
        <section className="t7-ask-sec" id="ask">
          <div className="t7-ask-wrap">
            <div className="t7-ask">
              <span className="t7-eyebrow">Ας ξεκινήσουμε από σένα</span>
              <h2 className="t7-ask-q">{heroV7.question}</h2>
              <p className="t7-ask-hint">{heroV7.questionHint}</p>
              <div className="t7-chips" role="group" aria-label={heroV7.question}>
                {pains.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={pain === p.id ? "on" : undefined}
                    aria-pressed={pain === p.id}
                    onClick={() => setPain(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {picked && (
                <div className="t7-reply" aria-live="polite">
                  <span className="t7-reply-who">
                    <i aria-hidden="true" /> {heroV7.museLabel}
                  </span>
                  <p>
                    {reply}
                    {reply.length < picked.reply.length && <span className="t7-caret" aria-hidden="true" />}
                  </p>
                  <div className="t7-reply-ctas">
                    <button type="button" className="t7-btn" onClick={() => go("calculator")}>
                      {heroV7.ctaCalc} <span aria-hidden="true">↓</span>
                    </button>
                    <button type="button" className="t7-btn t7-btn-ghost" onClick={() => go("contact")}>
                      {heroV7.ctaTalk} <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="t7-ask-muse" aria-hidden="true">
              <ParticleMuse src={v7Assets.points} progressRef={inkRef} reduced={reduced} ink box />
            </div>
          </div>
        </section>

        {/* ---------- Pinned: "Φαντάσου τη δουλειά σου, όταν…" (their pain first) ---------- */}
        <Imagine reduced={reduced} first={picked?.outcome ?? null} />

        {/* ---------- About + founders ---------- */}
        <section className="t7-section" id="about">
          <span className="t7-eyebrow" data-reveal>
            {teamV7.eyebrow}
          </span>
          <h2 className="t7-h2" data-reveal>
            {about.headline}
          </h2>
          <div className="t7-about" data-reveal>
            {about.body.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
          <div className="t7-founders">
            {about.founders.map((f) => (
              <article key={f.name} className="t7-founder" data-reveal>
                <span className="t7-avatar" aria-hidden="true">
                  {f.initials}
                </span>
                <div>
                  <h3>{f.name}</h3>
                  <p>{f.bio}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="t7-note" data-reveal>
            {teamV7.note}
          </p>
        </section>

        {/* ---------- Two doors ---------- */}
        <section className="t7-section" id="solutions">
          <span className="t7-eyebrow" data-reveal>
            Τι κάνουμε
          </span>
          <h2 className="t7-h2" data-reveal>
            {solutions.headline}
          </h2>
          <p className="t7-lead" data-reveal>
            {solutions.intro}
          </p>
          <div className="t7-doors">
            {solutions.pillars.map((p, i) => {
              const open = openPillar === p.id;
              const forYou = picked?.pillar === p.id;
              return (
                <article key={p.id} className={`t7-door${open ? " open" : ""}${forYou ? " for-you" : ""}`} data-reveal>
                  <div className="t7-door-top">
                    <span className="t7-door-n">{String(i + 1).padStart(2, "0")}</span>
                    {forYou && <span className="t7-for-you">Γι' αυτό που σε τρώει</span>}
                  </div>
                  <span className="t7-tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.sub}</p>
                  <ul className="t7-door-groups">
                    {p.groups.map((g) => (
                      <li key={g.title}>{g.title}</li>
                    ))}
                  </ul>
                  <button type="button" className="t7-link" aria-expanded={open} onClick={() => setOpenPillar(open ? null : p.id)}>
                    {open ? "Λιγότερα" : "Δες τι ακριβώς κάνουμε"} <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  <div className="t7-collapse">
                    <div>
                      {p.groups.map((g) => (
                        <div key={g.title} className="t7-group">
                          <span className="t7-mono">{g.title}</span>
                          <ul>
                            {g.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                            {"note" in g && g.note ? <li className="no">{g.note}</li> : null}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- Method (pinned) ---------- */}
        <Method reduced={reduced} />

        {/* ---------- What we don't do ---------- */}
        <section className="t7-section t7-notdo">
          <span className="t7-eyebrow" data-reveal>
            {notDo.eyebrow}
          </span>
          <h2 className="t7-h2" data-reveal>
            {notDo.title}
          </h2>
          <ul className="t7-notdo-list">
            {notDo.items.map((it) => (
              <li key={it.no} data-reveal>
                <s>{it.no}</s>
                <span>{it.yes}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- AI rules ---------- */}
        <section className="t7-section">
          <span className="t7-eyebrow" data-reveal>
            AI, με όρους
          </span>
          <h2 className="t7-h2" data-reveal>
            {method.rulesTitle}
          </h2>
          <div className="t7-rules">
            {method.rules.map((r, i) => (
              <article key={r.title} className="t7-rule" data-reveal>
                <span className="t7-rule-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Calculator (pre-filled with their pain) ---------- */}
        <section className="t7-section" id="calculator">
          <span className="t7-eyebrow" data-reveal>
            Υπολογιστής
          </span>
          <h2 className="t7-h2" data-reveal>
            {calculator.headline}
          </h2>
          <p className="t7-lead" data-reveal>
            {calculator.intro}
          </p>
          <div className="t5 t5-embed" data-reveal>
            <Calculator key={pain ?? "none"} initialTasks={picked?.calc} />
          </div>
        </section>

        {/* ---------- Epirus ---------- */}
        <section className="t7-section t7-epirus">
          <div data-reveal>
            <span className="t7-eyebrow">{epirus.eyebrow}</span>
            <h2 className="t7-h2">{epirus.title}</h2>
            <p className="t7-lead">{epirus.text}</p>
          </div>
          <EpirusMap />
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="t7-section">
          <span className="t7-eyebrow" data-reveal>
            FAQ
          </span>
          <h2 className="t7-h2" data-reveal>
            {method.faqTitle}
          </h2>
          <div className="t7-faq">
            {method.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`t7-faq-item${open ? " open" : ""}`} data-reveal>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    {f.q}
                    <span aria-hidden="true">+</span>
                  </button>
                  {open && <p>{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="t7-section" id="contact">
          <div className="t5 t5-embed t5-contact-embed" data-reveal>
            <ContactView />
          </div>
        </section>
      </main>

      <footer className="t7-footer">
        <Wordmark />
        <span>{footerV7.line}</span>
        <span className="t7-faint">{footerV7.small}</span>
      </footer>
    </div>
  );
}

/** "Φαντάσου τη δουλειά σου, όταν…" — pinned; the visitor's pain comes first, the closer stays last. */
function Imagine({ reduced, first }: { reduced: boolean; first: number | null }) {
  const base = pinnedV6.knowHow.items;
  const items = useMemo(() => {
    const idx = base.map((_, i) => i);
    const last = idx.pop() as number;
    if (first !== null && first !== last) {
      idx.splice(idx.indexOf(first), 1);
      idx.unshift(first);
    }
    return [...idx, last].map((i) => base[i]);
  }, [base, first]);
  const n = items.length;
  const [ref, active] = usePinnedIndex(n, reduced);
  return (
    <section
      ref={ref}
      className={`t7-pin t7-imagine${reduced ? " static" : ""}`}
      style={reduced ? undefined : { height: `${100 + n * 24}vh` }}
      aria-label={pinnedV6.knowHow.title}
    >
      <div className="t7-pin-stage">
        <div className="t7-pin-inner">
          <span className="t7-eyebrow">{pinnedV6.knowHow.eyebrow}</span>
          <h2 className="t7-display t7-imagine-title">{pinnedV6.knowHow.title}</h2>
          <ol className="t7-imagine-list">
            {items.map((t, k) => {
              const cls = reduced || k === active ? "on" : k < active ? "past" : "";
              return (
                <li key={t} className={cls}>
                  {k === n - 1 ? <small>{pinnedV6.knowHow.lastLabel}</small> : null}
                  {t}
                </li>
              );
            })}
          </ol>
        </div>
        {!reduced && (
          <div className="t7-pin-count" aria-hidden="true">
            <b>{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
          </div>
        )}
      </div>
    </section>
  );
}

/** Method — pinned; the three steps change in place with their live example card. */
function Method({ reduced }: { reduced: boolean }) {
  const steps = method.steps;
  const n = steps.length;
  const [ref, idx] = usePinnedIndex(n, reduced);
  const mock = (i: number) =>
    i === 0 ? <AuditCard reduced={reduced} /> : i === 1 ? <TerminalCard reduced={reduced} /> : <ChatCard reduced={reduced} />;
  const shown = reduced ? steps.map((_, i) => i) : [idx];
  return (
    <section
      ref={ref}
      className={`t7-pin t7-method${reduced ? " static" : ""}`}
      id="method"
      style={reduced ? undefined : { height: `${100 + n * 50}vh` }}
    >
      <div className="t7-pin-stage">
        <div className="t7-method-grid">
          <div>
            <span className="t7-eyebrow">Πώς δουλεύουμε</span>
            <h2 className="t7-display t7-method-title">
              {processV6.titleTop}
              <br />
              <span className="t7-grey">{processV6.titleBottom}</span>
            </h2>
            <div className="t7-dots" aria-hidden="true">
              {steps.map((s, i) => (
                <i key={s.n} className={i === idx ? "on" : i < idx ? "past" : undefined} />
              ))}
            </div>
            {shown.map((i) => (
              <div key={i} className="t7-step" aria-live="polite">
                <span className="t7-step-n">
                  {steps[i].n}
                  <em>/ 0{n}</em>
                </span>
                <h3>{steps[i].title}</h3>
                <p>{steps[i].text}</p>
                <div className="t7-mini-chips">
                  {steps[i].chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!reduced && (
            <div className="t7-method-mock" key={`m${idx}`}>
              {mock(idx)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Line/dot map of Epirus: a dot field plus real towns (lat/lon projected), Ioannina marked. */
function EpirusMap() {
  const W = 520;
  const H = 520;
  const lon0 = 20.05;
  const lon1 = 21.45;
  const lat0 = 38.85;
  const lat1 = 40.2;
  const k = Math.cos((39.5 * Math.PI) / 180);
  const px = (lon: number) => 40 + ((lon - lon0) / (lon1 - lon0)) * (W - 80) * k * 1.25;
  const py = (lat: number) => 30 + ((lat1 - lat) / (lat1 - lat0)) * (H - 60);
  const home = epirus.places.find((p) => p.home)!;
  const dots = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = [];
    const hx = px(home.lon);
    const hy = py(home.lat);
    for (let y = 20; y < H; y += 16)
      for (let x = 20; x < W; x += 16) {
        const d = Math.hypot(x - hx, y - hy);
        if (d < 250) out.push({ x, y, o: Math.max(0.08, 0.5 - d / 520) });
      }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <figure className="t7-map" data-reveal>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Χάρτης: Ιωάννινα στο κέντρο της Ηπείρου">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.6} className="t7-map-dot" style={{ opacity: d.o }} />
        ))}
        {epirus.places
          .filter((p) => !p.home)
          .map((p) => (
            <line key={`l${p.name}`} x1={px(home.lon)} y1={py(home.lat)} x2={px(p.lon)} y2={py(p.lat)} className="t7-map-line" />
          ))}
        {epirus.places.map((p) => (
          <g key={p.name} transform={`translate(${px(p.lon)},${py(p.lat)})`}>
            {p.home && <circle r={18} className="t7-map-pulse" />}
            <circle r={p.home ? 7 : 4} className={p.home ? "t7-map-home" : "t7-map-town"} />
            <text x={p.home ? 14 : 9} y={4} className={p.home ? "t7-map-label home" : "t7-map-label"}>
              {p.name}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
