#!/usr/bin/env python3
"""
Clasificador BÁSICO de sprites - Funciona sin modelos pesados de IA
Usa clasificación por reglas, análisis de colores y detección de duplicados.
"""

import os
import shutil
import json
import numpy as np
from PIL import Image, ImageOps
import imagehash
from pathlib import Path
import argparse
import sys
from typing import Dict, List, Tuple, Set
from sklearn.cluster import KMeans
from collections import Counter
import cv2

class BasicSpriteClassifier:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.assets_path = self.base_path / "assets"
        
        # Categorías válidas basadas en la estructura existente
        self.valid_categories = {
            'buildings': ['edificio', 'building', 'casa', 'tower', 'estructura', 'construccion', 'comercial'],
            'nature': ['arbol', 'tree', 'plant', 'planta', 'vegetacion', 'foliage', 'frondoso', 'joven'],
            'ground': ['suelo', 'ground', 'tierra', 'arena', 'piedra', 'cesped', 'piso', 'textura'],
            'water': ['agua', 'water', 'rio', 'estanque', 'lake', 'liquido', 'profunda', 'clara', 'corriente'],
            'roads': ['carretera', 'road', 'camino', 'path', 'via', 'street', 'horizontal', 'vertical', 'curva', 'cruce'],
            'sprites': ['personaje', 'character', 'entidad', 'player', 'objeto', 'item', 'circulo', 'square']
        }
        
        # Descriptores de color dominante por categoría
        self.color_signatures = {
            'buildings': [(139, 69, 19), (105, 105, 105), (128, 128, 128), (160, 82, 45)],  # Marrones, grises
            'nature': [(34, 139, 34), (0, 100, 0), (144, 238, 144), (107, 142, 35)],       # Verdes
            'ground': [(210, 180, 140), (222, 184, 135), (160, 82, 45), (205, 133, 63)],   # Tierra, arena
            'water': [(0, 191, 255), (30, 144, 255), (176, 224, 230), (135, 206, 235)],     # Azules
            'roads': [(105, 105, 105), (169, 169, 169), (0, 0, 0), (128, 128, 128)],        # Grises, negro
            'sprites': [(255, 192, 203), (255, 255, 0), (255, 165, 0), (255, 20, 147)]     # Colores variados
        }
        
        # Resultados del análisis
        self.analysis_results = {
            'classified': [],
            'duplicates_removed': [],
            'renamed': [],
            'errors': []
        }
    
    def calculate_image_hash(self, image_path: str) -> str:
        """Calcula hash perceptual para detectar duplicados."""
        try:
            with Image.open(image_path) as img:
                phash = str(imagehash.phash(img, hash_size=16))
                return phash
        except Exception as e:
            print(f"Error calculando hash para {image_path}: {e}")
            return ""
    
    def extract_color_features(self, image_path: str) -> np.ndarray:
        """Extrae características de color de la imagen."""
        try:
            with Image.open(image_path) as img:
                # Convertir a RGB y redimensionar para análisis más rápido
                img = img.convert('RGB').resize((32, 32))
                img_array = np.array(img)
                
                # Calcular histograma de colores
                hist_r = np.histogram(img_array[:,:,0], bins=8, range=(0, 255))[0]
                hist_g = np.histogram(img_array[:,:,1], bins=8, range=(0, 255))[0]
                hist_b = np.histogram(img_array[:,:,2], bins=8, range=(0, 255))[0]
                
                # Color dominante
                pixels = img_array.reshape(-1, 3)
                dominant_color = np.mean(pixels, axis=0)
                
                # Varianza de colores (indica complejidad)
                color_variance = np.var(pixels, axis=0)
                
                # Combinar características
                features = np.concatenate([
                    hist_r / (np.sum(hist_r) + 1e-6),
                    hist_g / (np.sum(hist_g) + 1e-6),
                    hist_b / (np.sum(hist_b) + 1e-6),
                    dominant_color / 255.0,
                    color_variance / (255.0 * 255.0)
                ])
                
                return features
        except Exception as e:
            print(f"Error extrayendo características de {image_path}: {e}")
            return np.zeros(30)  # 8+8+8+3+3
    
    def extract_shape_features(self, image_path: str) -> Dict:
        """Extrae características de forma y estructura."""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return {}
            
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Detectar contornos
            contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            features = {
                'num_contours': len(contours),
                'has_regular_shapes': False,
                'complexity_score': 0,
                'aspect_ratio': img.shape[1] / img.shape[0] if img.shape[0] > 0 else 1,
                'fill_ratio': np.sum(gray > 30) / (gray.shape[0] * gray.shape[1])
            }
            
            if contours:
                # Analizar el contorno más grande
                largest_contour = max(contours, key=cv2.contourArea)
                area = cv2.contourArea(largest_contour)
                perimeter = cv2.arcLength(largest_contour, True)
                
                if perimeter > 0 and area > 0:
                    features['complexity_score'] = (perimeter * perimeter) / area
                
                # Detectar formas regulares (rectángulos, círculos)
                if perimeter > 0:
                    approx = cv2.approxPolyDP(largest_contour, 0.02 * perimeter, True)
                    features['has_regular_shapes'] = len(approx) <= 6
            
            return features
            
        except Exception as e:
            print(f"Error extrayendo formas de {image_path}: {e}")
            return {}
    
    def classify_by_filename(self, image_path: str) -> Dict:
        """Clasifica basándose en el nombre del archivo."""
        filename = Path(image_path).stem.lower()
        scores = {}
        
        # Buscar keywords en el nombre
        for category, keywords in self.valid_categories.items():
            score = 0
            for keyword in keywords:
                if keyword in filename:
                    # Dar más peso a matches exactos
                    if keyword == filename or f"_{keyword}_" in filename or filename.startswith(keyword + "_") or filename.endswith("_" + keyword):
                        score += 2
                    else:
                        score += 1
            
            if score > 0:
                scores[category] = score
        
        return scores
    
    def classify_by_color(self, image_path: str) -> Dict:
        """Clasifica basándose en análisis de color."""
        try:
            color_features = self.extract_color_features(image_path)
            if len(color_features) < 27:  # 24 + 3 colores dominantes
                return {}
            
            dominant_color = color_features[24:27] * 255  # RGB dominante
            scores = {}
            
            for category, color_sigs in self.color_signatures.items():
                color_distances = []
                for sig_color in color_sigs:
                    distance = np.linalg.norm(dominant_color - np.array(sig_color))
                    color_distances.append(distance)
                
                # Score inverso a la distancia (menor distancia = mayor score)
                min_distance = min(color_distances)
                if min_distance < 100:  # Solo considerar colores similares
                    color_score = max(0, 1 - (min_distance / 255))
                    scores[category] = color_score
            
            return scores
            
        except Exception as e:
            print(f"Error en análisis de color para {image_path}: {e}")
            return {}
    
    def classify_by_shape(self, image_path: str) -> Dict:
        """Clasifica basándose en características de forma."""
        shape_features = self.extract_shape_features(image_path)
        if not shape_features:
            return {}
        
        scores = {}
        aspect_ratio = shape_features.get('aspect_ratio', 1)
        complexity = shape_features.get('complexity_score', 0)
        fill_ratio = shape_features.get('fill_ratio', 0)
        num_contours = shape_features.get('num_contours', 0)
        
        # Reglas heurísticas basadas en forma
        if aspect_ratio > 2.5 or aspect_ratio < 0.4:  # Muy rectangular
            scores['roads'] = scores.get('roads', 0) + 0.3
            scores['buildings'] = scores.get('buildings', 0) + 0.2
        
        if complexity > 30:  # Muy complejo/detallado
            scores['nature'] = scores.get('nature', 0) + 0.4
            scores['sprites'] = scores.get('sprites', 0) + 0.3
        
        if fill_ratio < 0.4:  # Mucho espacio vacío (como fondos)
            scores['ground'] = scores.get('ground', 0) + 0.3
        
        if num_contours == 1 and fill_ratio > 0.7:  # Forma sólida simple
            scores['buildings'] = scores.get('buildings', 0) + 0.2
        
        return scores
    
    def classify_by_context(self, image_path: str) -> Dict:
        """Clasifica basándose en el contexto del directorio actual."""
        current_category = Path(image_path).parent.name
        scores = {}
        
        # Si ya está en una categoría válida, darle un pequeño bonus
        if current_category in self.valid_categories:
            scores[current_category] = 0.1
        
        return scores
    
    def classify_image_comprehensive(self, image_path: str) -> Dict:
        """Clasifica usando múltiples métodos y combina resultados."""
        try:
            all_scores = {}
            
            # 1. Clasificación por nombre (peso alto)
            filename_scores = self.classify_by_filename(image_path)
            for cat, score in filename_scores.items():
                all_scores[cat] = all_scores.get(cat, 0) + score * 0.5
            
            # 2. Clasificación por color (peso medio)
            color_scores = self.classify_by_color(image_path)
            for cat, score in color_scores.items():
                all_scores[cat] = all_scores.get(cat, 0) + score * 0.3
            
            # 3. Clasificación por forma (peso medio)
            shape_scores = self.classify_by_shape(image_path)
            for cat, score in shape_scores.items():
                all_scores[cat] = all_scores.get(cat, 0) + score * 0.2
            
            # 4. Contexto actual (peso bajo)
            context_scores = self.classify_by_context(image_path)
            for cat, score in context_scores.items():
                all_scores[cat] = all_scores.get(cat, 0) + score * 0.1
            
            # Encontrar mejor categoría
            if all_scores:
                best_category = max(all_scores.keys(), key=lambda k: all_scores[k])
                confidence = min(1.0, all_scores[best_category])
                
                # Normalizar confianza basada en la evidencia total
                total_evidence = sum(all_scores.values())
                if total_evidence > 0:
                    confidence = all_scores[best_category] / max(1.0, total_evidence * 0.5)
                    confidence = min(1.0, confidence)
            else:
                # Fallback: usar categoría actual si es válida
                current_category = Path(image_path).parent.name
                if current_category in self.valid_categories:
                    best_category = current_category
                    confidence = 0.3
                else:
                    best_category = 'sprites'
                    confidence = 0.1
            
            return {
                'category': best_category,
                'confidence': confidence,
                'method': 'comprehensive',
                'description': f'Puntuaciones: {all_scores}',
                'scores_breakdown': {
                    'filename': filename_scores,
                    'color': color_scores,
                    'shape': shape_scores,
                    'context': context_scores
                }
            }
            
        except Exception as e:
            print(f"Error en clasificación integral de {image_path}: {e}")
            return {
                'category': 'sprites',
                'confidence': 0.1,
                'method': 'error_fallback',
                'description': f'Error en análisis: {str(e)}'
            }
    
    def find_duplicates(self, image_paths: List[str]) -> List[List[str]]:
        """Encuentra grupos de imágenes duplicadas usando hash perceptual."""
        hash_groups: Dict[str, List[str]] = {}
        
        print(f"🔍 Calculando hashes para {len(image_paths)} imágenes...")
        
        for i, image_path in enumerate(image_paths):
            if i % 100 == 0 and i > 0:
                print(f"  Procesando {i}/{len(image_paths)}")
            
            img_hash = self.calculate_image_hash(image_path)
            if img_hash:
                if img_hash not in hash_groups:
                    hash_groups[img_hash] = []
                hash_groups[img_hash].append(image_path)
        
        # Retornar solo grupos con duplicados
        duplicates = [group for group in hash_groups.values() if len(group) > 1]
        print(f"  Encontrados {len(duplicates)} grupos de duplicados")
        return duplicates
    
    def get_all_image_files(self) -> List[str]:
        """Obtiene todas las imágenes PNG del directorio assets."""
        image_files = []
        for root, dirs, files in os.walk(self.assets_path):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_files.append(os.path.join(root, file))
        return image_files
    
    def remove_duplicates(self, duplicate_groups: List[List[str]]) -> None:
        """Elimina archivos duplicados, manteniendo el mejor nombrado."""
        for group in duplicate_groups:
            if len(group) <= 1:
                continue
            
            # Ordenar por calidad del nombre (más descriptivo) y por path
            def name_quality_score(path):
                name = Path(path).stem.lower()
                score = len(name)  # Nombres más largos suelen ser más descriptivos
                
                # Bonificar nombres con palabras descriptivas
                for category, keywords in self.valid_categories.items():
                    for keyword in keywords:
                        if keyword in name:
                            score += 10
                
                # Penalizar nombres solo numéricos
                if name.replace('_', '').replace('tile', '').replace('0', '').isdigit():
                    score -= 5
                
                return score
            
            group.sort(key=name_quality_score, reverse=True)
            
            # Mantener el primero (mejor nombre) y eliminar los demás
            keep_file = group[0]
            remove_files = group[1:]
            
            print(f"\nDuplicados encontrados:")
            print(f"  ✅ Mantener: {keep_file}")
            
            for remove_file in remove_files:
                try:
                    os.remove(remove_file)
                    print(f"  🗑️ Eliminado: {remove_file}")
                    self.analysis_results['duplicates_removed'].append(remove_file)
                except Exception as e:
                    print(f"  ❌ Error eliminando {remove_file}: {e}")
                    self.analysis_results['errors'].append(f"Error eliminando {remove_file}: {e}")
    
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
            print(f"  📁 Movido: {current_file.name} -> {target_category}/")
            self.analysis_results['renamed'].append({
                'from': current_path,
                'to': str(target_path),
                'category': target_category
            })
            return True
        except Exception as e:
            print(f"  ❌ Error moviendo {current_path}: {e}")
            self.analysis_results['errors'].append(f"Error moviendo {current_path}: {e}")
            return False
    
    def process_images(self, remove_duplicates: bool = True, auto_move: bool = False, confidence_threshold: float = 0.5) -> None:
        """Procesa todas las imágenes: clasifica, detecta duplicados y reorganiza."""
        print("🔍 Iniciando análisis con clasificación BÁSICA...")
        print(f"Usando: análisis de nombres, colores, formas y contexto")
        
        # Obtener todas las imágenes
        image_files = self.get_all_image_files()
        print(f"Encontradas {len(image_files)} imágenes")
        
        # Detectar duplicados primero
        if remove_duplicates:
            print("\n🔍 Detectando duplicados...")
            duplicate_groups = self.find_duplicates(image_files)
            
            if duplicate_groups:
                print(f"Procesando {len(duplicate_groups)} grupos de duplicados...")
                self.remove_duplicates(duplicate_groups)
                
                # Actualizar lista de archivos después de eliminar duplicados
                image_files = self.get_all_image_files()
                print(f"Imágenes restantes: {len(image_files)}")
            else:
                print("No se encontraron duplicados")
        
        # Clasificar imágenes restantes
        print(f"\n🤖 Clasificando {len(image_files)} imágenes...")
        
        categories_moved = {'buildings': 0, 'nature': 0, 'ground': 0, 'water': 0, 'roads': 0, 'sprites': 0}
        high_confidence_count = 0
        
        for i, image_path in enumerate(image_files, 1):
            if i % 50 == 0 or i == len(image_files):
                print(f"  Progreso: {i}/{len(image_files)}")
            
            # Clasificar con método integral
            classification = self.classify_image_comprehensive(image_path)
            
            current_category = Path(image_path).parent.name
            suggested_category = classification['category']
            confidence = classification['confidence']
            
            if confidence >= 0.7:
                high_confidence_count += 1
            
            # Mostrar detalles solo para casos interesantes
            should_show_details = (
                current_category != suggested_category or
                confidence >= 0.8 or
                (i <= 5)  # Mostrar primeros 5 como ejemplo
            )
            
            if should_show_details:
                print(f"\n[{i}] {Path(image_path).name}")
                print(f"  Actual: {current_category} -> Sugerido: {suggested_category} ({confidence:.2f})")
                if confidence >= confidence_threshold and current_category != suggested_category:
                    print(f"  💡 Recomendación: mover a '{suggested_category}'")
            
            self.analysis_results['classified'].append({
                'file': image_path,
                'current_category': current_category,
                'suggested_category': suggested_category,
                'confidence': confidence,
                'method': classification['method'],
                'description': classification.get('description', '')
            })
            
            # Decidir si mover
            needs_move = (current_category != suggested_category and 
                         confidence >= confidence_threshold)
            
            if needs_move and auto_move:
                if self.move_to_correct_category(image_path, suggested_category):
                    categories_moved[suggested_category] += 1
            
        print(f"\n✅ Clasificación completada!")
        print(f"Imágenes con alta confianza (≥0.7): {high_confidence_count}/{len(image_files)}")
        
        if auto_move and sum(categories_moved.values()) > 0:
            print(f"Archivos movidos por categoría:")
            for cat, count in categories_moved.items():
                if count > 0:
                    print(f"  {cat}: {count}")
    
    def print_summary(self) -> None:
        """Imprime resumen del procesamiento."""
        print("\n" + "="*60)
        print("📊 RESUMEN DEL PROCESAMIENTO (CLASIFICACIÓN BÁSICA)")
        print("="*60)
        
        print(f"Imágenes clasificadas: {len(self.analysis_results['classified'])}")
        print(f"Duplicados eliminados: {len(self.analysis_results['duplicates_removed'])}")
        print(f"Archivos movidos: {len(self.analysis_results['renamed'])}")
        print(f"Errores: {len(self.analysis_results['errors'])}")
        
        if self.analysis_results['errors']:
            print("\n❌ Errores encontrados:")
            for error in self.analysis_results['errors'][:5]:  # Mostrar solo primeros 5
                print(f"  - {error}")
            if len(self.analysis_results['errors']) > 5:
                print(f"  ... y {len(self.analysis_results['errors']) - 5} más")
        
        # Estadísticas de confianza
        confidence_stats = [item.get('confidence', 0) for item in self.analysis_results['classified']]
        if confidence_stats:
            avg_confidence = np.mean(confidence_stats)
            high_conf_count = sum(1 for c in confidence_stats if c >= 0.7)
            medium_conf_count = sum(1 for c in confidence_stats if 0.4 <= c < 0.7)
            low_conf_count = sum(1 for c in confidence_stats if c < 0.4)
            
            print(f"\n🎯 Estadísticas de confianza:")
            print(f"  Promedio: {avg_confidence:.2f}")
            print(f"  Alta (≥0.7): {high_conf_count}")
            print(f"  Media (0.4-0.7): {medium_conf_count}")
            print(f"  Baja (<0.4): {low_conf_count}")
        
        # Mostrar estadísticas por categoría
        category_current = {}
        category_suggested = {}
        
        for item in self.analysis_results['classified']:
            curr_cat = item['current_category']
            sugg_cat = item['suggested_category']
            
            category_current[curr_cat] = category_current.get(curr_cat, 0) + 1
            category_suggested[sugg_cat] = category_suggested.get(sugg_cat, 0) + 1
        
        print(f"\n📂 Distribución ACTUAL:")
        for category, count in sorted(category_current.items()):
            print(f"  {category}: {count} imágenes")
        
        print(f"\n📂 Distribución SUGERIDA:")
        for category, count in sorted(category_suggested.items()):
            print(f"  {category}: {count} imágenes")
    
    def save_report(self, output_file: str = "sprite_classification_basic_report.json") -> None:
        """Guarda reporte detallado en JSON."""
        # Calcular estadísticas adicionales
        confidence_stats = [item.get('confidence', 0) for item in self.analysis_results['classified']]
        
        report = {
            'timestamp': str(Path().resolve()),
            'classifier_type': 'basic',
            'methods_used': ['filename_analysis', 'color_analysis', 'shape_analysis', 'context_analysis'],
            'summary': {
                'total_classified': len(self.analysis_results['classified']),
                'duplicates_removed': len(self.analysis_results['duplicates_removed']),
                'files_moved': len(self.analysis_results['renamed']),
                'errors': len(self.analysis_results['errors']),
                'average_confidence': float(np.mean(confidence_stats)) if confidence_stats else 0.0,
                'high_confidence_count': sum(1 for c in confidence_stats if c >= 0.7)
            },
            'details': self.analysis_results
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Reporte guardado en: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Clasificador BÁSICO de sprites - Sin modelos pesados")
    parser.add_argument("--path", default=".", help="Ruta base del proyecto")
    parser.add_argument("--no-duplicates", action="store_true", help="No eliminar duplicados")
    parser.add_argument("--auto-move", action="store_true", help="Mover archivos automáticamente")
    parser.add_argument("--confidence", type=float, default=0.5, help="Umbral de confianza para mover (0.0-1.0)")
    parser.add_argument("--report", default="sprite_basic_report.json", help="Archivo de reporte")
    
    args = parser.parse_args()
    
    try:
        classifier = BasicSpriteClassifier(args.path)
        
        print("🎮 Clasificador BÁSICO de Sprites")
        print("=" * 40)
        print(f"Ruta base: {classifier.base_path}")
        print(f"Eliminar duplicados: {not args.no_duplicates}")
        print(f"Mover automático: {args.auto_move}")
        print(f"Umbral confianza: {args.confidence}")
        print("Métodos: Nombres + Colores + Formas + Contexto")
        
        # Procesar imágenes
        classifier.process_images(
            remove_duplicates=not args.no_duplicates,
            auto_move=args.auto_move,
            confidence_threshold=args.confidence
        )
        
        # Mostrar resumen
        classifier.print_summary()
        
        # Guardar reporte
        classifier.save_report(args.report)
        
        print(f"\n💡 Para mejor precisión, considera instalar modelos de IA:")
        print(f"   ./install_local_ai.sh")
        print(f"   python classify_sprites_local.py")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()