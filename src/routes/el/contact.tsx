import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/contact")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/contact",
      lang: "el",
      title: "Επικοινωνία · Thynk Digital Agency, Ιωάννινα",
      description: "Παπάζογλου 14Δ, Ιωάννινα · hello@thynkagency.gr · +30 698 388 7522. Πείτε μας για την επιχείρησή σας και κανονίζουμε μια πρώτη συζήτηση.",
    }),
  component: () => <CleanPage path="/contact" lang="el" />,
});
