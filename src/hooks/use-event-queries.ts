"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth";

export interface CustomFieldDefinition {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "file";
  required: boolean;
  placeholder?: string;
  options?: string[];
  accept?: string;
}

export interface PaymentInfo {
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  qris_image_url?: string;
  instructions?: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  institution: string;
  avatarUrl?: string;
}

export interface EventRundownItem {
  time: string;
  activity: string;
  speaker?: string;
  details?: string;
}

export interface EventContactPerson {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface BackendEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  series_id?: string | null;
  series_name?: string | null;
  category_name: string;
  category_variant: "primary" | "secondary" | "accent";
  event_date: string; // YYYY-MM-DD
  date_day: string;
  date_month: string;
  date_year: string;
  date_full_text: string;
  time: string;
  location_name: string;
  location_room?: string | null;
  location_address?: string | null;
  location_type: "offline" | "online" | "hybrid";
  cover_image: string;
  quota_total: number;
  quota_filled: number;
  quota_status: "open" | "closing-soon" | "full";
  quota_status_label: string;
  registration_url?: string | null;
  featured: boolean;
  is_free: boolean;
  price: number;
  payment_info?: PaymentInfo;
  requires_approval: boolean;
  custom_fields_schema?: CustomFieldDefinition[];
  speakers?: EventSpeaker[];
  rundown?: EventRundownItem[];
  benefits?: string[];
  prerequisites?: string[];
  target_audience?: string | null;
  registration_deadline?: string | null;
  fee: string;
  contact_person?: EventContactPerson | null;
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface BackendEventRegistration {
  id: string;
  registration_code: string;
  event_id: string;
  event_title?: string;
  event_slug?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  user_id: string;
  full_name: string;
  identity_number?: string | null;
  institution: string;
  email: string;
  phone: string;
  notes?: string | null;
  answers?: Record<string, unknown>;
  uploaded_files?: string[];
  payment_proof_url?: string | null;
  status:
    | "pending_review"
    | "needs_revision"
    | "approved"
    | "rejected"
    | "attended"
    | "cancelled";
  admin_notes?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  attended_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventPagination {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface EventListResponse {
  events: BackendEvent[];
  pagination: EventPagination;
}

export interface RegistrationListResponse {
  registrations: BackendEventRegistration[];
  pagination: EventPagination;
}

export interface RegisterEventPayload {
  full_name: string;
  identity_number?: string;
  institution: string;
  email: string;
  phone: string;
  notes?: string;
  answers?: Record<string, unknown>;
  uploaded_files?: string[];
  payment_proof_url?: string;
}

export interface ReviseRegistrationPayload {
  notes?: string;
  answers?: Record<string, unknown>;
  uploaded_files?: string[];
  payment_proof_url?: string;
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
// 1. Events Queries (Public & Filtered)
// ----------------------------------------------------

export interface EventsQueryParams {
  category?: string;
  series_id?: string;
  status?: string;
  search?: string;
  upcoming?: boolean;
  past?: boolean;
  page?: number;
  limit?: number;
}

export function useEventsQuery(params?: EventsQueryParams) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const res = await apiClient.get<ApiEnvelope<EventListResponse>>("/events", {
        params,
      });
      return (
        res.data?.data || {
          events: [],
          pagination: { page: 1, limit: 20, total_items: 0, total_pages: 1 },
        }
      );
    },
    staleTime: 30 * 1000,
  });
}

export function useEventDetailQuery(idOrSlug: string) {
  return useQuery({
    queryKey: ["events", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const res = await apiClient.get<ApiEnvelope<BackendEvent>>(
        `/events/${idOrSlug}`,
      );
      return res.data?.data || null;
    },
    enabled: Boolean(idOrSlug),
    staleTime: 30 * 1000,
  });
}

// ----------------------------------------------------
// 2. User Registration Queries & Mutations (Protected)
// ----------------------------------------------------

export function useMyEventRegistrationQuery(
  eventIdOrSlug?: string,
  isLoggedIn = false,
) {
  return useQuery({
    queryKey: ["my-event-registration", eventIdOrSlug],
    queryFn: async () => {
      if (!eventIdOrSlug || !isLoggedIn) return null;
      try {
        const res = await apiClient.get<ApiEnvelope<BackendEventRegistration>>(
          `/events/${eventIdOrSlug}/my-registration`,
        );
        return res.data?.data || null;
      } catch {
        return null;
      }
    },
    enabled: Boolean(eventIdOrSlug && isLoggedIn),
    staleTime: 10 * 1000,
  });
}

export function useMyEventRegistrationsQuery(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["my-event-registrations", params],
    queryFn: async () => {
      const res = await apiClient.get<
        ApiEnvelope<RegistrationListResponse>
      >("/my-event-registrations", { params });
      return (
        res.data?.data || {
          registrations: [],
          pagination: { page: 1, limit: 20, total_items: 0, total_pages: 1 },
        }
      );
    },
    staleTime: 15 * 1000,
  });
}

export function useRegisterEventMutation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegisterEventPayload) => {
      const res = await apiClient.post<ApiEnvelope<BackendEventRegistration>>(
        `/events/${eventId}/register`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Pendaftaran agenda berhasil dikonfirmasi");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["my-event-registration", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-event-registrations"],
      });
    },
    onError: (err) => {
      const msg = getErrorMessage(
        err,
        "Gagal memproses pendaftaran agenda. Silakan coba kembali.",
      );
      toast.error("Pendaftaran Gagal", { description: msg });
    },
  });
}

export function useReviseRegistrationMutation(registrationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReviseRegistrationPayload) => {
      const res = await apiClient.post<ApiEnvelope<BackendEventRegistration>>(
        `/events/registrations/${registrationId}/revise`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Revisi berkas berhasil dikirim untuk diverifikasi");
      queryClient.invalidateQueries({
        queryKey: ["my-event-registrations"],
      });
      queryClient.invalidateQueries({ queryKey: ["my-event-registration"] });
    },
    onError: (err) => {
      const msg = getErrorMessage(
        err,
        "Gagal mengirimkan revisi. Silakan periksa kembali.",
      );
      toast.error("Gagal Mengirim Revisi", { description: msg });
    },
  });
}

// ----------------------------------------------------
// 3. Admin Event & Attendee Management (Protected)
// ----------------------------------------------------

export function useAdminEventRegistrationsQuery(
  eventId: string,
  params?: { status?: string; search?: string; page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["admin-event-registrations", eventId, params],
    queryFn: async () => {
      if (!eventId) return null;
      const res = await apiClient.get<ApiEnvelope<RegistrationListResponse>>(
        `/events/${eventId}/registrations`,
        { params },
      );
      return (
        res.data?.data || {
          registrations: [],
          pagination: { page: 1, limit: 25, total_items: 0, total_pages: 1 },
        }
      );
    },
    enabled: Boolean(eventId),
    staleTime: 10 * 1000,
  });
}

export function useUpdateRegistrationStatusMutation(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      registrationId,
      status,
      adminNotes,
    }: {
      registrationId: string;
      status: string;
      adminNotes?: string;
    }) => {
      const res = await apiClient.patch<ApiEnvelope<BackendEventRegistration>>(
        `/events/registrations/${registrationId}/status`,
        { status, admin_notes: adminNotes },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Status peserta berhasil diperbarui");
      queryClient.invalidateQueries({
        queryKey: ["admin-event-registrations", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const msg = getErrorMessage(err, "Gagal memperbarui status peserta");
      toast.error("Gagal", { description: msg });
    },
  });
}

export function useEventCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationCode: string) => {
      const res = await apiClient.post<ApiEnvelope<BackendEventRegistration>>(
        "/events/checkin",
        { registration_code: registrationCode },
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Check-in peserta berhasil");
      queryClient.invalidateQueries({ queryKey: ["admin-event-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const msg = getErrorMessage(
        err,
        "Tiket tidak valid atau tidak ditemukan.",
      );
      toast.error("Gagal Check-In", { description: msg });
    },
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<BackendEvent>) => {
      const res = await apiClient.post<ApiEnvelope<BackendEvent>>(
        "/events",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agenda baru berhasil dipublikasikan");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const msg = getErrorMessage(err, "Gagal membuat agenda baru");
      toast.error("Gagal", { description: msg });
    },
  });
}

export function useUpdateEventMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<BackendEvent>) => {
      const res = await apiClient.put<ApiEnvelope<BackendEvent>>(
        `/events/${id}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agenda berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
    onError: (err) => {
      const msg = getErrorMessage(err, "Gagal memperbarui agenda");
      toast.error("Gagal", { description: msg });
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete<ApiEnvelope<null>>(`/events/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Agenda berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const msg = getErrorMessage(err, "Gagal menghapus agenda");
      toast.error("Gagal", { description: msg });
    },
  });
}
