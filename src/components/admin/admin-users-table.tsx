"use client";

import {
  AlertCircle,
  Briefcase,
  Building,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import type React from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { normalizeUtyProdi, UTY_FACULTIES } from "@/config/uty-faculties";
import {
  useAdminUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} from "@/hooks/use-admin-queries";
import { usePermission } from "@/hooks/use-permission";
import type { BackendUser } from "@/types/auth";

interface RoleFieldConfig {
  label: string;
  category: "civitas" | "non-civitas" | "admin";
  categoryLabel: string;
  idName: string;
  idPrefix: string;
  idPlaceholder: string;
  idHint: string;
  idRequired: boolean;
  affiliationName: string;
  affiliationPlaceholder: string;
  affiliationHint: string;
  icon: React.ReactNode;
}

const getRoleConfig = (role: string): RoleFieldConfig => {
  switch (role) {
    case "mahasiswa":
      return {
        label: "Mahasiswa",
        category: "civitas",
        categoryLabel: "Civitas Akademika",
        idName: "NPM (Nomor Pokok Mahasiswa)",
        idPrefix: "NPM",
        idPlaceholder: "misal: 5210411xxx",
        idHint: "Nomor induk mahasiswa resmi UTY untuk akses hub & fasilitas",
        idRequired: true,
        affiliationName: "Program Studi & Fakultas",
        affiliationPlaceholder: "misal: S1 Informatika - FST",
        affiliationHint: "Jurusan dan fakultas mahasiswa aktif",
        icon: <GraduationCap className="w-3.5 h-3.5 text-blue-500" />,
      };
    case "dosen":
      return {
        label: "Dosen / Tendik",
        category: "civitas",
        categoryLabel: "Civitas Akademika",
        idName: "NIDN / NIP",
        idPrefix: "NIDN/NIP",
        idPlaceholder: "misal: 0514088xxx atau 19850101xxx",
        idHint: "Nomor Induk Dosen Nasional atau NIP Tenaga Kependidikan",
        idRequired: true,
        affiliationName: "Fakultas / Unit Kerja",
        affiliationPlaceholder: "misal: Fakultas Bisnis & Humaniora",
        affiliationHint: "Fakultas atau biro unit kerja di lingkungan UTY",
        icon: <Building className="w-3.5 h-3.5 text-emerald-500" />,
      };
    case "umum":
      return {
        label: "Non-Civitas / Mitra",
        category: "non-civitas",
        categoryLabel: "Non-Civitas / Mitra",
        idName: "NIK (No. KTP)",
        idPrefix: "NIK",
        idPlaceholder: "misal: 340401xxxxxxxxxx (16 digit)",
        idHint: "Nomor KTP untuk verifikasi identitas tamu eksternal UCH",
        idRequired: true,
        affiliationName: "Instansi / Perusahaan / Komunitas",
        affiliationPlaceholder:
          "misal: PT Inovasi Solusi Digital / Komunitas Kreatif",
        affiliationHint: "Nama entitas atau lembaga asal pemohon",
        icon: <Briefcase className="w-3.5 h-3.5 text-amber-500" />,
      };
    case "admin":
      return {
        label: "Administrator",
        category: "admin",
        categoryLabel: "Super Admin",
        idName: "ID Petugas Administrator",
        idPrefix: "ID Admin",
        idPlaceholder: "misal: ADM-UCH-01",
        idHint: "Nomor induk staf atau ID petugas pengelola sistem",
        idRequired: false,
        affiliationName: "Unit Pengelola Hub",
        affiliationPlaceholder: "misal: UTY Creative Hub Operations",
        affiliationHint: "Divisi operasional pengelola UTY Creative Hub",
        icon: <Shield className="w-3.5 h-3.5 text-purple-500" />,
      };
    case "manager":
      return {
        label: "Manajer Fasilitas",
        category: "admin",
        categoryLabel: "Pengelola Hub",
        idName: "ID Manajer Fasilitas",
        idPrefix: "ID Manager",
        idPlaceholder: "misal: MGR-UCH-01",
        idHint: "ID petugas penanggung jawab fasilitas dan reservasi",
        idRequired: false,
        affiliationName: "Divisi Sarana & Prasarana",
        affiliationPlaceholder: "misal: Manajemen Aset & Ruangan UCH",
        affiliationHint: "Unit kerja sarana prasarana UCH",
        icon: <UserCheck className="w-3.5 h-3.5 text-indigo-500" />,
      };
    default:
      return {
        label: role,
        category: "civitas",
        categoryLabel: "Pengguna",
        idName: "Nomor Identitas",
        idPrefix: "ID",
        idPlaceholder: "Nomor ID pengguna",
        idHint: "Nomor pengenal akun",
        idRequired: false,
        affiliationName: "Afiliasi / Lembaga",
        affiliationPlaceholder: "Nama institusi atau jurusan",
        affiliationHint: "Asal institusi",
        icon: <Users className="w-3.5 h-3.5 text-primary" />,
      };
  }
};

export function AdminUsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Dialog Quick Role state
  const [selectedUserForRole, setSelectedUserForRole] =
    useState<BackendUser | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // Dialog Delete state
  const [userToDelete, setUserToDelete] = useState<BackendUser | null>(null);

  // Dialog Edit Full User state
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<BackendUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "mahasiswa",
    id_number: "",
    affiliation: "",
    is_verified: true,
  });

  // Dialog Create User state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "password123",
    role: "mahasiswa",
    id_number: "",
    affiliation: "S1 Informatika",
    is_verified: true,
  });

  const { can } = usePermission();
  const canManageRoles = can("roles:manage");
  const canUpdateUsers = can("users:update") || can("roles:manage");
  const canDeleteUsers = can("users:delete");

  const { data, isLoading, isError, refetch } = useAdminUsersQuery({
    page,
    limit: 10,
    search: search.trim() || undefined,
    role: roleFilter,
  });

  const updateRoleMutation = useUpdateUserRoleMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const createUserMutation = useCreateUserMutation();

  const users = data?.users ?? [];
  const meta = data?.meta;

  // Active configurations for dynamic forms
  const activeCreateRoleCfg = getRoleConfig(createForm.role);
  const activeEditRoleCfg = getRoleConfig(editForm.role);

  const handleOpenEdit = (user: BackendUser) => {
    setSelectedUserForEdit(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      id_number: user.id_number || "",
      affiliation: user.affiliation || "",
      is_verified: user.is_verified,
    });
    setIsEditOpen(true);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) return;

    await createUserMutation.mutateAsync({
      name: createForm.name,
      email: createForm.email,
      password: createForm.password || "password123",
      role: createForm.role,
      id_number: createForm.id_number.trim() || undefined,
      affiliation: createForm.affiliation.trim() || undefined,
    });

    setIsCreateOpen(false);
    setCreateForm({
      name: "",
      email: "",
      password: "password123",
      role: "mahasiswa",
      id_number: "",
      affiliation: "S1 Informatika",
      is_verified: true,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit || !editForm.name || !editForm.email) return;

    await updateUserMutation.mutateAsync({
      userId: selectedUserForEdit.id,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      id_number: editForm.id_number.trim() || undefined,
      affiliation: editForm.affiliation.trim() || undefined,
      is_verified: editForm.is_verified,
    });

    setIsEditOpen(false);
    setSelectedUserForEdit(null);
  };

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

  const getRoleBadge = (role: string) => {
    const cfg = getRoleConfig(role);

    if (role === "admin") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <Badge
            variant="secondary"
            className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border-none text-[11px]"
          >
            {cfg.label}
          </Badge>
          <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-medium">
            {cfg.categoryLabel}
          </span>
        </div>
      );
    }
    if (role === "dosen") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <Badge
            variant="secondary"
            className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border-none text-[11px]"
          >
            {cfg.label}
          </Badge>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            {cfg.categoryLabel}
          </span>
        </div>
      );
    }
    if (role === "mahasiswa") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border-none text-[11px]"
          >
            {cfg.label}
          </Badge>
          <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium">
            {cfg.categoryLabel}
          </span>
        </div>
      );
    }
    if (role === "umum") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <Badge
            variant="secondary"
            className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold border-none text-[11px]"
          >
            {cfg.label}
          </Badge>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-medium">
            {cfg.categoryLabel}
          </span>
        </div>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium border-none capitalize text-[11px]"
      >
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, NPM, NIDN, NIK, atau afiliasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background/80 border-border/60 rounded-xl text-xs sm:text-sm h-10 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="flex-1 sm:w-[170px] bg-background/80 border-border/60 rounded-xl text-xs h-10">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori & Role</SelectItem>
                <SelectItem value="mahasiswa">
                  Civitas: Mahasiswa UTY
                </SelectItem>
                <SelectItem value="dosen">Civitas: Dosen & Tendik</SelectItem>
                <SelectItem value="umum">Non-Civitas: Mitra & Tamu</SelectItem>
                <SelectItem value="admin">Administrator Sistem</SelectItem>
                <SelectItem value="manager">Manajer Fasilitas</SelectItem>
                <SelectItem value="user">User Biasa</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="rounded-xl border-border/60 h-10 px-3 text-xs shrink-0"
              title="Muat ulang data"
            >
              Refresh
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-3.5 text-xs shrink-0 shadow-sm active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Tambah Pengguna</span>
          </Button>
        </div>
      </div>

      {/* Mobile Card View (< md screens) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 space-y-2.5"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-1">
            <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
            <p className="text-xs font-bold text-foreground">
              Gagal memuat pengguna
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 text-center space-y-2">
            <Users className="w-6 h-6 text-muted-foreground/60 mx-auto" />
            <p className="text-xs text-muted-foreground">
              Tidak ada pengguna ditemukan
            </p>
          </div>
        ) : (
          users.map((item) => {
            const roleCfg = getRoleConfig(item.role);

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {item.email}
                    </p>
                  </div>
                  {getRoleBadge(item.role)}
                </div>

                <div className="space-y-1 text-[11px] pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      {roleCfg.icon}
                      <span>{roleCfg.idPrefix}:</span>
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {item.id_number || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Afiliasi:</span>
                    <span
                      className="font-medium text-foreground truncate max-w-[180px]"
                      title={item.affiliation}
                    >
                      {item.affiliation || "Universitas Teknologi Yogyakarta"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground">Status:</span>
                    {item.is_verified ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                        <UserCheck className="w-3 h-3" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-semibold flex items-center gap-1 text-[10px]">
                        <XCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {(canUpdateUsers || canManageRoles || canDeleteUsers) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    {canUpdateUsers && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        className="flex-1 h-8 rounded-xl text-[11px] border-border/60"
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        Edit Data
                      </Button>
                    )}

                    {canManageRoles && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUserForRole(item);
                          setNewRole(item.role);
                        }}
                        className="h-8 px-2.5 rounded-xl text-[11px]"
                        title="Ubah role cepat"
                      >
                        <UserCog className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    )}

                    {canDeleteUsers && item.role !== "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserToDelete(item)}
                        className="h-8 px-2.5 rounded-xl text-destructive hover:bg-destructive/10 text-[11px]"
                        title="Hapus akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop & Tablet Table Container (>= md screens) */}
      <div className="hidden md:block rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4">
                  Nama & Email
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Peran & Kategori
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Identitas Resmi
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Afiliasi / Unit / Instansi
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
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
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
                    colSpan={6}
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
                    colSpan={6}
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
                users.map((item) => {
                  const roleCfg = getRoleConfig(item.role);

                  return (
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
                        {getRoleBadge(item.role)}
                      </TableCell>

                      {/* ID Number */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
                          {roleCfg.icon}
                          <span>
                            {item.id_number
                              ? `${roleCfg.idPrefix}: ${item.id_number}`
                              : "-"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Affiliation */}
                      <TableCell className="py-3">
                        <div
                          className="text-xs font-medium text-foreground truncate max-w-[220px]"
                          title={item.affiliation}
                        >
                          {item.affiliation ||
                            "Universitas Teknologi Yogyakarta"}
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
                        {canUpdateUsers || canManageRoles || canDeleteUsers ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-52 rounded-xl"
                            >
                              <DropdownMenuLabel className="text-xs font-semibold">
                                Aksi Pengguna
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {canUpdateUsers && (
                                <DropdownMenuItem
                                  onClick={() => handleOpenEdit(item)}
                                  className="text-xs cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 mr-2 text-primary" />
                                  Edit Data Pengguna
                                </DropdownMenuItem>
                              )}

                              {canManageRoles && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUserForRole(item);
                                    setNewRole(item.role);
                                  }}
                                  className="text-xs cursor-pointer"
                                >
                                  <UserCog className="w-3.5 h-3.5 mr-2 text-primary" />
                                  Ubah Role Cepat
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Bar */}
      {meta && meta.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md text-xs shadow-xs">
          <span className="text-muted-foreground text-center sm:text-left">
            Menampilkan Halaman <strong>{meta.current_page}</strong> dari{" "}
            <strong>{meta.total_pages}</strong> ({meta.total_items} pengguna)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 rounded-xl border-border/60 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 rounded-xl border-border/60 text-xs"
            >
              Selanjutnya
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog: Quick Change User Role */}
      <Dialog
        open={Boolean(selectedUserForRole)}
        onOpenChange={(open) => !open && setSelectedUserForRole(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md rounded-2xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
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
                <SelectItem value="mahasiswa">
                  Mahasiswa (Civitas Akademika)
                </SelectItem>
                <SelectItem value="dosen">
                  Dosen / Tendik (Civitas Akademika)
                </SelectItem>
                <SelectItem value="umum">
                  Non-Civitas / Mitra Eksternal
                </SelectItem>
                <SelectItem value="admin">
                  Administrator (Akses Penuh)
                </SelectItem>
                <SelectItem value="manager">
                  Manajer Fasilitas & Ruangan
                </SelectItem>
                <SelectItem value="user">User Standar</SelectItem>
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
                "Simpan Perubahan Role"
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
              Tindakan ini akan menonaktifkan akun dari sistem UTY Creative Hub.
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

      {/* Dialog: Create New User (Full Conditional Fields) */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Tambah Pengguna Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Formulir pendaftaran akun resmi UCH. Kolom identitas dan afiliasi
              akan menyesuaikan peran pengguna secara otomatis.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUserSubmit} className="space-y-4 pt-2">
            {/* Role Selector First so form adapts immediately */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex items-center gap-1.5">
                <span>Peran & Kategori Pengguna</span>
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={createForm.role}
                onValueChange={(val) => {
                  const cfg = getRoleConfig(val);
                  setCreateForm({
                    ...createForm,
                    role: val,
                    affiliation:
                      val === "mahasiswa"
                        ? "S1 Informatika"
                        : cfg.affiliationPlaceholder.replace("misal: ", ""),
                  });
                }}
              >
                <SelectTrigger className="rounded-xl text-xs h-10 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahasiswa">
                    Civitas: Mahasiswa Aktif UTY
                  </SelectItem>
                  <SelectItem value="dosen">
                    Civitas: Dosen & Tenaga Kependidikan
                  </SelectItem>
                  <SelectItem value="umum">
                    Non-Civitas: Mitra & Komunitas Eksternal
                  </SelectItem>
                  <SelectItem value="admin">
                    Administrator (Sistem & PBAC)
                  </SelectItem>
                  <SelectItem value="manager">
                    Manajer Fasilitas & Reservasi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Informational Role Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40 text-xs flex items-start gap-2.5">
              <div className="mt-0.5">{activeCreateRoleCfg.icon}</div>
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">
                  Kategori: {activeCreateRoleCfg.categoryLabel}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {activeCreateRoleCfg.idHint}
                </p>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="misal: Dr. Bambang Sutrisno"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Alamat Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="user@uty.ac.id"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Kata Sandi Awal <span className="text-destructive">*</span>
              </Label>
              <Input
                type="password"
                placeholder="Minimal 6 karakter"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                className="rounded-xl text-xs h-10"
                required
              />
            </div>

            {/* Dynamic Adaptive Fields Based on Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {activeCreateRoleCfg.idName}
                  {activeCreateRoleCfg.idRequired && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                <Input
                  placeholder={activeCreateRoleCfg.idPlaceholder}
                  value={createForm.id_number}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, id_number: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required={activeCreateRoleCfg.idRequired}
                />
                <span className="text-[10px] text-muted-foreground block">
                  {activeCreateRoleCfg.idHint}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {activeCreateRoleCfg.affiliationName}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                {createForm.role === "mahasiswa" ? (
                  <Select
                    value={
                      normalizeUtyProdi(createForm.affiliation) || undefined
                    }
                    onValueChange={(val) =>
                      setCreateForm({
                        ...createForm,
                        affiliation: val,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl text-xs h-10 bg-white dark:bg-zinc-900 border-input">
                      <SelectValue placeholder="Pilih Program Studi UTY" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-72">
                      {UTY_FACULTIES.map((fac) => (
                        <SelectGroup key={fac.id}>
                          <SelectLabel className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-100/80 dark:bg-zinc-800/80 sticky top-0 z-10">
                            {fac.name} ({fac.code})
                          </SelectLabel>
                          {fac.programs.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.fullName}
                              className="text-xs cursor-pointer pl-4"
                            >
                              {p.fullName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={activeCreateRoleCfg.affiliationPlaceholder}
                    value={createForm.affiliation}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        affiliation: e.target.value,
                      })
                    }
                    className="rounded-xl text-xs h-10"
                    required
                  />
                )}
                <span className="text-[10px] text-muted-foreground block">
                  {activeCreateRoleCfg.affiliationHint}
                </span>
              </div>
            </div>

            {/* Verification Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-slate-50/50 dark:bg-zinc-800/30">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-foreground block">
                  Status Akun Langsung Terverifikasi
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Akun dapat langsung digunakan untuk login dan reservasi
                  ruangan.
                </span>
              </div>
              <Switch
                checked={createForm.is_verified}
                onCheckedChange={(checked) =>
                  setCreateForm({ ...createForm, is_verified: checked })
                }
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
                disabled={createUserMutation.isPending}
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs"
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Pengguna Baru"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit User (Full Adaptive Fields & Verification) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" />
              Edit Data Pengguna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Perbarui profil, hak akses peran, data identitas resmi, dan status
              verifikasi akun.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            {/* Role Selector with Adaptive Configuration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Peran & Kategori Pengguna
              </Label>
              <Select
                value={editForm.role}
                onValueChange={(val) => setEditForm({ ...editForm, role: val })}
              >
                <SelectTrigger className="rounded-xl text-xs h-10 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mahasiswa">
                    Civitas: Mahasiswa Aktif UTY
                  </SelectItem>
                  <SelectItem value="dosen">
                    Civitas: Dosen & Tenaga Kependidikan
                  </SelectItem>
                  <SelectItem value="umum">
                    Non-Civitas: Mitra & Komunitas Eksternal
                  </SelectItem>
                  <SelectItem value="admin">
                    Administrator (Sistem & PBAC)
                  </SelectItem>
                  <SelectItem value="manager">
                    Manajer Fasilitas & Reservasi
                  </SelectItem>
                  <SelectItem value="user">User Standar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Informational Role Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-border/40 text-xs flex items-start gap-2.5">
              <div className="mt-0.5">{activeEditRoleCfg.icon}</div>
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">
                  Kategori: {activeEditRoleCfg.categoryLabel}
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {activeEditRoleCfg.idHint}
                </p>
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Nama Lengkap <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Nama pengguna"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  Alamat Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="email@domain.com"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>
            </div>

            {/* Adaptive Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {activeEditRoleCfg.idName}
                  {activeEditRoleCfg.idRequired && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                <Input
                  placeholder={activeEditRoleCfg.idPlaceholder}
                  value={editForm.id_number}
                  onChange={(e) =>
                    setEditForm({ ...editForm, id_number: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required={activeEditRoleCfg.idRequired}
                />
                <span className="text-[10px] text-muted-foreground block">
                  {activeEditRoleCfg.idHint}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">
                  {activeEditRoleCfg.affiliationName}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                {editForm.role === "mahasiswa" ? (
                  <Select
                    value={normalizeUtyProdi(editForm.affiliation) || undefined}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, affiliation: val })
                    }
                  >
                    <SelectTrigger className="rounded-xl text-xs h-10 bg-white dark:bg-zinc-900 border-input">
                      <SelectValue placeholder="Pilih Program Studi UTY" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-72">
                      {UTY_FACULTIES.map((fac) => (
                        <SelectGroup key={fac.id}>
                          <SelectLabel className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-slate-100/80 dark:bg-zinc-800/80 sticky top-0 z-10">
                            {fac.name} ({fac.code})
                          </SelectLabel>
                          {fac.programs.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.fullName}
                              className="text-xs cursor-pointer pl-4"
                            >
                              {p.fullName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={activeEditRoleCfg.affiliationPlaceholder}
                    value={editForm.affiliation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, affiliation: e.target.value })
                    }
                    className="rounded-xl text-xs h-10"
                    required
                  />
                )}
                <span className="text-[10px] text-muted-foreground block">
                  {activeEditRoleCfg.affiliationHint}
                </span>
              </div>
            </div>

            {/* Verification Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-slate-50/50 dark:bg-zinc-800/30">
              <div className="space-y-0.5 pr-2">
                <span className="text-xs font-bold text-foreground block">
                  Status Verifikasi Akun
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  {editForm.is_verified
                    ? "Akun telah terverifikasi resmi dan aktif digunakan."
                    : "Akun berstatus pending verifikasi email."}
                </span>
              </div>
              <Switch
                checked={editForm.is_verified}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, is_verified: checked })
                }
              />
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
