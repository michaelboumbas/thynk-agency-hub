import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// 12/10/2026: Privacy Policy, linked from the audit form's consent and the footer. Copy in src/content/privacy-v14.ts.
const title = "Privacy Policy — Thynk Digital Agency";
const description = "How Thynk Digital Agency handles the details you send through the audit form: what we collect, why, where it is kept and your rights.";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/privacy" />,
});
