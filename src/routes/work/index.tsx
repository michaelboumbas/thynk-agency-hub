import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (07/10/2026, Mike): the case studies. Cases and copy: src/content/work-v14.ts.
const title = "Clients — Thynk Digital Agency";
const description =
  "Brands we Thynk with: business awards, international conferences, a monastic winery, a destination guide, education and events. Every account runs through Thynk.";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/work" />,
});
