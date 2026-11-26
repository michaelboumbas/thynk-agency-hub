import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/audit")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/audit",
      lang: "el",
      title: "AI Audit: τι αξίζει να αυτοματοποιηθεί πρώτο · Thynk",
      description: "Αμειβόμενη ανάλυση διαδικασιών, εργαλείων και δεδομένων με συγκεκριμένο παραδοτέο: τι αυτοματοποιείται πρώτο, τι μετά και τι όχι.",
    }),
  component: () => <CleanPage path="/audit" lang="el" />,
});
