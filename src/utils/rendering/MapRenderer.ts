/**
 * Sistema de renderizado principal profesional
 * Combina tile rendering, object rendering y efectos
 */

import { tileRenderer, type TerrainMap } from './TileRenderer';
import { objectRenderer } from './ObjectRenderer';
import type { Zone, MapElement, Entity } from '../../types';

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export interface RenderSettings {
  enableShadows: boolean;
  enableLighting: boolean;
  enableParticles: boolean;
  debugMode: boolean;
  qualityLevel: 'low' | 'medium' | 'high';
}

export interface SceneData {
  terrainMap: TerrainMap;
  zones: Zone[];
  mapElements: MapElement[];
  entities: Entity[];
}

export class MapRenderer {
  private terrainMap: TerrainMap | null = null;
  private settings: RenderSettings;
  private initialized = false;

  constructor() {
    this.settings = {
      enableShadows: true,
      enableLighting: true,
      enableParticles: true,
      debugMode: false,
      qualityLevel: 'high'
    };
  }

  /**
   * Inicializa el renderer con los datos de la escena
   */
  public async initialize(sceneData: SceneData): Promise<void> {
    console.log('🎬 MapRenderer: Inicializando...');
    
    try {
      // Generar mapa de terreno
      this.terrainMap = tileRenderer.generateTerrainMap(
        sceneData.zones.reduce((max, zone) => Math.max(max, zone.bounds.x + zone.bounds.width), 800),
        sceneData.zones.reduce((max, zone) => Math.max(max, zone.bounds.y + zone.bounds.height), 600)
      );

      // Generar objetos del juego
      objectRenderer.generateGameObjects(sceneData.zones, sceneData.mapElements);

      this.initialized = true;
      console.log('✅ MapRenderer: Inicialización completada');
    } catch (error) {
      console.error('❌ Error inicializando MapRenderer:', error);
    }
  }

  /**
   * Renderiza la escena completa
   */
  public render(
    ctx: CanvasRenderingContext2D,
    viewport: Viewport,
    sceneData: SceneData,
    lightIntensity: number = 1,
    skyColor: string = '#87CEEB'
  ): void {
    if (!this.initialized || !this.terrainMap) {
      this.renderFallback(ctx, viewport, skyColor);
      return;
    }

    ctx.save();

    // 1. Limpiar canvas
    this.clearCanvas(ctx, viewport, skyColor);

    // 2. Aplicar transformaciones de viewport
    this.applyViewportTransform(ctx, viewport);

    // 3. Renderizar terreno (capa base)
    this.renderTerrain(ctx, viewport);

    // 4. Renderizar zonas de debug si está habilitado
    if (this.settings.debugMode) {
      this.renderZonesDebug(ctx, sceneData.zones, viewport);
    }

    // 5. Renderizar objetos en capas
    this.renderObjects(ctx, viewport);

    // 6. Renderizar entidades
    this.renderEntities(ctx, sceneData.entities, viewport);

    // 7. Aplicar efectos de iluminación
    if (this.settings.enableLighting) {
      this.applyLightingEffects(ctx, viewport, lightIntensity);
    }

    // 8. Renderizar efectos de partículas
    if (this.settings.enableParticles) {
      this.renderParticles(ctx, viewport);
    }

    ctx.restore();

    // 9. Renderizar UI y debug info
    this.renderUI(ctx, viewport, sceneData);
  }

  private clearCanvas(ctx: CanvasRenderingContext2D, viewport: Viewport, skyColor: string): void {
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  }

  private applyViewportTransform(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.x, -viewport.y);
  }

  private renderTerrain(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    if (!this.terrainMap) return;

    tileRenderer.renderTerrain(
      ctx,
      this.terrainMap,
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height,
      viewport.zoom
    );
  }

  private renderObjects(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
    objectRenderer.renderObjects(
      ctx,
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height,
      viewport.zoom
    );
  }

  private renderEntities(ctx: CanvasRenderingContext2D, entities: Entity[], viewport: Viewport): void {
    entities.forEach(entity => {
      if (!entity || entity.isDead) return;

      const screenX = (entity.position.x - viewport.x) * viewport.zoom;
      const screenY = (entity.position.y - viewport.y) * viewport.zoom;

      // Culling: No renderizar entidades fuera de pantalla
      if (screenX < -50 || screenX > viewport.width + 50 ||
          screenY < -50 || screenY > viewport.height + 50) {
        return;
      }

      ctx.save();

      // Renderizar sombra de entidad
      if (this.settings.enableShadows) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(screenX + 2, screenY + 18, 12, 6, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Renderizar entidad
      const size = 24 * viewport.zoom;
      if (entity.id === 'circle') {
        ctx.fillStyle = this.getEntityColor(entity);
        ctx.beginPath();
        ctx.arc(screenX, screenY, size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (entity.id === 'square') {
        ctx.fillStyle = this.getEntityColor(entity);
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - size / 2, screenY - size / 2, size, size);
      }

      ctx.restore();
    });
  }

  private renderZonesDebug(ctx: CanvasRenderingContext2D, zones: Zone[], viewport: Viewport): void {
    zones.forEach(zone => {
      const screenX = (zone.bounds.x - viewport.x) * viewport.zoom;
      const screenY = (zone.bounds.y - viewport.y) * viewport.zoom;
      const screenWidth = zone.bounds.width * viewport.zoom;
      const screenHeight = zone.bounds.height * viewport.zoom;

      // Renderizar borde de zona
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = zone.color;
      ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(screenX, screenY, screenWidth, screenHeight);
      ctx.setLineDash([]);

      // Renderizar etiqueta de zona
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.font = `${12 * viewport.zoom}px system-ui`;
      ctx.fillText(zone.name, screenX + 8, screenY + 20);
      ctx.globalAlpha = 1;
    });
  }

  private applyLightingEffects(ctx: CanvasRenderingContext2D, viewport: Viewport, lightIntensity: number): void {
    if (lightIntensity >= 1) return;

    ctx.globalAlpha = 1 - lightIntensity;
    ctx.fillStyle = lightIntensity < 0.3 ? 'rgba(25, 25, 70, 0.7)' : 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(
      viewport.x * viewport.zoom,
      viewport.y * viewport.zoom,
      viewport.width,
      viewport.height
    );
    ctx.globalAlpha = 1;
  }

  private renderParticles(_ctx: CanvasRenderingContext2D, _viewport: Viewport): void {
    // Placeholder para sistema de partículas futuro
    // Aquí se pueden agregar efectos como lluvia, nieve, hojas cayendo, etc.
  }

  private renderUI(ctx: CanvasRenderingContext2D, viewport: Viewport, sceneData: SceneData): void {
    if (!this.settings.debugMode) return;

    // Renderizar información de debug
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 250, 80);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText(`Viewport: ${Math.round(viewport.x)}, ${Math.round(viewport.y)}`, 20, 30);
    ctx.fillText(`Zoom: ${viewport.zoom.toFixed(2)}x`, 20, 45);
    ctx.fillText(`Entities: ${sceneData.entities.length}`, 20, 60);
    ctx.fillText(`Quality: ${this.settings.qualityLevel}`, 20, 75);
  }

  private renderFallback(ctx: CanvasRenderingContext2D, viewport: Viewport, skyColor: string): void {
    // Renderizado básico mientras se inicializa
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '24px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Inicializando sistema de renderizado...', viewport.width / 2, viewport.height / 2);
    ctx.textAlign = 'left';
  }

  private getEntityColor(entity: Entity): string {
    const health = entity.stats.energy + entity.stats.happiness + entity.stats.health;
    const maxHealth = 300; // 3 stats * 100 max each
    const healthRatio = health / maxHealth;
    
    if (healthRatio > 0.8) return '#4CAF50'; // Verde
    if (healthRatio > 0.6) return '#FFEB3B'; // Amarillo
    if (healthRatio > 0.4) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  }

  /**
   * Actualiza la configuración del renderer
   */
  public updateSettings(newSettings: Partial<RenderSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('🎛️ MapRenderer: Configuración actualizada', this.settings);
  }

  /**
   * Optimiza la calidad basada en rendimiento
   */
  public adjustQuality(averageFPS: number): void {
    const targetFPS = 60;
    
    if (averageFPS < targetFPS * 0.5 && this.settings.qualityLevel !== 'low') {
      this.settings.qualityLevel = 'low';
      this.settings.enableShadows = false;
      this.settings.enableParticles = false;
      console.log('🔽 MapRenderer: Calidad reducida a low');
    } else if (averageFPS < targetFPS * 0.7 && this.settings.qualityLevel === 'high') {
      this.settings.qualityLevel = 'medium';
      this.settings.enableParticles = false;
      console.log('🔽 MapRenderer: Calidad reducida a medium');
    } else if (averageFPS > targetFPS * 0.9 && this.settings.qualityLevel !== 'high') {
      this.settings.qualityLevel = 'high';
      this.settings.enableShadows = true;
      this.settings.enableParticles = true;
      console.log('🔼 MapRenderer: Calidad aumentada a high');
    }
  }

  public toggleDebugMode(): void {
    this.settings.debugMode = !this.settings.debugMode;
    console.log(`🐛 MapRenderer: Debug mode ${this.settings.debugMode ? 'activado' : 'desactivado'}`);
  }

  public getTerrainAt(worldX: number, worldY: number) {
    if (!this.terrainMap) return null;
    return tileRenderer.getTileAt(this.terrainMap, worldX, worldY);
  }

  public getObjectsAt(worldX: number, worldY: number, radius: number = 32) {
    return objectRenderer.getObjectsInArea(
      worldX - radius,
      worldY - radius,
      radius * 2,
      radius * 2
    );
  }
}

export const mapRenderer = new MapRenderer();
