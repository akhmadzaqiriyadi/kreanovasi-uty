"use client";

import {
  Bell,
  CheckCircle2,
  Clock,
  DoorOpen,
  Info,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type AppNotification,
  useNotifications,
} from "@/context/notification-context";
import { cn } from "@/lib/utils";

export function NavNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (item: AppNotification) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.actionUrl) {
      setIsOpen(false);
      window.location.href = item.actionUrl;
    }
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "booking_approved":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case "booking_rejected":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case "booking_checked_in":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <DoorOpen className="w-4 h-4" />
          </div>
        );
      case "booking_created":
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
            <h4 className="text-sm font-bold text-foreground">
              Notifikasi Terbaru
            </h4>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] font-bold px-1.5 py-0 bg-primary/10 text-primary dark:text-blue-400 border-none"
              >
                {unreadCount} Baru
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-primary dark:text-blue-400 hover:underline cursor-pointer"
              >
                Tandai dibaca
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                title="Bersihkan riwayat notifikasi"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="py-10 text-center space-y-1.5 px-4">
              <Info className="w-6 h-6 text-muted-foreground/40 mx-auto" />
              <p className="text-xs font-semibold text-foreground">
                Belum ada notifikasi
              </p>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                Pembaruan permohonan ruangan dan status akun akan langsung
                tampil di sini.
              </p>
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
                      {item.timeLabel}
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
        <div className="p-2 border-t border-border/60 bg-slate-50/50 dark:bg-zinc-800/30 grid grid-cols-2 gap-1 text-center">
          <Button
            asChild
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-full text-[11px] font-semibold text-primary dark:text-blue-400 hover:bg-primary/10 h-7 rounded-lg"
          >
            <Link href="/notifications">Pusat Notifikasi</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="w-full text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-zinc-800 h-7 rounded-lg"
          >
            <Link href="/my-bookings">Riwayat Booking</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
