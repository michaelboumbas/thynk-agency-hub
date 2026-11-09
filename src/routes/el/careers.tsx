import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Careers, Greek version. 09/11: title/description lead with the open role (LinkedIn preview). Same page as "/careers", copy from src/content/careers-v14.ts.
const title = "Ανοιχτή θέση: Content Creation & Social Media Management — Thynk";
const description =
  "Η Thynk Digital Agency ανοίγει θέση Content Creation & Social Media Management στα Ιωάννινα, μερική ή πλήρης απασχόληση. Δεχόμαστε και αιτήσεις για performance marketing, design, video editing, web development και AI automation.";

export const Route = createFileRoute("/el/careers")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/careers" lang="el" />,
});
