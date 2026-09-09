import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  ProfileAvatarSection,
  ProfileEditForm,
  ProfileHeader,
} from "@/features/profile";

export const metadata: Metadata = {
  title: "Profil Saya | UCH Web App",
  description: "Kelola informasi profil dan kredensial akun Anda.",
};

export default function ProfilePage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-xl relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center">
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "gap-1.5 text-muted-foreground hover:text-foreground",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-border/30 space-y-6 shadow-xl">
        <ProfileAvatarSection />
        <ProfileHeader />
        <ProfileEditForm />
      </div>
    </div>
  );
}
