"use client";

import {
  Bell,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SystemNotification {
  id: string;
  category: "booking" | "reminder" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const initialNotificationsList: SystemNotification[] = [
  {
    id: "notif-1",
    category: "booking",
    title: "Permohonan Peminjaman Disetujui",
    message:
      "Pengajuan Ruang Think Tank Meeting Room (ID: UCH-849201) untuk agenda Rapat Koordinasi PKM pada 14 September 2026 telah disetujui admin UCH.",
    timestamp: "10 menit lalu",
    isRead: false,
    actionUrl: "/my-bookings",
    actionLabel: "Lihat E-Tiket",
  },
  {
    id: "notif-2",
    category: "reminder",
    title: "Pengingat Jadwal Workshop Besok",
    message:
      "Workshop UI/UX Design System Collaboration akan dimulai besok pukul 09:00 WIB di Coworking Space Hall Kampus 1 UTY.",
    timestamp: "2 jam lalu",
    isRead: false,
    actionUrl: "/booking",
    actionLabel: "Lihat Jadwal",
  },
  {
    id: "notif-3",
    category: "booking",
    title: "Peminjaman Sedang Dalam Antrean Review",
    message:
      "Permohonan Ruang Multimedia & Podcast Studio untuk tanggal 18 September 2026 sedang ditinjau oleh tim pengelola fasilitas kampus.",
    timestamp: "5 jam lalu",
    isRead: false,
    actionUrl: "/my-bookings",
    actionLabel: "Cek Status",
  },
  {
    id: "notif-4",
    category: "system",
    title: "Fasilitas Baru Siap Digunakan",
    message:
      "Perangkat 3D Printer Creality & Headset VR Meta Quest 3 terbaru di Creative Hub kini telah dapat dipesan untuk riset mahasiswa & dosen.",
    timestamp: "1 hari lalu",
    isRead: true,
    actionUrl: "/about",
    actionLabel: "Pelajari Fasilitas",
  },
  {
    id: "notif-5",
    category: "system",
    title: "Pemeliharaan Perangkat Selesai",
    message:
      "Kalibrasi proyektor laser 4K dan sistem mikrofon wireless di Coworking Space Hall telah selesai dikerjakan dan siap digunakan.",
    timestamp: "2 hari lalu",
    isRead: true,
  },
  {
    id: "notif-6",
    category: "booking",
    title: "Peminjaman Selesai",
    message:
      "Sesi reservasi Ruang Think Tank pada 10 September 2026 telah selesai. Terima kasih telah menjaga kebersihan dan ketertiban fasilitas UCH.",
    timestamp: "3 hari lalu",
    isRead: true,
    actionUrl: "/my-bookings",
    actionLabel: "Riwayat",
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(
    initialNotificationsList,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [notifications, selectedCategory, searchQuery]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Semua notifikasi ditandai sebagai dibaca");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi dihapus");
  };

  const getCategoryIcon = (category: SystemNotification["category"]) => {
    switch (category) {
      case "booking":
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case "reminder":
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
        {/* Header Banner */}
        <Card className="rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-md">
                  <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                      Pusat Notifikasi
                    </CardTitle>
                    {unreadCount > 0 && (
                      <Badge className="bg-rose-500 text-white font-bold text-xs px-2.5 py-0.5 border-none shadow-xs">
                        {unreadCount} Baru
                      </Badge>
                    )}
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
                    Pembaruan terkini seputar permohonan peminjaman ruangan,
                    konfirmasi reservasi, dan aktivitas fasilitas UTY Creative
                    Hub.
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl font-bold bg-white/20 hover:bg-white/30 text-white border-white/20 self-start sm:self-auto cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4 mr-1.5" />
                  Tandai Semua Dibaca
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60 w-full sm:w-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedCategory === "all"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("booking")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedCategory === "booking"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Peminjaman (
                  {notifications.filter((n) => n.category === "booking").length}
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("reminder")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedCategory === "reminder"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Jadwal & Agenda (
                  {
                    notifications.filter((n) => n.category === "reminder")
                      .length
                  }
                  )
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("system")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    selectedCategory === "system"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Fasilitas & Sistem (
                  {notifications.filter((n) => n.category === "system").length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari notifikasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-xs bg-slate-50 dark:bg-zinc-800/60 border-border"
                />
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-slate-50/50 dark:bg-zinc-800/20">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                    <Bell className="w-6 h-6 opacity-40" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Tidak ada notifikasi ditemukan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? `Tidak ada notifikasi yang cocok dengan kata kunci "${searchQuery}".`
                      : "Semua pembaruan telah Anda pantau dengan baik."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                      notif.isRead
                        ? "bg-white dark:bg-zinc-900 border-border/60"
                        : "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50 shadow-xs",
                    )}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {getCategoryIcon(notif.category)}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={cn(
                              "text-sm",
                              notif.isRead
                                ? "font-semibold text-foreground/90"
                                : "font-extrabold text-foreground",
                            )}
                          >
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <Badge className="text-[10px] font-bold py-0 px-1.5 bg-primary/15 text-primary dark:text-blue-400 border-none">
                              Baru
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground font-medium ml-auto sm:ml-0">
                            • {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto justify-end">
                      {notif.actionUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold border-border hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                          <Link href={notif.actionUrl}>
                            {notif.actionLabel || "Buka"}
                          </Link>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleRead(notif.id)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                        title={
                          notif.isRead
                            ? "Tandai belum dibaca"
                            : "Tandai sudah dibaca"
                        }
                      >
                        <Check className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(notif.id)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        title="Hapus notifikasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
