"use client";

import {
  Activity,
  AlertCircle,
  Ban,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  KeyRound,
  LogIn,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { AuditLogItem } from "@/hooks/use-admin-queries";
import { useAdminAuditLogsQuery } from "@/hooks/use-admin-queries";

const ACTION_CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "booking", label: "Reservasi (Booking)" },
  { value: "room", label: "Manajemen Ruangan" },
  { value: "user.login", label: "Login Pengguna" },
  { value: "role", label: "Peran Pengguna (Role)" },
  { value: "permission", label: "Hak Akses (Permission)" },
  { value: "file", label: "Unggahan Berkas (Uploads)" },
];

/**
 * Safely decodes base64 strings or formats JSON objects for display
 */
function parseDetailsPayload(details: unknown): {
  isDecoded: boolean;
  formattedText: string;
} {
  if (!details) {
    return {
      isDecoded: false,
      formattedText: "Tidak ada rincian data payload",
    };
  }

  if (typeof details === "object") {
    return {
      isDecoded: true,
      formattedText: JSON.stringify(details, null, 2),
    };
  }

  if (typeof details === "string") {
    // Attempt base64 decode if it looks like standard base64
    try {
      const decoded = atob(details);
      const parsed = JSON.parse(decoded);
      return {
        isDecoded: true,
        formattedText: JSON.stringify(parsed, null, 2),
      };
    } catch {
      // Fallback: standard JSON parse or raw string
      try {
        const parsed = JSON.parse(details);
        return {
          isDecoded: true,
          formattedText: JSON.stringify(parsed, null, 2),
        };
      } catch {
        return { isDecoded: false, formattedText: details };
      }
    }
  }

  return { isDecoded: false, formattedText: String(details) };
}

function getDetailsSummary(details: unknown): string {
  if (!details) return "-";
  if (typeof details === "object") {
    const keys = Object.keys(details as Record<string, unknown>);
    if (keys.length === 0) return "-";
    return JSON.stringify(details);
  }
  if (typeof details === "string") {
    try {
      const decoded = atob(details);
      const parsed = JSON.parse(decoded);
      return JSON.stringify(parsed);
    } catch {
      try {
        const parsed = JSON.parse(details);
        return JSON.stringify(parsed);
      } catch {
        return details;
      }
    }
  }
  return String(details);
}

export function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  // If search query is non-empty, use it as the action filter; otherwise use category
  const activeActionFilter = searchQuery.trim()
    ? searchQuery.trim()
    : selectedCategory !== "all"
      ? selectedCategory
      : undefined;

  const { data, isLoading, isError, refetch } = useAdminAuditLogsQuery(
    page,
    10,
    activeActionFilter,
  );
  const logs = data?.logs ?? [];
  const meta = data?.meta;

  const getActionBadge = (action: string) => {
    // Booking actions (supporting both dot and colon legacy formats)
    if (action === "booking.created" || action === "booking:create") {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border-none text-[11px]"
        >
          <CalendarPlus className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action === "booking.checked_in" || action === "booking:checkin") {
      return (
        <Badge
          variant="secondary"
          className="bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold border-none text-[11px]"
        >
          <UserCheck className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action === "booking.cancelled" || action === "booking:cancel") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold border-none text-[11px]"
        >
          <Ban className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (
      action === "booking.status_updated" ||
      action === "booking:update_status"
    ) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border-none text-[11px]"
        >
          <CalendarCheck className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action === "booking.deleted" || action === "booking:delete") {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-bold border-none text-[11px]"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // Room actions
    if (action === "room.created" || action === "room:create") {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border-none text-[11px]"
        >
          <Building2 className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action === "room.updated" || action === "room:update") {
      return (
        <Badge
          variant="secondary"
          className="bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-bold border-none text-[11px]"
        >
          <Building2 className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action === "room.deleted" || action === "room:delete") {
      return (
        <Badge
          variant="secondary"
          className="bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold border-none text-[11px]"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // RBAC & Permission actions
    if (action.startsWith("role.")) {
      return (
        <Badge
          variant="secondary"
          className="bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 font-bold border-none text-[11px]"
        >
          <Shield className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action.startsWith("permission.")) {
      return (
        <Badge
          variant="secondary"
          className="bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold border-none text-[11px]"
        >
          <KeyRound className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // Upload actions
    if (action.startsWith("file.")) {
      return (
        <Badge
          variant="secondary"
          className="bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-bold border-none text-[11px]"
        >
          <UploadCloud className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // Login actions
    if (action.includes("login")) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border-none text-[11px]"
        >
          <LogIn className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // Deletion / Revocation fallbacks
    if (action.includes("delete") || action.includes("revoke")) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-bold border-none text-[11px]"
        >
          <ShieldAlert className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }

    // Default badge
    return (
      <Badge
        variant="secondary"
        className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium border-none text-[11px]"
      >
        <Activity className="w-3 h-3 mr-1" />
        {action}
      </Badge>
    );
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setSearchQuery("");
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Audit Trail & Jejak Aktivitas Sistem
              </h3>
              <p className="text-xs text-muted-foreground">
                Mencatat seluruh aksi operasional, autentikasi, reservasi,
                ruangan, dan hak akses
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8.5 rounded-xl border-border/60 text-xs shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Perbarui Log
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-border/40">
          <div className="w-full sm:w-64">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="h-9 rounded-xl border-border/60 text-xs bg-background/50">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                    className="text-xs"
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari aksi spesifik (contoh: room, booking, user)..."
              className="h-9 pl-8.5 rounded-xl border-border/60 text-xs bg-background/50"
            />
          </div>

          {(selectedCategory !== "all" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setPage(1);
              }}
              className="h-9 px-3 rounded-xl text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              Reset Filter
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Audit Cards (< sm screens) */}
      <div className="block sm:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 space-y-2.5"
            >
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-3 w-36" />
            </div>
          ))
        ) : isError ? (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-1">
            <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
            <p className="text-xs font-bold text-foreground">
              Gagal memuat log audit
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 text-center space-y-2">
            <FileText className="w-6 h-6 text-muted-foreground/50 mx-auto" />
            <p className="text-xs text-muted-foreground">
              Tidak ada catatan log aktivitas untuk filter yang dipilih
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const date = new Date(log.created_at);
            const formattedDate = date.toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "short",
            });

            return (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground shrink-0">
                    <Calendar className="w-3 h-3 text-primary/70 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="min-w-0 truncate text-right">
                    {getActionBadge(log.action)}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono font-bold text-foreground block truncate">
                      {log.entity}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {log.user_id
                        ? `Aktor: ${log.user_id.slice(0, 8)}...`
                        : "Sistem Worker"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLog(log)}
                    className="h-7 px-2.5 rounded-lg text-xs shrink-0"
                  >
                    <Eye className="w-3 h-3 mr-1 text-primary" />
                    Detail
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop & Tablet Logs Table (>= sm screens) */}
      <div className="hidden sm:block rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4">
                  Waktu
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Aksi Keamanan / Operasi
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Entitas Target
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Detail Ringkas
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground text-right pr-4">
                  Inspeksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell className="pl-4">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <Skeleton className="h-7 w-7 ml-auto rounded-lg" />
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
                        Gagal memuat log audit
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pastikan Anda memiliki hak akses <code>audit:read</code>
                        .
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                      <p className="text-sm font-semibold text-foreground">
                        Tidak ada catatan log aktivitas ditemukan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Coba ubah pilihan filter kategori atau kata kunci
                        pencarian Anda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const date = new Date(log.created_at);
                  const formattedDate = date.toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <TableRow
                      key={log.id}
                      className="border-border/40 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Date */}
                      <TableCell className="pl-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-3 h-3 text-primary/70" />
                          {formattedDate}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="py-3">
                        {getActionBadge(log.action)}
                      </TableCell>

                      {/* Entity */}
                      <TableCell className="py-3 text-xs font-mono font-semibold text-foreground hidden sm:table-cell">
                        {log.entity}
                        {log.entity_id && (
                          <span className="block text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">
                            {log.entity_id}
                          </span>
                        )}
                      </TableCell>

                      {/* Details / Actor */}
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-[280px] truncate hidden md:table-cell">
                        {log.details ? (
                          <span className="font-mono text-[11px]">
                            {getDetailsSummary(log.details)}
                          </span>
                        ) : (
                          <span>
                            ID:{" "}
                            {log.user_id
                              ? `${log.user_id.slice(0, 8)}...`
                              : "Sistem Worker"}
                          </span>
                        )}
                      </TableCell>

                      {/* Inspect button */}
                      <TableCell className="py-3 text-right pr-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="h-7 px-2.5 rounded-lg text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-primary" />
                          Detail
                        </Button>
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
            <strong>{meta.total_pages}</strong> ({meta.total_items} data)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_prev || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 rounded-xl border-border/60 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.has_next || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-2.5 rounded-xl border-border/60 text-xs"
            >
              Selanjutnya
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Log Detail Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Detail Catatan Audit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Jejak forensik aktivitas sistem dengan ID:{" "}
              <code className="font-mono text-[10px]">{selectedLog?.id}</code>
            </DialogDescription>
          </DialogHeader>

          {selectedLog &&
            (() => {
              const { formattedText } = parseDetailsPayload(
                selectedLog.details,
              );

              return (
                <div className="space-y-3 py-2 text-xs">
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/50">
                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Aksi:
                      </span>
                      <div className="mt-1">
                        {getActionBadge(selectedLog.action)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Entitas Target:
                      </span>
                      <p className="font-bold text-foreground mt-1 font-mono text-xs">
                        {selectedLog.entity}
                        {selectedLog.entity_id && (
                          <span className="block text-[10px] text-muted-foreground font-normal truncate">
                            ID: {selectedLog.entity_id}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Waktu Kejadian:
                      </span>
                      <p className="font-medium text-foreground mt-1">
                        {new Date(selectedLog.created_at).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-[11px]">
                        Aktor User ID:
                      </span>
                      <p className="font-mono text-[11px] text-foreground mt-1 truncate">
                        {selectedLog.user_id || "System Worker"}
                      </p>
                    </div>
                    {selectedLog.ip_address && (
                      <div>
                        <span className="text-muted-foreground text-[11px]">
                          IP Address:
                        </span>
                        <p className="font-mono text-[11px] text-foreground mt-0.5">
                          {selectedLog.ip_address}
                        </p>
                      </div>
                    )}
                    {selectedLog.user_agent && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-[11px]">
                          User Agent:
                        </span>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">
                          {selectedLog.user_agent}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-foreground text-xs">
                      Payload & Data Perubahan (Details):
                    </span>
                    <pre className="mt-1.5 p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto max-h-56 border border-zinc-800 leading-relaxed">
                      {formattedText}
                    </pre>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
