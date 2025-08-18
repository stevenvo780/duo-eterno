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

# ---------- MAGICAL EFFECTS ----------

def create_magical_gradient(color1, color2, width=16, height=16, direction='vertical'):
    """Crea un degradado mágico entre dos colores"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = img.load()
    
    for x in range(width):
        for y in range(height):
            if direction == 'vertical':
                ratio = y / (height - 1) if height > 1 else 0
            elif direction == 'horizontal':
                ratio = x / (width - 1) if width > 1 else 0
            elif direction == 'radial':
                center_x, center_y = width // 2, height // 2
                max_dist = np.sqrt(center_x**2 + center_y**2)
                dist = np.sqrt((x - center_x)**2 + (y - center_y)**2)
                ratio = min(dist / max_dist, 1.0) if max_dist > 0 else 0
            else:  # diagonal
                ratio = (x + y) / (width + height - 2) if (width + height) > 2 else 0
            
            # Interpolación mágica con curva suave
            ratio = ratio ** 0.7  # Curva más suave
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            pixels[x, y] = (r, g, b, 255)
    
    return img

def add_magical_glow(img, glow_color=(255, 226, 138), intensity=0.3):
    """Añade un resplandor mágico a una imagen"""
    width, height = img.size
    glow_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    pixels = img.load()
    glow_pixels = glow_img.load()
    
    for x in range(width):
        for y in range(height):
            if pixels[x, y][3] > 0:  # Si el pixel no es transparente
                # Añadir brillo en los bordes
                for dx in [-1, 0, 1]:
                    for dy in [-1, 0, 1]:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < width and 0 <= ny < height:
                            if pixels[nx, ny][3] == 0:  # Borde
                                glow_pixels[x, y] = (*glow_color, int(255 * intensity))
    
    # Combinar imagen original con resplandor
    final_img = Image.alpha_composite(glow_img, img)
    return final_img

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
    # Maderas mágicas con tonos dorados y violetas
    "wood_base": (147,98,181),  # Madera mística violeta
    "wood_dark": (98,52,147),   # Madera oscura morada
    "wood_light": (226,176,255), # Madera brillante lila
    
    # Metales cristalinos
    "metal": (138,186,255),     # Metal cristal azul
    "metal_light": (198,226,255), # Metal plateado brillante
    "metal_dark": (88,136,205),  # Metal azul oscuro
    
    # Piedras encantadas
    "stone": (147,147,226),     # Piedra encantada azul
    "stone_dark": (98,98,176),  # Piedra oscura mística
    "stone_light": (197,197,255), # Piedra brillante
    
    # Telas mágicas
    "fabric": (255,138,226),    # Tela rosa mágica
    "fabric_alt": (186,98,255), # Tela violeta encantada
    "fabric_gold": (255,206,98), # Tela dorada
    
    # Naturaleza fantástica
    "grass": (98,255,138),      # Césped mágico verde brillante
    "leaf": (138,255,98),       # Hojas encantadas
    "flower": (255,98,186),     # Flores cristalinas rosa
    "flower_alt": (186,255,98), # Flores verdes brillantes
    
    # Elementos especiales
    "crystal": (138,226,255),   # Cristal azul brillante
    "crystal_pink": (255,138,226), # Cristal rosa
    "crystal_purple": (186,138,255), # Cristal violeta
    
    # Tierra y construcción fantástica
    "dirt": (147,98,68),        # Tierra mística
    "brick": (255,147,98),      # Ladrillo dorado
    "foam": (255,255,226),      # Espuma brillante
    
    # Metales preciosos
    "gold": (255,206,98),       # Oro brillante
    "silver": (226,226,255),    # Plata cristalina
    "copper": (255,147,98),     # Cobre encantado
    
    # Elementos base
    "shadow": (48,32,68),       # Sombra violeta
    "highlight": (255,255,255), # Brillo puro
    "glow": (255,226,138)       # Resplandor dorado
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
    """Genera un banco con pixel art detallado"""
    w, h = tile*2, tile
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "bench")
    
    # Base del banco con textura de madera
    for y in range(h-8, h):
        for x in range(4, w-4):
            if y == h-8 or y == h-1 or x == 4 or x == w-5:
                pixels[x, y] = PALET["wood_dark"]  # Borde
            else:
                # Textura de madera con vetas
                if (x + y) % 3 == 0:
                    pixels[x, y] = PALET["wood_light"]
                else:
                    pixels[x, y] = PALET["wood_base"]
    
    # Respaldo con detalles
    for y in range(4, h-8):
        for x in range(6, w-6):
            if x == 6 or x == w-7 or y == 4:
                pixels[x, y] = PALET["wood_dark"]  # Marco
            elif (x + y) % 4 == 0:
                pixels[x, y] = PALET["wood_light"]  # Vetas
            else:
                pixels[x, y] = PALET["wood_base"]
    
    # Patas del banco
    for leg_x in [6, w-8]:
        for y in range(h-12, h):
            for x in range(leg_x, leg_x+2):
                if x == leg_x or x == leg_x+1:
                    pixels[x, y] = PALET["wood_dark"]
    
    # Detalles metálicos (clavos/herrajes)
    for nail_x in [8, w//2, w-10]:
        if 0 <= nail_x < w and h-6 < h:
            pixels[nail_x, h-6] = PALET["metal"]
            
    return quantize_db32(im)

def g_statbar(tile=32, seed=1, value=0.75):
    """Barra de estadística con cristales mágicos"""
    w, h = tile*2, tile//3
    im = img_rgba(w, h)
    pixels = im.load()
    
    # Marco de la barra con piedra encantada
    for y in range(h):
        for x in range(w):
            if x == 0 or x == w-1 or y == 0 or y == h-1:
                pixels[x, y] = PALET["stone_dark"]
            elif x == 1 or x == w-2 or y == 1 or y == h-2:
                pixels[x, y] = PALET["stone"]
    
    # Relleno con cristales
    fillw = int((w-4) * value)
    for y in range(2, h-2):
        for x in range(2, 2+fillw):
            if (x + y) % 3 == 0:
                pixels[x, y] = PALET["crystal"]
            elif (x + y) % 3 == 1:
                pixels[x, y] = PALET["crystal_pink"]
            else:
                pixels[x, y] = PALET["glow"]
    
    return quantize_db32(im)

def g_canvas_base(tile=32, seed=1):
    """Base de canvas con patrón mágico"""
    w, h = tile*6, tile*4
    im = img_rgba(w, h)
    pixels = im.load()
    
    # Patrón de rejilla mágica
    for y in range(h):
        for x in range(w):
            if x % 8 == 0 or y % 8 == 0:
                if (x//8 + y//8) % 2 == 0:
                    pixels[x, y] = PALET["crystal"]
                else:
                    pixels[x, y] = PALET["crystal_purple"]
            else:
                # Fondo transparente con puntos de luz
                if (x + y) % 16 == 0:
                    pixels[x, y] = (*PALET["glow"], 128)
    
    return quantize_db32(im)
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
    """Planta pequeña con hojas detalladas pixel by pixel"""
    w, h = tile, tile
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "plant_small")
    
    # Maceta de barro encantado
    pot_start_y = h - 12
    for y in range(pot_start_y, h-2):
        pot_width = 6 + (y - pot_start_y)
        start_x = w//2 - pot_width//2
        end_x = w//2 + pot_width//2
        for x in range(start_x, end_x):
            if x == start_x or x == end_x-1:
                pixels[x, y] = PALET["dirt"]  # Borde de la maceta
            else:
                pixels[x, y] = PALET["brick"]  # Interior de la maceta
    
    # Tallo principal
    for y in range(pot_start_y-8, pot_start_y+2):
        pixels[w//2, y] = PALET["leaf"]
        if y % 2 == 0:
            pixels[w//2-1, y] = PALET["grass"]  # Variación en el tallo
    
    # Hojas con patrón detallado
    leaf_positions = [(w//2-4, pot_start_y-6), (w//2+3, pot_start_y-4), (w//2-2, pot_start_y-10)]
    for leaf_x, leaf_y in leaf_positions:
        # Hoja principal
        for dy in range(-2, 3):
            for dx in range(-2, 3):
                if abs(dx) + abs(dy) <= 2:
                    x, y = leaf_x + dx, leaf_y + dy
                    if 0 <= x < w and 0 <= y < h:
                        if abs(dx) + abs(dy) == 2:
                            pixels[x, y] = PALET["grass"]  # Borde de hoja
                        else:
                            pixels[x, y] = PALET["leaf"]  # Centro de hoja
    
    return quantize_db32(im)

def g_plant_flower(tile=32, seed=1):
    """Planta con flor cristalina detallada"""
    w, h = tile, tile
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "plant_flower")
    
    # Base de tierra mágica
    for y in range(h-6, h):
        for x in range(w//4, 3*w//4):
            pixels[x, y] = PALET["dirt"]
    
    # Tallo con textura
    for y in range(h//2, h-6):
        pixels[w//2, y] = PALET["leaf"]
        if y % 3 == 0:
            pixels[w//2-1, y] = PALET["grass"]
            pixels[w//2+1, y] = PALET["grass"]
    
    # Flor cristalina central
    flower_center = (w//2, h//2-4)
    for dy in range(-3, 4):
        for dx in range(-3, 4):
            dist = abs(dx) + abs(dy)
            x, y = flower_center[0] + dx, flower_center[1] + dy
            if 0 <= x < w and 0 <= y < h:
                if dist <= 1:
                    pixels[x, y] = PALET["crystal_pink"]  # Centro
                elif dist == 2:
                    pixels[x, y] = PALET["flower"]  # Pétalos
                elif dist == 3 and abs(dx) != abs(dy):
                    pixels[x, y] = PALET["flower_alt"]  # Pétalos exteriores
    
    # Hojas laterales
    for side in [-1, 1]:
        for leaf_y in [h//2+2, h//2+6]:
            leaf_x = w//2 + side * 4
            for dy in range(-1, 2):
                for dx in range(-2, 3):
                    x, y = leaf_x + dx, leaf_y + dy
                    if 0 <= x < w and 0 <= y < h and abs(dx) + abs(dy) <= 2:
                        pixels[x, y] = PALET["leaf"]
    
    return quantize_db32(im)

def g_tree(tile=32, seed=1):
    """Árbol mágico con copa cristalina"""
    w, h = tile*2, tile*3
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "tree")
    
    # Tronco con textura de corteza
    trunk_width = 6
    trunk_start_x = w//2 - trunk_width//2
    for y in range(h//2, h-2):
        for x in range(trunk_start_x, trunk_start_x + trunk_width):
            if x == trunk_start_x or x == trunk_start_x + trunk_width - 1:
                pixels[x, y] = PALET["wood_dark"]  # Borde del tronco
            else:
                if (x + y) % 3 == 0:
                    pixels[x, y] = PALET["wood_light"]  # Vetas
                else:
                    pixels[x, y] = PALET["wood_base"]
    
    # Copa del árbol con hojas cristalinas
    center_x, center_y = w//2, h//2 - 6
    for dy in range(-8, 6):
        for dx in range(-8, 9):
            dist = dx*dx + dy*dy
            x, y = center_x + dx, center_y + dy
            if 0 <= x < w and 0 <= y < h and dist <= 64:
                if dist <= 16:
                    # Centro con cristales
                    pixels[x, y] = PALET["crystal"]
                elif dist <= 36:
                    # Hojas normales
                    if (x + y) % 3 == 0:
                        pixels[x, y] = PALET["leaf"]
                    else:
                        pixels[x, y] = PALET["grass"]
                elif dist <= 64 and rng.random() < 0.6:
                    # Hojas esparcidas
                    pixels[x, y] = PALET["leaf"]
    
    # Frutos cristalinos esparcidos
    fruit_positions = [(center_x-4, center_y+2), (center_x+3, center_y-1), (center_x+1, center_y+4)]
    for fruit_x, fruit_y in fruit_positions:
        if 0 <= fruit_x < w and 0 <= fruit_y < h:
            pixels[fruit_x, fruit_y] = PALET["crystal_pink"]
    
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
    """Entidad circular con pixel art detallado"""
    w, h = tile, tile
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "entity_circle")
    
    # Determinar colores según el estado de ánimo
    if mood == "happy":
        base_color = PALET["crystal"]
        accent_color = PALET["crystal_pink"]
        glow_color = PALET["glow"]
    elif mood == "sad":
        base_color = PALET["crystal_purple"]
        accent_color = PALET["shadow"]
        glow_color = PALET["stone"]
    else:  # dying
        base_color = PALET["shadow"]
        accent_color = PALET["stone_dark"]
        glow_color = PALET["metal_dark"]
    
    # Dibujar círculo pixel by pixel con gradiente
    center_x, center_y = w//2, h//2
    radius = min(w, h)//2 - 2
    
    for y in range(h):
        for x in range(w):
            dist = ((x - center_x)**2 + (y - center_y)**2)**0.5
            if dist <= radius:
                if dist <= radius * 0.3:
                    # Centro brillante
                    pixels[x, y] = glow_color
                elif dist <= radius * 0.7:
                    # Cuerpo principal con patrón
                    if (x + y) % 3 == 0:
                        pixels[x, y] = base_color
                    else:
                        pixels[x, y] = accent_color
                else:
                    # Borde
                    pixels[x, y] = accent_color
    
    # Añadir ojos según el humor
    eye_y = center_y - 4
    if mood == "happy":
        # Ojos sonrientes
        pixels[center_x-4, eye_y] = PALET["shadow"]
        pixels[center_x+4, eye_y] = PALET["shadow"]
        pixels[center_x-4, eye_y+1] = PALET["shadow"]
        pixels[center_x+4, eye_y+1] = PALET["shadow"]
        # Sonrisa
        for i in range(-3, 4):
            if abs(i) <= 2:
                pixels[center_x+i, center_y+3] = PALET["shadow"]
    elif mood == "sad":
        # Ojos tristes
        pixels[center_x-4, eye_y] = PALET["shadow"]
        pixels[center_x+4, eye_y] = PALET["shadow"]
        # Lágrimas
        pixels[center_x-4, eye_y+2] = PALET["crystal"]
        pixels[center_x+4, eye_y+2] = PALET["crystal"]
        # Boca triste
        for i in range(-2, 3):
            if abs(i) <= 1:
                pixels[center_x+i, center_y+5] = PALET["shadow"]
    else:  # dying
        # Ojos X
        for i in [-1, 0, 1]:
            pixels[center_x-4+i, eye_y-1+i] = PALET["shadow"]
            pixels[center_x-4+i, eye_y+1-i] = PALET["shadow"]
            pixels[center_x+4+i, eye_y-1+i] = PALET["shadow"]
            pixels[center_x+4+i, eye_y+1-i] = PALET["shadow"]
    
    return quantize_db32(im)

def g_entity_square(tile=32, mood="happy", seed=1):
    """Entidad cuadrada con pixel art detallado"""
    w, h = tile, tile
    im = img_rgba(w, h)
    pixels = im.load()
    rng = rng_stream(seed, "entity_square")
    
    # Determinar colores según el estado de ánimo
    if mood == "happy":
        base_color = PALET["fabric"]
        accent_color = PALET["fabric_gold"]
        border_color = PALET["gold"]
    elif mood == "sad":
        base_color = PALET["fabric_alt"]
        accent_color = PALET["shadow"]
        border_color = PALET["stone_dark"]
    else:  # dying
        base_color = PALET["shadow"]
        accent_color = PALET["stone_dark"]
        border_color = PALET["metal_dark"]
    
    # Dibujar cuadrado con borde y patrón interno
    for y in range(2, h-2):
        for x in range(2, w-2):
            if x == 2 or x == w-3 or y == 2 or y == h-3:
                # Borde
                pixels[x, y] = border_color
            elif x == 3 or x == w-4 or y == 3 or y == h-4:
                # Borde interno
                pixels[x, y] = accent_color
            else:
                # Interior con patrón
                if (x + y) % 4 == 0:
                    pixels[x, y] = base_color
                elif (x + y) % 4 == 2:
                    pixels[x, y] = accent_color
                else:
                    pixels[x, y] = base_color
    
    # Añadir cara
    center_x, center_y = w//2, h//2
    eye_y = center_y - 3
    
    if mood == "happy":
        # Ojos brillantes
        pixels[center_x-3, eye_y] = PALET["crystal"]
        pixels[center_x+3, eye_y] = PALET["crystal"]
        # Sonrisa
        for i in range(-2, 3):
            pixels[center_x+i, center_y+2] = border_color
    elif mood == "sad":
        # Ojos apagados
        pixels[center_x-3, eye_y] = PALET["shadow"]
        pixels[center_x+3, eye_y] = PALET["shadow"]
        # Boca triste
        for i in range(-1, 2):
            pixels[center_x+i, center_y+3] = border_color
    else:  # dying
        # Ojos X
        pixels[center_x-3, eye_y-1] = PALET["shadow"]
        pixels[center_x-3, eye_y+1] = PALET["shadow"]
        pixels[center_x+3, eye_y-1] = PALET["shadow"]
        pixels[center_x+3, eye_y+1] = PALET["shadow"]
    
    return quantize_db32(im)

# ---------- Registry ----------

# Props estáticos (no animados)
PROPS = {
    "banco": g_bench,
    "furniture_bed_simple": g_bed_simple,
    "furniture_bed_double": g_bed_double,
    "furniture_sofa_classic": g_sofa_classic,
    "furniture_sofa_modern": g_sofa_modern,
    "furniture_table_coffee": g_table_coffee,
    "furniture_table_dining": g_table_dining,
    "deco_bookshelf": g_bookshelf,
    "deco_clock": g_clock,
    "deco_lamp": g_lamp_table,
    "lampara": g_lamp_floor,
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
}

# Solo props estáticos (las entidades ahora son animaciones)
ALL_SPRITES = {**PROPS}

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
    """Genera sprites organizados en carpetas según su tipo"""
    base_outdir = args.outdir
    tile = args.size
    
    # Determinar qué generar
    if args.names == "all":
        generate_props = True
        generate_sprites = True
        generate_ui = True
        names_to_generate = list(ALL_SPRITES.keys())
    else:
        names_list = [n.strip() for n in args.names.split(",") if n.strip()]
        generate_props = any(name in PROPS for name in names_list)
        names_to_generate = names_list
    
    # Crear directorios según lo que vamos a generar
    if generate_props or "all" in args.names:
        ensure_dir(os.path.join(base_outdir, "props"))
    
    print(f"🎨 Generando pixel art mágico en {base_outdir}...")
    
    for nm in names_to_generate:
        # Solo generar props ahora
        if nm in PROPS:
            category = "props"
            gen = PROPS[nm]
        else:
            print(f"⚠️  Sprite '{nm}' no encontrado en PROPS")
            continue
        
        try:
            # Generar imagen
            im = gen(tile, args.seed)
            
            # Guardar en la carpeta correspondiente
            path = os.path.join(base_outdir, category, f"{nm}.png")
            im.save(path, "PNG")
            print(f"✨ {category}/{nm}.png generado")
            
        except Exception as e:
            print(f"❌ Error generando {nm}: {e}")
    
    print(f"🌟 Generación completada! Assets guardados en {base_outdir}")
    return True

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
