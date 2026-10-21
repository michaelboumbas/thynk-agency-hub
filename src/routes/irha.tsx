import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CleanShell } from "@/components/thynk14/Shell";
import { BookDialog, IrhaPage } from "@/components/thynk14/irha";
import { v14Routes } from "@/content/site-v14";
import { irha } from "@/content/irha-v14";

// 21/10/2026 (Mike): page for the members of the Ένωση Ξενοδόχων Νομού Ιωαννίνων (irha.gr), shared by the
// association after the presentation of 22/10. Greek only, not in the menu or the sitemap.
// The shell is the audit page's (menu: Audit, EL/EN switch → /audit); every «Κλείστε audit» opens the form here.
const { title, description } = irha.meta;

function IrhaRoute() {
  const [open, setOpen] = useState(false);
  const openBook = useCallback(() => setOpen(true), []);
  const closeBook = useCallback(() => setOpen(false), []);
  return (
    <CleanShell pathname={v14Routes.audit} lang="el" onBook={openBook}>
      <IrhaPage onBook={openBook} />
      <BookDialog open={open} onClose={closeBook} />
    </CleanShell>
  );
}

export const Route = createFileRoute("/irha")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "el_GR" },
      { property: "og:url", content: "https://thynkagency.gr/irha" },
    ],
  }),
  component: IrhaRoute,
});
