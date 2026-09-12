"use client";

import { ChevronDown, History, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const dummyUser = {
  name: "Akhmad Zaqi Riyadi",
  email: "zaqi@students.uty.ac.id",
  role: "Mahasiswa Aktif UTY",
  npm: "5210411234",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export function NavUserMenu() {
  const _handleAction = (label: string, desc: string) => {
    toast.info(label, {
      description: desc,
    });
  };

  const handleLogout = () => {
    toast.success("Berhasil Keluar", {
      description: "Sesi akun SSO Kampus UTY telah diakhiri.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 p-1 pl-1 pr-2 rounded-full transition-all duration-200 cursor-pointer outline-hidden",
            "border border-border/60 hover:border-primary/40 bg-background hover:bg-slate-100 dark:hover:bg-zinc-800",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          )}
          aria-label="Menu Pengguna"
        >
          <div className="relative">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-border/80">
              <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                AZ
              </AvatarFallback>
            </Avatar>
            {/* Status indicator badge (Online) */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <span className="hidden xl:inline-block text-xs font-bold text-foreground max-w-[120px] truncate">
            {dummyUser.name.split(" ")[0]}
          </span>

          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 p-1.5 rounded-2xl shadow-2xl border-border/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md"
      >
        {/* User Identity Header */}
        <div className="p-3 bg-slate-50/70 dark:bg-zinc-800/40 rounded-xl mb-1 border border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/30 shrink-0">
              <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                AZ
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {dummyUser.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {dummyUser.email}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-muted-foreground">
              NPM {dummyUser.npm}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] font-bold py-0 px-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-none"
            >
              Mahasiswa
            </Badge>
          </div>
        </div>

        <DropdownMenuGroup className="space-y-0.5">
          {/* Akun Saya */}
          <DropdownMenuItem asChild>
            <Link
              href="/account"
              className="rounded-xl px-3 py-2 text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-2.5 text-primary dark:text-blue-400" />
              <span>Akun Saya</span>
            </Link>
          </DropdownMenuItem>

          {/* Booking Saya / Riwayat */}
          <DropdownMenuItem asChild>
            <Link
              href="/my-bookings"
              className="rounded-xl px-3 py-2 text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center"
            >
              <History className="w-4 h-4 mr-2.5 text-primary dark:text-blue-400" />
              <span>Booking Saya / Riwayat</span>
            </Link>
          </DropdownMenuItem>

          {/* Pengaturan */}
          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="rounded-xl px-3 py-2 text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center"
            >
              <Settings className="w-4 h-4 mr-2.5 text-primary dark:text-blue-400" />
              <span>Pengaturan</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:bg-rose-50 dark:focus:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2.5" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
