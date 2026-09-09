# System Pages and Unit Testing Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create premium custom system pages (not found, error, loading) and set up a unit testing pipeline using Bun Test for NextBoi.

**Architecture:** 
- Add dynamic error boundaries and skeleton loading layouts under `src/app/` using Lucide icons and NextBoi's premium dark-mode ready glassmorphism styles.
- Configure Bun Test runner in `package.json` to execute unit tests inside `src/` while keeping E2E Playwright tests isolated in `tests/`.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Lucide Icons, Bun Test.

## Global Constraints
- We use Biome for linting and formatting. After writing or modifying any file, you must run `bun run check`.
- TypeScript strict mode must be followed (zero `any` types).
- Use Tailwind CSS v4 oklch colors and glassmorphism utilities (`glass-panel`, `glass-card`).
- Do not mix `ring-*` and `border-*` on the same card containers.

---

### Task 1: Add Custom 404 Not Found Page

**Files:**
- Create: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: NextBoi global design system, `Link` from `next/link`, `FileQuestion` and `Home` icons from `lucide-react`, `buttonVariants` from `@/components/ui/button`.
- Produces: React component for `/not-found` fallback routing.

- [ ] **Step 1: Write the failing E2E test to verify NotFound rendering**
  
  Modify `tests/landing-page.spec.ts` by appending this test block at the end (before the final closing bracket):
  ```typescript
  test("should display custom 404 page for non-existent routes", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();
    await expect(page.locator("text=Maaf, halaman yang Anda cari tidak ada")).toBeVisible();
  });
  ```

- [ ] **Step 2: Run the test to make sure it fails**
  
  Run: `bun run test:e2e`
  Expected: FAIL (asserts false or default Next.js 404 shown instead of "Halaman Tidak Ditemukan")

- [ ] **Step 3: Implement src/app/not-found.tsx**
  
  Create file: `src/app/not-found.tsx`
  ```tsx
  import Link from "next/link";
  import { FileQuestion, Home } from "lucide-react";
  import { buttonVariants } from "@/components/ui/button";

  export default function NotFound() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
        <div className="glass-panel border-border/30 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl relative overflow-hidden">
          {/* Soft Background glow */}
          <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

          <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2 animate-pulse">
            <FileQuestion className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gradient-primary">
              404
            </h1>
            <h2 className="text-xl font-bold text-foreground">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke alamat lain.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className={`${buttonVariants({ size: "lg" })} bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 glow-hover w-full inline-flex items-center justify-center gap-2`}
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Run linter and formatter**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 5: Run E2E tests to verify NotFound passes**
  
  Run: `bun run test:e2e`
  Expected: PASS

- [ ] **Step 6: Commit changes**
  
  Run:
  ```bash
  git add src/app/not-found.tsx tests/landing-page.spec.ts
  git commit -m "feat: add custom premium 404 page"
  ```

---

### Task 2: Add Custom Error Boundary Pages

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/global-error.tsx`

**Interfaces:**
- Consumes: Next.js Error interface props `error: Error & { digest?: string }` and `reset: () => void`.
- Produces: Error boundary wrappers for layouts (`error.tsx`) and root (`global-error.tsx`).

- [ ] **Step 1: Create src/app/error.tsx**
  
  Create file: `src/app/error.tsx`
  ```tsx
  "use client";

  import { useEffect } from "react";
  import { AlertCircle, RotateCcw } from "lucide-react";
  import { Button } from "@/components/ui/button";

  export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    useEffect(() => {
      console.error("App boundary error:", error);
    }, [error]);

    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
        <div className="glass-panel border-border/30 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl relative overflow-hidden">
          {/* Soft Background glow */}
          <div className="absolute top-[-50px] right-[-50px] h-[150px] w-[150px] rounded-full bg-destructive/10 blur-[40px] pointer-events-none" />

          <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2">
            <AlertCircle className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Terjadi Kesalahan Aplikasi
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Maaf atas ketidaknyamanan ini. Sistem mengalami kendala saat memproses halaman.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded p-1.5 break-all">
                ID Error: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              onClick={() => reset()}
              className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 w-full inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Create src/app/global-error.tsx**
  
  Create file: `src/app/global-error.tsx`
  ```tsx
  "use client";

  import { useEffect } from "react";
  import { AlertTriangle, RotateCcw } from "lucide-react";
  import { Button } from "@/components/ui/button";

  export default function GlobalError({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    useEffect(() => {
      console.error("Global application error:", error);
    }, [error]);

    return (
      <html lang="en" className="h-full">
        <body className="h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4">
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] h-[150px] w-[150px] rounded-full bg-red-500/10 blur-[40px] pointer-events-none" />

            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
              <AlertTriangle className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-zinc-100">
                Sistem Mengalami Kegagalan Fatal
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Telah terjadi error fatal pada server utama. Silakan coba muat ulang halaman.
              </p>
              {error.digest && (
                <p className="text-[11px] font-mono text-zinc-500 bg-zinc-950 rounded p-1.5 break-all">
                  ID Error: {error.digest}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                onClick={() => reset()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-600/25 transition-all duration-300 w-full inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Muat Ulang Aplikasi
              </Button>
            </div>
          </div>
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 3: Run linter and formatter checks**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 4: Commit changes**
  
  Run:
  ```bash
  git add src/app/error.tsx src/app/global-error.tsx
  git commit -m "feat: add app-level and root-level error boundaries"
  ```

---

### Task 3: Add Custom Loading Skeleton Page

**Files:**
- Create: `src/app/loading.tsx`

**Interfaces:**
- Consumes: None (Renders during RSC async hydration).
- Produces: React component fallback for loading states.

- [ ] **Step 1: Create src/app/loading.tsx**
  
  Create file: `src/app/loading.tsx`
  ```tsx
  import { Loader2 } from "lucide-react";

  export default function Loading() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
        <div className="glass-panel border-border/30 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 shadow-lg">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Memuat halaman...
          </p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Run linter checks**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 3: Commit changes**
  
  Run:
  ```bash
  git add src/app/loading.tsx
  git commit -m "feat: add custom premium loading page"
  ```

---

### Task 4: Configure Bun Test Pipeline and Write Unit Tests

**Files:**
- Modify: `package.json`
- Create: `src/lib/utils.test.ts`
- Create: `src/features/feedback/schemas/feedback.schema.test.ts`

- [ ] **Step 1: Modify package.json to include unit test script**
  
  In `package.json`, update `"scripts"` block:
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check --write .",
    "test": "bun test src/",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
  ```

- [ ] **Step 2: Create src/lib/utils.test.ts**
  
  Create file: `src/lib/utils.test.ts`
  ```typescript
  import { expect, test } from "bun:test";
  import { cn } from "./utils";

  test("cn merges tailwind classes correctly", () => {
    expect(cn("px-2 py-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-red-500", "text-white", "hover:bg-red-600")).toBe("bg-red-500 text-white hover:bg-red-600");
  });
  ```

- [ ] **Step 3: Run the unit test to verify it passes**
  
  Run: `bun run test`
  Expected: PASS (1 test passed)

- [ ] **Step 4: Create src/features/feedback/schemas/feedback.schema.test.ts**
  
  Create file: `src/features/feedback/schemas/feedback.schema.test.ts`
  ```typescript
  import { expect, test } from "bun:test";
  import { feedbackSchema } from "./feedback.schema";

  test("feedbackSchema validates correct inputs", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "This is a great template!",
    };

    const result = feedbackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("feedbackSchema validates correct inputs with empty message", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      message: "",
    };

    const result = feedbackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("feedbackSchema rejects too short names", () => {
    const invalidData = {
      name: "J",
      email: "john@example.com",
      message: "Hello",
    };

    const result = feedbackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues[0].message).toBe("Name must be at least 2 characters long");
    }
  });

  test("feedbackSchema rejects invalid emails", () => {
    const invalidData = {
      name: "John Doe",
      email: "not-an-email",
      message: "Hello",
    };

    const result = feedbackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(issues[0].message).toBe("Invalid email address format");
    }
  });
  ```

- [ ] **Step 5: Run all unit tests**
  
  Run: `bun run test`
  Expected: PASS (all tests pass)

- [ ] **Step 6: Run biome checker to verify linter compliance**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 7: Commit changes**
  
  Run:
  ```bash
  git add package.json src/lib/utils.test.ts src/features/feedback/schemas/feedback.schema.test.ts
  git commit -m "test: configure bun test and write unit tests for utils and feedback schema"
  ```
