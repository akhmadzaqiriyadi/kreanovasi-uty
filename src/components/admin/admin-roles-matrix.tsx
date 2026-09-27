"use client";

import { Check, Info, KeyRound, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminPermissionsQuery,
  useAdminRolesQuery,
  useAssignPermissionMutation,
  useRevokePermissionMutation,
} from "@/hooks/use-admin-queries";
import { usePermission } from "@/hooks/use-permission";

export function AdminRolesMatrix() {
  const { data: roles = [], isLoading: isRolesLoading } = useAdminRolesQuery();
  const { data: permissions = [], isLoading: isPermsLoading } =
    useAdminPermissionsQuery();

  const { can } = usePermission();
  const canManageRoles = can("roles:manage");

  const assignMutation = useAssignPermissionMutation();
  const revokeMutation = useRevokePermissionMutation();

  const [togglingKey, setTogglingKey] = useState<string | null>(null);

  // Group permission definitions by category prefix (e.g. "users", "roles", "audit", "uploads")
  const permissionDescriptions: Record<string, string> = {
    "users:read": "Melihat daftar pengguna dan profil detail",
    "users:create": "Membuat dan mendaftarkan pengguna baru",
    "users:update": "Mengubah data dan profil akun pengguna",
    "users:delete": "Menonaktifkan atau menghapus akun pengguna",
    "roles:read": "Melihat daftar role dan matriks wewenang",
    "roles:manage": "Menyesuaikan role pengguna dan matriks hak akses",
    "audit:read": "Melihat jejak audit dan riwayat keamanan sistem",
    "uploads:create": "Mengunggah file dan materi ke server",
  };

  const handleToggle = async (
    roleId: string,
    permissionId: string,
    currentlyActive: boolean,
  ) => {
    if (!canManageRoles) return;
    const key = `${roleId}:${permissionId}`;
    setTogglingKey(key);

    try {
      if (currentlyActive) {
        await revokeMutation.mutateAsync({ roleId, permissionId });
      } else {
        await assignMutation.mutateAsync({ roleId, permissionId });
      }
    } finally {
      setTogglingKey(null);
    }
  };

  const isLoading = isRolesLoading || isPermsLoading;

  return (
    <div className="space-y-6">
      {/* Informational Header Card */}
      <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  Matriks Hak Akses (PBAC & Dynamic RBAC)
                </CardTitle>
                <CardDescription className="text-xs">
                  Konfigurasi hak akses berbasis izin granular (Permission-Based
                  Access Control) secara dinamis tanpa perlu deploy ulang.
                </CardDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-1 hidden sm:flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Enterprise PBAC
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>
              {canManageRoles ? (
                <>
                  Anda memiliki wewenang <strong>roles:manage</strong>. Klik
                  tombol switch pada kolom role untuk memberi atau mencabut izin
                  secara real-time.
                </>
              ) : (
                <>
                  Mode Read-Only aktif. Anda membutuhkan izin{" "}
                  <strong>roles:manage</strong> untuk memodifikasi matriks hak
                  akses.
                </>
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix Table */}
      <div className="rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4 min-w-[240px]">
                  Granular Permission
                </TableHead>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <TableHead
                        key={i}
                        className="text-center font-bold text-xs"
                      >
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </TableHead>
                    ))
                  : roles.map((r) => (
                      <TableHead
                        key={r.id}
                        className="text-center font-bold text-xs uppercase tracking-wider text-muted-foreground px-4 min-w-[120px]"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="capitalize">{r.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground/70 lowercase font-normal">
                            ({r.permissions.length} perms)
                          </span>
                        </div>
                      </TableHead>
                    ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="border-border/40">
                      <TableCell className="pl-4 py-3">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-56" />
                      </TableCell>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <TableCell key={j} className="text-center">
                          <Skeleton className="h-5 w-8 mx-auto rounded-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : permissions.map((perm) => {
                    const desc =
                      perm.description ||
                      permissionDescriptions[perm.id] ||
                      "Izin akses sistem";

                    return (
                      <TableRow
                        key={perm.id}
                        className="border-border/40 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Permission identifier & description */}
                        <TableCell className="pl-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                              {perm.id}
                            </code>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {desc}
                          </p>
                        </TableCell>

                        {/* Role switches */}
                        {roles.map((role) => {
                          const hasPerm = role.permissions.some(
                            (p) => p.id === perm.id,
                          );
                          const isToggling =
                            togglingKey === `${role.id}:${perm.id}`;
                          const isAdminRole = role.id === "admin";

                          return (
                            <TableCell
                              key={role.id}
                              className="text-center py-3.5 px-4"
                            >
                              <div className="flex items-center justify-center">
                                {isAdminRole ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none text-[10px] px-2 py-0.5"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Semua
                                  </Badge>
                                ) : isToggling ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                ) : (
                                  <Switch
                                    checked={hasPerm}
                                    disabled={!canManageRoles}
                                    onCheckedChange={() =>
                                      handleToggle(role.id, perm.id, hasPerm)
                                    }
                                    aria-label={`Toggle ${perm.id} for ${role.name}`}
                                  />
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
