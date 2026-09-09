import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 relative z-10">
      <div className="glass-panel border-border/30 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 shadow-lg">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
