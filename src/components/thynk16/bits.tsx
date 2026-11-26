import type { ReactNode } from "react";

/** v16 brand bits shared by the v16 pages and the older pages that adopt the v16 heading (26/11/2026) */

/** a word with the orange marker underline, drawn in when it appears */
export function Mk({ children }: { children: ReactNode }) {
  return (
    <span className="t16-hl">
      {children}
      <svg className="t16-mk" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 10 C 60 5, 120 13, 180 8 S 268 5, 296 9" />
      </svg>
    </span>
  );
}

/** page heading used by every inner page: eyebrow, big title ending in an orange-marked word, lead */
export function Head16({ eyebrow, title, lead, children, back }: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  back?: ReactNode;
}) {
  return (
    <section className="t16-head t16-wrap">
      {back ?? <p className="t16-lbl">{eyebrow}</p>}
      <h1 className="t16-h1">{title}</h1>
      {(lead || children) && (
        <div className="t16-head-row">
          {lead && <p className="t16-lead">{lead}</p>}
          {children}
        </div>
      )}
    </section>
  );
}

