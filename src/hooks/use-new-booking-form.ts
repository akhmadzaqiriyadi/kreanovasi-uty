"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { bookingConfig } from "@/config/booking";
import {
  type BookingFormValues,
  bookingFormSchema,
} from "@/lib/validations/booking";

export const studyPrograms = [
  "Informatika",
  "Sistem Informasi",
  "Teknologi Informasi",
  "Teknik Elektro",
  "Teknik Sipil",
  "Teknik Industri",
  "Arsitektur",
  "Manajemen",
  "Akuntansi",
  "Ilmu Komunikasi",
  "Psikologi",
  "Hubungan Internasional",
  "Sastra Inggris",
  "Hukum",
];

export const defaultStudentProfile = {
  name: "Akhmad Zaqi Riyadi",
  npm: "5210411234",
  prodi: "Informatika",
  email: "zaqi@students.uty.ac.id",
  role: "Mahasiswa Aktif UTY",
};

export interface BookingSubmissionSummary {
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  applicant: string;
  prodi: string;
  audience: number;
  purpose: string;
}

export function useNewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomParam = searchParams.get("room") || "";
  const dateParam = searchParams.get("date") || "";

  const [useLoggedInProfile, setUseLoggedInProfile] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] =
    useState<BookingSubmissionSummary | null>(null);

  // Parse initial date from query params (if available from Schedule Navigator)
  const initialDateObj = useMemo(() => {
    if (!dateParam) return undefined;
    try {
      const parsed = parseISO(dateParam);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }, [dateParam]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDateObj,
  );

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      room: roomParam,
      name: defaultStudentProfile.name,
      npm: defaultStudentProfile.npm,
      prodi: defaultStudentProfile.prodi,
      purpose: "",
      audience: 5,
      date: dateParam,
      startTime: "09:00",
      endTime: "11:00",
    },
  });

  // Sync if URL search params change
  useEffect(() => {
    if (roomParam) {
      form.setValue("room", roomParam);
    }
    if (dateParam) {
      form.setValue("date", dateParam);
      try {
        const parsed = parseISO(dateParam);
        if (!Number.isNaN(parsed.getTime())) {
          setSelectedDate(parsed);
        }
      } catch {
        // ignore invalid date param
      }
    }
  }, [roomParam, dateParam, form]);

  const selectedStartTime = form.watch("startTime");

  // Dynamic available end times based on selected start time
  const availableEndTimes = useMemo(() => {
    if (!selectedStartTime) return bookingConfig.timeSlots;
    return bookingConfig.timeSlots.filter((time) => time > selectedStartTime);
  }, [selectedStartTime]);

  useEffect(() => {
    const currentEnd = form.getValues("endTime");
    if (currentEnd && currentEnd <= selectedStartTime) {
      const nextSlot = availableEndTimes[0];
      if (nextSlot) {
        form.setValue("endTime", nextSlot, { shouldValidate: true });
      }
    }
  }, [selectedStartTime, availableEndTimes, form]);

  // Handle toggle profile login
  const handleToggleProfile = useCallback(
    (checked: boolean) => {
      setUseLoggedInProfile(checked);
      if (checked) {
        form.setValue("name", defaultStudentProfile.name, {
          shouldValidate: true,
        });
        form.setValue("npm", defaultStudentProfile.npm, {
          shouldValidate: true,
        });
        form.setValue("prodi", defaultStudentProfile.prodi, {
          shouldValidate: true,
        });
      } else {
        form.setValue("name", "");
        form.setValue("npm", "");
        form.setValue("prodi", "");
      }
    },
    [form],
  );

  // Handle Calendar date selection
  const handleSelectDate = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date);
      if (date) {
        const formatted = format(date, "yyyy-MM-dd");
        form.setValue("date", formatted, { shouldValidate: true });
      } else {
        form.setValue("date", "", { shouldValidate: true });
      }
    },
    [form],
  );

  const onSubmit = useCallback(async (values: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulasi request API dummy
      await new Promise((resolve) => setTimeout(resolve, 800));

      const matchedRoom = bookingConfig.rooms.find(
        (r) => r.id === values.room || r.slug === values.room,
      );
      const roomName = matchedRoom?.name || values.room;

      const summary: BookingSubmissionSummary = {
        bookingId: `UCH-${Math.floor(100000 + Math.random() * 900000)}`,
        roomName,
        date: values.date,
        timeSlot: `${values.startTime} - ${values.endTime} WIB`,
        applicant: values.name,
        prodi: values.prodi,
        audience: values.audience,
        purpose: values.purpose,
      };

      setSubmissionSuccess(summary);
      toast.success("Permohonan Peminjaman Berhasil Diajukan!", {
        description: `ID: ${summary.bookingId} untuk ruangan ${roomName}.`,
        duration: 5000,
      });
    } catch {
      toast.error("Gagal Mengajukan Peminjaman", {
        description: "Terjadi kesalahan pada sistem. Silakan coba kembali.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    form,
    rooms: bookingConfig.rooms,
    studyPrograms,
    timeSlots: bookingConfig.timeSlots,
    availableEndTimes,
    useLoggedInProfile,
    handleToggleProfile,
    selectedDate,
    handleSelectDate,
    isSubmitting,
    submissionSuccess,
    router,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
