import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import { useSiteGate } from "@/components/thynk11/Site";
import { PlanetField } from "@/components/thynk13/PlanetField";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { v14Footer, v14Hero, v14Menu, v14Routes } from "@/content/site-v14";
import { Logo } from "./shared";
import { useCleanMotion } from "./motion";

const INTER_HREF = "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap";

/**
 * v14 shell: header (logo · pages · Book an audit), the v13 dot planet behind every page, footer.
 * English site: <html lang> is "en" while it is mounted. Public host: Coming Soon until launch (same gate as v11).
 */
function Shell({ children, pathname }: { children: ReactNode; pathname: string }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const hash = useRouterState({ select: (s) => s.location.hash });
  useCleanMotion(rootRef, pathname);

  // Inter, only for this version
  useEffect(() => {
    if (document.querySelector(`link[href="${INTER_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = INTER_HREF;
    document.head.appendChild(l);
  }, []);

  // the site is in English
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = "en";
    return () => {
      document.documentElement.lang = prev;
    };
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
    <div className="t14" ref={rootRef} lang="en">
      <PlanetField reduced={reduced} />
      <a className="t14-skip" href="#main">Skip to content</a>
      <header className="t14-hdr">
        <Link to={v14Routes.home} aria-label="Thynk, home"><Logo /></Link>
        <nav className={`t14-nav${menu ? " open" : ""}`} aria-label="Main menu">
          {v14Menu.map((n) => (
            <Link key={n.to} to={n.to} className={pathname === n.to ? "on" : ""} aria-current={pathname === n.to ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
          <Link className="t14-pill lg t14-nav-cta" to={v14Routes.audit} hash="book">{v14Hero.primary}</Link>
        </nav>
        <div className="t14-hdr-r">
          <Link className="t14-pill" to={v14Routes.audit} hash="book">{v14Hero.primary}</Link>
          <button
            type="button"
            className="t14-burger"
            aria-expanded={menu}
            aria-label={menu ? "Close menu" : "Open menu"}
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
          <Link to={v14Routes.home} aria-label="Thynk, home"><Logo size={26} /></Link>
          <div>
            <h4>Thynk</h4>
            <ul>
              {v14Menu.map((n) => (
                <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{v14Footer.contactLabel}</h4>
            <ul><li><a href={`mailto:${v14Footer.contact}`}>{v14Footer.contact}</a></li></ul>
          </div>
          <div className="t14-legal"><b>Thynk Digital Agency</b><br />{v14Footer.city}<br />{v14Footer.year}</div>
        </footer>
      </main>
    </div>
  );
}

export function CleanShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const show = useSiteGate();
  if (!show) return <ComingSoon />;
  return <Shell pathname={pathname}>{children}</Shell>;
}
