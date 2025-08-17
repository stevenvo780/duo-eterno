#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generador Mejorado de Pixel Art para Dúo Eterno - Patrones Sofisticados
Crea baldosas, patrones de piedra y elementos decorativos avanzados
"""

import argparse
import sys
import random
import math
from PIL import Image, ImageDraw

# Paleta de colores mejorada
COLORS = {
    # Bases
    "stone_dark": "#4a4a4a",
    "stone_light": "#6a6a6a", 
    "stone_accent": "#8a8a8a",
    "mortar": "#3a3a3a",
    
    # Baldosas
    "tile_base": "#5a5a6a",
    "tile_highlight": "#7a7a8a",
    "tile_shadow": "#3a3a4a",
    "tile_grout": "#2a2a2a",
    
    # Madera
    "wood_base": "#8b4513",
    "wood_light": "#cd853f",
    "wood_dark": "#654321",
    "wood_grain": "#a0522d",
    
    # Césped/naturaleza
    "grass_base": "#228b22",
    "grass_light": "#32cd32",
    "grass_dark": "#006400",
    "dirt": "#8b4513",
    
    # Zonas específicas
    "kitchen_base": "#7ac75a",
    "kitchen_accent": "#f2d450",
    "bedroom_base": "#639bff", 
    "bedroom_accent": "#8a5fb8",
    "living_base": "#63bda4",
    "living_accent": "#45a09c",
}

def adjust_color_brightness(hex_color, factor):
    """Ajusta el brillo de un color hexadecimal."""
    if hex_color.startswith('#'):
        hex_color = hex_color[1:]
    
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16) 
    b = int(hex_color[4:6], 16)
    
    r = int(min(255, max(0, r + (255 - r) * factor)))
    g = int(min(255, max(0, g + (255 - g) * factor)))
    b = int(min(255, max(0, b + (255 - b) * factor)))
    
    return f"#{r:02x}{g:02x}{b:02x}"

def create_stone_pattern(draw, width, height, base_color, accent_color):
    """Crea un patrón de piedras naturales."""
    stone_size = 12
    
    for y in range(0, height, stone_size):
        for x in range(0, width, stone_size):
            # Variación en el tamaño de las piedras
            var_w = random.randint(-2, 3)
            var_h = random.randint(-2, 3)
            
            # Piedra principal
            stone_w = min(stone_size + var_w, width - x)
            stone_h = min(stone_size + var_h, height - y)
            
            # Color base con variación
            stone_color = base_color
            if random.random() > 0.7:
                stone_color = accent_color
            
            # Dibujar piedra con forma irregular
            points = []
            for i in range(6):
                angle = i * math.pi / 3
                radius = min(stone_w, stone_h) / 2 * (0.8 + random.random() * 0.4)
                px = x + stone_w/2 + radius * math.cos(angle)
                py = y + stone_h/2 + radius * math.sin(angle)
                points.append((int(px), int(py)))
            
            draw.polygon(points, stone_color)
            
            # Borde de mortero
            draw.polygon(points, outline=COLORS["mortar"], width=1)
            
            # Grietas y detalles
            if random.random() > 0.6:
                draw.line([x + 2, y + stone_h//2, x + stone_w - 2, y + stone_h//2], 
                         COLORS["stone_dark"], width=1)

def create_tile_pattern(draw, width, height, base_color, accent_color):
    """Crea un patrón de baldosas perfectas."""
    tile_size = 16
    
    for y in range(0, height, tile_size):
        for x in range(0, width, tile_size):
            # Baldosa base
            draw.rectangle([x, y, x + tile_size - 1, y + tile_size - 1], base_color)
            
            # Borde de lechada
            draw.rectangle([x, y, x + tile_size - 1, y + tile_size - 1], 
                          outline=COLORS["tile_grout"], width=2)
            
            # Highlights y sombras para profundidad
            # Highlight superior izquierdo
            draw.line([x + 2, y + 2, x + tile_size - 3, y + 2], accent_color)
            draw.line([x + 2, y + 2, x + 2, y + tile_size - 3], accent_color)
            
            # Sombra inferior derecho
            shadow_color = adjust_color_brightness(base_color, -0.3)
            draw.line([x + 3, y + tile_size - 3, x + tile_size - 2, y + tile_size - 3], shadow_color)
            draw.line([x + tile_size - 3, y + 3, x + tile_size - 3, y + tile_size - 3], shadow_color)
            
            # Patrón decorativo en el centro
            center_x = x + tile_size // 2
            center_y = y + tile_size // 2
            
            if (x // tile_size + y // tile_size) % 2 == 0:
                # Patrón de diamante
                diamond_size = 3
                draw.polygon([
                    (center_x, center_y - diamond_size),
                    (center_x + diamond_size, center_y),
                    (center_x, center_y + diamond_size),
                    (center_x - diamond_size, center_y)
                ], accent_color)

def create_wood_pattern(draw, width, height, base_color, accent_color):
    """Crea un patrón de madera con vetas."""
    plank_height = 8
    
    for y in range(0, height, plank_height):
        # Tablón completo
        plank_color = base_color
        if random.random() > 0.7:
            plank_color = accent_color
            
        draw.rectangle([0, y, width - 1, y + plank_height - 1], plank_color)
        
        # Líneas de separación entre tablones
        draw.line([0, y, width - 1, y], COLORS["wood_dark"], width=1)
        
        # Vetas de madera
        num_grains = random.randint(2, 4)
        for _ in range(num_grains):
            grain_y = y + random.randint(1, plank_height - 2)
            grain_start = random.randint(0, width // 3)
            grain_end = random.randint(2 * width // 3, width - 1)
            
            # Veta ondulada
            points = []
            for x in range(grain_start, grain_end, 4):
                wave_y = grain_y + int(2 * math.sin(x * 0.1))
                points.extend([x, wave_y])
            
            if len(points) >= 4:
                draw.line(points, COLORS["wood_grain"], width=1)

def create_grass_pattern(draw, width, height, base_color, accent_color):
    """Crea un patrón de césped natural."""
    # Base de tierra
    draw.rectangle([0, 0, width - 1, height - 1], COLORS["dirt"])
    
    # Patches de césped
    patch_size = 8
    for y in range(0, height, patch_size):
        for x in range(0, width, patch_size):
            if random.random() > 0.3:  # 70% de cobertura de césped
                # Patch de césped irregular
                for i in range(random.randint(5, 12)):
                    blade_x = x + random.randint(0, patch_size - 1)
                    blade_y = y + random.randint(0, patch_size - 1)
                    blade_height = random.randint(2, 4)
                    
                    grass_color = base_color
                    if random.random() > 0.8:
                        grass_color = accent_color
                    
                    # Brizna de césped
                    draw.line([blade_x, blade_y, blade_x, blade_y - blade_height], 
                             grass_color, width=1)

def draw_zone_background(draw, width, height, zone_type):
    """Dibuja el fondo específico según el tipo de zona."""
    if zone_type == "kitchen":
        create_tile_pattern(draw, width, height, COLORS["kitchen_base"], COLORS["kitchen_accent"])
    elif zone_type == "bedroom":
        create_wood_pattern(draw, width, height, COLORS["bedroom_base"], COLORS["bedroom_accent"])
    elif zone_type == "living":
        create_tile_pattern(draw, width, height, COLORS["living_base"], COLORS["living_accent"])
    elif zone_type == "garden":
        create_grass_pattern(draw, width, height, COLORS["grass_base"], COLORS["grass_light"])
    elif zone_type == "stone":
        create_stone_pattern(draw, width, height, COLORS["stone_light"], COLORS["stone_accent"])
    else:
        # Patrón por defecto - baldosas simples
        create_tile_pattern(draw, width, height, COLORS["tile_base"], COLORS["tile_highlight"])

def add_decorative_elements(draw, width, height, zone_type):
    """Añade elementos decorativos específicos de la zona."""
    center_x, center_y = width // 2, height // 2
    
    if zone_type == "kitchen":
        # Elementos de cocina
        # Fregadero
        draw.rectangle([center_x - 10, center_y - 5, center_x + 10, center_y + 5], COLORS["tile_highlight"])
        draw.ellipse([center_x - 8, center_y - 3, center_x + 8, center_y + 3], COLORS["stone_dark"])
        
        # Grifo
        draw.rectangle([center_x - 2, center_y - 8, center_x + 2, center_y - 5], COLORS["stone_accent"])
        
    elif zone_type == "bedroom":
        # Cama
        draw.rectangle([center_x - 12, center_y - 4, center_x + 12, center_y + 4], COLORS["wood_light"])
        # Almohada
        draw.ellipse([center_x - 8, center_y - 6, center_x - 2, center_y - 2], COLORS["bedroom_accent"])
        
    elif zone_type == "living":
        # Sofá
        draw.rectangle([center_x - 10, center_y - 3, center_x + 10, center_y + 3], COLORS["living_accent"])
        # Cojines
        draw.rectangle([center_x - 8, center_y - 5, center_x - 4, center_y - 3], COLORS["living_base"])
        draw.rectangle([center_x + 4, center_y - 5, center_x + 8, center_y - 3], COLORS["living_base"])

def main():
    parser = argparse.ArgumentParser(description='Generador mejorado de pixel art con patrones sofisticados')
    parser.add_argument('zone_type', choices=['kitchen', 'bedroom', 'living', 'garden', 'stone', 'tile'], 
                       help='Tipo de zona/patrón a generar')
    parser.add_argument('output_file', help='Archivo de salida (.png)')
    parser.add_argument('--size', type=int, default=64, help='Tamaño del asset (default: 64)')
    parser.add_argument('--pattern-only', action='store_true', help='Solo patrón de fondo, sin elementos decorativos')
    
    args = parser.parse_args()
    
    width = height = args.size
    
    # Crear imagen
    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    
    # Dibujar fondo con patrón
    draw_zone_background(draw, width, height, args.zone_type)
    
    # Añadir elementos decorativos si no es solo patrón
    if not args.pattern_only:
        add_decorative_elements(draw, width, height, args.zone_type)
    
    # Guardar imagen
    image.save(args.output_file, "PNG")
    print(f"Patrón sofisticado generado: {args.output_file}")
    print(f"Tipo: {args.zone_type}, Dimensiones: {width}x{height}")

if __name__ == "__main__":
    main()