import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/content/site-v14";
import { thynkMapStyle } from "./map-style";

/* The contact map in the Thynk 2026 colours (24/10/2026, Mike). Google's embed can't be recoloured, so the map is
   drawn in the browser with MapLibre over OpenStreetMap data from OpenFreeMap (free, no key, commercial use ok).
   MapLibre loads from jsDelivr only on this page, so nothing is added to the site's bundle. It stays a picture
   (no dragging or zooming), like the old map; «Get directions» opens Google Maps.
   If WebGL, the library or the tiles fail, the old grayscale Google map comes back. */

/** the office: Papazoglou 14D, 454 44 Ioannina (Mike 10/10; Google Maps point for Papazoglou 14) */
export const OFFICE = { lat: 39.66813, lng: 20.85431 };

const MAPLIBRE_JS = "https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js";

type GlMap = {
  on(type: string, fn: (e: { dataType?: string; tile?: unknown }) => void): void;
  once(type: string, fn: () => void): void;
  remove(): void;
};
type MapLibre = { Map: new (options: Record<string, unknown>) => GlMap };

let loading: Promise<MapLibre> | null = null;
function loadMapLibre(): Promise<MapLibre> {
  const w = window as unknown as { maplibregl?: MapLibre };
  if (w.maplibregl) return Promise.resolve(w.maplibregl);
  if (!loading) {
    loading = new Promise<MapLibre>((ok, no) => {
      const s = document.createElement("script");
      s.src = MAPLIBRE_JS;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => (w.maplibregl ? ok(w.maplibregl) : no(new Error("maplibre")));
      s.onerror = () => {
        loading = null;
        no(new Error("maplibre"));
      };
      document.head.appendChild(s);
    });
  }
  return loading;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ThynkMap({ lang, title }: { lang: Lang; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"loading" | "ready" | "google">("loading");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (!hasWebGL()) {
      setMode("google");
      return;
    }
    let map: GlMap | null = null;
    let done = false;
    let gotTile = false;
    const fallback = () => {
      if (done || gotTile) return;
      done = true;
      map?.remove();
      map = null;
      setMode("google");
    };
    const timer = window.setTimeout(fallback, 10000);
    setMode("loading");

    loadMapLibre()
      .then((ml) => {
        if (done) return;
        map = new ml.Map({
          container: el,
          style: thynkMapStyle(lang),
          center: [OFFICE.lng, OFFICE.lat],
          zoom: 15, // = Google's z16, the old map
          interactive: false,
          attributionControl: false,
          fadeDuration: 0,
        });
        map.on("data", (e) => {
          if (e.dataType === "source" && e.tile) gotTile = true;
        });
        map.on("error", () => {
          if (!gotTile) fallback();
        });
        map.once("idle", () => {
          if (done) return;
          if (!gotTile) return fallback();
          window.clearTimeout(timer);
          setMode("ready");
        });
      })
      .catch(fallback);

    return () => {
      done = true;
      window.clearTimeout(timer);
      map?.remove();
    };
  }, [lang]);

  return (
    <>
      <div ref={box} className={`t14-cmap-gl${mode === "ready" ? " on" : ""}`} role="img" aria-label={title} />
      {mode === "google" ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?ll=${OFFICE.lat},${OFFICE.lng}&z=16&hl=${lang}&output=embed`}
          loading="lazy"
          tabIndex={-1}
        />
      ) : (
        <span className="t14-cmap-credit">
          <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>{" "}
          <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">© OpenMapTiles</a>{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
        </span>
      )}
    </>
  );
}
