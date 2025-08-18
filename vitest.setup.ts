// Setup de entorno de pruebas para Vitest.
// Objetivo: alinear temporizadores y objetos globales con expectativas de código
// de producción (e.g., game loops, animaciones) y habilitar matchers de Testing Library.
import '@testing-library/jest-dom';
import { vi } from 'vitest';


// Exponer temporizadores reales (sobrescribibles) para permitir spy/mocks finos.
Object.defineProperty(global, 'setInterval', {
  value: setInterval,
  writable: true
});

Object.defineProperty(global, 'clearInterval', {
  value: clearInterval,
  writable: true
});

Object.defineProperty(global, 'setTimeout', {
  value: setTimeout,
  writable: true
});

Object.defineProperty(global, 'clearTimeout', {
  value: clearTimeout,
  writable: true
});


// Mock de `window` mínimo viable para componentes que leen propiedades comunes.
const mockWindow = {
  setInterval: setInterval,
  clearInterval: clearInterval,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  location: { href: 'http://localhost:3000' },
  document: globalThis.document,
  performance: {
    now: () => Date.now()
  }
};


Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true
});


// Shim de `performance.now()` para cronometría en tests deterministas.
Object.defineProperty(global, 'performance', {
  value: {
    now: () => Date.now()
  },
  writable: true
});
