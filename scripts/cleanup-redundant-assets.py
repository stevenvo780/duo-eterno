#!/usr/bin/env python3
"""
Script para eliminar assets redundantes y mantener solo los esenciales
basado en el análisis previo y las nuevas categorías del asset manager
"""

import os
import shutil
import hashlib
from pathlib import Path

# Assets que debemos mantener según ASSET_CATEGORIES actualizado
KEEP_ASSETS = {
    # Terreno base (solo los esenciales)
    'tile_0182_suelo_cesped.png',
    'tile_0210_suelo_cesped.png', 
    'tile_0144_suelo_tierra.png',
    'tile_0184_suelo_tierra.png',
    'tile_0143_suelo_arena.png', 
    'tile_0179_suelo_arena.png',
    'tile_0145_suelo_piedra.png',
    'tile_0181_suelo_piedra.png',
    
    # Edificios esenciales
    'tile_0000_edificio_principal.png',
    'tile_0003_edificio_comercial.png',
    'tile_0007_edificio_comercial.png', 
    'tile_0004_edificio_pequeño.png',
    'tile_0005_edificio_grande.png',
    
    # Naturaleza (solo los mejores)
    'tile_0002_arbol_grande.png',
    'tile_0033_arbol_pequeño.png', 
    'tile_0034_arbol_frondoso.png',
    
    # Carreteras (esenciales)
    'tile_0001_carretera_horizontal.png',
    'tile_0189_carretera_vertical.png',
    'tile_0154_carretera_curva.png',
    'tile_0191_carretera_cruce.png',
    
    # Agua (mínima)
    'tile_0149_agua_profunda.png'
}

def find_duplicates(tiles_dir):
    """Encontrar archivos duplicados usando MD5 hash"""
    duplicates = {}
    file_hashes = {}
    
    for file_path in Path(tiles_dir).glob('*.png'):
        if file_path.name.startswith('tile_furniture_'):
            continue  # Saltar muebles extraídos
            
        with open(file_path, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
            
        if file_hash in file_hashes:
            # Duplicado encontrado
            original = file_hashes[file_hash]
            if file_hash not in duplicates:
                duplicates[file_hash] = [original]
            duplicates[file_hash].append(file_path.name)
        else:
            file_hashes[file_hash] = file_path.name
    
    return duplicates

def cleanup_assets(tiles_dir, backup_dir=None):
    """Limpiar assets redundantes manteniendo solo los esenciales"""
    
    if backup_dir:
        os.makedirs(backup_dir, exist_ok=True)
        print(f"Creando backup en: {backup_dir}")
    
    tiles_path = Path(tiles_dir)
    deleted_count = 0
    kept_count = 0
    
    # Encontrar duplicados primero
    duplicates = find_duplicates(tiles_dir)
    if duplicates:
        print(f"\nDuplicados encontrados: {len(duplicates)} grupos")
        for file_hash, files in duplicates.items():
            print(f"  Duplicados: {files}")
    
    # Procesar todos los archivos
    for file_path in tiles_path.glob('tile_*.png'):
        filename = file_path.name
        
        # Saltar muebles extraídos
        if filename.startswith('tile_furniture_'):
            continue
            
        if filename in KEEP_ASSETS:
            # Mantener este asset
            print(f"✓ Manteniendo: {filename}")
            kept_count += 1
        else:
            # Eliminar este asset (con backup opcional)
            if backup_dir:
                shutil.move(str(file_path), os.path.join(backup_dir, filename))
                print(f"📦 Movido a backup: {filename}")
            else:
                file_path.unlink()
                print(f"🗑️  Eliminado: {filename}")
            deleted_count += 1
    
    return kept_count, deleted_count

def main():
    """Función principal"""
    base_dir = "/home/stev/Documentos/repos/Personal/duo-eterno/public/assets"
    tiles_dir = os.path.join(base_dir, "Tiles")
    backup_dir = os.path.join(base_dir, "Tiles_backup")
    
    print("🧹 LIMPIEZA DE ASSETS REDUNDANTES")
    print("=" * 50)
    
    if not os.path.exists(tiles_dir):
        print(f"❌ No se encontró directorio: {tiles_dir}")
        return
    
    # Contar archivos antes
    before_count = len(list(Path(tiles_dir).glob('tile_*.png')))
    print(f"📊 Assets antes: {before_count}")
    
    # Realizar limpieza
    kept, deleted = cleanup_assets(tiles_dir, backup_dir)
    
    # Estadísticas finales
    print(f"\n📈 RESUMEN:")
    print(f"  Assets mantenidos: {kept}")
    print(f"  Assets eliminados: {deleted}")
    print(f"  Reducción: {deleted/(kept+deleted)*100:.1f}%")
    print(f"  Total final: {kept}")
    
    # Contar archivos después
    after_count = len(list(Path(tiles_dir).glob('tile_*.png')))
    print(f"📊 Assets después: {after_count}")
    
    if backup_dir and os.path.exists(backup_dir):
        backup_count = len(list(Path(backup_dir).glob('*.png')))
        print(f"📦 Assets en backup: {backup_count}")

if __name__ == "__main__":
    main()