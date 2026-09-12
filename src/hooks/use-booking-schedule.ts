"use client";

import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import {
  generateInitialSchedule,
  type ScheduleItem,
} from "@/config/booking-schedule";

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
  const [bookings, setBookings] = useState<ScheduleItem[]>(() =>
    generateInitialSchedule(initialDate),
  );

  const formattedSelectedDate = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate],
  );

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

  const getBookingsForDateAndRoom = useCallback(
    (roomId: string, targetDate: Date = selectedDate): ScheduleItem[] => {
      const dateStr = format(targetDate, "yyyy-MM-dd");
      return bookings
        .filter((b) => b.roomId === roomId && b.date === dateStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    },
    [bookings, selectedDate],
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

      const roomBookings = getBookingsForDateAndRoom(roomId, targetDate);

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
        label: `${roomBookings.length} Sesi Terisi (Tersedia Sebagian)`,
        badgeClass:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        bookings: roomBookings,
        hasSlotsAvailable: true,
      };
    },
    [getBookingsForDateAndRoom, selectedDate],
  );

  const addBooking = useCallback(
    (newBooking: Omit<ScheduleItem, "id" | "status">) => {
      const createdItem: ScheduleItem = {
        ...newBooking,
        id: `sch-${Date.now()}`,
        status: "approved",
      };
      setBookings((prev) => [createdItem, ...prev]);
      return createdItem;
    },
    [],
  );

  return {
    currentWeek,
    selectedDate,
    formattedSelectedDate,
    weekDays,
    bookings,
    navigateWeek,
    selectDate,
    getBookingsForDateAndRoom,
    getRoomAvailability,
    addBooking,
    isSameDay,
  };
}
