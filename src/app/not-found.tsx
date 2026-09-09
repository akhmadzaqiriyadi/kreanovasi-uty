import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
      <div className="glass-panel border-border/30 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Soft Background glow */}
        <div className="absolute top-[-50px] left-[-50px] h-[150px] w-[150px] rounded-full bg-primary/10 blur-[40px] pointer-events-none" />

        <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-2 animate-pulse">
          <FileQuestion className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient-primary">
            404
          </h1>
          <h2 className="text-xl font-bold text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke
            alamat lain.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className={`${buttonVariants({ size: "lg" })} bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 glow-hover w-full inline-flex items-center justify-center gap-2`}
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
