import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Careers, Greek version. 09/11: title led with the open role; 26/11 the role is filled, so a general title. Same page as "/careers", copy from src/content/careers-v14.ts.
const title = "Καριέρα — Thynk Digital Agency";
const description =
  "Δουλέψτε με τη Thynk Digital Agency στα Ιωάννινα. Δεχόμαστε αιτήσεις συνεργασίας για performance marketing, social media, design, video editing, web development και AI αυτοματισμούς.";

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
