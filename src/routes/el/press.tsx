import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 17/10/2026 (Mike): Press, Greek version. Same page as "/press", copy from src/content/press-v14.ts.
const title = "Στον Τύπο — Thynk Digital Agency";
const description =
  "Δημοσιεύματα για τη Thynk Digital Agency, με σύνδεσμο στην αρχική πηγή, και υλικό για δημοσιογράφους: επαφή, σύντομη περιγραφή της εταιρείας και τα αρχεία του λογότυπου.";

export const Route = createFileRoute("/el/press")({
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
  component: () => <CleanPage path="/press" lang="el" />,
});
