# Clasificador de Sprites con IA 🎮

Script inteligente para clasificar, renombrar y limpiar sprites de juegos 2D usando IA (OpenAI GPT-4 Vision).

## Características

- 🤖 **Clasificación inteligente** con OpenAI GPT-4 Vision API
- 🔍 **Detección de duplicados** usando hash perceptual
- 📁 **Organización automática** por categorías
- 🏷️ **Renombrado inteligente** solo cuando es necesario
- 📊 **Reportes detallados** en JSON

## Instalación

```bash
pip install -r requirements.txt
```

## Configuración

Necesitas una API key de OpenAI:

```bash
export OPENAI_API_KEY="tu-api-key-aqui"
```

## Uso

### Análisis básico (solo reportar, no modificar archivos)
```bash
python classify_sprites.py
```

### Eliminar duplicados y renombrar automáticamente
```bash
python classify_sprites.py --auto-rename
```

### Opciones disponibles
```bash
python classify_sprites.py --help
```

**Parámetros:**
- `--path`: Ruta base del proyecto (default: directorio actual)
- `--api-key`: API key de OpenAI (o usar variable de entorno)
- `--no-duplicates`: No eliminar duplicados
- `--auto-rename`: Renombrar y mover archivos automáticamente
- `--report`: Nombre del archivo de reporte (default: sprite_report.json)

## Categorías de Clasificación

El script clasifica sprites en estas categorías basadas en tu estructura existente:

- **buildings**: Edificios, estructuras, construcciones
- **nature**: Árboles, plantas, vegetación
- **ground**: Suelos, terrenos, pisos, texturas de fondo
- **water**: Agua, ríos, estanques
- **roads**: Carreteras, caminos, vías
- **sprites**: Personajes, entidades, objetos móviles
- **animations**: Archivos de animación

## Ejemplo de Ejecución

```bash
🎮 Clasificador de Sprites con IA
========================================
Ruta base: /path/to/duo-eterno/public
Eliminar duplicados: True
Renombrar automático: True

🔍 Iniciando análisis de imágenes...
Encontradas 847 imágenes

🔍 Detectando duplicados...
Encontrados 12 grupos de duplicados
Duplicados encontrados:
  Mantener: assets/buildings/tile_0003_edificio_comercial.png
  Eliminado: assets/buildings/tile_0007_edificio_comercial.png

🤖 Clasificando imágenes con IA...

[1/835] Procesando: tile_0002_arbol_grande.png
  Categoría actual: nature
  Categoría sugerida: nature (confianza: 0.98)
  Descripción: Árbol grande con follaje frondoso, ideal para escenas naturales

[2/835] Procesando: pattern_kitchen.png
  Categoría actual: sprites  
  Categoría sugerida: ground (confianza: 0.89)
  Descripción: Patrón repetitivo de cocina para texturas de fondo
  Movido: assets/sprites/pattern_kitchen.png -> assets/ground/kitchen_pattern.png

📊 RESUMEN DEL PROCESAMIENTO
============================================================
Imágenes clasificadas: 835
Duplicados eliminados: 23
Archivos renombrados/movidos: 45
Errores: 0

📈 Distribución por categorías:
  buildings: 287 imágenes
  ground: 198 imágenes
  nature: 156 imágenes
  roads: 89 imágenes
  water: 76 imágenes
  sprites: 29 imágenes

📄 Reporte guardado en: sprite_report.json
```

## Ventajas del Script

1. **Inteligente**: Usa GPT-4 Vision para entender realmente el contenido de cada imagen
2. **Conservador**: Solo renombra cuando realmente es necesario
3. **Seguro**: Nunca sobrescribe archivos existentes
4. **Informativo**: Proporciona reportes detallados de todas las acciones
5. **Eficiente**: Detecta duplicados exactos y perceptuales
6. **Flexible**: Modo de solo análisis o modificación automática

## Archivo de Reporte

El script genera un reporte JSON detallado con:
- Resumen estadístico
- Lista de archivos clasificados con confianza
- Duplicados eliminados
- Archivos renombrados/movidos
- Errores encontrados

## Notas de Seguridad

- El script **NUNCA** sobrescribe archivos existentes
- Modo de solo análisis por defecto (no modifica nada)
- Crea respaldos implícitos al mover archivos
- Valida categorías para evitar errores de clasificación