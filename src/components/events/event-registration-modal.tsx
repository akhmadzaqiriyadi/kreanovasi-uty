"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import type { EventItem } from "@/config/events";

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventRegistrationModal({
  event,
  isOpen,
  onOpenChange,
}: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    identityNumber: "",
    institution: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const code = `UCH-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
      setRegistrationCode(code);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Pendaftaran Berhasil Dikonfirmasi", {
        description: `Kode registrasi Anda: ${code}. Informasi lengkap dikirim ke ${formData.email}`,
      });
    }, 600);
  };

  const handleResetModal = () => {
    setIsSuccess(false);
    setRegistrationCode("");
    setFormData({
      fullName: "",
      identityNumber: "",
      institution: "",
      email: "",
      phone: "",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 sm:p-7 rounded-2xl">
        {!isSuccess ? (
          <>
            <DialogHeader className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Formulir Pendaftaran Agenda
              </span>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Lengkapi identitas Anda untuk memesan kursi peserta. Konfirmasi
                dan e-tiket akan dikirimkan ke email dan nomor WhatsApp
                terdaftar.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">
                  Nama Lengkap Sesuai Identitas *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Contoh: Muhammad Farhan Pratama"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="identityNumber"
                    className="text-xs font-semibold"
                  >
                    NIM / NIDN / No. KTP *
                  </Label>
                  <Input
                    id="identityNumber"
                    name="identityNumber"
                    required
                    value={formData.identityNumber}
                    onChange={handleChange}
                    placeholder="Contoh: 5210411001"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="institution"
                    className="text-xs font-semibold"
                  >
                    Program Studi / Instansi *
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Contoh: Informatika UTY"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Alamat Email Aktif *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@students.uty.ac.id"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">
                  Catatan / Ekspektasi Mengikuti Acara
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Hal yang ingin Anda pelajari atau pertanyaan untuk pemateri (opsional)..."
                  className="text-xs rounded-xl resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl text-xs h-9 px-4"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="rounded-xl text-xs h-9 px-5 gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Konfirmasi Pendaftaran</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                Pendaftaran Berhasil Diterima
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Terima kasih telah mendaftar pada agenda{" "}
                <span className="font-semibold text-foreground">
                  {event.title}
                </span>
                .
              </p>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 border border-border/60 max-w-xs mx-auto text-center space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Kode Registrasi Peserta
              </span>
              <p className="text-base font-mono font-bold text-primary tracking-wide">
                {registrationCode}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Tunjukkan kode atau e-tiket ini saat check-in di lokasi
                kegiatan.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handleResetModal}
                className="rounded-xl text-xs h-9 px-6"
              >
                Selesai
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
