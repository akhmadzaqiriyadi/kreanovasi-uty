"use client";

import { Bell, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "reminder" | "warning" | "info";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Peminjaman Disetujui",
    message: "Permohonan Ruang Think Tank (14 Sep) telah disetujui admin UCH.",
    time: "10 menit lalu",
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "Pengingat Jadwal",
    message:
      "Workshop UI/UX Design System dimulai besok pukul 09:00 WIB di Coworking Space.",
    time: "2 jam lalu",
    read: false,
    type: "reminder",
  },
  {
    id: "notif-3",
    title: "Menunggu Verifikasi",
    message:
      "Pengajuan Ruang Multimedia & Podcast sedang dalam antrean review tim fasilitas.",
    time: "5 jam lalu",
    read: false,
    type: "warning",
  },
  {
    id: "notif-4",
    title: "Fasilitas Baru Tersedia",
    message:
      "Perangkat 3D Printer & VR Headset terbaru kini siap dipinjam di Creative Hub.",
    time: "1 hari lalu",
    read: true,
    type: "info",
  },
];

export function NavNotifications() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Semua notifikasi ditandai sebagai sudah dibaca");
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
      );
    }
    toast.info(item.title, {
      description: item.message,
    });
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case "reminder":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case "warning":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 outline-hidden cursor-pointer",
            "border border-border/60 hover:border-primary/40 bg-background hover:bg-slate-100 dark:hover:bg-zinc-800 text-foreground/80 hover:text-foreground",
            isOpen && "border-primary text-primary bg-primary/10",
          )}
          aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
        >
          <Bell className="w-4 h-4" />

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
              <span className="relative">{unreadCount}</span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 rounded-2xl shadow-2xl border-border/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-slate-50/70 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">Notifikasi</h4>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] font-bold px-1.5 py-0 bg-primary/10 text-primary dark:text-blue-400 border-none"
              >
                {unreadCount} Baru
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-[11px] font-semibold text-primary dark:text-blue-400 hover:underline cursor-pointer"
            >
              Tandai dibaca
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Tidak ada notifikasi
            </div>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full text-left p-3.5 flex items-start gap-3 hover:bg-slate-100/70 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer",
                  !item.read && "bg-blue-50/50 dark:bg-blue-950/20 font-medium",
                )}
              >
                {getNotificationIcon(item.type)}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        "text-xs leading-tight truncate",
                        !item.read
                          ? "font-bold text-foreground"
                          : "font-semibold text-foreground/80",
                      )}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-border/60 bg-slate-50/50 dark:bg-zinc-800/30 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast.info("Pusat Notifikasi", {
                description:
                  "Semua notifikasi tersinkronisasi dengan akun SSO UTY Anda.",
              });
              setIsOpen(false);
            }}
            className="w-full text-xs font-semibold text-primary dark:text-blue-400 hover:bg-primary/10 h-8 rounded-lg"
          >
            Lihat Semua Aktivitas
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
