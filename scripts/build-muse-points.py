"""
Builds public/v6/muse-points.bin — the particle cloud for the v6 intro.

Input : public/avatar/muse-hero.png (transparent Muse render, 1792x2400, shoulders cut by the frame)
Output: public/v6/muse-points.bin (+ scripts/muse-extended-preview.png for eyeballing)

Steps
1. Pad the canvas sideways and extend both shoulders procedurally (round deltoid curve, colour
   sampled from the cut edge, shaded darker toward the rim) so the figure is no longer cropped.
2. Closed volume: every horizontal slice of the silhouette is an ellipse (front + back halves),
   face features carved on the front, back half + side walls sampled separately (flagged).
3. Importance-sample N points (edges, eyes, lips, hair strands and the orange circuitry weigh more).
4. Pack little-endian records in random order (any prefix is a uniform subset for small screens):
   int16 x, int16 y, int16 z (image px, centred), uint8 r, g, b, a, uint8 (back<<7 | size*20)  -> 11 bytes.
   Header: 'MUSE' + uint32 count + uint16 width + uint16 height.
"""
import struct
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/avatar/muse-hero.png"
OUT = "public/v6/muse-points.bin"
PREVIEW = "scripts/muse-extended-preview.png"
N = 60000
BACK = 0.75        # back half + side walls, as a share of the front points
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

# ---- depth: a closed 3D volume, round all the way around ----
# Every horizontal slice of the silhouette becomes an ellipse (front half + back half meeting at the
# outline), so the bust is solid from any angle: front, profile and back. Face features are carved
# on the front half only. Negative z = toward the viewer; the volume is centred on z = 0.
yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
lum = (0.299 * big[..., 0] + 0.587 * big[..., 1] + 0.114 * big[..., 2]) / 255

rowsOn = alpha.any(1)
Lx = np.where(rowsOn, np.argmax(alpha, 1), 0).astype(np.float32)
Rx = np.where(rowsOn, Ww - 1 - np.argmax(alpha[:, ::-1], 1), 0).astype(np.float32)
ys_on = np.where(rowsOn)[0]
top, bot = ys_on.min(), ys_on.max()
Cx = np.interp(np.arange(Hh), ys_on, ((Lx + Rx) / 2)[ys_on])
HW = np.interp(np.arange(Hh), ys_on, ((Rx - Lx) / 2)[ys_on])
Cx = ndimage.gaussian_filter1d(Cx, 10)
HW = np.maximum(ndimage.gaussian_filter1d(HW, 10), 20)
# depth / half-width per slice: skull & neck round (circle), torso a flatter oval
yv = np.arange(Hh, dtype=np.float32)
DEPTH = np.interp(yv, [0, 1450, 1640, 1900, Hh], [1.0, 1.0, 0.9, 0.42, 0.42])
DEPTH = ndimage.gaussian_filter1d(DEPTH * HW, 14)


def bump(cx, cy, sx, sy, amp):
    return amp * np.exp(-(((xx - cx) / sx) ** 2 + ((yy - cy) / sy) ** 2) / 2)


feat = np.zeros_like(xx)
feat += bump(905, 1010, 55, 120, -150)      # nose
feat += bump(930, 880, 40, 90, -55)        # nose bridge
feat += bump(785, 850, 85, 50, 70)         # eye sockets (recessed)
feat += bump(1160, 850, 85, 50, 70)
feat += bump(800, 745, 120, 35, -30)       # brows
feat += bump(1150, 745, 120, 35, -30)
feat += bump(930, 1250, 115, 55, -55)      # lips
feat += bump(960, 1430, 110, 70, -45)      # chin
feat += bump(760, 1030, 120, 110, -35)     # cheekbones
feat += (lum - 0.5) * 14 * (yy < 1650)      # fine surface texture on the face
feat = ndimage.gaussian_filter(feat, 4) * alpha


def shell(x, y):
    """front (negative) and back (positive) z of the round slice at continuous x, row y"""
    u = np.clip((x - Cx[y]) / HW[y], -1, 1)
    r = DEPTH[y] * np.sqrt(1 - u ** 2)
    return -r, r, np.abs(u)


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
faceZone = np.clip(1 - ((xx - 960) / 420) ** 2 - ((yy - 1080) / 520) ** 2, 0, 1)
w = (0.2 + np.clip(edge, 0, 1.5) * 1.5 + orange * 2.2 + lum * 0.5) * (1 + faceZone * 1.6) * alpha
fade0 = int(Hh * 0.86)
w[fade0:] *= np.linspace(1, 0, Hh - fade0)[:, None] ** 1.4   # soft bottom fade instead of a hard cut
p = (w / w.sum()).ravel()
idx = rng.choice(p.size, size=N, replace=False, p=p)
ys, xs = np.divmod(idx, Ww)
jx = xs + rng.uniform(-0.5, 0.5, N)
jy = ys + rng.uniform(-0.5, 0.5, N)
cx, cy = Ww / 2, Hh / 2
rows = []
for i in range(N):
    y, x = ys[i], xs[i]
    isO = orange[y, x]
    l = lum[y, x]
    zf, _, _ = shell(jx[i], y)
    zz = float(zf + feat[y, x])
    if isO:
        col = (255, int(110 + rng.uniform(0, 60)), 40, 245)
        size = 1.7
    else:
        col = (int(min(255, 205 + l * 50)), int(min(255, 196 + l * 52)), int(min(255, 186 + l * 58)),
               int(np.clip(22 + (l ** 1.5) * 215 + edge[y, x] * 55 + faceZone[y, x] * 25, 30, 240)))
        size = (0.8 + rng.uniform(0, 0.7)) * (1 - 0.25 * faceZone[y, x])
    rows.append((jx[i] - cx, jy[i] - cy, zz, *col, size, 0))

# back half + sides: uniform over the silhouette, extra weight near the outline where the surface
# turns away (otherwise the profile would look thin). Tone: soft, from the blurred photo.
lumB = ndimage.gaussian_filter(lum, 18)
uMap = np.abs(np.clip((xx - Cx[:, None]) / HW[:, None], -1, 1))
wb = alpha * (1 + np.minimum(1 / np.sqrt(np.clip(1 - uMap ** 2, 1e-3, 1)), 5) * 1.2)
wb[fade0:] *= np.linspace(1, 0, Hh - fade0)[:, None] ** 1.4
NB = int(N * BACK)
pb = (wb / wb.sum()).ravel()
idb = rng.choice(pb.size, size=NB, replace=False, p=pb)
bys, bxs = np.divmod(idb, Ww)
for i in range(NB):
    y = bys[i]
    x = bxs[i] + rng.uniform(-0.5, 0.5)
    zf, zb, u = shell(x, y)
    # near the outline, spread points through the whole side wall (front -> back)
    if u > 0.8 and rng.random() < 0.55:
        zz = zf + (zb - zf) * rng.random()
    else:
        zz = zb
    l = float(lumB[y, bxs[i]])
    g = int(np.clip(150 + l * 80 + rng.normal(0, 10), 12, 243))
    a = int(np.clip(60 + l * 90, 50, 170))
    rows.append((x - cx, y + rng.uniform(-0.5, 0.5) - cy, float(zz), g, g - 6, g - 12, a, 0.9 + rng.uniform(0, 0.5), 1))
order = rng.permutation(len(rows))
rec = bytearray(b"MUSE" + struct.pack("<IHH", len(rows), Ww, Hh))
for k in order:
    x, y, zz, r, g, b, a, size, back = rows[k]
    # last byte: bit 7 = back-half point, bits 0-6 = size*20
    rec += struct.pack("<hhhBBBBB", int(round(x)), int(round(y)), int(round(zz)), r, g, b, a,
                       int(min(127, size * 20)) | (128 if back else 0))
open(OUT, "wb").write(bytes(rec))
N = len(rows)

# preview of the extended source (for review only)
pv = Image.fromarray(big.clip(0, 255).astype(np.uint8), "RGBA").resize((Ww // 4, Hh // 4))
bg = Image.new("RGBA", pv.size, (11, 12, 14, 255))
bg.alpha_composite(pv)
bg.convert("RGB").save(PREVIEW)
print("points", N, "bytes", len(rec), "canvas", Ww, Hh)
