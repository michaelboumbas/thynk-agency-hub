import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { assets, calculator, hero, knowHow, nav, type ViewId } from "@/content/site-v5";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { NetCanvas } from "./NetCanvas";
import { Calculator } from "./Calculator";
import { AboutView, ContactView, MethodView, SolutionsView } from "./Views";

const VIEW_IDS: ViewId[] = ["home", ...nav.map((n) => n.id)];
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Cta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="t5-cta" onClick={onClick}>
      {label} <span className="t5-dot">→</span>
    </button>
  );
}

function Splash({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false);
  const end = useCallback(() => {
    setOut(true);
    setTimeout(onDone, 650);
  }, [onDone]);
  useEffect(() => {
    const t = setTimeout(end, 1800);
    return () => clearTimeout(t);
  }, [end]);
  return (
    <div className={`t5-splash${out ? " out" : ""}`} role="presentation">
      <div className="t5-splash-inner">
        <img className="t5-wm" src={assets.wordmark} alt="Thynk." />
        <div className="t5-tag t5-mono">Digital Agency · Ioannina · Est. 2026</div>
        <div className="t5-splash-bar">
          <i />
        </div>
      </div>
      <button type="button" className="t5-skip" onClick={end}>
        Παράλειψη
      </button>
    </div>
  );
}

export function ThynkSite() {
  const reduced = useReducedMotion();
  const [view, setView] = useState<ViewId>("home");
  const [splash, setSplash] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pose, setPose] = useState(assets.poses.home);
  const [poseVisible, setPoseVisible] = useState(true);
  const [line, setLine] = useState(0);
  const [lineSwap, setLineSwap] = useState(false);
  const [tilt, setTilt] = useState("");
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const tabsRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const museWrapRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  const inner = view !== "home";

  // First load: deep link + splash once per session.
  useEffect(() => {
    const h = window.location.hash.slice(1) as ViewId;
    if (VIEW_IDS.includes(h)) setView(h);
    let seen = false;
    try {
      seen = sessionStorage.getItem("thynk-splash") === "1";
    } catch {
      /* storage unavailable */
    }
    if (!seen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setSplash(true);
  }, []);

  const endSplash = useCallback(() => {
    setSplash(false);
    try {
      sessionStorage.setItem("thynk-splash", "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const go = useCallback((next: ViewId, focusId?: string) => {
    setMenuOpen(false);
    setView(next);
    pendingFocus.current = focusId ?? null;
    try {
      history.replaceState(null, "", next === "home" ? window.location.pathname + window.location.search : `#${next}`);
    } catch {
      /* ignore */
    }
  }, []);

  // Scroll reset + optional focus target after a view change.
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
    const id = pendingFocus.current;
    if (!id) return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      el?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }, 520);
    return () => clearTimeout(t);
  }, [view, reduced]);

  // Muse pose crossfade per view.
  useEffect(() => {
    const next = assets.poses[view];
    if (next === pose) return;
    setPoseVisible(false);
    const t = setTimeout(() => setPose(next), reduced ? 0 : 250);
    return () => clearTimeout(t);
  }, [view, pose, reduced]);

  // Sliding nav pill.
  const measure = useCallback(() => {
    const btn = tabsRef.current?.querySelector<HTMLButtonElement>('button[aria-current="true"]');
    setPill(btn ? { x: btn.offsetLeft, w: btn.offsetWidth } : null);
  }, []);
  useIsoLayoutEffect(measure, [view, measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // "Ξέρω να…" ticker (home only).
  useEffect(() => {
    if (reduced || inner) return;
    let swapT: ReturnType<typeof setTimeout>;
    const t = setInterval(() => {
      setLineSwap(true);
      swapT = setTimeout(() => {
        setLine((l) => (l + 1) % knowHow.length);
        setLineSwap(false);
      }, 350);
    }, 3200);
    return () => {
      clearInterval(t);
      clearTimeout(swapT);
    };
  }, [reduced, inner]);

  // Gentle 3D tilt on the Muse card (fine pointers only).
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = museWrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt(`rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`);
  };

  return (
    <div className={`t5${menuOpen ? " menu-open" : ""}`}>
      {splash && <Splash onDone={endSplash} />}

      <div className="t5-app">
        <header className="t5-nav">
          <button type="button" className="t5-brand" aria-label="Thynk, αρχική" onClick={() => go("home")}>
            <img src={assets.wordmark} alt="Thynk." />
            <small className="t5-mono">Digital Agency</small>
          </button>

          <nav className="t5-tabs" ref={tabsRef} aria-label="Κύρια πλοήγηση">
            <span
              className="t5-pill"
              aria-hidden="true"
              style={pill ? { opacity: 1, width: pill.w, transform: `translateX(${pill.x}px)` } : undefined}
            />
            {nav.map((n) => (
              <button
                key={n.id}
                type="button"
                className="t5-mono"
                aria-current={view === n.id ? "true" : "false"}
                onClick={() => go(n.id)}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <span className="t5-nav-cta">
            <Cta label={hero.ctaPrimary} onClick={() => go("contact", "demo")} />
          </span>

          <button
            type="button"
            className="t5-menu-btn"
            aria-label="Μενού"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
          </button>

          <div className="t5-drawer">
            <button type="button" aria-current={view === "home" ? "true" : "false"} onClick={() => go("home")}>
              Αρχική
            </button>
            {nav.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-current={view === n.id ? "true" : "false"}
                onClick={() => go(n.id)}
              >
                {n.label}
              </button>
            ))}
            <Cta label={hero.ctaPrimary} onClick={() => go("contact", "demo")} />
          </div>
        </header>

        <main className={`t5-stage${inner ? " inner" : ""}`}>
          {/* Home copy */}
          <section className="t5-home" aria-label="Αρχική" aria-hidden={inner}>
            <div className="t5-eyebrow">
              <span className="t5-live" />
              <span className="t5-mono">{hero.eyebrow}</span>
            </div>
            <h1>
              {hero.headlineStart}
              <em>{hero.headlineAccent}</em>
            </h1>
            <p className="t5-lead">{hero.lead}</p>
            <div className="t5-actions">
              <Cta label={hero.ctaPrimary} onClick={() => go("contact", "demo")} />
              <button type="button" className="t5-ghost" onClick={() => go("calculator")}>
                {hero.ctaSecondary}
              </button>
            </div>
            <div className="t5-trust">
              {hero.trust.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </section>

          {/* Pinned Muse visual */}
          <div className="t5-visual" aria-hidden="true" onMouseMove={onMove} onMouseLeave={() => setTilt("")}>
            <div className="t5-panel-bg">
              <NetCanvas reduced={reduced} />
            </div>
            <div className="t5-muse-wrap" ref={museWrapRef}>
              <figure className="t5-muse" style={tilt ? { transform: tilt } : undefined}>
                <img
                  src={pose}
                  alt=""
                  style={{ opacity: poseVisible ? 1 : 0 }}
                  onLoad={() => setPoseVisible(true)}
                />
                <figcaption className="t5-mono">
                  <span className="t5-live" />
                  Muse · online
                </figcaption>
              </figure>
            </div>
            <div className="t5-knows">
              <div className="t5-k-head">
                <span className="t5-mono">Muse</span>
                <b>Ξέρω να…</b>
              </div>
              <p className={lineSwap ? "swap" : undefined}>{knowHow[line]}</p>
            </div>
          </div>

          {/* Inner content */}
          <section className="t5-content" aria-hidden={!inner}>
            <div className="t5-scroller" ref={scrollerRef}>
              <article className="t5-view" key={view}>
                {view === "about" && <AboutView />}
                {view === "solutions" && <SolutionsView />}
                {view === "method" && <MethodView />}
                {view === "calculator" && (
                  <>
                    <span className="t5-mono t5-kicker">Calculator</span>
                    <h2>{calculator.headline}</h2>
                    <p>{calculator.intro}</p>
                    <Calculator />
                  </>
                )}
                {view === "contact" && <ContactView />}
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
