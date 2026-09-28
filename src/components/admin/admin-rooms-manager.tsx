"use client";

import {
  AlertCircle,
  Check,
  DoorOpen,
  Edit,
  Filter,
  ImageIcon,
  Info,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RoomItem } from "@/config/rooms";
import { DUMMY_ROOM_IMAGES, useRooms } from "@/context/rooms-context";
import {
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useUpdateRoomMutation,
  useUploadMutation,
} from "@/hooks/use-booking-queries";
import { getSafeImageUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface RoomFormState {
  name: string;
  type: string;
  capacity: string;
  location: string;
  description: string;
  facilitiesStr: string;
  coverImage: string;
  statusState: RoomItem["status"]["state"];
  statusLabel: string;
  timeSlotInfo: string;
}

const DEFAULT_FORM_STATE: RoomFormState = {
  name: "",
  type: "Kolaborasi & Riset",
  capacity: "15 Orang",
  location: "Lantai 1 Gedung UCH",
  description: "",
  facilitiesStr: "Wi-Fi 6, Smart TV, AC, Power Outlet",
  coverImage: "/images/coworking-space.jpg",
  statusState: "available",
  statusLabel: "Tersedia Sekarang",
  timeSlotInfo: "Bebas Digunakan Langsung",
};

export function AdminRoomsManager() {
  const {
    rooms,
    availableRooms,
    addRoom,
    updateRoom,
    deleteRoom,
    setRoomStatus,
    resetRoomsToDefault,
  } = useRooms();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const createRoomMutation = useCreateRoomMutation();
  const updateRoomMutation = useUpdateRoomMutation();
  const deleteRoomMutation = useDeleteRoomMutation();
  const uploadMutation = useUploadMutation();

  // Dialog & Upload states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<RoomItem | null>(null);
  const [formData, setFormData] = useState<RoomFormState>(DEFAULT_FORM_STATE);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file gambar maksimal 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadMutation.mutateAsync({ file, folder: "rooms" });
      if (res?.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.url }));
        toast.success("Foto ruangan berhasil diunggah ke MinIO UCH!");
      }
    } catch (_err) {
      toast.error("Terjadi kesalahan saat mengunggah foto ke MinIO");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Stats
  const inUseCount = useMemo(
    () => rooms.filter((r) => r.status.state === "in-use").length,
    [rooms],
  );
  const maintenanceCount = useMemo(
    () => rooms.filter((r) => r.status.state === "maintenance").length,
    [rooms],
  );

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || room.status.state === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [rooms, searchQuery, statusFilter]);

  const handleOpenAdd = () => {
    setFormData(DEFAULT_FORM_STATE);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (room: RoomItem) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      location: room.location,
      description: room.description,
      facilitiesStr: room.facilities.join(", "),
      coverImage: room.coverImage,
      statusState: room.status.state,
      statusLabel: room.status.label,
      timeSlotInfo: room.status.timeSlotInfo,
    });
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama ruangan wajib diisi");
      return;
    }

    const facilities = formData.facilitiesStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const parsedCapacity =
      Number.parseInt(formData.capacity.replace(/\D/g, ""), 10) || 15;
    const roomStatus =
      formData.statusState === "available"
        ? "available"
        : formData.statusState === "maintenance"
          ? "maintenance"
          : "reserved";

    if (editingRoom) {
      updateRoomMutation.mutate({
        id: editingRoom.id,
        data: {
          name: formData.name,
          category: formData.type,
          capacity: parsedCapacity,
          location: formData.location,
          description: formData.description,
          facilities,
          image_url: formData.coverImage,
          status: roomStatus,
          operational_hours: formData.timeSlotInfo,
        },
      });

      updateRoom(editingRoom.id, {
        name: formData.name,
        type: formData.type,
        capacity: formData.capacity,
        location: formData.location,
        description: formData.description,
        facilities: facilities.length > 0 ? facilities : ["Wi-Fi", "AC"],
        coverImage: formData.coverImage || "/images/coworking-space.jpg",
        status: {
          state: formData.statusState,
          label: formData.statusLabel || "Tersedia Sekarang",
          timeSlotInfo: formData.timeSlotInfo || "Bebas Digunakan Langsung",
        },
      });
      setEditingRoom(null);
    } else {
      createRoomMutation.mutate({
        name: formData.name,
        category: formData.type,
        capacity: parsedCapacity,
        location: formData.location,
        description: formData.description,
        facilities,
        image_url: formData.coverImage,
        status: roomStatus,
        operational_hours: formData.timeSlotInfo,
      });

      addRoom({
        name: formData.name,
        type: formData.type,
        capacity: formData.capacity,
        location: formData.location,
        description: formData.description,
        facilities: facilities.length > 0 ? facilities : ["Wi-Fi", "AC"],
        coverImage: formData.coverImage || "/images/coworking-space.jpg",
        status: {
          state: formData.statusState,
          label: formData.statusLabel || "Tersedia Sekarang",
          timeSlotInfo: formData.timeSlotInfo || "Bebas Digunakan Langsung",
        },
      });
      setIsAddOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingRoom) {
      deleteRoomMutation.mutate(deletingRoom.id);
      deleteRoom(deletingRoom.id);
      setDeletingRoom(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/80 border border-border/70 backdrop-blur-md shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              Manajemen Fasilitas & Ruangan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola inventaris ruangan, foto fasilitas, serta status ketersediaan
            yang tampil di Beranda dan Formulir Booking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <Button
            onClick={resetRoomsToDefault}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none rounded-xl border-border/70 text-xs text-muted-foreground hover:text-foreground h-10"
            title="Kembalikan data ruangan ke template awal"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Default
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Ruangan
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Total Ruangan
          </span>
          <div className="text-2xl font-black text-foreground">
            {rooms.length}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Terdaftar di sistem UCH
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Tersedia (Landing Page)
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {availableRooms.length}
          </div>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
            Langsung tampil untuk publik
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 backdrop-blur-xs space-y-1">
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
            Sedang Digunakan
          </span>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
            {inUseCount}
          </div>
          <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80">
            Sesi aktif berlangsung
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
            Maintenance / Cadangan
          </span>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
            {maintenanceCount}
          </div>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
            Perbaikan & tertutup
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama ruangan, lokasi, atau tipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/80 border-border/70 rounded-xl text-xs h-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 sm:w-[170px] h-9 text-xs rounded-xl bg-background/80 border-border/70">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status ({rooms.length})</SelectItem>
              <SelectItem value="available">
                Tersedia ({availableRooms.length})
              </SelectItem>
              <SelectItem value="in-use">
                Sedang Digunakan ({inUseCount})
              </SelectItem>
              <SelectItem value="maintenance">
                Maintenance ({maintenanceCount})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rooms List (Responsive Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const isAvail = room.status.state === "available";
          const isInUse = room.status.state === "in-use";
          const isMaint = room.status.state === "maintenance";

          return (
            <div
              key={room.id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-border/80 shadow-xs hover:shadow-lg transition-all overflow-hidden"
            >
              <div>
                {/* Thumbnail Image Header */}
                <div className="relative h-44 w-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <Image
                    src={getSafeImageUrl(room.coverImage)}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Pill Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge
                      className={cn(
                        "font-bold text-[10px] px-2.5 py-0.5 shadow-md border-none",
                        isAvail && "bg-emerald-500 text-white",
                        isInUse && "bg-rose-500 text-white",
                        isMaint && "bg-zinc-700 text-white",
                        !isAvail &&
                          !isInUse &&
                          !isMaint &&
                          "bg-amber-500 text-white",
                      )}
                    >
                      {isAvail ? "Tersedia Langsung" : room.status.label}
                    </Badge>
                  </div>

                  {/* Room Meta in Image */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                      {room.type}
                    </span>
                    <h3 className="text-base font-bold leading-tight drop-shadow-xs">
                      {room.name}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground/80 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{room.capacity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{room.location}</span>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {room.facilities.slice(0, 4).map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-border/50"
                      >
                        {fac}
                      </span>
                    ))}
                    {room.facilities.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground font-semibold">
                        +{room.facilities.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar & Quick Status Changer */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-950/60 border-t border-border/60 space-y-2.5">
                {/* Quick Status Buttons */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-[10px] uppercase tracking-wider">
                    Ubah Cepat Status:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRoomStatus(room.id, "available");
                      toast.success(
                        `Ruangan "${room.name}" sekarang berstatus TERSEDIA & tampil di Beranda!`,
                      );
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer border",
                      isAvail
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                        : "bg-background hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-border/60",
                    )}
                  >
                    Tersedia
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoomStatus(room.id, "in-use");
                      toast.info(
                        `Ruangan "${room.name}" diubah ke SEDANG DIGUNAKAN.`,
                      );
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer border",
                      isInUse
                        ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-background hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-border/60",
                    )}
                  >
                    Digunakan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRoomStatus(room.id, "maintenance");
                      toast.warning(
                        `Ruangan "${room.name}" masuk status PEMELIHARAAN.`,
                      );
                    }}
                    className={cn(
                      "py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer border",
                      isMaint
                        ? "bg-zinc-700 text-white border-zinc-800 shadow-xs"
                        : "bg-background hover:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-border/60",
                    )}
                  >
                    Perbaikan
                  </button>
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                  <Button
                    onClick={() => handleOpenEdit(room)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs rounded-lg hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeletingRoom(room)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs rounded-lg hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-border/60 space-y-3">
          <DoorOpen className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">
            Tidak Ada Ruangan yang Ditemukan
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Tidak ada ruangan yang cocok dengan filter atau kata kunci pencarian
            saat ini.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
          >
            Reset Filter
          </Button>
        </div>
      )}

      {/* Add / Edit Room Dialog */}
      <Dialog
        open={isAddOpen || Boolean(editingRoom)}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingRoom(null);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-foreground">
              {editingRoom ? "Edit Informasi Ruangan" : "Tambah Ruangan Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Konfigurasi detail spesifikasi ruangan, status operasional, serta
              tautan gambar (dummy bawaan atau URL MinIO).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRoom} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Nama Ruangan</Label>
              <Input
                placeholder="misal: Studio Podcast & Content Creation"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl text-xs h-10"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tipe Ruangan</Label>
                <Input
                  placeholder="misal: Kolaborasi & Riset"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Kapasitas</Label>
                <Input
                  placeholder="misal: 15 Orang"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Lokasi Gedung / Lantai
              </Label>
              <Input
                placeholder="misal: Lantai 2 Gedung UCH"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="rounded-xl text-xs h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Deskripsi Ruangan</Label>
              <Textarea
                placeholder="Jelaskan peruntukan ruangan, fitur utama, dan kriteria pengguna..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-xl text-xs min-h-[75px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                Fasilitas (Pisahkan dengan koma)
              </Label>
              <Input
                placeholder="Wi-Fi 6, Smart TV 65, Ergonomic Chairs, Whiteboard"
                value={formData.facilitiesStr}
                onChange={(e) =>
                  setFormData({ ...formData, facilitiesStr: e.target.value })
                }
                className="rounded-xl text-xs h-10"
              />
            </div>

            {/* MinIO Image Upload, Preview & Preset Selector */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-border/70">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Foto Cover Ruangan (MinIO UCH)</span>
                </Label>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {formData.coverImage.includes("s3.dev-apps.utycreative.cloud")
                    ? "MinIO Storage Aktif"
                    : "Preset / Kustom"}
                </span>
              </div>

              {/* Active Image Preview */}
              {formData.coverImage && (
                <div className="relative h-40 w-full rounded-xl overflow-hidden border border-border/80 shadow-xs bg-slate-100 dark:bg-zinc-900 group">
                  <Image
                    src={getSafeImageUrl(formData.coverImage)}
                    alt="Preview cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-[10px] font-mono truncate max-w-[280px] bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {formData.coverImage}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] bg-emerald-500/90 text-white border-none py-0.5 px-2"
                    >
                      Terpilih
                    </Badge>
                  </div>
                </div>
              )}

              {/* Upload to MinIO Button / Trigger */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 rounded-xl border-dashed border-2 border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-xs font-bold"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Mengunggah ke MinIO UCH...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-primary" />
                    <span>Unggah Foto dari Perangkat ke MinIO</span>
                  </>
                )}
              </Button>

              {/* Preset Dummy Thumbnails */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Atau pilih cepat dari preset template:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {DUMMY_ROOM_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, coverImage: img.url })
                      }
                      className={cn(
                        "relative h-16 rounded-xl overflow-hidden border-2 text-left group transition-all cursor-pointer",
                        formData.coverImage === img.url
                          ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                          : "border-border/60 hover:border-primary/50 opacity-75 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white truncate">
                        {img.label}
                      </span>
                      {formData.coverImage === img.url && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom URL Input Fallback */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  Atau paste URL gambar langsung:
                </span>
                <Input
                  placeholder="https://s3.dev-apps.utycreative.cloud/ibisapp/rooms/..."
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="rounded-xl text-xs h-9 bg-background font-mono"
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    URL MinIO UCH otomatis distreaming via storage proxy
                    sehingga terbebas dari isu SSL ataupun mixed content.
                  </span>
                </p>
              </div>
            </div>

            {/* Initial Status Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Status Ketersediaan</Label>
                <Select
                  value={formData.statusState}
                  onValueChange={(val: RoomItem["status"]["state"]) => {
                    let label = "Tersedia Sekarang";
                    let info = "Bebas Digunakan Langsung";
                    if (val === "in-use") {
                      label = "Sedang Digunakan";
                      info = "Hingga sesi selesai";
                    } else if (val === "maintenance") {
                      label = "Perbaikan / Maintenance";
                      info = "Sementara ditutup";
                    } else if (val === "reserved-soon") {
                      label = "Dipesan Sebentar Lagi";
                      info = "Dipesan hari ini";
                    }
                    setFormData({
                      ...formData,
                      statusState: val,
                      statusLabel: label,
                      timeSlotInfo: info,
                    });
                  }}
                >
                  <SelectTrigger className="rounded-xl text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>Tersedia (Tampil di Landing Page)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="in-use">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        <span>Sedang Digunakan (In-Use)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="reserved-soon">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span>Dipesan Sebentar Lagi</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                        <span>Perbaikan (Maintenance)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Label Status Custom</Label>
                <Input
                  placeholder="misal: Tersedia Sekarang"
                  value={formData.statusLabel}
                  onChange={(e) =>
                    setFormData({ ...formData, statusLabel: e.target.value })
                  }
                  className="rounded-xl text-xs h-10"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingRoom(null);
                }}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs"
              >
                {editingRoom ? "Simpan Perubahan" : "Tambahkan Ruangan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingRoom)}
        onOpenChange={(open) => !open && setDeletingRoom(null)}
      >
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Hapus Ruangan &ldquo;{deletingRoom?.name}&rdquo;?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus ruangan dari sistem. Ruangan tidak
              akan lagi muncul di beranda dan formulir pemesanan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingRoom(null)}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl text-xs font-bold"
            >
              Ya, Hapus Ruangan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
