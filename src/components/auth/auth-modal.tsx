"use client";

import {
  GraduationCap,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    setAuthModalTab,
    login,
    register,
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regRole, setRegRole] = useState<"mahasiswa" | "dosen" | "umum">(
    "mahasiswa",
  );
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regIdNumber, setRegIdNumber] = useState("");
  const [regAffiliation, setRegAffiliation] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      email: loginIdentifier || "zaqi@students.uty.ac.id",
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name:
        regName ||
        (regRole === "umum" ? "Mitra Non-Civitas" : "Civitas Kampus"),
      email: regEmail || "user@example.com",
      role: regRole,
      idNumber:
        regIdNumber || (regRole === "umum" ? "3404123456780001" : "5210411234"),
      affiliation:
        regAffiliation ||
        (regRole === "umum"
          ? "Komunitas Kreatif Jogja"
          : "Fakultas Sains & Teknologi"),
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
        <div className="p-4 pb-0 bg-background">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60">
            <button
              type="button"
              onClick={() => setAuthModalTab("login")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                authModalTab === "login"
                  ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthModalTab("register")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                authModalTab === "register"
                  ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 pt-4 bg-background">
          {authModalTab === "login" ? (
            /* --- TAB MASUK --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="loginId" className="text-xs font-bold">
                  Email atau Nomor Identitas (NPM / NIK)
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="loginId"
                    type="text"
                    placeholder="nama@email.com atau 5210411xxx"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="pl-9 h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="loginPass" className="text-xs font-bold">
                  Kata Sandi
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="loginPass"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9 h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs cursor-pointer shadow-md"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Masuk Sekarang
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
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Pilihan Kategori Pendaftar */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold block">
                  Kategori Pendaftar
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRegRole("mahasiswa")}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      regRole === "mahasiswa"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px]">Mahasiswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole("dosen")}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      regRole === "dosen"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[10px]">Dosen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole("umum")}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1",
                      regRole === "umum"
                        ? "border-primary bg-primary/10 text-primary dark:text-blue-300 font-bold"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-[10px]">Non-Civitas</span>
                  </button>
                </div>
                {regRole === "umum" && (
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    * Pendaftaran terbuka untuk umum, startup, & mitra luar
                    kampus.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="regName" className="text-xs font-bold">
                  Nama Lengkap
                </Label>
                <Input
                  id="regName"
                  placeholder="Nama lengkap sesuai KTP / Identitas"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="regEmail" className="text-xs font-bold">
                  Email Aktif
                </Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder={
                    regRole === "umum"
                      ? "emailanda@gmail.com"
                      : "nama@students.uty.ac.id"
                  }
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="regId" className="text-xs font-bold">
                    {regRole === "umum"
                      ? "NIK KTP"
                      : regRole === "dosen"
                        ? "NIDN / NIK"
                        : "NPM"}
                  </Label>
                  <Input
                    id="regId"
                    placeholder={
                      regRole === "umum"
                        ? "16 digit NIK"
                        : regRole === "dosen"
                          ? "NIDN Dosen"
                          : "10 digit NPM"
                    }
                    value={regIdNumber}
                    onChange={(e) => setRegIdNumber(e.target.value)}
                    className="h-9 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="regAffiliation" className="text-xs font-bold">
                    {regRole === "umum" ? "Asal Instansi" : "Program Studi"}
                  </Label>
                  <Input
                    id="regAffiliation"
                    placeholder={
                      regRole === "umum"
                        ? "Nama Komunitas / PT"
                        : "Contoh: Informatika"
                    }
                    value={regAffiliation}
                    onChange={(e) => setRegAffiliation(e.target.value)}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="regPassword" className="text-xs font-bold">
                  Kata Sandi Baru
                </Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs cursor-pointer shadow-md"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Daftar Sekarang
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
