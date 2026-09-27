"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
  UserCheck,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAdminUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "@/hooks/use-admin-queries";
import { usePermission } from "@/hooks/use-permission";
import type { BackendUser } from "@/types/auth";

export function AdminUsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [selectedUserForRole, setSelectedUserForRole] =
    useState<BackendUser | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<BackendUser | null>(null);

  const { can } = usePermission();
  const canManageRoles = can("roles:manage");
  const canDeleteUsers = can("users:delete");

  const { data, isLoading, isError, refetch } = useAdminUsersQuery({
    page,
    limit: 10,
    search: search.trim() || undefined,
    role: roleFilter,
  });

  const updateRoleMutation = useUpdateUserRoleMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const users = data?.users ?? [];
  const meta = data?.meta;

  const handleRoleChangeConfirm = async () => {
    if (!selectedUserForRole || !newRole) return;
    await updateRoleMutation.mutateAsync({
      userId: selectedUserForRole.id,
      role: newRole,
    });
    setSelectedUserForRole(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    await deleteUserMutation.mutateAsync(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background/80 border-border/60 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/80 border-border/60 rounded-xl">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="dosen">Dosen / Tendik</SelectItem>
              <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
              <SelectItem value="umum">Non-Civitas / Mitra</SelectItem>
              <SelectItem value="user">User Umum</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-border/60 shrink-0"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4">
                  Nama & Email
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Peran (Role)
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Identitas / Afiliasi
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Verifikasi
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right pr-4">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell className="pl-4">
                      <Skeleton className="h-4 w-36 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Skeleton className="h-8 w-8 ml-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                      <p className="text-sm font-semibold text-foreground">
                        Gagal memuat data pengguna
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pastikan Anda memiliki hak akses <code>users:read</code>
                        .
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-muted-foreground/50" />
                      <p className="text-sm font-semibold text-foreground">
                        Tidak ada pengguna ditemukan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Coba sesuaikan kata kunci pencarian atau filter role.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border/40 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* User info */}
                    <TableCell className="pl-4 py-3">
                      <div className="font-bold text-xs text-foreground">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {item.email}
                      </div>
                    </TableCell>

                    {/* Role badge */}
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={
                          item.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none"
                            : item.role === "dosen"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border-none"
                              : item.role === "mahasiswa"
                                ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border-none"
                                : item.role === "umum"
                                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold border-none"
                                  : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium border-none"
                        }
                      >
                        {item.role}
                      </Badge>
                    </TableCell>

                    {/* ID & Affiliation */}
                    <TableCell className="py-3">
                      <div className="text-xs font-medium text-foreground">
                        {item.id_number || "-"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                        {item.affiliation || "UTY"}
                      </div>
                    </TableCell>

                    {/* Verified Status */}
                    <TableCell className="py-3">
                      {item.is_verified ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Terverifikasi
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30 text-[10px]"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="py-3 text-right pr-4">
                      {canManageRoles || canDeleteUsers ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 rounded-xl"
                          >
                            <DropdownMenuLabel className="text-xs font-semibold">
                              Aksi Pengguna
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {canManageRoles && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUserForRole(item);
                                  setNewRole(item.role);
                                }}
                                className="text-xs cursor-pointer"
                              >
                                <UserCog className="w-3.5 h-3.5 mr-2 text-primary" />
                                Ubah Role
                              </DropdownMenuItem>
                            )}

                            {canDeleteUsers && item.role !== "admin" && (
                              <DropdownMenuItem
                                onClick={() => setUserToDelete(item)}
                                className="text-xs text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Hapus Akun
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          Read-Only
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-slate-50/40 dark:bg-zinc-800/20 text-xs">
            <span className="text-muted-foreground">
              Menampilkan Halaman <strong>{meta.current_page}</strong> dari{" "}
              <strong>{meta.total_pages}</strong> ({meta.total_items} data)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.has_prev || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 rounded-lg border-border/60 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta.has_next || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-2.5 rounded-lg border-border/60 text-xs"
              >
                Selanjutnya
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog: Change User Role */}
      <Dialog
        open={Boolean(selectedUserForRole)}
        onOpenChange={(open) => !open && setSelectedUserForRole(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Ubah Role Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sesuaikan wewenang akses untuk pengguna{" "}
              <strong>{selectedUserForRole?.name}</strong> (
              {selectedUserForRole?.email}).
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <label className="text-xs font-semibold text-foreground">
              Pilih Role Baru:
            </label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  Administrator (Akses Penuh)
                </SelectItem>
                <SelectItem value="dosen">Dosen / Tenaga Pendidik</SelectItem>
                <SelectItem value="mahasiswa">Mahasiswa Aktif UTY</SelectItem>
                <SelectItem value="umum">
                  Non-Civitas / Mitra Eksternal
                </SelectItem>
                <SelectItem value="user">User Biasa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUserForRole(null)}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              size="sm"
              disabled={updateRoleMutation.isPending || !newRole}
              onClick={handleRoleChangeConfirm}
              className="rounded-xl font-bold"
            >
              {updateRoleMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog: Delete User Confirmation */}
      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Konfirmasi Hapus Pengguna
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed">
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
              Tindakan ini akan menonaktifkan akun dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold"
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Akun"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
