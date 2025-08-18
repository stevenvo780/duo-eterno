#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎭 Animation System v3.0 - MAGICAL ENHANCED
Crea sprites animados con efectos de partículas, transiciones suaves y fondos mágicos
"""

import argparse
import json
import math
import os
import hashlib
import random
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

# ---------- Utilidades Base ----------

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

def img_rgba(w: int, h: int) -> Image.Image:
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

# Paleta fantasía expandida para animaciones
FANTASY_PALETTE = {
    "void": (12, 8, 20),
    "shadow": (32, 24, 40),
    "charcoal": (52, 44, 60),
    "steel": (72, 84, 96),
    
    # Maderas mágicas
    "wood_enchanted": (139, 90, 143),
    "wood_mystic": (120, 70, 130),
    "wood_golden": (205, 148, 63),
    
    # Metales fantasía
    "metal_silver": (180, 190, 200),
    "metal_gold": (255, 215, 0),
    "metal_copper": (184, 115, 51),
    "metal_mythril": (220, 240, 255),
    
    # Cristales brillantes
    "crystal_blue": (64, 128, 255),
    "crystal_purple": (148, 0, 211),
    "crystal_green": (50, 205, 50),
    "crystal_red": (255, 69, 0),
    "crystal_pink": (255, 105, 180),
    "crystal_white": (240, 248, 255),
    
    # Elementos mágicos
    "fire": (255, 140, 0),
    "ice": (173, 216, 230),
    "lightning": (255, 255, 0),
    "poison": (124, 252, 0),
    "shadow_magic": (75, 0, 130),
    
    # Naturaleza encantada
    "water_enchanted": (0, 191, 255),
    "grass_magical": (50, 205, 50),
    "grass_bright": (98, 255, 138),
    "grass_deep": (34, 139, 34),
    "leaf_fairy": (144, 238, 144),
    "flower_mystical": (255, 20, 147),
    "earth_blessed": (139, 69, 19),
    
    # Resplandores y luces
    "glow_warm": (255, 248, 220),
    "glow_cool": (240, 248, 255),
    "glow_magic": (186, 85, 211),
    "glow_golden": (255, 226, 138),
    "sparkle": (255, 255, 255),
    
    # Céspedes especiales
    "grass_spring": (124, 252, 0),
    "grass_summer": (50, 205, 50),
    "grass_autumn": (154, 205, 50),
    "grass_winter": (143, 188, 143),
    "grass_mystical": (98, 255, 138),
    "grass_glow": (144, 238, 144),
}

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
    import random
    rng = random.Random(seed)
    d = ImageDraw.Draw(im)
    
    for _ in range(count):
        x = rng.randint(0, im.width - 1)
        y = rng.randint(0, im.height - 1)
        size = rng.randint(1, 3)
        
        # Chispa en forma de cruz
        d.line((x - size, y, x + size, y), fill=FANTASY_PALETTE["sparkle"], width=1)
        d.line((x, y - size, x, y + size), fill=FANTASY_PALETTE["sparkle"], width=1)
    
    return im

# ---------- Sistema de Animación ----------

class AnimationFrame:
    def __init__(self, image: Image.Image, duration: int = 100):
        self.image = image
        self.duration = duration  # ms

class SpriteAnimation:
    def __init__(self, name: str, frames: List[AnimationFrame], loop: bool = True):
        self.name = name
        self.frames = frames
        self.loop = loop
        self.total_duration = sum(f.duration for f in frames)
    
    def save_as_spritesheet(self, path: str, columns: int = None):
        """Guarda animación como spritesheet"""
        if not self.frames:
            return
        
        frame_count = len(self.frames)
        if columns is None:
            columns = min(frame_count, 8)
        rows = (frame_count + columns - 1) // columns
        
        frame_w, frame_h = self.frames[0].image.size
        sheet_w = columns * frame_w
        sheet_h = rows * frame_h
        
        spritesheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
        
        for i, frame in enumerate(self.frames):
            col = i % columns
            row = i // columns
            x = col * frame_w
            y = row * frame_h
            spritesheet.paste(frame.image, (x, y))
        
        spritesheet.save(path, "PNG")
        
        # Guardar metadatos de animación
        metadata = {
            "name": self.name,
            "frame_count": frame_count,
            "frame_size": [frame_w, frame_h],
            "columns": columns,
            "rows": rows,
            "total_duration": self.total_duration,
            "loop": self.loop,
            "frames": [{"duration": f.duration} for f in self.frames]
        }
        
        meta_path = path.replace(".png", ".json")
        with open(meta_path, "w") as f:
            json.dump(metadata, f, indent=2)

# ---------- Generadores de Animaciones ----------

def create_floating_animation(base_sprite: Image.Image, amplitude: int = 2, frames: int = 12) -> SpriteAnimation:
    """Animación de flotación suave"""
    animation_frames = []
    
    for i in range(frames):
        t = (i / frames) * 2 * math.pi
        offset_y = int(amplitude * math.sin(t))
        
        # Crear frame con offset vertical
        frame_img = img_rgba(base_sprite.width, base_sprite.height + amplitude * 2)
        frame_img.paste(base_sprite, (0, amplitude + offset_y))
        
        animation_frames.append(AnimationFrame(frame_img, 100))
    
    return SpriteAnimation("floating", animation_frames)

def create_pulse_animation(base_sprite: Image.Image, intensity: float = 0.3, frames: int = 16) -> SpriteAnimation:
    """Animación de pulso brillante"""
    animation_frames = []
    
    for i in range(frames):
        t = (i / frames) * 2 * math.pi
        pulse_factor = 1.0 + intensity * math.sin(t)
        
        # Aplicar brillo pulsante
        enhancer = ImageEnhance.Brightness(base_sprite)
        bright_sprite = enhancer.enhance(pulse_factor)
        
        # Añadir resplandor si está en pico
        if pulse_factor > 1.15:
            bright_sprite = add_glow_effect(bright_sprite, 2, FANTASY_PALETTE["glow_magic"][:3])
        
        animation_frames.append(AnimationFrame(bright_sprite, 80))
    
    return SpriteAnimation("pulse", animation_frames)

def create_sparkle_animation(base_sprite: Image.Image, sparkle_count: int = 8, frames: int = 20) -> SpriteAnimation:
    """Animación de chispas mágicas"""
    animation_frames = []
    
    for i in range(frames):
        frame_img = base_sprite.copy()
        
        # Rotar chispas a través del tiempo
        phase = (i / frames) * 2 * math.pi
        sparkle_seed = i * 100  # Cambiar semilla por frame
        
        frame_img = add_sparkle_effect(frame_img, sparkle_count, sparkle_seed)
        
        # Efecto de resplandor variable
        if i % 4 == 0:  # Cada 4 frames, resplandor extra
            frame_img = add_glow_effect(frame_img, 1, FANTASY_PALETTE["sparkle"])
        
        animation_frames.append(AnimationFrame(frame_img, 120))
    
    return SpriteAnimation("sparkle", animation_frames)

def create_water_flow_animation(base_sprite: Image.Image, frames: int = 24) -> SpriteAnimation:
    """Animación de flujo de agua"""
    animation_frames = []
    
    for i in range(frames):
        frame_img = base_sprite.copy()
        d = ImageDraw.Draw(frame_img)
        
        # Partículas de agua cayendo
        phase = (i / frames) * 2 * math.pi
        
        for j in range(6):
            # Posiciones de gotitas que caen
            drop_y = (base_sprite.height // 4) + int((i + j * 4) % 16)
            drop_x = base_sprite.width // 2 + int(2 * math.sin(phase + j))
            
            if drop_y < base_sprite.height - 4:
                d.ellipse((drop_x-1, drop_y, drop_x+1, drop_y+2), 
                         fill=FANTASY_PALETTE["water_enchanted"])
        
        animation_frames.append(AnimationFrame(frame_img, 100))
    
    return SpriteAnimation("water_flow", animation_frames)

def create_leaf_sway_animation(base_sprite: Image.Image, frames: int = 16) -> SpriteAnimation:
    """Animación de hojas balanceándose"""
    animation_frames = []
    
    for i in range(frames):
        t = (i / frames) * 2 * math.pi
        sway_x = int(2 * math.sin(t))
        
        # Crear frame balanceado
        frame_img = img_rgba(base_sprite.width + 4, base_sprite.height)
        frame_img.paste(base_sprite, (2 + sway_x, 0))
        
        # Añadir hojas que caen ocasionalmente
        if i % 8 == 0:
            d = ImageDraw.Draw(frame_img)
            leaf_x = base_sprite.width // 2 + sway_x
            leaf_y = base_sprite.height - 8
            d.ellipse((leaf_x, leaf_y, leaf_x+2, leaf_y+2), 
                     fill=FANTASY_PALETTE["leaf_fairy"])
        
        animation_frames.append(AnimationFrame(frame_img, 150))
    
    return SpriteAnimation("leaf_sway", animation_frames)

def create_fire_flicker_animation(base_sprite: Image.Image, frames: int = 12) -> SpriteAnimation:
    """Animación de llama parpadeante"""
    animation_frames = []
    
    for i in range(frames):
        frame_img = base_sprite.copy()
        
        # Crear efecto de llama dinámica
        flicker_intensity = 0.8 + 0.4 * math.sin((i / frames) * 4 * math.pi)
        
        # Aplicar brillo variable
        enhancer = ImageEnhance.Brightness(frame_img)
        bright_frame = enhancer.enhance(flicker_intensity)
        
        # Añadir resplandor de fuego
        bright_frame = add_glow_effect(bright_frame, 2, FANTASY_PALETTE["fire"][:3])
        
        animation_frames.append(AnimationFrame(bright_frame, 80))
    
    return SpriteAnimation("fire_flicker", animation_frames)

# ---------- Generadores para Entidades ----------

def create_entity_idle_animation(entity_type: str, mood: str, frames: int = 8) -> SpriteAnimation:
    """Animación idle para entidades"""
    # Cargar sprite base
    base_name = f"entidad_{entity_type}_{mood}"
    
    # Crear sprite base si no existe
    w, h = 32, 32
    base_sprite = img_rgba(w, h)
    d = ImageDraw.Draw(base_sprite)
    
    # Colores según mood
    mood_colors = {
        "happy": FANTASY_PALETTE["crystal_blue"],
        "sad": FANTASY_PALETTE["crystal_purple"], 
        "dying": FANTASY_PALETTE["crystal_red"]
    }
    
    # Forma según tipo
    if entity_type == "circulo":
        d.ellipse((4, 4, w-4, h-4), fill=mood_colors.get(mood, mood_colors["happy"]))
    else:  # square
        d.rectangle((4, 4, w-4, h-4), fill=mood_colors.get(mood, mood_colors["happy"]))
    
    # Añadir expresión
    eye_color = FANTASY_PALETTE["shadow"]
    if mood == "happy":
        d.ellipse((10, 12, 14, 16), fill=eye_color)  # Ojo izquierdo
        d.ellipse((18, 12, 22, 16), fill=eye_color)  # Ojo derecho
        d.arc((12, 18, 20, 24), 0, 180, fill=eye_color)  # Sonrisa
    elif mood == "sad":
        d.ellipse((10, 12, 14, 16), fill=eye_color)
        d.ellipse((18, 12, 22, 16), fill=eye_color)
        d.arc((12, 20, 20, 26), 180, 360, fill=eye_color)  # Tristeza
    
    # Crear animación según mood
    if mood == "happy":
        return create_pulse_animation(base_sprite, 0.2, frames)
    elif mood == "sad":
        return create_floating_animation(base_sprite, 1, frames)
    else:  # dying
        return create_sparkle_animation(base_sprite, 3, frames)

def create_particle_system_animation(effect_type: str, frames: int = 30) -> SpriteAnimation:
    """Sistema de partículas para efectos ambientales"""
    w, h = 64, 64
    animation_frames = []
    
    if effect_type == "magic_aura":
        for i in range(frames):
            frame_img = img_rgba(w, h)
            d = ImageDraw.Draw(frame_img)
            
            # Partículas orbitando
            center_x, center_y = w // 2, h // 2
            phase = (i / frames) * 2 * math.pi
            
            for j in range(6):
                angle = phase + (j * math.pi / 3)
                radius = 20 + 5 * math.sin(phase * 2)
                px = int(center_x + radius * math.cos(angle))
                py = int(center_y + radius * math.sin(angle))
                
                particle_color = FANTASY_PALETTE["glow_magic"]
                d.ellipse((px-2, py-2, px+2, py+2), fill=particle_color)
            
            animation_frames.append(AnimationFrame(frame_img, 100))
    
    elif effect_type == "healing_sparkles":
        for i in range(frames):
            frame_img = img_rgba(w, h)
            
            # Chispas ascendentes
            for j in range(8):
                spark_y = h - ((i + j * 4) % h)
                spark_x = w // 2 + int(8 * math.sin((i + j) * 0.5))
                
                if spark_y > 0:
                    d = ImageDraw.Draw(frame_img)
                    d.point((spark_x, spark_y), fill=FANTASY_PALETTE["crystal_green"])
                    d.point((spark_x-1, spark_y), fill=FANTASY_PALETTE["glow_cool"])
                    d.point((spark_x+1, spark_y), fill=FANTASY_PALETTE["glow_cool"])
            
            animation_frames.append(AnimationFrame(frame_img, 80))
    
    return SpriteAnimation(effect_type, animation_frames)

# ---------- Generadores de Fondos Mágicos ----------

def create_magical_grass_background(w: int = 512, h: int = 512, seed: int = 1) -> Image.Image:
    """Genera un fondo de césped mágico con variaciones y efectos"""
    rng = rng_stream(seed, "magical_grass")
    grass_img = img_rgba(w, h)
    pixels = grass_img.load()
    
    # Colores base del césped
    grass_colors = [
        FANTASY_PALETTE["grass_magical"],
        FANTASY_PALETTE["grass_bright"],
        FANTASY_PALETTE["grass_deep"],
        FANTASY_PALETTE["grass_glow"],
        FANTASY_PALETTE["leaf_fairy"]
    ]
    
    # Generar textura base de césped
    for y in range(h):
        for x in range(w):
            # Variación orgánica
            noise_val = (rng.random() * 0.3 + 
                        0.3 * math.sin(x * 0.1) * math.cos(y * 0.1) +
                        0.2 * math.sin(x * 0.05 + y * 0.05))
            
            # Seleccionar color base según noise
            if noise_val > 0.6:
                base_color = grass_colors[0]  # Más brillante
            elif noise_val > 0.3:
                base_color = grass_colors[1]  # Normal
            elif noise_val > 0.0:
                base_color = grass_colors[2]  # Más oscuro
            elif noise_val > -0.3:
                base_color = grass_colors[3]  # Resplandor
            else:
                base_color = grass_colors[4]  # Hada
            
            # Añadir variación de color
            variation = int(rng.uniform(-20, 20))
            r = max(0, min(255, base_color[0] + variation))
            g = max(0, min(255, base_color[1] + variation))
            b = max(0, min(255, base_color[2] + variation))
            
            pixels[x, y] = (r, g, b, 255)
    
    # Añadir detalles mágicos
    d = ImageDraw.Draw(grass_img)
    
    # Flores pequeñas esparcidas
    for _ in range(w * h // 2000):  # Densidad de flores
        fx = rng.randint(0, w-1)
        fy = rng.randint(0, h-1)
        flower_color = rng.choice([
            FANTASY_PALETTE["flower_mystical"],
            FANTASY_PALETTE["crystal_pink"],
            FANTASY_PALETTE["crystal_white"]
        ])
        
        # Flor pequeña (2-3 pixels)
        d.ellipse((fx-1, fy-1, fx+1, fy+1), fill=flower_color)
        if rng.random() > 0.7:  # Algunas flores más grandes
            d.ellipse((fx-2, fy-2, fx+2, fy+2), fill=flower_color)
    
    # Líneas de viento (ondas sutiles)
    for _ in range(20):
        start_x = rng.randint(0, w)
        start_y = rng.randint(0, h)
        
        for step in range(30):
            wind_x = start_x + step * 3
            wind_y = start_y + int(5 * math.sin(step * 0.3))
            
            if 0 <= wind_x < w and 0 <= wind_y < h:
                current_pixel = pixels[wind_x, wind_y]
                # Iluminar ligeramente
                new_r = min(255, current_pixel[0] + 10)
                new_g = min(255, current_pixel[1] + 15)
                new_b = min(255, current_pixel[2] + 5)
                pixels[wind_x, wind_y] = (new_r, new_g, new_b, 255)
    
    return grass_img

def create_animated_grass_background(w: int = 512, h: int = 512, frames: int = 24, seed: int = 1) -> SpriteAnimation:
    """Crea un fondo de césped animado con viento y brillos"""
    animation_frames = []
    
    # Generar base del césped
    base_grass = create_magical_grass_background(w, h, seed)
    
    for frame in range(frames):
        frame_img = base_grass.copy()
        phase = (frame / frames) * 2 * math.pi
        rng = rng_stream(seed, "grass_anim", frame)
        
        # Ondas de viento sobre el césped
        pixels = frame_img.load()
        
        # Efecto de ondas
        wind_strength = 0.3 + 0.2 * math.sin(phase)
        for y in range(0, h, 4):  # Cada 4 líneas
            for x in range(w):
                wave_offset = int(wind_strength * math.sin(x * 0.05 + phase))
                source_y = max(0, min(h-1, y + wave_offset))
                
                if 0 <= x < w and 0 <= source_y < h:
                    source_pixel = base_grass.load()[x, source_y]
                    # Aplicar brillo sutil
                    bright_r = min(255, source_pixel[0] + int(5 * wind_strength))
                    bright_g = min(255, source_pixel[1] + int(8 * wind_strength))
                    bright_b = min(255, source_pixel[2] + int(3 * wind_strength))
                    pixels[x, y] = (bright_r, bright_g, bright_b, 255)
        
        # Partículas de polen/magia volando
        d = ImageDraw.Draw(frame_img)
        for _ in range(int(20 * wind_strength)):
            px = rng.randint(0, w-1)
            py = rng.randint(0, h-1)
            particle_color = rng.choice([
                FANTASY_PALETTE["glow_golden"],
                FANTASY_PALETTE["sparkle"],
                FANTASY_PALETTE["crystal_white"]
            ])
            
            # Partícula pequeña con trail
            d.point((px, py), fill=particle_color)
            d.point((px-1, py), fill=particle_color)
        
        # Resplandores ocasionales
        if frame % 6 == 0:  # Cada 6 frames, resplandor mágico
            glow_x = rng.randint(w//4, 3*w//4)
            glow_y = rng.randint(h//4, 3*h//4)
            
            # Crear resplandor circular sutil
            for radius in range(5, 25, 5):
                circle_color = (*FANTASY_PALETTE["glow_magic"][:3], 30)
                d.ellipse((glow_x-radius, glow_y-radius, 
                          glow_x+radius, glow_y+radius), 
                         fill=circle_color)
        
        animation_frames.append(AnimationFrame(frame_img, 120))
    
    return SpriteAnimation("magical_grass_background", animation_frames)

def create_seasonal_grass_variants(size: int = 256) -> Dict[str, Image.Image]:
    """Crea variantes estacionales del césped"""
    variants = {}
    
    seasons = {
        "spring": {
            "colors": [FANTASY_PALETTE["grass_spring"], FANTASY_PALETTE["leaf_fairy"]],
            "flowers": [FANTASY_PALETTE["crystal_pink"], FANTASY_PALETTE["crystal_white"]],
            "density": 0.8
        },
        "summer": {
            "colors": [FANTASY_PALETTE["grass_summer"], FANTASY_PALETTE["grass_bright"]],
            "flowers": [FANTASY_PALETTE["flower_mystical"], FANTASY_PALETTE["crystal_red"]],
            "density": 1.0
        },
        "autumn": {
            "colors": [FANTASY_PALETTE["grass_autumn"], FANTASY_PALETTE["wood_golden"]],
            "flowers": [FANTASY_PALETTE["metal_gold"], FANTASY_PALETTE["metal_copper"]],
            "density": 0.6
        },
        "winter": {
            "colors": [FANTASY_PALETTE["grass_winter"], FANTASY_PALETTE["crystal_white"]],
            "flowers": [FANTASY_PALETTE["ice"], FANTASY_PALETTE["crystal_blue"]],
            "density": 0.3
        }
    }
    
    for season, config in seasons.items():
        grass_img = img_rgba(size, size)
        pixels = grass_img.load()
        rng = rng_stream(2025, season)
        
        # Textura base estacional
        for y in range(size):
            for x in range(size):
                # Mezcla de colores estacionales
                if rng.random() > 0.5:
                    base_color = config["colors"][0]
                else:
                    base_color = config["colors"][1]
                
                # Variación natural
                variation = int(rng.uniform(-15, 15))
                r = max(0, min(255, base_color[0] + variation))
                g = max(0, min(255, base_color[1] + variation))
                b = max(0, min(255, base_color[2] + variation))
                
                pixels[x, y] = (r, g, b, 255)
        
        # Añadir elementos estacionales
        d = ImageDraw.Draw(grass_img)
        flower_count = int(size * size * config["density"] / 1000)
        
        for _ in range(flower_count):
            fx = rng.randint(0, size-1)
            fy = rng.randint(0, size-1)
            flower_color = rng.choice(config["flowers"])
            
            if season == "winter":
                # Copos de nieve/cristales
                d.line((fx-2, fy, fx+2, fy), fill=flower_color, width=1)
                d.line((fx, fy-2, fx, fy+2), fill=flower_color, width=1)
            elif season == "autumn":
                # Hojas caídas
                d.ellipse((fx-1, fy-2, fx+1, fy), fill=flower_color)
            else:
                # Flores normales
                d.ellipse((fx-1, fy-1, fx+1, fy+1), fill=flower_color)
        
        variants[season] = grass_img
    
    return variants

# ---------- Efectos de Partículas Avanzados ----------

def create_magic_portal_animation(frames: int = 40) -> SpriteAnimation:
    """Portal mágico con partículas espirales"""
    w, h = 128, 128
    animation_frames = []
    
    for frame in range(frames):
        frame_img = img_rgba(w, h)
        d = ImageDraw.Draw(frame_img)
        
        center_x, center_y = w // 2, h // 2
        phase = (frame / frames) * 4 * math.pi
        
        # Anillo base del portal
        for radius in range(20, 50, 5):
            alpha = int(100 - (radius - 20) * 3)
            portal_color = (*FANTASY_PALETTE["crystal_purple"][:3], alpha)
            d.ellipse((center_x - radius, center_y - radius,
                      center_x + radius, center_y + radius),
                     outline=portal_color, width=2)
        
        # Partículas espirales
        for i in range(12):
            angle = phase + (i * math.pi / 6)
            spiral_radius = 30 + 10 * math.sin(phase + i)
            
            px = int(center_x + spiral_radius * math.cos(angle))
            py = int(center_y + spiral_radius * math.sin(angle))
            
            particle_color = FANTASY_PALETTE["sparkle"]
            if 0 <= px < w and 0 <= py < h:
                d.ellipse((px-2, py-2, px+2, py+2), fill=particle_color)
        
        # Centro brillante
        glow_size = int(8 + 4 * math.sin(phase * 2))
        d.ellipse((center_x - glow_size, center_y - glow_size,
                  center_x + glow_size, center_y + glow_size),
                 fill=FANTASY_PALETTE["glow_magic"])
        
        animation_frames.append(AnimationFrame(frame_img, 100))
    
    return SpriteAnimation("magic_portal", animation_frames)

def create_weather_effects(effect_type: str, frames: int = 30) -> SpriteAnimation:
    """Efectos meteorológicos mágicos"""
    w, h = 256, 256
    animation_frames = []
    
    for frame in range(frames):
        frame_img = img_rgba(w, h)
        d = ImageDraw.Draw(frame_img)
        rng = rng_stream(2025, effect_type, frame)
        
        if effect_type == "magic_rain":
            # Lluvia de cristales mágicos
            for _ in range(50):
                drop_x = rng.randint(0, w)
                drop_y = (frame * 8 + rng.randint(0, h)) % h
                
                drop_color = rng.choice([
                    FANTASY_PALETTE["crystal_blue"],
                    FANTASY_PALETTE["water_enchanted"],
                    FANTASY_PALETTE["glow_cool"]
                ])
                
                d.line((drop_x, drop_y, drop_x, drop_y + 8), fill=drop_color, width=1)
        
        elif effect_type == "magic_snow":
            # Nieve cristalina brillante
            for _ in range(30):
                flake_x = rng.randint(0, w)
                flake_y = (frame * 3 + rng.randint(0, h)) % h
                
                # Copo de nieve en forma de estrella
                d.line((flake_x-2, flake_y, flake_x+2, flake_y), 
                       fill=FANTASY_PALETTE["crystal_white"], width=1)
                d.line((flake_x, flake_y-2, flake_x, flake_y+2), 
                       fill=FANTASY_PALETTE["crystal_white"], width=1)
                d.line((flake_x-1, flake_y-1, flake_x+1, flake_y+1), 
                       fill=FANTASY_PALETTE["sparkle"], width=1)
                d.line((flake_x-1, flake_y+1, flake_x+1, flake_y-1), 
                       fill=FANTASY_PALETTE["sparkle"], width=1)
        
        animation_frames.append(AnimationFrame(frame_img, 150))
    
    return SpriteAnimation(f"weather_{effect_type}", animation_frames)

# ---------- Registry de Animaciones EXPANDIDO ----------

ANIMATED_SPRITES = {
    # Entidades animadas con estados mejorados
    "entidad_circulo_happy_anim": lambda: create_entity_idle_animation("circulo", "happy", 12),
    "entidad_circulo_sad_anim": lambda: create_entity_idle_animation("circulo", "sad", 16),
    "entidad_circulo_dying_anim": lambda: create_entity_idle_animation("circulo", "dying", 20),
    "entidad_square_happy_anim": lambda: create_entity_idle_animation("square", "happy", 12),
    "entidad_square_sad_anim": lambda: create_entity_idle_animation("square", "sad", 16),
    "entidad_square_dying_anim": lambda: create_entity_idle_animation("square", "dying", 20),
    
    # Efectos de partículas básicos
    "magic_aura_anim": lambda: create_particle_system_animation("magic_aura", 30),
    "healing_sparkles_anim": lambda: create_particle_system_animation("healing_sparkles", 24),
    
    # NUEVOS: Fondos de césped mágico
    "grass_background_static": lambda: SpriteAnimation("grass_static", [AnimationFrame(create_magical_grass_background(512, 512, 2025), 1000)]),
    "grass_background_animated": lambda: create_animated_grass_background(512, 512, 24, 2025),
    "grass_background_small": lambda: SpriteAnimation("grass_small", [AnimationFrame(create_magical_grass_background(256, 256, 2025), 1000)]),
    
    # NUEVOS: Variantes estacionales
    "grass_spring": lambda: SpriteAnimation("spring", [AnimationFrame(create_seasonal_grass_variants(256)["spring"], 1000)]),
    "grass_summer": lambda: SpriteAnimation("summer", [AnimationFrame(create_seasonal_grass_variants(256)["summer"], 1000)]),
    "grass_autumn": lambda: SpriteAnimation("autumn", [AnimationFrame(create_seasonal_grass_variants(256)["autumn"], 1000)]),
    "grass_winter": lambda: SpriteAnimation("winter", [AnimationFrame(create_seasonal_grass_variants(256)["winter"], 1000)]),
    
    # NUEVOS: Efectos mágicos avanzados
    "magic_portal_anim": lambda: create_magic_portal_animation(40),
    "magic_rain_anim": lambda: create_weather_effects("magic_rain", 30),
    "magic_snow_anim": lambda: create_weather_effects("magic_snow", 30),
    
    # NUEVOS: Efectos ambientales
    "ambient_sparkles": lambda: create_particle_system_animation("healing_sparkles", 60),  # Más largo
    "ambient_glow": lambda: create_particle_system_animation("magic_aura", 45),
}

# Para assets existentes, crear versiones animadas
def create_animated_versions():
    """Crea versiones animadas de sprites estáticos existentes"""
    animated_versions = {}
    
    # Sprites que deberían tener animación de flotación
    floating_sprites = ["lampara_cristal", "flor_cristal", "fuente_magica"]
    
    # Sprites que deberían tener animación de pulso
    pulse_sprites = ["banco_encantado", "cama_celestial"] 
    
    # Sprites que deberían tener animación de chispas
    sparkle_sprites = ["arbol_mistico"]
    
    for sprite_name in floating_sprites:
        animated_versions[f"{sprite_name}_floating"] = lambda name=sprite_name: create_floating_sprite_animation(name)
    
    for sprite_name in pulse_sprites:
        animated_versions[f"{sprite_name}_pulse"] = lambda name=sprite_name: create_pulse_sprite_animation(name)
    
    for sprite_name in sparkle_sprites:
        animated_versions[f"{sprite_name}_sparkle"] = lambda name=sprite_name: create_sparkle_sprite_animation(name)
    
    return animated_versions

def create_floating_sprite_animation(sprite_name: str) -> SpriteAnimation:
    """Crear animación flotante para sprite existente"""
    # Cargar sprite base (simulado)
    base_sprite = img_rgba(64, 64)  # Placeholder
    d = ImageDraw.Draw(base_sprite)
    d.rectangle((8, 8, 56, 56), fill=FANTASY_PALETTE["crystal_blue"])
    
    return create_floating_animation(base_sprite)

def create_pulse_sprite_animation(sprite_name: str) -> SpriteAnimation:
    """Crear animación de pulso para sprite existente"""
    base_sprite = img_rgba(64, 64)
    d = ImageDraw.Draw(base_sprite)
    d.ellipse((8, 8, 56, 56), fill=FANTASY_PALETTE["glow_magic"])
    
    return create_pulse_animation(base_sprite)

def create_sparkle_sprite_animation(sprite_name: str) -> SpriteAnimation:
    """Crear animación de chispas para sprite existente"""
    base_sprite = img_rgba(64, 96)
    d = ImageDraw.Draw(base_sprite)
    # Tronco
    d.rectangle((28, 60, 36, 88), fill=FANTASY_PALETTE["wood_enchanted"])
    # Copa
    d.ellipse((8, 8, 56, 56), fill=FANTASY_PALETTE["grass_magical"])
    
    return create_sparkle_animation(base_sprite)

# Agregar versiones animadas al registry
ANIMATED_SPRITES.update(create_animated_versions())

# ---------- CLI MEJORADO ----------

def cmd_animations(args):
    """Genera animaciones con metadatos JSON detallados"""
    outdir = args.outdir
    names = list(ANIMATED_SPRITES.keys()) if args.names == "all" else [n.strip() for n in args.names.split(",") if n.strip()]
    
    # Crear subdirectorios organizados
    ensure_dir(os.path.join(outdir, "entities"))
    ensure_dir(os.path.join(outdir, "effects"))
    ensure_dir(os.path.join(outdir, "backgrounds"))
    ensure_dir(os.path.join(outdir, "weather"))
    
    generated = []
    total_frames = 0
    
    print(f"🎭 Iniciando generación de {len(names)} animaciones...")
    
    for name in names:
        gen_func = ANIMATED_SPRITES.get(name)
        if not gen_func:
            print(f"⚠️  Animación '{name}' no encontrada")
            continue
        
        try:
            animation = gen_func()
            
            # Determinar subcarpeta
            if "entidad_" in name:
                subfolder = "entities"
            elif "grass_" in name or "background" in name:
                subfolder = "backgrounds"
            elif "magic_rain" in name or "magic_snow" in name:
                subfolder = "weather"
            else:
                subfolder = "effects"
            
            sprite_path = os.path.join(outdir, subfolder, f"{name}.png")
            animation.save_as_spritesheet(sprite_path)
            
            generated.append(name)
            total_frames += len(animation.frames)
            
            print(f"✨ {subfolder}/{name}: {len(animation.frames)} frames, {animation.total_duration}ms")
            
        except Exception as e:
            print(f"❌ Error generando {name}: {e}")
    
    # Generar índice maestro
    master_index = {
        "generated_at": "2025-08-17",
        "total_animations": len(generated),
        "total_frames": total_frames,
        "categories": {
            "entities": [n for n in generated if "entidad_" in n],
            "backgrounds": [n for n in generated if "grass_" in n or "background" in n],
            "effects": [n for n in generated if "magic_" in n or "sparkle" in n or "aura" in n],
            "weather": [n for n in generated if "rain" in n or "snow" in n],
        },
        "usage_notes": {
            "backgrounds": "Use as tiled backgrounds or overlays",
            "entities": "Character sprites with emotion states",
            "effects": "Particle systems and magical effects",
            "weather": "Environmental overlay effects"
        }
    }
    
    with open(os.path.join(outdir, "animation_index.json"), "w") as f:
        json.dump(master_index, f, indent=2)
    
    print(f"\n� RESUMEN:")
    print(f"   Generadas: {len(generated)}/{len(names)} animaciones")
    print(f"   Frames totales: {total_frames}")
    print(f"   Categorías: {len([k for k, v in master_index['categories'].items() if v])}")
    print(f"   Índice: animation_index.json")

def cmd_grass_pack(args):
    """Genera un pack completo de céspedes mágicos"""
    outdir = args.outdir
    size = args.size if hasattr(args, 'size') else 256
    
    ensure_dir(os.path.join(outdir, "grass"))
    
    print(f"🌱 Generando pack de césped mágico ({size}x{size})...")
    
    # Césped base estático
    base_grass = create_magical_grass_background(size, size, 2025)
    base_path = os.path.join(outdir, "grass", "magical_grass_base.png")
    base_grass.save(base_path, "PNG")
    print(f"✅ magical_grass_base.png")
    
    # Variantes estacionales
    variants = create_seasonal_grass_variants(size)
    for season, img in variants.items():
        variant_path = os.path.join(outdir, "grass", f"magical_grass_{season}.png")
        img.save(variant_path, "PNG")
        print(f"✅ magical_grass_{season}.png")
    
    # Césped animado (versión pequeña para ejemplo)
    if size <= 256:  # Solo para tamaños pequeños
        animated_grass = create_animated_grass_background(size, size, 12, 2025)
        anim_path = os.path.join(outdir, "grass", "magical_grass_animated.png")
        animated_grass.save_as_spritesheet(anim_path)
        print(f"✅ magical_grass_animated.png + .json")
    
    # Metadatos del pack
    grass_metadata = {
        "pack_name": "Magical Grass Collection",
        "version": "3.0",
        "size": f"{size}x{size}",
        "variants": list(variants.keys()) + ["base"],
        "animated": size <= 256,
        "usage": {
            "base": "General purpose magical grass",
            "spring": "Bright, vibrant grass with flowers",
            "summer": "Rich green grass with mystical flowers", 
            "autumn": "Golden-brown grass with falling leaves",
            "winter": "Pale grass with ice crystals",
            "animated": "Wind-blown grass with particle effects"
        },
        "color_palette": {k: v for k, v in FANTASY_PALETTE.items() if "grass" in k},
        "technical_specs": {
            "format": "PNG with alpha",
            "bit_depth": 32,
            "compression": "lossless",
            "tiling": "seamless"
        }
    }
    
    with open(os.path.join(outdir, "grass", "grass_pack_info.json"), "w") as f:
        json.dump(grass_metadata, f, indent=2)
    
    print(f"\n🌟 Pack de césped completado:")
    print(f"   Variantes: {len(variants) + 1}")
    print(f"   Tamaño: {size}x{size}")
    print(f"   Animado: {'Sí' if size <= 256 else 'No (tamaño muy grande)'}")

def list_animations(args):
    """Lista todas las animaciones disponibles con categorías"""
    print("🎭 SISTEMA DE ANIMACIONES v3.0")
    print("=" * 50)
    
    categories = {
        "🧙 Entidades": [k for k in ANIMATED_SPRITES.keys() if "entidad_" in k],
        "🌱 Fondos/Césped": [k for k in ANIMATED_SPRITES.keys() if "grass_" in k or "background" in k],
        "✨ Efectos Mágicos": [k for k in ANIMATED_SPRITES.keys() if "magic_" in k or "sparkle" in k or "aura" in k],
        "🌦️ Clima": [k for k in ANIMATED_SPRITES.keys() if "rain" in k or "snow" in k],
        "🌟 Ambientales": [k for k in ANIMATED_SPRITES.keys() if "ambient_" in k],
    }
    
    for category, items in categories.items():
        if items:
            print(f"\n{category}:")
            for name in sorted(items):
                print(f"    • {name}")
    
    print(f"\n📊 Total: {len(ANIMATED_SPRITES)} animaciones disponibles")
    print(f"💡 Uso: python {os.path.basename(__file__)} animations <nombre> <directorio>")
    print(f"💡 Césped: python {os.path.basename(__file__)} grass-pack <directorio> [--size 256]")

def build_parser():
    p = argparse.ArgumentParser(
        description="🎭 Animation System v3.0 - Magical Enhanced",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  %(prog)s animations all ./output                    # Generar todas las animaciones
  %(prog)s animations entidad_circulo_happy_anim ./   # Generar una animación específica
  %(prog)s grass-pack ./backgrounds --size 512        # Pack completo de césped
  %(prog)s list                                       # Ver todas las animaciones
        """
    )
    p.add_argument("--version", action="version", version="Animation System v3.0 - Magical Enhanced")
    
    sub = p.add_subparsers(dest="cmd", required=True)

    # Animaciones
    a = sub.add_parser("animations", help="Generar spritesheets animados organizados")
    a.add_argument("names", help="'all' o lista separada por comas de animaciones")
    a.add_argument("outdir", help="Directorio de salida")

    # Pack de césped
    g = sub.add_parser("grass-pack", help="Generar pack completo de césped mágico")
    g.add_argument("outdir", help="Directorio de salida")
    g.add_argument("--size", type=int, default=256, help="Tamaño del césped (default: 256)")

    # Listar
    l = sub.add_parser("list", help="Mostrar todas las animaciones disponibles")

    return p

def main():
    p = build_parser()
    args = p.parse_args()
    
    if args.cmd == "animations":
        cmd_animations(args)
    elif args.cmd == "grass-pack":
        cmd_grass_pack(args)
    elif args.cmd == "list":
        list_animations(args)

if __name__ == "__main__":
    main()
