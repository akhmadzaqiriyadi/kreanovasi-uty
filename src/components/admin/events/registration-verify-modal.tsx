"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BackendEventRegistration } from "@/hooks/use-event-queries";
import { cn } from "@/lib/utils";

interface RegistrationVerifyModalProps {
  modalData: {
    registration: BackendEventRegistration;
    type: "approve" | "needs_revision" | "reject";
  } | null;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isPending: boolean;
}

export function RegistrationVerifyModal({
  modalData,
  adminNotes,
  onAdminNotesChange,
  onConfirm,
  onClose,
  isPending,
}: RegistrationVerifyModalProps) {
  if (!modalData) return null;

  const { registration, type } = modalData;

  return (
    <Dialog
      open={Boolean(modalData)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="space-y-1">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              type === "approve" && "text-emerald-600",
              type === "needs_revision" && "text-amber-600",
              type === "reject" && "text-red-600",
            )}
          >
            {type === "approve" && "Konfirmasi Persetujuan"}
            {type === "needs_revision" && "Minta Revisi Berkas"}
            {type === "reject" && "Tolak Pendaftaran"}
          </span>
          <DialogTitle className="text-lg font-bold">
            {type === "approve" && "Setujui Pendaftaran Peserta?"}
            {type === "needs_revision" && "Kirim Permintaan Revisi?"}
            {type === "reject" && "Tolak Pendaftaran Peserta?"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {type === "approve" &&
              "Peserta akan langsung mendapatkan e-tiket aktif dan kode QR barcode resmi."}
            {type === "needs_revision" &&
              "Berikan catatan instruksi revisi yang jelas agar peserta dapat mengunggah ulang bukti transfer atau berkas."}
            {type === "reject" &&
              "Pendaftaran akan dibatalkan permanen dan kursi kuota akan dikembalikan."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
            <p className="font-bold text-foreground">
              {registration.full_name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {registration.institution} • {registration.registration_code}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Catatan Admin{" "}
              {type === "needs_revision" && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              rows={3}
              placeholder={
                type === "needs_revision"
                  ? "Tuliskan apa yang perlu direvisi oleh peserta..."
                  : "Catatan internal admin (opsional)..."
              }
              className="text-xs rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs cursor-pointer"
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={
              isPending || (type === "needs_revision" && !adminNotes.trim())
            }
            className={cn(
              "rounded-xl text-xs font-bold cursor-pointer",
              type === "approve" &&
                "bg-emerald-600 hover:bg-emerald-700 text-white",
              type === "needs_revision" &&
                "bg-amber-600 hover:bg-amber-700 text-white",
              type === "reject" && "bg-red-600 hover:bg-red-700 text-white",
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Konfirmasi</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
