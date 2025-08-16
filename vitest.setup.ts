import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup timer globals para vitest
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

// Mock window con todos los métodos necesarios para los tests
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

// Setup window object completo
Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true
});

// Mock performance.now para compatibilidad
Object.defineProperty(global, 'performance', {
  value: {
    now: () => Date.now()
  },
  writable: true
});
