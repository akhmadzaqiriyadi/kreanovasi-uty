export interface RoomBookingStatus {
  state: "available" | "in-use" | "reserved-soon";
  label: string;
  timeSlotInfo: string;
}

export interface RoomItem {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  capacity: string;
  location: string;
  coverImage: string;
  facilities: string[];
  status: RoomBookingStatus;
  featured?: boolean;
}

export interface RoomsConfig {
  header: {
    title: string;
    subtitle: string;
  };
  cta: {
    label: string;
    href: string;
  };
  rooms: RoomItem[];
}

/**
 * Curated real-time room status and facility configurations
 */
export const roomsConfig: RoomsConfig = {
  header: {
    title: "Status Ruangan & Fasilitas",
    subtitle:
      "Pantau ketersediaan co-working space, lab perakitan, dan ruang brainstorming secara langsung untuk mendukung riset serta kolaborasi Anda.",
  },
  cta: {
    label: "Cek Kalender Jadwal Lengkap",
    href: "/booking",
  },
  rooms: [
    {
      id: "coworking-space-hall",
      slug: "coworking-space-dan-ideation-hall",
      name: "Co-Working Space & Ideation Hall",
      type: "Kolaborasi & Belajar Mandiri",
      description:
        "Area komunal terbuka berdaya tampung besar dengan koneksi internet gigabit dan meja fleksibel untuk kelompok belajar & startup.",
      capacity: "40 Orang",
      location: "Lantai 1 Gedung UCH",
      coverImage: "/images/coworking-space.jpg",
      facilities: [
        "Wi-Fi 6",
        "Power Station",
        "Ergonomic Chairs",
        "Whiteboard",
      ],
      status: {
        state: "available",
        label: "Tersedia Sekarang",
        timeSlotInfo: "Bebas Digunakan Langsung",
      },
      featured: true,
    },
    {
      id: "fastlab-prototyping-iot",
      slug: "laboratorium-fastlab-prototyping-dan-iot",
      name: "FastLab Prototyping & IoT Lab",
      type: "Fabrikasi & Perakitan Hardware",
      description:
        "Fasilitas riset rekayasa perangkat lunak dan hardware modern dengan perlengkapan cetak 3D, soldering station, dan sensor kit.",
      capacity: "20 Orang",
      location: "Laboratorium Lantai 2",
      coverImage: "/images/prototyping-room.jpg",
      facilities: [
        "3D Printer",
        "Solder Station",
        "Sensor Kit",
        "AC & Exhaust",
      ],
      status: {
        state: "reserved-soon",
        label: "Dipesan Pukul 14:00",
        timeSlotInfo: "Sisa Waktu 2 Jam Terbuka",
      },
    },
    {
      id: "think-tank-meeting-room",
      slug: "think-tank-brainstorming-room",
      name: "Think-Tank Meeting Room",
      type: "Rapat & Pitching Tertutup",
      description:
        "Ruang tertutup kedap suara dilengkapi smart TV 65 inci dan kamera konferensi untuk presentasi bisnis, evaluasi PKM, dan meeting mitra.",
      capacity: "12 Orang",
      location: "Lantai 2 Gedung UCH",
      coverImage: "/images/think-tank-room.jpg",
      facilities: ['Smart TV 65"', "Conference Cam", "Acoustic Wall", "AC"],
      status: {
        state: "in-use",
        label: "Sedang Digunakan",
        timeSlotInfo: "Hingga 13:30 WIB (Tim PKM-K)",
      },
    },
  ],
};
