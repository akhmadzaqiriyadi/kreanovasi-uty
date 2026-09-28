"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import type { ApiEnvelope, BackendUser } from "@/types/auth";

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface AdminUsersResponse {
  users: BackendUser[];
  meta: PaginationMeta;
}

export interface RoleItem {
  id: string;
  name: string;
  description?: string;
  permissions: { id: string; name: string }[];
}

export interface PermissionItem {
  id: string;
  name: string;
  description?: string;
}

export interface AuditLogItem {
  id: string;
  user_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogsResponse {
  logs: AuditLogItem[];
  meta: PaginationMeta;
}

export interface SystemHealthData {
  status: string;
  environment: string;
  build: {
    version: string;
    git_commit: string;
    build_time: string;
  };
  uptime: string;
  uptime_seconds: number;
  system: {
    go_version: string;
    goroutines: number;
    memory_alloc: string;
    memory_sys: string;
    gc_cycles: number;
    cpu_cores: number;
  };
  dependencies: {
    database: {
      status: string;
      type: string;
      latency_ms: number;
      total_conns: number;
      acquired_conns: number;
      idle_conns: number;
      max_conns: number;
    };
    cache: {
      status: string;
      type: string;
      latency_ms: number;
    };
  };
}

export const ADMIN_QUERY_KEYS = {
  users: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => ["admin", "users", params] as const,
  roles: ["admin", "roles"] as const,
  permissions: ["admin", "permissions"] as const,
  auditLogs: (page?: number, limit?: number) =>
    ["admin", "auditLogs", page, limit] as const,
  systemHealth: ["admin", "systemHealth"] as const,
};

/**
 * Hook to fetch paginated users list for admin user management
 */
export function useAdminUsersQuery(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(params),
    queryFn: async () => {
      const response = await apiClient.get<ApiEnvelope<AdminUsersResponse>>(
        "/users",
        {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            search: params?.search || undefined,
            role:
              params?.role && params.role !== "all" ? params.role : undefined,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch roles with their granular permissions
 */
export function useAdminRolesQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.roles,
    queryFn: async () => {
      const response = await apiClient.get<ApiEnvelope<RoleItem[]>>("/roles");
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch all system permission definitions
 */
export function useAdminPermissionsQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.permissions,
    queryFn: async () => {
      const response =
        await apiClient.get<ApiEnvelope<PermissionItem[]>>("/permissions");
      return response.data.data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch paginated audit activity logs
 */
export function useAdminAuditLogsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.auditLogs(page, limit),
    queryFn: async () => {
      const response = await apiClient.get<ApiEnvelope<AuditLogsResponse>>(
        "/audit-logs",
        {
          params: { page, limit },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 15,
  });
}

/**
 * Hook to fetch live system health and infrastructure metrics
 */
export function useSystemHealthQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.systemHealth,
    queryFn: async () => {
      // Direct call to /healthz (root health endpoint)
      const res = await axios
        .get<ApiEnvelope<SystemHealthData>>("/healthz", {
          baseURL: process.env.NEXT_PUBLIC_SITE_URL || "",
          headers: { Accept: "application/json" },
        })
        .catch(async () => {
          // Fallback directly to proxy or localhost:8080 if running in browser
          return axios.get<ApiEnvelope<SystemHealthData>>(
            "http://localhost:8080/healthz",
          );
        });
      return res.data.data;
    },
    refetchInterval: 10000, // Auto refresh every 10 seconds
    staleTime: 5000,
  });
}

/**
 * Mutation: Update user role (e.g. from mahasiswa to dosen or admin)
 */
export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiClient.put<ApiEnvelope<BackendUser>>(
        `/users/${userId}/role`,
        { role },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Role pengguna berhasil diubah menjadi "${variables.role}"!`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "auditLogs"] });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal memperbarui role pengguna";
      toast.error(msg);
    },
  });
}

export interface UpdateUserPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  id_number?: string;
  affiliation?: string;
  is_verified?: boolean;
}

/**
 * Mutation: Full update of user information by administrator
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const { userId, ...data } = payload;
      const response = await apiClient.put<ApiEnvelope<BackendUser>>(
        `/users/${userId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Data pengguna "${variables.name}" berhasil diperbarui!`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "auditLogs"] });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal memperbarui data pengguna";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Delete or deactivate user
 */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete<ApiEnvelope<unknown>>(
        `/users/${userId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pengguna berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "auditLogs"] });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal menghapus pengguna";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Assign a permission to a role
 */
export function useAssignPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => {
      const response = await apiClient.post<ApiEnvelope<unknown>>(
        `/roles/${roleId}/permissions/${permissionId}`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Izin "${variables.permissionId}" berhasil diberikan ke role "${variables.roleId}"`,
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal memberikan izin ke role";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Revoke a permission from a role
 */
export function useRevokePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => {
      const response = await apiClient.delete<ApiEnvelope<unknown>>(
        `/roles/${roleId}/permissions/${permissionId}`,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Izin "${variables.permissionId}" dicabut dari role "${variables.roleId}"`,
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal mencabut izin dari role";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Create a new user from Admin Dashboard
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password?: string;
      role: string;
      id_number?: string;
      affiliation?: string;
    }) => {
      const response = await apiClient.post<ApiEnvelope<BackendUser>>(
        "/users",
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        `Pengguna "${data.data?.name || "Baru"}" berhasil ditambahkan!`,
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "auditLogs"] });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal menambahkan pengguna baru";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Create a new custom role
 */
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      name: string;
      description?: string;
    }) => {
      const response = await apiClient.post<ApiEnvelope<unknown>>(
        "/roles",
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Role baru "${variables.name}" berhasil dibuat!`);
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal membuat role baru";
      toast.error(msg);
    },
  });
}

/**
 * Mutation: Delete a custom role
 */
export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const response = await apiClient.delete<ApiEnvelope<unknown>>(
        `/roles/${roleId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Role berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.roles });
    },
    onError: (error) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Gagal menghapus role";
      toast.error(msg);
    },
  });
}
