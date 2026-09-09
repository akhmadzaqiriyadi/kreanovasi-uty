# ⚡ NextBoi — Premium Next.js 16 + Bun Startup Template

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-v1.3-f9f1e7?style=flat-square&logo=bun)](https://bun.sh)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2e8b57?style=flat-square&logo=playwright)](https://playwright.dev)
[![Biome](https://img.shields.io/badge/Biome-Linter-60a5fa?style=flat-square&logo=biome)](https://biomejs.dev)

NextBoi is a state-of-the-art Next.js 16 and Bun boilerplate designed for high-velocity SaaS startup deployment. Enforcing strict type safety, modular domain boundaries, complete UI-logic hooks separation, and modern Server Actions pipelines.

---

## ✨ Key Features & DX

- **Next.js 16 (App Router)**: Fast rendering using Server Components by default.
- **Server Actions**: Type-safe data mutations using native `"use server";` actions, eliminating REST API router configurations.
- **React Compiler**: Automatic render memoization out-of-the-box (no manual `useMemo` / `useCallback` hooks).
- **Separation of Concerns (SoC)**: UI components are purely visual. Form validation (Zod), submission states (TanStack Query), and side-effects are extracted into isolated logic hooks.
- **Tailwind CSS v4 & Glassmorphism**: Premium styling with curated dark modes, glassmorphism utilities (`glass-panel`, `glass-card`), and mesh grid layouts.
- **Playwright E2E Testing**: Comprehensive, parallel-ready E2E browser tests out-of-the-box.
- **Biome Toolchain**: Formatting, linting, and imports sorting checked in under `120ms`!

---

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone https://github.com/akhmadzaqiriyadi/nextboi-starter-kit.git
cd nextboi-starter-kit

# 2. Install dependencies + Playwright browsers
bun install
bunx playwright install

# 3. Setup environment
cp .env.example .env.local

# 4. Run dev server
bun run dev
```

Buka `http://localhost:3000`

### 🔑 Demo Credentials

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | user@example.com   | password123 |
| User  | guest@example.com  | password123 |

> Mock API berjalan langsung di Next.js Route Handlers — tidak perlu backend eksternal untuk mulai.

---

## 📂 Codebase Directory Structure

```text
src/
├── app/                    # Routing, layouts, page templates, sitemap, and robots
│   ├── (dashboard)/        # Dashboard route group — terisolasi dari landing layout
│   ├── (marketing)/        # Landing page + auth pages (login, register)
│   ├── api/auth/           # Mock API Route Handlers (login, register, logout, refresh, me)
│   ├── layout.tsx          # Global template (font, theme provider)
│   ├── robots.ts           # Dynamic crawler policies
│   └── sitemap.ts          # Dynamic XML sitemap
├── components/             # Reusable global layout elements
│   ├── ui/                 # shadcn/ui base components (Button, Input, Card, dll)
│   ├── navbar.tsx          # Navigation bar (auth-aware + scroll highlight)
│   ├── footer.tsx          # Footer
│   ├── hero-section.tsx    # Landing hero
│   ├── features-grid.tsx   # Features section
│   └── dx-widget.tsx       # DX Specs section
├── config/                 # Static data configs (navigation items, env schema)
├── features/               # Domain-specific feature modules
│   ├── auth/               # Auth context, hooks, forms, schema, types
│   │   ├── components/     # LoginForm, RegisterForm
│   │   ├── hooks/          # useAuth, useLoginFormLogic, useRegisterFormLogic
│   │   ├── providers/      # AuthProvider (context + silent refresh)
│   │   ├── schemas/        # Zod schemas (loginSchema, registerSchema)
│   │   └── types/          # User, AuthSession interfaces
│   ├── dashboard/          # Dashboard components, hooks, types
│   │   ├── components/     # AdminDashboard, UserDashboard + sub-components
│   │   └── types/          # TabType dan feature types
│   └── feedback/           # Feedback form feature
│       ├── actions.ts      # Server Action untuk submit feedback
│       ├── components/     # FeedbackForm
│       ├── hooks/          # useFeedbackFormLogic
│       └── schemas/        # Zod validation
├── lib/                    # API client (Axios + silent refresh interceptor)
├── proxy.ts                # Next.js Proxy — auth guard server-side redirect
└── tests/                  # Playwright E2E specs
```

---

## 🧠 Core Conventions & Guidelines

### 1. UI vs Logic Hook Separation
All state managers, Zod form controllers, and side-effects must be decoupled into custom hooks. The component file retains pure representational markup:

```typescript
// Good: Extracting Logic to hooks
export function FeedbackForm() {
  const { register, handleSubmit, errors, isPending } = useFeedbackFormLogic();

  return (
    <form onSubmit={handleSubmit}>
      <Input {...register("name")} />
      {/* Visual Markup */}
    </form>
  );
}
```

### 2. Next.js 16 Server Actions
Data submission and mutations are conducted through server action functions rather than Express-style REST route handlers:

```typescript
// src/features/feedback/actions.ts
"use server";

export async function submitFeedbackAction(data: FeedbackRequest) {
  const result = feedbackSchema.safeParse(data);
  if (!result.success) throw new Error("Invalid Input");
  
  // Database processing...
  return { success: true };
}
```

### 3. Rendering Flow (RSC vs CSR)
1. Default to **React Server Components (RSC)** for all routes, layouts, and page structures.
2. Nest Client Components (`"use client"`) strictly at leaf node interface elements (such as forms or interactive buttons).

---

## 🛠️ Developer Commands

### 1. Project Initialization
Install packages and download browser binaries for Playwright:
```bash
bun install
bunx playwright install
```

### 2. Run Local Development Server
```bash
bun dev
```

### 3. Verification Pipeline (Lint, Typecheck, Build)
```bash
# Format, lint, and sort imports via Biome
bun run check

# Next.js TypeScript Type-check & Production Bundling
bun run build
```

### 4. Run End-to-End Tests
```bash
# Run all Playwright tests across Chromium, Firefox, and WebKit
bun run test:e2e

# Run tests in interactive UI mode
bun run test:e2e:ui
```

---

## 🔄 Sambung ke Backend Nyata

1. Set `NEXT_PUBLIC_API_URL=https://your-api.com` di `.env.local`
2. Hapus folder `src/app/api/auth/` (mock routes tidak diperlukan)
3. Pastikan backend mengembalikan response shape yang sama:
   - `POST /auth/login` → `{ accessToken: string, user: { id, name, email, role } }`
   - `POST /auth/refresh` → `{ accessToken: string }` (set `refresh_token` HttpOnly cookie)
   - `GET /auth/me` → `{ id, name, email, role }`
   - `POST /auth/logout` → `200 OK`

---

## 📄 License
Created by **jekz**. Licensed under the [MIT License](LICENSE).
