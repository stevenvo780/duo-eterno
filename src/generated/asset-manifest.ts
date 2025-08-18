/**
 * 🎨 MANIFEST DE ASSETS GENERADO AUTOMÁTICAMENTE
 * 
 * Este archivo se genera automáticamente ejecutando:
 * npm run sprite-loader
 * 
 * Contiene toda la estructura de assets organizados por carpetas
 */

export interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

export interface AnimationAsset {
  id: string;
  name: string;
  jsonPath: string;
  spritePath: string;
  metadata: AnimationMetadata;
}

export interface StaticSpriteAsset {
  id: string;
  name: string;
  path: string;
  extension: string;
}

export interface AssetFolder {
  name: string;
  path: string;
  animations: AnimationAsset[];
  staticSprites: StaticSpriteAsset[];
  subfolders?: Record<string, AssetFolder>;
  totalAssets: number;
}

export const ASSET_MANIFEST: Record<string, AssetFolder> = {
  "activities": {
    "name": "activities",
    "path": "activities",
    "animations": [
      {
        "id": "ARZone_detected",
        "name": "default",
        "jsonPath": "activities/ARZone_default_detected.json",
        "spritePath": "activities/ARZone.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "ARZone.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.064Z"
        }
      },
      {
        "id": "Air Europa_detected",
        "name": "default",
        "jsonPath": "activities/Air Europa_default_detected.json",
        "spritePath": "activities/Air Europa.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Air Europa.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.066Z"
        }
      },
      {
        "id": "AirBnB_detected",
        "name": "default",
        "jsonPath": "activities/AirBnB_default_detected.json",
        "spritePath": "activities/AirBnB.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "AirBnB.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.067Z"
        }
      },
      {
        "id": "Amazon Prime_detected",
        "name": "default",
        "jsonPath": "activities/Amazon Prime_default_detected.json",
        "spritePath": "activities/Amazon Prime.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Amazon Prime.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.068Z"
        }
      },
      {
        "id": "Amazon Shopping_detected",
        "name": "default",
        "jsonPath": "activities/Amazon Shopping_default_detected.json",
        "spritePath": "activities/Amazon Shopping.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Amazon Shopping.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.070Z"
        }
      },
      {
        "id": "Amazon_detected",
        "name": "default",
        "jsonPath": "activities/Amazon_default_detected.json",
        "spritePath": "activities/Amazon.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Amazon.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.071Z"
        }
      },
      {
        "id": "ArtStation_detected",
        "name": "default",
        "jsonPath": "activities/ArtStation_default_detected.json",
        "spritePath": "activities/ArtStation.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "ArtStation.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.071Z"
        }
      },
      {
        "id": "Authy_detected",
        "name": "default",
        "jsonPath": "activities/Authy_default_detected.json",
        "spritePath": "activities/Authy.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Authy.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.072Z"
        }
      },
      {
        "id": "Battle_detected",
        "name": "default",
        "jsonPath": "activities/Battle_default_detected.json",
        "spritePath": "activities/Battle.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Battle.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.072Z"
        }
      },
      {
        "id": "Booking_detected",
        "name": "default",
        "jsonPath": "activities/Booking_default_detected.json",
        "spritePath": "activities/Booking.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Booking.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.073Z"
        }
      },
      {
        "id": "CityMapper_detected",
        "name": "default",
        "jsonPath": "activities/CityMapper_default_detected.json",
        "spritePath": "activities/CityMapper.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "CityMapper.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.075Z"
        }
      },
      {
        "id": "Cuenta DNI_detected",
        "name": "default",
        "jsonPath": "activities/Cuenta DNI_default_detected.json",
        "spritePath": "activities/Cuenta DNI.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Cuenta DNI.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.079Z"
        }
      },
      {
        "id": "Deliveroo_detected",
        "name": "default",
        "jsonPath": "activities/Deliveroo_default_detected.json",
        "spritePath": "activities/Deliveroo.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Deliveroo.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.079Z"
        }
      },
      {
        "id": "Deviantart_detected",
        "name": "default",
        "jsonPath": "activities/Deviantart_default_detected.json",
        "spritePath": "activities/Deviantart.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Deviantart.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.080Z"
        }
      },
      {
        "id": "Discord_detected",
        "name": "default",
        "jsonPath": "activities/Discord_default_detected.json",
        "spritePath": "activities/Discord.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Discord.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.081Z"
        }
      },
      {
        "id": "Duolingo_detected",
        "name": "default",
        "jsonPath": "activities/Duolingo_default_detected.json",
        "spritePath": "activities/Duolingo.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Duolingo.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.081Z"
        }
      },
      {
        "id": "Evernote_detected",
        "name": "default",
        "jsonPath": "activities/Evernote_default_detected.json",
        "spritePath": "activities/Evernote.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Evernote.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.081Z"
        }
      },
      {
        "id": "Express VPN_detected",
        "name": "default",
        "jsonPath": "activities/Express VPN_default_detected.json",
        "spritePath": "activities/Express VPN.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Express VPN.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.082Z"
        }
      },
      {
        "id": "Facebook Messenger_detected",
        "name": "default",
        "jsonPath": "activities/Facebook Messenger_default_detected.json",
        "spritePath": "activities/Facebook Messenger.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Facebook Messenger.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.082Z"
        }
      },
      {
        "id": "Facebook_detected",
        "name": "default",
        "jsonPath": "activities/Facebook_default_detected.json",
        "spritePath": "activities/Facebook.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Facebook.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.086Z"
        }
      },
      {
        "id": "Firefox_detected",
        "name": "default",
        "jsonPath": "activities/Firefox_default_detected.json",
        "spritePath": "activities/Firefox.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Firefox.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.087Z"
        }
      },
      {
        "id": "FitBod_detected",
        "name": "default",
        "jsonPath": "activities/FitBod_default_detected.json",
        "spritePath": "activities/FitBod.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "FitBod.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.087Z"
        }
      },
      {
        "id": "Galaxy Store_detected",
        "name": "default",
        "jsonPath": "activities/Galaxy Store_default_detected.json",
        "spritePath": "activities/Galaxy Store.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Galaxy Store.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.088Z"
        }
      },
      {
        "id": "Glovo_detected",
        "name": "default",
        "jsonPath": "activities/Glovo_default_detected.json",
        "spritePath": "activities/Glovo.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Glovo.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.088Z"
        }
      },
      {
        "id": "Gmail_detected",
        "name": "default",
        "jsonPath": "activities/Gmail_default_detected.json",
        "spritePath": "activities/Gmail.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Gmail.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.094Z"
        }
      },
      {
        "id": "Google Authentificator Old_detected",
        "name": "default",
        "jsonPath": "activities/Google Authentificator Old_default_detected.json",
        "spritePath": "activities/Google Authentificator Old.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Authentificator Old.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.095Z"
        }
      },
      {
        "id": "Google Authentificator_detected",
        "name": "default",
        "jsonPath": "activities/Google Authentificator_default_detected.json",
        "spritePath": "activities/Google Authentificator.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Authentificator.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.095Z"
        }
      },
      {
        "id": "Google Calendar_detected",
        "name": "default",
        "jsonPath": "activities/Google Calendar_default_detected.json",
        "spritePath": "activities/Google Calendar.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Calendar.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.096Z"
        }
      },
      {
        "id": "Google Chrome_detected",
        "name": "default",
        "jsonPath": "activities/Google Chrome_default_detected.json",
        "spritePath": "activities/Google Chrome.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Chrome.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.096Z"
        }
      },
      {
        "id": "Google Currents_detected",
        "name": "default",
        "jsonPath": "activities/Google Currents_default_detected.json",
        "spritePath": "activities/Google Currents.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Currents.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.096Z"
        }
      },
      {
        "id": "Google Docs_detected",
        "name": "default",
        "jsonPath": "activities/Google Docs_default_detected.json",
        "spritePath": "activities/Google Docs.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Docs.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.097Z"
        }
      },
      {
        "id": "Google Drive_detected",
        "name": "default",
        "jsonPath": "activities/Google Drive_default_detected.json",
        "spritePath": "activities/Google Drive.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Drive.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.097Z"
        }
      },
      {
        "id": "Google Files_detected",
        "name": "default",
        "jsonPath": "activities/Google Files_default_detected.json",
        "spritePath": "activities/Google Files.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Files.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.097Z"
        }
      },
      {
        "id": "Google Fit_detected",
        "name": "default",
        "jsonPath": "activities/Google Fit_default_detected.json",
        "spritePath": "activities/Google Fit.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Fit.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.098Z"
        }
      },
      {
        "id": "Google Forms_detected",
        "name": "default",
        "jsonPath": "activities/Google Forms_default_detected.json",
        "spritePath": "activities/Google Forms.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Forms.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.098Z"
        }
      },
      {
        "id": "Google Hangouts_detected",
        "name": "default",
        "jsonPath": "activities/Google Hangouts_default_detected.json",
        "spritePath": "activities/Google Hangouts.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Hangouts.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.099Z"
        }
      },
      {
        "id": "Google Keep_detected",
        "name": "default",
        "jsonPath": "activities/Google Keep_default_detected.json",
        "spritePath": "activities/Google Keep.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Keep.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.099Z"
        }
      },
      {
        "id": "Google Launcher_detected",
        "name": "default",
        "jsonPath": "activities/Google Launcher_default_detected.json",
        "spritePath": "activities/Google Launcher.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Launcher.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.099Z"
        }
      },
      {
        "id": "Google Maps Old_detected",
        "name": "default",
        "jsonPath": "activities/Google Maps Old_default_detected.json",
        "spritePath": "activities/Google Maps Old.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Maps Old.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.100Z"
        }
      },
      {
        "id": "Google Maps_detected",
        "name": "default",
        "jsonPath": "activities/Google Maps_default_detected.json",
        "spritePath": "activities/Google Maps.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Maps.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.100Z"
        }
      },
      {
        "id": "Google Photos_detected",
        "name": "default",
        "jsonPath": "activities/Google Photos_default_detected.json",
        "spritePath": "activities/Google Photos.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Photos.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.100Z"
        }
      },
      {
        "id": "Google Playstore_detected",
        "name": "default",
        "jsonPath": "activities/Google Playstore_default_detected.json",
        "spritePath": "activities/Google Playstore.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Playstore.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.101Z"
        }
      },
      {
        "id": "Google Podcasts_detected",
        "name": "default",
        "jsonPath": "activities/Google Podcasts_default_detected.json",
        "spritePath": "activities/Google Podcasts.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Podcasts.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.101Z"
        }
      },
      {
        "id": "Google Sheets_detected",
        "name": "default",
        "jsonPath": "activities/Google Sheets_default_detected.json",
        "spritePath": "activities/Google Sheets.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Sheets.png",
          "detected_automatically": true,
          "detection_confidence": 60,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.102Z"
        }
      },
      {
        "id": "Google Slides_detected",
        "name": "default",
        "jsonPath": "activities/Google Slides_default_detected.json",
        "spritePath": "activities/Google Slides.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Slides.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.102Z"
        }
      },
      {
        "id": "Google TV_detected",
        "name": "default",
        "jsonPath": "activities/Google TV_default_detected.json",
        "spritePath": "activities/Google TV.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google TV.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.102Z"
        }
      },
      {
        "id": "Google TalkBack_detected",
        "name": "default",
        "jsonPath": "activities/Google TalkBack_default_detected.json",
        "spritePath": "activities/Google TalkBack.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google TalkBack.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.103Z"
        }
      },
      {
        "id": "Google Text to Speech_detected",
        "name": "default",
        "jsonPath": "activities/Google Text to Speech_default_detected.json",
        "spritePath": "activities/Google Text to Speech.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Text to Speech.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.103Z"
        }
      },
      {
        "id": "Google Translate_detected",
        "name": "default",
        "jsonPath": "activities/Google Translate_default_detected.json",
        "spritePath": "activities/Google Translate.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Translate.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.103Z"
        }
      },
      {
        "id": "Google Wallet_detected",
        "name": "default",
        "jsonPath": "activities/Google Wallet_default_detected.json",
        "spritePath": "activities/Google Wallet.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google Wallet.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.103Z"
        }
      },
      {
        "id": "Google_detected",
        "name": "default",
        "jsonPath": "activities/Google_default_detected.json",
        "spritePath": "activities/Google.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Google.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.104Z"
        }
      },
      {
        "id": "Idealista_detected",
        "name": "default",
        "jsonPath": "activities/Idealista_default_detected.json",
        "spritePath": "activities/Idealista.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Idealista.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.104Z"
        }
      },
      {
        "id": "Instagram Old_detected",
        "name": "default",
        "jsonPath": "activities/Instagram Old_default_detected.json",
        "spritePath": "activities/Instagram Old.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Instagram Old.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.104Z"
        }
      },
      {
        "id": "Instagram_detected",
        "name": "default",
        "jsonPath": "activities/Instagram_default_detected.json",
        "spritePath": "activities/Instagram.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Instagram.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.105Z"
        }
      },
      {
        "id": "Itch io_detected",
        "name": "default",
        "jsonPath": "activities/Itch io_default_detected.json",
        "spritePath": "activities/Itch io.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Itch io.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.105Z"
        }
      },
      {
        "id": "Ko Fi_detected",
        "name": "default",
        "jsonPath": "activities/Ko Fi_default_detected.json",
        "spritePath": "activities/Ko Fi.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Ko Fi.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.106Z"
        }
      },
      {
        "id": "Letterboxd_detected",
        "name": "default",
        "jsonPath": "activities/Letterboxd_default_detected.json",
        "spritePath": "activities/Letterboxd.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Letterboxd.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.107Z"
        }
      },
      {
        "id": "LinkedIn_detected",
        "name": "default",
        "jsonPath": "activities/LinkedIn_default_detected.json",
        "spritePath": "activities/LinkedIn.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "LinkedIn.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.107Z"
        }
      },
      {
        "id": "Lloyds Bank_detected",
        "name": "default",
        "jsonPath": "activities/Lloyds Bank_default_detected.json",
        "spritePath": "activities/Lloyds Bank.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Lloyds Bank.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.107Z"
        }
      },
      {
        "id": "London Guide_detected",
        "name": "default",
        "jsonPath": "activities/London Guide_default_detected.json",
        "spritePath": "activities/London Guide.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "London Guide.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.109Z"
        }
      },
      {
        "id": "London Offline Map_detected",
        "name": "default",
        "jsonPath": "activities/London Offline Map_default_detected.json",
        "spritePath": "activities/London Offline Map.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "London Offline Map.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.109Z"
        }
      },
      {
        "id": "London Tube Map_detected",
        "name": "default",
        "jsonPath": "activities/London Tube Map_default_detected.json",
        "spritePath": "activities/London Tube Map.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "London Tube Map.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.109Z"
        }
      },
      {
        "id": "Mercadolibre_detected",
        "name": "default",
        "jsonPath": "activities/Mercadolibre_default_detected.json",
        "spritePath": "activities/Mercadolibre.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Mercadolibre.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.110Z"
        }
      },
      {
        "id": "Mercadopago_detected",
        "name": "default",
        "jsonPath": "activities/Mercadopago_default_detected.json",
        "spritePath": "activities/Mercadopago.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Mercadopago.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.110Z"
        }
      },
      {
        "id": "Mi Argentina_detected",
        "name": "default",
        "jsonPath": "activities/Mi Argentina_default_detected.json",
        "spritePath": "activities/Mi Argentina.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Mi Argentina.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.110Z"
        }
      },
      {
        "id": "Microsoft Access_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Access_default_detected.json",
        "spritePath": "activities/Microsoft Access.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Access.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.110Z"
        }
      },
      {
        "id": "Microsoft Authentificator_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Authentificator_default_detected.json",
        "spritePath": "activities/Microsoft Authentificator.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Authentificator.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.111Z"
        }
      },
      {
        "id": "Microsoft Edge_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Edge_default_detected.json",
        "spritePath": "activities/Microsoft Edge.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Edge.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.111Z"
        }
      },
      {
        "id": "Microsoft Excel_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Excel_default_detected.json",
        "spritePath": "activities/Microsoft Excel.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Excel.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.111Z"
        }
      },
      {
        "id": "Microsoft Launcher_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Launcher_default_detected.json",
        "spritePath": "activities/Microsoft Launcher.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Launcher.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.111Z"
        }
      },
      {
        "id": "Microsoft Link to Windows_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Link to Windows_default_detected.json",
        "spritePath": "activities/Microsoft Link to Windows.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Link to Windows.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.112Z"
        }
      },
      {
        "id": "Microsoft Office_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Office_default_detected.json",
        "spritePath": "activities/Microsoft Office.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Office.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.112Z"
        }
      },
      {
        "id": "Microsoft OneDrive_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft OneDrive_default_detected.json",
        "spritePath": "activities/Microsoft OneDrive.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft OneDrive.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.112Z"
        }
      },
      {
        "id": "Microsoft OneNote_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft OneNote_default_detected.json",
        "spritePath": "activities/Microsoft OneNote.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft OneNote.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.112Z"
        }
      },
      {
        "id": "Microsoft PowerPoint_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft PowerPoint_default_detected.json",
        "spritePath": "activities/Microsoft PowerPoint.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft PowerPoint.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.113Z"
        }
      },
      {
        "id": "Microsoft Publisher_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Publisher_default_detected.json",
        "spritePath": "activities/Microsoft Publisher.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Publisher.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.114Z"
        }
      },
      {
        "id": "Microsoft To Do_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft To Do_default_detected.json",
        "spritePath": "activities/Microsoft To Do.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft To Do.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.114Z"
        }
      },
      {
        "id": "Microsoft Word_detected",
        "name": "default",
        "jsonPath": "activities/Microsoft Word_default_detected.json",
        "spritePath": "activities/Microsoft Word.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Microsoft Word.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.114Z"
        }
      },
      {
        "id": "Miro_detected",
        "name": "default",
        "jsonPath": "activities/Miro_default_detected.json",
        "spritePath": "activities/Miro.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Miro.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.114Z"
        }
      },
      {
        "id": "Moj_detected",
        "name": "default",
        "jsonPath": "activities/Moj_default_detected.json",
        "spritePath": "activities/Moj.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Moj.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.115Z"
        }
      },
      {
        "id": "My Fitness Pal_detected",
        "name": "default",
        "jsonPath": "activities/My Fitness Pal_default_detected.json",
        "spritePath": "activities/My Fitness Pal.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "My Fitness Pal.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.115Z"
        }
      },
      {
        "id": "Netflix v2_detected",
        "name": "default",
        "jsonPath": "activities/Netflix v2_default_detected.json",
        "spritePath": "activities/Netflix v2.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Netflix v2.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.115Z"
        }
      },
      {
        "id": "Netflix_detected",
        "name": "default",
        "jsonPath": "activities/Netflix_default_detected.json",
        "spritePath": "activities/Netflix.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Netflix.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.115Z"
        }
      },
      {
        "id": "Notion_detected",
        "name": "default",
        "jsonPath": "activities/Notion_default_detected.json",
        "spritePath": "activities/Notion.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Notion.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.116Z"
        }
      },
      {
        "id": "Nova Launcher_detected",
        "name": "default",
        "jsonPath": "activities/Nova Launcher_default_detected.json",
        "spritePath": "activities/Nova Launcher.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Nova Launcher.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.116Z"
        }
      },
      {
        "id": "Nuffield Health_detected",
        "name": "default",
        "jsonPath": "activities/Nuffield Health_default_detected.json",
        "spritePath": "activities/Nuffield Health.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Nuffield Health.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.116Z"
        }
      },
      {
        "id": "Opera_detected",
        "name": "default",
        "jsonPath": "activities/Opera_default_detected.json",
        "spritePath": "activities/Opera.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Opera.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.116Z"
        }
      },
      {
        "id": "Outlook_detected",
        "name": "default",
        "jsonPath": "activities/Outlook_default_detected.json",
        "spritePath": "activities/Outlook.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Outlook.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.117Z"
        }
      },
      {
        "id": "Patreon_detected",
        "name": "default",
        "jsonPath": "activities/Patreon_default_detected.json",
        "spritePath": "activities/Patreon.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Patreon.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.117Z"
        }
      },
      {
        "id": "PayPal_detected",
        "name": "default",
        "jsonPath": "activities/PayPal_default_detected.json",
        "spritePath": "activities/PayPal.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "PayPal.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.117Z"
        }
      },
      {
        "id": "PedidosYa_detected",
        "name": "default",
        "jsonPath": "activities/PedidosYa_default_detected.json",
        "spritePath": "activities/PedidosYa.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "PedidosYa.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.117Z"
        }
      },
      {
        "id": "Pikmin_detected",
        "name": "default",
        "jsonPath": "activities/Pikmin_default_detected.json",
        "spritePath": "activities/Pikmin.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Pikmin.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.118Z"
        }
      },
      {
        "id": "Pinterest_detected",
        "name": "default",
        "jsonPath": "activities/Pinterest_default_detected.json",
        "spritePath": "activities/Pinterest.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Pinterest.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.118Z"
        }
      },
      {
        "id": "Reddit_detected",
        "name": "default",
        "jsonPath": "activities/Reddit_default_detected.json",
        "spritePath": "activities/Reddit.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Reddit.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.118Z"
        }
      },
      {
        "id": "Rubiks Cube_detected",
        "name": "default",
        "jsonPath": "activities/Rubiks Cube_default_detected.json",
        "spritePath": "activities/Rubiks Cube.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Rubiks Cube.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.118Z"
        }
      },
      {
        "id": "Safari_detected",
        "name": "default",
        "jsonPath": "activities/Safari_default_detected.json",
        "spritePath": "activities/Safari.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Safari.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.119Z"
        }
      },
      {
        "id": "Samsung Free_detected",
        "name": "default",
        "jsonPath": "activities/Samsung Free_default_detected.json",
        "spritePath": "activities/Samsung Free.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Samsung Free.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.119Z"
        }
      },
      {
        "id": "Santander_detected",
        "name": "default",
        "jsonPath": "activities/Santander_default_detected.json",
        "spritePath": "activities/Santander.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Santander.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.119Z"
        }
      },
      {
        "id": "Skype_detected",
        "name": "default",
        "jsonPath": "activities/Skype_default_detected.json",
        "spritePath": "activities/Skype.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Skype.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.119Z"
        }
      },
      {
        "id": "Slack v2_detected",
        "name": "default",
        "jsonPath": "activities/Slack v2_default_detected.json",
        "spritePath": "activities/Slack v2.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Slack v2.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.120Z"
        }
      },
      {
        "id": "Slack_detected",
        "name": "default",
        "jsonPath": "activities/Slack_default_detected.json",
        "spritePath": "activities/Slack.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Slack.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.120Z"
        }
      },
      {
        "id": "Snapchat_detected",
        "name": "default",
        "jsonPath": "activities/Snapchat_default_detected.json",
        "spritePath": "activities/Snapchat.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Snapchat.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.120Z"
        }
      },
      {
        "id": "SocioPlus_detected",
        "name": "default",
        "jsonPath": "activities/SocioPlus_default_detected.json",
        "spritePath": "activities/SocioPlus.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "SocioPlus.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.121Z"
        }
      },
      {
        "id": "SoundCloud_detected",
        "name": "default",
        "jsonPath": "activities/SoundCloud_default_detected.json",
        "spritePath": "activities/SoundCloud.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "SoundCloud.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.121Z"
        }
      },
      {
        "id": "Spareroom_detected",
        "name": "default",
        "jsonPath": "activities/Spareroom_default_detected.json",
        "spritePath": "activities/Spareroom.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Spareroom.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.121Z"
        }
      },
      {
        "id": "Spotify_detected",
        "name": "default",
        "jsonPath": "activities/Spotify_default_detected.json",
        "spritePath": "activities/Spotify.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Spotify.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.121Z"
        }
      },
      {
        "id": "Steam_detected",
        "name": "default",
        "jsonPath": "activities/Steam_default_detected.json",
        "spritePath": "activities/Steam.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Steam.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.124Z"
        }
      },
      {
        "id": "Tarjeta Transporte Madrid_detected",
        "name": "default",
        "jsonPath": "activities/Tarjeta Transporte Madrid_default_detected.json",
        "spritePath": "activities/Tarjeta Transporte Madrid.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Tarjeta Transporte Madrid.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.124Z"
        }
      },
      {
        "id": "Telegram_detected",
        "name": "default",
        "jsonPath": "activities/Telegram_default_detected.json",
        "spritePath": "activities/Telegram.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Telegram.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.125Z"
        }
      },
      {
        "id": "Terraria_detected",
        "name": "default",
        "jsonPath": "activities/Terraria_default_detected.json",
        "spritePath": "activities/Terraria.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Terraria.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.125Z"
        }
      },
      {
        "id": "Tfl Go_detected",
        "name": "default",
        "jsonPath": "activities/Tfl Go_default_detected.json",
        "spritePath": "activities/Tfl Go.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Tfl Go.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.125Z"
        }
      },
      {
        "id": "Tfl Oyster_detected",
        "name": "default",
        "jsonPath": "activities/Tfl Oyster_default_detected.json",
        "spritePath": "activities/Tfl Oyster.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Tfl Oyster.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.125Z"
        }
      },
      {
        "id": "TickTick_detected",
        "name": "default",
        "jsonPath": "activities/TickTick_default_detected.json",
        "spritePath": "activities/TickTick.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "TickTick.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.131Z"
        }
      },
      {
        "id": "TikTok_detected",
        "name": "default",
        "jsonPath": "activities/TikTok_default_detected.json",
        "spritePath": "activities/TikTok.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "TikTok.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.133Z"
        }
      },
      {
        "id": "Tinder_detected",
        "name": "default",
        "jsonPath": "activities/Tinder_default_detected.json",
        "spritePath": "activities/Tinder.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Tinder.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.134Z"
        }
      },
      {
        "id": "Todoist_detected",
        "name": "default",
        "jsonPath": "activities/Todoist_default_detected.json",
        "spritePath": "activities/Todoist.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Todoist.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.134Z"
        }
      },
      {
        "id": "Toggl Blue Icon_detected",
        "name": "default",
        "jsonPath": "activities/Toggl Blue Icon_default_detected.json",
        "spritePath": "activities/Toggl Blue Icon.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Toggl Blue Icon.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.135Z"
        }
      },
      {
        "id": "Toggl Hire_detected",
        "name": "default",
        "jsonPath": "activities/Toggl Hire_default_detected.json",
        "spritePath": "activities/Toggl Hire.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Toggl Hire.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.135Z"
        }
      },
      {
        "id": "Toggl Plan_detected",
        "name": "default",
        "jsonPath": "activities/Toggl Plan_default_detected.json",
        "spritePath": "activities/Toggl Plan.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Toggl Plan.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.139Z"
        }
      },
      {
        "id": "Toggl Track_detected",
        "name": "default",
        "jsonPath": "activities/Toggl Track_default_detected.json",
        "spritePath": "activities/Toggl Track.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Toggl Track.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.139Z"
        }
      },
      {
        "id": "Toggl_detected",
        "name": "default",
        "jsonPath": "activities/Toggl_default_detected.json",
        "spritePath": "activities/Toggl.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Toggl.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.139Z"
        }
      },
      {
        "id": "Trello v2_detected",
        "name": "default",
        "jsonPath": "activities/Trello v2_default_detected.json",
        "spritePath": "activities/Trello v2.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Trello v2.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.140Z"
        }
      },
      {
        "id": "Trello_detected",
        "name": "default",
        "jsonPath": "activities/Trello_default_detected.json",
        "spritePath": "activities/Trello.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Trello.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.140Z"
        }
      },
      {
        "id": "Tumblr_detected",
        "name": "default",
        "jsonPath": "activities/Tumblr_default_detected.json",
        "spritePath": "activities/Tumblr.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Tumblr.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.140Z"
        }
      },
      {
        "id": "Twitch_detected",
        "name": "default",
        "jsonPath": "activities/Twitch_default_detected.json",
        "spritePath": "activities/Twitch.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Twitch.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.140Z"
        }
      },
      {
        "id": "Twitter_detected",
        "name": "default",
        "jsonPath": "activities/Twitter_default_detected.json",
        "spritePath": "activities/Twitter.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Twitter.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.140Z"
        }
      },
      {
        "id": "Uber Eats_detected",
        "name": "default",
        "jsonPath": "activities/Uber Eats_default_detected.json",
        "spritePath": "activities/Uber Eats.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Uber Eats.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.141Z"
        }
      },
      {
        "id": "Uber_detected",
        "name": "default",
        "jsonPath": "activities/Uber_default_detected.json",
        "spritePath": "activities/Uber.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Uber.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.141Z"
        }
      },
      {
        "id": "Vitality GP_detected",
        "name": "default",
        "jsonPath": "activities/Vitality GP_default_detected.json",
        "spritePath": "activities/Vitality GP.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Vitality GP.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.141Z"
        }
      },
      {
        "id": "Vitality_detected",
        "name": "default",
        "jsonPath": "activities/Vitality_default_detected.json",
        "spritePath": "activities/Vitality.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Vitality.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.141Z"
        }
      },
      {
        "id": "Vivaldi_detected",
        "name": "default",
        "jsonPath": "activities/Vivaldi_default_detected.json",
        "spritePath": "activities/Vivaldi.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Vivaldi.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.142Z"
        }
      },
      {
        "id": "Vodafone_detected",
        "name": "default",
        "jsonPath": "activities/Vodafone_default_detected.json",
        "spritePath": "activities/Vodafone.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Vodafone.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.142Z"
        }
      },
      {
        "id": "Whatsapp_detected",
        "name": "default",
        "jsonPath": "activities/Whatsapp_default_detected.json",
        "spritePath": "activities/Whatsapp.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Whatsapp.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.151Z"
        }
      },
      {
        "id": "Wikipedia_detected",
        "name": "default",
        "jsonPath": "activities/Wikipedia_default_detected.json",
        "spritePath": "activities/Wikipedia.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Wikipedia.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.151Z"
        }
      },
      {
        "id": "WinRAR_detected",
        "name": "default",
        "jsonPath": "activities/WinRAR_default_detected.json",
        "spritePath": "activities/WinRAR.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "WinRAR.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.151Z"
        }
      },
      {
        "id": "Youtube_detected",
        "name": "default",
        "jsonPath": "activities/Youtube_default_detected.json",
        "spritePath": "activities/Youtube.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Youtube.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.152Z"
        }
      },
      {
        "id": "Zoom_detected",
        "name": "default",
        "jsonPath": "activities/Zoom_default_detected.json",
        "spritePath": "activities/Zoom.png",
        "metadata": {
          "name": "default",
          "frame_count": 25,
          "frame_size": [
            24,
            24
          ],
          "columns": 5,
          "rows": 5,
          "total_duration": 2000,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 24,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 72,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 24,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 72,
              "y": 96,
              "width": 24,
              "height": 24
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 24,
              "height": 24
            }
          ],
          "source_image": "Zoom.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.152Z"
        }
      }
    ],
    "staticSprites": [
      {
        "id": "ARZone",
        "name": "ARZone",
        "path": "activities/ARZone.png",
        "extension": ".png"
      },
      {
        "id": "Air Europa",
        "name": "Air Europa",
        "path": "activities/Air Europa.png",
        "extension": ".png"
      },
      {
        "id": "AirBnB",
        "name": "AirBnB",
        "path": "activities/AirBnB.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Prime",
        "name": "Amazon Prime",
        "path": "activities/Amazon Prime.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Shopping",
        "name": "Amazon Shopping",
        "path": "activities/Amazon Shopping.png",
        "extension": ".png"
      },
      {
        "id": "Amazon",
        "name": "Amazon",
        "path": "activities/Amazon.png",
        "extension": ".png"
      },
      {
        "id": "ArtStation",
        "name": "ArtStation",
        "path": "activities/ArtStation.png",
        "extension": ".png"
      },
      {
        "id": "Authy",
        "name": "Authy",
        "path": "activities/Authy.png",
        "extension": ".png"
      },
      {
        "id": "Battle",
        "name": "Battle",
        "path": "activities/Battle.png",
        "extension": ".png"
      },
      {
        "id": "Booking",
        "name": "Booking",
        "path": "activities/Booking.png",
        "extension": ".png"
      },
      {
        "id": "CityMapper",
        "name": "CityMapper",
        "path": "activities/CityMapper.png",
        "extension": ".png"
      },
      {
        "id": "Cuenta DNI",
        "name": "Cuenta DNI",
        "path": "activities/Cuenta DNI.png",
        "extension": ".png"
      },
      {
        "id": "Deliveroo",
        "name": "Deliveroo",
        "path": "activities/Deliveroo.png",
        "extension": ".png"
      },
      {
        "id": "Deviantart",
        "name": "Deviantart",
        "path": "activities/Deviantart.png",
        "extension": ".png"
      },
      {
        "id": "Discord",
        "name": "Discord",
        "path": "activities/Discord.png",
        "extension": ".png"
      },
      {
        "id": "Duolingo",
        "name": "Duolingo",
        "path": "activities/Duolingo.png",
        "extension": ".png"
      },
      {
        "id": "Evernote",
        "name": "Evernote",
        "path": "activities/Evernote.png",
        "extension": ".png"
      },
      {
        "id": "Express VPN",
        "name": "Express VPN",
        "path": "activities/Express VPN.png",
        "extension": ".png"
      },
      {
        "id": "Facebook Messenger",
        "name": "Facebook Messenger",
        "path": "activities/Facebook Messenger.png",
        "extension": ".png"
      },
      {
        "id": "Facebook",
        "name": "Facebook",
        "path": "activities/Facebook.png",
        "extension": ".png"
      },
      {
        "id": "Firefox",
        "name": "Firefox",
        "path": "activities/Firefox.png",
        "extension": ".png"
      },
      {
        "id": "FitBod",
        "name": "FitBod",
        "path": "activities/FitBod.png",
        "extension": ".png"
      },
      {
        "id": "Galaxy Store",
        "name": "Galaxy Store",
        "path": "activities/Galaxy Store.png",
        "extension": ".png"
      },
      {
        "id": "Glovo",
        "name": "Glovo",
        "path": "activities/Glovo.png",
        "extension": ".png"
      },
      {
        "id": "Gmail",
        "name": "Gmail",
        "path": "activities/Gmail.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator Old",
        "name": "Google Authentificator Old",
        "path": "activities/Google Authentificator Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator",
        "name": "Google Authentificator",
        "path": "activities/Google Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Google Calendar",
        "name": "Google Calendar",
        "path": "activities/Google Calendar.png",
        "extension": ".png"
      },
      {
        "id": "Google Chrome",
        "name": "Google Chrome",
        "path": "activities/Google Chrome.png",
        "extension": ".png"
      },
      {
        "id": "Google Currents",
        "name": "Google Currents",
        "path": "activities/Google Currents.png",
        "extension": ".png"
      },
      {
        "id": "Google Docs",
        "name": "Google Docs",
        "path": "activities/Google Docs.png",
        "extension": ".png"
      },
      {
        "id": "Google Drive",
        "name": "Google Drive",
        "path": "activities/Google Drive.png",
        "extension": ".png"
      },
      {
        "id": "Google Files",
        "name": "Google Files",
        "path": "activities/Google Files.png",
        "extension": ".png"
      },
      {
        "id": "Google Fit",
        "name": "Google Fit",
        "path": "activities/Google Fit.png",
        "extension": ".png"
      },
      {
        "id": "Google Forms",
        "name": "Google Forms",
        "path": "activities/Google Forms.png",
        "extension": ".png"
      },
      {
        "id": "Google Hangouts",
        "name": "Google Hangouts",
        "path": "activities/Google Hangouts.png",
        "extension": ".png"
      },
      {
        "id": "Google Keep",
        "name": "Google Keep",
        "path": "activities/Google Keep.png",
        "extension": ".png"
      },
      {
        "id": "Google Launcher",
        "name": "Google Launcher",
        "path": "activities/Google Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps Old",
        "name": "Google Maps Old",
        "path": "activities/Google Maps Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps",
        "name": "Google Maps",
        "path": "activities/Google Maps.png",
        "extension": ".png"
      },
      {
        "id": "Google Photos",
        "name": "Google Photos",
        "path": "activities/Google Photos.png",
        "extension": ".png"
      },
      {
        "id": "Google Playstore",
        "name": "Google Playstore",
        "path": "activities/Google Playstore.png",
        "extension": ".png"
      },
      {
        "id": "Google Podcasts",
        "name": "Google Podcasts",
        "path": "activities/Google Podcasts.png",
        "extension": ".png"
      },
      {
        "id": "Google Sheets",
        "name": "Google Sheets",
        "path": "activities/Google Sheets.png",
        "extension": ".png"
      },
      {
        "id": "Google Slides",
        "name": "Google Slides",
        "path": "activities/Google Slides.png",
        "extension": ".png"
      },
      {
        "id": "Google TV",
        "name": "Google TV",
        "path": "activities/Google TV.png",
        "extension": ".png"
      },
      {
        "id": "Google TalkBack",
        "name": "Google TalkBack",
        "path": "activities/Google TalkBack.png",
        "extension": ".png"
      },
      {
        "id": "Google Text to Speech",
        "name": "Google Text to Speech",
        "path": "activities/Google Text to Speech.png",
        "extension": ".png"
      },
      {
        "id": "Google Translate",
        "name": "Google Translate",
        "path": "activities/Google Translate.png",
        "extension": ".png"
      },
      {
        "id": "Google Wallet",
        "name": "Google Wallet",
        "path": "activities/Google Wallet.png",
        "extension": ".png"
      },
      {
        "id": "Google",
        "name": "Google",
        "path": "activities/Google.png",
        "extension": ".png"
      },
      {
        "id": "Idealista",
        "name": "Idealista",
        "path": "activities/Idealista.png",
        "extension": ".png"
      },
      {
        "id": "Instagram Old",
        "name": "Instagram Old",
        "path": "activities/Instagram Old.png",
        "extension": ".png"
      },
      {
        "id": "Instagram",
        "name": "Instagram",
        "path": "activities/Instagram.png",
        "extension": ".png"
      },
      {
        "id": "Itch io",
        "name": "Itch io",
        "path": "activities/Itch io.png",
        "extension": ".png"
      },
      {
        "id": "Ko Fi",
        "name": "Ko Fi",
        "path": "activities/Ko Fi.png",
        "extension": ".png"
      },
      {
        "id": "Letterboxd",
        "name": "Letterboxd",
        "path": "activities/Letterboxd.png",
        "extension": ".png"
      },
      {
        "id": "LinkedIn",
        "name": "LinkedIn",
        "path": "activities/LinkedIn.png",
        "extension": ".png"
      },
      {
        "id": "Lloyds Bank",
        "name": "Lloyds Bank",
        "path": "activities/Lloyds Bank.png",
        "extension": ".png"
      },
      {
        "id": "London Guide",
        "name": "London Guide",
        "path": "activities/London Guide.png",
        "extension": ".png"
      },
      {
        "id": "London Offline Map",
        "name": "London Offline Map",
        "path": "activities/London Offline Map.png",
        "extension": ".png"
      },
      {
        "id": "London Tube Map",
        "name": "London Tube Map",
        "path": "activities/London Tube Map.png",
        "extension": ".png"
      },
      {
        "id": "Mercadolibre",
        "name": "Mercadolibre",
        "path": "activities/Mercadolibre.png",
        "extension": ".png"
      },
      {
        "id": "Mercadopago",
        "name": "Mercadopago",
        "path": "activities/Mercadopago.png",
        "extension": ".png"
      },
      {
        "id": "Mi Argentina",
        "name": "Mi Argentina",
        "path": "activities/Mi Argentina.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Access",
        "name": "Microsoft Access",
        "path": "activities/Microsoft Access.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Authentificator",
        "name": "Microsoft Authentificator",
        "path": "activities/Microsoft Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Edge",
        "name": "Microsoft Edge",
        "path": "activities/Microsoft Edge.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Excel",
        "name": "Microsoft Excel",
        "path": "activities/Microsoft Excel.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Launcher",
        "name": "Microsoft Launcher",
        "path": "activities/Microsoft Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Link to Windows",
        "name": "Microsoft Link to Windows",
        "path": "activities/Microsoft Link to Windows.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Office",
        "name": "Microsoft Office",
        "path": "activities/Microsoft Office.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneDrive",
        "name": "Microsoft OneDrive",
        "path": "activities/Microsoft OneDrive.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneNote",
        "name": "Microsoft OneNote",
        "path": "activities/Microsoft OneNote.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft PowerPoint",
        "name": "Microsoft PowerPoint",
        "path": "activities/Microsoft PowerPoint.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Publisher",
        "name": "Microsoft Publisher",
        "path": "activities/Microsoft Publisher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft To Do",
        "name": "Microsoft To Do",
        "path": "activities/Microsoft To Do.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Word",
        "name": "Microsoft Word",
        "path": "activities/Microsoft Word.png",
        "extension": ".png"
      },
      {
        "id": "Miro",
        "name": "Miro",
        "path": "activities/Miro.png",
        "extension": ".png"
      },
      {
        "id": "Moj",
        "name": "Moj",
        "path": "activities/Moj.png",
        "extension": ".png"
      },
      {
        "id": "My Fitness Pal",
        "name": "My Fitness Pal",
        "path": "activities/My Fitness Pal.png",
        "extension": ".png"
      },
      {
        "id": "Netflix v2",
        "name": "Netflix v2",
        "path": "activities/Netflix v2.png",
        "extension": ".png"
      },
      {
        "id": "Netflix",
        "name": "Netflix",
        "path": "activities/Netflix.png",
        "extension": ".png"
      },
      {
        "id": "Notion",
        "name": "Notion",
        "path": "activities/Notion.png",
        "extension": ".png"
      },
      {
        "id": "Nova Launcher",
        "name": "Nova Launcher",
        "path": "activities/Nova Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Nuffield Health",
        "name": "Nuffield Health",
        "path": "activities/Nuffield Health.png",
        "extension": ".png"
      },
      {
        "id": "Opera",
        "name": "Opera",
        "path": "activities/Opera.png",
        "extension": ".png"
      },
      {
        "id": "Outlook",
        "name": "Outlook",
        "path": "activities/Outlook.png",
        "extension": ".png"
      },
      {
        "id": "Patreon",
        "name": "Patreon",
        "path": "activities/Patreon.png",
        "extension": ".png"
      },
      {
        "id": "PayPal",
        "name": "PayPal",
        "path": "activities/PayPal.png",
        "extension": ".png"
      },
      {
        "id": "PedidosYa",
        "name": "PedidosYa",
        "path": "activities/PedidosYa.png",
        "extension": ".png"
      },
      {
        "id": "Pikmin",
        "name": "Pikmin",
        "path": "activities/Pikmin.png",
        "extension": ".png"
      },
      {
        "id": "Pinterest",
        "name": "Pinterest",
        "path": "activities/Pinterest.png",
        "extension": ".png"
      },
      {
        "id": "Reddit",
        "name": "Reddit",
        "path": "activities/Reddit.png",
        "extension": ".png"
      },
      {
        "id": "Rubiks Cube",
        "name": "Rubiks Cube",
        "path": "activities/Rubiks Cube.png",
        "extension": ".png"
      },
      {
        "id": "Safari",
        "name": "Safari",
        "path": "activities/Safari.png",
        "extension": ".png"
      },
      {
        "id": "Samsung Free",
        "name": "Samsung Free",
        "path": "activities/Samsung Free.png",
        "extension": ".png"
      },
      {
        "id": "Santander",
        "name": "Santander",
        "path": "activities/Santander.png",
        "extension": ".png"
      },
      {
        "id": "Skype",
        "name": "Skype",
        "path": "activities/Skype.png",
        "extension": ".png"
      },
      {
        "id": "Slack v2",
        "name": "Slack v2",
        "path": "activities/Slack v2.png",
        "extension": ".png"
      },
      {
        "id": "Slack",
        "name": "Slack",
        "path": "activities/Slack.png",
        "extension": ".png"
      },
      {
        "id": "Snapchat",
        "name": "Snapchat",
        "path": "activities/Snapchat.png",
        "extension": ".png"
      },
      {
        "id": "SocioPlus",
        "name": "SocioPlus",
        "path": "activities/SocioPlus.png",
        "extension": ".png"
      },
      {
        "id": "SoundCloud",
        "name": "SoundCloud",
        "path": "activities/SoundCloud.png",
        "extension": ".png"
      },
      {
        "id": "Spareroom",
        "name": "Spareroom",
        "path": "activities/Spareroom.png",
        "extension": ".png"
      },
      {
        "id": "Spotify",
        "name": "Spotify",
        "path": "activities/Spotify.png",
        "extension": ".png"
      },
      {
        "id": "Steam",
        "name": "Steam",
        "path": "activities/Steam.png",
        "extension": ".png"
      },
      {
        "id": "Tarjeta Transporte Madrid",
        "name": "Tarjeta Transporte Madrid",
        "path": "activities/Tarjeta Transporte Madrid.png",
        "extension": ".png"
      },
      {
        "id": "Telegram",
        "name": "Telegram",
        "path": "activities/Telegram.png",
        "extension": ".png"
      },
      {
        "id": "Terraria",
        "name": "Terraria",
        "path": "activities/Terraria.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Go",
        "name": "Tfl Go",
        "path": "activities/Tfl Go.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Oyster",
        "name": "Tfl Oyster",
        "path": "activities/Tfl Oyster.png",
        "extension": ".png"
      },
      {
        "id": "TickTick",
        "name": "TickTick",
        "path": "activities/TickTick.png",
        "extension": ".png"
      },
      {
        "id": "TikTok",
        "name": "TikTok",
        "path": "activities/TikTok.png",
        "extension": ".png"
      },
      {
        "id": "Tinder",
        "name": "Tinder",
        "path": "activities/Tinder.png",
        "extension": ".png"
      },
      {
        "id": "Todoist",
        "name": "Todoist",
        "path": "activities/Todoist.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Blue Icon",
        "name": "Toggl Blue Icon",
        "path": "activities/Toggl Blue Icon.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Hire",
        "name": "Toggl Hire",
        "path": "activities/Toggl Hire.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Plan",
        "name": "Toggl Plan",
        "path": "activities/Toggl Plan.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Track",
        "name": "Toggl Track",
        "path": "activities/Toggl Track.png",
        "extension": ".png"
      },
      {
        "id": "Toggl",
        "name": "Toggl",
        "path": "activities/Toggl.png",
        "extension": ".png"
      },
      {
        "id": "Trello v2",
        "name": "Trello v2",
        "path": "activities/Trello v2.png",
        "extension": ".png"
      },
      {
        "id": "Trello",
        "name": "Trello",
        "path": "activities/Trello.png",
        "extension": ".png"
      },
      {
        "id": "Tumblr",
        "name": "Tumblr",
        "path": "activities/Tumblr.png",
        "extension": ".png"
      },
      {
        "id": "Twitch",
        "name": "Twitch",
        "path": "activities/Twitch.png",
        "extension": ".png"
      },
      {
        "id": "Twitter",
        "name": "Twitter",
        "path": "activities/Twitter.png",
        "extension": ".png"
      },
      {
        "id": "Uber Eats",
        "name": "Uber Eats",
        "path": "activities/Uber Eats.png",
        "extension": ".png"
      },
      {
        "id": "Uber",
        "name": "Uber",
        "path": "activities/Uber.png",
        "extension": ".png"
      },
      {
        "id": "Vitality GP",
        "name": "Vitality GP",
        "path": "activities/Vitality GP.png",
        "extension": ".png"
      },
      {
        "id": "Vitality",
        "name": "Vitality",
        "path": "activities/Vitality.png",
        "extension": ".png"
      },
      {
        "id": "Vivaldi",
        "name": "Vivaldi",
        "path": "activities/Vivaldi.png",
        "extension": ".png"
      },
      {
        "id": "Vodafone",
        "name": "Vodafone",
        "path": "activities/Vodafone.png",
        "extension": ".png"
      },
      {
        "id": "Whatsapp",
        "name": "Whatsapp",
        "path": "activities/Whatsapp.png",
        "extension": ".png"
      },
      {
        "id": "Wikipedia",
        "name": "Wikipedia",
        "path": "activities/Wikipedia.png",
        "extension": ".png"
      },
      {
        "id": "WinRAR",
        "name": "WinRAR",
        "path": "activities/WinRAR.png",
        "extension": ".png"
      },
      {
        "id": "Youtube",
        "name": "Youtube",
        "path": "activities/Youtube.png",
        "extension": ".png"
      },
      {
        "id": "Zoom",
        "name": "Zoom",
        "path": "activities/Zoom.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 274
  },
  "ambient": {
    "name": "ambient",
    "path": "ambient",
    "animations": [],
    "staticSprites": [
      {
        "id": "Banner_Stick_1_Purple",
        "name": "Banner Stick 1 Purple",
        "path": "ambient/Banner_Stick_1_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Barrel_Small_Empty",
        "name": "Barrel Small Empty",
        "path": "ambient/Barrel_Small_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Basket_Empty",
        "name": "Basket Empty",
        "path": "ambient/Basket_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Bench_1",
        "name": "Bench 1",
        "path": "ambient/Bench_1.png",
        "extension": ".png"
      },
      {
        "id": "Bench_3",
        "name": "Bench 3",
        "path": "ambient/Bench_3.png",
        "extension": ".png"
      },
      {
        "id": "BulletinBoard_1",
        "name": "BulletinBoard 1",
        "path": "ambient/BulletinBoard_1.png",
        "extension": ".png"
      },
      {
        "id": "Chest",
        "name": "Chest",
        "path": "ambient/Chest.png",
        "extension": ".png"
      },
      {
        "id": "Chopped_Tree_1",
        "name": "Chopped Tree 1",
        "path": "ambient/Chopped_Tree_1.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Large_Empty",
        "name": "Crate Large Empty",
        "path": "ambient/Crate_Large_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Medium_Closed",
        "name": "Crate Medium Closed",
        "path": "ambient/Crate_Medium_Closed.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Water_1",
        "name": "Crate Water 1",
        "path": "ambient/Crate_Water_1.png",
        "extension": ".png"
      },
      {
        "id": "Fireplace_1",
        "name": "Fireplace 1",
        "path": "ambient/Fireplace_1.png",
        "extension": ".png"
      },
      {
        "id": "HayStack_2",
        "name": "HayStack 2",
        "path": "ambient/HayStack_2.png",
        "extension": ".png"
      },
      {
        "id": "LampPost_3",
        "name": "LampPost 3",
        "path": "ambient/LampPost_3.png",
        "extension": ".png"
      },
      {
        "id": "Plant_2",
        "name": "Plant 2",
        "path": "ambient/Plant_2.png",
        "extension": ".png"
      },
      {
        "id": "Sack_3",
        "name": "Sack 3",
        "path": "ambient/Sack_3.png",
        "extension": ".png"
      },
      {
        "id": "Sign_1",
        "name": "Sign 1",
        "path": "ambient/Sign_1.png",
        "extension": ".png"
      },
      {
        "id": "Sign_2",
        "name": "Sign 2",
        "path": "ambient/Sign_2.png",
        "extension": ".png"
      },
      {
        "id": "Table_Medium_1",
        "name": "Table Medium 1",
        "path": "ambient/Table_Medium_1.png",
        "extension": ".png"
      },
      {
        "id": "basuras1",
        "name": "basuras1",
        "path": "ambient/basuras1.png",
        "extension": ".png"
      },
      {
        "id": "basuras2",
        "name": "basuras2",
        "path": "ambient/basuras2.png",
        "extension": ".png"
      },
      {
        "id": "basuras3",
        "name": "basuras3",
        "path": "ambient/basuras3.png",
        "extension": ".png"
      },
      {
        "id": "basuras4",
        "name": "basuras4",
        "path": "ambient/basuras4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle1",
        "name": "basuras calle1",
        "path": "ambient/basuras_calle1.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle2",
        "name": "basuras calle2",
        "path": "ambient/basuras_calle2.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle3",
        "name": "basuras calle3",
        "path": "ambient/basuras_calle3.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle4",
        "name": "basuras calle4",
        "path": "ambient/basuras_calle4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle5",
        "name": "basuras calle5",
        "path": "ambient/basuras_calle5.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle6",
        "name": "basuras calle6",
        "path": "ambient/basuras_calle6.png",
        "extension": ".png"
      },
      {
        "id": "botellas1",
        "name": "botellas1",
        "path": "ambient/botellas1.png",
        "extension": ".png"
      },
      {
        "id": "botellas2",
        "name": "botellas2",
        "path": "ambient/botellas2.png",
        "extension": ".png"
      },
      {
        "id": "botellas3",
        "name": "botellas3",
        "path": "ambient/botellas3.png",
        "extension": ".png"
      },
      {
        "id": "cajas1",
        "name": "cajas1",
        "path": "ambient/cajas1.png",
        "extension": ".png"
      },
      {
        "id": "cajas2",
        "name": "cajas2",
        "path": "ambient/cajas2.png",
        "extension": ".png"
      },
      {
        "id": "cajas3",
        "name": "cajas3",
        "path": "ambient/cajas3.png",
        "extension": ".png"
      },
      {
        "id": "lamparas1",
        "name": "lamparas1",
        "path": "ambient/lamparas1.png",
        "extension": ".png"
      },
      {
        "id": "lamparas2",
        "name": "lamparas2",
        "path": "ambient/lamparas2.png",
        "extension": ".png"
      },
      {
        "id": "lamparas3",
        "name": "lamparas3",
        "path": "ambient/lamparas3.png",
        "extension": ".png"
      },
      {
        "id": "poste1",
        "name": "poste1",
        "path": "ambient/poste1.png",
        "extension": ".png"
      },
      {
        "id": "poste2",
        "name": "poste2",
        "path": "ambient/poste2.png",
        "extension": ".png"
      },
      {
        "id": "poste3",
        "name": "poste3",
        "path": "ambient/poste3.png",
        "extension": ".png"
      },
      {
        "id": "poste4",
        "name": "poste4",
        "path": "ambient/poste4.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas1",
        "name": "ropas tendidas1",
        "path": "ambient/ropas_tendidas1.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas2",
        "name": "ropas tendidas2",
        "path": "ambient/ropas_tendidas2.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas3",
        "name": "ropas tendidas3",
        "path": "ambient/ropas_tendidas3.png",
        "extension": ".png"
      },
      {
        "id": "silla",
        "name": "silla",
        "path": "ambient/silla.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle1",
        "name": "sillas de calle1",
        "path": "ambient/sillas_de_calle1.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle2",
        "name": "sillas de calle2",
        "path": "ambient/sillas_de_calle2.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle3",
        "name": "sillas de calle3",
        "path": "ambient/sillas_de_calle3.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle4",
        "name": "sillas de calle4",
        "path": "ambient/sillas_de_calle4.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla1",
        "name": "sombrilla1",
        "path": "ambient/sombrilla1.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla2",
        "name": "sombrilla2",
        "path": "ambient/sombrilla2.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla3",
        "name": "sombrilla3",
        "path": "ambient/sombrilla3.png",
        "extension": ".png"
      },
      {
        "id": "tile_0533_suelo_piedra",
        "name": "tile 0533 suelo piedra",
        "path": "ambient/tile_0533_suelo_piedra.png",
        "extension": ".png"
      },
      {
        "id": "tile_0542_tejado",
        "name": "tile 0542 tejado",
        "path": "ambient/tile_0542_tejado.png",
        "extension": ".png"
      },
      {
        "id": "tile_0545_suelo_piedra",
        "name": "tile 0545 suelo piedra",
        "path": "ambient/tile_0545_suelo_piedra.png",
        "extension": ".png"
      },
      {
        "id": "tile_0546_suelo_cesped",
        "name": "tile 0546 suelo cesped",
        "path": "ambient/tile_0546_suelo_cesped.png",
        "extension": ".png"
      },
      {
        "id": "tile_0547_suelo_arena",
        "name": "tile 0547 suelo arena",
        "path": "ambient/tile_0547_suelo_arena.png",
        "extension": ".png"
      },
      {
        "id": "tile_0548_suelo_tierra",
        "name": "tile 0548 suelo tierra",
        "path": "ambient/tile_0548_suelo_tierra.png",
        "extension": ".png"
      },
      {
        "id": "ventana1",
        "name": "ventana1",
        "path": "ambient/ventana1.png",
        "extension": ".png"
      },
      {
        "id": "ventana10",
        "name": "ventana10",
        "path": "ambient/ventana10.png",
        "extension": ".png"
      },
      {
        "id": "ventana11",
        "name": "ventana11",
        "path": "ambient/ventana11.png",
        "extension": ".png"
      },
      {
        "id": "ventana12",
        "name": "ventana12",
        "path": "ambient/ventana12.png",
        "extension": ".png"
      },
      {
        "id": "ventana13",
        "name": "ventana13",
        "path": "ambient/ventana13.png",
        "extension": ".png"
      },
      {
        "id": "ventana2",
        "name": "ventana2",
        "path": "ambient/ventana2.png",
        "extension": ".png"
      },
      {
        "id": "ventana3",
        "name": "ventana3",
        "path": "ambient/ventana3.png",
        "extension": ".png"
      },
      {
        "id": "ventana4",
        "name": "ventana4",
        "path": "ambient/ventana4.png",
        "extension": ".png"
      },
      {
        "id": "ventana5",
        "name": "ventana5",
        "path": "ambient/ventana5.png",
        "extension": ".png"
      },
      {
        "id": "ventana6",
        "name": "ventana6",
        "path": "ambient/ventana6.png",
        "extension": ".png"
      },
      {
        "id": "ventana7",
        "name": "ventana7",
        "path": "ambient/ventana7.png",
        "extension": ".png"
      },
      {
        "id": "ventana8",
        "name": "ventana8",
        "path": "ambient/ventana8.png",
        "extension": ".png"
      },
      {
        "id": "ventana9",
        "name": "ventana9",
        "path": "ambient/ventana9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 72
  },
  "animations": {
    "name": "animations",
    "path": "animations",
    "animations": [
      {
        "id": "entidad_circulo_dying",
        "name": "sparkle",
        "jsonPath": "animations/entities/entidad_circulo_dying_anim.json",
        "spritePath": "animations/entities/entidad_circulo_dying_anim.png",
        "metadata": {
          "name": "sparkle",
          "frame_count": 20,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 3,
          "total_duration": 2400,
          "loop": true,
          "frames": [
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            }
          ]
        }
      },
      {
        "id": "entidad_circulo_happy",
        "name": "pulse",
        "jsonPath": "animations/entities/entidad_circulo_happy_anim.json",
        "spritePath": "animations/entities/entidad_circulo_happy_anim.png",
        "metadata": {
          "name": "pulse",
          "frame_count": 12,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 960,
          "loop": true,
          "frames": [
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            }
          ]
        }
      },
      {
        "id": "entidad_circulo_sad",
        "name": "floating",
        "jsonPath": "animations/entities/entidad_circulo_sad_anim.json",
        "spritePath": "animations/entities/entidad_circulo_sad_anim.png",
        "metadata": {
          "name": "floating",
          "frame_count": 16,
          "frame_size": [
            32,
            34
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 1600,
          "loop": true,
          "frames": [
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            }
          ]
        }
      },
      {
        "id": "entidad_square_dying",
        "name": "sparkle",
        "jsonPath": "animations/entities/entidad_square_dying_anim.json",
        "spritePath": "animations/entities/entidad_square_dying_anim.png",
        "metadata": {
          "name": "sparkle",
          "frame_count": 20,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 3,
          "total_duration": 2400,
          "loop": true,
          "frames": [
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            },
            {
              "duration": 120
            }
          ]
        }
      },
      {
        "id": "entidad_square_happy",
        "name": "pulse",
        "jsonPath": "animations/entities/entidad_square_happy_anim.json",
        "spritePath": "animations/entities/entidad_square_happy_anim.png",
        "metadata": {
          "name": "pulse",
          "frame_count": 12,
          "frame_size": [
            32,
            32
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 960,
          "loop": true,
          "frames": [
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            },
            {
              "duration": 80
            }
          ]
        }
      },
      {
        "id": "entidad_square_sad",
        "name": "floating",
        "jsonPath": "animations/entities/entidad_square_sad_anim.json",
        "spritePath": "animations/entities/entidad_square_sad_anim.png",
        "metadata": {
          "name": "floating",
          "frame_count": 16,
          "frame_size": [
            32,
            34
          ],
          "columns": 8,
          "rows": 2,
          "total_duration": 1600,
          "loop": true,
          "frames": [
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            },
            {
              "duration": 100
            }
          ]
        }
      }
    ],
    "staticSprites": [
      {
        "id": "Baby Chicken Yellow",
        "name": "Baby Chicken Yellow",
        "path": "animations/Baby Chicken Yellow.png",
        "extension": ".png"
      },
      {
        "id": "Boar",
        "name": "Boar",
        "path": "animations/Boar.png",
        "extension": ".png"
      },
      {
        "id": "Campfire",
        "name": "Campfire",
        "path": "animations/Campfire.png",
        "extension": ".png"
      },
      {
        "id": "Chick",
        "name": "Chick",
        "path": "animations/Chick.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Blonde  Green",
        "name": "Chicken Blonde  Green",
        "path": "animations/Chicken Blonde  Green.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Red",
        "name": "Chicken Red",
        "path": "animations/Chicken Red.png",
        "extension": ".png"
      },
      {
        "id": "Chicken",
        "name": "Chicken",
        "path": "animations/Chicken.png",
        "extension": ".png"
      },
      {
        "id": "Female Cow Brown",
        "name": "Female Cow Brown",
        "path": "animations/Female Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_Red",
        "name": "Flowers Red",
        "path": "animations/Flowers_Red.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_White",
        "name": "Flowers White",
        "path": "animations/Flowers_White.png",
        "extension": ".png"
      },
      {
        "id": "HornedSheep",
        "name": "HornedSheep",
        "path": "animations/HornedSheep.png",
        "extension": ".png"
      },
      {
        "id": "Horse(32x32)",
        "name": "Horse(32x32)",
        "path": "animations/Horse(32x32).png",
        "extension": ".png"
      },
      {
        "id": "Idle",
        "name": "Idle",
        "path": "animations/Idle.png",
        "extension": ".png"
      },
      {
        "id": "Male Cow Brown",
        "name": "Male Cow Brown",
        "path": "animations/Male Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "MarineAnimals",
        "name": "MarineAnimals",
        "path": "animations/MarineAnimals.png",
        "extension": ".png"
      },
      {
        "id": "Pig",
        "name": "Pig",
        "path": "animations/Pig.png",
        "extension": ".png"
      },
      {
        "id": "Sheep",
        "name": "Sheep",
        "path": "animations/Sheep.png",
        "extension": ".png"
      },
      {
        "id": "Walk",
        "name": "Walk",
        "path": "animations/Walk.png",
        "extension": ".png"
      },
      {
        "id": "entidad_circulo_happy",
        "name": "entidad circulo happy",
        "path": "animations/entities/entidad_circulo_happy.png",
        "extension": ".png"
      }
    ],
    "subfolders": {
      "entities": {
        "name": "entities",
        "path": "animations/entities",
        "animations": [
          {
            "id": "entidad_circulo_dying",
            "name": "sparkle",
            "jsonPath": "animations/entities/entidad_circulo_dying_anim.json",
            "spritePath": "animations/entities/entidad_circulo_dying_anim.png",
            "metadata": {
              "name": "sparkle",
              "frame_count": 20,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 3,
              "total_duration": 2400,
              "loop": true,
              "frames": [
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                }
              ]
            }
          },
          {
            "id": "entidad_circulo_happy",
            "name": "pulse",
            "jsonPath": "animations/entities/entidad_circulo_happy_anim.json",
            "spritePath": "animations/entities/entidad_circulo_happy_anim.png",
            "metadata": {
              "name": "pulse",
              "frame_count": 12,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 960,
              "loop": true,
              "frames": [
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                }
              ]
            }
          },
          {
            "id": "entidad_circulo_sad",
            "name": "floating",
            "jsonPath": "animations/entities/entidad_circulo_sad_anim.json",
            "spritePath": "animations/entities/entidad_circulo_sad_anim.png",
            "metadata": {
              "name": "floating",
              "frame_count": 16,
              "frame_size": [
                32,
                34
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 1600,
              "loop": true,
              "frames": [
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                }
              ]
            }
          },
          {
            "id": "entidad_square_dying",
            "name": "sparkle",
            "jsonPath": "animations/entities/entidad_square_dying_anim.json",
            "spritePath": "animations/entities/entidad_square_dying_anim.png",
            "metadata": {
              "name": "sparkle",
              "frame_count": 20,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 3,
              "total_duration": 2400,
              "loop": true,
              "frames": [
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                },
                {
                  "duration": 120
                }
              ]
            }
          },
          {
            "id": "entidad_square_happy",
            "name": "pulse",
            "jsonPath": "animations/entities/entidad_square_happy_anim.json",
            "spritePath": "animations/entities/entidad_square_happy_anim.png",
            "metadata": {
              "name": "pulse",
              "frame_count": 12,
              "frame_size": [
                32,
                32
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 960,
              "loop": true,
              "frames": [
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                },
                {
                  "duration": 80
                }
              ]
            }
          },
          {
            "id": "entidad_square_sad",
            "name": "floating",
            "jsonPath": "animations/entities/entidad_square_sad_anim.json",
            "spritePath": "animations/entities/entidad_square_sad_anim.png",
            "metadata": {
              "name": "floating",
              "frame_count": 16,
              "frame_size": [
                32,
                34
              ],
              "columns": 8,
              "rows": 2,
              "total_duration": 1600,
              "loop": true,
              "frames": [
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                },
                {
                  "duration": 100
                }
              ]
            }
          }
        ],
        "staticSprites": [
          {
            "id": "entidad_circulo_happy",
            "name": "entidad circulo happy",
            "path": "animations/entities/entidad_circulo_happy.png",
            "extension": ".png"
          }
        ],
        "totalAssets": 7
      }
    },
    "totalAssets": 25
  },
  "buildings": {
    "name": "buildings",
    "path": "buildings",
    "animations": [
      {
        "id": "CityWall_Gate_1_detected",
        "name": "default",
        "jsonPath": "buildings/CityWall_Gate_1_default_detected.json",
        "spritePath": "buildings/CityWall_Gate_1.png",
        "metadata": {
          "name": "default",
          "frame_count": 30,
          "frame_size": [
            16,
            16
          ],
          "columns": 5,
          "rows": 6,
          "total_duration": 2400,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 80,
              "width": 16,
              "height": 16
            }
          ],
          "source_image": "CityWall_Gate_1.png",
          "detected_automatically": true,
          "detection_confidence": 35,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.153Z"
        }
      },
      {
        "id": "Fences_detected",
        "name": "default",
        "jsonPath": "buildings/Fences_default_detected.json",
        "spritePath": "buildings/Fences.png",
        "metadata": {
          "name": "default",
          "frame_count": 16,
          "frame_size": [
            16,
            16
          ],
          "columns": 4,
          "rows": 4,
          "total_duration": 1280,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 16,
              "height": 16
            }
          ],
          "source_image": "Fences.png",
          "detected_automatically": true,
          "detection_confidence": 55,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.154Z"
        }
      },
      {
        "id": "House_Hay_4_Purple_detected",
        "name": "default",
        "jsonPath": "buildings/House_Hay_4_Purple_default_detected.json",
        "spritePath": "buildings/House_Hay_4_Purple.png",
        "metadata": {
          "name": "default",
          "frame_count": 64,
          "frame_size": [
            16,
            16
          ],
          "columns": 8,
          "rows": 8,
          "total_duration": 5120,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 80,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 96,
              "y": 112,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 112,
              "y": 112,
              "width": 16,
              "height": 16
            }
          ],
          "source_image": "House_Hay_4_Purple.png",
          "detected_automatically": true,
          "detection_confidence": 55,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.154Z"
        }
      },
      {
        "id": "House_detected",
        "name": "default",
        "jsonPath": "buildings/House_default_detected.json",
        "spritePath": "buildings/House.png",
        "metadata": {
          "name": "default",
          "frame_count": 35,
          "frame_size": [
            16,
            16
          ],
          "columns": 5,
          "rows": 7,
          "total_duration": 2800,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 80,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 96,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 64,
              "y": 96,
              "width": 16,
              "height": 16
            }
          ],
          "source_image": "House.png",
          "detected_automatically": true,
          "detection_confidence": 35,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.154Z"
        }
      }
    ],
    "staticSprites": [
      {
        "id": "CityWall_Gate_1",
        "name": "CityWall Gate 1",
        "path": "buildings/CityWall_Gate_1.png",
        "extension": ".png"
      },
      {
        "id": "Fences",
        "name": "Fences",
        "path": "buildings/Fences.png",
        "extension": ".png"
      },
      {
        "id": "House",
        "name": "House",
        "path": "buildings/House.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_1",
        "name": "House Hay 1",
        "path": "buildings/House_Hay_1.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_2",
        "name": "House Hay 2",
        "path": "buildings/House_Hay_2.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_3",
        "name": "House Hay 3",
        "path": "buildings/House_Hay_3.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_4_Purple",
        "name": "House Hay 4 Purple",
        "path": "buildings/House_Hay_4_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Well_Hay_1",
        "name": "Well Hay 1",
        "path": "buildings/Well_Hay_1.png",
        "extension": ".png"
      },
      {
        "id": "muros1",
        "name": "muros1",
        "path": "buildings/muros1.png",
        "extension": ".png"
      },
      {
        "id": "muros2",
        "name": "muros2",
        "path": "buildings/muros2.png",
        "extension": ".png"
      },
      {
        "id": "muros3",
        "name": "muros3",
        "path": "buildings/muros3.png",
        "extension": ".png"
      },
      {
        "id": "vidrio",
        "name": "vidrio",
        "path": "buildings/vidrio.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 16
  },
  "dialogs": {
    "name": "dialogs",
    "path": "dialogs",
    "animations": [],
    "staticSprites": [],
    "totalAssets": 0
  },
  "food": {
    "name": "food",
    "path": "food",
    "animations": [],
    "staticSprites": [
      {
        "id": "01_dish",
        "name": "01 dish",
        "path": "food/01_dish.png",
        "extension": ".png"
      },
      {
        "id": "02_dish_2",
        "name": "02 dish 2",
        "path": "food/02_dish_2.png",
        "extension": ".png"
      },
      {
        "id": "03_dish_pile",
        "name": "03 dish pile",
        "path": "food/03_dish_pile.png",
        "extension": ".png"
      },
      {
        "id": "04_bowl",
        "name": "04 bowl",
        "path": "food/04_bowl.png",
        "extension": ".png"
      },
      {
        "id": "05_apple_pie",
        "name": "05 apple pie",
        "path": "food/05_apple_pie.png",
        "extension": ".png"
      },
      {
        "id": "06_apple_pie_dish",
        "name": "06 apple pie dish",
        "path": "food/06_apple_pie_dish.png",
        "extension": ".png"
      },
      {
        "id": "07_bread",
        "name": "07 bread",
        "path": "food/07_bread.png",
        "extension": ".png"
      },
      {
        "id": "08_bread_dish",
        "name": "08 bread dish",
        "path": "food/08_bread_dish.png",
        "extension": ".png"
      },
      {
        "id": "09_baguette",
        "name": "09 baguette",
        "path": "food/09_baguette.png",
        "extension": ".png"
      },
      {
        "id": "100_taco_dish",
        "name": "100 taco dish",
        "path": "food/100_taco_dish.png",
        "extension": ".png"
      },
      {
        "id": "101_waffle",
        "name": "101 waffle",
        "path": "food/101_waffle.png",
        "extension": ".png"
      },
      {
        "id": "102_waffle_dish",
        "name": "102 waffle dish",
        "path": "food/102_waffle_dish.png",
        "extension": ".png"
      },
      {
        "id": "10_baguette_dish",
        "name": "10 baguette dish",
        "path": "food/10_baguette_dish.png",
        "extension": ".png"
      },
      {
        "id": "11_bun",
        "name": "11 bun",
        "path": "food/11_bun.png",
        "extension": ".png"
      },
      {
        "id": "12_bun_dish",
        "name": "12 bun dish",
        "path": "food/12_bun_dish.png",
        "extension": ".png"
      },
      {
        "id": "13_bacon",
        "name": "13 bacon",
        "path": "food/13_bacon.png",
        "extension": ".png"
      },
      {
        "id": "14_bacon_dish",
        "name": "14 bacon dish",
        "path": "food/14_bacon_dish.png",
        "extension": ".png"
      },
      {
        "id": "15_burger",
        "name": "15 burger",
        "path": "food/15_burger.png",
        "extension": ".png"
      },
      {
        "id": "16_burger_dish",
        "name": "16 burger dish",
        "path": "food/16_burger_dish.png",
        "extension": ".png"
      },
      {
        "id": "17_burger_napkin",
        "name": "17 burger napkin",
        "path": "food/17_burger_napkin.png",
        "extension": ".png"
      },
      {
        "id": "18_burrito",
        "name": "18 burrito",
        "path": "food/18_burrito.png",
        "extension": ".png"
      },
      {
        "id": "19_burrito_dish",
        "name": "19 burrito dish",
        "path": "food/19_burrito_dish.png",
        "extension": ".png"
      },
      {
        "id": "20_bagel",
        "name": "20 bagel",
        "path": "food/20_bagel.png",
        "extension": ".png"
      },
      {
        "id": "21_bagel_dish",
        "name": "21 bagel dish",
        "path": "food/21_bagel_dish.png",
        "extension": ".png"
      },
      {
        "id": "22_cheesecake",
        "name": "22 cheesecake",
        "path": "food/22_cheesecake.png",
        "extension": ".png"
      },
      {
        "id": "23_cheesecake_dish",
        "name": "23 cheesecake dish",
        "path": "food/23_cheesecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "24_cheesepuff",
        "name": "24 cheesepuff",
        "path": "food/24_cheesepuff.png",
        "extension": ".png"
      },
      {
        "id": "25_cheesepuff_bowl",
        "name": "25 cheesepuff bowl",
        "path": "food/25_cheesepuff_bowl.png",
        "extension": ".png"
      },
      {
        "id": "26_chocolate",
        "name": "26 chocolate",
        "path": "food/26_chocolate.png",
        "extension": ".png"
      },
      {
        "id": "27_chocolate_dish",
        "name": "27 chocolate dish",
        "path": "food/27_chocolate_dish.png",
        "extension": ".png"
      },
      {
        "id": "28_cookies",
        "name": "28 cookies",
        "path": "food/28_cookies.png",
        "extension": ".png"
      },
      {
        "id": "29_cookies_dish",
        "name": "29 cookies dish",
        "path": "food/29_cookies_dish.png",
        "extension": ".png"
      },
      {
        "id": "30_chocolatecake",
        "name": "30 chocolatecake",
        "path": "food/30_chocolatecake.png",
        "extension": ".png"
      },
      {
        "id": "31_chocolatecake_dish",
        "name": "31 chocolatecake dish",
        "path": "food/31_chocolatecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "32_curry",
        "name": "32 curry",
        "path": "food/32_curry.png",
        "extension": ".png"
      },
      {
        "id": "33_curry_dish",
        "name": "33 curry dish",
        "path": "food/33_curry_dish.png",
        "extension": ".png"
      },
      {
        "id": "34_donut",
        "name": "34 donut",
        "path": "food/34_donut.png",
        "extension": ".png"
      },
      {
        "id": "35_donut_dish",
        "name": "35 donut dish",
        "path": "food/35_donut_dish.png",
        "extension": ".png"
      },
      {
        "id": "36_dumplings",
        "name": "36 dumplings",
        "path": "food/36_dumplings.png",
        "extension": ".png"
      },
      {
        "id": "37_dumplings_dish",
        "name": "37 dumplings dish",
        "path": "food/37_dumplings_dish.png",
        "extension": ".png"
      },
      {
        "id": "38_friedegg",
        "name": "38 friedegg",
        "path": "food/38_friedegg.png",
        "extension": ".png"
      },
      {
        "id": "39_friedegg_dish",
        "name": "39 friedegg dish",
        "path": "food/39_friedegg_dish.png",
        "extension": ".png"
      },
      {
        "id": "40_eggsalad",
        "name": "40 eggsalad",
        "path": "food/40_eggsalad.png",
        "extension": ".png"
      },
      {
        "id": "41_eggsalad_bowl",
        "name": "41 eggsalad bowl",
        "path": "food/41_eggsalad_bowl.png",
        "extension": ".png"
      },
      {
        "id": "42_eggtart",
        "name": "42 eggtart",
        "path": "food/42_eggtart.png",
        "extension": ".png"
      },
      {
        "id": "43_eggtart_dish",
        "name": "43 eggtart dish",
        "path": "food/43_eggtart_dish.png",
        "extension": ".png"
      },
      {
        "id": "44_frenchfries",
        "name": "44 frenchfries",
        "path": "food/44_frenchfries.png",
        "extension": ".png"
      },
      {
        "id": "45_frenchfries_dish",
        "name": "45 frenchfries dish",
        "path": "food/45_frenchfries_dish.png",
        "extension": ".png"
      },
      {
        "id": "46_fruitcake",
        "name": "46 fruitcake",
        "path": "food/46_fruitcake.png",
        "extension": ".png"
      },
      {
        "id": "47_fruitcake_dish",
        "name": "47 fruitcake dish",
        "path": "food/47_fruitcake_dish.png",
        "extension": ".png"
      },
      {
        "id": "48_garlicbread",
        "name": "48 garlicbread",
        "path": "food/48_garlicbread.png",
        "extension": ".png"
      },
      {
        "id": "49_garlicbread_dish",
        "name": "49 garlicbread dish",
        "path": "food/49_garlicbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "50_giantgummybear",
        "name": "50 giantgummybear",
        "path": "food/50_giantgummybear.png",
        "extension": ".png"
      },
      {
        "id": "51_giantgummybear_dish",
        "name": "51 giantgummybear dish",
        "path": "food/51_giantgummybear_dish.png",
        "extension": ".png"
      },
      {
        "id": "52_gingerbreadman",
        "name": "52 gingerbreadman",
        "path": "food/52_gingerbreadman.png",
        "extension": ".png"
      },
      {
        "id": "53_gingerbreadman_dish",
        "name": "53 gingerbreadman dish",
        "path": "food/53_gingerbreadman_dish.png",
        "extension": ".png"
      },
      {
        "id": "54_hotdog",
        "name": "54 hotdog",
        "path": "food/54_hotdog.png",
        "extension": ".png"
      },
      {
        "id": "55_hotdog_sauce",
        "name": "55 hotdog sauce",
        "path": "food/55_hotdog_sauce.png",
        "extension": ".png"
      },
      {
        "id": "56_hotdog_dish",
        "name": "56 hotdog dish",
        "path": "food/56_hotdog_dish.png",
        "extension": ".png"
      },
      {
        "id": "57_icecream",
        "name": "57 icecream",
        "path": "food/57_icecream.png",
        "extension": ".png"
      },
      {
        "id": "58_icecream_bowl",
        "name": "58 icecream bowl",
        "path": "food/58_icecream_bowl.png",
        "extension": ".png"
      },
      {
        "id": "59_jelly",
        "name": "59 jelly",
        "path": "food/59_jelly.png",
        "extension": ".png"
      },
      {
        "id": "60_jelly_dish",
        "name": "60 jelly dish",
        "path": "food/60_jelly_dish.png",
        "extension": ".png"
      },
      {
        "id": "61_jam",
        "name": "61 jam",
        "path": "food/61_jam.png",
        "extension": ".png"
      },
      {
        "id": "62_jam_dish",
        "name": "62 jam dish",
        "path": "food/62_jam_dish.png",
        "extension": ".png"
      },
      {
        "id": "63_lemonpie",
        "name": "63 lemonpie",
        "path": "food/63_lemonpie.png",
        "extension": ".png"
      },
      {
        "id": "64_lemonpie_dish",
        "name": "64 lemonpie dish",
        "path": "food/64_lemonpie_dish.png",
        "extension": ".png"
      },
      {
        "id": "65_loafbread",
        "name": "65 loafbread",
        "path": "food/65_loafbread.png",
        "extension": ".png"
      },
      {
        "id": "66_loafbread_dish",
        "name": "66 loafbread dish",
        "path": "food/66_loafbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "67_macncheese",
        "name": "67 macncheese",
        "path": "food/67_macncheese.png",
        "extension": ".png"
      },
      {
        "id": "68_macncheese_dish",
        "name": "68 macncheese dish",
        "path": "food/68_macncheese_dish.png",
        "extension": ".png"
      },
      {
        "id": "69_meatball",
        "name": "69 meatball",
        "path": "food/69_meatball.png",
        "extension": ".png"
      },
      {
        "id": "70_meatball_dish",
        "name": "70 meatball dish",
        "path": "food/70_meatball_dish.png",
        "extension": ".png"
      },
      {
        "id": "71_nacho",
        "name": "71 nacho",
        "path": "food/71_nacho.png",
        "extension": ".png"
      },
      {
        "id": "72_nacho_dish",
        "name": "72 nacho dish",
        "path": "food/72_nacho_dish.png",
        "extension": ".png"
      },
      {
        "id": "73_omlet",
        "name": "73 omlet",
        "path": "food/73_omlet.png",
        "extension": ".png"
      },
      {
        "id": "74_omlet_dish",
        "name": "74 omlet dish",
        "path": "food/74_omlet_dish.png",
        "extension": ".png"
      },
      {
        "id": "75_pudding",
        "name": "75 pudding",
        "path": "food/75_pudding.png",
        "extension": ".png"
      },
      {
        "id": "76_pudding_dish",
        "name": "76 pudding dish",
        "path": "food/76_pudding_dish.png",
        "extension": ".png"
      },
      {
        "id": "77_potatochips",
        "name": "77 potatochips",
        "path": "food/77_potatochips.png",
        "extension": ".png"
      },
      {
        "id": "78_potatochips_bowl",
        "name": "78 potatochips bowl",
        "path": "food/78_potatochips_bowl.png",
        "extension": ".png"
      },
      {
        "id": "79_pancakes",
        "name": "79 pancakes",
        "path": "food/79_pancakes.png",
        "extension": ".png"
      },
      {
        "id": "80_pancakes_dish",
        "name": "80 pancakes dish",
        "path": "food/80_pancakes_dish.png",
        "extension": ".png"
      },
      {
        "id": "81_pizza",
        "name": "81 pizza",
        "path": "food/81_pizza.png",
        "extension": ".png"
      },
      {
        "id": "82_pizza_dish",
        "name": "82 pizza dish",
        "path": "food/82_pizza_dish.png",
        "extension": ".png"
      },
      {
        "id": "83_popcorn",
        "name": "83 popcorn",
        "path": "food/83_popcorn.png",
        "extension": ".png"
      },
      {
        "id": "84_popcorn_bowl",
        "name": "84 popcorn bowl",
        "path": "food/84_popcorn_bowl.png",
        "extension": ".png"
      },
      {
        "id": "85_roastedchicken",
        "name": "85 roastedchicken",
        "path": "food/85_roastedchicken.png",
        "extension": ".png"
      },
      {
        "id": "86_roastedchicken_dish",
        "name": "86 roastedchicken dish",
        "path": "food/86_roastedchicken_dish.png",
        "extension": ".png"
      },
      {
        "id": "87_ramen",
        "name": "87 ramen",
        "path": "food/87_ramen.png",
        "extension": ".png"
      },
      {
        "id": "88_salmon",
        "name": "88 salmon",
        "path": "food/88_salmon.png",
        "extension": ".png"
      },
      {
        "id": "89_salmon_dish",
        "name": "89 salmon dish",
        "path": "food/89_salmon_dish.png",
        "extension": ".png"
      },
      {
        "id": "90_strawberrycake",
        "name": "90 strawberrycake",
        "path": "food/90_strawberrycake.png",
        "extension": ".png"
      },
      {
        "id": "91_strawberrycake_dish",
        "name": "91 strawberrycake dish",
        "path": "food/91_strawberrycake_dish.png",
        "extension": ".png"
      },
      {
        "id": "92_sandwich",
        "name": "92 sandwich",
        "path": "food/92_sandwich.png",
        "extension": ".png"
      },
      {
        "id": "93_sandwich_dish",
        "name": "93 sandwich dish",
        "path": "food/93_sandwich_dish.png",
        "extension": ".png"
      },
      {
        "id": "94_spaghetti",
        "name": "94 spaghetti",
        "path": "food/94_spaghetti.png",
        "extension": ".png"
      },
      {
        "id": "95_steak",
        "name": "95 steak",
        "path": "food/95_steak.png",
        "extension": ".png"
      },
      {
        "id": "96_steak_dish",
        "name": "96 steak dish",
        "path": "food/96_steak_dish.png",
        "extension": ".png"
      },
      {
        "id": "97_sushi",
        "name": "97 sushi",
        "path": "food/97_sushi.png",
        "extension": ".png"
      },
      {
        "id": "98_sushi_dish",
        "name": "98 sushi dish",
        "path": "food/98_sushi_dish.png",
        "extension": ".png"
      },
      {
        "id": "99_taco",
        "name": "99 taco",
        "path": "food/99_taco.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 102
  },
  "ground": {
    "name": "ground",
    "path": "ground",
    "animations": [],
    "staticSprites": [
      {
        "id": "FarmLand_Tile",
        "name": "FarmLand Tile",
        "path": "ground/FarmLand_Tile.png",
        "extension": ".png"
      },
      {
        "id": "Grass_Middle",
        "name": "Grass Middle",
        "path": "ground/Grass_Middle.png",
        "extension": ".png"
      },
      {
        "id": "Path_Middle",
        "name": "Path Middle",
        "path": "ground/Path_Middle.png",
        "extension": ".png"
      },
      {
        "id": "TexturedGrass",
        "name": "TexturedGrass",
        "path": "ground/TexturedGrass.png",
        "extension": ".png"
      },
      {
        "id": "cesped1",
        "name": "cesped1",
        "path": "ground/cesped1.png",
        "extension": ".png"
      },
      {
        "id": "cesped10",
        "name": "cesped10",
        "path": "ground/cesped10.png",
        "extension": ".png"
      },
      {
        "id": "cesped11",
        "name": "cesped11",
        "path": "ground/cesped11.png",
        "extension": ".png"
      },
      {
        "id": "cesped12",
        "name": "cesped12",
        "path": "ground/cesped12.png",
        "extension": ".png"
      },
      {
        "id": "cesped13",
        "name": "cesped13",
        "path": "ground/cesped13.png",
        "extension": ".png"
      },
      {
        "id": "cesped14",
        "name": "cesped14",
        "path": "ground/cesped14.png",
        "extension": ".png"
      },
      {
        "id": "cesped15",
        "name": "cesped15",
        "path": "ground/cesped15.png",
        "extension": ".png"
      },
      {
        "id": "cesped16",
        "name": "cesped16",
        "path": "ground/cesped16.png",
        "extension": ".png"
      },
      {
        "id": "cesped17",
        "name": "cesped17",
        "path": "ground/cesped17.png",
        "extension": ".png"
      },
      {
        "id": "cesped18",
        "name": "cesped18",
        "path": "ground/cesped18.png",
        "extension": ".png"
      },
      {
        "id": "cesped19",
        "name": "cesped19",
        "path": "ground/cesped19.png",
        "extension": ".png"
      },
      {
        "id": "cesped2",
        "name": "cesped2",
        "path": "ground/cesped2.png",
        "extension": ".png"
      },
      {
        "id": "cesped20",
        "name": "cesped20",
        "path": "ground/cesped20.png",
        "extension": ".png"
      },
      {
        "id": "cesped21",
        "name": "cesped21",
        "path": "ground/cesped21.png",
        "extension": ".png"
      },
      {
        "id": "cesped22",
        "name": "cesped22",
        "path": "ground/cesped22.png",
        "extension": ".png"
      },
      {
        "id": "cesped23",
        "name": "cesped23",
        "path": "ground/cesped23.png",
        "extension": ".png"
      },
      {
        "id": "cesped24",
        "name": "cesped24",
        "path": "ground/cesped24.png",
        "extension": ".png"
      },
      {
        "id": "cesped25",
        "name": "cesped25",
        "path": "ground/cesped25.png",
        "extension": ".png"
      },
      {
        "id": "cesped26",
        "name": "cesped26",
        "path": "ground/cesped26.png",
        "extension": ".png"
      },
      {
        "id": "cesped27",
        "name": "cesped27",
        "path": "ground/cesped27.png",
        "extension": ".png"
      },
      {
        "id": "cesped28",
        "name": "cesped28",
        "path": "ground/cesped28.png",
        "extension": ".png"
      },
      {
        "id": "cesped29",
        "name": "cesped29",
        "path": "ground/cesped29.png",
        "extension": ".png"
      },
      {
        "id": "cesped3",
        "name": "cesped3",
        "path": "ground/cesped3.png",
        "extension": ".png"
      },
      {
        "id": "cesped30",
        "name": "cesped30",
        "path": "ground/cesped30.png",
        "extension": ".png"
      },
      {
        "id": "cesped31",
        "name": "cesped31",
        "path": "ground/cesped31.png",
        "extension": ".png"
      },
      {
        "id": "cesped4",
        "name": "cesped4",
        "path": "ground/cesped4.png",
        "extension": ".png"
      },
      {
        "id": "cesped5",
        "name": "cesped5",
        "path": "ground/cesped5.png",
        "extension": ".png"
      },
      {
        "id": "cesped6",
        "name": "cesped6",
        "path": "ground/cesped6.png",
        "extension": ".png"
      },
      {
        "id": "cesped7",
        "name": "cesped7",
        "path": "ground/cesped7.png",
        "extension": ".png"
      },
      {
        "id": "cesped8",
        "name": "cesped8",
        "path": "ground/cesped8.png",
        "extension": ".png"
      },
      {
        "id": "cesped9",
        "name": "cesped9",
        "path": "ground/cesped9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 35
  },
  "nature": {
    "name": "nature",
    "path": "nature",
    "animations": [
      {
        "id": "Oak_Tree_detected",
        "name": "default",
        "jsonPath": "nature/Oak_Tree_default_detected.json",
        "spritePath": "nature/Oak_Tree.png",
        "metadata": {
          "name": "default",
          "frame_count": 20,
          "frame_size": [
            16,
            16
          ],
          "columns": 4,
          "rows": 5,
          "total_duration": 1600,
          "loop": true,
          "fps": 13,
          "frames": [
            {
              "duration": 80,
              "x": 0,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 0,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 16,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 32,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 48,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 0,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 16,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 32,
              "y": 64,
              "width": 16,
              "height": 16
            },
            {
              "duration": 80,
              "x": 48,
              "y": 64,
              "width": 16,
              "height": 16
            }
          ],
          "source_image": "Oak_Tree.png",
          "detected_automatically": true,
          "detection_confidence": 45,
          "engine_version": "duo-eterno-v1.0",
          "created_at": "2025-08-18T09:52:31.157Z"
        }
      }
    ],
    "staticSprites": [
      {
        "id": "Bush_Emerald_1",
        "name": "Bush Emerald 1",
        "path": "nature/Bush_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_2",
        "name": "Bush Emerald 2",
        "path": "nature/Bush_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_3",
        "name": "Bush Emerald 3",
        "path": "nature/Bush_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_4",
        "name": "Bush Emerald 4",
        "path": "nature/Bush_Emerald_4.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_5",
        "name": "Bush Emerald 5",
        "path": "nature/Bush_Emerald_5.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_6",
        "name": "Bush Emerald 6",
        "path": "nature/Bush_Emerald_6.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_7",
        "name": "Bush Emerald 7",
        "path": "nature/Bush_Emerald_7.png",
        "extension": ".png"
      },
      {
        "id": "Oak_Tree",
        "name": "Oak Tree",
        "path": "nature/Oak_Tree.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_1",
        "name": "Rock Brown 1",
        "path": "nature/Rock_Brown_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_2",
        "name": "Rock Brown 2",
        "path": "nature/Rock_Brown_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_4",
        "name": "Rock Brown 4",
        "path": "nature/Rock_Brown_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_6",
        "name": "Rock Brown 6",
        "path": "nature/Rock_Brown_6.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_9",
        "name": "Rock Brown 9",
        "path": "nature/Rock_Brown_9.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_1",
        "name": "Tree Emerald 1",
        "path": "nature/Tree_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_2",
        "name": "Tree Emerald 2",
        "path": "nature/Tree_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_3",
        "name": "Tree Emerald 3",
        "path": "nature/Tree_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_4",
        "name": "Tree Emerald 4",
        "path": "nature/Tree_Emerald_4.png",
        "extension": ".png"
      },
      {
        "id": "troncos1",
        "name": "troncos1",
        "path": "nature/troncos1.png",
        "extension": ".png"
      },
      {
        "id": "troncos2",
        "name": "troncos2",
        "path": "nature/troncos2.png",
        "extension": ".png"
      },
      {
        "id": "troncos3",
        "name": "troncos3",
        "path": "nature/troncos3.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 21
  },
  "roads": {
    "name": "roads",
    "path": "roads",
    "animations": [],
    "staticSprites": [],
    "totalAssets": 0
  },
  "water": {
    "name": "water",
    "path": "water",
    "animations": [],
    "staticSprites": [
      {
        "id": "Water_Middle",
        "name": "Water Middle",
        "path": "water/Water_Middle.png",
        "extension": ".png"
      },
      {
        "id": "tile_0198",
        "name": "tile 0198",
        "path": "water/tile_0198.png",
        "extension": ".png"
      },
      {
        "id": "tile_0230",
        "name": "tile 0230",
        "path": "water/tile_0230.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 3
  }
};

// Helper para obtener assets de una carpeta específica
export function getAssetsByFolder(folderName: string): AssetFolder | null {
  return ASSET_MANIFEST[folderName] || null;
}

// Helper para obtener todas las animaciones disponibles
export function getAllAnimations(): AnimationAsset[] {
  const animations: AnimationAsset[] = [];
  
  function collectAnimations(folder: AssetFolder) {
    animations.push(...folder.animations);
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(collectAnimations);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(collectAnimations);
  return animations;
}

// Helper para obtener animaciones por entidad
export function getEntityAnimations(entityName: string): AnimationAsset[] {
  return getAllAnimations().filter(anim => 
    anim.id.includes(entityName) || anim.name.includes(entityName)
  );
}

// Helper para buscar assets por nombre
export function searchAssets(query: string): (AnimationAsset | StaticSpriteAsset)[] {
  const results: (AnimationAsset | StaticSpriteAsset)[] = [];
  const searchTerm = query.toLowerCase();
  
  function searchInFolder(folder: AssetFolder) {
    // Buscar en animaciones
    results.push(...folder.animations.filter(anim => 
      anim.id.toLowerCase().includes(searchTerm) || 
      anim.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en sprites estáticos
    results.push(...folder.staticSprites.filter(sprite => 
      sprite.id.toLowerCase().includes(searchTerm) || 
      sprite.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en subcarpetas
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(searchInFolder);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(searchInFolder);
  return results;
}

// Generar estadísticas de assets
export function getAssetStats() {
  let totalAnimations = 0;
  let totalStaticSprites = 0;
  let totalFolders = 0;
  
  function countAssets(folder: AssetFolder) {
    totalAnimations += folder.animations.length;
    totalStaticSprites += folder.staticSprites.length;
    totalFolders += 1;
    
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(countAssets);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(countAssets);
  
  return {
    totalAnimations,
    totalStaticSprites,
    totalAssets: totalAnimations + totalStaticSprites,
    totalFolders,
    folders: Object.keys(ASSET_MANIFEST)
  };
}
