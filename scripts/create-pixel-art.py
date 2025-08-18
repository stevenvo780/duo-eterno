#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import hashlib
import json
import math
import os
import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np
from PIL import Image, ImageDraw

# ------------------ Deterministic RNG ------------------

def md5_int(s: str) -> int:
    return int(hashlib.md5(s.encode("utf-8")).hexdigest()[:16], 16)

def rng_stream(master_seed: int, *labels: str) -> random.Random:
    h = master_seed
    for lbl in labels:
        h = md5_int(f"{h}:{lbl}")
    return random.Random(h)

# ------------------ Color utils ------------------

def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    h = hex_color[1:] if hex_color.startswith("#") else hex_color
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    r, g, b = rgb
    return f"#{r:02x}{g:02x}{b:02x}"

def mix_rgb(a: Tuple[int,int,int], b: Tuple[int,int,int], t: float) -> Tuple[int,int,int]:
    return (int(a[0] + (b[0]-a[0])*t), int(a[1] + (b[1]-a[1])*t), int(a[2] + (b[2]-a[2])*t))

def clamp01_array(x: np.ndarray) -> np.ndarray:
    return np.clip(x, 0.0, 1.0)

# ------------------ Palettes ------------------

DB32 = [
    "#000000","#222034","#45283c","#663931","#8f563b","#df7126","#d9a066","#eec39a",
    "#fbf236","#99e550","#6abe30","#37946e","#4b692f","#524b24","#323c39","#3f3f74",
    "#306082","#5b6ee1","#639bff","#5fcde4","#cbdbfc","#ffffff","#9badb7","#847e87",
    "#696a6a","#595652","#76428a","#ac3232","#d95763","#d77bba","#8f974a","#8a6f30"
]

PALETTES: Dict[str, Dict[str, str]] = {
    "stone": {"base":"#6a6a6a","dark":"#4a4a4a","accent":"#8a8a8a","mortar":"#3a3a3a"},
    "grassland":{"soil":"#5e3b1f","base":"#2b8b2b","light":"#44d144","dark":"#0f5f0f","flower":"#ffd35e"},
    "desert":{"base":"#caa66a","light":"#e2c68a","shadow":"#a07d4a","rock":"#8f7a5b"},
    "snow":{"base":"#dfe8ff","light":"#ffffff","shadow":"#a9b8d9","ice":"#c3e4ff"},
    "ocean":{"deep":"#0d2a5a","base":"#1c4e8a","light":"#2f7bbf","foam":"#e2f4ff"},
    "swamp":{"mud":"#3f2e1d","base":"#335533","light":"#557755","algae":"#7ea05a"},
    "lava":{"rock":"#2b2b2b","crack":"#4a4a4a","hot":"#ff6b00","core":"#ffd000"},
    "wood":{"base":"#8b5a2b","light":"#cd943f","dark":"#5a3a1a","grain":"#a86b3a"},
    "tile_blue":{"base":"#5a5a6a","light":"#7a7a8a","shadow":"#3a3a4a","grout":"#2a2a2a","accent":"#b0b6d1"},
    "road":{"asphalt":"#3b3b3b","aggregate":"#6b6b6b","line":"#f2d450"},
    "carpet":{"base":"#6b3355","light":"#8a5074","shadow":"#4a1f3b","pattern":"#d8b4d8"},
    "metal":{"base":"#6a7a86","light":"#8fa1b0","shadow":"#47545e","accent":"#a9b8c3"},
    "kitchen":{"base":"#7ac75a","accent":"#f2d450","grout":"#2a2a2a","steel":"#9aa6b2"},
    "bedroom":{"base":"#639bff","accent":"#8a5fb8","wood":"#8b5a2b","linen":"#dfe8ff"},
    "living":{"base":"#63bda4","accent":"#45a09c","sofa":"#3a8c78","cushion":"#a0e0d3"},
}

GAME_TAGS: Dict[str, Dict[str, float]] = {
    "grassland": {"walk_cost":1.1,"friction":0.9,"flammable":1.0,"fluid":0.0},
    "desert": {"walk_cost":1.4,"friction":0.7,"flammable":0.2,"fluid":0.0},
    "snow": {"walk_cost":1.6,"friction":0.5,"flammable":0.0,"fluid":0.0},
    "ocean": {"walk_cost":3.0,"friction":0.2,"flammable":0.0,"fluid":1.0},
    "swamp": {"walk_cost":2.2,"friction":0.4,"flammable":0.1,"fluid":0.6},
    "lava": {"walk_cost":10.0,"friction":0.2,"flammable":0.0,"fluid":0.3,"hazard":1.0},
    "stone": {"walk_cost":1.0,"friction":1.0,"flammable":0.0,"fluid":0.0},
    "wood": {"walk_cost":1.0,"friction":0.95,"flammable":0.8,"fluid":0.0},
    "tile_blue":{"walk_cost":1.0,"friction":0.9,"flammable":0.0,"fluid":0.0},
    "road":{"walk_cost":0.8,"friction":1.0,"flammable":0.0,"fluid":0.0},
    "carpet":{"walk_cost":1.0,"friction":0.95,"flammable":0.5,"fluid":0.0},
    "metal":{"walk_cost":1.0,"friction":0.85,"flammable":0.0,"fluid":0.0},
    "kitchen":{"walk_cost":1.0,"friction":0.9,"flammable":0.0,"fluid":0.0},
    "bedroom":{"walk_cost":1.0,"friction":0.95,"flammable":0.4,"fluid":0.0},
    "living":{"walk_cost":1.0,"friction":0.95,"flammable":0.3,"fluid":0.0},
}

# ------------------ Periodic Perlin ------------------

class Perlin2DPeriodic:
    def __init__(self, seed: int):
        rng = random.Random(seed)
        p = list(range(256))
        rng.shuffle(p)
        self.perm = np.array(p + p, dtype=np.int32)
        self.grad = np.array([(np.cos(2*math.pi*i/8), np.sin(2*math.pi*i/8)) for i in range(256)], dtype=np.float32)

    def _grad2(self, h, x, y):
        g = self.grad[h & 255]
        gx = g[..., 0]
        gy = g[..., 1]
        return gx * x + gy * y

    def noise(self, X: np.ndarray, Y: np.ndarray, period: int) -> np.ndarray:
        xi = np.floor(X).astype(np.int32) % period
        yi = np.floor(Y).astype(np.int32) % period
        xf = (X - np.floor(X)).astype(np.float32)
        yf = (Y - np.floor(Y)).astype(np.float32)
        u = xf*xf*xf*(xf*(xf*6 - 15) + 10)
        v = yf*yf*yf*(yf*(yf*6 - 15) + 10)
        aa = self.perm[self.perm[xi] + yi]
        ab = self.perm[self.perm[xi] + (yi+1) % period]
        ba = self.perm[self.perm[(xi+1) % period] + yi]
        bb = self.perm[self.perm[(xi+1) % period] + (yi+1) % period]
        x1 = (1-u)*self._grad2(aa, xf, yf) + u*self._grad2(ba, xf-1, yf)
        x2 = (1-u)*self._grad2(ab, xf, yf-1) + u*self._grad2(bb, xf-1, yf-1)
        val = (1-v)*x1 + v*x2
        return (val + 1.0) * 0.5

def fbm_periodic(size: int, seed: int, octaves: int = 4, gain: float = 0.5) -> np.ndarray:
    per = Perlin2DPeriodic(seed)
    base_period = size
    H = np.zeros((size, size), dtype=np.float32)
    amp = 0.5
    freq = 1
    for _ in range(octaves):
        period = max(1, base_period // freq)
        xs = np.arange(size, dtype=np.float32)
        ys = np.arange(size, dtype=np.float32)
        X, Y = np.meshgrid(xs * (freq / base_period), ys * (freq / base_period))
        H += amp * per.noise(X*period, Y*period, period)
        amp *= gain
        freq *= 2
    return clamp01_array(H)

def ridged_fbm(size: int, seed: int, octaves: int = 4, gain: float = 0.5) -> np.ndarray:
    h = fbm_periodic(size, seed, octaves, gain)
    for _ in range(2):
        h = 1.0 - np.abs(h*2.0 - 1.0)
        h = clamp01_array(h)
        h = 0.6*h + 0.4*fbm_periodic(size, seed+17, octaves, gain)
    return clamp01_array(h)

# ------------------ Worley toroidal ------------------

def worley_periodic(size: int, seed: int, cells: int = 4) -> Tuple[np.ndarray, np.ndarray]:
    rng = rng_stream(seed, "worley")
    pts = []
    cell_size = size / cells
    for gy in range(cells):
        for gx in range(cells):
            px = (gx + rng.random()) * cell_size
            py = (gy + rng.random()) * cell_size
            pts.append((px, py))
    P = np.array(pts, dtype=np.float32)  # (N,2)
    xs = np.arange(size, dtype=np.float32)
    ys = np.arange(size, dtype=np.float32)
    X, Y = np.meshgrid(xs, ys)
    X = X[..., None]
    Y = Y[..., None]
    dx = np.abs(X - P[None, None, :, 0])
    dy = np.abs(Y - P[None, None, :, 1])
    dx = np.minimum(dx, size - dx)
    dy = np.minimum(dy, size - dy)
    d = np.sqrt(dx*dx + dy*dy)  # (H,W,N)
    d.sort(axis=2)
    d1 = d[..., 0] / (math.sqrt(2)*size)
    d2 = d[..., 1] / (math.sqrt(2)*size)
    return clamp01_array(d1), clamp01_array(d2)

# ------------------ Domain warp (toroidal bilinear) ------------------

def domain_warp(field: np.ndarray, warp_u: np.ndarray, warp_v: np.ndarray, amt: float) -> np.ndarray:
    size = field.shape[0]
    yy, xx = np.meshgrid(np.arange(size, dtype=np.float32), np.arange(size, dtype=np.float32), indexing="ij")
    u = (xx + amt*(warp_u*2.0 - 1.0)) % size
    v = (yy + amt*(warp_v*2.0 - 1.0)) % size
    x0 = np.floor(u).astype(np.int32) % size
    y0 = np.floor(v).astype(np.int32) % size
    x1 = (x0 + 1) % size
    y1 = (y0 + 1) % size
    tx = (u - np.floor(u)).astype(np.float32)
    ty = (v - np.floor(v)).astype(np.float32)
    f00 = field[y0, x0]
    f10 = field[y0, x1]
    f01 = field[y1, x0]
    f11 = field[y1, x1]
    a = f00*(1-tx) + f10*tx
    b = f01*(1-tx) + f11*tx
    return a*(1-ty) + b*ty

# ------------------ Convolution / Normals / AO ------------------

def conv2(img: np.ndarray, kernel: np.ndarray) -> np.ndarray:
    h, w = img.shape
    kh, kw = kernel.shape
    pad_y = kh//2; pad_x = kw//2
    P = np.pad(img, ((pad_y,pad_y),(pad_x,pad_x)), mode="wrap")
    out = np.zeros_like(img, dtype=np.float32)
    for y in range(kh):
        for x in range(kw):
            out += kernel[y,x] * P[y:y+h, x:x+w]
    return out

def sobel_normals(height: np.ndarray, strength: float = 1.0) -> np.ndarray:
    kx = np.array([[1,0,-1],[2,0,-2],[1,0,-1]], dtype=np.float32)
    ky = np.array([[1,2,1],[0,0,0],[-1,-2,-1]], dtype=np.float32)
    H = height
    Gx = conv2(H, kx)
    Gy = conv2(H, ky)
    nx = -Gx * strength
    ny = -Gy * strength
    nz = np.ones_like(H)
    n = np.stack([nx, ny, nz], axis=2)
    n /= np.maximum(1e-6, np.linalg.norm(n, axis=2, keepdims=True))
    return (n*0.5 + 0.5)

def ambient_occlusion(height: np.ndarray, radius_px: int = 3, samples: int = 8) -> np.ndarray:
    size = height.shape[0]
    ao = np.zeros_like(height, dtype=np.float32)
    for i in range(samples):
        ang = 2*math.pi * i / samples
        dx = int(round(math.cos(ang)*radius_px))
        dy = int(round(math.sin(ang)*radius_px))
        ao += (height - np.roll(np.roll(height, dy, axis=0), dx, axis=1)) > 0
    ao = 1.0 - (ao / samples)
    return clamp01_array(0.6*ao + 0.4)

# ------------------ Global palette + dithering ------------------

def load_palette_list(path: Optional[str]) -> List[Tuple[int,int,int]]:
    if path is None:
        return [hex_to_rgb(c) for c in DB32]
    with open(path, "r", encoding="utf-8") as f:
        data = f.read().strip()
    if data.startswith("["):
        arr = json.loads(data)
        return [hex_to_rgb(x) for x in arr]
    lines = [ln.strip() for ln in data.splitlines() if ln.strip() and not ln.startswith("#")]
    cols = []
    for ln in lines:
        if ln.startswith("Index:") or ln.startswith("GIMP Palette"):
            continue
        parts = ln.split()
        if len(parts) >= 3 and parts[0].isdigit():
            r,g,b = int(parts[0]), int(parts[1]), int(parts[2])
            cols.append((r,g,b))
        elif ln.startswith("#") or len(ln) in (6,7):
            cols.append(hex_to_rgb(ln))
    return cols

def nearest_palette_color(c: np.ndarray, pal: np.ndarray) -> np.ndarray:
    diff = pal[None, ...] - c[..., None, :]
    d2 = np.sum(diff*diff, axis=-1)
    idx = np.argmin(d2, axis=-1)
    return pal[idx]

def floyd_steinberg_quantize_atlas(img: Image.Image, palette: List[Tuple[int,int,int]]) -> Image.Image:
    arr = np.array(img.convert("RGBA"), dtype=np.int16)
    pal = np.array(palette, dtype=np.int16)
    h, w, _ = arr.shape
    for y in range(h):
        for x in range(w):
            if arr[y,x,3] == 0:
                continue
            old = arr[y,x,:3]
            new = nearest_palette_color(old[None, :], pal)[0]
            err = old - new
            arr[y,x,:3] = new
            for dx, dy, k in ((1,0,7/16),( -1,1,3/16),(0,1,5/16),(1,1,1/16)):
                xx = x+dx; yy = y+dy
                if 0 <= xx < w and 0 <= yy < h and arr[yy,xx,3] != 0:
                    arr[yy,xx,:3] = np.clip(arr[yy,xx,:3] + (err*k), 0, 255)
    return Image.fromarray(arr.astype(np.uint8), mode="RGBA")

# ------------------ Generators ------------------

@dataclass
class GenParams:
    size: int
    seed: int

def enforce_seam_scalar(field: np.ndarray) -> np.ndarray:
    F = field.copy()
    F[-1, :] = F[0, :]
    F[:, -1] = F[:, 0]
    return F

def enforce_seam_image(img: Image.Image) -> Image.Image:
    A = np.array(img)
    A[-1, :, :] = A[0, :, :]
    A[:, -1, :] = A[:, 0, :]
    return Image.fromarray(A, "RGBA")

def tex_stone(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    d1, d2 = worley_periodic(size, seed+101, cells=4)
    base = fbm_periodic(size, seed+102, octaves=4, gain=0.55)
    warp = fbm_periodic(size, seed+103, octaves=3, gain=0.6)
    d = domain_warp(d1, warp, base, amt=3.0)
    cracks = clamp01_array((d2 - d1) * 4.0)
    height = clamp01_array(0.6*base + 0.4*(1.0-d) + 0.3*cracks)
    pal = PALETTES["stone"]
    c_dark = np.array(hex_to_rgb(pal["dark"]))
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_acc  = np.array(hex_to_rgb(pal["accent"]))
    rgb = (c_dark*(1-height)[...,None] + c_base*(height[...,None]) ).astype(np.float32)
    rgb = (0.8*rgb + 0.2*c_acc).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    height = enforce_seam_scalar(height); img = enforce_seam_image(img)
    return img, height

def tex_desert(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    ridged = ridged_fbm(size, seed+201, octaves=5, gain=0.52)
    warp = fbm_periodic(size, seed+202, octaves=2, gain=0.6)
    H = clamp01_array(0.7*ridged + 0.3*domain_warp(ridged, warp, warp, amt=4.0))
    pal = PALETTES["desert"]
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_shad = np.array(hex_to_rgb(pal["shadow"]))
    rgb = (c_shad*(1-H)[...,None] + c_base*(H[...,None]))
    rgb = (0.75*rgb + 0.25*c_light).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    H = enforce_seam_scalar(H); img = enforce_seam_image(img)
    return img, H

def tex_grassland(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    base = fbm_periodic(size, seed+301, octaves=4, gain=0.55)
    soil = clamp01_array(1.0 - fbm_periodic(size, seed+302, octaves=3, gain=0.6))
    height = clamp01_array(0.6*base + 0.4*(1-soil))
    pal = PALETTES["grassland"]
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_dark = np.array(hex_to_rgb(pal["dark"]))
    rgb = c_dark*(1-height)[...,None] + c_base*(height[...,None])
    rgb = (0.8*rgb + 0.2*c_light).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    draw = ImageDraw.Draw(img)
    blade_c = tuple(hex_to_rgb(pal["light"])) + (255,)

    def poisson_disk_torus(size: int, r: float, k: int, seed: int):
        rng2 = rng_stream(seed, "poisson")
        cell = r / math.sqrt(2)
        grid_w = int(math.ceil(size / cell))
        grid_h = int(math.ceil(size / cell))
        grid = [[-1]*grid_w for _ in range(grid_h)]
        def grid_coords(p):
            return int(p[0]/cell) % grid_w, int(p[1]/cell) % grid_h
        def in_neighborhood(p):
            gx, gy = grid_coords(p)
            for dy in (-2,-1,0,1,2):
                for dx in (-2,-1,0,1,2):
                    nx = (gx + dx) % grid_w
                    ny = (gy + dy) % grid_h
                    idx = grid[ny][nx]
                    if idx != -1:
                        q = samples[idx]
                        dxp = min(abs(p[0]-q[0]), size-abs(p[0]-q[0]))
                        dyp = min(abs(p[1]-q[1]), size-abs(p[1]-q[1]))
                        if math.hypot(dxp, dyp) < r:
                            return True
            return False
        samples = []
        active = []
        p0 = (rng2.random()*size, rng2.random()*size)
        samples.append(p0)
        gx, gy = grid_coords(p0)
        grid[gy][gx] = 0
        active.append(0)
        while active:
            i = rng2.choice(active)
            found = False
            for _ in range(k):
                ang = rng2.random()*2*math.pi
                rad = r*(1 + rng2.random())
                px = (samples[i][0] + rad*math.cos(ang)) % size
                py = (samples[i][1] + rad*math.sin(ang)) % size
                if not in_neighborhood((px,py)):
                    samples.append((px,py))
                    gx, gy = grid_coords((px,py))
                    grid[gy][gx] = len(samples)-1
                    active.append(len(samples)-1)
                    found = True
                    break
            if not found:
                active.remove(i)
        return [(int(round(x))%size, int(round(y))%size) for x,y in samples]

    pts = poisson_disk_torus(size, r=max(2, size/18), k=20, seed=seed+303)
    pts = [(x,y) for (x,y) in pts if 1 <= x <= size-2 and 3 <= y <= size-3]
    for x,y in pts[: max(12, size//2)]:
        draw.line((x, y, x, y-2), fill=blade_c, width=1)

    height = enforce_seam_scalar(height); img = enforce_seam_image(img)
    return img, height

def tex_snow(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    base = fbm_periodic(size, seed+401, octaves=4, gain=0.5)
    lumps = fbm_periodic(size, seed+402, octaves=3, gain=0.6)
    H = clamp01_array(0.7*base + 0.3*(1.0 - np.abs(lumps*2-1)))
    pal = PALETTES["snow"]
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_shad = np.array(hex_to_rgb(pal["shadow"]))
    rgb = (c_shad*(1-H)[...,None] + c_base*(H[...,None]))
    rgb = (0.85*rgb + 0.15*c_light).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    H = enforce_seam_scalar(H); img = enforce_seam_image(img)
    return img, H

def tex_ocean(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    waves = fbm_periodic(size, seed+501, octaves=5, gain=0.53)
    curvature = conv2(waves, np.array([[0,-1,0],[-1,4,-1],[0,-1,0]], dtype=np.float32))
    foam = (curvature > np.percentile(curvature, 90)).astype(np.float32)
    pal = PALETTES["ocean"]
    c_deep = np.array(hex_to_rgb(pal["deep"]))
    c_base = np.array(hex_to_rgb(pal()["base"])) if callable(pal.get) else np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_foam = np.array(hex_to_rgb(pal["foam"]))
    rgb = (c_deep*(1-waves)[...,None] + c_base*(waves[...,None]))
    rgb = (0.8*rgb + 0.2*c_light)
    rgb = np.where(foam[...,None] > 0.5, c_foam, rgb).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    waves = enforce_seam_scalar(waves); img = enforce_seam_image(img)
    return img, waves

def tex_swamp(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    mud = fbm_periodic(size, seed+601, octaves=4, gain=0.55)
    d1, _ = worley_periodic(size, seed+602, cells=5)
    H = clamp01_array(0.6*(1-d1) + 0.4*mud)
    pal = PALETTES["swamp"]
    c_mud = np.array(hex_to_rgb(pal["mud"]))
    c_base= np.array(hex_to_rgb(pal["base"]))
    c_algae=np.array(hex_to_rgb(pal["algae"]))
    rgb = (c_mud*(1-H)[...,None] + c_base*(H[...,None]))
    alg = (d1 < np.percentile(d1, 20)).astype(np.float32)
    rgb = np.where(alg[...,None] > 0.5, c_algae, rgb).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    H = enforce_seam_scalar(H); img = enforce_seam_image(img)
    return img, H

def tex_lava(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    rid = ridged_fbm(size, seed+701, octaves=5, gain=0.55)
    pal = PALETTES["lava"]
    c_rock = np.array(hex_to_rgb(pal["rock"]))
    c_crack= np.array(hex_to_rgb(pal["crack"]))
    c_hot  = np.array(hex_to_rgb(pal["hot"]))
    c_core = np.array(hex_to_rgb(pal["core"]))
    rgb = np.where(rid[...,None]>0.75, c_rock,
          np.where(rid[...,None]>0.6, c_crack,
          np.where(rid[...,None]>0.35, c_hot, c_core))).astype(np.uint8)
    H = clamp01_array(rid)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    H = enforce_seam_scalar(H); img = enforce_seam_image(img)
    return img, H

def tex_wood(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    yy, xx = np.meshgrid(np.arange(size), np.arange(size), indexing="ij")
    center = (size*0.3, size*0.5)
    r = np.hypot((xx-center[0]), (yy-center[1]))
    rings = clamp01_array((np.sin(r*0.25 + fbm_periodic(size, seed+801, 3, 0.6)*2.0)*0.5+0.5))
    H = clamp01_array(0.5 + 0.5*rings)
    pal = PALETTES["wood"]
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_dark = np.array(hex_to_rgb(pal["dark"]))
    rgb = (c_dark*(1-H)[...,None] + c_base*(H[...,None]))
    rgb = (0.85*rgb + 0.15*c_light).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    H = enforce_seam_scalar(H); img = enforce_seam_image(img)
    return img, H

def tex_tile_blue(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    pal = PALETTES["tile_blue"]
    base = np.array(hex_to_rgb(pal["base"]), np.uint8)
    grout = np.array(hex_to_rgb(pal["grout"]), np.uint8)
    light = np.array(hex_to_rgb(pal["light"]), np.uint8)
    shadow= np.array(hex_to_rgb(pal["shadow"]), np.uint8)
    n = 2 if size<=24 else 3 if size<=48 else 4
    t = size//n
    arr = np.zeros((size,size,4), dtype=np.uint8)
    arr[...,0:3] = base
    arr[...,3] = 255
    im = Image.fromarray(arr, "RGBA")
    d = ImageDraw.Draw(im)
    for gy in range(n):
        for gx in range(n):
            x = gx*t; y = gy*t
            d.rectangle((x,y,x+t-1,y+t-1), outline=tuple(grout)+ (255,), width=max(1, t//8))
            d.line((x+2,y+2, x+t-3,y+2), fill=tuple(light)+(255,), width=1)
            d.line((x+2,y+2, x+2,y+t-3), fill=tuple(light)+(255,), width=1)
            d.line((x+3,y+t-3, x+t-3,y+t-3), fill=tuple(shadow)+(255,), width=1)
            d.line((x+t-3,y+3, x+t-3,y+t-3), fill=tuple(shadow)+(255,), width=1)
    H = np.full((size,size), 0.6, dtype=np.float32)
    H = enforce_seam_scalar(H); im = enforce_seam_image(im)
    return im, H

def tex_road(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    pal = PALETTES["road"]
    asphalt = np.array(hex_to_rgb(pal["asphalt"]), np.uint8)
    agg = np.array(hex_to_rgb(pal["aggregate"]), np.uint8)
    line = np.array(hex_to_rgb(pal["line"]), np.uint8)
    arr = np.zeros((size,size,4), dtype=np.uint8)
    arr[...,0:3] = asphalt; arr[...,3] = 255
    rng = rng_stream(p.seed, "road")
    for _ in range(size*size//18):
        x = rng.randrange(size); y = rng.randrange(size)
        arr[y,x,0:3] = agg
    lw = max(1, size//12)
    arr[:, size//2 - lw:size//2 + lw, 0:3] = line
    im = Image.fromarray(arr, "RGBA"); im = enforce_seam_image(im)
    H = np.full((size,size),0.4,np.float32); H = enforce_seam_scalar(H)
    return im, H

def tex_carpet(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    base = fbm_periodic(size, seed+901, 3, 0.6)
    pal = PALETTES["carpet"]
    c_base = np.array(hex_to_rgb(pal["base"]))
    c_light= np.array(hex_to_rgb(pal["light"]))
    c_shad = np.array(hex_to_rgb(pal["shadow"]))
    rgb = c_shad*(1-base)[...,None] + c_base*(base[...,None])
    rgb = (0.8*rgb + 0.2*c_light).astype(np.uint8)
    img = Image.fromarray(np.dstack([rgb, np.full((size,size),255,np.uint8)]), "RGBA")
    base = enforce_seam_scalar(base); img = enforce_seam_image(img)
    return img, base

def tex_metal(p: GenParams) -> Tuple[Image.Image, np.ndarray]:
    size, seed = p.size, p.seed
    pal = PALETTES["metal"]
    c_base = np.array(hex_to_rgb(pal["base"]), np.uint8)
    c_light= np.array(hex_to_rgb(pal["light"]), np.uint8)
    c_shad = np.array(hex_to_rgb(pal["shadow"]), np.uint8)
    arr = np.zeros((size,size,4), dtype=np.uint8)
    arr[...,0:3] = c_base; arr[...,3] = 255
    for y in range(0, size, 3):
        arr[y, :, 0:3] = c_shad
    arr[1,1:size-1,0:3] = c_light
    arr[1:size-1,1,0:3] = c_light
    im = Image.fromarray(arr, "RGBA"); im = enforce_seam_image(im)
    H = np.full((size,size),0.5,np.float32); H = enforce_seam_scalar(H)
    return im, H

GEN_MAP = {
    "stone": tex_stone,
    "grassland": tex_grassland,
    "desert": tex_desert,
    "snow": tex_snow,
    "ocean": tex_ocean,
    "swamp": tex_swamp,
    "lava": tex_lava,
    "wood": tex_wood,
    "tile_blue": tex_tile_blue,
    "road": tex_road,
    "carpet": tex_carpet,
    "metal": tex_metal,
    "kitchen": tex_tile_blue,
    "bedroom": tex_wood,
    "living": tex_carpet,
}

# ------------------ Seam verification ------------------

def verify_seams(img: Image.Image) -> bool:
    a = np.array(img)
    top = a[0,:,:]; bottom = a[-1,:,:]
    left = a[:,0,:]; right = a[:,-1,:]
    return np.array_equal(top, bottom) and np.array_equal(left, right)

# ------------------ Autotile (~47 unique) ------------------

def mask_from_neighbors(tile_size: int, nmask: int) -> np.ndarray:
    size = tile_size
    band = max(2, size//6)
    M = np.zeros((size,size), dtype=np.float32)
    if nmask & (1<<0): M[0:band,:] = 1
    if nmask & (1<<2): M[:, size-band:size] = 1
    if nmask & (1<<4): M[size-band:size,:] = 1
    if nmask & (1<<6): M[:, 0:band] = 1
    if (nmask & (1<<0)) and (nmask & (1<<6)) and (nmask & (1<<7)): M[0:band,0:band] = 1
    if (nmask & (1<<0)) and (nmask & (1<<2)) and (nmask & (1<<1)): M[0:band,size-band:size] = 1
    if (nmask & (1<<4)) and (nmask & (1<<6)) and (nmask & (1<<5)): M[size-band:size,0:band] = 1
    if (nmask & (1<<4)) and (nmask & (1<<2)) and (nmask & (1<<3)): M[size-band:size,size-band:size] = 1
    if (nmask & (1<<0)) and (nmask & (1<<2)) and (nmask & (1<<4)) and (nmask & (1<<6)):
        M[band:size-band, band:size-band] = 1
    return M

def blend_transition(A: Image.Image, B: Image.Image, mask: np.ndarray) -> Image.Image:
    Am = np.array(A, dtype=np.float32)
    Bm = np.array(B, dtype=np.float32)
    M = mask.astype(np.float32)
    edge = conv2(M, np.ones((3,3), dtype=np.float32))
    edge = np.clip(edge, 0, 8)/8.0
    alpha = np.clip(0.2 + 0.8*M + 0.3*edge, 0.0, 1.0)
    out = (Am*(1-alpha[...,None]) + Bm*(alpha[...,None])).astype(np.uint8)
    return Image.fromarray(out, "RGBA")

def generate_autotile_set(A: Image.Image, B: Image.Image) -> Tuple[List[Image.Image], Dict[int,int]]:
    tiles: List[Image.Image] = []
    mapping: Dict[int,int] = {}
    sigs: Dict[bytes,int] = {}
    size = A.size[0]
    for m in range(256):
        sh = mask_from_neighbors(size, m)
        tile = blend_transition(A, B, sh)
        sig = tile.tobytes()
        if sig in sigs:
            mapping[m] = sigs[sig]
        else:
            sigs[sig] = len(tiles)
            mapping[m] = sigs[sig]
            tiles.append(tile)
    return tiles, mapping

# ------------------ Atlas ------------------

@dataclass
class AtlasItem:
    name: str
    image: Image.Image
    kind: str
    seed: int
    idx: int
    height: Optional[np.ndarray] = None

@dataclass
class Atlas:
    tile: int
    items: List[AtlasItem] = field(default_factory=list)
    meta: Dict[str, Dict] = field(default_factory=dict)

    def pack(self) -> Image.Image:
        n = len(self.items)
        grid = int(math.ceil(math.sqrt(n)))
        atlas = Image.new("RGBA", (grid*self.tile, grid*self.tile), (0,0,0,0))
        for i, it in enumerate(self.items):
            r = i // grid; c = i % grid
            x = c*self.tile; y = r*self.tile
            atlas.alpha_composite(it.image, (x,y))
            self.meta[it.name] = {
                "x_px": x, "y_px": y, "w": self.tile, "h": self.tile,
                "index": i, "kind": it.kind, "seed": it.seed, "variation": it.idx
            }
        self.meta["_grid"] = grid
        self.meta["_tile"] = self.tile
        return atlas

# ------------------ IO / Save ------------------

ALL_KINDS = [
    "grassland","desert","snow","ocean","swamp","lava","stone","wood","tile_blue",
    "road","carpet","metal","kitchen","bedroom","living"
]

def parse_kinds(s: str) -> List[str]:
    return ALL_KINDS if s == "all" else [x.strip() for x in s.split(",") if x.strip()]

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def save_img(img: Image.Image, path: str) -> None:
    ensure_dir(os.path.dirname(path) or ".")
    img.save(path, "PNG")

def save_height_normal_ao(base_path: str, height: np.ndarray, strength: float = 2.0) -> None:
    H8 = (clamp01_array(height)*255).astype(np.uint8)
    Image.fromarray(H8, "L").save(base_path+"_h.png", "PNG")
    N = sobel_normals(height, strength=strength)
    N8 = (clamp01_array(N)*255).astype(np.uint8)
    Image.fromarray(N8, "RGB").save(base_path+"_n.png", "PNG")
    AO = ambient_occlusion(height, radius_px=3, samples=8)
    AO8 = (clamp01_array(AO)*255).astype(np.uint8)
    Image.fromarray(AO8, "L").save(base_path+"_ao.png", "PNG")

# ------------------ CLI ------------------

def build_parser():
    p = argparse.ArgumentParser(description="PixelWorld v2 — deterministic, seamless, autotile, global-palette")
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("generate", help="Generate textures and atlas")
    g.add_argument("kinds", help="'all' or comma list")
    g.add_argument("outdir")
    g.add_argument("--size", type=int, default=32)
    g.add_argument("--variations", type=int, default=4)
    g.add_argument("--seed", type=int, default=1337)
    g.add_argument("--pack", action="store_true", help="Pack atlas (implied by --quantize)")
    g.add_argument("--quantize", action="store_true", help="Quantize atlas to global palette (DB32 default)")
    g.add_argument("--global-palette", default=None, help="Path to palette file (.json array or .gpl)")
    g.add_argument("--export-maps", action="store_true", help="Export height/normal/ao")
    g.add_argument("--verify-seams", action="store_true", help="Assert exact seam equality")
    g.add_argument("--preview", type=int, default=0, help="NxN preview mosaic")

    t = sub.add_parser("transition", help="Autotile (~47 unique) between two kinds")
    t.add_argument("outdir")
    t.add_argument("--from", dest="frm", required=True)
    t.add_argument("--to", dest="to", required=True)
    t.add_argument("--size", type=int, default=32)
    t.add_argument("--seed", type=int, default=2025)
    t.add_argument("--quantize", action="store_true")
    t.add_argument("--global-palette", default=None)

    a = sub.add_parser("all", help="Generate all kinds + common transitions")
    a.add_argument("outdir")
    a.add_argument("--size", type=int, default=32)
    a.add_argument("--variations", type=int, default=4)
    a.add_argument("--seed", type=int, default=7)
    a.add_argument("--pack", action="store_true")
    a.add_argument("--quantize", action="store_true")
    a.add_argument("--global-palette", default=None)
    a.add_argument("--export-maps", action="store_true")
    a.add_argument("--verify-seams", action="store_true")
    a.add_argument("--preview", type=int, default=0)

    return p

def cmd_generate(args):
    master_seed = args.seed if args.seed is not None else 1337
    outdir = args.outdir
    size = args.size
    variations = args.variations
    kinds = parse_kinds(args.kinds)
    atlas = Atlas(tile=size)

    for kind in kinds:
        gen = GEN_MAP[kind]
        for i in range(variations):
            seed = md5_int(f"{master_seed}:{kind}:{i}")
            img, height = gen(GenParams(size=size, seed=seed))
            name = f"{kind}_{size}_{i}"
            path = os.path.join(outdir, f"{name}.png")
            save_img(img, path)
            if args.export_maps:
                save_height_normal_ao(os.path.join(outdir, name), height)
            if args.verify_seams and not verify_seams(img):
                raise RuntimeError(f"Seam check failed for {name}")
            atlas.items.append(AtlasItem(name=name, image=img, kind=kind, seed=seed, idx=i, height=height))

    if args.pack or args.quantize:
        atlas_img = atlas.pack()
        if args.quantize:
            pal = load_palette_list(args.global_palette)
            atlas_img = floyd_steinberg_quantize_atlas(atlas_img, pal)
        atlas_path = os.path.join(outdir, f"atlas_{size}.png")
        save_img(atlas_img, atlas_path)
        meta = {
            "tile": size,
            "items": atlas.meta,
            "seed": master_seed,
            "kinds": kinds,
            "quantized": bool(args.quantize),
            "palette": args.global_palette if args.global_palette else "DB32",
            "game_tags": GAME_TAGS
        }
        with open(os.path.join(outdir, f"atlas_{size}.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    if args.preview > 0:
        N = args.preview
        preview = Image.new("RGBA", (N*size, N*size), (0,0,0,0))
        rng = rng_stream(master_seed, "preview")
        for ry in range(N):
            for rx in range(N):
                k = rng.choice(kinds)
                i = rng.randrange(variations)
                name = f"{k}_{size}_{i}"
                img = next(it.image for it in atlas.items if it.name == name)
                preview.alpha_composite(img, (rx*size, ry*size))
        save_img(preview, os.path.join(outdir, f"preview_{N}x{N}.png"))

def cmd_transition(args):
    size = args.size
    outdir = args.outdir
    Aname = args.frm
    Bname = args.to
    master_seed = args.seed if args.seed is not None else 2025
    seedA = md5_int(f"{master_seed}:{Aname}:transA")
    seedB = md5_int(f"{master_seed}:{Bname}:transB")
    genA = GEN_MAP[Aname]; genB = GEN_MAP[Bname]
    A, _ = genA(GenParams(size=size, seed=seedA))
    B, _ = genB(GenParams(size=size, seed=seedB))
    tiles, mapping = generate_autotile_set(A, B)

    atlas = Atlas(tile=size)
    for i, t in enumerate(tiles):
        name = f"auto_{Aname}_to_{Bname}_{i:02d}"
        save_img(t, os.path.join(outdir, f"{name}.png"))
        atlas.items.append(AtlasItem(name=name, image=t, kind=f"autotile:{Aname}->{Bname}", seed=master_seed, idx=i))

    atlas_img = atlas.pack()
    if args.quantize:
        pal = load_palette_list(args.global_palette)
        atlas_img = floyd_steinberg_quantize_atlas(atlas_img, pal)
    atlas_path = os.path.join(outdir, f"atlas_autotile_{Aname}_to_{Bname}_{size}.png")
    save_img(atlas_img, atlas_path)
    with open(os.path.join(outdir, f"atlas_autotile_{Aname}_to_{Bname}_{size}.json"), "w", encoding="utf-8") as f:
        json.dump({
            "tile": size,
            "items": atlas.meta,
            "mask_to_index": mapping,
            "seed": master_seed,
            "quantized": bool(args.quantize),
            "palette": args.global_palette if args.global_palette else "DB32"
        }, f, indent=2, ensure_ascii=False)

def cmd_all(args):
    args_gen = argparse.Namespace(**vars(args))
    args_gen.kinds = "all"
    cmd_generate(args_gen)
    pairs = [("grassland","desert"),("grassland","snow"),("grassland","ocean"),
             ("desert","stone"),("stone","lava"),("ocean","swamp")]
    for a,b in pairs:
        ns = argparse.Namespace(**vars(args))
        ns.frm = a; ns.to = b
        cmd_transition(ns)

def main():
    p = build_parser()
    args = p.parse_args()
    if args.cmd == "generate":
        if args.quantize: args.pack = True
        cmd_generate(args)
    elif args.cmd == "transition":
        cmd_transition(args)
    elif args.cmd == "all":
        if args.quantize: args.pack = True
        cmd_all(args)

if __name__ == "__main__":
    main()
