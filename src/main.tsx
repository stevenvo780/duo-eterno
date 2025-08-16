import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { logGeneral } from './utils/logger';

if (import.meta.env.DEV) {
  logGeneral.info('Duo Eterno - Modo Desarrollo');
  logGeneral.info('Comandos de consola disponibles', {
    'setGameSpeed(2)': '2x más rápido',
    'setGameSpeed(0.5)': '2x más lento',
    'logConfig()': 'Ver configuración actual'
  });
}

import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
