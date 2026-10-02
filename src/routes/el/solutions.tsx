import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/solutions", copy from src/content/site-v14-el.ts.
const title = "Λύσεις — Thynk Digital Agency";
const description =
  "Ενδεικτικές λύσεις AI της Thynk: βοηθός κρατήσεων, follow-up προσφορών, εβδομαδιαία αναφορά απόδοσης, αυτόματη καταχώριση παραστατικών και άλλες.";

export const Route = createFileRoute("/el/solutions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/solutions" lang="el" />,
});
