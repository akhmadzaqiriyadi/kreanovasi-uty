import { addDays, format, startOfWeek } from "date-fns";
import { roomsConfig } from "./rooms";

export interface ScheduleItem {
  id: string;
  roomId: string;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  applicant: string;
  purpose: string;
  organization?: string;
  status: "approved" | "pending";
}

/**
 * Menghasilkan data dummy reservasi ruangan yang dinamis terhadap minggu dan tanggal saat ini.
 * Menggunakan ID resmi dari roomsConfig:
 * 1. coworking-space-hall
 * 2. fastlab-prototyping-iot
 * 3. think-tank-meeting-room
 */
export function generateInitialSchedule(
  baseDate: Date = new Date(),
): ScheduleItem[] {
  const monday = startOfWeek(baseDate, { weekStartsOn: 1 });
  const todayStr = format(baseDate, "yyyy-MM-dd");

  const getDayDate = (dayOffset: number) =>
    format(addDays(monday, dayOffset), "yyyy-MM-dd");

  const rooms = roomsConfig.rooms;
  const coworking =
    rooms.find((r) => r.id === "coworking-space-hall")?.name ??
    "Co-Working Space & Ideation Hall";
  const fastlab =
    rooms.find((r) => r.id === "fastlab-prototyping-iot")?.name ??
    "FastLab Prototyping & IoT Lab";
  const thinkTank =
    rooms.find((r) => r.id === "think-tank-meeting-room")?.name ??
    "Think-Tank Meeting Room";

  const scheduleList: ScheduleItem[] = [
    // --- JADWAL KHUSUS HARI INI (Memastikan visual terisi langsung terlihat aktif) ---
    {
      id: "sch-today-01",
      roomId: "think-tank-meeting-room",
      roomName: thinkTank,
      date: todayStr,
      startTime: "09:30",
      endTime: "11:45",
      applicant: "BEM FST UTY",
      purpose: "Rapat Koordinasi & Kurasi Karya Pekan Kreativitas Mahasiswa",
      organization: "Biro Kemahasiswaan & BEM",
      status: "approved",
    },
    {
      id: "sch-today-02",
      roomId: "fastlab-prototyping-iot",
      roomName: fastlab,
      date: todayStr,
      startTime: "13:00",
      endTime: "15:30",
      applicant: "Lab Hardware & Robotika",
      purpose: "Perakitan Modul IoT Sensor Pertanian Cerdas (Smart Farming)",
      organization: "Komunitas IoT & Robotika",
      status: "approved",
    },

    // --- Senin (Day offset 0) ---
    {
      id: "sch-mon-01",
      roomId: "coworking-space-hall",
      roomName: coworking,
      date: getDayDate(0),
      startTime: "10:00",
      endTime: "12:30",
      applicant: "GDSC Chapter UTY",
      purpose: "Sesi Mentoring UI/UX Design System & Frontend Architecture",
      organization: "Google Developer Student Club",
      status: "approved",
    },
    {
      id: "sch-mon-02",
      roomId: "think-tank-meeting-room",
      roomName: thinkTank,
      date: getDayDate(0),
      startTime: "13:30",
      endTime: "15:30",
      applicant: "Tim Inkubator Bisnis",
      purpose: "Pitching Evaluasi Traction Startup Mahasiswa Batch 2",
      organization: "Inkubator Bisnis UTY",
      status: "approved",
    },

    // --- Selasa (Day offset 1) ---
    {
      id: "sch-tue-01",
      roomId: "fastlab-prototyping-iot",
      roomName: fastlab,
      date: getDayDate(1),
      startTime: "09:30",
      endTime: "12:00",
      applicant: "Kelompok Riset PKM-KC",
      purpose: "Pengujian Sensor ESP32 & Kalibrasi Modul LoRaWAN",
      organization: "Kelompok Riset FST",
      status: "approved",
    },
    {
      id: "sch-tue-02",
      roomId: "coworking-space-hall",
      roomName: coworking,
      date: getDayDate(1),
      startTime: "13:00",
      endTime: "15:45",
      applicant: "Komunitas Data Science",
      purpose: "Hands-on Modeling Machine Learning & Analisis Data Kampus",
      organization: "Data Science Club",
      status: "approved",
    },

    // --- Rabu (Day offset 2) ---
    {
      id: "sch-wed-01",
      roomId: "think-tank-meeting-room",
      roomName: thinkTank,
      date: getDayDate(2),
      startTime: "10:00",
      endTime: "12:00",
      applicant: "HIMATIF UTY",
      purpose: "Diskusi Panel Kurikulum & Persiapan Hackathon Mahasiswa",
      organization: "Himpunan Mahasiswa Informatika",
      status: "approved",
    },
    {
      id: "sch-wed-02",
      roomId: "fastlab-prototyping-iot",
      roomName: fastlab,
      date: getDayDate(2),
      startTime: "13:30",
      endTime: "16:00",
      applicant: "Tim Robotika Line Follower",
      purpose: "Fabrikasi Chassis 3D Printing & Soldering Board Robot",
      organization: "Unit Robotika UTY",
      status: "approved",
    },

    // --- Kamis (Day offset 3) ---
    {
      id: "sch-thu-01",
      roomId: "coworking-space-hall",
      roomName: coworking,
      date: getDayDate(3),
      startTime: "09:00",
      endTime: "11:30",
      applicant: "Klub Startup Kampus",
      purpose: "Co-working Bersama & Sesi Brainstorming Validasi Masalah",
      organization: "Startup Hub UTY",
      status: "approved",
    },
    {
      id: "sch-thu-02",
      roomId: "think-tank-meeting-room",
      roomName: thinkTank,
      date: getDayDate(3),
      startTime: "13:00",
      endTime: "15:00",
      applicant: "Dosen Pembimbing Skripsi",
      purpose: "Review Kemajuan Riset Kolaboratif Dosen & Mahasiswa",
      organization: "Program Studi Informatika",
      status: "approved",
    },

    // --- Jumat (Day offset 4) ---
    {
      id: "sch-fri-01",
      roomId: "fastlab-prototyping-iot",
      roomName: fastlab,
      date: getDayDate(4),
      startTime: "09:00",
      endTime: "11:15",
      applicant: "Laboratorium Fisika Komputasi",
      purpose: "Uji Eksperimen Sensor Optik & Pengambilan Data Sampel",
      organization: "Lab Sains Terapan",
      status: "approved",
    },
    {
      id: "sch-fri-02",
      roomId: "think-tank-meeting-room",
      roomName: thinkTank,
      date: getDayDate(4),
      startTime: "13:30",
      endTime: "15:30",
      applicant: "Dewan Perwakilan Mahasiswa",
      purpose: "Sidang Paripurna Evaluasi Program Kreativitas Kampus",
      organization: "DPM UTY",
      status: "approved",
    },

    // --- Sabtu (Day offset 5) ---
    {
      id: "sch-sat-01",
      roomId: "coworking-space-hall",
      roomName: coworking,
      date: getDayDate(5),
      startTime: "09:00",
      endTime: "11:45",
      applicant: "Study Club Coding UTY",
      purpose: "Workshop Hands-on Fullstack Next.js & Modern Web Development",
      organization: "Study Club Coding",
      status: "approved",
    },
  ];

  // Hapus duplikat bila baseDate kebetulan sama dengan salah satu hari offset
  const seenKeys = new Set<string>();
  return scheduleList.filter((item) => {
    const key = `${item.roomId}-${item.date}-${item.startTime}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });
}
