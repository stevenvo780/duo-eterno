#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Generador de Pixel Art Procedural v3 (Optimizado para Dúo Eterno)
Dependencia: pip install Pillow
"""

import argparse
import sys
import random
from PIL import Image, ImageDraw, ImageFont

# --- Paleta de Colores Optimizada para Dúo Eterno ---
COLORS = {
    "bg_dark":      "#222034",
    "bg_light":     "#45283c",
    "outline":      "#151729",
    "white":        "#ffffff",
    "player_1_base": "#3b7a8f",
    "player_1_light":"#63bda4",
    "player_2_base": "#df6f31",
    "player_2_light":"#f7a653",
    "happy_base":   "#7ac75a",
    "happy_light":  "#a4d489",
    "sad_base":     "#d85b5b",
    "sad_light":    "#e58b8b",
    "dead":         "#5a5a5a",
    "gold":         "#f2d450",
    "tree_trunk":   "#9e684c",
    "tree_leaves":  "#7ac75a",
    "rock_base":    "#8a8a8a",
    "rock_light":   "#b4b4b4",
    "progress_bar": "#63bda4",
    "progress_bar_bg":"#222034",
    "button":       "#3b7a8f",
    
    # Colores específicos por zona
    "cocina_base":    "#7ac75a",  # Verde
    "cocina_accent":  "#f2d450",  # Amarillo
    "descanso_base":  "#639bff",  # Azul
    "descanso_accent":"#8a5fb8",  # Púrpura
    "juegos_base":    "#f2d450",  # Amarillo
    "juegos_accent":  "#df6f31",  # Naranja
    "social_base":    "#63bda4",  # Turquesa
    "social_accent":  "#45a09c",  # Verde agua
    "trabajo_base":   "#8a5fb8",  # Púrpura
    "trabajo_accent": "#b4b4b4",  # Gris claro
    
    # Colores decorativos
    "flower_pink":    "#e58b8b",
    "flower_yellow":  "#f2d450",
    "flower_blue":    "#639bff",
    "wood_light":     "#d4a574",
    "wood_dark":      "#9e684c",
    "water_blue":     "#4a9eff",
    "water_light":    "#7bb8ff",
}

def get_color(color_string):
    """Resuelve un string de color a un valor RGB.
    Puede ser un nombre de la paleta (ej. 'gold') o un código hex (ej. '#f2d450')."""
    if color_string in COLORS:
        hex_color = COLORS[color_string]
    else:
        hex_color = color_string
    
    hex_color = hex_color.lstrip('#')
    try:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except (ValueError, TypeError):
        print(f"Error: Color '{color_string}' no es un nombre de paleta válido ni un código hexadecimal.")
        # Devuelve un color de error brillante para que sea obvio en la imagen
        return (255, 0, 255) # Magenta brillante

def draw_shaded_circle(draw, box, fill_base, fill_light, outline):
    """Dibuja un círculo con una sombra y un brillo para dar volumen."""
    # Sombra
    shadow_box = [(box[0][0] + 2, box[0][1] + 2), (box[1][0] + 2, box[1][1] + 2)]
    draw.ellipse(shadow_box, fill=outline)
    # Base
    draw.ellipse(box, fill=fill_base, outline=outline, width=2)
    # Brillo
    light_box = [(box[0][0] + 2, box[0][1] + 1), (box[1][0] - 4, box[1][1] - 4)]
    draw.ellipse(light_box, fill=fill_light)

def draw_shaded_square(draw, box, fill_base, fill_light, outline):
    """Dibuja un cuadrado con una sombra y un brillo."""
    shadow_box = [(box[0][0] + 2, box[0][1] + 2), (box[1][0] + 2, box[1][1] + 2)]
    draw.rectangle(shadow_box, fill=outline)
    draw.rectangle(box, fill=fill_base, outline=outline, width=2)
    # Brillo como un polígono
    light_points = [(box[0][0] + 2, box[0][1] + 2), (box[1][0] - 2, box[0][1] + 2), (box[0][0] + 2, box[1][1] - 2)]
    draw.polygon(light_points, fill=fill_light)


def draw_entity(draw, width, height, args):
    """Dibuja una entidad con estilo mejorado."""
    padding = 4
    box = [(padding, padding), (width - padding - 1, height - padding - 1)]
    outline_color = get_color(COLORS["outline"])
    
    base_color_hex = args.color
    # Determinar color de brillo
    light_color_hex = "#ffffff"
    if args.shape == 'circle':
        light_color_hex = COLORS["player_1_light"]
    elif args.shape == 'square':
        light_color_hex = COLORS["player_2_light"]
    
    if args.mood == 'happy':
        base_color_hex = COLORS["happy_base"]
        light_color_hex = COLORS["happy_light"]
    elif args.mood == 'sad':
        base_color_hex = COLORS["sad_base"]
        light_color_hex = COLORS["sad_light"]
    elif args.mood == 'dying':
        base_color_hex = COLORS["dead"]
        light_color_hex = "#888888"

    base_color = get_color(base_color_hex)
    light_color = get_color(light_color_hex)

    if args.shape == 'circle':
        draw_shaded_circle(draw, box, base_color, light_color, outline_color)
    else:
        draw_shaded_square(draw, box, base_color, light_color, outline_color)

    # Expresiones faciales mejoradas para TODOS los moods
    eye_y = height // 3
    eye_x1 = width // 3
    eye_x2 = width * 2 // 3
    eye_color = get_color(COLORS["white"])
    pupil_color = outline_color
    
    if args.mood == 'happy':
        # Ojos brillantes
        draw.ellipse([eye_x1 - 2, eye_y - 1, eye_x1 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        draw.ellipse([eye_x2 - 2, eye_y - 1, eye_x2 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        # Pupilas
        draw.rectangle([eye_x1, eye_y, eye_x1 + 1, eye_y + 1], fill=pupil_color)
        draw.rectangle([eye_x2, eye_y, eye_x2 + 1, eye_y + 1], fill=pupil_color)
        # Sonrisa grande
        draw.arc([eye_x1 - 2, eye_y + 4, eye_x2 + 2, height * 2 // 3 + 2], 0, 180, fill=pupil_color, width=2)
    elif args.mood == 'sad':
        # Ojos caídos
        draw.ellipse([eye_x1 - 2, eye_y - 1, eye_x1 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        draw.ellipse([eye_x2 - 2, eye_y - 1, eye_x2 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        # Pupilas caídas
        draw.rectangle([eye_x1, eye_y + 1, eye_x1 + 1, eye_y + 2], fill=pupil_color)
        draw.rectangle([eye_x2, eye_y + 1, eye_x2 + 1, eye_y + 2], fill=pupil_color)
        # Lágrimas
        draw.ellipse([eye_x1 - 1, eye_y + 3, eye_x1 + 1, eye_y + 6], fill=get_color(COLORS["player_1_light"]))
        # Boca triste
        draw.arc([eye_x1, eye_y + 8, eye_x2, height * 2 // 3 + 4], 180, 360, fill=pupil_color, width=2)
    elif args.mood == 'dying':
        # Ojos X
        draw.line([eye_x1 - 2, eye_y - 1, eye_x1 + 2, eye_y + 3], fill=pupil_color, width=2)
        draw.line([eye_x1 + 2, eye_y - 1, eye_x1 - 2, eye_y + 3], fill=pupil_color, width=2)
        draw.line([eye_x2 - 2, eye_y - 1, eye_x2 + 2, eye_y + 3], fill=pupil_color, width=2)
        draw.line([eye_x2 + 2, eye_y - 1, eye_x2 - 2, eye_y + 3], fill=pupil_color, width=2)
        # Boca ondulada
        draw.line([eye_x1, eye_y + 6, eye_x1 + 2, eye_y + 8], fill=pupil_color, width=2)
        draw.line([eye_x1 + 2, eye_y + 8, eye_x1 + 4, eye_y + 6], fill=pupil_color, width=2)
        draw.line([eye_x1 + 4, eye_y + 6, eye_x2, eye_y + 8], fill=pupil_color, width=2)
    else:  # normal/default
        # Ojos normales
        draw.ellipse([eye_x1 - 2, eye_y - 1, eye_x1 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        draw.ellipse([eye_x2 - 2, eye_y - 1, eye_x2 + 2, eye_y + 3], fill=eye_color, outline=pupil_color)
        # Pupilas centrales
        draw.rectangle([eye_x1, eye_y + 1, eye_x1 + 1, eye_y + 2], fill=pupil_color)
        draw.rectangle([eye_x2, eye_y + 1, eye_x2 + 1, eye_y + 2], fill=pupil_color)
        # Boca neutral
        draw.line([eye_x1 + 2, eye_y + 6, eye_x2 - 2, eye_y + 6], fill=pupil_color, width=2)

def draw_zone(draw, width, height, args):
    """Dibuja una zona con temática específica y tiles repetitivos."""
    zone_type = args.zone_type if hasattr(args, 'zone_type') else 'generic'
    
    # Colores específicos por zona
    if zone_type == 'cocina':
        bg_color = get_color(COLORS["cocina_base"])
        accent_color = get_color(COLORS["cocina_accent"])
    elif zone_type == 'descanso':
        bg_color = get_color(COLORS["descanso_base"])
        accent_color = get_color(COLORS["descanso_accent"])
    elif zone_type == 'juegos':
        bg_color = get_color(COLORS["juegos_base"])
        accent_color = get_color(COLORS["juegos_accent"])
    elif zone_type == 'social':
        bg_color = get_color(COLORS["social_base"])
        accent_color = get_color(COLORS["social_accent"])
    elif zone_type == 'trabajo':
        bg_color = get_color(COLORS["trabajo_base"])
        accent_color = get_color(COLORS["trabajo_accent"])
    else:
        bg_color = get_color(args.color)
        accent_color = get_color(COLORS["white"])

    # Patrón de tiles 64x64 que se repite
    tile_size = 64
    for y in range(0, height, tile_size):
        for x in range(0, width, tile_size):
            # Tile base con gradiente
            for i in range(min(tile_size, height - y)):
                ratio = i / tile_size
                r = int(bg_color[0] * (1 - ratio * 0.15))
                g = int(bg_color[1] * (1 - ratio * 0.15))
                b = int(bg_color[2] * (1 - ratio * 0.15))
                draw.line([(x, y + i), (min(x + tile_size, width), y + i)], fill=(r, g, b))
            
            # Borde del tile
            draw.rectangle([(x, y), (min(x + tile_size - 1, width - 1), min(y + tile_size - 1, height - 1))], 
                         outline=get_color(COLORS["outline"]), width=1)
            
            # Patrón decorativo en el centro del tile
            cx, cy = x + tile_size // 2, y + tile_size // 2
            if cx < width and cy < height:
                if zone_type == 'cocina':
                    # Patrón de cuadrados pequeños (como azulejos)
                    for dx in [-8, 0, 8]:
                        for dy in [-8, 0, 8]:
                            draw.rectangle([(cx + dx - 2, cy + dy - 2), (cx + dx + 2, cy + dy + 2)], 
                                         fill=accent_color, outline=get_color(COLORS["outline"]))
                elif zone_type == 'descanso':
                    # Estrellas pequeñas
                    draw.polygon([(cx, cy-6), (cx-2, cy-2), (cx-6, cy-2), (cx-3, cy+1), 
                                (cx-4, cy+6), (cx, cy+3), (cx+4, cy+6), (cx+3, cy+1), 
                                (cx+6, cy-2), (cx+2, cy-2)], fill=accent_color)

    # Icono principal en el centro si se especifica
    if args.icon:
        cx, cy = width // 2, height // 2
        icon_light = get_color(COLORS["white"])
        icon_dark = get_color(COLORS["outline"])
        
        # Sombra del icono
        s = 2 # shadow offset
        if args.icon == 'cocina':
            draw.line([(cx-6+s, cy-8+s), (cx-6+s, cy+8+s)], fill=icon_dark, width=3)
            draw.line([(cx+2+s, cy-8+s), (cx+2+s, cy-2+s)], fill=icon_dark, width=3)
            draw.line([(cx+2+s, cy+2+s), (cx+6+s, cy-2+s)], fill=icon_dark, width=3)
        elif args.icon == 'juegos':
            draw.ellipse([(cx-10+s, cy-10+s), (cx+10+s, cy+10+s)], fill=icon_dark)
        elif args.icon == 'descanso':
            draw.arc([(cx-8+s, cy-10+s), (cx+10+s, cy+10+s)], 200, 340, fill=icon_dark, width=4)
        elif args.icon == 'social':
            draw.polygon([(cx+s, cy+s+5), (cx-10+s, cy-5+s), (cx-5+s, cy-10+s), (cx+s, cy-5+s), (cx+5+s, cy-10+s), (cx+10+s, cy-5+s)], fill=icon_dark)

        # Icono principal
        if args.icon == 'cocina':
            draw.line([(cx-6, cy-8), (cx-6, cy+8)], fill=icon_light, width=3)
            draw.line([(cx+2, cy-8), (cx+2, cy-2)], fill=icon_light, width=3)
            draw.line([(cx+2, cy+2), (cx+6, cy-2)], fill=icon_light, width=3)
        elif args.icon == 'juegos':
            draw.ellipse([(cx-10, cy-10), (cx+10, cy+10)], fill=icon_light)
            draw.arc([(cx-10, cy-10), (cx+10, cy+10)], 0, 180, fill=accent_color, width=4)
        elif args.icon == 'descanso':
            draw.arc([(cx-8, cy-10), (cx+10, cy+10)], 200, 340, fill=icon_light, width=4)
            draw.point((cx+5, cy+5), fill=icon_light)
            draw.point((cx, cy-5), fill=icon_light)
        elif args.icon == 'social':
            draw.polygon([(cx, cy+5), (cx-10, cy-5), (cx-5, cy-10), (cx, cy-5), (cx+5, cy-10), (cx+10, cy-5)], fill=icon_light)

def draw_obstacle(draw, width, height, args):
    """Dibuja un obstáculo con dimensiones específicas."""
    outline_color = get_color(COLORS["outline"])
    if args.obstacle_type == 'tree':
        # Árboles optimizados para 25x60
        trunk_color = get_color(COLORS["tree_trunk"])
        leaves_color = get_color(COLORS["tree_leaves"])
        # Tronco más definido
        trunk_width = width // 4
        trunk_x = (width - trunk_width) // 2
        draw.rectangle([(trunk_x, height * 0.65), (trunk_x + trunk_width, height - 1)], 
                      fill=trunk_color, outline=outline_color, width=1)
        # Follaje en capas
        draw.ellipse([(width * 0.1, height * 0.1), (width * 0.9, height * 0.7)], 
                    fill=leaves_color, outline=outline_color, width=1)
        # Capa superior más pequeña
        draw.ellipse([(width * 0.25, height * 0.05), (width * 0.75, height * 0.5)], 
                    fill=get_color(COLORS["happy_light"]), outline=outline_color, width=1)
    elif args.obstacle_type == 'rock':
        # Rocas optimizadas para 30x40
        rock_color = get_color(COLORS["rock_base"])
        rock_light = get_color(COLORS["rock_light"])
        # Forma más realista de roca
        points = [(width*0.1, height*0.85), (width*0.25, height*0.2), (width*0.5, height*0.1), 
                 (width*0.75, height*0.25), (width*0.9, height*0.6), (width*0.6, height*0.9)]
        draw.polygon(points, fill=rock_color, outline=outline_color, width=1)
        # Múltiples brillos para más detalle
        draw.line([(width*0.3, height*0.3), (width*0.6, height*0.25)], fill=rock_light, width=2)
        draw.point((width*0.4, height*0.5), fill=rock_light)

def draw_decorative(draw, width, height, args):
    """Dibuja elementos decorativos."""
    outline_color = get_color(COLORS["outline"])
    
    if args.decorative_type == 'flower':
        # Flores 8x8
        flower_colors = [
            get_color(COLORS["flower_pink"]),
            get_color(COLORS["flower_yellow"]),
            get_color(COLORS["flower_blue"])
        ]
        flower_color = random.choice(flower_colors)
        center_color = get_color(COLORS["gold"])
        
        # Centro de la flor
        cx, cy = width // 2, height // 2
        draw.ellipse([(cx-1, cy-1), (cx+1, cy+1)], fill=center_color)
        
        # Pétalos
        petal_positions = [(cx, cy-3), (cx+2, cy-1), (cx, cy+3), (cx-2, cy-1)]
        for px, py in petal_positions:
            draw.ellipse([(px-1, py-1), (px+1, py+1)], fill=flower_color, outline=outline_color)
    
    elif args.decorative_type == 'banco':
        # Bancos 24x12
        wood_color = get_color(COLORS["wood_light"])
        wood_dark = get_color(COLORS["wood_dark"])
        
        # Superficie del banco
        draw.rectangle([(2, height*0.3), (width-2, height*0.6)], fill=wood_color, outline=outline_color)
        # Patas
        draw.rectangle([(4, height*0.6), (8, height-2)], fill=wood_dark, outline=outline_color)
        draw.rectangle([(width-8, height*0.6), (width-4, height-2)], fill=wood_dark, outline=outline_color)
    
    elif args.decorative_type == 'lampara':
        # Lámparas 16x24
        post_color = get_color(COLORS["wood_dark"])
        light_color = get_color(COLORS["gold"])
        
        # Poste
        draw.rectangle([(width//2-1, height*0.3), (width//2+1, height-1)], 
                      fill=post_color, outline=outline_color)
        # Lámpara
        draw.ellipse([(width*0.2, height*0.1), (width*0.8, height*0.4)], 
                    fill=light_color, outline=outline_color)
        # Brillo interno
        draw.ellipse([(width*0.3, height*0.15), (width*0.7, height*0.3)], 
                    fill=get_color(COLORS["white"]))
    
    elif args.decorative_type == 'fuente':
        # Fuentes de agua 32x32
        water_color = get_color(COLORS["water_blue"])
        water_light = get_color(COLORS["water_light"])
        stone_color = get_color(COLORS["rock_base"])
        
        # Base de piedra
        draw.ellipse([(2, height*0.4), (width-2, height-2)], fill=stone_color, outline=outline_color)
        # Agua
        draw.ellipse([(4, height*0.5), (width-4, height-4)], fill=water_color)
        # Efectos de agua
        for i in range(3):
            x = width//2 + random.randint(-6, 6)
            y = height//2 + random.randint(-4, 4)
            draw.point((x, y), fill=water_light)

def draw_ui(draw, width, height, args):
    """Dibuja elementos de UI con dimensiones específicas."""
    if args.element == 'barra_estadistica':
        # Barras de estadística optimizadas para 100x16
        bg_color = get_color(COLORS["progress_bar_bg"])
        fill_color = get_color(args.color)
        outline_color = get_color(COLORS["outline"])
        fill_ratio = float(args.fill) if hasattr(args, 'fill') else 1.0

        # Fondo con bordes redondeados simulados
        draw.rectangle([(0, 0), (width - 1, height - 1)], fill=bg_color, outline=outline_color, width=1)
        
        if fill_ratio > 0:
            fill_width = int((width - 4) * fill_ratio)
            draw.rectangle([(2, 2), (2 + fill_width, height - 3)], fill=fill_color)
            # Brillo superior
            draw.line([(2, 3), (1 + fill_width, 3)], fill=get_color(COLORS["white"]), width=1)
            # Gradiente sutil
            for i in range(2, height-2):
                alpha = 1 - (i-2) / (height-4) * 0.3
                r = int(fill_color[0] * alpha)
                g = int(fill_color[1] * alpha)
                b = int(fill_color[2] * alpha)
                draw.line([(2, i), (2 + fill_width, i)], fill=(r, g, b))

    elif args.element == 'dialogo_overlay':
        # Diálogo overlay optimizado para 320x120
        bg_color = get_color(COLORS["bg_light"])
        border_color = get_color(COLORS["outline"])
        text_color = get_color(COLORS["white"])
        
        # Fondo del diálogo con sombra
        shadow_offset = 4
        draw.rectangle([(shadow_offset, shadow_offset), (width, height)], fill=(0, 0, 0, 128))
        draw.rectangle([(0, 0), (width - shadow_offset, height - shadow_offset)], 
                      fill=bg_color, outline=border_color, width=2)
        
        # Decoración de esquinas
        corner_size = 8
        for corner in [(corner_size, corner_size), (width-shadow_offset-corner_size, corner_size), 
                      (corner_size, height-shadow_offset-corner_size), 
                      (width-shadow_offset-corner_size, height-shadow_offset-corner_size)]:
            draw.rectangle([(corner[0]-2, corner[1]-2), (corner[0]+2, corner[1]+2)], 
                          fill=get_color(COLORS["gold"]))

    elif args.element == 'button':
        # Botón con diseño mejorado
        box = [(0,0), (width-1, height-1)]
        draw_shaded_square(draw, box, get_color(COLORS["button"]), 
                         get_color(COLORS["player_1_light"]), get_color(COLORS["outline"]))

    elif args.element == 'canvas_base':
        # Canvas base optimizado para 1000x600
        base_color = get_color(COLORS["bg_dark"])
        pattern_color = get_color(COLORS["bg_light"])
        
        # Fondo base
        draw.rectangle([(0, 0), (width, height)], fill=base_color)
        
        # Patrón sutil de puntos
        if args.pattern == 'subtle_dots' or not hasattr(args, 'pattern'):
            dot_spacing = 32
            dot_size = 2
            for y in range(dot_spacing//2, height, dot_spacing):
                for x in range(dot_spacing//2, width, dot_spacing):
                    # Variación aleatoria sutil en posición
                    offset_x = random.randint(-2, 2)
                    offset_y = random.randint(-2, 2)
                    draw.ellipse([(x + offset_x - dot_size//2, y + offset_y - dot_size//2), 
                                (x + offset_x + dot_size//2, y + offset_y + dot_size//2)], 
                               fill=pattern_color)
        
        elif args.pattern == 'grid':
            # Patrón de rejilla sutil
            grid_spacing = 64
            for y in range(0, height, grid_spacing):
                draw.line([(0, y), (width, y)], fill=pattern_color, width=1)
            for x in range(0, width, grid_spacing):
                draw.line([(x, 0), (x, height)], fill=pattern_color, width=1)

def main():
    parser = argparse.ArgumentParser(description="Generador de Pixel Art Optimizado para Dúo Eterno.")
    parser.add_argument("asset_type", choices=['entidad', 'zona', 'obstaculo', 'ui', 'decorativo'], 
                       help="Tipo de asset a generar.")
    parser.add_argument("output_file", help="Ruta del archivo de salida PNG.")
    parser.add_argument("--size", default="32x32", help="Tamaño del asset en píxeles (ej. '64x64').")
    
    # Argumentos para entidades
    parser.add_argument("--shape", choices=['circle', 'square'], default='circle', help="Forma de la entidad.")
    parser.add_argument("--mood", choices=['happy', 'sad', 'dying', 'normal'], help="Expresión de la entidad.")
    
    # Argumentos para zonas
    parser.add_argument("--zone_type", choices=['cocina', 'descanso', 'juegos', 'social', 'trabajo'], 
                       help="Tipo específico de zona.")
    parser.add_argument("--icon", choices=['cocina', 'juegos', 'descanso', 'social', 'trabajo'], help="Ícono para la zona.")
    
    # Argumentos para obstáculos
    parser.add_argument("--obstacle_type", choices=['tree', 'rock'], help="Tipo de obstáculo.")
    
    # Argumentos para elementos decorativos
    parser.add_argument("--decorative_type", choices=['flower', 'banco', 'lampara', 'fuente'], 
                       help="Tipo de elemento decorativo.")
    
    # Argumentos para UI
    parser.add_argument("--element", choices=['barra_estadistica', 'dialogo_overlay', 'button', 'canvas_base'], 
                       help="Elemento de UI a generar.")
    parser.add_argument("--fill", default="1.0", help="Ratio de llenado para barras de progreso (0.0 a 1.0).")
    parser.add_argument("--pattern", choices=['subtle_dots', 'grid', 'dots', 'hearts'], help="Patrón para fondos.")
    parser.add_argument("--color", default="#888888", help="Color principal en formato hexadecimal.")
    
    args = parser.parse_args()

    try:
        width, height = map(int, args.size.split('x'))
    except ValueError:
        print("Error: El formato de --size debe ser 'anchoxalto', ej. '32x32'.")
        sys.exit(1)

    image = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    if args.asset_type == 'entidad':
        draw_entity(draw, width, height, args)
    elif args.asset_type == 'zona':
        draw_zone(draw, width, height, args)
    elif args.asset_type == 'obstaculo':
        draw_obstacle(draw, width, height, args)
    elif args.asset_type == 'decorativo':
        draw_decorative(draw, width, height, args)
    elif args.asset_type == 'ui':
        draw_ui(draw, width, height, args)

    image.save(args.output_file, "PNG")
    print(f"Asset optimizado para Dúo Eterno generado: {args.output_file}")
    print(f"Dimensiones: {width}x{height}")
    if hasattr(args, 'zone_type') and args.zone_type:
        print(f"Tipo de zona: {args.zone_type}")
    if hasattr(args, 'decorative_type') and args.decorative_type:
        print(f"Elemento decorativo: {args.decorative_type}")

if __name__ == "__main__":
    main()