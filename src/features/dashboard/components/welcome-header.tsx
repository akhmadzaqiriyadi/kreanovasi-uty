"use client";

import { Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth";

export function WelcomeHeader() {
  const { user } = useAuth();
  return (
    <div className="text-center space-y-3">
      <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <Sparkles className="h-6 w-6 animate-pulse" />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-gradient-primary">
        Selamat Datang, {user?.name || "User"}!
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Mari selesaikan beberapa langkah berikut untuk memaksimalkan starter kit
        Anda.
      </p>
    </div>
  );
}
