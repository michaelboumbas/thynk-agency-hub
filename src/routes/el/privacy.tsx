import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// Greek Privacy Policy (12/10/2026). Same page as "/privacy", copy from src/content/privacy-v14.ts.
const title = "Πολιτική Απορρήτου — Thynk Digital Agency";
const description = "Πώς διαχειρίζεται η Thynk Digital Agency τα στοιχεία που στέλνετε μέσω της φόρμας audit: τι συλλέγουμε, γιατί, πού φυλάσσονται και τα δικαιώματά σας.";

export const Route = createFileRoute("/el/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/privacy" lang="el" />,
});
