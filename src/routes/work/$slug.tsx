import { createFileRoute, notFound } from "@tanstack/react-router";
import { CleanCasePage } from "@/components/thynk14/CleanSite";
import { getCase } from "@/content/work-v14";

// v14 (07/10/2026, Mike): one case study. Unknown or hidden cases (published: false) are a 404.
export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    if (!getCase(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const t = getCase(params.slug)?.en;
    if (!t) return {};
    const title = `${t.client} — Clients — Thynk Digital Agency`;
    return {
      meta: [
        { title },
        { name: "description", content: t.cardLine },
        { property: "og:title", content: title },
        { property: "og:description", content: t.cardLine },
      ],
    };
  },
  component: CaseRoute,
});

function CaseRoute() {
  const { slug } = Route.useParams();
  const cs = getCase(slug);
  if (!cs) return null;
  return <CleanCasePage cs={cs} />;
}
