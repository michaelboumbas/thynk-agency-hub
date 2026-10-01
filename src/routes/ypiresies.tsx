import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/thynk11/Site";

const title = "Υπηρεσίες — Thynk Digital Agency";
const description = "Marketing και Digital Transformation με AI: διαφήμιση, social, email, αυτοματισμοί, AI agents, δεδομένα. Κάθε συνεργασία ξεκινά με audit.";

export const Route = createFileRoute("/ypiresies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <SitePage path="/ypiresies" />,
});
