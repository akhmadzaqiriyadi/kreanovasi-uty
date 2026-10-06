"use client";

import { Calendar, Edit2, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BackendEvent } from "@/hooks/use-event-queries";
import { getSafeImageUrl } from "@/lib/image-utils";

interface EventCatalogCardsProps {
  events: BackendEvent[];
  onEdit: (event: BackendEvent) => void;
  onDelete: (event: BackendEvent) => void;
  onSelectEvent: (eventId: string) => void;
}

export function EventCatalogCards({
  events,
  onEdit,
  onDelete,
  onSelectEvent,
}: EventCatalogCardsProps) {
  if (events.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border/80 rounded-3xl p-8 space-y-2">
        <h3 className="text-base font-bold text-foreground">
          Belum Ada Agenda Terdaftar
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Klik tombol &quot;+ Agenda Baru&quot; di atas untuk mempublikasikan
          kegiatan pertama.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((evt) => {
        const percent = evt.quota_total
          ? Math.min(
              100,
              Math.round((evt.quota_filled / evt.quota_total) * 100),
            )
          : 0;

        return (
          <Card
            key={evt.id}
            className="rounded-3xl border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Event Poster with 3:4 Aspect Container */}
              <div className="relative aspect-[3/4] w-full max-h-56 bg-muted/40 overflow-hidden">
                <Image
                  src={getSafeImageUrl(evt.cover_image || "/images/room1.jpeg")}
                  alt={evt.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
                <Badge className="absolute top-3 left-3 rounded-lg text-[10px] font-bold">
                  {evt.category_name}
                </Badge>
                <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 rounded-lg text-[10px] font-bold bg-background/80 backdrop-blur-md"
                >
                  {evt.fee || "Gratis"}
                </Badge>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                  3:4 Poster
                </div>
              </div>

              <CardHeader className="p-4 pb-2 space-y-1">
                <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                  {evt.title}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    {evt.date_full_text ||
                      `${evt.date_day} ${evt.date_month} ${evt.date_year}`}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-foreground">
                    Kuota Peserta:
                  </span>
                  <span>
                    {evt.quota_filled} / {evt.quota_total} terisi
                  </span>
                </div>

                {/* Quota Progress Bar */}
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </CardContent>
            </div>

            <div className="p-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-1.5 mt-auto">
              <div className="flex items-center gap-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Link href={`/events/${evt.slug}`} target="_blank">
                    <span>Publik</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(evt)}
                  className="rounded-xl text-xs h-7 px-2.5 gap-1 font-medium hover:text-primary hover:border-primary/40 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(evt)}
                  className="rounded-xl text-xs h-7 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  title="Hapus Agenda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              <Button
                size="sm"
                onClick={() => onSelectEvent(evt.id)}
                className="rounded-xl text-xs h-7 px-3 font-semibold cursor-pointer"
              >
                Peserta
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
