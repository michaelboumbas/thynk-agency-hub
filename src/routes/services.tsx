import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/services")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/services",
      lang: "en",
      title: "Digital Marketing & AI Automation Services · Thynk",
      description: "Performance marketing on Google, Meta, TikTok and ChatGPT, social media management, strategy, content creation, email & SMS marketing, websites and AI automation.",
    }),
  component: () => <CleanPage path="/services" />,
});
