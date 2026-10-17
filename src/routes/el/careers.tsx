import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Careers, Greek version. Same page as "/careers", copy from src/content/careers-v14.ts.
const title = "Καριέρα — Thynk Digital Agency";
const description =
  "Ανοιχτές αιτήσεις στη Thynk Digital Agency στα Ιωάννινα: performance marketing, social media management, design, video editing, web development και AI automation. Freelance, μερική ή πλήρης απασχόληση.";

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
