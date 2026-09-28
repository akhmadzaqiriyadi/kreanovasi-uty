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
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header Banner */}
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
                UTY Creative Hub • Kiosk Pintu
              </span>
            </div>

            <DialogTitle className="text-xl font-extrabold text-white">
              QR Presensi Masuk Ruangan
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-xs">
              Tampilkan di tablet pintu ruangan atau unduh poster resmi untuk
              presensi pengguna.
            </DialogDescription>

            <div className="pt-1">
              <Badge className="bg-amber-400 hover:bg-amber-400 text-zinc-900 font-black text-xs py-1 px-3 border-none shadow-md inline-flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5" />
                {currentRoom.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* QR Body */}
        <div className="p-6 space-y-5 bg-background text-center">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
              <QRCodeSVG
                value={qrValue}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block">
                ID RUANGAN HUB
              </span>
              <span className="text-base font-mono font-bold text-primary dark:text-blue-400 block">
                {qrValue}
              </span>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto pt-1">
                Pengguna yang memiliki reservasi disetujui di ruangan ini dapat
                memindai QR ini dari menu "Booking Saya" untuk presensi mandiri.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-zinc-800/50 border border-border/60 text-xs text-left space-y-1">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Sistem Proteksi Otomatis:</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Hanya pemohon dengan jadwal aktif hari ini di ruangan{" "}
              <strong>{currentRoom.name}</strong> yang dapat melakukan check-in
              melalui kode ini.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleDownloadPoster}
              disabled={isGeneratingPdf}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 cursor-pointer shadow-xs"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
              )}
              Unduh Poster PDF (A4)
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl text-xs h-10 px-4 cursor-pointer"
            >
              Tutup Kiosk
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
