import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { applyInteractionEffect } from '../utils/interactions';
import { getDialogueForInteraction } from '../utils/dialogueSelector';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import DynamicsDebugPanel from './DynamicsDebugPanel';
import EntityPanel from './EntityPanel';
import StatBar from './StatBar';
import LoadingSpinner from './LoadingSpinner';
import type { InteractionType } from '../types';
import { TRANSLATIONS } from '../constants';
import { gameConfig } from '../config/gameConfig';

interface UIControlsProps {
  selectedEntityId?: string | null;
  onEntitySelect?: (entityId: string | null) => void;
  onShowIntro?: () => void;
}

const UIControls: React.FC<UIControlsProps> = ({
  selectedEntityId,
  onEntitySelect,
  onShowIntro
}) => {
  const { gameState, dispatch } = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const selectedEntity = selectedEntityId
    ? gameState.entities.find(e => e.id === selectedEntityId)
    : null;
  const totalMoney = gameState.entities.reduce((sum, entity) => sum + entity.stats.money, 0);

  const entitiesStatus = gameState.entities.map(entity => {
    const criticalStats = ['hunger', 'sleepiness', 'loneliness', 'energy', 'health'];
    const avgHealth =
      criticalStats.reduce(
        (sum, stat) => sum + (entity.stats[stat as keyof typeof entity.stats] || 0),
        0
      ) / criticalStats.length;
    return {
      id: entity.id,
      health: Math.round(avgHealth),
      isDead: entity.isDead,
      criticalCount: criticalStats.filter(
        stat => (entity.stats[stat as keyof typeof entity.stats] || 0) < 20
      ).length
    };
  });

  const handleInteraction = (type: InteractionType, entityId?: string) => {
    if (entityId) {
      const entity = gameState.entities.find(e => e.id === entityId);
      if (!entity || entity.isDead) return;

      const result = applyInteractionEffect(entity.stats, type);

      dynamicsLogger.logUserInteraction(type, entityId, result);

      dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId, stats: result.stats } });
      if (result.mood) {
        dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId, mood: result.mood } });
      }

      // Usar diálogos del chat real basados en la interacción
      const dialogue = getDialogueForInteraction(type, entityId);

      if (dialogue) {
        // Log para análisis
        dynamicsLogger.logDialogue(
          entityId as 'circle' | 'square',
          dialogue.text,
          type.toLowerCase()
        );

        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: {
            message: dialogue.text,
            speaker: entityId as 'circle' | 'square',
            entityId: entityId,
            emotion: dialogue.emotion,
            position: { x: entity.position.x, y: entity.position.y },
            duration: 3000
          }
        });
      }
    } else {
      gameState.entities.forEach(entity => {
        if (entity.isDead) return;

        const result = applyInteractionEffect(entity.stats, type);
        dispatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { entityId: entity.id, stats: result.stats }
        });
        if (result.mood) {
          dispatch({
            type: 'UPDATE_ENTITY_MOOD',
            payload: { entityId: entity.id, mood: result.mood }
          });
        }
      });

      if (type === 'NOURISH') {
        const now = Date.now();
        const w = window as unknown as { __lastNourishTime?: number };
        const last = w.__lastNourishTime || 0;
        const deltaSec = (now - last) / 1000;
        w.__lastNourishTime = now;

        const baseResonanceGain = 30;

        const attenuation = Math.max(0.5, Math.min(1.0, deltaSec / 15));
        const gain = baseResonanceGain * attenuation * (1 - gameState.resonance / 120);

        const newResonance = Math.min(100, gameState.resonance + gain);

        dynamicsLogger.logResonanceChange(
          gameState.resonance,
          newResonance,
          'interacción NOURISH atenuada',
          gameState.entities
        );
        dynamicsLogger.logUserInteraction(type, undefined, {
          baseResonanceGain,
          attenuation,
          appliedGain: gain
        });

        dispatch({ type: 'UPDATE_RESONANCE', payload: newResonance });

        setToast({ message: 'Resonancia cuántica amplificada ∞', type: 'success' });

        // Usar diálogos del chat real para NOURISH
        // Elegir una entidad aleatoria para que "responda" al nutrido
        const randomEntity =
          gameState.entities[Math.floor(Math.random() * gameState.entities.length)];
        const dialogue = getDialogueForInteraction('nourish', randomEntity.id);

        if (dialogue) {
          dynamicsLogger.logDialogue(
            randomEntity.id as 'circle' | 'square',
            dialogue.text,
            'nourish'
          );

          dispatch({
            type: 'SHOW_DIALOGUE',
            payload: {
              message: dialogue.text,
              entityId: randomEntity.id,
              emotion: dialogue.emotion,
              position: { x: randomEntity.position.x, y: randomEntity.position.y },
              duration: 3000
            }
          });
        }
      }
    }
  };

  const resetGame = async () => {
    if (
      confirm(
        '¿Deseas reiniciar el experimento cuántico? La configuración actual se perderá en el espacio-tiempo.'
      )
    ) {
      setLoading(true);
      try {
        await new Promise(r => setTimeout(r, 300));
        dispatch({ type: 'RESET_GAME' });
        onEntitySelect?.(null);
        onShowIntro?.(); // Mostrar narrativa de nuevo
        setToast({ message: 'Universo reiniciado: Nueva dimensión iniciada', type: 'info' });
      } finally {
        setLoading(false);
      }
    }
  };

  const getEntityIcon = (id: string): string => {
    return id === 'circle' ? '●' : '■';
  };

  const getEntityName = (id: string): string => {
    return TRANSLATIONS.ENTITIES[id as keyof typeof TRANSLATIONS.ENTITIES] || id;
  };

  const toggleDebugMode = () => {
    gameConfig.debugMode = !gameConfig.debugMode;
    setToast({ message: gameConfig.debugMode ? 'Debug ON' : 'Debug OFF', type: 'info' });
  };

  return (
    <div style={{ position: 'relative' }}>
      {selectedEntity && (
        <EntityPanel entity={selectedEntity} onClose={() => onEntitySelect?.(null)} />
      )}

      {showStats && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}
          >
            <span style={{ fontSize: '16px' }}>📊</span>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', fontFamily: 'serif' }}>
              Métricas Cuánticas del Sistema
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

          <div style={{ fontSize: '14px', lineHeight: '1.5', fontStyle: 'italic' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Ciclos Temporales:</strong> {gameState.cycles}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Cronometría del Entanglement:</strong>{' '}
              {Math.round(gameState.togetherTime / 1000)}s
            </div>
            <div>
              <strong>Coherencia Cuántica:</strong>
              <span
                style={{
                  color:
                    gameState.resonance > 70
                      ? '#10b981'
                      : gameState.resonance > 30
                        ? '#f59e0b'
                        : '#ef4444',
                  marginLeft: '8px',
                  fontWeight: '600'
                }}
              >
                {gameState.resonance > 80
                  ? 'Trascendente'
                  : gameState.resonance > 60
                    ? 'Armónica'
                    : gameState.resonance > 40
                      ? 'Estable'
                      : gameState.resonance > 20
                        ? 'Fluctuante'
                        : 'Decoherente'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          height: '50px',
          background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
          borderTop: '1px solid #475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: '500',
              marginRight: '4px'
            }}
          >
            Entidades:
          </span>
          {gameState.entities.map((entity, index) => {
            const entityStatus = entitiesStatus[index];
            const getHealthColor = (health: number) => {
              if (health >= 70) return '#22c55e';
              if (health >= 40) return '#f59e0b';
              if (health >= 20) return '#ef4444';
              return '#7f1d1d';
            };

            return (
              <button
                key={entity.id}
                onClick={() => onEntitySelect?.(entity.id)}
                style={{
                  background:
                    selectedEntity?.id === entity.id
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                      : entity.isDead
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(51, 65, 85, 0.5)',
                  border:
                    selectedEntity?.id === entity.id
                      ? '2px solid #60a5fa'
                      : entity.isDead
                        ? '2px solid #ef4444'
                        : `2px solid ${getHealthColor(entityStatus.health)}40`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: entity.isDead ? '#fca5a5' : '#f1f5f9',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  opacity: entity.isDead ? 0.7 : 1,
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!entity.isDead) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${getHealthColor(entityStatus.health)}30`;
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    filter: entity.isDead ? 'grayscale(100%) opacity(0.6)' : 'none'
                  }}
                >
                  {getEntityIcon(entity.id)}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span>{getEntityName(entity.id)}</span>
                  {!entity.isDead && (
                    <div
                      style={{
                        fontSize: '9px',
                        color: getHealthColor(entityStatus.health),
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontSize: '8px' }}>●</span>
                      {entityStatus.health}%
                      {entityStatus.criticalCount > 0 && (
                        <span style={{ color: '#ef4444' }}>⚠{entityStatus.criticalCount}</span>
                      )}
                    </div>
                  )}
                </div>

                {entity.isDead && <span style={{ fontSize: '14px' }}>💀</span>}

                {!entity.isDead && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '2px',
                      right: '2px',
                      height: '2px',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '1px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${entityStatus.health}%`,
                        height: '100%',
                        background: getHealthColor(entityStatus.health),
                        borderRadius: '1px'
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                marginBottom: '2px'
              }}
            >
              Vínculo
            </div>
            <div style={{ width: '100px' }}>
              <StatBar
                label=""
                value={gameState.resonance}
                height={16}
                showLabel={false}
                animated={true}
              />
            </div>
            <div
              style={{
                fontSize: '10px',
                color: '#f1f5f9',
                marginTop: '1px',
                fontWeight: '600'
              }}
            >
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

          <div style={{ display: 'flex', gap: '8px' }}>
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
            <button
              onClick={toggleDebugMode}
              title="Toggle logs dev/prod"
              style={{
                background: gameConfig.debugMode ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.2)',
                border: `1px solid ${gameConfig.debugMode ? '#22c55e' : '#94a3b8'}`,
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
              <span>{gameConfig.debugMode ? '🟢' : '⚪'}</span>
              <span>Logs</span>
            </button>
          </div>

          <div
            style={{
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
            }}
          >
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

      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px',
            borderRadius: '4px',
            background:
              toast.type === 'success'
                ? '#4CAF50'
                : toast.type === 'error'
                  ? '#f44336'
                  : toast.type === 'warning'
                    ? '#ff9800'
                    : '#2196F3',
            color: 'white',
            zIndex: 1000
          }}
        >
          {toast.message}
        </div>
      )}

      {loading && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1500 }}>
          <LoadingSpinner />
        </div>
      )}

      <DynamicsDebugPanel visible={showDebug} onClose={() => setShowDebug(false)} />
    </div>
  );
};

export default UIControls;
