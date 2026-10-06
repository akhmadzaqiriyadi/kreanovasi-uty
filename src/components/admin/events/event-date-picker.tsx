"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventDatePickerProps {
  dateFullText: string;
  onDateChange: (payload: {
    date_full_text: string;
    date_day: string;
    date_month: string;
    date_year: string;
  }) => void;
  error?: string;
}

export function EventDatePicker({
  dateFullText,
  onDateChange,
  error,
}: EventDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (!dateFullText) return undefined;
    try {
      const parsed = new Date(dateFullText);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    } catch {
      // ignore
    }
    return undefined;
  });

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (!date) return;

    const day = format(date, "d");
    const month = format(date, "MMM", { locale: id }).toUpperCase();
    const year = format(date, "yyyy");
    const fullText = format(date, "EEEE, d MMMM yyyy", { locale: id });

    onDateChange({
      date_full_text: fullText,
      date_day: day,
      date_month: month,
      date_year: year,
    });
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold flex items-center gap-1.5">
        <CalendarIcon className="w-3.5 h-3.5 text-primary" />
        <span>Tanggal Agenda *</span>
      </Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-10 justify-start text-left font-normal rounded-xl border border-border text-xs cursor-pointer",
              !dateFullText && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {dateFullText || "Pilih tanggal pelaksanaan agenda"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-2xl shadow-xl border border-border/80"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
