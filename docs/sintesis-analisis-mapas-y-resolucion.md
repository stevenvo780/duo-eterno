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

## Estado del proceso (a medias)
- Assets: reestructuradas y creadas (roads/autotiles/decals/cliffs) bajo la nueva taxonomía. OK.
- Mapeo: `src/generated/asset-analysis.json` actualizado. OK.
- Código: NO actualizado aún para consumir la taxonomía. Faltan preload, `generateUnifiedMap` en reducer, `RoadRenderer`, autotiles, pixel-perfect y cámara.
- Implicación: el pipeline actual seguirá mostrando los problemas descritos hasta que se apliquen los cambios de código (F1–F3 del plan).

## Evidencia (código y rutas)
- Estado/generación
  - `src/state/GameContext.tsx`: acciones `GENERATE_NEW_MAP`/`RESET_GAME` usan `createDefaultZones`/`createDefaultMapElements`.
  - `src/utils/mapGeneration.ts`: define defaults y `generateEnhancedMap` (no usado por el reducer).
  - `src/utils/unifiedMapGeneration.ts`: genera `terrainTiles` y aplica assets, pero no está cableado al estado; precarga carpetas legacy (p.ej. `terrain_tiles`).
  - `src/utils/organicMapGeneration.ts`: Voronoi/Perlin/Poisson; devuelve calles como `play_zone`.
- Renderizado
  - `src/utils/rendering/MapRenderer.ts`: en `initialize` genera terreno ad-hoc vía `tileRenderer.generateTerrainMap()` según extents de zonas.
  - `src/utils/rendering/TileRenderer.ts`: carga `terrain_tiles`, selecciona por nombre `cesped`, no usa `terrainTiles` del generador.
  - `src/utils/rendering/ObjectRenderer.ts`: carga carpetas legacy (`environmental_objects`,`furniture_objects`, etc.), detecta resolución recargando imágenes.
  - `src/utils/rendering/EntityAnimationRenderer.ts`: usa `animated_entities` (correcto con la nueva taxonomía).
- Navegación/cámara
  - `src/components/NavigableGameCanvas.tsx`: mundo 4000×3000 fijo; `initialX/Y` fijos; sin fit-to-content.
- Assets/manager
  - `src/utils/modernAssetManager.ts`: no persiste `naturalWidth/Height`; `size` fijo 64; `getKnownAssets` depende de `asset-analysis.json` (OK).

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

## Crítica al algoritmo de generación propuesto (fuerte)
- Adecuación general: es una buena base (biomas por elevación/humedad/temperatura, roads como polylines, Poisson-disc, autotiles, RNG seed). No está listo para producción sin endurecer reglas, costes y validación.
- Complejidad vs. valor: mezcla varias técnicas medio implementadas. Sug.: priorizar terreno→autotiles→roads, y dejar POIs/plantillas para fase posterior.
- Biomes/ruido: FBM Perlin puro produce bandas y micro-biomas. Falta suavizado espacial (filtro mayoritario k×k) y domain warping/warp ridged para continuidad. Riesgo de "mosaico" a zoom medio.
- Agua/costas: sin máscara de cuencas/erosión, las costas salen dentadas. Al menos aplicar morphological open/close y blur antes de umbralizar.
- Caminos: "vector fields" naturales tienden a serpenteos sin propósito. Mejor: POIs→A* sobre mapa de costes (pendiente, evitar agua), luego suavizar (Catmull-Rom) y clasificar jerarquía (primario/secundario) con anchos distintos.
- Autotiles: set minimal (16+4) puede generar conflictos diagonales. Prioridad y resolución de esquinas debe ser estricta; idealmente usar set de 47-corners o Wang tiles si el arte lo permite.
- Colocación de objetos: Poisson sin máscaras de exclusión (roads/structures/agua) crea solapes y objetos flotantes. Añadir rejection sampling con reglas nearWater/slope y clusters controlados.
- Determinismo/semillas: falta plan de schedule de semillas por chunk/tipo para evitar popping al generar perezosamente.
- Performance/streaming: generar todo el mundo upfront no escala. Proponer chunking (p.ej. 64×64 tiles), caché LRU y generación bajo demanda por viewport.
- Metadatos/arte: el algoritmo asume `asset-metadata` que aún no existe. Debe degradar con heurísticas sin romperse; definir plan de adopción gradual.
- Métricas de calibración: no hay “golden seeds” ni KPIs por bioma/densidades. Sin esto, tuning es subjetivo.
- Veredicto: Bueno como "baseline académico"; insuficiente como "sistema de juego" hasta implementar costes reales (pendiente, agua, proximidad a POIs), continuidad de biomas, máscaras de exclusión y streaming.

## Contraste documento ↔ código: plan detallado por archivo (pasos precisos)
1) `src/state/GameContext.tsx`
- Reemplazar en `RESET_GAME`/`GENERATE_NEW_MAP` los defaults por `await generateUnifiedMap({ seed, width: WORLD_SIZE.w, height: WORLD_SIZE.h, tileSize: 64, algorithm: 'organic' })`.
- Extender `GameState` para incluir `terrainTiles`, `roads`, `objectLayers`, `worldSize`.
- Guardar `mapSeed` y versionar generador (p.ej. `generatorVersion: 1`).
- DoD: estado expone `terrainTiles.length>0`; zonas/mapElements siguen presentes; seed reproducible.

2) `src/utils/rendering/MapRenderer.ts`
- `initialize(sceneData)`: eliminar generación interna del terreno; aceptar `terrainMap` ya construido o construirlo desde `sceneData.terrainTiles` usando `TileRenderer.fromUnifiedTiles(tiles, TILE_SIZE)`.
- Añadir `setWorldBounds({w,h})` y exponerlo a navegación para clamp.
- Integrar `RoadRenderer.render(ctx, roads, zoom, viewport)` (archivo nuevo) entre `Water` y `Decals`.
- Desactivar smoothing al inicio de cada frame: `ctx.imageSmoothingEnabled = false`.
- DoD: no hay llamadas a `tileRenderer.generateTerrainMap`; render funciona con tiles externos.

3) `src/utils/rendering/TileRenderer.ts`
- Cambiar preload: `assetManager.loadAssetsByFolderName('terrain/base')` y `terrain/autotiles` (no `terrain_tiles`).
- Eliminar dependencia de nombres `cesped`; introducir `fromUnifiedTiles(tiles, tileSize)` que construya `TerrainMap` desde `TerrainTile[]`.
- Implementar autotiles: `applyAutotiles(grid)` usando bitmask 4-dir + esquinas 8-dir según especificación.
- DoD: render recibe `terrainMap` externo; muestra bordes/ esquinas correctamente.

4) `src/utils/rendering/ObjectRenderer.ts`
- Sustituir cargas legacy por nueva taxonomía: `foliage/trees`, `foliage/shrubs`, `mushrooms`, `rocks`, `ruins`, `props`, `structures`, `water`, `decals`, `animated_entities`.
- Eliminar `environmental_objects`, `furniture_objects`, `building`, `consumable_items`.
- Quitar `detectImageResolution` y `resolutionCache` como fuente primaria; usar `asset.image.naturalWidth/Height` y persistir en `Asset` (ver AssetManager).
- Restringir `generateRandomDecorations` al bbox del terreno; o reemplazar por `placeObjectsByBiome(objectLayers)` (F4).
- DoD: sin recarga de imágenes duplicada; carpetas nuevas reflejadas en logs; sin objetos fuera del terreno.

5) `src/utils/modernAssetManager.ts`
- Extender `Asset` con `naturalWidth`, `naturalHeight`, `scale_base_px?`, `anchor?`, `zLayer?`.
- En `img.onload`, setear `naturalWidth/Height` y marcar `loaded=true`.
- Añadir `preloadEssentialAssetsByFolders([...nueva taxonomía...])` con orden del documento.
- Mantener compatibilidad con `asset-analysis.json` (las claves deben coincidir con rutas nuevas, p.ej. `foliage/trees`).
- DoD: `getStats().categories` muestra nuevas carpetas; assets tienen `naturalWidth/Height`.

6) `src/utils/unifiedMapGeneration.ts`
- `preloadRequiredAssets()`: cambiar categorías a `terrain/base`, `terrain/autotiles`, `water`, `structures`, `foliage/trees`, `foliage/shrubs`, `rocks`, `props`, `decals`, `animated_entities`.
- `generateTerrainTiles()`: no usar `terrain_tiles` ni `cesped`; seleccionar desde `terrain/base` y etiquetar `type` por bioma/agua.
- Exportar `roads: RoadPolyline[]` (aunque sea vacío en 1ª iteración) para integrar `RoadRenderer`.
- DoD: `assetStats.terrainTiles>0` y carpetas nuevas precargadas.

7) `src/components/NavigableGameCanvas.tsx`
- Reemplazar constantes por `WORLD_SIZE` del estado; añadir fit-to-content en `useMapNavigation` (centra bbox de zonas/entidades).
- Asegurar zoom entero: snap del `zoom` a múltiplos discretos según `TILE_SIZE` y DPR.
- Botón "Centrar contenido" que reutiliza el fit.
- DoD: inicia centrado; no hay que "buscar en esquinas".

8) `src/utils/rendering/EntityAnimationRenderer.ts`
- Mantener ruta `animated_entities` (ya correcta).
- Inferir `frame_size` de `image.naturalWidth / columns`, si es posible; exponer opción de metadatos futura.
- DoD: animaciones sin recortes a 200% zoom.

9) Nuevo `src/utils/rendering/RoadRenderer.ts`
- Implementar raster basado en bitmask (N=1,E=2,S=4,W=8) y ancho; elegir `road_path_*` de `/assets/roads`.
- API: `render(ctx, roads, viewport, zoom)` y `rasterToTiles()` opcional.
- DoD: variantes straight/curve/T/cross/end visibles y conectadas.

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
- `GameContext`: cablear `generateUnifiedMap`; exponer `WORLD_SIZE` y tiles/roads.
- `MapRenderer`/`TileRenderer`: consumir tiles externos; fit-to-content.

F2 — Asset manager y pixel-art
- `modernAssetManager` + `ObjectRenderer`: dimensiones naturales; smoothing off; nueva taxonomía.

F3 — Autotiles y RoadRenderer (con tests)
- `TileRenderer` + `RoadRenderer`: bitmask y capas.

F4 — Población, culling y observabilidad
- Poisson por bioma; quadtree; eventos.

F5 — Preload presupuestado y limpieza
- Lotes decode; retirar fallbacks legacy.

## Migración, compatibilidad y flags
- Feature flags: `renderer.road`, `renderer.autotile`, `camera.fitToContent`, `assets.pixelPerfect`, `compatMode` (tamaños legacy).
- Plan reversible por módulos; versionar generador.

## Riesgos
- Escala percibida tras cambiar sizing → `compatMode` y preset de escala.
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
  - Consumir categorías dinámicas de `src/generated/asset-analysis.json` via `modernAssetManager`.

## Problemas actuales (exhaustivo)
- Generación: reducer usa defaults; `terrainTiles` no circula; roads como `play_zone`.
- Estado/Coordenadas: sin `WORLD_SIZE` único.
- Render/Assets: normalización a 64 px; doble carga; smoothing activo; carpetas legacy; sin RoadRenderer.
- Navegación: cámara fija sin fit-to-content.

## Fuera de alcance (esta iteración)
- Iluminación dinámica avanzada y WebGL.
- Biomas avanzados complejos/LOD adicionales.

## Aceptación y checklist final
- Estado expone `terrainTiles`, `roads`, `objectLayers` y `WORLD_SIZE`; renderer no genera terreno propio.
- Cámara centrada y clamps correctos; acción de “centrar en entidad”.
- Pixel-art nítido (smoothing off), escalado entero; sin doble carga.
- Caminos visibles y ordenados; objetos sin solapes notorios; Poisson por bioma aplicado.
- Seeds reproducibles; métricas registradas; SLOs cumplidos; capturas archivadas (vista general + zoom 200%).
