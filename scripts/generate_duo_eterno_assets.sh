#!/bin/bash

# Generador automático de assets para Dúo Eterno
# Este script genera todos los assets necesarios con las dimensiones optimizadas

echo "🎨 Generando assets pixel art para Dúo Eterno..."

# Crear directorio de assets si no existe
mkdir -p assets

# Canvas base (1000x600)
echo "📐 Generando canvas base..."
python3 scripts/create-pixel-art.py ui assets/canvas_base.png --size 1000x600 --element canvas_base --pattern subtle_dots

# Zonas con dimensiones específicas
echo "🏠 Generando zonas..."
python3 scripts/create-pixel-art.py zona assets/zona_cocina.png --size 120x80 --zone_type cocina --icon cocina
python3 scripts/create-pixel-art.py zona assets/zona_descanso.png --size 140x100 --zone_type descanso --icon descanso
python3 scripts/create-pixel-art.py zona assets/zona_juegos.png --size 200x140 --zone_type juegos --icon juegos
python3 scripts/create-pixel-art.py zona assets/zona_social.png --size 180x120 --zone_type social --icon social
python3 scripts/create-pixel-art.py zona assets/zona_trabajo.png --size 140x100 --zone_type trabajo --icon trabajo

# Entidades (32x32)
echo "👾 Generando entidades..."
python3 scripts/create-pixel-art.py entidad assets/entidad_feliz.png --size 32x32 --shape circle --mood happy
python3 scripts/create-pixel-art.py entidad assets/entidad_triste.png --size 32x32 --shape circle --mood sad
python3 scripts/create-pixel-art.py entidad assets/entidad_cuadrada.png --size 32x32 --shape square --mood normal --color "#3b7a8f"
python3 scripts/create-pixel-art.py entidad assets/entidad_muriendo.png --size 32x32 --shape circle --mood dying

# Obstáculos con dimensiones específicas
echo "🌳 Generando obstáculos..."
python3 scripts/create-pixel-art.py obstaculo assets/arbol.png --size 25x60 --obstacle_type tree
python3 scripts/create-pixel-art.py obstaculo assets/roca.png --size 30x40 --obstacle_type rock

# Elementos de UI
echo "🖥️  Generando elementos de UI..."
python3 scripts/create-pixel-art.py ui assets/barra_salud.png --size 100x16 --element barra_estadistica --color "#7ac75a" --fill 0.8
python3 scripts/create-pixel-art.py ui assets/barra_felicidad.png --size 100x16 --element barra_estadistica --color "#f2d450" --fill 0.6
python3 scripts/create-pixel-art.py ui assets/barra_energia.png --size 100x16 --element barra_estadistica --color "#639bff" --fill 0.4
python3 scripts/create-pixel-art.py ui assets/barra_hambre.png --size 100x16 --element barra_estadistica --color "#df6f31" --fill 0.3
python3 scripts/create-pixel-art.py ui assets/dialogo_overlay.png --size 320x120 --element dialogo_overlay
python3 scripts/create-pixel-art.py ui assets/boton_interaccion.png --size 80x32 --element button

# Elementos decorativos
echo "🌸 Generando elementos decorativos..."
python3 scripts/create-pixel-art.py decorativo assets/flor_rosa.png --size 8x8 --decorative_type flower
python3 scripts/create-pixel-art.py decorativo assets/flor_amarilla.png --size 8x8 --decorative_type flower
python3 scripts/create-pixel-art.py decorativo assets/flor_azul.png --size 8x8 --decorative_type flower
python3 scripts/create-pixel-art.py decorativo assets/banco.png --size 24x12 --decorative_type banco
python3 scripts/create-pixel-art.py decorativo assets/lampara.png --size 16x24 --decorative_type lampara
python3 scripts/create-pixel-art.py decorativo assets/fuente_agua.png --size 32x32 --decorative_type fuente

echo "✅ Todos los assets han sido generados exitosamente en el directorio 'assets/'"
echo ""
echo "📋 Resumen de assets generados:"
echo "  - Canvas base: 1000x600px"
echo "  - Zonas: cocina(120x80), descanso(140x100), juegos(200x140), social(180x120), trabajo(140x100)"
echo "  - Entidades: 32x32px (feliz, triste, cuadrada, muriendo)"
echo "  - Obstáculos: árboles(25x60), rocas(30x40)"
echo "  - UI: barras estadísticas(100x16), diálogo(320x120), botón(80x32)"
echo "  - Decorativos: flores(8x8), bancos(24x12), lámparas(16x24), fuentes(32x32)"
echo ""
echo "🎮 ¡Los assets de pixel art están listos para usar en Dúo Eterno!"