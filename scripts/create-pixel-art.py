#!/usr/bin/env python3
"""
Script para crear pixel art base para Dúo Eterno
"""

from PIL import Image, ImageDraw
import os

# Crear directorio de assets si no existe
assets_dir = "../src/assets/pixel-art"
os.makedirs(assets_dir, exist_ok=True)

# Paleta de colores románticos y minimalistas
COLORS = {
    'bg': (248, 248, 255),      # Lavanda muy clara (fondo)
    'primary': (255, 182, 193),  # Rosa claro
    'secondary': (255, 240, 245), # Rosa muy claro
    'accent': (255, 105, 180),   # Rosa fuerte
    'dark': (75, 0, 130),       # Índigo oscuro
    'heart': (220, 20, 60),     # Rojo corazón
    'gold': (255, 215, 0),      # Dorado
    'white': (255, 255, 255),   # Blanco
    'black': (0, 0, 0),         # Negro
}

def create_entity_circle(size=32, color=COLORS['accent'], name="entity_circle"):
    """Crear entidad circular (●)"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar círculo principal
    margin = 4
    draw.ellipse([margin, margin, size-margin, size-margin], 
                fill=color, outline=COLORS['dark'], width=2)
    
    # Brillo pequeño
    highlight_size = 6
    draw.ellipse([size//3, size//4, size//3 + highlight_size, size//4 + highlight_size], 
                fill=COLORS['white'])
    
    img.save(f"{assets_dir}/{name}.png")
    return img

def create_entity_square(size=32, color=COLORS['primary'], name="entity_square"):
    """Crear entidad cuadrada (■)"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar cuadrado principal
    margin = 4
    draw.rectangle([margin, margin, size-margin, size-margin], 
                  fill=color, outline=COLORS['dark'], width=2)
    
    # Brillo pequeño
    highlight_size = 6
    draw.rectangle([size//3, size//4, size//3 + highlight_size, size//4 + highlight_size], 
                  fill=COLORS['white'])
    
    img.save(f"{assets_dir}/{name}.png")
    return img

def create_heart_icon(size=32):
    """Crear icono de corazón para resonancia"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Dibujar corazón simple en pixel art
    center_x, center_y = size // 2, size // 2
    
    # Pixel art corazón
    heart_pixels = [
        (center_x-3, center_y-2), (center_x-2, center_y-3), (center_x-1, center_y-3),
        (center_x, center_y-3), (center_x+1, center_y-3), (center_x+2, center_y-3),
        (center_x+3, center_y-2), (center_x-4, center_y-1), (center_x-3, center_y-1),
        (center_x+3, center_y-1), (center_x+4, center_y-1), (center_x-4, center_y),
        (center_x+4, center_y), (center_x-3, center_y+1), (center_x+3, center_y+1),
        (center_x-2, center_y+2), (center_x+2, center_y+2), (center_x-1, center_y+3),
        (center_x+1, center_y+3), (center_x, center_y+4)
    ]
    
    for x, y in heart_pixels:
        if 0 <= x < size and 0 <= y < size:
            draw.point((x, y), fill=COLORS['heart'])
    
    img.save(f"{assets_dir}/heart_icon.png")
    return img

def create_zone_icons():
    """Crear iconos para diferentes zonas del juego"""
    
    # Zona de descanso (cama)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Cama simple
    draw.rectangle([4, 16, 28, 24], fill=COLORS['primary'], outline=COLORS['dark'])
    draw.rectangle([2, 20, 30, 28], fill=COLORS['secondary'], outline=COLORS['dark'])
    img.save(f"{assets_dir}/zone_rest.png")
    
    # Zona de comida (plato)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([6, 12, 26, 24], fill=COLORS['white'], outline=COLORS['dark'], width=2)
    draw.ellipse([12, 8, 20, 16], fill=COLORS['accent'])
    img.save(f"{assets_dir}/zone_food.png")
    
    # Zona de juego (pelota)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([8, 8, 24, 24], fill=COLORS['gold'], outline=COLORS['dark'], width=2)
    draw.arc([8, 8, 24, 24], 0, 180, fill=COLORS['white'], width=3)
    img.save(f"{assets_dir}/zone_play.png")
    
    # Zona social (dos corazones)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([4, 10, 14, 20], fill=COLORS['heart'])
    draw.ellipse([18, 10, 28, 20], fill=COLORS['accent'])
    img.save(f"{assets_dir}/zone_social.png")

def create_ui_elements():
    """Crear elementos de UI"""
    
    # Botón base
    img = Image.new('RGBA', (64, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, 63, 23], radius=8, 
                          fill=COLORS['primary'], outline=COLORS['dark'], width=2)
    img.save(f"{assets_dir}/button_base.png")
    
    # Barra de progreso (vacía)
    img = Image.new('RGBA', (100, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 99, 15], fill=COLORS['secondary'], outline=COLORS['dark'], width=2)
    img.save(f"{assets_dir}/progress_bar_empty.png")
    
    # Barra de progreso (llena)
    img = Image.new('RGBA', (100, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, 99, 15], fill=COLORS['secondary'], outline=COLORS['dark'], width=2)
    draw.rectangle([2, 2, 97, 13], fill=COLORS['accent'])
    img.save(f"{assets_dir}/progress_bar_full.png")

def create_background_patterns():
    """Crear patrones de fondo"""
    
    # Patrón de corazones pequeños
    img = Image.new('RGBA', (64, 64), COLORS['bg'])
    draw = ImageDraw.Draw(img)
    
    for x in range(0, 64, 16):
        for y in range(0, 64, 16):
            # Corazón muy pequeño
            draw.ellipse([x+6, y+6, x+10, y+10], fill=COLORS['secondary'])
    
    img.save(f"{assets_dir}/bg_hearts.png")
    
    # Patrón de puntos
    img = Image.new('RGBA', (32, 32), COLORS['bg'])
    draw = ImageDraw.Draw(img)
    
    for x in range(0, 32, 8):
        for y in range(0, 32, 8):
            draw.point((x+4, y+4), fill=COLORS['primary'])
    
    img.save(f"{assets_dir}/bg_dots.png")

if __name__ == "__main__":
    print("Creando pixel art para Dúo Eterno...")
    
    # Crear entidades principales
    create_entity_circle(32, COLORS['accent'], "entity_circle")
    create_entity_square(32, COLORS['primary'], "entity_square")
    
    # Variaciones de estado
    create_entity_circle(32, COLORS['heart'], "entity_circle_happy")
    create_entity_square(32, COLORS['gold'], "entity_square_happy")
    
    create_entity_circle(32, COLORS['dark'], "entity_circle_sad")
    create_entity_square(32, COLORS['dark'], "entity_square_sad")
    
    # Iconos especiales
    create_heart_icon(32)
    
    # Zonas
    create_zone_icons()
    
    # UI
    create_ui_elements()
    
    # Fondos
    create_background_patterns()
    
    print("✨ Pixel art creado exitosamente en src/assets/pixel-art/")
    print("Archivos generados:")
    for file in os.listdir(assets_dir):
        if file.endswith('.png'):
            print(f"  - {file}")
