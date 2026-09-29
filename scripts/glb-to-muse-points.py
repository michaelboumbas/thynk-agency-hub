"""
Builds public/v6/muse-points.bin from a real 3D model of the Muse (GLB from Higgsfield / Hunyuan3D).

Usage: python3 scripts/glb-to-muse-points.py path/to/muse.glb [N]

Surface-samples the mesh (area-weighted, extra density on the face), colours each point from the
model's texture, keeps its surface normal (so the side facing away can fade out), and marks the
glowing orange circuitry.

Record (14 bytes, little-endian): int16 x, y, z (y down, -z toward the viewer, ~2400 units tall),
uint8 r, g, b, a, uint8 size*20, int8 nx, ny, nz (*127).
Header: 'MUS2' + uint32 count + uint16 width + uint16 height.
"""
import io
import json
import struct
import sys

import numpy as np
from PIL import Image

SRC = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 110000
# some generators face the model along X: turn it (degrees about the vertical axis) so she faces the camera
YAW = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
OUT = "public/v6/muse-points.bin"
rng = np.random.default_rng(7)

raw = open(SRC, "rb").read()
assert raw[:4] == b"glTF", "not a GLB"
off = 12
gltf = None
binchunk = b""
while off < len(raw):
    ln, typ = struct.unpack_from("<II", raw, off)
    data = raw[off + 8: off + 8 + ln]
    if typ == 0x4E4F534A:
        gltf = json.loads(data)
    elif typ == 0x004E4942:
        binchunk = data
    off += 8 + ln
if "extensionsUsed" in gltf:
    print("extensions:", gltf["extensionsUsed"])

CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def acc(i):
    a = gltf["accessors"][i]
    bv = gltf["bufferViews"][a["bufferView"]]
    dt = np.dtype(CT[a["componentType"]])
    nc = NC[a["type"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride", 0)
    if stride and stride != dt.itemsize * nc:
        buf = np.frombuffer(binchunk, np.uint8, count=stride * a["count"], offset=start).reshape(a["count"], stride)
        arr = buf[:, : dt.itemsize * nc].copy().view(dt).reshape(a["count"], nc)
    else:
        arr = np.frombuffer(binchunk, dt, count=a["count"] * nc, offset=start).reshape(a["count"], nc)
    arr = arr.astype(np.float32)
    if a.get("normalized"):
        arr /= np.iinfo(dt).max
    return arr


def image(ix):
    im = gltf["images"][ix]
    bv = gltf["bufferViews"][im["bufferView"]]
    b = binchunk[bv.get("byteOffset", 0): bv.get("byteOffset", 0) + bv["byteLength"]]
    return np.asarray(Image.open(io.BytesIO(b)).convert("RGB")).astype(np.float32)


def node_mats():
    """world matrix per mesh index (first use)"""
    out = {}

    def walk(n, M):
        nd = gltf["nodes"][n]
        L = np.eye(4)
        if "matrix" in nd:
            L = np.array(nd["matrix"], np.float64).reshape(4, 4).T
        else:
            T = np.eye(4); T[:3, 3] = nd.get("translation", [0, 0, 0])
            x, y, z, w = nd.get("rotation", [0, 0, 0, 1])
            R = np.eye(4)
            R[:3, :3] = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                         [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                         [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
            S = np.diag(list(nd.get("scale", [1, 1, 1])) + [1])
            L = T @ R @ S
        W = M @ L
        if "mesh" in nd and nd["mesh"] not in out:
            out[nd["mesh"]] = W
        for c in nd.get("children", []):
            walk(c, W)

    for n in gltf["scenes"][gltf.get("scene", 0)]["nodes"]:
        walk(n, np.eye(4))
    return out


mats = node_mats()
if YAW:
    t = np.radians(YAW)
    Ry = np.array([[np.cos(t), 0, np.sin(t), 0], [0, 1, 0, 0], [-np.sin(t), 0, np.cos(t), 0], [0, 0, 0, 1]])
    mats = {k: Ry @ v for k, v in mats.items()}
Vs, Fs, UVs, TEX, NVs = [], [], [], [], []
base = 0
for mi, mesh in enumerate(gltf["meshes"]):
    M = mats.get(mi, np.eye(4))
    for prim in mesh["primitives"]:
        at = prim["attributes"]
        v = acc(at["POSITION"])
        v = (np.c_[v, np.ones(len(v))] @ M.T)[:, :3]
        f = acc(prim["indices"]).astype(np.int64).reshape(-1, 3) if "indices" in prim else np.arange(len(v)).reshape(-1, 3)
        nv = acc(at["NORMAL"]) @ M[:3, :3].T if "NORMAL" in at else None
        uv = acc(at["TEXCOORD_0"]) if "TEXCOORD_0" in at else np.zeros((len(v), 2), np.float32)
        tex = None
        if "material" in prim:
            pbr = gltf["materials"][prim["material"]].get("pbrMetallicRoughness", {})
            if "baseColorTexture" in pbr:
                tex = image(gltf["textures"][pbr["baseColorTexture"]["index"]]["source"])
        if tex is None and "COLOR_0" in at:
            tex = acc(at["COLOR_0"])[:, :3] * 255
            uv = None
        Vs.append(v); Fs.append(f); UVs.append(uv); TEX.append(tex); NVs.append(nv)
print("primitives", len(Vs), "verts", sum(len(v) for v in Vs), "faces", sum(len(f) for f in Fs))

# ---- one combined triangle soup ----
tri, triuv, tricol_fn = [], [], []
P = np.concatenate([v[f] for v, f in zip(Vs, Fs)])            # (T,3,3)
owner = np.concatenate([np.full(len(f), k) for k, f in enumerate(Fs)])

# orient: glTF is Y-up; the model faces +Z. Fit ~2400 units tall, centred.
lo, hi = P.reshape(-1, 3).min(0), P.reshape(-1, 3).max(0)
height = hi[1] - lo[1]
S = 2250 / height
ctr = (lo + hi) / 2

e1 = P[:, 1] - P[:, 0]
e2 = P[:, 2] - P[:, 0]
cr = np.cross(e1, e2)
area = np.linalg.norm(cr, axis=1)
nrm = cr / np.maximum(area[:, None], 1e-12)
cen = P.mean(1)
yN = (cen[:, 1] - lo[1]) / height                             # 0 bottom .. 1 top
# face zone: upper part, front-facing
faceZ = np.clip((yN - 0.55) / 0.2, 0, 1) * np.clip(nrm[:, 2] * 1.4, 0, 1)
w = area * (1 + 4.0 * faceZ) * np.clip((yN - 0.02) / 0.12, 0, 1) ** 1.4   # fade the bottom cut
w /= w.sum()
t = rng.choice(len(P), size=N, p=w)
r1 = np.sqrt(rng.random(N))
r2 = rng.random(N)
b0, b1, b2 = 1 - r1, r1 * (1 - r2), r1 * r2
pts = P[t, 0] * b0[:, None] + P[t, 1] * b1[:, None] + P[t, 2] * b2[:, None]
nn = nrm[t].copy()

# colour
col = np.zeros((N, 3), np.float32)
glowdiff = np.zeros(N, np.float32)   # brightness above the local average: the circuitry glows
from scipy import ndimage as _nd
Foff = np.cumsum([0] + [len(f) for f in Fs])
for k in range(len(Fs)):
    sel = np.where(owner[t] == k)[0]
    if not len(sel):
        continue
    lt = t[sel] - Foff[k]
    tri_idx = Fs[k][lt]
    bb = np.stack([b0[sel], b1[sel], b2[sel]], 1)[:, :, None]
    if TEX[k] is None:
        col[sel] = 190
    elif UVs[k] is None:
        col[sel] = (TEX[k][tri_idx] * bb).sum(1)
    else:
        uv = (UVs[k][tri_idx] * bb).sum(1)
        img = TEX[k]
        th, tw = img.shape[:2]
        u = np.clip((uv[:, 0] % 1) * (tw - 1), 0, tw - 1).astype(int)
        v = np.clip((uv[:, 1] % 1) * (th - 1), 0, th - 1).astype(int)   # glTF UV origin top-left
        col[sel] = img[v, u]
        lumimg = img.mean(-1)
        blur = _nd.uniform_filter(lumimg[::4, ::4], 9)
        glowdiff[sel] = (lumimg[v, u] - blur[v // 4, u // 4]) / 255

# smooth normals from the vertex attribute
for k in range(len(Fs)):
    if NVs[k] is None:
        continue
    sel = np.where(owner[t] == k)[0]
    tri_idx = Fs[k][t[sel] - Foff[k]]
    bb = np.stack([b0[sel], b1[sel], b2[sel]], 1)[:, :, None]
    v = (NVs[k][tri_idx] * bb).sum(1)
    nn[sel] = v / np.maximum(np.linalg.norm(v, axis=1, keepdims=True), 1e-9)

R, G, B = col[:, 0], col[:, 1], col[:, 2]
mx, mn = col.max(1), col.min(1)
sat = (mx - mn) / (mx + 1)
hue = 60 * (G - B) / (R - mn + 1e-6)
orange = ((hue > 12) & (hue < 48) & (sat > 0.5) & (R > 190) & (G > 60) & (B < 120)) | (
    (hue > 8) & (hue < 50) & (sat > 0.2) & (R > 170) & (glowdiff > 0.045))
lum = (0.299 * R + 0.587 * G + 0.114 * B) / 255
# local contrast boost so eyes / lips / brows read in particles
lum_n = np.clip((lum - np.percentile(lum, 3)) / (np.percentile(lum, 97) - np.percentile(lum, 3) + 1e-6), 0, 1)
fz = faceZ[t]

x = (pts[:, 0] - ctr[0]) * S
y = -(pts[:, 1] - ctr[1]) * S               # y down
z = -(pts[:, 2] - ctr[2]) * S               # toward viewer = negative
nx, ny, nz = nn[:, 0], -nn[:, 1], -nn[:, 2]

rec = bytearray(b"MUS2" + struct.pack("<IHH", N, int((hi[0] - lo[0]) * S), int(height * S)))
for i in rng.permutation(N):
    if orange[i]:
        c = (255, int(110 + rng.uniform(0, 60)), 40, 245)
        size = 1.7
    else:
        l = lum_n[i]
        # on the face, a steeper curve so eyes, brows and lips read as darker gaps
        g = 1.4 + 1.4 * fz[i]
        c = (int(min(255, 200 + l * 55)), int(min(255, 192 + l * 58)), int(min(255, 182 + l * 64)),
             int(np.clip(30 + (l ** g) * 215, 18, 240)))
        size = (0.8 + rng.uniform(0, 0.7)) * (1 - 0.3 * fz[i])
    rec += struct.pack("<hhhBBBBBbbb", int(x[i]), int(y[i]), int(z[i]), *c, int(min(255, size * 20)),
                       int(nx[i] * 127), int(ny[i] * 127), int(nz[i] * 127))
open(OUT, "wb").write(bytes(rec))
print("points", N, "bytes", len(rec), "orange", int(orange.sum()), "bbox", (hi - lo) * S)
