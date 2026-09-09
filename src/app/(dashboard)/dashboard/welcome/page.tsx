import type { Metadata } from "next";
import { WelcomeChecklist } from "@/features/dashboard/components/welcome-checklist";
import { WelcomeCta } from "@/features/dashboard/components/welcome-cta";
import { WelcomeHeader } from "@/features/dashboard/components/welcome-header";

export const metadata: Metadata = {
  title: "Selamat Datang | UCH Web App",
  description: "Langkah-langkah awal mempersiapkan dashboard Anda.",
};

export default function WelcomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[80vh]">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-border/30 space-y-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WelcomeHeader />
        <WelcomeChecklist />
        <WelcomeCta />
      </div>
    </div>
  );
}
