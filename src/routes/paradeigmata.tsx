import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/thynk11/Site";

const title = "Λύσεις — Thynk Digital Agency";
const description = "Ενδεικτικές λύσεις AI: ψηφιακός βοηθός κρατήσεων, follow-up προσφορών, αναφορές απόδοσης, καταχώριση παραστατικών.";

export const Route = createFileRoute("/paradeigmata")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <SitePage path="/paradeigmata" />,
});
