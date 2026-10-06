"use client";

import {
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Loader2,
  LogIn,
  MapPin,
  QrCode,
  RefreshCw,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import {
  type BackendEventRegistration,
  useMyEventRegistrationsQuery,
  useReviseRegistrationMutation,
} from "@/hooks/use-event-queries";
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function MyEventsPage() {
  const { isLoggedIn, isAuthLoading, openLoginModal } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "approved" | "pending" | "attended"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] =
    useState<BackendEventRegistration | null>(null);
  const [revisionTicket, setRevisionTicket] =
    useState<BackendEventRegistration | null>(null);

  // Revision modal states
  const [revisionNotes, setRevisionNotes] = useState("");
  const [revisionProofUrl, setRevisionProofUrl] = useState("");
  const [isUploadingRevision, setIsUploadingRevision] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, refetch, isRefetching } =
    useMyEventRegistrationsQuery({ limit: 50 });
  const reviseMutation = useReviseRegistrationMutation(
    revisionTicket?.id || "",
  );

  const registrations = data?.registrations || [];

  const filteredRegistrations = registrations.filter((reg) => {
    // Tab match
    if (activeTab === "approved" && reg.status !== "approved") return false;
    if (
      activeTab === "pending" &&
      reg.status !== "pending_review" &&
      reg.status !== "needs_revision"
    )
      return false;
    if (activeTab === "attended" && reg.status !== "attended") return false;

    // Search match
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      reg.event_title?.toLowerCase().includes(q) ||
      reg.registration_code.toLowerCase().includes(q) ||
      reg.event_location?.toLowerCase().includes(q)
    );
  });

  const handleUploadRevisionProof = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingRevision(true);
      const res = await apiClient.post<{ data: { url: string } }>(
        "/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setRevisionProofUrl(res.data?.data?.url || "");
    } catch {
      // handled
    } finally {
      setIsUploadingRevision(false);
    }
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionTicket) return;

    await reviseMutation.mutateAsync({
      notes: revisionNotes || undefined,
      payment_proof_url: revisionProofUrl || undefined,
    });

    setRevisionTicket(null);
    setRevisionNotes("");
    setRevisionProofUrl("");
  };

  if (!mounted || isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">
          Memeriksa status akun...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 max-w-lg py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <LogIn className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Akses Tiket Saya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Silakan masuk dengan akun UTY Creative Hub Anda untuk melihat
            riwayat pendaftaran agenda dan e-tiket barcode.
          </p>
        </div>
        <Button
          onClick={openLoginModal}
          size="lg"
          className="rounded-xl px-8 font-semibold gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Masuk Sekarang</span>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-10 sm:py-16 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Ticket className="h-3.5 w-3.5" />
            <span>Pusat Tiket Acara</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Tiket & Agenda Saya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Akses e-tiket resmi, barcode check-in kehadiran, dan sertifikat
            agenda yang Anda ikuti.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            asChild
            className="rounded-xl text-xs sm:text-sm h-10 px-5 gap-1.5 font-semibold"
          >
            <Link href="/events">
              <Sparkles className="h-4 w-4" />
              <span>Jelajahi Agenda</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-xl h-10 w-10 shrink-0"
            title="Muat ulang tiket"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefetching && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Semua ({registrations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("approved")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              activeTab === "approved"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Tiket Aktif (
            {registrations.filter((r) => r.status === "approved").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              activeTab === "pending"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Menunggu Review (
            {
              registrations.filter(
                (r) =>
                  r.status === "pending_review" ||
                  r.status === "needs_revision",
              ).length
            }
            )
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attended")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              activeTab === "attended"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Hadir / Selesai (
            {registrations.filter((r) => r.status === "attended").length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari agenda atau kode tiket..."
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Ticket List */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground">
            Memuat daftar tiket Anda...
          </p>
        </div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredRegistrations.map((reg) => {
            const isApproved = reg.status === "approved";
            const isAttended = reg.status === "attended";
            const isNeedsRevision = reg.status === "needs_revision";
            const isPending = reg.status === "pending_review";

            return (
              <Card
                key={reg.id}
                className="rounded-3xl border-border/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-primary select-all">
                        {reg.registration_code}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide",
                          isApproved &&
                            "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                          isAttended &&
                            "bg-blue-500/10 text-blue-600 border-blue-500/30",
                          isNeedsRevision &&
                            "bg-amber-500/10 text-amber-600 border-amber-500/30",
                          isPending &&
                            "bg-amber-500/10 text-amber-600 border-amber-500/30",
                          reg.status === "rejected" &&
                            "bg-red-500/10 text-red-600 border-red-500/30",
                        )}
                      >
                        {isApproved
                          ? "Tiket Aktif"
                          : isAttended
                            ? "Telah Hadir"
                            : isNeedsRevision
                              ? "Perlu Revisi"
                              : isPending
                                ? "Menunggu Review"
                                : reg.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-foreground line-clamp-1 pt-1">
                      {reg.event_title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Atas Nama:{" "}
                      <strong className="text-foreground">
                        {reg.full_name}
                      </strong>{" "}
                      ({reg.institution})
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{reg.event_date || "Sesuai Jadwal Agenda"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{reg.event_time || "WIB"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {reg.event_location || "Kampus 1 UTY"}
                      </span>
                    </div>

                    {/* Admin notes if any */}
                    {reg.admin_notes && (
                      <div className="p-2.5 rounded-xl bg-muted/60 border border-border/60 text-[11px] text-foreground space-y-0.5">
                        <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                          Catatan Panitia:
                        </span>
                        <p>{reg.admin_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </div>

                {/* Card Actions */}
                <div className="p-4 sm:p-5 pt-0 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 mt-auto">
                  {isApproved && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedTicket(reg)}
                      className="rounded-xl text-xs h-9 px-4 gap-1.5 font-semibold"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Buka Barcode QR</span>
                    </Button>
                  )}

                  {isNeedsRevision && (
                    <Button
                      size="sm"
                      onClick={() => setRevisionTicket(reg)}
                      className="rounded-xl text-xs h-9 px-4 gap-1.5 font-semibold bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Upload Ulang Berkas</span>
                    </Button>
                  )}

                  {isAttended && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs h-9 px-4 gap-1.5 text-primary border-primary/30"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>E-Sertifikat Tersedia</span>
                    </Button>
                  )}

                  {isPending && (
                    <span className="text-[11px] text-muted-foreground italic flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Sedang ditinjau panitia
                    </span>
                  )}

                  {reg.event_slug && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs h-9 px-3 text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`/events/${reg.event_slug}`}>
                        <span>Detail Acara</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border/80 bg-muted/20 p-10 sm:p-14 text-center max-w-md mx-auto space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
            <Ticket className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Belum Ada Tiket Agenda
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Anda belum memiliki pendaftaran agenda yang aktif pada kategori
              ini.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-xl text-xs font-semibold"
          >
            <Link href="/events">Jelajahi Agenda Mendatang</Link>
          </Button>
        </div>
      )}

      {/* Barcode Ticket Modal */}
      {selectedTicket && (
        <Dialog
          open={Boolean(selectedTicket)}
          onOpenChange={(open) => !open && setSelectedTicket(null)}
        >
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
            <DialogHeader className="text-center space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                E-Tiket Check-In Resmi
              </span>
              <DialogTitle className="text-lg font-bold">
                {selectedTicket.event_title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tunjukkan QR Code ini kepada panitia saat tiba di lokasi.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 text-center space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl inline-block shadow-xs border border-border/60 mx-auto">
                <QRCodeSVG
                  value={selectedTicket.registration_code}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Kode Barcode Peserta
                </span>
                <p className="text-xl font-mono font-extrabold text-foreground tracking-wider select-all">
                  {selectedTicket.registration_code}
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-3.5 border border-border/50 text-xs text-left space-y-1">
                <p>
                  <strong>Peserta:</strong> {selectedTicket.full_name}
                </p>
                <p>
                  <strong>Instansi:</strong> {selectedTicket.institution}
                </p>
                <p>
                  <strong>Tanggal:</strong> {selectedTicket.event_date || "-"}
                </p>
                <p>
                  <strong>Lokasi:</strong>{" "}
                  {selectedTicket.event_location || "Kampus 1 UTY"}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="w-full rounded-xl text-xs h-9"
            >
              Tutup
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* Revision Modal */}
      {revisionTicket && (
        <Dialog
          open={Boolean(revisionTicket)}
          onOpenChange={(open) => !open && setRevisionTicket(null)}
        >
          <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md p-5 sm:p-7 rounded-2xl sm:rounded-3xl">
            <DialogHeader className="space-y-1">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Revisi Berkas Pendaftaran
              </span>
              <DialogTitle className="text-lg font-bold">
                {revisionTicket.event_title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Silakan upload ulang bukti bayar atau sertakan catatan revisi
                sesuai arahan panitia.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitRevision} className="space-y-4 pt-2">
              {revisionTicket.admin_notes && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200">
                  <strong>Catatan Panitia:</strong> {revisionTicket.admin_notes}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Upload Ulang Bukti Pembayaran / Berkas
                </label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleUploadRevisionProof}
                  className="h-10 text-xs rounded-xl"
                />
                {isUploadingRevision && (
                  <p className="text-[11px] text-muted-foreground">
                    Sedang mengunggah file...
                  </p>
                )}
                {revisionProofUrl && (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    ✓ Berkas baru berhasil diunggah
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Catatan untuk Panitia
                </label>
                <Textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Jelaskan perbaikan berkas Anda..."
                  rows={2}
                  className="text-xs rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRevisionTicket(null)}
                  className="rounded-xl text-xs h-9 px-4"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={reviseMutation.isPending || isUploadingRevision}
                  size="sm"
                  className="rounded-xl text-xs h-9 px-5 font-semibold"
                >
                  {reviseMutation.isPending ? "Mengirim..." : "Kirim Revisi"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
