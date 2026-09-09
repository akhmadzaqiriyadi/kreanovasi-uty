"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";
import apiClient from "@/lib/api-client";
import {
  type ProfileFormInput,
  profileSchema,
} from "../schemas/profile.schema";

export function useProfileFormLogic() {
  const { user, refreshUser } = useAuth();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormInput) => {
    try {
      await apiClient.patch("auth/me", data);
      await refreshUser();
      toast.success("Profil Diperbarui", {
        description: "Nama dan email Anda berhasil diupdate.",
      });
    } catch (err) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const message =
        errorResponse.response?.data?.message || "Gagal memperbarui profil.";
      form.setError("root", { type: "server", message });
      toast.error("Pembaruan Gagal", { description: message });
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    rootError: form.formState.errors.root?.message,
  };
}
