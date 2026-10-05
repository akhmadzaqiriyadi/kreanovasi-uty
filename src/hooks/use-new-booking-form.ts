"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { bookingConfig } from "@/config/booking";
import { studyPrograms } from "@/config/uty-faculties";
import { useAuth } from "@/context/auth-context";
import { useNotification } from "@/context/notification-context";
import { useRooms } from "@/context/rooms-context";
import {
  useCreateBookingMutation,
  useOccupiedSlotsQuery,
  useRoomsQuery,
} from "@/hooks/use-booking-queries";
import {
  type BookingFormValues,
  bookingFormSchema,
} from "@/lib/validations/booking";

export { studyPrograms };

export type ApplicantRole = "mahasiswa" | "dosen" | "umum";

export const mockProfiles = {
  mahasiswa: {
    role: "mahasiswa" as const,
    roleLabel: "Mahasiswa",
    name: "Akhmad Zaqi Riyadi",
    idNumber: "5210411234",
    idLabel: "NPM Mahasiswa",
    prodi: "S1 Informatika",
    email: "zaqi@students.uty.ac.id",
    affiliation: "S1 Informatika - FST",
  },
  dosen: {
    role: "dosen" as const,
    roleLabel: "Dosen / Pengajar",
    name: "Dr. Bambang Sutrisno, M.Kom.",
    idNumber: "0514088201",
    idLabel: "NIDN / NIK Dosen",
    prodi: "S1 Informatika",
    email: "bambang.sutrisno@staff.uty.ac.id",
    affiliation: "Dosen Tetap FST UTY",
  },
  umum: {
    role: "umum" as const,
    roleLabel: "Non-Civitas / Mitra",
    name: "Hendri Pratama",
    idNumber: "3404011205940003",
    idLabel: "NIK KTP Pemohon",
    prodi: "Inkubator Startup",
    email: "hendri@mitra.org",
    affiliation: "Mitra Industri / Umum",
  },
};

export const defaultStudentProfile = mockProfiles.mahasiswa;

export interface BookingSubmissionSummary {
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  applicant: string;
  role: ApplicantRole;
  idNumber: string;
  idLabel: string;
  prodi: string;
  audience: number;
  purpose: string;
}

export function useNewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn, isAuthLoading } = useAuth();
  const { addNotification } = useNotification();
  const createBookingMutation = useCreateBookingMutation();

  const roomParam = searchParams.get("room") || "";
  const dateParam = searchParams.get("date") || "";

  // Derive initial role from authenticated user
  const initialRole: ApplicantRole = useMemo(() => {
    if (user?.role === "dosen") return "dosen";
    if (user?.role === "umum") return "umum";
    return "mahasiswa";
  }, [user?.role]);

  const [applicantRole, setApplicantRole] =
    useState<ApplicantRole>(initialRole);
  const [useLoggedInProfile, setUseLoggedInProfile] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] =
    useState<BookingSubmissionSummary | null>(null);

  // Sync role if user loads late
  useEffect(() => {
    if (user?.role) {
      const derived: ApplicantRole =
        user.role === "dosen"
          ? "dosen"
          : user.role === "umum"
            ? "umum"
            : "mahasiswa";
      setApplicantRole(derived);
    }
  }, [user?.role]);

  // Parse initial date from query params
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
      role: initialRole,
      room: roomParam,
      name: user?.name || "",
      npm: user?.idNumber || "",
      prodi: user?.affiliation || "",
      purpose: "",
      audience: 5,
      date: dateParam,
      startTime: "09:00",
      endTime: "11:00",
    },
  });

  // Re-sync with actual logged-in user details if available
  useEffect(() => {
    if (user && useLoggedInProfile) {
      if (user.name) form.setValue("name", user.name);
      if (user.idNumber) form.setValue("npm", user.idNumber);
      if (user.affiliation) form.setValue("prodi", user.affiliation);
    }
  }, [user, useLoggedInProfile, form]);

  // Handle switching applicant role
  const handleRoleChange = useCallback(
    (newRole: ApplicantRole) => {
      setApplicantRole(newRole);
      form.setValue("role", newRole, { shouldValidate: true });

      if (useLoggedInProfile) {
        if (user) {
          form.setValue("name", user.name || "", { shouldValidate: true });
          form.setValue("npm", user.idNumber || "", { shouldValidate: true });
          form.setValue("prodi", user.affiliation || "", {
            shouldValidate: true,
          });
        } else {
          form.setValue("name", "", { shouldValidate: true });
          form.setValue("npm", "", { shouldValidate: true });
          form.setValue("prodi", "", { shouldValidate: true });
        }
      }
    },
    [form, useLoggedInProfile, user],
  );

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

  const { data: serverRooms = [] } = useRoomsQuery();
  const { rooms: contextRooms, availableRooms, addBooking } = useRooms();

  const selectedRoom = form.watch("room");
  const selectedDateStr = form.watch("date");
  const selectedStartTime = form.watch("startTime");

  const matchedRoom = useMemo(() => {
    return serverRooms.find(
      (r) => r.id === selectedRoom || r.slug === selectedRoom,
    );
  }, [serverRooms, selectedRoom]);

  const targetRoomId = matchedRoom?.id || selectedRoom;

  const { data: occupiedBookings = [], isLoading: isOccupiedLoading } =
    useOccupiedSlotsQuery(targetRoomId, selectedDateStr);

  const isStartTimeOccupied = useCallback(
    (slotTime: string) => {
      return occupiedBookings.some(
        (b) => slotTime >= b.start_time && slotTime < b.end_time,
      );
    },
    [occupiedBookings],
  );

  const isIntervalConflicting = useCallback(
    (start: string, end: string) => {
      return occupiedBookings.some(
        (b) => start < b.end_time && end > b.start_time,
      );
    },
    [occupiedBookings],
  );

  // Dynamic available end times based on selected start time and conflict check
  const availableEndTimes = useMemo(() => {
    if (!selectedStartTime) return bookingConfig.timeSlots;
    const candidates = bookingConfig.timeSlots.filter(
      (time) => time > selectedStartTime,
    );
    return candidates.filter(
      (endTime) => !isIntervalConflicting(selectedStartTime, endTime),
    );
  }, [selectedStartTime, isIntervalConflicting]);

  useEffect(() => {
    const currentEnd = form.getValues("endTime");
    if (
      !currentEnd ||
      currentEnd <= selectedStartTime ||
      isIntervalConflicting(selectedStartTime, currentEnd)
    ) {
      const nextSlot = availableEndTimes[0];
      if (nextSlot) {
        form.setValue("endTime", nextSlot, { shouldValidate: true });
      }
    }
  }, [selectedStartTime, availableEndTimes, isIntervalConflicting, form]);

  useEffect(() => {
    if (occupiedBookings.length > 0 && selectedStartTime) {
      if (isStartTimeOccupied(selectedStartTime)) {
        const firstAvailable = bookingConfig.timeSlots.find(
          (t) => !isStartTimeOccupied(t),
        );
        if (firstAvailable) {
          form.setValue("startTime", firstAvailable, { shouldValidate: true });
        }
      }
    }
  }, [occupiedBookings, selectedStartTime, isStartTimeOccupied, form]);

  // Handle toggle profile login
  const handleToggleProfile = useCallback(
    (checked: boolean) => {
      setUseLoggedInProfile(checked);
      if (checked) {
        if (user) {
          form.setValue("name", user.name || "", { shouldValidate: true });
          form.setValue("npm", user.idNumber || "", { shouldValidate: true });
          form.setValue("prodi", user.affiliation || "", {
            shouldValidate: true,
          });
        } else {
          form.setValue("name", "", { shouldValidate: true });
          form.setValue("npm", "", { shouldValidate: true });
          form.setValue("prodi", "", { shouldValidate: true });
        }
      } else {
        form.setValue("name", "");
        form.setValue("npm", "");
        form.setValue("prodi", "");
      }
    },
    [form, user],
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

  const activeRoomsList = useMemo(() => {
    if (serverRooms && serverRooms.length > 0) {
      return serverRooms.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        capacity: `${r.capacity} Orang`,
        location: r.location,
        description: r.description,
        features: Array.isArray(r.facilities)
          ? r.facilities
          : typeof r.facilities === "string"
            ? JSON.parse(r.facilities || "[]")
            : [],
        imageUrl: r.image_url || "/images/coworking-space.jpg",
        status: {
          state: r.status,
          label:
            r.status === "available"
              ? "Tersedia"
              : r.status === "maintenance"
                ? "Maintenance"
                : "Dipesan",
          timeSlotInfo: r.operational_hours || "08:00 - 21:00 WIB",
        },
      }));
    }
    return availableRooms.length > 0 ? availableRooms : contextRooms;
  }, [serverRooms, availableRooms, contextRooms]);

  const onSubmit = useCallback(
    async (values: BookingFormValues) => {
      if (!isLoggedIn) {
        toast.error("Wajib Login", {
          description:
            "Silakan masuk ke akun Anda terlebih dahulu untuk mengajukan reservasi.",
        });
        router.push("/account?redirect=/booking/new");
        return;
      }

      setIsSubmitting(true);
      try {
        const matchedRoom = activeRoomsList.find(
          (r) => r.id === values.room || r.slug === values.room,
        );
        const roomName = matchedRoom?.name || values.room;
        const roomId = matchedRoom?.id || values.room;
        const isDosen = values.role === "dosen";

        // Persist directly to backend database
        const serverResult = await createBookingMutation.mutateAsync({
          room_id: roomId,
          room_name: roomName,
          applicant_name: values.name,
          applicant_role: values.role,
          id_number: values.npm,
          prodi: values.prodi,
          purpose: values.purpose,
          audience: Number(values.audience),
          booking_date: values.date,
          start_time: values.startTime,
          end_time: values.endTime,
        });

        const generatedId =
          serverResult?.id ||
          `UCH-${Math.floor(100000 + Math.random() * 900000)}`;

        const summary: BookingSubmissionSummary = {
          bookingId: generatedId,
          roomName,
          date: values.date,
          timeSlot: `${values.startTime} - ${values.endTime} WIB`,
          applicant: values.name,
          role: values.role,
          idNumber: values.npm,
          idLabel: isDosen ? "NIDN / NIK" : "NPM",
          prodi: values.prodi,
          audience: values.audience,
          purpose: values.purpose,
        };

        // Also sync local context
        addBooking({
          id: generatedId,
          roomId,
          roomName,
          applicantName: values.name,
          applicantRole: values.role,
          idNumber: values.npm,
          prodi: values.prodi,
          purpose: values.purpose,
          audience: values.audience,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          status: "pending",
        });

        addNotification({
          type: "booking_created",
          title: "Permohonan Peminjaman Diajukan",
          message: `ID: ${summary.bookingId} untuk ${roomName} (${values.date}, ${summary.timeSlot}). Menunggu verifikasi admin.`,
          timestamp: new Date().toISOString(),
          read: false,
          bookingId: summary.bookingId,
          roomName: roomName,
          actionUrl: "/my-bookings",
        });

        setSubmissionSuccess(summary);
        toast.success("Permohonan Peminjaman Berhasil Diajukan!", {
          description: `ID: ${summary.bookingId} untuk ruangan ${roomName}. Menunggu verifikasi admin.`,
          duration: 5000,
        });
      } catch (err: unknown) {
        let msg =
          "Terjadi kesalahan saat memproses permohonan. Pastikan formulir terisi lengkap.";
        if (err && typeof err === "object" && "response" in err) {
          const res = (err as { response?: { data?: { message?: string } } })
            .response;
          if (res?.data?.message) msg = res.data.message;
        }
        toast.error("Gagal Mengajukan Peminjaman", {
          description: msg,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isLoggedIn,
      activeRoomsList,
      createBookingMutation,
      addBooking,
      addNotification,
      router,
    ],
  );

  return {
    form,
    applicantRole,
    activeProfile:
      useLoggedInProfile && user
        ? {
            role: applicantRole,
            roleLabel:
              applicantRole === "dosen"
                ? "Dosen / Pengajar"
                : applicantRole === "umum"
                  ? "Non-Civitas / Mitra"
                  : "Mahasiswa",
            name: user.name || "",
            idNumber: user.idNumber || user.npm || "",
            idLabel:
              applicantRole === "dosen"
                ? "NIDN / NIK Dosen"
                : applicantRole === "umum"
                  ? "NIK KTP Pemohon"
                  : "NPM Mahasiswa",
            prodi: user.affiliation || "",
            email: user.email || "",
            affiliation: user.affiliation || "Civitas UTY",
          }
        : {
            role: applicantRole,
            roleLabel:
              applicantRole === "dosen"
                ? "Dosen / Pengajar"
                : applicantRole === "umum"
                  ? "Non-Civitas / Mitra"
                  : "Mahasiswa",
            name: user?.name || "",
            idNumber: user?.idNumber || user?.npm || "",
            idLabel:
              applicantRole === "dosen"
                ? "NIDN / NIK Dosen"
                : applicantRole === "umum"
                  ? "NIK KTP Pemohon"
                  : "NPM Mahasiswa",
            prodi: user?.affiliation || "",
            email: user?.email || "",
            affiliation: user?.affiliation || "Civitas UTY",
          },
    handleRoleChange,
    mockProfiles,
    rooms: activeRoomsList,
    studyPrograms,
    timeSlots: bookingConfig.timeSlots,
    availableEndTimes,
    occupiedBookings,
    isOccupiedLoading,
    isStartTimeOccupied,
    isIntervalConflicting,
    useLoggedInProfile,
    handleToggleProfile,
    selectedDate,
    handleSelectDate,
    isSubmitting: isSubmitting || createBookingMutation.isPending,
    submissionSuccess,
    router,
    user,
    isLoggedIn,
    isAuthLoading,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
