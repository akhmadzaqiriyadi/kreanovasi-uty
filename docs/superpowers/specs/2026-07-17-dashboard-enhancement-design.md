# Dashboard Enhancement — Design Spec

**Date:** 2026-07-17  
**Scope:** 3 fitur: Profile Page, Welcome/Onboarding Page, Dashboard Stats with Recharts  
**Status:** Approved

---

## Overview

Tiga fitur memperkuat starter kit sebagai referensi pattern SaaS dashboard:
1. **Profile Page** — User lihat dan edit data profil
2. **Welcome Page** — Onboarding setelah register pertama kali
3. **Dashboard Stats** — Recharts sparklines di admin stats cards

---

## Fitur 1: Profile Page (`/dashboard/profile`)

### Goal
User dapat melihat data profil (nama, email, role) dan mengedit nama serta email via mock PATCH API.

### Architecture

**New feature domain:** `src/features/profile/` (domain terpisah dari `auth`)

```
src/features/profile/
├── components/
│   ├── profile-header.tsx         ← Avatar initials + nama + badge role (read-only)
│   ├── profile-avatar-section.tsx ← Avatar 96px + overlay upload icon on hover (mock)
│   └── profile-edit-form.tsx      ← Client Component: form edit nama & email
├── hooks/
│   └── use-profile-form-logic.ts  ← RHF + Zod + PATCH /api/auth/me
├── schemas/
│   └── profile.schema.ts          ← name (min 2), email (valid)
├── types/
│   └── index.ts                   ← ProfileFormInput
└── index.ts                       ← barrel exports
```

**Route:** `src/app/(dashboard)/dashboard/profile/page.tsx` — Server Component + metadata

**API:** `src/app/api/auth/me/route.ts` — tambah `PATCH` handler (in-memory update)

### Data Flow
```
useAuth() → user.name, user.email, user.role
    ↓ defaultValues
ProfileEditForm → onSubmit → PATCH /api-proxy/auth/me
    ↓ success
refreshUser() → update auth context → toast sukses
```

### Auth Context Update
`AuthProvider` expose `refreshUser()` — call `GET /api-proxy/auth/me` dan update `user` state.

### Avatar
- Initials dari `user.name` (e.g. "Ahmad Zaki" → "AZ")
- Background gradient dari oklch berdasarkan initial
- Upload button → toast "Fitur segera hadir" (mock)

---

## Fitur 2: Welcome/Onboarding Page (`/dashboard/welcome`)

### Goal
Setelah register berhasil, user diarahkan ke `/dashboard/welcome` untuk orientasi.

### Trigger
`use-register-form-logic.ts` → setelah API sukses, `router.push("/dashboard/welcome")`

### Architecture

```
src/app/(dashboard)/dashboard/welcome/page.tsx   ← Server Component shell

src/features/dashboard/components/
├── welcome-header.tsx    ← Greeting + nama user (Client Component, useAuth)
├── welcome-checklist.tsx ← 3 item checklist, state di localStorage
└── welcome-cta.tsx       ← Button "Mulai" → /dashboard
```

### Checklist Items
1. ✅ **Buat Akun** — selalu checked
2. ⬜ **Lengkapi Profil** — link ke `/dashboard/profile`
3. ⬜ **Explore Dashboard** — link ke `/dashboard`

State: `localStorage` key `welcome_checklist_${user.id}`

### Design
- Glassmorphism (`glass-panel`) + `bg-grid-mesh`
- CSS-only enter animation (`animate-in`)
- Lucide icons: `CheckCircle2`, `UserCircle`, `LayoutDashboard`

---

## Fitur 3: Dashboard Stats dengan Recharts

### Goal
Admin stats cards punya mini sparkline chart trend 7 hari terakhir.

### Files
- **New:** `src/features/dashboard/components/admin-stats-card.tsx`
- **Modify:** `src/features/dashboard/components/admin-stats-overview.tsx`
- **Modify:** `src/features/dashboard/types/index.ts`

### StatCardData Type
```typescript
interface StatCardData {
  title: string;
  value: string;
  change: string;           // e.g. "+12%"
  changePositive: boolean;
  chartData: { value: number }[];  // 7 data points
  chartType: "area" | "bar";
  chartColor: string;       // oklch color string
}
```

### Chart per Metric
| Metric | Chart | Trend |
|--------|-------|-------|
| Total Users | AreaChart | Up |
| Revenue | AreaChart | Up |
| Active Sessions | BarChart | Varied |
| Satisfaction | AreaChart | Stable-up |

### Component Design
- `admin-stats-card.tsx` — `"use client"`, terima `StatCardData` props
- Recharts `ResponsiveContainer` height 60px, tanpa axes/tooltip/legend
- `admin-stats-overview.tsx` — pass typed props ke `admin-stats-card`

---

## Scope Boundaries (YAGNI)
- ❌ Persistent storage untuk profile update
- ❌ Avatar upload nyata
- ❌ Checklist sync ke server
- ❌ Chart dengan data real dari API
- ❌ Role-conditional profile page

---

## File Summary

### New Files (13)
- `src/app/(dashboard)/dashboard/profile/page.tsx`
- `src/app/(dashboard)/dashboard/welcome/page.tsx`
- `src/features/profile/components/profile-header.tsx`
- `src/features/profile/components/profile-avatar-section.tsx`
- `src/features/profile/components/profile-edit-form.tsx`
- `src/features/profile/hooks/use-profile-form-logic.ts`
- `src/features/profile/schemas/profile.schema.ts`
- `src/features/profile/types/index.ts`
- `src/features/profile/index.ts`
- `src/features/dashboard/components/welcome-header.tsx`
- `src/features/dashboard/components/welcome-checklist.tsx`
- `src/features/dashboard/components/welcome-cta.tsx`
- `src/features/dashboard/components/admin-stats-card.tsx`

### Modified Files (6)
- `src/app/api/auth/me/route.ts`
- `src/features/auth/providers/auth-provider.tsx`
- `src/features/auth/types/index.ts`
- `src/features/auth/hooks/use-register-form-logic.ts`
- `src/features/dashboard/components/admin-stats-overview.tsx`
- `src/features/dashboard/types/index.ts`
