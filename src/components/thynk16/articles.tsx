import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useCopy } from "@/components/thynk14/i18n";
import { Mk } from "./bits";
import { TalkButton } from "./v16";
import { authors, formatDate, visibleArticles, type Article } from "@/content/articles";
import { v14Routes } from "@/content/site-v14";
import { NewsletterForm } from "@/components/thynk14/newsletter";

/**
 * Thynk Notes (27/11/2026, Mike approved the canvas «Άρθρα · λίστα desktop», «Άρθρο · desktop», «Άρθρα · κινητό»).
 * Content: src/content/articles.ts. Drafts show only with ?preview=1. Styles: the `t16-ar` block in thynk16.css.
 */
const T = {
  el: {
    eyebrow: "ΑΡΘΡΑ",
    lead: "Τι μαθαίνουμε δουλεύοντας με επιχειρήσεις: marketing, AI και αυτοματισμοί, γραμμένα απλά και με παραδείγματα.",
    all: "Όλα",
    cats: "Κατηγορίες",
    read: "ανάγνωση",
    readMore: "Διαβάστε το άρθρο →",
    empty: "Τα πρώτα άρθρα έρχονται σύντομα. Γραφτείτε στις ενημερώσεις για να τα λάβετε πρώτοι.",
    newsTitle: "Ένα άρθρο, δύο φορές τον μήνα.",
    newsText: "Πρακτικές ιδέες για marketing και AI στο email σας. Χωρίς spam, φεύγετε όποτε θέλετε.",
    back: "← ΑΡΘΡΑ",
    toc: "ΣΕ ΑΥΤΟ ΤΟ ΑΡΘΡΟ",
    share: "ΜΟΙΡΑΣΤΕΙΤΕ",
    copy: "Link",
    copied: "Αντιγράφηκε",
    glance: "ΜΕ ΜΙΑ ΜΑΤΙΑ",
    ctaTitle: "Θέλετε να το δούμε για τη δική σας επιχείρηση;",
    ctaText: "Ξεκινάμε με μια πρώτη συζήτηση. Σας λέμε ειλικρινά τι θα κάναμε πρώτο.",
    more: "Διαβάστε επίσης",
    draft: "ΠΡΟΣΧΕΔΙΟ · δεν φαίνεται στο site",
    enOnly: "",
  },
  en: {
    eyebrow: "ARTICLES",
    lead: "What we learn working with businesses: marketing, AI and automation, written plainly and with examples.",
    all: "All",
    cats: "Categories",
    read: "read",
    readMore: "Read the article →",
    empty: "Our first articles are on their way. Sign up for updates to get them first.",
    newsTitle: "One article, twice a month.",
    newsText: "Practical ideas on marketing and AI in your inbox. No spam, leave whenever you like.",
    back: "← ARTICLES",
    toc: "IN THIS ARTICLE",
    share: "SHARE",
    copy: "Link",
    copied: "Copied",
    glance: "AT A GLANCE",
    ctaTitle: "Want us to look at this for your business?",
    ctaText: "We start with a first conversation and tell you honestly what we would do first.",
    more: "Read next",
    draft: "DRAFT · not shown on the site",
    enOnly: "Our articles are in Greek for now.",
  },
};

function usePreview() {
  const [p, setP] = useState(false);
  useEffect(() => {
    setP(new URLSearchParams(window.location.search).get("preview") === "1");
  }, []);
  return p;
}

function Author({ a, small = false }: { a: Article; small?: boolean }) {
  const { lang } = useCopy();
  const au = authors[a.author];
  return (
    <span className={`t16-ar-au${small ? " sm" : ""}`}>
      <img src={au.photo} alt="" loading="lazy" />
      <span>
        <b>{au.name[lang]}</b>
        {!small && <small lang="en">{au.role}</small>}
      </span>
    </span>
  );
}

function Ripples() {
  return (
    <svg className="t16-ripples" aria-hidden="true" width="560" height="560" viewBox="0 0 560 560">
      <g fill="none" stroke="#ffffff" strokeOpacity=".09" strokeWidth="2">
        <circle cx="280" cy="280" r="90" />
        <circle cx="280" cy="280" r="170" />
        <circle cx="280" cy="280" r="250" />
      </g>
    </svg>
  );
}

/** a link to one article, keeping ?preview=1 while previewing drafts */
function ArticleLink({ a, preview, className, children }: { a: Article; preview: boolean; className?: string; children: ReactNode }) {
  const { lang } = useCopy();
  return (
    <Link
      className={className}
      to={lang === "el" ? "/el/articles/$slug" : "/articles/$slug"}
      params={{ slug: a.slug }}
      search={(preview ? { preview: "1" } : {}) as never}
    >
      {children}
    </Link>
  );
}

function Card({ a, preview }: { a: Article; preview: boolean }) {
  const { lang } = useCopy();
  return (
    <ArticleLink className="t16-ar-card" a={a} preview={preview}>
      <span className="t16-ar-meta">
        <span className="t16-ar-chip">{a.category}</span>
        <span>{formatDate(a.date, lang)} · {a.minutes}′</span>
      </span>
      <h3>{a.title}</h3>
      <p>{a.excerpt}</p>
      <Author a={a} small />
    </ArticleLink>
  );
}

function Newsletter() {
  const { lang } = useCopy();
  const t = T[lang];
  return (
    <section className="t16-wrap t16-band-wrap">
      <div className="t16-band">
        <Ripples />
        <div>
          <h2>{t.newsTitle}</h2>
          <p>{t.newsText}</p>
        </div>
        <div className="t16-ar-nl">
          <NewsletterForm source="footer" />
        </div>
      </div>
    </section>
  );
}

/* ================================ list ================================ */
export function ArticlesPage() {
  const { lang, href } = useCopy();
  const t = T[lang];
  const preview = usePreview();
  const list = visibleArticles(lang, preview);
  const cats = [...new Set(list.map((a) => a.category))];
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? list.filter((a) => a.category === cat) : list;
  const [first, ...rest] = shown;
  return (
    <>
      <section className="t16-head t16-wrap">
        <p className="t16-lbl">{t.eyebrow}</p>
        <h1 className="t16-h1" lang="en">Thynk <Mk>Notes.</Mk></h1>
        <div className="t16-head-row">
          <p className="t16-lead">{t.lead}</p>
          {cats.length > 1 && (
            <nav className="t16-ar-cats" aria-label={t.cats}>
              <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)}>{t.all}</button>
              {cats.map((c) => (
                <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
              ))}
            </nav>
          )}
        </div>
      </section>

      {!first ? (
        <section className="t16-wrap t16-ar-empty">
          <p>{lang === "en" ? <>{t.enOnly} <Link to="/el/articles">Ελληνικά →</Link></> : t.empty}</p>
        </section>
      ) : (
        <>
          <section className="t16-wrap">
            <ArticleLink className="t16-ar-feature t16-rv" a={first} preview={preview}>
              <span className="t16-ar-cover">
                <Ripples />
                <b>{first.cover}</b>
              </span>
              <span className="t16-ar-fbody">
                <span className="t16-ar-meta">
                  <span className="t16-ar-chip">{first.category}</span>
                  <span>{formatDate(first.date, lang)} · {first.minutes}′ {t.read}</span>
                  {!first.published && <span className="t16-ar-draft">{t.draft}</span>}
                </span>
                <h2>{first.title}</h2>
                <p>{first.excerpt}</p>
                <Author a={first} />
                <span className="t16-ghost">{t.readMore}</span>
              </span>
            </ArticleLink>
          </section>
          {rest.length > 0 && (
            <section className="t16-wrap t16-ar-grid">
              {rest.map((a) => (
                <Card key={a.slug} a={a} preview={preview} />
              ))}
            </section>
          )}
        </>
      )}
      <Newsletter />
    </>
  );
}

/* ================================ article ================================ */
export function ArticlePage({ a }: { a: Article }) {
  const { lang, href } = useCopy();
  const t = T[lang];
  const preview = usePreview();
  const [copied, setCopied] = useState(false);
  const more = visibleArticles(lang, preview).filter((x) => x.slug !== a.slug).slice(0, 3);
  const url = `https://thynkagency.gr${lang === "el" ? "/el" : ""}${v14Routes.articles}/${a.slug}`;
  const rest = a.mark && a.title.startsWith(a.mark) ? a.title.slice(a.mark.length) : null;
  return (
    <>
      <section className="t16-head t16-wrap t16-ar-head">
        <Link className="t16-lbl t16-back" to={href(v14Routes.articles)}>{t.back} · {a.category.toUpperCase()}</Link>
        {!a.published && <p className="t16-ar-draft">{t.draft}</p>}
        <h1 className="t16-ar-title">{rest !== null ? <><Mk>{a.mark}</Mk>{rest}</> : a.title}</h1>
        <div className="t16-ar-byline">
          <Author a={a} />
          <span>{formatDate(a.date, lang, true)} · {a.minutes}′ {t.read}</span>
        </div>
      </section>

      <div className="t16-wrap">
        <div className="t16-ar-hero" aria-hidden="true">
          <Ripples />
          <b>{a.cover}</b>
        </div>
      </div>

      <section className="t16-wrap t16-ar-layout">
        <nav className="t16-ar-toc" aria-label={t.toc}>
          <span className="t16-lbl">{t.toc}</span>
          {a.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.h}</a>
          ))}
          <span className="t16-lbl t16-ar-share-l">{t.share}</span>
          <span className="t16-ar-share">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(url).then(() => setCopied(true), () => {});
              }}
            >
              {copied ? t.copied : t.copy}
            </button>
          </span>
        </nav>
        <article className="t16-ar-body">
          <aside className="t16-ar-glance">
            <span className="t16-lbl">{t.glance}</span>
            <ul>
              {a.takeaways.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </aside>
          <p className="t16-ar-lead">{a.lead}</p>
          {a.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.quote && <blockquote>{s.quote}</blockquote>}
            </section>
          ))}
          <div className="t16-ar-end">
            <Author a={a} />
          </div>
        </article>
      </section>

      <section className="t16-wrap t16-band-wrap">
        <div className="t16-band">
          <Ripples />
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>
          <TalkButton className="t16-btn light" />
        </div>
      </section>

      {more.length > 0 && (
        <section className="t16-wrap t16-ar-more">
          <h2 className="t16-h2">{t.more}</h2>
          <div className="t16-ar-grid">
            {more.map((x) => (
              <Card key={x.slug} a={x} preview={preview} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
