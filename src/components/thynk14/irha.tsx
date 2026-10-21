import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BookForm, Faq, Label, go } from "./shared";
import { irha, type IrhaAgent, type IrhaScene } from "@/content/irha-v14";

/**
 * /irha (21/10/2026, Mike): the page for the members of the Ένωση Ξενοδόχων Νομού Ιωαννίνων.
 * It is also what Mike presents to the association on 22/10, so it carries every piece of the presentation:
 * the two pillars (marketing + automations), content production, advertising, the guest journey,
 * the five agents with their scenarios as conversations, rules, «where to start», the audit, the pilot.
 * Copy: src/content/irha-v14.ts (Greek only). Route: src/routes/irha.tsx.
 * Every «Κλείστε audit» on this page (and in the header, menu and footer, through BookCtx in Shell.tsx)
 * opens the audit form right here, in a dialog, with «Ξενοδοχείο / φιλοξενία» already chosen.
 * Requests go to the same database + HubSpot form as /audit; the page column / message says «/irha».
 */

function SecHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <>
      <Label>{label}</Label>
      <h2 className="t14-ir-h t14-ir-h-sec">{title}</h2>
      {lead && <p className="t14-ir-lead">{lead}</p>}
    </>
  );
}

function Measure({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="t14-ir-measure">
      <small>{label}</small>
      <ul>
        {items.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

function Panel({ label, tag, note, children }: { label: string; tag?: string; note?: string; children: ReactNode }) {
  return (
    <figure className="t14-ir-scene">
      <figcaption>
        <span>{label}</span>
        {tag && <em>{tag}</em>}
      </figcaption>
      {children}
      {note && <p className="t14-ir-scene-note">{note}</p>}
    </figure>
  );
}

/** the scenario of an agent: a conversation, a task flow or a pattern of complaints */
function Scene({ s }: { s: IrhaScene }) {
  const t = irha.agents;
  if (s.kind === "chat") {
    return (
      <Panel label={t.sceneLabel} tag={t.sceneTag} note={s.note}>
        <div className="t14-ir-chat">
          {s.messages.map((m, i) => (
            <div key={i} className={`t14-ir-msg ${m.who}`}>
              <small>{m.label}</small>
              <p>
                {m.text}
                {m.cta && (
                  <>
                    <br />
                    <span className="t14-ir-cta">{m.cta}</span>
                  </>
                )}
              </p>
            </div>
          ))}
          {s.sys && <span className="t14-ir-sys">{s.sys}</span>}
        </div>
      </Panel>
    );
  }
  if (s.kind === "flow") {
    return (
      <Panel label={t.sceneLabel} tag={t.sceneTag} note={s.note}>
        <ol className="t14-ir-flow">
          {s.steps.map((st) => (
            <li key={st.title} className={st.tone}>
              <b>{st.title}</b> {st.text}
              {st.quote && <p>{st.quote}</p>}
            </li>
          ))}
        </ol>
      </Panel>
    );
  }
  return (
    <Panel label={t.sceneLabel} tag={t.sceneTag} note={s.note}>
      <div className="t14-ir-reports">
        {s.reports.map((r) => (
          <div key={r.room}>
            <b>{r.room}</b>
            <span>{r.text}</span>
          </div>
        ))}
      </div>
      <p className="t14-ir-joins">{s.joins}</p>
      <div className="t14-ir-alert">
        <strong>{s.alert.title}</strong>
        <span>{s.alert.text}</span>
      </div>
    </Panel>
  );
}

function AgentRow({ a, i }: { a: IrhaAgent; i: number }) {
  const t = irha.agents;
  return (
    <article className="t14-ir-agent">
      <div className="t14-ir-agent-l">
        <span className="t14-ir-n">
          Agent 0{i + 1} / 05 · {a.short}
        </span>
        <h3>{a.name}</h3>
        <p className="t14-ir-outcome">{a.outcome}</p>
        <p className="t14-ir-when">
          <span>{t.whenLabel}</span>
          {a.when}
        </p>
        <ul className="t14-ir-does">
          {a.does.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <Measure label={t.measureLabel} items={a.measure} />
      </div>
      <div className="t14-ir-agent-r">
        <Scene s={a.scene} />
      </div>
    </article>
  );
}

export function IrhaPage({ onBook }: { onBook: () => void }) {
  const t = irha;
  const mk = t.marketing;
  return (
    <>
      {/* the site's page head (lead right, giant word), with the association's logo on the left (permission: Mike 21/10) */}
      <section className="t14-wrap t14-phead">
        <div className="t14-sol-top">
          <div className="t14-ir-assoc">
            {t.head.logo && <img src={t.head.logo} alt={t.head.logoAlt} width={96} height={96} />}
            <span>{t.head.label}</span>
          </div>
          <p>{t.head.lead}</p>
        </div>
        <h1 className="t14-giant">{t.head.giant}</h1>
      </section>

      {/* the thesis: every hotel is different, so the audit comes first */}
      <section className="t14-wrap t14-ir-intro">
        <h2 className="t14-ir-h">{t.intro.title}</h2>
        <p className="t14-ir-lead">{t.intro.text}</p>
        <div className="t14-ir-ctas">
          <button type="button" className="t14-pill lg" onClick={onBook}>
            {t.intro.primary}
          </button>
          <a className="t14-pill lg ghost" href="#offer" onClick={(e) => go(e, "offer")}>
            {t.intro.secondary} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* where a hotel loses value */}
      <section className="t14-wrap">
        <SecHead label={t.problems.label} title={t.problems.title} />
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

      {/* the two pillars: marketing brings the guest, the automations serve them */}
      <section className="t14-wrap" id="offer">
        <SecHead label={t.overview.label} title={t.overview.title} />
        <div className="t14-ir-ov">
          <span className="t14-ir-ov-g mk">{t.overview.groups.marketing}</span>
          <span className="t14-ir-ov-g au">{t.overview.groups.automation}</span>
          <span className="t14-ir-ov-g ms">{t.overview.groups.numbers}</span>
          {t.overview.steps.map((s, i) => (
            <div key={s.title} className="t14-ir-ov-step">
              <span>{i + 1}</span>
              <b>{s.title}</b>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <p className="t14-ir-ov-note">{t.overview.note}</p>
      </section>

      {/* marketing: content production + advertising */}
      <section className="t14-wrap">
        <SecHead label={mk.label} title={mk.title} />
        <div className="t14-ir-agents">
          <article className="t14-ir-agent">
            <div className="t14-ir-agent-l">
              <span className="t14-ir-n">Marketing · {mk.content.kicker}</span>
              <h3>{mk.content.name}</h3>
              <p className="t14-ir-outcome">{mk.content.outcome}</p>
              <ul className="t14-ir-does">
                {mk.content.does.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <Measure label={mk.measureLabel} items={mk.content.measure} />
            </div>
            <div className="t14-ir-agent-r">
              <Panel label={mk.content.uses.label} note={mk.content.uses.note}>
                <div className="t14-ir-uses">
                  <div className="t14-ir-src">
                    <b>{mk.content.uses.src}</b>
                    <span>{mk.content.uses.srcText}</span>
                  </div>
                  <ul className="t14-ir-dest">
                    {mk.content.uses.dest.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </Panel>
            </div>
          </article>
          <article className="t14-ir-agent">
            <div className="t14-ir-agent-l">
              <span className="t14-ir-n">Marketing · {mk.ads.kicker}</span>
              <h3>{mk.ads.name}</h3>
              <p className="t14-ir-outcome">{mk.ads.outcome}</p>
              <ul className="t14-ir-does">
                {mk.ads.does.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <Measure label={mk.measureLabel} items={mk.ads.measure} />
            </div>
            <div className="t14-ir-agent-r">
              <Panel label={mk.ads.report.label} tag={mk.ads.report.tag} note={mk.ads.report.note}>
                <table className="t14-ir-report">
                  <tbody>
                    {mk.ads.report.rows.map((r) => (
                      <tr key={r}>
                        <td>{r}</td>
                        <td>{r.startsWith("Δαπάνη") || r.startsWith("Κόστος") ? "€ —" : "—"}</td>
                      </tr>
                    ))}
                    <tr className="cmp">
                      <td>{mk.ads.report.cmp}</td>
                      <td>€ —</td>
                    </tr>
                  </tbody>
                </table>
              </Panel>
            </div>
          </article>
        </div>
      </section>

      {/* automations: the five agents along the guest's journey («η πρόταση») */}
      <section className="t14-wrap" id="agents">
        <SecHead label={t.journey.label} title={t.journey.title} lead={t.journey.lead} />
        <div className="t14-ir-jwrap" role="region" aria-label={t.journey.title} tabIndex={0}>
          <div className="t14-ir-journey">
            {t.journey.stages.map((s) => (
              <div key={s} className="t14-ir-stage">
                {s}
              </div>
            ))}
            {t.journey.bars.map((b, i) => (
              <div
                key={b.name}
                className={`t14-ir-bar${b.team ? " team" : ""}${b.span === 1 ? " narrow" : ""}`}
                style={{ gridColumn: `${b.start} / span ${b.span}`, gridRow: i + 2 }}
              >
                <b>{b.name}</b>
                <span>{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="t14-ir-legend">
          <span>
            <i />
            {t.journey.legendGuest}
          </span>
          <span>
            <i className="o" />
            {t.journey.legendTeam}
          </span>
          <span className="t14-ir-swipe">{t.journey.scrollHint} →</span>
        </p>
        <div className="t14-ir-agents">
          {t.agents.items.map((a, i) => (
            <AgentRow key={a.name} a={a} i={i} />
          ))}
        </div>
      </section>

      {/* the rules */}
      <section className="t14-wrap">
        <SecHead label={t.rules.label} title={t.rules.title} />
        <div className="t14-ir-rules">
          {t.rules.items.map((r) => (
            <div key={r.title}>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* what does your hotel need first? the audit answers */}
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

      {/* where to start, by type of hotel */}
      <section className="t14-wrap">
        <SecHead label={t.start.label} title={t.start.title} />
        <div className="t14-ir-stairs">
          {t.start.cols.map((c) => (
            <div key={c.title} className="t14-ir-stair">
              <h3>{c.title}</h3>
              <div className="t14-ir-stack">
                {c.blocks.map((b, i) => (
                  <span key={b} className={i === c.blocks.length - 1 ? "add" : undefined}>
                    {b}
                  </span>
                ))}
              </div>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
        <p className="t14-ir-note">{t.start.addedLabel}</p>
        <div className="t14-ir-notes">
          {t.start.notes.map((n) => (
            <p key={n.b}>
              <b>{n.b}</b> {n.t}
            </p>
          ))}
        </div>
      </section>

      {/* the audit: two hotels, two different plans; what it looks at; the steps; what you get */}
      <section className="t14-wrap" id="audit-irha">
        <Label>{t.compare.label}</Label>
        <h2 className="t14-ir-h t14-ir-h-sec">{t.intro.title}</h2>
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

      {/* after the audit: the pilot */}
      <section className="t14-wrap">
        <SecHead label={t.pilot.label} title={t.pilot.title} />
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
          <span className="t14-ir-dbrand">
            {irha.head.logo && <img src={irha.head.logo} alt="" width={34} height={34} />}
            {irha.head.label}
          </span>
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
