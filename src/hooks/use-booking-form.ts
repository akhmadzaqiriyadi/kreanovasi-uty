"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { bookingConfig } from "@/config/booking";
import {
  type BookingFormValues,
  bookingFormSchema,
} from "@/lib/validations/booking";

export interface BookingSubmissionResult {
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  applicant: string;
}

export function useBookingForm(
  initialRoomId?: string,
  onBookingCreated?: (booking: {
    roomId: string;
    roomName: string;
    date: string;
    startTime: string;
    endTime: string;
    applicant: string;
    purpose: string;
    organization?: string;
  }) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] =
    useState<BookingSubmissionResult | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      room: initialRoomId || "",
      name: "",
      npm: "",
      prodi: "",
      purpose: "",
      audience: 5,
      date: "",
      startTime: "09:00",
      endTime: "11:00",
    },
  });

  const selectedStartTime = form.watch("startTime");
  const selectedRoomId = form.watch("room");

  // Filter end time slots so that endTime is strictly after startTime (DRY validation)
  const availableEndTimes = useMemo(() => {
    if (!selectedStartTime) return bookingConfig.timeSlots;
    return bookingConfig.timeSlots.filter((time) => time > selectedStartTime);
  }, [selectedStartTime]);

  // Adjust endTime automatically if it becomes invalid when startTime changes
  useEffect(() => {
    const currentEnd = form.getValues("endTime");
    if (currentEnd && currentEnd <= selectedStartTime) {
      const nextSlot = availableEndTimes[0];
      if (nextSlot) {
        form.setValue("endTime", nextSlot, { shouldValidate: true });
      }
    }
  }, [selectedStartTime, availableEndTimes, form]);

  const openBookingModal = useCallback(
    (roomId?: string, date?: string) => {
      if (roomId) {
        form.setValue("room", roomId);
      }
      if (date) {
        form.setValue("date", date, { shouldValidate: true });
      }
      setIsOpen(true);
    },
    [form],
  );

  const closeBookingModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onSubmit = useCallback(
    async (values: BookingFormValues) => {
      setIsSubmitting(true);
      try {
        // Simulasi network request API menggunakan data dummy lokal
        await new Promise((resolve) => setTimeout(resolve, 800));

        const matchedRoom = bookingConfig.rooms.find(
          (r) => r.id === values.room || r.slug === values.room,
        );
        const roomName = matchedRoom?.name || values.room;

        const fakeResult: BookingSubmissionResult = {
          bookingId: `UCH-${Math.floor(100000 + Math.random() * 900000)}`,
          roomName,
          date: values.date,
          timeSlot: `${values.startTime} - ${values.endTime} WIB`,
          applicant: values.name,
        };

        setLastSubmitted(fakeResult);

        // Notifikasi ke sistem jadwal agar langsung muncul di kalender timeline
        onBookingCreated?.({
          roomId: values.room,
          roomName,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          applicant: values.name,
          purpose: values.purpose,
          organization: values.prodi,
        });

        toast.success("Permohonan Reservasi Berhasil Diajukan!", {
          description: `ID: ${fakeResult.bookingId} untuk ruangan ${roomName}. Menunggu approval admin UCH.`,
          duration: 5000,
        });

        form.reset();
        setIsOpen(false);
      } catch {
        toast.error("Gagal Mengajukan Reservasi", {
          description: "Terjadi kesalahan pada sistem. Silakan coba kembali.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onBookingCreated],
  );

  return {
    form,
    isOpen,
    isSubmitting,
    lastSubmitted,
    availableEndTimes,
    selectedRoomId,
    openBookingModal,
    closeBookingModal,
    setIsOpen,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
