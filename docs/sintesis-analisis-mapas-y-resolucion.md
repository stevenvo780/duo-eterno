# Síntesis de análisis: Generación de mapas, visualización y resolución de sprites

## Objetivo
Consolidar hallazgos y plan de acción para: (1) por qué la generación/visualización del mapa se percibe pobre y (2) cómo se manejan tamaños/resoluciones de sprites.

## Métricas de éxito (SLOs)
- FPS: ≥ 55 FPS en viewport 1280×720 con ≥ 5k tiles visibles y ≥ 300 objetos estáticos.
- TTFMP (tiempo a primer frame pintado): ≤ 1200 ms en frío; generación de mapa: ≤ 400 ms.
- Memoria pico imágenes: ≤ 150 MB; imágenes decodificadas simultáneas: ≤ 600.
- Nitidez pixel-art: imageSmoothing=false en todos los contextos; factor de escala entero; 0 subpíxeles en bordes en prueba de 200% zoom.

## Diccionario de términos
- WORLD_SIZE (px): tamaño del mundo en píxeles.
- TILE_SIZE (px): tamaño del tile base en píxeles (64 por defecto).
- Tile coords: enteros en la grilla (x,y) en tiles; Pixel coords: en píxeles.
- Road/Path: vía renderizada en capa road; Play zone: zona de juego, NO una vía.
- Escala entera: factor de zoom integer-only para evitar blur.

## Resumen ejecutivo
- Estado fragmentado: el estado del juego usa zonas/elementos por defecto, mientras el render genera su propio terreno y los generadores unificados/orgánicos no están cableados.
- Cámara y mundo desalineados: cámara inicia lejos del contenido y hay objetos sembrados fuera del área de terreno, forzando a "buscar en las esquinas".
- Calles mal tipadas/rendereadas: las calles orgánicas llegan como `play_zone` y no como tipo de vía; no hay renderer específico de caminos.
- Resolución de sprites: normalización rígida a 64 px, doble carga de imágenes, smoothing activo y fallbacks agresivos (128/64/32/48) que distorsionan escala.

## Evidencia (código y rutas)
- Estado/generación
  - `src/state/GameContext.tsx`: acciones `GENERATE_NEW_MAP`/`RESET_GAME` usan `createDefaultZones`/`createDefaultMapElements`.
  - `src/utils/mapGeneration.ts`: define defaults y `generateEnhancedMap` (no usado por el reducer).
  - `src/utils/unifiedMapGeneration.ts`: genera `terrainTiles` y aplica assets, pero no está cableado al estado.
  - `src/utils/organicMapGeneration.ts`: Voronoi/Perlin/Poisson; devuelve calles como `play_zone`.
- Renderizado
  - `src/utils/rendering/MapRenderer.ts`: en `initialize` genera terreno según extents de zonas, no desde `terrainTiles` unificado.
  - `src/utils/rendering/TileRenderer.ts`: `TILE_SIZE=64`; selección por heurística de nombre; smoothing no desactivado.
  - `src/utils/rendering/ObjectRenderer.ts`:
    - `BASE_RESOLUTION=64`; `detectImageResolution` recarga imagen; clamp [24,192].
    - `getAssetSize` usa fallbacks (structures 128, natural 64, furniture 64, decoration 32, animated 48) si no cargó.
    - `generateRandomDecorations` siembra hasta 4000x3000.
  - `src/utils/rendering/EntityAnimationRenderer.ts`: fallback de animación asume frames 64x64 sin inferir del PNG.
- Navegación/cámara
  - `src/components/NavigableGameCanvas.tsx`: mundo 4000x3000; `initialX=1000`, `initialY=750`, `initialZoom=1`.
  - `src/config/gameConfig.ts`: posiciones iniciales entidades (200,200) y (600,300).

## Hallazgos detallados
1) Pipeline de mapa inconexo
- El estado no usa el generador unificado/orgánico; el renderer genera su propio terreno, creando duplicidad e incoherencias.
- Las calles no tienen tipo/renderer propio; llegan como `play_zone` y no se dibujan como caminos.

2) Visualización/cámara
- Inicialización fija de cámara no considera el bounding box del contenido (zonas/entidades) ni hace fit-to-content.
- Objetos decorativos se esparcen fuera del terreno generado, visibles solo al alejarse/ir a bordes.

3) Resolución de sprites/animaciones
- Normalización a 64 px con smoothing activo difumina pixel art; los fallbacks antes de cargar imagen agrandan/reducen sin criterio consistente.
- Doble carga (`Image` en asset manager y otra en `detectImageResolution`) penaliza rendimiento.
- Animaciones suponen frames 64x64, generando desbordes si el spritesheet real difiere.

## Diferencias con sistemas conocidos
- Generadores coherentes (Rogue, RimWorld-like) definen una fuente única de verdad: tiles y objetos consumidos por renderer y por gameplay.
- Render de pixel art desactiva smoothing y usa escalado entero; tamaños derivados de dimensiones reales del asset/spritesheet.

## Contratos de datos (TypeScript)
```ts
export interface TerrainTile {
  x: number; y: number; // coords en tiles
  biome: string;
  kind: 'grass'|'water'|'rock'|'sand';
  variant?: string;
  edgeMask?: number; // bitmask 4-dir para transiciones
}
export type RoadKind = 'path'|'road'|'bridge'
export interface RoadPolyline {
  id: string; kind: RoadKind; width: number; // en tiles
  points: Array<{ x: number; y: number }>; // coords en tiles
}
export enum ZLayer {
  TerrainBase, Autotile, Water, Roads, Decals, GroundObject, Structure, Canopy, Overlay
}
export interface AssetMetadata {
  id: string; path: string;
  scale_base_px: 32|48|64|96|128;
  naturalWidth: number; naturalHeight: number;
  anchor: { x: number; y: number };
  zLayer: ZLayer; biomes?: string[];
  rules?: Record<string, unknown>;
}
```

## Especificaciones de render clave
### RoadRenderer (conectividad por bitmask)
- Vecindad 4-direcciones (N=1, E=2, S=4, W=8). Selección por `mask`:
  - 1,2,4,8 → `end_{n|e|s|w}`
  - 5 (N+S) → `straight_v`; 10 (E+W) → `straight_h`
  - 3 (N+E) → `curve_ne`; 6 (E+S) → `curve_se`; 12 (S+W) → `curve_sw`; 9 (W+N) → `curve_nw`
  - 7 (N+E+S) → `t_w`; 11 (E+S+W) → `t_n`; 14 (S+W+N) → `t_e`; 13 (W+N+E) → `t_s`
  - 15 → `cross`
- Ancho (`width>1`): rasterizar offsets laterales en tiles; usar decals de borde para suavizar vértices.
- Orden de capa: tras `Water`, antes de `Decals`.

### Autotiles (bordes y esquinas)
- Fase 1 (bordes 4-neighbors): calcular `edgeMask` (0..15) para `edge_{n|e|s|w}`.
- Fase 2 (esquinas 8-neighbors): si `edge_n && edge_e` → `corner_ne`, etc.
- Prioridad: corner > edge; resolver en orden determinista para evitar parpadeos.
- Tests: 16 patrones de mask + 4 esquinas con Vitest (snapshot de nombres).

## Cámara y pixel-perfect
- Escala: `scale = Math.max(1, Math.floor(min(viewW/worldW, viewH/worldH) * devicePixelRatio))` ajustada a múltiplos de `TILE_SIZE`.
- Panning: posiciones en píxeles enteros; clamp a bbox del mundo.
- Smoothing: `imageSmoothingEnabled=false` en todos los contextos (principal y offscreen).
- DoD: captura a 200% sin blur; líneas verticales/horizontales nítidas.

## Preload y presupuesto de carga
- Lotes: ≤ 24 imágenes por ciclo; usar `HTMLImageElement.decode()` y `requestIdleCallback`.
- Orden de categorías: `terrain/base` → `terrain/autotiles` → `roads` → `decals` → `foliage` → `structures` → `animated`.
- Cancelación: abortar cargas si cambia `mapSeed` o la escena.
- Telemetría: tiempo por decode, bytes estimados, fallos.

## Observabilidad y QA
- Eventos mínimos: 
  - `map:generated{seed,tiles,roads,ms}`
  - `render:frame{dt,drawnTiles,drawnSprites}`
  - `asset:decoded{path,ms,bytes}`
  - `roadRenderer:placed{straight,curve,t,cross,end}`
- Pruebas automatizadas:
  - Unitarias: bitmask road/autotile; función de escala entera.
  - Visuales (Playwright): 3 seeds (coast/forest/urban), diff ≤ 0.5%.
  - Rendimiento: `performance.mark/measure` por capa.

## Plan de remediación (fases y dependencias)
F1 — Fuente única de verdad + cámara
- `src/state/GameContext.tsx`: usar `generateUnifiedMap({ seed, width, height, tileSize: 64 })` para `GENERATE_NEW_MAP`/`RESET_GAME`.
- Estado expone: `terrainTiles`, `roads`, `poi`, `objectLayers` y `WORLD_SIZE` único.
- `NavigableGameCanvas`: fit-to-content inicial; clamp por WORLD_SIZE.

F2 — Asset manager y pixel-art
- `modernAssetManager`: persistir `naturalWidth/Height`, `scale_base_px`, `anchor`, `zLayer`, `biomes`, `rules`; fusionar `asset-metadata.json` (nuevo) o `generated/asset-analysis.json`.
- Desactivar smoothing en todos los ctx; escalado entero; eliminar `detectImageResolution` en `ObjectRenderer`.

F3 — Autotiles y RoadRenderer (con tests)
- `TileRenderer`: aplicar `edgeMask` 4-dir y esquinas 8-dir; cubrir 16+4 casos.
- `RoadRenderer` nuevo: raster por bitmask 4-dir y ancho; ordenar capas.
- Vitest: unit tests de mapping; fixtures mínimos de masks.

F4 — Población, culling y observabilidad
- Poisson-disc por bioma; respetar reglas nearWater/slope; evitar solapes.
- Quadtree y culling por viewport para objetos estáticos.
- Eventos/metrics y logs ≤ 10 líneas.

F5 — Preload presupuestado y limpieza
- Lotes, decode, idle-callback; límites de memoria y concurrencia.
- Retirar fallbacks legacy y normalizaciones agresivas.

## Migración, compatibilidad y flags
- Feature flags: `renderer.road`, `renderer.autotile`, `camera.fitToContent`, `assets.pixelPerfect`, `compatMode` (tamaños legacy).
- Plan reversible: cambios agrupados por módulo; cada fase mergeable/rollback en 1 commit.
- Seeds: versionar el generador en estado; anotar incompatibilidades.

## Riesgos
- Escala percibida tras cambiar sizing → mitigar con `compatMode` y preset de escala.
- Semillas previas incompatibles → versionar y comunicar.
- Fit-to-content con zoom/pan manual → transición suave.

## Checklist de validación (UI/API)
- Mapa usa `generateUnifiedMap`; `terrainTiles` presentes en renderer; `WORLD_SIZE` único.
- Cámara centrada en contenido; "centrar en entidad" operativo.
- Sprites nítidos: smoothing off, escalas enteras; sin doble carga.
- Animaciones con tamaño de frame real; sin recortes.
- Caminos visibles (straight/curve/T/cross/end) y orden de capas correcto.
- Telemetría activa; SLOs cumplidos en entorno local.

## Catálogo de assets organizado y cómo aprovecharlo
- Carpetas reales disponibles:
  - `terrain/base`, `terrain/autotiles`, `roads`, `cliffs`, `decals`, `foliage/trees`, `foliage/shrubs`, `mushrooms`, `rocks`, `ruins`, `props`, `structures`, `water`, `animated_entities`.
- Uso recomendado en el loader/preload:
  - Preload por carpetas: `['terrain/base','terrain/autotiles','roads','cliffs','decals','foliage/trees','foliage/shrubs','mushrooms','rocks','ruins','props','structures','water','animated_entities']`.
  - Consumir categorías dinámicas de `src/generated/asset-analysis.json` (ej.: `ROADS.all`, `CLIFFS.all`, `DECALS.all`) via `modernAssetManager`.
- Convenciones de nombres: `lower_snake_case`.
- Fallbacks visuales ya incluidos: caminos “path”, bordes de agua/cesped, parches (decals) y caras de acantilado.

## Problemas actuales (exhaustivo)
- Generación
  - Reducer usa defaults; `unified/organic` no cableados; `terrainTiles` no circula al renderer.
  - Calles llegan con tipo `play_zone`; no existe `RoadRenderer` ni capa road.
  - Decoración aleatoria se siembra hasta 4000x3000 independientemente del terreno real.
  - Selección de tile de terreno por heurística de nombre: sin transiciones ni biomas reales.
- Estado/Coordenadas
  - No hay `WORLD_SIZE` único compartido; límites de cámara y generador divergen.
- Render/Assets
  - `ObjectRenderer` normaliza a 64 px, con fallbacks agresivos si la imagen aún no está lista.
  - Doble carga de imágenes para detectar resolución; falta persistir `naturalWidth/Height` en `Asset`.
  - `imageSmoothing` no se desactiva; animaciones asumen frames 64x64 sin inferencia del PNG.
  - Ausencia de `RoadRenderer`; orden de capas limitado; sombras simplistas.
- Navegación
  - Cámara inicia fija sin fit-to-content; no hay acción de “centrar en entidad/contenido”.

## Fuera de alcance (esta iteración)
- Iluminación dinámica avanzada y WebGL.
- Biomas avanzados con reglas complejas y LOD de vegetación más allá de lo descrito.

## Aceptación y checklist final
- Estado expone `terrainTiles`, `roads`, `objectLayers` y `WORLD_SIZE`; renderer no genera terreno propio.
- Cámara centrada y clamps correctos; acción de “centrar en entidad”.
- Pixel-art nítido (smoothing off), escalado entero; sin doble carga.
- Caminos visibles y ordenados; objetos sin solapes notorios; Poisson por bioma aplicado.
- Seeds reproducibles; métricas registradas; SLOs cumplidos; capturas archivadas (vista general + zoom 200%).
