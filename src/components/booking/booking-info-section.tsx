"use client";

import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
} from "lucide-react";
import type React from "react";
import { bookingConfig } from "@/config/booking";
import { cn } from "@/lib/utils";

interface BookingInfoSectionProps {
  sectionRef?: React.Ref<HTMLElement>;
}

export function BookingInfoSection({ sectionRef }: BookingInfoSectionProps) {
  const { operationalHours, procedures, rules } = bookingConfig;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="booking-info-heading"
      className="w-full py-12 sm:py-16 bg-slate-50/70 dark:bg-zinc-950/70 border-y border-border/60 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* 1. Operational Hours Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-border/80 shadow-md space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary dark:text-blue-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Jadwal Resmi
                </span>
                <h3
                  id="booking-info-heading"
                  className="text-xl sm:text-2xl font-bold text-primary dark:text-foreground"
                >
                  Jam Operasional
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Layanan operasional fasilitas UTY Creative Hub mengikuti jam kerja
              akademik universitas:
            </p>

            {/* Schedule List */}
            <div className="space-y-3 pt-2">
              {operationalHours.map((schedule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-border/50 text-xs sm:text-sm"
                >
                  <span className="font-semibold text-foreground">
                    {schedule.day}
                  </span>
                  <span
                    className={cn(
                      "font-bold px-2.5 py-0.5 rounded-full text-xs",
                      schedule.isOpen
                        ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400",
                    )}
                  >
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Note */}
            <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-start gap-3 text-xs text-muted-foreground">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Penggunaan di luar jam kerja (overtime project/hackathon) wajib
                menyertakan surat izin resmi dari Dosen Pembina atau PIC UCH.
              </span>
            </div>
          </div>

          {/* 2. Guidelines & Procedures (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-border/80 shadow-md space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-6 h-6 text-amber-600 dark:text-secondary" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                  Panduan Peminjaman
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-foreground">
                  Informasi & Ketentuan
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Cara Pemesanan */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <h4 className="font-bold text-sm sm:text-base text-foreground">
                    Cara Pemesanan
                  </h4>
                </div>
                <ul className="space-y-3">
                  {procedures.map((proc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{proc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ketentuan Peminjaman */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                  <h4 className="font-bold text-sm sm:text-base text-foreground">
                    Tata Tertib Ruangan
                  </h4>
                </div>
                <ul className="space-y-3">
                  {rules.map((rule, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
