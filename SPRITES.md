# Sistema de Sprites - Duo Eterno

## 🎨 Descripción

Este proyecto utiliza un sistema de sprites de pixel art generados proceduralmente para crear todos los elementos visuales del juego. Los sprites se generan automáticamente usando el script `create-pixel-art.py` y se almacenan en `/public/assets/sprites/`.

## 📁 Estructura

```
public/assets/sprites/
├── barra_estadistica.png      # Barras de estadísticas
├── canvas_base.png            # Fondo base del canvas
├── conexion_entidades.png     # Efectos de conexión
├── dialogo_overlay.png        # Overlay para diálogos
├── entidad_*.png             # Sprites de entidades (círculo/cuadrado)
├── pattern_*.png             # Patrones para zonas
├── furniture_*.png           # Mobiliario
├── plant_*.png               # Plantas y naturaleza
├── deco_*.png                # Elementos decorativos
├── path_*.png                # Caminos
└── obstaculo_*.png           # Obstáculos
```

## 🛠️ Comandos Disponibles

### Generar todos los sprites
```bash
npm run generate-sprites
```

### Verificar sprites existentes
```bash
npm run verify-sprites
```

### Generar sprites específicos
```bash
python3 scripts/create-pixel-art.py sprites "sprite1,sprite2,sprite3" public/assets/sprites
```

### Generar patrones de fondo
```bash
python3 scripts/create-pixel-art.py patterns all public/assets/sprites
```

## 🎮 Sprites Disponibles

### Interface y UI
- `barra_estadistica` - Barras de progreso/estadísticas
- `canvas_base` - Fondo con grid del juego
- `conexion_entidades` - Efectos de conexión entre entidades
- `dialogo_overlay` - Marco para diálogos

### Entidades
- `entidad_circulo_happy` - Entidad circular feliz
- `entidad_circulo_sad` - Entidad circular triste
- `entidad_circulo_dying` - Entidad circular muriendo
- `entidad_square_happy` - Entidad cuadrada feliz
- `entidad_square_sad` - Entidad cuadrada triste  
- `entidad_square_dying` - Entidad cuadrada muriendo

### Patrones de Zonas
- `pattern_kitchen` - Patrón para zona de comida
- `pattern_bedroom` - Patrón para zona de descanso
- `pattern_living` - Patrón para zona social/juego
- `pattern_garden` - Patrón para zona de jardín
- `pattern_stone` - Patrón de piedra
- `pattern_tiles_only` - Patrón de azulejos simples

### Mobiliario
- `furniture_bed_simple` - Cama individual
- `furniture_bed_double` - Cama doble
- `furniture_sofa_modern` - Sofá moderno
- `furniture_sofa_classic` - Sofá clásico
- `furniture_table_coffee` - Mesa de centro
- `furniture_table_dining` - Mesa de comedor

### Plantas y Naturaleza
- `plant_small` - Planta pequeña en maceta
- `plant_tree` - Árbol
- `plant_flower` - Planta con flores
- `flor_rosa` - Rosa decorativa

### Decoración
- `deco_lamp` - Lámpara de mesa
- `deco_clock` - Reloj
- `deco_bookshelf` - Estantería con libros
- `banco` - Banco/asiento
- `lampara` - Lámpara de pie
- `fuente_agua` - Fuente de agua

### Caminos y Obstáculos
- `path_stone_h` - Camino de piedra horizontal
- `path_stone_v` - Camino de piedra vertical
- `path_brick_h` - Camino de ladrillos horizontal
- `path_dirt_h` - Camino de tierra horizontal
- `obstaculo_arbol` - Árbol como obstáculo
- `obstaculo_roca` - Roca como obstáculo

## 🎨 Paleta de Colores

El sistema utiliza la paleta DB32 (DawnBringer 32 colors) para mantener consistencia visual:

- **Maderas**: Tonos marrones para muebles
- **Metales**: Grises y plateados para elementos metálicos
- **Tejidos**: Azules y púrpuras para elementos suaves
- **Naturaleza**: Verdes para plantas y elementos orgánicos
- **Acentos**: Dorados y colores vibrantes para elementos especiales

## 🔧 Desarrollo

### Añadir un nuevo sprite

1. Agregar la función generadora en `scripts/create-pixel-art.py`:
```python
def g_mi_nuevo_sprite(tile=32, seed=1):
    w, h = tile, tile
    im = img_rgba(w, h)
    d = ImageDraw.Draw(im)
    # ... lógica de dibujo ...
    return quantize_db32(im)
```

2. Registrar en el diccionario `SPRITES`:
```python
SPRITES = {
    # ... otros sprites ...
    "mi_nuevo_sprite": g_mi_nuevo_sprite,
}
```

3. Añadir a la lista en `OptimizedCanvas.tsx`:
```typescript
const assetsToLoad = [
    // ... otros assets ...
    'mi_nuevo_sprite',
];
```

4. Regenerar sprites:
```bash
npm run generate-sprites
```

5. Verificar:
```bash
npm run verify-sprites
```

### Personalizar sprites existentes

Edita las funciones en `scripts/create-pixel-art.py` y regenera:

```bash
python3 scripts/create-pixel-art.py sprites "sprite_especifico" public/assets/sprites
```

## 📱 Uso en Componentes

```typescript
// En OptimizedCanvas.tsx
const sprite = loadedImages[spriteKey];
if (sprite && sprite.complete) {
  ctx.drawImage(sprite, x, y, width, height);
}
```

## ✅ Verificación de Integridad

El script `verify-sprites.cjs` verifica que todos los sprites requeridos estén disponibles:

- ✅ 100% de cobertura requerida
- 🔍 Detecta sprites faltantes automáticamente
- 💡 Proporciona comandos de regeneración específicos

## 🚀 Optimizaciones

- **Pixel Perfect**: Todos los sprites son de 32x32 píxeles base
- **Paleta Limitada**: DB32 para optimización de tamaño
- **Carga Lazy**: Solo se cargan los sprites necesarios
- **Fallbacks**: Sistema de respaldo si falla la carga
- **Cache Friendly**: URLs estáticas para mejor caching

## 📊 Estadísticas Actuales

- **Total de sprites**: 38
- **Cobertura**: 100%
- **Tamaño promedio**: ~2-4KB por sprite
- **Paleta**: DB32 (32 colores)
- **Resolución base**: 32x32 píxeles
