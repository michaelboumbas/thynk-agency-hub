import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/thynk11/Site";

const title = "Ποιοι είμαστε — Thynk Digital Agency";
const description = "Η ομάδα της Thynk Digital Agency: Δημήτρης Χρυσοχόου και Μιχαήλ Μπούμπας. Έδρα Ιωάννινα, συνεργασίες σε όλη την Ελλάδα και το εξωτερικό.";

export const Route = createFileRoute("/poioi-eimaste")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <SitePage path="/poioi-eimaste" />,
});
