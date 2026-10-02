import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (02/10/2026). Same page as "/audit", copy from src/content/site-v14-el.ts.
const title = "Το audit — Thynk Digital Agency";
const description =
  "Μάθετε πού χάνει χρόνο και πελάτες η επιχείρησή σας. Σύντομο, αμειβόμενο audit με ιεραρχημένο πλάνο ενεργειών που παραμένει δικό σας.";

export const Route = createFileRoute("/el/audit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/audit" lang="el" />,
});
