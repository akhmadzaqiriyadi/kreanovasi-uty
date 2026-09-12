"use client";

import { LogIn, UserPlus } from "lucide-react";
import type React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { NavNotifications } from "./nav-notifications";
import { NavUserMenu } from "./nav-user-menu";

interface NavActionsProps {
  ref?: React.Ref<HTMLElement>;
}

export function NavActions({ ref }: NavActionsProps) {
  const { isLoggedIn, openLoginModal, openRegisterModal } = useAuth();

  return (
    <nav
      ref={ref}
      aria-label="Aksi Cepat & Profil"
      className="hidden md:flex items-center gap-2 lg:gap-2.5"
    >
      <ThemeToggle className="h-9 w-9 rounded-full" />

      {isLoggedIn ? (
        <>
          <NavNotifications />
          <NavUserMenu />
        </>
      ) : (
        <div className="flex items-center gap-1.5 pl-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openLoginModal}
            className="rounded-xl font-bold text-xs h-9 px-3 hover:bg-slate-100 dark:hover:bg-zinc-800 text-foreground cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            <span>Masuk</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={openRegisterModal}
            className="rounded-xl font-bold text-xs h-9 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Daftar</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
