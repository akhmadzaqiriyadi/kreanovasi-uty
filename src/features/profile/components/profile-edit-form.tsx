"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileFormLogic } from "../hooks/use-profile-form-logic";

export function ProfileEditForm() {
  const { register, handleSubmit, errors, isSubmitting, rootError } =
    useProfileFormLogic();

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
      {rootError && (
        <div className="p-3 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {rootError}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="profile-name"
          className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
        >
          Nama Lengkap
        </label>
        <Input
          id="profile-name"
          placeholder="Masukkan nama lengkap Anda"
          {...register("name")}
          className="glass-panel"
        />
        {errors.name && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="profile-email"
          className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
        >
          Alamat Email
        </label>
        <Input
          id="profile-email"
          type="email"
          placeholder="nama@email.com"
          {...register("email")}
          className="glass-panel"
        />
        {errors.email && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-bold"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
