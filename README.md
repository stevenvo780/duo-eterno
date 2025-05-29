# Dúo Eterno: Un Tamagotchi del Vínculo

Una simulación interactiva minimalista donde dos entes pixelados representan la esencia de un vínculo que requiere cuidado y atención para mantenerse vivo.

## 🎮 Descripción del Juego

**Dúo Eterno** es un Tamagotchi conceptual que explora la naturaleza de las conexiones humanas a través de dos entidades abstractas:
- Un **círculo** y un **cuadrado** que existen en un lienzo de 400×400 píxeles
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

## 🎯 Mecánicas del Juego

### Estados de los Entes

Cada entidad puede estar en uno de estos cuatro estados:

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
6. **Intervención**: El jugador puede nutrir el vínculo en cualquier momento
7. **Renacimiento**: Los entes desvanecidos pueden ser revividos

## 💾 Persistencia

El juego guarda automáticamente:
- Estado actual de las entidades
- Nivel de resonancia
- Número de ciclos transcurridos
- Posición de los entes
- Estado de desvanecimiento

Los datos se preservan entre sesiones usando `localStorage` con la clave `duoEternoState`.

## 🎭 Filosofía del Diseño

*Dúo Eterno* explora temas de:
- **Interdependencia emocional**
- **El cuidado como acto consciente**
- **La fragilidad y resistencia de los vínculos**
- **La belleza en la simplicidad**

Es una meditación interactiva sobre cómo las relaciones requieren atención constante para florecer.

---

*Desarrollado con React + TypeScript + Vite*
