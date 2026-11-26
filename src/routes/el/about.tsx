import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/about")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/about",
      lang: "el",
      title: "Ποιοι είμαστε · Thynk Digital Agency, Ιωάννινα",
      description: "Η ομάδα της Thynk Digital Agency: digital marketing και AI αυτοματισμοί για επιχειρήσεις σε όλη την Ελλάδα, με έδρα τα Ιωάννινα.",
    }),
  component: () => <CleanPage path="/about" lang="el" />,
});
