import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { gameConfig } from './config/gameConfig'

// Automatically choose optimized version in production or when performance is prioritized
const shouldUse = import.meta.env.PROD || 
                          gameConfig.targetFPS < 60 || 
                          import.meta.env.VITE_USE_OPTIMIZED === 'true';

const AppToRender = shouldUse ? App : App;

// Log which version is being used in development
if (import.meta.env.DEV) {
  console.log(`🎮 Running ${shouldUse ? 'OPTIMIZED' : 'STANDARD'} version of Dúo Eterno`);
  if (gameConfig.debugMode) {
    console.log('🐛 Debug mode is enabled');
    console.log('⚡ Use setTurboMode(true) in console for fast testing');
    console.log('📊 Use setDebugMode(true) in console for detailed metrics');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppToRender />
  </StrictMode>,
)
