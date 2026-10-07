import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LangProvider, localPath, useCopy } from "./i18n";
import { Link, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import { useSiteGate } from "@/components/thynk11/Site";
import { PlanetField } from "@/components/thynk13/PlanetField";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { v14Routes, type Lang, type V14Path } from "@/content/site-v14";
import { Logo } from "./shared";
import { useCleanMotion } from "./motion";
import { FooterDust } from "./FooterDust";

// Inter for text; TikTok Sans (Grilli Type, has Greek, width 75–150%) for titles — Mike 02/10/2026
const INTER_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=TikTok+Sans:opsz,wdth,wght@12..36,75..150,300..900&display=swap";

/**
 * v14 shell: header (logo · pages · EL/EN · Book an audit), the v13 dot planet behind every page, footer.
 * Two languages: English at /, Greek under /el. <html lang> follows the page. Public host: Coming Soon until launch (same gate as v11).
 */
function Shell({ children, pathname }: { children: ReactNode; pathname: V14Path }) {
  const { c, href, lang } = useCopy();
  const other: Lang = lang === "en" ? "el" : "en";
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });
  const slug = useContext(SlugCtx);
  useCleanMotion(rootRef, slug ? `${pathname}/${slug}` : pathname);

  // the two faces, only for this version
  useEffect(() => {
    if (document.querySelector(`link[href="${INTER_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = INTER_HREF;
    document.head.appendChild(l);
  }, []);

  // <html lang> follows the language of the page
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);

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
    setMenu(false);
    const id = (hash || "").replace(/^#/, "");
    const t = window.setTimeout(() => {
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      else window.scrollTo(0, 0);
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, hash, slug]);

  return (
    <div className="t14" ref={rootRef} lang={lang}>
      <PlanetField reduced={reduced} />
      <a className="t14-skip" href="#main">{c.ui.skip}</a>
      <header className="t14-hdr">
        <Link to={href(v14Routes.home)} aria-label={c.ui.home}><Logo /></Link>
        <span aria-hidden="true" />
        <div className="t14-hdr-r">
          <LangLink className="t14-lang" pathname={pathname} other={other} aria-label={c.ui.switchAria}>
            {c.ui.switchTo}
          </LangLink>
          <Link className="t14-pill" to={href(v14Routes.audit)} hash="book">{c.hero.primary}</Link>
          <button
            ref={burgerRef}
            type="button"
            className="t14-burger"
            aria-expanded={menu}
            aria-label={menu ? c.ui.closeMenu : c.ui.openMenu}
            onClick={() => setMenu((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <MenuOverlay open={menu} pathname={pathname} onClose={() => setMenu(false)} returnRef={burgerRef} />

      <main id="main">
        {children}
        <SiteFooter pathname={pathname} />
      </main>
    </div>
  );
}

/**
 * Full-screen menu (02/10, Mike, after Liberators AI): the page blurs behind a dark veil, the pages stand
 * in a column like a wheel: the active one sharp, the rest tilt away and blur with distance.
 */
function MenuOverlay({ open, pathname, onClose, returnRef }: {
  open: boolean;
  pathname: V14Path;
  onClose: () => void;
  returnRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { c, href, lang } = useCopy();
  const other: Lang = lang === "en" ? "el" : "en";
  const items = [
    { key: "home", label: c.ui.homeLabel, to: v14Routes.home as V14Path, hash: undefined as string | undefined },
    ...c.menu.map((n) => ({ key: n.to, label: n.label, to: n.to as V14Path, hash: undefined as string | undefined })),
  ];
  const current = Math.max(0, items.findIndex((it) => !it.hash && it.to === pathname));
  // the wheel's position, in rows (0 = first item in the middle); turned by scroll / swipe, never by hover
  const [pos, setPos] = useState(current);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setPos(current);
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflowY = prev || "auto";
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      returnRef.current?.focus();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // scroll / swipe turns the wheel; it settles on the nearest row
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !open) return;
    const max = items.length - 1;
    let p = current;
    let snap = 0;
    const set = (v: number) => {
      p = Math.min(max, Math.max(0, v));
      setPos(p);
      window.clearTimeout(snap);
      snap = window.setTimeout(() => setPos((p = Math.round(p))), 160);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      set(p + (e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY) / 160);
    };
    let ty = 0, tp = 0;
    const onStart = (e: TouchEvent) => ((ty = e.touches[0].clientY), (tp = p));
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      set(tp + (ty - e.touches[0].clientY) / 64);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.clearTimeout(snap);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, [open, items.length, current]);

  return (
    <div ref={rootRef} className={`t14-menu${open ? " open" : ""}`} aria-hidden={!open} inert={!open ? true : undefined}>
      <div className="t14-menu-top">
        <Link to={href(v14Routes.home)} aria-label={c.ui.home} onClick={onClose}><Logo /></Link>
        <button ref={closeRef} type="button" className="t14-menu-x" aria-label={c.ui.closeMenu} onClick={onClose}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <nav className="t14-wheel" aria-label={c.ui.mainMenu}>
        {items.map((it, i) => {
          // rows sit on a circle seen edge-on: the middle one furthest out, the rest curve back and tilt
          const d = i - pos;
          const a = Math.abs(d);
          // 10.5° a row (was 15°: 30% flatter); radius set so the rows keep ~1.34em apart, like liberators.ai
          const deg = d * 10.5;
          const th = (deg * Math.PI) / 180;
          const R = 7.35; // em
          const x = (Math.cos(th) - 1) * R;
          const y = Math.sin(th) * R;
          const style = {
            transform: `translate(${x.toFixed(3)}em, calc(${y.toFixed(3)}em - 50%)) rotate(${deg.toFixed(2)}deg)`,
            opacity: Math.max(0.06, 1 - a * 0.26),
            filter: a < 0.05 ? "none" : `blur(${(a * 2.4).toFixed(2)}px)`,
            zIndex: 10 - Math.round(a),
          } as React.CSSProperties;
          return (
            <Link
              key={it.key}
              to={href(it.to)}
              hash={it.hash}
              className={`t14-wheel-i${a < 0.5 ? " on" : ""}`}
              style={style}
              aria-current={!it.hash && it.to === pathname ? "page" : undefined}
              onFocus={() => setPos(i)}
              onClick={onClose}
            >
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="t14-menu-foot">
        <Link className="t14-pill lg" to={href(v14Routes.audit)} hash="book" onClick={onClose}>{c.hero.primary}</Link>
        <LangLink className="t14-menu-lang" pathname={pathname} other={other} aria-label={c.ui.switchAria}>{c.ui.switchTo}</LangLink>
        <a className="t14-menu-mail" href={`mailto:${c.footer.contact}`}>{c.footer.contact}</a>
      </div>
    </div>
  );
}

/**
 * The big footer (03/10, Mike): a dark block that rises over the page. A ticker of what we do, the call
 * to action, pages / contact / office with the live Ioannina time, and a giant THYNK. that rises letter by
 * letter as you reach the bottom (motion.ts, .t14-foot-word).
 */
function SiteFooter({ pathname }: { pathname: V14Path }) {
  const { c, href, lang } = useCopy();
  const f = c.footer;
  const other: Lang = lang === "en" ? "el" : "en";
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(c.locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, [c.locale]);
  const words = [...f.ticker, ...f.ticker];
  return (
    <footer className="t14-foot" id="contact">
      <div className="t14-foot-ticker" aria-hidden="true">
        <div>
          {[0, 1].map((k) => (
            <span key={k}>
              {words.map((w, i) => (
                <em key={i}>{w}<b>✳</b></em>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="t14-foot-in">
        <div className="t14-foot-cta">
          <h2 lang="en">
            {f.ctaA}<span className="t14-dot">.</span>
            <br />
            {f.ctaB}
          </h2>
          <div>
            <p>{c.final.title}</p>
            <div className="t14-foot-act">
              <Link className="t14-pill lg t14-foot-pill" to={href(v14Routes.audit)} hash="book">{c.final.button} <i aria-hidden="true">→</i></Link>
              <a className="t14-foot-mail" href={`mailto:${f.contact}`}>{f.contact}</a>
            </div>
          </div>
        </div>

        <div className="t14-foot-grid">
          <div>
            <h4>{f.pagesLabel}</h4>
            <ul>
              <li><Link to={href(v14Routes.home)}>{c.ui.homeLabel}</Link></li>
              {c.menu.map((n) => (
                <li key={n.to}><Link to={href(n.to)} aria-current={pathname === n.to ? "page" : undefined}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{f.contactLabel}</h4>
            <ul>
              <li><a href={`mailto:${f.contact}`}>{f.contact}</a></li>
              {f.phone && <li><a href={`tel:${f.phone.replace(/\s+/g, "")}`} aria-label={f.phoneLabel}>{f.phone}</a></li>}
              {f.address && <li className="t14-addr">{f.address}</li>}
            </ul>
          </div>
          <div>
            <h4>{f.officeLabel}</h4>
            <ul>
              <li>{f.city}</li>
              <li className="t14-addr">{f.hours}</li>
              <li className="t14-foot-time"><i aria-hidden="true" /> {f.localTime} <b>{now}</b></li>
            </ul>
          </div>
          <div className="t14-foot-top">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={f.backTop}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span>{f.backTop}</span>
          </div>
        </div>
      </div>

      <FooterDust />

      <div className="t14-foot-legal">
        <span>© 2026 Thynk Digital Agency · {f.rights}</span>
        <LangLink pathname={pathname} other={other} aria-label={c.ui.switchAria}>{c.ui.switchTo}</LangLink>
      </div>
    </footer>
  );
}

/** a case page (/work/:slug) passes its slug down, so the EL/EN switch lands on the same case (07/10) */
const SlugCtx = createContext<string | undefined>(undefined);

/** the EL/EN switch: the same page in the other language */
function LangLink({ pathname, other, children, ...rest }: {
  pathname: V14Path;
  other: Lang;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const slug = useContext(SlugCtx);
  if (slug) {
    return (
      <Link to={other === "el" ? "/el/work/$slug" : "/work/$slug"} params={{ slug }} hrefLang={other} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={localPath(pathname, other)} hrefLang={other} {...rest}>
      {children}
    </Link>
  );
}

export function CleanShell({ pathname, lang, slug, children }: {
  pathname: V14Path;
  lang: Lang;
  /** set on case pages: /work/:slug */
  slug?: string;
  children: ReactNode;
}) {
  const show = useSiteGate();
  if (!show) return <ComingSoon />;
  return (
    <LangProvider lang={lang}>
      <SlugCtx.Provider value={slug}>
        <Shell pathname={pathname}>{children}</Shell>
      </SlugCtx.Provider>
    </LangProvider>
  );
}
