/* The contact map in the Thynk 2026 colours (24/10/2026, Mike: «the lake in our lake colour, the roads in sky»).
   A MapLibre style over OpenFreeMap's free OpenStreetMap vector tiles (OpenMapTiles schema, no API key).
   Lake Pamvotis = lake #1D5866 · streets = sky #D3E7EE, main roads in light lake · land almost white ·
   labels in ink / ink-2, the lake's name in light lake. The orange stays for our pin only. */

export const MAP_TILES = "https://tiles.openfreemap.org/planet";
export const MAP_GLYPHS = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

const C = {
  land: "#f6fafb",
  green: "#dcece8",
  build: "#e7f0f3",
  buildLine: "#d6e5ea",
  water: "#1d5866",
  road: "#d3e7ee", // sky
  roadMid: "#bfdbe4",
  roadMain: "#9cc7d3", // light lake
  label: "#4f626a", // ink-2
  ink: "#14262e",
  waterLabel: "#9cc7d3",
  halo: "#f6fafb",
};

type Lang = "en" | "el";
const zoomed = (stops: [number, number][]) => ["interpolate", ["exponential", 1.5], ["zoom"], ...stops.flat()];

export function thynkMapStyle(lang: Lang) {
  const name =
    lang === "el"
      ? ["coalesce", ["get", "name:el"], ["get", "name"]]
      : // English where OSM has it (landmarks, the lake); most streets only have their Greek name
        ["coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]];
  const line = ["==", ["geometry-type"], "LineString"];
  const cls = (...c: string[]) => ["in", ["get", "class"], ["literal", c]];
  const road = (id: string, classes: string[], color: string, stops: [number, number][], extra?: unknown[]) => ({
    id,
    type: "line",
    source: "omt",
    "source-layer": "transportation",
    filter: ["all", line, cls(...classes), ...(extra ?? [])],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": color, "line-width": zoomed(stops) },
  });

  return {
    version: 8,
    glyphs: MAP_GLYPHS,
    sources: { omt: { type: "vector", url: MAP_TILES } },
    layers: [
      { id: "land", type: "background", paint: { "background-color": C.land } },
      {
        id: "green",
        type: "fill",
        source: "omt",
        "source-layer": "landcover",
        filter: cls("grass", "wood"),
        paint: { "fill-color": C.green },
      },
      {
        id: "green-use",
        type: "fill",
        source: "omt",
        "source-layer": "landuse",
        filter: cls("cemetery", "pitch", "playground", "stadium"),
        paint: { "fill-color": C.green, "fill-opacity": 0.7 },
      },
      {
        id: "water",
        type: "fill",
        source: "omt",
        "source-layer": "water",
        filter: ["!=", ["get", "brunnel"], "tunnel"],
        paint: { "fill-color": C.water },
      },
      {
        id: "waterway",
        type: "line",
        source: "omt",
        "source-layer": "waterway",
        filter: cls("river", "canal"),
        paint: { "line-color": C.water, "line-width": zoomed([[12, 0.6], [17, 3]]) },
      },
      {
        id: "building",
        type: "fill",
        source: "omt",
        "source-layer": "building",
        minzoom: 13,
        paint: { "fill-color": C.build, "fill-outline-color": C.buildLine },
      },
      {
        id: "pedestrian-area",
        type: "fill",
        source: "omt",
        "source-layer": "transportation",
        filter: ["all", ["==", ["geometry-type"], "Polygon"], cls("path", "pedestrian", "minor", "service")],
        paint: { "fill-color": C.road },
      },
      road("path", ["path", "track"], C.road, [[14, 0.6], [16, 1.6], [18, 4]]),
      road("service", ["service"], C.road, [[14, 0.8], [16, 2.5], [18, 7]]),
      road("minor", ["minor"], C.road, [[12, 0.6], [14, 2.2], [16, 6], [18, 16]]),
      road("mid", ["secondary", "tertiary"], C.roadMid, [[10, 0.6], [14, 3], [16, 8], [18, 20]]),
      road("main", ["primary", "trunk", "motorway"], C.roadMain, [[8, 0.6], [14, 4], [16, 10], [18, 24]]),
      {
        id: "water-name",
        type: "symbol",
        source: "omt",
        "source-layer": "water_name",
        filter: ["==", ["geometry-type"], "Point"],
        layout: {
          "text-field": name,
          "text-font": ["Noto Sans Italic"],
          "text-size": 15,
          "text-letter-spacing": 0.08,
          "text-max-width": 8,
        },
        paint: { "text-color": C.waterLabel },
      },
      {
        id: "water-name-line",
        type: "symbol",
        source: "omt",
        "source-layer": "water_name",
        filter: line,
        layout: {
          "symbol-placement": "line",
          "text-field": name,
          "text-font": ["Noto Sans Italic"],
          "text-size": 15,
          "text-letter-spacing": 0.08,
        },
        paint: { "text-color": C.waterLabel },
      },
      {
        id: "road-name",
        type: "symbol",
        source: "omt",
        "source-layer": "transportation_name",
        filter: cls("motorway", "trunk", "primary", "secondary", "tertiary", "minor", "path"),
        layout: {
          "symbol-placement": "line",
          "text-field": name,
          "text-font": ["Noto Sans Regular"],
          "text-size": zoomed([[13, 10], [16, 12.5], [18, 14]]),
          "text-letter-spacing": 0.02,
          "text-max-angle": 30,
        },
        paint: { "text-color": C.label, "text-halo-color": C.halo, "text-halo-width": 1.6 },
      },
      {
        id: "landmark",
        type: "symbol",
        source: "omt",
        "source-layer": "poi",
        filter: cls("castle", "museum", "monument", "attraction", "town_hall"),
        layout: {
          "text-field": name,
          "text-font": ["Noto Sans Regular"],
          "text-size": 11.5,
          "text-max-width": 9,
        },
        paint: { "text-color": C.ink, "text-halo-color": C.halo, "text-halo-width": 1.6 },
      },
      {
        id: "area-name",
        type: "symbol",
        source: "omt",
        "source-layer": "place",
        filter: cls("suburb", "quarter", "neighbourhood"),
        layout: {
          "text-field": name,
          "text-font": ["Noto Sans Bold"],
          // no uppercase: Greek capitals would keep their accents (ΣΙΑΡΆΒΑ)
          "text-size": 11.5,
          "text-letter-spacing": 0.06,
          "text-max-width": 8,
        },
        paint: { "text-color": C.label, "text-halo-color": C.halo, "text-halo-width": 1.6 },
      },
    ],
  };
}
