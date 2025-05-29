import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppOptimized from './AppOptimized.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppOptimized />
  </StrictMode>,
)
