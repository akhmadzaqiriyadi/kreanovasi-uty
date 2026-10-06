"use client";

import { CheckCircle2, Plus, Sparkles, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventPerksManagerProps {
  benefits: string[];
  onBenefitsChange: (benefits: string[]) => void;
  prerequisites: string[];
  onPrerequisitesChange: (prerequisites: string[]) => void;
}

const BENEFIT_SUGGESTIONS = [
  "E-Sertifikat resmi kehadiran dari UTY Creative Hub",
  "Akses rekaman materi & slide presentasi narasumber",
  "Konsumsi, snack box & seminar kit resmi",
  "Sesi jejaring eksklusif dengan mentor industri & investor",
  "Review langsung karya/proposal oleh reviewer ahli",
];

const PREREQUISITE_SUGGESTIONS = [
  "Terbuka untuk seluruh mahasiswa aktif UTY",
  "Membawa laptop pribadi untuk sesi praktik mandiri",
  "Telah menginstal software/tools yang ditentukan panitia",
  "Berpakaian rapi, sopan, dan hadir tepat waktu",
  "Menunjukkan e-tiket QR pendaftaran saat registrasi kedatangan",
];

export function EventPerksManager({
  benefits,
  onBenefitsChange,
  prerequisites,
  onPrerequisitesChange,
}: EventPerksManagerProps) {
  const [benefitInput, setBenefitInput] = useState("");
  const [prereqInput, setPrereqInput] = useState("");

  const handleAddBenefit = (text?: string) => {
    const val = (text || benefitInput).trim();
    if (!val) return;
    if (benefits.includes(val)) return;
    onBenefitsChange([...benefits, val]);
    setBenefitInput("");
  };

  const handleRemoveBenefit = (idxToRemove: number) => {
    onBenefitsChange(benefits.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAddPrerequisite = (text?: string) => {
    const val = (text || prereqInput).trim();
    if (!val) return;
    if (prerequisites.includes(val)) return;
    onPrerequisitesChange([...prerequisites, val]);
    setPrereqInput("");
  };

  const handleRemovePrerequisite = (idxToRemove: number) => {
    onPrerequisitesChange(prerequisites.filter((_, idx) => idx !== idxToRemove));
  };

  return (
    <div className="space-y-4">
      {/* 1. Fasilitas & Manfaat (Benefits) */}
      <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 sm:p-4 border border-border/60">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Fasilitas & Manfaat Peserta</span>
          </Label>
          <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {benefits.length} Poin Fasilitas
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Saran Cepat:</span>
          </span>
          {BENEFIT_SUGGESTIONS.map((sug, i) => {
            const isAdded = benefits.includes(sug);
            if (isAdded) return null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAddBenefit(sug)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70 transition-colors cursor-pointer"
              >
                + {sug.split(" ").slice(0, 3).join(" ")}...
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={benefitInput}
            onChange={(e) => setBenefitInput(e.target.value)}
            placeholder="Ketik fasilitas baru (contoh: E-Sertifikat resmi kehadiran)..."
            className="h-8 text-xs rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddBenefit();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddBenefit()}
            disabled={!benefitInput.trim()}
            className="h-8 text-xs rounded-lg gap-1 font-semibold shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </Button>
        </div>

        {/* Benefits List */}
        {benefits.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/60 text-xs"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-foreground leading-normal">{b}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Persyaratan Peserta (Prerequisites) */}
      <div className="space-y-3 rounded-2xl bg-muted/20 p-3.5 sm:p-4 border border-border/60">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>Persyaratan Peserta</span>
          </Label>
          <span className="text-[10px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {prerequisites.length} Poin Syarat
          </span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Saran Cepat:</span>
          </span>
          {PREREQUISITE_SUGGESTIONS.map((sug, i) => {
            const isAdded = prerequisites.includes(sug);
            if (isAdded) return null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAddPrerequisite(sug)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70 transition-colors cursor-pointer"
              >
                + {sug.split(" ").slice(0, 3).join(" ")}...
              </button>
            );
          })}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={prereqInput}
            onChange={(e) => setPrereqInput(e.target.value)}
            placeholder="Ketik persyaratan baru (contoh: Membawa laptop pribadi)..."
            className="h-8 text-xs rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddPrerequisite();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddPrerequisite()}
            disabled={!prereqInput.trim()}
            className="h-8 text-xs rounded-lg gap-1 font-semibold shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </Button>
        </div>

        {/* Prerequisites List */}
        {prerequisites.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {prerequisites.map((req, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/60 text-xs"
              >
                <div className="flex items-start gap-2 min-w-0 pr-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span className="text-foreground leading-normal">{req}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePrerequisite(idx)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
