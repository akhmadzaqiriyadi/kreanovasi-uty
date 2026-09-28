"use client";

import { useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AUTH_QUERY_KEYS,
  mapBackendUserToProfile,
  useCurrentUserQuery,
  useLogoutMutation,
} from "@/hooks/use-auth-mutations";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  isJwtExpired,
  setLocalTokens,
  tryRefreshToken,
} from "@/lib/api-client";
import type { UserProfile } from "@/types/auth";

export type { UserProfile };

export const defaultUser: UserProfile = {
  name: "Akhmad Zaqi Riyadi",
  email: "zaqi@students.uty.ac.id",
  role: "mahasiswa",
  roleLabel: "Mahasiswa Aktif",
  idNumber: "5210411234",
  idLabel: "NPM",
  npm: "5210411234",
  affiliation: "UTY Yogyakarta",
  prodi: "Informatika",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  can: (permission: string) => boolean;
  canAny: (...permissions: string[]) => boolean;
  user: UserProfile | null;
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  isAuthLoading: boolean;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: "login" | "register") => void;
  login: (userData?: Partial<UserProfile>) => void;
  register: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  setSessionUser: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );
  const queryClient = useQueryClient();

  // Query profile from backend if access token exists
  const {
    data: backendUser,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useCurrentUserQuery();

  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      setUser(null);
      try {
        localStorage.removeItem("uch_user_profile");
      } catch {
        // ignore
      }
    },
  });

  // Proactive session restore on mount:
  // If user enters app with an existing refresh token, verify and refresh token silently so they don't have to re-login
  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = getLocalAccessToken();
      const refreshToken = getLocalRefreshToken();

      if (!refreshToken) return;

      // If access token is missing or expired, call refresh token endpoint
      if (!accessToken || isJwtExpired(accessToken)) {
        const newAccessToken = await tryRefreshToken();
        if (newAccessToken) {
          queryClient.invalidateQueries({
            queryKey: AUTH_QUERY_KEYS.currentUser,
          });
        } else {
          // Token is truly expired/revoked
          setUser(null);
          try {
            localStorage.removeItem("uch_user_profile");
          } catch {
            // ignore
          }
        }
      }
    };

    restoreSession();
  }, [queryClient]);

  // Handle expired or invalid token gracefully
  useEffect(() => {
    if (isProfileError) {
      const refreshToken = getLocalRefreshToken();
      if (refreshToken) {
        tryRefreshToken().then((newToken) => {
          if (newToken) {
            queryClient.invalidateQueries({
              queryKey: AUTH_QUERY_KEYS.currentUser,
            });
          } else {
            setUser(null);
            setLocalTokens(null, null);
            try {
              localStorage.removeItem("uch_user_profile");
            } catch {
              // ignore
            }
          }
        });
      } else {
        setUser(null);
        setLocalTokens(null, null);
        try {
          localStorage.removeItem("uch_user_profile");
        } catch {
          // ignore
        }
      }
    }
  }, [isProfileError, queryClient]);

  // Restore cached user profile or sync with backend user query
  useEffect(() => {
    if (backendUser) {
      const mapped = mapBackendUserToProfile(backendUser);
      setUser(mapped);
      try {
        localStorage.setItem("uch_user_profile", JSON.stringify(mapped));
      } catch {
        // ignore
      }
    } else {
      const token = getLocalAccessToken();
      const refreshToken = getLocalRefreshToken();
      if (token || refreshToken) {
        try {
          const cached = localStorage.getItem("uch_user_profile");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.email === "admin@gozaq.com" || parsed.role === "admin") {
              parsed.role = "admin";
              parsed.roleLabel = "System Administrator";
              parsed.idLabel = "Admin ID";
              parsed.npm = undefined;
              parsed.prodi = "Unit Manajemen Sistem";
              parsed.affiliation = "Pengelola UTY Creative Hub";
            }
            setUser(parsed);
          }
        } catch {
          // ignore
        }
      } else {
        setUser(null);
      }
    }
  }, [backendUser]);

  const isLoggedIn = Boolean(
    user && (getLocalAccessToken() || getLocalRefreshToken()),
  );
  const isAdmin = Boolean(isLoggedIn && user?.role === "admin");

  const can = (permission: string): boolean => {
    if (!isLoggedIn || !user) return false;
    if (isAdmin) return true;
    return Boolean(user.permissions?.includes(permission));
  };

  const canAny = (...perms: string[]): boolean => {
    if (!isLoggedIn || !user) return false;
    if (isAdmin) return true;
    return perms.some((p) => user.permissions?.includes(p));
  };

  const openLoginModal = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const setSessionUser = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      try {
        localStorage.setItem("uch_user_profile", JSON.stringify(profile));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem("uch_user_profile");
      } catch {
        // ignore
      }
    }
  };

  const login = (userData?: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...defaultUser,
      ...userData,
    };
    setSessionUser(updatedUser);
    setAuthModalOpen(false);
  };

  const register = (userData: Partial<UserProfile>) => {
    const isNonCivitas = userData.role === "umum";
    const newUser: UserProfile = {
      name: userData.name || "Pengguna Baru",
      email: userData.email || "user@example.com",
      role: userData.role || "umum",
      roleLabel: isNonCivitas ? "Non-Civitas / Mitra Luar" : "Civitas Kampus",
      idNumber: userData.idNumber || "3404000000000001",
      idLabel: isNonCivitas ? "NIK / KTP" : "NPM / NIDN",
      affiliation:
        userData.affiliation ||
        (isNonCivitas ? "Umum / Komunitas Luar" : "UTY"),
      prodi:
        userData.prodi || (isNonCivitas ? "Mitra Eksternal" : "Informatika"),
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };
    setSessionUser(newUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        can,
        canAny,
        user,
        authModalOpen,
        authModalTab,
        isAuthLoading: isProfileLoading || logoutMutation.isPending,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        setAuthModalTab,
        login,
        register,
        logout,
        setSessionUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
