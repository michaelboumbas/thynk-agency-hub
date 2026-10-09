import { createFileRoute, notFound } from "@tanstack/react-router";
import { CleanCasePage } from "@/components/thynk14/CleanSite";
import { getCase } from "@/content/work-v14";

// v14 Greek version (07/10/2026). Same case as "/work/$slug".
export const Route = createFileRoute("/el/work/$slug")({
  loader: ({ params }) => {
    if (!getCase(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const t = getCase(params.slug)?.el;
    if (!t) return {};
    const title = `${t.client} — Πελάτες — Thynk Digital Agency`;
    return {
      meta: [
        { title },
        { name: "description", content: t.cardLine },
        { property: "og:title", content: title },
        { property: "og:description", content: t.cardLine },
        { property: "og:locale", content: "el_GR" },
      ],
    };
  },
  component: CaseRoute,
});

function CaseRoute() {
  const { slug } = Route.useParams();
  const cs = getCase(slug);
  if (!cs) return null;
  return <CleanCasePage cs={cs} lang="el" />;
}
