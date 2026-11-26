import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/careers")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/careers",
      lang: "el",
      title: "Καριέρα · Thynk Digital Agency",
      description: "Δουλέψτε με τη Thynk Digital Agency στα Ιωάννινα. Δεχόμαστε αιτήσεις συνεργασίας για performance marketing, social media, design, video editing, web development και AI αυτοματισμούς.",
    }),
  component: () => <CleanPage path="/careers" lang="el" />,
});
