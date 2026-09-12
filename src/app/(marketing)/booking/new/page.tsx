import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingNewFormPage } from "@/components/booking/booking-new-form-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ajukan Peminjaman Fasilitas UCH",
  description:
    "Formulir resmi pengajuan peminjaman ruangan co-working space, fastlab IoT, dan ruang rapat kreatif di UTY Creative Hub.",
  alternates: {
    canonical: `${siteConfig.url}/booking/new`,
  },
};

export default function BookingNewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">
              Memuat formulir peminjaman...
            </p>
          </div>
        </div>
      }
    >
      <BookingNewFormPage />
    </Suspense>
  );
}
