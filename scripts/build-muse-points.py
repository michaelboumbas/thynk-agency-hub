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
N = 64000
BACK = 0.3         # share of points mirrored onto the back of the bust
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

# ---- depth: a sculpted bust, not a relief ----
# Landmarks are in padded-canvas px (see scripts/muse-extended-preview.png, x4).
# Negative z = toward the viewer. The face is turned ~25° to the viewer's left of the skull.
yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
lum = (0.299 * big[..., 0] + 0.587 * big[..., 1] + 0.114 * big[..., 2]) / 255


def ell(cx, cy, rx, ry, rz):
    q = 1 - ((xx - cx) / rx) ** 2 - ((yy - cy) / ry) ** 2
    return np.where(q > 0, -rz * np.sqrt(np.clip(q, 0, 1)), 0.0)


def cyl(cx, r, rz):
    q = 1 - ((xx - cx) / r) ** 2
    return np.where(q > 0, -rz * np.sqrt(np.clip(q, 0, 1)), 0.0)


def bump(cx, cy, sx, sy, amp):
    return amp * np.exp(-(((xx - cx) / sx) ** 2 + ((yy - cy) / sy) ** 2) / 2)


skull = ell(1190, 800, 580, 720, 600)
face = ell(990, 1060, 420, 500, 560)
head = np.minimum(skull, face)
head += bump(905, 1010, 55, 120, -190)      # nose
head += bump(930, 880, 40, 90, -70)        # nose bridge
head += bump(785, 850, 85, 50, 85)         # eye sockets (recessed)
head += bump(1160, 850, 85, 50, 85)
head += bump(800, 745, 120, 35, -35)       # brows
head += bump(1150, 745, 120, 35, -35)
head += bump(930, 1250, 115, 55, -70)      # lips
head += bump(960, 1430, 110, 70, -60)      # chin
head += bump(760, 1030, 120, 110, -45)     # cheekbones
head += bump(1580, 1000, 60, 110, -60)     # ear
neck = cyl(1200, 280, 300) - 60
collar = cyl(1250, 360, 360)
torso = cyl(1196, 1250, 520)


def band(y0, y1):  # 0 above y0 -> 1 below y1
    return np.clip((yy - y0) / (y1 - y0), 0, 1)


b1 = band(1380, 1500)   # head -> neck
b2 = band(1560, 1640)   # neck -> collar
b3 = band(1780, 1900)   # collar -> torso
z = head * (1 - b1) + neck * b1
z = z * (1 - b2) + collar * b2
z = z * (1 - b3) + np.minimum(torso, collar * 1.0 + 0) * b3
z += (lum - 0.5) * 18                                  # fine surface texture
z = ndimage.gaussian_filter(z, 6)                      # smooth seams between the solids
# extended shoulders wrap away from the camera
for side in ("L", "R"):
    edge_x = PAD if side == "L" else PAD + W - 1
    past = (edge_x - xx) if side == "L" else (xx - edge_x)
    past = np.clip(past, 0, None) / EXT
    z += past ** 1.3 * 220 * alpha
z *= alpha

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
    zz = float(z[y, x])
    if isO:
        col = (255, int(110 + rng.uniform(0, 60)), 40, 245)
        size = 1.7
    else:
        col = (int(min(255, 205 + l * 50)), int(min(255, 196 + l * 52)), int(min(255, 186 + l * 58)),
               int(np.clip(22 + (l ** 1.5) * 215 + edge[y, x] * 55 + faceZone[y, x] * 25, 30, 240)))
        size = (0.8 + rng.uniform(0, 0.7)) * (1 - 0.25 * faceZone[y, x])
    rows.append((jx[i] - cx, jy[i] - cy, zz, *col, size))
    # back shell: gives the bust real volume when it turns (dimmer, hair/sweater tone)
    if rng.random() < BACK:
        g = int(170 + l * 60)
        rows.append((jx[i] - cx + rng.normal(0, 3), jy[i] - cy + rng.normal(0, 3), -zz * 0.8 + rng.normal(0, 8),
                     g, g - 6, g - 12, int(col[3] * 0.45), 1.0))
order = rng.permutation(len(rows))
rec = bytearray(b"MUSE" + struct.pack("<IHH", len(rows), Ww, Hh))
for k in order:
    x, y, zz, r, g, b, a, size = rows[k]
    rec += struct.pack("<hhhBBBBB", int(round(x)), int(round(y)), int(round(zz)), r, g, b, a, int(min(255, size * 20)))
open(OUT, "wb").write(bytes(rec))
N = len(rows)

# preview of the extended source (for review only)
pv = Image.fromarray(big.clip(0, 255).astype(np.uint8), "RGBA").resize((Ww // 4, Hh // 4))
bg = Image.new("RGBA", pv.size, (11, 12, 14, 255))
bg.alpha_composite(pv)
bg.convert("RGB").save(PREVIEW)
print("points", N, "bytes", len(rec), "canvas", Ww, Hh)
