# UCH Web App Codebase Guidelines

## Core Commands
- **Development Server**: `bun run dev` (starts Next.js in development mode with Turbopack)
- **Production Build**: `bun run build` (runs Next.js build compilation and TS type checks)
- **Production Start**: `bun run start` (starts Next.js production server)
- **Format Code**: `bun run format` (runs `biome format --write .`)
- **Lint Code**: `bun run lint` (runs `biome lint .`)
- **Fix & Check All**: `bun run check` (runs `biome check --write .`)
- **Run Unit Tests**: `bun test` (runs Bun's native test runner)
- **Run E2E Tests**: `bun run test:e2e` (runs Playwright tests)
- **Run E2E UI Tests**: `bun run test:e2e:ui` (opens Playwright interactive UI)

## Architecture Overview
- `src/app/`: Next.js App Router endpoints, pages, layouts, and API routes.
- `src/features/`: Modular, self-contained business features (each feature contains `components/`, `hooks/`, `schemas/`, `services/`, `types/`, and a central `index.ts` exporter).
- `src/components/`: Global reusable UI components (and `ui/` containing raw Shadcn UI primitives).
- `src/lib/`: Shared utility instances (e.g. `apiClient`, `env`).
- `src/providers/`: Global React context providers (e.g., ThemeProvider, React Query ClientProvider).

## Coding Standards

### TypeScript
- Use strict TypeScript guidelines. Avoid `any` types at all times. Use explicit interfaces or types.
- Export types explicitly where appropriate. Ensure functions (especially API route handlers) have clean return types.

### React 19 & Next.js 16
- **Server Components by default**: Keep page components and layout shells as Server Components. Use Client Components (`"use client"`) only at leaf nodes requiring active state or browser triggers.
- **Next.js 16 Server Actions**: Prefer type-safe Server Actions (`"use server";`) for mutations and form inputs to eliminate Express-style REST route configurations.
- **Logic & UI Separation**: Keep visual layout components representational. Extract form state controllers, query mutations, and validation hooks into a custom logic hook (e.g. `use[Component]Logic`).
- **React Compiler**: The compiler optimizes components automatically. Avoid manual `useMemo` and `useCallback` unless building custom hooks.
- **Fetch & Data Binding**: Use TanStack Query (`useQuery` / `useMutation`) for client-side queries.

### Styling & CSS
- Style using Tailwind CSS v4. Config tokens reside in CSS variables under `@theme inline` in `src/app/globals.css`.
- Rely on preset global utilities: `glass-panel` for frosted panels and `glass-card` for interactive hoverable containers.
- **DOM Node Efficiency**: Minimize tag nesting. Avoid redundant wrapper `div` layers; use semantic grids and direct flex/grid layout variables instead.
- **Border Spacing Rules**: Do not mix `ring-*` and `border-*` on the same container (causes double border curves). Keep card containers transparent and pad child blocks (`p-6`).

### Formatting & Linting
- **Biome** is used for formatting, linting, and imports sorting. Code must pass `bun run check` without warnings or errors before committing.
- Ensure import statements are grouped cleanly (React, Lucide icons, components, hooks, services, configurations).
