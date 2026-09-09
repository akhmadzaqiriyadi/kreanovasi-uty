# NextBoi Codebase Architecture

This document details the folder structure, boundaries, and modular patterns adopted in the NextBoi template to ensure clean scalability.

---

## Folder Structure Hierarchy

```
/
├── .cursorrules           # Guidelines for Cursor and other AI editors
├── AGENTS.md              # Guidelines for AI coding assistants
├── CLAUDE.md              # Core dev commands and styling summary
├── biome.json             # Linter and formatter configurations
├── package.json           # Runtimes, compilation scripts, and module dependencies
├── docs/                  # Project-wide developer guidelines and architecture
└── src/
    ├── app/               # Next.js App Router (Layouts, Pages, and API endpoints)
    ├── components/        # Global layout elements and reusable components
    │   └── ui/            # Raw Shadcn component primitives
    ├── features/          # Modular business features (domain capsules)
    ├── hooks/             # Global React hooks
    ├── lib/               # Shared API clients and environmental configurations
    └── providers/         # Global React context wrappers (theme, query clients)
```

---

## Modular Features Directory (`src/features/`)

To prevent the project from turning into a spaghetti codebase as it grows, business logic is organized into self-contained "feature" directories. Each feature under `src/features/[feature_name]/` is structured as follows:

1. **`components/`**: Presentational and interactive React components unique to this feature module (e.g., `feedback-form.tsx`).
2. **`hooks/`**: Custom React hooks handling business workflows or data mutations (e.g., `use-submit-feedback.ts`).
3. **`schemas/`**: Shared validation objects using **Zod** (e.g., `feedback.schema.ts`).
4. **`services/`**: Network communication layers and fetch interfaces (e.g., `feedback.service.ts`).
5. **`types/`**: Core TypeScript contracts and domain models.
6. **`index.ts`**: The boundary file. Only export elements that should be consumed by pages or other components outside this feature.

---

## Server vs. Client Component Boundaries

NextBoi leverages Next.js 16 server-first routing. Ensure the following rules are adhered to:

### Server Components (Default)
- Every file inside `src/app/` (layouts, pages, loading states) is a Server Component by default.
- Use Server Components to fetch initial page-level data directly, manage SEO metadata, and render layouts.
- **Never** add `"use client"` to pages unless they require browser-only context.

### Client Components (`"use client"`)
- Place `"use client"` at the very top of files that require:
  - React lifecycle hooks (`useState`, `useEffect`, `useReducer`, `useRef`).
  - Interaction event handlers (`onClick`, `onChange`, `onSubmit`).
  - Browser API access (`localStorage`, `sessionStorage`, `window` triggers).
- Client components should be kept small and leaves-of-the-tree. Wrap client elements inside server layouts to preserve fast server rendering speed.

---

## Data Fetching & State Pipeline

1. **Client Fetching**: Handled via **TanStack Query** (`@tanstack/react-query`) wrapped in `src/providers/query-provider.tsx`. Client components should trigger query/mutation hooks instead of writing raw fetches.
2. **API Routes**: Next.js 16 dynamic route handlers live in `src/app/api/`. These handle server-side validations using Zod schemas, execute secure calculations, and return standard JSON formats.
3. **Proxied Queries**: Next.js rewrites (mapped in `next.config.ts`) map `/api-proxy/:path*` to the server endpoints. The custom `apiClient` (`src/lib/api-client.ts`) handles base URLs automatically depending on whether the execution is on the client or server.
