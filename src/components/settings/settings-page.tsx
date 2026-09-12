"use client";

import {
  Bell,
  Globe,
  Laptop,
  Moon,
  Save,
  Settings,
  Shield,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailNotif: true,
    whatsappNotif: true,
    promoNotif: false,
    soundAlert: true,
    language: "id",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Pengaturan Berhasil Disimpan", {
        description: "Preferensi akun dan notifikasi Anda telah diperbarui.",
      });
    }, 500);
  };

  const handleLogoutAllDevices = () => {
    toast.success("Sesi Perangkat Direset", {
      description:
        "Semua sesi perangkat lain berhasil diakhiri untuk keamanan akun SSO Anda.",
    });
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        {/* Header Banner */}
        <Card className="rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-md">
                <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                  Pengaturan Akun & Preferensi
                </CardTitle>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed max-w-xl">
                  Kelola preferensi notifikasi peminjaman, tampilan tema,
                  bahasa, dan keamanan akun SSO UTY Anda.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Preferensi Notifikasi
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tentukan saluran notifikasi yang Anda inginkan untuk
                    informasi reservasi
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-slate-50/60 dark:bg-zinc-800/40">
                  <div className="space-y-0.5 pr-4">
                    <Label
                      htmlFor="emailNotif"
                      className="text-xs font-bold text-foreground cursor-pointer"
                    >
                      Email Pemberitahuan Status Peminjaman
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Kirim email saat permohonan disetujui, ditolak, atau
                      membutuhkan revisi.
                    </p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={settings.emailNotif}
                    onCheckedChange={(c) =>
                      setSettings({ ...settings, emailNotif: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-slate-50/60 dark:bg-zinc-800/40">
                  <div className="space-y-0.5 pr-4">
                    <Label
                      htmlFor="whatsappNotif"
                      className="text-xs font-bold text-foreground cursor-pointer"
                    >
                      Pengingat WhatsApp H-1 Jadwal
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Kirim pesan pengingat jadwal satu hari sebelum kegiatan
                      dimulai.
                    </p>
                  </div>
                  <Switch
                    id="whatsappNotif"
                    checked={settings.whatsappNotif}
                    onCheckedChange={(c) =>
                      setSettings({ ...settings, whatsappNotif: c })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-slate-50/60 dark:bg-zinc-800/40">
                  <div className="space-y-0.5 pr-4">
                    <Label
                      htmlFor="promoNotif"
                      className="text-xs font-bold text-foreground cursor-pointer"
                    >
                      Agenda Workshop & Fasilitas Baru
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Dapatkan info inovasi, perlengkapan baru, dan event
                      kreatif di UCH.
                    </p>
                  </div>
                  <Switch
                    id="promoNotif"
                    checked={settings.promoNotif}
                    onCheckedChange={(c) =>
                      setSettings({ ...settings, promoNotif: c })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Appearance & Theme */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Tampilan & Bahasa
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Sesuaikan tema antarmuka dan bahasa aplikasi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer",
                    theme === "light"
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                      : "border-border/70 hover:border-border",
                  )}
                >
                  <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Mode Terang
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Tampilan putih bersih
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer",
                    theme === "dark"
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                      : "border-border/70 hover:border-border",
                  )}
                >
                  <Moon className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Mode Gelap
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Nyaman untuk malam hari
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={cn(
                    "p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer",
                    theme === "system"
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                      : "border-border/70 hover:border-border",
                  )}
                >
                  <Laptop className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Ikuti Sistem
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Otomatis sesuai OS
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Section 3: Security & Session */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Keamanan & Autentikasi SSO
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Manajemen keamanan akun kampus Anda
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/60 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">
                      Autentikasi Dua Langkah (2FA SSO)
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] border-none">
                      Aktif
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Akun Anda terlindungi oleh sistem keamanan Single Sign-On
                    UTY Yogyakarta.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogoutAllDevices}
                  className="rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer self-start sm:self-auto"
                >
                  Keluar dari Perangkat Lain
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-border/60 flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="rounded-2xl h-11 px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
