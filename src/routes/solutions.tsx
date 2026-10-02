import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (02/10/2026): English page in the «Thynk Clean» style.
const title = "Solutions — Thynk Digital Agency";
const description = "Illustrative AI solutions by Thynk: booking assistant, quote follow-up, weekly performance report, automatic invoice entry and more.";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/solutions" />,
});
