#!/usr/bin/env python3
"""
Script de prueba para el clasificador de sprites.
Prueba con algunas imágenes existentes sin modificar nada.
"""

import os
from pathlib import Path

def test_basic_functionality():
    """Prueba básica del clasificador sin modificar archivos."""
    
    # Usar directorio actual
    current_path = str(Path.cwd())
    
    print("🧪 Prueba básica del clasificador")
    print("=" * 40)
    print(f"Directorio: {current_path}")
    
    # Verificar que existe el directorio assets
    assets_path = Path(current_path) / "assets"
    if not assets_path.exists():
        print("❌ Error: No se encuentra el directorio 'assets'")
        return False
    
    try:
        # Simular clasificador sin API key para pruebas básicas
        print("\n🔍 Verificando estructura de archivos...")
        
        # Obtener algunas imágenes de muestra
        sample_images = []
        for root, dirs, files in os.walk(assets_path):
            for file in files:
                if file.lower().endswith('.png') and len(sample_images) < 5:
                    sample_images.append(os.path.join(root, file))
        
        print(f"Encontradas {len(sample_images)} imágenes de muestra:")
        for img in sample_images:
            relative_path = Path(img).relative_to(assets_path)
            print(f"  - {relative_path}")
        
        # Verificar que las dependencias están disponibles
        print("\n📦 Verificando dependencias...")
        
        try:
            from PIL import Image
            print("  ✅ PIL (Pillow) disponible")
        except ImportError:
            print("  ❌ PIL (Pillow) no instalado")
            return False
        
        try:
            import imagehash
            print("  ✅ imagehash disponible")
        except ImportError:
            print("  ❌ imagehash no instalado")
            return False
        
        try:
            import openai
            print("  ✅ openai disponible")
        except ImportError:
            print("  ❌ openai no instalado")
            return False
        
        # Probar cálculo de hash en una imagen
        if sample_images:
            print(f"\n🔧 Probando hash perceptual...")
            test_image = sample_images[0]
            
            try:
                with Image.open(test_image) as img:
                    phash = str(imagehash.phash(img, hash_size=16))
                    print(f"  ✅ Hash calculado: {phash[:16]}...")
            except Exception as e:
                print(f"  ❌ Error calculando hash: {e}")
                return False
        
        print("\n✅ Todas las pruebas básicas pasaron!")
        print("\n💡 Para usar el clasificador completo:")
        print("1. Instalar dependencias: pip install -r requirements.txt")
        print("2. Configurar API key: export OPENAI_API_KEY='tu-key'")
        print("3. Ejecutar: python classify_sprites.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en prueba: {e}")
        return False

if __name__ == "__main__":
    success = test_basic_functionality()
    exit(0 if success else 1)