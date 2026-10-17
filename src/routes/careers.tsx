import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Careers, open applications. Copy: src/content/careers-v14.ts, page: src/components/thynk14/careers.tsx.
const title = "Careers — Thynk Digital Agency";
const description =
  "Open applications at Thynk Digital Agency in Ioannina: performance marketing, social media management, design, video editing, web development and AI automation. Freelance, part-time or full-time.";

export const Route = createFileRoute("/careers")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/careers" />,
});
