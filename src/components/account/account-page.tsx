"use client";

import {
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { dummyUser } from "@/components/navbar/nav-user-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studyPrograms } from "@/hooks/use-new-booking-form";
import { cn } from "@/lib/utils";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "academic" | "stats">(
    "profile",
  );

  const [formData, setFormData] = useState({
    name: dummyUser.name,
    email: dummyUser.email,
    npm: dummyUser.npm,
    prodi: "Informatika",
    faculty: "Fakultas Sains & Teknologi",
    phone: "0812-3456-7890",
    role: "Mahasiswa Aktif UTY",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profil Berhasil Diperbarui", {
        description: "Data profil akun SSO Anda telah tersimpan di sistem.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
        {/* Profile Card Header */}
        <Card className="rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          {/* Top Banner Cover */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-600 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge className="bg-emerald-500 text-white font-bold text-xs py-1 px-3 border-none shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Akun SSO Terverifikasi
              </Badge>
            </div>
          </div>

          {/* User Identity Info */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl border-4 border-white dark:border-zinc-900 shadow-xl">
                    <AvatarImage
                      src={dummyUser.avatarUrl}
                      alt={formData.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-extrabold text-2xl">
                      AZ
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-900" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground">
                      {formData.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="text-xs font-bold py-0.5 px-2.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-none"
                    >
                      {formData.role}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {formData.email} • NPM{" "}
                    <span className="font-mono font-bold text-foreground">
                      {formData.npm}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold border-border"
                >
                  <Link href="/my-bookings">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Lihat Booking Saya
                  </Link>
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-border/60 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "profile"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <User className="w-4 h-4" />
                Informasi Profil
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("academic")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "academic"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap className="w-4 h-4" />
                Akademik & Afiliasi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stats")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "stats"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Award className="w-4 h-4" />
                Statistik Reservasi
              </button>
            </div>
          </div>
        </Card>

        {/* Tab 1: Profile Information */}
        {activeTab === "profile" && (
          <Card className="rounded-3xl border border-border/80 shadow-md bg-white dark:bg-zinc-900">
            <CardHeader className="p-6 sm:p-8 border-b border-border/60">
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                Data Diri Penanggung Jawab
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Informasi ini otomatis digunakan saat mengajukan permohonan
                peminjaman fasilitas UTY Creative Hub.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="npm" className="text-xs font-bold">
                      NPM / Nomor Identitas
                    </Label>
                    <Input
                      id="npm"
                      value={formData.npm}
                      readOnly
                      disabled
                      className="h-11 rounded-xl bg-muted/60 font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground block">
                      Tersinkronisasi otomatis dengan database SSO UTY.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold">
                      Email SSO Kampus
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="h-11 rounded-xl bg-muted/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold">
                      No. WhatsApp / Telepon Aktif
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="prodi" className="text-xs font-bold">
                      Program Studi
                    </Label>
                    <Select
                      value={formData.prodi}
                      onValueChange={(val) =>
                        setFormData({ ...formData, prodi: val })
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Pilih Program Studi" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl max-h-60">
                        {studyPrograms.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="faculty" className="text-xs font-bold">
                      Fakultas
                    </Label>
                    <Input
                      id="faculty"
                      value={formData.faculty}
                      readOnly
                      disabled
                      className="h-11 rounded-xl bg-muted/60"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl h-11 px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Academic & Affiliations */}
        {activeTab === "academic" && (
          <div className="space-y-6">
            <Card className="rounded-3xl border border-border/80 shadow-md bg-white dark:bg-zinc-900">
              <CardHeader className="p-6 sm:p-8 border-b border-border/60">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                  Afiliasi Organisasi & Komunitas Kampus
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Daftar organisasi mahasiswa atau kelompok riset yang Anda
                  wakili saat meminjam fasilitas UCH.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">
                        Himpunan Mahasiswa Informatika (HMIF)
                      </h4>
                      <Badge className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-none">
                        Aktif
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Divisi Riset & Pengembangan Teknologi • Anggota Pengurus
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">
                        Komunitas Kreanovasi AI & Robotika UTY
                      </h4>
                      <Badge className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-none">
                        Ketua Tim PKM
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Grup Riset Kolaboratif Mahasiswa & Dosen Pembimbing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Booking Stats */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                Total Reservasi
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                8 Kali
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                Semua kegiatan terselenggara
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                Total Jam Fasilitas
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-blue-400 block">
                24 Jam
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
                Rata-rata 3 jam per sesi
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                Tingkat Kehadiran
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                100%
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                Tanpa pembatalan mendadak
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                Ruangan Favorit
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-foreground truncate block">
                Think Tank
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
                5 kali peminjaman
              </span>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
