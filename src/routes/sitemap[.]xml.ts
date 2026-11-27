import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";
import { publishedCases } from "@/content/work-v14";
import { articles } from "@/content/articles";

const BASE_URL = "https://thynkagency.gr";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        // 26/11/2026 (SEO): the client case pages, in both languages (dynamic routes are not picked up above)
        for (const cs of publishedCases) {
          entries.push({ path: `/work/${cs.slug}` }, { path: `/el/work/${cs.slug}` });
        }
        // 27/11/2026: published articles, each in its own language
        for (const a of articles) {
          if (a.published) entries.push({ path: `${a.lang === "el" ? "/el" : ""}/articles/${a.slug}` });
        }
        if (entries.length === 0) {
          return new Response("No pages are included in this sitemap.", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
          });
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
