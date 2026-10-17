import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Press. Entries and copy: src/content/press-v14.ts, page: src/components/thynk14/press.tsx.
const title = "Press — Thynk Digital Agency";
const description =
  "Articles about Thynk Digital Agency, each linking to the original publication, and a kit for journalists: press contact, a short company description and the logo files.";

export const Route = createFileRoute("/press")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/press" />,
});
