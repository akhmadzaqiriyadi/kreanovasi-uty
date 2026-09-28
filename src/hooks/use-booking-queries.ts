"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth";

export interface BackendRoom {
  id: string;
  name: string;
  slug: string;
  category: string;
  capacity: number;
  location: string;
  description: string;
  facilities: string[] | string;
  image_url: string;
  status: "available" | "maintenance" | "reserved";
  operational_hours: string;
  created_at: string;
  updated_at: string;
}

export interface BackendBooking {
  id: string;
  user_id: string;
  room_id: string;
  room_name: string;
  applicant_name: string;
  applicant_role: "mahasiswa" | "dosen" | "umum" | string;
  id_number: string;
  prodi: string;
  purpose: string;
  audience: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface BookingListResponse {
  bookings: BackendBooking[];
  pagination: BookingPagination;
}

export interface CreateBookingPayload {
  room_id: string;
  room_name?: string;
  applicant_name: string;
  applicant_role: string;
  id_number?: string;
  prodi?: string;
  purpose: string;
  audience: number;
  booking_date: string;
  start_time: string;
  end_time: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } })
      .response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}

// ----------------------------------------------------
// 1. Rooms Queries & Mutations
// ----------------------------------------------------
export function useRoomsQuery() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<BackendRoom[]>>("/rooms");
      return res.data?.data || [];
    },
    staleTime: 60 * 1000,
  });
}

export function useRoomQuery(id: string) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get<ApiEnvelope<BackendRoom>>(`/rooms/${id}`);
      return res.data?.data || null;
    },
    enabled: Boolean(id),
  });
}

export function useOccupiedSlotsQuery(roomId?: string, date?: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "occupied-slots", date],
    queryFn: async () => {
      if (!roomId || !date) return [];
      const res = await apiClient.get<ApiEnvelope<BackendBooking[]>>(
        `/rooms/${roomId}/occupied-slots`,
        { params: { date } },
      );
      return res.data?.data || [];
    },
    enabled: Boolean(roomId && date),
    staleTime: 10 * 1000,
  });
}

export function useCreateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<BackendRoom>) => {
      const res = await apiClient.post<ApiEnvelope<BackendRoom>>(
        "/rooms",
        payload,
      );
      return res.data?.data;
    },
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`Ruangan "${newRoom?.name}" berhasil ditambahkan!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal menambahkan ruangan"));
    },
  });
}

export function useUpdateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BackendRoom>;
    }) => {
      const res = await apiClient.put<ApiEnvelope<BackendRoom>>(
        `/rooms/${id}`,
        data,
      );
      return res.data?.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(`Ruangan "${updated?.name}" berhasil diperbarui!`);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal memperbarui ruangan"));
    },
  });
}

export function useDeleteRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/rooms/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Ruangan berhasil dihapus");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal menghapus ruangan"));
    },
  });
}

// ----------------------------------------------------
// 2. Bookings Queries & Mutations
// ----------------------------------------------------
export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  roomId?: string;
  search?: string;
}

export function useMyBookingsQuery(params: BookingQueryParams = {}) {
  const { page = 1, limit = 10, status = "all", search = "" } = params;
  return useQuery({
    queryKey: ["my-bookings", { page, limit, status, search }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (page) query.set("page", String(page));
      if (limit) query.set("limit", String(limit));
      if (status && status !== "all") query.set("status", status);
      if (search) query.set("search", search);

      const res = await apiClient.get<ApiEnvelope<BookingListResponse>>(
        `/my-bookings?${query.toString()}`,
      );
      return (
        res.data?.data || {
          bookings: [],
          pagination: { page, limit, total_items: 0, total_pages: 1 },
        }
      );
    },
    staleTime: 10 * 1000,
  });
}

export function useAllBookingsQuery(params: BookingQueryParams = {}) {
  const {
    page = 1,
    limit = 10,
    status = "all",
    roomId = "",
    search = "",
  } = params;
  return useQuery({
    queryKey: ["all-bookings", { page, limit, status, roomId, search }],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (page) query.set("page", String(page));
      if (limit) query.set("limit", String(limit));
      if (status && status !== "all") query.set("status", status);
      if (roomId) query.set("room_id", roomId);
      if (search) query.set("search", search);

      const res = await apiClient.get<ApiEnvelope<BookingListResponse>>(
        `/bookings?${query.toString()}`,
      );
      return (
        res.data?.data || {
          bookings: [],
          pagination: { page, limit, total_items: 0, total_pages: 1 },
        }
      );
    },
    staleTime: 10 * 1000,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const res = await apiClient.post<ApiEnvelope<BackendBooking>>(
        "/bookings",
        payload,
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
}

export function useUpdateBookingStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes?: string;
    }) => {
      const res = await apiClient.patch<ApiEnvelope<BackendBooking>>(
        `/bookings/${id}/status`,
        { status, notes },
      );
      return res.data?.data;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      toast.success(
        `Status reservasi ${booking?.id} berhasil diubah menjadi "${booking?.status}"!`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal mengubah status reservasi"));
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post<ApiEnvelope<null>>(
        `/bookings/${id}/cancel`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      toast.success("Permohonan reservasi berhasil dibatalkan");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal membatalkan permohonan"));
    },
  });
}

export function useDeleteBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/bookings/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast.success("Data reservasi berhasil dihapus");
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal menghapus data reservasi"));
    },
  });
}

export function useAdminCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingCode: string) => {
      const res = await apiClient.post<ApiEnvelope<BackendBooking>>(
        "/bookings/checkin",
        { booking_code: bookingCode },
      );
      return res.data?.data;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      toast.success(
        `Check-in berhasil! Reservasi ${booking?.id} (${booking?.applicant_name}) kini telah tercatat presensi.`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal memproses check-in"));
    },
  });
}

export function useSelfCheckInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      room_id?: string;
      booking_code?: string;
    }) => {
      const res = await apiClient.post<ApiEnvelope<BackendBooking>>(
        "/bookings/self-checkin",
        payload,
      );
      return res.data?.data;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      toast.success(
        `Check-in mandiri berhasil! Selamat beraktivitas di ${booking?.room_name}.`,
      );
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal melakukan self check-in"));
    },
  });
}

export interface UploadResponse {
  original_name: string;
  file_name: string;
  file_path: string;
  url: string;
  size: number;
  mime_type: string;
}

export function useUploadMutation(options?: {
  onSuccess?: (data: UploadResponse) => void;
  onError?: (err: Error) => void;
}) {
  return useMutation({
    mutationFn: async ({
      file,
      folder = "rooms",
    }: {
      file: File;
      folder?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await apiClient.post<ApiEnvelope<UploadResponse>>(
        "/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (!response.data?.data) {
        throw new Error(response.data?.message || "Gagal mengunggah file");
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Gambar Berhasil Diunggah ke MinIO", {
        description: `Tersimpan di ${data.file_name}`,
      });
      options?.onSuccess?.(data);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Gagal mengunggah file ke MinIO"));
      if (err instanceof Error) {
        options?.onError?.(err);
      }
    },
  });
}
