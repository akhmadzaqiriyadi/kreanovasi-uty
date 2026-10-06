"use client";

import { Clock, ListPlus, Sparkles, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventRundownItem } from "@/hooks/use-event-queries";

interface EventRundownManagerProps {
  rundown: EventRundownItem[];
  onChange: (rundown: EventRundownItem[]) => void;
}

const TEMPLATES: { label: string; items: EventRundownItem[] }[] = [
  {
    label: "Seminar Singkat (3 Sesi)",
    items: [
      {
        time: "08:30 - 09:00",
        activity: "Registrasi Peserta & Check-in",
        speaker: "Panitia UCH",
        details: "Verifikasi e-tiket barcode dan pembagian merchandise",
      },
      {
        time: "09:00 - 11:30",
        activity: "Pemaparan Materi Utama & Sesi Tanya Jawab",
        speaker: "Keynote Speaker",
        details: "Presentasi materi studi kasus dan diskusi interaktif",
      },
      {
        time: "11:30 - 12:00",
        activity: "Penyerahan Sertifikat & Foto Bersama",
        speaker: "Moderator",
        details: "Penutupan resmi acara",
      },
    ],
  },
  {
    label: "Workshop Hands-On (4 Sesi)",
    items: [
      {
        time: "09:00 - 09:30",
        activity: "Pembukaan & Setup Lingkungan Praktik",
        speaker: "PIC Fasilitator",
        details: "Konfigurasi software, tools, dan konektivitas lab",
      },
      {
        time: "09:30 - 12:00",
        activity: "Sesi Praktik 1: Dasar & Implementasi",
        speaker: "Instruktur Praktik",
        details: "Live coding dan eksplorasi modul utama",
      },
      {
        time: "12:00 - 13:00",
        activity: "Istirahat, Sholat & Makan Siang (Ishoma)",
        speaker: "-",
        details: "Networking santai antar peserta di Coworking Space",
      },
      {
        time: "13:00 - 15:30",
        activity: "Sesi Praktik 2: Mini Project & Review Kode",
        speaker: "Instruktur & Mentor",
        details: "Presentasi mini project tiap kelompok",
      },
    ],
  },
];

export function EventRundownManager({
  rundown,
  onChange,
}: EventRundownManagerProps) {
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [details, setDetails] = useState("");

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!time.trim() || !activity.trim()) return;

    const newItem: EventRundownItem = {
      time: time.trim(),
      activity: activity.trim(),
      speaker: speaker.trim() || undefined,
      details: details.trim() || undefined,
    };

    onChange([...rundown, newItem]);
    setTime("");
    setActivity("");
    setSpeaker("");
    setDetails("");
  };

  const handleRemoveItem = (indexToRemove: number) => {
    onChange(rundown.filter((_, idx) => idx !== indexToRemove));
  };

  const handleApplyTemplate = (items: EventRundownItem[]) => {
    onChange([...items]);
  };

  return (
    <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 border border-border/70">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Susunan Rundown Acara ({rundown.length} Sesi)</span>
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Atur rangkaian jadwal kegiatan terperinci untuk peserta agenda.
          </p>
        </div>

        {/* Quick templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Template:
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => handleApplyTemplate(tmpl.items)}
              className="text-[10px] px-2 py-0.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              {tmpl.label}
            </button>
          ))}
          {rundown.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[10px] px-2 py-0.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              Kosongkan
            </button>
          )}
        </div>
      </div>

      {/* Existing Rundown Items */}
      {rundown.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {rundown.map((item, index) => (
            <div
              key={index}
              className="group flex items-start justify-between gap-3 p-2.5 rounded-xl bg-background border border-border/60 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                    {item.time} WIB
                  </span>
                  <span className="text-xs font-bold text-foreground truncate">
                    {item.activity}
                  </span>
                  {item.speaker && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                      <User className="w-2.5 h-2.5" />
                      {item.speaker}
                    </span>
                  )}
                </div>
                {item.details && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.details}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
                title="Hapus sesi ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center border border-dashed border-border/80 rounded-xl bg-background/50 space-y-1">
          <Clock className="w-4 h-4 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">
            Belum ada susunan rundown untuk agenda ini.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Pilih template di atas atau tambahkan sesi kegiatan di bawah.
          </p>
        </div>
      )}

      {/* Add New Rundown Item Form */}
      <div className="pt-2 border-t border-border/60 space-y-2">
        <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
          <ListPlus className="w-3.5 h-3.5 text-primary" />
          Tambah Sesi Rundown Baru:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-3">
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="09:00 - 10:30"
              className="h-8 text-xs rounded-lg font-mono"
            />
          </div>
          <div className="sm:col-span-5">
            <Input
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Nama Aktivitas / Topik"
              className="h-8 text-xs rounded-lg"
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="Pembicara (opsional)"
              className="h-8 text-xs rounded-lg"
            />
          </div>
          <div className="sm:col-span-1 flex items-center">
            <Button
              type="button"
              size="sm"
              disabled={!time.trim() || !activity.trim()}
              onClick={() => handleAddItem()}
              className="h-8 w-full rounded-lg text-xs font-bold cursor-pointer"
            >
              +
            </Button>
          </div>
        </div>
        <Input
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Catatan atau detail penjelasan sesi (opsional)..."
          className="h-7 text-[11px] rounded-lg text-muted-foreground"
        />
      </div>
    </div>
  );
}
