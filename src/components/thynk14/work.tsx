import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "./i18n";
import { FinalBand, Label, MoreLink, PageHead } from "./shared";
import { v14Routes } from "@/content/site-v14";
import { caseText, nextCase, publishedCases, type CaseStudy, type ClientLogo } from "@/content/work-v14";

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
  children,
}: {
  cs: CaseStudy;
  className?: string;
  tabIndex?: number;
  children: ReactNode;
}) {
  const { lang } = useCopy();
  return (
    <Link
      to={lang === "el" ? "/el/work/$slug" : "/work/$slug"}
      params={{ slug: cs.slug }}
      className={className}
      tabIndex={tabIndex}
    >
      {children}
    </Link>
  );
}

/** "Ongoing · since October 2026", "Delivered" */
function StatusLine({ cs }: { cs: CaseStudy }) {
  const { c } = useCopy();
  const w = c.work;
  let when = "";
  if (cs.status === "ongoing" && cs.since) {
    const [y, m] = cs.since.split("-").map(Number);
    when = ` · ${w.sinceWord} ${w.months[m - 1]} ${y}`;
  }
  return (
    <span className={`t14-wk-status is-${cs.status}`}>
      <i aria-hidden="true" />
      {w.status[cs.status]}
      {when}
    </span>
  );
}

/* ================================ /work ================================ */
export function WorkPage() {
  const { c, lang } = useCopy();
  const w = c.work;
  return (
    <>
      <PageHead p={c.pageHeads.work} />
      <section className="t14-wrap t14-wk">
        <h2 className="t14-wk-title">
          {w.title} <span>{w.titleGrey}</span>
        </h2>
        <ul className="t14-wk-grid">
          {publishedCases.map((cs, i) => {
            const t = caseText(cs, lang);
            return (
              <li key={cs.slug} className="t14-wk-card">
                <CaseLink cs={cs} className="t14-wk-card-in">
                  <small>
                    <span>{String(i + 1).padStart(2, "0")}</span> · {t.sector} · {t.location}
                  </small>
                  <h3 className={cs.logos?.length ? "t14-wk-logo" : undefined}>
                    <ClientMark cs={cs} name={t.client} />
                  </h3>
                  <p>{t.cardLine}</p>
                  <ul className="t14-wk-tags" aria-label={w.labels.services}>
                    {t.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="t14-wk-card-f">
                    <StatusLine cs={cs} />
                    <b>
                      {w.view} <i aria-hidden="true">→</i>
                    </b>
                  </div>
                </CaseLink>
              </li>
            );
          })}
        </ul>
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

  return (
    <>
      <section className="t14-wrap t14-case-head">
        <Link className="t14-case-back" to={href(v14Routes.work)}>{w.back}</Link>
        {cs.logos?.length ? (
          <div className="t14-case-logos">
            {cs.logos.map((l) => (
              <Logo key={l.src} l={l} decorative />
            ))}
          </div>
        ) : null}
        <small className="t14-case-kicker">
          {t.sector} · {t.location}
        </small>
        <h1 className="t14-case-title">{t.client}</h1>
        <p className="t14-case-lead">{t.cardLine}</p>
        <div className="t14-case-meta">
          <StatusLine cs={cs} />
          <ul className="t14-wk-tags" aria-label={w.labels.services}>
            {t.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a className="t14-case-visit" href={cs.url} target="_blank" rel="noopener noreferrer">
            {w.visit} {cs.domain} <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section className="t14-wrap t14-case-body">
        {blocks.map((b, i) => (
          <div key={b.key} className="t14-case-row">
            <h2>
              <span className="t14-case-n"><sup>#.</sup>{String(i + 1).padStart(2, "0")}</span>
              {b.label}
            </h2>
            <div className="t14-case-text">{b.body}</div>
          </div>
        ))}
      </section>

      {next.slug !== cs.slug && (
        <section className="t14-wrap">
          <CaseLink cs={next} className="t14-case-next">
            <small>{w.next} →</small>
            <b>{caseText(next, lang).client}</b>
          </CaseLink>
        </section>
      )}

      <FinalBand />
    </>
  );
}

/* ================================ home: the work strip ================================ */
/**
 * The client logos running in a strip, like the footer ticker (09/10, Mike): a dark band, the logos in white
 * with an orange ✳ between them, each logo a link to its case; the strip stops while the pointer is on it.
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
