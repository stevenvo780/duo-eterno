#!/bin/bash

echo "🤖 Instalando IA LOCAL para clasificación de sprites..."
echo "Este script instala modelos que se ejecutan completamente offline"
echo ""

# Verificar si pip3 está disponible
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 no encontrado. Instalar Python 3 y pip primero."
    exit 1
fi

# Detectar si hay GPU disponible
if command -v nvidia-smi &> /dev/null; then
    echo "🚀 GPU NVIDIA detectada, instalando versión con soporte CUDA..."
    GPU_SUPPORT=true
else
    echo "💻 No se detectó GPU, instalando versión CPU..."
    GPU_SUPPORT=false
fi

echo ""
echo "📦 Instalando dependencias básicas..."

# Instalar dependencias básicas
pip3 install --user Pillow>=10.0.0
pip3 install --user imagehash>=4.3.1
pip3 install --user numpy>=1.21.0
pip3 install --user opencv-python>=4.5.0
pip3 install --user scikit-learn>=1.0.0
pip3 install --user tqdm>=4.64.0
pip3 install --user requests>=2.31.0

echo ""
echo "🧠 Instalando PyTorch..."

if [ "$GPU_SUPPORT" = true ]; then
    # Instalar PyTorch con CUDA
    pip3 install --user torch torchvision --index-url https://download.pytorch.org/whl/cu118
else
    # Instalar PyTorch solo CPU
    pip3 install --user torch torchvision --index-url https://download.pytorch.org/whl/cpu
fi

echo ""
echo "🎯 Instalando modelos de IA..."

# CLIP
pip3 install --user git+https://github.com/openai/CLIP.git

# YOLO (Ultralytics)
pip3 install --user ultralytics>=8.0.0

# Transformers (para BLIP)
pip3 install --user transformers>=4.21.0

echo ""
echo "📥 Descargando modelos pre-entrenados..."

# Crear directorio para modelos si no existe
mkdir -p ~/.cache/ai_models

# Descargar modelo YOLO pequeño
python3 -c "
try:
    from ultralytics import YOLO
    model = YOLO('yolov8n.pt')
    print('✅ Modelo YOLO descargado')
except Exception as e:
    print(f'⚠️ Error descargando YOLO: {e}')
"

# Verificar CLIP
python3 -c "
try:
    import clip
    import torch
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model, preprocess = clip.load('ViT-B/32', device=device)
    print('✅ Modelo CLIP cargado en', device)
except Exception as e:
    print(f'⚠️ Error cargando CLIP: {e}')
"

# Verificar BLIP (opcional)
python3 -c "
try:
    from transformers import BlipProcessor, BlipForConditionalGeneration
    processor = BlipProcessor.from_pretrained('Salesforce/blip-image-captioning-base')
    model = BlipForConditionalGeneration.from_pretrained('Salesforce/blip-image-captioning-base')
    print('✅ Modelo BLIP descargado')
except Exception as e:
    print(f'⚠️ BLIP opcional no disponible: {e}')
"

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "🧪 Probando la instalación..."
python3 -c "
import torch
print(f'PyTorch: {torch.__version__}')
print(f'CUDA disponible: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'GPU: {torch.cuda.get_device_name(0)}')

try:
    import clip
    print('✅ CLIP: Disponible')
except ImportError:
    print('❌ CLIP: No disponible')

try:
    from ultralytics import YOLO
    print('✅ YOLO: Disponible')
except ImportError:
    print('❌ YOLO: No disponible')

try:
    from transformers import BlipProcessor
    print('✅ BLIP: Disponible')
except ImportError:
    print('❌ BLIP: No disponible (opcional)')
"

echo ""
echo "🎮 Uso del clasificador:"
echo "1. Análisis básico (solo reportar):"
echo "   python3 classify_sprites_local.py"
echo ""
echo "2. Eliminar duplicados y mover automáticamente:"
echo "   python3 classify_sprites_local.py --auto-move"
echo ""
echo "3. Con umbral de confianza personalizado:"
echo "   python3 classify_sprites_local.py --auto-move --confidence 0.8"
echo ""
echo "4. Ver todas las opciones:"
echo "   python3 classify_sprites_local.py --help"