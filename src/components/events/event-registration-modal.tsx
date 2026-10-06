"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  LogIn,
  QrCode,
  Send,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useAuth } from "@/context/auth-context";
import { useRegisterEventMutation } from "@/hooks/use-event-queries";
import apiClient from "@/lib/api-client";

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const registrationFormSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  identityNumber: z.string().min(3, "NIM / NIDN / NIK wajib diisi"),
  institution: z.string().min(2, "Program studi / instansi wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(6, "Nomor WhatsApp minimal 6 digit"),
  notes: z.string().optional().default(""),
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function EventRegistrationModal({
  event,
  isOpen,
  onOpenChange,
}: EventRegistrationModalProps) {
  const { user, isLoggedIn, openLoginModal } = useAuth();
  const registerMutation = useRegisterEventMutation(event.id);

  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("approved");
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      fullName: "",
      identityNumber: "",
      institution: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  // Dynamic answers: key -> value
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>(
    {},
  );
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>("");

  // Autofill from user profile on open/login
  useEffect(() => {
    if (user && isOpen) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        identityNumber: user.npm || user.idNumber || "",
        institution:
          user.affiliation ||
          (user.prodi
            ? `${user.prodi} - UTY`
            : "Universitas Teknologi Yogyakarta"),
        notes: "",
      });
    }
  }, [user, isOpen, reset]);

  const handleCustomAnswerChange = (key: string, value: string) => {
    setCustomAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey?: string,
    isPaymentProof = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10 MB");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      if (isPaymentProof) setIsUploadingProof(true);
      const res = await apiClient.post<{ data: { url: string } }>(
        "/uploads",
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const url = res.data?.data?.url || "";
      if (isPaymentProof) {
        setPaymentProofUrl(url);
        toast.success("Bukti pembayaran berhasil di-upload");
      } else if (fieldKey) {
        setCustomAnswers((prev) => ({ ...prev, [fieldKey]: url }));
        setUploadedFiles((prev) => [...prev, url]);
        toast.success("Berkas persyaratan berhasil di-upload");
      }
    } catch {
      toast.error("Gagal mengupload file. Silakan coba kembali.");
    } finally {
      if (isPaymentProof) setIsUploadingProof(false);
    }
  };

  const onSubmit = async (values: RegistrationFormValues) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    // Validate required custom fields
    if (event.customFieldsSchema) {
      for (const field of event.customFieldsSchema) {
        if (field.required && !customAnswers[field.key]) {
          toast.error(`Mohon lengkapi: ${field.label}`);
          return;
        }
      }
    }

    // Validate payment proof if paid event
    if (event.isFree === false && !paymentProofUrl) {
      toast.error("Wajib mengunggah bukti pembayaran / transfer.");
      return;
    }

    try {
      const res = await registerMutation.mutateAsync({
        full_name: values.fullName,
        identity_number: values.identityNumber,
        institution: values.institution,
        email: values.email,
        phone: values.phone,
        notes: values.notes,
        answers: customAnswers,
        uploaded_files: uploadedFiles,
        payment_proof_url: paymentProofUrl || undefined,
      });

      const reg = res.data;
      if (reg) {
        setRegistrationCode(reg.registration_code);
        setRegistrationStatus(reg.status);
        setIsSuccess(true);
      }
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleResetModal = () => {
    setIsSuccess(false);
    setRegistrationCode("");
    setCustomAnswers({});
    setUploadedFiles([]);
    setPaymentProofUrl("");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-xl p-4 sm:p-7 rounded-2xl sm:rounded-3xl max-h-[90dvh] overflow-y-auto">
        {!isLoggedIn ? (
          <div className="py-8 text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LogIn className="h-7 w-7" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-foreground">
                Login Diperlukan
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Untuk menjaga keabsahan data peserta dan menerbitkan e-tiket
                resmi, Anda wajib masuk menggunakan akun UTY Creative Hub.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-xl text-xs h-9 px-4"
              >
                Kembali
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  openLoginModal();
                }}
                className="rounded-xl text-xs h-9 px-6 font-semibold gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk Sekarang</span>
              </Button>
            </div>
          </div>
        ) : !isSuccess ? (
          <>
            <DialogHeader className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Formulir Pendaftaran Agenda Resmi
              </span>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {event.isFree === false
                  ? "Agenda ini berbayar. Lengkapi formulir dan sertakan bukti transfer pembayaran untuk diverifikasi panitia."
                  : "Agenda ini bebas biaya (Gratis). E-tiket dan barcode kehadiran langsung terbit secara instan setelah konfirmasi."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              {/* Profile autofill indicator */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  Identitas terhubung dengan akun:{" "}
                  <strong className="text-foreground">{user?.email}</strong>
                </span>
              </div>

              {/* Basic Details */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">
                  Nama Lengkap Sesuai Identitas *
                </Label>
                <Input
                  id="fullName"
                  required
                  {...register("fullName")}
                  placeholder="Contoh: Muhammad Farhan Pratama"
                  className="h-10 text-xs rounded-xl"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="identityNumber"
                    className="text-xs font-semibold"
                  >
                    NIM / NIDN / NIK *
                  </Label>
                  <Input
                    id="identityNumber"
                    required
                    {...register("identityNumber")}
                    placeholder="Contoh: 5210411001"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.identityNumber && (
                    <p className="text-[11px] text-destructive">
                      {errors.identityNumber.message}
                    </p>
                  )}
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
                    required
                    {...register("institution")}
                    placeholder="Contoh: Informatika UTY"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.institution && (
                    <p className="text-[11px] text-destructive">
                      {errors.institution.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Alamat Email Aktif *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    {...register("email")}
                    placeholder="nama@students.uty.ac.id"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Nomor WhatsApp *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    {...register("phone")}
                    placeholder="081234567890"
                    className="h-10 text-xs rounded-xl"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Custom Fields Section */}
              {event.customFieldsSchema &&
                event.customFieldsSchema.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>Persyaratan Khusus Agenda</span>
                    </span>

                    {event.customFieldsSchema.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <Label
                          htmlFor={field.key}
                          className="text-xs font-semibold"
                        >
                          {field.label} {field.required && "*"}
                        </Label>

                        {field.type === "select" ? (
                          <select
                            id={field.key}
                            required={field.required}
                            value={customAnswers[field.key] || ""}
                            onChange={(e) =>
                              handleCustomAnswerChange(
                                field.key,
                                e.target.value,
                              )
                            }
                            className="w-full h-10 px-3 text-xs rounded-xl border border-input bg-background text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">-- Pilih opsi --</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "textarea" ? (
                          <Textarea
                            id={field.key}
                            required={field.required}
                            rows={2}
                            value={customAnswers[field.key] || ""}
                            onChange={(e) =>
                              handleCustomAnswerChange(
                                field.key,
                                e.target.value,
                              )
                            }
                            placeholder={field.placeholder || ""}
                            className="text-xs rounded-xl resize-none"
                          />
                        ) : field.type === "file" ? (
                          <div className="space-y-1.5">
                            <Input
                              id={field.key}
                              type="file"
                              accept={field.accept || ".pdf,.png,.jpg"}
                              required={
                                field.required && !customAnswers[field.key]
                              }
                              onChange={(e) =>
                                handleFileUpload(e, field.key, false)
                              }
                              className="h-10 text-xs rounded-xl file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                            />
                            {customAnswers[field.key] && (
                              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                ✓ File berhasil diunggah
                              </p>
                            )}
                          </div>
                        ) : (
                          <Input
                            id={field.key}
                            type={field.type === "number" ? "number" : "text"}
                            required={field.required}
                            value={customAnswers[field.key] || ""}
                            onChange={(e) =>
                              handleCustomAnswerChange(
                                field.key,
                                e.target.value,
                              )
                            }
                            placeholder={field.placeholder || ""}
                            className="h-10 text-xs rounded-xl"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {/* Payment Info Section (If Event is Paid) */}
              {event.isFree === false && (
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Instruksi Pembayaran Tiket</span>
                  </div>

                  <div className="rounded-2xl p-4 bg-muted/50 border border-border/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">
                        Biaya Pendaftaran:
                      </span>
                      <span className="text-base text-primary font-bold">
                        {event.fee ||
                          (event.price
                            ? `Rp ${event.price.toLocaleString("id-ID")}`
                            : "Berbayar")}
                      </span>
                    </div>

                    {event.paymentInfo?.bank_name && (
                      <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
                        <p>
                          <strong>Bank Tujuan:</strong>{" "}
                          {event.paymentInfo.bank_name}
                        </p>
                        <p>
                          <strong>Nomor Rekening:</strong>{" "}
                          <span className="font-mono font-bold text-foreground select-all">
                            {event.paymentInfo.account_number}
                          </span>
                        </p>
                        <p>
                          <strong>Atas Nama:</strong>{" "}
                          {event.paymentInfo.account_holder}
                        </p>
                        {event.paymentInfo.instructions && (
                          <p className="text-muted-foreground pt-1 italic">
                            {event.paymentInfo.instructions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="paymentProof"
                      className="text-xs font-semibold"
                    >
                      Upload Bukti Transfer / Pembayaran *
                    </Label>
                    <Input
                      id="paymentProof"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      onChange={(e) => handleFileUpload(e, undefined, true)}
                      className="h-10 text-xs rounded-xl file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:bg-primary/10 file:text-primary"
                    />
                    {isUploadingProof && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Mengunggah
                        bukti bayar...
                      </p>
                    )}
                    {paymentProofUrl && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Bukti pembayaran berhasil diunggah
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-xs font-semibold">
                  Catatan Tambahan (Opsional)
                </Label>
                <Textarea
                  id="notes"
                  rows={2}
                  {...register("notes")}
                  placeholder="Pertanyaan untuk pemateri atau catatan kebutuhan khusus..."
                  className="text-xs rounded-xl resize-none"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl text-xs h-9 px-4 cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={registerMutation.isPending || isUploadingProof}
                  size="sm"
                  className="rounded-xl text-xs h-9 px-5 gap-1.5 cursor-pointer font-semibold shadow-xs"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Mendaftarkan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>
                        {event.isFree === false
                          ? "Kirim Bukti & Daftar"
                          : "Konfirmasi Pendaftaran"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* SUCCESS VIEW */
          <div className="py-6 text-center space-y-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">
                {registrationStatus === "approved"
                  ? "Pendaftaran Berhasil Dikonfirmasi!"
                  : "Pendaftaran Berhasil Dikirim"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {registrationStatus === "approved"
                  ? "E-tiket resmi Anda sudah aktif. Simpan kode tiket atau QR Code berikut untuk check-in kehadiran di lokasi."
                  : "Berkas/bukti pembayaran Anda telah diterima dan sedang menunggu verifikasi panitia. Status tiket dapat dipantau di menu Tiket Saya."}
              </p>
            </div>

            {/* Official Ticket Card with QR Code */}
            <div className="rounded-3xl bg-muted/40 p-5 border border-border/80 max-w-sm mx-auto text-center space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                <QrCode className="h-3.5 w-3.5" />
                <span>
                  {registrationStatus === "approved"
                    ? "E-TIKET AKTIF"
                    : "MENUNGGU VERIFIKASI"}
                </span>
              </div>

              {registrationStatus === "approved" && (
                <div className="p-3 bg-white dark:bg-zinc-950 rounded-2xl inline-block shadow-xs border border-border/50">
                  <QRCodeSVG
                    value={registrationCode}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Nomor Tiket Peserta
                </span>
                <p className="text-lg font-mono font-extrabold text-foreground tracking-wider select-all">
                  {registrationCode}
                </p>
              </div>

              <div className="text-[11px] text-muted-foreground border-t border-border/50 pt-2 space-y-0.5">
                <p className="font-semibold text-foreground">
                  {getValues("fullName") || user?.name}
                </p>
                <p>{event.title}</p>
                <p className="text-[10px]">
                  {event.date.fullText} • {event.time}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl text-xs h-9 px-5"
              >
                <Link href="/my-events">Buka Tiket Saya</Link>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleResetModal}
                className="rounded-xl text-xs h-9 px-6 font-semibold"
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
