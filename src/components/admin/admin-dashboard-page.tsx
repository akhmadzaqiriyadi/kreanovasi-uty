"use client";

import {
  Activity,
  ArrowLeft,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogIn,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminAuditLogs } from "@/components/admin/admin-audit-logs";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminRolesMatrix } from "@/components/admin/admin-roles-matrix";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { usePermission } from "@/hooks/use-permission";

export function AdminDashboardPage() {
  const { user, isLoggedIn, openLoginModal } = useAuth();
  const { isAdmin, can } = usePermission();
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Check if current user has permission to access dashboard
  const hasAccess =
    isLoggedIn && (isAdmin || can("users:read") || can("roles:manage"));

  // Unauthorized State View
  if (!hasAccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-border/80 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto ring-8 ring-destructive/5">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-foreground">
              Akses Terbatas: Administrator Only
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Halaman ini diperuntukkan khusus bagi pengelola sistem dan
              administrator UTY Creative Hub dengan hak akses terverifikasi.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-border/60 text-xs text-left space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Status Akun Anda:
            </span>
            <div className="font-bold text-foreground">
              {isLoggedIn
                ? `${user?.name} (${user?.role})`
                : "Belum Masuk (Guest)"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isLoggedIn
                ? "Akun Anda tidak memiliki izin granular users:read atau roles:manage."
                : "Silakan masuk menggunakan akun kredensial Administrator."}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            {!isLoggedIn ? (
              <Button
                onClick={openLoginModal}
                className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary/90"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Masuk Sebagai Admin
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-xl border-border/70"
              >
                <Link href="/account">Buka Profil Akun</Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border/70"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Beranda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-bold text-[11px] px-2.5 py-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Portal Kendali Sistem
            </Badge>
            <span className="text-xs text-muted-foreground">
              • UTY Creative Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Dashboard Administrator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Pusat manajemen pengguna terintegrasi, konfigurasi hak akses
            granular (PBAC), dan monitoring kehandalan infrastruktur backend.
          </p>
        </div>

        {/* User Identity & Shortcuts */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-foreground">
              {user?.name}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {user?.email}
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none px-3 py-1 text-xs capitalize"
          >
            {user?.role === "admin" ? "Super Admin" : user?.role}
          </Badge>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-border/70 text-xs hidden lg:flex"
          >
            <a
              href="http://localhost:8080/docs"
              target="_blank"
              rel="noreferrer"
            >
              <Server className="w-3.5 h-3.5 mr-1.5 text-primary" />
              API Docs (Scalar)
            </a>
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1.5 rounded-2xl bg-slate-100/80 dark:bg-zinc-800/60 border border-border/50 backdrop-blur-md">
          <TabsTrigger
            value="overview"
            className="rounded-xl py-2.5 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Ringkasan</span>
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="rounded-xl py-2.5 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-primary" />
            <span>Manajemen Pengguna</span>
          </TabsTrigger>

          <TabsTrigger
            value="roles"
            className="rounded-xl py-2.5 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-primary" />
            <span>Matriks PBAC</span>
          </TabsTrigger>

          <TabsTrigger
            value="audit"
            className="rounded-xl py-2.5 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-primary" />
            <span>Log Keamanan</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent
          value="overview"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminOverview />
        </TabsContent>

        {/* Tab 2: Users Management */}
        <TabsContent
          value="users"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminUsersTable />
        </TabsContent>

        {/* Tab 3: Roles & Permissions Matrix */}
        <TabsContent
          value="roles"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminRolesMatrix />
        </TabsContent>

        {/* Tab 4: Audit Logs */}
        <TabsContent
          value="audit"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminAuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
