"use client";

import { Check, Eye, QrCode, RefreshCw, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InteractivePagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BackendEvent,
  BackendEventRegistration,
} from "@/hooks/use-event-queries";
import { cn } from "@/lib/utils";

interface RegistrationsTableProps {
  events: BackendEvent[];
  registrations: BackendEventRegistration[];
  selectedEventId: string;
  onSelectedEventIdChange: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenScanner: () => void;
  onSelectRegistration: (reg: BackendEventRegistration) => void;
  onVerifyAction: (
    reg: BackendEventRegistration,
    type: "approve" | "needs_revision" | "reject",
  ) => void;
  onCheckIn: (regId: string) => void;
  onRefetch: () => void;
  isLoading: boolean;
}

export function RegistrationsTable({
  events,
  registrations,
  selectedEventId,
  onSelectedEventIdChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  currentPage,
  totalPages,
  onPageChange,
  onOpenScanner,
  onSelectRegistration,
  onVerifyAction,
  onCheckIn,
  onRefetch,
  isLoading,
}: RegistrationsTableProps) {
  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Cari kode tiket, nama peserta, email..."
              className="pl-8 h-9 text-xs rounded-xl"
            />
          </div>

          {/* Filter Event */}
          <Select
            value={selectedEventId}
            onValueChange={onSelectedEventIdChange}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Pilih Agenda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Agenda</SelectItem>
              {events.map((evt) => (
                <SelectItem key={evt.id} value={evt.id}>
                  {evt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Status */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending_review">Menunggu Review</SelectItem>
              <SelectItem value="needs_revision">Perlu Revisi</SelectItem>
              <SelectItem value="approved">Aktif (Disetujui)</SelectItem>
              <SelectItem value="attended">Telah Hadir</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            disabled={isLoading}
            className="h-9 px-2.5 rounded-xl text-xs gap-1 cursor-pointer"
            title="Muat Ulang"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
            />
          </Button>
        </div>

        <Button
          onClick={onOpenScanner}
          size="sm"
          className="rounded-xl text-xs h-9 px-3.5 font-bold gap-1.5 cursor-pointer shadow-xs"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan Tiket Check-in</span>
        </Button>
      </div>

      {/* Registrations Data Table */}
      {registrations.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Kode Tiket</th>
                    <th className="py-3 px-4">Peserta</th>
                    <th className="py-3 px-4">Kontak</th>
                    <th className="py-3 px-4">Agenda</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Bukti / Detail</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {registrations.map((reg) => {
                    const isApproved = reg.status === "approved";
                    const isAttended = reg.status === "attended";
                    const isPending = reg.status === "pending_review";
                    const isNeedsRevision = reg.status === "needs_revision";
                    const isRejected = reg.status === "rejected";

                    return (
                      <tr
                        key={reg.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* Registration Code */}
                        <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                          {reg.registration_code}
                        </td>

                        {/* Identity */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground">
                            {reg.full_name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {reg.institution}
                            {reg.identity_number && (
                              <span> • {reg.identity_number}</span>
                            )}
                          </div>
                        </td>

                        {/* Contacts */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div>{reg.email}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {reg.phone}
                          </div>
                        </td>

                        {/* Event Title */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <span
                            className="truncate block font-medium text-foreground"
                            title={reg.event_title}
                          >
                            {reg.event_title || "Agenda Resmi"}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-lg text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
                              isApproved &&
                                "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                              isAttended &&
                                "bg-blue-500/10 text-blue-600 border-blue-500/30",
                              isPending &&
                                "bg-amber-500/10 text-amber-600 border-amber-500/30",
                              isNeedsRevision &&
                                "bg-orange-500/10 text-orange-600 border-orange-500/30",
                              isRejected &&
                                "bg-red-500/10 text-red-600 border-red-500/30",
                            )}
                          >
                            {isApproved
                              ? "Aktif"
                              : isAttended
                                ? "Hadir"
                                : isPending
                                  ? "Review"
                                  : isNeedsRevision
                                    ? "Revisi"
                                    : isRejected
                                      ? "Ditolak"
                                      : reg.status}
                          </Badge>
                        </td>

                        {/* Detail Trigger */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSelectRegistration(reg)}
                            className="rounded-xl h-8 px-2.5 text-[11px] font-semibold gap-1 text-primary hover:text-primary cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </Button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => onVerifyAction(reg, "approve")}
                                  className="rounded-xl text-[11px] h-7 px-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Setuju
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    onVerifyAction(reg, "needs_revision")
                                  }
                                  className="rounded-xl text-[11px] h-7 px-2.5 font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
                                >
                                  Revisi
                                </Button>
                              </>
                            )}

                            {isApproved && (
                              <Button
                                size="sm"
                                onClick={() => onCheckIn(reg.id)}
                                className="rounded-xl text-[11px] h-7 px-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                              >
                                Check-In
                              </Button>
                            )}

                            {isAttended && (
                              <span className="text-[10px] text-blue-600 font-semibold italic">
                                ✓ Telah hadir
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Pagination */}
          {totalPages > 1 && (
            <InteractivePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border/80 rounded-3xl p-8 space-y-3">
          <Users className="w-10 h-10 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              Tidak Ada Pendaftar Ditemukan
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Belum ada peserta yang mendaftar atau tidak sesuai dengan kriteria
              filter pencarian Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
