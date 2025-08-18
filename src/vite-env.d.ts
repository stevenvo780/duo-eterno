/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
