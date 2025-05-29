import React, { useState } from 'react';
import { useUpgrades } from '../hooks/useUpgrades';
import type { Upgrade } from '../types/upgrades';

interface UpgradePanelProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORY_COLORS = {
  EFFICIENCY: '#4ade80', // green
  ECONOMY: '#fbbf24', // amber
  SURVIVAL: '#ef4444', // red
  RELATIONSHIP: '#ec4899', // pink
  AUTOMATION: '#8b5cf6' // violet
};

const CATEGORY_NAMES = {
  EFFICIENCY: '⚡ Eficiencia',
  ECONOMY: '💰 Economía',
  SURVIVAL: '❤️ Supervivencia',
  RELATIONSHIP: '💕 Relación',
  AUTOMATION: '🤖 Automatización'
};

const UpgradePanel: React.FC<UpgradePanelProps> = ({ visible, onClose }) => {
  const {
    totalMoney,
    unlockedUpgrades,
    totalMoneySpent,
    canPurchaseUpgrade,
    getUpgradeCost,
    getUpgradeLevel,
    getUpgradesByCategory,
    purchaseUpgrade
  } = useUpgrades();

  const [selectedCategory, setSelectedCategory] = useState<Upgrade['category'] | 'ALL'>('ALL');

  if (!visible) return null;

  const filteredUpgrades = selectedCategory === 'ALL' 
    ? unlockedUpgrades 
    : getUpgradesByCategory(selectedCategory);

  const categories = Object.keys(CATEGORY_NAMES) as Upgrade['category'][];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '800px',
        maxHeight: '80vh',
        width: '90%',
        overflow: 'auto',
        border: '2px solid #475569'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #475569',
          paddingBottom: '16px'
        }}>
          <div>
            <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '24px' }}>
              🛠️ Mejoras del Dúo
            </h2>
            <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '14px' }}>
              Dinero disponible: {totalMoney} | Gastado total: {totalMoneySpent}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              background: selectedCategory === 'ALL' ? '#3b82f6' : '#475569',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            🌟 Todas
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category ? CATEGORY_COLORS[category] : '#475569',
                color: selectedCategory === category ? '#000' : '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {CATEGORY_NAMES[category]}
            </button>
          ))}
        </div>

        {/* Upgrades Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filteredUpgrades.map(upgrade => {
            const currentLevel = getUpgradeLevel(upgrade.id);
            const cost = getUpgradeCost(upgrade);
            const canPurchase = canPurchaseUpgrade(upgrade);
            const isMaxLevel = currentLevel >= upgrade.maxLevel;
            
            return (
              <div
                key={upgrade.id}
                style={{
                  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `2px solid ${CATEGORY_COLORS[upgrade.category]}`,
                  position: 'relative'
                }}
              >
                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: CATEGORY_COLORS[upgrade.category],
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {CATEGORY_NAMES[upgrade.category]}
                </div>

                {/* Upgrade Info */}
                <h3 style={{ 
                  color: '#f1f5f9', 
                  margin: '0 0 8px 0', 
                  fontSize: '16px',
                  paddingRight: '120px'
                }}>
                  {upgrade.name}
                </h3>
                
                <p style={{ 
                  color: '#cbd5e1', 
                  margin: '0 0 12px 0', 
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {upgrade.description}
                </p>

                {/* Level Progress */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  gap: '8px'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Nivel:</span>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: '#475569',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(currentLevel / upgrade.maxLevel) * 100}%`,
                      height: '100%',
                      background: CATEGORY_COLORS[upgrade.category],
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 'bold' }}>
                    {currentLevel}/{upgrade.maxLevel}
                  </span>
                </div>

                {/* Effect Preview */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  marginBottom: '12px'
                }}>
                  <p style={{ 
                    color: '#94a3b8', 
                    margin: 0, 
                    fontSize: '12px'
                  }}>
                    Efecto actual: +{upgrade.effect.value * currentLevel}
                    {upgrade.effect.target && ` (${upgrade.effect.target})`}
                  </p>
                  {!isMaxLevel && (
                    <p style={{ 
                      color: CATEGORY_COLORS[upgrade.category], 
                      margin: '2px 0 0 0', 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Siguiente: +{upgrade.effect.value * (currentLevel + 1)}
                    </p>
                  )}
                </div>

                {/* Purchase Button */}
                {!isMaxLevel ? (
                  <button
                    onClick={() => purchaseUpgrade(upgrade.id)}
                    disabled={!canPurchase}
                    style={{
                      width: '100%',
                      background: canPurchase 
                        ? `linear-gradient(135deg, ${CATEGORY_COLORS[upgrade.category]}, ${CATEGORY_COLORS[upgrade.category]}dd)`
                        : '#64748b',
                      color: canPurchase ? '#000' : '#94a3b8',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: canPurchase ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {canPurchase 
                      ? `💰 Comprar - ${cost} dinero`
                      : `💸 Insuficiente - ${cost} dinero`
                    }
                  </button>
                ) : (
                  <div style={{
                    width: '100%',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    ✅ Maximizado
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredUpgrades.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#94a3b8'
          }}>
            <p>No hay mejoras disponibles en esta categoría</p>
            <p style={{ fontSize: '12px' }}>
              Sigue jugando para desbloquear más mejoras
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePanel;
