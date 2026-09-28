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
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.max(120, Math.floor(minEdge * 0.72));
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0,
        };

        const onScanSuccess = (decodedText: string) => {
          if (isMounted) {
            handleProcessScan(decodedText);
          }
        };

        try {
          await qrScanner.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            () => {},
          );
        } catch (_envErr) {
          // Fallback to front camera or any camera if environment camera is unavailable
          await qrScanner.start(
            { facingMode: "user" },
            config,
            onScanSuccess,
            () => {},
          );
        }

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
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md p-0 overflow-hidden max-h-[92dvh] flex flex-col rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl bg-white dark:bg-zinc-900">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 sm:pb-4 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white relative shrink-0 pr-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 pr-2">
              <DialogTitle className="text-sm sm:text-base md:text-lg font-black text-white leading-snug">
                {title ||
                  (mode === "admin"
                    ? "Pemindai QR Check-In Admin"
                    : "Scan QR Masuk Ruangan")}
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-[10px] sm:text-xs mt-0.5 line-clamp-2">
                {description ||
                  (mode === "admin"
                    ? "Pindai tiket QR mahasiswa / tamu untuk memvalidasi presensi."
                    : "Pindai QR pada tablet pintu ruangan untuk check-in mandiri.")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
          {/* Verified Success Card */}
          {verifiedBooking ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 mb-1 border-none">
                  Check-In Berhasil Diverifikasi
                </Badge>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground truncate px-2">
                  {verifiedBooking.applicant_name}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-mono truncate px-2">
                  {verifiedBooking.id} • {verifiedBooking.applicant_role}
                </p>
              </div>

              <div className="space-y-2 text-left bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-border/60 text-xs">
                <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-border/40">
                  <span className="text-muted-foreground text-[10px] sm:text-[11px] shrink-0">
                    Ruangan
                  </span>
                  <span className="font-bold text-foreground text-right truncate">
                    {verifiedBooking.room_name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground text-[10px] sm:text-[11px] shrink-0">
                    Waktu Sesi
                  </span>
                  <span className="font-bold text-foreground text-right text-[11px] sm:text-xs font-mono">
                    {verifiedBooking.start_time} - {verifiedBooking.end_time}
                  </span>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl border-border text-xs h-9 sm:h-10 cursor-pointer"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 sm:h-10 cursor-pointer"
                >
                  Pindai Tiket Lainnya
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector: Camera vs Manual Input */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-border/60">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "camera"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Kamera Scanner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "manual"
                      ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Input Manual</span>
                </button>
              </div>

              {/* Camera Scanner View */}
              {activeTab === "camera" && (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="relative w-full max-w-[240px] xs:max-w-[260px] sm:max-w-[280px] aspect-square mx-auto rounded-2xl overflow-hidden bg-zinc-950 border-2 border-primary/50 shadow-inner flex flex-col items-center justify-center">
                    <div id={readerElementId} className="w-full h-full" />

                    {/* Viewfinder Reticle Corners */}
                    <div className="pointer-events-none absolute inset-3 z-10">
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary dark:border-blue-400 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary dark:border-blue-400 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary dark:border-blue-400 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary dark:border-blue-400 rounded-br-lg" />
                    </div>

                    {/* Animated Laser Scanning Line */}
                    {!cameraError && !verifiedBooking && !isPending && (
                      <div className="pointer-events-none absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scanner-laser z-20" />
                    )}

                    {cameraError && (
                      <div className="absolute inset-0 p-4 bg-zinc-950/90 text-white flex flex-col items-center justify-center text-center space-y-2 z-30">
                        <AlertCircle className="w-7 h-7 text-amber-400 shrink-0" />
                        <span className="text-xs font-semibold">
                          Akses Kamera Tidak Aktif
                        </span>
                        <p className="text-[11px] text-zinc-400 max-w-[220px] leading-relaxed">
                          Izinkan akses kamera di browser Anda atau gunakan tab
                          "Input Manual".
                        </p>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setActiveTab("manual")}
                          className="text-xs rounded-xl mt-1.5 cursor-pointer h-8 px-3"
                        >
                          Gunakan Input Manual
                        </Button>
                      </div>
                    )}

                    {isPending && (
                      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-30">
                        <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                        <span className="text-xs font-bold">
                          Memverifikasi Check-In...
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[10px] sm:text-[11px] text-muted-foreground px-2">
                    Arahkan kamera ke QR Code tiket / ruangan hingga terdeteksi.
                  </p>
                </div>
              )}

              {/* Manual Input View */}
              {activeTab === "manual" && (
                <form
                  onSubmit={handleManualSubmit}
                  className="space-y-3.5 pt-1"
                >
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="manual-code"
                      className="text-xs font-bold text-foreground"
                    >
                      {mode === "admin"
                        ? "Kode Reservasi Tiket"
                        : "Kode Ruangan / Tiket"}
                    </Label>
                    <Input
                      id="manual-code"
                      placeholder={
                        mode === "admin"
                          ? "UCH-2026-0001"
                          : "coworking-space-hall atau UCH-2026-0001"
                      }
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="h-10 sm:h-11 rounded-xl text-xs font-mono font-bold"
                      autoFocus
                    />
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                      Ketikkan kode yang tertera pada tiket fisik atau QR code.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="flex-1 rounded-xl border-border text-xs h-10 sm:h-11 cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !manualInput.trim()}
                      className="flex-1 h-10 sm:h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md cursor-pointer"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-1.5 sm:mr-2" />
                          Memvalidasi...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1.5 sm:mr-2" />
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
