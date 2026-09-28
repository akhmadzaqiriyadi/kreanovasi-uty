"use client";

import { Html5Qrcode } from "html5-qrcode";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Keyboard,
  Loader2,
  QrCode,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type BackendBooking,
  useAdminCheckInMutation,
  useSelfCheckInMutation,
} from "@/hooks/use-booking-queries";

interface QrScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "admin" | "user";
  title?: string;
  description?: string;
}

export function QrScannerModal({
  open,
  onOpenChange,
  mode,
  title,
  description,
}: QrScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera");
  const [manualInput, setManualInput] = useState("");
  const [_isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [verifiedBooking, setVerifiedBooking] = useState<BackendBooking | null>(
    null,
  );

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = `qr-video-reader-${mode}`;

  const adminCheckIn = useAdminCheckInMutation();
  const selfCheckIn = useSelfCheckInMutation();

  const isPending = adminCheckIn.isPending || selfCheckIn.isPending;

  // Sound feedback on success
  const playBeep = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.25,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const handleProcessScan = async (scannedText: string) => {
    const cleanText = scannedText.trim();
    if (!cleanText || isPending) return;

    try {
      if (mode === "admin") {
        const res = await adminCheckIn.mutateAsync(cleanText);
        playBeep();
        setVerifiedBooking(res || null);
      } else {
        // Mode user: check if it's a room QR or booking code
        const isRoom =
          cleanText.startsWith("UCH-ROOM:") ||
          cleanText.includes("coworking") ||
          cleanText.includes("lab") ||
          cleanText.includes("room");

        const payload = isRoom
          ? { room_id: cleanText.replace("UCH-ROOM:", "") }
          : { booking_code: cleanText };

        const res = await selfCheckIn.mutateAsync(payload);
        playBeep();
        setVerifiedBooking(res || null);
      }
    } catch {
      // Error handled by mutation onError toast
    }
  };

  // Start Camera Scanning
  useEffect(() => {
    let isMounted = true;

    const stopScanner = async () => {
      const scanner = html5QrCodeRef.current;
      if (scanner) {
        html5QrCodeRef.current = null;
        try {
          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch {
          // ignore scanner stop error
        }
        try {
          scanner.clear();
        } catch {
          // ignore clear error
        }
      }
      if (isMounted) {
        setIsScanning(false);
      }
    };

    if (!open || activeTab !== "camera" || verifiedBooking) {
      stopScanner();
      return;
    }

    setCameraError(null);

    const startScanner = async () => {
      if (!isMounted) return;
      try {
        const qrScanner = new Html5Qrcode(readerElementId);
        html5QrCodeRef.current = qrScanner;

        const config = {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        };

        await qrScanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (isMounted) {
              handleProcessScan(decodedText);
            }
          },
          () => {
            // Ignore scan parse frames
          },
        );

        if (isMounted) {
          setIsScanning(true);
        } else {
          try {
            if (qrScanner.isScanning) {
              await qrScanner.stop();
            }
            qrScanner.clear();
          } catch {
            // ignore
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Tidak dapat mengakses kamera";
          setCameraError(msg);
          setIsScanning(false);
        }
      }
    };

    // Delay slightly to ensure DOM element exists
    const timer = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [open, activeTab, verifiedBooking]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessScan(manualInput.trim());
  };

  const handleReset = () => {
    setVerifiedBooking(null);
    setManualInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-white">
                {title ||
                  (mode === "admin"
                    ? "Pemindai QR Check-In Admin"
                    : "Scan QR Masuk Ruangan")}
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-xs mt-0.5">
                {description ||
                  (mode === "admin"
                    ? "Pindai tiket QR mahasiswa / tamu untuk memvalidasi presensi."
                    : "Pindai QR pada tablet pintu ruangan untuk check-in mandiri.")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Verified Success Card */}
          {verifiedBooking ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 mb-1.5 border-none">
                  Check-In Berhasil Diverifikasi
                </Badge>
                <h3 className="text-base font-extrabold text-foreground">
                  {verifiedBooking.applicant_name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {verifiedBooking.id} • {verifiedBooking.applicant_role}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Ruangan
                  </span>
                  <span className="font-bold text-foreground truncate block">
                    {verifiedBooking.room_name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Waktu Sesi
                  </span>
                  <span className="font-bold text-foreground block">
                    {verifiedBooking.start_time} - {verifiedBooking.end_time}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleReset}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 cursor-pointer"
                >
                  Pindai Tiket Lainnya
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl border-border text-xs h-10 cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector: Camera vs Manual Input */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "camera"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Kamera Scanner
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "manual"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  Input Manual Kode
                </button>
              </div>

              {/* Camera Scanner View */}
              {activeTab === "camera" && (
                <div className="space-y-3">
                  <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-zinc-950 border-2 border-primary/40 shadow-inner flex flex-col items-center justify-center">
                    <div id={readerElementId} className="w-full h-full" />

                    {cameraError && (
                      <div className="absolute inset-0 p-4 bg-zinc-950/90 text-white flex flex-col items-center justify-center text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-400" />
                        <span className="text-xs font-semibold">
                          Akses Kamera Tidak Aktif
                        </span>
                        <p className="text-[11px] text-zinc-400 max-w-[220px]">
                          Izinkan akses kamera di browser Anda atau gunakan tab
                          "Input Manual Kode".
                        </p>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setActiveTab("manual")}
                          className="text-xs rounded-xl mt-2 cursor-pointer"
                        >
                          Gunakan Input Manual
                        </Button>
                      </div>
                    )}

                    {isPending && (
                      <div className="absolute inset-0 bg-zinc-950/75 flex flex-col items-center justify-center text-white space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        <span className="text-xs font-bold">
                          Memverifikasi Check-In...
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Arahkan kamera ke QR Code tiket / ruangan hingga terdeteksi.
                  </p>
                </div>
              )}

              {/* Manual Input View */}
              {activeTab === "manual" && (
                <form onSubmit={handleManualSubmit} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="manual-code"
                      className="text-xs font-bold text-foreground"
                    >
                      {mode === "admin"
                        ? "Kode Reservasi Tiket (Contoh: UCH-2026-XXXX)"
                        : "Kode Ruangan / Tiket"}
                    </Label>
                    <Input
                      id="manual-code"
                      placeholder={
                        mode === "admin"
                          ? "misal: UCH-2026-0001"
                          : "misal: coworking-space-hall atau UCH-2026-0001"
                      }
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="h-11 rounded-xl text-xs font-mono font-bold"
                      autoFocus
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Ketikkan kode yang tertera pada tiket fisik atau QR code.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="flex-1 rounded-xl border-border text-xs h-11 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !manualInput.trim()}
                      className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Memvalidasi...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Verifikasi
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
