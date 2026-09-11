export interface EventDate {
  day: string;
  month: string;
  year: string;
  fullText: string;
}

export interface EventLocation {
  name: string;
  type: "offline" | "online" | "hybrid";
}

export interface EventCategory {
  name: string;
  variant: "primary" | "secondary" | "accent";
}

export interface EventQuota {
  total: number;
  filled: number;
  status: "open" | "closing-soon" | "full";
  statusLabel: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: EventDate;
  time: string;
  location: EventLocation;
  category: EventCategory;
  coverImage: string;
  quota?: EventQuota;
  registrationUrl?: string;
  featured?: boolean;
}

export interface EventsConfig {
  header: {
    title: string;
    subtitle: string;
  };
  cta: {
    label: string;
    href: string;
  };
  events: EventItem[];
}

/**
 * Curated upcoming events and workshop agenda for landing page
 */
export const eventsConfig: EventsConfig = {
  header: {
    title: "Agenda & Events Mendatang",
    subtitle:
      "Ikuti berbagai seminar inspiratif, workshop teknologi praktis, klinik PKM, dan demo inovasi bersama para mentor terbaik di UTY Creative Hub.",
  },
  cta: {
    label: "Lihat Semua Agenda",
    href: "/events",
  },
  events: [
    {
      id: "demo-day-startup-pitch-2026",
      slug: "uch-demo-day-dan-startup-pitch-fest-2026",
      title: "UCH Demo Day & Startup Pitch Fest 2026",
      description:
        "Ajang unjuk karya dan pitching produk inovasi mahasiswa di hadapan investor, akselerator, dan mitra industri nasional.",
      date: {
        day: "25",
        month: "SEP",
        year: "2026",
        fullText: "Jumat, 25 September 2026",
      },
      time: "08:30 - 16:00 WIB",
      location: {
        name: "Auditorium Kampus 1 UTY",
        type: "hybrid",
      },
      category: {
        name: "Demo Day & Pitching",
        variant: "primary",
      },
      coverImage: "/images/porto2.jpeg",
      quota: {
        total: 120,
        filled: 85,
        status: "open",
        statusLabel: "Pendaftaran Dibuka",
      },
      featured: true,
    },
    {
      id: "fastlab-iot-ai-esp32-workshop",
      slug: "workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32",
      title: "Workshop FastLab: Prototyping Smart IoT & AI",
      description:
        "Hands-on workshop perancangan hardware cerdas berbasis sensor pintar dan integrasi cloud di Laboratorium Prototyping UCH.",
      date: {
        day: "30",
        month: "SEP",
        year: "2026",
        fullText: "Rabu, 30 September 2026",
      },
      time: "09:00 - 13:00 WIB",
      location: {
        name: "Laboratorium FastLab UCH",
        type: "offline",
      },
      category: {
        name: "Hands-on Workshop",
        variant: "secondary",
      },
      coverImage: "/images/room1.jpeg",
      quota: {
        total: 30,
        filled: 26,
        status: "closing-soon",
        statusLabel: "Slot Terbatas",
      },
    },
    {
      id: "klinik-proposal-pkm-2026",
      slug: "klinik-proposal-pkm-bedah-ide-menuju-pimnas-2026",
      title: "Klinik Proposal PKM: Bedah Ide Menuju PIMNAS",
      description:
        "Klinik pendampingan eksklusif bedah proposal ide kreatif bersama dosen pembimbing dan reviewer nasional PKM.",
      date: {
        day: "04",
        month: "OKT",
        year: "2026",
        fullText: "Minggu, 04 Oktober 2026",
      },
      time: "13:00 - 17:00 WIB",
      location: {
        name: "Think-Tank Space Kampus 1",
        type: "offline",
      },
      category: {
        name: "Klinik & Mentoring",
        variant: "primary",
      },
      coverImage: "/images/coworking-space.jpg",
      quota: {
        total: 50,
        filled: 32,
        status: "open",
        statusLabel: "Pendaftaran Dibuka",
      },
    },
  ],
};
