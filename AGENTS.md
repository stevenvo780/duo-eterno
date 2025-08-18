# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` (React + TypeScript). Key folders: `components/`, `hooks/`, `utils/`, `state/`, `constants/`, `types/`.
- Frontend entry: `src/main.tsx` → `src/App.tsx`.
- Backend: `backend/` (Express log server). Logs written to `backend/logs/`.
- Static assets: `public/` and `src/assets/`. Build output: `dist/`.
- Utility scripts: `scripts/` (analysis and dashboard tools).

## Build, Test, and Development Commands

- `npm run dev`: Start Vite dev server (frontend) at http://localhost:5173.
- `npm run server`: Start Express log server on port 3002.
- `npm run dev-full`: Run frontend and backend concurrently.
- `npm run build`: Type-check then build frontend.
- `npm run preview`: Preview the production build.
- `npm run lint` / `npm run format`: ESLint and Prettier.
- Extras: `npm run find-unused` (ts-prune), `npm run show-stats` (terminal dashboard), `npm run analyze-now` / `analyze-session` (log analysis).

## Coding Style & Naming Conventions

- TypeScript strict mode; prefer explicit types and `const`.
- Indentation 2 spaces; max line length 100; semicolons; single quotes; no trailing commas; `arrowParens: avoid` (see `.prettierrc`).
- File names: camelCase for utilities (`utils/mapGeneration.ts`), PascalCase for React components (`components/Canvas.tsx`).
- Hooks: `useX` pattern in `src/hooks/` (e.g., `useUnifiedGameLoop`).
- Linting: ESLint (TS + React Hooks). Fix warnings before PR.

## Testing Guidelines

- No automated tests configured yet. If adding tests, prefer Vitest + React Testing Library.
- Suggested layout: colocate `*.test.ts(x)` next to source or under `src/__tests__/`.
- Add `"test"` script and keep quick, deterministic tests; aim to cover core game loops and utilities.

## Commit & Pull Request Guidelines

- Commits: short imperative subject (English or Spanish), scope optional, e.g., `Improve AI loop scheduling` or `Ajusta decaimiento de stats`.
- Group related changes; keep diffs focused. Reference issues when applicable.
- PRs must include: purpose, summary of changes, how to run/test, screenshots or clips for UI changes, and any migration/config notes.

## Security & Configuration Tips

- Copy `.env.example` to `.env.development` for local work; never commit secrets. Vite env vars start with `VITE_...`.
- Backend writes logs to `backend/logs/` (ignored by Git). Avoid committing generated data.
- Ports: frontend 5173, backend 3002. Update docs if you change them.
