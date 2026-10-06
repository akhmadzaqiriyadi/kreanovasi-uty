"use client";

import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type BackendEventRegistration,
  useEventCheckInMutation,
} from "@/hooks/use-event-queries";
import { cn } from "@/lib/utils";

interface EventCheckInScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventCheckInScannerModal({
  open,
  onOpenChange,
}: EventCheckInScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("manual");
  const [lastCheckedIn, setLastCheckedIn] =
    useState<BackendEventRegistration | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    register: registerCheckIn,
    handleSubmit: handleCheckInSubmit,
    reset: resetCheckIn,
    watch: watchCheckIn,
  } = useForm<{ manualCode: string }>({
    defaultValues: { manualCode: "" },
  });
  const currentManualCode = watchCheckIn("manualCode");

  const checkInMutation = useEventCheckInMutation();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const handleProcessCode = async (code: string) => {
    if (!code || isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const res = await checkInMutation.mutateAsync(code.trim());
      if (res.data) {
        setLastCheckedIn(res.data);
        toast.success(`Check-in Berhasil: ${res.data.full_name}`);
      }
    } catch {
      // toast handled by mutation
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    if (!open || activeTab !== "camera") {
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        scanner
          .stop()
          .catch(() => {})
          .then(() => scanner.clear());
      }
      return;
    }

    const scannerElementId = "event-checkin-scanner-box";
    const timer = setTimeout(() => {
      if (isCancelled) return;
      const el = document.getElementById(scannerElementId);
      if (!el) return;

      try {
        const qrScanner = new Html5Qrcode(scannerElementId);
        html5QrCodeRef.current = qrScanner;

        qrScanner
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              handleProcessCode(decodedText);
            },
            () => {},
          )
          .catch(() => {
            setCameraError(
              "Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan input manual kode tiket.",
            );
          });
      } catch {
        // Element not ready or camera error
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        scanner
          .stop()
          .catch(() => {})
          .then(() => scanner.clear());
      }
    };
  }, [open, activeTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
            <QrCode className="w-3.5 h-3.5" />
            <span>Check-in Hari H Acara</span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Scan Tiket Barcode Peserta
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Arahkan kamera ke QR tiket peserta atau masukkan kode tiket secara
            manual.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector: Kamera vs Manual */}
        <div className="flex rounded-xl bg-muted p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              activeTab === "camera"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Kamera Barcode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              activeTab === "manual"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Ketik Manual
          </button>
        </div>

        {activeTab === "camera" ? (
          <div className="space-y-3">
            <div
              id="event-checkin-scanner-box"
              className="w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-border/80 bg-zinc-950"
            />
            {cameraError && (
              <p className="text-[11px] text-amber-600 text-center">
                {cameraError}
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleCheckInSubmit((data) => {
              handleProcessCode(data.manualCode);
              resetCheckIn();
            })}
            className="space-y-3 py-2"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Kode Tiket Peserta (Contoh: UCH-EVT-CTALK-2026)
              </Label>
              <Input
                {...registerCheckIn("manualCode", { required: true })}
                placeholder="UCH-EVT-..."
                className="h-10 text-xs font-mono font-bold tracking-wider rounded-xl uppercase"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={checkInMutation.isPending || !currentManualCode?.trim()}
              className="w-full rounded-xl text-xs font-bold h-10 cursor-pointer"
            >
              {checkInMutation.isPending
                ? "Memverifikasi..."
                : "Verifikasi Tiket"}
            </Button>
          </form>
        )}

        {/* Checked In Confirmation Banner */}
        {lastCheckedIn && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kehadiran Terkonfirmasi!</span>
            </div>
            <p className="text-foreground">
              <strong>{lastCheckedIn.full_name}</strong> (
              {lastCheckedIn.institution})
            </p>
            <p className="text-muted-foreground text-[11px]">
              Kode: {lastCheckedIn.registration_code}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl text-xs cursor-pointer"
          >
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
