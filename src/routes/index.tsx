import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComingSoon } from "@/components/thynk/ComingSoon";
import { ThynkSite } from "@/components/thynk5/ThynkSite";
import { ThynkSiteV6 } from "@/components/thynk6/ThynkSiteV6";
import { ThynkSiteV7 } from "@/components/thynk7/ThynkSiteV7";
import { ThynkSiteV8 } from "@/components/thynk8/ThynkSiteV8";
import { ThynkSiteV9 } from "@/components/thynk9/ThynkSiteV9";


const title = "Thynk Digital Agency — Σκέψη πίσω από κάθε κίνηση";
const description =
  "Marketing και Digital Transformation για επιχειρήσεις της Ηπείρου. Ιωάννινα, established 2026. Πρώτα audit, μετά στρατηγική.";

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
 * - Lovable editor preview (id-preview--*.lovable.app, *.lovableproject.com) and localhost: the v8 site.
 * Overrides for any host: ?site=1 shows the site, ?soon=1 shows Coming Soon, ?v=5 … ?v=9 pick a version.
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
  // Server render + first paint = Coming Soon (safe default for the public site);
  // the editor preview switches to the v5 site right after mount.
  const [face, setFace] = useState<"soon" | "v5" | "v6" | "v7" | "v8" | "v9">("soon");
  useEffect(() => {
    if (!shouldShowSite()) return;
    // v8 ("Thynk Clear", 30/09/2026: Sleed-style, B2B, no particle Muse) is the preview default;
    // ?v=9 = v8 + liberators-style services (plural voice) for comparison,
    // ?v=7 = "Thynk Light" with the dark 3D intro, ?v=6 = the dark long scroll, ?v=5 = the old v5.
    const v = new URLSearchParams(window.location.search).get("v");
    setFace(v === "5" ? "v5" : v === "6" ? "v6" : v === "7" ? "v7" : v === "9" ? "v9" : "v8");
  }, []);

  if (face === "v9") return <ThynkSiteV9 />;
  if (face === "v8") return <ThynkSiteV8 />;
  if (face === "v7") return <ThynkSiteV7 />;
  if (face === "v6") return <ThynkSiteV6 />;
  if (face === "v5") return <ThynkSite />;
  return <ComingSoon />;
}
