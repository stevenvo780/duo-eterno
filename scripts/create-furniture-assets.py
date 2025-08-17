#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generador de Assets de Mobiliario y Elementos Decorativos para Dúo Eterno
Crea muebles, plantas, caminos y elementos arquitectónicos detallados
"""

import argparse
import sys
import random
import math
from PIL import Image, ImageDraw

# Paleta de colores para mobiliario
FURNITURE_COLORS = {
    # Maderas
    "wood_oak": "#8B4513",
    "wood_pine": "#DEB887", 
    "wood_mahogany": "#654321",
    "wood_cherry": "#A0522D",
    
    # Metales
    "metal_iron": "#696969",
    "metal_brass": "#B5A642",
    "metal_copper": "#B87333",
    
    # Telas y cojines
    "fabric_red": "#DC143C",
    "fabric_blue": "#4169E1", 
    "fabric_green": "#228B22",
    "fabric_purple": "#8B5A8C",
    "fabric_cream": "#F5F5DC",
    
    # Plantas
    "leaf_green": "#228B22",
    "leaf_dark": "#006400",
    "leaf_light": "#90EE90",
    "trunk_brown": "#8B4513",
    "flower_red": "#FF69B4",
    "flower_yellow": "#FFD700",
    "flower_purple": "#9370DB",
    
    # Caminos
    "stone_path": "#696969",
    "brick_path": "#B22222",
    "dirt_path": "#8B4513",
    "grass_edge": "#228B22",
}

def draw_bed(draw, width, height, bed_type="simple"):
    """Dibuja diferentes tipos de camas."""
    center_x, center_y = width // 2, height // 2
    
    if bed_type == "simple":
        # Cama simple con cabecera
        # Base de la cama
        draw.rectangle([4, center_y - 6, width - 4, center_y + 6], FURNITURE_COLORS["wood_oak"])
        # Cabecera
        draw.rectangle([4, center_y - 10, 8, center_y + 6], FURNITURE_COLORS["wood_oak"])
        # Colchón
        draw.rectangle([8, center_y - 4, width - 4, center_y + 4], FURNITURE_COLORS["fabric_cream"])
        # Almohada
        draw.ellipse([10, center_y - 6, 18, center_y - 2], FURNITURE_COLORS["fabric_blue"])
        
    elif bed_type == "double":
        # Cama doble más elaborada
        # Marco de madera
        draw.rectangle([2, center_y - 8, width - 2, center_y + 8], FURNITURE_COLORS["wood_cherry"])
        # Cabecera decorativa
        draw.rectangle([2, center_y - 12, 6, center_y + 8], FURNITURE_COLORS["wood_cherry"])
        for i in range(3):
            draw.rectangle([3, center_y - 10 + i * 4, 5, center_y - 8 + i * 4], FURNITURE_COLORS["wood_mahogany"])
        
        # Colchón
        draw.rectangle([6, center_y - 6, width - 2, center_y + 6], FURNITURE_COLORS["fabric_cream"])
        # Almohadas dobles
        draw.ellipse([8, center_y - 8, 16, center_y - 4], FURNITURE_COLORS["fabric_red"])
        draw.ellipse([18, center_y - 8, 26, center_y - 4], FURNITURE_COLORS["fabric_blue"])
        # Manta
        draw.rectangle([6, center_y - 2, width - 2, center_y + 4], FURNITURE_COLORS["fabric_purple"])

def draw_sofa(draw, width, height, sofa_type="modern"):
    """Dibuja diferentes tipos de sofás."""
    center_x, center_y = width // 2, height // 2
    
    if sofa_type == "modern":
        # Sofá moderno minimalista
        # Base
        draw.rectangle([4, center_y - 4, width - 4, center_y + 6], FURNITURE_COLORS["fabric_blue"])
        # Respaldo
        draw.rectangle([4, center_y - 8, width - 4, center_y - 2], FURNITURE_COLORS["fabric_blue"])
        # Brazos
        draw.rectangle([4, center_y - 8, 8, center_y + 6], FURNITURE_COLORS["fabric_blue"])
        draw.rectangle([width - 8, center_y - 8, width - 4, center_y + 6], FURNITURE_COLORS["fabric_blue"])
        # Cojines
        draw.rectangle([10, center_y - 6, 14, center_y - 2], FURNITURE_COLORS["fabric_cream"])
        draw.rectangle([16, center_y - 6, 20, center_y - 2], FURNITURE_COLORS["fabric_cream"])
        
    elif sofa_type == "classic":
        # Sofá clásico con detalles
        # Marco de madera
        draw.rectangle([2, center_y - 6, width - 2, center_y + 8], FURNITURE_COLORS["wood_mahogany"])
        # Tapizado
        draw.rectangle([4, center_y - 4, width - 4, center_y + 6], FURNITURE_COLORS["fabric_red"])
        # Respaldo acolchado
        draw.rectangle([4, center_y - 10, width - 4, center_y - 2], FURNITURE_COLORS["fabric_red"])
        # Brazos curvos
        draw.ellipse([2, center_y - 8, 10, center_y + 4], FURNITURE_COLORS["fabric_red"])
        draw.ellipse([width - 10, center_y - 8, width - 2, center_y + 4], FURNITURE_COLORS["fabric_red"])
        # Patas
        for x in [6, width - 6]:
            draw.rectangle([x, center_y + 6, x + 2, center_y + 10], FURNITURE_COLORS["wood_mahogany"])

def draw_plant(draw, width, height, plant_type="small"):
    """Dibuja diferentes tipos de plantas."""
    center_x, center_y = width // 2, height // 2
    
    if plant_type == "small":
        # Planta pequeña en maceta
        # Maceta
        draw.ellipse([center_x - 6, center_y + 2, center_x + 6, center_y + 8], FURNITURE_COLORS["trunk_brown"])
        # Tallo
        draw.rectangle([center_x - 1, center_y - 4, center_x + 1, center_y + 2], FURNITURE_COLORS["leaf_dark"])
        # Hojas
        draw.ellipse([center_x - 4, center_y - 6, center_x + 4, center_y - 2], FURNITURE_COLORS["leaf_green"])
        draw.ellipse([center_x - 3, center_y - 8, center_x + 3, center_y - 4], FURNITURE_COLORS["leaf_light"])
        
    elif plant_type == "tree":
        # Árbol más grande
        # Tronco
        draw.rectangle([center_x - 2, center_y - 4, center_x + 2, center_y + 8], FURNITURE_COLORS["trunk_brown"])
        # Copa del árbol - múltiples círculos
        for offset in [(-6, -12), (0, -14), (6, -12), (-4, -8), (4, -8)]:
            x_off, y_off = offset
            draw.ellipse([center_x + x_off - 3, center_y + y_off - 3, 
                         center_x + x_off + 3, center_y + y_off + 3], FURNITURE_COLORS["leaf_green"])
        # Algunas hojas más claras
        for offset in [(-2, -14), (2, -10)]:
            x_off, y_off = offset
            draw.ellipse([center_x + x_off - 2, center_y + y_off - 2,
                         center_x + x_off + 2, center_y + y_off + 2], FURNITURE_COLORS["leaf_light"])
            
    elif plant_type == "flower":
        # Planta con flores
        # Base/maceta
        draw.ellipse([center_x - 5, center_y + 4, center_x + 5, center_y + 8], FURNITURE_COLORS["trunk_brown"])
        # Tallos múltiples
        for x_off in [-2, 0, 2]:
            draw.rectangle([center_x + x_off - 1, center_y - 6, center_x + x_off + 1, center_y + 4], 
                         FURNITURE_COLORS["leaf_dark"])
        # Flores de colores
        colors = [FURNITURE_COLORS["flower_red"], FURNITURE_COLORS["flower_yellow"], FURNITURE_COLORS["flower_purple"]]
        for i, x_off in enumerate([-2, 0, 2]):
            draw.ellipse([center_x + x_off - 2, center_y - 8, center_x + x_off + 2, center_y - 4], 
                        colors[i % len(colors)])

def draw_path(draw, width, height, path_type="stone", direction="horizontal"):
    """Dibuja diferentes tipos de caminos."""
    
    if direction == "horizontal":
        path_y = height // 2 - 4
        path_height = 8
        
        if path_type == "stone":
            # Camino de piedras
            draw.rectangle([0, path_y, width, path_y + path_height], FURNITURE_COLORS["stone_path"])
            # Piedras individuales
            for x in range(0, width, 8):
                for y_off in [0, 4]:
                    if x + y_off * 2 < width:
                        stone_x = x + y_off
                        draw.rectangle([stone_x, path_y + y_off, stone_x + 6, path_y + y_off + 3], 
                                     FURNITURE_COLORS["metal_iron"])
            
        elif path_type == "brick":
            # Camino de ladrillos
            draw.rectangle([0, path_y, width, path_y + path_height], FURNITURE_COLORS["brick_path"])
            # Patrón de ladrillos
            for y in range(path_y, path_y + path_height, 2):
                offset = 0 if (y - path_y) % 4 == 0 else 3
                for x in range(offset, width, 6):
                    if x + 5 <= width:
                        draw.rectangle([x, y, x + 5, y + 1], FURNITURE_COLORS["trunk_brown"])
                        
        elif path_type == "dirt":
            # Camino de tierra
            draw.rectangle([0, path_y, width, path_y + path_height], FURNITURE_COLORS["dirt_path"])
            # Textura de tierra con pequeños puntos
            for i in range(width * path_height // 8):
                px = random.randint(0, width - 1)
                py = random.randint(path_y, path_y + path_height - 1)
                draw.rectangle([px, py, px + 1, py + 1], FURNITURE_COLORS["trunk_brown"])
    
    else:  # vertical
        path_x = width // 2 - 4
        path_width = 8
        
        if path_type == "stone":
            draw.rectangle([path_x, 0, path_x + path_width, height], FURNITURE_COLORS["stone_path"])
            # Piedras verticales
            for y in range(0, height, 8):
                for x_off in [0, 4]:
                    if y + x_off * 2 < height:
                        stone_y = y + x_off
                        draw.rectangle([path_x + x_off, stone_y, path_x + x_off + 3, stone_y + 6], 
                                     FURNITURE_COLORS["metal_iron"])

def draw_table(draw, width, height, table_type="coffee"):
    """Dibuja diferentes tipos de mesas."""
    center_x, center_y = width // 2, height // 2
    
    if table_type == "coffee":
        # Mesa de centro
        # Superficie
        draw.rectangle([center_x - 8, center_y - 3, center_x + 8, center_y + 3], FURNITURE_COLORS["wood_oak"])
        # Patas
        for x_off, y_off in [(-6, -1), (6, -1), (-6, 1), (6, 1)]:
            draw.rectangle([center_x + x_off, center_y + y_off, center_x + x_off + 2, center_y + y_off + 6], 
                         FURNITURE_COLORS["wood_mahogany"])
            
    elif table_type == "dining":
        # Mesa de comedor
        # Superficie más grande
        draw.rectangle([center_x - 10, center_y - 4, center_x + 10, center_y + 4], FURNITURE_COLORS["wood_cherry"])
        # Patas más robustas
        for x_off, y_off in [(-8, -2), (8, -2), (-8, 2), (8, 2)]:
            draw.rectangle([center_x + x_off, center_y + y_off, center_x + x_off + 2, center_y + y_off + 8], 
                         FURNITURE_COLORS["wood_cherry"])

def draw_decoration(draw, width, height, deco_type="lamp"):
    """Dibuja elementos decorativos."""
    center_x, center_y = width // 2, height // 2
    
    if deco_type == "lamp":
        # Lámpara de pie
        # Base
        draw.ellipse([center_x - 4, center_y + 6, center_x + 4, center_y + 10], FURNITURE_COLORS["metal_brass"])
        # Poste
        draw.rectangle([center_x - 1, center_y - 8, center_x + 1, center_y + 6], FURNITURE_COLORS["metal_brass"])
        # Pantalla
        draw.ellipse([center_x - 6, center_y - 12, center_x + 6, center_y - 4], FURNITURE_COLORS["fabric_cream"])
        
    elif deco_type == "clock":
        # Reloj de pared
        # Marco
        draw.ellipse([center_x - 6, center_y - 6, center_x + 6, center_y + 6], FURNITURE_COLORS["wood_mahogany"])
        # Cara del reloj
        draw.ellipse([center_x - 4, center_y - 4, center_x + 4, center_y + 4], FURNITURE_COLORS["fabric_cream"])
        # Manecillas
        draw.line([center_x, center_y, center_x - 2, center_y - 1], FURNITURE_COLORS["metal_iron"], width=1)
        draw.line([center_x, center_y, center_x + 1, center_y - 3], FURNITURE_COLORS["metal_iron"], width=1)
        
    elif deco_type == "bookshelf":
        # Estantería
        # Marco
        draw.rectangle([center_x - 8, center_y - 10, center_x + 8, center_y + 10], FURNITURE_COLORS["wood_oak"])
        # Estantes
        for y_off in [-6, -2, 2, 6]:
            draw.rectangle([center_x - 7, center_y + y_off, center_x + 7, center_y + y_off + 1], 
                         FURNITURE_COLORS["wood_mahogany"])
        # Libros
        colors = [FURNITURE_COLORS["fabric_red"], FURNITURE_COLORS["fabric_blue"], FURNITURE_COLORS["fabric_green"]]
        for shelf_y in [-6, -2, 2]:
            for i, x_off in enumerate(range(-6, 6, 2)):
                if x_off + 1 < 6:
                    draw.rectangle([center_x + x_off, center_y + shelf_y + 1, center_x + x_off + 1, center_y + shelf_y + 3], 
                                 colors[i % len(colors)])

def main():
    parser = argparse.ArgumentParser(description='Generador de assets de mobiliario para Dúo Eterno')
    parser.add_argument('asset_type', choices=['bed', 'sofa', 'plant', 'path', 'table', 'decoration'], 
                       help='Tipo de asset a generar')
    parser.add_argument('output_file', help='Archivo de salida (.png)')
    parser.add_argument('--size', type=int, default=32, help='Tamaño del asset (default: 32)')
    parser.add_argument('--variant', type=str, help='Variante del asset (e.g., simple, modern, small, etc.)')
    parser.add_argument('--direction', type=str, choices=['horizontal', 'vertical'], default='horizontal',
                       help='Dirección para caminos')
    
    args = parser.parse_args()
    
    width = height = args.size
    variant = args.variant or "default"
    
    # Crear imagen
    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    
    # Dibujar según el tipo
    if args.asset_type == 'bed':
        draw_bed(draw, width, height, variant)
    elif args.asset_type == 'sofa':
        draw_sofa(draw, width, height, variant)
    elif args.asset_type == 'plant':
        draw_plant(draw, width, height, variant)
    elif args.asset_type == 'path':
        draw_path(draw, width, height, variant, args.direction)
    elif args.asset_type == 'table':
        draw_table(draw, width, height, variant)
    elif args.asset_type == 'decoration':
        draw_decoration(draw, width, height, variant)
    
    # Guardar imagen
    image.save(args.output_file, "PNG")
    print(f"Asset de mobiliario generado: {args.output_file}")
    print(f"Tipo: {args.asset_type} ({variant}), Dimensiones: {width}x{height}")

if __name__ == "__main__":
    main()