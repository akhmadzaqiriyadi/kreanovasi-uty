"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import apiClient, {
  getLocalAccessToken,
  setLocalTokens,
} from "@/lib/api-client";
import type {
  ApiEnvelope,
  BackendAuthResponse,
  BackendUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/auth";

export const AUTH_QUERY_KEYS = {
  currentUser: ["currentUser"] as const,
};

// Helper: Transform backend user entity to UI UserProfile
export function mapBackendUserToProfile(
  user: BackendUser,
  meta?: { idNumber?: string; affiliation?: string; prodi?: string },
): UserProfile {
  const isAdmin = user.role === "admin" || user.role === "owner";
  const isDosen = user.role === "manager" || user.role === "dosen";
  const isUmum = user.role === "umum";
  const role: "mahasiswa" | "dosen" | "umum" | "admin" = isAdmin
    ? "admin"
    : isDosen
      ? "dosen"
      : isUmum
        ? "umum"
        : "mahasiswa";

  const rawIdNumber = meta?.idNumber || user.id_number || "";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    roleLabel: isAdmin
      ? "System Administrator"
      : isDosen
        ? "Dosen / Tenaga Pendidik"
        : isUmum
          ? "Non-Civitas / Mitra"
          : "Mahasiswa Aktif UTY",
    idNumber: rawIdNumber,
    idLabel: isAdmin
      ? "Admin ID"
      : isUmum
        ? "NIK KTP"
        : isDosen
          ? "NIDN / NIK"
          : "NPM",
    npm: !isUmum && !isAdmin ? rawIdNumber || undefined : undefined,
    affiliation:
      meta?.affiliation ||
      user.affiliation ||
      (isAdmin
        ? "Pengelola UTY Creative Hub"
        : "Universitas Teknologi Yogyakarta"),
    prodi:
      meta?.prodi ||
      user.affiliation ||
      (isAdmin ? "Unit Manajemen Sistem" : "Informatika"),
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    permissions: user.permissions || [],
  };
}

// 1. Hook for User Login Mutation
export function useLoginMutation(options?: {
  onSuccess?: (data: BackendAuthResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await apiClient.post<ApiEnvelope<BackendAuthResponse>>(
        "/auth/login",
        payload,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data) {
        setLocalTokens(data.access_token, data.refresh_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data.user);
        queryClient.invalidateQueries({
          queryKey: AUTH_QUERY_KEYS.currentUser,
        });
        toast.success("Berhasil Masuk", {
          description: `Selamat datang kembali, ${data.user.name}!`,
        });
        options?.onSuccess?.(data);
      }
    },
    onError: (error: unknown) => {
      let message = "Gagal masuk. Periksa kembali email dan kata sandi Anda.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error("Gagal Masuk", { description: message });
      options?.onError?.(error);
    },
  });
}

// 2. Hook for User Registration Mutation
export function useRegisterMutation(options?: {
  onSuccess?: (data: BackendAuthResponse) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await apiClient.post<ApiEnvelope<BackendAuthResponse>>(
        "/auth/register",
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role || "user",
          id_number: payload.id_number,
          affiliation: payload.affiliation,
        },
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data) {
        setLocalTokens(data.access_token, data.refresh_token);
        queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data.user);
        queryClient.invalidateQueries({
          queryKey: AUTH_QUERY_KEYS.currentUser,
        });
        toast.success("Pendaftaran Berhasil", {
          description: `Akun Anda telah berhasil didaftarkan di UTY Creative Hub!`,
        });
        options?.onSuccess?.(data);
      }
    },
    onError: (error: unknown) => {
      let message = "Gagal mendaftar. Silakan coba beberapa saat lagi.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error("Pendaftaran Gagal", { description: message });
      options?.onError?.(error);
    },
  });
}

// 3. Hook for User Logout Mutation
export function useLogoutMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/auth/logout");
      } catch {
        // Continue local logout even if server endpoint fails
      }
    },
    onSettled: () => {
      setLocalTokens(null, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.currentUser });
      queryClient.clear();
      toast.info("Berhasil Keluar", {
        description: "Sesi akun Anda telah diakhiri.",
      });
      options?.onSuccess?.();
    },
  });
}

// 4. Hook for Current User Profile Query
export function useCurrentUserQuery() {
  const token = getLocalAccessToken();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: async () => {
      const response =
        await apiClient.get<ApiEnvelope<BackendUser>>("/auth/profile");
      return response.data.data;
    },
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });
}

// 5. Hook for Update Profile Mutation
export function useUpdateProfileMutation(options?: {
  onSuccess?: (data: BackendUser) => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await apiClient.put<ApiEnvelope<BackendUser>>(
        "/auth/profile",
        payload,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, data);
        queryClient.invalidateQueries({
          queryKey: AUTH_QUERY_KEYS.currentUser,
        });
        toast.success("Profil Diperbarui", {
          description: "Perubahan data profil Anda berhasil disimpan.",
        });
        options?.onSuccess?.(data);
      }
    },
    onError: (error: unknown) => {
      let message = "Gagal memperbarui profil.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error("Gagal Memperbarui Profil", { description: message });
      options?.onError?.(error);
    },
  });
}

// 6. Hook for Change Password Mutation
export function useChangePasswordMutation(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await apiClient.put<ApiEnvelope<null>>(
        "/auth/password",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kata Sandi Berhasil Diubah", {
        description: "Kata sandi akun Anda telah berhasil diperbarui.",
      });
      options?.onSuccess?.();
    },
    onError: (error: unknown) => {
      let message = "Gagal mengubah kata sandi.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error("Gagal Mengubah Kata Sandi", { description: message });
      options?.onError?.(error);
    },
  });
}
