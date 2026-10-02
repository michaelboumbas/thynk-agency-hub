import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (02/10/2026): English page in the «Thynk Clean» style (the v11 Greek audit page is no longer routed).
const title = "Audit — Thynk Digital Agency";
const description =
  "Find out where your business loses time and customers. A short, paid audit with a prioritized action plan that stays yours.";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/audit" />,
});
