import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/press")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/press",
      lang: "el",
      title: "Στον Τύπο · Thynk Digital Agency",
      description: "Δημοσιεύματα για τη Thynk Digital Agency, με σύνδεσμο στην αρχική πηγή, και υλικό για δημοσιογράφους: επαφή, σύντομη περιγραφή και λογότυπα.",
    }),
  component: () => <CleanPage path="/press" lang="el" />,
});
