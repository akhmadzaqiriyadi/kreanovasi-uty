"use client";

import { AlertCircle, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginFormLogic } from "../hooks/use-login-form-logic";

export function LoginForm() {
  const { register, handleSubmit, errors, rootError, isSubmitting } =
    useLoginFormLogic();

  return (
    <div className="glass-panel border-border/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          Selamat Datang Kembali
        </h1>
        <p className="text-muted-foreground text-sm">
          Masuk ke akun UCH Web App Anda untuk melanjutkan.
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all duration-300 gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          <span>Masuk</span>
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-muted-foreground text-xs">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
