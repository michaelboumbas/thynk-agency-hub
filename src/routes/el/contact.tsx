import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/contact", copy from src/content/site-v14-el.ts.
const title = "Επικοινωνία — Thynk Digital Agency";
const description = "Επικοινωνήστε με τη Thynk Digital Agency στα Ιωάννινα: γραφείο, τηλέφωνο, email και ωράριο. Ξεκινήστε με ένα audit.";

export const Route = createFileRoute("/el/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/contact" lang="el" />,
});
