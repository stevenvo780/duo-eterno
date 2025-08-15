import React, { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameProvider } from '../GameContext';
import { useGame } from '../../hooks/useGame';

const Probe: React.FC<{ action: (dispatch: ReturnType<typeof useGame>['dispatch'], getState: () => ReturnType<typeof useGame>['gameState']) => void }>
= ({ action }) => {
  const { gameState, dispatch } = useGame();
  useEffect(() => {
    action(dispatch, () => gameState);
  }, []);
  return (
    <div>
      <div data-testid="resonance">{gameState.resonance}</div>
      <div data-testid="cycles">{gameState.cycles}</div>
      <div data-testid="circle-money">{gameState.entities.find(e => e.id === 'circle')!.stats.money}</div>
      <div data-testid="circle-hunger">{gameState.entities.find(e => e.id === 'circle')!.stats.hunger}</div>
      <div data-testid="circle-dead">{String(gameState.entities.find(e => e.id === 'circle')!.isDead)}</div>
    </div>
  );
};

const renderWithProvider = (action: Parameters<typeof Probe>[0]['action']) =>
  render(
    <GameProvider>
      <Probe action={action} />
    </GameProvider>
  );

describe('GameContext reducer behavior', () => {
  it('clamps stats: money no cap, others [0,100]', async () => {
    renderWithProvider((dispatch) => {
      dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: 'circle', stats: { money: 500, hunger: 110 } } });
    });
    const money = await screen.findByTestId('circle-money');
    const hunger = await screen.findByTestId('circle-hunger');
    expect(Number(money.textContent)).toBe(500);
    expect(Number(hunger.textContent)).toBe(100);
  });

  it('TICK increments cycles and does not change resonance', async () => {
    let initialRes = 0;
    renderWithProvider((dispatch, getState) => {
      initialRes = getState().resonance;
      dispatch({ type: 'TICK', payload: 1000 });
    });
    const cycles = await screen.findByTestId('cycles');
    const resonance = await screen.findByTestId('resonance');
    expect(Number(cycles.textContent)).toBeGreaterThan(0);
    expect(Number(resonance.textContent)).toBeCloseTo(initialRes, 5);
  });

  it('REVIVE_ENTITY resets stats and ensures resonance min 50', async () => {
    let initialRes = 0;
    renderWithProvider((dispatch, getState) => {
      // Forzar muerte del círculo
      dispatch({ type: 'KILL_ENTITY', payload: { entityId: 'circle' } });
      // Ajustar resonancia baja y revivir
      dispatch({ type: 'UPDATE_RESONANCE', payload: 10 });
      initialRes = getState().resonance;
      dispatch({ type: 'REVIVE_ENTITY', payload: { entityId: 'circle' } });
    });
    const dead = await screen.findByTestId('circle-dead');
    const resonance = await screen.findByTestId('resonance');
    expect(dead.textContent).toBe('false');
    expect(Number(resonance.textContent)).toBeGreaterThanOrEqual(50);
  });
});
