import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/audit")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/audit",
      lang: "en",
      title: "AI Audit: what to automate first · Thynk",
      description: "A paid analysis of your processes, tools and data with a concrete deliverable: what to automate first, what next and what not.",
    }),
  component: () => <CleanPage path="/audit" />,
});
