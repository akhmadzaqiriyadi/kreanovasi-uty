"use client";

import { Bell, BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/context/notification-context";

export function NotificationPermissionPrompt() {
  const { isLoggedIn } = useAuth();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("uch_notif_prompt_dismissed");
      if (isDismissed) {
        setDismissed(true);
      }
    }
  }, []);

  // Only show if user is logged in, notifications are supported, permission not yet decided, and not dismissed
  if (!isLoggedIn || !isSupported || permission !== "default" || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("uch_notif_prompt_dismissed", "true");
    }
  };

  const handleEnable = async () => {
    await requestPermission();
    handleDismiss();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative p-5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-primary/30 shadow-2xl backdrop-blur-xl space-y-3.5">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors cursor-pointer"
          aria-label="Tutup prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5">
              <span>Aktifkan Pemberitahuan</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dapatkan kabar langsung saat permohonan ruangan Anda disetujui,
              ditolak, atau jadwal kegiatan segera dimulai.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            onClick={handleEnable}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 shadow-md cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            <span>Izinkan Notifikasi</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="rounded-xl text-xs h-9 px-3 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <span>Nanti</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
