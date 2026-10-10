import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (02/10/2026): contact page. Address + phone are real (10/10). ⚠️ office hours are still demo values in site-v14.ts.
const title = "Contact — Thynk Digital Agency";
const description = "Contact Thynk Digital Agency in Ioannina, Greece: office, phone, email and office hours. Start with an audit.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/contact" />,
});
