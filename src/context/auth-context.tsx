"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface UserProfile {
  name: string;
  email: string;
  role: "mahasiswa" | "dosen" | "umum";
  roleLabel: string;
  idNumber: string;
  idLabel: string;
  affiliation: string;
  npm?: string;
  prodi?: string;
  avatarUrl: string;
}

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
  user: UserProfile | null;
  authModalOpen: boolean;
  authModalTab: "login" | "register";
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: "login" | "register") => void;
  login: (userData?: Partial<UserProfile>) => void;
  register: (userData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default: false (Belum login / Tamu) agar navbar menampilkan tombol Masuk & Daftar
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );

  // Inisialisasi state login dari localStorage jika ada
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("uch_auth_logged_in");
      if (savedAuth === "true") {
        setIsLoggedIn(true);
        setUser(defaultUser);
      }
    } catch {
      // ignore
    }
  }, []);

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

  const login = (userData?: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...defaultUser,
      ...userData,
    };
    setIsLoggedIn(true);
    setUser(updatedUser);
    setAuthModalOpen(false);
    try {
      localStorage.setItem("uch_auth_logged_in", "true");
    } catch {
      // ignore
    }
    toast.success("Berhasil Masuk", {
      description: `Selamat datang kembali, ${updatedUser.name}!`,
    });
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
    setIsLoggedIn(true);
    setUser(newUser);
    setAuthModalOpen(false);
    try {
      localStorage.setItem("uch_auth_logged_in", "true");
    } catch {
      // ignore
    }
    toast.success("Pendaftaran Berhasil", {
      description: `Akun ${newUser.roleLabel} Anda telah aktif di UTY Creative Hub.`,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.removeItem("uch_auth_logged_in");
    } catch {
      // ignore
    }
    toast.info("Berhasil Keluar", {
      description: "Sesi akun Anda telah diakhiri.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        authModalOpen,
        authModalTab,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        setAuthModalTab,
        login,
        register,
        logout,
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
