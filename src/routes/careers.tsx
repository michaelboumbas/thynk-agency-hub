import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Careers, open applications. 09/11: title/description lead with the open role. Copy: src/content/careers-v14.ts, page: src/components/thynk14/careers.tsx.
const title = "Open role: Social Media Storyteller — Thynk";
const description =
  "Thynk Digital Agency is hiring a Social Media Storyteller (Content Creator & Social Media Manager) in Ioannina. Open applications also for performance marketing, design, video editing, web development and AI automation.";

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
