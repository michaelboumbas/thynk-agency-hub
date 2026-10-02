import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import { useSiteGate } from "@/components/thynk11/Site";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import {
  v14About,
  v14Audit,
  v14Book,
  v14Faq,
  v14Footer,
  v14Hero,
  v14Method,
  v14Nav,
  v14Screens,
  v14Solutions,
  v14Team,
  type ScreenId,
} from "@/content/site-v14";

/**
 * v14 «Thynk Clean» (02/10/2026): the ubernatural.io grammar on a white page — one neo-grotesk (Inter, has Greek)
 * at extreme sizes, ink + Thynk orange, every section a scroll-driven moment:
 *   hero with floating example screens · words that light up · ghost "Μεθοδολογία" with flying stage cards ·
 *   giant "Λύσεις" + list with hover peek · horizontal audit panels · team list · form · FAQ.
 * One page with anchors. Preview only: ?v=14. Desktop motion is scroll-driven (sticky stages); on phones
 * (≤900px) the sticky stages fall back to a normal vertical flow. prefers-reduced-motion: everything static.
 */

const INTER_HREF = "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..600&display=swap";

/* where each floating screen sits in the hero (percent of the stage), its parallax speed and tilt */
const SHOTS: { id: ScreenId; x: number; y: number; s: number; r: number; mobile?: "a" | "b" }[] = [
  { id: "bookings", x: 6, y: 14, s: 0.55, r: -3, mobile: "a" },
  { id: "followup", x: 74, y: 10, s: 0.8, r: 2 },
  { id: "report", x: 8, y: 66, s: 1.05, r: 2 },
  { id: "invoices", x: 70, y: 62, s: 0.7, r: -2, mobile: "b" },
  { id: "audit", x: 40, y: 80, s: 1.3, r: 1 },
];

function Screen({ id }: { id: ScreenId }) {
  if (id === "bookings") {
    const d = v14Screens.bookings;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.chat.map((m, k) => (
          <div key={k} className={`t14-bub${m.me ? " me" : ""}`}>{m.t}</div>
        ))}
        <div className="t14-row"><b><span className="t14-dot w" />{d.status}</b></div>
        <div className="t14-card-f">{d.foot}</div>
      </div>
    );
  }
  if (id === "followup") {
    const d = v14Screens.followup;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.rows.map((r) => (
          <div key={r.t} className="t14-row"><b><span className={`t14-dot${r.s === "wait" ? " w" : ""}`} />{r.t}</b></div>
        ))}
      </div>
    );
  }
  if (id === "report") {
    const d = v14Screens.report;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        <div className="t14-bars">
          {d.bars.map((b) => (
            <div key={b.t} className="t14-bar">
              <span>{b.t}</span>
              <s className={b.flag ? "f" : ""} style={{ width: `${b.v}%` }} />
              <span>{b.v}</span>
            </div>
          ))}
        </div>
        <div className="t14-card-f">{d.foot}</div>
      </div>
    );
  }
  if (id === "invoices") {
    const d = v14Screens.invoices;
    return (
      <div className="t14-card">
        <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
        {d.rows.map((r) => (
          <div key={r.t} className="t14-row">
            <b>{r.flag && <span className="t14-dot f" />}{r.t}</b>
            <span>{r.v}</span>
          </div>
        ))}
      </div>
    );
  }
  const d = v14Screens.audit;
  return (
    <div className="t14-card">
      <div className="t14-card-h"><b>{d.app}</b><i>{d.chip}</i></div>
      {d.rows.map((r) => (
        <div key={r.t} className="t14-row">
          <b>{r.t}</b>
          <span className={`t14-tag${r.tone ? " " + r.tone : ""}`}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (t: number) => t * t * (3 - 2 * t);
function progress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? clamp(-r.top / span, 0, 1) : 0;
}
function go(e: MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Logo({ size }: { size?: number }) {
  return (
    <span className="t14-logo" style={size ? { fontSize: size } : undefined} aria-label="Thynk">
      THYNK<b>.</b>
    </span>
  );
}

function CleanPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [peek, setPeek] = useState<ScreenId | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", biz: "", email: "", pain: v14Book.pain.options[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  // Inter (Greek + Latin), only for this version
  useEffect(() => {
    if (document.querySelector(`link[href="${INTER_HREF}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = INTER_HREF;
    document.head.appendChild(l);
  }, []);

  // the app shell locks scrolling for v5: unlock while this page is mounted
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

  // the giant "Λύσεις" fills the content width exactly, whatever the font metrics.
  // Re-fits when Inter finishes loading (it arrives after first paint) and on resize.
  useEffect(() => {
    const el = rootRef.current?.querySelector<HTMLElement>(".t14-giant");
    if (!el) return;
    const fit = () => {
      const par = el.parentElement!;
      const pad = parseFloat(getComputedStyle(par).paddingLeft) + parseFloat(getComputedStyle(par).paddingRight);
      const box = par.clientWidth - pad;
      const w = el.getBoundingClientRect().width;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (w > 0 && box > 0) el.style.fontSize = `${(fs * box) / w}px`;
    };
    // two passes: the first gets close, the second corrects for letter-spacing in em
    const refit = () => {
      fit();
      fit();
    };
    refit();
    const fonts = document.fonts;
    fonts?.ready.then(refit);
    fonts?.addEventListener?.("loadingdone", refit);
    window.addEventListener("resize", refit);
    return () => {
      fonts?.removeEventListener?.("loadingdone", refit);
      window.removeEventListener("resize", refit);
    };
  }, []);

  // all scroll-driven motion in one rAF loop
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowQ = window.matchMedia("(max-width: 900px)");

    const hero = root.querySelector<HTMLElement>(".t14-hero")!;
    const heroC = root.querySelector<HTMLElement>(".t14-hero-c")!;
    const shots = [...root.querySelectorAll<HTMLElement>(".t14-shot")];
    const words = [...root.querySelectorAll<HTMLElement>(".t14-reveal span")];
    const reveal = root.querySelector<HTMLElement>(".t14-reveal")!;
    const method = root.querySelector<HTMLElement>(".t14-method")!;
    const letters = [...root.querySelectorAll<HTMLElement>(".t14-ghost span")];
    const mcards = [...root.querySelectorAll<HTMLElement>(".t14-mcard")];
    const hz = root.querySelector<HTMLElement>(".t14-hz")!;
    const track = root.querySelector<HTMLElement>(".t14-hz-track")!;

    let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      const p = peekRef.current;
      if (p) {
        p.style.left = e.clientX + "px";
        p.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = () => {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const W = window.innerWidth, H = window.innerHeight;
      const narrow = narrowQ.matches;

      // hero: content lifts and fades; screens scatter outward and drift up at their own speed
      const hp = clamp(window.scrollY / Math.max(1, hero.offsetHeight - H), 0, 1);
      heroC.style.transform = `translateY(${-hp * 40}px)`;
      heroC.style.opacity = String(1 - ease(clamp((hp - 0.35) / 0.5, 0, 1)));
      const t = reduced ? 0 : performance.now() / 1000;
      shots.forEach((s, i) => {
        const cfg = SHOTS[i];
        const fx = (cfg.x - 45) / 45;
        const bob = reduced ? 0 : Math.sin(t * 0.6 + i * 1.7) * 6;
        const dx = (reduced ? 0 : fx * hp * W * 0.18) + mx * 30 * cfg.s;
        const dy = (reduced ? 0 : -hp * H * 0.9 * cfg.s) + bob + my * 22 * cfg.s;
        s.style.transform = `translate3d(${dx}px,${dy}px,0) rotate(${cfg.r * (1 - hp)}deg)`;
      });

      // about: words light up as the paragraph passes
      if (!reduced) {
        const r = reveal.getBoundingClientRect();
        const p = clamp((H * 0.85 - r.top) / (r.height + H * 0.35), 0, 1);
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < n));
      }

      if (!narrow) {
        // method: letters light up, four cards fly in from below on a diagonal, then leave together
        const p = progress(method);
        const lit = p * letters.length * 1.6;
        letters.forEach((l, i) => {
          const d = lit - i;
          l.className = reduced ? "on" : d > 2.2 ? "lit" : d > 0 ? "on" : "";
        });
        const xs = [0.05, 0.29, 0.53, 0.77], ys = [0.12, 0.3, 0.48, 0.3];
        mcards.forEach((c, i) => {
          const start = 0.12 + i * 0.13;
          const k = reduced ? 1 : ease(clamp((p - start) / 0.22, 0, 1));
          const x = xs[i] * W, y = ys[i] * H;
          const outY = H * 1.1 - y + 80;
          const exit = reduced ? 0 : ease(clamp((p - 0.86) / 0.14, 0, 1));
          c.style.transform = `translate3d(${x}px,${y + (1 - k) * outY - exit * H * 1.1}px,0)`;
        });
        // audit: the panel track slides left over the title
        const hpz = progress(hz);
        track.style.transform = `translate3d(${-ease(hpz) * Math.max(0, track.scrollWidth - W)}px,0,0)`;
      } else {
        letters.forEach((l) => (l.className = "on"));
        mcards.forEach((c) => (c.style.transform = ""));
        track.style.transform = "";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = v14Book.name.error;
    if (!form.biz.trim()) errs.biz = v14Book.biz.error;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = v14Book.email.error;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`t14-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  const field = (k: "name" | "biz" | "email", type = "text", auto = "on") => {
    const c = v14Book[k];
    return (
      <div className="t14-f">
        <label htmlFor={`t14-${k}`}>{c.label}</label>
        <input
          id={`t14-${k}`}
          type={type}
          autoComplete={auto}
          placeholder={c.placeholder}
          value={form[k]}
          aria-invalid={!!errors[k]}
          aria-describedby={`t14-${k}-e`}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
        <span className="t14-err" id={`t14-${k}-e`}>{errors[k] ?? ""}</span>
      </div>
    );
  };

  return (
    <div className="t14" ref={rootRef} lang="el">
      <header className="t14-hdr">
        <a href="#top" onClick={(e) => go(e, "top")} aria-label="Thynk, αρχική"><Logo /></a>
        <nav className="t14-nav" aria-label="Κύριο μενού">
          {v14Nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)}>{n.label}</a>
          ))}
        </nav>
        <div className="t14-hdr-r">
          <a className="t14-pill" href="#book" onClick={(e) => go(e, "book")}>{v14Hero.primary}</a>
        </div>
      </header>

      <main id="top">
        {/* hero */}
        <section className="t14-hero" aria-label="Thynk">
          <div className="t14-hero-stage">
            <div className="t14-hero-c">
              <div className="t14-hero-mark"><i />{v14Hero.mark}</div>
              <h1>
                {v14Hero.lead}<em>{v14Hero.accent}</em>{v14Hero.last}
              </h1>
              <p className="t14-formula"><b>{v14Hero.formulaStrong}</b> {v14Hero.formula}</p>
              <div className="t14-ctas">
                <a className="t14-pill lg" href="#book" onClick={(e) => go(e, "book")}>{v14Hero.primary}</a>
                <a className="t14-pill lg ghost" href="#method" onClick={(e) => go(e, "method")}>{v14Hero.secondary}</a>
              </div>
            </div>
            {SHOTS.map((s) => (
              <div
                key={s.id}
                className={`t14-shot${s.mobile ? " m-" + s.mobile : " m-hide"}`}
                style={{ left: `${s.x}%`, top: `${s.y}%` } as CSSProperties}
                aria-hidden="true"
              >
                <Screen id={s.id} />
              </div>
            ))}
          </div>
        </section>

        {/* about */}
        <section className="t14-about t14-wrap" id="about">
          <div className="t14-lbl">{v14About.label}</div>
          <p className="t14-reveal">
            {v14About.text.split(/\s+/).map((w, i) => (
              <span key={i}>{w} </span>
            ))}
          </p>
          <div className="t14-team-line">
            <h3>{v14About.founders}</h3>
            <p>{v14About.foundersNote}</p>
          </div>
        </section>

        {/* method */}
        <section className="t14-method" id="method" aria-label={v14Method.title}>
          <div className="t14-method-stage">
            <h2 className="t14-ghost">
              {[...v14Method.title].map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </h2>
            {v14Method.steps.map((s, i) => (
              <article key={s.title} className="t14-mcard">
                <small>( 0{i + 1} · {v14Method.stepWord} )</small>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="t14-num"><sup>#.</sup>0{i + 1}</div>
              </article>
            ))}
          </div>
        </section>

        {/* solutions */}
        <section className="t14-wrap" id="solutions">
          <div className="t14-lbl">{v14Solutions.label}</div>
          <div className="t14-sol-top"><p>{v14Solutions.lead}</p></div>
          <h2 className="t14-giant">{v14Solutions.title}</h2>
          <ul className="t14-list">
            {v14Solutions.items.map((it) => (
              <li
                key={it.name}
                onPointerEnter={(e) => it.screen && e.pointerType === "mouse" && setPeek(it.screen)}
                onPointerLeave={() => setPeek(null)}
              >
                <span className="n">{it.name}</span>
                <span className="t">{it.tags}</span>
                <span className="y">{it.pillar}</span>
              </li>
            ))}
          </ul>
          <p className="t14-sol-note">{v14Solutions.note}</p>
        </section>
        <div className={`t14-peek${peek ? " on" : ""}`} ref={peekRef} aria-hidden="true">
          {peek && <Screen id={peek} />}
        </div>

        {/* audit, horizontal */}
        <section className="t14-hz" id="audit" aria-label="Το audit">
          <div className="t14-hz-stage">
            <h2 className="t14-hz-title">
              {v14Audit.titleStart}<em>{v14Audit.titleAccent}</em>
            </h2>
            <div className="t14-hz-track">
              <div className="t14-spacer" aria-hidden="true" />
              {v14Audit.panels.map((p) => (
                <article key={p.title} className={`t14-panel ${p.tone}`}>
                  <small>{p.kicker}<i>{p.sub}</i></small>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* team */}
        <section className="t14-team t14-wrap" id="team">
          <div className="t14-lbl">{v14Team.label}</div>
          <ul className="t14-list">
            {v14Team.people.map((p) => (
              <li key={p.name}>
                <span className="n">{p.name}<small>{p.role}</small></span>
                <span className="t">{p.focus}</span>
                <span className="y"><a href={`mailto:${p.email}`}>{p.email}</a></span>
              </li>
            ))}
          </ul>
        </section>

        {/* book */}
        <section className="t14-book t14-wrap" id="book">
          <form className="t14-form" onSubmit={submit} noValidate>
            <h2>{v14Book.title}</h2>
            <p>{v14Book.lead}</p>
            <div className="t14-fgrid">
              {field("name", "text", "name")}
              {field("biz", "text", "organization")}
            </div>
            {field("email", "email", "email")}
            <div className="t14-f">
              <label htmlFor="t14-pain">{v14Book.pain.label}</label>
              <select id="t14-pain" value={form.pain} onChange={(e) => setForm({ ...form, pain: e.target.value })}>
                {v14Book.pain.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <button className="t14-pill lg" type="submit">{v14Book.submit}</button>
            {sent && <div className="t14-ok" role="status">{v14Book.sent}</div>}
          </form>
        </section>

        {/* faq */}
        <section className="t14-faq t14-wrap" id="faq">
          <div className="t14-faq-side">
            <h2>{v14Faq.title}<br /><span>{v14Faq.titleGrey}</span></h2>
            <p>{v14Faq.note}</p>
          </div>
          <div>
            {v14Faq.items.map((q, i) => (
              <div key={q.q} className={`t14-qa${open === i ? " open" : ""}`}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  {q.q}<i />
                </button>
                <div className="t14-a"><div><p>{q.a}</p></div></div>
              </div>
            ))}
          </div>
        </section>

        <footer className="t14-footer t14-wrap">
          <a href="#top" onClick={(e) => go(e, "top")} aria-label="Thynk, αρχική"><Logo size={26} /></a>
          <div>
            <h4>Thynk</h4>
            <ul>
              {v14Nav.map((n) => (
                <li key={n.id}><a href={`#${n.id}`} onClick={(e) => go(e, n.id)}>{n.label}</a></li>
              ))}
              <li><a href="#faq" onClick={(e) => go(e, "faq")}>Συχνές ερωτήσεις</a></li>
            </ul>
          </div>
          <div>
            <h4>Επικοινωνία</h4>
            <ul><li><a href={`mailto:${v14Footer.contact}`}>{v14Footer.contact}</a></li></ul>
          </div>
          <div className="t14-legal"><b>Thynk Digital Agency</b><br />{v14Footer.city}<br />{v14Footer.year}</div>
        </footer>
      </main>
    </div>
  );
}

export function CleanSite() {
  const show = useSiteGate();
  if (!show) return <ComingSoon />;
  return <CleanPage />;
}
