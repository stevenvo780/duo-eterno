# Dúo Eterno ‑ Manual Técnico y de Diseño ✨

> **Dedicatoria**  
> Esta obra interactiva es un regalo de **Steven Vallejo Ortiz** —informático y filósofo— para su amada esposa **Isabella Loaiza Gómez**.  
> Cada línea de código, cada latido de estas pequeñas entidades, es una metáfora de cómo el amor nutre la homeostasis de nuestros cuerpos y almas.  
> Recorre el repositorio como quien lee una carta infinita: encontrarás mensajes dispersos, zonas de refugio y ecuaciones que cantan al cuidado mutuo.

> *“Dos pequeñas luces orbitan en un mundo minimalista; su brillo depende del cuidado que les prestes.”*

---

## Tabla de Contenidos
1. Visión General
2. Instalación y Comandos
3. Arquitectura de Carpetas
4. Matemáticas del Juego
   1. Estadísticas & Decaimiento
   2. Zonas & Efectividad
   3. Resonancia (Vínculo)
   4. Costes de Supervivencia
5. Interacción del Jugador
6. Configuración & Variables de Entorno
7. Logs & Debug
8. Flujo de Persistencia
9. Road-map Sugerido

---

## 1. Visión General
Dúo Eterno es una *experiencia-tamagotchi* con dos entidades (“●” y “■”). El objetivo es mantener viva la **resonancia** (0-100) entre ellas equilibrando **necesidades** (hunger, sleepiness, etc.) a través de movimiento autónomo, zonas de mapa y acciones del jugador.

- **Framework**   React 19 + TypeScript
- **Motor**       Canvas 2D + hooks optimizados
- **Persistencia** localStorage (`duoEternoState`)
- **Servidor**     Express opcional para exportar logs

---

## 2. Instalación y Comandos
```bash
# 1) Dependencias
npm i
# 2) Desarrollo
npm run dev           # Abre http://localhost:5173
# 3) Producción
npm run build && npm run preview
# 4) Calidad de código
npm run lint          # ESLint
npm run format        # Prettier
```

Comando extra (`npm run server`) levanta un servidor Express en `3002` para recibir logs.

---

## 3. Arquitectura de Carpetas (resumida)
```
src/
 ├─ components/          UI (Canvas, Panels)
 ├─ hooks/               Lógica de juego (render loop, IA, zonas…)
 ├─ utils/               Algoritmos reutilizables (AI, logger…)
 ├─ constants/           Datos inmutables (umbrales, traducciones)
 ├─ state/               GameContext (React Context + Reducer)
 └─ types/               Tipos globales
```

---

## 4. Matemáticas del Juego
### 4.1 Estadísticas & Decaimiento
Cada entidad posee un vector `stats` con rango `[0,100]` (excepto `money ≥ 0`).

```
∆stat = baseRate × activityMultiplier × decayMultiplier × dt
```
- **baseRate** ver `HYBRID_DECAY_RATES` (ej: hunger = −0.3/s)  
- **activityMultiplier** tabla `ACTIVITY_DECAY_MULTIPLIERS` (RESTING 0.4 – WORKING 1.6)  
- **decayMultiplier** `gameConfig.baseDecayMultiplier` (env var)  
- **dt** segundos reales × `gameSpeedMultiplier`

Clampeo final `max(0, min(100, newValue))`.

### 4.2 Zonas & Efectividad
Cada zona `Z` tiene `effects` (Δ por segundo) y un **attractiveness** `α ∈ [0,1]`.

Efectividad real:
```
needLevel   = 100 - avg(stat_i, …)
baseEff     = 1 + needLevel / 50
EFF(Z)      = baseEff × gameConfig.zoneEffectivenessMultiplier
finalChange = effectBase * EFF(Z) * 0.02 * dt
```
Cuando `avgStat < criticalThreshold` se marca **criticalNeed** y se muestra diálogo.

### 4.3 Resonancia (Vínculo)
- **Distancia menor a 80 px** ⇒ incremento:
```
∆R = 2  * dt * proximityBonus * moodBonus * gameSpeed
```
- **Distancia mayor a 160 px** ⇒ decaimiento `0.2*dt`.
- Umbrales: 30 (crítico) / 0 (fading) recuperable si `>10` antes de 10 s.

### 4.4 Costes de Supervivencia
Dinero cae a razón de `LIVING_COST = 2` por minuto.
Si `money < 20` se activan penalizaciones:
```
∆hunger   = −5 * desperation * minutes
∆happiness= −3 * desperation * minutes
```
con `desperation = (20-money)/20`.

---

## 5. Interacción del Jugador
| Acción      | Resultado                                                                             |
|-------------|----------------------------------------------------------------------------------------|
| **NOURISH** | +30 resonancia, +happiness, +energy                                                    |
| **FEED**    | +hunger, +happiness, levemente −sleepiness                                             |
| **PLAY**    | −boredom, +happiness, −energy                                                         |
| **COMFORT** | −loneliness, +happiness                                                               |
| **WAKE_UP** | −sleepiness, +energy                                                                  |
| **LET_SLEEP**| +sleepiness, +energy (si están en zona de descanso)                                   |

Acciones invocan `applyInteractionEffect` (ver `utils/interactions.ts`).

---

## 6. Configuración & Variables de Entorno
| Clave                          | Descripción                                       | Defecto |
|--------------------------------|---------------------------------------------------|---------|
| `VITE_GAME_SPEED_MULTIPLIER`   | Acelera todo el juego                             | `1.0`   |
| `VITE_BASE_DECAY_MULTIPLIER`   | Escala global de decaimiento de stats             | `4.0`   |
| `VITE_ZONE_EFFECTIVENESS_MULTIPLIER` | Escala global de zonas                    | `1.0`   |
| `VITE_AI_PERSONALITY_INFLUENCE`| Peso de la personalidad en IA                     | `0.3`   |
| `VITE_ACTIVITY_INERTIA_BONUS`  | Aumenta persistencia en actividad                 | `15.0`  |
| `VITE_MOOD_INFLUENCE_STRENGTH` | Cuánto afecta el humor a decisiones               | `0.5`   |

`window.setGameSpeed(n)` modifica `gameConfig.gameSpeedMultiplier` en caliente.

---

## 7. Logs & Debug
Sistema central `utils/logger.ts` con **sistemas**:
`autopoiesis, movement, zones, ai, render, storage, general`.

- Solo `warn/error` se registran en producción.  
- En modo debug (`VITE_DEBUG_MODE=true`) se muestran grupos colapsables en la consola.

### Ejemplo
```ts
logZones.debug('Zone effects', { entity: id, effects, eff });
```

---

## 8. Flujo de Persistencia
1. Cada `20 ticks` ⇒ `saveGameState` → localStorage (`~4 KB`).
2. Al montar la app ⇒ `loadGameState` y validación estricta (`utils/storage.ts`).
3. Migración pendiente si cambia `CURRENT_VERSION`.

---

## 9. Road-map Sugerido
- ✏️ Modo *sandbox* configurable (crear zonas desde UI).  
- 📊 Exportar CSV de métricas para análisis.  
- 🎧 Audio reactivo a la resonancia.

---

**Licencia** MIT — creado con cariño.
