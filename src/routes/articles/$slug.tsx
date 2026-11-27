import { createFileRoute, notFound } from "@tanstack/react-router";
import { CleanArticlePage } from "@/components/thynk14/CleanSite";
import { authors, getArticle } from "@/content/articles";
import { SITE, seoHead } from "@/lib/seo";

// 27/11/2026: one article. Drafts (published: false) are reachable for review but never indexed.
export const Route = createFileRoute("/articles/$slug")({
  staticData: { sitemap: false },
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a || a.lang !== "en") throw notFound();
    return null;
  },
  head: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) return {};
    const h = seoHead({ path: `/articles/${a.slug}`, lang: "en", title: `${a.title} · Thynk Notes`, description: a.excerpt, noindex: !a.published });
    // one language per article: canonical to itself, no hreflang pair
    const self = `${SITE}/articles/${a.slug}`;
    return {
      ...h,
      links: [{ rel: "canonical", href: self }],
      meta: [...h.meta.filter((m) => m.property !== "og:type"), { property: "og:type", content: "article" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: a.excerpt,
            datePublished: a.date,
            inLanguage: a.lang,
            author: { "@type": "Person", name: authors[a.author].name.en },
            publisher: { "@id": `${SITE}/#organization` },
            mainEntityOfPage: self,
          }),
        },
      ],
    };
  },
  component: ArticleRoute,
});

function ArticleRoute() {
  const { slug } = Route.useParams();
  const a = getArticle(slug);
  if (!a) return null;
  return <CleanArticlePage a={a} lang="en" />;
}
