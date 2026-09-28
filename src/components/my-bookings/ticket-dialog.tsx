"use client";

import {
  CheckCircle2,
  FileDown,
  Loader2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadBookingTicketPdf } from "@/lib/pdf-generator";
import type { BookingRecord } from "./my-bookings-page";

interface TicketDialogProps {
  booking: BookingRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDialog({
  booking,
  open,
  onOpenChange,
}: TicketDialogProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!booking) return null;

  const isCompleted = booking.status === "completed";

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadBookingTicketPdf({
        id: booking.id,
        bookingCode: booking.bookingCode,
        roomName: booking.roomName,
        location: booking.location,
        date: booking.date,
        timeSlot: booking.timeSlot,
        applicant: booking.applicant,
        prodi: booking.prodi,
        role: booking.role,
        audience: booking.audience,
        purpose: booking.purpose,
        status: booking.status,
      });
      toast.success("Dokumen PDF A4 resmi berhasil diunduh!");
    } catch {
      toast.error("Gagal membuat dokumen PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Top Header Card */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative z-10 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-extrabold text-xs tracking-wider uppercase text-white/90">
                UTY Creative Hub
              </span>
            </div>

            <DialogTitle className="text-xl font-extrabold text-white">
              E-Tiket Resmi Peminjaman
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs">
              Tunjukkan tiket digital ini kepada petugas piket / scan di pintu
              ruangan saat tiba di lokasi.
            </DialogDescription>

            <div className="pt-2">
              {isCompleted ? (
                <Badge className="bg-blue-500 hover:bg-blue-500 text-white font-bold text-xs py-1 px-3 border-none shadow-md inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Presensi Check-In Selesai
                </Badge>
              ) : (
                <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold text-xs py-1 px-3 border-none shadow-md inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Disetujui & Siap Check-In
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-background overflow-y-auto flex-1">
          {/* Booking Code Barcode & QR Block */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-dashed border-border/80 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
              <QRCodeSVG
                value={booking.bookingCode}
                size={135}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                KODE RESERVASI RESMI
              </span>
              <span className="text-xl font-mono font-extrabold text-primary dark:text-blue-400 tracking-wider block">
                {booking.bookingCode}
              </span>
              {isCompleted ? (
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-1">
                  ✓ Tiket telah diverifikasi check-in di ruangan
                </p>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Arahkan ke scanner pintu atau meja admin</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
              <span className="text-muted-foreground">Fasilitas Ruangan:</span>
              <span className="font-bold text-foreground text-right">
                {booking.roomName}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
              <span className="text-muted-foreground">Lokasi Gedung:</span>
              <span className="font-semibold text-foreground text-right">
                {booking.location}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
              <span className="text-muted-foreground">Hari & Tanggal:</span>
              <span className="font-bold text-foreground text-right">
                {booking.date}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
              <span className="text-muted-foreground">Sesi Waktu:</span>
              <span className="font-bold text-foreground text-right">
                {booking.timeSlot}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
              <span className="text-muted-foreground">Penanggung Jawab:</span>
              <span className="font-bold text-foreground text-right">
                {booking.applicant} ({booking.prodi})
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-muted-foreground">Jumlah Peserta:</span>
              <span className="font-bold text-foreground text-right">
                {booking.audience} Orang
              </span>
            </div>
          </div>

          {/* Guidelines Alert */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
            <span className="font-bold block">Tata Tertib Peminjaman:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[10px]">
              <li>Harap hadir minimal 15 menit sebelum sesi dimulai.</li>
              <li>Menjaga kebersihan dan tidak merusak fasilitas kampus.</li>
              <li>Wajib melakukan check-out dan serah terima kunci ruangan.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-3 sm:p-4 bg-slate-50/70 dark:bg-zinc-800/40 border-t border-border/60 flex flex-row items-center justify-between gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold"
          >
            Tutup
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5 mr-1.5" />
            )}
            Unduh PDF Resmi (A4)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
