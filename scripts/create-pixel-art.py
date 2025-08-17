#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Generador de Pixel Art Procedural v2 (Estilo Mejorado)
Dependencia: pip install Pillow
"""

import argparse
import sys
from PIL import Image, ImageDraw, ImageFont

# --- Paleta de Colores Mejorada (Inspirada en Endesga 32) ---
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
    "food_zone":    "#f2d450",
    "play_zone":    "#e58b8b",
    "rest_zone":    "#639bff",
    "social_zone":  "#75d1d1",
    "progress_bar": "#63bda4",
    "progress_bar_bg":"#222034",
    "button":       "#3b7a8f",
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

    # Expresiones faciales mejoradas
    if args.mood and args.mood != 'dying':
        eye_y = height // 3
        eye_x1 = width // 3
        eye_x2 = width * 2 // 3
        eye_color = outline_color

        if args.mood == 'happy':
            # Ojos cerrados y felices
            draw.arc([eye_x1 - 1, eye_y - 2, eye_x1 + 3, eye_y + 2], 180, 360, fill=eye_color, width=2)
            draw.arc([eye_x2 - 1, eye_y - 2, eye_x2 + 3, eye_y + 2], 180, 360, fill=eye_color, width=2)
            # Sonrisa grande
            draw.arc([eye_x1, eye_y + 2, eye_x2, height * 2 // 3 + 1], 0, 180, fill=eye_color, width=2)
        elif args.mood == 'sad':
            # Ojos caídos
            draw.rectangle([eye_x1 - 1, eye_y, eye_x1 + 1, eye_y + 2], fill=eye_color)
            draw.rectangle([eye_x2 - 1, eye_y, eye_x2 + 1, eye_y + 2], fill=eye_color)
            # Boca triste
            draw.arc([eye_x1, eye_y + 5, eye_x2, height * 2 // 3 + 1], 180, 360, fill=eye_color, width=2)

def draw_zone(draw, width, height, args):
    """Dibuja una zona con un icono de dos tonos."""
    bg_color = get_color(args.color)
    icon_light = get_color(COLORS["white"])
    icon_dark = get_color(COLORS["outline"])

    # Fondo con gradiente sutil
    for i in range(height):
        ratio = i / height
        r = int(bg_color[0] * (1 - ratio * 0.2))
        g = int(bg_color[1] * (1 - ratio * 0.2))
        b = int(bg_color[2] * (1 - ratio * 0.2))
        draw.line([(0, i), (width, i)], fill=(r, g, b))

    draw.rectangle([(0, 0), (width - 1, height - 1)], outline=get_color(COLORS["outline"]), width=2)
    
    cx, cy = width // 2, height // 2
    if args.icon:
        # Sombra del icono
        s = 2 # shadow offset
        if args.icon == 'food': # Cuchara y tenedor
            draw.line([(cx-6+s, cy-8+s), (cx-6+s, cy+8+s)], fill=icon_dark, width=3)
            draw.line([(cx+2+s, cy-8+s), (cx+2+s, cy-2+s)], fill=icon_dark, width=3)
            draw.line([(cx+2+s, cy+2+s), (cx+6+s, cy-2+s)], fill=icon_dark, width=3)
        elif args.icon == 'play': # Pelota de playa
            draw.ellipse([(cx-10+s, cy-10+s), (cx+10+s, cy+10+s)], fill=icon_dark)
        elif args.icon == 'rest': # Luna y estrellas
            draw.arc([(cx-8+s, cy-10+s), (cx+10+s, cy+10+s)], 200, 340, fill=icon_dark, width=4)
        elif args.icon == 'social': # Corazón
            draw.polygon([(cx+s, cy+s+5), (cx-10+s, cy-5+s), (cx-5+s, cy-10+s), (cx+s, cy-5+s), (cx+5+s, cy-10+s), (cx+10+s, cy-5+s)], fill=icon_dark)

        # Icono principal
        if args.icon == 'food':
            draw.line([(cx-6, cy-8), (cx-6, cy+8)], fill=icon_light, width=3)
            draw.line([(cx+2, cy-8), (cx+2, cy-2)], fill=icon_light, width=3)
            draw.line([(cx+2, cy+2), (cx+6, cy-2)], fill=icon_light, width=3)
        elif args.icon == 'play':
            draw.ellipse([(cx-10, cy-10), (cx+10, cy+10)], fill=icon_light)
            draw.arc([(cx-10, cy-10), (cx+10, cy+10)], 0, 180, fill=get_color(COLORS["play_zone"]), width=4)
        elif args.icon == 'rest':
            draw.arc([(cx-8, cy-10), (cx+10, cy+10)], 200, 340, fill=icon_light, width=4)
            draw.point((cx+5, cy+5), fill=icon_light)
            draw.point((cx, cy-5), fill=icon_light)
        elif args.icon == 'social':
            draw.polygon([(cx, cy+5), (cx-10, cy-5), (cx-5, cy-10), (cx, cy-5), (cx+5, cy-10), (cx+10, cy-5)], fill=icon_light)

def draw_obstacle(draw, width, height, args):
    """Dibuja un obstáculo con estilo."""
    outline_color = get_color(COLORS["outline"])
    if args.obstacle_type == 'tree':
        trunk_color = get_color(COLORS["tree_trunk"])
        leaves_color = get_color(COLORS["tree_leaves"])
        # Tronco
        draw.rectangle([(width*0.4, height*0.6), (width*0.6, height)], fill=trunk_color, outline=outline_color)
        # Follaje
        draw.ellipse([(width*0.1, height*0.1), (width*0.9, height*0.7)], fill=leaves_color, outline=outline_color)
    elif args.obstacle_type == 'rock':
        rock_color = get_color(COLORS["rock_base"])
        rock_light = get_color(COLORS["rock_light"])
        points = [(width*0.2, height*0.8), (width*0.3, height*0.4), (width*0.6, height*0.3), (width*0.8, height*0.5), (width*0.7, height*0.9)]
        draw.polygon(points, fill=rock_color, outline=outline_color)
        # Brillo
        draw.line([(width*0.4, height*0.4), (width*0.6, height*0.4)], fill=rock_light, width=2)

def draw_ui(draw, width, height, args):
    """Dibuja UI con estilo."""
    if args.element == 'progress_bar':
        bg_color = get_color(COLORS["progress_bar_bg"])
        fill_color = get_color(args.color)
        outline_color = get_color(COLORS["outline"])
        fill_ratio = float(args.fill)

        draw.rectangle([(0, 0), (width - 1, height - 1)], fill=bg_color, outline=outline_color, width=1)
        if fill_ratio > 0:
            fill_width = (width - 4) * fill_ratio
            draw.rectangle([(2, 2), (2 + fill_width, height - 3)], fill=fill_color)
            # Brillo
            draw.line([(2, 3), (1 + fill_width, 3)], fill=get_color(COLORS["white"]), width=1)

    elif args.element == 'button':
        # Similar a shaded square
        box = [(0,0), (width-1, height-1)]
        draw_shaded_square(draw, box, get_color(COLORS["button"]), get_color(COLORS["player_1_light"]), get_color(COLORS["outline"]))

    elif args.element == 'bg':
        draw.rectangle([(0,0), (width, height)], fill=get_color(COLORS["bg_dark"]))
        if args.pattern == 'dots':
            for y in range(0, height, 16):
                for x in range(0, width, 16):
                    draw.ellipse([(x+4, y+4), (x+6, y+6)], fill=get_color(COLORS["bg_light"]))
        elif args.pattern == 'hearts':
            try:
                font = ImageFont.truetype("arial", 24)
            except IOError:
                font = ImageFont.load_default()
            for y in range(0, height, 48):
                for x in range(0, width, 48):
                    draw.text((x + 8, y + 4), "♥", font=font, fill=get_color(COLORS["sad_base"]))

def main():
    # El parser de argumentos no cambia, solo la lógica de dibujo
    parser = argparse.ArgumentParser(description="Generador de Pixel Art para Duo Eterno.")
    parser.add_argument("asset_type", choices=['entidad', 'zona', 'obstaculo', 'ui', 'bg'], help="Tipo de asset a generar.")
    parser.add_argument("output_file", help="Ruta del archivo de salida PNG.")
    parser.add_argument("--size", default="32x32", help="Tamaño del asset en píxeles (ej. '64x64').")
    parser.add_argument("--shape", choices=['circle', 'square'], default='circle', help="Forma de la entidad.")
    parser.add_argument("--mood", choices=['happy', 'sad', 'dying', 'normal'], help="Expresión de la entidad.")
    parser.add_argument("--icon", choices=['food', 'play', 'rest', 'social'], help="Ícono para la zona.")
    parser.add_argument("--obstacle_type", choices=['tree', 'rock'], help="Tipo de obstáculo.")
    parser.add_argument("--element", choices=['progress_bar', 'button', 'bg'], help="Elemento de UI a generar.")
    parser.add_argument("--fill", default="1.0", help="Ratio de llenado para barras de progreso (0.0 a 1.0).")
    parser.add_argument("--pattern", choices=['dots', 'hearts'], help="Patrón para fondos.")
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
    elif args.asset_type == 'ui' or args.asset_type == 'bg':
        draw_ui(draw, width, height, args)

    image.save(args.output_file, "PNG")
    print(f"Asset mejorado generado y guardado en: {args.output_file}")

if __name__ == "__main__":
    main()