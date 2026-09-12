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
 * Menghasilkan data dummy reservasi ruangan yang dinamis terhadap minggu saat ini.
 * Memastikan setiap kali aplikasi dibuka, jadwal hari kerja terisi secara realistis
 * sekaligus menyediakan slot-slot kosong (tersedia) untuk simulasi pemesanan.
 */
export function generateInitialSchedule(
  baseDate: Date = new Date(),
): ScheduleItem[] {
  const monday = startOfWeek(baseDate, { weekStartsOn: 1 });

  const getDayDate = (dayOffset: number) =>
    format(addDays(monday, dayOffset), "yyyy-MM-dd");

  const rooms = roomsConfig.rooms;
  const thinkTank =
    rooms.find((r) => r.id === "think-tank-1")?.name ?? "Think Tank Room 1";
  const coworking =
    rooms.find((r) => r.id === "coworking-space")?.name ??
    "Open Coworking Space";
  const iotLab =
    rooms.find((r) => r.id === "iot-prototyping")?.name ??
    "IoT & Hardware Prototyping Lab";
  const podcast =
    rooms.find((r) => r.id === "podcast-studio")?.name ??
    "Multimedia & Podcast Studio";

  return [
    // Senin (Day offset 0)
    {
      id: "sch-001",
      roomId: "think-tank-1",
      roomName: thinkTank,
      date: getDayDate(0),
      startTime: "09:00",
      endTime: "11:30",
      applicant: "BEM FST UTY",
      purpose: "Rapat Koordinasi Pekan Kreativitas & Inovasi Mahasiswa",
      organization: "BEM FST",
      status: "approved",
    },
    {
      id: "sch-002",
      roomId: "coworking-space",
      date: getDayDate(0),
      roomName: coworking,
      startTime: "13:00",
      endTime: "15:30",
      applicant: "GDSC Chapter UTY",
      purpose: "Sesi Mentoring UI/UX & Web Development",
      organization: "Google Developer Student Club",
      status: "approved",
    },
    {
      id: "sch-003",
      roomId: "podcast-studio",
      date: getDayDate(0),
      roomName: podcast,
      startTime: "10:00",
      endTime: "12:00",
      applicant: "HIMATIF UTY",
      purpose: "Recording Podcast Alumni Talk: Karier di Industri Teknologi",
      organization: "HIMATIF",
      status: "approved",
    },

    // Selasa (Day offset 1)
    {
      id: "sch-004",
      roomId: "coworking-space",
      date: getDayDate(1),
      roomName: coworking,
      startTime: "09:30",
      endTime: "12:00",
      applicant: "Tim PKM-KC",
      purpose: "Eksplorasi Ide Sistem Deteksi Kematangan Buah Otomatis",
      organization: "Kelompok Riset PKM",
      status: "approved",
    },
    {
      id: "sch-005",
      roomId: "iot-prototyping",
      date: getDayDate(1),
      roomName: iotLab,
      startTime: "13:00",
      endTime: "16:00",
      applicant: "Komunitas Robotika UTY",
      purpose: "Perakitan & Kalibrasi Sensor Robot Line Follower",
      organization: "Robotika UTY",
      status: "approved",
    },

    // Rabu (Day offset 2)
    {
      id: "sch-006",
      roomId: "think-tank-1",
      date: getDayDate(2),
      roomName: thinkTank,
      startTime: "13:00",
      endTime: "15:30",
      applicant: "Komunitas Desain Grafis",
      purpose: "Pitching Konsep Branding Produk Kreatif Mahasiswa",
      organization: "Creative Circle",
      status: "approved",
    },
    {
      id: "sch-007",
      roomId: "podcast-studio",
      date: getDayDate(2),
      roomName: podcast,
      startTime: "14:00",
      endTime: "16:00",
      applicant: "Humas UTY",
      purpose: "Produksi Konten Edukasi Beasiswa & Prestasi Mahasiswa",
      organization: "Biro Humas & Promosi",
      status: "approved",
    },

    // Kamis (Day offset 3)
    {
      id: "sch-008",
      roomId: "coworking-space",
      date: getDayDate(3),
      roomName: coworking,
      startTime: "09:00",
      endTime: "12:00",
      applicant: "Inkubator Bisnis UTY",
      purpose: "Mentoring Pitch Deck Tim Startup Mahasiswa Batch 2",
      organization: "Inkubator Bisnis",
      status: "approved",
    },

    // Jumat (Day offset 4)
    {
      id: "sch-009",
      roomId: "think-tank-1",
      date: getDayDate(4),
      roomName: thinkTank,
      startTime: "09:00",
      endTime: "11:00",
      applicant: "Dosen Pembimbing PKM",
      purpose: "Review Proposal PKM Lolos Pendanaan Nasional",
      organization: "FST UTY",
      status: "approved",
    },
    {
      id: "sch-010",
      roomId: "iot-prototyping",
      date: getDayDate(4),
      roomName: iotLab,
      startTime: "13:30",
      endTime: "15:45",
      applicant: "Lab Hardware & Jaringan",
      purpose: "Pengujian Modul Komunikasi LoRaWAN & ESP32",
      organization: "IoT Study Club",
      status: "approved",
    },

    // Sabtu (Day offset 5)
    {
      id: "sch-011",
      roomId: "coworking-space",
      date: getDayDate(5),
      roomName: coworking,
      startTime: "09:00",
      endTime: "11:30",
      applicant: "Study Club Coding UTY",
      purpose: "Hands-on Workshop Next.js 16 & Modern Frontend",
      organization: "Study Club Coding",
      status: "approved",
    },
  ];
}
