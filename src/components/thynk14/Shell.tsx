import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { LangProvider, localPath, useCopy } from "./i18n";
import { Link, useRouterState } from "@tanstack/react-router";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import { GatePending, useSiteGate } from "@/components/thynk11/Site";
import { PlanetField } from "@/components/thynk13/PlanetField";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { v14Routes, v14Social, type Lang, type V14Path } from "@/content/site-v14";
import { Logo } from "./shared";
import { useCleanMotion } from "./motion";
import { DotIntro, IntroFrame, introPending } from "./intro";
import { newsletterCopy } from "@/content/newsletter-v14";
import { NewsletterForm, NewsletterPopup } from "./newsletter";
import { useV16Reveal } from "@/components/thynk16/v16";
import { v16Copy } from "@/content/site-v16";
import { companyLine } from "@/content/company";

/** 26/11 (Mike, v16): the four pages in the header, in this order */
const NAV = [
  { to: v14Routes.services, k: "services" },
  { to: v14Routes.work, k: "work" },
  { to: v14Routes.about, k: "about" },
  { to: v14Routes.contact, k: "contact" },
] as const;

// 2026 brand (23/10): Commissioner for text and titles (full Greek), variable weight + the Flair axis.
// (Before: Inter for text, TikTok Sans for titles — Mike 02/10/2026.)
const INTER_HREF =
  "https://fonts.googleapis.com/css2?family=Commissioner:wght,FLAR@100..900,0..100&display=swap";

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
  const book = useContext(BookCtx);
  useCleanMotion(rootRef, slug ? `${pathname}/${slug}` : pathname);
  useV16Reveal(rootRef, slug ? `${pathname}/${slug}` : pathname);
  const v = v16Copy[lang];

  // the floating header hides while scrolling down, returns on the way up
  const [hideHdr, setHideHdr] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) < 6) return;
      setHideHdr(y > last && y > 140);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

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
      els.forEach((e, i) => { const p = prev[i]; if (p !== undefined) e.style.overflow = p; });
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
      {/* 07/11 (Mike): no dot planet behind the pages any more: minimal */}
      <a className="t14-skip" href="#main">{c.ui.skip}</a>
      {/* 07/11 (Mike): no header bar. The logo and a glass «dock» float over the page; the dock hides while you
          scroll down and comes back as soon as you scroll up (after thetetrahub.com) */}
      {/* 26/11 (Mike, v16): a plain header from the canvas: logo · four pages · EN · «Let's talk». It hides while
          scrolling down and comes back on the way up; on phones and tablets the pages move into the menu. */}
      <header className={`t16-hdr${hideHdr && !menu ? " hide" : ""}${scrolled ? " scrolled" : ""}`}>
        <div className="t16-hdr-in">
          <Link className="t16-brand" to={href(v14Routes.home)} aria-label={c.ui.home}><Logo /></Link>
          <nav className="t16-nav" aria-label={v.nav.main}>
            {NAV.map((n) => (
              <Link key={n.to} to={href(n.to)} aria-current={pathname === n.to ? "page" : undefined}>{v.nav[n.k]}</Link>
            ))}
          </nav>
          <div className="t16-hdr-r">
            <LangLink className="t16-lang" pathname={pathname} other={other} aria-label={c.ui.switchAria}>
              {other.toUpperCase()}
            </LangLink>
            {book ? (
              <button type="button" className="t16-btn" onClick={book}>{c.hero.primary}</button>
            ) : (
              <Link className="t16-btn" to={href(v14Routes.contact)} hash="talk">{v.nav.talk}</Link>
            )}
            <button
              ref={burgerRef}
              type="button"
              className="t16-burger"
              aria-expanded={menu}
              aria-label={menu ? c.ui.closeMenu : c.ui.openMenu}
              onClick={() => setMenu((x) => !x)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={menu} pathname={pathname} onClose={() => setMenu(false)} returnRef={burgerRef} />

      <main id="main">
        {children}
        <SiteFooter pathname={pathname} />
      </main>
      {/* 07/11 (Mike): no newsletter window any more; the sign-up stays in the footer */}
      {/* 07/11 (Mike): «Let's talk» stays at the bottom left on every page: a 30' call */}
      <TalkWidget />
    </div>
  );
}

/* ---------- «Let's talk» (07/11, Mike: option A, the typing bubble) ---------- */
const TALK_URL = "https://calendar.app.google/XDKnpqbbuHpARVxRA";
const TALK_KEY = "t15-talk-min";
const talkCopy = {
  en: {
    text: "A 30-minute call with our team. Tell us what you're after and we'll tell you honestly if we can help.",
    button: "Book a 30' call",
    min: "Minimise",
    open: "Let's talk: book a 30-minute call",
  },
  el: {
    text: "Μια κλήση 30 λεπτών με την ομάδα μας. Πείτε μας τι ψάχνετε και θα σας πούμε ειλικρινά αν μπορούμε να βοηθήσουμε.",
    button: "Κλείστε κλήση 30'",
    min: "Ελαχιστοποίηση",
    open: "Let's talk: κλείστε κλήση 30 λεπτών",
  },
} as const;

function TalkBubble() {
  return (
    <span className="t15-bubble" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * The card greets you at the bottom left; once you start reading (or on a phone) it folds into the «Let's talk»
 * pill. Minimised by hand, it stays a pill on every page after (localStorage).
 */
function TalkWidget() {
  const { lang } = useCopy();
  const t = talkCopy[lang];
  const [mini, setMini] = useState<boolean | null>(null);
  const touched = useRef(false);
  useEffect(() => {
    let m = window.matchMedia("(max-width: 640px)").matches || window.scrollY > 480;
    try {
      if (window.localStorage.getItem(TALK_KEY) === "1") m = true;
    } catch {
      /* storage blocked: decide by width */
    }
    setMini(m);
    const on = () => {
      if (!touched.current && window.scrollY > 480) setMini(true);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (mini === null) return null;
  const fold = () => {
    touched.current = true;
    setMini(true);
    try {
      window.localStorage.setItem(TALK_KEY, "1");
    } catch {
      /* fine */
    }
  };
  const unfold = () => {
    touched.current = true;
    setMini(false);
    try {
      window.localStorage.removeItem(TALK_KEY);
    } catch {
      /* fine */
    }
  };
  return (
    <aside className={`t15-talk${mini ? " min" : ""}`} aria-label="Let's talk">
      {mini ? (
        <button type="button" className="t15-talk-mini" onClick={unfold} aria-label={t.open}>
          <TalkBubble />
          <span lang="en">Let's talk</span>
        </button>
      ) : (
        <>
          <div className="t15-talk-h">
            <TalkBubble />
            <span className="t15-talk-t" lang="en">Let's talk</span>
            <button type="button" className="t15-talk-x" onClick={fold} aria-label={t.min}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <p>{t.text}</p>
          <a className="t14-pill t15-talk-go" href={TALK_URL} target="_blank" rel="noopener noreferrer">
            {t.button} <i aria-hidden="true">↗</i>
          </a>
        </>
      )}
    </aside>
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
  const book = useContext(BookCtx);
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
    const onStart = (e: TouchEvent) => { const t0 = e.touches[0]; if (t0) { ty = t0.clientY; tp = p; } };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      const t0 = e.touches[0]; if (t0) { set(tp + (ty - t0.clientY) / 64); }
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
              hash={it.hash as any}
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
        {book ? (
          <button type="button" className="t14-pill lg" onClick={() => { onClose(); book(); }}>{c.hero.primary}</button>
        ) : (
          <Link className="t14-pill lg" to={href(v14Routes.contact)} hash="talk" onClick={onClose}>{c.hero.primary}</Link>
        )}
        <LangLink className="t14-menu-lang" pathname={pathname} other={other} aria-label={c.ui.switchAria}>{c.ui.switchTo}</LangLink>
        <a className="t14-menu-mail" href={`mailto:${c.footer.contact}`}>{c.footer.contact}</a>
      </div>
    </div>
  );
}

/**
 * The footer v3 (26/11/2026, Mike, v16 canvas): logo + tagline · contact · follow us · updates (newsletter),
 * then one quiet line: © + the pages that are not in the menu (Press, Careers, Privacy, Cookies) and the
 * company's legal details (src/content/company.ts). Replaces the big «Let's Thynk. Together» footer.
 */
function SiteFooter({ pathname }: { pathname: V14Path }) {
  const { c, href, lang } = useCopy();
  const v = v16Copy[lang].footer;
  const nl = newsletterCopy[lang];
  const other: Lang = lang === "en" ? "el" : "en";
  const phone = c.footer.phone;
  const legal = companyLine(lang);
  return (
    <footer className="t16-foot" id="contact">
      <div className="t16-wrap t16-foot-grid">
        <div className="t16-foot-brand">
          <Link to={href(v14Routes.home)} aria-label={c.ui.home}><Logo /></Link>
          <span lang="en">{v16Copy[lang].tagline}</span>
        </div>
        <div>
          <span className="t16-lbl">{v.contact}</span>
          <a href="mailto:hello@thynkagency.gr">hello@thynkagency.gr</a>
          {phone && <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>}
          <span>{v.address}</span>
        </div>
        <div>
          <span className="t16-lbl">{v.follow}</span>
          {v14Social.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
        <div className="t16-foot-nl">
          <span className="t16-lbl">{v.news}</span>
          <span>{nl.lead}</span>
          <NewsletterForm source="footer" />
        </div>
      </div>
      <div className="t16-wrap t16-foot-legal">
        <nav aria-label={v.pages}>
          <span>© 2026 Thynk Digital Agency</span>
          <Link to={href(v14Routes.press)} aria-current={pathname === v14Routes.press ? "page" : undefined}>{v.press}</Link>
          <Link to={href(v14Routes.careers)} aria-current={pathname === v14Routes.careers ? "page" : undefined}>{v.careers}</Link>
          <Link to={href(v14Routes.privacy)} aria-current={pathname === v14Routes.privacy ? "page" : undefined}>{v.privacy}</Link>
          <Link to={href(v14Routes.cookies)} aria-current={pathname === v14Routes.cookies ? "page" : undefined}>{v.cookies}</Link>
          <LangLink pathname={pathname} other={other} aria-label={c.ui.switchAria}>{c.ui.switchTo}</LangLink>
        </nav>
        {legal && <p className="t16-company">{legal}</p>}
      </div>
    </footer>
  );
}

/** 21/10 (Mike): a landing page can take over «Κλείστε audit» and open the form on the page itself (/irha).
 *  When set, the header, menu and footer buttons call it instead of going to /audit#book. */
export const BookCtx = createContext<(() => void) | null>(null);

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
      <Link
        to={other === "el" ? "/el/work/$slug" : "/work/$slug"}
        params={{ slug }}
        hrefLang={other}
        onClick={() => rememberLang(other)}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link to={localPath(pathname, other)} hrefLang={other} onClick={() => rememberLang(other)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * 17/11 (Mike): the site opens in Greek. thynkagency.gr/ sends a first-time visitor to /el (routes/index.tsx).
 * A visitor who picks EN on the switch keeps English (localStorage), and one browsing the English pages
 * stays in English when they go back home (sessionStorage).
 */
export const LANG_PICK_KEY = "thynk-lang";
export const LANG_NOW_KEY = "thynk-lang-now";
function rememberLang(lang: Lang) {
  try {
    window.localStorage.setItem(LANG_PICK_KEY, lang);
  } catch {
    /* storage blocked: the choice just isn't remembered */
  }
}

export function CleanShell({ pathname, lang, slug, onBook, children }: {
  pathname: V14Path;
  lang: Lang;
  /** set on case pages: /work/:slug */
  slug?: string;
  /** set on landing pages that open the audit form in place (/irha, 21/10) */
  onBook?: () => void;
  children: ReactNode;
}) {
  const show = useSiteGate();
  // 17/11: the language of the page being read, so «/» keeps an English reader in English
  useEffect(() => {
    try {
      window.sessionStorage.setItem(LANG_NOW_KEY, lang);
    } catch {
      /* storage blocked */
    }
  }, [lang]);
  // 12/10 (Mike): «η τελεία» intro on the first load of the home page (see intro.tsx)
  const isHome = pathname === v14Routes.home;
  const [intro, setIntro] = useState(() => isHome && introPending());
  if (show === null) return intro ? <IntroFrame /> : <GatePending />;
  if (!show) return <ComingSoon />;
  return (
    <LangProvider lang={lang}>
      <SlugCtx.Provider value={slug}>
        <BookCtx.Provider value={onBook ?? null}>
          <Shell pathname={pathname}>{children}</Shell>
        </BookCtx.Provider>
      </SlugCtx.Provider>
      {intro && <DotIntro onDone={() => setIntro(false)} />}
    </LangProvider>
  );
}
