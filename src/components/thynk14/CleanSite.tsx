import { CleanShell } from "./Shell";
import { About16, Audit16, Contact16, Cookies16, Home16, Privacy16, Services16 } from "@/components/thynk16/v16";
import { WorkPage, CasePage } from "./work";
import { PressPage } from "./press";
import { CareersPage } from "./careers";
import { v14Routes, type Lang } from "@/content/site-v14";
import type { CaseStudy } from "@/content/work-v14";

/**
 * v14 «Thynk Clean» (02/10/2026): the ubernatural.io grammar on a white page — one neo-grotesk (Inter)
 * at extreme sizes, ink + Thynk orange, every section a scroll-driven moment.
 * 02/10 (Mike): the default face of the preview, the whole site in English, the v13 dot planet + space dust
 * behind every page. Pages: / · /services · /solutions · /audit · /about.
 * 02/10 (Mike): Greek version under /el (/el, /el/services, …), same pages, copy from site-v14-el.ts.
 * 07/10 (Mike): /work + /work/:slug (case studies, copy in src/content/work-v14.ts, page in work.tsx).
 * 17/10 (Mike): /press (articles about Thynk + kit for journalists, copy in src/content/press-v14.ts, page in press.tsx).
 * 17/10 (Mike): /careers (open applications with CV upload, copy in src/content/careers-v14.ts, page in careers.tsx).
 * Pieces: Shell.tsx (header, field, footer, gate) · pages.tsx · work.tsx · shared.tsx · motion.ts · thynk14.css.
 * Approved prototype: https://claude.ai/artifact/M9Eqtsp9yAaiH1j7uykBJ9
 */

// 26/11/2026 (Mike, v16): home, services, AI audit, about, contact and the legal pages are the canvas redesign
// (components/thynk16). /solutions redirects to /services#examples (see its route); it maps to Services here only
// so the type stays complete. The old v14 pages stay in pages.tsx for reference.
const PAGES = {
  [v14Routes.home]: Home16,
  [v14Routes.services]: Services16,
  [v14Routes.solutions]: Services16,
  [v14Routes.work]: WorkPage,
  [v14Routes.audit]: Audit16,
  [v14Routes.about]: About16,
  [v14Routes.contact]: Contact16,
  [v14Routes.privacy]: Privacy16,
  [v14Routes.cookies]: Cookies16,
  [v14Routes.press]: PressPage,
  [v14Routes.careers]: CareersPage,
} as const;

export type CleanPath = keyof typeof PAGES;

export function CleanPage({ path, lang = "en" }: { path: CleanPath; lang?: Lang }) {
  const Page = PAGES[path];
  return (
    <CleanShell pathname={path} lang={lang}>
      <Page />
    </CleanShell>
  );
}

/** a case page, /work/:slug (07/10): the shell keeps «Work» active and the EL/EN switch on the same case */
export function CleanCasePage({ cs, lang = "en" }: { cs: CaseStudy; lang?: Lang }) {
  return (
    <CleanShell pathname={v14Routes.work} lang={lang} slug={cs.slug}>
      <CasePage cs={cs} />
    </CleanShell>
  );
}

/** the home page (index route) */
export function CleanSite() {
  return <CleanPage path={v14Routes.home} />;
}
