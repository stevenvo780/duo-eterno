import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import { 
  loadAndExtractTiles, 
  getTilesByType, 
  getRandomTileByType,
  type ExtractedTile 
} from '../utils/tileExtractor';
import type { Entity } from '../types';

interface ProfessionalTopDownCanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
  zoom?: number;
  panX?: number;
  panY?: number;
}

interface TileMap {
  tiles: string[][];
  tileSize: number;
  width: number;
  height: number;
}

interface GameObject {
  id: string;
  x: number;
  y: number;
  tileId: string;
  tile: ExtractedTile;
  type: string;
  shadow?: ExtractedTile;
  zIndex: number;
}

const ProfessionalTopDownCanvas: React.FC<ProfessionalTopDownCanvasProps> = ({ 
  width, 
  height, 
  onEntityClick, 
  zoom = 1, 
  panX = 0, 
  panY = 0 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { gameState } = useGame();
  const { shouldRender } = useRenderer();
  const { preloadAnimations } = useAnimationSystem();
  
  // Estados del sistema profesional
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tileMap, setTileMap] = useState<TileMap | null>(null);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  
  // Colecciones de tiles organizadas
  const [allTiles, setAllTiles] = useState<Map<string, ExtractedTile>>(new Map());
  const [grassTiles, setGrassTiles] = useState<ExtractedTile[]>([]);
  const [stoneTiles, setStoneTiles] = useState<ExtractedTile[]>([]);
  const [propTiles, setPropTiles] = useState<ExtractedTile[]>([]);
  const [plantTiles, setPlantTiles] = useState<ExtractedTile[]>([]);

  // Cargar sistema completo de assets profesionales
  const loadProfessionalAssets = useCallback(async () => {
    if (assetsLoaded) return;
    
    console.log('🎨 Iniciando carga de assets profesionales con extractor...');
    
    try {
      const spritesheets = [
        'TX Tileset Grass.png',
        'TX Tileset Stone Ground.png', 
        'TX Props.png',
        'TX Plant.png',
        'TX Shadow.png'
      ];
      
      const allTilesMap = new Map<string, ExtractedTile>();
      
      // Cargar cada spritesheet
      for (let i = 0; i < spritesheets.length; i++) {
        const spritesheetName = spritesheets[i];
        const spritesheetUrl = `/assets/PixelArtProfecional/Texture/${spritesheetName}`;
        
        console.log(`📦 Cargando ${spritesheetName}...`);
        
        try {
          const tiles = await loadAndExtractTiles(spritesheetUrl, spritesheetName);
          
          // Agregar tiles al mapa principal
          tiles.forEach((tile, key) => {
            allTilesMap.set(key, tile);
          });
          
          setLoadingProgress(((i + 1) / spritesheets.length) * 80);
          
        } catch (error) {
          console.warn(`⚠️ Error cargando ${spritesheetName}:`, error);
        }
      }
      
      setAllTiles(allTilesMap);
      
      // Organizar tiles por tipo
      const grassCollection = getTilesByType(allTilesMap, 'ground').filter(t => 
        t.id.includes('grass')
      );
      const stoneCollection = getTilesByType(allTilesMap, 'ground').filter(t => 
        t.id.includes('stone')
      );
      const propCollection = [
        ...getTilesByType(allTilesMap, 'furniture'),
        ...getTilesByType(allTilesMap, 'container'),
        ...getTilesByType(allTilesMap, 'decoration'),
        ...getTilesByType(allTilesMap, 'structure')
      ];
      const plantCollection = [
        ...getTilesByType(allTilesMap, 'tree'),
        ...getTilesByType(allTilesMap, 'bush')
      ];
      const shadowCollection = getTilesByType(allTilesMap, 'shadow');
      
      setGrassTiles(grassCollection);
      setStoneTiles(stoneCollection);
      setPropTiles(propCollection);
      setPlantTiles(plantCollection);
      // shadowTiles removed as unused
      
      setLoadingProgress(90);
      
      // Precargar animaciones de caritas (conservamos sistema original)
      await preloadAnimations([
        { name: 'entidad_circulo_happy_anim', category: 'entities' },
        { name: 'entidad_circulo_sad_anim', category: 'entities' },
        { name: 'entidad_square_happy_anim', category: 'entities' },
        { name: 'entidad_square_sad_anim', category: 'entities' }
      ]);
      
      setLoadingProgress(100);
      
      console.log('✅ Assets profesionales cargados:', {
        totalTiles: allTilesMap.size,
        grass: grassCollection.length,
        stone: stoneCollection.length,
        props: propCollection.length,
        plants: plantCollection.length,
        shadows: shadowCollection.length
      });
      
      setAssetsLoaded(true);
      
    } catch (error) {
      console.error('❌ Error en carga profesional:', error);
      setAssetsLoaded(true); // Continue anyway
    }
  }, [assetsLoaded, preloadAnimations]);

  // Generar mapa de tiles profesional
  const generateProfessionalTileMap = useCallback(() => {
    if (grassTiles.length === 0) return;
    
    const mapWidth = Math.ceil(width / 32) + 2;
    const mapHeight = Math.ceil(height / 32) + 2;
    
    const tiles: string[][] = [];
    
    for (let y = 0; y < mapHeight; y++) {
      tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        // Crear patrón natural variado
        if (Math.random() < 0.05 && stoneTiles.length > 0) {
          // Ocasional tile de piedra
          const randomStone = stoneTiles[Math.floor(Math.random() * stoneTiles.length)];
          tiles[y][x] = randomStone.id;
        } else {
          // Principalmente grass con variaciones
          const randomGrass = grassTiles[Math.floor(Math.random() * grassTiles.length)];
          tiles[y][x] = randomGrass.id;
        }
      }
    }
    
    setTileMap({
      tiles,
      tileSize: 32,
      width: mapWidth,
      height: mapHeight
    });
  }, [width, height, grassTiles, stoneTiles]);

  // Generar objetos del mundo profesional
  const generateProfessionalGameObjects = useCallback(() => {
    if (propTiles.length === 0 || plantTiles.length === 0) return;
    
    const objects: GameObject[] = [];
    let objectId = 0;
    
    // 1. Árboles grandes como landmarks principales
    const treeSpots = [
      { x: 120, y: 100, priority: 'high' },
      { x: 280, y: 140, priority: 'high' },
      { x: 450, y: 110, priority: 'high' },
      { x: 600, y: 160, priority: 'medium' }
    ];
    
    treeSpots.forEach(spot => {
      const treeTile = getRandomTileByType(allTiles, 'tree');
      const shadowTile = getRandomTileByType(allTiles, 'shadow');
      
      if (treeTile) {
        objects.push({
          id: `tree_${objectId++}`,
          x: spot.x,
          y: spot.y,
          tileId: treeTile.id,
          tile: treeTile,
          type: 'tree',
          shadow: shadowTile || undefined,
          zIndex: 1
        });
      }
    });
    
    // 2. Mobiliario estratégicamente ubicado
    const furnitureZones = [
      // Zona de lectura
      { 
        center: { x: 200, y: 220 },
        items: ['bookshelf', 'chair', 'table'],
        theme: 'knowledge'
      },
      // Zona ceremonial
      { 
        center: { x: 350, y: 200 },
        items: ['altar', 'throne', 'statue'],
        theme: 'mystical'
      },
      // Zona de almacenamiento
      { 
        center: { x: 150, y: 300 },
        items: ['chest_wood', 'barrel', 'crate_wood'],
        theme: 'storage'
      },
      // Zona de descanso
      { 
        center: { x: 500, y: 280 },
        items: ['sofa', 'lamp', 'pot'],
        theme: 'comfort'
      }
    ];
    
    furnitureZones.forEach(zone => {
      zone.items.forEach((itemType, index) => {
        const itemTile = Array.from(allTiles.values()).find(tile => 
          tile.id.includes(itemType) || tile.id === itemType
        );
        const shadowTile = getRandomTileByType(allTiles, 'shadow');
        
        if (itemTile) {
          const angle = (index / zone.items.length) * Math.PI * 2;
          const radius = 40 + Math.random() * 20;
          
          objects.push({
            id: `${itemType}_${objectId++}`,
            x: zone.center.x + Math.cos(angle) * radius,
            y: zone.center.y + Math.sin(angle) * radius,
            tileId: itemTile.id,
            tile: itemTile,
            type: 'furniture',
            shadow: shadowTile || undefined,
            zIndex: 2
          });
        }
      });
    });
    
    // 3. Arbustos decorativos distribuidos naturalmente
    const bushCount = 12;
    for (let i = 0; i < bushCount; i++) {
      const bushTile = getRandomTileByType(allTiles, 'bush');
      const shadowTile = getRandomTileByType(allTiles, 'shadow');
      
      if (bushTile) {
        objects.push({
          id: `bush_${objectId++}`,
          x: Math.random() * (width - 64) + 32,
          y: Math.random() * (height - 64) + 32,
          tileId: bushTile.id,
          tile: bushTile,
          type: 'decoration',
          shadow: shadowTile || undefined,
          zIndex: 3
        });
      }
    }
    
    // 4. Estructuras especiales
    const specialStructures = [
      { type: 'fountain_center', x: 380, y: 350 },
      { type: 'pillar', x: 180, y: 180 },
      { type: 'door', x: 320, y: 120 }
    ];
    
    specialStructures.forEach(structure => {
      const structureTile = Array.from(allTiles.values()).find(tile => 
        tile.id.includes(structure.type)
      );
      const shadowTile = getRandomTileByType(allTiles, 'shadow');
      
      if (structureTile) {
        objects.push({
          id: `structure_${objectId++}`,
          x: structure.x,
          y: structure.y,
          tileId: structureTile.id,
          tile: structureTile,
          type: 'structure',
          shadow: shadowTile || undefined,
          zIndex: 0
        });
      }
    });
    
    // Ordenar por zIndex para renderizado correcto
    objects.sort((a, b) => a.zIndex - b.zIndex);
    
    setGameObjects(objects);
    console.log('🏗️ Mundo profesional generado:', {
      objects: objects.length,
      trees: objects.filter(o => o.type === 'tree').length,
      furniture: objects.filter(o => o.type === 'furniture').length,
      decorations: objects.filter(o => o.type === 'decoration').length
    });
    
  }, [allTiles, propTiles, plantTiles, width, height]);

  // Renderizar escena profesional top-down
  const renderProfessionalScene = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!assetsLoaded || !tileMap) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Aplicar transformaciones
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panX, panY);
    
    // 1. Renderizar tiles de fondo con tiles profesionales
    for (let y = 0; y < tileMap.height; y++) {
      for (let x = 0; x < tileMap.width; x++) {
        const tileId = tileMap.tiles[y][x];
        const tile = allTiles.get(tileId);
        
        if (tile) {
          ctx.drawImage(
            tile.image,
            x * tileMap.tileSize,
            y * tileMap.tileSize,
            tileMap.tileSize,
            tileMap.tileSize
          );
        }
      }
    }
    
    // 2. Renderizar sombras de objetos
    gameObjects.forEach(obj => {
      if (obj.shadow) {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(
          obj.shadow.image,
          obj.x + 3,
          obj.y + 3,
          32,
          32
        );
        ctx.globalAlpha = 1.0;
      }
    });
    
    // 3. Renderizar objetos del mundo (ya ordenados por zIndex)
    gameObjects.forEach(obj => {
      ctx.drawImage(
        obj.tile.image,
        obj.x,
        obj.y,
        32,
        32
      );
    });
    
    // 4. Renderizar entidades con caritas (conservamos sistema original)
    if (gameState.entities) {
      gameState.entities.forEach(entity => {
        renderTopDownEntity(ctx, entity);
      });
    }
    
    ctx.restore();
  }, [assetsLoaded, tileMap, allTiles, gameObjects, gameState.entities, width, height, zoom, panX, panY]);

  // Renderizar entidad en vista top-down (conservado del sistema original)
  const renderTopDownEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    if (!entity.position) return;
    
    const x = entity.position.x;
    const y = entity.position.y;
    const size = 24;
    
    // Renderizar sombra de entidad
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#2c1810';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + size - 2, size/3, size/6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Renderizar cuerpo de entidad (top-down view)
    ctx.fillStyle = entity.mood === 'HAPPY' ? '#4CAF50' : 
                   entity.mood === 'SAD' ? '#F44336' : '#FF9800';
    
    // Determinar forma basada en ID (circle vs square)
    if (entity.id === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x - size/2, y - size/2, size, size);
    }
    
    // Renderizar cara (vista desde arriba)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const faceEmoji = entity.mood === 'HAPPY' ? '😊' : 
                     entity.mood === 'SAD' ? '😢' : '😵';
    ctx.fillText(faceEmoji, x, y + 3);
  }, []);

  // Efecto para cargar assets
  useEffect(() => {
    loadProfessionalAssets();
  }, [loadProfessionalAssets]);

  // Efecto para generar mundo cuando assets estén listos
  useEffect(() => {
    if (assetsLoaded && grassTiles.length > 0) {
      generateProfessionalTileMap();
      generateProfessionalGameObjects();
    }
  }, [assetsLoaded, grassTiles.length, generateProfessionalTileMap, generateProfessionalGameObjects]);

  // Loop de renderizado
  useEffect(() => {
    if (!canvasRef.current || !assetsLoaded) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (shouldRender()) {
        renderProfessionalScene(ctx);
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assetsLoaded, shouldRender, renderProfessionalScene]);

  // Click handler para vista top-down
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick || !gameState.entities) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / zoom - panX;
    const y = (event.clientY - rect.top) / zoom - panY;

    // Buscar entidad clickeada
    for (const entity of gameState.entities) {
      if (!entity.position) continue;
      
      const dx = x - entity.position.x;
      const dy = y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 15) {
        onEntityClick(entity.id);
        break;
      }
    }
  }, [onEntityClick, gameState.entities, zoom, panX, panY]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{ 
          border: '2px solid #8B4513',
          borderRadius: '8px',
          cursor: onEntityClick ? 'pointer' : 'default',
          background: '#2d5a27'
        }}
      />
      
      {!assetsLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(45, 90, 39, 0.95)',
          color: '#f0f8e8',
          padding: '20px 30px',
          borderRadius: '10px',
          border: '2px solid #8B4513',
          textAlign: 'center',
          fontFamily: 'monospace'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            🎨 Cargando Mundo Profesional
          </div>
          <div style={{ 
            width: '200px', 
            height: '8px', 
            background: '#1a3d1a',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            {loadingProgress}% completado
          </div>
        </div>
      )}
      
      {assetsLoaded && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(45, 90, 39, 0.8)',
          color: '#f0f8e8',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          border: '1px solid #8B4513'
        }}>
          🌍 Tiles: {allTiles.size} | Objetos: {gameObjects.length}
        </div>
      )}
    </div>
  );
};

export default ProfessionalTopDownCanvas;