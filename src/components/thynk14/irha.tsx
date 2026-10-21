import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { BookForm, Faq, Label, PageHead, go } from "./shared";
import { irha } from "@/content/irha-v14";

/**
 * /irha (21/10/2026, Mike): the page for the members of the Ένωση Ξενοδόχων Νομού Ιωαννίνων.
 * Copy: src/content/irha-v14.ts (Greek only). Route: src/routes/irha.tsx.
 * Every «Κλείστε audit» on this page (and in the header, menu and footer, through BookCtx in Shell.tsx)
 * opens the audit form right here, in a dialog, with «Ξενοδοχείο / φιλοξενία» already chosen.
 * Requests go to the same database + HubSpot form as /audit; the page column / message says «/irha».
 */

export function IrhaPage({ onBook }: { onBook: () => void }) {
  const t = irha;
  return (
    <>
      <PageHead p={{ label: t.head.label, title: t.head.giant, lead: t.head.lead }} />

      {/* the thesis: every hotel is different, so the audit comes first */}
      <section className="t14-wrap t14-ir-intro">
        <h2 className="t14-ir-h">{t.intro.title}</h2>
        <p className="t14-ir-lead">{t.intro.text}</p>
        <div className="t14-ir-ctas">
          <button type="button" className="t14-pill lg" onClick={onBook}>
            {t.intro.primary}
          </button>
          <a className="t14-pill lg ghost" href="#agents" onClick={(e) => go(e, "agents")}>
            {t.intro.secondary} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* two hotels, two different plans from the same audit */}
      <section className="t14-wrap">
        <Label>{t.compare.label}</Label>
        <div className="t14-ir-compare">
          {t.compare.cards.map((card) => (
            <figure key={card.business} className="t14-sample">
              <figcaption>
                <small>{t.compare.sampleLabel}</small>
                <strong>{card.business}</strong>
              </figcaption>
              <ul>
                {card.items.map((it) => (
                  <li key={it.text}>
                    <span className={`t14-tag${it.tone ? " " + it.tone : ""}`}>{it.tag}</span>
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
            </figure>
          ))}
        </div>
        <p className="t14-ir-note">{t.compare.note}</p>
      </section>

      {/* what the audit looks at, the steps, what you get */}
      <section className="t14-wrap">
        <Label>{t.looks.label}</Label>
        <div className="t14-ir-looks">
          {t.looks.items.map((it) => (
            <div key={it.title}>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
        <div className="t14-ir-process">
          <div>
            <h3 className="t14-ir-sub">{t.looks.stepsTitle}</h3>
            <ol className="t14-ir-steps">
              {t.looks.steps.map((s, i) => (
                <li key={s.title}>
                  <span>0{i + 1}</span>
                  <div>
                    <b>{s.title}</b>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="t14-ir-get">
            <h3 className="t14-ir-sub">{t.looks.deliverableTitle}</h3>
            <p>{t.looks.deliverable}</p>
            <button type="button" className="t14-pill lg" onClick={onBook}>
              {t.looks.button}
            </button>
          </div>
        </div>
      </section>

      {/* where a hotel loses value */}
      <section className="t14-wrap">
        <Label>{t.problems.label}</Label>
        <h2 className="t14-ir-h t14-ir-h-sec">{t.problems.title}</h2>
        <div className="t14-ir-probs">
          {t.problems.items.map((p) => (
            <div key={p.title} className="t14-ir-prob">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <p className="t14-ir-solves">
                <span>{t.problems.solvesLabel}</span>
                {p.solves}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* the five agents */}
      <section className="t14-wrap" id="agents">
        <Label>{t.agents.label}</Label>
        <h2 className="t14-ir-h t14-ir-h-sec">{t.agents.title}</h2>
        <p className="t14-ir-lead">{t.agents.lead}</p>
        <div className="t14-ir-agents">
          {t.agents.items.map((a, i) => (
            <article key={a.name} className="t14-ir-agent">
              <div className="t14-ir-agent-l">
                <span className="t14-ir-n">0{i + 1} / 05</span>
                <h3>{a.name}</h3>
                <p className="t14-ir-outcome">{a.outcome}</p>
                <p className="t14-ir-when">
                  <span>{t.agents.whenLabel}</span>
                  {a.when}
                </p>
              </div>
              <div className="t14-ir-agent-r">
                <ul className="t14-ir-does">
                  {a.does.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="t14-ir-scene">
                  <small>{t.agents.sceneLabel}</small>
                  <p>{a.scene}</p>
                </div>
                <div className="t14-ir-measure">
                  <small>{t.agents.measureLabel}</small>
                  <ul>
                    {a.measure.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* which agent fits? the audit answers */}
      <section className="t14-wrap">
        <div className="t14-ir-band">
          <div>
            <h2>{t.band.title}</h2>
            <p>{t.band.text}</p>
          </div>
          <button type="button" className="t14-pill lg" onClick={onBook}>
            {t.band.button}
          </button>
        </div>
      </section>

      {/* the rules */}
      <section className="t14-wrap">
        <Label>{t.rules.label}</Label>
        <h2 className="t14-ir-h t14-ir-h-sec">{t.rules.title}</h2>
        <div className="t14-ir-rules">
          {t.rules.items.map((r) => (
            <div key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* after the audit: the pilot */}
      <section className="t14-wrap">
        <Label>{t.pilot.label}</Label>
        <h2 className="t14-ir-h t14-ir-h-sec">{t.pilot.title}</h2>
        <ol className="t14-ir-pilot">
          {t.pilot.steps.map((s, i) => (
            <li key={s.title} className={i === 2 ? "run" : undefined}>
              <span className="t14-ir-pn">{i + 1}</span>
              {i === 2 && <span className="t14-ir-days">{t.pilot.days}</span>}
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <Faq title={t.faq.title} grey={t.faq.grey} note={t.faq.note} items={t.faq.items} id="irha-faq" />

      {/* the form on the page, for those who read to the end */}
      <section className="t14-book t14-book-stack t14-wrap" id="book">
        <div className="t14-book-side">
          <h2>{t.book.title}</h2>
          <p>{t.book.text}</p>
          <p className="t14-book-mail">
            {t.book.mail} <a href="mailto:hello@thynkagency.gr">hello@thynkagency.gr</a>
          </p>
        </div>
        <BookForm idPrefix="irha" industry={t.book.industry} />
      </section>
    </>
  );
}

/** the audit form in a dialog: centred on wide screens, a sheet from the bottom on phones */
export function BookDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const back = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    back.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = html.style.overflowY;
    html.style.overflowY = "hidden";
    const t = window.setTimeout(() => document.getElementById("irha-m-first")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // keep Tab inside the dialog
      if (e.key === "Tab" && boxRef.current) {
        const f = boxRef.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea");
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      html.style.overflowY = prev || "auto";
      back.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;
  const onBack = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return createPortal(
    <div className="t14 t14-ir-modal" lang="el" onMouseDown={onBack}>
      <div ref={boxRef} className="t14-ir-dialog" role="dialog" aria-modal="true" aria-label={irha.book.dialogLabel}>
        <div className="t14-ir-dhead">
          <span>{irha.head.label}</span>
          <button type="button" className="t14-ir-x" onClick={onClose} aria-label={irha.book.close}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <BookForm idPrefix="irha-m" industry={irha.book.industry} />
      </div>
    </div>,
    document.body,
  );
}
