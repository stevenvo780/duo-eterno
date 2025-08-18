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

# ---------- RNG / Colors ----------

def md5_int(s: str) -> int:
    return int(hashlib.md5(s.encode("utf-8")).hexdigest()[:16], 16)

def rng_stream(master_seed: int, *labels: str) -> random.Random:
    h = master_seed
    for lbl in labels:
        h = md5_int(f"{h}:{lbl}")
    return random.Random(h)

def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    h = hex_color[1:] if hex_color.startswith("#") else hex_color
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

def clamp01_array(x: np.ndarray) -> np.ndarray:
    return np.clip(x, 0.0, 1.0)

DB32 = [
    "#000000","#222034","#45283c","#663931","#8f563b","#df7126","#d9a066","#eec39a",
    "#fbf236","#99e550","#6abe30","#37946e","#4b692f","#524b24","#323c39","#3f3f74",
    "#306082","#5b6ee1","#639bff","#5fcde4","#cbdbfc","#ffffff","#9badb7","#847e87",
    "#696a6a","#595652","#76428a","#ac3232","#d95763","#d77bba","#8f974a","#8a6f30"
]
DB32 = [hex_to_rgb(x) for x in DB32]

PALET = {
    "wood_base": (139,90,43),
    "wood_dark": (90,58,26),
    "wood_light": (205,148,63),
    "metal": (106,122,134),
    "metal_light": (143,161,176),
    "stone": (106,106,106),
    "stone_dark": (74,74,74),
    "fabric": (99,155,255),
    "fabric_alt": (138,95,184),
    "grass": (42,139,42),
    "leaf": (136,200,72),
    "flower": (216,73,139),
    "dirt": (110,70,40),
    "brick": (172,82,50),
    "foam": (226,244,255),
    "gold": (242,212,80),
    "shadow": (0,0,0)
}

# ---------- Helpers ----------

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def img_rgba(w: int, h: int) -> Image.Image:
    return Image.new("RGBA", (w,h), (0,0,0,0))

def outline(im: Image.Image, color=(0,0,0,255), radius=1) -> Image.Image:
    base = Image.new("RGBA", im.size, (0,0,0,0))
    for dx in range(-radius, radius+1):
        for dy in range(-radius, radius+1):
            if dx==0 and dy==0: continue
            shifted = Image.new("RGBA", im.size, (0,0,0,0))
            shifted.alpha_composite(im, (dx,dy))
            mask = shifted.split()[3]
            base = Image.composite(Image.new("RGBA", im.size, color), base, mask)
    base.alpha_composite(im)
    return base

def shade_rect(im: Image.Image, box: Tuple[int,int,int,int], base: Tuple[int,int,int], light=True):
    x0,y0,x1,y1 = box
    w = x1-x0; h = y1-y0
    arr = np.zeros((h,w,4), dtype=np.uint8)
    for yy in range(h):
        t = 1.0 - yy/max(1,h-1)
        r = int(base[0]* (0.8+0.2*t if light else 0.6+0.4*t))
        g = int(base[1]* (0.8+0.2*t if light else 0.6+0.4*t))
        b = int(base[2]* (0.8+0.2*t if light else 0.6+0.4*t))
        arr[yy,:,0:3] = (r,g,b)
        arr[yy,:,3] = 255
    tile = Image.fromarray(arr, "RGBA")
    im.alpha_composite(tile, (x0,y0))

def shade_circle(im: Image.Image, cx:int, cy:int, r:int, base: Tuple[int,int,int]):
    arr = np.zeros((im.height, im.width,4), dtype=np.uint8)
    Y, X = np.ogrid[:im.height,:im.width]
    dist = np.sqrt((X-cx)**2 + (Y-cy)**2)
    mask = dist <= r
    t = np.clip(1.0 - dist/r, 0,1)
    R = (base[0]); G = (base[1]); B = (base[2])
    arr[...,0]=np.uint8(R); arr[...,1]=np.uint8(G); arr[...,2]=np.uint8(B); arr[...,3]=0
    arr[mask,3]=255
    im.alpha_composite(Image.fromarray(arr,"RGBA"))

def draw_rect(draw: ImageDraw.ImageDraw, box, fill, outline_col=None, width=1):
    draw.rectangle(box, fill=fill, outline=outline_col, width=width)

def add_specular(im: Image.Image, box: Tuple[int,int,int,int], alpha=140):
    x0,y0,x1,y1 = box
    w = x1-x0; h=y1-y0
    spec = Image.new("RGBA",(w,h),(255,255,255,0))
    d = ImageDraw.Draw(spec)
    d.pieslice((0,-h,w,h), 200, 280, fill=(255,255,255,alpha))
    im.alpha_composite(spec,(x0,y0))

def quantize_db32(im: Image.Image) -> Image.Image:
    pal_img = Image.new('P', (1,1))
    palette = []
    for r,g,b in DB32:
        palette.extend([r,g,b])
    palette += [0,0,0]*(256-len(DB32))
    pal_img.putpalette(palette)
    return im.convert("RGB").quantize(palette=pal_img).convert("RGBA")

# ---------- Sprite Generators ----------

def g_bench(tile=32, seed=1):
    w,h = tile*2, tile
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    legw = max(2, tile//8)
    draw_rect(d,(4,h-6,4+legw,h-1), PALET["wood_dark"])
    draw_rect(d,(w-4-legw,h-6,w-4,h-1), PALET["wood_dark"])
    for i in range(3):
        y0 = 4 + i*(tile//4)
        draw_rect(d,(3,y0,w-3,y0+tile//8), PALET["wood_base"], outline_col=PALET["wood_dark"])
    add_specular(im,(3,4,w-3,4+tile//8),120)
    return quantize_db32(im)

def g_statbar(tile=32, seed=1, value=0.75):
    w,h = tile*2, tile//3
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    draw_rect(d,(0,0,w-1,h-1),(30,30,30), outline_col=(0,0,0))
    fillw = int((w-4)*value)
    draw_rect(d,(2,2,2+fillw,h-3), PALET["gold"])
    add_specular(im,(2,2,w-2,h-3),90)
    return quantize_db32(im)

def g_canvas_base(tile=32, seed=1):
    w,h = tile*6, tile*4
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    for y in range(0,h,8):
        d.line((0,y,w,y),(40,40,40,120))
    for x in range(0,w,8):
        d.line((x,0,x,h),(40,40,40,120))
    draw_rect(d,(0,0,w-1,h-1),None,outline_col=(80,80,80))
    return im

def g_conn_overlay(tile=32, seed=1):
    w,h = tile*4, tile*3
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    nodes = [(tile, tile),(w-tile, tile*2)]
    for (x1,y1),(x2,y2) in [ (nodes[0], nodes[1]) ]:
        d.line((x1,y1,x2,y2),(180,220,255,200), width=2)
        d.ellipse((x1-3,y1-3,x1+3,y1+3),(99,155,255,220))
        d.ellipse((x2-3,y2-3,x2+3,y2+3),(99,155,255,220))
    return im

def g_bookshelf(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    draw_rect(d,(2,2,w-2,h-2), PALET["wood_base"], outline_col=PALET["wood_dark"])
    shelf_y = [h//4, h//2, 3*h//4]
    for y in shelf_y:
        d.line((3,y,w-3,y), PALET["wood_dark"])
    rng = rng_stream(seed,"books")
    for i in range(12):
        bw = rng.randint(4,8); bh = rng.randint(10, h//2)
        x = rng.randint(6,w-10); y = rng.choice(shelf_y)-bh+2
        col = (rng.choice(DB32))
        draw_rect(d,(x,y,x+bw,y+bh), col, outline_col=(0,0,0))
    return quantize_db32(im)

def g_clock(tile=32, seed=1):
    w,h = tile, tile
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    cx,cy = w//2,h//2
    d.ellipse((2,2,w-2,h-2), PALET["metal_light"], outline=PALET["metal"])
    d.ellipse((5,5,w-5,h-5), (250,250,250,255), outline=(0,0,0))
    d.line((cx,cy, cx, cy-6), (0,0,0), 1)
    d.line((cx,cy, cx+5, cy), (0,0,0), 1)
    return quantize_db32(im)

def g_lamp_table(tile=32, seed=1):
    w,h = tile, tile*2
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    d.ellipse((w//2-6,h-8,w//2+6,h-2), PALET["metal_light"], outline=PALET["metal"])
    d.rectangle((w//2-1, h//2, w//2+1, h-8), PALET["metal"])
    draw_rect(d,(w//2-10, h//2-10, w//2+10, h//2+2), PALET["fabric_alt"], outline_col=(0,0,0))
    add_specular(im,(w//2-10, h//2-10, w//2+10, h//2+2),100)
    return quantize_db32(im)

def g_lamp_floor(tile=32, seed=1):
    w,h = tile, tile*3
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    d.ellipse((w//2-6,h-8,w//2+6,h-2), PALET["metal_light"], outline=PALET["metal"])
    d.rectangle((w//2-1, h//4, w//2+1, h-8), PALET["metal"])
    draw_rect(d,(w//2-12, h//6, w//2+12, h//4+6), PALET["fabric"], outline_col=(0,0,0))
    add_specular(im,(w//2-12, h//6, w//2+12, h//4+6),100)
    return quantize_db32(im)

def g_bed_simple(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    draw_rect(d,(2,h//3,w-2,h-2), PALET["wood_base"], outline_col=PALET["wood_dark"])
    draw_rect(d,(4,4,w-4,h//3), (240,240,240), outline_col=(0,0,0))
    d.rectangle((6,6,w//2-2,h//3-2), fill=(230,230,255), outline=(0,0,0))
    d.rectangle((w//2+2,6,w-6,h//3-2), fill=(230,230,255), outline=(0,0,0))
    return quantize_db32(im)

def g_bed_double(tile=32, seed=1):
    w,h = tile*3, tile*2
    im = img_rgba(w,h)
    d = ImageDraw.Draw(im)
    draw_rect(d,(2,h//3,w-2,h-2), PALET["wood_base"], outline_col=PALET["wood_dark"])
    draw_rect(d,(4,4,w-4,h//3), (240,240,240), outline_col=(0,0,0))
    pw = (w-12)//2
    d.rectangle((6,6,6+pw,h//3-2), fill=(230,230,255), outline=(0,0,0))
    d.rectangle((w-6-pw,6,w-6,h//3-2), fill=(230,230,255), outline=(0,0,0))
    return quantize_db32(im)

def g_sofa_classic(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(2,h//2,w-2,h-6), PALET["fabric"], outline_col=(0,0,0))
    draw_rect(d,(2,h//2-10,w-2,h//2), PALET["fabric"], outline_col=(0,0,0))
    d.rectangle((2,h-6,w-2,h-4), fill=PALET["wood_dark"])
    return quantize_db32(im)

def g_sofa_modern(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(2,h//2,w-2,h-6), (80,200,180), outline_col=(0,0,0))
    draw_rect(d,(4,h//2-10,w-4,h//2-2), (100,220,200), outline_col=(0,0,0))
    d.rectangle((w//2-6,h-7,w//2+6,h-5), fill=PALET["metal"])
    return quantize_db32(im)

def g_table_coffee(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.ellipse((6,6,w-6,h//2), PALET["wood_base"], outline=PALET["wood_dark"])
    d.rectangle((w//2-2,h//2,w//2+2,h-12), PALET["wood_dark"])
    d.ellipse((w//2-10,h-14,w//2+10,h-2), PALET["wood_base"], outline=PALET["wood_dark"])
    return quantize_db32(im)

def g_table_dining(tile=32, seed=1):
    w,h = tile*3, tile*2
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(6,6,w-6,h//2), PALET["wood_base"], outline_col=PALET["wood_dark"])
    for x in (12, w-12):
        d.rectangle((x-2,h//2,x+2,h-10), fill=PALET["wood_dark"])
    return quantize_db32(im)

def g_plant_small(tile=32, seed=1):
    w,h = tile, tile
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.ellipse((w//2-6,h-10,w//2+6,h-2), PALET["wood_base"], outline=PALET["wood_dark"])
    for i in range(5):
        d.line((w//2, h-10, w//2-6+i*3, h-16-i*2), PALET["leaf"], width=2)
    return quantize_db32(im)

def g_plant_flower(tile=32, seed=1):
    w,h = tile, tile
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((w//2-1,h-8,w//2+1,h-2), fill=(60,130,60))
    d.ellipse((w//2-3,h-12,w//2+3,h-6), PALET["flower"], outline=(0,0,0))
    return quantize_db32(im)

def g_tree(tile=32, seed=1):
    w,h = tile*2, tile*3
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((w//2-3,h-20,w//2+3,h-2), fill=PALET["wood_dark"])
    d.ellipse((w//2-16,10,w//2+16,h-24), PALET["grass"], outline=(0,0,0))
    return quantize_db32(im)

def g_rock(tile=32, seed=1):
    w,h = tile, tile
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(4,10,w-4,h-2), PALET["stone"], outline_col=PALET["stone_dark"])
    return quantize_db32(im)

def g_fountain(tile=32, seed=1):
    w,h = tile*2, tile*2
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.ellipse((4,h//2,w-4,h-4), (120,160,200), outline=(0,0,0))
    d.ellipse((8,h//2+4,w-8,h-8), PALET["foam"], outline=(0,0,0))
    d.rectangle((w//2-2,6,w//2+2,h//2), fill=PALET["metal"])
    return quantize_db32(im)

def g_flower_rosa(tile=32, seed=1):
    w,h=tile,tile
    im=img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((w//2-1,h-10,w//2+1,h-2), fill=(60,150,60))
    for ang in range(0,360,45):
        rx,ry= int(6*math.cos(math.radians(ang))), int(6*math.sin(math.radians(ang)))
        d.ellipse((w//2-3+rx,h-14+ry,w//2+3+rx,h-8+ry), PALET["flower"], outline=(0,0,0))
    d.ellipse((w//2-2,h-12,w//2+2,h-8),(255,220,220), outline=(0,0,0))
    return quantize_db32(im)

def g_path_brick_h(tile=32, seed=1):
    w,h = tile, tile
    im = img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((0,0,w-1,h-1), fill=PALET["brick"])
    for y in range(0,h,6):
        d.line((0,y,w,y), PALET["shadow"])
        offset = (y//6)%2 * 4
        for x in range(offset, w, 8):
            d.line((x,y, x, min(h-1,y+6)), PALET["shadow"])
    return quantize_db32(im)

def g_path_dirt_h(tile=32, seed=1):
    w,h=tile,tile
    im=img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((0,0,w-1,h-1), fill=PALET["dirt"])
    for i in range(w//3):
        x = (i*3)%w; y=(i*5)%h
        d.point((x,y),(80,50,30))
    return quantize_db32(im)

def g_path_stone_h(tile=32, seed=1):
    w,h=tile,tile
    im=img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((0,0,w-1,h-1), fill=(120,120,120))
    for y in range(6,h,10):
        d.line((0,y,w,y), (60,60,60))
    return quantize_db32(im)

def g_path_stone_v(tile=32, seed=1):
    w,h=tile,tile
    im=img_rgba(w,h); d=ImageDraw.Draw(im)
    d.rectangle((0,0,w-1,h-1), fill=(120,120,120))
    for x in range(6,w,10):
        d.line((x,0,x,h), (60,60,60))
    return quantize_db32(im)

def g_dialog_overlay(tile=32, seed=1):
    w,h=tile*3,tile*2
    im=img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(4,4,w-4,h-10),(255,255,255,220), outline_col=(0,0,0))
    d.polygon([(w//3,h-10),(w//3+10,h-10),(w//3+2,h-2)], fill=(255,255,255,220), outline=(0,0,0))
    return im

def _face(im: Image.Image, mood: str, base=(200,220,255)):
    w,h=im.size; d=ImageDraw.Draw(im)
    d.ellipse((2,2,w-2,h-2), base, outline=(0,0,0))
    d.ellipse((w//3-2,h//3-2,w//3+2,h//3+2),(0,0,0))
    d.ellipse((2*w//3-2,h//3-2,2*w//3+2,h//3+2),(0,0,0))
    if mood=="happy":
        d.arc((w//3,h//2,2*w//3,h-6), 200, 340, fill=(0,0,0))
    elif mood=="sad":
        d.arc((w//3,h//2+6,2*w//3,h), 20, 160, fill=(0,0,0))
    else:
        d.line((w//3,h-8, 2*w//3, h-8), (0,0,0))
    return quantize_db32(im)

def g_entity_circle(tile=32, mood="happy", seed=1):
    im = img_rgba(tile,tile)
    return _face(im, mood, base=(200,220,255))

def g_entity_square(tile=32, mood="happy", seed=1):
    w=tile; h=tile; im=img_rgba(w,h); d=ImageDraw.Draw(im)
    draw_rect(d,(2,2,w-2,h-2),(180,210,240), outline_col=(0,0,0))
    return _face(im, mood, base=(180,210,240))

# ---------- Registry ----------

SPRITES = {
    "banco": g_bench,
    "barra_estadistica": g_statbar,
    "canvas_base": g_canvas_base,
    "conexion_entidades": g_conn_overlay,
    "deco_bookshelf": g_bookshelf,
    "deco_clock": g_clock,
    "deco_lamp": g_lamp_table,
    "lampara": g_lamp_floor,
    "furniture_bed_simple": g_bed_simple,
    "furniture_bed_double": g_bed_double,
    "furniture_sofa_classic": g_sofa_classic,
    "furniture_sofa_modern": g_sofa_modern,
    "furniture_table_coffee": g_table_coffee,
    "furniture_table_dining": g_table_dining,
    "plant_small": g_plant_small,
    "plant_flower": g_plant_flower,
    "plant_tree": g_tree,
    "obstaculo_arbol": g_tree,
    "obstaculo_roca": g_rock,
    "fuente_agua": g_fountain,
    "flor_rosa": g_flower_rosa,
    "path_brick_h": g_path_brick_h,
    "path_dirt_h": g_path_dirt_h,
    "path_stone_h": g_path_stone_h,
    "path_stone_v": g_path_stone_v,
    "dialogo_overlay": g_dialog_overlay,
    "entidad_circulo_happy": lambda tile, seed: g_entity_circle(tile,"happy",seed),
    "entidad_circulo_sad": lambda tile, seed: g_entity_circle(tile,"sad",seed),
    "entidad_circulo_dying": lambda tile, seed: g_entity_circle(tile,"dying",seed),
    "entidad_square_happy": lambda tile, seed: g_entity_square(tile,"happy",seed),
    "entidad_square_sad": lambda tile, seed: g_entity_square(tile,"sad",seed),
    "entidad_square_dying": lambda tile, seed: g_entity_square(tile,"dying",seed),
}

# ---------- Simple Patterns ----------

def quantize_db32_img(im: Image.Image) -> Image.Image:
    pal_img = Image.new('P', (1,1))
    palette=[]
    for r,g,b in DB32: palette.extend([r,g,b])
    palette += [0,0,0]*(256-len(DB32))
    pal_img.putpalette(palette)
    return im.convert("RGB").quantize(palette=pal_img).convert("RGBA")

def tex_pattern_bedroom(size=32):
    im = Image.new("RGBA",(size,size),(99,155,255,255))
    d = ImageDraw.Draw(im)
    for y in range(0,size,8):
        d.line((0,y,size,y),(138,95,184,255))
    return quantize_db32_img(im)

def tex_pattern_kitchen(size=32):
    im = Image.new("RGBA",(size,size),(122,199,90,255))
    d = ImageDraw.Draw(im)
    for x in range(0,size,8):
        d.line((x,0,x,size),(50,60,50,255))
    return quantize_db32_img(im)

def tex_pattern_living(size=32):
    im = Image.new("RGBA",(size,size),(99,189,164,255))
    d = ImageDraw.Draw(im)
    for x in range(0,size,10):
        d.line((x,0,x,size),(69,160,156,255))
    return quantize_db32_img(im)

def tex_pattern_stone(size=32):
    im = Image.new("RGBA",(size,size),(106,106,106,255))
    d = ImageDraw.Draw(im)
    for y in range(0,size,6):
        d.line((0,y,size,y),(58,58,58,255))
    return quantize_db32_img(im)

def tex_pattern_tiles_only(size=32):
    im = Image.new("RGBA",(size,size),(90,90,106,255))
    d = ImageDraw.Draw(im)
    for x in range(0,size,8): d.line((x,0,x,size),(42,42,42,255))
    for y in range(0,size,8): d.line((0,y,size,y),(42,42,42,255))
    return quantize_db32_img(im)

PATTERNS = {
    "pattern_bedroom": tex_pattern_bedroom,
    "pattern_kitchen": tex_pattern_kitchen,
    "pattern_living": tex_pattern_living,
    "pattern_stone": tex_pattern_stone,
    "pattern_tiles_only": tex_pattern_tiles_only,
    "pattern_garden": lambda s: tex_pattern_bedroom(s).point(lambda v: v),
}

# ---------- CLI ----------

def cmd_sprites(args):
    outdir = args.outdir
    tile = args.size
    names = list(SPRITES.keys()) if args.names == "all" else [n.strip() for n in args.names.split(",") if n.strip()]
    for nm in names:
        gen = SPRITES.get(nm)
        if not gen:
            continue
        im = gen(tile, args.seed)
        path = os.path.join(outdir, f"{nm}.png")
        ensure_dir(os.path.dirname(path) or ".")
        im.save(path, "PNG")

def cmd_patterns(args):
    outdir = args.outdir
    size = args.size
    names = list(PATTERNS.keys()) if args.names == "all" else [n.strip() for n in args.names.split(",") if n.strip()]
    for nm in names:
        gen = PATTERNS.get(nm)
        if not gen:
            continue
        im = gen(size)
        path = os.path.join(outdir, f"{nm}.png")
        ensure_dir(os.path.dirname(path) or ".")
        im.save(path, "PNG")

def build_parser():
    p = argparse.ArgumentParser(description="PixelWorld v3 — sprites/props/UI + patterns")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("sprites", help="Generate sprite/prop/UI assets")
    s.add_argument("names", help="'all' or comma list of sprite names")
    s.add_argument("outdir")
    s.add_argument("--size", type=int, default=32)
    s.add_argument("--seed", type=int, default=2025)

    t = sub.add_parser("patterns", help="Generate simple patterns")
    t.add_argument("names", help="'all' or comma list of patterns")
    t.add_argument("outdir")
    t.add_argument("--size", type=int, default=32)

    return p

def main():
    p = build_parser()
    args = p.parse_args()
    if args.cmd == "sprites":
        cmd_sprites(args)
    elif args.cmd == "patterns":
        cmd_patterns(args)

if __name__ == "__main__":
    main()
