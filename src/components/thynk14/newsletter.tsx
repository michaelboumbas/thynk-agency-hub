import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "./i18n";
import { newsletterCopy } from "@/content/newsletter-v14";
import { v14Routes, type V14Path } from "@/content/site-v14";
import {
  EMAIL_RE,
  NL_CLOSED_KEY,
  NL_DONE_KEY,
  NL_EVENT,
  subscribe,
  type NewsletterSource,
} from "@/lib/newsletter";

type State = "idle" | "sending" | "sent" | "error";

/**
 * The sign-up form (22/10/2026, Mike), used in the footer and in the window. Email + a required consent box
 * (same GDPR practice as the audit and careers forms); the consent sentence is stored with the sign-up.
 */
export function NewsletterForm({ source, onDone }: { source: NewsletterSource; onDone?: () => void }) {
  const { lang, href } = useCopy();
  const t = newsletterCopy[lang];
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [state, setState] = useState<State>("idle");
  const shownAt = useRef(Date.now());

  // signed up in the other form on this page (window ↔ footer): show the thank-you here too
  useEffect(() => {
    const on = () => setState("sent");
    window.addEventListener(NL_EVENT, on);
    return () => window.removeEventListener(NL_EVENT, on);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (state === "sending" || state === "sent") return;
    const errs: { email?: string; consent?: string } = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = t.emailError;
    if (!consent) errs.consent = t.consentError;
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`${id}-${errs.email ? "email" : "consent"}`)?.focus();
      return;
    }
    // a bot: the hidden field is filled in, or the form was sent within 2 seconds of appearing
    if (trap || Date.now() - shownAt.current < 2000) {
      setState("sent");
      return;
    }
    setState("sending");
    subscribe({ email, lang, source, consentText: `${t.consentA} ${t.consentLink}${t.consentB}` })
      .then((r) => {
        setState(r.ok ? "sent" : "error");
        if (r.ok) onDone?.();
      })
      .catch(() => setState("error"));
  };

  if (state === "sent") {
    return (
      <div className="t14-nl-ok" role="status">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.sent}
      </div>
    );
  }

  return (
    <form className={`t14-nl t14-nl-${source}`} onSubmit={submit} noValidate>
      <div className="t14-nl-row">
        <label className="t14-sr" htmlFor={`${id}-email`}>{t.emailLabel}</label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          aria-invalid={!!errors.email}
          aria-describedby={`${id}-email-e`}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="t14-pill" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? t.sending : t.button}
        </button>
      </div>
      <span className="t14-err" id={`${id}-email-e`}>{errors.email ?? ""}</span>
      <div className="t14-consent t14-nl-consent">
        <label htmlFor={`${id}-consent`}>
          <input
            id={`${id}-consent`}
            type="checkbox"
            checked={consent}
            aria-invalid={!!errors.consent}
            aria-describedby={`${id}-consent-e`}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {t.consentA}{" "}
            <Link to={href(v14Routes.privacy)} target="_blank">{t.consentLink}</Link>
            {t.consentB}
          </span>
        </label>
        <span className="t14-err" id={`${id}-consent-e`}>{errors.consent ?? ""}</span>
      </div>
      {/* anti-spam: off-screen, out of the tab order, hidden from screen readers */}
      <div className="t14-trap" aria-hidden="true">
        <label htmlFor={`${id}-website`}>{t.trap}</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>
      {state === "error" && <div className="t14-ok t14-fail" role="alert">{t.error}</div>}
    </form>
  );
}

/* ---------- the window ---------- */

/** pages where the visitor is already filling in a form or reading the legal text: no window there */
const NO_WINDOW: V14Path[] = [v14Routes.audit, v14Routes.careers, v14Routes.privacy, v14Routes.contact];
/** 22/10 (Mike): it appears 5 s after the visitor arrives on the site (this visit, across pages), no scrolling needed */
const MIN_MS = 5_000;
/** closed → not again for 30 days; signed up → never */
const QUIET_MS = 30 * 24 * 60 * 60 * 1000;
const T0_KEY = "thynk:newsletter-t0";
const SHOWN_KEY = "thynk:newsletter-shown";

function read(store: "local" | "session", key: string): string | null {
  try {
    return (store === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}
function write(store: "local" | "session", key: string, v: string) {
  try {
    (store === "local" ? window.localStorage : window.sessionStorage).setItem(key, v);
  } catch {
    /* storage blocked: at worst the window shows again on another visit */
  }
}

function quiet(): boolean {
  if (read("local", NL_DONE_KEY)) return true;
  const closed = Number(read("local", NL_CLOSED_KEY) || 0);
  if (closed && Date.now() - closed < QUIET_MS) return true;
  return !!read("session", SHOWN_KEY);
}

/** nothing else on screen asks for attention: no menu, no dialog, footer (with its own form) not in view */
function clear(): boolean {
  if (document.visibilityState !== "visible") return false;
  // the home page intro (it only plays on the home page, so look for it on screen rather than ask if it has played)
  if (document.querySelector('.t14-intro, .t14-menu.open, [aria-modal="true"]')) return false;
  const foot = document.getElementById("contact");
  if (foot && foot.getBoundingClientRect().top < window.innerHeight) return false;
  return true;
}

/**
 * The newsletter window (22/10/2026, Mike: «ένα παράθυρο να κάνει εγγραφή»). Not a centred pop-up that blocks
 * the page: a small card slides in at the bottom right (a sheet at the bottom on a phone) and the page stays usable.
 * It appears once per visit at most, 5 s after the visitor arrives (22/10, Mike; it was 25 s + 40 % of the page),
 * never on the audit, careers, contact or privacy pages, never over the menu, the home intro or a form dialog
 * (it waits until they are gone), and not while the footer, which has the same form, is in view.
 */
export function NewsletterPopup({ pathname }: { pathname: V14Path }) {
  const { lang } = useCopy();
  const t = newsletterCopy[lang];
  const id = useId();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closeT = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (open || NO_WINDOW.includes(pathname) || quiet()) return;
    let t0 = Number(read("session", T0_KEY) || 0);
    if (!t0) {
      t0 = Date.now();
      write("session", T0_KEY, String(t0));
    }
    const show = () => {
      if (quiet() || !clear()) return false;
      write("session", SHOWN_KEY, "1");
      setOpen(true);
      return true;
    };
    const tick = window.setInterval(() => {
      if (Date.now() - t0 >= MIN_MS && show()) window.clearInterval(tick);
    }, 250);
    return () => window.clearInterval(tick);
  }, [pathname, open]);

  // another page: a window left open closes quietly (it was seen; no 30-day pause)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = (remember: boolean) => {
    if (remember) write("local", NL_CLOSED_KEY, String(Date.now()));
    setLeaving(true);
    window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 220);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    // signed up (here or in the footer): the thank-you stays a moment, then the window goes
    const onDone = () => {
      window.clearTimeout(closeT.current);
      closeT.current = window.setTimeout(() => close(false), 3500);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(NL_EVENT, onDone);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(NL_EVENT, onDone);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeT.current), []);

  if (!open) return null;
  return (
    <div className={`t14-nlpop${leaving ? " out" : ""}`} role="dialog" aria-modal="false" aria-labelledby={`${id}-t`}>
      <button type="button" className="t14-nlpop-x" aria-label={t.pop.close} onClick={() => close(true)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <span className="t14-nlpop-eyebrow"><i aria-hidden="true" />{t.pop.eyebrow}</span>
      <h2 id={`${id}-t`}>{t.pop.title}</h2>
      <p>{t.lead}</p>
      <NewsletterForm source="popup" />
    </div>
  );
}
