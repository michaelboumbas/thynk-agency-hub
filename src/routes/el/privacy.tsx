import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/privacy")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/privacy",
      lang: "el",
      title: "Πολιτική Απορρήτου · Thynk Digital Agency",
      description: "Τι στοιχεία συλλέγει η Thynk Digital Agency μέσω του site, γιατί, πού φυλάσσονται και ποια είναι τα δικαιώματά σας.",
    }),
  component: () => <CleanPage path="/privacy" lang="el" />,
});
