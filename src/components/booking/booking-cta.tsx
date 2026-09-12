"use client";

import { ArrowRight, CalendarPlus } from "lucide-react";
import type React from "react";

interface BookingCtaProps {
  onOpenModal: () => void;
  sectionRef?: React.Ref<HTMLElement>;
}

export function BookingCta({ onOpenModal, sectionRef }: BookingCtaProps) {
  return (
    <section
      ref={sectionRef}
      aria-label="Ajakan Aksi Reservasi Ruangan"
      className="w-full py-16 sm:py-20 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-[oklch(0.28_0.075_270)] text-primary-foreground p-8 sm:p-12 lg:p-14 text-center shadow-xl space-y-6">
          {/* Ambient Glows */}
          <div
            className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-primary-foreground/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Siap Memulai Proyek & Riset Inovasi Anda?
            </h3>

            <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed font-medium">
              Bergabunglah dengan ratusan tim mahasiswa dan komunitas yang telah
              memanfaatkan fasilitas UTY Creative Hub untuk merealisasikan karya
              terbaik mereka.
            </p>
          </div>

          <div className="pt-2 relative z-10 flex items-center justify-center">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.97] transition-all cursor-pointer"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>Mulai Pesan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
