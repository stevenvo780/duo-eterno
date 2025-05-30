/// <reference types="vite/client" />

import type { GameConfig } from './config/gameConfig';

declare global {
  interface Window {
    gameConfig: GameConfig;
    setGameSpeed: (multiplier: number) => void;
    applySpeedPreset: (presetName: string) => void;
    logConfig: () => void;
  }
}

export {};
