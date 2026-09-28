"use client";

import {
  Building2,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  FileDown,
  Filter,
  Loader2,
  Monitor,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { QrScannerModal } from "@/components/booking/qr-scanner-modal";
import { RoomKioskQrModal } from "@/components/booking/room-kiosk-qr-modal";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractivePagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type BackendBooking,
  type BackendRoom,
  useAdminCheckInMutation,
  useAllBookingsQuery,
  useDeleteBookingMutation,
  useRoomsQuery,
  useUpdateBookingStatusMutation,
} from "@/hooks/use-booking-queries";
import { downloadBookingTicketPdf } from "@/lib/pdf-generator";
import { cn } from "@/lib/utils";

export function AdminBookingsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // React Query hooks
  const { data: serverRooms = [] } = useRoomsQuery();
  const {
    data: allBookingsData,
    isLoading: isBookingsLoading,
    refetch,
    isFetching,
  } = useAllBookingsQuery({
    page: currentPage,
    limit: pageSize,
    status: statusFilter,
    roomId: roomFilter !== "all" ? roomFilter : undefined,
    search: searchQuery,
  });

  const updateStatusMutation = useUpdateBookingStatusMutation();
  const deleteBookingMutation = useDeleteBookingMutation();
  const adminCheckInMutation = useAdminCheckInMutation();

  const bookings: BackendBooking[] = allBookingsData?.bookings || [];
  const pagination = allBookingsData?.pagination || {
    page: 1,
    limit: pageSize,
    total_items: 0,
    total_pages: 1,
  };

  // QR Check-In & Kiosk Dialog states
  const [isAdminScannerOpen, setIsAdminScannerOpen] = useState(false);
  const [isKioskModalOpen, setIsKioskModalOpen] = useState(false);
  const [selectedKioskRoom, setSelectedKioskRoom] =
    useState<BackendRoom | null>(null);

  // Dialog states
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<{
    booking: BackendBooking;
    type: "approve" | "reject";
  } | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(
    null,
  );

  const handleOpenActionDialog = (
    booking: BackendBooking,
    type: "approve" | "reject",
  ) => {
    setSelectedBookingForAction({ booking, type });
    setActionNotes(
      type === "approve"
        ? "Permohonan disetujui. Silakan hadir 10 menit sebelum kegiatan dan bawa kartu identitas."
        : "Mohon maaf, permohonan belum dapat disetujui karena bentrok jadwal / pemeliharaan fasilitas.",
    );
  };

  const handleConfirmAction = async () => {
    if (!selectedBookingForAction) return;
    const { booking, type } = selectedBookingForAction;

    await updateStatusMutation.mutateAsync({
      id: booking.id,
      status: type === "approve" ? "approved" : "rejected",
      notes: actionNotes,
    });

    setSelectedBookingForAction(null);
  };

  const handleConfirmDelete = async () => {
    if (deletingBookingId) {
      await deleteBookingMutation.mutateAsync(deletingBookingId);
      setDeletingBookingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-border/70 backdrop-blur-md shadow-xs">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight">
              Persetujuan & Manajemen Reservasi
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Verifikasi pengajuan peminjaman ruangan dari civitas dan mitra,
            terbitkan persetujuan, atau buat jadwal reservasi langsung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-border bg-white dark:bg-zinc-900 text-[11px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3 cursor-pointer"
          >
            <RefreshCw
              className={cn(
                "w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5",
                isFetching && "animate-spin",
              )}
            />
            Segarkan
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdminScannerOpen(true)}
            className="rounded-xl border-primary/30 bg-blue-50/60 dark:bg-blue-950/40 text-primary dark:text-blue-400 font-bold text-[11px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3.5 cursor-pointer shadow-xs hover:bg-blue-100/70"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-primary" />
            Scan QR
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const target: BackendRoom = serverRooms[0] || {
                id: "coworking-space-hall",
                name: "Coworking Space & Event Hall",
                slug: "coworking-space-hall",
                category: "ruang",
                capacity: 50,
                location: "Gedung UCH Lt. 1",
                description: "Ruang utama coworking space dan acara",
                facilities: [],
                image_url: "/images/coworking-space.jpg",
                status: "available",
                operational_hours: "08:00 - 21:00",
                created_at: "",
                updated_at: "",
              };
              setSelectedKioskRoom(target);
              setIsKioskModalOpen(true);
            }}
            className="rounded-xl border-border bg-white dark:bg-zinc-900 text-[11px] sm:text-xs h-8 sm:h-9 px-2.5 sm:px-3.5 cursor-pointer hover:border-primary/40"
          >
            <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-muted-foreground" />
            QR Kiosk
          </Button>

          <Button
            asChild
            className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] sm:text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-sm cursor-pointer"
          >
            <Link href="/booking/new">
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Buat Reservasi Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            Total Reservasi
          </span>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-foreground">
            {pagination.total_items}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            Semua data di database
          </span>
        </div>

        <div className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
            Filter Status
          </span>
          <div className="text-base sm:text-xl lg:text-2xl font-black text-foreground capitalize truncate">
            {statusFilter === "all" ? "Semua Status" : statusFilter}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            Pilihan filter aktif
          </span>
        </div>

        <div className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Halaman Aktif
          </span>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {pagination.page} / {pagination.total_pages}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            Navigasi pagination
          </span>
        </div>

        <div className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            Limit Halaman
          </span>
          <div className="text-lg sm:text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-400">
            {pageSize} baris
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            Data server-side
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-border/70 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari ID, nama pemohon, atau agenda..."
            className="pl-9 text-xs rounded-xl h-9 bg-slate-50 dark:bg-zinc-800/60 border-border"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="text-xs h-9 rounded-xl w-full sm:w-44 bg-slate-50 dark:bg-zinc-800/60 border-border">
              <SelectValue placeholder="Status Reservasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu Review</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roomFilter}
            onValueChange={(val) => {
              setRoomFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="text-xs h-9 rounded-xl w-full sm:w-48 bg-slate-50 dark:bg-zinc-800/60 border-border">
              <SelectValue placeholder="Pilih Ruangan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Ruangan</SelectItem>
              {serverRooms.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Card List */}
      <div className="space-y-3.5">
        {isBookingsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              Memuat data reservasi...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-border/60 space-y-3">
            <CalendarCheck className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <h3 className="text-base font-bold text-foreground">
              Tidak Ada Data Reservasi
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Tidak ada reservasi yang sesuai dengan filter atau kata kunci saat
              ini.
            </p>
          </div>
        ) : (
          bookings.map((b) => {
            const isPending = b.status === "pending";
            const isApproved = b.status === "approved";
            const isCompleted = b.status === "completed";
            const isRejected = b.status === "rejected";
            const isCancelled = b.status === "cancelled";

            return (
              <div
                key={b.id}
                className={cn(
                  "p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border transition-all duration-200 shadow-xs space-y-3 sm:space-y-4",
                  isPending
                    ? "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/10"
                    : isCompleted
                      ? "border-teal-300 dark:border-teal-800/40 bg-teal-50/10"
                      : isApproved
                        ? "border-emerald-300 dark:border-emerald-800/40"
                        : "border-border/70",
                )}
              >
                {/* Top Bar: Room + Status + ID */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 border-b border-border/60">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    <span className="font-black text-xs sm:text-sm text-foreground">
                      {b.room_name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] sm:text-[10px] font-mono"
                    >
                      {b.id}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => {
                        const matched: BackendRoom = serverRooms.find(
                          (r) => r.id === b.room_id,
                        ) || {
                          id: b.room_id,
                          name: b.room_name,
                          slug: b.room_id,
                          category: "ruang",
                          capacity: 30,
                          location: "UTY Creative Hub",
                          description: "",
                          facilities: [],
                          image_url: "",
                          status: "available",
                          operational_hours: "08:00 - 21:00",
                          created_at: "",
                          updated_at: "",
                        };
                        setSelectedKioskRoom(matched);
                        setIsKioskModalOpen(true);
                      }}
                      className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Lihat QR Kiosk Pintu Ruangan Ini"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1",
                        isPending &&
                          "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300",
                        isApproved &&
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300",
                        isCompleted &&
                          "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-300",
                        isRejected &&
                          "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300",
                        isCancelled &&
                          "bg-slate-100 text-muted-foreground dark:bg-zinc-800 border-border",
                      )}
                    >
                      {isPending && (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Review</span>
                        </>
                      )}
                      {isApproved && (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disetujui (Approved)</span>
                        </>
                      )}
                      {isCompleted && (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Presensi Selesai (Check-In)</span>
                        </>
                      )}
                      {isRejected && (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Ditolak</span>
                        </>
                      )}
                      {isCancelled && (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Dibatalkan</span>
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                {/* Middle Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: Applicant Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Data Pemohon
                    </span>
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{b.applicant_name}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {b.id_number} ({b.prodi})
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] capitalize font-semibold mt-1"
                    >
                      {b.applicant_role}
                    </Badge>
                  </div>

                  {/* Column 2: Purpose & Schedule */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Jadwal & Agenda
                    </span>
                    <div className="font-semibold text-foreground">
                      {b.booking_date} • {b.start_time} - {b.end_time} WIB
                    </div>
                    <p className="text-foreground leading-relaxed line-clamp-2 italic pt-0.5">
                      "{b.purpose}"
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground text-[11px] pt-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>Estimasi {b.audience} Orang</span>
                    </div>
                  </div>

                  {/* Column 3: Notes & Action Buttons */}
                  <div className="flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Catatan Pengelola
                      </span>
                      <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                        {b.admin_notes || "Belum ada catatan khusus."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 pt-2 border-t border-border/40 sm:border-0 sm:pt-1">
                      {isPending && (
                        <>
                          <Button
                            onClick={() => handleOpenActionDialog(b, "approve")}
                            size="sm"
                            disabled={updateStatusMutation.isPending}
                            className="h-8 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Setujui
                          </Button>
                          <Button
                            onClick={() => handleOpenActionDialog(b, "reject")}
                            size="sm"
                            variant="destructive"
                            disabled={updateStatusMutation.isPending}
                            className="h-8 px-3 rounded-xl font-bold text-xs cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 mr-1" />
                            Tolak
                          </Button>
                        </>
                      )}

                      {isApproved && (
                        <Button
                          onClick={() => adminCheckInMutation.mutate(b.id)}
                          size="sm"
                          disabled={adminCheckInMutation.isPending}
                          className="h-8 px-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                          title="Tandai presensi check-in tamu selesai"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Check-In
                        </Button>
                      )}

                      {(isApproved || isCompleted) && (
                        <Button
                          onClick={async () => {
                            try {
                              await downloadBookingTicketPdf({
                                id: b.id,
                                bookingCode: b.id,
                                roomName: b.room_name,
                                date: b.booking_date,
                                timeSlot: `${b.start_time} - ${b.end_time} WIB`,
                                applicant: b.applicant_name,
                                idNumber: b.id_number,
                                prodi: b.prodi,
                                role: b.applicant_role,
                                audience: b.audience,
                                purpose: b.purpose,
                                status: b.status,
                              });
                              toast.success(
                                "Dokumen PDF A4 resmi berhasil diunduh!",
                              );
                            } catch {
                              toast.error("Gagal mengunduh dokumen PDF");
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 rounded-xl text-xs border-border hover:border-primary/40 text-primary dark:text-blue-400 cursor-pointer"
                          title="Unduh Dokumen Surat Resmi A4 (PDF)"
                        >
                          <FileDown className="w-3.5 h-3.5 mr-1" />
                          PDF
                        </Button>
                      )}

                      {!isPending && !isCompleted && (
                        <Button
                          onClick={() =>
                            handleOpenActionDialog(
                              b,
                              isApproved ? "reject" : "approve",
                            )
                          }
                          size="sm"
                          variant="outline"
                          disabled={updateStatusMutation.isPending}
                          className="h-8 px-2.5 rounded-xl text-xs cursor-pointer"
                        >
                          {isApproved ? "Batalkan Izin" : "Ubah ke Disetujui"}
                        </Button>
                      )}

                      <Button
                        onClick={() => setDeletingBookingId(b.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-xl hover:bg-destructive/10 text-destructive cursor-pointer"
                        title="Hapus riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Component */}
      {pagination.total_pages > 1 && (
        <InteractivePagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          onPageChange={setCurrentPage}
          totalItems={pagination.total_items}
          pageSize={pageSize}
        />
      )}

      {/* Action Dialog (Approve / Reject with Notes) */}
      <Dialog
        open={Boolean(selectedBookingForAction)}
        onOpenChange={(open) => !open && setSelectedBookingForAction(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-foreground">
              {selectedBookingForAction?.type === "approve"
                ? "Setujui Permohonan Peminjaman Ruangan"
                : "Tolak Permohonan Peminjaman Ruangan"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedBookingForAction?.booking.room_name} •{" "}
              {selectedBookingForAction?.booking.applicant_name} (
              {selectedBookingForAction?.booking.id})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold">Catatan untuk Pemohon</Label>
            <Textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="rounded-xl text-xs min-h-[90px]"
              placeholder="Tuliskan instruksi akses, catatan khusus, atau alasan penolakan..."
            />
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedBookingForAction(null)}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={updateStatusMutation.isPending}
              className={cn(
                "rounded-xl text-xs font-bold text-white",
                selectedBookingForAction?.type === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700",
              )}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : null}
              {selectedBookingForAction?.type === "approve"
                ? "Konfirmasi Setujui"
                : "Konfirmasi Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingBookingId)}
        onOpenChange={(open) => !open && setDeletingBookingId(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center max-h-[90dvh] overflow-y-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <DialogTitle className="text-base font-black text-foreground">
            Hapus Riwayat Reservasi?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Data reservasi ini akan dihapus secara permanen dari basis data
            sistem.
          </DialogDescription>
          <DialogFooter className="pt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingBookingId(null)}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteBookingMutation.isPending}
              className="rounded-xl text-xs font-bold"
            >
              {deleteBookingMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              )}
              Ya, Hapus Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin QR Scanner Modal */}
      <QrScannerModal
        open={isAdminScannerOpen}
        onOpenChange={setIsAdminScannerOpen}
        mode="admin"
        title="Pemindai QR Check-In Pengelola"
        description="Arahkan kamera ke tiket QR mahasiswa/tamu atau masukkan ID reservasi secara manual."
      />

      {/* Room Entrance Kiosk QR Poster Modal */}
      <RoomKioskQrModal
        room={selectedKioskRoom}
        open={isKioskModalOpen}
        onOpenChange={setIsKioskModalOpen}
      />
    </div>
  );
}
