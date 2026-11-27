import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";
import { ARTICLES_LIVE } from "@/content/articles";

// 27/11/2026 (Mike): Thynk Notes, the articles list. Indexed and in the sitemap only once an article is published.
export const Route = createFileRoute("/el/articles/")({
  staticData: { sitemap: ARTICLES_LIVE },
  head: () =>
    seoHead({
      path: "/articles",
      lang: "el",
      title: "Thynk Notes · Άρθρα για marketing και AI · Thynk Digital Agency",
      description: "Άρθρα της Thynk για digital marketing, AI και αυτοματισμούς: τι μαθαίνουμε δουλεύοντας με επιχειρήσεις, γραμμένα απλά και με παραδείγματα.",
      noindex: !ARTICLES_LIVE,
    }),
  component: () => <CleanPage path="/articles" lang="el" />,
});
