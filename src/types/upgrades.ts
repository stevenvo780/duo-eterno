export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  currentLevel: number;
  category: UpgradeCategory;
  effect: UpgradeEffect;
  unlockRequirement?: UnlockRequirement;
  isUnlocked: boolean;
}

export type UpgradeCategory = 
  | 'EFFICIENCY' // Mejoras de eficiencia de actividades
  | 'ECONOMY' // Mejoras económicas
  | 'SURVIVAL' // Mejoras de supervivencia
  | 'RELATIONSHIP' // Mejoras de relación/resonancia
  | 'AUTOMATION'; // Mejoras de automatización

export interface UpgradeEffect {
  type: UpgradeEffectType;
  value: number; // Valor por nivel
  target?: string; // Stat específico o actividad
}

export type UpgradeEffectType =
  | 'STAT_DECAY_REDUCTION' // Reduce el decay de stats
  | 'ACTIVITY_EFFECTIVENESS' // Aumenta efectividad de actividades
  | 'MONEY_GENERATION' // Aumenta generación de dinero
  | 'COST_REDUCTION' // Reduce costos de actividades
  | 'RESONANCE_BONUS' // Bonus a resonancia
  | 'SURVIVAL_BOOST' // Reduce probabilidad de muerte
  | 'AUTO_ACTIVITY'; // Actividades automáticas ocasionales

export interface UnlockRequirement {
  type: 'MONEY' | 'RESONANCE' | 'CYCLES' | 'TOGETHER_TIME';
  value: number;
}

export interface UpgradeState {
  availableUpgrades: Upgrade[];
  purchasedUpgrades: { [upgradeId: string]: number }; // nivel de cada upgrade
  totalMoneySpent: number;
}

// Upgrades predefinidos del juego
export const DEFAULT_UPGRADES: Upgrade[] = [
  // EFFICIENCY CATEGORY
  {
    id: 'efficient_eating',
    name: 'Alimentación Eficiente',
    description: 'Reduce el hambre más efectivamente al comer',
    cost: 100,
    maxLevel: 5,
    currentLevel: 0,
    category: 'EFFICIENCY',
    effect: { type: 'ACTIVITY_EFFECTIVENESS', value: 20, target: 'EATING' },
    isUnlocked: true
  },
  {
    id: 'deep_sleep',
    name: 'Sueño Profundo',
    description: 'Reduce el cansancio más efectivamente al dormir',
    cost: 80,
    maxLevel: 5,
    currentLevel: 0,
    category: 'EFFICIENCY',
    effect: { type: 'ACTIVITY_EFFECTIVENESS', value: 15, target: 'SLEEPING' },
    isUnlocked: true
  },
  {
    id: 'social_butterfly',
    name: 'Mariposa Social',
    description: 'Reduce la soledad más efectivamente al socializar',
    cost: 120,
    maxLevel: 4,
    currentLevel: 0,
    category: 'EFFICIENCY',
    effect: { type: 'ACTIVITY_EFFECTIVENESS', value: 25, target: 'SOCIALIZING' },
    unlockRequirement: { type: 'RESONANCE', value: 60 },
    isUnlocked: false
  },

  // ECONOMY CATEGORY
  {
    id: 'hard_worker',
    name: 'Trabajador Incansable',
    description: 'Aumenta el dinero ganado al trabajar',
    cost: 150,
    maxLevel: 6,
    currentLevel: 0,
    category: 'ECONOMY',
    effect: { type: 'MONEY_GENERATION', value: 10, target: 'WORKING' },
    isUnlocked: true
  },
  {
    id: 'smart_shopper',
    name: 'Comprador Inteligente',
    description: 'Reduce el costo de las compras',
    cost: 200,
    maxLevel: 4,
    currentLevel: 0,
    category: 'ECONOMY',
    effect: { type: 'COST_REDUCTION', value: 15, target: 'SHOPPING' },
    unlockRequirement: { type: 'MONEY', value: 300 },
    isUnlocked: false
  },
  {
    id: 'passive_income',
    name: 'Ingresos Pasivos',
    description: 'Genera dinero automáticamente con el tiempo',
    cost: 500,
    maxLevel: 3,
    currentLevel: 0,
    category: 'ECONOMY',
    effect: { type: 'MONEY_GENERATION', value: 1, target: 'PASSIVE' },
    unlockRequirement: { type: 'MONEY', value: 1000 },
    isUnlocked: false
  },

  // SURVIVAL CATEGORY
  {
    id: 'vitality',
    name: 'Vitalidad',
    description: 'Reduce la velocidad de decay de todos los stats',
    cost: 300,
    maxLevel: 5,
    currentLevel: 0,
    category: 'SURVIVAL',
    effect: { type: 'STAT_DECAY_REDUCTION', value: 10 },
    unlockRequirement: { type: 'CYCLES', value: 100 },
    isUnlocked: false
  },
  {
    id: 'resilience',
    name: 'Resistencia',
    description: 'Reduce significativamente la probabilidad de muerte',
    cost: 800,
    maxLevel: 3,
    currentLevel: 0,
    category: 'SURVIVAL',
    effect: { type: 'SURVIVAL_BOOST', value: 30 },
    unlockRequirement: { type: 'CYCLES', value: 200 },
    isUnlocked: false
  },

  // RELATIONSHIP CATEGORY
  {
    id: 'bond_strengthener',
    name: 'Fortalecedor de Vínculos',
    description: 'Aumenta la ganancia de resonancia al estar juntos',
    cost: 250,
    maxLevel: 4,
    currentLevel: 0,
    category: 'RELATIONSHIP',
    effect: { type: 'RESONANCE_BONUS', value: 20 },
    unlockRequirement: { type: 'TOGETHER_TIME', value: 300000 }, // 5 minutos
    isUnlocked: false
  },
  {
    id: 'empathy',
    name: 'Empatía',
    description: 'Las interacciones son más efectivas',
    cost: 400,
    maxLevel: 3,
    currentLevel: 0,
    category: 'RELATIONSHIP',
    effect: { type: 'ACTIVITY_EFFECTIVENESS', value: 30, target: 'INTERACTIONS' },
    unlockRequirement: { type: 'RESONANCE', value: 80 },
    isUnlocked: false
  },

  // AUTOMATION CATEGORY
  {
    id: 'auto_care',
    name: 'Cuidado Automático',
    description: 'Ocasionalmente realiza actividades de cuidado automáticamente',
    cost: 1000,
    maxLevel: 2,
    currentLevel: 0,
    category: 'AUTOMATION',
    effect: { type: 'AUTO_ACTIVITY', value: 5, target: 'CARE' },
    unlockRequirement: { type: 'MONEY', value: 2000 },
    isUnlocked: false
  }
];
