import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (02/10/2026): English page in the «Thynk Clean» style.
const title = "About us — Thynk Digital Agency";
const description = "Thynk Digital Agency, Ioannina, Greece. Founded by Dimitris Chrysochoou and Michael Boumpas. You talk to the founders directly.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/about" />,
});
