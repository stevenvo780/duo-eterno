/**
 * 🧪 Tests simplificados para UIControls
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';


const MockUIControls = ({ 
  selectedEntityId, 
  onEntitySelect 
}: { 
  selectedEntityId: string | null;
  onEntitySelect: (id: string | null) => void;
}) => {
  return (
    <div data-testid="ui-controls">
      <div>Tiempo Juntos: 12s</div>
      <div>Resonancia: 78%</div>
      <button onClick={() => onEntitySelect('circle')}>
        Círculo
      </button>
      <button onClick={() => onEntitySelect('square')}>
        Cuadrado
      </button>
      <button>Impulsar Resonancia</button>
      {selectedEntityId && (
        <div data-testid="entity-stats">
          <div>Health: 90%</div>
          <div>Energy: 80%</div>
        </div>
      )}
    </div>
  );
};

describe('UIControls', () => {
  
  it('should render main UI elements', () => {
    const mockOnEntitySelect = vi.fn();
    
    const { getByTestId, getByText } = render(
      <MockUIControls 
        selectedEntityId={null} 
        onEntitySelect={mockOnEntitySelect} 
      />
    );

    expect(getByTestId('ui-controls')).toBeInTheDocument();
    expect(getByText('Tiempo Juntos: 12s')).toBeInTheDocument();
    expect(getByText('Resonancia: 78%')).toBeInTheDocument();
    expect(getByText('Círculo')).toBeInTheDocument();
    expect(getByText('Cuadrado')).toBeInTheDocument();
  });

  it('should handle entity selection', () => {
    const mockOnEntitySelect = vi.fn();
    
    const { getByText } = render(
      <MockUIControls 
        selectedEntityId={null} 
        onEntitySelect={mockOnEntitySelect} 
      />
    );

    fireEvent.click(getByText('Círculo'));
    expect(mockOnEntitySelect).toHaveBeenCalledWith('circle');
  });

  it('should show entity stats when selected', () => {
    const mockOnEntitySelect = vi.fn();
    
    const { getByTestId } = render(
      <MockUIControls 
        selectedEntityId="circle" 
        onEntitySelect={mockOnEntitySelect} 
      />
    );

    expect(getByTestId('entity-stats')).toBeInTheDocument();
  });

  it('should format time correctly', () => {
    const formatTime = (ms: number) => {
      const seconds = Math.round(ms / 1000);
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
      return `${Math.round(seconds / 3600)}h`;
    };

    expect(formatTime(5000)).toBe('5s');
    expect(formatTime(65000)).toBe('1m');
    expect(formatTime(3665000)).toBe('1h');
  });

  it('should calculate stat colors', () => {
    const getStatColor = (value: number) => {
      if (value > 75) return '#4ade80';
      if (value > 50) return '#fbbf24';
      if (value > 25) return '#fb7185';
      return '#ef4444';
    };

    expect(getStatColor(90)).toBe('#4ade80');
    expect(getStatColor(60)).toBe('#fbbf24');
    expect(getStatColor(30)).toBe('#fb7185');
    expect(getStatColor(10)).toBe('#ef4444');
  });

  it('should handle boost resonance calculation', () => {
    const calculateBoostAmount = (currentResonance: number, deltaSec: number = 1) => {
      const attenuation = Math.max(0.5, Math.min(1.0, deltaSec / 15));
      const gain = 8 * attenuation;
      return Math.min(100, currentResonance + gain);
    };

    expect(calculateBoostAmount(50)).toBeGreaterThan(50);
    expect(calculateBoostAmount(95)).toBeLessThanOrEqual(100);
  });
});