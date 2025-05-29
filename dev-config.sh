#!/bin/bash

# Script para cambiar configuraciones de desarrollo rápidamente
# Uso: ./dev-config.sh [normal|debug|performance|production]

CONFIG_TYPE=${1:-normal}

case $CONFIG_TYPE in
  "debug"|"turbo")
    echo "🚀 Configurando modo DEBUG/TURBO (eventos acelerados)..."
    cat > .env << EOL
# Configuración DEBUG - Eventos acelerados para testing rápido
VITE_GAME_SPEED_MULTIPLIER=5.0
VITE_GAME_CLOCK_INTERVAL=100
VITE_STAT_DECAY_SPEED=8.0
VITE_AUTOPOIESIS_INTERVAL=800
VITE_ACTIVITY_CHANGE_FREQUENCY=0.8
VITE_ZONE_EFFECTS_INTERVAL=400
VITE_DIALOGUE_DURATION=800
VITE_CRITICAL_EVENT_PROBABILITY=0.15
VITE_DEBUG_MODE=true
VITE_USE_OPTIMIZED=true
VITE_TARGET_FPS=30
VITE_MOVEMENT_UPDATE_FPS=20
EOL
    ;;
    
  "performance")
    echo "⚡ Configurando modo PERFORMANCE (máximo rendimiento)..."
    cat > .env << EOL
# Configuración PERFORMANCE - Máximo rendimiento
VITE_GAME_SPEED_MULTIPLIER=1.0
VITE_GAME_CLOCK_INTERVAL=800
VITE_STAT_DECAY_SPEED=1.0
VITE_AUTOPOIESIS_INTERVAL=3000
VITE_ACTIVITY_CHANGE_FREQUENCY=0.1
VITE_ZONE_EFFECTS_INTERVAL=2000
VITE_DIALOGUE_DURATION=2000
VITE_CRITICAL_EVENT_PROBABILITY=0.01
VITE_DEBUG_MODE=false
VITE_USE_OPTIMIZED=true
VITE_TARGET_FPS=30
VITE_MOVEMENT_UPDATE_FPS=15
EOL
    ;;
    
  "production")
    echo "🏭 Configurando modo PRODUCTION (valores balanceados)..."
    cat > .env << EOL
# Configuración PRODUCTION - Valores balanceados
VITE_GAME_SPEED_MULTIPLIER=1.0
VITE_GAME_CLOCK_INTERVAL=1000
VITE_STAT_DECAY_SPEED=1.0
VITE_AUTOPOIESIS_INTERVAL=4000
VITE_ACTIVITY_CHANGE_FREQUENCY=0.12
VITE_ZONE_EFFECTS_INTERVAL=1500
VITE_DIALOGUE_DURATION=2500
VITE_CRITICAL_EVENT_PROBABILITY=0.01
VITE_DEBUG_MODE=false
VITE_USE_OPTIMIZED=true
VITE_TARGET_FPS=60
VITE_MOVEMENT_UPDATE_FPS=30
EOL
    ;;
    
  "normal"|*)
    echo "🎮 Configurando modo NORMAL (desarrollo estándar)..."
    cat > .env << EOL
# Configuración NORMAL - Desarrollo estándar
VITE_GAME_SPEED_MULTIPLIER=1.5
VITE_GAME_CLOCK_INTERVAL=500
VITE_STAT_DECAY_SPEED=2.0
VITE_AUTOPOIESIS_INTERVAL=2000
VITE_ACTIVITY_CHANGE_FREQUENCY=0.25
VITE_ZONE_EFFECTS_INTERVAL=1000
VITE_DIALOGUE_DURATION=1500
VITE_CRITICAL_EVENT_PROBABILITY=0.05
VITE_DEBUG_MODE=true
VITE_USE_OPTIMIZED=true
VITE_TARGET_FPS=60
VITE_MOVEMENT_UPDATE_FPS=30
EOL
    ;;
esac

echo "✅ Configuración '$CONFIG_TYPE' aplicada."
echo ""
echo "Modos disponibles:"
echo "  normal      - Desarrollo estándar (ligeramente acelerado)"
echo "  debug       - Eventos muy rápidos para testing"
echo "  performance - Máximo rendimiento, FPS reducido"
echo "  production  - Valores balanceados para producción"
echo ""
echo "💡 Tip: En la consola del navegador puedes usar:"
echo "   setTurboMode(true)  - Acelerar temporalmente"
echo "   setDebugMode(true)  - Mostrar métricas"
echo "   logConfig()         - Ver configuración actual"
