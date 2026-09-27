"use client";

import {
  Check,
  CheckCircle,
  Download,
  Mail,
  MapPin,
  Phone,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EventItem } from "@/config/events";
import { EventRegistrationModal } from "./event-registration-modal";

interface EventDetailContentProps {
  event: EventItem;
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Generate clean ICS calendar event string
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//UTY Creative Hub//Agenda Event//ID",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location.name} - ${event.location.address || "UTY Kampus 1"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Kalender Diunduh", {
      description: "Berkas agenda .ics telah disimpan ke perangkat Anda.",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Content Column (7 cols) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* Cover Image banner */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-muted shadow-xs">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Section: Description & Background */}
          <section aria-labelledby="about-event-heading" className="space-y-4">
            <h2
              id="about-event-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
            >
              Tentang Agenda Ini
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base text-muted-foreground leading-relaxed space-y-4">
              <p>{event.longDescription || event.description}</p>
            </div>
          </section>

          {/* Section: Rundown / Timeline */}
          {event.rundown && event.rundown.length > 0 && (
            <section
              aria-labelledby="rundown-heading"
              className="space-y-5 pt-4 border-t border-border/60"
            >
              <div className="space-y-1">
                <h2
                  id="rundown-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                >
                  Susunan Acara (Rundown)
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Jadwal alur kegiatan yang dirancang terstruktur dan tepat
                  waktu.
                </p>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 sm:before:left-3.5 before:w-0.5 before:bg-border/80">
                {event.rundown.map((item, index) => (
                  <div
                    key={`${item.time}-${index}`}
                    className="relative flex items-start gap-4 pl-8 sm:pl-9"
                  >
                    <div className="absolute left-1.5 sm:left-2 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
                    <div className="flex-1 rounded-xl border border-border/60 bg-card p-4 space-y-1.5 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-primary">
                          {item.time} WIB
                        </span>
                        {item.speaker && (
                          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                            Pemateri: {item.speaker}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">
                        {item.activity}
                      </h3>
                      {item.details && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Speakers / Mentors */}
          {event.speakers && event.speakers.length > 0 && (
            <section
              aria-labelledby="speakers-heading"
              className="space-y-4 pt-4 border-t border-border/60"
            >
              <div className="space-y-1">
                <h2
                  id="speakers-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
                >
                  Narasumber & Mentor
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Dipandu langsung oleh praktisi industri dan dosen ahli.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.name}
                    className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card p-4 sm:p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                      {speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-foreground">
                        {speaker.name}
                      </h3>
                      <p className="text-xs font-medium text-primary dark:text-blue-300">
                        {speaker.role}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
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

              {/* Registration Button */}
              <Button
                type="button"
                disabled={isFull}
                onClick={() => setIsModalOpen(true)}
                className="w-full h-11 text-sm font-semibold rounded-xl shadow-xs"
              >
                {isFull ? "Kuota Penuh" : "Daftar Sekarang"}
              </Button>

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
    </div>
  );
}
