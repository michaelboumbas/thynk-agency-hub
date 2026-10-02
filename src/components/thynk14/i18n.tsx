import { createContext, useContext, type ReactNode } from "react";
import { en, type Copy, type ElPath, type Lang, type V14Path } from "@/content/site-v14";
import { el } from "@/content/site-v14-el";

/** v14 has two languages (02/10/2026): English at /, Greek under /el. Pages read their words from here. */
const COPY: Record<Lang, Copy> = { en, el };

/** a page path in the given language: "/services" → "/el/services" in Greek */
export function localPath(p: V14Path, lang: Lang): V14Path | ElPath {
  if (lang === "en") return p;
  return p === "/" ? "/el" : (`/el${p}` as ElPath);
}

const Ctx = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useCopy() {
  const lang = useContext(Ctx);
  return {
    lang,
    c: COPY[lang],
    /** link target for a page in the current language */
    href: (p: V14Path) => localPath(p, lang),
  };
}
