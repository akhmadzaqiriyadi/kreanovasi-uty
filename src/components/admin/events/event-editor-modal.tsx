"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, ImageIcon, Loader2, Lock, Unlock, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type BackendEvent,
  type EventRundownItem,
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/hooks/use-event-queries";
import apiClient from "@/lib/api-client";
import { getSafeImageUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import { EventDatePicker } from "./event-date-picker";
import { EventRundownManager } from "./event-rundown-manager";

const PRESET_COVERS = [
  { label: "Coworking Space", url: "/images/coworking-space.jpg" },
  { label: "Lab FastLab", url: "/images/room1.jpeg" },
  { label: "Kolaborasi", url: "/images/room2.jpg" },
  { label: "Studio Desain", url: "/images/room3.jpg" },
];

export const PRESET_CATEGORIES = [
  "Demo Day & Pitching",
  "Hands-on Workshop",
  "Klinik & Mentoring",
  "Seminar & Tech Talk",
  "Masterclass & Bootcamp",
  "Kompetisi & Hackathon",
  "Webinar & Kuliah Umum",
];

const eventEditorSchema = z.object({
  title: z.string().min(3, "Judul agenda minimal 3 karakter"),
  slug: z.string().min(2, "Slug agenda minimal 2 karakter"),
  category_name: z.string().min(1, "Kategori wajib diisi"),
  description: z.string().min(1, "Deskripsi singkat wajib diisi"),
  long_description: z.string(),
  date_full_text: z.string().min(1, "Tanggal agenda wajib diisi"),
  date_day: z.string(),
  date_month: z.string(),
  date_year: z.string(),
  time: z.string().min(1, "Waktu sesi wajib diisi"),
  location_type: z.enum(["offline", "online", "hybrid"]),
  location_name: z.string().min(1, "Lokasi agenda wajib diisi"),
  location_room: z.string(),
  cover_image: z.string().min(1, "Cover image wajib diisi"),
  quota_total: z.number().min(1, "Total kuota minimal 1 peserta"),
  fee: z.string(),
  is_free: z.boolean(),
  price: z.number(),
  requires_approval: z.boolean(),
  status: z.string(),
});

type EventEditorFormValues = z.infer<typeof eventEditorSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface EventEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: BackendEvent | null;
}

export function EventEditorModal({
  open,
  onOpenChange,
  eventToEdit,
}: EventEditorModalProps) {
  const isEditing = Boolean(eventToEdit);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [rundownItems, setRundownItems] = useState<EventRundownItem[]>([]);

  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation(eventToEdit?.id || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventEditorFormValues>({
    resolver: zodResolver(eventEditorSchema),
    defaultValues: {
      title: "",
      slug: "",
      category_name: "Demo Day & Pitching",
      description: "",
      long_description: "",
      date_full_text: "Kamis, 15 Oktober 2026",
      date_day: "15",
      date_month: "OKT",
      date_year: "2026",
      time: "09:00 - 13:00 WIB",
      location_name: "Laboratorium FastLab UCH Lt. 2",
      location_room: "Ruang Riset AI & IoT",
      location_type: "offline",
      cover_image: "/images/coworking-space.jpg",
      quota_total: 50,
      fee: "Gratis",
      is_free: true,
      price: 0,
      requires_approval: false,
      status: "published",
    },
  });

  // Keep form and rundown in sync when modal opens or eventToEdit changes
  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        reset({
          title: eventToEdit.title || "",
          slug: eventToEdit.slug || "",
          category_name: eventToEdit.category_name || "Demo Day & Pitching",
          description: eventToEdit.description || "",
          long_description: eventToEdit.long_description || "",
          date_full_text: eventToEdit.date_full_text || "",
          date_day: eventToEdit.date_day || "15",
          date_month: eventToEdit.date_month || "OKT",
          date_year: eventToEdit.date_year || "2026",
          time: eventToEdit.time || "09:00 - 13:00 WIB",
          location_name: eventToEdit.location_name || "",
          location_room: eventToEdit.location_room || "",
          location_type: (eventToEdit.location_type as "offline" | "online" | "hybrid") || "offline",
          cover_image: eventToEdit.cover_image || "/images/coworking-space.jpg",
          quota_total: eventToEdit.quota_total || 50,
          fee: eventToEdit.fee || "Gratis",
          is_free: eventToEdit.is_free ?? true,
          price: eventToEdit.price || 0,
          requires_approval: eventToEdit.requires_approval ?? false,
          status: eventToEdit.status || "published",
        });
        setAutoSlug(false);
        setRundownItems(
          Array.isArray(eventToEdit.rundown) ? eventToEdit.rundown : [],
        );
      } else {
        reset({
          title: "",
          slug: "",
          category_name: "Demo Day & Pitching",
          description: "",
          long_description: "",
          date_full_text: "Kamis, 15 Oktober 2026",
          date_day: "15",
          date_month: "OKT",
          date_year: "2026",
          time: "09:00 - 13:00 WIB",
          location_name: "Laboratorium FastLab UCH Lt. 2",
          location_room: "Ruang Riset AI & IoT",
          location_type: "offline",
          cover_image: "/images/coworking-space.jpg",
          quota_total: 50,
          fee: "Gratis",
          is_free: true,
          price: 0,
          requires_approval: false,
          status: "published",
        });
        setAutoSlug(true);
        setRundownItems([]);
      }
    }
  }, [open, eventToEdit, reset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file gambar maksimal 10 MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingCover(true);
      const res = await apiClient.post<{ data: { url: string } }>(
        "/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const uploadedUrl = res.data?.data?.url;
      if (uploadedUrl) {
        setValue("cover_image", uploadedUrl, { shouldValidate: true });
        toast.success("Foto sampul berhasil diunggah");
      }
    } catch {
      toast.error("Gagal mengunggah foto sampul. Silakan coba kembali.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix = "") => {
    const current = watch("long_description") || "";
    setValue("long_description", `${current}\n${prefix}${suffix}`, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: EventEditorFormValues) => {
    const payload: Partial<BackendEvent> = {
      ...values,
      quota_total: Number(values.quota_total),
      price: Number(values.price || 0),
      category_variant: "primary",
      status: (values.status as BackendEvent["status"]) || "published",
      rundown: rundownItems,
    };

    if (isEditing) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const currentCover = watch("cover_image");
  const currentSlug = watch("slug");
  const currentDateFullText = watch("date_full_text");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-3xl p-5 sm:p-7 rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {isEditing ? "Mode Edit Agenda" : "Agenda Baru UCH"}
          </span>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Perbarui Informasi Agenda" : "Publikasikan Event UCH"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Ubah data agenda, kelola kuota, perbarui slug, atur rundown, atau ganti foto sampul poster."
              : "Lengkapi formulir untuk mempublikasikan agenda baru di portal UTY Creative Hub."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 text-xs"
        >
          {/* Cover Poster Image (3:4 Ratio Preview) */}
          <div className="space-y-3 rounded-2xl bg-muted/30 p-3.5 border border-border/60">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" />
                <span>Foto Sampul / Poster Resmi *</span>
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingCover}
                onClick={() => fileInputRef.current?.click()}
                className="h-7 rounded-lg text-xs gap-1.5 cursor-pointer font-medium"
              >
                {isUploadingCover ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Mengunggah...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3" />
                    <span>Upload Poster</span>
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Preview Poster */}
              <div className="sm:col-span-4 flex justify-center">
                {currentCover ? (
                  <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-xl overflow-hidden border border-border/80 bg-muted shadow-sm">
                    <Image
                      src={getSafeImageUrl(currentCover)}
                      alt="Preview Poster"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[3/4] w-28 sm:w-32 rounded-xl border border-dashed border-border/80 bg-muted/40 flex items-center justify-center text-muted-foreground text-[10px]">
                    Belum ada poster
                  </div>
                )}
              </div>

              {/* Presets and URL input */}
              <div className="sm:col-span-8 space-y-2">
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground font-medium block">
                    Pilihan Poster Cepat:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COVERS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() =>
                          setValue("cover_image", preset.url, {
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-md border transition-colors cursor-pointer",
                          currentCover === preset.url
                            ? "bg-primary text-primary-foreground border-primary font-bold"
                            : "bg-background border-border/80 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Input
                    {...register("cover_image")}
                    placeholder="Atau masukkan tautan gambar poster (https://...)"
                    className="h-8 text-[11px] rounded-lg font-mono"
                  />
                  {errors.cover_image && (
                    <p className="text-[11px] text-destructive">
                      {errors.cover_image.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Title & Dynamic Slug */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Judul Agenda *</Label>
              <Input
                required
                {...register("title", {
                  onChange: (e) => {
                    const titleVal = e.target.value;
                    if (autoSlug) {
                      setValue("slug", slugify(titleVal), {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
                placeholder="Contoh: AI & IoT FastLab Bootcamp 2026"
                className="h-10 text-xs rounded-xl"
              />
              {errors.title && (
                <p className="text-[11px] text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug Editor & Dynamic Sync */}
            <div className="space-y-1.5 rounded-xl bg-muted/20 p-2.5 border border-border/60">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  URL Slug Agenda:
                </Label>
                <button
                  type="button"
                  onClick={() => setAutoSlug((prev) => !prev)}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {autoSlug ? (
                    <>
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Auto-Slug Aktif</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-amber-500" />
                      <span className="text-amber-500">Slug Manual</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  {...register("slug")}
                  readOnly={autoSlug}
                  placeholder="ai-iot-fastlab-bootcamp-2026"
                  className={cn(
                    "h-8 text-xs rounded-lg font-mono",
                    autoSlug && "bg-muted/60 cursor-default",
                  )}
                />
              </div>

              <p className="text-[10px] text-muted-foreground truncate font-mono">
                Akan dapat diakses publik di:{" "}
                <span className="text-primary font-semibold">
                  /events/{currentSlug || "slug-agenda"}
                </span>
              </p>
              {errors.slug && (
                <p className="text-[11px] text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Category Management & Presets */}
          <div className="space-y-2 rounded-2xl bg-muted/20 p-3 sm:p-4 border border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <Label className="text-xs font-semibold">Kategori Agenda *</Label>
              <span className="text-[11px] text-muted-foreground">
                Klik preset cepat atau ketik kategori kustom
              </span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PRESET_CATEGORIES.map((cat) => {
                const isSelected = watch("category_name") === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setValue("category_name", cat, { shouldValidate: true })
                    }
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Input
                  {...register("category_name")}
                  placeholder="Kategori spesifik / kustom..."
                  className="h-10 text-xs rounded-xl"
                />
                {errors.category_name && (
                  <p className="text-[11px] text-destructive">
                    {errors.category_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Select
                  value={watch("status") || "published"}
                  onValueChange={(val) =>
                    setValue("status", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">
                      Diterbitkan (Publik)
                    </SelectItem>
                    <SelectItem value="draft">Draf (Internal)</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date Picker (Atomic) & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <EventDatePicker
              dateFullText={currentDateFullText}
              error={errors.date_full_text?.message}
              onDateChange={({
                date_full_text,
                date_day,
                date_month,
                date_year,
              }) => {
                setValue("date_full_text", date_full_text, {
                  shouldValidate: true,
                });
                setValue("date_day", date_day);
                setValue("date_month", date_month);
                setValue("date_year", date_year);
              }}
            />

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Waktu Sesi *</span>
              </Label>
              <Input
                {...register("time")}
                placeholder="09:00 - 13:00 WIB"
                className="h-10 text-xs rounded-xl"
              />
              {errors.time && (
                <p className="text-[11px] text-destructive">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Format Pelaksanaan & Lokasi */}
          <div className="space-y-3 rounded-2xl bg-muted/20 p-3 sm:p-4 border border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Format Pelaksanaan *</Label>
                <Select
                  value={watch("location_type") || "offline"}
                  onValueChange={(val: "offline" | "online" | "hybrid") =>
                    setValue("location_type", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl w-full">
                    <SelectValue placeholder="Pilih format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Tatap Muka (Offline)</SelectItem>
                    <SelectItem value="online">Daring (Online)</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Tatap Muka & Daring)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-semibold">
                  {watch("location_type") === "online"
                    ? "Platform / Tautan Daring *"
                    : "Lokasi / Gedung *"}
                </Label>
                <Input
                  {...register("location_name")}
                  placeholder={
                    watch("location_type") === "online"
                      ? "Zoom Meeting / Google Meet (Tautan dikirim via tiket/email)"
                      : watch("location_type") === "hybrid"
                      ? "Laboratorium FastLab UCH Lt. 2 & Zoom Meeting"
                      : "Laboratorium FastLab UCH Lt. 2"
                  }
                  className="h-10 text-xs rounded-xl"
                />
                {errors.location_name && (
                  <p className="text-[11px] text-destructive">
                    {errors.location_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {watch("location_type") === "online"
                  ? "Informasi Tambahan / Passcode (Opsional)"
                  : "Ruangan Spesifik (Opsional)"}
              </Label>
              <Input
                {...register("location_room")}
                placeholder={
                  watch("location_type") === "online"
                    ? "Meeting ID: 890 1234 5678 / Pass: UCH2026"
                    : "Ruang Riset AI & IoT / Auditorium Kampus 1"
                }
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Quota, Pricing & Approval */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Total Kuota *</Label>
              <Input
                type="number"
                required
                {...register("quota_total", { valueAsNumber: true })}
                className="h-10 text-xs rounded-xl"
              />
              {errors.quota_total && (
                <p className="text-[11px] text-destructive">
                  {errors.quota_total.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Label Biaya</Label>
              <Input
                {...register("fee")}
                placeholder="Gratis atau Rp 50.000"
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-xl p-3 bg-muted/30 border border-border/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold cursor-pointer">
                  Agenda Gratis?
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Tanpa biaya pendaftaran
                </p>
              </div>
              <Switch
                checked={watch("is_free")}
                onCheckedChange={(checked) => {
                  setValue("is_free", checked, { shouldValidate: true });
                  if (checked) {
                    setValue("fee", "Gratis");
                    setValue("price", 0);
                  } else if (watch("fee") === "Gratis") {
                    setValue("fee", "Rp 50.000");
                    setValue("price", 50000);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl p-3 bg-muted/30 border border-border/60">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold cursor-pointer">
                  Perlu Verifikasi Admin?
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Persetujuan manual sebelum tiket aktif
                </p>
              </div>
              <Switch
                checked={watch("requires_approval")}
                onCheckedChange={(checked) =>
                  setValue("requires_approval", checked, {
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>

          {/* Atomic Rundown Manager */}
          <EventRundownManager
            rundown={rundownItems}
            onChange={setRundownItems}
          />

          {/* Short Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ringkasan Singkat (Kartu & Meta) *
            </Label>
            <Textarea
              {...register("description")}
              rows={2}
              placeholder="Jelaskan ringkasan 1-2 kalimat untuk preview di kartu dan banner agenda..."
              className="text-xs rounded-xl resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Rich Text / Long Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <Label className="text-xs font-semibold">
                Deskripsi Lengkap & Format Acara (Rich Text / Markdown)
              </Label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertMarkdown("### ")}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-muted hover:bg-muted/80 text-foreground font-mono"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("**Teks Tebal**")}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-muted hover:bg-muted/80 text-foreground font-bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("- Poin Pembahasan")}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-muted hover:bg-muted/80 text-foreground"
                >
                  • List
                </button>
              </div>
            </div>
            <Textarea
              {...register("long_description")}
              rows={5}
              placeholder="Tuliskan deskripsi lengkap agenda, latar belakang, materi pembelajaran, pembicara, fasilitas, atau instruksi khusus untuk peserta..."
              className="text-xs rounded-xl font-sans leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground">
              Mendukung paragraf baris baru, bullet points, dan format Markdown
              yang akan tampil rapi di halaman detail acara.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="rounded-xl text-xs font-bold px-6 cursor-pointer"
            >
              {isPending
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Publikasikan Agenda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
