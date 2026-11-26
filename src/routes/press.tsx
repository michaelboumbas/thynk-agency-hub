import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/press")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/press",
      lang: "en",
      title: "Press · Thynk Digital Agency",
      description: "Articles about Thynk Digital Agency, each linking to the original, and a kit for journalists: press contact, a short description and the logo files.",
    }),
  component: () => <CleanPage path="/press" />,
});
