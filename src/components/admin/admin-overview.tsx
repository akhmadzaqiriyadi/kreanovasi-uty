"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  KeyRound,
  Layers,
  Server,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminAuditLogsQuery,
  useAdminRolesQuery,
  useAdminUsersQuery,
  useSystemHealthQuery,
} from "@/hooks/use-admin-queries";

export function AdminOverview() {
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsersQuery({
    limit: 1,
  });
  const { data: rolesData, isLoading: isRolesLoading } = useAdminRolesQuery();
  const { data: auditData, isLoading: isAuditLoading } = useAdminAuditLogsQuery(
    1,
    5,
  );
  const { data: healthData, isLoading: isHealthLoading } =
    useSystemHealthQuery();

  const totalUsers = usersData?.meta.total_items ?? 0;
  const totalRoles = rolesData?.length ?? 0;
  const totalAuditEvents = auditData?.meta.total_items ?? 0;

  const isDbUp = healthData?.dependencies.database.status === "UP";
  const _isCacheUp = healthData?.dependencies.cache.status === "UP";

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Pengguna
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isUsersLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight">
                  {totalUsers}
                </span>
                <span className="text-xs text-muted-foreground">
                  Akun Terdaftar
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Roles & PBAC */}
        <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Peran & Akses (RBAC)
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <KeyRound className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isRolesLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight">
                  {totalRoles}
                </span>
                <span className="text-xs text-muted-foreground">
                  Role Terdefinisi
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Health */}
        <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              PostgreSQL DB
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isHealthLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    isDbUp
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold"
                      : "bg-red-500/10 text-red-600 border-red-500/30"
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  {isDbUp ? "Online" : "Offline"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {healthData?.dependencies.database.latency_ms?.toFixed(1) ??
                    "0"}{" "}
                  ms
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Audit Events */}
        <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas Audit Log
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isAuditLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight">
                  {totalAuditEvents}
                </span>
                <span className="text-xs text-muted-foreground">
                  Catatan Audit
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live System Diagnostics & Infrastructure Details */}
      <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  Status Infrastruktur & Diagnostik Sistem
                </CardTitle>
                <CardDescription className="text-xs">
                  Monitoring berkala performa Gozaq Backend Engine & Database
                  Cluster
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Sistem Sehat (UP)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                Uptime
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.uptime || "Loading..."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 text-primary" />
                Go Version
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.system.go_version || "go1.27"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                Memori Terpakai
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.system.memory_alloc || "Loading..."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Layers className="w-3 h-3 text-primary" />
                Goroutines
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.system.goroutines ?? 0} active
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Database className="w-3 h-3 text-primary" />
                Koneksi DB
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.dependencies.database.idle_conns ?? 0}/
                {healthData?.dependencies.database.max_conns ?? 25} pool
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Cache Driver
              </span>
              <p className="text-sm font-bold text-foreground mt-1">
                {healthData?.dependencies.cache.type || "Redis"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
