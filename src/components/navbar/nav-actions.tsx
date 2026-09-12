import type React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavNotifications } from "./nav-notifications";
import { NavUserMenu } from "./nav-user-menu";

interface NavActionsProps {
  ref?: React.Ref<HTMLElement>;
}

export function NavActions({ ref }: NavActionsProps) {
  return (
    <nav
      ref={ref}
      aria-label="Aksi Cepat & Profil"
      className="hidden md:flex items-center gap-2 lg:gap-2.5"
    >
      <ThemeToggle className="h-9 w-9 rounded-full" />
      <NavNotifications />
      <NavUserMenu />
    </nav>
  );
}
