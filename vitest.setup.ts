import '@testing-library/jest-dom';
import { vi } from 'vitest';


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


Object.defineProperty(global, 'performance', {
  value: {
    now: () => Date.now()
  },
  writable: true
});
