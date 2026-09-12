"use client";

import { addDays, format, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertCircle,
  ArrowRight,
  Building,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
} from "lucide-react";
import type React from "react";
import { roomsConfig } from "@/config/rooms";
import type { useBookingSchedule } from "@/hooks/use-booking-schedule";
import { cn } from "@/lib/utils";

interface BookingScheduleNavigatorProps {
  scheduleController: ReturnType<typeof useBookingSchedule>;
  onBookRoom: (roomId: string, dateStr: string) => void;
  sectionRef?: React.Ref<HTMLElement>;
}

export function BookingScheduleNavigator({
  scheduleController,
  onBookRoom,
  sectionRef,
}: BookingScheduleNavigatorProps) {
  const {
    currentWeek,
    selectedDate,
    formattedSelectedDate,
    weekDays,
    navigateWeek,
    selectDate,
    getRoomAvailability,
  } = scheduleController;

  const rooms = roomsConfig.rooms;
  const isSelectedToday = isSameDay(selectedDate, new Date());

  return (
    <section
      ref={sectionRef}
      aria-labelledby="schedule-heading"
      className="w-full py-12 sm:py-16 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2
            id="schedule-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-foreground tracking-tight"
          >
            Cek Jadwal & Ketersediaan Ruangan
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
            Pilih tanggal di bawah ini untuk memantau slot yang sedang digunakan
            atau masih tersedia secara transparan sebelum mengajukan reservasi.
          </p>
        </div>

        {/* Date Navigator Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-border/80 shadow-lg overflow-hidden">
          {/* Week Header with Prev / Next */}
          <div className="p-4 sm:p-6 border-b border-border/60 bg-slate-50/60 dark:bg-zinc-800/40 flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => navigateWeek("prev")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-foreground/80 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-foreground transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              aria-label="Minggu sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Minggu Lalu</span>
            </button>

            <div className="text-center">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Rentang Minggu
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-primary dark:text-blue-300">
                {format(currentWeek, "d MMM", { locale: id })} —{" "}
                {format(addDays(currentWeek, 6), "d MMM yyyy", { locale: id })}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => navigateWeek("next")}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-semibold text-foreground/80 hover:bg-slate-100 dark:hover:bg-zinc-700 hover:text-foreground transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
              aria-label="Minggu selanjutnya"
            >
              <span className="hidden sm:inline">Minggu Depan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 7-Day Selector Bar */}
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isDayToday = isSameDay(day, new Date());
                const isSunday = day.getDay() === 0;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => selectDate(day)}
                    className={cn(
                      "relative h-20 sm:h-24 rounded-xl sm:rounded-2xl transition-all duration-200 text-center flex flex-col items-center justify-center gap-1 cursor-pointer select-none",
                      isSelected
                        ? "bg-gradient-to-br from-[#2E417A] to-blue-700 text-white shadow-md transform scale-[1.03] ring-2 ring-primary/30 z-10"
                        : "bg-slate-50 dark:bg-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-border/40",
                      isSunday && !isSelected && "opacity-75",
                    )}
                    aria-label={`Pilih tanggal ${format(day, "EEEE, d MMMM yyyy", { locale: id })}`}
                    aria-pressed={isSelected}
                  >
                    {isDayToday && (
                      <span
                        className={cn(
                          "absolute top-2 right-2 w-2 h-2 rounded-full",
                          isSelected
                            ? "bg-amber-400 ring-2 ring-blue-800"
                            : "bg-primary dark:bg-blue-400",
                        )}
                        title="Hari Ini"
                      />
                    )}

                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold uppercase tracking-wider",
                        isSelected
                          ? "text-blue-100"
                          : isSunday
                            ? "text-rose-500 font-bold"
                            : "text-muted-foreground",
                      )}
                    >
                      {format(day, "EEE", { locale: id })}
                    </span>

                    <span className="text-base sm:text-xl lg:text-2xl font-black">
                      {format(day, "d")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Header Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-300 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">
                Ketersediaan Ruangan untuk:
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
                {isSelectedToday && (
                  <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    (Hari Ini)
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Sebagian Terisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Penuh / Tutup</span>
            </div>
          </div>
        </div>

        {/* Room Availability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {rooms.map((room) => {
            const availability = getRoomAvailability(room.id, selectedDate);
            const isAvailable = availability.hasSlotsAvailable;

            return (
              <div
                key={room.id}
                className={cn(
                  "rounded-2xl sm:rounded-3xl border border-border/80 bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden",
                  isAvailable
                    ? "hover:-translate-y-1 ring-1 ring-border/50"
                    : "opacity-85",
                )}
              >
                <div>
                  {/* Card Header with Room Info & Status Badge */}
                  <div className="p-5 sm:p-6 border-b border-border/50 bg-slate-50/70 dark:bg-zinc-800/30 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-300 shrink-0">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-0.5">
                          {room.type}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-foreground">
                          {room.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.capacity}
                          </span>
                          <span>•</span>
                          <span>{room.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0",
                        availability.badgeClass,
                      )}
                    >
                      {availability.state === "available_full" && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      {availability.state === "available_partial" && (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {(availability.state === "occupied_full" ||
                        availability.state === "closed") && (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {availability.label}
                    </span>
                  </div>

                  {/* Schedule Sessions on this Date */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Jadwal Pemesanan ({availability.bookings.length} Sesi):
                    </div>

                    {availability.bookings.length > 0 ? (
                      <div className="space-y-2.5">
                        {availability.bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-border/70 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-primary dark:text-blue-300">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                {booking.startTime} — {booking.endTime} WIB
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                                Disetujui
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-snug">
                              {booking.purpose}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>
                                Dipesan oleh:{" "}
                                <strong className="font-semibold text-foreground/80">
                                  {booking.applicant}
                                </strong>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 px-4 rounded-xl bg-slate-50/60 dark:bg-zinc-800/30 border border-dashed border-border text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          Belum ada reservasi pada tanggal ini
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                          Seluruh slot waktu ruangan masih tersedia penuh untuk
                          kegiatan tim Anda.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 sm:p-6 pt-0">
                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() => onBookRoom(room.id, formattedSelectedDate)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>
                        Pesan Ruangan Ini (
                        {format(selectedDate, "d MMM", { locale: id })})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 text-muted-foreground text-xs sm:text-sm font-semibold text-center border border-border/50">
                      {availability.state === "closed"
                        ? "Layanan Tutup di Hari Libur"
                        : "Ruangan Penuh untuk Tanggal Ini"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
