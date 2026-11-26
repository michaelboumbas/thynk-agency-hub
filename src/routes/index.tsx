import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThynkSite } from "@/components/thynk5/ThynkSite";
import { ThynkSiteV6 } from "@/components/thynk6/ThynkSiteV6";
import { ThynkSiteV7 } from "@/components/thynk7/ThynkSiteV7";
import { ThynkSiteV8 } from "@/components/thynk8/ThynkSiteV8";
import { ThynkSiteV9 } from "@/components/thynk9/ThynkSiteV9";
import { SitePage, setFieldChoice } from "@/components/thynk11/Site";
import { CleanSite } from "@/components/thynk14/CleanSite";
import { LANG_NOW_KEY, LANG_PICK_KEY } from "@/components/thynk14/Shell";
import type { HeadlineId } from "@/content/site-v12";
import { seoHead } from "@/lib/seo";


// 17/11 (Mike): «/» opens in Greek (it forwards to /el), so the link preview of thynkagency.gr is Greek too
// 26/11/2026 (v16 + SEO): «/» forwards first-time visitors to /el, so it keeps Greek meta (the link preview of
// thynkagency.gr, Mike 17/11) and points its canonical at /el.
const title = "Thynk Digital Agency · Digital Marketing & AI αυτοματισμοί, Ιωάννινα";
const description =
  "Digital marketing και AI αυτοματισμοί από τα Ιωάννινα: διαφήμιση σε Google, Meta, TikTok και ChatGPT, social media, περιεχόμενο, websites και AI Audit.";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => seoHead({ path: "/", lang: "el", title, description, schema: true }),
  component: Index,
});

/**
 * Which face to show.
 * - Public/published site: the Coming Soon page, until the founders decide to launch.
 * - Lovable editor preview (id-preview--*.lovable.app, *.lovableproject.com) and localhost: the v10 site.
 * Overrides for any host: ?site=1 shows the site, ?soon=1 shows Coming Soon, ?v=5 … ?v=14 pick a version.
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

/**
 * 17/11/2026 (Mike): the site opens in Greek. «/» stays English only when the visitor asked for it:
 * ?lang=en (remembered), EN picked on the switch, or they were just reading the English pages.
 * The preview overrides (?v=, ?site, ?soon) also keep «/» as it is.
 */
function keepEnglish(): boolean {
  const q = new URLSearchParams(window.location.search);
  if (q.has("v") || q.has("site") || q.has("soon")) return true;
  try {
    if (q.get("lang") === "en") {
      window.localStorage.setItem(LANG_PICK_KEY, "en");
      return true;
    }
    if (q.get("lang") === "el") window.localStorage.setItem(LANG_PICK_KEY, "el");
    if (window.localStorage.getItem(LANG_PICK_KEY) === "en") return true;
    if (window.sessionStorage.getItem(LANG_NOW_KEY) === "en") return true;
  } catch {
    /* storage blocked: Greek */
  }
  return false;
}

function Index() {
  const navigate = useNavigate();
  // null until we know whether «/» stays English or goes to /el (nothing English flashes first)
  const [english, setEnglish] = useState<boolean | null>(null);
  useEffect(() => {
    if (keepEnglish()) {
      setEnglish(true);
      return;
    }
    const { search, hash } = window.location;
    void navigate({ href: `/el${search}${hash}`, replace: true });
  }, [navigate]);

  // Default: v14 (see below). Older versions stay reachable for comparison with ?v=5 … ?v=13
  // (preview hosts only, as before).
  const [face, setFace] = useState<"site" | "v5" | "v6" | "v7" | "v8" | "v9" | "v10">("site");
  // v12 (01/10): v11 with the typographic hero; &h=bi | hi | si picks the headline (si default)
  const [typeHero, setTypeHero] = useState<HeadlineId | undefined>(undefined);
  // v14 (02/10): «Thynk Clean», the ubernatural.io style on white, in English — the default face since 02/10 (Mike).
  // The previous default (v11 multi-page, Greek) stays on ?v=11; v12/v13 on ?v=12 / ?v=13.
  const [clean, setClean] = useState(true);
  useEffect(() => {
    if (!shouldShowSite()) return;
    const q = new URLSearchParams(window.location.search);
    const v = q.get("v");
    if (v && v !== "14") setClean(false);
    if (v === "11") return;
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
    const map: Record<string, typeof face> = { "5": "v5", "6": "v6", "7": "v7", "8": "v8", "9": "v9", "10": "v10" };
    if (v && map[v]) setFace(map[v]);
  }, []);

  if (!english) return null;
  if (clean) return <CleanSite />;
  if (face === "v10") return <ThynkSiteV9 handsHero />;
  if (face === "v9") return <ThynkSiteV9 />;
  if (face === "v8") return <ThynkSiteV8 />;
  if (face === "v7") return <ThynkSiteV7 />;
  if (face === "v6") return <ThynkSiteV6 />;
  if (face === "v5") return <ThynkSite />;
  return <SitePage path="/" {...(typeHero !== undefined ? { typeHero } : {})} />;
}
