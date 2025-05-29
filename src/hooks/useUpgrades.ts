import { useMemo } from 'react';
import { useGame } from './useGame';
import type { Upgrade, UpgradeEffect } from '../types/upgrades';

export const useUpgrades = () => {
  const { gameState, dispatch } = useGame();

  const totalMoney = useMemo(() => {
    return gameState.entities.reduce((sum, entity) => sum + entity.stats.money, 0);
  }, [gameState.entities]);

  const unlockedUpgrades = useMemo(() => {
    return gameState.upgrades.availableUpgrades.filter(upgrade => upgrade.isUnlocked);
  }, [gameState.upgrades.availableUpgrades]);

  const purchasedUpgrades = useMemo(() => {
    return gameState.upgrades.availableUpgrades.filter(upgrade => 
      (gameState.upgrades.purchasedUpgrades[upgrade.id] || 0) > 0
    );
  }, [gameState.upgrades.availableUpgrades, gameState.upgrades.purchasedUpgrades]);

  const canPurchaseUpgrade = (upgrade: Upgrade): boolean => {
    const currentLevel = gameState.upgrades.purchasedUpgrades[upgrade.id] || 0;
    if (currentLevel >= upgrade.maxLevel) return false;
    
    const upgradeCost = upgrade.cost * (currentLevel + 1);
    return totalMoney >= upgradeCost && upgrade.isUnlocked;
  };

  const getUpgradeCost = (upgrade: Upgrade): number => {
    const currentLevel = gameState.upgrades.purchasedUpgrades[upgrade.id] || 0;
    return upgrade.cost * (currentLevel + 1);
  };

  const getUpgradeLevel = (upgradeId: string): number => {
    return gameState.upgrades.purchasedUpgrades[upgradeId] || 0;
  };

  const purchaseUpgrade = (upgradeId: string) => {
    dispatch({ type: 'PURCHASE_UPGRADE', payload: { upgradeId } });
    // Revisar requisitos de desbloqueo después de cada compra
    setTimeout(() => {
      dispatch({ type: 'CHECK_UNLOCK_REQUIREMENTS' });
    }, 100);
  };

  const checkUnlockRequirements = () => {
    dispatch({ type: 'CHECK_UNLOCK_REQUIREMENTS' });
  };

  // Función para aplicar efectos de upgrades (será usada por otros sistemas)
  const getUpgradeEffect = (effectType: UpgradeEffect['type'], target?: string): number => {
    let totalEffect = 0;
    
    purchasedUpgrades.forEach(upgrade => {
      const level = getUpgradeLevel(upgrade.id);
      if (level > 0 && upgrade.effect.type === effectType) {
        // Si el upgrade tiene un target específico, verificar que coincida
        if (upgrade.effect.target && target && upgrade.effect.target !== target) {
          return;
        }
        
        totalEffect += upgrade.effect.value * level;
      }
    });
    
    return totalEffect;
  };

  const getUpgradesByCategory = (category: Upgrade['category']) => {
    return unlockedUpgrades.filter(upgrade => upgrade.category === category);
  };

  return {
    // Estado
    totalMoney,
    unlockedUpgrades,
    purchasedUpgrades,
    totalMoneySpent: gameState.upgrades.totalMoneySpent,
    
    // Funciones de consulta
    canPurchaseUpgrade,
    getUpgradeCost,
    getUpgradeLevel,
    getUpgradeEffect,
    getUpgradesByCategory,
    
    // Acciones
    purchaseUpgrade,
    checkUnlockRequirements
  };
};
