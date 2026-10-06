"use client";

import { Calendar, CheckCircle2, Plus, Ticket, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allEvents as staticEvents } from "@/config/events";
import {
  type BackendEvent,
  type BackendEventRegistration,
  useAdminEventRegistrationsQuery,
  useDeleteEventMutation,
  useEventsQuery,
  useUpdateRegistrationStatusMutation,
} from "@/hooks/use-event-queries";
import {
  EventCatalogCards,
  EventCheckInScannerModal,
  EventDeleteDialog,
  EventEditorModal,
  RegistrationDetailModal,
  RegistrationsTable,
  RegistrationVerifyModal,
} from "./events";

export function AdminEventsManager() {
  const [activeTab, setActiveTab] = useState<"registrations" | "events">(
    "registrations",
  );
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BackendEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<BackendEvent | null>(null);
  const [selectedReg, setSelectedReg] =
    useState<BackendEventRegistration | null>(null);
  const [verifyActionModal, setVerifyActionModal] = useState<{
    registration: BackendEventRegistration;
    type: "approve" | "needs_revision" | "reject";
  } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Queries & Mutations
  const { data: eventsData } = useEventsQuery({
    limit: 100,
  });
  const liveEvents: BackendEvent[] = eventsData?.events || [];

  const combinedEventOptions: BackendEvent[] =
    liveEvents.length > 0
      ? liveEvents
      : staticEvents.map((evt) => ({
          id: evt.id,
          slug: evt.slug,
          title: evt.title,
          description: evt.description,
          long_description: evt.longDescription,
          category_name: evt.category.name,
          category_variant: evt.category.variant,
          event_date: `${evt.date.year}-10-${evt.date.day}`,
          date_day: evt.date.day,
          date_month: evt.date.month,
          date_year: evt.date.year,
          date_full_text: evt.date.fullText,
          time: evt.time,
          location_name: evt.location.name,
          location_room: evt.location.room,
          location_type: "offline",
          cover_image: evt.coverImage,
          quota_total: evt.quota?.total || 100,
          quota_filled: evt.quota?.filled || 0,
          quota_status: evt.quota?.status || "open",
          quota_status_label: evt.quota?.statusLabel || "Pendaftaran Dibuka",
          featured: false,
          is_free: evt.isFree ?? true,
          price: evt.price || 0,
          fee: evt.fee || "Gratis",
          requires_approval: evt.requiresApproval ?? false,
          rundown: evt.rundown,
          status: "published",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  const {
    data: registrationsData,
    isLoading: isLoadingRegistrations,
    refetch: refetchRegistrations,
  } = useAdminEventRegistrationsQuery(
    selectedEventId === "all" ? undefined : selectedEventId,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
      page: currentPage,
      limit: pageSize,
    },
  );

  const registrations: BackendEventRegistration[] =
    registrationsData?.registrations || [];
  const pagination = registrationsData?.pagination || {
    page: 1,
    limit: pageSize,
    total_items: 0,
    total_pages: 1,
  };

  const deleteEventMutation = useDeleteEventMutation();
  const updateStatusMutation = useUpdateRegistrationStatusMutation(
    selectedEventId === "all" ? undefined : selectedEventId,
  );

  const handleConfirmVerifyAction = async () => {
    if (!verifyActionModal) return;
    const targetStatus =
      verifyActionModal.type === "approve"
        ? "approved"
        : verifyActionModal.type === "needs_revision"
          ? "needs_revision"
          : "rejected";

    await updateStatusMutation.mutateAsync({
      registrationId: verifyActionModal.registration.id,
      status: targetStatus,
      adminNotes: adminNotes || undefined,
    });
    setVerifyActionModal(null);
    setAdminNotes("");
  };

  const handleDirectCheckIn = async (regId: string) => {
    await updateStatusMutation.mutateAsync({
      registrationId: regId,
      status: "attended",
    });
  };

  // Quick Stats
  const totalRegistrations = pagination.total_items;
  const approvedCount = registrations.filter(
    (r) => r.status === "approved",
  ).length;
  const attendedCount = registrations.filter(
    (r) => r.status === "attended",
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Manajemen Agenda & Pendaftar Event
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola katalog agenda inovasi, buat/edit agenda baru, susun rundown,
            dan verifikasi e-tiket peserta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="rounded-xl text-xs font-bold gap-1.5 h-9 px-4 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agenda Baru</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-2xl border-border/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Total Pendaftar
            </span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black mt-2 text-foreground">
            {totalRegistrations}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Semua registrasi masuk
          </p>
        </Card>

        <Card className="rounded-2xl border-border/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Tiket Aktif
            </span>
            <Ticket className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-400">
            {approvedCount}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Telah terverifikasi
          </p>
        </Card>

        <Card className="rounded-2xl border-border/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Kehadiran Hari H
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-400">
            {attendedCount}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Sudah check-in di lokasi
          </p>
        </Card>

        <Card className="rounded-2xl border-border/70 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Agenda Aktif
            </span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black mt-2 text-foreground">
            {combinedEventOptions.length}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Katalog kegiatan terbit
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "registrations" | "events")}
        className="space-y-4"
      >
        <TabsList className="p-1 rounded-2xl bg-muted/60 border border-border/60">
          <TabsTrigger
            value="registrations"
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer data-[state=checked]:bg-background data-[state=checked]:shadow-xs"
          >
            Peserta Terdaftar ({pagination.total_items})
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer data-[state=checked]:bg-background data-[state=checked]:shadow-xs"
          >
            Semua Agenda ({combinedEventOptions.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Registrations Table */}
        <TabsContent value="registrations">
          <RegistrationsTable
            events={combinedEventOptions}
            registrations={registrations}
            selectedEventId={selectedEventId}
            onSelectedEventIdChange={(id) => {
              setSelectedEventId(id);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              setCurrentPage(1);
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            onPageChange={setCurrentPage}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSelectRegistration={setSelectedReg}
            onVerifyAction={(reg, type) =>
              setVerifyActionModal({ registration: reg, type })
            }
            onCheckIn={handleDirectCheckIn}
            onRefetch={refetchRegistrations}
            isLoading={isLoadingRegistrations}
          />
        </TabsContent>

        {/* Tab 2: Events Catalog Cards */}
        <TabsContent value="events">
          <EventCatalogCards
            events={combinedEventOptions}
            onEdit={setEditingEvent}
            onDelete={setDeletingEvent}
            onSelectEvent={(eventId) => {
              setSelectedEventId(eventId);
              setActiveTab("registrations");
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Atomic Modals */}
      <EventCheckInScannerModal
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
      />

      <RegistrationDetailModal
        registration={selectedReg}
        onClose={() => setSelectedReg(null)}
      />

      <RegistrationVerifyModal
        modalData={verifyActionModal}
        adminNotes={adminNotes}
        onAdminNotesChange={setAdminNotes}
        onConfirm={handleConfirmVerifyAction}
        onClose={() => setVerifyActionModal(null)}
        isPending={updateStatusMutation.isPending}
      />

      <EventEditorModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <EventEditorModal
        open={Boolean(editingEvent)}
        onOpenChange={(open) => !open && setEditingEvent(null)}
        eventToEdit={editingEvent}
      />

      <EventDeleteDialog
        open={Boolean(deletingEvent)}
        onOpenChange={(open) => !open && setDeletingEvent(null)}
        event={deletingEvent}
        isPending={deleteEventMutation.isPending}
        onConfirm={async () => {
          if (deletingEvent) {
            await deleteEventMutation.mutateAsync(deletingEvent.id);
            setDeletingEvent(null);
          }
        }}
      />
    </div>
  );
}
