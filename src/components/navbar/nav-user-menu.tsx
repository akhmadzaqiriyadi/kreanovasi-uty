"use client";

import {
  Bell,
  ChevronDown,
  History,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
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
import { defaultUser, useAuth } from "@/context/auth-context";
import { useNotification } from "@/context/notification-context";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/auth";

export const dummyUser: UserProfile = defaultUser;

export function NavUserMenu() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const currentUser = user || dummyUser;

  const handleLogout = () => {
    logout();
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
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator badge (Online) */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>

          <span className="hidden xl:inline-block text-xs font-bold text-foreground max-w-[120px] truncate">
            {currentUser.name.split(" ")[0]}
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
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-muted-foreground">
              {currentUser.role === "admin"
                ? "Super Admin"
                : currentUser.npm
                  ? `ID ${currentUser.npm}`
                  : currentUser.idNumber
                    ? `ID ${currentUser.idNumber}`
                    : "Terverifikasi"}
            </span>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] font-bold py-0 px-2 border-none capitalize",
                currentUser.role === "admin"
                  ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                  : currentUser.role === "dosen"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : currentUser.role === "umum"
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
              )}
            >
              {currentUser.role === "admin"
                ? "Administrator"
                : currentUser.role === "umum"
                  ? "Non-Civitas"
                  : currentUser.role}
            </Badge>
          </div>
        </div>

        <DropdownMenuGroup className="space-y-0.5">
          {/* Admin Dashboard (Only visible for Admin / Authorized) */}
          {(currentUser.role === "admin" ||
            currentUser.permissions?.includes("users:read")) && (
            <DropdownMenuItem asChild>
              <Link
                href="/admin"
                className="rounded-xl px-3 py-2 text-xs font-bold cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 transition-colors flex items-center justify-between mb-1"
              >
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2.5 text-purple-600 dark:text-purple-400" />
                  <span>Admin Dashboard</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[9px] py-0 px-1.5"
                >
                  PBAC
                </Badge>
              </Link>
            </DropdownMenuItem>
          )}

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

          {/* Pusat Notifikasi */}
          <DropdownMenuItem asChild>
            <Link
              href="/notifications"
              className="rounded-xl px-3 py-2 text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-2.5 text-primary dark:text-blue-400" />
                <span>Pusat Notifikasi</span>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0 border-none">
                  {unreadCount}
                </Badge>
              )}
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
