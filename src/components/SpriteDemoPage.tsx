/**
 * 🎬 DEMO DE SISTEMA DE SPRITES Y ANIMACIONES
 * 
 * Página de demostración que muestra:
 * 1. Animaciones de entidades circulo y cuadrado
 * 2. Assets organizados por carpeta
 * 3. Sistema de carga dinámica
 */

import React, { useEffect, useState } from 'react';
import { AnimatedSprite } from '../components/AnimatedSprite';
import { spriteAnimationManager } from '../utils/spriteAnimationManager';
import { assetManager } from '../utils/assetManager';

interface DemoState {
  availableAnimations: string[];
  availableSprites: string[];
  loadedAssets: { animations: number; sprites: number };
  selectedAnimation: string;
}

export const SpriteDemoPage: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    availableAnimations: [],
    availableSprites: [],
    loadedAssets: { animations: 0, sprites: 0 },
    selectedAnimation: 'entidad_circulo_happy'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDemo = async () => {
      try {
        console.log('🎬 Iniciando demo de sprites...');

        // Precargar animaciones de entidades
        await spriteAnimationManager.preloadEntityAssets('circulo');
        await spriteAnimationManager.preloadEntityAssets('square');

        // Cargar assets dinámicos
        await assetManager.loadAssetsByFolderName('animations');
        await assetManager.loadAssetsByFolderName('activities');

        // Obtener listas de assets disponibles
        const animations = spriteAnimationManager.getAvailableAnimations();
        const sprites = spriteAnimationManager.getAvailableSprites();
        const loadedStats = spriteAnimationManager.getLoadedAssets();

        setDemoState({
          availableAnimations: animations,
          availableSprites: sprites,
          loadedAssets: loadedStats,
          selectedAnimation: animations[0] || 'entidad_circulo_happy'
        });

        setLoading(false);
        console.log('✅ Demo inicializado correctamente');
      } catch (error) {
        console.error('❌ Error inicializando demo:', error);
        setLoading(false);
      }
    };

    initDemo();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🎬 Cargando Sistema de Sprites...</h2>
          <p>Preparando animaciones y assets dinámicos</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            🎬 Demo de Sprites Animados
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Sistema dinámico de animaciones y assets por carpeta
          </p>
        </header>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>🎬 Animaciones</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{demoState.loadedAssets.animations}</p>
            <small>Sprites animados cargados</small>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>🖼️ Assets</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{assetManager.getStats().totalLoaded}</p>
            <small>Assets totales disponibles</small>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>📁 Carpetas</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{assetManager.getStats().dynamicFoldersLoaded.length}</p>
            <small>Carpetas cargadas dinámicamente</small>
          </div>
        </div>

        {/* Animation Showcase */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎭 Showcase de Entidades Animadas</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* Círculo Feliz */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '30px', 
              borderRadius: '15px',
              textAlign: 'center',
              position: 'relative',
              minHeight: '250px'
            }}>
              <h3>🔵 Entidad Círculo - Feliz</h3>
              <div style={{ position: 'relative', height: '120px', marginBottom: '20px' }}>
                <AnimatedSprite
                  animationId="entidad_circulo_happy"
                  folder="animations"
                  x={120}
                  y={40}
                  width={64}
                  height={64}
                  autoPlay={true}
                  loop={true}
                />
              </div>
              <p>Animación: pulse (continua)</p>
              <small>Estado: Feliz • Duración: 960ms • 12 frames</small>
            </div>

            {/* Círculo Triste */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '30px', 
              borderRadius: '15px',
              textAlign: 'center',
              position: 'relative',
              minHeight: '250px'
            }}>
              <h3>🔵 Entidad Círculo - Triste</h3>
              <div style={{ position: 'relative', height: '120px', marginBottom: '20px' }}>
                <AnimatedSprite
                  animationId="entidad_circulo_sad"
                  folder="animations"
                  x={120}
                  y={40}
                  width={64}
                  height={64}
                  autoPlay={true}
                  loop={true}
                />
              </div>
              <p>Animación: floating (continua)</p>
              <small>Estado: Triste • Duración: 1600ms • 16 frames</small>
            </div>

            {/* Cuadrado Feliz */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '30px', 
              borderRadius: '15px',
              textAlign: 'center',
              position: 'relative',
              minHeight: '250px'
            }}>
              <h3>🟦 Entidad Cuadrado - Feliz</h3>
              <div style={{ position: 'relative', height: '120px', marginBottom: '20px' }}>
                <AnimatedSprite
                  animationId="entidad_square_happy"
                  folder="animations"
                  x={120}
                  y={40}
                  width={64}
                  height={64}
                  autoPlay={true}
                  loop={true}
                />
              </div>
              <p>Animación: pulse (continua)</p>
              <small>Estado: Feliz • Duración: 960ms • 12 frames</small>
            </div>

            {/* Cuadrado Triste */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '30px', 
              borderRadius: '15px',
              textAlign: 'center',
              position: 'relative',
              minHeight: '250px'
            }}>
              <h3>🟦 Entidad Cuadrado - Triste</h3>
              <div style={{ position: 'relative', height: '120px', marginBottom: '20px' }}>
                <AnimatedSprite
                  animationId="entidad_square_sad"
                  folder="animations"
                  x={120}
                  y={40}
                  width={64}
                  height={64}
                  autoPlay={true}
                  loop={true}
                />
              </div>
              <p>Animación: floating (continua)</p>
              <small>Estado: Triste • Duración: 1600ms • 16 frames</small>
            </div>
          </div>
        </div>

        {/* Animation Selector */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '30px', 
          borderRadius: '15px',
          marginBottom: '40px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎮 Selector de Animaciones</h2>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
            <label>Seleccionar animación:</label>
            <select 
              value={demoState.selectedAnimation}
              onChange={(e) => setDemoState(prev => ({ ...prev, selectedAnimation: e.target.value }))}
              style={{ 
                padding: '10px', 
                borderRadius: '5px', 
                border: 'none',
                background: 'white',
                color: '#333',
                fontSize: '16px'
              }}
            >
              {demoState.availableAnimations.map(anim => (
                <option key={anim} value={anim}>{anim}</option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'center', position: 'relative', height: '120px' }}>
            <AnimatedSprite
              key={demoState.selectedAnimation}
              animationId={demoState.selectedAnimation}
              folder="animations"
              x={300}
              y={20}
              width={80}
              height={80}
              autoPlay={true}
              loop={true}
            />
          </div>
        </div>

        {/* Feature List */}
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '30px', 
          borderRadius: '15px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>✨ Características del Sistema</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3>🎬 Animaciones Automáticas</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Detección automática de metadatos JSON</li>
                <li>Sprites configurables por frame</li>
                <li>Loop y animaciones de una sola vez</li>
                <li>Callback de finalización</li>
              </ul>
            </div>
            
            <div>
              <h3>📁 Carga Dinámica</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Assets organizados por carpeta</li>
                <li>Manifest generado automáticamente</li>
                <li>Carga bajo demanda</li>
                <li>Cache inteligente</li>
              </ul>
            </div>
            
            <div>
              <h3>🎭 Entidades Inteligentes</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Animaciones basadas en estado</li>
                <li>Transiciones automáticas</li>
                <li>Indicadores visuales</li>
                <li>Optimización de rendimiento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '40px', opacity: 0.7 }}>
          <p>Sistema de Sprites Animados • Duo Eterno • 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default SpriteDemoPage;
