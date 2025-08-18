#!/usr/bin/env python3
"""
Script para extraer muebles individuales de spritesheets y generar tiles usables
"""

import os
import sys
from PIL import Image

def extract_furniture_tiles(spritesheet_path, output_dir, tile_size=32):
    """Extraer tiles individuales de un spritesheet de muebles"""
    
    # Cargar la imagen
    try:
        img = Image.open(spritesheet_path)
        print(f"Cargando spritesheet: {spritesheet_path} ({img.size})")
    except Exception as e:
        print(f"Error cargando imagen: {e}")
        return
    
    # Crear directorio de salida
    os.makedirs(output_dir, exist_ok=True)
    
    # Calcular número de tiles
    cols = img.width // tile_size
    rows = img.height // tile_size
    
    print(f"Extrayendo {cols}x{rows} tiles de {tile_size}x{tile_size} píxeles")
    
    tile_count = 0
    furniture_names = [
        "table_round", "chair_wood", "sofa_brown", "bed_double", 
        "bookshelf", "desk", "cabinet", "wardrobe",
        "chair_fancy", "table_long", "stool", "bench",
        "dresser", "nightstand", "armchair", "dining_table",
        "kitchen_counter", "sink", "stove", "fridge",
        "toilet", "bathtub", "mirror", "piano",
        "fireplace", "tv_stand", "coffee_table", "lamp"
    ]
    
    for row in range(rows):
        for col in range(cols):
            # Calcular coordenadas del tile
            left = col * tile_size
            top = row * tile_size
            right = left + tile_size
            bottom = top + tile_size
            
            # Extraer el tile
            tile = img.crop((left, top, right, bottom))
            
            # Verificar si el tile no está vacío
            if not is_tile_empty(tile):
                # Generar nombre basado en posición o lista predefinida
                if tile_count < len(furniture_names):
                    name = furniture_names[tile_count]
                else:
                    name = f"furniture_{tile_count:03d}"
                
                # Guardar el tile
                tile_path = os.path.join(output_dir, f"tile_furniture_{name}.png")
                tile.save(tile_path)
                print(f"Guardado: {tile_path}")
                tile_count += 1
    
    print(f"Extraídos {tile_count} tiles de muebles")

def is_tile_empty(tile, threshold=10):
    """Verificar si un tile está mayormente vacío"""
    # Convertir a RGBA si no lo está
    if tile.mode != 'RGBA':
        tile = tile.convert('RGBA')
    
    # Contar píxeles no transparentes
    non_transparent = 0
    total_pixels = tile.width * tile.height
    
    for pixel in tile.getdata():
        if len(pixel) >= 4 and pixel[3] > 0:  # Alpha > 0
            non_transparent += 1
        elif len(pixel) == 3 and pixel != (255, 255, 255):  # No es blanco puro
            non_transparent += 1
    
    return non_transparent < threshold

def main():
    """Función principal"""
    base_dir = "/home/stev/Documentos/repos/Personal/duo-eterno/public/assets"
    
    # Rutas de archivos
    furniture_dir = os.path.join(base_dir, "Furniture")
    tiles_dir = os.path.join(base_dir, "Tiles")
    
    # Extraer muebles del spritesheet descargado
    spritesheet_path = os.path.join(furniture_dir, "dark-wood-furniture.png")
    furniture_output = os.path.join(tiles_dir, "furniture")
    
    if os.path.exists(spritesheet_path):
        os.makedirs(furniture_output, exist_ok=True)
        extract_furniture_tiles(spritesheet_path, furniture_output, tile_size=32)
    else:
        print(f"No se encontró spritesheet en: {spritesheet_path}")
    
    # También procesar el spritesheet de madera clara si existe
    blonde_spritesheet = os.path.join(furniture_dir, "blonde-wood-furniture.png")
    if os.path.exists(blonde_spritesheet):
        blonde_output = os.path.join(tiles_dir, "furniture_light")
        os.makedirs(blonde_output, exist_ok=True)
        extract_furniture_tiles(blonde_spritesheet, blonde_output, tile_size=32)

if __name__ == "__main__":
    main()