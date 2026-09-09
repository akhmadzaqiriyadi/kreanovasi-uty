"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import apiClient, { setLocalAccessToken } from "@/lib/api-client";
import { type RegisterInput, registerSchema } from "../schemas/auth.schema";
import { useAuth } from "./use-auth";

export function useRegisterFormLogic() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await apiClient.post("auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken } = response.data;

      // Simulate session cookie and token setting for mock registration session activation
      if (typeof window !== "undefined") {
        document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie =
          "session_active=true; path=/; max-age=604800; SameSite=Lax";
      }
      setLocalAccessToken(accessToken);

      // Refresh the context to load the newly registered user's profile details
      await refreshUser();

      toast.success("Pendaftaran Berhasil!", {
        description: "Akun Anda berhasil dibuat. Mengalihkan ke onboarding...",
      });

      router.push("/dashboard/welcome");
    } catch (err) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const message =
        errorResponse.response?.data?.message ??
        "Registrasi gagal. Silakan coba lagi.";
      form.setError("root", { type: "server", message });
      toast.error("Registrasi Gagal", { description: message });
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    isSuccess: form.formState.isSubmitSuccessful,
    rootError: form.formState.errors.root?.message,
  };
}
