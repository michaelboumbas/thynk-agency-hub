import { useEffect, useRef, useState, type ReactNode } from "react";
import { LangProvider, localPath, useCopy } from "./i18n";
import { Link, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import { useSiteGate } from "@/components/thynk11/Site";
import { PlanetField } from "@/components/thynk13/PlanetField";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { v14Routes, type Lang, type V14Path } from "@/content/site-v14";
import { Logo } from "./shared";
import { useCleanMotion } from "./motion";

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
  const hash = useRouterState({ select: (s) => s.location.hash });
  useCleanMotion(rootRef, pathname);

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
  }, [pathname, hash]);

  return (
    <div className="t14" ref={rootRef} lang={lang}>
      <PlanetField reduced={reduced} />
      <a className="t14-skip" href="#main">{c.ui.skip}</a>
      <header className="t14-hdr">
        <Link to={href(v14Routes.home)} aria-label={c.ui.home}><Logo /></Link>
        <nav className={`t14-nav${menu ? " open" : ""}`} aria-label={c.ui.mainMenu}>
          {c.menu.map((n) => (
            <Link key={n.to} to={href(n.to)} className={pathname === n.to ? "on" : ""} aria-current={pathname === n.to ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
          <Link className="t14-pill lg t14-nav-cta" to={href(v14Routes.audit)} hash="book">{c.hero.primary}</Link>
        </nav>
        <div className="t14-hdr-r">
          <Link className="t14-lang" to={localPath(pathname, other)} hrefLang={other} aria-label={c.ui.switchAria}>
            {c.ui.switchTo}
          </Link>
          <Link className="t14-pill" to={href(v14Routes.audit)} hash="book">{c.hero.primary}</Link>
          <button
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

      <main id="main">
        {children}
        <footer className="t14-footer t14-wrap">
          <Link to={href(v14Routes.home)} aria-label={c.ui.home}><Logo size={26} /></Link>
          <div>
            <h4>Thynk</h4>
            <ul>
              {c.menu.map((n) => (
                <li key={n.to}><Link to={href(n.to)}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{c.footer.contactLabel}</h4>
            <ul><li><a href={`mailto:${c.footer.contact}`}>{c.footer.contact}</a></li></ul>
          </div>
          <div className="t14-legal"><b>Thynk Digital Agency</b><br />{c.footer.city}<br />{c.footer.year}</div>
        </footer>
      </main>
    </div>
  );
}

export function CleanShell({ pathname, lang, children }: { pathname: V14Path; lang: Lang; children: ReactNode }) {
  const show = useSiteGate();
  if (!show) return <ComingSoon />;
  return (
    <LangProvider lang={lang}>
      <Shell pathname={pathname}>{children}</Shell>
    </LangProvider>
  );
}
