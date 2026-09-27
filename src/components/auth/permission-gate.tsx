"use client";

import type React from "react";
import { type PermissionKey, usePermission } from "@/hooks/use-permission";

interface CanProps {
  permission?: PermissionKey;
  anyPermissions?: PermissionKey[];
  allPermissions?: PermissionKey[];
  role?: "admin" | "dosen" | "mahasiswa" | "umum";
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component to conditionally render children based on PBAC permissions and user role
 */
export function Can({
  permission,
  anyPermissions,
  allPermissions,
  role,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, canAll, userRole, isAdmin } = usePermission();

  // Role check
  if (role && !isAdmin && userRole !== role) {
    return <>{fallback}</>;
  }

  // Single permission check
  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  // Any permissions check
  if (
    anyPermissions &&
    anyPermissions.length > 0 &&
    !canAny(...anyPermissions)
  ) {
    return <>{fallback}</>;
  }

  // All permissions check
  if (
    allPermissions &&
    allPermissions.length > 0 &&
    !canAll(...allPermissions)
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export const PermissionGate = Can;
