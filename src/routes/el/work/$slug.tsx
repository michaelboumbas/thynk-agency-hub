import { createFileRoute, notFound } from "@tanstack/react-router";
import { CleanCasePage } from "@/components/thynk14/CleanSite";
import { getCase } from "@/content/work-v14";
import { seoHead } from "@/lib/seo";

// v14 Greek version (07/10/2026). Same case as "/work/$slug".
export const Route = createFileRoute("/el/work/$slug")({
  staticData: { sitemap: false },
  loader: ({ params }) => {
    if (!getCase(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const t = getCase(params.slug)?.el;
    if (!t) return {};
    // 26/11/2026 (SEO): canonical + hreflang; the case pages are now in the sitemap (routes/sitemap[.]xml.ts)
    return seoHead({ path: `/work/${params.slug}`, lang: "el", title: `${t.client} · Πελάτες · Thynk Digital Agency`, description: t.cardLine });
  },
  component: CaseRoute,
});

function CaseRoute() {
  const { slug } = Route.useParams();
  const cs = getCase(slug);
  if (!cs) return null;
  return <CleanCasePage cs={cs} lang="el" />;
}
