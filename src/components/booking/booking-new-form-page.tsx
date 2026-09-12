"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNewBookingForm } from "@/hooks/use-new-booking-form";
import { cn } from "@/lib/utils";

export function BookingNewFormPage() {
  const {
    form,
    applicantRole,
    handleRoleChange,
    activeProfile,
    rooms,
    studyPrograms,
    timeSlots,
    availableEndTimes,
    useLoggedInProfile,
    handleToggleProfile,
    selectedDate,
    handleSelectDate,
    isSubmitting,
    submissionSuccess,
    handleSubmit,
  } = useNewBookingForm();

  const selectedRoomId = form.watch("room");
  const activeRoomObj = rooms.find(
    (r) => r.id === selectedRoomId || r.slug === selectedRoomId,
  );

  // Jika sukses disubmit, tampilkan tampilan konfirmasi tiket permohonan yang terpusat rapi
  if (submissionSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-slate-50/60 to-background dark:via-zinc-950/40">
        <div className="w-full max-w-3xl my-auto">
          <Card className="rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
            <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-[#2E417A] to-blue-700 text-white text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 text-amber-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-white">
                Permohonan Berhasil Diajukan!
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base mt-1">
                Data reservasi Anda telah tercatat pada sistem UTY Creative Hub.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-border/70 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      ID Reservasi
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-bold tracking-wide",
                        submissionSuccess.role === "dosen"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700",
                      )}
                    >
                      {submissionSuccess.role === "dosen"
                        ? "Dosen / Pengajar"
                        : "Mahasiswa"}
                    </Badge>
                  </div>
                  <span className="font-mono font-bold text-sm sm:text-base text-primary dark:text-blue-300">
                    {submissionSuccess.bookingId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">
                      Ruangan
                    </span>
                    <strong className="text-foreground text-sm font-bold">
                      {submissionSuccess.roomName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">
                      Tanggal & Waktu
                    </span>
                    <strong className="text-foreground text-sm font-bold">
                      {submissionSuccess.date} ({submissionSuccess.timeSlot})
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">
                      Penanggung Jawab
                    </span>
                    <span className="text-foreground font-semibold block">
                      {submissionSuccess.applicant}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {submissionSuccess.idLabel}: {submissionSuccess.idNumber}{" "}
                      ({submissionSuccess.prodi})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">
                      Estimasi Peserta
                    </span>
                    <span className="text-foreground font-semibold">
                      {submissionSuccess.audience} Orang
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Tujuan Kegiatan
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    "{submissionSuccess.purpose}"
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  <Link href="/booking">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Kalender Jadwal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-20 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-zinc-950/40">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Back Navigation Button */}
        <div>
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-border hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold h-8 sm:h-9"
          >
            <Link href="/booking">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Kembali ke Jadwal & Katalog Ruangan
            </Link>
          </Button>
        </div>

        {/* Form Container Card */}
        <Card className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          {/* Header Banner */}
          <CardHeader className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[#2E417A] via-blue-800 to-blue-700 text-white border-b border-white/10">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-md">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white">
                  Ajukan Peminjaman Fasilitas UCH
                </CardTitle>
                <CardDescription className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-relaxed">
                  Lengkapi formulir di bawah ini untuk mengajukan peminjaman
                  ruangan kreatif dan fasilitas resmi UTY Creative Hub.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* --- SECTION 1: PROFIL PENYEWA DENGAN TOGGLE LOGIN & ROLE DOSEN/MAHASISWA --- */}
              <div className="p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-slate-50/80 dark:bg-zinc-800/40 border border-border/80 space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-blue-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Informasi Penanggung Jawab
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Pilih kategori pemohon: Mahasiswa atau Dosen / Tenaga
                        Pendidik
                      </p>
                    </div>
                  </div>

                  {/* TOGGLE: Gunakan data profil akun login */}
                  <div className="flex items-center gap-2.5 bg-white dark:bg-zinc-800 py-1.5 px-3 rounded-xl border border-border/80 shadow-2xs self-start sm:self-auto">
                    <Switch
                      id="profile-toggle"
                      checked={useLoggedInProfile}
                      onCheckedChange={handleToggleProfile}
                    />
                    <Label
                      htmlFor="profile-toggle"
                      className="text-xs font-semibold text-foreground/80 cursor-pointer select-none"
                    >
                      Gunakan profil login saya
                    </Label>
                  </div>
                </div>

                {/* Switcher Kategori Pemohon: Mahasiswa vs Dosen */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Kategori Pemohon:
                    </span>
                    <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-zinc-800 border border-border/60">
                      <button
                        type="button"
                        onClick={() => handleRoleChange("mahasiswa")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          applicantRole === "mahasiswa"
                            ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Mahasiswa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleChange("dosen")}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          applicantRole === "dosen"
                            ? "bg-white dark:bg-zinc-900 text-primary dark:text-blue-400 shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        Dosen / Pengajar
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-muted-foreground">
                    Status:{" "}
                    <strong className="text-foreground">
                      {activeProfile.affiliation}
                    </strong>
                  </span>
                </div>

                {useLoggedInProfile ? (
                  /* Tampilan Profil Login Otomatis */
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        Data profil akun SSO ({activeProfile.roleLabel})
                        terverifikasi terisi otomatis
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-border/60">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                          Nama {activeProfile.roleLabel}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                          {activeProfile.name}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-border/60">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                          {activeProfile.idLabel}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate block font-mono">
                          {activeProfile.idNumber}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-border/60">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                          Program Studi
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                          {activeProfile.prodi}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-border/60">
                        <span className="text-[11px] font-semibold text-muted-foreground block mb-0.5">
                          Email SSO Kampus
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate block">
                          {activeProfile.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Input Manual Profil Penanggung Jawab */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-xs font-bold text-foreground/80"
                      >
                        {applicantRole === "dosen"
                          ? "Nama Lengkap & Gelar Dosen"
                          : "Nama Lengkap Mahasiswa"}{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder={
                          applicantRole === "dosen"
                            ? "Contoh: Dr. Bambang Sutrisno, M.Kom."
                            : "Contoh: Budi Santoso"
                        }
                        {...form.register("name")}
                        className="h-11 rounded-xl"
                      />
                      {form.formState.errors.name && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="npm"
                        className="text-xs font-bold text-foreground/80"
                      >
                        {applicantRole === "dosen"
                          ? "NIDN / NIK Dosen"
                          : "NPM Mahasiswa"}{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="npm"
                        type="number"
                        inputMode="numeric"
                        placeholder={
                          applicantRole === "dosen"
                            ? "Contoh: 0514088201"
                            : "Contoh: 5210411234"
                        }
                        {...form.register("npm")}
                        className="h-11 rounded-xl font-mono"
                      />
                      {form.formState.errors.npm && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {form.formState.errors.npm.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="prodi"
                        className="text-xs font-bold text-foreground/80"
                      >
                        Program Studi <span className="text-rose-500">*</span>
                      </Label>
                      <Controller
                        name="prodi"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-11 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-medium">
                              <SelectValue placeholder="Pilih Program Studi" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-60">
                              {studyPrograms.map((p) => (
                                <SelectItem
                                  key={p}
                                  value={p}
                                  className="text-xs sm:text-sm cursor-pointer"
                                >
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.prodi && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {form.formState.errors.prodi.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* --- SECTION 2: RUANGAN & ESTIMASI PESERTA --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PILIH RUANGAN MENGGUNAKAN DROPDOWN COMPONENT SHADCN */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary dark:text-blue-300" />
                    Pilih Ruangan Fasilitas{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Controller
                    name="room"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-12 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-medium">
                          <SelectValue placeholder="Pilih ruangan yang ingin dipinjam" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {rooms.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id}
                              className="py-2.5 text-xs sm:text-sm cursor-pointer"
                            >
                              <span className="font-bold text-foreground">
                                {room.name}
                              </span>{" "}
                              <span className="text-muted-foreground text-xs">
                                ({room.capacity} • {room.location})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {activeRoomObj && (
                    <p className="text-xs text-muted-foreground">
                      Kapasitas: {activeRoomObj.capacity} • Tipe:{" "}
                      {activeRoomObj.type}
                    </p>
                  )}
                  {form.formState.errors.room && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {form.formState.errors.room.message}
                    </p>
                  )}
                </div>

                {/* ESTIMASI PESERTA */}
                <div className="space-y-2">
                  <Label
                    htmlFor="audience"
                    className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-primary dark:text-blue-300" />
                    Jumlah Peserta Kegiatan{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="audience"
                    type="number"
                    min={1}
                    max={100}
                    {...form.register("audience", { valueAsNumber: true })}
                    className="h-12 rounded-xl border border-border text-xs sm:text-sm font-semibold"
                    placeholder="Contoh: 10"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Estimasi jumlah orang yang akan hadir di dalam ruangan.
                  </p>
                  {form.formState.errors.audience && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {form.formState.errors.audience.message}
                    </p>
                  )}
                </div>
              </div>

              {/* --- SECTION 3: TANGGAL & WAKTU PELAKSANAAN --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TANGGAL BOOKING MENGGUNAKAN CALENDAR & POPOVER COMPONENT */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary dark:text-blue-300" />
                    Tanggal Peminjaman <span className="text-rose-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className={cn(
                          "w-full h-12 justify-start text-left font-medium rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2.5 h-4 w-4 text-muted-foreground" />
                        {selectedDate ? (
                          format(selectedDate, "EEEE, d MMMM yyyy", {
                            locale: id,
                          })
                        ) : (
                          <span>Pilih tanggal booking</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-2xl shadow-xl"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelectDate}
                        disabled={{
                          before: new Date(),
                          dayOfWeek: [0], // Tutup hari Minggu
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-[11px] text-muted-foreground">
                    Layanan peminjaman aktif Senin - Sabtu (Minggu tutup).
                  </p>
                  {form.formState.errors.date && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>

                {/* JAM MULAI & SELESAI MENGGUNAKAN DROPDOWN COMPONENT */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary dark:text-blue-300" />
                    Rentang Waktu Pelaksanaan{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Jam Mulai */}
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Jam Mulai
                      </span>
                      <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-bold">
                              <SelectValue placeholder="Mulai" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {timeSlots.map((time) => (
                                <SelectItem
                                  key={`start-${time}`}
                                  value={time}
                                  className="text-xs sm:text-sm cursor-pointer"
                                >
                                  {time} WIB
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.startTime && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {form.formState.errors.startTime.message}
                        </p>
                      )}
                    </div>

                    {/* Jam Selesai */}
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Jam Selesai
                      </span>
                      <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="h-12 rounded-xl border border-border bg-white dark:bg-zinc-800 text-xs sm:text-sm font-bold">
                              <SelectValue placeholder="Selesai" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {availableEndTimes.map((time) => (
                                <SelectItem
                                  key={`end-${time}`}
                                  value={time}
                                  className="text-xs sm:text-sm cursor-pointer"
                                >
                                  {time} WIB
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.endTime && (
                        <p className="text-[11px] text-rose-500 font-medium mt-1">
                          {form.formState.errors.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- SECTION 4: TUJUAN & DESKRIPSI KEGIATAN --- */}
              <div className="space-y-2">
                <Label
                  htmlFor="purpose"
                  className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-primary dark:text-blue-300" />
                  Tujuan & Deskripsi Kegiatan{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  {...form.register("purpose")}
                  placeholder="Jelaskan secara ringkas tujuan peminjaman ruangan, nama organisasi / mata kuliah, dan agenda kegiatan..."
                  className="min-h-[120px] rounded-xl border border-border text-xs sm:text-sm p-3.5 leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground">
                  Minimal 10 karakter. Penjelasan detail mempercepat proses
                  persetujuan oleh pengelola UCH.
                </p>
                {form.formState.errors.purpose && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {form.formState.errors.purpose.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2E417A] to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses Pengajuan Peminjaman...
                    </>
                  ) : (
                    <>
                      <span>Ajukan Peminjaman Fasilitas Sekarang</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
