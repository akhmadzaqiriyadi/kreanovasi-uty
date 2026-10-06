"use client";

import { Plus, Trash2, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventSpeaker } from "@/config/events";

interface EventSpeakersManagerProps {
  speakers: EventSpeaker[];
  onChange: (speakers: EventSpeaker[]) => void;
}

export function EventSpeakersManager({
  speakers,
  onChange,
}: EventSpeakersManagerProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [institution, setInstitution] = useState("");

  const handleAddSpeaker = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newSpeaker: EventSpeaker = {
      name: name.trim(),
      role: role.trim() || "Narasumber",
      institution: institution.trim() || "Universitas Teknologi Yogyakarta",
    };

    onChange([...speakers, newSpeaker]);
    setName("");
    setRole("");
    setInstitution("");
  };

  const handleRemoveSpeaker = (indexToRemove: number) => {
    onChange(speakers.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 sm:p-4 border border-border/60">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>Narasumber & Mentor Ahli</span>
        </Label>
        <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {speakers.length} Narasumber
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Tambahkan pembicara, praktisi industri, atau akademisi yang mengisi sesi kegiatan.
      </p>

      {/* Add Speaker Form */}
      <div className="space-y-2 rounded-xl bg-background p-3 border border-border/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-muted-foreground">
              Nama Lengkap & Gelar *
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dr. Bambang H., M.Kom."
              className="h-8 text-xs rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSpeaker();
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-muted-foreground">
              Peran / Jabatan
            </Label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Direktur Inovasi"
              className="h-8 text-xs rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSpeaker();
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-muted-foreground">
              Instansi / Perusahaan
            </Label>
            <Input
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Contoh: UTY / Venture Capital"
              className="h-8 text-xs rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSpeaker();
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddSpeaker()}
            disabled={!name.trim()}
            className="h-7 text-xs rounded-lg gap-1 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Narasumber</span>
          </Button>
        </div>
      </div>

      {/* Speakers List */}
      {speakers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {speakers.map((sp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 text-xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {sp.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-bold text-foreground text-xs truncate">
                    {sp.name}
                  </p>
                  <p className="text-[10px] text-primary font-medium truncate">
                    {sp.role}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {sp.institution}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSpeaker(idx)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 rounded-xl border border-dashed border-border/70 text-muted-foreground text-xs space-y-1">
          <UserCheck className="w-5 h-5 mx-auto text-muted-foreground/60" />
          <p className="text-[11px]">Belum ada narasumber yang ditambahkan.</p>
        </div>
      )}
    </div>
  );
}
