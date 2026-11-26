import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";
import { seoHead } from "@/lib/seo";

// 26/11/2026 (v16 + SEO): the clients wall. Cases and copy: src/content/work-v14.ts.
export const Route = createFileRoute("/el/work/")({
  staticData: { sitemap: true },
  head: () => seoHead({ path: "/work", lang: "el", title: "Πελάτες · Thynk Digital Agency", description: "Brands we Thynk with: Manager of the Year, Imperator Winery, Kalliopi Taxidou, θamõn, μάιμέτσοβο και οι υπόλοιποι πελάτες της Thynk Digital Agency." }),
  component: () => <CleanPage path="/work" lang="el" />,
});
