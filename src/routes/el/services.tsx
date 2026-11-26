import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/services")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/services",
      lang: "el",
      title: "Υπηρεσίες Digital Marketing & AI Automations · Thynk",
      description: "Performance marketing σε Google, Meta, TikTok και ChatGPT, social media management, στρατηγική, content creation, email & SMS marketing, websites και AI αυτοματισμοί.",
    }),
  component: () => <CleanPage path="/services" lang="el" />,
});
