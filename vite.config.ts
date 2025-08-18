// Configuración base de Vite para React.
// Notas: se define alias `@` → `/src` para rutas absolutas en TS/TSX.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
