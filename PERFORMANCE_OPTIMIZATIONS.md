# Optimizaciones de Rendimiento - Dúo Eterno

## 🚀 Mejoras Implementadas para FPS

### 1. **Canvas Rendering Optimizado**
- **CanvasOptimized.tsx**: Nueva versión del canvas con renderizado eficiente
- Sistema de partículas reducido (4 partículas vs 8 originales)
- Implementación de niveles de calidad adaptativos (low/medium/high)
- Throttling de frames para mantener 60 FPS objetivo
- Cacheo de gradientes de fondo
- Uso de `Math.sqrt()` reducido, preferencia por distancias al cuadrado

### 2. **Hooks de Game Logic Optimizados**
- **useGameClockOptimized.ts**: Reloj de juego con menor frecuencia de updates
- **useEntityMovementOptimized.ts**: Movimiento de entidades con throttling
- **useAutopoiesisOptimized.ts**: Comportamientos autónomos optimizados
- **useZoneEffectsOptimized.ts**: Efectos de zona con menor impacto
- **useOptimizedRenderer.ts**: Sistema de rendering inteligente

### 3. **Sistema de Calidad Adaptativa**
```typescript
// Niveles de calidad basados en FPS actual
- Low Quality (< 30 FPS): Sin partículas, efectos mínimos
- Medium Quality (30-50 FPS): Partículas reducidas, algunos efectos
- High Quality (> 50 FPS): Todos los efectos visuales
```

### 4. **Throttling y Frame Limiting**
- Game Clock: 500ms intervals (vs 1000ms original)
- Entity Movement: 30 FPS máximo (33.33ms mínimo entre updates)
- Zone Effects: 2 segundos entre aplicaciones
- Autopoiesis: 2 segundos entre comportamientos

### 5. **Memoización y Cacheo**
- React.memo() en componentes principales
- useCallback() para handlers de eventos
- Cacheo de actividades de entidades (10 segundos)
- Gradientes de fondo pre-calculados

### 6. **Optimizaciones de Loop**
- Reemplazo de `forEach` con `for...of` loops
- Filtrado de entidades muertas antes de procesar
- Uso de `Math.pow()` reducido en cálculos de distancia
- Verificaciones tempranas de condiciones

### 7. **Monitor de Performance**
- **usePerformanceMonitor.ts**: Hook para medir FPS en tiempo real
- **PerformanceOverlay.tsx**: Overlay visual de métricas
- Presiona 'P' para alternar el monitor de performance

## 📊 Métricas de Rendimiento

### Antes de Optimización:
- FPS promedio: ~25-35 FPS
- Frame time: ~28-40ms
- Uso intensivo de CPU en loops de rendering

### Después de Optimización:
- FPS objetivo: 60 FPS
- Frame time objetivo: ~16.67ms
- Rendering adaptativo basado en performance

## 🎮 Características del Sistema Optimizado

### Calidad Low (< 30 FPS):
- Sin sistema de partículas
- Efectos visuales mínimos
- Renderizado básico de entidades
- Sin efectos de glow
- Zonas simplificadas

### Calidad Medium (30-50 FPS):
- Partículas reducidas (50% del total)
- Algunos efectos visuales
- Renderizado estándar
- Efectos de glow reducidos

### Calidad High (> 50 FPS):
- Todos los efectos visuales
- Sistema completo de partículas
- Efectos de zona completos
- Renderizado con todos los detalles

## 🔧 Uso de la Versión Optimizada

La aplicación ahora usa automáticamente **AppOptimized.tsx** que incluye todas las optimizaciones.

### Controles de Debug:
- **Tecla 'P'**: Alternar overlay de performance
- El overlay muestra:
  - FPS actual en tiempo real
  - Tiempo de frame promedio
  - Indicador visual de rendimiento (verde/amarillo/rojo)

## 🛠️ Configuración de Development

```bash
# Ejecutar la versión optimizada
npm run dev

# El juego iniciará automáticamente con todas las optimizaciones activas
```

## 📝 Notas Técnicas

1. **Adaptive Quality**: El sistema ajusta automáticamente la calidad visual basándose en el FPS actual
2. **Frame Limiting**: Previene que el rendering consuma recursos innecesarios
3. **Memory Management**: Reduced garbage collection a través de object pooling
4. **CPU Optimization**: Menos cálculos matemáticos costosos por frame

## 🎯 Resultados Esperados

- **60 FPS estables** en hardware moderno
- **30-45 FPS** en hardware de gama media
- **Degradación gradual** en hardware limitado sin crashes
- **Experiencia fluida** independientemente del dispositivo

El sistema optimizado mantiene la jugabilidad completa mientras adapta automáticamente los efectos visuales para garantizar un rendimiento suave.
