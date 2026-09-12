"use client";

import { Clock, Loader2, Send, Users } from "lucide-react";
import { useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bookingConfig } from "@/config/booking";
import type { useBookingForm } from "@/hooks/use-booking-form";

interface BookingFormModalProps {
  bookingController: ReturnType<typeof useBookingForm>;
}

export function BookingFormModal({ bookingController }: BookingFormModalProps) {
  const {
    form,
    isOpen,
    isSubmitting,
    availableEndTimes,
    closeBookingModal,
    handleSubmit,
  } = bookingController;

  const {
    register,
    formState: { errors },
  } = form;

  const roomId = useId();
  const nameId = useId();
  const npmId = useId();
  const prodiId = useId();
  const dateId = useId();
  const startTimeId = useId();
  const endTimeId = useId();
  const audienceId = useId();
  const purposeId = useId();

  // Tomorrow's date formatted as YYYY-MM-DD for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeBookingModal()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-primary dark:text-foreground">
            Ajukan Peminjaman Fasilitas UCH
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Lengkapi informasi di bawah ini dengan benar. Reservasi akan
            diverifikasi secara otomatis oleh sistem simulasi UTY Creative Hub.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* 1. Ruangan & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Pilihan Ruangan */}
            <div className="space-y-1.5">
              <label
                htmlFor={roomId}
                className="text-xs font-bold text-foreground"
              >
                Pilih Ruangan <span className="text-destructive">*</span>
              </label>
              <select
                id={roomId}
                {...register("room")}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="">-- Pilih Fasilitas Ruangan --</option>
                {bookingConfig.rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.capacity})
                  </option>
                ))}
              </select>
              {errors.room && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.room.message}
                </p>
              )}
            </div>

            {/* Tanggal Booking */}
            <div className="space-y-1.5">
              <label
                htmlFor={dateId}
                className="text-xs font-bold text-foreground"
              >
                Tanggal Pemesanan <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id={dateId}
                  type="date"
                  min={minDateString}
                  {...register("date")}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              {errors.date && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* 2. Jam Mulai & Jam Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Jam Mulai */}
            <div className="space-y-1.5">
              <label
                htmlFor={startTimeId}
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Jam Mulai <span className="text-destructive">*</span>
              </label>
              <select
                id={startTimeId}
                {...register("startTime")}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {bookingConfig.timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time} WIB
                  </option>
                ))}
              </select>
              {errors.startTime && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* Jam Selesai */}
            <div className="space-y-1.5">
              <label
                htmlFor={endTimeId}
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Jam Selesai <span className="text-destructive">*</span>
              </label>
              <select
                id={endTimeId}
                {...register("endTime")}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {availableEndTimes.map((time) => (
                  <option key={time} value={time}>
                    {time} WIB
                  </option>
                ))}
              </select>
              {errors.endTime && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* 3. Data Mahasiswa Penanggung Jawab */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
              Identitas Pemohon (Mahasiswa UTY)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Nama */}
              <div className="space-y-1.5">
                <label
                  htmlFor={nameId}
                  className="text-xs font-bold text-foreground"
                >
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  placeholder="cth. Zaqi Riyadi"
                  {...register("name")}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                {errors.name && (
                  <p className="text-[11px] font-semibold text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* NPM */}
              <div className="space-y-1.5">
                <label
                  htmlFor={npmId}
                  className="text-xs font-bold text-foreground"
                >
                  NPM <span className="text-destructive">*</span>
                </label>
                <input
                  id={npmId}
                  type="text"
                  placeholder="5210411xxx"
                  {...register("npm")}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                {errors.npm && (
                  <p className="text-[11px] font-semibold text-destructive">
                    {errors.npm.message}
                  </p>
                )}
              </div>

              {/* Prodi */}
              <div className="space-y-1.5">
                <label
                  htmlFor={prodiId}
                  className="text-xs font-bold text-foreground"
                >
                  Program Studi <span className="text-destructive">*</span>
                </label>
                <input
                  id={prodiId}
                  type="text"
                  placeholder="Informatika"
                  {...register("prodi")}
                  className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                {errors.prodi && (
                  <p className="text-[11px] font-semibold text-destructive">
                    {errors.prodi.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 4. Jumlah Peserta & Tujuan */}
          <div className="space-y-4 pt-2 border-t border-border/60">
            {/* Jumlah Peserta */}
            <div className="space-y-1.5">
              <label
                htmlFor={audienceId}
                className="text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-secondary" />
                Estimasi Jumlah Peserta{" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                id={audienceId}
                type="number"
                min={1}
                max={100}
                {...register("audience", { valueAsNumber: true })}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              {errors.audience && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.audience.message}
                </p>
              )}
            </div>

            {/* Tujuan Kegiatan */}
            <div className="space-y-1.5">
              <label
                htmlFor={purposeId}
                className="text-xs font-bold text-foreground"
              >
                Tujuan & Agenda Kegiatan{" "}
                <span className="text-destructive">*</span>
              </label>
              <textarea
                id={purposeId}
                rows={3}
                placeholder="Jelaskan secara singkat kegiatan yang akan dilaksanakan (cth. Diskusi tim riset proposal PKM bidang AI dan prototyping hardware)..."
                {...register("purpose")}
                className="w-full p-3.5 rounded-xl border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
              />
              {errors.purpose && (
                <p className="text-[11px] font-semibold text-destructive">
                  {errors.purpose.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={closeBookingModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-accent transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Reservasi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Permohonan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
