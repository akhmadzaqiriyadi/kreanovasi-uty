import { type RoomItem, roomsConfig } from "./rooms";

export interface OperationalSchedule {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface BookingGuidelineItem {
  text: string;
  highlight?: string;
}

export interface BookingConfig {
  header: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    description: string;
  };
  operationalHours: OperationalSchedule[];
  procedures: string[];
  rules: string[];
  timeSlots: string[];
  rooms: RoomItem[];
}

export const bookingConfig: BookingConfig = {
  header: {
    badge: "Reservasi Fasilitas Kampus",
    title: "Ruangan & Fasilitas",
    highlight: "UTY Creative Hub",
    subtitle: "Wadah Eksplorasi Inovasi",
    description:
      "Setiap ruangan dirancang khusus dengan fasilitas modern untuk mendukung kolaborasi, riset, inkubasi ide, dan produktivitas mahasiswa Universitas Teknologi Yogyakarta.",
  },
  operationalHours: [
    { day: "Senin - Jumat", hours: "09.00 - 16.00 WIB", isOpen: true },
    { day: "Sabtu", hours: "09.00 - 12.00 WIB", isOpen: true },
    { day: "Minggu & Hari Libur", hours: "Tutup", isOpen: false },
  ],
  procedures: [
    "Pilih ruangan kreatif yang sesuai dengan kebutuhan aktivitas tim Anda.",
    "Tentukan tanggal pemesanan serta jam mulai dan jam selesai kegiatan.",
    "Lengkapi data penanggung jawab, tujuan kegiatan, dan estimasi peserta.",
    "Dapatkan konfirmasi persetujuan dan e-tiket QR Code untuk presensi check-in.",
  ],
  rules: [
    "Pemesanan ruangan diajukan minimal H-1 sebelum waktu pelaksanaan kegiatan.",
    "Durasi penggunaan maksimal 4 jam per sesi pemesanan demi pemerataan fasilitas.",
    "Wajib menjaga kebersihan, ketertiban, dan merawat seluruh perangkat ruangan.",
    "Dilarang membawa makanan berat, minuman terbuka tanpa penutup, dan merokok/vaping.",
    "Wajib melakukan scan QR Code presensi check-in pada tablet di pintu masuk ruangan.",
  ],
  timeSlots: [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ],
  // DRY: Memanfaatkan data ruangan dari roomsConfig dengan mapping ketersediaan yang jelas
  rooms: roomsConfig.rooms,
};
