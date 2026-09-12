"use client";

import { Printer, QrCode, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Top Header Card */}
        <div className="p-6 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative z-10 space-y-2">
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
              Tunjukkan tiket digital ini kepada petugas piket / laboran saat
              tiba di lokasi.
            </DialogDescription>

            <div className="pt-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold text-xs py-1 px-3 border-none shadow-md inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Disetujui & Terverifikasi
              </Badge>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 bg-background">
          {/* Booking Code Barcode Block */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-dashed border-border/80 text-center space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground block">
              KODE RESERVASI RESMI
            </span>
            <span className="text-2xl font-mono font-extrabold text-primary dark:text-blue-400 tracking-wider block">
              {booking.bookingCode}
            </span>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <QrCode className="w-4 h-4" />
              <span>QR Code siap dipindai di pintu masuk</span>
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
        <DialogFooter className="p-4 bg-slate-50/70 dark:bg-zinc-800/40 border-t border-border/60 flex flex-row items-center justify-between sm:justify-between gap-2">
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
            onClick={handlePrint}
            className="rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak / Simpan PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
