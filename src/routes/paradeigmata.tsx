import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/thynk11/Site";

const title = "Παραδείγματα συστημάτων — Thynk Digital Agency";
const description = "Ενδεικτικά συστήματα με AI που στήνουμε: βοηθός κρατήσεων, follow-up προσφορών, αναφορές διαφημίσεων, τιμολόγια.";

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
