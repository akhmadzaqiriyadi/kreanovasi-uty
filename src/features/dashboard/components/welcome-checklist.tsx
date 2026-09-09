"use client";

import {
  CheckCircle2,
  ExternalLink,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";

export function WelcomeChecklist() {
  const { user } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;
    const checked = localStorage.getItem(`welcome_profile_setup_${user.id}`);
    if (checked === "true") {
      setProfileCompleted(true);
    }
  }, [user]);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <div className="text-sm font-medium">Buat Akun Baru</div>
      </div>

      <Link
        href="/dashboard/profile"
        onClick={() => {
          if (user) {
            localStorage.setItem(`welcome_profile_setup_${user.id}`, "true");
          }
        }}
        className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/30 bg-background/50 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <UserCircle
            className={`h-5 w-5 ${
              profileCompleted ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <div className="text-sm font-medium text-foreground">
            Lengkapi Profil Saya
          </div>
        </div>
        {profileCompleted ? (
          <span className="text-xs text-primary font-bold">Selesai</span>
        ) : (
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </Link>

      <Link
        href="/dashboard"
        className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/30 bg-background/50 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm font-medium text-foreground">
            Jelajahi Dashboard
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </div>
  );
}
