import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/services", copy from src/content/site-v14-el.ts.
const title = "Υπηρεσίες — Thynk Digital Agency";
const description =
  "Marketing και Digital Transformation με AI: διαφήμιση, social, email, αυτοματισμοί, AI agents, δεδομένα. Κάθε συνεργασία ξεκινά με audit.";

export const Route = createFileRoute("/el/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/services" lang="el" />,
});
