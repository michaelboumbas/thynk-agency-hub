"""
Builds public/v6/muse-points.bin — the particle cloud for the v6 intro.

Input : public/avatar/muse-hero.png (transparent Muse render, 1792x2400, shoulders cut by the frame)
Output: public/v6/muse-points.bin (+ scripts/muse-extended-preview.png for eyeballing)

Steps
1. Pad the canvas sideways and extend both shoulders procedurally (round deltoid curve, colour
   sampled from the cut edge, shaded darker toward the rim) so the figure is no longer cropped.
2. Depth map: distance-to-silhouette dome + a stronger face/head dome + luminance relief;
   extended shoulders bend away from the viewer so the bust reads as 3D when it rotates.
3. Importance-sample N points (edges, eyes, lips, hair strands and the orange circuitry weigh more).
4. Pack little-endian records in random order (any prefix is a uniform subset for small screens):
   int16 x, int16 y, int16 z (image px, centred), uint8 r, g, b, a, uint8 size*20  -> 11 bytes.
   Header: 'MUSE' + uint32 count + uint16 width + uint16 height.
"""
import struct
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/avatar/muse-hero.png"
OUT = "public/v6/muse-points.bin"
PREVIEW = "scripts/muse-extended-preview.png"
N = 72000
PAD = 300          # px added on each side
EXT = 250          # how far the shoulder extends past the old frame
RISE = 230         # rows over which the shoulder rounds out
rng = np.random.default_rng(7)

im = np.array(Image.open(SRC).convert("RGBA")).astype(np.float32)
H, W, _ = im.shape
big = np.zeros((H, W + 2 * PAD, 4), np.float32)
big[:, PAD:PAD + W] = im
alpha = big[..., 3] > 100


def extend(side):
    col = PAD if side == "L" else PAD + W - 1
    rows = np.where(alpha[:, col])[0]
    y0 = rows.min()
    for y in range(y0, H):
        t = min(1.0, (y - y0) / RISE)
        reach = int(EXT * np.sin(t * np.pi / 2))
        if reach <= 0:
            continue
        # edge colour: average of a few pixels just inside the frame
        if side == "L":
            ref = big[y, col:col + 8, :3].mean(0)
        else:
            ref = big[y, col - 7:col + 1, :3].mean(0)
        for i in range(1, reach + 1):
            u = i / EXT                      # 0 at old edge -> 1 at rim
            shade = 1.0 - 0.5 * u ** 1.6
            n = rng.normal(0, 5)
            x = col - i if side == "L" else col + i
            big[y, x, :3] = np.clip(ref * shade + n, 0, 255)
            big[y, x, 3] = 255


extend("L")
extend("R")
alpha = big[..., 3] > 100
Hh, Ww = alpha.shape

# ---- depth ----
dt = ndimage.distance_transform_edt(alpha)
body = np.sqrt(dt / dt.max())                         # 0 at silhouette, 1 deep inside
yy, xx = np.mgrid[0:Hh, 0:Ww]
# head dome (face centre roughly at the eyes/nose, from the render)
hx, hy, hrx, hry = PAD + 880, 860, 520, 700
head = np.clip(1 - ((xx - hx) / hrx) ** 2 - ((yy - hy) / hry) ** 2, 0, 1) ** 0.5
lum = (0.299 * big[..., 0] + 0.587 * big[..., 1] + 0.114 * big[..., 2]) / 255
z = -(body * 140 + head * 160 + (lum - 0.5) * 30)     # negative = toward the viewer
# extended shoulders wrap away from the camera
for side in ("L", "R"):
    edge = PAD if side == "L" else PAD + W - 1
    past = (edge - xx) if side == "L" else (xx - edge)
    past = np.clip(past, 0, None) / EXT
    z += past ** 1.3 * 260 * alpha

# ---- importance ----
g = ndimage.gaussian_filter(lum, 1.2)
gx = ndimage.sobel(g, 1)
gy = ndimage.sobel(g, 0)
edge = np.hypot(gx, gy)
edge = edge / np.percentile(edge[alpha], 99)
R, G, B = big[..., 0], big[..., 1], big[..., 2]
mx = np.max(big[..., :3], -1)
mn = np.min(big[..., :3], -1)
sat = (mx - mn) / (mx + 1)
hue = 60 * (G - B) / (R - mn + 1e-6)
# glowing circuitry only (hue 14-48°, saturated, bright) — excludes pink lips and the brown iris
orange = (hue > 14) & (hue < 48) & (sat > 0.4) & (R > 205)
orange = ndimage.binary_dilation(orange, iterations=2) & (R > 150) & (sat > 0.3)
faceZone = np.clip(1 - ((xx - hx) / (hrx * 0.95)) ** 2 - ((yy - (hy + 60)) / (hry * 0.8)) ** 2, 0, 1)
w = (0.2 + np.clip(edge, 0, 1.5) * 1.5 + orange * 2.2 + lum * 0.5) * (1 + faceZone * 1.6) * alpha
fade0 = int(Hh * 0.86)
w[fade0:] *= np.linspace(1, 0, Hh - fade0)[:, None] ** 1.4   # soft bottom fade instead of a hard cut
p = (w / w.sum()).ravel()
idx = rng.choice(p.size, size=N, replace=False, p=p)
ys, xs = np.divmod(idx, Ww)
jx = xs + rng.uniform(-0.5, 0.5, N)
jy = ys + rng.uniform(-0.5, 0.5, N)

cx, cy = Ww / 2, Hh / 2
rec = bytearray(b"MUSE" + struct.pack("<IHH", N, Ww, Hh))
for i in range(N):
    y, x = ys[i], xs[i]
    r, gg, b = big[y, x, :3]
    isO = orange[y, x]
    l = lum[y, x]
    if isO:
        col = (255, int(110 + rng.uniform(0, 60)), 40, 245)
        size = 1.7
    else:
        col = (int(min(255, 205 + l * 50)), int(min(255, 196 + l * 52)), int(min(255, 186 + l * 58)),
               int(np.clip(22 + (l ** 1.5) * 215 + edge[y, x] * 55 + faceZone[y, x] * 25, 30, 240)))
        size = (0.8 + rng.uniform(0, 0.7)) * (1 - 0.25 * faceZone[y, x])   # finer grain on the face
    rec += struct.pack("<hhhBBBBB", int(round(jx[i] - cx)), int(round(jy[i] - cy)), int(round(z[y, x])),
                       *col, int(size * 20))
open(OUT, "wb").write(bytes(rec))

# preview of the extended source (for review only)
pv = Image.fromarray(big.clip(0, 255).astype(np.uint8), "RGBA").resize((Ww // 4, Hh // 4))
bg = Image.new("RGBA", pv.size, (11, 12, 14, 255))
bg.alpha_composite(pv)
bg.convert("RGB").save(PREVIEW)
print("points", N, "bytes", len(rec), "canvas", Ww, Hh)
