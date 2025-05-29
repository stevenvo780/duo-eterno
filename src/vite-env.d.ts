/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_SPEED_MULTIPLIER: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_TARGET_FPS: string
  readonly VITE_MOVEMENT_UPDATE_FPS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
