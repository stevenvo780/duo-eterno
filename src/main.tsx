import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configuración de desarrollo
if (import.meta.env.DEV) {
  console.log('🎮 Duo Eterno - Modo Desarrollo');
  console.log('Usa la consola para controlar la velocidad del juego:');
  console.log('  setGameSpeed(2)    // 2x más rápido');
  console.log('  setGameSpeed(0.5)  // 2x más lento');
  console.log('  logConfig()        // Ver configuración actual');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
