"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 px-4">
        <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] h-[150px] w-[150px] rounded-full bg-red-500/10 blur-[40px] pointer-events-none" />

          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2 animate-bounce">
            <AlertTriangle className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-100">
              Sistem Mengalami Kegagalan Fatal
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Telah terjadi error fatal pada server utama. Silakan coba muat
              ulang halaman.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-zinc-500 bg-zinc-950 rounded p-1.5 break-all">
                ID Error: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-600/25 transition-all duration-300 w-full inline-flex items-center justify-center gap-2 cursor-pointer border border-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              Muat Ulang Aplikasi
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
