# Plan de Trabajo: PWA Offline para Dúo Eterno

## Objetivo
Entregar una versión instalable y 100% offline de Dúo Eterno para que Isabella pueda ejecutarla sin depender de servidores. Mantener el backend solo para desarrollo/analítica.

## Alcance realizado
- PWA básica: manifest + service worker de caché para funcionamiento offline.
- Registro del SW y metadatos en `index.html`.
- Desacople del backend: exportación de logs condicionada por env vars.
- Variables nuevas documentadas en `.env.example`.

## Cambios aplicados (archivos)
- `public/manifest.webmanifest`: nombre, colores, icono SVG, `display: standalone`.
- `public/sw.js`: caché precargada (`/`, `index.html`, manifest, icono) y estrategia cache-first.
- `index.html`: `<link rel="manifest">`, `theme-color` y registro del SW en producción.
- `src/utils/dynamicsLogger.ts`: respeta `VITE_ENABLE_LOG_EXPORT` y `VITE_LOG_SERVER_URL` (no exporta en prod).
- `.env.example`: añade `VITE_ENABLE_LOG_EXPORT` y `VITE_LOG_SERVER_URL`.

## Cómo usar
- Desarrollo: `npm run dev` (frontend). Para analítica, `npm run server` y define `VITE_ENABLE_LOG_EXPORT=true`.
- Build + preview: `npm run build && npm run preview`.
- Instalar como app: abre la app en el navegador y usa “Instalar” (icono de PWA). Funciona offline tras la primera carga.

## Siguientes pasos sugeridos (opcionales)
- Iconos PNG `192x192` y `512x512` en `public/` para mejor soporte (manifest ya preparado).
- Despliegue en Pages (GitHub/Cloudflare): publicar `dist/` y confirmar que la PWA se instala.
- Botones de “Exportar/Importar sesión” para respaldar recuerdos sin backend.

---

Actualización de dinámica (aplicada tras auditoría)
- Efectos de actividad integrados (inmediatos, por minuto y costos) con eficiencia por zona/tiempo.
- Utilidad no lineal + selección con softmax y “hábitos” ligeros.
- Resonancia con sinergia de actividad/zona, homeostasis y penalización por estrés.
- Efectos de zona con capacidad (crowding) por ocupación.
- Movimiento con fuerza social hacia una distancia preferida.
