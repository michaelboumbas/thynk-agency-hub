import { useEffect, useRef, useState } from "react";
import { method, pinnedV6, processV6 } from "@/content/site-v6";
import { AuditCard, ChatCard, TerminalCard } from "./Mocks";

/**
 * Pinned "scrollytelling" sections (the viralpassion.gr feel): the section sticks to the viewport,
 * the heading never moves, and scrolling only changes which item is active.
 * Section height = one screen + `per` viewport-heights for every item.
 */
export function usePinnedIndex(n: number, reduced: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState({ i: 0, end: false });
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        const i = Math.min(n - 1, Math.floor(p * n * 0.999));
        const end = p > 0.985;
        setState((s) => (s.i === i && s.end === end ? s : { i, end }));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [n, reduced]);
  return [ref, state.i, state.end] as const;
}

/** "Φαντάσου τη δουλειά σου, όταν…" — the heading stays, one outcome lights up at a time, the Muse changes behind. */
export function PinnedKnowHow({ reduced }: { reduced: boolean }) {
  const items = pinnedV6.knowHow.items;
  const n = items.length;
  const [ref, idx] = usePinnedIndex(n, reduced);
  const bgs = pinnedV6.knowHow.backgrounds;
  return (
    <section
      ref={ref}
      className={`t6-pin t6-pin-know${reduced ? " static" : ""}`}
      style={reduced ? undefined : { height: `${100 + n * 42}vh` }}
      aria-label={pinnedV6.knowHow.title}
    >
      <div className="t6-pin-stage">
        <div className="t6-pin-bg" aria-hidden="true">
          {bgs.map((src, k) => (
            <img key={src} src={src} alt="" className={k === idx % bgs.length ? "on" : undefined} loading="lazy" />
          ))}
        </div>
        <div className="t6-pin-inner">
          <span className="t6-eyebrow">{pinnedV6.knowHow.eyebrow}</span>
          <h2 className="t6-pin-title">{pinnedV6.knowHow.title}</h2>
          <ol className="t6-know-list">
            {items.map((t, k) => {
              const last = k === n - 1;
              const cls = reduced || k === idx ? "on" : k < idx ? "past" : "";
              return (
                <li key={t} className={cls}>
                  {last ? <small>{pinnedV6.knowHow.lastLabel}</small> : null}
                  {t}
                </li>
              );
            })}
          </ol>
        </div>
        {!reduced && (
          <div className="t6-pin-count" aria-hidden="true">
            {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </div>
        )}
      </div>
    </section>
  );
}

/** Method — the title stays, the three steps swap in place with their live example card. */
export function PinnedMethod({ reduced }: { reduced: boolean }) {
  const steps = method.steps;
  const n = steps.length;
  const [ref, idx] = usePinnedIndex(n, reduced);
  const mock = (i: number) =>
    i === 0 ? <AuditCard reduced={reduced} /> : i === 1 ? <TerminalCard reduced={reduced} /> : <ChatCard reduced={reduced} />;

  if (reduced) {
    return (
      <section ref={ref} className="t6-section" id="method">
        <span className="t6-eyebrow">{processV6.eyebrow}</span>
        <h2>
          {processV6.titleTop}
          <br />
          <span className="t6-dim">{processV6.titleBottom}</span>
        </h2>
        {steps.map((s, i) => (
          <div key={s.n} className="t6-pin-step-static">
            <h3>
              {i + 1}. {s.title}
            </h3>
            <p>{s.text}</p>
          </div>
        ))}
      </section>
    );
  }

  const s = steps[idx];
  return (
    <section ref={ref} className="t6-pin t6-pin-method" id="method" style={{ height: `${100 + n * 85}vh` }}>
      <div className="t6-pin-stage">
        <div className="t6-pin-method-grid">
          <div className="t6-pin-method-text">
            <span className="t6-eyebrow">{processV6.eyebrow}</span>
            <h2 className="t6-pin-title">
              {processV6.titleTop}
              <br />
              <span className="t6-dim">{processV6.titleBottom}</span>
            </h2>
            <div className="t6-pin-dots" aria-hidden="true">
              {steps.map((st, i) => (
                <i key={st.n} className={i === idx ? "on" : i < idx ? "past" : undefined} />
              ))}
            </div>
            <div className="t6-pin-step" key={idx} aria-live="polite">
              <span className="t6-pin-step-n">
                {String(idx + 1).padStart(2, "0")}
                <em>/ {String(n).padStart(2, "0")}</em>
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="t6-chips">
                {s.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="t6-pin-method-mock" key={`m${idx}`}>
            {mock(idx)}
          </div>
        </div>
      </div>
    </section>
  );
}
