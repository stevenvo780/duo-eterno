#!/bin/bash

# Script para cambiar configuraciones rápidamente durante el desarrollo
# Uso: ./quick-config.sh [modo]
# Modos disponibles: turbo, normal, performance, debug

ENV_FILE=".env"

show_help() {
    echo "🎮 Configurador rápido de Dúo Eterno"
    echo ""
    echo "Uso: ./quick-config.sh [modo]"
    echo ""
    echo "Modos disponibles:"
    echo "  turbo       - Eventos muy rápidos para testing (3x velocidad)"
    echo "  normal      - Configuración estándar del juego"
    echo "  performance - Máximo rendimiento, menos efectos visuales"
    echo "  debug       - Modo debug con métricas visibles"
    echo "  custom      - Permite configurar valores manualmente"
    echo ""
    echo "Ejemplos:"
    echo "  ./quick-config.sh turbo     # Acelera todo para testing rápido"
    echo "  ./quick-config.sh normal    # Restaura configuración por defecto"
    echo "  ./quick-config.sh debug     # Activa métricas de rendimiento"
    echo ""
}

set_turbo_mode() {
    echo "🚀 Configurando modo TURBO (eventos acelerados para testing)..."
    cat > $ENV_FILE << 'EOF'
# Modo TURBO - Para testing rápido de eventos
VITE_GAME_SPEED_MULTIPLIER=4.0
VITE_GAME_CLOCK_INTERVAL=150
VITE_STAT_DECAY_SPEED=8.0
VITE_AUTOPOIESIS_INTERVAL=800
VITE_ENTITY_MOVEMENT_SPEED=1.5
VITE_ACTIVITY_CHANGE_FREQUENCY=0.7
VITE_ZONE_EFFECTS_INTERVAL=400
VITE_TARGET_FPS=60
VITE_DEBUG_MODE=true
VITE_DIALOGUE_DURATION=800
VITE_CRITICAL_EVENT_PROBABILITY=0.15
VITE_MOVEMENT_UPDATE_FPS=30
VITE_USE_OPTIMIZED=true
EOF
    echo "✅ Modo turbo activado. Los eventos sucederán muy rápido."
}

set_normal_mode() {
    echo "🎮 Configurando modo NORMAL (configuración estándar)..."
    cat > $ENV_FILE << 'EOF'
# Modo NORMAL - Configuración estándar del juego
VITE_GAME_SPEED_MULTIPLIER=1.0
VITE_GAME_CLOCK_INTERVAL=1000
VITE_STAT_DECAY_SPEED=1.0
VITE_AUTOPOIESIS_INTERVAL=4000
VITE_ENTITY_MOVEMENT_SPEED=0.8
VITE_ACTIVITY_CHANGE_FREQUENCY=0.1
VITE_ZONE_EFFECTS_INTERVAL=2000
VITE_TARGET_FPS=60
VITE_DEBUG_MODE=false
VITE_DIALOGUE_DURATION=3000
VITE_CRITICAL_EVENT_PROBABILITY=0.01
VITE_MOVEMENT_UPDATE_FPS=30
VITE_USE_OPTIMIZED=true
EOF
    echo "✅ Modo normal activado. Configuración estándar del juego."
}

set_performance_mode() {
    echo "⚡ Configurando modo PERFORMANCE (máximo rendimiento)..."
    cat > $ENV_FILE << 'EOF'
# Modo PERFORMANCE - Máximo rendimiento, efectos reducidos
VITE_GAME_SPEED_MULTIPLIER=1.0
VITE_GAME_CLOCK_INTERVAL=1500
VITE_STAT_DECAY_SPEED=1.0
VITE_AUTOPOIESIS_INTERVAL=5000
VITE_ENTITY_MOVEMENT_SPEED=0.8
VITE_ACTIVITY_CHANGE_FREQUENCY=0.08
VITE_ZONE_EFFECTS_INTERVAL=3000
VITE_TARGET_FPS=30
VITE_DEBUG_MODE=false
VITE_DIALOGUE_DURATION=2000
VITE_CRITICAL_EVENT_PROBABILITY=0.01
VITE_MOVEMENT_UPDATE_FPS=20
VITE_USE_OPTIMIZED=true
EOF
    echo "✅ Modo performance activado. Optimizado para máximo rendimiento."
}

set_debug_mode() {
    echo "🐛 Configurando modo DEBUG (métricas visibles)..."
    cat > $ENV_FILE << 'EOF'
# Modo DEBUG - Con métricas de rendimiento visibles
VITE_GAME_SPEED_MULTIPLIER=2.0
VITE_GAME_CLOCK_INTERVAL=300
VITE_STAT_DECAY_SPEED=3.0
VITE_AUTOPOIESIS_INTERVAL=1500
VITE_ENTITY_MOVEMENT_SPEED=1.0
VITE_ACTIVITY_CHANGE_FREQUENCY=0.3
VITE_ZONE_EFFECTS_INTERVAL=800
VITE_TARGET_FPS=60
VITE_DEBUG_MODE=true
VITE_DIALOGUE_DURATION=1500
VITE_CRITICAL_EVENT_PROBABILITY=0.08
VITE_MOVEMENT_UPDATE_FPS=30
VITE_USE_OPTIMIZED=true
EOF
    echo "✅ Modo debug activado. Métricas de rendimiento visibles."
}

set_custom_mode() {
    echo "🛠️  Modo CUSTOM - Configuración manual"
    echo ""
    echo "Introduce los valores (presiona Enter para mantener el valor por defecto):"
    
    read -p "Multiplicador de velocidad del juego (1.0): " speed
    speed=${speed:-1.0}
    
    read -p "Intervalo del game clock en ms (1000): " clock
    clock=${clock:-1000}
    
    read -p "Velocidad de degradación de stats (1.0): " decay
    decay=${decay:-1.0}
    
    read -p "Intervalo de autopoiesis en ms (4000): " auto
    auto=${auto:-4000}
    
    read -p "¿Activar modo debug? (s/N): " debug_input
    if [[ $debug_input =~ ^[Ss]$ ]]; then
        debug_mode="true"
    else
        debug_mode="false"
    fi
    
    read -p "FPS objetivo (60): " fps
    fps=${fps:-60}
    
    cat > $ENV_FILE << EOF
# Configuración CUSTOM
VITE_GAME_SPEED_MULTIPLIER=$speed
VITE_GAME_CLOCK_INTERVAL=$clock
VITE_STAT_DECAY_SPEED=$decay
VITE_AUTOPOIESIS_INTERVAL=$auto
VITE_ENTITY_MOVEMENT_SPEED=0.8
VITE_ACTIVITY_CHANGE_FREQUENCY=0.15
VITE_ZONE_EFFECTS_INTERVAL=1000
VITE_TARGET_FPS=$fps
VITE_DEBUG_MODE=$debug_mode
VITE_DIALOGUE_DURATION=2500
VITE_CRITICAL_EVENT_PROBABILITY=0.02
VITE_MOVEMENT_UPDATE_FPS=30
VITE_USE_OPTIMIZED=true
EOF
    echo "✅ Configuración custom aplicada."
}

show_current_config() {
    echo "📋 Configuración actual:"
    if [ -f $ENV_FILE ]; then
        echo ""
        grep -E "^VITE_" $ENV_FILE | while read line; do
            echo "  $line"
        done
    else
        echo "  No hay archivo .env configurado"
    fi
    echo ""
}

# Función principal
case "$1" in
    "turbo")
        set_turbo_mode
        ;;
    "normal")
        set_normal_mode
        ;;
    "performance")
        set_performance_mode
        ;;
    "debug")
        set_debug_mode
        ;;
    "custom")
        set_custom_mode
        ;;
    "show"|"status")
        show_current_config
        exit 0
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        exit 0
        ;;
    *)
        echo "❌ Modo desconocido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

echo ""
echo "🔄 Configuración aplicada. Reinicia el servidor de desarrollo para que los cambios surtan efecto:"
echo "   Presiona Ctrl+C en el terminal del servidor y ejecuta: npm run dev"
echo ""
echo "💡 Comandos útiles en el navegador (modo debug):"
echo "   - setTurboMode(true)  // Activa modo turbo temporalmente"
echo "   - setDebugMode(true)  // Activa métricas de debug"
echo "   - logConfig()         // Muestra la configuración actual"
echo ""
show_current_config
