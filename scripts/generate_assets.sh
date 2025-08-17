#!/bin/bash
# Script para generar todos los assets del proyecto (v2 - Estilo Mejorado)

# Asegurarse de que el script de python es ejecutable
chmod +x scripts/create-pixel-art.py

# Directorios de salida
PUBLIC_ASSETS_DIR="public/assets/pixel_art"
SRC_ASSETS_DIR="src/assets/pixel-art"

# Crear directorios si no existen
mkdir -p $PUBLIC_ASSETS_DIR
mkdir -p $SRC_ASSETS_DIR

echo "--- Generando assets con Estilo Mejorado v2 ---"

# --- Entidades (Public) ---
# La lógica de color ahora está en el script de python, solo pasamos el color base
python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_circulo_principal.png --shape circle --color "gold" --size 32x32
python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_circulo_viva.png --shape circle --color "player_1_base" --size 32x32
python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_circulo_muriendo.png --shape circle --mood dying --size 32x32

python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_cuadrado_principal.png --shape square --color "gold" --size 32x32
python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_cuadrado_viva.png --shape square --color "player_2_base" --size 32x32
python3 scripts/create-pixel-art.py entidad $PUBLIC_ASSETS_DIR/entidad_cuadrado_muriendo.png --shape square --mood dying --size 32x32

# --- Zonas (Public) - Usando la nueva paleta ---
python3 scripts/create-pixel-art.py obstaculo $PUBLIC_ASSETS_DIR/obstaculo_arbol.png --obstacle_type tree --size 48x48
python3 scripts/create-pixel-art.py obstaculo $PUBLIC_ASSETS_DIR/obstaculo_roca.png --obstacle_type rock --size 32x32
python3 scripts/create-pixel-art.py zona $PUBLIC_ASSETS_DIR/zona_cocina.png --icon food --color "food_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $PUBLIC_ASSETS_DIR/zona_descanso.png --icon rest --color "rest_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $PUBLIC_ASSETS_DIR/zona_juegos.png --icon play --color "play_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $PUBLIC_ASSETS_DIR/zona_social.png --icon social --color "social_zone" --size 64x64

# --- UI y otros (Public) ---
python3 scripts/create-pixel-art.py ui $PUBLIC_ASSETS_DIR/barra_estadistica.png --element progress_bar --fill 0.7 --color "progress_bar" --size 128x20
python3 scripts/create-pixel-art.py ui $PUBLIC_ASSETS_DIR/dialogo_overlay.png --element button --size 300x100
python3 scripts/create-pixel-art.py bg $PUBLIC_ASSETS_DIR/canvas_base.png --pattern dots --size 800x600

# --- Fondos (Src) ---
python3 scripts/create-pixel-art.py bg $SRC_ASSETS_DIR/bg_dots.png --pattern dots --size 256x256
python3 scripts/create-pixel-art.py bg $SRC_ASSETS_DIR/bg_hearts.png --pattern hearts --size 256x256

# --- Entidades (Src) ---
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_circle.png --shape circle --color "player_1_base" --size 32x32
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_circle_happy.png --shape circle --mood happy --size 32x32
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_circle_sad.png --shape circle --mood sad --size 32x32

python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_square.png --shape square --color "player_2_base" --size 32x32
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_square_happy.png --shape square --mood happy --size 32x32
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/entity_square_sad.png --shape square --mood sad --size 32x32

# --- UI (Src) ---
python3 scripts/create-pixel-art.py ui $SRC_ASSETS_DIR/button_base.png --element button --size 128x48
python3 scripts/create-pixel-art.py entidad $SRC_ASSETS_DIR/heart_icon.png --shape circle --color "sad_base" --size 24x24 # Recreado como una entidad
python3 scripts/create-pixel-art.py ui $SRC_ASSETS_DIR/progress_bar_empty.png --element progress_bar --fill 0.0 --color "progress_bar" --size 128x16
python3 scripts/create-pixel-art.py ui $SRC_ASSETS_DIR/progress_bar_full.png --element progress_bar --fill 1.0 --color "progress_bar" --size 128x16

# --- Zonas (Src) ---
python3 scripts/create-pixel-art.py zona $SRC_ASSETS_DIR/zone_food.png --icon food --color "food_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $SRC_ASSETS_DIR/zone_play.png --icon play --color "play_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $SRC_ASSETS_DIR/zone_rest.png --icon rest --color "rest_zone" --size 64x64
python3 scripts/create-pixel-art.py zona $SRC_ASSETS_DIR/zone_social.png --icon social --color "social_zone" --size 64x64

echo "
--- ¡Todos los assets han sido generados con el nuevo estilo v2! ---"
