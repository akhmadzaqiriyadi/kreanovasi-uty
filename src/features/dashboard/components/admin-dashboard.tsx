"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type User, useAuth } from "@/features/auth";
import { useAdminDashboardLogic } from "../hooks/use-admin-dashboard-logic";
import { AdminSettingsPanel } from "./admin-settings-panel";
import { AdminSidebarNav } from "./admin-sidebar-nav";
import { AdminStatsOverview } from "./admin-stats-overview";
import { AdminUsersTable } from "./admin-users-table";

interface AdminDashboardProps {
  user: User | null;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { logout } = useAuth();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    maintenanceMode,
    setMaintenanceMode,
    rateLimiting,
    setRateLimiting,
    mockUsers,
    filteredUsers,
    handleStatusToggle,
    handleSimulateSync,
    handleSaveSettings,
  } = useAdminDashboardLogic();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AdminSidebarNav
          userName={user?.name}
          userRole={user?.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        />

        <SidebarInset className="flex flex-col flex-1 overflow-hidden bg-background">
          {/* Header top bar */}
          <header className="flex items-center justify-between border-b border-border/30 px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Tingkat Akses:{" "}
                </span>
                <Badge variant="outline" className="capitalize text-[10px]">
                  {user?.role}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateSync}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sync DB</span>
            </Button>
          </header>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-6xl w-full mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-primary">
                  Admin Panel
                </h1>
                <p className="text-muted-foreground text-sm">
                  Kelola sistem, pengguna, dan konfigurasi API UCH Web App.
                </p>
              </div>

              {activeTab === "overview" && (
                <AdminStatsOverview
                  mockUsers={mockUsers}
                  onSimulateSync={handleSimulateSync}
                />
              )}

              {activeTab === "users" && (
                <AdminUsersTable
                  filteredUsers={filteredUsers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onStatusToggle={handleStatusToggle}
                />
              )}

              {activeTab === "settings" && (
                <AdminSettingsPanel
                  maintenanceMode={maintenanceMode}
                  rateLimiting={rateLimiting}
                  onMaintenanceModeChange={setMaintenanceMode}
                  onRateLimitingChange={setRateLimiting}
                  onSave={handleSaveSettings}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
