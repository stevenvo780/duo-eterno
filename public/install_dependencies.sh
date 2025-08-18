#!/bin/bash

echo "🔧 Instalando dependencias para el clasificador BÁSICO de sprites..."
echo "Este script instala dependencias básicas sin APIs externas"

# Verificar si hay entorno virtual o usar el sistema
if [ -d "venv_sprites" ]; then
    echo "📁 Usando entorno virtual existente..."
    source venv_sprites/bin/activate
else
    echo "📁 Creando entorno virtual..."
    python3 -m venv venv_sprites
    source venv_sprites/bin/activate
fi

echo "📦 Instalando dependencias básicas..."

# Instalar dependencias básicas
pip install Pillow>=10.0.0
pip install imagehash>=4.3.1  
pip install numpy>=1.21.0
pip install opencv-python>=4.5.0
pip install scikit-learn>=1.0.0

echo "✅ Dependencias básicas instaladas!"
echo ""
echo "🧪 Probando instalación..."

# Probar que todo funciona
python test_local_classification.py

echo ""
echo "📝 Pasos siguientes:"
echo "1. Activar entorno virtual:"
echo "   source venv_sprites/bin/activate"
echo ""
echo "2. Ejecutar análisis básico (solo reportar):"
echo "   python classify_sprites_basic.py"
echo ""
echo "3. Ejecutar con limpieza automática:"
echo "   python classify_sprites_basic.py --auto-move"
echo ""
echo "4. Para mejor precisión, instalar modelos de IA:"
echo "   ./install_local_ai.sh"
echo "   python classify_sprites_local.py"