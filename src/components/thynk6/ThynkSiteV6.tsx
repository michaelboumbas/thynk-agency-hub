import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
  about,
  advantage,
  heroV6,
  intro,
  knowHow,
  method,
  processV6,
  solutions,
  sticky,
  v6Assets,
  v6Nav,
  calculator,
  teamV6,
} from "@/content/site-v6";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ParticleMuse } from "./ParticleMuse";
import { AuditCard, ChatCard, TerminalCard } from "./Mocks";
import { Calculator } from "@/components/thynk5/Calculator";
import { ContactView } from "@/components/thynk5/Views";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function scrollToId(id: string, reduced: boolean) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/** Adds .in to every [data-reveal] element as it enters the viewport. */
function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els?.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root]);
}

export function ThynkSiteV6() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [introP, setIntroP] = useState(0);
  const [pageP, setPageP] = useState(0);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stickyOpen, setStickyOpen] = useState(true);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  useReveal(rootRef);

  // The app shell locks html/body scrolling (fixed-viewport v5). v6 is a long page: unlock while mounted.
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

  // Scroll → intro progress + page progress.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rw = runwayRef.current;
        const vh = window.innerHeight;
        if (rw) {
          const total = rw.offsetHeight - vh;
          const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 1;
          progressRef.current = p;
          setIntroP(p);
        }
        const max = document.documentElement.scrollHeight - vh;
        setPageP(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Active section for the sliding nav pill.
  useEffect(() => {
    const ids = v6Nav.map((n) => n.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const measure = useCallback(() => {
    const btn = navRef.current?.querySelector<HTMLButtonElement>(`button[data-id="${active}"]`);
    setPill(btn ? { x: btn.offsetLeft, w: btn.offsetWidth } : null);
  }, [active]);
  useIsoLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Cursor spotlight (fine pointers only).
  useEffect(() => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = spotRef.current;
    if (!el) return;
    el.style.opacity = "1";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [reduced]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id, reduced);
  };

  const skipIntro = () => {
    const rw = runwayRef.current;
    if (!rw) return;
    window.scrollTo({ top: rw.offsetHeight - window.innerHeight + 2, behavior: reduced ? "auto" : "smooth" });
  };

  const headerVisible = introP > 0.92;
  const sloganIn = introP > 0.55;

  return (
    <div className={`t6${menuOpen ? " menu-open" : ""}`} ref={rootRef}>
      <div className="t6-progress" style={{ transform: `scaleX(${pageP})` }} aria-hidden="true" />
      <div className="t6-spot" ref={spotRef} aria-hidden="true">
        <i />
      </div>

      {/* ---------- Header ---------- */}
      <header className={`t6-header${headerVisible ? " show" : ""}`}>
        <button type="button" className="t6-brand" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })} aria-label="Thynk, αρχή">
          <img src={v6Assets.wordmark} alt="Thynk." />
        </button>
        <nav className="t6-nav" ref={navRef} aria-label="Κύρια πλοήγηση">
          <span
            className="t6-pill"
            aria-hidden="true"
            style={pill ? { opacity: 1, width: pill.w, transform: `translateX(${pill.x}px)` } : undefined}
          />
          {v6Nav.map((n) => (
            <button key={n.id} type="button" data-id={n.id} aria-current={active === n.id} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button type="button" className="t6-btn-glow t6-hide-sm" onClick={() => go("contact")}>
          {heroV6.ctaPrimary}
        </button>
        <button
          type="button"
          className="t6-burger"
          aria-label="Μενού"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
        </button>
        <div className="t6-drawer">
          {v6Nav.map((n) => (
            <button key={n.id} type="button" onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
          <button type="button" className="t6-btn-glow" onClick={() => go("contact")}>
            {heroV6.ctaPrimary}
          </button>
        </div>
      </header>

      {/* ---------- Intro runway: particle Muse ---------- */}
      <div className="t6-runway" ref={runwayRef}>
        <div className="t6-stage">
          <ParticleMuse src={v6Assets.points} progressRef={progressRef} reduced={reduced} />
          <p className={`t6-slogan-l${sloganIn ? " in" : ""}`}>{intro.left}</p>
          <p className={`t6-slogan-r${sloganIn ? " in" : ""}`}>{intro.right}</p>
          <div className={`t6-hint${introP > 0.05 ? " gone" : ""}`} aria-hidden="true">
            <span>{intro.hint}</span>
            <i />
          </div>
          <button type="button" className={`t6-skip${introP > 0.9 ? " gone" : ""}`} onClick={skipIntro}>
            {intro.skip}
          </button>
        </div>
      </div>

      <main className="t6-main">
        {/* ---------- Hero ---------- */}
        <section className="t6-hero" id="top">
          <h1 data-reveal>
            {heroV6.headlineTop}
            <br />
            <span>{heroV6.headlineBottom}</span>
          </h1>
          <p className="t6-hero-sub" data-reveal>
            {heroV6.sub}
          </p>
          <div className="t6-video" data-reveal>
            <span className="t6-bar l" aria-hidden="true" />
            <span className="t6-bar r" aria-hidden="true" />
            <div className="t6-video-chip">▶ {heroV6.videoChip}</div>
            <video src={v6Assets.video} poster={v6Assets.poster} autoPlay={!reduced} muted loop playsInline preload="metadata" />
            <div className="t6-video-cap">{heroV6.videoCaption}</div>
          </div>
          <div className="t6-hero-ctas" data-reveal>
            <button type="button" className="t6-btn-glow" onClick={() => go("contact")}>
              {heroV6.ctaPrimary} <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="t6-btn-ghost" onClick={() => go("method")}>
              {heroV6.ctaSecondary} <span aria-hidden="true">↓</span>
            </button>
          </div>
        </section>

        {/* ---------- Marquee ---------- */}
        <div className="t6-marquee" aria-label="Τι ξέρουμε να κάνουμε">
          <div className="t6-marquee-track">
            {[...knowHow, ...knowHow].map((l, i) => (
              <span key={i} aria-hidden={i >= knowHow.length}>
                <b>Ξέρω να</b> {l}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- About ---------- */}
        <section className="t6-section t6-about" id="about">
          <span className="t6-eyebrow" data-reveal>
            About
          </span>
          <h2 data-reveal>{about.headline}</h2>
          <div className="t6-about-body" data-reveal>
            {about.body.map((p) => (
              <p key={p.slice(0, 16)}>{p}</p>
            ))}
          </div>
        </section>

        {/* ---------- Solutions ---------- */}
        <section className="t6-section" id="solutions">
          <span className="t6-eyebrow" data-reveal>
            Solutions
          </span>
          <h2 data-reveal>{solutions.headline}</h2>
          <p className="t6-lead" data-reveal>
            {solutions.intro}
          </p>
          <div className="t6-pillars">
            {solutions.pillars.map((p) => {
              const open = openPillar === p.id;
              return (
                <article key={p.id} className={`t6-card t6-pillar${open ? " open" : ""}`} data-reveal>
                  <span className="t6-tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.sub}</p>
                  <ul className="t6-pillar-groups">
                    {p.groups.map((g) => (
                      <li key={g.title}>{g.title}</li>
                    ))}
                  </ul>
                  <button type="button" className="t6-link" aria-expanded={open} onClick={() => setOpenPillar(open ? null : p.id)}>
                    {open ? "Λιγότερα" : "Δες τι ακριβώς κάνουμε"} <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  <div className="t6-collapse">
                    <div>
                      {p.groups.map((g) => (
                        <div key={g.title} className="t6-group">
                          <span className="t6-mono">{g.title}</span>
                          <ul>
                            {g.items.map((i) => (
                              <li key={i}>{i}</li>
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

        {/* ---------- Process ---------- */}
        <section className="t6-section" id="method">
          <span className="t6-eyebrow" data-reveal>
            {processV6.eyebrow}
          </span>
          <h2 data-reveal>
            {processV6.titleTop}
            <br />
            <span className="t6-dim">{processV6.titleBottom}</span>
          </h2>
          <div className="t6-steps">
            {method.steps.map((s, i) => (
              <div key={s.n} className={`t6-step${i % 2 ? " flip" : ""}`} data-reveal>
                <div className="t6-step-text">
                  <span className="t6-step-n">{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <div className="t6-chips">
                      {s.chips.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="t6-step-mock">
                  {i === 0 && <AuditCard reduced={reduced} />}
                  {i === 1 && <TerminalCard reduced={reduced} />}
                  {i === 2 && <ChatCard reduced={reduced} />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Advantage / rules ---------- */}
        <section className="t6-section t6-center">
          <h2 data-reveal>{advantage.title}</h2>
          <p className="t6-lead" data-reveal>
            {advantage.sub}
          </p>
          <div className="t6-grid3">
            {method.rules.map((r) => (
              <div key={r.title} className="t6-card" data-reveal>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Calculator ---------- */}
        <section className="t6-section" id="calculator">
          <span className="t6-eyebrow" data-reveal>
            Calculator
          </span>
          <h2 data-reveal>{calculator.headline}</h2>
          <p className="t6-lead" data-reveal>
            {calculator.intro}
          </p>
          <div className="t5 t5-embed" data-reveal>
            <Calculator />
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="t6-section t6-faq-wrap">
          <h2 className="t6-center" data-reveal>
            {method.faqTitle}
          </h2>
          <div className="t6-faq">
            {method.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`t6-faq-item${open ? " open" : ""}`} data-reveal>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    {f.q}
                    <span aria-hidden="true">⌄</span>
                  </button>
                  <div className="t6-collapse">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- Team ---------- */}
        <section className="t6-section t6-center">
          <h2 data-reveal>{teamV6.title}</h2>
          <div className="t6-team">
            {about.founders.map((f) => (
              <div key={f.name} className="t6-card t6-person" data-reveal>
                <div className="t6-avatar">{f.initials}</div>
                <h3>{f.name}</h3>
                <p>{f.bio}</p>
              </div>
            ))}
          </div>
          <p className="t6-note-line" data-reveal>
            {teamV6.note}
          </p>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="t6-section" id="contact">
          <div className="t5 t5-embed t5-contact-embed" data-reveal>
            <ContactView />
          </div>
        </section>
      </main>

      {/* ---------- Sticky CTA ---------- */}
      {stickyOpen && headerVisible ? (
        <div className="t6-sticky">
          <span className="t6-live" aria-hidden="true" />
          <span>
            {sticky.text} <b>{sticky.strong}</b>
          </span>
          <button type="button" className="t6-btn-glow sm" onClick={() => go("contact")}>
            {sticky.cta}
          </button>
          <button type="button" className="t6-x" aria-label="Κλείσιμο" onClick={() => setStickyOpen(false)}>
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
