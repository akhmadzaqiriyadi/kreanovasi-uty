"use client";

import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Key,
  LogIn,
  RefreshCw,
  Shield,
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

export function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const { data, isLoading, isError, refetch } = useAdminAuditLogsQuery(
    page,
    10,
  );
  const logs = data?.logs ?? [];
  const meta = data?.meta;

  const getActionBadge = (action: string) => {
    if (action.includes("login")) {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border-none text-[10px]"
        >
          <LogIn className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (action.includes("delete") || action.includes("revoke")) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold border-none text-[10px]"
        >
          <Shield className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    if (
      action.includes("create") ||
      action.includes("assign") ||
      action.includes("record")
    ) {
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border-none text-[10px]"
        >
          <Key className="w-3 h-3 mr-1" />
          {action}
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium border-none text-[10px]"
      >
        <Activity className="w-3 h-3 mr-1" />
        {action}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Refresh Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Jejak Aktivitas & Keamanan Real-Time
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="h-8 rounded-xl border-border/60 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Perbarui Log
        </Button>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border/60 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/40">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4">
                  Waktu
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Aksi Keamanan
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Entitas Target
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Detail / Aktor
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
                        Belum ada catatan log aktivitas
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
                      </TableCell>

                      {/* Details / Actor */}
                      <TableCell className="py-3 text-xs text-muted-foreground max-w-[250px] truncate hidden md:table-cell">
                        {log.details ? (
                          <span className="font-mono text-[11px]">
                            {JSON.stringify(log.details)}
                          </span>
                        ) : (
                          <span>
                            ID:{" "}
                            {log.user_id
                              ? `${log.user_id.slice(0, 8)}...`
                              : "Sistem"}
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

      {/* Log Detail Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Detail Catatan Audit
            </DialogTitle>
            <DialogDescription className="text-xs">
              Jejak forensik aktivitas sistem dengan ID:{" "}
              <code>{selectedLog?.id}</code>
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-border/50">
                <div>
                  <span className="text-muted-foreground">Aksi:</span>
                  <div className="mt-1">
                    {getActionBadge(selectedLog.action)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Entitas:</span>
                  <p className="font-bold text-foreground mt-1 font-mono">
                    {selectedLog.entity}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Waktu Kejadian:</span>
                  <p className="font-medium text-foreground mt-1">
                    {new Date(selectedLog.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Aktor User ID:</span>
                  <p className="font-mono text-[11px] text-foreground mt-1 truncate">
                    {selectedLog.user_id || "System Worker"}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-foreground">
                  Payload Data:
                </span>
                <pre className="mt-1.5 p-3 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto max-h-48 border border-zinc-800">
                  {JSON.stringify(selectedLog.details, null, 2) || "{}"}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
