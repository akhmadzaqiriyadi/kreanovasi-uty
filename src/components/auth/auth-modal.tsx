"use client";

import {
  GraduationCap,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  mapBackendUserToProfile,
  useLoginMutation,
  useRegisterMutation,
} from "@/hooks/use-auth-mutations";
import { studyPrograms } from "@/hooks/use-new-booking-form";
import { cn } from "@/lib/utils";

interface LoginFormState {
  email: string;
  password: string;
}

interface RegisterFormState {
  role: "mahasiswa" | "dosen" | "umum";
  name: string;
  email: string;
  idNumber: string;
  affiliation: string;
  password: string;
}

const INITIAL_LOGIN_FORM: LoginFormState = {
  email: "",
  password: "",
};

const INITIAL_REGISTER_FORM: RegisterFormState = {
  role: "mahasiswa",
  name: "",
  email: "",
  idNumber: "",
  affiliation: "",
  password: "",
};

export function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    setAuthModalTab,
    setSessionUser,
  } = useAuth();

  // Consolidated form states
  const [loginForm, setLoginForm] = useState<LoginFormState>(INITIAL_LOGIN_FORM);
  const [registerForm, setRegisterForm] =
    useState<RegisterFormState>(INITIAL_REGISTER_FORM);

  const updateLoginForm = (field: keyof LoginFormState, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRegisterForm = <K extends keyof RegisterFormState>(
    field: K,
    value: RegisterFormState[K],
  ) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  // TanStack Query Mutations
  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      const profile = mapBackendUserToProfile(data.user);
      setSessionUser(profile);
      closeAuthModal();
      setLoginForm(INITIAL_LOGIN_FORM);
    },
  });

  const registerMutation = useRegisterMutation({
    onSuccess: (data) => {
      const profile = mapBackendUserToProfile(data.user, {
        idNumber: registerForm.idNumber,
        affiliation: registerForm.affiliation,
        prodi: registerForm.affiliation,
      });
      setSessionUser(profile);
      closeAuthModal();
      setRegisterForm(INITIAL_REGISTER_FORM);
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      toast.error("Form Belum Lengkap", {
        description: "Silakan masukkan email dan kata sandi Anda.",
      });
      return;
    }

    loginMutation.mutate({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerForm.name.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim()
    ) {
      toast.error("Form Belum Lengkap", {
        description: "Nama, email, dan kata sandi wajib diisi.",
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error("Kata Sandi Terlalu Pendek", {
        description: "Kata sandi minimal 6 karakter.",
      });
      return;
    }

    registerMutation.mutate({
      name: registerForm.name.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
      role: registerForm.role,
      id_number: registerForm.idNumber.trim(),
      affiliation: registerForm.affiliation.trim(),
    });
  };

  return (
    <Dialog
      open={authModalOpen}
      onOpenChange={(open) => !open && closeAuthModal()}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header Branding */}
        <div className="p-6 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-extrabold text-xs tracking-wider uppercase text-white/90">
                UTY Creative Hub
              </span>
            </div>

            <DialogTitle className="text-xl font-extrabold text-white">
              {authModalTab === "login"
                ? "Masuk ke Akun Anda"
                : "Pendaftaran Akun Baru"}
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs">
              {authModalTab === "login"
                ? "Akses dashboard peminjaman ruangan dan fasilitas kreatif kampus."
                : "Terbuka untuk civitas akademika kampus maupun pengguna umum / non-civitas."}
            </DialogDescription>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-4 bg-background">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60">
            <button
              type="button"
              onClick={() => setAuthModalTab("login")}
              className={cn(
                "inline-flex items-center justify-center h-9 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
                authModalTab === "login"
                  ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthModalTab("register")}
              className={cn(
                "inline-flex items-center justify-center h-9 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
                authModalTab === "register"
                  ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Daftar Akun</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6 pt-1">
          {authModalTab === "login" ? (
            /* --- TAB MASUK --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginId" className="text-xs font-bold block">
                  Email Akun
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="loginId"
                    type="email"
                    placeholder="nama@students.uty.ac.id atau emailanda@gmail.com"
                    value={loginForm.email}
                    onChange={(e) => updateLoginForm("email", e.target.value)}
                    required
                    disabled={loginMutation.isPending}
                    className="pl-9 h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPass" className="text-xs font-bold block">
                  Kata Sandi
                </Label>
                <PasswordInput
                  id="loginPass"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => updateLoginForm("password", e.target.value)}
                  required
                  disabled={loginMutation.isPending}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-10 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Masuk...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk Sekarang</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthModalTab("register")}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Belum punya akun?{" "}
                  <span className="font-bold text-primary dark:text-blue-400 underline">
                    Daftar di sini
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* --- TAB DAFTAR (Civitas & Non-Civitas) --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Pilihan Kategori Pendaftar */}
              <div className="space-y-2">
                <Label className="text-xs font-bold block">
                  Kategori Pendaftar
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateRegisterForm("role", "mahasiswa")}
                    disabled={registerMutation.isPending}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      registerForm.role === "mahasiswa"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px]">Mahasiswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateRegisterForm("role", "dosen")}
                    disabled={registerMutation.isPending}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      registerForm.role === "dosen"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[10px]">Dosen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateRegisterForm("role", "umum")}
                    disabled={registerMutation.isPending}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      registerForm.role === "umum"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-[10px]">Non-Civitas</span>
                  </button>
                </div>
                {registerForm.role === "umum" && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    * Pendaftaran terbuka untuk umum, startup, & mitra luar
                    kampus.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="regName" className="text-xs font-bold block">
                  Nama Lengkap
                </Label>
                <Input
                  id="regName"
                  placeholder="Nama lengkap sesuai KTP / Identitas"
                  value={registerForm.name}
                  onChange={(e) => updateRegisterForm("name", e.target.value)}
                  required
                  disabled={registerMutation.isPending}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regEmail" className="text-xs font-bold block">
                  Email Aktif
                </Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder={
                    registerForm.role === "umum"
                      ? "emailanda@gmail.com"
                      : "nama@students.uty.ac.id"
                  }
                  value={registerForm.email}
                  onChange={(e) => updateRegisterForm("email", e.target.value)}
                  required
                  disabled={registerMutation.isPending}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="regId" className="text-xs font-bold block">
                    {registerForm.role === "umum"
                      ? "NIK KTP"
                      : registerForm.role === "dosen"
                        ? "NIDN / NIK"
                        : "NPM"}
                  </Label>
                  <Input
                    id="regId"
                    placeholder={
                      registerForm.role === "umum"
                        ? "16 digit NIK"
                        : registerForm.role === "dosen"
                          ? "NIDN Dosen"
                          : "10 digit NPM"
                    }
                    value={registerForm.idNumber}
                    onChange={(e) =>
                      updateRegisterForm("idNumber", e.target.value)
                    }
                    disabled={registerMutation.isPending}
                    className="h-10 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="regAffiliation"
                    className="text-xs font-bold block"
                  >
                    {registerForm.role === "umum"
                      ? "Asal Instansi"
                      : "Program Studi"}
                  </Label>
                  {registerForm.role === "umum" ? (
                    <Input
                      id="regAffiliation"
                      placeholder="Nama Komunitas / PT"
                      value={registerForm.affiliation}
                      onChange={(e) =>
                        updateRegisterForm("affiliation", e.target.value)
                      }
                      disabled={registerMutation.isPending}
                      className="h-10 rounded-xl text-xs"
                    />
                  ) : (
                    <Select
                      value={registerForm.affiliation || undefined}
                      onValueChange={(val) =>
                        updateRegisterForm("affiliation", val)
                      }
                      disabled={registerMutation.isPending}
                    >
                      <SelectTrigger
                        id="regAffiliation"
                        className="h-10 rounded-xl text-xs bg-white dark:bg-zinc-900 border-input"
                      >
                        <SelectValue placeholder="Pilih Program Studi" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl max-h-60">
                        {studyPrograms.map((p) => (
                          <SelectItem key={p} value={p} className="text-xs">
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regPassword" className="text-xs font-bold block">
                  Kata Sandi Baru (Min. 6 Karakter)
                </Label>
                <PasswordInput
                  id="regPassword"
                  placeholder="Minimal 6 karakter"
                  value={registerForm.password}
                  onChange={(e) =>
                    updateRegisterForm("password", e.target.value)
                  }
                  required
                  minLength={6}
                  disabled={registerMutation.isPending}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-10 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mendaftarkan Akun...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Sekarang</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
