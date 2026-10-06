"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BackendEventRegistration } from "@/hooks/use-event-queries";

interface RegistrationDetailModalProps {
  registration: BackendEventRegistration | null;
  onClose: () => void;
}

export function RegistrationDetailModal({
  registration,
  onClose,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  return (
    <Dialog
      open={Boolean(registration)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-lg p-5 sm:p-7 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Detail Pendaftar Agenda
          </span>
          <DialogTitle className="text-lg font-bold">
            {registration.full_name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            Kode: {registration.registration_code} •{" "}
            {registration.event_title || "Agenda Resmi"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Identity Info */}
          <div className="rounded-2xl bg-muted/40 p-3.5 border border-border/60 space-y-1.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  Institusi / Prodi:
                </span>
                <strong className="text-foreground">
                  {registration.institution}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  NPM / Identitas:
                </span>
                <strong className="text-foreground">
                  {registration.identity_number || "-"}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  Email:
                </span>
                <strong className="text-foreground">
                  {registration.email}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  WhatsApp:
                </span>
                <strong className="text-foreground">
                  {registration.phone}
                </strong>
              </div>
            </div>
          </div>

          {/* Dynamic Answers */}
          {registration.answers &&
            Object.keys(registration.answers).length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Jawaban Kuesioner Khusus:
                </span>
                <div className="rounded-2xl border border-border/70 p-3 space-y-2 bg-card/60">
                  {Object.entries(registration.answers).map(([key, val]) => (
                    <div
                      key={key}
                      className="border-b border-border/40 pb-1.5 last:border-none last:pb-0"
                    >
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-xs text-foreground font-medium">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Payment Proof */}
          {registration.payment_proof_url ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Bukti Pembayaran / Transfer:
              </span>
              <div className="rounded-2xl border border-border/70 overflow-hidden bg-muted/20 p-2 text-center">
                <Image
                  src={registration.payment_proof_url}
                  alt="Bukti Transfer"
                  width={400}
                  height={300}
                  unoptimized
                  className="max-h-60 w-auto mx-auto rounded-xl object-contain border border-border/50"
                />
                <a
                  href={registration.payment_proof_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-2 font-medium"
                >
                  <span>Buka Bukti Gambar Penuh</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>
                Agenda Gratis / Tidak memerlukan bukti transfer bayar.
              </span>
            </div>
          )}

          {/* Notes */}
          {registration.notes && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground">
                Catatan Peserta:
              </span>
              <p className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-xs">
                {registration.notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
