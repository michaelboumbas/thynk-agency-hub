import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/about", copy from src/content/site-v14-el.ts.
const title = "Ποιοι είμαστε — Thynk Digital Agency";
const description =
  "Thynk Digital Agency, Ιωάννινα. Ιδρυτές: Δημήτρης Χρυσοχόου και Μιχαήλ Μπούμπας. Μιλάτε απευθείας με τους ιδρυτές.";

export const Route = createFileRoute("/el/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/about" lang="el" />,
});
