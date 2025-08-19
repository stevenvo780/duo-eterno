import React from 'react';
import { useGame } from '../hooks/useGame';
import { applyInteractionEffect } from '../utils/interactions';
import { getRandomDialogue } from '../utils/dialogues';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import type { Entity, InteractionType } from '../types';
import StatBar from './StatBar';

interface EntityPanelProps {
  entity: Entity;
  onClose: () => void;
}

const EntityPanel: React.FC<EntityPanelProps> = ({ entity, onClose }) => {
  const { dispatch } = useGame();

  const handleInteraction = (type: InteractionType) => {
    if (entity.isDead) return;

    const result = applyInteractionEffect(entity.stats, type);
    dynamicsLogger.logUserInteraction(type, entity.id, result);

    dispatch({
      type: 'UPDATE_ENTITY_STATS',
      payload: { entityId: entity.id, stats: result.stats }
    });
    if (result.mood) {
      dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId: entity.id, mood: result.mood } });
    }

    const dialogueMap: Record<string, string> = {
      FEED: 'feeding',
      PLAY: 'playing',
      COMFORT: 'comforting',
      DISTURB: 'disturbing'
    };

    if (dialogueMap[type]) {
      const message = getRandomDialogue(
        dialogueMap[type] as keyof typeof import('../utils/dialogues').dialogues
      );
      dynamicsLogger.logDialogue(entity.id as 'isa' | 'stev', message, dialogueMap[type]);

      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message,
          speaker: entity.id as 'isa' | 'stev',
          duration: 3000
        }
      });
    }
  };

  const handleRevive = () => {
    dynamicsLogger.logEntityRevival(entity.id, {
      hunger: 60,
      sleepiness: 60,
      loneliness: 60,
      happiness: 60,
      energy: 60,
      boredom: 60,
      money: 25,
      health: 50
    });

    dispatch({ type: 'REVIVE_ENTITY', payload: { entityId: entity.id } });

    const message = getRandomDialogue('revival');
    dynamicsLogger.logDialogue(undefined, message, 'revival');

    dispatch({
      type: 'SHOW_DIALOGUE',
      payload: {
        message,
        duration: 4000
      }
    });
  };
  const getEntityIcon = (id: string): string => {
    return id === 'isa' ? '👩' : '👨';
  };

  const getEntityName = (id: string): string => {
    return id === 'isa' ? 'Isa' : 'Stev';
  };

  const getActivityName = (activity: string): string => {
    const activities: Record<string, string> = {
      'RESTING': 'Descansando',
      'WORKING': 'Trabajando', 
      'PLAYING': 'Jugando',
      'EATING': 'Comiendo'
    };
    return activities[activity] || activity;
  };

  const getMoodName = (mood: string): string => {
    return mood; // Los moods ya son emojis
  };

  const getStatName = (stat: string): string => {
    const stats: Record<string, string> = {
      'hunger': 'Hambre',
      'sleepiness': 'Sueño',
      'loneliness': 'Soledad',
      'happiness': 'Felicidad',
      'energy': 'Energía',
      'boredom': 'Aburrimiento',
      'money': 'Dinero',
      'health': 'Salud'
    };
    return stats[stat] || stat;
  };

  const getMoodColor = (mood: string): string => {
    const moodColors: Record<string, string> = {
      '😊': '#22c55e', // HAPPY/CONTENT
      '😢': '#ef4444', // SAD
      '😡': '#f97316', // ANGRY
      '😌': '#3b82f6', // CALM
      '🤩': '#a855f7', // EXCITED
      '😑': '#6b7280', // BORED
      '😔': '#ec4899', // LONELY
      '😰': '#f59e0b', // ANXIOUS
      '😴': '#64748b'  // TIRED
    };
    return moodColors[mood] || '#64748b';
  };

  const getOverallHealth = (): number => {
    const { stats } = entity;
    const criticalStats = ['hunger', 'sleepiness', 'loneliness', 'energy', 'health'];
    const avgCritical =
      criticalStats.reduce((sum, stat) => sum + (stats[stat as keyof typeof stats] || 0), 0) /
      criticalStats.length;
    return Math.round(avgCritical);
  };

  const overallHealth = getOverallHealth();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '2px solid #475569',
        borderRadius: '16px',
        padding: '20px',
        color: '#f1f5f9',
        minWidth: '320px',
        maxWidth: '380px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 1000
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '2px solid #475569'
        }}
      >
        <div
          style={{
            fontSize: '28px',
            color: entity.id === 'isa' ? '#ff6b9d' : '#4ade80',
            filter: entity.isDead ? 'grayscale(100%) opacity(0.5)' : 'none'
          }}
        >
          {getEntityIcon(entity.id)}
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: entity.isDead ? '#ef4444' : '#f1f5f9'
            }}
          >
            {getEntityName(entity.id)}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '12px',
                background: getMoodColor(entity.mood) + '20',
                color: getMoodColor(entity.mood),
                border: `1px solid ${getMoodColor(entity.mood)}40`,
                fontWeight: '600'
              }}
            >
              {getMoodName(entity.mood)}
            </div>

            {entity.isDead && (
              <div
                style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontWeight: '600'
                }}
              >
                💀 MUERTO
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(248, 250, 252, 0.1)',
            border: '1px solid #64748b',
            borderRadius: '8px',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: '18px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(248, 250, 252, 0.1)';
            e.currentTarget.style.borderColor = '#64748b';
          }}
        >
          ×
        </button>
      </div>

      {entity.isDead ? (
        <div
          style={{
            padding: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💀</div>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#fca5a5' }}>
            Esta entidad ha perdido su esencia vital
          </p>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#94a3b8' }}>
            {entity.timeOfDeath &&
              `Falleció hace ${Math.floor((Date.now() - entity.timeOfDeath) / 1000)}s`}
          </p>
          <button
            onClick={handleRevive}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            💫 Revivir Entidad
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <StatBar label="Estado General" value={overallHealth} height={28} animated={true} />
          </div>

          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
              Actividad Actual
            </div>
            <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>
              {getActivityName(entity.activity)}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            {Object.entries(entity.stats).map(([stat, value]) => (
              <StatBar
                key={stat}
                label={getStatName(stat)}
                value={value}
                maxValue={stat === 'money' ? 200 : 100}
                height={22}
                animated={true}
              />
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            {[
              { type: 'FEED', label: '🍽️', title: 'Alimentar', color: '#22c55e' },
              { type: 'PLAY', label: '🎮', title: 'Jugar', color: '#f59e0b' },
              { type: 'COMFORT', label: '🤗', title: 'Consolar', color: '#3b82f6' },
              { type: 'DISTURB', label: '😤', title: 'Molestar', color: '#ef4444' }
            ].map(({ type, label, title, color }) => (
              <button
                key={type}
                onClick={() => handleInteraction(type as InteractionType)}
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px ${color}30`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${color}30`;
                }}
              >
                <span style={{ fontSize: '16px' }}>{label}</span>
                <span>{title}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Posición X</div>
              <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>
                {Math.round(entity.position.x)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Posición Y</div>
              <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>
                {Math.round(entity.position.y)}
              </div>
            </div>
          </div>

          {entity.thoughts.length > 0 && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}
            >
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                💭 Pensamientos Recientes
              </div>
              {entity.thoughts.slice(-3).map((thought, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '11px',
                    color: '#cbd5e1',
                    marginBottom: '4px',
                    fontStyle: 'italic'
                  }}
                >
                  "{thought}"
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EntityPanel;
