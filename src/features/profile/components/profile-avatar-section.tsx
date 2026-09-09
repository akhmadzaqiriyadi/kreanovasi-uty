"use client";

import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";

export function ProfileAvatarSection() {
  const { user } = useAuth();
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const getGradientColor = (char: string) => {
    const code = char.charCodeAt(0) || 0;
    const hue = (code * 17) % 360;
    return `from-[oklch(0.7_0.15_${hue})] to-[oklch(0.5_0.15_${(hue + 60) % 360})]`;
  };

  const gradient = user?.name
    ? getGradientColor(user.name[0])
    : "from-primary/70 to-purple-500/70";

  const handleUploadMock = () => {
    toast.info("Fitur Upload Foto", {
      description: "Fitur simulasi upload file media akan segera hadir.",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleUploadMock}
        type="button"
        className="relative h-24 w-24 rounded-full border-2 border-border/50 overflow-hidden group shadow-lg cursor-pointer hover:border-primary/50 transition-colors"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-3xl font-black tracking-wider`}
        >
          {initials}
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          <Camera className="h-5 w-5" />
        </div>
      </button>
      <span className="text-xs text-muted-foreground animate-pulse">
        Klik avatar untuk mengganti foto
      </span>
    </div>
  );
}
