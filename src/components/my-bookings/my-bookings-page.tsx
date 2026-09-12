"use client";

import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  History,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InteractivePagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

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
  role: "Mahasiswa" | "Dosen";
  audience: number;
  purpose: string;
  status: "approved" | "pending" | "completed" | "cancelled";
}

const initialBookings: BookingRecord[] = [
  {
    id: "b-1",
    bookingCode: "UCH-849201",
    roomName: "Think Tank Meeting Room",
    roomImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 2, Kampus 1 UTY",
    date: "Senin, 14 September 2026",
    timeSlot: "09:00 - 12:00 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 6,
    purpose: "Rapat koordinasi tim riset proposal PKM AI dan robotika.",
    status: "approved",
  },
  {
    id: "b-2",
    bookingCode: "UCH-392014",
    roomName: "Multimedia & Podcast Studio",
    roomImage:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 3, Kampus 1 UTY",
    date: "Jumat, 18 September 2026",
    timeSlot: "13:00 - 16:00 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 4,
    purpose: "Take recording podcast edukasi teknologi masa depan HMIF.",
    status: "pending",
  },
  {
    id: "b-3",
    bookingCode: "UCH-105829",
    roomName: "Coworking Space Hall",
    roomImage:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 1, Kampus 1 UTY",
    date: "Rabu, 10 September 2026",
    timeSlot: "10:00 - 14:00 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 18,
    purpose: "Workshop UI/UX Design System Collaboration bersama praktisi.",
    status: "completed",
  },
  {
    id: "b-4",
    bookingCode: "UCH-582910",
    roomName: "FastLab IoT & Hardware Station",
    roomImage:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 2, Kampus 1 UTY",
    date: "Kamis, 24 September 2026",
    timeSlot: "08:30 - 11:30 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 5,
    purpose: "Pengujian sensor mikrokontroler ESP32 dan kalibrasi prototipe.",
    status: "approved",
  },
  {
    id: "b-5",
    bookingCode: "UCH-772109",
    roomName: "Think Tank Meeting Room",
    roomImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 2, Kampus 1 UTY",
    date: "Senin, 07 September 2026",
    timeSlot: "13:00 - 15:30 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 8,
    purpose: "Brainstorming finalisasi sprint feature aplikasi kampus.",
    status: "completed",
  },
  {
    id: "b-6",
    bookingCode: "UCH-294018",
    roomName: "Coworking Space Hall",
    roomImage:
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 1, Kampus 1 UTY",
    date: "Selasa, 01 September 2026",
    timeSlot: "09:00 - 12:00 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 12,
    purpose: "Jadwal dialihkan karena bentrok dengan kuliah umum tamu asing.",
    status: "cancelled",
  },
  {
    id: "b-7",
    bookingCode: "UCH-901842",
    roomName: "Multimedia & Podcast Studio",
    roomImage:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80",
    location: "Gedung Creative Hub Lt. 3, Kampus 1 UTY",
    date: "Rabu, 30 September 2026",
    timeSlot: "14:00 - 17:00 WIB",
    applicant: "Akhmad Zaqi Riyadi",
    prodi: "Informatika",
    role: "Mahasiswa",
    audience: 4,
    purpose: "Shooting video showcase produk inovasi mahasiswa UCH.",
    status: "pending",
  },
];

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 3;

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchStatus =
        activeFilter === "all" || item.status === activeFilter;
      const matchSearch =
        item.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  const handleCancelBooking = (id: string, code: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
    toast.info("Reservasi Dibatalkan", {
      description: `Permohonan peminjaman ${code} telah dibatalkan.`,
    });
  };

  const handleDownloadTicket = (code: string, roomName: string) => {
    toast.success("E-Tiket Siap Diunduh", {
      description: `Mengunduh bukti peminjaman digital ${code} (${roomName}).`,
    });
  };

  const getStatusBadge = (status: BookingRecord["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Disetujui & Terjadwal
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-slate-100 dark:bg-zinc-800 text-muted-foreground border-border font-bold text-xs py-1 px-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai Digunakan
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 font-bold text-xs py-1 px-3 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </Badge>
        );
    }
  };

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
                  <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white">
                    Booking Saya & Riwayat Peminjaman
                  </CardTitle>
                  <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-relaxed max-w-xl">
                    Pantau status verifikasi, unduh e-tiket resmi peminjaman,
                    dan kelola jadwal penggunaan fasilitas UTY Creative Hub
                    Anda.
                  </p>
                </div>
              </div>

              <Button
                asChild
                className="rounded-xl sm:rounded-2xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md self-start sm:self-auto h-9 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm cursor-pointer"
              >
                <Link href="/booking/new">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Ajukan Peminjaman Baru
                </Link>
              </Button>
            </div>
          </CardHeader>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/60 border-b border-border/60 bg-slate-50/70 dark:bg-zinc-800/40">
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Total Pengajuan
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-foreground">
                {bookings.length}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Disetujui / Aktif
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {bookings.filter((b) => b.status === "approved").length}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Menunggu Review
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {bookings.filter((b) => b.status === "pending").length}
              </span>
            </div>
            <div className="p-2.5 sm:p-4 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground block mb-0.5">
                Selesai Digunakan
              </span>
              <span className="text-lg sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {bookings.filter((b) => b.status === "completed").length}
              </span>
            </div>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60 w-full sm:w-auto overflow-x-auto">
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
                  Semua ({bookings.length})
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
                  Disetujui (
                  {bookings.filter((b) => b.status === "approved").length})
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
                  Menunggu (
                  {bookings.filter((b) => b.status === "pending").length})
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
                  Selesai (
                  {bookings.filter((b) => b.status === "completed").length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari ID atau ruangan..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border-border"
                />
              </div>
            </div>

            {/* Bookings List Cards */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
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
                paginatedBookings.map((item) => (
                  <Card
                    key={item.id}
                    className="rounded-2xl border border-border/70 hover:border-primary/40 transition-all duration-300 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image Thumbnail */}
                      <div className="relative w-full lg:w-56 h-40 lg:h-auto shrink-0 bg-slate-100 dark:bg-zinc-800">
                        <Image
                          src={item.roomImage}
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
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
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
                            {item.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleDownloadTicket(
                                    item.bookingCode,
                                    item.roomName,
                                  )
                                }
                                className="h-8 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                Unduh E-Tiket
                              </Button>
                            )}

                            {item.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
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
            <InteractivePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredBookings.length}
              pageSize={pageSize}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
