import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "./i18n";
import { FinalBand, Label, MoreLink, PageHead } from "./shared";
import { v14Routes } from "@/content/site-v14";
import { caseText, nextCase, publishedCases, type CaseStudy } from "@/content/work-v14";

/**
 * Work (07/10/2026, Mike): /work lists the accounts that run through Thynk, /work/:slug tells one case.
 * Cases and their copy: src/content/work-v14.ts. No result numbers until measured: the Results block only
 * shows when a case has `results`.
 */

/** link to a case page in the current language */
function CaseLink({ cs, className, children }: { cs: CaseStudy; className?: string; children: ReactNode }) {
  const { lang } = useCopy();
  return (
    <Link to={lang === "el" ? "/el/work/$slug" : "/work/$slug"} params={{ slug: cs.slug }} className={className}>
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
                  <h3>{t.client}</h3>
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
/** the client names in a row, each to its case, then "All work →" (logos replace the names once we have them) */
export function WorkStrip() {
  const { c, lang } = useCopy();
  const w = c.work;
  return (
    <section className="t14-wrap t14-wk-strip" id="work">
      <Label>{w.homeLabel}</Label>
      <h2 className="t14-wk-title">
        {w.title} <span>{w.titleGrey}</span>
      </h2>
      <ul className="t14-wk-names">
        {publishedCases.map((cs) => (
          <li key={cs.slug}>
            <CaseLink cs={cs}>{caseText(cs, lang).client}</CaseLink>
          </li>
        ))}
      </ul>
      <MoreLink to={v14Routes.work}>{c.more.work}</MoreLink>
    </section>
  );
}
