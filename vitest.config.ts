// Configuración de Vitest para React + jsdom.
// - `environment: 'jsdom'` permite testear componentes que tocan DOM.
// - `setupFiles` prepara mocks globales/temporizadores.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
