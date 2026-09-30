import type { ShapeKey } from "./shapes";

/**
 * Camera keyframe for one scene.
 * x, y: where the shape's centre sits, as a fraction of the viewport from its centre (+x right, +y down)
 * zoom: 1 = the shape's +-1 units span 84% of the shorter viewport side
 * ry, rx: turn / tilt in radians (rx > 0 looks down on horizontal planes, rx < 0 lays a
 *   vertical plane back like a map on a table)
 */
export type Cam = { x: number; y: number; zoom: number; ry: number; rx: number };

export type SceneDef = {
  id: string;
  shape: ShapeKey;
  /** 0 = dark stage (glowing light), 1 = paper (ink) */
  theme: 0 | 1;
  /** station label */
  label: string;
  cam: Cam; // desktop: shape in the right half, text on the left
  camM: Cam; // phone: shape in the top ~45%, the card below
};

const c = (x: number, y: number, zoom: number, ry = 0, rx = 0): Cam => ({ x, y, zoom, ry, rx });

export const SCENES: SceneDef[] = [
  {
    id: "arxi",
    shape: "face",
    theme: 0,
    label: "Λιγότερες αγγαρείες",
    cam: c(0.22, 0.02, 0.95, 0.12),
    camM: c(0, -0.2, 0.8, 0.1),
  },
  {
    id: "thoryvos",
    shape: "chaos",
    theme: 0,
    label: "Ο θόρυβος",
    cam: c(0.12, 0, 1.0, 0, 0.1),
    camM: c(0, -0.08, 1.5, 0, 0.1),
  },
  {
    id: "kostos",
    shape: "clock",
    theme: 0,
    label: "Πόσο μου στοιχίζει;",
    cam: c(0.22, 0.02, 0.74, -0.28, 0.08),
    camM: c(0, -0.24, 0.85, -0.2),
  },
  {
    id: "ti-kanete",
    shape: "streams",
    theme: 1,
    label: "Δηλαδή τι κάνετε;",
    cam: c(0.24, 0.02, 0.85, 0.3, -0.35),
    camM: c(0, -0.24, 0.85, 0.25, -0.3),
  },
  {
    id: "pos-xekiname",
    shape: "stairs",
    theme: 1,
    label: "Πώς ξεκινάμε;",
    cam: c(0.2, 0.05, 0.78, -0.55, 0.38),
    camM: c(-0.02, -0.22, 0.78, -0.5, 0.35),
  },
  {
    id: "an-exafanisteite",
    shape: "grid",
    theme: 1,
    label: "Κι αν εξαφανιστείτε;",
    cam: c(0.24, 0.02, 0.8, 0.28, -0.42),
    camM: c(0, -0.24, 0.85, 0.25, -0.4),
  },
  {
    id: "ipeiros",
    shape: "epirus",
    theme: 1,
    label: "Έχετε δουλέψει εδώ;",
    cam: c(0.23, 0.02, 0.98, -0.12, -0.3),
    camM: c(0, -0.24, 0.95, -0.1, -0.25),
  },
  {
    id: "anthropoi",
    shape: "face",
    theme: 1,
    label: "Δύο άνθρωποι",
    cam: c(0.2, 0.03, 1.04, -0.12),
    camM: c(0, -0.22, 0.98, -0.1),
  },
  {
    id: "epikoinonia",
    shape: "face",
    theme: 1,
    label: "Πώς σας βρίσκω;",
    cam: c(0.37, -0.27, 0.34, 0.2),
    camM: c(0.3, -0.33, 0.3, 0.2),
  },
];
