import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { applyInteractionEffect, getStatColor } from '../utils/interactions';
import { getRandomDialogue } from '../utils/dialogues';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import DynamicsDebugPanel from './DynamicsDebugPanel';
import type { InteractionType } from '../types';
import { TRANSLATIONS, type StatKey, type ActivityType, type MoodType } from '../constants/gameConstants';

interface UIControlsProps {
  selectedEntityId?: string | null;
  onEntitySelect?: (entityId: string | null) => void;
}

const UIControls: React.FC<UIControlsProps> = ({ selectedEntityId, onEntitySelect }) => {
  const { gameState, dispatch } = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  const selectedEntity = selectedEntityId ? gameState.entities.find(e => e.id === selectedEntityId) : null;
  const totalMoney = gameState.entities.reduce((sum, entity) => sum + entity.stats.money, 0);

  const handleInteraction = (type: InteractionType, entityId?: string) => {
    if (entityId) {
      // Apply to specific entity
      const entity = gameState.entities.find(e => e.id === entityId);
      if (!entity || entity.isDead) return;

      const result = applyInteractionEffect(entity.stats, type);
      
      // Log de la interacción del usuario
      dynamicsLogger.logUserInteraction(type, entityId, result);
      
      dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId, stats: result.stats } });
      if (result.mood) {
        dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId, mood: result.mood } });
      }

      // Show dialogue
      const dialogueType = type.toLowerCase();
      const dialogueMap: Record<string, string> = {
        'feed': 'feeding',
        'play': 'playing', 
        'comfort': 'comforting',
        'disturb': 'disturbing'
      };
      
      if (dialogueMap[dialogueType]) {
        const message = getRandomDialogue(dialogueMap[dialogueType] as keyof typeof import('../utils/dialogues').dialogues);
        
        // Log del diálogo
        dynamicsLogger.logDialogue(entityId as 'circle' | 'square', message, dialogueType);
        
        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: { 
            message,
            speaker: entityId as 'circle' | 'square',
            duration: 3000
          }
        });
      }
    } else {
      // Apply to both entities (global interaction)
      gameState.entities.forEach(entity => {
        if (entity.isDead) return;
        
        const result = applyInteractionEffect(entity.stats, type);
        dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: entity.id, stats: result.stats } });
        if (result.mood) {
          dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId: entity.id, mood: result.mood } });
        }
      });

      // Global resonance boost for NOURISH con atenuación por uso repetido
      if (type === 'NOURISH') {
        const now = Date.now();
        const w = window as unknown as { __lastNourishTime?: number };
        const last = w.__lastNourishTime || 0;
        const deltaSec = (now - last) / 1000;
        w.__lastNourishTime = now;

        const baseResonanceGain = 30;
        // Atenúa si se usa varias veces en <15s: factor 1.0 → 0.5
        const attenuation = Math.max(0.5, Math.min(1.0, deltaSec / 15));
        const gain = baseResonanceGain * attenuation * (1 - gameState.resonance / 120); // reducir a medida que R sube

        const newResonance = Math.min(100, gameState.resonance + gain);
        
        dynamicsLogger.logResonanceChange(gameState.resonance, newResonance, 'interacción NOURISH atenuada', gameState.entities);
        dynamicsLogger.logUserInteraction(type, undefined, { baseResonanceGain, attenuation, appliedGain: gain });
        
        dispatch({ type: 'UPDATE_RESONANCE', payload: newResonance });
        
        const message = getRandomDialogue('post-nutrition');
        dynamicsLogger.logDialogue(undefined, message, 'post-nutrition');
        
        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: { 
            message,
            duration: 3000 
          }
        });
      }
    }
  };

  const resetGame = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
      dispatch({ type: 'RESET_GAME' });
      onEntitySelect?.(null);
    }
  };

  const getEntityIcon = (id: string): string => {
    return id === 'circle' ? '●' : '■';
  };

  const getEntityName = (id: string): string => {
    return TRANSLATIONS.ENTITIES[id as keyof typeof TRANSLATIONS.ENTITIES] || id;
  };

  const getActivityName = (activity: string): string => {
    return TRANSLATIONS.ACTIVITIES[activity as ActivityType] || activity;
  };

  const getMoodName = (mood: string): string => {
    return TRANSLATIONS.MOODS[mood as MoodType] || mood;
  };

  const getStatName = (stat: string): string => {
    return TRANSLATIONS.STATS[stat as StatKey] || stat;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Entity Selection and Stats Overlay */}
      {selectedEntity && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid #475569',
          borderRadius: '12px',
          padding: '16px',
          color: '#f1f5f9',
          minWidth: '280px',
          maxWidth: '320px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>{getEntityIcon(selectedEntity.id)}</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              {getEntityName(selectedEntity.id)}
            </h3>
            {selectedEntity.isDead && (
              <span style={{
                fontSize: '12px',
                color: '#ef4444',
                fontWeight: '500',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                MUERTO
              </span>
            )}
            <button
              onClick={() => onEntitySelect?.(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>

          {selectedEntity.isDead ? (
            <div style={{
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#fca5a5' }}>
                Esta entidad ha perdido su esencia. Su vínculo con la existencia se ha roto.
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#94a3b8' }}>
                {selectedEntity.timeOfDeath && 
                  `Falleció hace ${Math.floor((Date.now() - selectedEntity.timeOfDeath) / 1000)}s`
                }
              </p>
              <button
                onClick={() => {
                  // Log del revival
                  dynamicsLogger.logEntityRevival(selectedEntity.id, {
                    hunger: 60, sleepiness: 60, loneliness: 60, happiness: 60,
                    energy: 60, boredom: 60, money: 25, health: 50
                  });
                  
                  dispatch({ type: 'REVIVE_ENTITY', payload: { entityId: selectedEntity.id } });
                  
                  const message = getRandomDialogue('revival');
                  dynamicsLogger.logDialogue(undefined, message, 'revival');
                  
                  dispatch({
                    type: 'SHOW_DIALOGUE',
                    payload: { 
                      message,
                      duration: 4000 
                    }
                  });
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%'
                }}
              >
                💫 Revivir Entidad
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {Object.entries(selectedEntity.stats).map(([stat, value]) => (
                  <div key={stat} style={{
                    background: 'rgba(15, 20, 25, 0.5)',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #374151'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#94a3b8', 
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      {getStatName(stat)}
                    </div>
                    <div style={{
                      height: '4px',
                      background: '#374151',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        width: `${value}%`,
                        height: '100%',
                        background: getStatColor(value),
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#f1f5f9',
                      fontWeight: '600'
                    }}>
                      {Math.round(value)}%
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#94a3b8', 
                  marginBottom: '4px' 
                }}>
                  Estado: <span style={{ color: '#f1f5f9', fontWeight: '500' }}>
                    {getMoodName(selectedEntity.mood)}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#94a3b8' 
                }}>
                  Actividad: <span style={{ color: '#f1f5f9', fontWeight: '500' }}>
                    {getActivityName(selectedEntity.activity)}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                {[
                  { type: 'FEED', label: '🍽️', title: 'Alimentar' },
                  { type: 'PLAY', label: '🎮', title: 'Jugar' },
                  { type: 'COMFORT', label: '🤗', title: 'Consolar' },
                  { type: 'DISTURB', label: '😤', title: 'Molestar' }
                ].map(({ type, label, title }) => (
                  <button
                    key={type}
                    onClick={() => handleInteraction(type as InteractionType, selectedEntity.id)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    title={title}
                  >
                    <span>{label}</span>
                    <span>{title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Global Stats Overlay */}
      {showStats && (
        <div style={{
          position: 'absolute',
          top: '-200px',
          right: '20px',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid #475569',
          borderRadius: '12px',
          padding: '16px',
          color: '#f1f5f9',
          minWidth: '200px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Estadísticas Globales
            </h3>
            <button
              onClick={() => setShowStats(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Ciclos:</strong> {gameState.cycles}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Tiempo Juntos:</strong> {Math.round(gameState.togetherTime / 1000)}s
            </div>
            <div>
              <strong>Estado del Vínculo:</strong>
              <span style={{ 
                color: gameState.resonance > 70 ? '#10b981' : 
                      gameState.resonance > 30 ? '#f59e0b' : '#ef4444',
                marginLeft: '8px',
                fontWeight: '600'
              }}>
                {gameState.resonance > 80 ? 'Próspero' :
                 gameState.resonance > 60 ? 'Fuerte' :
                 gameState.resonance > 40 ? 'Estable' :
                 gameState.resonance > 20 ? 'Frágil' : 'Crítico'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar - Compacto */}
      <div style={{
        height: '50px',
        background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
        borderTop: '1px solid #475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Left: Entity Selectors */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '12px', 
            color: '#94a3b8', 
            fontWeight: '500',
            marginRight: '4px'
          }}>
            Entidades:
          </span>
          {gameState.entities.map(entity => (
            <button
              key={entity.id}
              onClick={() => onEntitySelect?.(entity.id)}
              style={{
                background: selectedEntity?.id === entity.id 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : entity.isDead 
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(51, 65, 85, 0.5)',
                border: selectedEntity?.id === entity.id 
                  ? '1px solid #60a5fa' 
                  : entity.isDead
                    ? '1px solid #ef4444'
                    : '1px solid #475569',
                borderRadius: '6px',
                padding: '4px 8px',
                color: entity.isDead ? '#fca5a5' : '#f1f5f9',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                opacity: entity.isDead ? 0.7 : 1
              }}
            >
              <span style={{ fontSize: '14px' }}>{getEntityIcon(entity.id)}</span>
              <span>{getEntityName(entity.id)}</span>
              {entity.isDead && <span style={{ fontSize: '10px' }}>💀</span>}
            </button>
          ))}
        </div>

        {/* Center: Resonance compacto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '10px', 
              color: '#94a3b8', 
              marginBottom: '2px' 
            }}>
              Vínculo
            </div>
            <div style={{
              width: '80px',
              height: '4px',
              background: '#374151',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${gameState.resonance}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${getStatColor(gameState.resonance)}, ${getStatColor(Math.min(100, gameState.resonance + 20))})`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#f1f5f9', 
              marginTop: '1px',
              fontWeight: '600'
            }}>
              {Math.round(gameState.resonance)}%
            </div>
          </div>

          <button
            onClick={() => handleInteraction('NOURISH')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>💚</span>
            <span>Nutrir</span>
          </button>
        </div>

        {/* Right: Utility Actions compacto */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              background: showStats 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                : 'rgba(51, 65, 85, 0.5)',
              border: '1px solid #6366f1',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>📊</span>
            <span>Stats</span>
          </button>

          <button
            onClick={() => setShowDebug(!showDebug)}
            style={{
              background: showDebug
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(51, 65, 85, 0.5)',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔍</span>
            <span>Debug</span>
          </button>


          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#f1f5f9',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>💰</span>
            <span>{totalMoney}</span>
          </div>

          <button
            onClick={resetGame}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
        </div>
      </div>
      
      <DynamicsDebugPanel 
        visible={showDebug} 
        onClose={() => setShowDebug(false)} 
      />
    </div>
  );
};

export default UIControls;