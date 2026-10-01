import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThynkSite } from "@/components/thynk5/ThynkSite";
import { ThynkSiteV6 } from "@/components/thynk6/ThynkSiteV6";
import { ThynkSiteV7 } from "@/components/thynk7/ThynkSiteV7";
import { ThynkSiteV8 } from "@/components/thynk8/ThynkSiteV8";
import { ThynkSiteV9 } from "@/components/thynk9/ThynkSiteV9";
import { SitePage, setFieldChoice } from "@/components/thynk11/Site";
import type { HeadlineId } from "@/content/site-v12";


const title = "Thynk Digital Agency — Το AI κάνει τη δουλειά. Εσείς αποφασίζετε.";
const description =
  "Marketing και Digital Transformation με AI για επιχειρήσεις σε όλη την Ελλάδα και στο εξωτερικό. Έδρα Ιωάννινα. Ξεκινάμε πάντα με audit.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/**
 * Which face to show.
 * - Public/published site: the Coming Soon page, until the founders decide to launch.
 * - Lovable editor preview (id-preview--*.lovable.app, *.lovableproject.com) and localhost: the v10 site.
 * Overrides for any host: ?site=1 shows the site, ?soon=1 shows Coming Soon, ?v=5 … ?v=13 pick a version.
 */
function shouldShowSite(): boolean {
  const { hostname, search } = window.location;
  const q = new URLSearchParams(search);
  if (q.has("soon")) return false;
  if (q.has("site")) return true;
  return (
    hostname.startsWith("id-preview--") ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}

function Index() {
  // The site (v11, multi-page) is the default. Older single-page versions stay reachable for comparison
  // with ?v=5 … ?v=10 (preview hosts only, as before).
  const [face, setFace] = useState<"site" | "v5" | "v6" | "v7" | "v8" | "v9" | "v10">("site");
  // v12 (01/10): v11 with the typographic hero; &h=bi | hi | si picks the headline (si default)
  const [typeHero, setTypeHero] = useState<HeadlineId | undefined>(undefined);
  useEffect(() => {
    if (!shouldShowSite()) return;
    const q = new URLSearchParams(window.location.search);
    // v13 (01/10): v12 + the "Thynk Flow" planet field instead of the v11 particle shapes
    if (q.get("v") === "13") {
      setFieldChoice("planet");
      const h = q.get("h");
      setTypeHero(h === "hi" || h === "bi" ? h : "si");
      return;
    }
    if (q.get("v") === "12") {
      const h = q.get("h");
      setTypeHero(h === "hi" || h === "bi" ? h : "si");
      return;
    }
    const v = q.get("v");
    const map: Record<string, typeof face> = { "5": "v5", "6": "v6", "7": "v7", "8": "v8", "9": "v9", "10": "v10" };
    if (v && map[v]) setFace(map[v]);
  }, []);

  if (face === "v10") return <ThynkSiteV9 handsHero />;
  if (face === "v9") return <ThynkSiteV9 />;
  if (face === "v8") return <ThynkSiteV8 />;
  if (face === "v7") return <ThynkSiteV7 />;
  if (face === "v6") return <ThynkSiteV6 />;
  if (face === "v5") return <ThynkSite />;
  return <SitePage path="/" typeHero={typeHero} />;
}
