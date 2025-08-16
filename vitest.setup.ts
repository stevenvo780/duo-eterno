import '@testing-library/jest-dom';

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

// Setup window object con timer methods
Object.defineProperty(globalThis, 'window', {
  value: {
    ...globalThis.window,
    setInterval: setInterval,
    clearInterval: clearInterval,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
  },
  writable: true
});
