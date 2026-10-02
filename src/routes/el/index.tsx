import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/", copy from src/content/site-v14-el.ts.
const title = "Thynk Digital Agency — Το μέλλον της Super Intelligence";
const description =
  "Marketing και Digital Transformation με AI για επιχειρήσεις σε όλη την Ελλάδα και στο εξωτερικό. Έδρα Ιωάννινα. Κάθε συνεργασία ξεκινά με audit.";

export const Route = createFileRoute("/el/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/" lang="el" />,
});
