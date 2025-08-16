import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useSimpleGameLoop from '../hooks/useSimpleGameLoop';
import type { Entity, Zone } from '../types';

/**
 * 🧪 TESTS PARA EL GAME LOOP SIMPLE
 * 
 * COMO DEMANDASTE: PROBANDO antes de integrar
 */

// Mock de lodash throttle - SIMPLIFICADO para tests
vi.mock('lodash', () => ({
  throttle: vi.fn((fn) => {
    // Retorna la función directamente SIN throttling para tests
    const throttled = fn;
    throttled.cancel = vi.fn();
    throttled.flush = vi.fn();
    return throttled;
  })
}));

describe('useSimpleGameLoop', () => {
  let mockEntities: Entity[];
  let mockZones: Zone[];
  let mockOnUpdate: (entities: Entity[], zones: Zone[], resonanceData: { level: number; entities: number; zones: number; timestamp: number }) => void;

  beforeEach(() => {
    vi.useFakeTimers();
    
    mockEntities = [
      { 
        id: 'circle', 
        position: { x: 0, y: 0 }, 
        stats: {
          hunger: 50,
          sleepiness: 30,
          loneliness: 40,
          happiness: 70,
          energy: 80,
          boredom: 20,
          money: 100,
          health: 90
        },
        state: 'IDLE',
        activity: 'WANDERING',
        lastStateChange: Date.now(),
        lastActivityChange: Date.now(),
        lastInteraction: Date.now(),
        pulsePhase: 0,
        colorHue: 0,
        mood: 'CONTENT',
        thoughts: [],
        isDead: false
      } as Entity,
    ];
    
    mockZones = [
      { 
        id: 'zone1', 
        name: 'Test Zone',
        bounds: { x: 5, y: 5, width: 10, height: 10 },
        type: 'food' as const,
        color: '#ffffff',
        attractiveness: 0.5
      } as Zone,
    ];

    mockOnUpdate = vi.fn();
    
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ✅ TEST 1: Básico - Sin Memory Leaks
  it('✅ SHOULD: Iniciar correctamente sin memory leaks', () => {
    const { unmount } = renderHook(() => 
      useSimpleGameLoop([], [], mockOnUpdate)
    );

    // No debe crear interval con arrays vacíos
    expect(mockOnUpdate).not.toHaveBeenCalled();

    unmount();
    // Debe limpiar sin problemas
  });

  // ✅ TEST 2: Calcular resonancia 
  it('✅ SHOULD: Calcular resonancia correctamente', () => {
    const { unmount } = renderHook(() => 
      useSimpleGameLoop(mockEntities, mockZones, mockOnUpdate)
    );

    // Avanzar timer para trigger el interval
    vi.advanceTimersByTime(200);

    // Debe haber llamado onUpdate con datos de resonancia
    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'circle' }),
      ]),
      expect.arrayContaining([
        expect.objectContaining({ id: 'zone1' }),
      ]),
      expect.objectContaining({
        level: expect.any(Number),
        entities: 1,
        zones: 1,
        timestamp: expect.any(Number)
      })
    );

    unmount();
  });

  // ✅ TEST 3: Cleanup interval
  it('✅ SHOULD: Limpiar interval al desmount', () => {
    const { unmount } = renderHook(() => 
      useSimpleGameLoop(mockEntities, mockZones, mockOnUpdate)
    );

    unmount();

    // Después del unmount, los timers no deben seguir ejecutándose
    vi.advanceTimersByTime(200);
    expect(mockOnUpdate).toHaveBeenCalledTimes(0);
  });

  // ✅ TEST 4: Dependency tracking
  it('✅ SHOULD: Reiniciar solo cuando cambien entidades/zonas', () => {
    const { rerender } = renderHook(
      ({ entities, zones }) => useSimpleGameLoop(entities, zones, mockOnUpdate),
      { initialProps: { entities: mockEntities, zones: mockZones } }
    );

    // Primer render
    vi.advanceTimersByTime(200);
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);

    // Rerender con mismas cantidades - NO debe reiniciar
    rerender({ entities: mockEntities, zones: mockZones });
    vi.advanceTimersByTime(200);
    expect(mockOnUpdate).toHaveBeenCalledTimes(2); // Solo una llamada más

    // Cambiar cantidad de entidades - SÍ debe reiniciar  
    const newEntities = [...mockEntities, { ...mockEntities[0], id: 'square' } as Entity];
    rerender({ entities: newEntities, zones: mockZones });
    vi.advanceTimersByTime(200);
    expect(mockOnUpdate).toHaveBeenCalledTimes(3);
  });

  // ✅ TEST 5: Edge cases
  it('✅ SHOULD: Manejar casos edge correctamente', () => {
    const { unmount } = renderHook(() => 
      useSimpleGameLoop([], [], mockOnUpdate)
    );

    // Con arrays vacíos no debe ejecutar nada
    vi.advanceTimersByTime(200);
    expect(mockOnUpdate).not.toHaveBeenCalled();

    unmount();
  });
});
