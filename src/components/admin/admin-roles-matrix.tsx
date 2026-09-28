"use client";

import {
  AlertCircle,
  Check,
  Info,
  KeyRound,
  Loader2,
  Plus,
  ShieldPlus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useRevokePermissionMutation,
} from "@/hooks/use-admin-queries";
import { usePermission } from "@/hooks/use-permission";
import { cn } from "@/lib/utils";

export function AdminRolesMatrix() {
  const { data: roles = [], isLoading: isRolesLoading } = useAdminRolesQuery();
  const { data: permissions = [], isLoading: isPermsLoading } =
    useAdminPermissionsQuery();

  const { can } = usePermission();
  const canManageRoles = can("roles:manage");

  const assignMutation = useAssignPermissionMutation();
  const revokeMutation = useRevokePermissionMutation();
  const createRoleMutation = useCreateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();

  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [activeMobileRole, setActiveMobileRole] = useState<string>("admin");

  // Create role state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({
    id: "",
    name: "",
    description: "",
  });

  // Delete role state
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  // Group permission definitions by category prefix (e.g. "users", "roles", "rooms", "bookings", "audit", "uploads")
  const permissionDescriptions: Record<string, string> = {
    "users:read": "Melihat daftar pengguna dan profil detail",
    "users:create": "Membuat dan mendaftarkan pengguna baru",
    "users:update": "Mengubah data dan profil akun pengguna",
    "users:delete": "Menonaktifkan atau menghapus akun pengguna",
    "roles:read": "Melihat daftar role dan matriks wewenang",
    "roles:manage": "Menyesuaikan role pengguna dan matriks hak akses",
    "rooms:read": "Melihat katalog ruangan, kapasitas, dan fasilitas hub",
    "rooms:create": "Menambahkan ruangan dan studio baru ke sistem",
    "rooms:update": "Mengubah spesifikasi, status, dan tarif ruangan",
    "rooms:delete": "Menghapus atau mengarsipkan data ruangan hub",
    "bookings:read": "Melihat agenda dan daftar reservasi ruangan",
    "bookings:create": "Mengajukan permohonan reservasi ruangan hub",
    "bookings:manage": "Menyetujui, menolak, atau menjadwal ulang reservasi",
    "bookings:delete": "Membatalkan atau menghapus riwayat reservasi",
    "audit:read": "Melihat jejak audit dan riwayat keamanan sistem",
    "uploads:create": "Mengunggah file, gambar, dan materi ke server",
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

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.id.trim() || !roleForm.name.trim()) return;

    const formattedId = roleForm.id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]+/g, "_");

    await createRoleMutation.mutateAsync({
      id: formattedId,
      name: roleForm.name.trim(),
      description: roleForm.description.trim() || undefined,
    });

    setIsCreateOpen(false);
    setRoleForm({ id: "", name: "", description: "" });
  };

  const handleDeleteRoleConfirm = async () => {
    if (!roleToDelete) return;
    await deleteRoleMutation.mutateAsync(roleToDelete);
    setRoleToDelete(null);
  };

  const isLoading = isRolesLoading || isPermsLoading;

  return (
    <div className="space-y-6">
      {/* Informational Header Card */}
      <Card className="border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">
                  Matriks Hak Akses (PBAC & Dynamic RBAC)
                </CardTitle>
                <CardDescription className="text-xs">
                  Konfigurasi wewenang granular per role secara dinamis.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canManageRoles && (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  size="sm"
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah Role Baru
                </Button>
              )}

              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs px-2.5 py-1 w-fit flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise PBAC
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-border/40 text-xs text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>
              {canManageRoles ? (
                <>
                  Anda memiliki wewenang <strong>roles:manage</strong>. Geser
                  tabel ke samping pada layar kecil untuk melihat semua role.
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

      {/* Mobile PBAC View (< md screens) */}
      <div className="block md:hidden space-y-4">
        {/* Role Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full min-w-0 max-w-full pb-1">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
              ))
            : roles.map((r) => {
                const isSelected = (activeMobileRole || roles[0]?.id) === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActiveMobileRole(r.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white/80 dark:bg-zinc-800/80 border border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="capitalize">{r.name}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-normal",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-zinc-700 text-muted-foreground",
                      )}
                    >
                      {r.permissions.length}
                    </span>
                  </button>
                );
              })}
        </div>

        {/* Selected Role Card & Permissions Toggle List */}
        {(() => {
          const selectedRoleObj =
            roles.find((r) => r.id === activeMobileRole) || roles[0];
          if (!selectedRoleObj && isLoading) {
            return (
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            );
          }
          if (!selectedRoleObj) return null;

          return (
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground capitalize">
                      {selectedRoleObj.name}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {selectedRoleObj.id}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedRoleObj.description ||
                      "Konfigurasi wewenang hak akses"}
                  </p>
                </div>

                {canManageRoles &&
                  selectedRoleObj.id !== "admin" &&
                  selectedRoleObj.id !== "user" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRoleToDelete(selectedRoleObj.id)}
                      className="h-8 px-2.5 rounded-xl text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Hapus
                    </Button>
                  )}
              </div>

              {/* Permissions Switch Items */}
              <div className="space-y-2.5">
                {permissions.map((perm) => {
                  const hasPerm = selectedRoleObj.permissions.some(
                    (p) => p.id === perm.id,
                  );
                  const isToggling =
                    togglingKey === `${selectedRoleObj.id}:${perm.id}`;
                  const isAdmin = selectedRoleObj.id === "admin";
                  const desc =
                    perm.description ||
                    permissionDescriptions[perm.id] ||
                    "Izin akses sistem";

                  return (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-border/40"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                            {perm.id}
                          </code>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                          {desc}
                        </p>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isToggling ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <Switch
                            checked={hasPerm}
                            disabled={!canManageRoles || isAdmin}
                            onCheckedChange={() =>
                              handleToggle(selectedRoleObj.id, perm.id, hasPerm)
                            }
                            aria-label={`Toggle ${perm.id} for ${selectedRoleObj.name}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Permissions Matrix Table with Sticky Column (>= md screens) */}
      <div className="hidden md:block rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto relative">
          <Table className="min-w-[850px]">
            <TableHeader className="bg-slate-50/80 dark:bg-zinc-800/60">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4 w-[180px] sm:w-[240px] sticky left-0 bg-slate-50 dark:bg-zinc-800 z-10 shadow-xs border-r border-border/40">
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
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="capitalize">{r.name}</span>
                            {canManageRoles &&
                              r.id !== "admin" &&
                              r.id !== "user" && (
                                <button
                                  type="button"
                                  onClick={() => setRoleToDelete(r.id)}
                                  className="text-muted-foreground/40 hover:text-destructive transition-colors p-0.5 rounded cursor-pointer"
                                  title={`Hapus role ${r.name}`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                          </div>
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
                      <TableCell className="pl-4 py-3 sticky left-0 bg-white dark:bg-zinc-900 z-10">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-48" />
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
                        {/* Sticky Permission identifier & description */}
                        <TableCell className="pl-4 py-3.5 sticky left-0 bg-white/95 dark:bg-zinc-900/95 z-10 border-r border-border/40 shadow-xs">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-bold text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                              {perm.id}
                            </code>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 max-w-[210px] line-clamp-2">
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

      {/* Dialog: Tambah Role Baru */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <ShieldPlus className="w-5 h-5 text-primary" />
              Tambah Role Kustom Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Buat role baru untuk entitas atau divisi khusus di lingkungan
              kampus UCH.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRoleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Kode / ID Role (Slug)</Label>
              <Input
                placeholder="misal: asisten_lab, reviewer_pkm"
                value={roleForm.id}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, id: e.target.value })
                }
                className="rounded-xl text-xs h-10 font-mono"
                required
              />
              <p className="text-[10px] text-muted-foreground">
                Gunakan huruf kecil dan garis bawah (underscore).
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Nama Tampilan Role</Label>
              <Input
                placeholder="misal: Asisten Laboratorium"
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, name: e.target.value })
                }
                className="rounded-xl text-xs h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Deskripsi Wewenang</Label>
              <Input
                placeholder="Pengelola peralatan lab dan verifikasi jadwal"
                value={roleForm.description}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, description: e.target.value })
                }
                className="rounded-xl text-xs h-10"
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createRoleMutation.isPending}
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs"
              >
                {createRoleMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Role"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Delete Role Confirmation */}
      <Dialog
        open={Boolean(roleToDelete)}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Hapus Role &ldquo;{roleToDelete}&rdquo;?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus role beserta pemetaan izinnya dari
              sistem database. Pengguna yang memiliki role ini akan kehilangan
              izin terkait.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setRoleToDelete(null)}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoleConfirm}
              disabled={deleteRoleMutation.isPending}
              className="rounded-xl text-xs font-bold"
            >
              {deleteRoleMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
