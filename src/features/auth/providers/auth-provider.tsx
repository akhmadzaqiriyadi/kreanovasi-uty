"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { createContext, useEffect, useState } from "react";
import apiClient, { setLocalAccessToken } from "@/lib/api-client";
import type { LoginInput } from "../schemas/auth.schema";
import type { AuthSession, User } from "../types";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthSession>({
    user: null,
    accessToken: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Silent refresh on initial mount
  useEffect(() => {
    async function initializeSession() {
      try {
        // Verify if cookie is present (by querying /refresh)
        const response = await apiClient.post("auth/refresh");
        const { accessToken } = response.data;

        setLocalAccessToken(accessToken);

        // Fetch current profile
        const userResponse = await apiClient.get("auth/me");
        setState({
          accessToken,
          user: userResponse.data,
        });
      } catch (_error) {
        // If refresh fails, session is expired or guest
        setLocalAccessToken(null);
        setState({ accessToken: null, user: null });
      } finally {
        setIsLoading(false);
      }
    }

    initializeSession();
  }, []);

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("auth/login", credentials);
      const { accessToken, user } = response.data;

      setLocalAccessToken(accessToken);
      setState({ accessToken, user });

      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post("auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        document.cookie = "session_active=; path=/; max-age=0; SameSite=Lax";
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
      setLocalAccessToken(null);
      setState({ accessToken: null, user: null });
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userResponse = await apiClient.get("auth/me");
      setState((prev) => ({
        ...prev,
        user: userResponse.data,
      }));
    } catch (error) {
      console.error("Gagal memperbarui profil pengguna:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: !!state.user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
