/**
 * 🌿 VARIABILIDAD NATURAL PARA DINÁMICAS DE AGENTES
 * 
 * Sistema que balancea determinismo con variabilidad natural apropiada para un juego.
 * Principio: "Determinista en lo esencial, variable en lo emergente"
 */





interface VariabilityConfig {

  baseSeed: number;
  

  variabilityLevel: number;
  

  useTemporalNoise: boolean;
  

  allowEmergence: boolean;
}

const DEFAULT_VARIABILITY_CONFIG: VariabilityConfig = {
  baseSeed: 42,
  variabilityLevel: 0.3,
  useTemporalNoise: true,
  allowEmergence: true
};

let currentConfig = { ...DEFAULT_VARIABILITY_CONFIG };



/**
 * Generador que combina determinismo con variabilidad natural
 * 
 * Filosofía:
 * - Core logic: Determinista (pathfinding, física, cálculos)
 * - Personalidad: Semi-determinista (consistente pero con matices)
 * - Micro-decisiones: Variables (timing, preferencias menores)
 * - Emergencia: Natural (interacciones complejas impredecibles)
 */
class NaturalVariabilityGenerator {
  private deterministicState: number;
  private personalitySeed: number;
  private emergenceCounter: number;
  
  constructor(baseSeed: number, personalityModifier: number = 0) {
    this.deterministicState = baseSeed;
    this.personalitySeed = baseSeed + personalityModifier;
    this.emergenceCounter = 0;
  }
  
  /**
   * Ruido determinista para lógica core (pathfinding, física)
   * Siempre reproduce los mismos valores para los mismos inputs
   */
  deterministicNoise(x: number, y: number): number {

    let h = this.deterministicState;
    h = ((h * 1597334677) ^ (x * 3812015801)) >>> 0;
    h = ((h * 2989025573) ^ (y * 4132785409)) >>> 0;
    h = h ^ (h >>> 16);
    h = h * 0x85ebca6b;
    h = h ^ (h >>> 13);
    h = h * 0xc2b2ae35;
    h = h ^ (h >>> 16);
    
    return (h >>> 0) / 0x100000000;
  }
  
  /**
   * Variabilidad de personalidad - consistente per entidad pero con matices
   * Permite que cada agente tenga "quirks" únicos pero predecibles
   */
  personalityVariation(factor: number, entityId: string): number {

    let entityHash = 0;
    for (let i = 0; i < entityId.length; i++) {
      entityHash = ((entityHash << 5) - entityHash + entityId.charCodeAt(i)) & 0xffffffff;
    }
    
    const personalityBase = this.deterministicNoise(
      this.personalitySeed + entityHash, 
      factor * 1000
    );
    

    let temporalNoise = 0;
    if (currentConfig.useTemporalNoise) {

      const timeMinutes = Math.floor(Date.now() / 60000);
      temporalNoise = this.deterministicNoise(timeMinutes, entityHash) * 0.1;
    }
    
    return personalityBase * (1 - currentConfig.variabilityLevel) + 
           (personalityBase + temporalNoise) * currentConfig.variabilityLevel;
  }
  
  /**
   * Emergencia natural - permite comportamientos impredecibles en situaciones complejas
   * Usado solo para decisiones de alto nivel cuando múltiples opciones son válidas
   */
  emergentChoice<T>(options: T[], contextSeed: number = 0): T {
    if (!currentConfig.allowEmergence || options.length <= 1) {

      const index = Math.floor(this.deterministicNoise(contextSeed, this.emergenceCounter) * options.length);
      return options[index];
    }
    
    this.emergenceCounter++;
    

    const deterministicFactor = 1 - currentConfig.variabilityLevel;
    const emergentFactor = currentConfig.variabilityLevel;
    
    const deterministicChoice = this.deterministicNoise(contextSeed, this.emergenceCounter);
    const emergentChoice = Math.random();
    
    const finalChoice = deterministicChoice * deterministicFactor + emergentChoice * emergentFactor;
    const index = Math.floor(finalChoice * options.length);
    
    return options[Math.min(index, options.length - 1)];
  }
  
  /**
   * Timing natural - variaciones en duración de actividades
   * Evita que todas las acciones tengan duración exacta
   */
  naturalTiming(baseDuration: number, entityId: string): number {
    const variation = this.personalityVariation(baseDuration / 1000, entityId);
    

    const timingFactor = 0.8 + (variation * 0.4);
    
    return Math.max(baseDuration * 0.5, baseDuration * timingFactor);
  }
  
  /**
   * Fluctuaciones micro-emocionales
   * Pequeñas variaciones en mood sin afectar lógica principal
   */
  emotionalFluctuation(baseMood: number, intensity: number, entityId: string): number {
    const fluctuation = this.personalityVariation(intensity, entityId);
    

    const moodAdjustment = (fluctuation - 0.5) * 0.1 * intensity;
    
    return Math.max(0, Math.min(100, baseMood + moodAdjustment));
  }
}



let globalGenerator = new NaturalVariabilityGenerator(
  currentConfig.baseSeed, 
  0
);



/**
 * Configura el nivel de variabilidad del sistema
 */
export function setVariabilityConfig(config: Partial<VariabilityConfig>): void {
  currentConfig = { ...currentConfig, ...config };
  

  globalGenerator = new NaturalVariabilityGenerator(
    currentConfig.baseSeed,
    0
  );
  
  console.log(`🌿 Variabilidad configurada: ${(currentConfig.variabilityLevel * 100).toFixed(1)}%`);
}

/**
 * Obtiene la configuración actual
 */
export function getVariabilityConfig(): VariabilityConfig {
  return { ...currentConfig };
}

/**
 * Ruido determinista para lógica crítica
 * USO: Pathfinding, física, cálculos esenciales
 */
export function deterministicNoise(x: number, y: number): number {
  return globalGenerator.deterministicNoise(x, y);
}

/**
 * Variación de personalidad consistente
 * USO: Preferencias de actividad, estilos de comportamiento
 */
export function personalityVariation(factor: number, entityId: string): number {
  return globalGenerator.personalityVariation(factor, entityId);
}

/**
 * Elección emergente para decisiones complejas
 * USO: Cuando múltiples opciones son igualmente válidas
 */
export function emergentChoice<T>(options: T[], contextSeed: number = 0): T {
  return globalGenerator.emergentChoice(options, contextSeed);
}

/**
 * Timing natural con variaciones
 * USO: Duración de actividades, intervalos de decisión
 */
export function naturalTiming(baseDuration: number, entityId: string): number {
  return globalGenerator.naturalTiming(baseDuration, entityId);
}

/**
 * Fluctuaciones emocionales micro
 * USO: Variaciones sutiles en mood sin afectar gameplay
 */
export function emotionalFluctuation(baseMood: number, intensity: number, entityId: string): number {
  return globalGenerator.emotionalFluctuation(baseMood, intensity, entityId);
}



/**
 * Decisión inteligente entre opciones con scores
 * Combina lógica determinista con variabilidad natural
 */
export function intelligentChoice<T>(
  options: Array<{ item: T; score: number; weight?: number }>,
  entityId: string,
  contextSeed: number = 0
): T {
  if (options.length === 0) {
    throw new Error('No hay opciones para elegir');
  }
  
  if (options.length === 1) {
    return options[0].item;
  }
  

  const weightedOptions = options.map(opt => ({
    ...opt,
    weight: opt.weight ?? 1,
    adjustedScore: opt.score * (opt.weight ?? 1)
  }));
  

  weightedOptions.sort((a, b) => b.adjustedScore - a.adjustedScore);
  
  const topScore = weightedOptions[0].adjustedScore;
  const threshold = topScore * 0.8;
  
  const viableOptions = weightedOptions.filter(opt => opt.adjustedScore >= threshold);
  

  if (viableOptions.length === 1) {
    return viableOptions[0].item;
  }
  

  const personalityBias = personalityVariation(contextSeed, entityId);
  

  const biasedOptions = viableOptions.map((opt, index) => ({
    ...opt,
    finalScore: opt.adjustedScore + (personalityBias - 0.5) * 10 * (index + 1)
  }));
  

  const scoreDifference = biasedOptions[0].finalScore - biasedOptions[biasedOptions.length - 1].finalScore;
  
  if (currentConfig.allowEmergence && scoreDifference < 5) {

    return emergentChoice(biasedOptions.map(o => o.item), contextSeed);
  } else {

    biasedOptions.sort((a, b) => b.finalScore - a.finalScore);
    return biasedOptions[0].item;
  }
}

/**
 * Genera timing natural para secuencias de actividades
 */
export function generateActivitySequence(
  baseActivities: string[],
  entityId: string,
  baseDuration: number
): Array<{ activity: string; duration: number; startDelay: number }> {
  return baseActivities.map((activity, index) => {
    const duration = naturalTiming(baseDuration, `${entityId}_${activity}`);
    const personalityDelay = personalityVariation(index * 1000, entityId) * 2000;
    
    return {
      activity,
      duration,
      startDelay: personalityDelay
    };
  });
}



export const VARIABILITY_PRESETS = {

  DETERMINISTIC: {
    baseSeed: 42,
    variabilityLevel: 0,
    useTemporalNoise: false,
    allowEmergence: false
  },
  

  SUBTLE: {
    baseSeed: 42,
    variabilityLevel: 0.1,
    useTemporalNoise: true,
    allowEmergence: false
  },
  

  NATURAL: {
    baseSeed: 42,
    variabilityLevel: 0.3,
    useTemporalNoise: true,
    allowEmergence: true
  },
  

  DYNAMIC: {
    baseSeed: 42,
    variabilityLevel: 0.5,
    useTemporalNoise: true,
    allowEmergence: true
  },
  

  CHAOTIC: {
    baseSeed: 42,
    variabilityLevel: 0.8,
    useTemporalNoise: true,
    allowEmergence: true
  }
} as const;

/**
 * Carga un preset de variabilidad
 */
export function loadVariabilityPreset(presetName: keyof typeof VARIABILITY_PRESETS): void {
  setVariabilityConfig(VARIABILITY_PRESETS[presetName]);
}




if (import.meta.env.DEV) {
  loadVariabilityPreset('NATURAL');
} else {
  loadVariabilityPreset('NATURAL');
}


if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { variability?: object }).variability = {
    setConfig: setVariabilityConfig,
    getConfig: getVariabilityConfig,
    loadPreset: loadVariabilityPreset,
    presets: VARIABILITY_PRESETS,
    test: {
      deterministicNoise,
      personalityVariation,
      emergentChoice,
      intelligentChoice
    }
  };
}