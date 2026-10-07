import { CleanShell } from "./Shell";
import { AboutPage, AuditPage, ContactPage, HomePage, ServicesPage, SolutionsPage } from "./pages";
import { WorkPage, CasePage } from "./work";
import { v14Routes, type Lang } from "@/content/site-v14";
import type { CaseStudy } from "@/content/work-v14";

/**
 * v14 «Thynk Clean» (02/10/2026): the ubernatural.io grammar on a white page — one neo-grotesk (Inter)
 * at extreme sizes, ink + Thynk orange, every section a scroll-driven moment.
 * 02/10 (Mike): the default face of the preview, the whole site in English, the v13 dot planet + space dust
 * behind every page. Pages: / · /services · /solutions · /audit · /about.
 * 02/10 (Mike): Greek version under /el (/el, /el/services, …), same pages, copy from site-v14-el.ts.
 * 07/10 (Mike): /work + /work/:slug (case studies, copy in src/content/work-v14.ts, page in work.tsx).
 * Pieces: Shell.tsx (header, field, footer, gate) · pages.tsx · work.tsx · shared.tsx · motion.ts · thynk14.css.
 * Approved prototype: https://claude.ai/artifact/M9Eqtsp9yAaiH1j7uykBJ9
 */

const PAGES = {
  [v14Routes.home]: HomePage,
  [v14Routes.services]: ServicesPage,
  [v14Routes.solutions]: SolutionsPage,
  [v14Routes.work]: WorkPage,
  [v14Routes.audit]: AuditPage,
  [v14Routes.about]: AboutPage,
  [v14Routes.contact]: ContactPage,
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
