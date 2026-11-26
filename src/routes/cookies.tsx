import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/cookies")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/cookies",
      lang: "en",
      title: "Cookies · Thynk Digital Agency",
      description: "The Thynk website uses no advertising or analytics cookies. What is stored in your browser and which services it connects to.",
    }),
  component: () => <CleanPage path="/cookies" />,
});
