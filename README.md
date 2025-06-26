# Dúo Eterno: Un Tamagotchi del Vínculo

Una simulación interactiva minimalista donde dos entes pixelados representan la esencia de un vínculo que requiere cuidado y atención para mantenerse vivo.

## 🎮 Descripción del Juego

**Dúo Eterno** es un Tamagotchi conceptual que explora la naturaleza de las conexiones humanas a través de dos entidades abstractas:
- Un **círculo** y un **cuadrado** que existen en un lienzo optimizado
- Su **resonancia** (energía del vínculo) disminuye con el tiempo
- Solo tu intervención puede nutrir y mantener viva su conexión

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Instrucciones de instalación

```bash
# Clona el repositorio (si aplica) o navega al directorio
cd duo-eterno

# Instala las dependencias
npm install

# Configura el entorno de desarrollo (opcional)
cp .env.example .env

# Inicia el servidor de desarrollo
npm run dev

# Abre tu navegador en http://localhost:5173
```

### Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la construcción
npm run lint     # Ejecutar ESLint
```

## ⚙️ Configuración de Desarrollo

### Variables de Entorno

El juego incluye un sistema de configuración avanzado para facilitar el desarrollo y debugging:

```bash
# Configuración rápida con script
./dev-config.sh debug        # Modo debug (eventos acelerados)
./dev-config.sh normal       # Modo normal de desarrollo
./dev-config.sh performance  # Modo de alto rendimiento
./dev-config.sh production   # Configuración de producción
```

### Variables Principales

- `VITE_GAME_SPEED_MULTIPLIER` - Multiplicador de velocidad general (1.0 = normal, 5.0 = muy rápido)
- `VITE_STAT_DECAY_SPEED` - Velocidad de degradación de estadísticas (útil para testing)
- `VITE_DEBUG_MODE` - Habilita métricas de rendimiento y logs detallados
- `VITE_TARGET_FPS` - FPS objetivo para optimizar rendimiento

### Funciones de Debug en Consola

Durante el desarrollo, puedes usar estas funciones en la consola del navegador:

```javascript
setTurboMode(true)   // Acelera temporalmente todos los eventos
setDebugMode(true)   // Muestra métricas de rendimiento
logConfig()          // Muestra la configuración actual
gameConfig           // Acceso directo al objeto de configuración
```

## 🎯 Mecánicas del Juego

### Estados de los Entes

Cada entidad puede estar en uno de estos estados:

1. **IDLE** - En reposo, movimiento aleatorio ocasional cuando la resonancia > 75%
2. **SEEKING** - Buscan activamente al otro cuando la resonancia < 50%
3. **LOW_RESONANCE** - Movimiento errático y colores atenuados cuando < 25%
4. **FADING** - Se desvanecen gradualmente cuando la resonancia llega a 0

### Ciclo de Vida Autónomo

- **Decaimiento**: La resonancia disminuye 0.5% cada segundo
- **Auto-sustento**: Si ambos entes están juntos >5 segundos, +5% de resonancia
- **Movimiento**: Los entes se mueven según su estado emocional actual

### Interacción del Jugador

- **Botón "Nutrir Vínculo"**: Restaura +30% de resonancia (máximo 100%)
- **Revivir**: Si los entes se han desvanecido, puedes revivirlos con 50% de resonancia
- **Diálogos**: Mensajes poéticos aparecen según el contexto de la interacción

## 🎨 Arquitectura Técnica

### Estructura del Proyecto

```
src/
├── components/          # Componentes de UI
│   ├── Canvas.tsx      # Lienzo principal con renderizado 2D
│   ├── DialogOverlay.tsx # Sistema de diálogos
│   └── UIControls.tsx  # Controles e indicadores
├── hooks/              # Lógica de juego
│   ├── useGameClock.ts # Reloj del juego y estados
│   ├── useEntityMovement.ts # Movimiento de entidades
│   └── useDialogueSystem.ts # Sistema de mensajes
├── state/              # Gestión de estado global
│   └── GameContext.tsx # Context API + useReducer
├── types/              # Definiciones TypeScript
│   └── index.ts        # Interfaces y tipos
└── utils/              # Utilidades
    ├── dialogues.ts    # Frases y mensajes
    └── storage.ts      # Persistencia en localStorage
```

### Tecnologías Utilizadas

- **React 19** + **TypeScript** - Framework principal
- **Vite** - Build tool y desarrollo
- **Canvas API** - Renderizado gráfico nativo
- **Context API + useReducer** - Estado global sin librerías externas
- **localStorage** - Persistencia del estado del juego

### Características Técnicas

- ✅ **Máquina de estados** implementada en TypeScript puro
- ✅ **Animaciones fluidas** con requestAnimationFrame
- ✅ **Persistencia automática** del progreso
- ✅ **Sistema de diálogos** contextual
- ✅ **Renderizado optimizado** en Canvas 2D
- ✅ **Responsive design** minimalista

## 🔄 Flujo de la Simulación

1. **Inicialización**: Los entes aparecen con 75% de resonancia
2. **Decaimiento natural**: La energía disminuye gradualmente
3. **Búsqueda autónoma**: Cuando baja de 50%, se buscan mutuamente
4. **Crisis**: Con <25%, entran en estado de baja resonancia
5. **Desvanecimiento**: Al llegar a 0%, se desvanecen gradualmente
6. **Recuperación**: Si la resonancia sube de nuevo en menos de 10 segundos, vuelven a la normalidad
7. **Intervención**: El jugador puede nutrir el vínculo en cualquier momento
8. **Renacimiento**: Los entes desvanecidos pueden ser revividos

## 💾 Persistencia

El juego guarda automáticamente:
- Estado actual de las entidades
- Nivel de resonancia
- Número de ciclos transcurridos
- Posición de los entes
- Estado de desvanecimiento

Los datos se preservan entre sesiones usando `localStorage` con la clave `duoEternoState`.

## 🚀 Optimizaciones de Rendimiento

### Versiones Disponibles

El juego incluye dos versiones optimizadas para diferentes necesidades:

- **Versión Estándar** (`App.tsx`) - Funcionalidad completa con todos los efectos
- **Versión Optimizada** (`App.tsx`) - Rendimiento mejorado con efectos adaptativos

La versión se selecciona automáticamente según:
- Entorno de producción → Versión optimizada
- `VITE_TARGET_FPS < 60` → Versión optimizada  
- `VITE_USE_OPTIMIZED=true` → Forzar versión optimizada

### Técnicas de Optimización Implementadas

#### 🎨 Renderizado Optimizado
- **Frame rate limiting** - Control de FPS objetivo configurable
- **Quality scaling** - Reducción automática de calidad en bajo rendimiento
- **Object pooling** - Reutilización de partículas y objetos
- **Gradient caching** - Cacheo de gradientes CSS para evitar recreación

#### 🔄 Lógica de Juego Optimizada
- **Throttled updates** - Actualizaciones menos frecuentes en componentes costosos
- **Delta time calculations** - Actualizaciones basadas en tiempo transcurrido
- **Collision optimization** - Verificaciones de colisión más eficientes
- **State batching** - Agrupación de updates de estado

#### 📊 Sistema de Monitoreo
- **FPS monitoring** - Medición de rendimiento en tiempo real
- **Performance overlay** - Visualización de métricas (modo debug)
- **Adaptive quality** - Ajuste automático según rendimiento

### Configuraciones de Rendimiento

```bash
# Alto rendimiento (máximo FPS)
VITE_TARGET_FPS=30
VITE_MOVEMENT_UPDATE_FPS=15
VITE_USE_OPTIMIZED=true

# Calidad visual (máxima calidad)
VITE_TARGET_FPS=60
VITE_MOVEMENT_UPDATE_FPS=60
VITE_DEBUG_MODE=true
```

## 🎭 Filosofía del Diseño

*Dúo Eterno* explora temas de:
- **Interdependencia emocional**
- **El cuidado como acto consciente**
- **La fragilidad y resistencia de los vínculos**
- **La belleza en la simplicidad**

Es una meditación interactiva sobre cómo las relaciones requieren atención constante para florecer.

---

*Desarrollado con React + TypeScript + Vite*
