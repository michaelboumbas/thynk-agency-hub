import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/privacy",
      lang: "en",
      title: "Privacy Policy · Thynk Digital Agency",
      description: "What Thynk Digital Agency collects through this website, why, where it is kept and your rights.",
    }),
  component: () => <CleanPage path="/privacy" />,
});
