#!/usr/bin/env python3
"""
Clasificador de sprites usando IA LOCAL - Sin APIs externas
Usa CLIP, YOLO y otros modelos que se ejecutan completamente offline.
"""

import os
import shutil
import hashlib
import json
import numpy as np
from PIL import Image, ImageOps
import imagehash
from pathlib import Path
import argparse
import sys
from typing import Dict, List, Tuple, Set
import torch
import torchvision.transforms as transforms
from sklearn.cluster import KMeans
from collections import Counter
import cv2

# Imports opcionales para modelos específicos
try:
    import clip
    HAS_CLIP = True
except ImportError:
    HAS_CLIP = False

try:
    from ultralytics import YOLO
    HAS_YOLO = True
except ImportError:
    HAS_YOLO = False

try:
    from transformers import BlipProcessor, BlipForConditionalGeneration
    HAS_BLIP = True
except ImportError:
    HAS_BLIP = False

class LocalSpriteClassifier:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.assets_path = self.base_path / "assets"
        
        # Categorías válidas basadas en la estructura existente
        self.valid_categories = {
            'buildings': ['edificio', 'building', 'casa', 'tower', 'estructura', 'construccion'],
            'nature': ['arbol', 'tree', 'plant', 'planta', 'vegetacion', 'foliage'],
            'ground': ['suelo', 'ground', 'tierra', 'arena', 'piedra', 'cesped', 'piso', 'textura'],
            'water': ['agua', 'water', 'rio', 'estanque', 'lake', 'liquido'],
            'roads': ['carretera', 'road', 'camino', 'path', 'via', 'street'],
            'sprites': ['personaje', 'character', 'entidad', 'player', 'objeto', 'item']
        }
        
        # Descriptores de color dominante por categoría
        self.color_signatures = {
            'buildings': [(139, 69, 19), (105, 105, 105), (128, 128, 128)],  # Marrón, gris
            'nature': [(34, 139, 34), (0, 100, 0), (144, 238, 144)],       # Verdes
            'ground': [(210, 180, 140), (222, 184, 135), (160, 82, 45)],   # Tierra, arena
            'water': [(0, 191, 255), (30, 144, 255), (176, 224, 230)],     # Azules
            'roads': [(105, 105, 105), (169, 169, 169), (0, 0, 0)],        # Grises, negro
            'sprites': [(255, 192, 203), (255, 255, 0), (255, 165, 0)]     # Colores variados
        }
        
        # Modelos de IA cargados
        self.clip_model = None
        self.clip_preprocess = None
        self.yolo_model = None
        self.blip_model = None
        self.blip_processor = None
        
        # Resultados del análisis
        self.analysis_results = {
            'classified': [],
            'duplicates_removed': [],
            'renamed': [],
            'errors': []
        }
        
        # Cargar modelos disponibles
        self._load_ai_models()
    
    def _load_ai_models(self):
        """Carga modelos de IA disponibles localmente."""
        print("🤖 Cargando modelos de IA locales...")
        
        # Cargar CLIP si está disponible
        if HAS_CLIP and torch.cuda.is_available():
            try:
                device = "cuda" if torch.cuda.is_available() else "cpu"
                self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device=device)
                print(f"  ✅ CLIP cargado en {device}")
            except Exception as e:
                print(f"  ⚠️ Error cargando CLIP: {e}")
                HAS_CLIP = False
        elif HAS_CLIP:
            try:
                self.clip_model, self.clip_preprocess = clip.load("ViT-B/32", device="cpu")
                print("  ✅ CLIP cargado en CPU")
            except Exception as e:
                print(f"  ⚠️ Error cargando CLIP: {e}")
        
        # Cargar YOLO si está disponible
        if HAS_YOLO:
            try:
                self.yolo_model = YOLO('yolov8n.pt')  # Modelo pequeño y rápido
                print("  ✅ YOLO cargado")
            except Exception as e:
                print(f"  ⚠️ Error cargando YOLO: {e}")
        
        # Cargar BLIP si está disponible
        if HAS_BLIP:
            try:
                self.blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
                self.blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
                print("  ✅ BLIP cargado")
            except Exception as e:
                print(f"  ⚠️ Error cargando BLIP: {e}")
        
        if not any([HAS_CLIP, HAS_YOLO, HAS_BLIP]):
            print("  ⚠️ Usando clasificación basada en reglas y características visuales")
    
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
                # Redimensionar para análisis más rápido
                img = img.resize((64, 64))
                img_array = np.array(img.convert('RGB'))
                
                # Calcular histograma de colores
                hist_r = np.histogram(img_array[:,:,0], bins=16, range=(0, 255))[0]
                hist_g = np.histogram(img_array[:,:,1], bins=16, range=(0, 255))[0]
                hist_b = np.histogram(img_array[:,:,2], bins=16, range=(0, 255))[0]
                
                # Color dominante
                pixels = img_array.reshape(-1, 3)
                dominant_color = np.mean(pixels, axis=0)
                
                # Varianza de colores (indica complejidad)
                color_variance = np.var(pixels, axis=0)
                
                # Combinar características
                features = np.concatenate([
                    hist_r / np.sum(hist_r) if np.sum(hist_r) > 0 else hist_r,
                    hist_g / np.sum(hist_g) if np.sum(hist_g) > 0 else hist_g,
                    hist_b / np.sum(hist_b) if np.sum(hist_b) > 0 else hist_b,
                    dominant_color / 255.0,
                    color_variance / 255.0
                ])
                
                return features
        except Exception as e:
            print(f"Error extrayendo características de {image_path}: {e}")
            return np.zeros(54)  # 16+16+16+3+3
    
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
                'fill_ratio': np.sum(gray > 50) / (gray.shape[0] * gray.shape[1])
            }
            
            if contours:
                # Analizar el contorno más grande
                largest_contour = max(contours, key=cv2.contourArea)
                area = cv2.contourArea(largest_contour)
                perimeter = cv2.arcLength(largest_contour, True)
                
                if perimeter > 0:
                    features['complexity_score'] = (perimeter * perimeter) / area
                
                # Detectar formas regulares (rectángulos, círculos)
                approx = cv2.approxPolyDP(largest_contour, 0.02 * perimeter, True)
                features['has_regular_shapes'] = len(approx) <= 6
            
            return features
            
        except Exception as e:
            print(f"Error extrayendo formas de {image_path}: {e}")
            return {}
    
    def classify_with_clip(self, image_path: str) -> Dict:
        """Clasifica imagen usando CLIP."""
        if not self.clip_model:
            return {'category': 'unknown', 'confidence': 0.0, 'method': 'clip_unavailable'}
        
        try:
            # Preparar imagen
            image = Image.open(image_path).convert('RGB')
            image_input = self.clip_preprocess(image).unsqueeze(0)
            
            # Preparar textos de categorías
            text_queries = [
                f"a pixel art sprite of {cat}" for cat in self.valid_categories.keys()
            ]
            text_inputs = clip.tokenize(text_queries)
            
            # Mover a dispositivo correcto
            device = next(self.clip_model.parameters()).device
            image_input = image_input.to(device)
            text_inputs = text_inputs.to(device)
            
            # Calcular similitudes
            with torch.no_grad():
                image_features = self.clip_model.encode_image(image_input)
                text_features = self.clip_model.encode_text(text_inputs)
                
                # Calcular similaridades
                similarities = torch.cosine_similarity(image_features, text_features)
                probs = torch.softmax(similarities * 100, dim=0)
                
                # Obtener mejor match
                best_idx = torch.argmax(probs)
                confidence = float(probs[best_idx])
                category = list(self.valid_categories.keys())[best_idx]
            
            return {
                'category': category,
                'confidence': confidence,
                'method': 'clip',
                'description': f'Clasificado con CLIP (confianza: {confidence:.2f})'
            }
            
        except Exception as e:
            print(f"Error con CLIP en {image_path}: {e}")
            return {'category': 'sprites', 'confidence': 0.0, 'method': 'clip_error'}
    
    def classify_with_yolo(self, image_path: str) -> Dict:
        """Clasifica usando YOLO para detección de objetos."""
        if not self.yolo_model:
            return {'category': 'unknown', 'confidence': 0.0, 'method': 'yolo_unavailable'}
        
        try:
            results = self.yolo_model(image_path, verbose=False)
            
            if results and len(results) > 0:
                # Analizar detecciones
                detections = results[0].boxes
                if detections is not None and len(detections) > 0:
                    # Obtener clases detectadas
                    classes = detections.cls.cpu().numpy()
                    confidences = detections.conf.cpu().numpy()
                    
                    # Mapear clases YOLO a nuestras categorías
                    yolo_to_category = {
                        0: 'sprites',  # person
                        2: 'roads',    # car -> road context
                        5: 'roads',    # bus -> road context
                        7: 'roads',    # truck -> road context
                        14: 'nature',  # bird -> nature
                        15: 'nature',  # cat -> sprites/nature
                        16: 'nature',  # dog -> sprites/nature
                        17: 'nature',  # horse -> sprites/nature
                    }
                    
                    # Encontrar mejor detección
                    best_idx = np.argmax(confidences)
                    best_class = int(classes[best_idx])
                    confidence = float(confidences[best_idx])
                    
                    category = yolo_to_category.get(best_class, 'sprites')
                    
                    return {
                        'category': category,
                        'confidence': confidence,
                        'method': 'yolo',
                        'description': f'YOLO detectó clase {best_class}'
                    }
            
            return {'category': 'ground', 'confidence': 0.5, 'method': 'yolo_no_objects'}
            
        except Exception as e:
            print(f"Error con YOLO en {image_path}: {e}")
            return {'category': 'sprites', 'confidence': 0.0, 'method': 'yolo_error'}
    
    def classify_with_rules(self, image_path: str) -> Dict:
        """Clasificación basada en reglas usando características visuales."""
        try:
            # Extraer características
            color_features = self.extract_color_features(image_path)
            shape_features = self.extract_shape_features(image_path)
            
            # Analizar nombre del archivo
            filename = Path(image_path).stem.lower()
            
            scores = {}
            
            # Clasificación por keywords en el nombre
            for category, keywords in self.valid_categories.items():
                keyword_score = sum(1 for keyword in keywords if keyword in filename)
                scores[category] = keyword_score * 0.4
            
            # Clasificación por colores dominantes
            if len(color_features) >= 54:
                dominant_color = color_features[48:51] * 255  # RGB dominante
                
                for category, color_sigs in self.color_signatures.items():
                    color_distances = []
                    for sig_color in color_sigs:
                        distance = np.linalg.norm(dominant_color - np.array(sig_color))
                        color_distances.append(distance)
                    
                    # Score inverso a la distancia (menor distancia = mayor score)
                    min_distance = min(color_distances)
                    color_score = max(0, 1 - (min_distance / 255)) * 0.3
                    scores[category] = scores.get(category, 0) + color_score
            
            # Clasificación por características de forma
            if shape_features:
                aspect_ratio = shape_features.get('aspect_ratio', 1)
                complexity = shape_features.get('complexity_score', 0)
                fill_ratio = shape_features.get('fill_ratio', 0)
                
                # Reglas heurísticas
                if aspect_ratio > 3 or aspect_ratio < 0.3:  # Muy rectangular
                    scores['roads'] = scores.get('roads', 0) + 0.2
                    scores['buildings'] = scores.get('buildings', 0) + 0.1
                
                if complexity > 20:  # Muy complejo
                    scores['nature'] = scores.get('nature', 0) + 0.15
                    scores['sprites'] = scores.get('sprites', 0) + 0.15
                
                if fill_ratio < 0.3:  # Mucho espacio vacío
                    scores['ground'] = scores.get('ground', 0) + 0.1
            
            # Encontrar mejor categoría
            if scores:
                best_category = max(scores.keys(), key=lambda k: scores[k])
                confidence = min(1.0, scores[best_category])
            else:
                best_category = 'sprites'
                confidence = 0.3
            
            return {
                'category': best_category,
                'confidence': confidence,
                'method': 'rules',
                'description': f'Clasificado por reglas (scores: {scores})'
            }
            
        except Exception as e:
            print(f"Error en clasificación por reglas {image_path}: {e}")
            return {
                'category': 'sprites',
                'confidence': 0.1,
                'method': 'fallback',
                'description': 'Error en análisis, categoría por defecto'
            }
    
    def classify_image_multi_method(self, image_path: str) -> Dict:
        """Clasifica usando múltiples métodos y combina resultados."""
        results = []
        
        # Intentar CLIP
        if self.clip_model:
            clip_result = self.classify_with_clip(image_path)
            results.append(clip_result)
        
        # Intentar YOLO
        if self.yolo_model:
            yolo_result = self.classify_with_yolo(image_path)
            results.append(yolo_result)
        
        # Siempre usar reglas como fallback
        rules_result = self.classify_with_rules(image_path)
        results.append(rules_result)
        
        # Combinar resultados por weighted voting
        category_votes = {}
        total_weight = 0
        
        for result in results:
            category = result['category']
            confidence = result['confidence']
            method = result['method']
            
            # Pesos por método
            weight = {
                'clip': 0.5,
                'yolo': 0.3,
                'rules': 0.2,
                'yolo_no_objects': 0.1,
                'fallback': 0.05
            }.get(method, 0.1)
            
            weighted_score = confidence * weight
            category_votes[category] = category_votes.get(category, 0) + weighted_score
            total_weight += weight
        
        # Normalizar y encontrar ganador
        if category_votes and total_weight > 0:
            for cat in category_votes:
                category_votes[cat] /= total_weight
            
            best_category = max(category_votes.keys(), key=lambda k: category_votes[k])
            final_confidence = category_votes[best_category]
        else:
            best_category = 'sprites'
            final_confidence = 0.1
        
        return {
            'category': best_category,
            'confidence': final_confidence,
            'method': 'multi_method',
            'description': f'Combinado: {[r["method"] for r in results]}',
            'votes': category_votes,
            'individual_results': results
        }
    
    def find_duplicates(self, image_paths: List[str]) -> List[List[str]]:
        """Encuentra grupos de imágenes duplicadas usando hash perceptual."""
        hash_groups: Dict[str, List[str]] = {}
        
        print(f"🔍 Calculando hashes para {len(image_paths)} imágenes...")
        
        for i, image_path in enumerate(image_paths):
            if i % 100 == 0:
                print(f"  Procesando {i}/{len(image_paths)}")
            
            img_hash = self.calculate_image_hash(image_path)
            if img_hash:
                if img_hash not in hash_groups:
                    hash_groups[img_hash] = []
                hash_groups[img_hash].append(image_path)
        
        # Retornar solo grupos con duplicados
        duplicates = [group for group in hash_groups.values() if len(group) > 1]
        return duplicates
    
    def is_correctly_categorized(self, image_path: str, suggested_category: str) -> bool:
        """Verifica si la imagen ya está en la categoría correcta."""
        current_category = Path(image_path).parent.name
        return current_category == suggested_category
    
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
                # Preferir nombres más descriptivos
                score = len(name)
                # Bonificar nombres con palabras descriptivas
                for category, keywords in self.valid_categories.items():
                    for keyword in keywords:
                        if keyword in name:
                            score += 10
                return score
            
            group.sort(key=name_quality_score, reverse=True)
            
            # Mantener el primero (mejor nombre) y eliminar los demás
            keep_file = group[0]
            remove_files = group[1:]
            
            print(f"Duplicados encontrados:")
            print(f"  Mantener: {keep_file}")
            
            for remove_file in remove_files:
                try:
                    os.remove(remove_file)
                    print(f"  Eliminado: {remove_file}")
                    self.analysis_results['duplicates_removed'].append(remove_file)
                except Exception as e:
                    print(f"  Error eliminando {remove_file}: {e}")
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
            print(f"Movido: {current_path} -> {target_path}")
            self.analysis_results['renamed'].append({
                'from': current_path,
                'to': str(target_path),
                'category': target_category
            })
            return True
        except Exception as e:
            print(f"Error moviendo {current_path}: {e}")
            self.analysis_results['errors'].append(f"Error moviendo {current_path}: {e}")
            return False
    
    def process_images(self, remove_duplicates: bool = True, auto_move: bool = False, confidence_threshold: float = 0.6) -> None:
        """Procesa todas las imágenes: clasifica, detecta duplicados y reorganiza."""
        print("🔍 Iniciando análisis con IA local...")
        
        # Obtener todas las imágenes
        image_files = self.get_all_image_files()
        print(f"Encontradas {len(image_files)} imágenes")
        
        # Detectar duplicados primero
        if remove_duplicates:
            print("\n🔍 Detectando duplicados...")
            duplicate_groups = self.find_duplicates(image_files)
            
            if duplicate_groups:
                print(f"Encontrados {len(duplicate_groups)} grupos de duplicados")
                self.remove_duplicates(duplicate_groups)
                
                # Actualizar lista de archivos después de eliminar duplicados
                image_files = self.get_all_image_files()
            else:
                print("No se encontraron duplicados")
        
        # Clasificar imágenes restantes
        print(f"\n🤖 Clasificando {len(image_files)} imágenes con IA local...")
        
        for i, image_path in enumerate(image_files, 1):
            print(f"\n[{i}/{len(image_files)}] {Path(image_path).name}")
            
            # Clasificar con múltiples métodos
            classification = self.classify_image_multi_method(image_path)
            
            current_category = Path(image_path).parent.name
            suggested_category = classification['category']
            confidence = classification['confidence']
            
            print(f"  Actual: {current_category} -> Sugerido: {suggested_category} ({confidence:.2f})")
            print(f"  Método: {classification['method']}")
            
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
                self.move_to_correct_category(image_path, suggested_category)
            elif needs_move:
                print(f"  💡 Sugerencia: mover a '{suggested_category}' (confianza: {confidence:.2f})")
    
    def print_summary(self) -> None:
        """Imprime resumen del procesamiento."""
        print("\n" + "="*60)
        print("📊 RESUMEN DEL PROCESAMIENTO (IA LOCAL)")
        print("="*60)
        
        print(f"Imágenes clasificadas: {len(self.analysis_results['classified'])}")
        print(f"Duplicados eliminados: {len(self.analysis_results['duplicates_removed'])}")
        print(f"Archivos movidos: {len(self.analysis_results['renamed'])}")
        print(f"Errores: {len(self.analysis_results['errors'])}")
        
        # Estadísticas de métodos usados
        method_stats = {}
        confidence_stats = []
        
        for item in self.analysis_results['classified']:
            method = item.get('method', 'unknown')
            confidence = item.get('confidence', 0)
            
            method_stats[method] = method_stats.get(method, 0) + 1
            confidence_stats.append(confidence)
        
        print(f"\n📈 Métodos utilizados:")
        for method, count in sorted(method_stats.items()):
            print(f"  {method}: {count} imágenes")
        
        if confidence_stats:
            avg_confidence = np.mean(confidence_stats)
            print(f"\n🎯 Confianza promedio: {avg_confidence:.2f}")
        
        # Mostrar estadísticas por categoría
        category_stats = {}
        for item in self.analysis_results['classified']:
            cat = item['suggested_category']
            category_stats[cat] = category_stats.get(cat, 0) + 1
        
        print(f"\n📂 Distribución por categorías:")
        for category, count in sorted(category_stats.items()):
            print(f"  {category}: {count} imágenes")
    
    def save_report(self, output_file: str = "sprite_classification_local_report.json") -> None:
        """Guarda reporte detallado en JSON."""
        report = {
            'timestamp': str(Path().resolve()),
            'ai_models_used': {
                'clip': self.clip_model is not None,
                'yolo': self.yolo_model is not None,
                'blip': self.blip_model is not None
            },
            'summary': {
                'total_classified': len(self.analysis_results['classified']),
                'duplicates_removed': len(self.analysis_results['duplicates_removed']),
                'files_moved': len(self.analysis_results['renamed']),
                'errors': len(self.analysis_results['errors'])
            },
            'details': self.analysis_results
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Reporte guardado en: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Clasificador de sprites con IA LOCAL")
    parser.add_argument("--path", default=".", help="Ruta base del proyecto")
    parser.add_argument("--no-duplicates", action="store_true", help="No eliminar duplicados")
    parser.add_argument("--auto-move", action="store_true", help="Mover archivos automáticamente")
    parser.add_argument("--confidence", type=float, default=0.6, help="Umbral de confianza para mover (0.0-1.0)")
    parser.add_argument("--report", default="sprite_local_report.json", help="Archivo de reporte")
    
    args = parser.parse_args()
    
    try:
        classifier = LocalSpriteClassifier(args.path)
        
        print("🎮 Clasificador de Sprites con IA LOCAL")
        print("=" * 45)
        print(f"Ruta base: {classifier.base_path}")
        print(f"Eliminar duplicados: {not args.no_duplicates}")
        print(f"Mover automático: {args.auto_move}")
        print(f"Umbral confianza: {args.confidence}")
        
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
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()