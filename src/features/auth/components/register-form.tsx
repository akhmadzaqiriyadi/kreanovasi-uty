"use client";

import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterFormLogic } from "../hooks/use-register-form-logic";

export function RegisterForm() {
  const { register, handleSubmit, errors, rootError, isSubmitting, isSuccess } =
    useRegisterFormLogic();

  if (isSuccess) {
    return (
      <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <UserPlus className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            Akun Berhasil Dibuat!
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Registrasi sukses dilakukan. Anda sekarang dapat menggunakan akun
            ini untuk masuk.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-primary/35 transition-all duration-300"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-gradient-primary">
          Daftar Akun Baru
        </h1>
        <p className="text-muted-foreground text-sm">
          Buat akun UCH Web App baru Anda secara cepat.
        </p>
      </div>

      {rootError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 flex items-center gap-2 mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{rootError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className={
              errors.name
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            {...register("email")}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={
              errors.password
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={
              errors.confirmPassword
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          <span>Daftar</span>
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-muted-foreground text-xs">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
