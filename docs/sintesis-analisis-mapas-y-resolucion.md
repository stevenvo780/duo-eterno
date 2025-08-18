# Síntesis de análisis: Generación de mapas, visualización y resolución de sprites

## Objetivo
Consolidar hallazgos y plan de acción para: (1) por qué la generación/visualización del mapa se percibe pobre y (2) cómo se manejan tamaños/resoluciones de sprites, validado contra el código actual del repo.

## Métricas de éxito (SLOs) — ajustadas a la realidad del código
- FPS: ≥ 55 FPS en viewport 1280×720 con carga típica del proyecto.
  - Tiles visibles esperados por TILE_SIZE actual: ≈240–300 (64px) o ≈800–900 (32px). No exigir ≥5k.
  - Objetos estáticos en cuadro: ≤ 150 (el juego es de 2 entidades; más no aporta valor).
- TTFMP (primer frame pintado): ≤ 1200 ms en frío; generación de mapa: ≤ 400 ms (sin streaming).
- Memoria pico imágenes: ≤ 150 MB; imágenes decodificadas simultáneas: ≤ 600.
- Nitidez pixel‑art: imageSmoothing=false en todos los contextos; escalas enteras; 0 subpíxeles en bordes a 200% zoom.

## Diccionario de términos
- WORLD_SIZE (px): tamaño del mundo en píxeles (hoy INCOHERENTE entre módulos; ver Hallazgos).
- TILE_SIZE (px): tamaño base del tile.
  - Render 2D actual (`TileRenderer`): 64 px.
  - Generador unificado (`UnifiedMapGenerator`): 32 px por defecto.
- Tile coords: enteros en grilla; Pixel coords: píxeles absolutos.
- Road/Path: vía en capa road; Play zone: zona de juego (no vía).
- Escala entera: zoom en múltiplos enteros (o discretos por DPR) para evitar blur.

## Resumen ejecutivo
- Fuente de verdad fragmentada: el estado usa defaults; el renderer genera su propio terreno; el generador unificado no alimenta al renderer.
- Cámara desalineada: inicia lejos y sin fit‑to‑content; hay objetos fuera del terreno visible.
- Calles mal tipadas/rendereadas: llegan como `play_zone`; no existe `RoadRenderer`.
- Resolución de sprites: normalización rígida a 64 px, smoothing activo y dobles cargas penalizan nitidez y rendimiento.
- Desajuste de TILE_SIZE: 64 (renderer) vs 32 (generador) — causa escalas y conteos inconsistentes.

## Estado del proceso (validado en código)
- Assets: carpetas en `public/assets` existentes: `animated_entities`, `cliffs`, `consumable_items`, `decals`, `entities`, `foliage`, `mushrooms`, `props`, `roads`, `rocks`, `ruins`, `structures`, `terrain`, `ui_icons`, `water`.
- Mapeo: `src/generated/asset-analysis.json` presente (OK), usado por `modernAssetManager`.
- Código (pendiente de alinear con taxonomía nueva):
  - Preload actual (legacy) en `src/components/GameCanvas.tsx`: `terrain_tiles`, `structures`, `natural_elements`, `water`, `furniture_objects`, `environmental_objects`.
  - Reducer no usa `generateUnifiedMap` aún.
  - No hay `RoadRenderer`; no hay autotiles; smoothing y cámara sin ajuste global.

## Evidencia precisa (archivo → comportamiento)
- Estado/generación
  - `src/state/GameContext.tsx`: acciones `GENERATE_NEW_MAP`/`RESET_GAME` mantienen `createDefaultZones`/`createDefaultMapElements`.
  - `src/utils/mapGeneration.ts`: expone `generateEnhancedMap` que sí llama a `generateUnifiedMap` pero no está cableado al reducer.
  - `src/utils/unifiedMapGeneration.ts`:
    - Default `tileSize: 32` en el constructor.
    - `preloadRequiredAssets()` aún carga legacy: `terrain_tiles`, `structures`, `environmental_objects`, `natural_elements`.
    - Genera `terrainTiles` (OK) pero con assets de `terrain_tiles`.
  - `src/utils/organicMapGeneration.ts`: las “calles mejoradas” emiten elementos `type: 'play_zone'` (no vías tipadas).
- Renderizado
  - `src/utils/rendering/MapRenderer.ts` → `initialize(sceneData)`: ignora `sceneData.terrainMap` y vuelve a generar terreno con `tileRenderer.generateTerrainMap(...)` según extents de zonas.
  - `src/utils/rendering/TileRenderer.ts`:
    - Usa `TILE_SIZE = 64` y carga `terrain_tiles`.
    - La selección usa heurística de nombre `cesped` (acoplamiento a nombres legacy).
  - `src/utils/rendering/ObjectRenderer.ts`:
    - Cargas legacy (`environmental_objects`, `furniture_objects`, etc.).
    - Detección de resolución recargando imágenes (doble carga).
  - `src/utils/rendering/EntityAnimationRenderer.ts` usa `animated_entities` (correcto).
- Navegación/cámara
  - `src/components/NavigableGameCanvas.tsx`: mundo fijo 4000×3000; `initialX/Y` fijos; sin fit‑to‑content.
  - `src/components/GameCanvas.tsx`: define `initialData.terrainMap` (2000×1500, 64px), pero `MapRenderer` no lo respeta al re‑generar.

## Hallazgos detallados
1) Pipeline de mapa inconexo
- No hay “única fuente de verdad”: el renderer re‑genera terreno; `terrainTiles` del generador unificado no llegan al renderer.
- Sin tipado/render específico de caminos: llegan como `play_zone` y no se dibujan como vías.

2) Visualización/cámara
- Inicio fijo sin considerar bbox de zonas/entidades; no hay fit‑to‑content ni clamp por WORLD_SIZE coherente.
- Objetos decorativos pueden caer fuera del terreno generado (doble fuente de extents).

3) Resolución de sprites/animaciones
- Normalización a 64 px con smoothing activo → blur en pixel‑art.
- Doble carga: `AssetManager` y `ObjectRenderer.detectImageResolution` vuelven a cargar.
- Asunción rígida 64×64 en animaciones puede recortar spritesheets con columnas variables.

4) Desajuste de TILE_SIZE y WORLD_SIZE
- `TileRenderer` usa 64 px; `UnifiedMapGenerator` 32 px → tiles visibles y escalas inconsistentes.
- No existe un `WORLD_SIZE` único; `MapRenderer`, `GameCanvas` y navegación usan dimensiones distintas.

## Diferencias con sistemas coherentes
- Fuente única de verdad (tiles/objetos) consumida por renderer y gameplay.
- Pixel‑art con smoothing off y escalas enteras.

## Crítica al algoritmo de generación (baseline buena, no lista)
- Mantener enfoque: priorizar terreno→autotiles→roads; posponer POIs/plantillas avanzadas.
- Biomas/ruido: FBM puro genera micro‑biomas; falta filtro mayoritario y, si aplica, domain warping suave.
- Agua/costas: aplicar mínimo open/close morfológico + blur antes de umbralizar.
- Caminos: mejor POIs→A* sobre costes (pendiente/agua) + suavizado (Catmull‑Rom) y jerarquía.
- Autotiles: bitmask 4‑dir + esquinas 8‑dir bien definida; evitar conflictos diagonales.
- Colocación de objetos: Poisson con máscaras de exclusión (agua/roads/structures) y clusters controlados.
- Determinismo: semillas por chunk/tipo para futura generación perezosa.
- Performance: sin streaming, limitar upfront; futuro chunking 64×64 y LRU.
- Metadatos de arte: degradar a heurísticas cuando no haya metadata.

## Contraste documento ↔ código: plan preciso por archivo
1) `src/state/GameContext.tsx`
- Cablear `GENERATE_NEW_MAP/RESET_GAME` a `await generateUnifiedMap({ seed, width: WORLD_SIZE.w, height: WORLD_SIZE.h, tileSize: 64, algorithm: 'organic' })`.
- Extender `GameState` con `terrainTiles`, `roads`, `objectLayers`, `worldSize`, `mapSeed`, `generatorVersion`.
- DoD: `terrainTiles.length>0`; zonas/mapElements presentes; seed reproducible.

2) `src/utils/rendering/MapRenderer.ts`
- `initialize(sceneData)`: eliminar generación interna; aceptar `terrainMap` o construirlo desde `sceneData.terrainTiles` con `TileRenderer.fromUnifiedTiles(tiles, TILE_SIZE)`.
- Añadir `setWorldBounds({w,h})` y exponer a navegación.
- Integrar `RoadRenderer.render(...)` entre `Water` y `Decals`.
- Forzar `ctx.imageSmoothingEnabled = false` en cada frame.
- DoD: no usar `tileRenderer.generateTerrainMap`; render desde datos externos.

3) `src/utils/rendering/TileRenderer.ts`
- Preload desde taxonomía nueva: `terrain` (y `terrain/autotiles` si existe), no `terrain_tiles`.
- Eliminar heurísticas por nombre (`cesped`).
- Añadir `fromUnifiedTiles(tiles, tileSize)` y `applyAutotiles(grid)` (bitmask 4+8 dir).
- DoD: render recibe `terrainMap` externo y bordes/esquinas correctos.

4) `src/utils/rendering/ObjectRenderer.ts`
- Sustituir carpetas legacy por: `foliage/*`, `mushrooms`, `rocks`, `ruins`, `props`, `structures`, `water`, `decals`, `animated_entities`.
- Usar `asset.image.naturalWidth/Height`; eliminar recarga y `resolutionCache` como fuente primaria.
- Restringir colocación al bbox del terreno o usar `placeObjectsByBiome` con máscaras.
- DoD: sin doble carga; sin objetos fuera de terreno.

5) `src/utils/modernAssetManager.ts`
- Extender `Asset` con `naturalWidth`, `naturalHeight`, `scale_base_px?`, `anchor?`, `zLayer?`.
- En `onload`, setear `naturalWidth/Height` y `loaded=true`.
- `preloadEssentialAssetsByFolders([...])` con carpetas reales de `public/assets`.
- Mantener compatibilidad con `asset-analysis.json`.
- DoD: `getStats()` refleja nuevas carpetas; assets con dimensiones naturales.

6) `src/utils/unifiedMapGeneration.ts`
- `preloadRequiredAssets()`: migrar a categorías reales (`terrain`, `roads`, `water`, `foliage/*`, `structures`, `decals`, `animated_entities`).
- `generateTerrainTiles()`: no depender de `terrain_tiles`; mapear a ids válidos de `terrain`/`water`.
- Exportar `roads: RoadPolyline[]` (aunque vacío) para `RoadRenderer`.
- DoD: `assetStats.terrainTiles>0`; categorías nuevas precargadas.

7) `src/components/NavigableGameCanvas.tsx`
- Reemplazar constantes por `WORLD_SIZE` del estado.
- Añadir fit‑to‑content (centrar bbox de zonas/entidades) y botón “Centrar contenido”.
- Snap de zoom a escalas enteras (considerar DPR) y clamp a WORLD_SIZE.
- DoD: inicia centrado; navegación sin “buscar en esquinas”.

8) `src/utils/rendering/EntityAnimationRenderer.ts`
- Mantener `animated_entities`.
- Inferir `frame_size` vía `image.naturalWidth/columns` cuando no haya metadata.
- DoD: sin recortes a 200% zoom.

9) Nuevo `src/utils/rendering/RoadRenderer.ts`
- Raster por bitmask (N=1,E=2,S=4,W=8) y anchos; usar assets de `assets/roads`.
- API: `render(ctx, roads, viewport, zoom)` y opcional `rasterToTiles()`.
- DoD: variantes straight/curve/T/cross/end conectadas.

## Cámara y pixel‑perfect
- Escala: `scale = max(1, floor(min(viewW/worldW, viewH/worldH) * DPR))` ajustada a múltiplos de TILE_SIZE.
- Panning: píxeles enteros; clamp a WORLD_SIZE.
- Smoothing off en todos los contextos (principal y offscreen).
- DoD: captura a 200% sin blur; bordes nítidos.

## Preload y presupuesto de carga
- Lotes: ≤ 24 imágenes/ciclo; usar `HTMLImageElement.decode()` y `requestIdleCallback`.
- Orden sugerido: `terrain` → `roads` → `decals` → `foliage` → `structures` → `animated`.
- Cancelación: abortar si cambia `mapSeed`/escena.
- Telemetría: decode ms, bytes estimados, fallos.

## Observabilidad y QA
- Eventos mínimos:
  - `map:generated{seed,tiles,roads,ms}`
  - `render:frame{dt,drawnTiles,drawnSprites}`
  - `asset:decoded{path,ms,bytes}`
  - `roadRenderer:placed{straight,curve,t,cross,end}`
- Pruebas:
  - Unitarias: bitmask road/autotile; función de escala entera.
  - Visuales: 3 seeds (coast/forest/urban), diff ≤ 0.5%.
  - Rendimiento: `performance.mark/measure` por capa.

## Plan de remediación (fases y dependencias)
F1 — Fuente única de verdad + cámara
- Reducer: cablear `generateUnifiedMap`; exponer `WORLD_SIZE` y tiles/roads.
- Renderer/TileRenderer: consumir tiles externos; fit‑to‑content.

F2 — Asset manager y pixel‑art
- `modernAssetManager` + `ObjectRenderer`: dimensiones naturales; smoothing off; taxonomía real.

F3 — Autotiles y RoadRenderer (con tests)
- `TileRenderer` + `RoadRenderer`: bitmask y capas.

F4 — Población, culling y observabilidad
- Poisson por bioma; quadtree; eventos.

F5 — Preload presupuestado y limpieza
- Lotes decode; retirar fallbacks legacy.

## Migración, compatibilidad y flags
- Feature flags: `renderer.road`, `renderer.autotile`, `camera.fitToContent`, `assets.pixelPerfect`, `compatMode` (tamaños legacy).
- Versionar generador; plan reversible por módulos.

## Riesgos
- Percepción de escala tras unificar TILE_SIZE → `compatMode` y preset de escala.
- Semillas previas incompatibles → versionar y comunicar.
- Fit‑to‑content vs pan manual → transición suave.

## Checklist de validación (UI/API)
- Reducer usa `generateUnifiedMap`; `terrainTiles` presentes en renderer; `WORLD_SIZE` único.
- Unificación de TILE_SIZE aplicada (64 o 32, pero única), y usada por renderer y generador.
- Cámara centrada; botón “centrar contenido” operativo; clamps correctos.
- Sprites nítidos: smoothing off, escalas enteras; sin doble carga.
- Animaciones con tamaño de frame real; sin recortes.
- Caminos visibles (straight/curve/T/cross/end) y orden de capas correcto.
- Telemetría activa; SLOs cumplidos en entorno local.

## Catálogo de assets (real) y cómo aprovecharlo
- Carpetas reales detectadas: `animated_entities`, `cliffs`, `consumable_items`, `decals`, `entities`, `foliage`, `mushrooms`, `props`, `roads`, `rocks`, `ruins`, `structures`, `terrain`, `ui_icons`, `water`.
- Uso recomendado en loader/preload (fase de migración):
  - Preload por carpetas: `['terrain','roads','decals','foliage','rocks','ruins','props','structures','water','animated_entities']`.
  - Si `terrain` contiene subcarpetas (`base`/`autotiles`), priorizar su orden interno.
  - Consumir categorías dinámicas desde `src/generated/asset-analysis.json` vía `modernAssetManager`.

## Problemas actuales (exhaustivo)
- Generación: reducer usa defaults; `terrainTiles` no circula; roads como `play_zone`.
- Estado/Coordenadas: sin `WORLD_SIZE` único; TILE_SIZE inconsistente (64 vs 32).
- Render/Assets: normalización a 64 px; doble carga; smoothing activo; carpetas legacy; sin RoadRenderer.
- Navegación: cámara fija sin fit‑to‑content.

## Fuera de alcance (esta iteración)
- Iluminación dinámica avanzada y WebGL.
- Biomas complejos/LOD adicionales.
