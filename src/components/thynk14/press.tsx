import { useEffect, useRef, useState } from "react";
import { useCopy } from "./i18n";
import { FinalBand, Label, PageHead } from "./shared";
import { pressCopy, pressDate, pressKit, publishedPress, type PressItem } from "@/content/press-v14";

/**
 * Press (17/10/2026, Mike): /press and /el/press. The newest piece is a large card, the rest are rows
 * under it, newest first. Each links out to the original. Below: the kit for journalists (contact,
 * a short text about Thynk with a copy button, the logo pack). Entries and copy: src/content/press-v14.ts.
 */

/** date · type · the language of the piece, only when it differs from the page */
function Meta({ it }: { it: PressItem }) {
  const { lang } = useCopy();
  const p = pressCopy[lang];
  return (
    <p className="t14-pr-meta">
      <time dateTime={it.date}>{pressDate(it.date, lang)}</time>
      <span aria-hidden="true"> · </span>
      {p.types[it.type]}
      {it.lang !== lang && (
        <>
          <span aria-hidden="true"> · </span>
          {p.inLang[it.lang]}
        </>
      )}
    </p>
  );
}

function ReadLine({ it }: { it: PressItem }) {
  const { lang } = useCopy();
  const p = pressCopy[lang];
  return (
    <span className="t14-pr-read">
      {p.read.replace("{site}", it.site)}
      <i aria-hidden="true">↗</i>
      <span className="t14-sr"> {p.newTab}</span>
    </span>
  );
}

/** the newest piece, large */
function Featured({ it }: { it: PressItem }) {
  const { lang } = useCopy();
  return (
    <a className="t14-pr-feat" href={it.url} target="_blank" rel="noopener" hrefLang={it.lang}>
      <div className="t14-pr-feat-l">
        <Meta it={it} />
        <span className="t14-pr-outlet">{it.outlet}</span>
      </div>
      <div className="t14-pr-feat-r">
        <h2 className="t14-pr-head" lang={it.lang}>{it.headline}</h2>
        <p className="t14-pr-note">{it.note[lang]}</p>
        <ReadLine it={it} />
      </div>
    </a>
  );
}

/** an older piece, one row */
function Row({ it }: { it: PressItem }) {
  const { lang } = useCopy();
  return (
    <li>
      <a className="t14-pr-row" href={it.url} target="_blank" rel="noopener" hrefLang={it.lang}>
        <span className="t14-pr-row-outlet">{it.outlet}</span>
        <div className="t14-pr-row-body">
          <h3 className="t14-pr-row-head" lang={it.lang}>{it.headline}</h3>
          <p className="t14-pr-note">{it.note[lang]}</p>
        </div>
        <div className="t14-pr-row-side">
          <Meta it={it} />
          <ReadLine it={it} />
        </div>
      </a>
    </li>
  );
}

/** the short text about Thynk, with a button that copies it */
function AboutText({ text }: { text: string }) {
  const { lang } = useCopy();
  const k = pressCopy[lang].kit;
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no clipboard access (old browser, insecure context): select the text so Ctrl/Cmd+C works
      const el = box.current;
      const sel = window.getSelection();
      if (!el || !sel) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <p ref={box} className="t14-pr-about">{text}</p>
      <button type="button" className="t14-pill ghost" onClick={copy}>
        {copied ? k.copied : k.copy}
      </button>
      <span className="t14-sr" aria-live="polite">{copied ? k.copied : ""}</span>
    </>
  );
}

export function PressPage() {
  const { lang } = useCopy();
  const p = pressCopy[lang];
  const k = p.kit;
  const [first, ...rest] = publishedPress;

  return (
    <>
      <PageHead p={p.head} />

      {first && (
        <section className="t14-wrap t14-press" aria-label={p.listLabel}>
          <Featured it={first} />
          {rest.length > 0 && (
            <ol className="t14-pr-list">
              {rest.map((it) => (
                <Row key={it.id} it={it} />
              ))}
            </ol>
          )}
        </section>
      )}

      <section className="t14-wrap t14-pr-kit" id="kit" aria-labelledby="t14-pr-kit-title">
        <Label>{k.label}</Label>
        <div className="t14-pr-kit-grid">
          <div className="t14-pr-kit-intro">
            <h2 id="t14-pr-kit-title">{k.title}</h2>
            <p>{k.intro}</p>
            <p className="t14-pr-spell">{k.spelling}</p>
          </div>
          <div className="t14-pr-kit-blocks">
            <div className="t14-pr-block">
              <h3>{k.contactLabel}</h3>
              <a className="t14-pr-mail" href={`mailto:${pressKit.email}`}>{pressKit.email}</a>
            </div>
            <div className="t14-pr-block">
              <h3>{k.aboutLabel}</h3>
              <AboutText text={k.about} />
            </div>
            <div className="t14-pr-block">
              <h3>{k.logosLabel}</h3>
              <a className="t14-pill" href={pressKit.zip} download>
                {k.download}
                <i aria-hidden="true">↓</i>
              </a>
              <p className="t14-pr-small">{k.logosNote}</p>
            </div>
          </div>
        </div>
      </section>

      <FinalBand />
    </>
  );
}
