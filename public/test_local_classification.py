#!/usr/bin/env python3
"""
Script de prueba para el clasificador LOCAL de sprites.
Prueba funcionalidades básicas sin modificar archivos.
"""

import os
import numpy as np
from pathlib import Path

def test_basic_dependencies():
    """Prueba dependencias básicas."""
    print("🧪 Probando dependencias básicas...")
    
    try:
        from PIL import Image
        print("  ✅ PIL (Pillow)")
    except ImportError:
        print("  ❌ PIL (Pillow) - Instalar con: pip3 install Pillow")
        return False
    
    try:
        import imagehash
        print("  ✅ imagehash")
    except ImportError:
        print("  ❌ imagehash - Instalar con: pip3 install imagehash")
        return False
    
    try:
        import numpy
        print("  ✅ numpy")
    except ImportError:
        print("  ❌ numpy - Instalar con: pip3 install numpy")
        return False
    
    try:
        import cv2
        print("  ✅ opencv-python")
    except ImportError:
        print("  ❌ opencv-python - Instalar con: pip3 install opencv-python")
        return False
    
    try:
        from sklearn.cluster import KMeans
        print("  ✅ scikit-learn")
    except ImportError:
        print("  ❌ scikit-learn - Instalar con: pip3 install scikit-learn")
        return False
    
    return True

def test_ai_models():
    """Prueba modelos de IA disponibles."""
    print("\n🤖 Probando modelos de IA...")
    
    ai_available = {'torch': False, 'clip': False, 'yolo': False, 'blip': False}
    
    # PyTorch
    try:
        import torch
        print(f"  ✅ PyTorch {torch.__version__}")
        print(f"      CUDA disponible: {torch.cuda.is_available()}")
        if torch.cuda.is_available():
            print(f"      GPU: {torch.cuda.get_device_name(0)}")
        ai_available['torch'] = True
    except ImportError:
        print("  ❌ PyTorch - Necesario para CLIP y otros modelos")
    
    # CLIP
    try:
        import clip
        print("  ✅ CLIP")
        ai_available['clip'] = True
    except ImportError:
        print("  ❌ CLIP - Instalar con: pip3 install git+https://github.com/openai/CLIP.git")
    
    # YOLO
    try:
        from ultralytics import YOLO
        print("  ✅ YOLO (Ultralytics)")
        ai_available['yolo'] = True
    except ImportError:
        print("  ❌ YOLO - Instalar con: pip3 install ultralytics")
    
    # BLIP
    try:
        from transformers import BlipProcessor
        print("  ✅ BLIP (Transformers)")
        ai_available['blip'] = True
    except ImportError:
        print("  ❌ BLIP - Opcional, instalar con: pip3 install transformers")
    
    return ai_available

def test_image_processing():
    """Prueba procesamiento de imágenes con una imagen de ejemplo."""
    print("\n🖼️ Probando procesamiento de imágenes...")
    
    # Buscar una imagen de ejemplo
    assets_path = Path("assets")
    if not assets_path.exists():
        print("  ❌ No se encuentra directorio 'assets'")
        return False
    
    # Encontrar una imagen PNG
    sample_image = None
    for root, dirs, files in os.walk(assets_path):
        for file in files:
            if file.lower().endswith('.png'):
                sample_image = os.path.join(root, file)
                break
        if sample_image:
            break
    
    if not sample_image:
        print("  ❌ No se encontraron imágenes PNG en assets/")
        return False
    
    print(f"  📁 Usando imagen de prueba: {sample_image}")
    
    try:
        # Probar carga básica
        from PIL import Image
        with Image.open(sample_image) as img:
            print(f"      Tamaño: {img.size}")
            print(f"      Modo: {img.mode}")
        
        # Probar hash perceptual
        import imagehash
        with Image.open(sample_image) as img:
            phash = str(imagehash.phash(img, hash_size=16))
            print(f"      Hash perceptual: {phash[:16]}...")
        
        # Probar análisis de color
        img_array = np.array(Image.open(sample_image).convert('RGB').resize((64, 64)))
        dominant_color = np.mean(img_array.reshape(-1, 3), axis=0)
        print(f"      Color dominante (RGB): {dominant_color.astype(int)}")
        
        # Probar OpenCV
        import cv2
        cv_img = cv2.imread(sample_image)
        if cv_img is not None:
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            print(f"      Contornos detectados: {len(contours)}")
        
        print("  ✅ Procesamiento de imagen exitoso")
        return True
        
    except Exception as e:
        print(f"  ❌ Error en procesamiento: {e}")
        return False

def test_classification_rules():
    """Prueba clasificación basada en reglas."""
    print("\n📋 Probando clasificación por reglas...")
    
    # Simular análisis de nombres de archivo
    test_files = [
        "tile_0003_edificio_comercial.png",
        "tile_0002_arbol_grande.png", 
        "tile_0144_suelo_tierra.png",
        "tile_0149_agua_profunda.png",
        "tile_0001_carretera_horizontal.png",
        "entidad_circulo_happy.png"
    ]
    
    categories = {
        'buildings': ['edificio', 'building', 'casa', 'tower'],
        'nature': ['arbol', 'tree', 'plant', 'planta'],
        'ground': ['suelo', 'ground', 'tierra', 'arena', 'piedra'],
        'water': ['agua', 'water', 'rio', 'estanque'],
        'roads': ['carretera', 'road', 'camino', 'path'],
        'sprites': ['personaje', 'character', 'entidad', 'player']
    }
    
    for filename in test_files:
        scores = {}
        filename_lower = filename.lower()
        
        for category, keywords in categories.items():
            score = sum(1 for keyword in keywords if keyword in filename_lower)
            if score > 0:
                scores[category] = score
        
        if scores:
            best_category = max(scores.keys(), key=lambda k: scores[k])
            print(f"  {filename} -> {best_category}")
        else:
            print(f"  {filename} -> sprites (default)")
    
    print("  ✅ Clasificación por reglas funcionando")
    return True

def main():
    """Función principal de prueba."""
    print("🎮 Probando Clasificador LOCAL de Sprites")
    print("=" * 50)
    
    # Verificar directorio
    current_path = Path.cwd()
    print(f"Directorio actual: {current_path}")
    
    # Pruebas
    tests_passed = 0
    total_tests = 4
    
    # 1. Dependencias básicas
    if test_basic_dependencies():
        tests_passed += 1
    
    # 2. Modelos de IA
    ai_models = test_ai_models()
    if any(ai_models.values()):
        tests_passed += 1
        
        # Mostrar resumen de IA
        print(f"\n📊 Resumen de IA disponible:")
        for model, available in ai_models.items():
            status = "✅" if available else "❌"
            print(f"  {status} {model.upper()}")
    
    # 3. Procesamiento de imagen
    if test_image_processing():
        tests_passed += 1
    
    # 4. Clasificación por reglas
    if test_classification_rules():
        tests_passed += 1
    
    # Resumen final
    print(f"\n📈 RESULTADO: {tests_passed}/{total_tests} pruebas pasaron")
    
    if tests_passed == total_tests:
        print("✅ ¡Todo listo para usar el clasificador!")
        print("\n🚀 Próximos pasos:")
        print("1. Ejecutar análisis básico:")
        print("   python3 classify_sprites_local.py")
        print("\n2. Con limpieza automática:")
        print("   python3 classify_sprites_local.py --auto-move")
        
        if not ai_models['clip'] and not ai_models['yolo']:
            print("\n💡 Sugerencia: Instalar modelos de IA para mejor precisión:")
            print("   ./install_local_ai.sh")
    
    elif tests_passed >= 2:
        print("⚠️  Funcionalidad básica disponible, pero faltan algunos componentes")
        print("   El clasificador funcionará con reglas básicas")
    
    else:
        print("❌ Demasiados componentes faltantes")
        print("   Instalar dependencias con: pip3 install -r requirements_local.txt")
    
    return tests_passed >= 2

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)