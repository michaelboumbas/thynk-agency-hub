import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "./i18n";
import { FinalBand, Label, MoreLink, PageHead } from "./shared";
import { v14Routes } from "@/content/site-v14";
import {
  caseText,
  nextCase,
  publishedCases,
  type CaseStudy,
  type CaseTheme,
  type ClientLogo,
} from "@/content/work-v14";

/**
 * Clients (07/10/2026, Mike; renamed from «Work» 09/10): /work lists the accounts that run through Thynk,
 * /work/:slug tells one case. Cases and their copy: src/content/work-v14.ts. No result numbers until measured:
 * the Results block only shows when a case has `results`.
 * 09/10 (Mike): the brands appear as logos, not names.
 */

/**
 * Height (px at --u: 1) that gives every logo about the same visual weight: equal area, so a tall crest
 * and a long wordmark read as the same size. Capped so neither gets too tall nor too wide.
 */
function logoHeight(ratio: number) {
  return Math.round(Math.min(84, Math.sqrt(9000 / ratio), 210 / ratio) * 10) / 10;
}

/** a client logo drawn in the current text colour (CSS mask), so it greys out, inks or turns orange with its parent */
function Logo({ l, decorative = false }: { l: ClientLogo; decorative?: boolean }) {
  const mask = `url("${l.src}")`;
  const style = {
    "--lh": logoHeight(l.ratio),
    "--lr": l.ratio,
    WebkitMaskImage: mask,
    maskImage: mask,
  } as CSSProperties;
  return decorative ? (
    <span className="t14-clogo" style={style} aria-hidden="true" />
  ) : (
    <span className="t14-clogo" style={style} role="img" aria-label={l.alt} />
  );
}

/** the case's logo(s) with its name for screen readers; the plain name when a case has no logo yet */
function ClientMark({ cs, name }: { cs: CaseStudy; name: string }) {
  if (!cs.logos?.length) return <>{name}</>;
  return (
    <>
      {cs.logos.map((l) => (
        <Logo key={l.src} l={l} decorative />
      ))}
      <span className="t14-sr">{name}</span>
    </>
  );
}

/** link to a case page in the current language */
function CaseLink({
  cs,
  className,
  tabIndex,
  style,
  children,
}: {
  cs: CaseStudy;
  className?: string;
  tabIndex?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { lang } = useCopy();
  return (
    <Link
      to={lang === "el" ? "/el/work/$slug" : "/work/$slug"}
      params={{ slug: cs.slug }}
      className={className}
      tabIndex={tabIndex}
      style={style}
    >
      {children}
    </Link>
  );
}

/** "Since 2026", or for an event "2027 edition"; the plain status only when neither is set (09/10, Mike) */
function StatusLine({ cs }: { cs: CaseStudy }) {
  const { c } = useCopy();
  const w = c.work;
  const label = cs.edition
    ? w.editionLabel.replace("{year}", cs.edition)
    : cs.since
      ? w.sinceLabel.replace("{year}", cs.since.slice(0, 4))
      : w.status[cs.status];
  return (
    <span className={`t14-wk-status is-${cs.status}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

/* ================================ /work ================================ */
const NO_THEME: CaseTheme = { bg: "#0f1012", fg: "#ffffff", logo: "#ffffff", accent: "#ff6a1a" };
const pad2 = (n: number) => String(n).padStart(2, "0");
/** the brand's colours as CSS variables (--c-bg, --c-fg, --c-logo, --c-accent) */
function themeStyle(theme?: CaseTheme): CSSProperties {
  const th = theme ?? NO_THEME;
  return { "--c-bg": th.bg, "--c-fg": th.fg, "--c-logo": th.logo, "--c-accent": th.accent } as CSSProperties;
}

/**
 * Clients page (rebuilt 09/10, Mike): a stack. Each client is one large card in its own brand colours
 * (theme in work-v14.ts) with its logo big; the cards stick near the top and the next one rises over the
 * last, which settles back a little and dims (--p, 0 → 1, set on scroll below). Without motion the cards
 * still stack, they just do not shrink.
 */
export function WorkPage() {
  const { c, lang } = useCopy();
  const w = c.work;
  const stack = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = stack.current;
    if (!ol || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(ol.querySelectorAll<HTMLElement>(":scope > li"));
    let raf = 0;
    const update = () => {
      raf = 0;
      for (let i = 0; i < items.length - 1; i++) {
        const cur = items[i].getBoundingClientRect();
        const next = items[i + 1].getBoundingClientRect();
        // how far the next card has slid over this one: 0 as it arrives, 1 once it covers it
        const p = Math.min(1, Math.max(0, (cur.bottom - next.top) / cur.height));
        items[i].style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const total = publishedCases.length;
  return (
    <>
      <PageHead p={c.pageHeads.work} />
      <section className="t14-wrap t14-wk">
        <h2 className="t14-wk-title">
          {w.title} <span>{w.titleGrey}</span>
        </h2>
        <ol className="t14-stack" ref={stack}>
          {publishedCases.map((cs, i) => {
            const t = caseText(cs, lang);
            const ghost = cs.logos?.[0];
            const style = { "--i": i, ...themeStyle(cs.theme) } as CSSProperties;
            return (
              <li key={cs.slug} style={style}>
                <CaseLink cs={cs} className="t14-stack-card">
                  {ghost ? (
                    <span className="t14-stack-ghost" aria-hidden="true">
                      <Logo l={ghost} decorative />
                    </span>
                  ) : null}
                  <div className="t14-stack-top">
                    <span className="t14-stack-n">
                      {pad2(i + 1)}
                      <i> / {pad2(total)}</i>
                    </span>
                    <span className="t14-stack-sector">
                      {t.sector} · {t.location}
                    </span>
                    <StatusLine cs={cs} />
                  </div>
                  <h3 className="t14-stack-logos">
                    <ClientMark cs={cs} name={t.client} />
                  </h3>
                  <div className="t14-stack-foot">
                    <div>
                      <p>{t.cardLine}</p>
                      <ul className="t14-stack-tags" aria-label={w.labels.services}>
                        {t.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </div>
                    <b className="t14-stack-cta">
                      {w.view} <i aria-hidden="true">→</i>
                    </b>
                  </div>
                </CaseLink>
              </li>
            );
          })}
        </ol>
      </section>
      <FinalBand />
    </>
  );
}

/* ================================ /work/:slug ================================ */
export function CasePage({ cs }: { cs: CaseStudy }) {
  const { c, lang, href } = useCopy();
  const w = c.work;
  const t = caseText(cs, lang);
  const next = nextCase(cs.slug);
  const blocks: { key: string; label: string; body: ReactNode }[] = [
    { key: "context", label: w.labels.context, body: <p>{t.context}</p> },
    { key: "brief", label: w.labels.brief, body: <p>{t.brief}</p> },
    { key: "work", label: cs.status === "delivered" ? w.labels.workDone : w.labels.work, body: <p>{t.work}</p> },
  ];
  if (t.deliverables?.length) {
    blocks.push({
      key: "deliverables",
      label: w.labels.deliverables,
      body: (
        <ul className="t14-wk-dl">
          {t.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    });
  }
  if (t.results) blocks.push({ key: "results", label: w.labels.results, body: <p>{t.results}</p> });

  const nt = caseText(next, lang);
  const idx = publishedCases.findIndex((p) => p.slug === cs.slug);
  const ghost = cs.logos?.[0];
  const nextGhost = next.logos?.[0];

  /*
   * 09/10 (Mike): the case page in the style of the stack on /work. A hero panel in the brand's colours with
   * its logo big (the logo is the h1, the name stays for screen readers), the story on white with the
   * numbers in the brand's colour, and the next client as a card in its own colours.
   */
  return (
    <div className="t14-case" style={themeStyle(cs.theme)}>
      <section className="t14-wrap t14-case-head">
        <div className="t14-ch">
          {ghost ? (
            <span className="t14-stack-ghost t14-ch-ghost" aria-hidden="true">
              <Logo l={ghost} decorative />
            </span>
          ) : null}
          <div className="t14-ch-top">
            <Link className="t14-ch-back" to={href(v14Routes.work)}>
              {w.back}
            </Link>
            {idx >= 0 ? (
              <span className="t14-stack-n">
                {pad2(idx + 1)}
                <i> / {pad2(publishedCases.length)}</i>
              </span>
            ) : null}
            <span className="t14-stack-sector">
              {t.sector} · {t.location}
            </span>
            <StatusLine cs={cs} />
          </div>
          <h1 className="t14-ch-logos">
            <ClientMark cs={cs} name={t.client} />
          </h1>
          <div className="t14-ch-foot">
            <div>
              <p className="t14-ch-lead">{t.cardLine}</p>
              <ul className="t14-stack-tags" aria-label={w.labels.services}>
                {t.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <a className="t14-stack-cta t14-ch-visit" href={cs.url} target="_blank" rel="noopener noreferrer">
              {w.visit} {cs.domain} <i aria-hidden="true">↗</i>
            </a>
          </div>
        </div>
      </section>

      <section className="t14-wrap t14-case-body">
        {blocks.map((b, i) => (
          <div key={b.key} className="t14-case-row">
            <h2>
              <span className="t14-case-n">
                <sup>#.</sup>
                {pad2(i + 1)}
              </span>
              {b.label}
            </h2>
            <div className="t14-case-text">{b.body}</div>
          </div>
        ))}
      </section>

      {next.slug !== cs.slug && (
        <section className="t14-wrap">
          <CaseLink cs={next} className="t14-cn" style={themeStyle(next.theme)}>
            {nextGhost ? (
              <span className="t14-stack-ghost" aria-hidden="true">
                <Logo l={nextGhost} decorative />
              </span>
            ) : null}
            <span className="t14-cn-top">
              <span className="t14-stack-n">{w.next}</span>
              <span className="t14-stack-sector">
                {nt.sector} · {nt.location}
              </span>
            </span>
            <span className="t14-cn-logos">
              <ClientMark cs={next} name={nt.client} />
            </span>
            <span className="t14-cn-foot">
              <span className="t14-cn-line">{nt.cardLine}</span>
              <b className="t14-stack-cta">
                {w.view} <i aria-hidden="true">→</i>
              </b>
            </span>
          </CaseLink>
        </section>
      )}

      <FinalBand />
    </div>
  );
}

/* ================================ home: the work strip ================================ */
/**
 * The client logos running in a strip, like the footer ticker (09/10, Mike): a dark band, the logos in white
 * with an orange ✳ between them, each logo a link to its case; it keeps running under the pointer (09/10).
 * Seamless loop: two identical halves (each three rounds of logos, wide enough for big screens) moving by -50%.
 * Only the first round is read out and reachable by keyboard; the copies are hidden from assistive tech.
 */
export function WorkStrip() {
  const { c, lang } = useCopy();
  const w = c.work;
  const marks = publishedCases.flatMap((cs) =>
    cs.logos?.length ? cs.logos.map((l) => ({ cs, l, key: l.src })) : [{ cs, l: undefined, key: cs.slug }],
  );
  const round = (copy: boolean, k: string) =>
    marks.map(({ cs, l, key }) => (
      <li key={k + key} aria-hidden={copy || undefined}>
        <CaseLink cs={cs} tabIndex={copy ? -1 : undefined}>
          {l ? <Logo l={l} decorative={copy} /> : <span className="t14-cl-name">{caseText(cs, lang).client}</span>}
        </CaseLink>
        <b aria-hidden="true">✳</b>
      </li>
    ));
  return (
    <section className="t14-wrap t14-wk-strip" id="work">
      <Label>{w.homeLabel}</Label>
      <h2 className="t14-wk-title">
        {w.title} <span>{w.titleGrey}</span>
      </h2>
      <div className="t14-cl-strip">
        <div className="t14-cl-track">
          {[0, 1].map((half) => (
            <ul key={half} className="t14-cl-set" aria-hidden={half === 1 || undefined}>
              {[0, 1, 2].map((r) => round(half === 1 || r > 0, `${half}-${r}-`))}
            </ul>
          ))}
        </div>
      </div>
      <MoreLink to={v14Routes.work}>{c.more.work}</MoreLink>
    </section>
  );
}
