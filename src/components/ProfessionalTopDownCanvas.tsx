import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { DayNightClock } from './DayNightClock';
import { 
  loadAndExtractTiles, 
  getTilesByType, 
  getRandomTileByType,
  type ExtractedTile 
} from '../utils/tileExtractor';
import { generateOrganicProceduralMap } from '../utils/organicMapGeneration';
import type { Entity, Zone, MapElement } from '../types';

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
  const { getSkyColor, getLightIntensity, phase } = useDayNightCycle();
  

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tileMap, setTileMap] = useState<TileMap | null>(null);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  
  // Estados para el sistema orgánico
  const [organicZones, setOrganicZones] = useState<Zone[]>([]);
  const [organicMapElements, setOrganicMapElements] = useState<MapElement[]>([]);
  
  // Estados para tiles categorizados
  const [allTiles, setAllTiles] = useState<Map<string, ExtractedTile>>(new Map());
  const [grassTiles, setGrassTiles] = useState<ExtractedTile[]>([]);
  const [stoneTiles, setStoneTiles] = useState<ExtractedTile[]>([]);
  const [propTiles, setPropTiles] = useState<ExtractedTile[]>([]);
  const [plantTiles, setPlantTiles] = useState<ExtractedTile[]>([]);


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
      

      for (let i = 0; i < spritesheets.length; i++) {
        const spritesheetName = spritesheets[i];
        const spritesheetUrl = `/assets/PixelArtProfecional/Texture/${spritesheetName}`;
        
        console.log(`📦 Cargando ${spritesheetName}...`);
        
        try {
          const tiles = await loadAndExtractTiles(spritesheetUrl, spritesheetName);
          

          tiles.forEach((tile, key) => {
            allTilesMap.set(key, tile);
          });
          
          // Solo actualizar progreso si es diferente para evitar re-renders innecesarios
          const newProgress = ((i + 1) / spritesheets.length) * 80;
          setLoadingProgress(prev => prev !== newProgress ? newProgress : prev);
          
        } catch (error) {
          console.warn(`⚠️ Error cargando ${spritesheetName}:`, error);
        }
      }
      
      setAllTiles(allTilesMap);
      

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

      
      setLoadingProgress(90);
      

      await preloadAnimations([
        { name: 'entidad_circulo_happy_anim', category: 'entities' },
        { name: 'entidad_circulo_sad_anim', category: 'entities' },
        { name: 'entidad_square_happy_anim', category: 'entities' },
        { name: 'entidad_square_sad_anim', category: 'entities' }
      ]);
      
      setLoadingProgress(prev => prev !== 100 ? 100 : prev);
      
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
      setAssetsLoaded(true);
    }
  }, [preloadAnimations, assetsLoaded]); // Agregada dependencia assetsLoaded


  // Función para generar el mapa orgánico
  const generateOrganicMap = useCallback(() => {
    console.log('🌳 Generando mapa orgánico...');
    
    const { zones, mapElements } = generateOrganicProceduralMap(
      gameState.mapSeed || Date.now().toString(),
      {
        theme: 'RUSTIC', // Tema rústico para mejor coherencia visual
        useVoronoi: true,
        organicStreets: true,
        densityVariation: 0.7,
        naturalClustering: true
      }
    );
    
    console.log('🏠 Zonas generadas:', zones.length);
    console.log('🎯 Elementos generados:', mapElements.length);
    
    setOrganicZones(zones);
    setOrganicMapElements(mapElements);
  }, [gameState.mapSeed]);


  const generateOrganicTileMap = useCallback(() => {
    if (grassTiles.length === 0 || organicZones.length === 0) return;
    
    // Usar 16x16 para grass tiles (ya que corregimos el tamaño)
    const tileSize = 16;
    const mapWidth = Math.ceil(width / tileSize) + 2;
    const mapHeight = Math.ceil(height / tileSize) + 2;
    const tiles: string[][] = [];
    
    console.log('🗺️ Generando mapa visual orgánico...');
    
    // Inicializar con césped base
    for (let y = 0; y < mapHeight; y++) {
      tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const randomGrass = grassTiles[Math.floor(Math.random() * grassTiles.length)];
        tiles[y][x] = randomGrass.id;
      }
    }
    
    // Aplicar zonas específicas
    organicZones.forEach(zone => {
      const startX = Math.floor(zone.bounds.x / tileSize);
      const startY = Math.floor(zone.bounds.y / tileSize);
      const endX = Math.min(mapWidth - 1, Math.floor((zone.bounds.x + zone.bounds.width) / tileSize));
      const endY = Math.min(mapHeight - 1, Math.floor((zone.bounds.y + zone.bounds.height) / tileSize));
      
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          if (y >= 0 && y < mapHeight && x >= 0 && x < mapWidth) {
            // Usar diferentes tiles según el tipo de zona
            let tileChoice: ExtractedTile;
            
            switch (zone.type) {
              case 'kitchen':
              case 'bedroom':
              case 'living':
              case 'bathroom':
              case 'office':
                // Zonas interiores - usar piedra lisa para simular suelo
                tileChoice = stoneTiles.find(t => t.id.includes('smooth')) || stoneTiles[0] || grassTiles[0];
                break;
              case 'play':
              case 'recreation':
                // Zonas exteriores - césped con flores
                tileChoice = grassTiles.find(t => t.id.includes('flower')) || grassTiles[0];
                break;
              case 'food':
              case 'work':
                // Caminos y áreas de trabajo - piedra base
                tileChoice = stoneTiles.find(t => t.id.includes('base')) || stoneTiles[0] || grassTiles[0];
                break;
              default:
                tileChoice = grassTiles[Math.floor(Math.random() * grassTiles.length)];
            }
            
            tiles[y][x] = tileChoice.id;
          }
        }
      }
    });
    
    setTileMap({
      tiles,
      tileSize: tileSize,
      width: mapWidth,
      height: mapHeight
    });
    
    console.log(`✅ Mapa orgánico generado: ${mapWidth}x${mapHeight}`);
  }, [width, height, grassTiles, stoneTiles, organicZones]);


  // Función para obtener el tamaño de renderizado de un tile
  const getTileRenderSize = useCallback((tile: ExtractedTile) => {
    // Determinar el tamaño basado en el tipo de sprite
    if (tile.id.includes('tree_large')) {
      return 64; // Árboles grandes
    } else if (tile.id.includes('stone_large') || tile.id.includes('stone_detailed')) {
      return 64; // Piedras grandes
    } else if (tile.id.includes('bush') || tile.id.includes('grass')) {
      return 32; // Arbustos y detalles de césped
    } else {
      return 32; // Tamaño por defecto para props
    }
  }, []);

  const generateOrganicGameObjects = useCallback(() => {
    if (propTiles.length === 0 || plantTiles.length === 0 || organicMapElements.length === 0) return;
    
    const objects: GameObject[] = [];
    let objectId = 0;
    
    console.log('🎯 Generando objetos desde mapElements orgánicos...');
    
    // Convertir mapElements a GameObjects
    organicMapElements.forEach(element => {
      let tile: ExtractedTile | null = null;
      let type = 'decoration';
      let zIndex = 1;
      
      // Seleccionar tile según el tipo de elemento
      switch (element.type) {
        case 'obstacle':
          // Árboles y obstáculos naturales
          tile = getRandomTileByType(allTiles, 'tree') || getRandomTileByType(allTiles, 'bush');
          type = 'environment';
          zIndex = 2;
          break;
          
        case 'food_zone':
          // Mesas, cocinas, plantas de comida
          tile = Array.from(allTiles.values()).find(t => 
            t.id.includes('table') || t.id.includes('pot') || t.id.includes('barrel')
          ) || getRandomTileByType(allTiles, 'bush');
          type = 'food';
          zIndex = 1;
          break;
          
        case 'rest_zone':
          // Sillas, sofás, camas
          tile = Array.from(allTiles.values()).find(t => 
            t.id.includes('chair') || t.id.includes('sofa') || t.id.includes('throne')
          ) || getRandomTileByType(allTiles, 'furniture');
          type = 'rest';
          zIndex = 1;
          break;
          
        case 'play_zone':
          // Estatuas, lámparas, decoraciones
          tile = Array.from(allTiles.values()).find(t => 
            t.id.includes('statue') || t.id.includes('lamp') || t.id.includes('altar')
          ) || getRandomTileByType(allTiles, 'decoration');
          type = 'play';
          zIndex = 1;
          break;
          
        case 'social_zone':
          // Muebles sociales, estanterías
          tile = Array.from(allTiles.values()).find(t => 
            t.id.includes('bookshelf') || t.id.includes('table') || t.id.includes('fountain')
          ) || getRandomTileByType(allTiles, 'furniture');
          type = 'social';
          zIndex = 1;
          break;
          
        default:
          tile = getRandomTileByType(allTiles, 'decoration');
          type = 'decoration';
          zIndex = 0;
      }
      
      if (tile) {
        const shadowTile = getRandomTileByType(allTiles, 'shadow');
        
        objects.push({
          id: `organic_${element.type}_${objectId++}`,
          x: element.position.x,
          y: element.position.y,
          tileId: tile.id,
          tile: tile,
          type: type,
          shadow: shadowTile || undefined,
          zIndex: zIndex
        });
      }
    });
    
    // Ordenar por zIndex para renderizado correcto
    objects.sort((a, b) => a.zIndex - b.zIndex);
    
    setGameObjects(objects);
    console.log(`✅ Objetos orgánicos generados: ${objects.length}`, {
      food: objects.filter(o => o.type === 'food').length,
      rest: objects.filter(o => o.type === 'rest').length,
      play: objects.filter(o => o.type === 'play').length,
      social: objects.filter(o => o.type === 'social').length,
      environment: objects.filter(o => o.type === 'environment').length
    });
    
  }, [allTiles, propTiles, plantTiles, organicMapElements]);


  const renderProfessionalScene = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!assetsLoaded || !tileMap) return;
    

    ctx.clearRect(0, 0, width, height);
    

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panX, panY);
    

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
    

    // Renderizar zonas orgánicas como fondos sutiles
    organicZones.forEach(zone => {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = zone.color;
      ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      
      // Borde sutil para definir la zona
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      
      // Etiqueta de zona
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        zone.name, 
        zone.bounds.x + zone.bounds.width / 2, 
        zone.bounds.y + 15
      );
      
      ctx.globalAlpha = 1.0;
    });
    
    // Renderizar sombras de objetos
    gameObjects.forEach(obj => {
      if (obj.shadow) {
        const shadowSize = getTileRenderSize(obj.tile);
        ctx.globalAlpha = 0.4;
        ctx.drawImage(
          obj.shadow.image,
          obj.x + 3,
          obj.y + 3,
          shadowSize,
          shadowSize
        );
        ctx.globalAlpha = 1.0;
      }
    });
    
    // Renderizar objetos principales
    gameObjects.forEach(obj => {
      const objectSize = getTileRenderSize(obj.tile);
      ctx.drawImage(
        obj.tile.image,
        obj.x,
        obj.y,
        objectSize,
        objectSize
      );
    });
    
    // Renderizar entidades
    if (gameState.entities) {
      gameState.entities.forEach(entity => {
        renderTopDownEntity(ctx, entity);
      });
    }
    
    // Aplicar efectos de día/noche
    const lightIntensity = getLightIntensity();
    if (lightIntensity < 1.0) {
      // Overlay de oscuridad para la noche
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgba(100, 150, 255, ${1 - lightIntensity})`;
      ctx.fillRect(-panX, -panY, width / zoom, height / zoom);
      
      // Overlay cálido para el atardecer/amanecer
      if (phase === 'dusk' || phase === 'dawn') {
        ctx.globalCompositeOperation = 'overlay';
        const warmth = phase === 'dusk' ? 0.3 : 0.2;
        ctx.fillStyle = `rgba(255, 150, 100, ${warmth})`;
        ctx.fillRect(-panX, -panY, width / zoom, height / zoom);
      }
      
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsLoaded, tileMap, allTiles, gameObjects, gameState.entities, organicZones, width, height, zoom, panX, panY, getLightIntensity, phase, getTileRenderSize]);


  const renderTopDownEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    if (!entity.position) return;
    
    const x = entity.position.x;
    const y = entity.position.y;
    const size = 24;
    

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#2c1810';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + size - 2, size/3, size/6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    

    ctx.fillStyle = entity.mood === 'HAPPY' ? '#4CAF50' : 
                   entity.mood === 'SAD' ? '#F44336' : '#FF9800';
    

    if (entity.id === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, size/2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(x - size/2, y - size/2, size, size);
    }
    

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const faceEmoji = entity.mood === 'HAPPY' ? '😊' : 
                     entity.mood === 'SAD' ? '😢' : '😵';
    ctx.fillText(faceEmoji, x, y + 3);
  }, []);


  useEffect(() => {
    if (!assetsLoaded) {
      loadProfessionalAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar


  useEffect(() => {
    if (assetsLoaded && grassTiles.length > 0) {
      // Generar el mapa orgánico primero
      generateOrganicMap();
    }
  }, [assetsLoaded, grassTiles.length, generateOrganicMap]);

  // Efecto separado para generar tiles y objetos después de que el mapa orgánico esté listo
  useEffect(() => {
    if (organicZones.length > 0 && organicMapElements.length > 0) {
      generateOrganicTileMap();
      generateOrganicGameObjects();
    }
  }, [organicZones.length, organicMapElements.length, generateOrganicTileMap, generateOrganicGameObjects]);


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


  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick || !gameState.entities) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / zoom - panX;
    const y = (event.clientY - rect.top) / zoom - panY;


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
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{ 
          cursor: onEntityClick ? 'pointer' : 'default',
          background: getSkyColor(),
          display: 'block',
          width: '100%',
          height: '100%',
          transition: 'background-color 2s ease'
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
          <div style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'serif' }}>
            🌌 Inicializando Universo Cuántico
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
      
      {/* Reloj de día y noche */}
      {assetsLoaded && (
        <DayNightClock 
          position="top-right" 
          size="medium" 
          showPhase={true}
        />
      )}
    </div>
  );
};

export default ProfessionalTopDownCanvas;
