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
  "animated_entities": {
    "name": "animated_entities",
    "path": "animated_entities",
    "animations": [
      {
        "id": "entidad_circulo_dying",
        "name": "sparkle",
        "jsonPath": "animated_entities/entities/entidad_circulo_dying_anim.json",
        "spritePath": "animated_entities/entities/entidad_circulo_dying_anim.png",
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
        "jsonPath": "animated_entities/entities/entidad_circulo_happy_anim.json",
        "spritePath": "animated_entities/entities/entidad_circulo_happy_anim.png",
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
        "jsonPath": "animated_entities/entities/entidad_circulo_sad_anim.json",
        "spritePath": "animated_entities/entities/entidad_circulo_sad_anim.png",
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
        "jsonPath": "animated_entities/entities/entidad_square_dying_anim.json",
        "spritePath": "animated_entities/entities/entidad_square_dying_anim.png",
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
        "jsonPath": "animated_entities/entities/entidad_square_happy_anim.json",
        "spritePath": "animated_entities/entities/entidad_square_happy_anim.png",
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
        "jsonPath": "animated_entities/entities/entidad_square_sad_anim.json",
        "spritePath": "animated_entities/entities/entidad_square_sad_anim.png",
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
        "path": "animated_entities/Baby Chicken Yellow.png",
        "extension": ".png"
      },
      {
        "id": "Boar",
        "name": "Boar",
        "path": "animated_entities/Boar.png",
        "extension": ".png"
      },
      {
        "id": "Campfire",
        "name": "Campfire",
        "path": "animated_entities/Campfire.png",
        "extension": ".png"
      },
      {
        "id": "Checkpoint_Flag_Idle1",
        "name": "Checkpoint Flag Idle1",
        "path": "animated_entities/Checkpoint_Flag_Idle1.png",
        "extension": ".png"
      },
      {
        "id": "Checkpoint_Flag_Idle2",
        "name": "Checkpoint Flag Idle2",
        "path": "animated_entities/Checkpoint_Flag_Idle2.png",
        "extension": ".png"
      },
      {
        "id": "Checkpoint_Flag_Out1",
        "name": "Checkpoint Flag Out1",
        "path": "animated_entities/Checkpoint_Flag_Out1.png",
        "extension": ".png"
      },
      {
        "id": "Checkpoint_Flag_Out2",
        "name": "Checkpoint Flag Out2",
        "path": "animated_entities/Checkpoint_Flag_Out2.png",
        "extension": ".png"
      },
      {
        "id": "Chick",
        "name": "Chick",
        "path": "animated_entities/Chick.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Blonde  Green",
        "name": "Chicken Blonde  Green",
        "path": "animated_entities/Chicken Blonde  Green.png",
        "extension": ".png"
      },
      {
        "id": "Chicken Red",
        "name": "Chicken Red",
        "path": "animated_entities/Chicken Red.png",
        "extension": ".png"
      },
      {
        "id": "Chicken",
        "name": "Chicken",
        "path": "animated_entities/Chicken.png",
        "extension": ".png"
      },
      {
        "id": "End_Idle",
        "name": "End Idle",
        "path": "animated_entities/End_Idle.png",
        "extension": ".png"
      },
      {
        "id": "End_Pressed",
        "name": "End Pressed",
        "path": "animated_entities/End_Pressed.png",
        "extension": ".png"
      },
      {
        "id": "Female Cow Brown",
        "name": "Female Cow Brown",
        "path": "animated_entities/Female Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "Fire1",
        "name": "Fire1",
        "path": "animated_entities/Fire1.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_Red",
        "name": "Flowers Red",
        "path": "animated_entities/Flowers_Red.png",
        "extension": ".png"
      },
      {
        "id": "Flowers_White",
        "name": "Flowers White",
        "path": "animated_entities/Flowers_White.png",
        "extension": ".png"
      },
      {
        "id": "HornedSheep",
        "name": "HornedSheep",
        "path": "animated_entities/HornedSheep.png",
        "extension": ".png"
      },
      {
        "id": "Horse(32x32)",
        "name": "Horse(32x32)",
        "path": "animated_entities/Horse(32x32).png",
        "extension": ".png"
      },
      {
        "id": "Idle",
        "name": "Idle",
        "path": "animated_entities/Idle.png",
        "extension": ".png"
      },
      {
        "id": "Male Cow Brown",
        "name": "Male Cow Brown",
        "path": "animated_entities/Male Cow Brown.png",
        "extension": ".png"
      },
      {
        "id": "MarineAnimals",
        "name": "MarineAnimals",
        "path": "animated_entities/MarineAnimals.png",
        "extension": ".png"
      },
      {
        "id": "Pig (2)",
        "name": "Pig (2)",
        "path": "animated_entities/Pig (2).png",
        "extension": ".png"
      },
      {
        "id": "Pig",
        "name": "Pig",
        "path": "animated_entities/Pig.png",
        "extension": ".png"
      },
      {
        "id": "Pointer_Idle",
        "name": "Pointer Idle",
        "path": "animated_entities/Pointer_Idle.png",
        "extension": ".png"
      },
      {
        "id": "Sheep",
        "name": "Sheep",
        "path": "animated_entities/Sheep.png",
        "extension": ".png"
      },
      {
        "id": "Sheep3",
        "name": "Sheep3",
        "path": "animated_entities/Sheep3.png",
        "extension": ".png"
      },
      {
        "id": "Walk",
        "name": "Walk",
        "path": "animated_entities/Walk.png",
        "extension": ".png"
      },
      {
        "id": "entidad_circulo_happy",
        "name": "entidad circulo happy",
        "path": "animated_entities/entities/entidad_circulo_happy.png",
        "extension": ".png"
      }
    ],
    "subfolders": {
      "entities": {
        "name": "entities",
        "path": "animated_entities/entities",
        "animations": [
          {
            "id": "entidad_circulo_dying",
            "name": "sparkle",
            "jsonPath": "animated_entities/entities/entidad_circulo_dying_anim.json",
            "spritePath": "animated_entities/entities/entidad_circulo_dying_anim.png",
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
            "jsonPath": "animated_entities/entities/entidad_circulo_happy_anim.json",
            "spritePath": "animated_entities/entities/entidad_circulo_happy_anim.png",
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
            "jsonPath": "animated_entities/entities/entidad_circulo_sad_anim.json",
            "spritePath": "animated_entities/entities/entidad_circulo_sad_anim.png",
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
            "jsonPath": "animated_entities/entities/entidad_square_dying_anim.json",
            "spritePath": "animated_entities/entities/entidad_square_dying_anim.png",
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
            "jsonPath": "animated_entities/entities/entidad_square_happy_anim.json",
            "spritePath": "animated_entities/entities/entidad_square_happy_anim.png",
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
            "jsonPath": "animated_entities/entities/entidad_square_sad_anim.json",
            "spritePath": "animated_entities/entities/entidad_square_sad_anim.png",
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
            "path": "animated_entities/entities/entidad_circulo_happy.png",
            "extension": ".png"
          }
        ],
        "totalAssets": 7
      }
    },
    "totalAssets": 35
  },
  "building": {
    "name": "building",
    "path": "building",
    "animations": [],
    "staticSprites": [
      {
        "id": "1",
        "name": "1",
        "path": "building/1.png",
        "extension": ".png"
      },
      {
        "id": "2",
        "name": "2",
        "path": "building/2.png",
        "extension": ".png"
      },
      {
        "id": "3",
        "name": "3",
        "path": "building/3.png",
        "extension": ".png"
      },
      {
        "id": "4",
        "name": "4",
        "path": "building/4.png",
        "extension": ".png"
      },
      {
        "id": "5",
        "name": "5",
        "path": "building/5.png",
        "extension": ".png"
      },
      {
        "id": "6",
        "name": "6",
        "path": "building/6.png",
        "extension": ".png"
      },
      {
        "id": "muro",
        "name": "muro",
        "path": "building/muro.png",
        "extension": ".png"
      },
      {
        "id": "muros1",
        "name": "muros1",
        "path": "building/muros1.png",
        "extension": ".png"
      },
      {
        "id": "muros2",
        "name": "muros2",
        "path": "building/muros2.png",
        "extension": ".png"
      },
      {
        "id": "muros3",
        "name": "muros3",
        "path": "building/muros3.png",
        "extension": ".png"
      },
      {
        "id": "piso",
        "name": "piso",
        "path": "building/piso.png",
        "extension": ".png"
      },
      {
        "id": "vidrio",
        "name": "vidrio",
        "path": "building/vidrio.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 12
  },
  "consumable_items": {
    "name": "consumable_items",
    "path": "consumable_items",
    "animations": [],
    "staticSprites": [
      {
        "id": "01_dish",
        "name": "01 dish",
        "path": "consumable_items/01_dish.png",
        "extension": ".png"
      },
      {
        "id": "02_dish_2",
        "name": "02 dish 2",
        "path": "consumable_items/02_dish_2.png",
        "extension": ".png"
      },
      {
        "id": "03_dish_pile",
        "name": "03 dish pile",
        "path": "consumable_items/03_dish_pile.png",
        "extension": ".png"
      },
      {
        "id": "04_bowl",
        "name": "04 bowl",
        "path": "consumable_items/04_bowl.png",
        "extension": ".png"
      },
      {
        "id": "05_apple_pie",
        "name": "05 apple pie",
        "path": "consumable_items/05_apple_pie.png",
        "extension": ".png"
      },
      {
        "id": "06_apple_pie_dish",
        "name": "06 apple pie dish",
        "path": "consumable_items/06_apple_pie_dish.png",
        "extension": ".png"
      },
      {
        "id": "07_bread",
        "name": "07 bread",
        "path": "consumable_items/07_bread.png",
        "extension": ".png"
      },
      {
        "id": "08_bread_dish",
        "name": "08 bread dish",
        "path": "consumable_items/08_bread_dish.png",
        "extension": ".png"
      },
      {
        "id": "09_baguette",
        "name": "09 baguette",
        "path": "consumable_items/09_baguette.png",
        "extension": ".png"
      },
      {
        "id": "100_taco_dish",
        "name": "100 taco dish",
        "path": "consumable_items/100_taco_dish.png",
        "extension": ".png"
      },
      {
        "id": "101_waffle",
        "name": "101 waffle",
        "path": "consumable_items/101_waffle.png",
        "extension": ".png"
      },
      {
        "id": "102_waffle_dish",
        "name": "102 waffle dish",
        "path": "consumable_items/102_waffle_dish.png",
        "extension": ".png"
      },
      {
        "id": "10_baguette_dish",
        "name": "10 baguette dish",
        "path": "consumable_items/10_baguette_dish.png",
        "extension": ".png"
      },
      {
        "id": "11_bun",
        "name": "11 bun",
        "path": "consumable_items/11_bun.png",
        "extension": ".png"
      },
      {
        "id": "12_bun_dish",
        "name": "12 bun dish",
        "path": "consumable_items/12_bun_dish.png",
        "extension": ".png"
      },
      {
        "id": "13_bacon",
        "name": "13 bacon",
        "path": "consumable_items/13_bacon.png",
        "extension": ".png"
      },
      {
        "id": "14_bacon_dish",
        "name": "14 bacon dish",
        "path": "consumable_items/14_bacon_dish.png",
        "extension": ".png"
      },
      {
        "id": "15_burger",
        "name": "15 burger",
        "path": "consumable_items/15_burger.png",
        "extension": ".png"
      },
      {
        "id": "16_burger_dish",
        "name": "16 burger dish",
        "path": "consumable_items/16_burger_dish.png",
        "extension": ".png"
      },
      {
        "id": "17_burger_napkin",
        "name": "17 burger napkin",
        "path": "consumable_items/17_burger_napkin.png",
        "extension": ".png"
      },
      {
        "id": "18_burrito",
        "name": "18 burrito",
        "path": "consumable_items/18_burrito.png",
        "extension": ".png"
      },
      {
        "id": "19_burrito_dish",
        "name": "19 burrito dish",
        "path": "consumable_items/19_burrito_dish.png",
        "extension": ".png"
      },
      {
        "id": "20_bagel",
        "name": "20 bagel",
        "path": "consumable_items/20_bagel.png",
        "extension": ".png"
      },
      {
        "id": "21_bagel_dish",
        "name": "21 bagel dish",
        "path": "consumable_items/21_bagel_dish.png",
        "extension": ".png"
      },
      {
        "id": "22_cheesecake",
        "name": "22 cheesecake",
        "path": "consumable_items/22_cheesecake.png",
        "extension": ".png"
      },
      {
        "id": "23_cheesecake_dish",
        "name": "23 cheesecake dish",
        "path": "consumable_items/23_cheesecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "24_cheesepuff",
        "name": "24 cheesepuff",
        "path": "consumable_items/24_cheesepuff.png",
        "extension": ".png"
      },
      {
        "id": "25_cheesepuff_bowl",
        "name": "25 cheesepuff bowl",
        "path": "consumable_items/25_cheesepuff_bowl.png",
        "extension": ".png"
      },
      {
        "id": "26_chocolate",
        "name": "26 chocolate",
        "path": "consumable_items/26_chocolate.png",
        "extension": ".png"
      },
      {
        "id": "27_chocolate_dish",
        "name": "27 chocolate dish",
        "path": "consumable_items/27_chocolate_dish.png",
        "extension": ".png"
      },
      {
        "id": "28_cookies",
        "name": "28 cookies",
        "path": "consumable_items/28_cookies.png",
        "extension": ".png"
      },
      {
        "id": "29_cookies_dish",
        "name": "29 cookies dish",
        "path": "consumable_items/29_cookies_dish.png",
        "extension": ".png"
      },
      {
        "id": "30_chocolatecake",
        "name": "30 chocolatecake",
        "path": "consumable_items/30_chocolatecake.png",
        "extension": ".png"
      },
      {
        "id": "31_chocolatecake_dish",
        "name": "31 chocolatecake dish",
        "path": "consumable_items/31_chocolatecake_dish.png",
        "extension": ".png"
      },
      {
        "id": "32_curry",
        "name": "32 curry",
        "path": "consumable_items/32_curry.png",
        "extension": ".png"
      },
      {
        "id": "33_curry_dish",
        "name": "33 curry dish",
        "path": "consumable_items/33_curry_dish.png",
        "extension": ".png"
      },
      {
        "id": "34_donut",
        "name": "34 donut",
        "path": "consumable_items/34_donut.png",
        "extension": ".png"
      },
      {
        "id": "35_donut_dish",
        "name": "35 donut dish",
        "path": "consumable_items/35_donut_dish.png",
        "extension": ".png"
      },
      {
        "id": "36_dumplings",
        "name": "36 dumplings",
        "path": "consumable_items/36_dumplings.png",
        "extension": ".png"
      },
      {
        "id": "37_dumplings_dish",
        "name": "37 dumplings dish",
        "path": "consumable_items/37_dumplings_dish.png",
        "extension": ".png"
      },
      {
        "id": "38_friedegg",
        "name": "38 friedegg",
        "path": "consumable_items/38_friedegg.png",
        "extension": ".png"
      },
      {
        "id": "39_friedegg_dish",
        "name": "39 friedegg dish",
        "path": "consumable_items/39_friedegg_dish.png",
        "extension": ".png"
      },
      {
        "id": "40_eggsalad",
        "name": "40 eggsalad",
        "path": "consumable_items/40_eggsalad.png",
        "extension": ".png"
      },
      {
        "id": "41_eggsalad_bowl",
        "name": "41 eggsalad bowl",
        "path": "consumable_items/41_eggsalad_bowl.png",
        "extension": ".png"
      },
      {
        "id": "42_eggtart",
        "name": "42 eggtart",
        "path": "consumable_items/42_eggtart.png",
        "extension": ".png"
      },
      {
        "id": "43_eggtart_dish",
        "name": "43 eggtart dish",
        "path": "consumable_items/43_eggtart_dish.png",
        "extension": ".png"
      },
      {
        "id": "44_frenchfries",
        "name": "44 frenchfries",
        "path": "consumable_items/44_frenchfries.png",
        "extension": ".png"
      },
      {
        "id": "45_frenchfries_dish",
        "name": "45 frenchfries dish",
        "path": "consumable_items/45_frenchfries_dish.png",
        "extension": ".png"
      },
      {
        "id": "46_fruitcake",
        "name": "46 fruitcake",
        "path": "consumable_items/46_fruitcake.png",
        "extension": ".png"
      },
      {
        "id": "47_fruitcake_dish",
        "name": "47 fruitcake dish",
        "path": "consumable_items/47_fruitcake_dish.png",
        "extension": ".png"
      },
      {
        "id": "48_garlicbread",
        "name": "48 garlicbread",
        "path": "consumable_items/48_garlicbread.png",
        "extension": ".png"
      },
      {
        "id": "49_garlicbread_dish",
        "name": "49 garlicbread dish",
        "path": "consumable_items/49_garlicbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "50_giantgummybear",
        "name": "50 giantgummybear",
        "path": "consumable_items/50_giantgummybear.png",
        "extension": ".png"
      },
      {
        "id": "51_giantgummybear_dish",
        "name": "51 giantgummybear dish",
        "path": "consumable_items/51_giantgummybear_dish.png",
        "extension": ".png"
      },
      {
        "id": "52_gingerbreadman",
        "name": "52 gingerbreadman",
        "path": "consumable_items/52_gingerbreadman.png",
        "extension": ".png"
      },
      {
        "id": "53_gingerbreadman_dish",
        "name": "53 gingerbreadman dish",
        "path": "consumable_items/53_gingerbreadman_dish.png",
        "extension": ".png"
      },
      {
        "id": "54_hotdog",
        "name": "54 hotdog",
        "path": "consumable_items/54_hotdog.png",
        "extension": ".png"
      },
      {
        "id": "55_hotdog_sauce",
        "name": "55 hotdog sauce",
        "path": "consumable_items/55_hotdog_sauce.png",
        "extension": ".png"
      },
      {
        "id": "56_hotdog_dish",
        "name": "56 hotdog dish",
        "path": "consumable_items/56_hotdog_dish.png",
        "extension": ".png"
      },
      {
        "id": "57_icecream",
        "name": "57 icecream",
        "path": "consumable_items/57_icecream.png",
        "extension": ".png"
      },
      {
        "id": "58_icecream_bowl",
        "name": "58 icecream bowl",
        "path": "consumable_items/58_icecream_bowl.png",
        "extension": ".png"
      },
      {
        "id": "59_jelly",
        "name": "59 jelly",
        "path": "consumable_items/59_jelly.png",
        "extension": ".png"
      },
      {
        "id": "60_jelly_dish",
        "name": "60 jelly dish",
        "path": "consumable_items/60_jelly_dish.png",
        "extension": ".png"
      },
      {
        "id": "61_jam",
        "name": "61 jam",
        "path": "consumable_items/61_jam.png",
        "extension": ".png"
      },
      {
        "id": "62_jam_dish",
        "name": "62 jam dish",
        "path": "consumable_items/62_jam_dish.png",
        "extension": ".png"
      },
      {
        "id": "63_lemonpie",
        "name": "63 lemonpie",
        "path": "consumable_items/63_lemonpie.png",
        "extension": ".png"
      },
      {
        "id": "64_lemonpie_dish",
        "name": "64 lemonpie dish",
        "path": "consumable_items/64_lemonpie_dish.png",
        "extension": ".png"
      },
      {
        "id": "65_loafbread",
        "name": "65 loafbread",
        "path": "consumable_items/65_loafbread.png",
        "extension": ".png"
      },
      {
        "id": "66_loafbread_dish",
        "name": "66 loafbread dish",
        "path": "consumable_items/66_loafbread_dish.png",
        "extension": ".png"
      },
      {
        "id": "67_macncheese",
        "name": "67 macncheese",
        "path": "consumable_items/67_macncheese.png",
        "extension": ".png"
      },
      {
        "id": "68_macncheese_dish",
        "name": "68 macncheese dish",
        "path": "consumable_items/68_macncheese_dish.png",
        "extension": ".png"
      },
      {
        "id": "69_meatball",
        "name": "69 meatball",
        "path": "consumable_items/69_meatball.png",
        "extension": ".png"
      },
      {
        "id": "70_meatball_dish",
        "name": "70 meatball dish",
        "path": "consumable_items/70_meatball_dish.png",
        "extension": ".png"
      },
      {
        "id": "71_nacho",
        "name": "71 nacho",
        "path": "consumable_items/71_nacho.png",
        "extension": ".png"
      },
      {
        "id": "72_nacho_dish",
        "name": "72 nacho dish",
        "path": "consumable_items/72_nacho_dish.png",
        "extension": ".png"
      },
      {
        "id": "73_omlet",
        "name": "73 omlet",
        "path": "consumable_items/73_omlet.png",
        "extension": ".png"
      },
      {
        "id": "74_omlet_dish",
        "name": "74 omlet dish",
        "path": "consumable_items/74_omlet_dish.png",
        "extension": ".png"
      },
      {
        "id": "75_pudding",
        "name": "75 pudding",
        "path": "consumable_items/75_pudding.png",
        "extension": ".png"
      },
      {
        "id": "76_pudding_dish",
        "name": "76 pudding dish",
        "path": "consumable_items/76_pudding_dish.png",
        "extension": ".png"
      },
      {
        "id": "77_potatochips",
        "name": "77 potatochips",
        "path": "consumable_items/77_potatochips.png",
        "extension": ".png"
      },
      {
        "id": "78_potatochips_bowl",
        "name": "78 potatochips bowl",
        "path": "consumable_items/78_potatochips_bowl.png",
        "extension": ".png"
      },
      {
        "id": "79_pancakes",
        "name": "79 pancakes",
        "path": "consumable_items/79_pancakes.png",
        "extension": ".png"
      },
      {
        "id": "80_pancakes_dish",
        "name": "80 pancakes dish",
        "path": "consumable_items/80_pancakes_dish.png",
        "extension": ".png"
      },
      {
        "id": "81_pizza",
        "name": "81 pizza",
        "path": "consumable_items/81_pizza.png",
        "extension": ".png"
      },
      {
        "id": "82_pizza_dish",
        "name": "82 pizza dish",
        "path": "consumable_items/82_pizza_dish.png",
        "extension": ".png"
      },
      {
        "id": "83_popcorn",
        "name": "83 popcorn",
        "path": "consumable_items/83_popcorn.png",
        "extension": ".png"
      },
      {
        "id": "84_popcorn_bowl",
        "name": "84 popcorn bowl",
        "path": "consumable_items/84_popcorn_bowl.png",
        "extension": ".png"
      },
      {
        "id": "85_roastedchicken",
        "name": "85 roastedchicken",
        "path": "consumable_items/85_roastedchicken.png",
        "extension": ".png"
      },
      {
        "id": "86_roastedchicken_dish",
        "name": "86 roastedchicken dish",
        "path": "consumable_items/86_roastedchicken_dish.png",
        "extension": ".png"
      },
      {
        "id": "87_ramen",
        "name": "87 ramen",
        "path": "consumable_items/87_ramen.png",
        "extension": ".png"
      },
      {
        "id": "88_salmon",
        "name": "88 salmon",
        "path": "consumable_items/88_salmon.png",
        "extension": ".png"
      },
      {
        "id": "89_salmon_dish",
        "name": "89 salmon dish",
        "path": "consumable_items/89_salmon_dish.png",
        "extension": ".png"
      },
      {
        "id": "90_strawberrycake",
        "name": "90 strawberrycake",
        "path": "consumable_items/90_strawberrycake.png",
        "extension": ".png"
      },
      {
        "id": "91_strawberrycake_dish",
        "name": "91 strawberrycake dish",
        "path": "consumable_items/91_strawberrycake_dish.png",
        "extension": ".png"
      },
      {
        "id": "92_sandwich",
        "name": "92 sandwich",
        "path": "consumable_items/92_sandwich.png",
        "extension": ".png"
      },
      {
        "id": "93_sandwich_dish",
        "name": "93 sandwich dish",
        "path": "consumable_items/93_sandwich_dish.png",
        "extension": ".png"
      },
      {
        "id": "94_spaghetti",
        "name": "94 spaghetti",
        "path": "consumable_items/94_spaghetti.png",
        "extension": ".png"
      },
      {
        "id": "95_steak",
        "name": "95 steak",
        "path": "consumable_items/95_steak.png",
        "extension": ".png"
      },
      {
        "id": "96_steak_dish",
        "name": "96 steak dish",
        "path": "consumable_items/96_steak_dish.png",
        "extension": ".png"
      },
      {
        "id": "97_sushi",
        "name": "97 sushi",
        "path": "consumable_items/97_sushi.png",
        "extension": ".png"
      },
      {
        "id": "98_sushi_dish",
        "name": "98 sushi dish",
        "path": "consumable_items/98_sushi_dish.png",
        "extension": ".png"
      },
      {
        "id": "99_taco",
        "name": "99 taco",
        "path": "consumable_items/99_taco.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 102
  },
  "dialogs": {
    "name": "dialogs",
    "path": "dialogs",
    "animations": [],
    "staticSprites": [],
    "totalAssets": 0
  },
  "environmental_objects": {
    "name": "environmental_objects",
    "path": "environmental_objects",
    "animations": [],
    "staticSprites": [
      {
        "id": "Banner_Stick_1_Purple",
        "name": "Banner Stick 1 Purple",
        "path": "environmental_objects/Banner_Stick_1_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Bench_1",
        "name": "Bench 1",
        "path": "environmental_objects/Bench_1.png",
        "extension": ".png"
      },
      {
        "id": "Bench_3",
        "name": "Bench 3",
        "path": "environmental_objects/Bench_3.png",
        "extension": ".png"
      },
      {
        "id": "Boat_001",
        "name": "Boat 001",
        "path": "environmental_objects/Boat_001.png",
        "extension": ".png"
      },
      {
        "id": "Boat_002",
        "name": "Boat 002",
        "path": "environmental_objects/Boat_002.png",
        "extension": ".png"
      },
      {
        "id": "BulletinBoard_1",
        "name": "BulletinBoard 1",
        "path": "environmental_objects/BulletinBoard_1.png",
        "extension": ".png"
      },
      {
        "id": "Chopped_Tree_1",
        "name": "Chopped Tree 1",
        "path": "environmental_objects/Chopped_Tree_1.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Water_1",
        "name": "Crate Water 1",
        "path": "environmental_objects/Crate_Water_1.png",
        "extension": ".png"
      },
      {
        "id": "Fireplace_1",
        "name": "Fireplace 1",
        "path": "environmental_objects/Fireplace_1.png",
        "extension": ".png"
      },
      {
        "id": "HayStack_2",
        "name": "HayStack 2",
        "path": "environmental_objects/HayStack_2.png",
        "extension": ".png"
      },
      {
        "id": "LampPost_3",
        "name": "LampPost 3",
        "path": "environmental_objects/LampPost_3.png",
        "extension": ".png"
      },
      {
        "id": "Plant_2",
        "name": "Plant 2",
        "path": "environmental_objects/Plant_2.png",
        "extension": ".png"
      },
      {
        "id": "Sack_3",
        "name": "Sack 3",
        "path": "environmental_objects/Sack_3.png",
        "extension": ".png"
      },
      {
        "id": "Sign_1",
        "name": "Sign 1",
        "path": "environmental_objects/Sign_1.png",
        "extension": ".png"
      },
      {
        "id": "Sign_2",
        "name": "Sign 2",
        "path": "environmental_objects/Sign_2.png",
        "extension": ".png"
      },
      {
        "id": "Signs_001",
        "name": "Signs 001",
        "path": "environmental_objects/Signs_001.png",
        "extension": ".png"
      },
      {
        "id": "Signs_002",
        "name": "Signs 002",
        "path": "environmental_objects/Signs_002.png",
        "extension": ".png"
      },
      {
        "id": "Signs_003",
        "name": "Signs 003",
        "path": "environmental_objects/Signs_003.png",
        "extension": ".png"
      },
      {
        "id": "Signs_004",
        "name": "Signs 004",
        "path": "environmental_objects/Signs_004.png",
        "extension": ".png"
      },
      {
        "id": "StreetSigns_001",
        "name": "StreetSigns 001",
        "path": "environmental_objects/StreetSigns_001.png",
        "extension": ".png"
      },
      {
        "id": "StreetSigns_002",
        "name": "StreetSigns 002",
        "path": "environmental_objects/StreetSigns_002.png",
        "extension": ".png"
      },
      {
        "id": "StreetSigns_003",
        "name": "StreetSigns 003",
        "path": "environmental_objects/StreetSigns_003.png",
        "extension": ".png"
      },
      {
        "id": "StreetSigns_004",
        "name": "StreetSigns 004",
        "path": "environmental_objects/StreetSigns_004.png",
        "extension": ".png"
      },
      {
        "id": "StreetSigns_005",
        "name": "StreetSigns 005",
        "path": "environmental_objects/StreetSigns_005.png",
        "extension": ".png"
      },
      {
        "id": "Table_Medium_1",
        "name": "Table Medium 1",
        "path": "environmental_objects/Table_Medium_1.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_001",
        "name": "Tombstones 001",
        "path": "environmental_objects/Tombstones_001.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_002",
        "name": "Tombstones 002",
        "path": "environmental_objects/Tombstones_002.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_003",
        "name": "Tombstones 003",
        "path": "environmental_objects/Tombstones_003.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_004",
        "name": "Tombstones 004",
        "path": "environmental_objects/Tombstones_004.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_005",
        "name": "Tombstones 005",
        "path": "environmental_objects/Tombstones_005.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_006",
        "name": "Tombstones 006",
        "path": "environmental_objects/Tombstones_006.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_007",
        "name": "Tombstones 007",
        "path": "environmental_objects/Tombstones_007.png",
        "extension": ".png"
      },
      {
        "id": "Tombstones_008",
        "name": "Tombstones 008",
        "path": "environmental_objects/Tombstones_008.png",
        "extension": ".png"
      },
      {
        "id": "basuras1",
        "name": "basuras1",
        "path": "environmental_objects/basuras1.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle1",
        "name": "basuras calle1",
        "path": "environmental_objects/basuras_calle1.png",
        "extension": ".png"
      },
      {
        "id": "botellas1",
        "name": "botellas1",
        "path": "environmental_objects/botellas1.png",
        "extension": ".png"
      },
      {
        "id": "cajas1",
        "name": "cajas1",
        "path": "environmental_objects/cajas1.png",
        "extension": ".png"
      },
      {
        "id": "lamparas1",
        "name": "lamparas1",
        "path": "environmental_objects/lamparas1.png",
        "extension": ".png"
      },
      {
        "id": "lamparas2",
        "name": "lamparas2",
        "path": "environmental_objects/lamparas2.png",
        "extension": ".png"
      },
      {
        "id": "lamparas3",
        "name": "lamparas3",
        "path": "environmental_objects/lamparas3.png",
        "extension": ".png"
      },
      {
        "id": "poste1",
        "name": "poste1",
        "path": "environmental_objects/poste1.png",
        "extension": ".png"
      },
      {
        "id": "poste2",
        "name": "poste2",
        "path": "environmental_objects/poste2.png",
        "extension": ".png"
      },
      {
        "id": "poste3",
        "name": "poste3",
        "path": "environmental_objects/poste3.png",
        "extension": ".png"
      },
      {
        "id": "poste4",
        "name": "poste4",
        "path": "environmental_objects/poste4.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas1",
        "name": "ropas tendidas1",
        "path": "environmental_objects/ropas_tendidas1.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas2",
        "name": "ropas tendidas2",
        "path": "environmental_objects/ropas_tendidas2.png",
        "extension": ".png"
      },
      {
        "id": "ropas_tendidas3",
        "name": "ropas tendidas3",
        "path": "environmental_objects/ropas_tendidas3.png",
        "extension": ".png"
      },
      {
        "id": "silla",
        "name": "silla",
        "path": "environmental_objects/silla.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle1",
        "name": "sillas de calle1",
        "path": "environmental_objects/sillas_de_calle1.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle2",
        "name": "sillas de calle2",
        "path": "environmental_objects/sillas_de_calle2.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle3",
        "name": "sillas de calle3",
        "path": "environmental_objects/sillas_de_calle3.png",
        "extension": ".png"
      },
      {
        "id": "sillas_de_calle4",
        "name": "sillas de calle4",
        "path": "environmental_objects/sillas_de_calle4.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla1",
        "name": "sombrilla1",
        "path": "environmental_objects/sombrilla1.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla2",
        "name": "sombrilla2",
        "path": "environmental_objects/sombrilla2.png",
        "extension": ".png"
      },
      {
        "id": "sombrilla3",
        "name": "sombrilla3",
        "path": "environmental_objects/sombrilla3.png",
        "extension": ".png"
      },
      {
        "id": "tile_0542_tejado",
        "name": "tile 0542 tejado",
        "path": "environmental_objects/tile_0542_tejado.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 56
  },
  "furniture_objects": {
    "name": "furniture_objects",
    "path": "furniture_objects",
    "animations": [],
    "staticSprites": [
      {
        "id": "1 (2)",
        "name": "1 (2)",
        "path": "furniture_objects/1 (2).png",
        "extension": ".png"
      },
      {
        "id": "11",
        "name": "11",
        "path": "furniture_objects/11.png",
        "extension": ".png"
      },
      {
        "id": "12",
        "name": "12",
        "path": "furniture_objects/12.png",
        "extension": ".png"
      },
      {
        "id": "13",
        "name": "13",
        "path": "furniture_objects/13.png",
        "extension": ".png"
      },
      {
        "id": "14",
        "name": "14",
        "path": "furniture_objects/14.png",
        "extension": ".png"
      },
      {
        "id": "3",
        "name": "3",
        "path": "furniture_objects/3.png",
        "extension": ".png"
      },
      {
        "id": "Barrel_Small_Empty",
        "name": "Barrel Small Empty",
        "path": "furniture_objects/Barrel_Small_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Basket_Empty",
        "name": "Basket Empty",
        "path": "furniture_objects/Basket_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Chest",
        "name": "Chest",
        "path": "furniture_objects/Chest.png",
        "extension": ".png"
      },
      {
        "id": "Chests_001",
        "name": "Chests 001",
        "path": "furniture_objects/Chests_001.png",
        "extension": ".png"
      },
      {
        "id": "Chests_002",
        "name": "Chests 002",
        "path": "furniture_objects/Chests_002.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Large_Empty",
        "name": "Crate Large Empty",
        "path": "furniture_objects/Crate_Large_Empty.png",
        "extension": ".png"
      },
      {
        "id": "Crate_Medium_Closed",
        "name": "Crate Medium Closed",
        "path": "furniture_objects/Crate_Medium_Closed.png",
        "extension": ".png"
      },
      {
        "id": "basuras2",
        "name": "basuras2",
        "path": "furniture_objects/basuras2.png",
        "extension": ".png"
      },
      {
        "id": "basuras3",
        "name": "basuras3",
        "path": "furniture_objects/basuras3.png",
        "extension": ".png"
      },
      {
        "id": "basuras4",
        "name": "basuras4",
        "path": "furniture_objects/basuras4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle2",
        "name": "basuras calle2",
        "path": "furniture_objects/basuras_calle2.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle3",
        "name": "basuras calle3",
        "path": "furniture_objects/basuras_calle3.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle4",
        "name": "basuras calle4",
        "path": "furniture_objects/basuras_calle4.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle5",
        "name": "basuras calle5",
        "path": "furniture_objects/basuras_calle5.png",
        "extension": ".png"
      },
      {
        "id": "basuras_calle6",
        "name": "basuras calle6",
        "path": "furniture_objects/basuras_calle6.png",
        "extension": ".png"
      },
      {
        "id": "botellas2",
        "name": "botellas2",
        "path": "furniture_objects/botellas2.png",
        "extension": ".png"
      },
      {
        "id": "botellas3",
        "name": "botellas3",
        "path": "furniture_objects/botellas3.png",
        "extension": ".png"
      },
      {
        "id": "cajas2",
        "name": "cajas2",
        "path": "furniture_objects/cajas2.png",
        "extension": ".png"
      },
      {
        "id": "cajas3",
        "name": "cajas3",
        "path": "furniture_objects/cajas3.png",
        "extension": ".png"
      },
      {
        "id": "sillas1",
        "name": "sillas1",
        "path": "furniture_objects/sillas1.png",
        "extension": ".png"
      },
      {
        "id": "sillas2",
        "name": "sillas2",
        "path": "furniture_objects/sillas2.png",
        "extension": ".png"
      },
      {
        "id": "sillas3",
        "name": "sillas3",
        "path": "furniture_objects/sillas3.png",
        "extension": ".png"
      },
      {
        "id": "sillas4",
        "name": "sillas4",
        "path": "furniture_objects/sillas4.png",
        "extension": ".png"
      },
      {
        "id": "sillas5",
        "name": "sillas5",
        "path": "furniture_objects/sillas5.png",
        "extension": ".png"
      },
      {
        "id": "sillas6",
        "name": "sillas6",
        "path": "furniture_objects/sillas6.png",
        "extension": ".png"
      },
      {
        "id": "sillass1",
        "name": "sillass1",
        "path": "furniture_objects/sillass1.png",
        "extension": ".png"
      },
      {
        "id": "sillass2",
        "name": "sillass2",
        "path": "furniture_objects/sillass2.png",
        "extension": ".png"
      },
      {
        "id": "sillass3",
        "name": "sillass3",
        "path": "furniture_objects/sillass3.png",
        "extension": ".png"
      },
      {
        "id": "ventana1",
        "name": "ventana1",
        "path": "furniture_objects/ventana1.png",
        "extension": ".png"
      },
      {
        "id": "ventana10",
        "name": "ventana10",
        "path": "furniture_objects/ventana10.png",
        "extension": ".png"
      },
      {
        "id": "ventana11",
        "name": "ventana11",
        "path": "furniture_objects/ventana11.png",
        "extension": ".png"
      },
      {
        "id": "ventana12",
        "name": "ventana12",
        "path": "furniture_objects/ventana12.png",
        "extension": ".png"
      },
      {
        "id": "ventana13",
        "name": "ventana13",
        "path": "furniture_objects/ventana13.png",
        "extension": ".png"
      },
      {
        "id": "ventana2",
        "name": "ventana2",
        "path": "furniture_objects/ventana2.png",
        "extension": ".png"
      },
      {
        "id": "ventana3",
        "name": "ventana3",
        "path": "furniture_objects/ventana3.png",
        "extension": ".png"
      },
      {
        "id": "ventana4",
        "name": "ventana4",
        "path": "furniture_objects/ventana4.png",
        "extension": ".png"
      },
      {
        "id": "ventana5",
        "name": "ventana5",
        "path": "furniture_objects/ventana5.png",
        "extension": ".png"
      },
      {
        "id": "ventana6",
        "name": "ventana6",
        "path": "furniture_objects/ventana6.png",
        "extension": ".png"
      },
      {
        "id": "ventana7",
        "name": "ventana7",
        "path": "furniture_objects/ventana7.png",
        "extension": ".png"
      },
      {
        "id": "ventana8",
        "name": "ventana8",
        "path": "furniture_objects/ventana8.png",
        "extension": ".png"
      },
      {
        "id": "ventana9",
        "name": "ventana9",
        "path": "furniture_objects/ventana9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 47
  },
  "natural_elements": {
    "name": "natural_elements",
    "path": "natural_elements",
    "animations": [],
    "staticSprites": [
      {
        "id": "Beige_green_mushroom1",
        "name": "Beige green mushroom1",
        "path": "natural_elements/Beige_green_mushroom1.png",
        "extension": ".png"
      },
      {
        "id": "Beige_green_mushroom2",
        "name": "Beige green mushroom2",
        "path": "natural_elements/Beige_green_mushroom2.png",
        "extension": ".png"
      },
      {
        "id": "Beige_green_mushroom3",
        "name": "Beige green mushroom3",
        "path": "natural_elements/Beige_green_mushroom3.png",
        "extension": ".png"
      },
      {
        "id": "Blue-gray_ruins1",
        "name": "Blue gray ruins1",
        "path": "natural_elements/Blue-gray_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Blue-gray_ruins2",
        "name": "Blue gray ruins2",
        "path": "natural_elements/Blue-gray_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Blue-gray_ruins3",
        "name": "Blue gray ruins3",
        "path": "natural_elements/Blue-gray_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Blue-gray_ruins4",
        "name": "Blue gray ruins4",
        "path": "natural_elements/Blue-gray_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Blue-gray_ruins5",
        "name": "Blue gray ruins5",
        "path": "natural_elements/Blue-gray_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "Blue-green_balls_tree1",
        "name": "Blue green balls tree1",
        "path": "natural_elements/Blue-green_balls_tree1.png",
        "extension": ".png"
      },
      {
        "id": "Blue-green_balls_tree2",
        "name": "Blue green balls tree2",
        "path": "natural_elements/Blue-green_balls_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Blue-green_balls_tree3",
        "name": "Blue green balls tree3",
        "path": "natural_elements/Blue-green_balls_tree3.png",
        "extension": ".png"
      },
      {
        "id": "Brown-gray_ruins1",
        "name": "Brown gray ruins1",
        "path": "natural_elements/Brown-gray_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Brown-gray_ruins2",
        "name": "Brown gray ruins2",
        "path": "natural_elements/Brown-gray_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Brown-gray_ruins3",
        "name": "Brown gray ruins3",
        "path": "natural_elements/Brown-gray_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Brown-gray_ruins4",
        "name": "Brown gray ruins4",
        "path": "natural_elements/Brown-gray_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Brown-gray_ruins5",
        "name": "Brown gray ruins5",
        "path": "natural_elements/Brown-gray_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "Brown_ruins1",
        "name": "Brown ruins1",
        "path": "natural_elements/Brown_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Brown_ruins2",
        "name": "Brown ruins2",
        "path": "natural_elements/Brown_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Brown_ruins3",
        "name": "Brown ruins3",
        "path": "natural_elements/Brown_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Brown_ruins4",
        "name": "Brown ruins4",
        "path": "natural_elements/Brown_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Brown_ruins5",
        "name": "Brown ruins5",
        "path": "natural_elements/Brown_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_1",
        "name": "Bush Emerald 1",
        "path": "natural_elements/Bush_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_2",
        "name": "Bush Emerald 2",
        "path": "natural_elements/Bush_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_3",
        "name": "Bush Emerald 3",
        "path": "natural_elements/Bush_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_4",
        "name": "Bush Emerald 4",
        "path": "natural_elements/Bush_Emerald_4.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_5",
        "name": "Bush Emerald 5",
        "path": "natural_elements/Bush_Emerald_5.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_6",
        "name": "Bush Emerald 6",
        "path": "natural_elements/Bush_Emerald_6.png",
        "extension": ".png"
      },
      {
        "id": "Bush_Emerald_7",
        "name": "Bush Emerald 7",
        "path": "natural_elements/Bush_Emerald_7.png",
        "extension": ".png"
      },
      {
        "id": "Chanterelles1",
        "name": "Chanterelles1",
        "path": "natural_elements/Chanterelles1.png",
        "extension": ".png"
      },
      {
        "id": "Chanterelles2",
        "name": "Chanterelles2",
        "path": "natural_elements/Chanterelles2.png",
        "extension": ".png"
      },
      {
        "id": "Chanterelles3",
        "name": "Chanterelles3",
        "path": "natural_elements/Chanterelles3.png",
        "extension": ".png"
      },
      {
        "id": "Cliff_001_001",
        "name": "Cliff 001 001",
        "path": "natural_elements/Cliff_001_001.png",
        "extension": ".png"
      },
      {
        "id": "Cliff_001_002",
        "name": "Cliff 001 002",
        "path": "natural_elements/Cliff_001_002.png",
        "extension": ".png"
      },
      {
        "id": "Curved_tree1",
        "name": "Curved tree1",
        "path": "natural_elements/Curved_tree1.png",
        "extension": ".png"
      },
      {
        "id": "Curved_tree2",
        "name": "Curved tree2",
        "path": "natural_elements/Curved_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Curved_tree3",
        "name": "Curved tree3",
        "path": "natural_elements/Curved_tree3.png",
        "extension": ".png"
      },
      {
        "id": "Ent_man",
        "name": "Ent man",
        "path": "natural_elements/Ent_man.png",
        "extension": ".png"
      },
      {
        "id": "Ent_woman",
        "name": "Ent woman",
        "path": "natural_elements/Ent_woman.png",
        "extension": ".png"
      },
      {
        "id": "Light_balls_tree1",
        "name": "Light balls tree1",
        "path": "natural_elements/Light_balls_tree1.png",
        "extension": ".png"
      },
      {
        "id": "Light_balls_tree2",
        "name": "Light balls tree2",
        "path": "natural_elements/Light_balls_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Light_balls_tree3",
        "name": "Light balls tree3",
        "path": "natural_elements/Light_balls_tree3.png",
        "extension": ".png"
      },
      {
        "id": "Living gazebo1",
        "name": "Living gazebo1",
        "path": "natural_elements/Living gazebo1.png",
        "extension": ".png"
      },
      {
        "id": "Living gazebo2",
        "name": "Living gazebo2",
        "path": "natural_elements/Living gazebo2.png",
        "extension": ".png"
      },
      {
        "id": "Luminous_tree1",
        "name": "Luminous tree1",
        "path": "natural_elements/Luminous_tree1.png",
        "extension": ".png"
      },
      {
        "id": "Luminous_tree2",
        "name": "Luminous tree2",
        "path": "natural_elements/Luminous_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Luminous_tree3",
        "name": "Luminous tree3",
        "path": "natural_elements/Luminous_tree3.png",
        "extension": ".png"
      },
      {
        "id": "Luminous_tree4",
        "name": "Luminous tree4",
        "path": "natural_elements/Luminous_tree4.png",
        "extension": ".png"
      },
      {
        "id": "Mega_tree1",
        "name": "Mega tree1",
        "path": "natural_elements/Mega_tree1.png",
        "extension": ".png"
      },
      {
        "id": "Mega_tree2",
        "name": "Mega tree2",
        "path": "natural_elements/Mega_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Oak_Tree",
        "name": "Oak Tree",
        "path": "natural_elements/Oak_Tree.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_1",
        "name": "Rock1 1",
        "path": "natural_elements/Rock1_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_1_no_shadow",
        "name": "Rock1 1 no shadow",
        "path": "natural_elements/Rock1_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_2",
        "name": "Rock1 2",
        "path": "natural_elements/Rock1_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_2_no_shadow",
        "name": "Rock1 2 no shadow",
        "path": "natural_elements/Rock1_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_3",
        "name": "Rock1 3",
        "path": "natural_elements/Rock1_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_3_no_shadow",
        "name": "Rock1 3 no shadow",
        "path": "natural_elements/Rock1_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_4",
        "name": "Rock1 4",
        "path": "natural_elements/Rock1_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_4_no_shadow",
        "name": "Rock1 4 no shadow",
        "path": "natural_elements/Rock1_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_5",
        "name": "Rock1 5",
        "path": "natural_elements/Rock1_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_5_no_shadow",
        "name": "Rock1 5 no shadow",
        "path": "natural_elements/Rock1_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow1",
        "name": "Rock1 grass shadow1",
        "path": "natural_elements/Rock1_grass_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow2",
        "name": "Rock1 grass shadow2",
        "path": "natural_elements/Rock1_grass_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow3",
        "name": "Rock1 grass shadow3",
        "path": "natural_elements/Rock1_grass_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow4",
        "name": "Rock1 grass shadow4",
        "path": "natural_elements/Rock1_grass_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow5",
        "name": "Rock1 grass shadow5",
        "path": "natural_elements/Rock1_grass_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow_dark1",
        "name": "Rock1 grass shadow dark1",
        "path": "natural_elements/Rock1_grass_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow_dark2",
        "name": "Rock1 grass shadow dark2",
        "path": "natural_elements/Rock1_grass_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow_dark3",
        "name": "Rock1 grass shadow dark3",
        "path": "natural_elements/Rock1_grass_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow_dark4",
        "name": "Rock1 grass shadow dark4",
        "path": "natural_elements/Rock1_grass_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock1_grass_shadow_dark5",
        "name": "Rock1 grass shadow dark5",
        "path": "natural_elements/Rock1_grass_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_1",
        "name": "Rock2 1",
        "path": "natural_elements/Rock2_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_1_no_shadow",
        "name": "Rock2 1 no shadow",
        "path": "natural_elements/Rock2_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_2",
        "name": "Rock2 2",
        "path": "natural_elements/Rock2_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_2_no_shadow",
        "name": "Rock2 2 no shadow",
        "path": "natural_elements/Rock2_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_3",
        "name": "Rock2 3",
        "path": "natural_elements/Rock2_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_3_no_shadow",
        "name": "Rock2 3 no shadow",
        "path": "natural_elements/Rock2_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_4",
        "name": "Rock2 4",
        "path": "natural_elements/Rock2_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_4_no_shadow",
        "name": "Rock2 4 no shadow",
        "path": "natural_elements/Rock2_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_5",
        "name": "Rock2 5",
        "path": "natural_elements/Rock2_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_5_no_shadow",
        "name": "Rock2 5 no shadow",
        "path": "natural_elements/Rock2_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow1",
        "name": "Rock2 grass shadow1",
        "path": "natural_elements/Rock2_grass_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow2",
        "name": "Rock2 grass shadow2",
        "path": "natural_elements/Rock2_grass_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow3",
        "name": "Rock2 grass shadow3",
        "path": "natural_elements/Rock2_grass_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow4",
        "name": "Rock2 grass shadow4",
        "path": "natural_elements/Rock2_grass_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow5",
        "name": "Rock2 grass shadow5",
        "path": "natural_elements/Rock2_grass_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow_dark1",
        "name": "Rock2 grass shadow dark1",
        "path": "natural_elements/Rock2_grass_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow_dark2",
        "name": "Rock2 grass shadow dark2",
        "path": "natural_elements/Rock2_grass_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow_dark3",
        "name": "Rock2 grass shadow dark3",
        "path": "natural_elements/Rock2_grass_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow_dark4",
        "name": "Rock2 grass shadow dark4",
        "path": "natural_elements/Rock2_grass_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock2_grass_shadow_dark5",
        "name": "Rock2 grass shadow dark5",
        "path": "natural_elements/Rock2_grass_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_1",
        "name": "Rock3 1",
        "path": "natural_elements/Rock3_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_1_no_shadow",
        "name": "Rock3 1 no shadow",
        "path": "natural_elements/Rock3_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_2",
        "name": "Rock3 2",
        "path": "natural_elements/Rock3_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_2_no_shadow",
        "name": "Rock3 2 no shadow",
        "path": "natural_elements/Rock3_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_3",
        "name": "Rock3 3",
        "path": "natural_elements/Rock3_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_3_no_shadow",
        "name": "Rock3 3 no shadow",
        "path": "natural_elements/Rock3_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_4",
        "name": "Rock3 4",
        "path": "natural_elements/Rock3_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_4_no_shadow",
        "name": "Rock3 4 no shadow",
        "path": "natural_elements/Rock3_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_5",
        "name": "Rock3 5",
        "path": "natural_elements/Rock3_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock3_5_no_shadow",
        "name": "Rock3 5 no shadow",
        "path": "natural_elements/Rock3_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_1",
        "name": "Rock4 1",
        "path": "natural_elements/Rock4_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_1_no_shadow",
        "name": "Rock4 1 no shadow",
        "path": "natural_elements/Rock4_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_2",
        "name": "Rock4 2",
        "path": "natural_elements/Rock4_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_2_no_shadow",
        "name": "Rock4 2 no shadow",
        "path": "natural_elements/Rock4_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_3",
        "name": "Rock4 3",
        "path": "natural_elements/Rock4_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_3_no_shadow",
        "name": "Rock4 3 no shadow",
        "path": "natural_elements/Rock4_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_4",
        "name": "Rock4 4",
        "path": "natural_elements/Rock4_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_4_no_shadow",
        "name": "Rock4 4 no shadow",
        "path": "natural_elements/Rock4_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_5",
        "name": "Rock4 5",
        "path": "natural_elements/Rock4_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_5_no_shadow",
        "name": "Rock4 5 no shadow",
        "path": "natural_elements/Rock4_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow1",
        "name": "Rock4 grass shadow1",
        "path": "natural_elements/Rock4_grass_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow2",
        "name": "Rock4 grass shadow2",
        "path": "natural_elements/Rock4_grass_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow3",
        "name": "Rock4 grass shadow3",
        "path": "natural_elements/Rock4_grass_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow4",
        "name": "Rock4 grass shadow4",
        "path": "natural_elements/Rock4_grass_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow5",
        "name": "Rock4 grass shadow5",
        "path": "natural_elements/Rock4_grass_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow_dark1",
        "name": "Rock4 grass shadow dark1",
        "path": "natural_elements/Rock4_grass_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow_dark2",
        "name": "Rock4 grass shadow dark2",
        "path": "natural_elements/Rock4_grass_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow_dark3",
        "name": "Rock4 grass shadow dark3",
        "path": "natural_elements/Rock4_grass_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow_dark4",
        "name": "Rock4 grass shadow dark4",
        "path": "natural_elements/Rock4_grass_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock4_grass_shadow_dark5",
        "name": "Rock4 grass shadow dark5",
        "path": "natural_elements/Rock4_grass_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_1",
        "name": "Rock5 1",
        "path": "natural_elements/Rock5_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_1_no_shadow",
        "name": "Rock5 1 no shadow",
        "path": "natural_elements/Rock5_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_2",
        "name": "Rock5 2",
        "path": "natural_elements/Rock5_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_2_no_shadow",
        "name": "Rock5 2 no shadow",
        "path": "natural_elements/Rock5_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_3",
        "name": "Rock5 3",
        "path": "natural_elements/Rock5_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_3_no_shadow",
        "name": "Rock5 3 no shadow",
        "path": "natural_elements/Rock5_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_4",
        "name": "Rock5 4",
        "path": "natural_elements/Rock5_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_4_no_shadow",
        "name": "Rock5 4 no shadow",
        "path": "natural_elements/Rock5_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_5",
        "name": "Rock5 5",
        "path": "natural_elements/Rock5_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_5_no_shadow",
        "name": "Rock5 5 no shadow",
        "path": "natural_elements/Rock5_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow1",
        "name": "Rock5 grass shadow1",
        "path": "natural_elements/Rock5_grass_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow2",
        "name": "Rock5 grass shadow2",
        "path": "natural_elements/Rock5_grass_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow3",
        "name": "Rock5 grass shadow3",
        "path": "natural_elements/Rock5_grass_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow4",
        "name": "Rock5 grass shadow4",
        "path": "natural_elements/Rock5_grass_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow5",
        "name": "Rock5 grass shadow5",
        "path": "natural_elements/Rock5_grass_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow_dark1",
        "name": "Rock5 grass shadow dark1",
        "path": "natural_elements/Rock5_grass_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow_dark2",
        "name": "Rock5 grass shadow dark2",
        "path": "natural_elements/Rock5_grass_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow_dark3",
        "name": "Rock5 grass shadow dark3",
        "path": "natural_elements/Rock5_grass_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow_dark4",
        "name": "Rock5 grass shadow dark4",
        "path": "natural_elements/Rock5_grass_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock5_grass_shadow_dark5",
        "name": "Rock5 grass shadow dark5",
        "path": "natural_elements/Rock5_grass_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_1",
        "name": "Rock6 1",
        "path": "natural_elements/Rock6_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_1_no_shadow",
        "name": "Rock6 1 no shadow",
        "path": "natural_elements/Rock6_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_2",
        "name": "Rock6 2",
        "path": "natural_elements/Rock6_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_2_no_shadow",
        "name": "Rock6 2 no shadow",
        "path": "natural_elements/Rock6_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_3",
        "name": "Rock6 3",
        "path": "natural_elements/Rock6_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_3_no_shadow",
        "name": "Rock6 3 no shadow",
        "path": "natural_elements/Rock6_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_4",
        "name": "Rock6 4",
        "path": "natural_elements/Rock6_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_4_no_shadow",
        "name": "Rock6 4 no shadow",
        "path": "natural_elements/Rock6_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_5",
        "name": "Rock6 5",
        "path": "natural_elements/Rock6_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_5_no_shadow",
        "name": "Rock6 5 no shadow",
        "path": "natural_elements/Rock6_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow1",
        "name": "Rock6 grass shadow1",
        "path": "natural_elements/Rock6_grass_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow2",
        "name": "Rock6 grass shadow2",
        "path": "natural_elements/Rock6_grass_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow3",
        "name": "Rock6 grass shadow3",
        "path": "natural_elements/Rock6_grass_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow4",
        "name": "Rock6 grass shadow4",
        "path": "natural_elements/Rock6_grass_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow5",
        "name": "Rock6 grass shadow5",
        "path": "natural_elements/Rock6_grass_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow_dark1",
        "name": "Rock6 grass shadow dark1",
        "path": "natural_elements/Rock6_grass_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow_dark2",
        "name": "Rock6 grass shadow dark2",
        "path": "natural_elements/Rock6_grass_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow_dark3",
        "name": "Rock6 grass shadow dark3",
        "path": "natural_elements/Rock6_grass_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow_dark4",
        "name": "Rock6 grass shadow dark4",
        "path": "natural_elements/Rock6_grass_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock6_grass_shadow_dark5",
        "name": "Rock6 grass shadow dark5",
        "path": "natural_elements/Rock6_grass_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_1",
        "name": "Rock7 1",
        "path": "natural_elements/Rock7_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_1_no_shadow",
        "name": "Rock7 1 no shadow",
        "path": "natural_elements/Rock7_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_2",
        "name": "Rock7 2",
        "path": "natural_elements/Rock7_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_2_no_shadow",
        "name": "Rock7 2 no shadow",
        "path": "natural_elements/Rock7_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_3",
        "name": "Rock7 3",
        "path": "natural_elements/Rock7_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_3_no_shadow",
        "name": "Rock7 3 no shadow",
        "path": "natural_elements/Rock7_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_4",
        "name": "Rock7 4",
        "path": "natural_elements/Rock7_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_4_no_shadow",
        "name": "Rock7 4 no shadow",
        "path": "natural_elements/Rock7_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_5",
        "name": "Rock7 5",
        "path": "natural_elements/Rock7_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_5_no_shadow",
        "name": "Rock7 5 no shadow",
        "path": "natural_elements/Rock7_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow1",
        "name": "Rock7 water shadow1",
        "path": "natural_elements/Rock7_water_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow2",
        "name": "Rock7 water shadow2",
        "path": "natural_elements/Rock7_water_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow3",
        "name": "Rock7 water shadow3",
        "path": "natural_elements/Rock7_water_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow4",
        "name": "Rock7 water shadow4",
        "path": "natural_elements/Rock7_water_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow5",
        "name": "Rock7 water shadow5",
        "path": "natural_elements/Rock7_water_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow_dark1",
        "name": "Rock7 water shadow dark1",
        "path": "natural_elements/Rock7_water_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow_dark2",
        "name": "Rock7 water shadow dark2",
        "path": "natural_elements/Rock7_water_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow_dark3",
        "name": "Rock7 water shadow dark3",
        "path": "natural_elements/Rock7_water_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow_dark4",
        "name": "Rock7 water shadow dark4",
        "path": "natural_elements/Rock7_water_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock7_water_shadow_dark5",
        "name": "Rock7 water shadow dark5",
        "path": "natural_elements/Rock7_water_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_1",
        "name": "Rock8 1",
        "path": "natural_elements/Rock8_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_1_no_shadow",
        "name": "Rock8 1 no shadow",
        "path": "natural_elements/Rock8_1_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_2",
        "name": "Rock8 2",
        "path": "natural_elements/Rock8_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_2_no_shadow",
        "name": "Rock8 2 no shadow",
        "path": "natural_elements/Rock8_2_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_3",
        "name": "Rock8 3",
        "path": "natural_elements/Rock8_3.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_3_no_shadow",
        "name": "Rock8 3 no shadow",
        "path": "natural_elements/Rock8_3_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_4",
        "name": "Rock8 4",
        "path": "natural_elements/Rock8_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_4_no_shadow",
        "name": "Rock8 4 no shadow",
        "path": "natural_elements/Rock8_4_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_5",
        "name": "Rock8 5",
        "path": "natural_elements/Rock8_5.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_5_no_shadow",
        "name": "Rock8 5 no shadow",
        "path": "natural_elements/Rock8_5_no_shadow.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow1",
        "name": "Rock8 ground shadow1",
        "path": "natural_elements/Rock8_ground_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow2",
        "name": "Rock8 ground shadow2",
        "path": "natural_elements/Rock8_ground_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow3",
        "name": "Rock8 ground shadow3",
        "path": "natural_elements/Rock8_ground_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow4",
        "name": "Rock8 ground shadow4",
        "path": "natural_elements/Rock8_ground_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow5",
        "name": "Rock8 ground shadow5",
        "path": "natural_elements/Rock8_ground_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow_dark1",
        "name": "Rock8 ground shadow dark1",
        "path": "natural_elements/Rock8_ground_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow_dark2",
        "name": "Rock8 ground shadow dark2",
        "path": "natural_elements/Rock8_ground_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow_dark3",
        "name": "Rock8 ground shadow dark3",
        "path": "natural_elements/Rock8_ground_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow_dark4",
        "name": "Rock8 ground shadow dark4",
        "path": "natural_elements/Rock8_ground_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rock8_ground_shadow_dark5",
        "name": "Rock8 ground shadow dark5",
        "path": "natural_elements/Rock8_ground_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_1",
        "name": "Rock Brown 1",
        "path": "natural_elements/Rock_Brown_1.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_2",
        "name": "Rock Brown 2",
        "path": "natural_elements/Rock_Brown_2.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_4",
        "name": "Rock Brown 4",
        "path": "natural_elements/Rock_Brown_4.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_6",
        "name": "Rock Brown 6",
        "path": "natural_elements/Rock_Brown_6.png",
        "extension": ".png"
      },
      {
        "id": "Rock_Brown_9",
        "name": "Rock Brown 9",
        "path": "natural_elements/Rock_Brown_9.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow1",
        "name": "Rokc3 snow shadow1",
        "path": "natural_elements/Rokc3_snow_shadow1.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow2",
        "name": "Rokc3 snow shadow2",
        "path": "natural_elements/Rokc3_snow_shadow2.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow3",
        "name": "Rokc3 snow shadow3",
        "path": "natural_elements/Rokc3_snow_shadow3.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow4",
        "name": "Rokc3 snow shadow4",
        "path": "natural_elements/Rokc3_snow_shadow4.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow5",
        "name": "Rokc3 snow shadow5",
        "path": "natural_elements/Rokc3_snow_shadow5.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow_dark1",
        "name": "Rokc3 snow shadow dark1",
        "path": "natural_elements/Rokc3_snow_shadow_dark1.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow_dark2",
        "name": "Rokc3 snow shadow dark2",
        "path": "natural_elements/Rokc3_snow_shadow_dark2.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow_dark3",
        "name": "Rokc3 snow shadow dark3",
        "path": "natural_elements/Rokc3_snow_shadow_dark3.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow_dark4",
        "name": "Rokc3 snow shadow dark4",
        "path": "natural_elements/Rokc3_snow_shadow_dark4.png",
        "extension": ".png"
      },
      {
        "id": "Rokc3_snow_shadow_dark5",
        "name": "Rokc3 snow shadow dark5",
        "path": "natural_elements/Rokc3_snow_shadow_dark5.png",
        "extension": ".png"
      },
      {
        "id": "Sand_ruins1",
        "name": "Sand ruins1",
        "path": "natural_elements/Sand_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Sand_ruins2",
        "name": "Sand ruins2",
        "path": "natural_elements/Sand_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Sand_ruins3",
        "name": "Sand ruins3",
        "path": "natural_elements/Sand_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Sand_ruins4",
        "name": "Sand ruins4",
        "path": "natural_elements/Sand_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Sand_ruins5",
        "name": "Sand ruins5",
        "path": "natural_elements/Sand_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "Snow_ruins1",
        "name": "Snow ruins1",
        "path": "natural_elements/Snow_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Snow_ruins2",
        "name": "Snow ruins2",
        "path": "natural_elements/Snow_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Snow_ruins3",
        "name": "Snow ruins3",
        "path": "natural_elements/Snow_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Snow_ruins4",
        "name": "Snow ruins4",
        "path": "natural_elements/Snow_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Snow_ruins5",
        "name": "Snow ruins5",
        "path": "natural_elements/Snow_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "Swirling tree1",
        "name": "Swirling tree1",
        "path": "natural_elements/Swirling tree1.png",
        "extension": ".png"
      },
      {
        "id": "Swirling tree2",
        "name": "Swirling tree2",
        "path": "natural_elements/Swirling tree2.png",
        "extension": ".png"
      },
      {
        "id": "Swirling tree3",
        "name": "Swirling tree3",
        "path": "natural_elements/Swirling tree3.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_1",
        "name": "Tree Emerald 1",
        "path": "natural_elements/Tree_Emerald_1.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_2",
        "name": "Tree Emerald 2",
        "path": "natural_elements/Tree_Emerald_2.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_3",
        "name": "Tree Emerald 3",
        "path": "natural_elements/Tree_Emerald_3.png",
        "extension": ".png"
      },
      {
        "id": "Tree_Emerald_4",
        "name": "Tree Emerald 4",
        "path": "natural_elements/Tree_Emerald_4.png",
        "extension": ".png"
      },
      {
        "id": "Tree_idol_deer",
        "name": "Tree idol deer",
        "path": "natural_elements/Tree_idol_deer.png",
        "extension": ".png"
      },
      {
        "id": "Tree_idol_dragon",
        "name": "Tree idol dragon",
        "path": "natural_elements/Tree_idol_dragon.png",
        "extension": ".png"
      },
      {
        "id": "Tree_idol_human",
        "name": "Tree idol human",
        "path": "natural_elements/Tree_idol_human.png",
        "extension": ".png"
      },
      {
        "id": "Tree_idol_wolf",
        "name": "Tree idol wolf",
        "path": "natural_elements/Tree_idol_wolf.png",
        "extension": ".png"
      },
      {
        "id": "Water_ruins1",
        "name": "Water ruins1",
        "path": "natural_elements/Water_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Water_ruins2",
        "name": "Water ruins2",
        "path": "natural_elements/Water_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Water_ruins3",
        "name": "Water ruins3",
        "path": "natural_elements/Water_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Water_ruins4",
        "name": "Water ruins4",
        "path": "natural_elements/Water_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Water_ruins5",
        "name": "Water ruins5",
        "path": "natural_elements/Water_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "White-red_mushroom1",
        "name": "White red mushroom1",
        "path": "natural_elements/White-red_mushroom1.png",
        "extension": ".png"
      },
      {
        "id": "White-red_mushroom2",
        "name": "White red mushroom2",
        "path": "natural_elements/White-red_mushroom2.png",
        "extension": ".png"
      },
      {
        "id": "White-red_mushroom3",
        "name": "White red mushroom3",
        "path": "natural_elements/White-red_mushroom3.png",
        "extension": ".png"
      },
      {
        "id": "White_ruins1",
        "name": "White ruins1",
        "path": "natural_elements/White_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "White_ruins2",
        "name": "White ruins2",
        "path": "natural_elements/White_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "White_ruins3",
        "name": "White ruins3",
        "path": "natural_elements/White_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "White_ruins4",
        "name": "White ruins4",
        "path": "natural_elements/White_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "White_ruins5",
        "name": "White ruins5",
        "path": "natural_elements/White_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "White_tree1",
        "name": "White tree1",
        "path": "natural_elements/White_tree1.png",
        "extension": ".png"
      },
      {
        "id": "White_tree2",
        "name": "White tree2",
        "path": "natural_elements/White_tree2.png",
        "extension": ".png"
      },
      {
        "id": "Willow1",
        "name": "Willow1",
        "path": "natural_elements/Willow1.png",
        "extension": ".png"
      },
      {
        "id": "Willow2",
        "name": "Willow2",
        "path": "natural_elements/Willow2.png",
        "extension": ".png"
      },
      {
        "id": "Willow3",
        "name": "Willow3",
        "path": "natural_elements/Willow3.png",
        "extension": ".png"
      },
      {
        "id": "Yellow_ruins1",
        "name": "Yellow ruins1",
        "path": "natural_elements/Yellow_ruins1.png",
        "extension": ".png"
      },
      {
        "id": "Yellow_ruins2",
        "name": "Yellow ruins2",
        "path": "natural_elements/Yellow_ruins2.png",
        "extension": ".png"
      },
      {
        "id": "Yellow_ruins3",
        "name": "Yellow ruins3",
        "path": "natural_elements/Yellow_ruins3.png",
        "extension": ".png"
      },
      {
        "id": "Yellow_ruins4",
        "name": "Yellow ruins4",
        "path": "natural_elements/Yellow_ruins4.png",
        "extension": ".png"
      },
      {
        "id": "Yellow_ruins5",
        "name": "Yellow ruins5",
        "path": "natural_elements/Yellow_ruins5.png",
        "extension": ".png"
      },
      {
        "id": "troncos1",
        "name": "troncos1",
        "path": "natural_elements/troncos1.png",
        "extension": ".png"
      },
      {
        "id": "troncos2",
        "name": "troncos2",
        "path": "natural_elements/troncos2.png",
        "extension": ".png"
      },
      {
        "id": "troncos3",
        "name": "troncos3",
        "path": "natural_elements/troncos3.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 262
  },
  "structures": {
    "name": "structures",
    "path": "structures",
    "animations": [],
    "staticSprites": [
      {
        "id": "Assets_source_002_001",
        "name": "Assets source 002 001",
        "path": "structures/Assets_source_002_001.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_002",
        "name": "Assets source 002 002",
        "path": "structures/Assets_source_002_002.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_003",
        "name": "Assets source 002 003",
        "path": "structures/Assets_source_002_003.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_004",
        "name": "Assets source 002 004",
        "path": "structures/Assets_source_002_004.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_005",
        "name": "Assets source 002 005",
        "path": "structures/Assets_source_002_005.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_006",
        "name": "Assets source 002 006",
        "path": "structures/Assets_source_002_006.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_007",
        "name": "Assets source 002 007",
        "path": "structures/Assets_source_002_007.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_008",
        "name": "Assets source 002 008",
        "path": "structures/Assets_source_002_008.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_009",
        "name": "Assets source 002 009",
        "path": "structures/Assets_source_002_009.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_010",
        "name": "Assets source 002 010",
        "path": "structures/Assets_source_002_010.png",
        "extension": ".png"
      },
      {
        "id": "Assets_source_002_011",
        "name": "Assets source 002 011",
        "path": "structures/Assets_source_002_011.png",
        "extension": ".png"
      },
      {
        "id": "CityWall_Gate_1",
        "name": "CityWall Gate 1",
        "path": "structures/CityWall_Gate_1.png",
        "extension": ".png"
      },
      {
        "id": "Fences",
        "name": "Fences",
        "path": "structures/Fences.png",
        "extension": ".png"
      },
      {
        "id": "House",
        "name": "House",
        "path": "structures/House.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_1",
        "name": "House Hay 1",
        "path": "structures/House_Hay_1.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_2",
        "name": "House Hay 2",
        "path": "structures/House_Hay_2.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_3",
        "name": "House Hay 3",
        "path": "structures/House_Hay_3.png",
        "extension": ".png"
      },
      {
        "id": "House_Hay_4_Purple",
        "name": "House Hay 4 Purple",
        "path": "structures/House_Hay_4_Purple.png",
        "extension": ".png"
      },
      {
        "id": "Well_Hay_1",
        "name": "Well Hay 1",
        "path": "structures/Well_Hay_1.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 19
  },
  "terrain_tiles": {
    "name": "terrain_tiles",
    "path": "terrain_tiles",
    "animations": [],
    "staticSprites": [
      {
        "id": "Grass_Middle",
        "name": "Grass Middle",
        "path": "terrain_tiles/Grass_Middle.png",
        "extension": ".png"
      },
      {
        "id": "TexturedGrass",
        "name": "TexturedGrass",
        "path": "terrain_tiles/TexturedGrass.png",
        "extension": ".png"
      },
      {
        "id": "cesped1",
        "name": "cesped1",
        "path": "terrain_tiles/cesped1.png",
        "extension": ".png"
      },
      {
        "id": "cesped10",
        "name": "cesped10",
        "path": "terrain_tiles/cesped10.png",
        "extension": ".png"
      },
      {
        "id": "cesped11",
        "name": "cesped11",
        "path": "terrain_tiles/cesped11.png",
        "extension": ".png"
      },
      {
        "id": "cesped12",
        "name": "cesped12",
        "path": "terrain_tiles/cesped12.png",
        "extension": ".png"
      },
      {
        "id": "cesped13",
        "name": "cesped13",
        "path": "terrain_tiles/cesped13.png",
        "extension": ".png"
      },
      {
        "id": "cesped14",
        "name": "cesped14",
        "path": "terrain_tiles/cesped14.png",
        "extension": ".png"
      },
      {
        "id": "cesped15",
        "name": "cesped15",
        "path": "terrain_tiles/cesped15.png",
        "extension": ".png"
      },
      {
        "id": "cesped16",
        "name": "cesped16",
        "path": "terrain_tiles/cesped16.png",
        "extension": ".png"
      },
      {
        "id": "cesped17",
        "name": "cesped17",
        "path": "terrain_tiles/cesped17.png",
        "extension": ".png"
      },
      {
        "id": "cesped18",
        "name": "cesped18",
        "path": "terrain_tiles/cesped18.png",
        "extension": ".png"
      },
      {
        "id": "cesped19",
        "name": "cesped19",
        "path": "terrain_tiles/cesped19.png",
        "extension": ".png"
      },
      {
        "id": "cesped2",
        "name": "cesped2",
        "path": "terrain_tiles/cesped2.png",
        "extension": ".png"
      },
      {
        "id": "cesped20",
        "name": "cesped20",
        "path": "terrain_tiles/cesped20.png",
        "extension": ".png"
      },
      {
        "id": "cesped21",
        "name": "cesped21",
        "path": "terrain_tiles/cesped21.png",
        "extension": ".png"
      },
      {
        "id": "cesped22",
        "name": "cesped22",
        "path": "terrain_tiles/cesped22.png",
        "extension": ".png"
      },
      {
        "id": "cesped23",
        "name": "cesped23",
        "path": "terrain_tiles/cesped23.png",
        "extension": ".png"
      },
      {
        "id": "cesped24",
        "name": "cesped24",
        "path": "terrain_tiles/cesped24.png",
        "extension": ".png"
      },
      {
        "id": "cesped25",
        "name": "cesped25",
        "path": "terrain_tiles/cesped25.png",
        "extension": ".png"
      },
      {
        "id": "cesped26",
        "name": "cesped26",
        "path": "terrain_tiles/cesped26.png",
        "extension": ".png"
      },
      {
        "id": "cesped27",
        "name": "cesped27",
        "path": "terrain_tiles/cesped27.png",
        "extension": ".png"
      },
      {
        "id": "cesped28",
        "name": "cesped28",
        "path": "terrain_tiles/cesped28.png",
        "extension": ".png"
      },
      {
        "id": "cesped29",
        "name": "cesped29",
        "path": "terrain_tiles/cesped29.png",
        "extension": ".png"
      },
      {
        "id": "cesped3",
        "name": "cesped3",
        "path": "terrain_tiles/cesped3.png",
        "extension": ".png"
      },
      {
        "id": "cesped30",
        "name": "cesped30",
        "path": "terrain_tiles/cesped30.png",
        "extension": ".png"
      },
      {
        "id": "cesped31",
        "name": "cesped31",
        "path": "terrain_tiles/cesped31.png",
        "extension": ".png"
      },
      {
        "id": "cesped4",
        "name": "cesped4",
        "path": "terrain_tiles/cesped4.png",
        "extension": ".png"
      },
      {
        "id": "cesped5",
        "name": "cesped5",
        "path": "terrain_tiles/cesped5.png",
        "extension": ".png"
      },
      {
        "id": "cesped6",
        "name": "cesped6",
        "path": "terrain_tiles/cesped6.png",
        "extension": ".png"
      },
      {
        "id": "cesped7",
        "name": "cesped7",
        "path": "terrain_tiles/cesped7.png",
        "extension": ".png"
      },
      {
        "id": "cesped8",
        "name": "cesped8",
        "path": "terrain_tiles/cesped8.png",
        "extension": ".png"
      },
      {
        "id": "cesped9",
        "name": "cesped9",
        "path": "terrain_tiles/cesped9.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 33
  },
  "ui_icons": {
    "name": "ui_icons",
    "path": "ui_icons",
    "animations": [],
    "staticSprites": [
      {
        "id": "ARZone",
        "name": "ARZone",
        "path": "ui_icons/ARZone.png",
        "extension": ".png"
      },
      {
        "id": "Air Europa",
        "name": "Air Europa",
        "path": "ui_icons/Air Europa.png",
        "extension": ".png"
      },
      {
        "id": "AirBnB",
        "name": "AirBnB",
        "path": "ui_icons/AirBnB.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Prime",
        "name": "Amazon Prime",
        "path": "ui_icons/Amazon Prime.png",
        "extension": ".png"
      },
      {
        "id": "Amazon Shopping",
        "name": "Amazon Shopping",
        "path": "ui_icons/Amazon Shopping.png",
        "extension": ".png"
      },
      {
        "id": "Amazon",
        "name": "Amazon",
        "path": "ui_icons/Amazon.png",
        "extension": ".png"
      },
      {
        "id": "ArtStation",
        "name": "ArtStation",
        "path": "ui_icons/ArtStation.png",
        "extension": ".png"
      },
      {
        "id": "Authy",
        "name": "Authy",
        "path": "ui_icons/Authy.png",
        "extension": ".png"
      },
      {
        "id": "Battle",
        "name": "Battle",
        "path": "ui_icons/Battle.png",
        "extension": ".png"
      },
      {
        "id": "Booking",
        "name": "Booking",
        "path": "ui_icons/Booking.png",
        "extension": ".png"
      },
      {
        "id": "CityMapper",
        "name": "CityMapper",
        "path": "ui_icons/CityMapper.png",
        "extension": ".png"
      },
      {
        "id": "Cuenta DNI",
        "name": "Cuenta DNI",
        "path": "ui_icons/Cuenta DNI.png",
        "extension": ".png"
      },
      {
        "id": "Deliveroo",
        "name": "Deliveroo",
        "path": "ui_icons/Deliveroo.png",
        "extension": ".png"
      },
      {
        "id": "Deviantart",
        "name": "Deviantart",
        "path": "ui_icons/Deviantart.png",
        "extension": ".png"
      },
      {
        "id": "Discord",
        "name": "Discord",
        "path": "ui_icons/Discord.png",
        "extension": ".png"
      },
      {
        "id": "Duolingo",
        "name": "Duolingo",
        "path": "ui_icons/Duolingo.png",
        "extension": ".png"
      },
      {
        "id": "Evernote",
        "name": "Evernote",
        "path": "ui_icons/Evernote.png",
        "extension": ".png"
      },
      {
        "id": "Express VPN",
        "name": "Express VPN",
        "path": "ui_icons/Express VPN.png",
        "extension": ".png"
      },
      {
        "id": "Facebook Messenger",
        "name": "Facebook Messenger",
        "path": "ui_icons/Facebook Messenger.png",
        "extension": ".png"
      },
      {
        "id": "Facebook",
        "name": "Facebook",
        "path": "ui_icons/Facebook.png",
        "extension": ".png"
      },
      {
        "id": "Firefox",
        "name": "Firefox",
        "path": "ui_icons/Firefox.png",
        "extension": ".png"
      },
      {
        "id": "FitBod",
        "name": "FitBod",
        "path": "ui_icons/FitBod.png",
        "extension": ".png"
      },
      {
        "id": "Galaxy Store",
        "name": "Galaxy Store",
        "path": "ui_icons/Galaxy Store.png",
        "extension": ".png"
      },
      {
        "id": "Glovo",
        "name": "Glovo",
        "path": "ui_icons/Glovo.png",
        "extension": ".png"
      },
      {
        "id": "Gmail",
        "name": "Gmail",
        "path": "ui_icons/Gmail.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator Old",
        "name": "Google Authentificator Old",
        "path": "ui_icons/Google Authentificator Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Authentificator",
        "name": "Google Authentificator",
        "path": "ui_icons/Google Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Google Calendar",
        "name": "Google Calendar",
        "path": "ui_icons/Google Calendar.png",
        "extension": ".png"
      },
      {
        "id": "Google Chrome",
        "name": "Google Chrome",
        "path": "ui_icons/Google Chrome.png",
        "extension": ".png"
      },
      {
        "id": "Google Currents",
        "name": "Google Currents",
        "path": "ui_icons/Google Currents.png",
        "extension": ".png"
      },
      {
        "id": "Google Docs",
        "name": "Google Docs",
        "path": "ui_icons/Google Docs.png",
        "extension": ".png"
      },
      {
        "id": "Google Drive",
        "name": "Google Drive",
        "path": "ui_icons/Google Drive.png",
        "extension": ".png"
      },
      {
        "id": "Google Files",
        "name": "Google Files",
        "path": "ui_icons/Google Files.png",
        "extension": ".png"
      },
      {
        "id": "Google Fit",
        "name": "Google Fit",
        "path": "ui_icons/Google Fit.png",
        "extension": ".png"
      },
      {
        "id": "Google Forms",
        "name": "Google Forms",
        "path": "ui_icons/Google Forms.png",
        "extension": ".png"
      },
      {
        "id": "Google Hangouts",
        "name": "Google Hangouts",
        "path": "ui_icons/Google Hangouts.png",
        "extension": ".png"
      },
      {
        "id": "Google Keep",
        "name": "Google Keep",
        "path": "ui_icons/Google Keep.png",
        "extension": ".png"
      },
      {
        "id": "Google Launcher",
        "name": "Google Launcher",
        "path": "ui_icons/Google Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps Old",
        "name": "Google Maps Old",
        "path": "ui_icons/Google Maps Old.png",
        "extension": ".png"
      },
      {
        "id": "Google Maps",
        "name": "Google Maps",
        "path": "ui_icons/Google Maps.png",
        "extension": ".png"
      },
      {
        "id": "Google Photos",
        "name": "Google Photos",
        "path": "ui_icons/Google Photos.png",
        "extension": ".png"
      },
      {
        "id": "Google Playstore",
        "name": "Google Playstore",
        "path": "ui_icons/Google Playstore.png",
        "extension": ".png"
      },
      {
        "id": "Google Podcasts",
        "name": "Google Podcasts",
        "path": "ui_icons/Google Podcasts.png",
        "extension": ".png"
      },
      {
        "id": "Google Sheets",
        "name": "Google Sheets",
        "path": "ui_icons/Google Sheets.png",
        "extension": ".png"
      },
      {
        "id": "Google Slides",
        "name": "Google Slides",
        "path": "ui_icons/Google Slides.png",
        "extension": ".png"
      },
      {
        "id": "Google TV",
        "name": "Google TV",
        "path": "ui_icons/Google TV.png",
        "extension": ".png"
      },
      {
        "id": "Google TalkBack",
        "name": "Google TalkBack",
        "path": "ui_icons/Google TalkBack.png",
        "extension": ".png"
      },
      {
        "id": "Google Text to Speech",
        "name": "Google Text to Speech",
        "path": "ui_icons/Google Text to Speech.png",
        "extension": ".png"
      },
      {
        "id": "Google Translate",
        "name": "Google Translate",
        "path": "ui_icons/Google Translate.png",
        "extension": ".png"
      },
      {
        "id": "Google Wallet",
        "name": "Google Wallet",
        "path": "ui_icons/Google Wallet.png",
        "extension": ".png"
      },
      {
        "id": "Google",
        "name": "Google",
        "path": "ui_icons/Google.png",
        "extension": ".png"
      },
      {
        "id": "Idealista",
        "name": "Idealista",
        "path": "ui_icons/Idealista.png",
        "extension": ".png"
      },
      {
        "id": "Instagram Old",
        "name": "Instagram Old",
        "path": "ui_icons/Instagram Old.png",
        "extension": ".png"
      },
      {
        "id": "Instagram",
        "name": "Instagram",
        "path": "ui_icons/Instagram.png",
        "extension": ".png"
      },
      {
        "id": "Itch io",
        "name": "Itch io",
        "path": "ui_icons/Itch io.png",
        "extension": ".png"
      },
      {
        "id": "Ko Fi",
        "name": "Ko Fi",
        "path": "ui_icons/Ko Fi.png",
        "extension": ".png"
      },
      {
        "id": "Letterboxd",
        "name": "Letterboxd",
        "path": "ui_icons/Letterboxd.png",
        "extension": ".png"
      },
      {
        "id": "LinkedIn",
        "name": "LinkedIn",
        "path": "ui_icons/LinkedIn.png",
        "extension": ".png"
      },
      {
        "id": "Lloyds Bank",
        "name": "Lloyds Bank",
        "path": "ui_icons/Lloyds Bank.png",
        "extension": ".png"
      },
      {
        "id": "London Guide",
        "name": "London Guide",
        "path": "ui_icons/London Guide.png",
        "extension": ".png"
      },
      {
        "id": "London Offline Map",
        "name": "London Offline Map",
        "path": "ui_icons/London Offline Map.png",
        "extension": ".png"
      },
      {
        "id": "London Tube Map",
        "name": "London Tube Map",
        "path": "ui_icons/London Tube Map.png",
        "extension": ".png"
      },
      {
        "id": "Mercadolibre",
        "name": "Mercadolibre",
        "path": "ui_icons/Mercadolibre.png",
        "extension": ".png"
      },
      {
        "id": "Mercadopago",
        "name": "Mercadopago",
        "path": "ui_icons/Mercadopago.png",
        "extension": ".png"
      },
      {
        "id": "Mi Argentina",
        "name": "Mi Argentina",
        "path": "ui_icons/Mi Argentina.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Access",
        "name": "Microsoft Access",
        "path": "ui_icons/Microsoft Access.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Authentificator",
        "name": "Microsoft Authentificator",
        "path": "ui_icons/Microsoft Authentificator.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Edge",
        "name": "Microsoft Edge",
        "path": "ui_icons/Microsoft Edge.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Excel",
        "name": "Microsoft Excel",
        "path": "ui_icons/Microsoft Excel.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Launcher",
        "name": "Microsoft Launcher",
        "path": "ui_icons/Microsoft Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Link to Windows",
        "name": "Microsoft Link to Windows",
        "path": "ui_icons/Microsoft Link to Windows.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Office",
        "name": "Microsoft Office",
        "path": "ui_icons/Microsoft Office.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneDrive",
        "name": "Microsoft OneDrive",
        "path": "ui_icons/Microsoft OneDrive.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft OneNote",
        "name": "Microsoft OneNote",
        "path": "ui_icons/Microsoft OneNote.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft PowerPoint",
        "name": "Microsoft PowerPoint",
        "path": "ui_icons/Microsoft PowerPoint.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Publisher",
        "name": "Microsoft Publisher",
        "path": "ui_icons/Microsoft Publisher.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft To Do",
        "name": "Microsoft To Do",
        "path": "ui_icons/Microsoft To Do.png",
        "extension": ".png"
      },
      {
        "id": "Microsoft Word",
        "name": "Microsoft Word",
        "path": "ui_icons/Microsoft Word.png",
        "extension": ".png"
      },
      {
        "id": "Miro",
        "name": "Miro",
        "path": "ui_icons/Miro.png",
        "extension": ".png"
      },
      {
        "id": "Moj",
        "name": "Moj",
        "path": "ui_icons/Moj.png",
        "extension": ".png"
      },
      {
        "id": "My Fitness Pal",
        "name": "My Fitness Pal",
        "path": "ui_icons/My Fitness Pal.png",
        "extension": ".png"
      },
      {
        "id": "Netflix v2",
        "name": "Netflix v2",
        "path": "ui_icons/Netflix v2.png",
        "extension": ".png"
      },
      {
        "id": "Netflix",
        "name": "Netflix",
        "path": "ui_icons/Netflix.png",
        "extension": ".png"
      },
      {
        "id": "Notion",
        "name": "Notion",
        "path": "ui_icons/Notion.png",
        "extension": ".png"
      },
      {
        "id": "Nova Launcher",
        "name": "Nova Launcher",
        "path": "ui_icons/Nova Launcher.png",
        "extension": ".png"
      },
      {
        "id": "Nuffield Health",
        "name": "Nuffield Health",
        "path": "ui_icons/Nuffield Health.png",
        "extension": ".png"
      },
      {
        "id": "Opera",
        "name": "Opera",
        "path": "ui_icons/Opera.png",
        "extension": ".png"
      },
      {
        "id": "Outlook",
        "name": "Outlook",
        "path": "ui_icons/Outlook.png",
        "extension": ".png"
      },
      {
        "id": "Patreon",
        "name": "Patreon",
        "path": "ui_icons/Patreon.png",
        "extension": ".png"
      },
      {
        "id": "PayPal",
        "name": "PayPal",
        "path": "ui_icons/PayPal.png",
        "extension": ".png"
      },
      {
        "id": "PedidosYa",
        "name": "PedidosYa",
        "path": "ui_icons/PedidosYa.png",
        "extension": ".png"
      },
      {
        "id": "Pikmin",
        "name": "Pikmin",
        "path": "ui_icons/Pikmin.png",
        "extension": ".png"
      },
      {
        "id": "Pinterest",
        "name": "Pinterest",
        "path": "ui_icons/Pinterest.png",
        "extension": ".png"
      },
      {
        "id": "Reddit",
        "name": "Reddit",
        "path": "ui_icons/Reddit.png",
        "extension": ".png"
      },
      {
        "id": "Rubiks Cube",
        "name": "Rubiks Cube",
        "path": "ui_icons/Rubiks Cube.png",
        "extension": ".png"
      },
      {
        "id": "Safari",
        "name": "Safari",
        "path": "ui_icons/Safari.png",
        "extension": ".png"
      },
      {
        "id": "Samsung Free",
        "name": "Samsung Free",
        "path": "ui_icons/Samsung Free.png",
        "extension": ".png"
      },
      {
        "id": "Santander",
        "name": "Santander",
        "path": "ui_icons/Santander.png",
        "extension": ".png"
      },
      {
        "id": "Skype",
        "name": "Skype",
        "path": "ui_icons/Skype.png",
        "extension": ".png"
      },
      {
        "id": "Slack v2",
        "name": "Slack v2",
        "path": "ui_icons/Slack v2.png",
        "extension": ".png"
      },
      {
        "id": "Slack",
        "name": "Slack",
        "path": "ui_icons/Slack.png",
        "extension": ".png"
      },
      {
        "id": "Snapchat",
        "name": "Snapchat",
        "path": "ui_icons/Snapchat.png",
        "extension": ".png"
      },
      {
        "id": "SocioPlus",
        "name": "SocioPlus",
        "path": "ui_icons/SocioPlus.png",
        "extension": ".png"
      },
      {
        "id": "SoundCloud",
        "name": "SoundCloud",
        "path": "ui_icons/SoundCloud.png",
        "extension": ".png"
      },
      {
        "id": "Spareroom",
        "name": "Spareroom",
        "path": "ui_icons/Spareroom.png",
        "extension": ".png"
      },
      {
        "id": "Spotify",
        "name": "Spotify",
        "path": "ui_icons/Spotify.png",
        "extension": ".png"
      },
      {
        "id": "Steam",
        "name": "Steam",
        "path": "ui_icons/Steam.png",
        "extension": ".png"
      },
      {
        "id": "Tarjeta Transporte Madrid",
        "name": "Tarjeta Transporte Madrid",
        "path": "ui_icons/Tarjeta Transporte Madrid.png",
        "extension": ".png"
      },
      {
        "id": "Telegram",
        "name": "Telegram",
        "path": "ui_icons/Telegram.png",
        "extension": ".png"
      },
      {
        "id": "Terraria",
        "name": "Terraria",
        "path": "ui_icons/Terraria.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Go",
        "name": "Tfl Go",
        "path": "ui_icons/Tfl Go.png",
        "extension": ".png"
      },
      {
        "id": "Tfl Oyster",
        "name": "Tfl Oyster",
        "path": "ui_icons/Tfl Oyster.png",
        "extension": ".png"
      },
      {
        "id": "TickTick",
        "name": "TickTick",
        "path": "ui_icons/TickTick.png",
        "extension": ".png"
      },
      {
        "id": "TikTok",
        "name": "TikTok",
        "path": "ui_icons/TikTok.png",
        "extension": ".png"
      },
      {
        "id": "Tinder",
        "name": "Tinder",
        "path": "ui_icons/Tinder.png",
        "extension": ".png"
      },
      {
        "id": "Todoist",
        "name": "Todoist",
        "path": "ui_icons/Todoist.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Blue Icon",
        "name": "Toggl Blue Icon",
        "path": "ui_icons/Toggl Blue Icon.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Hire",
        "name": "Toggl Hire",
        "path": "ui_icons/Toggl Hire.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Plan",
        "name": "Toggl Plan",
        "path": "ui_icons/Toggl Plan.png",
        "extension": ".png"
      },
      {
        "id": "Toggl Track",
        "name": "Toggl Track",
        "path": "ui_icons/Toggl Track.png",
        "extension": ".png"
      },
      {
        "id": "Toggl",
        "name": "Toggl",
        "path": "ui_icons/Toggl.png",
        "extension": ".png"
      },
      {
        "id": "Trello v2",
        "name": "Trello v2",
        "path": "ui_icons/Trello v2.png",
        "extension": ".png"
      },
      {
        "id": "Trello",
        "name": "Trello",
        "path": "ui_icons/Trello.png",
        "extension": ".png"
      },
      {
        "id": "Tumblr",
        "name": "Tumblr",
        "path": "ui_icons/Tumblr.png",
        "extension": ".png"
      },
      {
        "id": "Twitch",
        "name": "Twitch",
        "path": "ui_icons/Twitch.png",
        "extension": ".png"
      },
      {
        "id": "Twitter",
        "name": "Twitter",
        "path": "ui_icons/Twitter.png",
        "extension": ".png"
      },
      {
        "id": "Uber Eats",
        "name": "Uber Eats",
        "path": "ui_icons/Uber Eats.png",
        "extension": ".png"
      },
      {
        "id": "Uber",
        "name": "Uber",
        "path": "ui_icons/Uber.png",
        "extension": ".png"
      },
      {
        "id": "Vitality GP",
        "name": "Vitality GP",
        "path": "ui_icons/Vitality GP.png",
        "extension": ".png"
      },
      {
        "id": "Vitality",
        "name": "Vitality",
        "path": "ui_icons/Vitality.png",
        "extension": ".png"
      },
      {
        "id": "Vivaldi",
        "name": "Vivaldi",
        "path": "ui_icons/Vivaldi.png",
        "extension": ".png"
      },
      {
        "id": "Vodafone",
        "name": "Vodafone",
        "path": "ui_icons/Vodafone.png",
        "extension": ".png"
      },
      {
        "id": "Whatsapp",
        "name": "Whatsapp",
        "path": "ui_icons/Whatsapp.png",
        "extension": ".png"
      },
      {
        "id": "Wikipedia",
        "name": "Wikipedia",
        "path": "ui_icons/Wikipedia.png",
        "extension": ".png"
      },
      {
        "id": "WinRAR",
        "name": "WinRAR",
        "path": "ui_icons/WinRAR.png",
        "extension": ".png"
      },
      {
        "id": "Youtube",
        "name": "Youtube",
        "path": "ui_icons/Youtube.png",
        "extension": ".png"
      },
      {
        "id": "Zoom",
        "name": "Zoom",
        "path": "ui_icons/Zoom.png",
        "extension": ".png"
      }
    ],
    "totalAssets": 137
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
