"use client";

import { DoorOpen, FileDown, Loader2, ShieldCheck } from "lucide-react";
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
  DialogTitle,
} from "@/components/ui/dialog";
import type { BackendRoom } from "@/hooks/use-booking-queries";
import { downloadRoomKioskPosterPdf } from "@/lib/pdf-generator";

interface RoomKioskQrModalProps {
  room: BackendRoom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomKioskQrModal({
  room,
  open,
  onOpenChange,
}: RoomKioskQrModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const currentRoom = room || {
    id: "coworking-space-hall",
    name: "Coworking Space & Event Hall",
  };

  const qrValue = `UCH-ROOM:${currentRoom.id}`;

  const handleDownloadPoster = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadRoomKioskPosterPdf({
        id: currentRoom.id,
        name: currentRoom.name,
        category: "category" in currentRoom ? currentRoom.category : undefined,
        capacity: "capacity" in currentRoom ? currentRoom.capacity : 30,
        location: "location" in currentRoom ? currentRoom.location : undefined,
        operationalHours:
          "operational_hours" in currentRoom
            ? currentRoom.operational_hours
            : undefined,
      });
      toast.success("Poster PDF A4 resmi ruangan berhasil diunduh!");
    } catch {
      toast.error("Gagal membuat dokumen poster PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white text-center relative overflow-hidden shrink-0 pr-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />

          <div className="relative z-10 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase text-white/90">
                UTY Creative Hub • Kiosk Pintu
              </span>
            </div>

            <DialogTitle className="text-base sm:text-lg md:text-xl font-extrabold text-white">
              QR Presensi Masuk Ruangan
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-[11px] sm:text-xs line-clamp-2">
              Tampilkan di tablet pintu ruangan atau unduh poster resmi untuk
              presensi pengguna.
            </DialogDescription>

            <div className="pt-0.5">
              <Badge className="bg-amber-400 hover:bg-amber-400 text-zinc-900 font-black text-xs py-0.5 sm:py-1 px-2.5 sm:px-3 border-none shadow-md inline-flex items-center gap-1.5 max-w-full truncate">
                <DoorOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentRoom.name}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* QR Body */}
        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 bg-background text-center overflow-y-auto flex-1">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center space-y-3 sm:space-y-4 shadow-sm">
            <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-md border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
              <QRCodeSVG
                value={qrValue}
                size={160}
                level="H"
                includeMargin={false}
                className="w-36 h-36 sm:w-44 sm:h-44"
              />
            </div>

            <div className="space-y-1 w-full max-w-xs px-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
                ID RUANGAN HUB
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-primary dark:text-blue-400 block break-all">
                {qrValue}
              </span>
              <p className="text-[11px] sm:text-xs text-muted-foreground pt-0.5">
                Pengguna yang memiliki reservasi disetujui di ruangan ini dapat
                memindai QR ini dari menu "Booking Saya" untuk presensi mandiri.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-zinc-800/50 border border-border/60 text-xs text-left space-y-1">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Sistem Proteksi Otomatis:</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
              Hanya pemohon dengan jadwal aktif hari ini di ruangan{" "}
              <strong>{currentRoom.name}</strong> yang dapat melakukan check-in
              melalui kode ini.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl text-xs h-9 sm:h-10 px-4 cursor-pointer"
            >
              Tutup Kiosk
            </Button>
            <Button
              onClick={handleDownloadPoster}
              disabled={isGeneratingPdf}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 sm:h-10 cursor-pointer shadow-xs"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
              )}
              Unduh Poster PDF (A4)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
