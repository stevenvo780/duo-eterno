# Dúo Eterno ‑ Laboratorio de Autopoiesis y Emergencia 🧬✨

> **Dedicatoria Filosófica**  
> Esta obra interactiva es un regalo de **Steven Vallejo Ortiz** —informático y filósofo— para su amada esposa **Isabella Loaiza Gómez**.  
> Cada línea de código, cada latido de estas pequeñas entidades, es una metáfora de cómo el amor nutre la homeostasis de nuestros cuerpos y almas.  
> Recorre el repositorio como quien lee una carta infinita: encontrarás mensajes dispersos, zonas de refugio y ecuaciones que cantan al cuidado mutuo.

> *"Dos entidades autónomas emergen, co-evolucionan y resuenan en un universo de complejidad matemática.*  
> *Su existencia depende no solo del cuidado externo, sino de la calidad de su vínculo mutuo."*

---

## 🎯 **Naturaleza del Proyecto**

**Dúo Eterno NO es un tamagotchi tradicional**. Es un **experimento filosófico interactivo** que explora:

- **🧬 Autopoiesis**: Sistemas que se auto-mantienen y auto-organizan
- **🌊 Emergencia**: Comportamientos complejos que surgen de reglas simples  
- **💫 Resonancia**: Interdependencia existencial entre entidades
- **🔄 Co-evolución**: Adaptación mutua y aprendizaje dinámico
- **⚡ Complejidad**: Dinámicas no-lineales con múltiples feedback loops

### **Conceptos Implementados**
- **Personalidades diferenciadas** (circle: social/intuitivo, square: persistente/eficiente)
- **Activity inertia** y flow states realistas
- **Hybrid decay** que modela desgaste diferencial por actividad  
- **Zona crowding effects** y competencia por recursos
- **Sistema de logging** para investigación empírica de emergencia
- **Death by disconnection**: pérdida de vínculo → fading → muerte
- **🛡️ Sistema de Supervivencia Mejorado**: Alertas tempranas, período de gracia y configuración de dificultad

---

## 🆕 **Sistema de Supervivencia Mejorado**

Este proyecto incluye un **sistema de mejoras de supervivencia** que mantiene la posibilidad de muerte pero proporciona un ciclo de vida mínimo más estable:

### **Características Principales**
- **🚨 Alertas Tempranas**: Notificaciones cuando las entidades están en peligro
- **🛡️ Período de Gracia**: Decay reducido cuando la salud está crítica (< 10)
- **⚖️ Balance Mejorado**: Umbrales más tolerantes y costos de supervivencia suavizados
- **🎛️ Configuración Flexible**: 3 niveles de dificultad (Fácil, Normal, Difícil)
- **📊 Panel de Control**: Monitoreo en tiempo real y configuración de opciones

### **Mejoras Implementadas**
- **Umbrales críticos**: De < 5 a < 3 (más tiempo de reacción)
- **Decay de salud**: Reducido 50% (de 0.1 a 0.05 por stat crítica)
- **Recuperación**: Aumentada 60% (de 0.05 a 0.08)
- **Costos de vida**: Reducidos 25% (de 2.0 a 1.5 dinero/minuto)
- **Actividad WORKING**: Decay reducido de 1.6x a 1.3x

Para más detalles, consulta: [`docs/MEJORAS_SUPERVIVENCIA.md`](docs/MEJORAS_SUPERVIVENCIA.md)

---

## 📊 **Tabla de Contenidos**
1. [Arquitectura Filosófica](#1-arquitectura-filosófica)
2. [Instalación y Comandos](#2-instalación-y-comandos)
3. [Arquitectura de Carpetas](#3-arquitectura-de-carpetas)
4. [Matemáticas de la Emergencia](#4-matemáticas-de-la-emergencia)
5. [Sistema de Investigación](#5-sistema-de-investigación)
6. [Configuración Avanzada](#6-configuración-avanzada)
7. [Análisis de Logs](#7-análisis-de-logs)
8. [Research Capabilities](#8-research-capabilities)

---

## 1. **Arquitectura Filosófica**

### **Entidades como Agentes Autónomos**
Cada entidad ("●" Circle, "■" Square) posee:
- **8 dimensiones de estado** (hunger, sleepiness, loneliness, happiness, energy, boredom, money, health)
- **Personalidad matemática** que afecta decision-making
- **Memory de actividades** (reinforcement learning básico)
- **Estados existenciales** (IDLE, SEEKING, LOW_RESONANCE, FADING, DEAD)

### **Resonancia como Vínculo Existencial**
La **resonancia** (0-100) no es solo un score - es la medida de la calidad del vínculo entre entidades:
- **Resonancia = 0** → Las entidades entran en estado FADING  
- **Sin recuperación** → Muerte por desconexión existencial
- **Emergencia de codependencia** → Supervivencia mutua requerida

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

## 2. **Instalación y Comandos**

### **Setup Básico**
```bash
# Instalación
npm install

# Desarrollo (con hot reload)
npm run dev              # → http://localhost:5173

# Testing (con memory limits ajustados)
npm test                 # Nota: puede requerir más RAM

# Producción
npm run build && npm run preview

# Calidad de código
npm run lint && npm run format
```

### **Comandos de Investigación**
```bash
# Iniciar logging server (puerto 3002)
npm run server

# Desarrollo completo (app + server)
npm run dev-full

# Análisis de session logs
npm run analyze-session
npm run show-stats
npm run analyze-now
```

---

## 3. **Arquitectura de Carpetas**

```
src/
 ├─ components/          # UI Components
 │   ├─ ProfessionalTopDownCanvas.tsx  # Motor de renderizado principal
 │   ├─ UIControls.tsx   # Interfaz de interacción y stats
 │   └─ DynamicsDebugPanel.tsx  # Herramientas de investigación
 ├─ hooks/               # Game Logic Hooks
 │   ├─ useUnifiedGameLoop.ts    # Loop principal optimizado
 │   ├─ useEntityMovementOptimized.ts  # Sistema de movimiento IA
 │   ├─ useZoneEffects.ts        # Dinámicas de zonas
 │   └─ useDialogueSystem.ts     # Sistema de feedback
 ├─ utils/               # Core Algorithms
 │   ├─ aiDecisionEngine.ts      # IA con personalidades y learning
 │   ├─ activityDynamics.ts      # Matemáticas de autopoiesis
 │   ├─ dynamicsLogger.ts        # Sistema de logging para research
 │   └─ feedbackSystem.ts        # Análisis de intenciones emergentes
 ├─ state/               # State Management
 │   └─ GameContext.tsx          # React Context con reducer complejo
 └─ types/               # TypeScript Definitions
     └─ index.ts                 # Tipos para entidades, stats, actividades

backend/
 ├─ server.js            # Express server para recibir logs
 ├─ logSummarizer.js     # Análisis automático de patterns
 └─ logs/                # 3,799+ archivos de research data (1.5GB)
```

---

## 4. **Matemáticas de la Emergencia**

### **4.1 Autopoiesis: Sistema de Decay Híbrido**
```typescript

∆stat = baseRate × activityMultiplier × decayMultiplier × dt


ACTIVITY_DECAY_MULTIPLIERS = {
  WORKING: 1.6,
  RESTING: 0.4,
  MEDITATING: 0.6,
  EXERCISING: 1.5
}
```

### **4.2 Personalidades Emergentes**
```typescript

ENTITY_PERSONALITIES = {
  circle: {
    socialPreference: 0.7,
    activityPersistence: 0.6,
    riskTolerance: 0.4,
    energyEfficiency: 0.5
  },
  square: {
    socialPreference: 0.5,
    activityPersistence: 0.8,
    riskTolerance: 0.6,
    energyEfficiency: 0.7
  }
}
```

### **4.3 Dinámicas de Zona con Crowding Effects**
```typescript

needLevel = 100 - avg(relevant_stats)
baseEffectiveness = 1 + needLevel / 50
crowdPenalty = 1 / (1 + 0.4 * max(0, occupancy - 1))

finalEffectiveness = baseEff × crowdPenalty × globalMultiplier
```

### **4.4 Resonancia como Sistema Dinámico**
```typescript

closeness = 1 / (1 + exp((distance - BOND_DISTANCE) / DISTANCE_SCALE))


gain = BOND_GAIN_PER_SEC × closeness × moodBonus × synergy × (1 - resonance/100)


separation = SEPARATION_DECAY × (1 - closeness) × (resonance/100)
stress = STRESS_DECAY × criticalStatsCount × (resonance/100)


dResonance/dt = gain - separation - stress
```

### **4.5 Activity Inertia & Flow States**
```typescript

calculateActivityInertia(entity, currentTime) {
  const session = activitySessions.get(entity.id);
  let inertia = personality.activityPersistence;
  
  if (session.effectiveness > 0.7) {
    inertia += 0.2;
  }
  
  if (session.interruptions > 2) {
    inertia -= 0.3;
  }
  
  return inertia;
}
```

---

## 5. **Sistema de Investigación**

### **5.1 Logging Granular para Emergencia**
El sistema captura **automáticamente**:
- **Activity changes** con effectiveness tracking
- **Mood transitions** y sus triggers
- **Proximity events** y resonance dynamics  
- **Decision-making** patterns de la IA
- **Zone utilization** y crowding effects
- **Critical events** (near-death, recovery, etc.)

### **5.2 Métricas de Emergencia Detectadas**
```json
{
  "sessionId": "session_1751919358910",
  "totalCycles": 39599,
  "resonanceChanges": 102,
  "proximityEvents": 452,
  "emergentPatterns": {
    "coEvolution": "Circle desarrolló preferencia por zonas sociales",
    "adaptiveBehavior": "Square optimizó rutinas de work-rest",
    "emergentSymbiosis": "Sincronización de ciclos sleep-wake"
  }
}
```

### **5.3 Data Export para Análisis**
```bash
# Exportar datos de investigación
npm run analyze-session  # → JSON con patterns detectados
npm run show-stats       # → Resumen estadístico
npm run analyze-now      # → Análisis en tiempo real
```

---

## 6. **Configuración Avanzada**

### **6.1 Variables de Investigación**
```bash
# Velocidades de simulación
VITE_GAME_SPEED_MULTIPLIER=5.0      # 5x speed para estudios long-term
VITE_BASE_DECAY_MULTIPLIER=1.0      # Decay más lento para observar patterns

# Influencias comportamentales  
VITE_AI_PERSONALITY_INFLUENCE=0.8   # Personalidades más marcadas
VITE_AI_SOFTMAX_TAU=0.5            # Decisiones menos aleatorias
VITE_MOOD_INFLUENCE_STRENGTH=0.8    # Estados emocionales más impactantes

# Dinámicas de zona
VITE_ZONE_EFFECTIVENESS_MULTIPLIER=2.0  # Zonas más poderosas
VITE_ACTIVITY_INERTIA_BONUS=25.0        # Flow states más estables

# Research logging
VITE_ENABLE_LOG_EXPORT=true        # Exportar a backend automáticamente
VITE_LOG_SERVER_URL=http://localhost:3002
```

### **6.2 Controles de Simulación**
```javascript

window.setGameSpeed(10);
window.speedPresets['Turbo (5x)'];
window.logConfig();
```

---

## 7. **Análisis de Logs**

### **7.1 Estructura de Logs**
Cada archivo contiene:
```json
{
  "timestamp": "2025-07-08T04:10:31.073Z",
  "sessionId": "session_unique_id",
  "gameState": {
    "resonance": 45,
    "cycles": 39599,
    "entities": [/* estado completo */],
    "emergentBehaviors": [/* patterns detectados */]
  },
  "analysis": {
    "loveStats": { "avgResonance": 45, "resonanceChanges": 102 },
    "behaviorPatterns": [/* co-evolution data */],
    "criticalEvents": [/* near-death experiences */]
  }
}
```

### **7.2 Research Insights Típicos**
- **Co-evolución observable**: Entidades adaptan rutinas mutualmente
- **Emergencia de roles**: Una entidad se vuelve "provider", otra "nurturer"
- **Cycles emergentes**: Patterns de sleep-wake auto-organizados
- **Crisis-recovery dynamics**: Cómo las entidades se rescatan mutuamente

---

## 8. **Research Capabilities**

### **8.1 Estudios Posibles**
1. **Autopoiesis**: ¿Cómo emergen patterns de auto-mantenimiento?
2. **Co-dependencia**: ¿Cuándo se vuelve crítica la resonancia mutua?
3. **Adaptation**: ¿Cómo aprenden las entidades de experience?
4. **Emergence**: ¿Qué behaviors surgen sin programación explícita?
5. **Crisis management**: ¿Cómo responden a near-death scenarios?

### **8.2 Herramientas de Análisis**
- **Real-time monitoring** con DynamicsDebugPanel
- **Historical analysis** con exported JSON data
- **Pattern detection** automático en logs
- **Statistical summaries** de sessions completas
- **Visualization** de trajectories comportamentales

### **8.3 Export para Python/R**
Los logs JSON son compatibles con:
```python
import pandas as pd
import json

# Cargar session data
with open('logs/session_data.json') as f:
    data = json.load(f)

# Análisis de patterns
df = pd.DataFrame(data['entitySnapshots'])
df.plot(x='timestamp', y=['resonance', 'avgHealth'])
```

---

## 9. **Road-map de Investigación**

### **Fase 1: Optimización Técnica** ⚡
- [ ] Fix memory leaks en logging system
- [ ] Implementar log rotation automática  
- [ ] Optimizar performance del game loop
- [ ] Batching de state updates

### **Fase 2: Enhanced Research Tools** 🔬
- [ ] Pattern detection algorithms avanzados
- [ ] Real-time visualization de emergent behaviors  
- [ ] Export directo a Python/R notebooks
- [ ] Machine learning para predecir critical events

### **Fase 3: Experimentos Avanzados** 🧬
- [ ] Multiple entity populations (3-5 entidades)
- [ ] Evolutionary pressure scenarios
- [ ] Environmental changes dinámicos
- [ ] Cross-session learning persistence

### **Fase 4: Academic Publication** 📚
- [ ] Paper sobre emergent behavior patterns
- [ ] Dataset público para research community
- [ ] Interactive demos para conferences
- [ ] Open source research framework

---

## 🔬 **Para Investigadores**

Este proyecto implementa conceptos de:
- **Sistemas adaptativos complejos** (Holland, Kauffman)
- **Autopoiesis** (Maturana & Varela)  
- **Emergencia** (Steven Johnson, Mitchell)
- **Teoría de redes** (Barabási)
- **Behavioral economics** (Kahneman)

Los logs generados son **data empírica real** sobre:
- Decision-making en sistemas autónomos
- Co-evolution en ambientes constrained
- Emergence de cooperation vs competition
- Resilience y recovery en sistemas complejos

---

**Licencia** MIT — Creado con amor y curiosidad filosófica por Steven Vallejo Ortiz 💙

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
crowd       = 1 / (1 + λ * max(0, occupancy - 1))   (λ ≈ 0.4)
EFF(Z)      = baseEff × gameConfig.zoneEffectivenessMultiplier × crowd
finalChange = effectBase * EFF(Z) * 0.03 * dt
```
Cuando `avgStat < criticalThreshold` se marca **criticalNeed** y se muestra diálogo.

### 4.3 Resonancia (Vínculo)
Modelo unificado y saturante con cercanía, humor, sinergia y estrés:
```
closeness = 1 / (1 + exp((distance - BOND_DISTANCE) / DISTANCE_SCALE))

gain   = BOND_GAIN_PER_SEC * closeness * moodBonus * synergy * (1 - R/100)
sep    = SEPARATION_DECAY_PER_SEC * (1 - closeness) * (R/100)
stress = STRESS_DECAY_PER_SEC * stressCount * (R/100)

dR/dt  = gain - sep - stress
R(t+dt)= clamp01(R + dR*dt)
```
- homeostasis implícita por saturación (1 - R/100).
- sinergia: misma actividad social/descanso y misma zona social/confort.
- estrés: cuenta de stats críticas (hambre/sueño/soledad/energía < 15).

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
| **NOURISH** | +happiness, +energy, resonancia con atenuación por repetición y nivel actual           |
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
| `VITE_BASE_DECAY_MULTIPLIER`   | Escala global de decaimiento de stats             | `2.5`   |
| `VITE_ZONE_EFFECTIVENESS_MULTIPLIER` | Escala global de zonas                    | `1.2`   |
| `VITE_AI_PERSONALITY_INFLUENCE`| Peso de la personalidad en IA                     | `0.3`   |
| `VITE_AI_SOFTMAX_TAU`          | Temperatura del softmax en selección de actividad | `0.9`   |
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
