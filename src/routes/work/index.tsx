import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): the clients wall. Cases and copy: src/content/work-v14.ts.
export const Route = createFileRoute("/work/")({
  staticData: { sitemap: true },
  head: () => seoHead({ path: "/work", lang: "en", title: "Clients · Thynk Digital Agency", description: "Brands we Thynk with: Manager of the Year, Imperator Winery, Kalliopi Taxidou, θamõn, μάιμέτσοβο and the other clients of Thynk Digital Agency." }),
  component: () => <CleanPage path="/work" />,
});
