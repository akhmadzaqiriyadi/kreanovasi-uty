"use client";

import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Download,
  LogIn,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { EventItem } from "@/config/events";
import { useAuth } from "@/context/auth-context";
import {
  useEventDetailQuery,
  useMyEventRegistrationQuery,
} from "@/hooks/use-event-queries";
import { getSafeImageUrl } from "@/lib/image-utils";
import { EventRegistrationModal } from "./event-registration-modal";

interface EventDetailContentProps {
  event: EventItem;
}

export function EventDetailContent({
  event: initialEvent,
}: EventDetailContentProps) {
  const { isLoggedIn, openLoginModal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Live event query for up-to-date quota and status
  const { data: liveData } = useEventDetailQuery(initialEvent.slug);
  const { data: myRegistration } = useMyEventRegistrationQuery(
    initialEvent.slug,
    isLoggedIn,
  );

  const event = liveData
    ? {
        ...initialEvent,
        title: liveData.title || initialEvent.title,
        description: liveData.description || initialEvent.description,
        longDescription:
          liveData.long_description || initialEvent.longDescription,
        coverImage: liveData.cover_image || initialEvent.coverImage,
        quota: {
          total: liveData.quota_total,
          filled: liveData.quota_filled,
          status: liveData.quota_status,
          statusLabel: liveData.quota_status_label,
        },
        fee: liveData.fee || initialEvent.fee,
        isFree: liveData.is_free,
        price: liveData.price,
        requiresApproval: liveData.requires_approval,
      }
    : initialEvent;

  // Check if event has passed
  const isPast = (() => {
    try {
      const eventDate = new Date(
        `${initialEvent.date.year}-${initialEvent.date.month === "SEP" ? "09" : initialEvent.date.month === "OKT" ? "10" : "11"}-${initialEvent.date.day}`,
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today;
    } catch {
      return false;
    }
  })();

  const isFull = event.quota?.status === "full";
  const quotaPercent = event.quota
    ? Math.min(100, Math.round((event.quota.filled / event.quota.total) * 100))
    : 0;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Tautan Disalin", {
          description: "Tautan agenda berhasil disalin ke papan klip.",
        });
      } catch {
        toast.error("Gagal menyalin tautan");
      }
    }
  };

  const handleDownloadIcs = () => {
    const calendarEvent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//UTY Creative Hub//Events//ID",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location.name}${event.location.room ? `, ${event.location.room}` : ""}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([calendarEvent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Jadwal Diunduh", {
      description: "File kalender (.ics) berhasil disimpan ke perangkat Anda.",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 sm:py-16 space-y-12 relative z-10">
      {/* Attendance / Registered Alert Banner */}
      {myRegistration && (
        <div className="p-4 sm:p-5 rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              {myRegistration.status === "attended" ? (
                <Award className="h-5 w-5" />
              ) : myRegistration.status === "approved" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : myRegistration.status === "needs_revision" ? (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {myRegistration.status === "attended"
                  ? "Anda Telah Hadir di Acara Ini 🎉"
                  : myRegistration.status === "approved"
                    ? "Anda Telah Terdaftar (E-Tiket Aktif)"
                    : myRegistration.status === "needs_revision"
                      ? "Pendaftaran Memerlukan Revisi Berkas"
                      : "Pendaftaran Sedang Diverifikasi Panitia"}
              </p>
              <p className="text-xs text-muted-foreground">
                Kode Tiket:{" "}
                <span className="font-mono font-bold text-foreground">
                  {myRegistration.registration_code}
                </span>{" "}
                • Atas Nama: {myRegistration.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {myRegistration.status === "approved" && (
              <Button
                size="sm"
                onClick={() => setIsTicketModalOpen(true)}
                className="rounded-xl text-xs h-9 px-4 gap-1.5"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Lihat Barcode E-Tiket</span>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 px-4"
            >
              <Link href="/my-events">Kelola di Tiket Saya</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main Grid: Left 8 Cols (Details), Right 4 Cols (Sidebar Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Detailed Content (8 cols) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* Hero Banner / Cover Image */}
          {event.coverImage && (
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/80 shadow-md bg-muted">
              <Image
                src={getSafeImageUrl(event.coverImage)}
                alt={event.title}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Section: Overview & Long Description */}
          <section aria-labelledby="about-event-heading" className="space-y-4">
            <h2
              id="about-event-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
            >
              Tentang Agenda
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
              <p>{event.longDescription || event.description}</p>
            </div>
          </section>

          {/* Section: Rundown Acara */}
          {event.rundown && event.rundown.length > 0 && (
            <section
              aria-labelledby="rundown-heading"
              className="space-y-6 pt-4 border-t border-border/60"
            >
              <div className="space-y-1">
                <h2
                  id="rundown-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                >
                  Susunan Rundown Acara
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Jadwal rangkaian kegiatan terperinci selama berlangsungnya
                  sesi.
                </p>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/80">
                {event.rundown.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-4 pl-8 group"
                  >
                    <div className="absolute left-2 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />
                    <div className="flex-1 rounded-2xl p-4 bg-muted/40 border border-border/60 space-y-1 transition-all group-hover:border-primary/40 group-hover:bg-muted/60">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-primary dark:text-blue-300">
                          {item.time} WIB
                        </span>
                        {item.speaker && (
                          <span className="text-[11px] font-semibold text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md border border-border/40">
                            {item.speaker}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {item.activity}
                      </h3>
                      {item.details && (
                        <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Pembicara & Narasumber */}
          {event.speakers && event.speakers.length > 0 && (
            <section
              aria-labelledby="speakers-heading"
              className="space-y-6 pt-4 border-t border-border/60"
            >
              <div className="space-y-1">
                <h2
                  id="speakers-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                >
                  Narasumber & Mentor Ahli
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Para pakar, praktisi industri, dan akademisi yang akan
                  membimbing Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {speaker.name}
                      </h4>
                      <p className="text-xs text-primary font-medium truncate">
                        {speaker.role}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {speaker.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Benefits & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/60">
            {event.benefits && event.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Fasilitas & Manfaat</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {event.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.prerequisites && event.prerequisites.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Persyaratan Peserta</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {event.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Registration Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <Card className="rounded-2xl border-border/80 shadow-xs overflow-hidden">
            {event.coverImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-muted">
                <Image
                  src={getSafeImageUrl(event.coverImage)}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            )}
            <CardHeader className="bg-muted/40 pb-4 border-b border-border/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Biaya Registrasi
              </span>
              <CardTitle className="text-xl sm:text-2xl font-extrabold text-foreground">
                {event.fee || "Gratis"}
              </CardTitle>
              {event.registrationDeadline && (
                <p className="text-xs text-muted-foreground pt-1">
                  Batas Pendaftaran:{" "}
                  <span className="font-medium text-foreground">
                    {event.registrationDeadline}
                  </span>
                </p>
              )}
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Quota Progress */}
              {event.quota && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      Ketersediaan Kursi
                    </span>
                    <span className="font-bold text-foreground">
                      {event.quota.filled} / {event.quota.total} Peserta
                    </span>
                  </div>
                  <Progress value={quotaPercent} className="h-2 rounded-full" />
                  <p className="text-[11px] text-muted-foreground text-right">
                    {event.quota.total - event.quota.filled > 0
                      ? `Tersisa ${event.quota.total - event.quota.filled} kursi`
                      : "Kuota telah terpenuhi"}
                  </p>
                </div>
              )}

              {/* Smart Context-Aware CTA Button */}
              {isPast ? (
                <Button
                  type="button"
                  disabled
                  className="w-full h-11 text-xs font-semibold rounded-xl bg-muted text-muted-foreground cursor-not-allowed"
                >
                  Acara Telah Selesai
                </Button>
              ) : !isLoggedIn ? (
                <Button
                  type="button"
                  onClick={openLoginModal}
                  className="w-full h-11 text-xs sm:text-sm font-semibold rounded-xl shadow-xs gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Masuk untuk Mendaftar</span>
                </Button>
              ) : myRegistration ? (
                myRegistration.status === "approved" ? (
                  <Button
                    type="button"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full h-11 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Lihat E-Tiket Saya</span>
                  </Button>
                ) : myRegistration.status === "needs_revision" ? (
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full h-11 text-xs sm:text-sm font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs gap-1.5"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Perlu Revisi Berkas / Bukti</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full h-11 text-xs sm:text-sm font-semibold rounded-xl border-primary/40 text-primary gap-1.5"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Menunggu Verifikasi Admin</span>
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  disabled={isFull}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-11 text-xs sm:text-sm font-semibold rounded-xl shadow-xs"
                >
                  {isFull ? "Kuota Penuh" : "Daftar Sekarang"}
                </Button>
              )}

              {/* Secondary Utility Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadIcs}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Ke Kalender</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Bagikan</span>
                </Button>
              </div>

              {/* Location details */}
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-foreground">
                      {event.location.name}
                    </p>
                    {event.location.room && (
                      <p className="text-muted-foreground">
                        {event.location.room}
                      </p>
                    )}
                    {event.location.address && (
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        {event.location.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              {event.contactPerson && (
                <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
                  <span className="font-semibold text-foreground block">
                    Narahubung Kegiatan:
                  </span>
                  <p className="text-muted-foreground font-medium">
                    {event.contactPerson.name} ({event.contactPerson.role})
                  </p>
                  <div className="flex flex-col gap-1 text-[11px]">
                    <a
                      href={`https://wa.me/${event.contactPerson.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{event.contactPerson.phone} (WhatsApp)</span>
                    </a>
                    <a
                      href={`mailto:${event.contactPerson.email}`}
                      className="text-primary hover:underline flex items-center gap-1.5"
                    >
                      <Mail className="h-3 w-3" />
                      <span>{event.contactPerson.email}</span>
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <EventRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* View E-Ticket Modal Dialog */}
      {myRegistration && (
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
            <DialogHeader className="text-center space-y-1.5">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                E-Tiket Resmi UTY Creative Hub
              </span>
              <DialogTitle className="text-lg sm:text-xl font-bold">
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tunjukkan QR Code ini kepada panitia saat check-in di lokasi.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-center space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl inline-block shadow-xs border border-border/60 mx-auto">
                <QRCodeSVG
                  value={myRegistration.registration_code}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Nomor Registrasi Tiket
                </span>
                <p className="text-xl font-mono font-extrabold text-foreground tracking-wider select-all">
                  {myRegistration.registration_code}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-3.5 border border-border/50 text-xs text-left space-y-1">
                <p>
                  <strong>Peserta:</strong> {myRegistration.full_name}
                </p>
                <p>
                  <strong>Instansi:</strong> {myRegistration.institution}
                </p>
                <p>
                  <strong>Tanggal & Jam:</strong> {event.date.fullText} •{" "}
                  {event.time}
                </p>
                <p>
                  <strong>Lokasi:</strong> {event.location.name} (
                  {event.location.room || "Ruang Hub"})
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl text-xs h-9 px-4"
              >
                <Link href="/my-events">Lihat Semua Tiket</Link>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsTicketModalOpen(false)}
                className="rounded-xl text-xs h-9 px-5"
              >
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
