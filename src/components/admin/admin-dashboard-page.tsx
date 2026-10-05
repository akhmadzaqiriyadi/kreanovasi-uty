"use client";

import {
  Activity,
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  DoorOpen,
  Home,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogIn,
  Server,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminAuditLogs } from "@/components/admin/admin-audit-logs";
import { AdminBookingsManager } from "@/components/admin/admin-bookings-manager";
import { AdminEventsManager } from "@/components/admin/admin-events-manager";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminRolesMatrix } from "@/components/admin/admin-roles-matrix";
import { AdminRoomsManager } from "@/components/admin/admin-rooms-manager";
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
    <div className="min-h-screen w-full max-w-7xl mx-auto pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-2.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 overflow-x-hidden">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-bold text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Pusat Kendali Sistem
            </Badge>
            <span className="text-[11px] sm:text-xs text-muted-foreground">
              • UTY Creative Hub
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-foreground">
            Dashboard Administrator
          </h1>
          <p className="text-[11px] sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manajemen pengguna terpadu, konfigurasi matriks wewenang granular
            (PBAC), dan monitoring kesehatan infrastruktur backend.
          </p>
        </div>

        {/* User Identity & Shortcuts */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 pt-2.5 md:pt-0 border-t md:border-t-0 border-border/50">
          <div className="text-left md:text-right">
            <div className="text-xs font-bold text-foreground truncate max-w-[140px] sm:max-w-[180px]">
              {user?.name}
            </div>
            <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate max-w-[140px] sm:max-w-[180px]">
              {user?.email}
            </div>
          </div>

          <Badge
            variant="secondary"
            className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none px-2.5 py-1 text-[11px] sm:text-xs capitalize shrink-0"
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
        className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0"
      >
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 w-full max-w-full h-auto p-1 sm:p-1.5 gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl bg-slate-100/90 dark:bg-zinc-800/80 border border-border/60 backdrop-blur-md shadow-xs">
          <TabsTrigger
            value="overview"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Ringkasan</span>
          </TabsTrigger>

          <TabsTrigger
            value="rooms"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <DoorOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Ruangan</span>
          </TabsTrigger>

          <TabsTrigger
            value="bookings"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Reservasi</span>
          </TabsTrigger>

          <TabsTrigger
            value="events"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Agenda</span>
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Pengguna</span>
          </TabsTrigger>

          <TabsTrigger
            value="roles"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">PBAC</span>
          </TabsTrigger>

          <TabsTrigger
            value="audit"
            className="rounded-lg sm:rounded-xl py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer truncate"
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
            <span className="truncate">Audit</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent
          value="overview"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminOverview />
        </TabsContent>

        {/* Tab 2: Rooms Management */}
        <TabsContent
          value="rooms"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminRoomsManager />
        </TabsContent>

        {/* Tab 3: Bookings Management */}
        <TabsContent
          value="bookings"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminBookingsManager />
        </TabsContent>

        {/* Tab 4: Events & Agenda Management */}
        <TabsContent
          value="events"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminEventsManager />
        </TabsContent>

        {/* Tab 4: Users Management */}
        <TabsContent
          value="users"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminUsersTable />
        </TabsContent>

        {/* Tab 5: Roles & Permissions Matrix */}
        <TabsContent
          value="roles"
          className="outline-hidden focus:outline-hidden"
        >
          <AdminRolesMatrix />
        </TabsContent>

        {/* Tab 6: Audit Logs */}
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
