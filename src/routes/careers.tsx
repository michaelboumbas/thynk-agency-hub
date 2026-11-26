import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/careers")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/careers",
      lang: "en",
      title: "Careers · Thynk Digital Agency",
      description: "Work with Thynk Digital Agency in Ioannina, Greece. We accept applications in performance marketing, social media, design, video editing, web development and AI automation.",
    }),
  component: () => <CleanPage path="/careers" />,
});
