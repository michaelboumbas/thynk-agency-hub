import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/thynk11/Site";

const title = "Το audit — Thynk Digital Agency";
const description = "Μάθετε πού χάνει χρόνο και πελάτες η επιχείρησή σας. Σύντομο, αμειβόμενο audit με ιεραρχημένο πλάνο ενεργειών.";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <SitePage path="/audit" />,
});
