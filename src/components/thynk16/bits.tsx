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

/** a word circled by the orange marker (hero D, 27/11) */
export function MkCircle({ children }: { children: ReactNode }) {
  return (
    <span className="t16-hlc">
      {children}
      <svg className="t16-mkc" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M40 14 C 110 0, 262 6, 288 28 C 306 48, 212 68, 130 65 C 48 62, 4 50, 16 30 C 24 18, 46 12, 74 9" />
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


/** capitals for eyebrows: Greek capitals carry no accents (Δουλέψτε → ΔΟΥΛΕΨΤΕ) */
export function caps(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().normalize("NFC");
}
