#!/usr/bin/env python3
"""
Script de clasificación y renombramiento de sprites de juegos 2D usando IA.
Clasifica imágenes en categorías como buildings, nature, ground, etc.
Detecta y elimina duplicados usando hash perceptual.
Renombra archivos solo si es necesario para corregir clasificación.
"""

import os
import shutil
import hashlib
import json
from PIL import Image, ImageChops
import imagehash
from pathlib import Path
import argparse
import sys
from typing import Dict, List, Tuple, Set
import openai
import base64
from io import BytesIO
import requests

# Configuración de OpenAI (necesita API key en variable de entorno)
# export OPENAI_API_KEY="tu-api-key-aqui"

class SpriteClassifier:
    def __init__(self, base_path: str, api_key: str = None):
        self.base_path = Path(base_path)
        self.assets_path = self.base_path / "assets"
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("API key de OpenAI requerida. Usar --api-key o variable OPENAI_API_KEY")
        
        # Categorías válidas basadas en la estructura existente
        self.valid_categories = {
            'buildings': 'edificios, estructuras, construcciones',
            'nature': 'árboles, plantas, vegetación',
            'ground': 'suelos, terrenos, pisos',
            'water': 'agua, ríos, estanques',
            'roads': 'carreteras, caminos, vías',
            'sprites': 'personajes, entidades, objetos móviles',
            'animations': 'archivos de animación'
        }
        
        # Hashes para detectar duplicados
        self.image_hashes: Dict[str, List[str]] = {}
        
        # Resultados del análisis
        self.analysis_results = {
            'classified': [],
            'duplicates_removed': [],
            'renamed': [],
            'errors': []
        }
    
    def encode_image_base64(self, image_path: str) -> str:
        """Convierte imagen a base64 para enviar a OpenAI Vision API."""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def classify_image_with_ai(self, image_path: str) -> Dict:
        """Clasifica imagen usando OpenAI Vision API."""
        try:
            base64_image = self.encode_image_base64(image_path)
            
            # Preparar prompt para clasificación específica de sprites de juegos
            prompt = f"""
            Analiza esta imagen de sprite de juego 2D y clasifícala en una de estas categorías:

            CATEGORÍAS VÁLIDAS:
            - buildings: {self.valid_categories['buildings']}
            - nature: {self.valid_categories['nature']}  
            - ground: {self.valid_categories['ground']}
            - water: {self.valid_categories['water']}
            - roads: {self.valid_categories['roads']}
            - sprites: {self.valid_categories['sprites']}
            - animations: {self.valid_categories['animations']}

            Responde SOLO en formato JSON:
            {{
                "category": "categoria_detectada",
                "confidence": 0.95,
                "description": "descripción breve de lo que contiene la imagen",
                "suggested_name": "nombre_sugerido_descriptivo"
            }}

            Si la imagen es principalmente de fondo/textura repetitiva, usar "ground".
            Si son elementos arquitectónicos, usar "buildings".
            Si son elementos naturales, usar "nature".
            Si es un personaje/entidad, usar "sprites".
            """
            
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{base64_image}"}
                            }
                        ]
                    }
                ],
                max_tokens=300,
                temperature=0.1
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Parsear JSON de la respuesta
            if result_text.startswith('```json'):
                result_text = result_text.replace('```json', '').replace('```', '').strip()
            
            result = json.loads(result_text)
            
            # Validar que la categoría esté permitida
            if result['category'] not in self.valid_categories:
                result['category'] = 'sprites'  # Categoría por defecto
            
            return result
            
        except Exception as e:
            print(f"Error clasificando {image_path}: {e}")
            return {
                'category': 'sprites',
                'confidence': 0.0,
                'description': 'Error en clasificación',
                'suggested_name': Path(image_path).stem
            }
    
    def calculate_image_hash(self, image_path: str) -> str:
        """Calcula hash perceptual para detectar duplicados."""
        try:
            with Image.open(image_path) as img:
                # Usar hash perceptual que detecta imágenes visualmente similares
                phash = str(imagehash.phash(img, hash_size=16))
                return phash
        except Exception as e:
            print(f"Error calculando hash para {image_path}: {e}")
            return ""
    
    def find_duplicates(self, image_paths: List[str]) -> List[List[str]]:
        """Encuentra grupos de imágenes duplicadas."""
        hash_groups: Dict[str, List[str]] = {}
        
        for image_path in image_paths:
            img_hash = self.calculate_image_hash(image_path)
            if img_hash:
                if img_hash not in hash_groups:
                    hash_groups[img_hash] = []
                hash_groups[img_hash].append(image_path)
        
        # Retornar solo grupos con duplicados
        duplicates = [group for group in hash_groups.values() if len(group) > 1]
        return duplicates
    
    def is_correctly_named(self, filename: str, category: str, suggested_name: str) -> bool:
        """Verifica si el archivo ya está correctamente nombrado y en la categoría correcta."""
        current_path = Path(filename)
        current_category = current_path.parent.name
        current_name = current_path.stem.lower()
        
        # Verificar si está en la categoría correcta
        if current_category != category:
            return False
        
        # Verificar si el nombre es descriptivo y relacionado
        category_keywords = {
            'buildings': ['edificio', 'building', 'casa', 'tower', 'comercial', 'pequeño', 'grande', 'alto'],
            'nature': ['arbol', 'tree', 'plant', 'frondoso', 'joven', 'pequeño', 'grande'],
            'ground': ['suelo', 'ground', 'tierra', 'arena', 'piedra', 'cesped', 'grass'],
            'water': ['agua', 'water', 'profunda', 'clara', 'estanque', 'corriente'],
            'roads': ['carretera', 'road', 'horizontal', 'vertical', 'curva', 'cruce'],
            'sprites': ['entidad', 'entity', 'character', 'player', 'circulo', 'square']
        }
        
        keywords = category_keywords.get(category, [])
        has_relevant_keyword = any(keyword in current_name for keyword in keywords)
        
        return has_relevant_keyword
    
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
            
            # Ordenar por longitud del nombre (más descriptivo) y por path
            group.sort(key=lambda x: (len(Path(x).stem), x))
            
            # Mantener el primero (mejor nombrado) y eliminar los demás
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
    
    def rename_and_move_file(self, current_path: str, target_category: str, suggested_name: str) -> bool:
        """Renombra y mueve archivo a la categoría correcta si es necesario."""
        current_file = Path(current_path)
        target_dir = self.assets_path / target_category
        
        # Crear directorio si no existe
        target_dir.mkdir(exist_ok=True)
        
        # Generar nombre final limpiando caracteres especiales
        clean_name = "".join(c for c in suggested_name if c.isalnum() or c in "._- ")
        clean_name = clean_name.replace(" ", "_").lower()
        
        # Asegurar extensión
        if not clean_name.endswith('.png'):
            clean_name += '.png'
        
        target_path = target_dir / clean_name
        
        # Si ya está en el lugar correcto, no hacer nada
        if current_file.resolve() == target_path.resolve():
            return False
        
        # Evitar sobrescribir archivos existentes
        counter = 1
        original_target = target_path
        while target_path.exists():
            name_part = original_target.stem
            target_path = original_target.parent / f"{name_part}_{counter}.png"
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
    
    def process_images(self, remove_duplicates: bool = True, auto_rename: bool = False) -> None:
        """Procesa todas las imágenes: clasifica, detecta duplicados y renombra si es necesario."""
        print("🔍 Iniciando análisis de imágenes...")
        
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
        print("\n🤖 Clasificando imágenes con IA...")
        
        for i, image_path in enumerate(image_files, 1):
            print(f"\n[{i}/{len(image_files)}] Procesando: {Path(image_path).name}")
            
            # Clasificar con IA
            classification = self.classify_image_with_ai(image_path)
            
            current_category = Path(image_path).parent.name
            suggested_category = classification['category']
            confidence = classification.get('confidence', 0)
            
            print(f"  Categoría actual: {current_category}")
            print(f"  Categoría sugerida: {suggested_category} (confianza: {confidence:.2f})")
            print(f"  Descripción: {classification.get('description', 'N/A')}")
            
            self.analysis_results['classified'].append({
                'file': image_path,
                'current_category': current_category,
                'suggested_category': suggested_category,
                'confidence': confidence,
                'description': classification.get('description', '')
            })
            
            # Decidir si renombrar/mover
            needs_rename = not self.is_correctly_named(image_path, suggested_category, classification.get('suggested_name', ''))
            
            if needs_rename and auto_rename:
                if confidence > 0.7:  # Solo renombrar con alta confianza
                    self.rename_and_move_file(image_path, suggested_category, classification.get('suggested_name', Path(image_path).stem))
                else:
                    print(f"  ⚠️ Confianza baja, se mantiene sin cambios")
            elif needs_rename:
                print(f"  💡 Sugerencia: mover a '{suggested_category}' con nombre '{classification.get('suggested_name', '')}'")
    
    def print_summary(self) -> None:
        """Imprime resumen del procesamiento."""
        print("\n" + "="*60)
        print("📊 RESUMEN DEL PROCESAMIENTO")
        print("="*60)
        
        print(f"Imágenes clasificadas: {len(self.analysis_results['classified'])}")
        print(f"Duplicados eliminados: {len(self.analysis_results['duplicates_removed'])}")
        print(f"Archivos renombrados/movidos: {len(self.analysis_results['renamed'])}")
        print(f"Errores: {len(self.analysis_results['errors'])}")
        
        if self.analysis_results['errors']:
            print("\n❌ Errores encontrados:")
            for error in self.analysis_results['errors']:
                print(f"  - {error}")
        
        # Mostrar estadísticas por categoría
        category_stats = {}
        for item in self.analysis_results['classified']:
            cat = item['suggested_category']
            if cat not in category_stats:
                category_stats[cat] = 0
            category_stats[cat] += 1
        
        print("\n📈 Distribución por categorías:")
        for category, count in sorted(category_stats.items()):
            print(f"  {category}: {count} imágenes")
    
    def save_report(self, output_file: str = "sprite_classification_report.json") -> None:
        """Guarda reporte detallado en JSON."""
        report = {
            'timestamp': str(Path().resolve()),
            'summary': {
                'total_classified': len(self.analysis_results['classified']),
                'duplicates_removed': len(self.analysis_results['duplicates_removed']),
                'files_renamed': len(self.analysis_results['renamed']),
                'errors': len(self.analysis_results['errors'])
            },
            'details': self.analysis_results
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Reporte guardado en: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Clasificador de sprites con IA")
    parser.add_argument("--path", default=".", help="Ruta base del proyecto")
    parser.add_argument("--api-key", help="API key de OpenAI")
    parser.add_argument("--no-duplicates", action="store_true", help="No eliminar duplicados")
    parser.add_argument("--auto-rename", action="store_true", help="Renombrar automáticamente archivos")
    parser.add_argument("--report", default="sprite_report.json", help="Archivo de reporte")
    
    args = parser.parse_args()
    
    try:
        # Inicializar cliente OpenAI
        openai.api_key = args.api_key or os.getenv("OPENAI_API_KEY")
        
        classifier = SpriteClassifier(args.path, args.api_key)
        
        print("🎮 Clasificador de Sprites con IA")
        print("=" * 40)
        print(f"Ruta base: {classifier.base_path}")
        print(f"Eliminar duplicados: {not args.no_duplicates}")
        print(f"Renombrar automático: {args.auto_rename}")
        
        # Procesar imágenes
        classifier.process_images(
            remove_duplicates=not args.no_duplicates,
            auto_rename=args.auto_rename
        )
        
        # Mostrar resumen
        classifier.print_summary()
        
        # Guardar reporte
        classifier.save_report(args.report)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()