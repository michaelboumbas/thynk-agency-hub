import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/el/cookies")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/cookies",
      lang: "el",
      title: "Cookies · Thynk Digital Agency",
      description: "Το site της Thynk δεν χρησιμοποιεί cookies διαφήμισης ή στατιστικών. Τι αποθηκεύεται στον browser σας και με ποιες υπηρεσίες συνδέεται.",
    }),
  component: () => <CleanPage path="/cookies" lang="el" />,
});
