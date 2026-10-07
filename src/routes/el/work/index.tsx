import { createFileRoute } from "@tanstack/react-router";
import { CleanPage } from "@/components/thynk14/CleanSite";

// v14 Greek version (07/10/2026). Same page as "/work", copy from src/content/work-v14.ts.
const title = "Έργα — Thynk Digital Agency";
const description =
  "Brands we Thynk with: βραβεία επιχειρηματικότητας, διεθνή συνέδρια, ένα μοναστηριακό οινοποιείο, ένας οδηγός προορισμού, εκπαίδευση και εκδηλώσεις. Κάθε συνεργασία περνά μέσα από τη Thynk.";

export const Route = createFileRoute("/el/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
    ],
  }),
  component: () => <CleanPage path="/work" lang="el" />,
});
