"use client";

import {
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/hooks/use-auth-mutations";
import { studyPrograms } from "@/hooks/use-new-booking-form";
import { cn } from "@/lib/utils";

export function AccountPage() {
  const { isLoggedIn, user, logout, setSessionUser, openLoginModal } =
    useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "academic" | "stats" | "security"
  >("profile");

  const userRole =
    user?.role ||
    (user?.email === "admin@gozaq.com"
      ? "admin"
      : user?.email.includes("@staff.uty.ac.id") || user?.email.includes("bambang")
        ? "dosen"
        : "mahasiswa");
  const isAdmin = userRole === "admin";
  const isDosen = userRole === "dosen";
  const isUmum = userRole === "umum";

  const getComputedRoleLabel = () => {
    if (isAdmin) return "System Administrator";
    if (isDosen) return "Dosen / Tenaga Pendidik";
    if (isUmum) return "Non-Civitas / Mitra";
    return "Mahasiswa Aktif UTY";
  };

  const getComputedIdNumber = (usr = user) => {
    if (isAdmin) {
      return usr?.id ? `ADM-${usr.id.slice(0, 8).toUpperCase()}` : "ADM-001";
    }
    if (isUmum) {
      return usr?.idNumber || "3404011205940003";
    }
    if (isDosen) {
      return usr?.idNumber || usr?.npm || "0514088201";
    }
    return usr?.npm || usr?.idNumber || "5210411234";
  };

  const getComputedProdi = (usr = user) => {
    if (isAdmin) return "Unit Manajemen Sistem";
    if (isUmum) return usr?.affiliation || "Mitra Eksternal";
    return usr?.prodi || "Informatika";
  };

  const getComputedFaculty = () => {
    if (isAdmin) return "Pengelola UTY Creative Hub";
    if (isUmum) return "Komunitas / Industri Kreatif";
    return "Fakultas Sains & Teknologi";
  };

  const [formData, setFormData] = useState({
    name: user?.name || (isAdmin ? "System Administrator" : ""),
    email: user?.email || (isAdmin ? "admin@gozaq.com" : ""),
    npm: getComputedIdNumber(),
    prodi: getComputedProdi(),
    faculty: getComputedFaculty(),
    phone: "0812-3456-7890",
    role: getComputedRoleLabel(),
  });

  // Consolidated password state
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updatePassword = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      const uRole =
        user.role ||
        (user.email === "admin@gozaq.com"
          ? "admin"
          : user.email.includes("@staff.uty.ac.id") || user.email.includes("bambang")
            ? "dosen"
            : "mahasiswa");
      const isAdm = uRole === "admin";
      const isDos = uRole === "dosen";
      const isUm = uRole === "umum";

      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        npm: isAdm
          ? (user.id ? `ADM-${user.id.slice(0, 8).toUpperCase()}` : "ADM-001")
          : isUm
            ? user.idNumber || ""
            : isDos
              ? user.idNumber || user.npm || ""
              : user.npm || user.idNumber || "",
        prodi: isAdm
          ? "Unit Manajemen Sistem"
          : isUm
            ? user.affiliation || "Mitra Eksternal"
            : user.prodi || user.affiliation || "Informatika",
        faculty: isAdm
          ? "Pengelola UTY Creative Hub"
          : isUm
            ? "Komunitas / Industri Kreatif"
            : "Fakultas Sains & Teknologi",
        role: isAdm
          ? "System Administrator"
          : isDos
            ? "Dosen / Tenaga Pendidik"
            : isUm
              ? "Non-Civitas / Mitra"
              : "Mahasiswa Aktif UTY",
      }));
    }
  }, [user]);

  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: (updatedBackendUser) => {
      if (user) {
        setSessionUser({
          ...user,
          name: updatedBackendUser.name,
          affiliation: updatedBackendUser.affiliation || user.affiliation,
          prodi: updatedBackendUser.affiliation || user.prodi,
        });
      }
    },
  });

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: () => {
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
  });

  const handleLogout = () => {
    logout();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nama Wajib Diisi", {
        description: "Silakan masukkan nama lengkap Anda.",
      });
      return;
    }
    updateProfileMutation.mutate({
      name: formData.name.trim(),
      affiliation: formData.prodi || formData.faculty,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Form Belum Lengkap", {
        description: "Semua field kata sandi wajib diisi.",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Kata Sandi Terlalu Pendek", {
        description: "Kata sandi baru minimal 6 karakter.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Kata Sandi Tidak Cocok", {
        description: "Konfirmasi kata sandi baru tidak sesuai.",
      });
      return;
    }
    changePasswordMutation.mutate({
      old_password: oldPassword,
      new_password: newPassword,
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 pb-16 flex items-center justify-center bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40 px-4">
        <Card className="max-w-md w-full rounded-3xl border border-border/80 shadow-2xl p-6 sm:p-8 text-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-8 ring-amber-500/5">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="text-[11px] font-bold py-0.5 px-3 border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
            >
              Autentikasi Diperlukan
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Akses Akun Terbatas
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Halaman ini memerlukan sesi login aktif. Silakan masuk dengan akun
              Anda untuk melihat dan mengelola profil, riwayat reservasi, serta
              keamanan kata sandi.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Button
              type="button"
              onClick={openLoginModal}
              className="flex-1 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl font-bold text-xs border-border/80 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-20 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Profile Card Header */}
        <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          {/* Top Banner Cover */}
          <div className="h-24 sm:h-36 lg:h-44 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-600 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
              <Badge className="bg-emerald-500 text-white font-bold text-[10px] sm:text-xs py-0.5 sm:py-1 px-2.5 sm:px-3 border-none shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:inline">Akun</span> Terverifikasi
              </Badge>
            </div>
          </div>

          {/* User Identity Info */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-8 sm:-mt-12 md:-mt-14 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                <div className="relative inline-block">
                  <Avatar className="h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-white dark:border-zinc-900 shadow-xl">
                    <AvatarImage
                      src={
                        user?.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={formData.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-extrabold text-xl sm:text-2xl">
                      {formData.name
                        ? formData.name.slice(0, 2).toUpperCase()
                        : "UC"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 ring-2 sm:ring-4 ring-white dark:ring-zinc-900" />
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-foreground">
                      {formData.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] sm:text-xs font-bold py-0.5 px-2 border-none",
                        isAdmin
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                          : isDosen
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                            : isUmum
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
                      )}
                    >
                      {formData.role}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {formData.email}
                    {isAdmin ? (
                      <>
                        {" • "}
                        <span className="font-semibold text-foreground">Pengelola UTY Creative Hub</span>
                        {" • ID "}
                        <span className="font-mono font-bold text-foreground">{formData.npm}</span>
                      </>
                    ) : isDosen ? (
                      <>
                        {" • NIDN "}
                        <span className="font-mono font-bold text-foreground">{formData.npm}</span>
                        {" • "}
                        <span>{formData.faculty}</span>
                      </>
                    ) : isUmum ? (
                      <>
                        {formData.npm ? (
                          <>
                            {" • NIK "}
                            <span className="font-mono font-bold text-foreground">{formData.npm}</span>
                          </>
                        ) : null}
                        {" • "}
                        <span>{formData.prodi}</span>
                      </>
                    ) : (
                      <>
                        {formData.npm ? (
                          <>
                            {" • NPM "}
                            <span className="font-mono font-bold text-foreground">{formData.npm}</span>
                          </>
                        ) : null}
                        {" • "}
                        <span>{formData.prodi}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Booking Saya & Logout */}
              <div className="flex items-center gap-2 flex-wrap pt-1 sm:pt-0">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold border-border h-8 sm:h-9 px-3"
                >
                  <Link href="/my-bookings">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    <span>Booking Saya</span>
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-xs font-bold border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 h-8 sm:h-9 px-3 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <span>Keluar</span>
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-border/60 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "profile"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Informasi Profil</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("academic")}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "academic"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>
                  {isAdmin
                    ? "Hak Akses & Otoritas"
                    : isDosen
                      ? "Akademik & Riset"
                      : isUmum
                        ? "Kemitraan & Kolaborasi"
                        : "Akademik & Afiliasi"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stats")}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "stats"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Statistik Reservasi</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap",
                  activeTab === "security"
                    ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Keamanan & Sandi</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Tab 1: Profile Information */}
        {activeTab === "profile" && (
          <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-md bg-white dark:bg-zinc-900">
            <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-border/60">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                Data Diri Penanggung Jawab
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Informasi ini otomatis digunakan saat mengajukan permohonan
                peminjaman fasilitas UTY Creative Hub.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold block">
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

                  <div className="space-y-2">
                    <Label htmlFor="npm" className="text-xs font-bold block">
                      {isAdmin
                        ? "ID Akses Administrator"
                        : isDosen
                          ? "NIDN / NIP Dosen"
                          : isUmum
                            ? "NIK KTP Pemohon"
                            : "NPM / Nomor Identitas"}
                    </Label>
                    <Input
                      id="npm"
                      value={formData.npm}
                      readOnly
                      disabled
                      className="h-11 rounded-xl bg-muted/60 font-mono"
                    />
                    <span className="text-[10px] text-muted-foreground block">
                      {isAdmin
                        ? "Kredensial identitas superuser pengelolaan fasilitas UCH."
                        : isDosen
                          ? "Nomor Induk Dosen Nasional terdaftar di PDDikti UTY."
                          : isUmum
                            ? "Nomor Induk Kependudukan penanggung jawab mitra."
                            : "Tersinkronisasi otomatis dengan database sistem UCH."}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold block">
                      Email Terdaftar
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

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold block">
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

                  <div className="space-y-2">
                    <Label htmlFor="prodi" className="text-xs font-bold block">
                      {isAdmin
                        ? "Unit Kerja / Divisi"
                        : isDosen
                          ? "Program Studi Pengampu"
                          : isUmum
                            ? "Institusi / Perusahaan"
                            : "Program Studi"}
                    </Label>
                    {isAdmin ? (
                      <Input
                        id="prodi"
                        value={formData.prodi}
                        readOnly
                        disabled
                        className="h-11 rounded-xl bg-muted/60"
                      />
                    ) : isUmum ? (
                      <Input
                        id="prodi"
                        value={formData.prodi}
                        onChange={(e) =>
                          setFormData({ ...formData, prodi: e.target.value })
                        }
                        placeholder="Nama instansi / lembaga Anda"
                        className="h-11 rounded-xl"
                      />
                    ) : (
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
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="faculty"
                      className="text-xs font-bold block"
                    >
                      {isAdmin
                        ? "Otoritas Lembaga"
                        : isDosen
                          ? "Fakultas Homebase"
                          : isUmum
                            ? "Kategori Kemitraan"
                            : "Fakultas"}
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
                    disabled={updateProfileMutation.isPending}
                    className="rounded-xl h-11 px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Academic, Affiliations, or Privileges */}
        {activeTab === "academic" && (
          <div className="space-y-4 sm:space-y-6">
            <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-md bg-white dark:bg-zinc-900">
              <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-border/60">
                <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                  {isAdmin
                    ? "Hak Akses & Otoritas Sistem"
                    : isDosen
                      ? "Afiliasi Akademik & Laboratorium Riset"
                      : isUmum
                        ? "Profil Kemitraan & Perusahaan"
                        : "Afiliasi Organisasi & Komunitas Kampus"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {isAdmin
                    ? "Tingkat kewenangan operasional dan izin pengelolaan fasilitas UTY Creative Hub pada akun ini."
                    : isDosen
                      ? "Laboratorium, kelompok keahlian, dan unit penelitian yang terhubung dengan akun dosen Anda."
                      : isUmum
                        ? "Informasi kemitraan eksternal atau badan usaha dalam pemanfaatan fasilitas kampus."
                        : "Daftar organisasi mahasiswa atau kelompok riset yang Anda wakili saat meminjam fasilitas UCH."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
                {isAdmin ? (
                  <>
                    <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground">
                            Superuser Fasilitas & Persetujuan Reservasi
                          </h4>
                          <Badge className="text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-none">
                            Full Access
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Kewenangan penuh menyetujui jadwal, membatalkan sepihak, dan membuka slot khusus fasilitas.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground">
                            Manajemen Akun & Validasi Civitas
                          </h4>
                          <Badge className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-none">
                            Administrator
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Audit pengguna sistem, verifikasi berkas dosen & mahasiswa, serta penugasan peran manajerial.
                        </p>
                      </div>
                    </div>
                  </>
                ) : isDosen ? (
                  <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">
                          Laboratorium Rekayasa Perangkat Lunak & Sistem Cerdas
                        </h4>
                        <Badge className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-none">
                          Dosen Pembina
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pusat riset kolaboratif dan asistensi tugas akhir mahasiswa FST UTY.
                      </p>
                    </div>
                  </div>
                ) : isUmum ? (
                  <div className="p-4 rounded-2xl border border-border/60 bg-slate-50/70 dark:bg-zinc-800/40 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">
                          Kemitraan Komunitas & Industri Kreatif
                        </h4>
                        <Badge className="text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-none">
                          Mitra Terdaftar
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Status kerja sama resmi pemanfaatan coworking space dan auditorium kampus.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Booking Stats */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                {isAdmin ? "Total Fasilitas Dikelola" : "Total Reservasi"}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                {isAdmin ? "12 Ruangan" : "8 Kali"}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                {isAdmin ? "Semua ruangan aktif beroperasi" : "Semua kegiatan terselenggara"}
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                {isAdmin ? "Permohonan Masuk" : "Total Jam Fasilitas"}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-blue-400 block">
                {isAdmin ? "48 Berkas" : "24 Jam"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
                {isAdmin ? "Periode semester berjalan" : "Rata-rata 3 jam per sesi"}
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                {isAdmin ? "Tingkat Okupansi" : "Tingkat Kehadiran"}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground block">
                {isAdmin ? "85%" : "100%"}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                {isAdmin ? "Kategori jam produktif kampus" : "Tanpa pembatalan mendadak"}
              </span>
            </Card>

            <Card className="rounded-2xl border border-border/70 p-5 bg-white dark:bg-zinc-900 shadow-xs">
              <span className="text-xs font-semibold text-muted-foreground block mb-1">
                {isAdmin ? "Status Server & API" : "Ruangan Favorit"}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-foreground truncate block">
                {isAdmin ? "Optimal (100%)" : "Think Tank"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
                {isAdmin ? "Koneksi backend & DB stabil" : "5 kali peminjaman"}
              </span>
            </Card>
          </div>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === "security" && (
          <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-md bg-white dark:bg-zinc-900">
            <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-border/60">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                Keamanan Akun & Ubah Kata Sandi
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Perbarui kata sandi akun Anda untuk menjaga keamanan akses
                sistem UTY Creative Hub.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-6 max-w-xl"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="oldPassword"
                    className="text-xs font-bold block"
                  >
                    Kata Sandi Saat Ini
                  </Label>
                  <PasswordInput
                    id="oldPassword"
                    placeholder="••••••••"
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      updatePassword("oldPassword", e.target.value)
                    }
                    required
                    disabled={changePasswordMutation.isPending}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-xs font-bold block"
                  >
                    Kata Sandi Baru (Min. 6 Karakter)
                  </Label>
                  <PasswordInput
                    id="newPassword"
                    placeholder="Minimal 6 karakter"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      updatePassword("newPassword", e.target.value)
                    }
                    required
                    minLength={6}
                    disabled={changePasswordMutation.isPending}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold block"
                  >
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder="Ulangi kata sandi baru"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      updatePassword("confirmPassword", e.target.value)
                    }
                    required
                    minLength={6}
                    disabled={changePasswordMutation.isPending}
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="rounded-xl px-6 h-11 font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Perbarui Kata Sandi</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
