"use client";

import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  History,
  Loader2,
  Lock,
  LogIn,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QrScannerModal } from "@/components/booking/qr-scanner-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InteractivePagination } from "@/components/ui/pagination";
import { useAuth } from "@/context/auth-context";
import {
  type BackendBooking,
  useCancelBookingMutation,
  useMyBookingsQuery,
} from "@/hooks/use-booking-queries";
import { getSafeImageUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import { TicketDialog } from "./ticket-dialog";

export interface BookingRecord {
  id: string;
  bookingCode: string;
  roomName: string;
  roomImage: string;
  location: string;
  date: string;
  timeSlot: string;
  applicant: string;
  prodi: string;
  role: "Mahasiswa" | "Dosen" | "Umum";
  audience: number;
  purpose: string;
  status: "approved" | "pending" | "completed" | "cancelled";
}

const DEFAULT_ROOM_IMAGES: Record<string, string> = {
  "coworking-space-hall": "/images/coworking-space.jpg",
  "think-tank-meeting-room": "/images/think-tank-room.jpg",
  "fastlab-prototyping-iot": "/images/prototyping-room.jpg",
  "multimedia-podcast-studio": "/images/room1.jpeg",
  "auditorium-pitching": "/images/room2.jpeg",
  "komputasi-ai-vr": "/images/room3.jpeg",
};

export function MyBookingsPage() {
  const { isLoggedIn, isAuthLoading } = useAuth();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const {
    data: bookingsData,
    isLoading: isBookingsLoading,
    refetch,
    isFetching,
  } = useMyBookingsQuery({
    page: currentPage,
    limit: pageSize,
    status: activeFilter,
    search: searchQuery,
  });

  const cancelMutation = useCancelBookingMutation();

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const rawBookings: BackendBooking[] = bookingsData?.bookings || [];
  const pagination = bookingsData?.pagination || {
    page: 1,
    limit: pageSize,
    total_items: 0,
    total_pages: 1,
  };

  const formattedBookings: BookingRecord[] = rawBookings.map((b) => ({
    id: b.id,
    bookingCode: b.id,
    roomName: b.room_name,
    roomImage: DEFAULT_ROOM_IMAGES[b.room_id] || "/images/coworking-space.jpg",
    location: "Gedung UTY Creative Hub",
    date: b.booking_date,
    timeSlot: `${b.start_time} - ${b.end_time} WIB`,
    applicant: b.applicant_name,
    prodi: b.prodi || "Civitas UTY",
    role:
      b.applicant_role === "dosen"
        ? "Dosen"
        : b.applicant_role === "umum"
          ? "Umum"
          : "Mahasiswa",
    audience: b.audience,
    purpose: b.purpose,
    status: (b.status as BookingRecord["status"]) || "pending",
  }));

  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(
    null,
  );
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleCancelBooking = async (id: string, code: string) => {
    if (confirm(`Apakah Anda yakin ingin membatalkan permohonan ${code}?`)) {
      await cancelMutation.mutateAsync(id);
    }
  };

  const handleDownloadTicket = (bookingItem: BookingRecord) => {
    setSelectedTicket(bookingItem);
    setIsTicketOpen(true);
  };

  const getStatusBadge = (status: BookingRecord["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Disetujui
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Menunggu Review
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Presensi Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Dibatalkan
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="font-bold text-xs py-1 px-3 shrink-0 whitespace-nowrap"
          >
            {status}
          </Badge>
        );
    }
  };

  // Wajib Login Barrier
  if (!isLoggedIn && !isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-slate-50/60 to-background dark:via-zinc-950/40">
        <div className="w-full max-w-lg my-auto">
          <Card className="rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900 text-center">
            <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 text-amber-300">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-extrabold text-white">
                Wajib Masuk Akun
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm mt-1">
                Silakan masuk ke akun Anda untuk melihat jadwal dan riwayat
                reservasi ruangan pribadi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Riwayat reservasi, status persetujuan fasilitas, dan tiket
                digital hanya dapat diakses setelah melakukan otentikasi resmi.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  asChild
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 shadow-md"
                >
                  <Link href="/account?redirect=/my-bookings">
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk ke Akun Anda
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-border py-6"
                >
                  <Link href="/booking">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Lihat Katalog Ruangan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-20 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Banner */}
        <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-md">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-xl lg:text-2xl font-black text-white">
                    Booking Saya & Riwayat Peminjaman
                  </CardTitle>
                  <p className="text-blue-100 text-[11px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 leading-relaxed max-w-xl">
                    Pantau status verifikasi, unduh e-tiket resmi peminjaman,
                    dan kelola jadwal penggunaan fasilitas UTY Creative Hub
                    Anda.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
                <Button
                  onClick={() => setIsScannerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs h-8 sm:h-10 px-2.5 sm:px-3.5 cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>Scan Masuk</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs h-8 sm:h-10 px-2.5 sm:px-3 cursor-pointer"
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
                  asChild
                  className="rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md h-8 sm:h-10 px-3 sm:px-4 text-[11px] sm:text-xs cursor-pointer"
                >
                  <Link href="/booking/new">
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                    Ajukan Baru
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60 border-b border-border/60 bg-slate-50/70 dark:bg-zinc-800/40">
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Total Pengajuan
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-foreground">
                {pagination.total_items}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Halaman
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-primary dark:text-blue-400">
                {pagination.page} / {pagination.total_pages}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Data Per Halaman
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {pageSize}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Status Filter
              </span>
              <span className="text-sm sm:text-base font-bold text-foreground capitalize">
                {activeFilter === "all" ? "Semua Status" : activeFilter}
              </span>
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 min-w-0">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60 w-full sm:w-auto overflow-x-auto min-w-0 max-w-full scrollbar-none">
                <button
                  type="button"
                  onClick={() => handleFilterChange("all")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeFilter === "all"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("pending")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeFilter === "pending"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Menunggu Review
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("approved")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeFilter === "approved"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Disetujui
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("completed")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeFilter === "completed"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterChange("cancelled")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    activeFilter === "cancelled"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Dibatalkan
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari ID atau agenda..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border-border"
                />
              </div>
            </div>

            {/* Bookings List Cards */}
            <div className="space-y-4">
              {isBookingsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">
                    Memuat riwayat reservasi Anda...
                  </p>
                </div>
              ) : formattedBookings.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-slate-50/50 dark:bg-zinc-800/20">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                    <Calendar className="w-6 h-6 opacity-40" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Tidak ada reservasi ditemukan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? `Tidak ada reservasi yang cocok dengan kata kunci "${searchQuery}".`
                      : "Belum ada riwayat peminjaman pada filter ini."}
                  </p>
                </div>
              ) : (
                formattedBookings.map((item) => (
                  <Card
                    key={item.id}
                    className="rounded-2xl border border-border/70 hover:border-primary/40 transition-all duration-300 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Thumbnail */}
                      <div className="relative w-full lg:w-56 h-40 lg:h-auto shrink-0 bg-slate-100 dark:bg-zinc-800">
                        <Image
                          src={getSafeImageUrl(item.roomImage)}
                          alt={item.roomName}
                          fill
                          sizes="(max-width: 1024px) 100vw, 224px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                        <span className="absolute bottom-3 left-3 text-xs font-bold text-white lg:hidden">
                          {item.roomName}
                        </span>
                      </div>

                      {/* Main Details */}
                      <div className="p-3.5 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xs font-mono font-bold text-primary dark:text-blue-400 bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-lg">
                                {item.bookingCode}
                              </span>
                              <h3 className="hidden lg:block text-base font-extrabold text-foreground">
                                {item.roomName}
                              </h3>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-semibold text-foreground">
                                {item.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-semibold text-foreground">
                                {item.timeSlot}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 text-primary shrink-0" />
                              <span>
                                <strong className="text-foreground">
                                  {item.audience}
                                </strong>{" "}
                                Orang ({item.applicant})
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/50">
                            <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                              Tujuan Kegiatan:
                            </span>
                            <p className="text-xs text-foreground/80 italic line-clamp-2">
                              "{item.purpose}"
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-muted-foreground">
                            {item.location}
                          </span>

                          <div className="flex items-center gap-2">
                            {(item.status === "approved" ||
                              item.status === "completed") && (
                              <Button
                                size="sm"
                                onClick={() => handleDownloadTicket(item)}
                                className="h-8 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                {item.status === "completed"
                                  ? "Bukti Presensi & Tiket"
                                  : "Unduh E-Tiket"}
                              </Button>
                            )}

                            {item.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={cancelMutation.isPending}
                                onClick={() =>
                                  handleCancelBooking(item.id, item.bookingCode)
                                }
                                className="h-8 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 cursor-pointer"
                              >
                                Batalkan
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
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
          </CardContent>
        </Card>

        {/* Modal E-Tiket Digital */}
        <TicketDialog
          booking={selectedTicket}
          open={isTicketOpen}
          onOpenChange={setIsTicketOpen}
        />

        {/* Modal Self Check-In QR Scanner */}
        <QrScannerModal
          mode="user"
          open={isScannerOpen}
          onOpenChange={setIsScannerOpen}
          title="Scan QR Masuk Ruangan"
          description="Pindai QR Code di pintu ruangan atau ketikkan kode ID ruangan / tiket untuk check-in mandiri."
        />
      </div>
    </div>
  );
}
