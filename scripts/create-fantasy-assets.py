#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎨 Fantasy Assets Generator v4.0
Genera assets estáticos con colores fantasía, degradados y efectos mágicos
"""

import argparse
import hashlib
import json
import math
import os
import random
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

# ---------- RNG / Paleta Fantasía ----------

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

# Paleta fantasía extendida con colores vibrantes y mágicos
FANTASY_PALETTE = {
    # Bases oscuras y neutras
    "void": (12, 8, 20),
    "shadow": (32, 24, 40),
    "charcoal": (52, 44, 60),
    "steel": (72, 84, 96),
    
    # Maderas mágicas
    "wood_enchanted": (139, 90, 143),
    "wood_mystic": (120, 70, 130),
    "wood_golden": (205, 148, 63),
    
    # Metales fantásticos
    "metal_silver": (180, 190, 200),
    "metal_gold": (255, 215, 0),
    "metal_copper": (184, 115, 51),
    "metal_mythril": (220, 240, 255),
    
    # Gemas y cristales
    "crystal_blue": (64, 128, 255),
    "crystal_purple": (148, 0, 211),
    "crystal_green": (50, 205, 50),
    "crystal_red": (255, 69, 0),
    "crystal_pink": (255, 105, 180),
    
    # Elementos mágicos
    "fire": (255, 140, 0),
    "ice": (173, 216, 230),
    "lightning": (255, 255, 0),
    "poison": (124, 252, 0),
    "shadow_magic": (75, 0, 130),
    
    # Natureza fantasía
    "grass_magical": (50, 205, 50),
    "leaf_fairy": (144, 238, 144),
    "flower_mystical": (255, 20, 147),
    "water_enchanted": (0, 191, 255),
    "earth_blessed": (139, 69, 19),
    
    # Textiles mágicos
    "fabric_royal": (72, 61, 139),
    "fabric_celestial": (135, 206, 250),
    "fabric_ethereal": (221, 160, 221),
    "fabric_divine": (255, 215, 0),
    
    # Luces y resplandores
    "glow_warm": (255, 248, 220),
    "glow_cool": (240, 248, 255),
    "glow_magic": (186, 85, 211),
    "sparkle": (255, 255, 255),
    
    # Gradientes especiales
    "sunset_1": (255, 94, 77),
    "sunset_2": (255, 154, 0),
    "ocean_1": (0, 119, 190),
    "ocean_2": (0, 180, 216),
    "forest_1": (46, 125, 50),
    "forest_2": (139, 195, 74),
    "galaxy_1": (63, 81, 181),
    "galaxy_2": (156, 39, 176),
}

# Combinaciones de degradados predefinidas
GRADIENT_PRESETS = {
    "sunset": ["sunset_1", "sunset_2"],
    "ocean": ["ocean_1", "ocean_2"],
    "forest": ["forest_1", "forest_2"],
    "galaxy": ["galaxy_1", "galaxy_2"],
    "royal": ["fabric_royal", "crystal_purple"],
    "golden": ["metal_gold", "wood_golden"],
    "mystical": ["crystal_blue", "crystal_purple"],
    "ethereal": ["fabric_ethereal", "glow_magic"],
}

# ---------- Utilidades Mejoradas ----------

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def img_rgba(w: int, h: int) -> Image.Image:
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def create_gradient(w: int, h: int, color1: Tuple[int,int,int], color2: Tuple[int,int,int], 
                   direction="vertical", curve="linear") -> Image.Image:
    """Crea degradados sofisticados con curvas personalizadas"""
    im = img_rgba(w, h)
    pixels = []
    
    for y in range(h):
        for x in range(w):
            if direction == "vertical":
                t = y / (h - 1) if h > 1 else 0
            elif direction == "horizontal":
                t = x / (w - 1) if w > 1 else 0
            elif direction == "diagonal":
                t = (x + y) / (w + h - 2) if (w + h) > 2 else 0
            elif direction == "radial":
                cx, cy = w // 2, h // 2
                max_dist = math.sqrt(cx**2 + cy**2)
                dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                t = min(dist / max_dist, 1.0) if max_dist > 0 else 0
            else:
                t = 0
            
            # Aplicar curva
            if curve == "ease_in":
                t = t * t
            elif curve == "ease_out":
                t = 1 - (1 - t) * (1 - t)
            elif curve == "ease_in_out":
                t = 2 * t * t if t < 0.5 else 1 - 2 * (1 - t) * (1 - t)
            elif curve == "sine":
                t = math.sin(t * math.pi / 2)
            
            # Interpolar colores
            r = int(color1[0] * (1 - t) + color2[0] * t)
            g = int(color1[1] * (1 - t) + color2[1] * t)
            b = int(color1[2] * (1 - t) + color2[2] * t)
            
            pixels.append((r, g, b, 255))
    
    im.putdata(pixels)
    return im

def add_glow_effect(im: Image.Image, intensity=2, color=(255, 255, 255)) -> Image.Image:
    """Añade efecto de resplandor"""
    # Crear máscara de brillo
    alpha = im.split()[-1]
    glow = Image.new("RGBA", im.size, color + (0,))
    glow_mask = alpha.filter(ImageFilter.GaussianBlur(radius=intensity))
    
    # Aplicar brillo
    glow.putalpha(glow_mask)
    result = Image.new("RGBA", im.size, (0, 0, 0, 0))
    result = Image.alpha_composite(result, glow)
    result = Image.alpha_composite(result, im)
    
    return result

def add_sparkle_effect(im: Image.Image, count=10, seed=1) -> Image.Image:
    """Añade efectos de chispas brillantes"""
    rng = rng_stream(seed, "sparkles")
    d = ImageDraw.Draw(im)
    
    for _ in range(count):
        x = rng.randint(0, im.width - 1)
        y = rng.randint(0, im.height - 1)
        size = rng.randint(1, 3)
        
        # Chispa en forma de cruz
        d.line((x - size, y, x + size, y), fill=FANTASY_PALETTE["sparkle"], width=1)
        d.line((x, y - size, x, y + size), fill=FANTASY_PALETTE["sparkle"], width=1)
    
    return im

def enhance_contrast(im: Image.Image, factor=1.3) -> Image.Image:
    """Mejora el contraste para mayor impacto visual"""
    enhancer = ImageEnhance.Contrast(im)
    return enhancer.enhance(factor)

def add_magical_outline(im: Image.Image, color=None, thickness=1) -> Image.Image:
    """Añade contorno mágico con gradiente"""
    if color is None:
        color = FANTASY_PALETTE["glow_magic"]
    
    # Crear contorno básico
    alpha = im.split()[-1]
    outline_mask = alpha.filter(ImageFilter.MaxFilter(thickness * 2 + 1))
    outline_mask = ImageEnhance.Brightness(outline_mask).enhance(0.7)
    
    outline = Image.new("RGBA", im.size, color + (0,))
    outline.putalpha(outline_mask)
    
    # Combinar con imagen original
    result = Image.new("RGBA", im.size, (0, 0, 0, 0))
    result = Image.alpha_composite(result, outline)
    result = Image.alpha_composite(result, im)
    
    return result

# ---------- Generadores de Assets Fantasía ----------

def g_fantasy_bench(tile=32, seed=1):
    """Banco encantado con resplandor mágico"""
    w, h = tile * 2, tile
    
    # Base con degradado
    base = create_gradient(w, h, FANTASY_PALETTE["wood_enchanted"], 
                          FANTASY_PALETTE["wood_mystic"], "vertical", "ease_out")
    
    d = ImageDraw.Draw(base)
    
    # Patas con efecto metálico
    legw = max(2, tile // 6)
    leg_color = FANTASY_PALETTE["metal_mythril"]
    d.rectangle((4, h-8, 4+legw, h-1), fill=leg_color)
    d.rectangle((w-4-legw, h-8, w-4, h-1), fill=leg_color)
    
    # Listones con gradiente
    for i in range(3):
        y0 = 4 + i * (tile // 4)
        plank = create_gradient(w-6, tile//8, FANTASY_PALETTE["wood_golden"], 
                               FANTASY_PALETTE["wood_enchanted"], "horizontal")
        base.alpha_composite(plank, (3, y0))
    
    # Efectos mágicos
    base = add_glow_effect(base, 1, FANTASY_PALETTE["glow_magic"][:3])
    base = add_sparkle_effect(base, 5, seed)
    
    return enhance_contrast(base)

def g_fantasy_crystal_lamp(tile=32, seed=1):
    """Lámpara de cristal mágico"""
    w, h = tile, tile * 2
    im = img_rgba(w, h)
    d = ImageDraw.Draw(im)
    
    # Base metálica
    base_grad = create_gradient(12, 6, FANTASY_PALETTE["metal_silver"], 
                               FANTASY_PALETTE["metal_mythril"], "vertical")
    im.alpha_composite(base_grad, (w//2-6, h-8))
    
    # Poste
    d.rectangle((w//2-1, h//3, w//2+1, h-8), fill=FANTASY_PALETTE["metal_silver"])
    
    # Cristal con degradado radial
    crystal = create_gradient(20, 12, FANTASY_PALETTE["crystal_blue"], 
                             FANTASY_PALETTE["crystal_purple"], "radial")
    im.alpha_composite(crystal, (w//2-10, h//3-6))
    
    # Resplandor mágico
    im = add_glow_effect(im, 3, FANTASY_PALETTE["glow_magic"][:3])
    
    return enhance_contrast(im)

def g_fantasy_mystical_tree(tile=32, seed=1):
    """Árbol místico con hojas brillantes"""
    w, h = tile * 2, tile * 3
    im = img_rgba(w, h)
    d = ImageDraw.Draw(im)
    rng = rng_stream(seed, "tree")
    
    # Tronco con textura
    trunk = create_gradient(6, 20, FANTASY_PALETTE["wood_enchanted"], 
                           FANTASY_PALETTE["shadow"], "horizontal", "ease_in")
    im.alpha_composite(trunk, (w//2-3, h-22))
    
    # Copa con degradado
    crown = create_gradient(32, 24, FANTASY_PALETTE["leaf_fairy"], 
                           FANTASY_PALETTE["grass_magical"], "radial", "ease_out")
    im.alpha_composite(crown, (w//2-16, 8))
    
    # Flores mágicas
    for _ in range(8):
        fx = rng.randint(w//2-12, w//2+12)
        fy = rng.randint(12, 28)
        flower_color = rng.choice([FANTASY_PALETTE["flower_mystical"], 
                                  FANTASY_PALETTE["crystal_pink"]])
        d.ellipse((fx-2, fy-2, fx+2, fy+2), fill=flower_color)
    
    # Partículas mágicas
    im = add_sparkle_effect(im, 15, seed)
    im = add_glow_effect(im, 2, FANTASY_PALETTE["glow_cool"][:3])
    
    return enhance_contrast(im)

def g_fantasy_enchanted_bed(tile=32, seed=1):
    """Cama encantada con textiles celestiales"""
    w, h = tile * 3, tile * 2
    im = img_rgba(w, h)
    
    # Marco de madera mágica
    frame = create_gradient(w-4, h//3, FANTASY_PALETTE["wood_golden"], 
                           FANTASY_PALETTE["wood_enchanted"], "vertical")
    im.alpha_composite(frame, (2, h//2))
    
    # Colchón con degradado suave
    mattress = create_gradient(w-8, h//3-4, FANTASY_PALETTE["fabric_celestial"], 
                              FANTASY_PALETTE["fabric_ethereal"], "vertical", "sine")
    im.alpha_composite(mattress, (4, 4))
    
    # Almohadas mágicas
    pillow1 = create_gradient(w//2-4, h//3-8, FANTASY_PALETTE["fabric_royal"], 
                             FANTASY_PALETTE["crystal_purple"], "diagonal")
    pillow2 = create_gradient(w//2-4, h//3-8, FANTASY_PALETTE["fabric_divine"], 
                             FANTASY_PALETTE["metal_gold"], "diagonal")
    
    im.alpha_composite(pillow1, (6, 6))
    im.alpha_composite(pillow2, (w//2+2, 6))
    
    # Resplandor suave
    im = add_glow_effect(im, 1, FANTASY_PALETTE["glow_warm"][:3])
    
    return enhance_contrast(im)

def g_fantasy_magic_fountain(tile=32, seed=1):
    """Fuente mágica con agua encantada"""
    w, h = tile * 2, tile * 2
    im = img_rgba(w, h)
    d = ImageDraw.Draw(im)
    
    # Base de piedra mágica
    base = create_gradient(w-8, h//3, FANTASY_PALETTE["steel"], 
                          FANTASY_PALETTE["metal_mythril"], "vertical")
    im.alpha_composite(base, (4, h-h//3))
    
    # Agua encantada
    water = create_gradient(w-12, h//3-4, FANTASY_PALETTE["water_enchanted"], 
                           FANTASY_PALETTE["crystal_blue"], "radial", "sine")
    im.alpha_composite(water, (6, h-h//3+2))
    
    # Chorro central
    d.rectangle((w//2-2, 6, w//2+2, h//2), fill=FANTASY_PALETTE["crystal_blue"])
    
    # Efectos de agua
    for i in range(5):
        y = 8 + i * 3
        d.ellipse((w//2-1, y, w//2+1, y+2), fill=FANTASY_PALETTE["sparkle"])
    
    # Resplandor acuático
    im = add_glow_effect(im, 2, FANTASY_PALETTE["glow_cool"][:3])
    im = add_sparkle_effect(im, 12, seed)
    
    return enhance_contrast(im)

def g_fantasy_crystal_flower(tile=32, seed=1):
    """Flor de cristal con pétalos brillantes"""
    w, h = tile, tile
    im = img_rgba(w, h)
    d = ImageDraw.Draw(im)
    
    # Tallo
    d.rectangle((w//2-1, h-12, w//2+1, h-2), fill=FANTASY_PALETTE["grass_magical"])
    
    # Pétalos con degradado
    center_x, center_y = w//2, h//2-2
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        px = int(center_x + 8 * math.cos(rad))
        py = int(center_y + 8 * math.sin(rad))
        
        petal = create_gradient(6, 8, FANTASY_PALETTE["crystal_pink"], 
                               FANTASY_PALETTE["flower_mystical"], "radial")
        im.alpha_composite(petal, (px-3, py-4))
    
    # Centro brillante
    d.ellipse((center_x-3, center_y-3, center_x+3, center_y+3), 
              fill=FANTASY_PALETTE["glow_magic"])
    
    # Efectos mágicos
    im = add_glow_effect(im, 2, FANTASY_PALETTE["glow_magic"][:3])
    
    return enhance_contrast(im)

# ---------- Patrones Fantasía ----------

def pattern_mystical_bedroom(size=32):
    """Patrón de dormitorio místico"""
    base = create_gradient(size, size, FANTASY_PALETTE["fabric_royal"], 
                          FANTASY_PALETTE["shadow"], "diagonal", "ease_in_out")
    
    d = ImageDraw.Draw(base)
    # Estrellas
    for i in range(0, size, 8):
        for j in range(0, size, 8):
            if (i + j) % 16 == 0:
                d.point((i, j), fill=FANTASY_PALETTE["sparkle"])
    
    return base

def pattern_enchanted_kitchen(size=32):
    """Patrón de cocina encantada"""
    base = create_gradient(size, size, FANTASY_PALETTE["forest_1"], 
                          FANTASY_PALETTE["leaf_fairy"], "horizontal", "sine")
    
    d = ImageDraw.Draw(base)
    # Líneas mágicas
    for x in range(0, size, 6):
        d.line((x, 0, x, size), fill=FANTASY_PALETTE["grass_magical"], width=1)
    
    return base

def pattern_celestial_living(size=32):
    """Patrón de sala celestial"""
    return create_gradient(size, size, FANTASY_PALETTE["ocean_1"], 
                          FANTASY_PALETTE["fabric_celestial"], "radial", "ease_out")

def pattern_crystal_garden(size=32):
    """Patrón de jardín de cristales"""
    base = create_gradient(size, size, FANTASY_PALETTE["grass_magical"], 
                          FANTASY_PALETTE["crystal_green"], "vertical", "ease_in_out")
    
    d = ImageDraw.Draw(base)
    # Cristales pequeños
    for i in range(3):
        x = (i * size // 3) + size // 6
        y = size // 2
        d.polygon([(x, y-3), (x-2, y+2), (x+2, y+2)], fill=FANTASY_PALETTE["crystal_blue"])
    
    return base

# ---------- Registry ----------

FANTASY_SPRITES = {
    # Mobiliario encantado
    "banco_encantado": g_fantasy_bench,
    "lampara_cristal": g_fantasy_crystal_lamp,
    "cama_celestial": g_fantasy_enchanted_bed,
    "fuente_magica": g_fantasy_magic_fountain,
    
    # Naturaleza mágica
    "arbol_mistico": g_fantasy_mystical_tree,
    "flor_cristal": g_fantasy_crystal_flower,
    
    # Elementos originales mejorados (mantener compatibilidad)
    "banco": g_fantasy_bench,
    "lampara": g_fantasy_crystal_lamp,
    "fuente_agua": g_fantasy_magic_fountain,
    "flor_rosa": g_fantasy_crystal_flower,
}

FANTASY_PATTERNS = {
    "pattern_bedroom": pattern_mystical_bedroom,
    "pattern_kitchen": pattern_enchanted_kitchen, 
    "pattern_living": pattern_celestial_living,
    "pattern_garden": pattern_crystal_garden,
    "pattern_stone": lambda s: create_gradient(s, s, FANTASY_PALETTE["steel"], 
                                              FANTASY_PALETTE["metal_mythril"], "vertical"),
    "pattern_tiles_only": lambda s: create_gradient(s, s, FANTASY_PALETTE["charcoal"], 
                                                   FANTASY_PALETTE["steel"], "diagonal"),
}

# ---------- CLI ----------

def cmd_sprites(args):
    outdir = args.outdir
    tile = args.size
    names = list(FANTASY_SPRITES.keys()) if args.names == "all" else [n.strip() for n in args.names.split(",") if n.strip()]
    
    generated = []
    for nm in names:
        gen = FANTASY_SPRITES.get(nm)
        if not gen:
            print(f"⚠️  Sprite '{nm}' no encontrado")
            continue
        
        try:
            im = gen(tile, args.seed)
            path = os.path.join(outdir, f"{nm}.png")
            ensure_dir(os.path.dirname(path) or ".")
            im.save(path, "PNG")
            generated.append(nm)
            print(f"✨ Generado: {nm}.png")
        except Exception as e:
            print(f"❌ Error generando {nm}: {e}")
    
    print(f"\n🎨 Sprites fantasía generados: {len(generated)}/{len(names)}")

def cmd_patterns(args):
    outdir = args.outdir
    size = args.size
    names = list(FANTASY_PATTERNS.keys()) if args.names == "all" else [n.strip() for n in args.names.split(",") if n.strip()]
    
    generated = []
    for nm in names:
        gen = FANTASY_PATTERNS.get(nm)
        if not gen:
            print(f"⚠️  Patrón '{nm}' no encontrado")
            continue
        
        try:
            im = gen(size)
            path = os.path.join(outdir, f"{nm}.png")
            ensure_dir(os.path.dirname(path) or ".")
            im.save(path, "PNG")
            generated.append(nm)
            print(f"✨ Generado: {nm}.png")
        except Exception as e:
            print(f"❌ Error generando {nm}: {e}")
    
    print(f"\n🌟 Patrones fantasía generados: {len(generated)}/{len(names)}")

def list_assets(args):
    print("🎨 SPRITES FANTASÍA DISPONIBLES:")
    for name in sorted(FANTASY_SPRITES.keys()):
        print(f"  • {name}")
    
    print(f"\n🌟 PATRONES FANTASÍA DISPONIBLES:")
    for name in sorted(FANTASY_PATTERNS.keys()):
        print(f"  • {name}")
    
    print(f"\n🎭 GRADIENTES PREDEFINIDOS:")
    for name in sorted(GRADIENT_PRESETS.keys()):
        colors = GRADIENT_PRESETS[name]
        print(f"  • {name}: {colors[0]} → {colors[1]}")

def build_parser():
    p = argparse.ArgumentParser(description="🎨 Fantasy Assets Generator v4.0")
    p.add_argument("--version", action="version", version="Fantasy Assets v4.0")
    
    sub = p.add_subparsers(dest="cmd", required=True)

    # Sprites
    s = sub.add_parser("sprites", help="Generar sprites fantasía con degradados")
    s.add_argument("names", help="'all' o lista separada por comas de sprites")
    s.add_argument("outdir", help="Directorio de salida")
    s.add_argument("--size", type=int, default=32, help="Tamaño base (default: 32)")
    s.add_argument("--seed", type=int, default=2025, help="Semilla para efectos aleatorios")

    # Patrones
    t = sub.add_parser("patterns", help="Generar patrones con degradados")
    t.add_argument("names", help="'all' o lista separada por comas de patrones")
    t.add_argument("outdir", help="Directorio de salida")
    t.add_argument("--size", type=int, default=32, help="Tamaño del patrón")

    # Listar
    l = sub.add_parser("list", help="Mostrar todos los assets disponibles")

    return p

def main():
    p = build_parser()
    args = p.parse_args()
    
    if args.cmd == "sprites":
        cmd_sprites(args)
    elif args.cmd == "patterns":
        cmd_patterns(args)
    elif args.cmd == "list":
        list_assets(args)

if __name__ == "__main__":
    main()
