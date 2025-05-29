import { useContext } from 'react';
import { GameContext } from '../state/GameContext';

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
