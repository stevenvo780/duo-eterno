#!/usr/bin/env node

/**
 * 🎬 Spritesheet Detector - Sistema Inteligente de Detección de Sprites
 *
 * Detecta automáticamente spritesheets en imágenes y genera:
 * - Metadatos de animación
 * - División automática de frames
 * - Configuración inteligente basada en dimensiones
 *
 * Funciona como los motores gráficos modernos (Unity, Unreal, Godot)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración del detector
const CONFIG = {
  // Directorios a escanear (solo carpetas que probablemente contengan animaciones)
  assetPaths: [
    'public/assets/animations', // Carpeta principal de animaciones
    'public/assets/activities', // Actividades pueden tener animaciones
    'public/assets/nature' // Solo árboles/plantas que puedan animarse
  ],

  // Dimensiones mínimas para considerar un spritesheet
  minSpritesheetSize: {
    width: 64,
    height: 64
  },

  // Tamaños de frame comunes (como en motores gráficos)
  commonFrameSizes: [
    { width: 16, height: 16 }, // Pixel art pequeño
    { width: 24, height: 24 }, // Pixel art mediano
    { width: 32, height: 32 }, // Estándar retro
    { width: 48, height: 48 }, // Estándar moderno
    { width: 64, height: 64 }, // Alta resolución
    { width: 96, height: 96 }, // Muy alta resolución
    { width: 120, height: 120 } // Ultra alta resolución
  ],

  // Patrones de nombres que sugieren spritesheets
  spritesheetPatterns: [
    /sheet/i,
    /atlas/i,
    /sprite/i,
    /anim/i,
    /frames/i,
    /sequence/i,
    /idle/i,
    /walk/i,
    /run/i,
    /jump/i
  ],

  // Tipos de animación a generar
  animationTypes: {
    idle: { duration: 80, loop: true },
    walk: { duration: 60, loop: true },
    run: { duration: 40, loop: true },
    jump: { duration: 100, loop: false },
    default: { duration: 80, loop: true }
  }
};

class SpritesheetDetector {
  constructor() {
    this.detectedSpritesheets = [];
    this.generatedAnimations = [];
    this.stats = {
      imagesScanned: 0,
      spritesheetsDetected: 0,
      animationsGenerated: 0,
      framesSplit: 0
    };
  }

  /**
   * Obtiene las dimensiones de una imagen usando Node.js puro
   * (alternativa ligera sin dependencias externas)
   */
  getImageDimensions(imagePath) {
    try {
      const data = fs.readFileSync(imagePath);

      // PNG signature check
      if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
        // PNG: width and height are at bytes 16-19 and 20-23
        const width = data.readUInt32BE(16);
        const height = data.readUInt32BE(20);
        return { width, height };
      }

      console.warn(`⚠️ Formato no soportado: ${imagePath}`);
      return null;
    } catch (error) {
      console.warn(`⚠️ No se pudo leer: ${imagePath}`, error.message);
      return null;
    }
  }

  /**
   * Detecta si una imagen es un spritesheet basándose en:
   * - Dimensiones múltiples de tamaños comunes
   * - Relación aspecto
   * - Nombre del archivo
   */
  detectSpritesheet(imagePath, dimensions) {
    const { width, height } = dimensions;
    const filename = path.basename(imagePath, '.png').toLowerCase();

    // 1. Verificar patrones en el nombre
    const hasPattern = CONFIG.spritesheetPatterns.some(pattern => pattern.test(filename));

    // 2. Verificar si las dimensiones son múltiples exactos de tamaños comunes
    const possibleLayouts = [];

    for (const frameSize of CONFIG.commonFrameSizes) {
      const cols = width / frameSize.width;
      const rows = height / frameSize.height;

      // Debe ser división exacta y tener al menos 2 frames
      if (Number.isInteger(cols) && Number.isInteger(rows) && cols * rows >= 2) {
        possibleLayouts.push({
          frameWidth: frameSize.width,
          frameHeight: frameSize.height,
          columns: cols,
          rows: rows,
          totalFrames: cols * rows,
          confidence: this.calculateConfidence(filename, cols, rows, frameSize)
        });
      }
    }

    // 3. Seleccionar el layout más probable con confianza mínima
    if (possibleLayouts.length > 0) {
      const bestLayout = possibleLayouts.sort((a, b) => b.confidence - a.confidence)[0];

      // Solo considerar como spritesheet si tiene confianza alta (>= 40)
      if (bestLayout.confidence >= 40) {
        return {
          isSpritesheet: true,
          layout: bestLayout,
          hasNamePattern: hasPattern,
          animationType: this.guessAnimationType(filename)
        };
      }
    }

    return { isSpritesheet: false };
  }

  /**
   * Calcula la confianza de que un layout sea correcto
   */
  calculateConfidence(filename, cols, rows, frameSize) {
    let confidence = 0;

    // Bonus por dimensiones comunes
    if ([16, 24, 32, 48, 64].includes(frameSize.width)) confidence += 20;

    // Bonus por número razonable de frames
    const totalFrames = cols * rows;
    if (totalFrames >= 4 && totalFrames <= 64) confidence += 15;

    // Bonus por grids cuadrados o rectangulares comunes
    if (cols === rows) confidence += 10; // Grid cuadrado
    if (cols % 4 === 0 || rows % 4 === 0) confidence += 10; // Múltiplos de 4

    // Bonus por patrones en el nombre
    if (/walk|run|idle|jump|attack|move|cycle|loop/.test(filename)) confidence += 25;
    if (/anim|sprite|sheet/.test(filename)) confidence += 15;

    // Bonus GRANDE por estar en carpeta animations
    if (filename.includes('animations/')) confidence += 30;

    // Penalty fuerte para imágenes que claramente no son animaciones
    if (/logo|icon|ui|button|background|bg|tile|static/.test(filename)) confidence -= 40;
    if (/banner|stick|barrel|basket|bench|sign|house|building/.test(filename)) confidence -= 30;
    if (/food|fruit|vegetable|item|tool|weapon/.test(filename)) confidence -= 25;

    // Penalty por grids muy grandes o muy pequeños
    if (totalFrames > 100) confidence -= 20;
    if (totalFrames < 4) confidence -= 30; // Aumentar penalty para pocos frames

    // Penalty para dimensiones que no son potencias de 2 o múltiplos comunes
    if (frameSize.width % 8 !== 0 || frameSize.height % 8 !== 0) confidence -= 10;

    return confidence;
  }

  /**
   * Adivina el tipo de animación basándose en el nombre
   */
  guessAnimationType(filename) {
    if (/idle|static|stand/.test(filename)) return 'idle';
    if (/walk|step/.test(filename)) return 'walk';
    if (/run|sprint/.test(filename)) return 'run';
    if (/jump|leap/.test(filename)) return 'jump';
    return 'default';
  }

  /**
   * Genera metadatos JSON para una animación
   */
  generateAnimationMetadata(imagePath, detection) {
    const { layout, animationType } = detection;
    const animConfig = CONFIG.animationTypes[animationType];
    const filename = path.basename(imagePath, '.png');

    // Crear frames individuales
    const frames = [];
    for (let i = 0; i < layout.totalFrames; i++) {
      frames.push({
        duration: animConfig.duration,
        x: (i % layout.columns) * layout.frameWidth,
        y: Math.floor(i / layout.columns) * layout.frameHeight,
        width: layout.frameWidth,
        height: layout.frameHeight
      });
    }

    return {
      name: animationType,
      frame_count: layout.totalFrames,
      frame_size: [layout.frameWidth, layout.frameHeight],
      columns: layout.columns,
      rows: layout.rows,
      total_duration: layout.totalFrames * animConfig.duration,
      loop: animConfig.loop,
      fps: Math.round(1000 / animConfig.duration),
      frames: frames,

      // Metadatos adicionales del motor
      source_image: path.basename(imagePath),
      detected_automatically: true,
      detection_confidence: layout.confidence,
      engine_version: 'duo-eterno-v1.0',
      created_at: new Date().toISOString()
    };
  }

  /**
   * Procesa un directorio de imágenes
   */
  async processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.warn(`⚠️ Directorio no encontrado: ${dirPath}`);
      return;
    }

    console.log(`🔍 Escaneando: ${dirPath}`);
    const files = fs.readdirSync(dirPath);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    for (const file of pngFiles) {
      const imagePath = path.join(dirPath, file);
      this.stats.imagesScanned++;

      // Obtener dimensiones
      const dimensions = this.getImageDimensions(imagePath);
      if (!dimensions) continue;

      // Verificar si cumple tamaño mínimo
      if (
        dimensions.width < CONFIG.minSpritesheetSize.width ||
        dimensions.height < CONFIG.minSpritesheetSize.height
      ) {
        continue;
      }

      // Detectar spritesheet
      const detection = this.detectSpritesheet(imagePath, dimensions);

      if (detection.isSpritesheet) {
        console.log(`🎬 Spritesheet detectado: ${file}`);
        console.log(
          `   └─ ${detection.layout.columns}x${detection.layout.rows} frames (${detection.layout.frameWidth}x${detection.layout.frameHeight}px)`
        );
        console.log(
          `   └─ Tipo: ${detection.animationType} | Confianza: ${detection.layout.confidence}%`
        );

        this.detectedSpritesheets.push({
          path: imagePath,
          detection,
          dimensions
        });

        this.stats.spritesheetsDetected++;
        this.stats.framesSplit += detection.layout.totalFrames;

        // Generar metadatos
        await this.generateAnimationFiles(imagePath, detection);
      }
    }
  }

  /**
   * Genera archivos de animación para un spritesheet detectado
   */
  async generateAnimationFiles(imagePath, detection) {
    const basename = path.basename(imagePath, '.png');
    const dirPath = path.dirname(imagePath);
    const { animationType } = detection;

    // Crear nombre para la animación
    const animationName = `${basename}_${animationType}_detected`;
    const metadataPath = path.join(dirPath, `${animationName}.json`);

    // Verificar si ya existe
    if (fs.existsSync(metadataPath)) {
      console.log(`   └─ ⏭️ Ya existe: ${animationName}.json`);
      return;
    }

    // Generar metadatos
    const metadata = this.generateAnimationMetadata(imagePath, detection);

    // Guardar archivo JSON
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`   └─ ✅ Generado: ${animationName}.json`);
    this.generatedAnimations.push({
      name: animationName,
      metadataPath,
      sourcePath: imagePath,
      type: animationType
    });

    this.stats.animationsGenerated++;
  }

  /**
   * Genera reporte final
   */
  generateReport() {
    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        engine_version: 'duo-eterno-v1.0',
        ...this.stats
      },
      detectedSpritesheets: this.detectedSpritesheets.map(sprite => ({
        path: sprite.path,
        dimensions: sprite.dimensions,
        layout: sprite.detection.layout,
        type: sprite.detection.animationType
      })),
      generatedAnimations: this.generatedAnimations
    };

    const reportPath = 'src/generated/spritesheet-detection-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 REPORTE DE DETECCIÓN DE SPRITESHEETS');
    console.log('=====================================');
    console.log(`🔍 Imágenes escaneadas: ${this.stats.imagesScanned}`);
    console.log(`🎬 Spritesheets detectados: ${this.stats.spritesheetsDetected}`);
    console.log(`📄 Animaciones generadas: ${this.stats.animationsGenerated}`);
    console.log(`🖼️ Frames totales: ${this.stats.framesSplit}`);
    console.log(`📋 Reporte guardado en: ${reportPath}`);

    if (this.stats.spritesheetsDetected > 0) {
      console.log('\n🎭 SPRITESHEETS DETECTADOS:');
      this.detectedSpritesheets.forEach(sprite => {
        const name = path.basename(sprite.path);
        const { layout } = sprite.detection;
        console.log(`   📁 ${name}`);
        console.log(`      └─ ${layout.columns}x${layout.rows} (${layout.totalFrames} frames)`);
        console.log(`      └─ Frame: ${layout.frameWidth}x${layout.frameHeight}px`);
        console.log(`      └─ Tipo: ${sprite.detection.animationType}`);
      });
    }
  }

  /**
   * Ejecuta la detección completa
   */
  async run() {
    console.log('🎬 DETECTOR DE SPRITESHEETS INICIADO');
    console.log('===================================');
    console.log('Motor: Duo Eterno Engine v1.0');
    console.log('Modo: Detección automática inteligente\n');

    // Crear directorio de salida si no existe
    const outputDir = 'src/generated';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Procesar cada directorio
    for (const assetPath of CONFIG.assetPaths) {
      await this.processDirectory(assetPath);
    }

    // Generar reporte
    this.generateReport();

    console.log('\n✅ Detección completada!');
    console.log('💡 Ejecuta `npm run sprite-loader` para actualizar el manifest');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const detector = new SpritesheetDetector();
  detector.run().catch(console.error);
}

module.exports = SpritesheetDetector;
