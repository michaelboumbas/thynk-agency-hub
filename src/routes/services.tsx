import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 (02/10/2026): English page in the «Thynk Clean» style.
const title = "Services — Thynk Digital Agency";
const description = "Marketing and digital transformation with AI: advertising, social media, email, automation, AI agents, data. Every engagement starts with an audit.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <CleanPage path="/services" />,
});
