import type { GameState } from '../types';

const STORAGE_KEY = 'duoEternoState';

export const saveGameState = (gameState: GameState): void => {
  try {
    const stateToSave = {
      ...gameState,
      lastSave: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    
    // Validar que el estado tiene la estructura correcta
    if (!parsedState.entities || !Array.isArray(parsedState.entities)) {
      return null;
    }
    
    return parsedState as GameState;
  } catch (error) {
    console.warn('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear game state:', error);
  }
};
