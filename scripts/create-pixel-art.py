#!/usr/bin/env python3
"""
Script de generación de sprites pixel art para Duo Eterno
Genera sprites proceduralmente usando la paleta DB32
"""

import os
import sys
from PIL import Image, ImageDraw
import argparse

# Paleta DB32 (DawnBringer 32 colors) - colores principales
DB32_PALETTE = [
    (20, 12, 28),      # 0 - Negro profundo
    (68, 36, 52),      # 1 - Marrón oscuro
    (48, 52, 109),     # 2 - Azul oscuro
    (78, 74, 78),      # 3 - Gris oscuro
    (133, 76, 48),     # 4 - Marrón medio
    (52, 101, 36),     # 5 - Verde oscuro
    (208, 70, 72),     # 6 - Rojo
    (117, 113, 97),    # 7 - Gris medio
    (89, 125, 206),    # 8 - Azul claro
    (210, 125, 44),    # 9 - Naranja
    (133, 149, 161),   # 10 - Gris claro
    (109, 170, 44),    # 11 - Verde claro
    (210, 170, 153),   # 12 - Beige
    (109, 194, 202),   # 13 - Cian
    (218, 212, 94),    # 14 - Amarillo
    (222, 238, 214)    # 15 - Blanco verdoso
]

def create_basic_sprite(size=32, bg_color=(20, 12, 28), main_color=(109, 170, 44)):
    """Crea un sprite básico con fondo y color principal"""
    img = Image.new('RGBA', (size, size), bg_color + (255,))
    draw = ImageDraw.Draw(img)
    
    # Marco básico
    border = max(1, size
    draw.rectangle([border, border, size-border-1, size-border-1], 
                  fill=main_color + (255,), outline=bg_color + (255,))
    
    return img

def generate_entity_circle_happy(size=32):
    """Genera sprite de entidad circular feliz"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size
    radius = size
    
    # Cuerpo circular
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                fill=(109, 170, 44, 255))  # Verde claro
    
    # Ojos
    eye_size = max(2, size
    draw.ellipse([center-radius//2, center-radius//3, center-radius//2+eye_size, center-radius//3+eye_size], 
                fill=(20, 12, 28, 255))  # Negro
    draw.ellipse([center+radius//2-eye_size, center-radius//3, center+radius//2, center-radius//3+eye_size], 
                fill=(20, 12, 28, 255))  # Negro
    
    # Sonrisa
    mouth_y = center + radius
    draw.arc([center-radius//2, mouth_y-radius//4, center+radius//2, mouth_y+radius//4], 
             start=0, end=180, fill=(20, 12, 28, 255), width=2)
    
    return img

def generate_entity_circle_sad(size=32):
    """Genera sprite de entidad circular triste"""
    img = generate_entity_circle_happy(size)
    draw = ImageDraw.Draw(img)
    
    center = size
    radius = size
    
    # Reemplazar color con tono triste
    for y in range(size):
        for x in range(size):
            pixel = img.getpixel((x, y))
            if pixel == (109, 170, 44, 255):  # Verde original
                img.putpixel((x, y), (208, 70, 72, 255))  # Rojo triste
    
    # Dibujar boca triste (arco invertido)
    mouth_y = center + radius
    draw.arc([center-radius//2, mouth_y-radius//4, center+radius//2, mouth_y+radius//4], 
             start=180, end=360, fill=(20, 12, 28, 255), width=2)
    
    return img

def generate_entity_square_happy(size=32):
    """Genera sprite de entidad cuadrada feliz"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size
    square_size = size
    
    # Cuerpo cuadrado
    draw.rectangle([center-square_size//2, center-square_size//2, 
                   center+square_size//2, center+square_size//2], 
                  fill=(89, 125, 206, 255))  # Azul claro
    
    # Ojos
    eye_size = max(2, size
    draw.rectangle([center-square_size//3, center-square_size//4, 
                   center-square_size//3+eye_size, center-square_size//4+eye_size], 
                  fill=(20, 12, 28, 255))
    draw.rectangle([center+square_size//3-eye_size, center-square_size//4, 
                   center+square_size//3, center-square_size//4+eye_size], 
                  fill=(20, 12, 28, 255))
    
    # Sonrisa
    mouth_y = center + square_size
    draw.line([center-square_size//3, mouth_y, center+square_size//3, mouth_y], 
              fill=(20, 12, 28, 255), width=2)
    
    return img

# Mapeo de sprites disponibles
SPRITE_GENERATORS = {
    'entidad_circulo_happy': generate_entity_circle_happy,
    'entidad_circulo_sad': generate_entity_circle_sad,
    'entidad_square_happy': generate_entity_square_happy,
    'entidad_square_sad': lambda size=32: generate_entity_square_happy(size),  # TODO: implementar variante triste
    'entidad_circulo_dying': lambda size=32: generate_entity_circle_sad(size),  # TODO: implementar variante muriendo
    'entidad_square_dying': lambda size=32: generate_entity_square_happy(size), # TODO: implementar variante muriendo
    
    # Patrones básicos
    'pattern_kitchen': lambda size=32: create_basic_sprite(size, (20, 12, 28), (210, 125, 44)),
    'pattern_bedroom': lambda size=32: create_basic_sprite(size, (20, 12, 28), (89, 125, 206)),
    'pattern_living': lambda size=32: create_basic_sprite(size, (20, 12, 28), (109, 170, 44)),
    'pattern_garden': lambda size=32: create_basic_sprite(size, (20, 12, 28), (52, 101, 36)),
    'pattern_stone': lambda size=32: create_basic_sprite(size, (20, 12, 28), (117, 113, 97)),
    'pattern_tiles_only': lambda size=32: create_basic_sprite(size, (20, 12, 28), (133, 149, 161)),
    
    # UI Elements
    'barra_estadistica': lambda size=32: create_basic_sprite(size, (20, 12, 28), (218, 212, 94)),
    'canvas_base': lambda size=32: create_basic_sprite(size, (20, 12, 28), (68, 36, 52)),
    'conexion_entidades': lambda size=32: create_basic_sprite(size, (20, 12, 28), (109, 194, 202)),
    'dialogo_overlay': lambda size=32: create_basic_sprite(size, (20, 12, 28), (210, 170, 153)),
}

def generate_sprite(name, size=32, output_dir="sprites"):
    """Genera un sprite específico"""
    if name not in SPRITE_GENERATORS:
        print(f"❌ Sprite no encontrado: {name}")
        return False
    
    try:
        img = SPRITE_GENERATORS[name](size)
        
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{name}.png")
        img.save(output_path, "PNG")
        
        print(f"✅ Generado: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Error generando {name}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generador de sprites para Duo Eterno')
    parser.add_argument('type', choices=['sprites', 'patterns', 'all'], 
                       help='Tipo de assets a generar')
    parser.add_argument('names', nargs='?', default='all',
                       help='Nombres de sprites separados por coma, o "all"')
    parser.add_argument('output_dir', nargs='?', default='sprites',
                       help='Directorio de salida')
    parser.add_argument('--size', type=int, default=32,
                       help='Tamaño de sprites (default: 32)')
    
    args = parser.parse_args()
    
    print(f"🎨 Generando sprites {args.type} en {args.output_dir}")
    
    if args.names == 'all':
        sprites_to_generate = list(SPRITE_GENERATORS.keys())
    else:
        sprites_to_generate = [name.strip() for name in args.names.split(',')]
    
    success_count = 0
    for sprite_name in sprites_to_generate:
        if generate_sprite(sprite_name, args.size, args.output_dir):
            success_count += 1
    
    print(f"\n📊 Completado: {success_count}/{len(sprites_to_generate)} sprites generados")
    
    if success_count < len(sprites_to_generate):
        print(f"⚠️  Falló la generación de {len(sprites_to_generate) - success_count} sprites")
        sys.exit(1)

if __name__ == '__main__':
    main()
