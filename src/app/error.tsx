"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
      <div className="glass-panel border-border/30 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Soft Background glow */}
        <div className="absolute top-[-50px] right-[-50px] h-[150px] w-[150px] rounded-full bg-destructive/10 blur-[40px] pointer-events-none" />

        <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2 animate-pulse">
          <AlertCircle className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            Terjadi Kesalahan Aplikasi
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Maaf atas ketidaknyamanan ini. Sistem mengalami kendala saat
            memproses halaman.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900/60 rounded p-1.5 break-all">
              ID Error: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            onClick={() => reset()}
            className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 w-full inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
