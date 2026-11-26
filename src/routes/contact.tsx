import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): title/description approved by Mike; canonical + hreflang from seoHead (src/lib/seo.ts).
export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () =>
    seoHead({
      path: "/contact",
      lang: "en",
      title: "Contact · Thynk Digital Agency, Ioannina",
      description: "Papazoglou 14D, Ioannina, Greece · hello@thynkagency.gr · +30 698 388 7522. Tell us about your business and we'll arrange a first conversation.",
    }),
  component: () => <CleanPage path="/contact" />,
});
