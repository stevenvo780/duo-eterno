# Propuesta de Renombrado y Limpieza de Nombres

Este documento propone nombres más claros y consistentes para todos los archivos relevantes del repo, elimina redundancias típicas de IA y alinea la convención con las guías del proyecto (PascalCase para componentes, camelCase para utilidades, kebab-case para assets estáticos y scripts).

## Principios

- Consistencia: un solo estilo por tipo de archivo (componentes, hooks, utils, assets, scripts).
- Claridad: nombres cortos, específicos y sin adjetivos vacíos como "Professional", "Modern", "Optimized" en los nombres de archivo.
- Estabilidad: si hay variantes, usar sufijos `.legacy`, `.experimental`, o subcarpetas `/_archive`.
- Evitar caracteres problemáticos: sin espacios, acentos, paréntesis o mayúsculas en assets estáticos; usar `kebab-case`.

---

## src/ (Frontend)

### Raíz de `src`

- `src/App.css` → `src/app.css` — CSS común en minúsculas; coincide con import.
- `src/App.tsx` → (sin cambios) — Nombre de componente raíz correcto.
- `src/index.css` → (sin cambios).
- `src/main.tsx` → (sin cambios).
- `src/vite-env.d.ts` → (sin cambios).
- `src/global.d.ts` → (sin cambios).

### `src/components/`

- `src/components/ProfessionalTopDownCanvas.tsx` → `src/components/GameCanvas.tsx` — Nombre directo del canvas de juego.
- `src/components/ProfessionalTopDownCanvasModern.tsx` → `src/components/GameCanvas.experimental.tsx` — Variante experimental marcada explícitamente.
- `src/components/ProfessionalTopDownCanvas_new.tsx` → `src/components/GameCanvas.experimental2.tsx` — Evita `_new`; mantener sólo si es necesario.
- `src/components/ProfessionalTopDownCanvas_clean.tsx` → `src/components/GameCanvas.clean.tsx` — Variante limpia si aporta valor; preferible archivar.
- `src/components/ProfessionalTopDownCanvas.backup.tsx` → `src/components/_archive/GameCanvas.backup.tsx` — Mover a archivo de archivo.
- `src/components/ProfessionalTopDownCanvas.tsx.backup` → `src/components/_archive/GameCanvas.tsx.backup` — Mover a archivo de archivo.
- `src/components/AnimatedEntity.tsx` → `src/components/EntitySprite.tsx` — Describe la función del componente.
- `src/components/DynamicsDebugPanel.tsx` → `src/components/DebugPanel.tsx` — Más conciso y claro.
- `src/components/EntityDialogueSystem.tsx` → `src/components/EntityDialog.tsx` — Unificar a "Dialog".
- `src/components/DialogBubble.tsx` → (sin cambios) — Queda en "Dialog".
- `src/components/DialogOverlay.tsx` → (sin cambios) — Unificado con "Dialog".
- `src/components/EntityPanel.tsx` → (sin cambios).
- `src/components/ErrorBoundary.tsx` → (sin cambios).
- `src/components/IntroNarrative.tsx` → `src/components/IntroScene.tsx` — Más estándar.
- `src/components/LoadingSpinner.tsx` → `src/components/Spinner.tsx` — Conciso.
- `src/components/StatBar.tsx` → (sin cambios).
- `src/components/UIControls.tsx` → (sin cambios).
- `src/components/InteractiveTooltip.css` → `src/components/interactive-tooltip.css` — CSS en kebab-case.
- `src/components/__tests__/UIControls.test.tsx` → (sin cambios).

Sugerencia estructural: mover variantes y backups a `src/components/_archive/` para despejar el directorio principal.

### `src/hooks/`

- `src/hooks/useRenderer.ts` → `src/hooks/useRenderScheduler.ts` — Refleja que regula el ritmo de render.
- `src/hooks/useGameLoop.ts` → `src/hooks/useUnifiedGameLoop.ts` — Alinea con tests y semántica.
- `src/hooks/useEntityMovementOptimized.ts` → `src/hooks/useEntityMovement.ts` — La optimización va dentro, no en el nombre.
- `src/hooks/useAnimationSystem.ts` → `src/hooks/useAnimations.ts` — Plural natural para múltiples animaciones.
- `src/hooks/useDialogueSystem.ts` → `src/hooks/useDialogs.ts` — Unificar a "Dialog".
- `src/hooks/useGame.ts` → `src/hooks/useGameState.ts` — Preciso.
- `src/hooks/usePersistence.ts` → (sin cambios).
- `src/hooks/useDayNightCycle.ts` → (sin cambios).
- `src/hooks/useZoneEffects.ts` → (sin cambios).
- `src/hooks/__tests__/useOptimizedUnifiedGameLoop.test.ts` → `src/hooks/__tests__/useUnifiedGameLoop.test.ts` — Quita "Optimized" y alinea.

### `src/utils/`

- `src/utils/modernAssetManager.ts` → `src/utils/assetManager.modern.ts` — Variante explícita del mismo módulo.
- `src/utils/assetManager.ts` → (sin cambios) — Mantener como implementación por defecto.
- `src/utils/dynamicsLogger.ts` → (sin cambios) — Base.
- `src/utils/optimizedDynamicsLogger.ts` → `src/utils/dynamicsLogger.optimized.ts` — Agrupar por módulo + calificador.
- `src/utils/mapGeneration.ts` → `src/utils/generateMap.ts` — Verbo primero y conciso.
- `src/utils/unifiedMapGeneration.ts` → `src/utils/generateMapUnified.ts` — Consistencia.
- `src/utils/organicMapGeneration.ts` → `src/utils/generateMapOrganic.ts` — Consistencia.
- `src/utils/voronoiGeneration.ts` → `src/utils/generateMapVoronoi.ts` — Consistencia.
- `src/utils/organicStreetGeneration.ts` → `src/utils/generateStreetsOrganic.ts` — Consistencia.
- `src/utils/noiseGeneration.ts` → `src/utils/generateNoise.ts` — Verbo primero.
- `src/utils/activityDynamics.ts` → `src/utils/activityEngine.ts` — "Dynamics" es vago; si aplica, "engine".
- `src/utils/aiDecisionEngine.ts` → `src/utils/aiDecision.ts` — Conciso.
- `src/utils/dialogues.ts` → `src/utils/dialogs.ts` — Unificar a "Dialog".
- `src/utils/dialogueSelector.ts` → `src/utils/dialogSelector.ts` — Unificar a "Dialog".
- `src/utils/fixedMathPrecision.ts` → `src/utils/mathPrecision.ts` — Describe utilidad.
- `src/utils/interactions.ts` → (sin cambios).
- `src/utils/logger.ts` → (sin cambios).
- `src/utils/performanceOptimizer.ts` → `src/utils/performanceTuner.ts` — "Tuner"/"Profiler" más claro que "Optimizer" genérico.
- `src/utils/persistence.ts` → (sin cambios).
- `src/utils/robustStateManagement.ts` → `src/utils/stateUtils.ts` — Nombre amplio y estándar.

#### `src/utils/rendering/`

- `src/utils/rendering/MapRenderer.ts` → `src/utils/rendering/mapRenderer.ts` — Utilidad en camelCase.
- `src/utils/rendering/ObjectRenderer.ts` → `src/utils/rendering/objectRenderer.ts` — Idem.
- `src/utils/rendering/TileRenderer.ts` → `src/utils/rendering/tileRenderer.ts` — Idem.

### `src/constants/` y `src/types/`

- `src/constants/activityConstants.ts` → `src/constants/activity.ts` — Repite "constants".
- `src/constants/index.ts` → (sin cambios).
- `src/types/index.ts` → (sin cambios).

### `src/state/`

- `src/state/GameContext.tsx` → (sin cambios).
- `src/state/__tests__/gameContext.test.tsx` → (sin cambios).

### `src/config/`

- `src/config/gameConfig.ts` → `src/config/game.ts` — Evita repetir "config".

---

## `public/` (Assets estáticos)

Los assets contienen espacios, mayúsculas, paréntesis y guiones bajos. Propuesta:

- Directorios en `kebab-case` y plural en inglés: `animated-entities`, `environmental-objects`, `consumable-items`, `terrain-tiles`, `furniture-objects`, `natural-elements`, `buildings`, `infrastructure`, `water`, `ui-icons`, `dialogs`.
- Archivos en `kebab-case`, sin espacios, sin paréntesis, sin acentos. Mantener extensión.

### Renombres de carpetas

- `public/assets/animated_entities/` → `public/assets/animated-entities/`
- `public/assets/environmental_objects/` → `public/assets/environmental-objects/`
- `public/assets/consumable_items/` → `public/assets/consumable-items/`
- `public/assets/terrain_tiles/` → `public/assets/terrain-tiles/`
- `public/assets/furniture_objects/` → `public/assets/furniture-objects/`
- `public/assets/natural_elements/` → `public/assets/natural-elements/`
- `public/assets/building/` → `public/assets/buildings/`

Actualizar `assetManager`/`assetManager.modern` para reflejar estos nuevos nombres de carpeta.

### Ejemplos de archivos (patrón aplicado)

- `public/assets/animated_entities/Baby Chicken Yellow.png` → `public/assets/animated-entities/baby-chicken-yellow.png`
- `public/assets/animated_entities/Horse(32x32).png` → `public/assets/animated-entities/horse-32x32.png`
- `public/assets/environmental_objects/Bench_1.png` → `public/assets/environmental-objects/bench-1.png`
- `public/assets/building/muros10.png` → `public/assets/buildings/wall-10.png` (opcional traducir a inglés)
- `public/assets/dialogs/dialogos_chat_isa.lite.censored_plus.json` → `public/assets/dialogs/isa-chat.json`

### Regla de normalización sugerida (pseudocódigo)

1. Convertir a minúsculas.
2. Reemplazar espacios y `_` por `-`.
3. Remover acentos y caracteres no [a-z0-9-.].
4. Convertir `(`, `)` a `-` o eliminar.
5. Colapsar múltiples `-` consecutivos.

> Nota: Acompañar con búsqueda/actualización en el código para rutas referenciadas.

---

## `scripts/`

El proyecto usa ESM (`"type": "module"`); unificar a `.mjs`/`.js` ESM o mantener `.cjs` de forma consistente. Propuesta ESM:

- `scripts/check-deadcode-improved.cjs` → `scripts/check-deadcode-improved.mjs`
- `scripts/fix-unused-vars.cjs` → `scripts/fix-unused-vars.mjs`
- `scripts/spritesheet-detector.cjs` → `scripts/spritesheet-detector.mjs`
- `scripts/verify-sprites.cjs` → `scripts/verify-sprites.mjs`
- Duplicado: `scripts/spritesheet-detector.js` y `.cjs` → consolidar en uno: `scripts/spritesheet-detector.mjs`.
- `scripts/analyze-assets.cjs` → `scripts/analyze-assets.mjs`
- `scripts/audit-assets.js` → (sin cambios) o `audit-assets.mjs` si usa ESM.
- `scripts/sprite-animation-loader.js` → (sin cambios) o `sprite-animation-loader.mjs` si usa ESM.
- `scripts/extract-furniture.py` → (sin cambios).

Actualizar `package.json` en los scripts que invoquen estos archivos.

---

## Documentación y misceláneos

- Mover documentos auxiliares a `docs/` y renombrar:
  - `AGENTS.md` → `docs/agents.md`
  - `ASSETS_UPDATE_SUMMARY.md` → `docs/assets-update-summary.md`
  - `REFACTOR_SUMMARY.md` → `docs/refactor-summary.md`
  - `SPRITES_README.md` → `docs/sprites.md`
  - `DEPLOYMENT.md` → `docs/deployment.md`

`README.md`, configuraciones (`vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, etc.) quedan sin cambios.

---

## Plan de migración (pasos seguros)

1. Renombrar archivos de `src/` (componentes/hooks/utils) y ajustar imports automáticamente con el IDE o `tsc --noEmit` para detectar rutas rotas.
2. Renombrar `rendering/*.ts` a camelCase y actualizar imports.
3. Unificar hooks de loop/render: ajustar tests `__tests__/useUnifiedGameLoop.test.ts` y referencias.
4. Actualizar `assetManager` para nuevos nombres de carpetas en `public/assets/` si se aplican.
5. Renombrar carpetas y archivos de `public/assets/` con script batch.
6. Unificar scripts a ESM y actualizar `package.json`.
7. Ejecutar `npm run lint` y `npm run build` para validar.

### Script Node para normalizar nombres de assets (borrador)

```js
// tools/rename-assets.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';

const FOLDERS = [
  'animated_entities','environmental_objects','consumable_items','terrain_tiles','furniture_objects','natural_elements','building'
];

const folderMap = new Map([
  ['animated_entities','animated-entities'],
  ['environmental_objects','environmental-objects'],
  ['consumable_items','consumable-items'],
  ['terrain_tiles','terrain-tiles'],
  ['furniture_objects','furniture-objects'],
  ['natural_elements','natural-elements'],
  ['building','buildings']
]);

const slug = s => s
  .normalize('NFD').replace(/\p{Diacritic}/gu,'')
  .toLowerCase()
  .replace(/[()]/g,'-')
  .replace(/[_\s]+/g,'-')
  .replace(/[^a-z0-9-.]/g,'')
  .replace(/-+/g,'-')
  .replace(/^-|-$/g,'');

const root = path.resolve('public/assets');

for (const oldFolder of FOLDERS) {
  const newFolder = folderMap.get(oldFolder) ?? oldFolder;
  const srcDir = path.join(root, oldFolder);
  const dstDir = path.join(root, newFolder);
  try { await fs.mkdir(dstDir, { recursive: true }); } catch {}
  const items = await fs.readdir(srcDir).catch(() => []);
  for (const name of items) {
    const src = path.join(srcDir, name);
    const stat = await fs.stat(src);
    if (stat.isFile()) {
      const dst = path.join(dstDir, slug(name));
      if (src !== dst) await fs.rename(src, dst);
    }
  }
  if (srcDir !== dstDir) {
    // Opcional: eliminar carpeta original si queda vacía
    try { await fs.rmdir(srcDir); } catch {}
  }
}
console.log('Assets normalizados en', root);
```

---

## Notas finales

- Evitar calificativos en los nombres de archivos; mantener la intención (qué hace) no el cómo (optimizado, moderno).
- Si la variante es necesaria, usar sufijos (`.legacy`, `.experimental`) o subcarpetas `/_archive`.
- Tras aplicar cambios, buscar y reemplazar rutas de assets en `assetManager` y en cualquier import estático.

