#!/usr/bin/env python3
"""
Clasificador de sprites de pixel art mejorado - Específico para juegos 2D
Usa análisis visual especializado en pixel art y patrones de naming inteligentes.
"""

import os
import shutil
import json
import numpy as np
from PIL import Image, ImageOps, ImageFilter
import imagehash
from pathlib import Path
import argparse
import sys
from typing import Dict, List, Tuple, Set, Optional
import cv2
from collections import Counter, defaultdict
import re

class PixelArtSpriteClassifier:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.assets_path = self.base_path / "assets"
        
        # Categorías válidas mejoradas para pixel art
        self.valid_categories = {
            'buildings': {
                'keywords': ['edificio', 'building', 'casa', 'tower', 'estructura', 'construccion', 'tile'],
                'patterns': [r'tile_\d+.*edificio', r'building', r'casa', r'tower'],
                'color_palette': 'architecture',
                'size_hints': {'min_area': 400, 'typical_ratio': (0.8, 1.5)}
            },
            'sprites': {
                'keywords': ['entidad', 'character', 'player', 'sprite', 'anim', 'happy', 'sad', 'dying'],
                'patterns': [r'entidad_', r'.*_anim', r'player', r'character'],
                'color_palette': 'characters',
                'size_hints': {'min_area': 100, 'typical_ratio': (0.6, 1.8)}
            },
            'nature': {
                'keywords': ['arbol', 'tree', 'plant', 'planta', 'vegetacion', 'foliage', 'leaf'],
                'patterns': [r'tree', r'plant', r'leaf', r'nature'],
                'color_palette': 'organic',
                'size_hints': {'min_area': 200, 'typical_ratio': (0.4, 2.5)}
            },
            'ground': {
                'keywords': ['suelo', 'ground', 'tierra', 'arena', 'piedra', 'cesped', 'piso', 'textura'],
                'patterns': [r'ground', r'floor', r'terrain', r'grass'],
                'color_palette': 'terrain',
                'size_hints': {'min_area': 300, 'typical_ratio': (0.8, 1.5)}
            },
            'water': {
                'keywords': ['agua', 'water', 'rio', 'estanque', 'lake', 'liquido'],
                'patterns': [r'water', r'lake', r'river', r'ocean'],
                'color_palette': 'water',
                'size_hints': {'min_area': 300, 'typical_ratio': (0.5, 3.0)}
            },
            'roads': {
                'keywords': ['carretera', 'road', 'camino', 'path', 'via', 'street'],
                'patterns': [r'road', r'path', r'street', r'way'],
                'color_palette': 'infrastructure',
                'size_hints': {'min_area': 200, 'typical_ratio': (0.2, 5.0)}
            }
        }
        
        # Paletas de colores específicas para pixel art
        self.color_palettes = {
            'architecture': {
                'primary': [(139, 69, 19), (105, 105, 105), (128, 128, 128), (165, 42, 42)],  # Marrones, grises, rojos
                'secondary': [(222, 184, 135), (160, 82, 45), (205, 133, 63)],  # Tierra, madera
                'accent': [(255, 255, 255), (0, 0, 0), (64, 64, 64)]  # Contrastes
            },
            'characters': {
                'primary': [(255, 192, 203), (255, 255, 0), (255, 165, 0), (255, 20, 147)],  # Colores vivos
                'secondary': [(255, 228, 181), (244, 164, 96), (210, 180, 140)],  # Tonos piel
                'accent': [(0, 0, 0), (255, 255, 255), (128, 0, 128)]  # Contrastes y detalles
            },
            'organic': {
                'primary': [(34, 139, 34), (0, 100, 0), (144, 238, 144), (46, 125, 50)],  # Verdes
                'secondary': [(139, 69, 19), (160, 82, 45), (101, 67, 33)],  # Marrones madera
                'accent': [(255, 255, 0), (255, 20, 147), (255, 69, 0)]  # Flores, frutos
            },
            'terrain': {
                'primary': [(210, 180, 140), (222, 184, 135), (160, 82, 45), (139, 69, 19)],  # Tierras
                'secondary': [(34, 139, 34), (0, 100, 0), (85, 107, 47)],  # Cesped
                'accent': [(105, 105, 105), (169, 169, 169), (128, 128, 128)]  # Piedras
            },
            'water': {
                'primary': [(0, 191, 255), (30, 144, 255), (176, 224, 230), (70, 130, 180)],  # Azules
                'secondary': [(0, 206, 209), (64, 224, 208), (175, 238, 238)],  # Azules claros
                'accent': [(255, 255, 255), (240, 248, 255), (173, 216, 230)]  # Espuma, reflejos
            },
            'infrastructure': {
                'primary': [(105, 105, 105), (169, 169, 169), (128, 128, 128), (64, 64, 64)],  # Grises
                'secondary': [(139, 69, 19), (160, 82, 45), (101, 67, 33)],  # Marrones
                'accent': [(255, 255, 0), (255, 0, 0), (255, 255, 255)]  # Señalización
            }
        }
        
        # Resultados del análisis
        self.analysis_results = {
            'classified': [],
            'duplicates_removed': [],
            'renamed': [],
            'errors': [],
            'stats': defaultdict(int)
        }
        
        # Cache para análisis de imágenes
        self._image_cache = {}
    
    def extract_pixel_art_features(self, image_path: str) -> Dict:
        """Extrae características específicas de pixel art."""
        if image_path in self._image_cache:
            return self._image_cache[image_path]
        
        try:
            with Image.open(image_path) as img:
                # Convertir a RGB si es necesario
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                original_size = img.size
                img_array = np.array(img)
                
                features = {
                    'size': original_size,
                    'area': original_size[0] * original_size[1],
                    'aspect_ratio': original_size[0] / original_size[1] if original_size[1] > 0 else 1,
                    'is_small': original_size[0] <= 64 and original_size[1] <= 64,
                    'is_tile_size': original_size[0] == original_size[1] and original_size[0] in [16, 32, 64, 128],
                    'unique_colors': 0,
                    'has_transparency': False,
                    'dominant_colors': [],
                    'color_complexity': 0,
                    'edge_density': 0,
                    'symmetry_score': 0,
                    'pattern_repetition': 0
                }
                
                # Analizar transparencia si existe
                if img.mode in ('RGBA', 'LA') or 'transparency' in img.info:
                    features['has_transparency'] = True
                
                # Contar colores únicos (característica clave del pixel art)
                if img_array.ndim == 3:
                    pixels = img_array.reshape(-1, img_array.shape[-1])
                    unique_pixels = np.unique(pixels, axis=0)
                    features['unique_colors'] = len(unique_pixels)
                    
                    # Colores dominantes
                    if len(unique_pixels) > 0:
                        # Calcular frecuencia de colores
                        pixel_tuples = [tuple(pixel) for pixel in pixels]
                        color_counts = Counter(pixel_tuples)
                        total_pixels = len(pixel_tuples)
                        
                        # Top 5 colores más frecuentes
                        top_colors = color_counts.most_common(5)
                        features['dominant_colors'] = [
                            {'color': color, 'frequency': count / total_pixels}
                            for color, count in top_colors
                        ]
                        
                        # Complejidad de color (diversidad de la paleta)
                        features['color_complexity'] = len(unique_pixels) / total_pixels
                
                # Análisis de bordes (importante para sprites)
                gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                edges = cv2.Canny(gray, 50, 150)
                features['edge_density'] = np.sum(edges > 0) / (gray.shape[0] * gray.shape[1])
                
                # Análisis de simetría
                features['symmetry_score'] = self._calculate_symmetry(gray)
                
                # Detección de patrones repetitivos
                features['pattern_repetition'] = self._detect_pattern_repetition(gray)
                
                self._image_cache[image_path] = features
                return features
                
        except Exception as e:
            print(f"Error analizando {image_path}: {e}")
            return {
                'size': (0, 0), 'area': 0, 'aspect_ratio': 1, 'is_small': False,
                'is_tile_size': False, 'unique_colors': 0, 'has_transparency': False,
                'dominant_colors': [], 'color_complexity': 0, 'edge_density': 0,
                'symmetry_score': 0, 'pattern_repetition': 0
            }
    
    def _calculate_symmetry(self, gray_image: np.ndarray) -> float:
        """Calcula el score de simetría de la imagen."""
        try:
            h, w = gray_image.shape
            
            # Simetría horizontal
            left_half = gray_image[:, :w//2]
            right_half = gray_image[:, w//2:]
            right_half_flipped = np.fliplr(right_half)
            
            if left_half.shape == right_half_flipped.shape:
                h_symmetry = np.corrcoef(left_half.flatten(), right_half_flipped.flatten())[0, 1]
                h_symmetry = max(0, h_symmetry) if not np.isnan(h_symmetry) else 0
            else:
                h_symmetry = 0
            
            # Simetría vertical
            top_half = gray_image[:h//2, :]
            bottom_half = gray_image[h//2:, :]
            bottom_half_flipped = np.flipud(bottom_half)
            
            if top_half.shape == bottom_half_flipped.shape:
                v_symmetry = np.corrcoef(top_half.flatten(), bottom_half_flipped.flatten())[0, 1]
                v_symmetry = max(0, v_symmetry) if not np.isnan(v_symmetry) else 0
            else:
                v_symmetry = 0
            
            return max(h_symmetry, v_symmetry)
            
        except Exception:
            return 0.0
    
    def _detect_pattern_repetition(self, gray_image: np.ndarray) -> float:
        """Detecta patrones repetitivos en la imagen."""
        try:
            h, w = gray_image.shape
            
            # Buscar patrones de 8x8, 16x16, 32x32
            pattern_scores = []
            
            for pattern_size in [8, 16, 32]:
                if h >= pattern_size * 2 and w >= pattern_size * 2:
                    # Extraer primer patrón
                    pattern = gray_image[:pattern_size, :pattern_size]
                    
                    # Buscar coincidencias
                    matches = 0
                    total_windows = 0
                    
                    for y in range(0, h - pattern_size + 1, pattern_size):
                        for x in range(0, w - pattern_size + 1, pattern_size):
                            window = gray_image[y:y+pattern_size, x:x+pattern_size]
                            if window.shape == pattern.shape:
                                correlation = np.corrcoef(pattern.flatten(), window.flatten())[0, 1]
                                if not np.isnan(correlation) and correlation > 0.8:
                                    matches += 1
                            total_windows += 1
                    
                    if total_windows > 0:
                        pattern_scores.append(matches / total_windows)
            
            return max(pattern_scores) if pattern_scores else 0.0
            
        except Exception:
            return 0.0
    
    def analyze_filename_patterns(self, filename: str) -> Dict:
        """Analiza patrones en el nombre del archivo con mapeo directo."""
        name_lower = filename.lower()
        stem = Path(filename).stem.lower()
        
        analysis = {
            'detected_patterns': [],
            'category_scores': defaultdict(float),
            'naming_confidence': 0.0,
            'extracted_info': {},
            'direct_mapping': None
        }
        
        # Mapeo directo para patrones tile_XXXX_CATEGORIA
        tile_category_mapping = {
            'edificio': 'buildings',
            'building': 'buildings', 
            'casa': 'buildings',
            'tower': 'buildings',
            'suelo': 'ground',
            'ground': 'ground',
            'tierra': 'ground',
            'arena': 'ground',
            'piedra': 'ground',
            'cesped': 'ground',
            'piso': 'ground',
            'carretera': 'roads',
            'road': 'roads',
            'camino': 'roads',
            'path': 'roads',
            'via': 'roads',
            'street': 'roads',
            'agua': 'water',
            'water': 'water',
            'rio': 'water',
            'lake': 'water',
            'estanque': 'water'
        }
        
        # Detectar patrón tile_XXXX_CATEGORIA específico
        tile_match = re.search(r'tile_\d+_([^_]+)', stem)
        if tile_match:
            category_word = tile_match.group(1)
            if category_word in tile_category_mapping:
                direct_category = tile_category_mapping[category_word]
                analysis['direct_mapping'] = direct_category
                analysis['category_scores'][direct_category] = 1.0
                analysis['naming_confidence'] = 1.0
                analysis['detected_patterns'].append('direct_tile_mapping')
                analysis['extracted_info']['direct_category'] = category_word
                return analysis
        
        # Detectar patrón entidad específico
        entity_match = re.search(r'entidad_([^_]+)(?:_([^_]+))?(?:_([^_]+))?', stem)
        if entity_match:
            analysis['direct_mapping'] = 'sprites'
            analysis['category_scores']['sprites'] = 1.0
            analysis['naming_confidence'] = 1.0
            analysis['detected_patterns'].append('direct_entity_mapping')
            analysis['extracted_info']['entity_info'] = entity_match.groups()
            return analysis
        
        # Detectar otros patrones específicos
        patterns = {
            'animation_pattern': r'.*_anim.*',
            'state_pattern': r'.*(happy|sad|dying|idle|walking|running).*',
            'size_pattern': r'.*(pequeño|grande|alto|comercial|small|big|large).*',
            'building_type': r'.*(edificio|building|casa|tower).*'
        }
        
        for pattern_name, pattern in patterns.items():
            match = re.search(pattern, stem)
            if match:
                analysis['detected_patterns'].append(pattern_name)
                analysis['extracted_info'][pattern_name] = match.groups()
        
        # Calcular scores por categoría solo si no hay mapeo directo
        for category, category_info in self.valid_categories.items():
            score = 0.0
            
            # Score por keywords
            for keyword in category_info['keywords']:
                if keyword in name_lower:
                    score += 0.5
            
            # Score por patrones regex
            for pattern in category_info['patterns']:
                if re.search(pattern, stem):
                    score += 0.6
            
            # Bonificaciones por patrones específicos (sin tile genérico)
            if category == 'sprites' and 'animation_pattern' in analysis['detected_patterns']:
                score += 0.4
            elif category == 'buildings' and 'building_type' in analysis['detected_patterns']:
                score += 0.4
            
            analysis['category_scores'][category] = min(1.0, score)
        
        # Calcular confianza general del naming
        if analysis['category_scores']:
            max_score = max(analysis['category_scores'].values())
            second_max = sorted(analysis['category_scores'].values(), reverse=True)[1] if len(analysis['category_scores']) > 1 else 0
            analysis['naming_confidence'] = max_score - second_max
        
        return analysis
    
    def match_color_palette(self, features: Dict, palette_name: str) -> float:
        """Calcula qué tan bien coincide la imagen con una paleta de colores."""
        if not features['dominant_colors'] or palette_name not in self.color_palettes:
            return 0.0
        
        palette = self.color_palettes[palette_name]
        all_palette_colors = palette['primary'] + palette['secondary'] + palette['accent']
        
        total_score = 0.0
        total_weight = 0.0
        
        for color_info in features['dominant_colors'][:3]:  # Top 3 colores
            color = np.array(color_info['color'])
            frequency = color_info['frequency']
            
            # Encontrar el color más cercano en la paleta
            min_distance = float('inf')
            for palette_color in all_palette_colors:
                distance = np.linalg.norm(color - np.array(palette_color))
                min_distance = min(min_distance, distance)
            
            # Convertir distancia a score (0-1)
            color_score = max(0, 1 - (min_distance / 255))
            total_score += color_score * frequency
            total_weight += frequency
        
        return total_score / total_weight if total_weight > 0 else 0.0
    
    def classify_image_intelligent(self, image_path: str) -> Dict:
        """Clasificación inteligente combinando múltiples características."""
        filename = Path(image_path).name
        
        # Extraer características
        visual_features = self.extract_pixel_art_features(image_path)
        filename_analysis = self.analyze_filename_patterns(filename)
        
        # Scores iniciales por categoría
        category_scores = defaultdict(float)
        
        # Si hay mapeo directo, usarlo con máxima prioridad
        if filename_analysis.get('direct_mapping'):
            direct_category = filename_analysis['direct_mapping']
            return {
                'category': direct_category,
                'confidence': 0.95,
                'method': 'direct_filename_mapping',
                'breakdown': {
                    'filename_analysis': filename_analysis,
                    'visual_features': visual_features,
                    'category_scores': {direct_category: 0.95}
                },
                'description': f'Mapeo directo por filename: {direct_category}'
            }
        
        # Si no hay mapeo directo, usar análisis combinado
        
        # 1. Score por análisis de filename (peso: 60%)
        for category, score in filename_analysis['category_scores'].items():
            category_scores[category] += score * 0.6
        
        # 2. Score por características visuales (peso: 25%)
        for category, category_info in self.valid_categories.items():
            visual_score = 0.0
            
            # Verificar tamaño típico
            size_hints = category_info['size_hints']
            if visual_features['area'] >= size_hints['min_area']:
                visual_score += 0.2
            
            # Verificar aspect ratio típico
            ratio_range = size_hints['typical_ratio']
            if ratio_range[0] <= visual_features['aspect_ratio'] <= ratio_range[1]:
                visual_score += 0.2
            
            # Score específico por tipo
            if category == 'buildings':
                if visual_features['is_tile_size'] or visual_features['pattern_repetition'] > 0.3:
                    visual_score += 0.3
                if visual_features['symmetry_score'] > 0.6:
                    visual_score += 0.2
            
            elif category == 'sprites':
                if visual_features['has_transparency'] or visual_features['edge_density'] > 0.1:
                    visual_score += 0.3
                if 50 <= visual_features['unique_colors'] <= 200:  # Paleta típica de personajes
                    visual_score += 0.2
            
            elif category == 'nature':
                if visual_features['color_complexity'] > 0.1:  # Más variedad de colores
                    visual_score += 0.2
                if visual_features['edge_density'] > 0.05:  # Formas orgánicas
                    visual_score += 0.2
            
            elif category in ['ground', 'water', 'roads']:
                if visual_features['pattern_repetition'] > 0.4:  # Patrones de textura
                    visual_score += 0.3
                if visual_features['is_tile_size']:
                    visual_score += 0.2
            
            category_scores[category] += visual_score * 0.25
        
        # 3. Score por paleta de colores (peso: 15%)
        for category, category_info in self.valid_categories.items():
            if 'color_palette' in category_info:
                palette_score = self.match_color_palette(visual_features, category_info['color_palette'])
                category_scores[category] += palette_score * 0.15
        
        # Encontrar mejor categoría
        if category_scores:
            best_category = max(category_scores.keys(), key=lambda k: category_scores[k])
            confidence = category_scores[best_category]
            
            # Ajustar confianza basada en la diferencia con el segundo mejor
            sorted_scores = sorted(category_scores.values(), reverse=True)
            if len(sorted_scores) > 1:
                confidence_margin = sorted_scores[0] - sorted_scores[1]
                confidence = min(1.0, confidence + confidence_margin * 0.2)
        else:
            best_category = 'sprites'
            confidence = 0.1
        
        return {
            'category': best_category,
            'confidence': confidence,
            'method': 'intelligent_pixel_art',
            'breakdown': {
                'filename_analysis': filename_analysis,
                'visual_features': visual_features,
                'category_scores': dict(category_scores)
            },
            'description': f'Clasificado con análisis inteligente (confianza: {confidence:.2f})'
        }
    
    def find_duplicates_advanced(self, image_paths: List[str]) -> List[List[str]]:
        """Encuentra duplicados usando múltiples métodos."""
        print(f"🔍 Analizando duplicados en {len(image_paths)} imágenes...")
        
        # Método 1: Hash perceptual
        hash_groups = defaultdict(list)
        
        # Método 2: Características visuales similares
        feature_groups = defaultdict(list)
        
        for i, image_path in enumerate(image_paths):
            if i % 50 == 0:
                print(f"  Procesando {i}/{len(image_paths)}")
            
            try:
                # Hash perceptual
                with Image.open(image_path) as img:
                    phash = str(imagehash.phash(img, hash_size=16))
                    dhash = str(imagehash.dhash(img))
                    
                    # Agrupar por hash exacto
                    hash_groups[phash].append(image_path)
                    
                    # Agrupar por características similares
                    features = self.extract_pixel_art_features(image_path)
                    feature_key = (
                        features['size'],
                        round(features['unique_colors'] / 10) * 10,  # Agrupar por decenas
                        round(features['aspect_ratio'], 1)
                    )
                    feature_groups[feature_key].append(image_path)
                    
            except Exception as e:
                print(f"Error procesando {image_path}: {e}")
        
        # Combinar resultados
        duplicate_groups = []
        
        # Duplicados exactos por hash
        for group in hash_groups.values():
            if len(group) > 1:
                duplicate_groups.append(group)
        
        # Duplicados similares por características (verificación adicional)
        processed_files = set()
        for group in duplicate_groups:
            processed_files.update(group)
        
        for group in feature_groups.values():
            if len(group) > 1:
                # Solo verificar archivos no ya marcados como duplicados exactos
                unprocessed_group = [f for f in group if f not in processed_files]
                if len(unprocessed_group) > 1:
                    # Verificación adicional con hash visual
                    similar_group = self._verify_visual_similarity(unprocessed_group)
                    if len(similar_group) > 1:
                        duplicate_groups.append(similar_group)
                        processed_files.update(similar_group)
        
        return duplicate_groups
    
    def _verify_visual_similarity(self, image_paths: List[str], threshold: float = 0.9) -> List[str]:
        """Verifica similaridad visual entre imágenes."""
        similar_group = []
        
        if len(image_paths) < 2:
            return image_paths
        
        try:
            # Usar la primera imagen como referencia
            ref_features = self.extract_pixel_art_features(image_paths[0])
            similar_group.append(image_paths[0])
            
            for image_path in image_paths[1:]:
                features = self.extract_pixel_art_features(image_path)
                
                # Calcular similaridad
                similarity_score = self._calculate_feature_similarity(ref_features, features)
                
                if similarity_score >= threshold:
                    similar_group.append(image_path)
                    
        except Exception as e:
            print(f"Error verificando similaridad: {e}")
            return image_paths[:1]  # Retornar solo la primera si hay error
        
        return similar_group
    
    def _calculate_feature_similarity(self, features1: Dict, features2: Dict) -> float:
        """Calcula similaridad entre dos conjuntos de características."""
        try:
            # Factores de similaridad
            size_sim = 1.0 if features1['size'] == features2['size'] else 0.8
            
            color_diff = abs(features1['unique_colors'] - features2['unique_colors'])
            color_sim = max(0, 1 - (color_diff / 100))
            
            ratio_diff = abs(features1['aspect_ratio'] - features2['aspect_ratio'])
            ratio_sim = max(0, 1 - ratio_diff)
            
            edge_diff = abs(features1['edge_density'] - features2['edge_density'])
            edge_sim = max(0, 1 - edge_diff * 5)
            
            # Promedio ponderado
            total_sim = (size_sim * 0.3 + color_sim * 0.3 + ratio_sim * 0.2 + edge_sim * 0.2)
            
            return total_sim
            
        except Exception:
            return 0.0
    
    def get_all_image_files(self) -> List[str]:
        """Obtiene todas las imágenes del directorio assets."""
        image_files = []
        supported_formats = {'.png', '.jpg', '.jpeg', '.bmp', '.gif'}
        
        for root, dirs, files in os.walk(self.assets_path):
            for file in files:
                if Path(file).suffix.lower() in supported_formats:
                    image_files.append(os.path.join(root, file))
        
        return image_files
    
    def prioritize_file_for_keeping(self, file_paths: List[str]) -> str:
        """Decide qué archivo mantener de un grupo de duplicados."""
        def quality_score(path):
            file_path = Path(path)
            name = file_path.stem.lower()
            
            score = 0
            
            # Bonificar nombres descriptivos
            score += len(name) * 0.1
            
            # Bonificar keywords relevantes
            for category, category_info in self.valid_categories.items():
                for keyword in category_info['keywords']:
                    if keyword in name:
                        score += 5
            
            # Bonificar patrones reconocidos
            if re.search(r'tile_\d+', name):
                score += 3
            if re.search(r'entidad_', name):
                score += 3
            
            # Penalizar nombres genéricos
            if re.search(r'(copy|duplicate|untitled|\d+$)', name):
                score -= 10
            
            # Bonificar ubicación correcta
            current_category = file_path.parent.name
            classification = self.classify_image_intelligent(path)
            if current_category == classification['category']:
                score += 2
            
            return score
        
        # Ordenar por calidad y retornar el mejor
        sorted_files = sorted(file_paths, key=quality_score, reverse=True)
        return sorted_files[0]
    
    def remove_duplicates_smart(self, duplicate_groups: List[List[str]]) -> None:
        """Elimina duplicados de forma inteligente."""
        for group in duplicate_groups:
            if len(group) <= 1:
                continue
            
            # Elegir archivo a mantener
            keep_file = self.prioritize_file_for_keeping(group)
            remove_files = [f for f in group if f != keep_file]
            
            print(f"\n📁 Grupo de duplicados encontrado:")
            print(f"  ✅ Mantener: {keep_file}")
            
            for remove_file in remove_files:
                try:
                    os.remove(remove_file)
                    print(f"  🗑️ Eliminado: {remove_file}")
                    self.analysis_results['duplicates_removed'].append(remove_file)
                    self.analysis_results['stats']['duplicates_removed'] += 1
                except Exception as e:
                    error_msg = f"Error eliminando {remove_file}: {e}"
                    print(f"  ❌ {error_msg}")
                    self.analysis_results['errors'].append(error_msg)
    
    def move_to_correct_category(self, current_path: str, target_category: str) -> bool:
        """Mueve archivo a la categoría correcta."""
        current_file = Path(current_path)
        target_dir = self.assets_path / target_category
        
        # Crear directorio si no existe
        target_dir.mkdir(exist_ok=True)
        
        target_path = target_dir / current_file.name
        
        # Si ya está en el lugar correcto, no hacer nada
        if current_file.resolve() == target_path.resolve():
            return False
        
        # Evitar sobrescribir archivos existentes
        counter = 1
        original_target = target_path
        while target_path.exists():
            name_part = original_target.stem
            extension = original_target.suffix
            target_path = original_target.parent / f"{name_part}_{counter}{extension}"
            counter += 1
        
        try:
            shutil.move(str(current_file), str(target_path))
            print(f"📦 Movido: {current_file.name} -> {target_category}/")
            
            self.analysis_results['renamed'].append({
                'from': current_path,
                'to': str(target_path),
                'category': target_category
            })
            self.analysis_results['stats']['files_moved'] += 1
            return True
            
        except Exception as e:
            error_msg = f"Error moviendo {current_path}: {e}"
            print(f"❌ {error_msg}")
            self.analysis_results['errors'].append(error_msg)
            return False
    
    def process_images(self, remove_duplicates: bool = True, auto_move: bool = False, 
                      confidence_threshold: float = 0.7, dry_run: bool = False) -> None:
        """Procesa todas las imágenes con el nuevo sistema inteligente."""
        print("🎮 CLASIFICADOR INTELIGENTE DE PIXEL ART")
        print("=" * 50)
        
        # Obtener todas las imágenes
        image_files = self.get_all_image_files()
        print(f"📊 Encontradas {len(image_files)} imágenes")
        
        if dry_run:
            print("🧪 MODO DRY RUN - No se realizarán cambios")
        
        # Paso 1: Detectar y eliminar duplicados
        if remove_duplicates:
            print(f"\n🔍 PASO 1: Detección avanzada de duplicados")
            duplicate_groups = self.find_duplicates_advanced(image_files)
            
            if duplicate_groups:
                print(f"📦 Encontrados {len(duplicate_groups)} grupos de duplicados")
                total_duplicates = sum(len(group) - 1 for group in duplicate_groups)
                print(f"🗑️ Se eliminarán {total_duplicates} archivos duplicados")
                
                if not dry_run:
                    self.remove_duplicates_smart(duplicate_groups)
                    # Actualizar lista después de eliminar duplicados
                    image_files = [f for f in image_files if os.path.exists(f)]
            else:
                print("✅ No se encontraron duplicados")
        
        # Paso 2: Clasificación inteligente
        print(f"\n🤖 PASO 2: Clasificación inteligente de {len(image_files)} imágenes")
        
        classification_stats = defaultdict(int)
        move_suggestions = []
        
        for i, image_path in enumerate(image_files, 1):
            print(f"\n[{i}/{len(image_files)}] 🖼️ {Path(image_path).name}")
            
            # Clasificar con sistema inteligente
            classification = self.classify_image_intelligent(image_path)
            
            current_category = Path(image_path).parent.name
            suggested_category = classification['category']
            confidence = classification['confidence']
            
            print(f"  📂 Actual: {current_category}")
            print(f"  🎯 Sugerido: {suggested_category} (confianza: {confidence:.2f})")
            print(f"  🔧 Método: {classification['method']}")
            
            # Estadísticas
            classification_stats[suggested_category] += 1
            self.analysis_results['stats']['total_classified'] += 1
            
            self.analysis_results['classified'].append({
                'file': image_path,
                'current_category': current_category,
                'suggested_category': suggested_category,
                'confidence': confidence,
                'method': classification['method'],
                'breakdown': classification['breakdown']
            })
            
            # Decidir si mover
            needs_move = (current_category != suggested_category and 
                         confidence >= confidence_threshold)
            
            if needs_move:
                if auto_move and not dry_run:
                    success = self.move_to_correct_category(image_path, suggested_category)
                    if success:
                        print(f"  ✅ Movido automáticamente")
                else:
                    move_suggestions.append({
                        'file': image_path,
                        'from': current_category,
                        'to': suggested_category,
                        'confidence': confidence
                    })
                    print(f"  💡 Sugerencia: mover a {suggested_category}")
            else:
                print(f"  ✅ Categoría correcta")
        
        # Paso 3: Resumen y sugerencias
        print(f"\n📊 PASO 3: Resumen del análisis")
        print(f"Total imágenes procesadas: {len(image_files)}")
        print(f"Duplicados eliminados: {self.analysis_results['stats']['duplicates_removed']}")
        print(f"Archivos movidos: {self.analysis_results['stats']['files_moved']}")
        
        if move_suggestions:
            print(f"\n💡 SUGERENCIAS DE MOVIMIENTO ({len(move_suggestions)} archivos):")
            for suggestion in move_suggestions[:10]:  # Mostrar solo las primeras 10
                print(f"  📁 {Path(suggestion['file']).name}: {suggestion['from']} → {suggestion['to']} ({suggestion['confidence']:.2f})")
            
            if len(move_suggestions) > 10:
                print(f"  ... y {len(move_suggestions) - 10} más")
        
        print(f"\n📈 Distribución por categorías:")
        for category, count in sorted(classification_stats.items()):
            print(f"  {category}: {count} imágenes")
    
    def save_detailed_report(self, output_file: str = "pixel_art_classification_report.json") -> None:
        """Guarda reporte detallado del análisis."""
        report = {
            'timestamp': str(Path().resolve()),
            'script_version': 'PixelArtSpriteClassifier v2.0',
            'total_files_analyzed': len(self.analysis_results['classified']),
            'statistics': dict(self.analysis_results['stats']),
            'summary': {
                'total_classified': len(self.analysis_results['classified']),
                'duplicates_removed': len(self.analysis_results['duplicates_removed']),
                'files_moved': len(self.analysis_results['renamed']),
                'errors_encountered': len(self.analysis_results['errors'])
            },
            'category_distribution': {},
            'confidence_analysis': {},
            'detailed_results': self.analysis_results
        }
        
        # Análisis de distribución por categorías
        category_counts = defaultdict(int)
        confidence_scores = []
        
        for item in self.analysis_results['classified']:
            category_counts[item['suggested_category']] += 1
            confidence_scores.append(item['confidence'])
        
        report['category_distribution'] = dict(category_counts)
        
        # Análisis de confianza
        if confidence_scores:
            report['confidence_analysis'] = {
                'average': np.mean(confidence_scores),
                'median': np.median(confidence_scores),
                'std_dev': np.std(confidence_scores),
                'high_confidence': sum(1 for c in confidence_scores if c >= 0.8),
                'low_confidence': sum(1 for c in confidence_scores if c < 0.5)
            }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"📄 Reporte detallado guardado en: {output_file}")
    
    def print_summary(self) -> None:
        """Imprime resumen del procesamiento."""
        print("\n" + "="*70)
        print("📊 RESUMEN FINAL - CLASIFICADOR INTELIGENTE DE PIXEL ART")
        print("="*70)
        
        stats = self.analysis_results['stats']
        print(f"✅ Imágenes clasificadas: {stats['total_classified']}")
        print(f"🗑️ Duplicados eliminados: {stats['duplicates_removed']}")
        print(f"📦 Archivos movidos: {stats['files_moved']}")
        print(f"❌ Errores encontrados: {len(self.analysis_results['errors'])}")
        
        # Análisis de confianza
        if self.analysis_results['classified']:
            confidences = [item['confidence'] for item in self.analysis_results['classified']]
            avg_confidence = np.mean(confidences)
            high_conf_count = sum(1 for c in confidences if c >= 0.8)
            
            print(f"\n🎯 Análisis de confianza:")
            print(f"   Confianza promedio: {avg_confidence:.2f}")
            print(f"   Alta confianza (≥0.8): {high_conf_count}/{len(confidences)}")
        
        # Distribución por categorías
        category_counts = defaultdict(int)
        for item in self.analysis_results['classified']:
            category_counts[item['suggested_category']] += 1
        
        print(f"\n📂 Distribución final por categorías:")
        for category, count in sorted(category_counts.items()):
            print(f"   {category}: {count} imágenes")
        
        if self.analysis_results['errors']:
            print(f"\n⚠️ Errores encontrados:")
            for error in self.analysis_results['errors'][:5]:
                print(f"   • {error}")
            if len(self.analysis_results['errors']) > 5:
                print(f"   ... y {len(self.analysis_results['errors']) - 5} errores más")


def main():
    parser = argparse.ArgumentParser(description="Clasificador inteligente de sprites de pixel art")
    parser.add_argument("--path", default=".", help="Ruta base del proyecto")
    parser.add_argument("--no-duplicates", action="store_true", help="No eliminar duplicados")
    parser.add_argument("--auto-move", action="store_true", help="Mover archivos automáticamente")
    parser.add_argument("--confidence", type=float, default=0.7, help="Umbral de confianza para mover (0.0-1.0)")
    parser.add_argument("--dry-run", action="store_true", help="Solo analizar, no hacer cambios")
    parser.add_argument("--report", default="pixel_art_report.json", help="Archivo de reporte")
    
    args = parser.parse_args()
    
    try:
        classifier = PixelArtSpriteClassifier(args.path)
        
        print("🎮 CLASIFICADOR INTELIGENTE DE PIXEL ART v2.0")
        print("=" * 55)
        print(f"📁 Ruta base: {classifier.base_path}")
        print(f"🔍 Eliminar duplicados: {not args.no_duplicates}")
        print(f"📦 Mover automático: {args.auto_move}")
        print(f"🎯 Umbral confianza: {args.confidence}")
        print(f"🧪 Modo dry run: {args.dry_run}")
        
        # Procesar imágenes
        classifier.process_images(
            remove_duplicates=not args.no_duplicates,
            auto_move=args.auto_move,
            confidence_threshold=args.confidence,
            dry_run=args.dry_run
        )
        
        # Mostrar resumen
        classifier.print_summary()
        
        # Guardar reporte
        classifier.save_detailed_report(args.report)
        
        print(f"\n🎉 ¡Clasificación completada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error crítico: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
