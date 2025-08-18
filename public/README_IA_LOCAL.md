# Clasificador de Sprites con IA LOCAL 🤖

Script avanzado para clasificar sprites usando **IA completamente local** - sin APIs externas ni conexión a internet.

## 🚀 Características

- **🔒 100% Offline**: No requiere conexión a internet después de la instalación
- **🤖 Múltiples IAs**: CLIP, YOLO, BLIP + clasificación por reglas
- **🎯 Alta Precisión**: Combina múltiples métodos para mejor accuracy
- **🔍 Detección de Duplicados**: Hash perceptual avanzado
- **⚡ Optimizado**: Funciona con o sin GPU
- **📊 Reportes Detallados**: Análisis completo con confianza por método

## 🛠️ Instalación Rápida

```bash
# Instalar todo automáticamente
./install_local_ai.sh
```

## 📋 Modelos de IA Incluidos

### 1. **CLIP** (Contrastive Language-Image Pre-training)
- **Qué hace**: Entiende imágenes usando descripciones en texto natural
- **Ventaja**: Excelente para clasificar por contexto semántico
- **Uso**: Clasificación principal basada en "a pixel art sprite of buildings/nature/etc"

### 2. **YOLO** (You Only Look Once)
- **Qué hace**: Detección de objetos en tiempo real
- **Ventaja**: Identifica elementos específicos (personas, vehículos, animales)
- **Uso**: Detectar sprites de personajes vs elementos de escenario

### 3. **BLIP** (Bootstrapping Language-Image Pre-training)
- **Qué hace**: Genera descripciones de imágenes
- **Ventaja**: Proporciona contexto adicional
- **Uso**: Análisis complementario (opcional)

### 4. **Clasificación por Reglas**
- **Qué hace**: Análisis de colores, formas y nombres de archivos
- **Ventaja**: Funciona sin modelos pesados, muy rápido
- **Uso**: Fallback y validación de otros métodos

## 💻 Requisitos del Sistema

### Mínimos (Solo CPU)
- Python 3.8+
- 4GB RAM
- 2GB espacio libre

### Recomendados (Con GPU)
- GPU NVIDIA con CUDA
- 8GB VRAM
- 16GB RAM
- 10GB espacio libre

## 🎮 Uso

### Análisis básico (solo reportar)
```bash
python3 classify_sprites_local.py
```

### Limpieza completa automática
```bash
python3 classify_sprites_local.py --auto-move
```

### Configuración avanzada
```bash
# Con umbral de confianza personalizado
python3 classify_sprites_local.py --auto-move --confidence 0.8

# Sin eliminar duplicados
python3 classify_sprites_local.py --no-duplicates

# Reporte personalizado
python3 classify_sprites_local.py --report mi_reporte.json
```

## 📊 Ejemplo de Ejecución

```
🎮 Clasificador de Sprites con IA LOCAL
=============================================
Ruta base: /path/to/duo-eterno/public
Eliminar duplicados: True
Mover automático: True
Umbral confianza: 0.6

🤖 Cargando modelos de IA locales...
  ✅ CLIP cargado en cuda
  ✅ YOLO cargado
  ✅ BLIP cargado

🔍 Iniciando análisis con IA local...
Encontradas 847 imágenes

🔍 Detectando duplicados...
Encontrados 15 grupos de duplicados
Duplicados encontrados:
  Mantener: assets/buildings/tile_0003_edificio_comercial.png
  Eliminado: assets/buildings/tile_0007_edificio_comercial.png

🤖 Clasificando 832 imágenes con IA local...

[1/832] tile_0002_arbol_grande.png
  Actual: nature -> Sugerido: nature (0.95)
  Método: multi_method

[2/832] pattern_kitchen.png  
  Actual: sprites -> Sugerido: ground (0.87)
  Método: multi_method
  Movido: assets/sprites/pattern_kitchen.png -> assets/ground/pattern_kitchen.png

📊 RESUMEN DEL PROCESAMIENTO (IA LOCAL)
============================================================
Imágenes clasificadas: 832
Duplicados eliminados: 27
Archivos movidos: 43
Errores: 0

📈 Métodos utilizados:
  multi_method: 789 imágenes
  rules: 43 imágenes

🎯 Confianza promedio: 0.84

📂 Distribución por categorías:
  buildings: 295 imágenes
  ground: 201 imágenes  
  nature: 158 imágenes
  roads: 87 imágenes
  water: 73 imágenes
  sprites: 18 imágenes

📄 Reporte guardado en: sprite_local_report.json
```

## 🧠 Cómo Funciona la Combinación de IAs

### 1. Análisis Multi-Método
```python
# Cada imagen se analiza con todos los métodos disponibles
clip_result = classify_with_clip(image)      # 50% peso
yolo_result = classify_with_yolo(image)      # 30% peso  
rules_result = classify_with_rules(image)    # 20% peso

# Se combinan usando weighted voting
final_category = combine_results([clip_result, yolo_result, rules_result])
```

### 2. Sistema de Confianza
- **> 0.8**: Muy alta confianza, clasificación automática
- **0.6 - 0.8**: Alta confianza, mover si `--auto-move`
- **0.4 - 0.6**: Confianza media, solo sugerir
- **< 0.4**: Baja confianza, mantener actual

### 3. Fallback Inteligente
- Si CLIP falla -> usar YOLO + reglas
- Si YOLO falla -> usar CLIP + reglas  
- Si ambos fallan -> solo reglas
- Siempre hay un resultado válido

## 🔧 Troubleshooting

### Error: "No module named 'torch'"
```bash
# CPU solamente
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Con GPU NVIDIA  
pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### Error: "CUDA out of memory"
```bash
# Forzar uso de CPU
export CUDA_VISIBLE_DEVICES=""
python3 classify_sprites_local.py
```

### Solo funciona clasificación por reglas
- Esto es normal si no se instalaron los modelos de IA
- Sigue siendo muy efectivo para sprites con nombres descriptivos
- Para máxima precisión, instalar: `./install_local_ai.sh`

## 📁 Archivos Generados

- **`sprite_local_report.json`**: Reporte detallado con todas las clasificaciones
- **Backups automáticos**: Los archivos se mueven, no se eliminan
- **Logs de confianza**: Qué método se usó para cada imagen

## 🎯 Ventajas vs APIs Externas

| Característica | IA Local | APIs Externas |
|---------------|-----------|---------------|
| **Privacidad** | ✅ 100% local | ❌ Datos enviados |
| **Velocidad** | ✅ Sin latencia | ❌ Depende de internet |
| **Costo** | ✅ Gratis | ❌ Por request |
| **Offline** | ✅ Siempre funciona | ❌ Requiere internet |
| **Límites** | ✅ Sin límites | ❌ Rate limits |
| **Personalizable** | ✅ 100% control | ❌ API fija |

## 🚀 Rendimiento

- **CPU**: ~2-3 imágenes/segundo
- **GPU**: ~10-15 imágenes/segundo  
- **Solo reglas**: ~50+ imágenes/segundo

Para 800+ imágenes:
- Con GPU: ~2-3 minutos
- Solo CPU: ~8-10 minutos
- Solo reglas: ~30 segundos