import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/about",
      lang: "en",
      title: "About · Thynk Digital Agency, Ioannina",
      description: "The team behind Thynk Digital Agency: digital marketing and AI automation for businesses across Greece, based in Ioannina.",
    }),
  component: () => <CleanPage path="/about" />,
});
