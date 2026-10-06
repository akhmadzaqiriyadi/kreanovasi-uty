"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Html5Qrcode } from "html5-qrcode";
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  Loader2,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractivePagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { allEvents as staticEvents } from "@/config/events";
import {
  type BackendEvent,
  type BackendEventRegistration,
  useAdminEventRegistrationsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventCheckInMutation,
  useEventsQuery,
  useUpdateRegistrationStatusMutation,
} from "@/hooks/use-event-queries";
import { cn } from "@/lib/utils";

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

  // Merge static events and backend events for complete display
  const combinedEventOptions =
    liveEvents.length > 0
      ? liveEvents
      : staticEvents.map((evt) => ({
          id: evt.id,
          slug: evt.slug,
          title: evt.title,
          category_name: evt.category.name,
          category_variant: evt.category.variant,
          quota_total: evt.quota?.total || 100,
          quota_filled: evt.quota?.filled || 0,
          quota_status: evt.quota?.status || "open",
          quota_status_label: evt.quota?.statusLabel || "Buka",
          fee: evt.fee || "Gratis",
          is_free: evt.isFree !== false,
          status: "published" as const,
          date_day: evt.date.day,
          date_month: evt.date.month,
          date_year: evt.date.year,
          date_full_text: evt.date.fullText,
          time: evt.time,
          location_name: evt.location.name,
          cover_image: evt.coverImage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

  const {
    data: registrationsData,
    isLoading: isRegistrationsLoading,
    refetch: refetchRegistrations,
    isRefetching,
  } = useAdminEventRegistrationsQuery(
    selectedEventId !== "all" ? selectedEventId : undefined,
    {
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: searchQuery || undefined,
      page: currentPage,
      limit: pageSize,
    },
  );

  const updateStatusMutation =
    useUpdateRegistrationStatusMutation(selectedEventId);
  const _deleteEventMutation = useDeleteEventMutation();

  const registrations = registrationsData?.registrations || [];
  const pagination = registrationsData?.pagination || {
    page: 1,
    limit: pageSize,
    total_items: 0,
    total_pages: 1,
  };

  // Metrics
  const totalCount = pagination.total_items;
  const pendingCount = registrations.filter(
    (r) => r.status === "pending_review",
  ).length;
  const _revisionCount = registrations.filter(
    (r) => r.status === "needs_revision",
  ).length;
  const approvedCount = registrations.filter(
    (r) => r.status === "approved",
  ).length;
  const attendedCount = registrations.filter(
    (r) => r.status === "attended",
  ).length;

  const handleUpdateStatus = async (
    registrationId: string,
    status: string,
    notes?: string,
  ) => {
    await updateStatusMutation.mutateAsync({
      registrationId,
      status,
      adminNotes: notes,
    });
    setVerifyActionModal(null);
    setAdminNotes("");
  };

  const handleExportCSV = async () => {
    try {
      const url =
        selectedEventId !== "all"
          ? `/api/v1/events/${selectedEventId}/export`
          : `/api/v1/events/export`;
      window.open(url, "_blank");
      toast.success("Mengunduh data pendaftar agenda...");
    } catch {
      toast.error("Gagal mengekspor data CSV");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-linear-to-r from-primary/10 via-background to-secondary/10 border border-border/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">
            <Ticket className="w-3.5 h-3.5" />
            <span>Manajemen Agenda & Pendaftar Resmi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Panel Kendali Panitia Event UCH
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Verifikasi bukti bayar, kontrol kuota pendaftaran, dan kelola
            check-in barcode kehadiran di lokasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Button
            onClick={() => setIsScannerOpen(true)}
            className="rounded-xl h-10 px-4 text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Tiket QR</span>
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="secondary"
            className="rounded-xl h-10 px-4 text-xs font-bold gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Event Baru</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchRegistrations()}
            disabled={isRefetching}
            className="rounded-xl h-10 w-10 shrink-0"
            title="Muat ulang pendaftar"
          >
            <RefreshCw
              className={cn("w-4 h-4", isRefetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-2xl border-border/70 p-4 space-y-1 bg-card/60">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Total Pendaftar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">
              {totalCount}
            </span>
            <Users className="w-4 h-4 text-primary shrink-0" />
          </div>
        </Card>

        <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
            Menunggu Verifikasi
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingCount}
            </span>
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
        </Card>

        <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
            Tiket Terbit (Aktif)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {approvedCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        </Card>

        <Card className="rounded-2xl border-blue-500/30 bg-blue-500/5 p-4 space-y-1">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
            Telah Hadir (Check-In)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {attendedCount}
            </span>
            <Award className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
        </Card>
      </div>

      {/* Tabs Switcher: Registrations vs Event Catalog */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "registrations" | "events")}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
          <TabsList className="bg-muted/60 p-1 rounded-2xl h-auto">
            <TabsTrigger
              value="registrations"
              className="rounded-xl px-4 py-2 text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Daftar Pendaftar & Review</span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-xl px-4 py-2 text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kelola Agenda ({combinedEventOptions.length})</span>
            </TabsTrigger>
          </TabsList>

          {activeTab === "registrations" && (
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 px-3.5 gap-1.5 font-semibold text-foreground"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Unduh CSV Peserta</span>
            </Button>
          )}
        </div>

        {/* TAB 1: REGISTRATIONS MANAGEMENT */}
        <TabsContent value="registrations" className="space-y-5">
          {/* Controls: Event Selector, Status Pills & Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Event Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Pilih Agenda
              </Label>
              <Select
                value={selectedEventId}
                onValueChange={(val) => {
                  setSelectedEventId(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-border/80">
                  <SelectValue placeholder="Semua Agenda" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Agenda Aktif</SelectItem>
                  {combinedEventOptions.map((evt) => (
                    <SelectItem key={evt.id} value={evt.id}>
                      {evt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Filter Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-border/80">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending_review">
                    Menunggu Review
                  </SelectItem>
                  <SelectItem value="needs_revision">
                    Perlu Revisi Berkas
                  </SelectItem>
                  <SelectItem value="approved">Tiket Aktif</SelectItem>
                  <SelectItem value="attended">Telah Hadir</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Cari Peserta
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Nama, kode tiket, atau email..."
                  className="pl-9 h-10 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Registrations List / Table */}
          {isRegistrationsLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">
                Memuat daftar pendaftar agenda...
              </p>
            </div>
          ) : registrations.length > 0 ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Kode Tiket</th>
                        <th className="py-3 px-4">Nama & Identitas</th>
                        <th className="py-3 px-4">Kontak</th>
                        <th className="py-3 px-4">Agenda</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Berkas</th>
                        <th className="py-3 px-4 text-right">Aksi Panitia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-card/40">
                      {registrations.map((reg) => {
                        const isApproved = reg.status === "approved";
                        const isPending = reg.status === "pending_review";
                        const isNeedsRevision = reg.status === "needs_revision";
                        const isAttended = reg.status === "attended";
                        const isRejected = reg.status === "rejected";

                        return (
                          <tr
                            key={reg.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            {/* Registration Code */}
                            <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                              {reg.registration_code}
                            </td>

                            {/* Identity */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-foreground">
                                {reg.full_name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {reg.institution}
                                {reg.identity_number && (
                                  <span> • {reg.identity_number}</span>
                                )}
                              </div>
                            </td>

                            {/* Contacts */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div>{reg.email}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {reg.phone}
                              </div>
                            </td>

                            {/* Event Title */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <span
                                className="truncate block font-medium text-foreground"
                                title={reg.event_title}
                              >
                                {reg.event_title || "Agenda Resmi"}
                              </span>
                            </td>

                            {/* Status Badge */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "rounded-lg text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
                                  isApproved &&
                                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                                  isAttended &&
                                    "bg-blue-500/10 text-blue-600 border-blue-500/30",
                                  isPending &&
                                    "bg-amber-500/10 text-amber-600 border-amber-500/30",
                                  isNeedsRevision &&
                                    "bg-orange-500/10 text-orange-600 border-orange-500/30",
                                  isRejected &&
                                    "bg-red-500/10 text-red-600 border-red-500/30",
                                )}
                              >
                                {isApproved
                                  ? "Aktif"
                                  : isAttended
                                    ? "Hadir"
                                    : isPending
                                      ? "Review"
                                      : isNeedsRevision
                                        ? "Revisi"
                                        : isRejected
                                          ? "Ditolak"
                                          : reg.status}
                              </Badge>
                            </td>

                            {/* Payment Proof / Custom Answers */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedReg(reg)}
                                className="rounded-xl h-8 px-2.5 text-[11px] font-semibold gap-1 text-primary hover:text-primary"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detail</span>
                              </Button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        setVerifyActionModal({
                                          registration: reg,
                                          type: "approve",
                                        })
                                      }
                                      className="rounded-xl text-[11px] h-7 px-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Setuju
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setVerifyActionModal({
                                          registration: reg,
                                          type: "needs_revision",
                                        })
                                      }
                                      className="rounded-xl text-[11px] h-7 px-2.5 font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
                                    >
                                      Revisi
                                    </Button>
                                  </>
                                )}

                                {isApproved && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateStatus(reg.id, "attended")
                                    }
                                    className="rounded-xl text-[11px] h-7 px-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                  >
                                    Check-In
                                  </Button>
                                )}

                                {isAttended && (
                                  <span className="text-[10px] text-blue-600 font-semibold italic">
                                    ✓ Telah hadir
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Pagination */}
              {pagination.total_pages > 1 && (
                <InteractivePagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-border/80 rounded-3xl p-8 space-y-3">
              <Users className="w-10 h-10 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Tidak Ada Pendaftar Ditemukan
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Belum ada peserta yang mendaftar atau tidak sesuai kriteria
                  filter pencarian.
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: EVENTS CATALOG MANAGEMENT */}
        <TabsContent value="events" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {combinedEventOptions.map((evt) => {
              const _isPast =
                evt.date_year &&
                parseInt(evt.date_year, 10) < 2026 &&
                parseInt(evt.date_month, 10) < 10;

              return (
                <Card
                  key={evt.id}
                  className="rounded-3xl border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 w-full bg-muted/40 overflow-hidden">
                      <Image
                        src={evt.cover_image || "/images/room1.jpeg"}
                        alt={evt.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 left-3 rounded-lg text-[10px] font-bold">
                        {evt.category_name}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 rounded-lg text-[10px] font-bold bg-background/80 backdrop-blur-md"
                      >
                        {evt.fee}
                      </Badge>
                    </div>

                    <CardHeader className="p-4 pb-2 space-y-1">
                      <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                        {evt.title}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>
                          {evt.date_full_text ||
                            `${evt.date_day} ${evt.date_month} ${evt.date_year}`}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-semibold text-foreground">
                          Kuota Peserta:
                        </span>
                        <span>
                          {evt.quota_filled} / {evt.quota_total} terisi
                        </span>
                      </div>

                      {/* Quota Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (evt.quota_filled / evt.quota_total) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-4 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`/events/${evt.slug}`} target="_blank">
                        <span>Lihat Publik</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setActiveTab("registrations");
                      }}
                      className="rounded-xl text-xs h-8 px-3 font-semibold"
                    >
                      Lihat Pendaftar
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: QR BARCODE SCANNER CHECK-IN */}
      <EventCheckInScannerModal
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
      />

      {/* MODAL 2: DETAIL REGISTRATION & PROOF VIEWER */}
      {selectedReg && (
        <Dialog
          open={Boolean(selectedReg)}
          onOpenChange={(open) => !open && setSelectedReg(null)}
        >
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-lg p-5 sm:p-7 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Detail Pendaftar Agenda
              </span>
              <DialogTitle className="text-lg font-bold">
                {selectedReg.full_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Kode: {selectedReg.registration_code} •{" "}
                {selectedReg.event_title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Identity Info */}
              <div className="rounded-2xl bg-muted/40 p-3.5 border border-border/60 space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Institusi / Prodi:
                    </span>
                    <strong className="text-foreground">
                      {selectedReg.institution}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      NPM / Identitas:
                    </span>
                    <strong className="text-foreground">
                      {selectedReg.identity_number || "-"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      Email:
                    </span>
                    <strong className="text-foreground">
                      {selectedReg.email}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      WhatsApp:
                    </span>
                    <strong className="text-foreground">
                      {selectedReg.phone}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Dynamic JSON Schema Answers */}
              {selectedReg.answers &&
                Object.keys(selectedReg.answers).length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Jawaban Kuesioner Khusus:
                    </span>
                    <div className="rounded-2xl border border-border/70 p-3 space-y-2 bg-card/60">
                      {Object.entries(selectedReg.answers).map(([key, val]) => (
                        <div
                          key={key}
                          className="border-b border-border/40 pb-1.5 last:border-none last:pb-0"
                        >
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">
                            {key.replace(/_/g, " ")}:
                          </span>
                          <span className="text-xs text-foreground font-medium">
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Payment Proof / File Upload */}
              {selectedReg.payment_proof_url ? (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Bukti Pembayaran / Transfer:
                  </span>
                  <div className="rounded-2xl border border-border/70 overflow-hidden bg-muted/20 p-2 text-center">
                    <Image
                      src={selectedReg.payment_proof_url}
                      alt="Bukti Transfer"
                      width={400}
                      height={300}
                      unoptimized
                      className="max-h-60 w-auto mx-auto rounded-xl object-contain border border-border/50"
                    />
                    <a
                      href={selectedReg.payment_proof_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-2 font-medium"
                    >
                      <span>Buka Bukti Gambar Penuh</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    Agenda Gratis / Tidak memerlukan bukti transfer bayar.
                  </span>
                </div>
              )}

              {/* Notes */}
              {selectedReg.notes && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    Catatan Peserta:
                  </span>
                  <p className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-xs">
                    {selectedReg.notes}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReg(null)}
                className="rounded-xl text-xs"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 3: VERIFY ACTION (APPROVE / REVISION / REJECT) */}
      {verifyActionModal && (
        <Dialog
          open={Boolean(verifyActionModal)}
          onOpenChange={(open) => !open && setVerifyActionModal(null)}
        >
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
            <DialogHeader className="space-y-1">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  verifyActionModal.type === "approve" && "text-emerald-600",
                  verifyActionModal.type === "needs_revision" &&
                    "text-amber-600",
                  verifyActionModal.type === "reject" && "text-red-600",
                )}
              >
                {verifyActionModal.type === "approve"
                  ? "Setujui & Terbitkan Tiket"
                  : verifyActionModal.type === "needs_revision"
                    ? "Minta Revisi Berkas"
                    : "Tolak Pendaftaran"}
              </span>
              <DialogTitle className="text-lg font-bold">
                {verifyActionModal.registration.full_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {verifyActionModal.type === "approve"
                  ? "Setelah disetujui, e-tiket barcode resmi peserta akan langsung aktif."
                  : "Sertakan catatan perbaikan agar peserta dapat mengunggah ulang berkasnya."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Catatan Panitia (Opsional untuk Approve / Wajib untuk Revisi):
                </Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    verifyActionModal.type === "needs_revision"
                      ? "Contoh: Bukti transfer tidak jelas / nominal kurang..."
                      : "Pesan sambutan atau instruksi kehadiran..."
                  }
                  rows={3}
                  className="text-xs rounded-xl resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVerifyActionModal(null)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  handleUpdateStatus(
                    verifyActionModal.registration.id,
                    verifyActionModal.type === "approve"
                      ? "approved"
                      : verifyActionModal.type === "needs_revision"
                        ? "needs_revision"
                        : "rejected",
                    adminNotes,
                  )
                }
                disabled={
                  updateStatusMutation.isPending ||
                  (verifyActionModal.type === "needs_revision" &&
                    !adminNotes.trim())
                }
                className={cn(
                  "rounded-xl text-xs font-bold",
                  verifyActionModal.type === "approve" &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                  verifyActionModal.type === "needs_revision" &&
                    "bg-amber-600 hover:bg-amber-700 text-white",
                  verifyActionModal.type === "reject" &&
                    "bg-red-600 hover:bg-red-700 text-white",
                )}
              >
                {updateStatusMutation.isPending ? "Menyimpan..." : "Konfirmasi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 4: CREATE EVENT MODAL */}
      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// ----------------------------------------------------
// SUBCOMPONENT: CHECK-IN QR SCANNER MODAL
// ----------------------------------------------------

function EventCheckInScannerModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("manual");
  const [lastCheckedIn, setLastCheckedIn] =
    useState<BackendEventRegistration | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const {
    register: registerCheckIn,
    handleSubmit: handleCheckInSubmit,
    reset: resetCheckIn,
    watch: watchCheckIn,
  } = useForm<{ manualCode: string }>({
    defaultValues: { manualCode: "" },
  });
  const currentManualCode = watchCheckIn("manualCode");

  const checkInMutation = useEventCheckInMutation();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const handleProcessCode = async (code: string) => {
    if (!code || isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const res = await checkInMutation.mutateAsync(code.trim());
      if (res.data) {
        setLastCheckedIn(res.data);
        toast.success(`Check-in Berhasil: ${res.data.full_name}`);
      }
    } catch {
      // toast handled
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    if (!open || activeTab !== "camera") {
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        scanner
          .stop()
          .catch(() => {})
          .then(() => scanner.clear());
      }
      return;
    }

    const scannerElementId = "event-checkin-scanner-box";
    const timer = setTimeout(() => {
      if (isCancelled) return;
      const el = document.getElementById(scannerElementId);
      if (!el) return;

      try {
        const qrScanner = new Html5Qrcode(scannerElementId);
        html5QrCodeRef.current = qrScanner;

        qrScanner
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              handleProcessCode(decodedText);
            },
            () => {},
          )
          .catch(() => {
            setCameraError(
              "Tidak dapat mengakses kamera. Pastikan izin kamera aktif atau gunakan input manual kode tiket.",
            );
          });
      } catch {
        // Element not ready or camera error
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        html5QrCodeRef.current = null;
        scanner
          .stop()
          .catch(() => {})
          .then(() => scanner.clear());
      }
    };
  }, [open, activeTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
        <DialogHeader className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
            <QrCode className="w-3.5 h-3.5" />
            <span>Check-in Hari H Acara</span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Scan Tiket Barcode Peserta
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Arahkan kamera ke QR tiket peserta atau masukkan kode tiket secara
            manual.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector: Kamera vs Manual */}
        <div className="flex rounded-xl bg-muted p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("camera")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors",
              activeTab === "camera"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Kamera Barcode
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors",
              activeTab === "manual"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Ketik Manual
          </button>
        </div>

        {activeTab === "camera" ? (
          <div className="space-y-3">
            <div
              id="event-checkin-scanner-box"
              className="w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-border/80 bg-zinc-950"
            />
            {cameraError && (
              <p className="text-[11px] text-amber-600 text-center">
                {cameraError}
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleCheckInSubmit((data) => {
              handleProcessCode(data.manualCode);
              resetCheckIn();
            })}
            className="space-y-3 py-2"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Kode Tiket Peserta (Contoh: UCH-EVT-CTALK-2026)
              </Label>
              <Input
                {...registerCheckIn("manualCode", { required: true })}
                placeholder="UCH-EVT-..."
                className="h-10 text-xs font-mono font-bold tracking-wider rounded-xl uppercase"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={checkInMutation.isPending || !currentManualCode?.trim()}
              className="w-full rounded-xl text-xs font-bold h-10"
            >
              {checkInMutation.isPending
                ? "Memverifikasi..."
                : "Verifikasi Tiket"}
            </Button>
          </form>
        )}

        {/* Checked In Confirmation Banner */}
        {lastCheckedIn && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kehadiran Terkonfirmasi!</span>
            </div>
            <p className="text-foreground">
              <strong>{lastCheckedIn.full_name}</strong> (
              {lastCheckedIn.institution})
            </p>
            <p className="text-muted-foreground text-[11px]">
              Kode: {lastCheckedIn.registration_code}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl text-xs"
          >
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------
// SUBCOMPONENT: CREATE EVENT MODAL WITH REACT-HOOK-FORM
// ----------------------------------------------------

const createEventSchema = z.object({
  title: z.string().min(3, "Judul agenda minimal 3 karakter"),
  slug: z.string().min(3, "Slug agenda minimal 3 karakter"),
  category_name: z.string().min(1, "Kategori wajib diisi"),
  description: z.string(),
  date_day: z.string(),
  date_month: z.string(),
  date_year: z.string(),
  date_full_text: z.string().min(1, "Tanggal agenda wajib diisi"),
  time: z.string().min(1, "Waktu sesi wajib diisi"),
  location_name: z.string().min(1, "Lokasi agenda wajib diisi"),
  quota_total: z.number().min(1, "Total kuota minimal 1 peserta"),
  fee: z.string(),
  is_free: z.boolean(),
  requires_approval: z.boolean(),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

function CreateEventModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateEventMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      slug: "",
      category_name: "Workshop & Seminar",
      description: "",
      date_day: "15",
      date_month: "OKT",
      date_year: "2026",
      date_full_text: "Kamis, 15 Oktober 2026",
      time: "09:00 - 13:00 WIB",
      location_name: "Laboratorium FastLab UCH",
      quota_total: 50,
      fee: "Gratis",
      is_free: true,
      requires_approval: false,
    },
  });

  const onSubmit = async (values: CreateEventFormValues) => {
    await createMutation.mutateAsync({
      ...values,
      quota_total: Number(values.quota_total),
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-lg p-5 sm:p-7 rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase">
            Agenda Baru
          </span>
          <DialogTitle className="text-lg font-bold">
            Publikasikan Event UCH
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Lengkapi formulir untuk mempublikasikan agenda baru di portal UTY
            Creative Hub.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3.5 py-2 text-xs"
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Judul Agenda *</Label>
            <Input
              required
              {...register("title", {
                onChange: (e) => {
                  const title = e.target.value;
                  const slug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
                  setValue("slug", slug, { shouldValidate: true });
                },
              })}
              placeholder="Contoh: AI & IoT FastLab Bootcamp 2026"
              className="h-10 text-xs rounded-xl"
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kategori</Label>
              <Input
                {...register("category_name")}
                className="h-10 text-xs rounded-xl"
              />
              {errors.category_name && (
                <p className="text-[11px] text-destructive">
                  {errors.category_name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Total Kuota *</Label>
              <Input
                type="number"
                required
                {...register("quota_total", { valueAsNumber: true })}
                className="h-10 text-xs rounded-xl"
              />
              {errors.quota_total && (
                <p className="text-[11px] text-destructive">
                  {errors.quota_total.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tanggal Agenda *</Label>
              <Input
                {...register("date_full_text")}
                placeholder="Kamis, 15 Oktober 2026"
                className="h-10 text-xs rounded-xl"
              />
              {errors.date_full_text && (
                <p className="text-[11px] text-destructive">
                  {errors.date_full_text.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Waktu Sesi *</Label>
              <Input
                {...register("time")}
                placeholder="09:00 - 13:00 WIB"
                className="h-10 text-xs rounded-xl"
              />
              {errors.time && (
                <p className="text-[11px] text-destructive">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Lokasi Pelaksanaan *
            </Label>
            <Input
              {...register("location_name")}
              placeholder="Ruang FastLab UCH Lt. 2"
              className="h-10 text-xs rounded-xl"
            />
            {errors.location_name && (
              <p className="text-[11px] text-destructive">
                {errors.location_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Deskripsi Singkat</Label>
            <Textarea
              {...register("description")}
              rows={2}
              placeholder="Jelaskan gambaran umum agenda..."
              className="text-xs rounded-xl resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              size="sm"
              className="rounded-xl text-xs font-bold px-5"
            >
              {createMutation.isPending
                ? "Menyimpan..."
                : "Publikasikan Agenda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
