import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/",
      lang: "el",
      title: "Thynk Digital Agency · Digital Marketing & AI αυτοματισμοί, Ιωάννινα",
      description: "Digital marketing και AI αυτοματισμοί από τα Ιωάννινα: διαφήμιση σε Google, Meta, TikTok και ChatGPT, social media, περιεχόμενο, websites και AI Audit.",
      schema: true,
    }),
  component: () => <CleanPage path="/" lang="el" />,
});
