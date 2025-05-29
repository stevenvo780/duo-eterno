import type { GameState } from '../types';

const STORAGE_KEY = 'duoEternoState';

export const saveGameState = (state: GameState): void => {
  try {
    const saveData = {
      ...state,
      lastSave: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    return data;
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
