import { useEffect, useRef, useState } from "react";
import { processV6 } from "@/content/site-v6";

/** True once the element has entered the viewport (stays true). */
export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);
  return [ref, inView] as const;
}

export function AuditCard({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [done, setDone] = useState(reduced ? processV6.audit.items.length : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => setDone((d) => (d >= processV6.audit.items.length ? d : d + 1)), 520);
    return () => clearInterval(t);
  }, [inView, reduced]);
  return (
    <div ref={ref} className="t6-mock t6-mock-audit">
      <div className="t6-mock-head">
        <span>▦ {processV6.audit.title}</span>
        <span className="t6-badge">{processV6.audit.tag}</span>
      </div>
      <ul>
        {processV6.audit.items.map((it, i) => (
          <li key={it} className={i < done ? "on" : undefined}>
            <span className="t6-check" aria-hidden="true">
              {i < done ? "✓" : ""}
            </span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TerminalCard({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const full = processV6.terminal.join("\n");
  const [n, setN] = useState(reduced ? full.length : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => setN((v) => (v >= full.length ? v : v + 2)), 28);
    return () => clearInterval(t);
  }, [inView, reduced, full.length]);
  const lines = full.slice(0, n).split("\n");
  return (
    <div ref={ref} className="t6-mock t6-mock-term">
      <div className="t6-term-bar">
        <i />
        <i />
        <i />
        <span>thynk — pilot</span>
      </div>
      <pre>
        {lines.map((l, i) => (
          <span key={i} className={i === 0 ? "cmd" : undefined}>
            {i === 0 ? "$ " : ""}
            {l}
            {"\n"}
          </span>
        ))}
        <span className="t6-caret" aria-hidden="true" />
      </pre>
    </div>
  );
}

export function ChatCard({ reduced }: { reduced: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const msgs = processV6.chat.messages;
  const [shown, setShown] = useState(reduced ? msgs.length : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => setShown((s) => (s >= msgs.length ? s : s + 1)), 900);
    return () => clearInterval(t);
  }, [inView, reduced, msgs.length]);
  return (
    <div ref={ref} className="t6-mock t6-mock-chat">
      <div className="t6-mock-head">
        <span>● Muse</span>
        <span className="t6-badge">{processV6.chat.label}</span>
      </div>
      <div className="t6-chat">
        {msgs.slice(0, shown).map((m, i) => (
          <div key={i} className={`t6-bubble ${m.from}`}>
            {m.text}
          </div>
        ))}
        {shown < msgs.length && inView && !reduced ? (
          <div className="t6-bubble typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        ) : null}
      </div>
    </div>
  );
}
