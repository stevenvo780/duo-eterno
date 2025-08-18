# 🎬 Sistema de Sprites y Animaciones - Duo Eterno

## 📋 Resumen

He implementado un sistema completo de sprites animados que transforma las entidades estáticas del juego en personajes animados dinámicos. El sistema incluye:

### ✨ Características Principales

#### 🎭 Entidades Animadas
- **Círculo y Cuadrado animados**: Sprites con animaciones basadas en estado emocional
- **Estados disponibles**: Happy (feliz), Sad (triste), Dying (muriendo)
- **Transiciones automáticas**: Las animaciones cambian según el mood de la entidad
- **Optimización de rendimiento**: Sistema de cache y renderizado eficiente

#### 📁 Sistema Dinámico de Assets
- **Carga por carpeta**: Assets organizados automáticamente por nombre de carpeta
- **Manifest generado**: Script que detecta automáticamente sprites y animaciones
- **400+ assets**: Sprites estáticos de activities, ambient, food, ground, etc.
- **6 animaciones**: Animaciones JSON para entidades circulo y cuadrado

#### 🔧 Herramientas de Desarrollo
- **Script automático**: `npm run sprite-loader` genera manifest de assets
- **Demo interactiva**: Página de demostración de animaciones
- **Debug mejorado**: Información de assets y animaciones cargadas

## 🚀 Uso

### Ejecutar el Juego
```bash
npm run dev
```

### Generar Manifest de Assets
```bash
npm run sprite-loader
```

### Ver Demo de Animaciones
1. Ejecutar `npm run dev`
2. Hacer clic en "🎬 Demo Sprites" en la esquina superior derecha
3. Explorar las animaciones y características del sistema

## 📂 Estructura de Archivos

### Nuevos Componentes
- `src/components/AnimatedSprite.tsx` - Componente base para sprites animados
- `src/components/AnimatedEntity.tsx` - Entidades con animaciones inteligentes
- `src/components/SpriteDemoPage.tsx` - Página de demostración

### Nuevos Sistemas
- `src/utils/spriteAnimationManager.ts` - Gestor principal de animaciones
- `scripts/sprite-animation-loader.js` - Script de carga automática
- `src/generated/` - Archivos TypeScript generados automáticamente

### Assets de Animación
```
public/assets/animations/entities/
├── entidad_circulo_happy_anim.json
├── entidad_circulo_happy_anim.png
├── entidad_circulo_sad_anim.json
├── entidad_circulo_sad_anim.png
├── entidad_circulo_dying_anim.json
├── entidad_circulo_dying_anim.png
├── entidad_square_happy_anim.json
├── entidad_square_happy_anim.png
├── entidad_square_sad_anim.json
├── entidad_square_sad_anim.png
├── entidad_square_dying_anim.json
└── entidad_square_dying_anim.png
```

## 🎯 Cómo Funciona

### 1. Detección Automática
El script `sprite-animation-loader.js` explora recursivamente la carpeta `public/assets/` y:
- Detecta archivos `*_anim.json` con metadatos de animación
- Busca los archivos PNG correspondientes
- Encuentra sprites estáticos sin animación
- Genera un manifest TypeScript con toda la información

### 2. Carga Dinámica
```typescript
// Cargar animación específica
const animation = await spriteAnimationManager.loadAnimation('entidad_circulo_happy', 'animations');

// Cargar todos los assets de una carpeta
const assets = await assetManager.loadAssetsByFolderName('activities');

// Buscar assets por patrón
const results = await assetManager.searchAssetsByPattern('circulo');
```

### 3. Animaciones Inteligentes
Las entidades cambian automáticamente de animación basándose en:
- **Estado de salud**: `dying` cuando health ≤ 10
- **Estado de ánimo**: `happy`, `sad`, `content`, etc.
- **Actividad actual**: Indicadores visuales adicionales

### 4. Rendimiento Optimizado
- **Cache inteligente**: Evita cargar el mismo asset múltiples veces
- **Carga bajo demanda**: Solo carga assets cuando se necesitan
- **Renderizado eficiente**: Canvas optimizado para animaciones de sprites

## 📊 Estadísticas del Sistema

### Assets Detectados
- **🎬 6 animaciones totales**
- **🖼️ 397 sprites estáticos**
- **📁 10 carpetas principales**
- **🎭 2 entidades con animaciones** (círculo y cuadrado)

### Carpetas de Assets
- `activities/` - 137 sprites (actividades del juego)
- `ambient/` - 72 sprites (elementos ambientales)
- `animations/` - 6 animaciones + 19 sprites estáticos
- `buildings/` - 12 sprites (edificios)
- `food/` - 102 sprites (comida)
- `ground/` - 35 sprites (terrenos)
- `nature/` - 17 sprites (naturaleza)
- `water/` - 3 sprites (agua)

## 🔮 Características Avanzadas

### Metadatos de Animación
Cada animación incluye metadatos detallados:
```json
{
  "name": "pulse",
  "frame_count": 12,
  "frame_size": [32, 32],
  "columns": 8,
  "rows": 2,
  "total_duration": 960,
  "loop": true,
  "frames": [{"duration": 80}, ...]
}
```

### Tipos TypeScript Generados
El sistema genera automáticamente tipos específicos:
```typescript
export type AnimationId = 'entidad_circulo_happy' | 'entidad_circulo_sad' | ...;
export type EntityType = 'circulo' | 'square';
export type AnimationState = 'happy' | 'sad' | 'dying';
```

### Sistema de Estados
Las animaciones responden a cambios de estado:
- **Prioridad**: dying > mood states > default happy
- **Transiciones suaves**: Sin interrupciones bruscas
- **Callbacks**: Eventos al completar animaciones

## 🛠️ Personalización

### Añadir Nuevas Animaciones
1. Crear archivos `nombre_anim.json` y `nombre_anim.png` en `public/assets/animations/entities/`
2. Ejecutar `npm run sprite-loader` para regenerar el manifest
3. Las animaciones estarán disponibles automáticamente

### Añadir Nuevas Entidades
1. Crear sprites siguiendo el patrón `entidad_[tipo]_[estado]_anim.*`
2. Actualizar `AnimatedEntity.tsx` para mapear el nuevo tipo
3. El sistema detectará automáticamente las animaciones

### Configurar Nuevas Carpetas
1. Añadir sprites a cualquier carpeta en `public/assets/`
2. Ejecutar `npm run sprite-loader`
3. Usar `assetManager.loadAssetsByFolderName('nombre_carpeta')`

## 🎉 Resultado Final

El sistema transforma el juego de entidades estáticas a un mundo dinámico con:
- ✅ Círculos y cuadrados que pulsan cuando están felices
- ✅ Animaciones flotantes cuando están tristes  
- ✅ Efectos de muerte dramáticos
- ✅ Carga automática de 400+ assets organizados
- ✅ Demo interactiva para explorar características
- ✅ Sistema escalable para futuras expansiones

### Demo en Vivo
Accede a la demo haciendo clic en "🎬 Demo Sprites" en el juego para ver todas las animaciones en acción y explorar las capacidades del sistema.

---

*Sistema implementado con TypeScript, React, Canvas API y optimizaciones de rendimiento para una experiencia fluida.*
