"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/auth-context";

/**
 * Standard Granular PBAC Permission Identifiers supported by the system
 */
export const PERMISSIONS = {
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  ROLES_READ: "roles:read",
  ROLES_MANAGE: "roles:manage",
  AUDIT_READ: "audit:read",
  UPLOADS_CREATE: "uploads:create",
} as const;

export type PermissionKey =
  | (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
  | (string & {});

/**
 * Hook to inspect and verify user roles and granular PBAC permissions
 */
export function usePermission() {
  const { user, isLoggedIn } = useAuth();

  return useMemo(() => {
    const role = user?.role;
    const permissions = new Set(user?.permissions || []);
    const isAdmin = Boolean(isLoggedIn && role === "admin");
    const isCivitas = Boolean(
      isLoggedIn && (role === "mahasiswa" || role === "dosen"),
    );

    /**
     * Check if current user has a specific permission
     * Admins automatically possess all permissions
     */
    const can = (permission: PermissionKey): boolean => {
      if (!isLoggedIn || !user) return false;
      if (isAdmin) return true;
      return permissions.has(permission);
    };

    /**
     * Check if user possesses AT LEAST ONE of the specified permissions
     */
    const canAny = (...perms: PermissionKey[]): boolean => {
      if (!isLoggedIn || !user) return false;
      if (isAdmin) return true;
      return perms.some((p) => permissions.has(p));
    };

    /**
     * Check if user possesses ALL specified permissions
     */
    const canAll = (...perms: PermissionKey[]): boolean => {
      if (!isLoggedIn || !user) return false;
      if (isAdmin) return true;
      return perms.every((p) => permissions.has(p));
    };

    return {
      can,
      canAny,
      canAll,
      isAdmin,
      isCivitas,
      userRole: role,
      permissions: Array.from(permissions),
    };
  }, [user, isLoggedIn]);
}
