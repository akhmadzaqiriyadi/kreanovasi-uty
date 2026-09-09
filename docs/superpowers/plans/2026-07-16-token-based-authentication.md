# Token-Based Authentication Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a secure token-based authentication system (AccessToken in-memory, RefreshToken in HttpOnly cookies) with simulated Next.js Route Handlers, a React Context provider, Axios automatic token refresh interceptors, protected UI routes, and a complete E2E test suite.

**Architecture:** 
- Implement local Route Handlers under `/src/app/api/auth/*` to simulate Hono/Elysia authentication endpoints (login, refresh, me, logout).
- Build a React Context `AuthContext` to store the short-lived access token in-memory and state-manage user profiles.
- Configure Axios interceptors in `src/lib/api-client.ts` to hook response errors, catch 401s, silently refresh tokens using the `/refresh` endpoint, and retry failed requests.
- Use Next.js Middleware to block unauthorized access to `/dashboard` by inspecting a client-side `session_active` cookie.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Axios, Zod, React Hook Form, @base-ui/react, Playwright.

## Global Constraints
- We use Biome for linting and formatting. After writing or modifying any file, you must run `bun run check`.
- TypeScript strict mode must be followed (zero `any` types).
- Use Tailwind CSS v4 oklch colors and glassmorphism utilities (`glass-panel`, `glass-card`).
- Do not mix `ring-*` and `border-*` on the same card containers.

---

### Task 1: API Endpoint Simulation (Mock Route Handlers)

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/refresh/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`

**Interfaces:**
- Consumes: None (Root API endpoint).
- Produces: Simulated API endpoints for authentication.

- [ ] **Step 1: Create login route handler**
  
  Create file: `src/app/api/auth/login/route.ts`
  ```typescript
  import { NextResponse } from "next/server";

  export async function POST(request: Request) {
    try {
      const { email, password } = await request.json();

      // Simple mock authentication check
      if (email === "user@example.com" && password === "password123") {
        const response = NextResponse.json({
          accessToken: "mock-access-token-initial",
          user: {
            id: "1",
            name: "Jekz Dev",
            email: "user@example.com",
            role: "admin",
          },
        });

        // Set HttpOnly refresh token cookie
        response.cookies.set("refresh_token", "mock-refresh-token-active", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // Set non-HttpOnly session active indicator for middleware visibility
        response.cookies.set("session_active", "true", {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }

      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Terjadi kesalahan internal" },
        { status: 500 }
      );
    }
  }
  ```

- [ ] **Step 2: Create token refresh route handler**
  
  Create file: `src/app/api/auth/refresh/route.ts`
  ```typescript
  import { NextResponse } from "next/server";
  import { cookies } from "next/headers";

  export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken === "mock-refresh-token-active") {
      return NextResponse.json({
        accessToken: "mock-access-token-refreshed-" + Date.now(),
      });
    }

    return NextResponse.json(
      { message: "Sesi telah berakhir atau tidak valid" },
      { status: 401 }
    );
  }
  ```

- [ ] **Step 3: Create logout route handler**
  
  Create file: `src/app/api/auth/logout/route.ts`
  ```typescript
  import { NextResponse } from "next/server";

  export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear refresh_token and session_active cookies
    response.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("session_active", "", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  }
  ```

- [ ] **Step 4: Create current user route handler**
  
  Create file: `src/app/api/auth/me/route.ts`
  ```typescript
  import { NextResponse } from "next/server";

  export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.startsWith("Bearer mock-access-token")) {
      return NextResponse.json({
        id: "1",
        name: "Jekz Dev",
        email: "user@example.com",
        role: "admin",
      });
    }

    return NextResponse.json(
      { message: "Token tidak valid atau kadaluarsa" },
      { status: 401 }
    );
  }
  ```

- [ ] **Step 5: Run Biome formatting check**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 6: Commit changes**
  
  Run:
  ```bash
  git add src/app/api/auth
  git commit -m "feat(auth-api): add mock route handlers for authentication simulation"
  ```

---

### Task 2: API Client & Interceptors

**Files:**
- Modify: `src/lib/api-client.ts`

**Interfaces:**
- Consumes: Existing Axios instance `apiClient`.
- Produces: Updated `apiClient` supporting automatic header attachment and token refresh triggers.

- [ ] **Step 1: Modify api-client.ts to add Axios token interceptors**
  
  Replace the entire contents of `src/lib/api-client.ts` with the following configuration. This implements dynamic header updates and handles automatic 401 interception by calling `/auth/refresh` exactly once per failed request cycle.
  ```typescript
  import type { AxiosInstance } from "axios";
  import axios from "axios";
  import { env } from "@/lib/env";

  // In-memory token storage references for client-side routing
  let _accessToken: string | null = null;
  let _refreshSubscribers: Array<(token: string) => void> = [];
  let _isRefreshing = false;

  export function setLocalAccessToken(token: string | null) {
    _accessToken = token;
  }

  const apiClient: AxiosInstance = axios.create({
    baseURL:
      typeof window !== "undefined"
        ? "/api-proxy"
        : env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: Attach access token from memory if present
  apiClient.interceptors.request.use(
    (config) => {
      if (_accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${_accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: Capture 401 errors and refresh token silently
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if error is 401 and request has not been retried yet
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        if (typeof window === "undefined") {
          // If on the server (RSC), we don't have access to browser in-memory token state
          return Promise.reject(error);
        }

        // If a refresh is already in progress, queue up requests
        if (_isRefreshing) {
          return new Promise((resolve) => {
            _refreshSubscribers.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        _isRefreshing = true;

        try {
          // Perform silent token refresh
          // This goes through /api-proxy which propagates the HttpOnly refresh_token cookie
          const response = await axios.post(
            "/api-proxy/auth/refresh",
            {},
            { headers: { "Content-Type": "application/json" } }
          );

          const { accessToken } = response.data;
          setLocalAccessToken(accessToken);

          // Update header and broadcast to subscribers
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          _refreshSubscribers.forEach((callback) => callback(accessToken));
          _refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear token memory and reject request
          setLocalAccessToken(null);
          _refreshSubscribers = [];
          
          // Re-trigger redirect or context cleanup from UI side by propagating 401
          return Promise.reject(refreshError);
        } finally {
          _isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  export default apiClient;
  ```

- [ ] **Step 2: Run linter and formatter**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 3: Commit changes**
  
  Run:
  ```bash
  git add src/lib/api-client.ts
  git commit -m "feat(auth-client): add axios request/response interceptors for silent token refresh"
  ```

---

### Task 3: Auth Feature Layer (Types, Schemas, React Context & Hooks)

**Files:**
- Create: `src/features/auth/types/index.ts`
- Create: `src/features/auth/schemas/auth.schema.ts`
- Create: `src/features/auth/hooks/use-auth.ts`
- Create: `src/features/auth/index.ts`
- Create: `src/features/auth/providers/auth-provider.tsx`

**Interfaces:**
- Consumes: `apiClient` from `@/lib/api-client`.
- Produces: `AuthProvider` context and `useAuth` hook exporting session details.

- [ ] **Step 1: Create auth types**
  
  Create file: `src/features/auth/types/index.ts`
  ```typescript
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  export interface AuthSession {
    user: User | null;
    accessToken: string | null;
  }
  ```

- [ ] **Step 2: Create Zod validation schemas for forms**
  
  Create file: `src/features/auth/schemas/auth.schema.ts`
  ```typescript
  import { z } from "zod";

  export const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" })
      .trim(),
    password: z
      .string()
      .min(6, { message: "Password minimal harus 6 karakter" })
      .trim(),
  });

  export type LoginInput = z.infer<typeof loginSchema>;

  export const registerSchema = z
    .object({
      name: z
        .string()
        .min(2, { message: "Nama minimal harus 2 karakter" })
        .max(50)
        .trim(),
      email: z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .email({ message: "Format email tidak valid" })
        .trim(),
      password: z
        .string()
        .min(6, { message: "Password minimal harus 6 karakter" })
        .trim(),
      confirmPassword: z
        .string()
        .min(1, { message: "Konfirmasi password wajib diisi" })
        .trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password konfirmasi tidak cocok",
      path: ["confirmPassword"],
    });

  export type RegisterInput = z.infer<typeof registerSchema>;
  ```

- [ ] **Step 3: Create Auth Provider context component**
  
  Create file: `src/features/auth/providers/auth-provider.tsx`
  ```tsx
  "use client";

  import React, { createContext, useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import apiClient, { setLocalAccessToken } from "@/lib/api-client";
  import type { User, AuthSession } from "../types";
  import type { LoginInput } from "../schemas/auth.schema";

  interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginInput) => Promise<void>;
    logout: () => Promise<void>;
  }

  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthSession>({
      user: null,
      accessToken: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Silent refresh on initial mount
    useEffect(() => {
      async function initializeSession() {
        try {
          // Verify if cookie is present (by querying /refresh)
          const response = await apiClient.post("/auth/refresh");
          const { accessToken } = response.data;
          
          setLocalAccessToken(accessToken);
          
          // Fetch current profile
          const userResponse = await apiClient.get("/auth/me");
          setState({
            accessToken,
            user: userResponse.data,
          });
        } catch (error) {
          // If refresh fails, session is expired or guest
          setLocalAccessToken(null);
          setState({ accessToken: null, user: null });
        } finally {
          setIsLoading(false);
        }
      }

      initializeSession();
    }, []);

    const login = async (credentials: LoginInput) => {
      setIsLoading(true);
      try {
        const response = await apiClient.post("/auth/login", credentials);
        const { accessToken, user } = response.data;

        setLocalAccessToken(accessToken);
        setState({ accessToken, user });
        
        router.push("/dashboard");
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    const logout = async () => {
      setIsLoading(true);
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        console.error("Logout request failed:", error);
      } finally {
        setLocalAccessToken(null);
        setState({ accessToken: null, user: null });
        setIsLoading(false);
        router.push("/login");
      }
    };

    return (
      <AuthContext.Provider
        value={{
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: !!state.user,
          isLoading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  ```

- [ ] **Step 4: Create useAuth custom hook**
  
  Create file: `src/features/auth/hooks/use-auth.ts`
  ```typescript
  import { useContext } from "react";
  import { AuthContext } from "../providers/auth-provider";

  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }
  ```

- [ ] **Step 5: Create features main exporter**
  
  Create file: `src/features/auth/index.ts`
  ```typescript
  export * from "./types";
  export * from "./schemas/auth.schema";
  export * from "./hooks/use-auth";
  export * from "./providers/auth-provider";
  ```

- [ ] **Step 6: Run Biome checks**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 7: Commit changes**
  
  Run:
  ```bash
  git add src/features/auth
  git commit -m "feat(auth-features): implement auth context provider, custom hook, zod validation schemas, and types"
  ```

---

### Task 4: UI/UX Components & Protected Pages (Forms, Header Dropdown, Dashboard)

**Files:**
- Create: `src/features/auth/components/login-form.tsx`
- Create: `src/features/auth/components/register-form.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/app/dashboard/page.tsx`
- Modify: `src/components/navbar.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `useAuth` hook, NextBoi global layout, and `@base-ui` dropdown components.
- Produces: Visual login, registration, header navigation dropdown UI, and dashboard layout.

- [ ] **Step 1: Integrate AuthProvider into the root layout**
  
  Modify `src/app/layout.tsx` to wrap pages inside the `AuthProvider`.
  Replace lines 88 to 96 of `src/app/layout.tsx` with:
  ```tsx
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <AuthProvider>
                <Navbar />
                <main className="flex-1 flex flex-col relative z-10">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
  ```
  *(Also make sure to add `import { AuthProvider } from "@/features/auth";` at the top of layout.tsx)*

- [ ] **Step 2: Create LoginForm component**
  
  Create file: `src/features/auth/components/login-form.tsx`
  ```tsx
  "use client";

  import React, { useState } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import Link from "next/link";
  import { LogIn, AlertCircle, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useAuth } from "../hooks/use-auth";
  import { loginSchema, type LoginInput } from "../schemas/auth.schema";

  export function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginInput) => {
      setError(null);
      setIsSubmitting(true);
      try {
        await login(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Email atau password salah");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient-primary">
            Selamat Datang Kembali
          </h1>
          <p className="text-muted-foreground text-sm">
            Masuk ke akun NextBoi Anda untuk melanjutkan.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 flex items-center gap-2 mb-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>Masuk</span>
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-xs">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 3: Create RegisterForm component**
  
  Create file: `src/features/auth/components/register-form.tsx`
  ```tsx
  "use client";

  import React, { useState } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import Link from "next/link";
  import { UserPlus, AlertCircle, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { registerSchema, type RegisterInput } from "../schemas/auth.schema";

  export function RegisterForm() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (_data: RegisterInput) => {
      setError(null);
      setIsSubmitting(true);
      try {
        // Simulate registration delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSuccess(true);
      } catch (err: any) {
        setError("Registrasi gagal. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    };

    if (isSuccess) {
      return (
        <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <UserPlus className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Akun Berhasil Dibuat!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Registrasi sukses dilakukan. Anda sekarang dapat menggunakan akun ini untuk masuk.
            </p>
          </div>
          <Link
            href="/login"
            className="block w-full text-center bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-primary/35 transition-all duration-300"
          >
            Masuk Sekarang
          </Link>
        </div>
      );
    }

    return (
      <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient-primary">
            Daftar Akun Baru
          </h1>
          <p className="text-muted-foreground text-sm">
            Buat akun NextBoi baru Anda secara cepat.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 flex items-center gap-2 mb-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && (
              <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            <span>Daftar</span>
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-xs">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 4: Create Login Page**
  
  Create file: `src/app/(auth)/login/page.tsx`
  ```tsx
  import { LoginForm } from "@/features/auth/components/login-form";

  export const metadata = {
    title: "Masuk ke Akun Anda",
    description: "Masuk ke dashboard panel NextBoi Anda.",
  };

  export default function LoginPage() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 relative z-10">
        <LoginForm />
      </div>
    );
  }
  ```

- [ ] **Step 5: Create Register Page**
  
  Create file: `src/app/(auth)/register/page.tsx`
  ```tsx
  import { RegisterForm } from "@/features/auth/components/register-form";

  export const metadata = {
    title: "Daftar Akun Baru",
    description: "Buat akun NextBoi kustom Anda gratis.",
  };

  export default function RegisterPage() {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 relative z-10">
        <RegisterForm />
      </div>
    );
  }
  ```

- [ ] **Step 6: Create Protected Dashboard Page**
  
  Create file: `src/app/dashboard/page.tsx`
  ```tsx
  "use client";

  import React from "react";
  import { useAuth } from "@/features/auth";
  import { LayoutDashboard, Shield, ShieldAlert, Sparkles } from "lucide-react";

  export default function DashboardPage() {
    const { user } = useAuth();

    return (
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient-primary">
                Dashboard Panel
              </h1>
              <p className="text-muted-foreground text-sm">
                Selamat datang kembali, {user?.name || "User"}. Halaman ini diproteksi oleh server.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-panel border-border/30 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Sistem Autentikasi JWT</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Token akses berumur pendek disimpan secara aman di dalam memori React. Jika token tersebut kadaluarsa, interceptor pada client-side secara otomatis melakukan request refresh token silent.
              </p>
            </div>

            <div className="glass-panel border-border/30 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Keamanan Refresh Token</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Refresh Token berumur panjang disimpan di dalam cookie berjenis <code className="text-xs bg-zinc-100 dark:bg-zinc-900 rounded px-1 text-primary">HttpOnly</code>. Cookie ini tidak bisa dibaca oleh script Javascript manapun di browser (Melindungi dari serangan XSS).
              </p>
            </div>
          </div>

          <div className="glass-panel border-border/30 rounded-2xl p-8 shadow-lg text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Backend-for-Frontend (BFF) Ready</h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Konfigurasi proxy NextBoi sudah aktif. Saat Anda siap menghubungkan backend native Anda seperti Hono atau Elysia, Anda hanya perlu mengubah endpoint URL pada file konfigurasi environment.
            </p>
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 7: Update Navbar guest / user profile actions**
  
  Modify `src/components/navbar.tsx` to hook into user session.
  Replace the whole contents of `src/components/navbar.tsx` with:
  ```tsx
  "use client";

  import React from "react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { LogIn, LogOut, LayoutDashboard, User } from "lucide-react";
  import { buttonVariants } from "@/components/ui/button";
  import { useAuth } from "@/features/auth";
  import { ThemeToggle } from "./theme-toggle";

  export function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
              <span className="text-gradient-primary">NextBoi</span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                Open Source
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#dx"
                className="hover:text-foreground transition-colors"
              >
                DX Specs
              </Link>
              <Link
                href="/#feedback"
                className="hover:text-foreground transition-colors"
              >
                Feedback
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className={`hover:text-foreground transition-colors ${
                    pathname === "/dashboard" ? "text-foreground font-semibold" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-foreground">{user?.name}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center gap-2 border border-border/40 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-full pl-2 pr-1 py-1">
                  <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold border border-primary/25">
                    <User className="h-3 w-3" />
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 hover:text-destructive rounded-full transition-colors cursor-pointer"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className={`${buttonVariants({ size: "sm" })} bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 flex items-center gap-1.5`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 8: Run linter and formatter**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 9: Commit changes**
  
  Run:
  ```bash
  git add src/app/layout.tsx src/app/\(auth\) src/app/dashboard src/components/navbar.tsx src/features/auth/components
  git commit -m "feat(auth-ui): add login and register forms, navbar session display, and protected dashboard view"
  ```

---

### Task 5: Route Protection Middleware & E2E Validation Tests

**Files:**
- Create: `src/middleware.ts`
- Create: `tests/auth.spec.ts`

**Interfaces:**
- Consumes: Next.js edge runtime cookies object.
- Produces: Protected route middleware redirect and automated E2E test scripts.

- [ ] **Step 1: Create Next.js route protection middleware**
  
  Create file: `src/middleware.ts`
  ```typescript
  import { NextResponse } from "next/server";
  import type { NextRequest } from "next/server";

  export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if session cookie is active
    const sessionActive = request.cookies.get("session_active")?.value;

    // Direct guests trying to access protected dashboard routes to login
    if (pathname.startsWith("/dashboard") && sessionActive !== "true") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Direct authenticated users trying to access login/register back to dashboard
    if (
      (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
      sessionActive === "true"
    ) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
  };
  ```

- [ ] **Step 2: Create authentication E2E test file**
  
  Create file: `tests/auth.spec.ts`
  ```typescript
  import { expect, test } from "@playwright/test";

  test.describe("Authentication E2E Flow", () => {
    test("should redirect unauthenticated guest users trying to access dashboard", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.locator("text=Selamat Datang Kembali")).toBeVisible();
    });

    test("should successfully login, access dashboard, and logout", async ({
      page,
    }) => {
      await page.goto("/login");

      const emailInput = page.locator("input#email");
      const passwordInput = page.locator("input#password");
      const submitBtn = page.locator("button[type='submit']");

      // 1. Submit incorrect credentials
      await emailInput.fill("invalid-user@example.com");
      await passwordInput.fill("wrongpassword");
      await submitBtn.click();
      await expect(page.locator("text=Email atau password salah")).toBeVisible();

      // 2. Submit correct credentials
      await emailInput.fill("user@example.com");
      await passwordInput.fill("password123");
      await submitBtn.click();

      // Should be redirected to /dashboard
      await expect(page).toHaveURL(/.*\/dashboard/);
      await expect(page.locator("text=Dashboard Panel")).toBeVisible();
      await expect(page.locator("text=Jekz Dev")).toBeVisible();

      // 3. Prevent logged-in users from accessing login again
      await page.goto("/login");
      await expect(page).toHaveURL(/.*\/dashboard/);

      // 4. Logout
      const logoutBtn = page.locator("button[title='Keluar']");
      await logoutBtn.click();
      await expect(page).toHaveURL(/.*\/login/);
    });

    test("should automatically perform silent token refresh on 401 response", async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.locator("input#email").fill("user@example.com");
      await page.locator("input#password").fill("password123");
      await page.locator("button[type='submit']").click();
      await expect(page).toHaveURL(/.*\/dashboard/);

      // Modify the in-memory token or trigger request with a mock invalid token to force a 401
      // Playwright can intercept and check if the refresh request occurs
      let hasRefreshed = false;
      page.on("request", (req) => {
        if (req.url().includes("/auth/refresh")) {
          hasRefreshed = true;
        }
      });

      // Reload dashboard, forcing it to fetch session
      await page.reload();
      await expect(page.locator("text=Dashboard Panel")).toBeVisible();
      
      // Verification: Silent refresh occurred behind the scenes
      expect(hasRefreshed).toBe(true);
    });
  });
  ```

- [ ] **Step 3: Run Biome formatting check**
  
  Run: `bun run check`
  Expected: PASS

- [ ] **Step 4: Run E2E test suite to verify implementation**
  
  Run: `bun run test:e2e`
  Expected: PASS (All tests including landing-page and auth flow pass)

- [ ] **Step 5: Run Next.js production build check**
  
  Run: `bun run build`
  Expected: PASS

- [ ] **Step 6: Commit final middleware and tests**
  
  Run:
  ```bash
  git add src/middleware.ts tests/auth.spec.ts
  git commit -m "feat(auth-protection): add middleware for dashboard protection and playwright E2E integration tests"
  ```
