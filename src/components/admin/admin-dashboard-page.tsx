"use client";

import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Home,
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

  // Unauthorized State View (with ample padding to avoid fixed navbar collision)
  if (!hasAccess) {
    return (
      <div className="min-h-[85vh] pt-24 sm:pt-28 md:pt-32 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-zinc-900/85 border border-border/80 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto ring-8 ring-destructive/5">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Akses Terbatas: Administrator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Halaman ini diperuntukkan khusus bagi pengelola sistem dan
              administrator UTY Creative Hub dengan hak akses terverifikasi.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-border/60 text-xs text-left space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Status Akun Anda
            </span>
            <div className="font-bold text-foreground truncate">
              {isLoggedIn
                ? `${user?.name} (${user?.role})`
                : "Belum Masuk (Tamu / Guest)"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isLoggedIn
                ? "Akun Anda belum memiliki izin users:read atau roles:manage."
                : "Silakan masuk menggunakan akun Administrator (contoh: admin@gozaq.com)."}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            {!isLoggedIn ? (
              <Button
                onClick={openLoginModal}
                className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary/90 h-11 text-xs"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Masuk Sebagai Admin
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-xl border-border/70 h-11 text-xs"
              >
                <Link href="/account">Buka Profil Akun</Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border/70 h-11 text-xs"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Beranda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb navigasi admin"
        className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
      >
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>Beranda</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
        <span className="text-foreground font-semibold">Admin Dashboard</span>
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Pusat Kendali Sistem
            </Badge>
            <span className="text-xs text-muted-foreground">
              • UTY Creative Hub
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Dashboard Administrator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manajemen pengguna terpadu, konfigurasi matriks wewenang granular
            (PBAC), dan monitoring kesehatan infrastruktur backend.
          </p>
        </div>

        {/* User Identity & Shortcuts */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
          <div className="text-left md:text-right">
            <div className="text-xs font-bold text-foreground truncate max-w-[180px]">
              {user?.name}
            </div>
            <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
              {user?.email}
            </div>
          </div>

          <Badge
            variant="secondary"
            className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none px-3 py-1 text-xs capitalize shrink-0"
          >
            {user?.role === "admin" ? "Super Admin" : user?.role}
          </Badge>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-border/70 text-xs hidden lg:flex shrink-0"
          >
            <a
              href="http://localhost:8080/docs"
              target="_blank"
              rel="noreferrer"
            >
              <Server className="w-3.5 h-3.5 mr-1.5 text-primary" />
              API Docs
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
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <TabsList className="flex w-full min-w-[340px] sm:min-w-0 sm:grid sm:grid-cols-4 h-auto p-1.5 rounded-2xl bg-slate-100/90 dark:bg-zinc-800/80 border border-border/60 backdrop-blur-md">
            <TabsTrigger
              value="overview"
              className="flex-1 rounded-xl py-2.5 px-3 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
              <span>Ringkasan</span>
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="flex-1 rounded-xl py-2.5 px-3 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span>Pengguna</span>
            </TabsTrigger>

            <TabsTrigger
              value="roles"
              className="flex-1 rounded-xl py-2.5 px-3 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <KeyRound className="w-4 h-4 text-primary shrink-0" />
              <span>Matriks PBAC</span>
            </TabsTrigger>

            <TabsTrigger
              value="audit"
              className="flex-1 rounded-xl py-2.5 px-3 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Activity className="w-4 h-4 text-primary shrink-0" />
              <span>Audit Log</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
