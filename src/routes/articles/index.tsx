import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";
import { ARTICLES_LIVE } from "@/content/articles";

// 27/11/2026 (Mike): Thynk Notes, the articles list. Indexed and in the sitemap only once an article is published.
export const Route = createFileRoute("/articles/")({
  staticData: { sitemap: ARTICLES_LIVE },
  head: () =>
    seoHead({
      path: "/articles",
      lang: "en",
      title: "Thynk Notes · Articles on marketing and AI · Thynk Digital Agency",
      description: "Thynk articles on digital marketing, AI and automation: what we learn working with businesses, written plainly and with examples.",
      noindex: !ARTICLES_LIVE,
    }),
  component: () => <CleanPage path="/articles" />,
});
