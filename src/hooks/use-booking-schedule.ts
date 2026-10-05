"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import type { ScheduleItem } from "@/config/booking-schedule";
import { useAllOccupiedSlotsQuery } from "@/hooks/use-booking-queries";

export type RoomAvailabilityState =
  | "available_full"
  | "available_partial"
  | "occupied_full"
  | "closed";

export interface RoomAvailabilityInfo {
  state: RoomAvailabilityState;
  label: string;
  badgeClass: string;
  bookings: ScheduleItem[];
  hasSlotsAvailable: boolean;
}

export function useBookingSchedule(initialDate: Date = new Date()) {
  const [currentWeek, setCurrentWeek] = useState<Date>(() =>
    startOfWeek(initialDate, { weekStartsOn: 1 }),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const formattedSelectedDate = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );

  // Fetch real occupied slots from PostgreSQL backend for the selected date
  const { data: serverBookings, isLoading: isSlotsLoading } =
    useAllOccupiedSlotsQuery(formattedSelectedDate);

  const liveScheduleItems = useMemo<ScheduleItem[]>(() => {
    if (serverBookings && Array.isArray(serverBookings)) {
      return serverBookings.map((b) => ({
        id: b.id,
        roomId: b.room_id,
        roomName: b.room_name,
        date: b.booking_date,
        startTime: b.start_time,
        endTime: b.end_time,
        applicant: b.applicant_name,
        purpose: b.purpose,
        organization:
          b.prodi ||
          (b.applicant_role === "dosen"
            ? "Dosen UTY"
            : b.applicant_role === "umum"
              ? "Mitra / Umum"
              : "Mahasiswa UTY"),
        status: b.status === "pending" ? "pending" : "approved",
      }));
    }
    return [];
  }, [serverBookings]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i)),
    [currentWeek],
  );

  const navigateWeek = useCallback(
    (direction: "prev" | "next") => {
      const offset = direction === "prev" ? -7 : 7;
      const newWeek = addDays(currentWeek, offset);
      setCurrentWeek(newWeek);
      setSelectedDate(newWeek);
    },
    [currentWeek],
  );

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const selectToday = useCallback(() => {
    const today = new Date();
    setCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }));
    setSelectedDate(today);
  }, []);

  const isTodaySelected = useMemo(
    () => isSameDay(selectedDate, new Date()),
    [selectedDate],
  );

  const getBookingsForDateAndRoom = useCallback(
    (roomId: string): ScheduleItem[] => {
      return liveScheduleItems
        .filter((b) => b.roomId === roomId)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [liveScheduleItems],
  );

  const getRoomAvailability = useCallback(
    (roomId: string, targetDate: Date = selectedDate): RoomAvailabilityInfo => {
      const dayOfWeek = targetDate.getDay(); // 0 = Minggu

      if (dayOfWeek === 0) {
        return {
          state: "closed",
          label: "Tutup (Hari Libur)",
          badgeClass:
            "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700",
          bookings: [],
          hasSlotsAvailable: false,
        };
      }

      const roomBookings = getBookingsForDateAndRoom(roomId);

      if (roomBookings.length === 0) {
        return {
          state: "available_full",
          label: "Tersedia Penuh",
          badgeClass:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
          bookings: [],
          hasSlotsAvailable: true,
        };
      }

      if (roomBookings.length >= 3) {
        return {
          state: "occupied_full",
          label: "Jadwal Penuh",
          badgeClass:
            "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
          bookings: roomBookings,
          hasSlotsAvailable: false,
        };
      }

      return {
        state: "available_partial",
        label: `${roomBookings.length} Sesi Terisi`,
        badgeClass:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        bookings: roomBookings,
        hasSlotsAvailable: true,
      };
    },
    [getBookingsForDateAndRoom, selectedDate],
  );

  return {
    currentWeek,
    selectedDate,
    formattedSelectedDate,
    weekDays,
    navigateWeek,
    selectDate,
    selectToday,
    isTodaySelected,
    getBookingsForDateAndRoom,
    getRoomAvailability,
    isSameDay,
    isLoading: isSlotsLoading,
  };
}
