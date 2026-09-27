export interface EventDate {
  day: string;
  month: string;
  year: string;
  fullText: string;
}

export interface EventLocation {
  name: string;
  room?: string;
  address?: string;
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

export interface EventSpeaker {
  name: string;
  role: string;
  institution: string;
  avatarUrl?: string;
}

export interface EventRundownItem {
  time: string;
  activity: string;
  speaker?: string;
  details?: string;
}

export interface EventContactPerson {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  date: EventDate;
  time: string;
  location: EventLocation;
  category: EventCategory;
  coverImage: string;
  quota?: EventQuota;
  registrationUrl?: string;
  featured?: boolean;
  speakers?: EventSpeaker[];
  rundown?: EventRundownItem[];
  benefits?: string[];
  prerequisites?: string[];
  targetAudience?: string;
  registrationDeadline?: string;
  fee?: string;
  contactPerson?: EventContactPerson;
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
 * Daftar lengkap agenda dan event di UTY Creative Hub
 */
export const allEvents: EventItem[] = [
  {
    id: "demo-day-startup-pitch-2026",
    slug: "uch-demo-day-dan-startup-pitch-fest-2026",
    title: "UCH Demo Day & Startup Pitch Fest 2026",
    description:
      "Ajang unjuk karya dan pitching produk inovasi mahasiswa di hadapan investor, akselerator, dan mitra industri nasional.",
    longDescription:
      "UCH Demo Day & Startup Pitch Fest 2026 adalah puncak program akselerasi inovasi mahasiswa Universitas Teknologi Yogyakarta. Para finalis dari berbagai fakultas akan mempresentasikan produk inovatif mereka—mulai dari platform AI, solusi energi terbarukan, hingga teknologi agrikultur presisi—di hadapan dewan juri yang terdiri dari investor ventura, pimpinan inkubator bisnis, dan mitra industri teknologi terkemuka di Indonesia.",
    date: {
      day: "25",
      month: "SEP",
      year: "2026",
      fullText: "Jumat, 25 September 2026",
    },
    time: "08:30 - 16:00 WIB",
    location: {
      name: "Auditorium Kampus 1 UTY",
      room: "Lantai 3 Gedung Pusat Inovasi",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
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
    fee: "Gratis (Terbuka untuk Umum & Sivitas UTY)",
    registrationDeadline: "23 September 2026, 23:59 WIB",
    targetAudience:
      "Mahasiswa UTY, founder startup muda, dosen pembimbing, serta pegiat industri teknologi dan investor ventura.",
    speakers: [
      {
        name: "Dr. Ir. Bambang Hendratmo, M.Kom.",
        role: "Direktur Inovasi & Inkubasi Bisnis",
        institution: "Universitas Teknologi Yogyakarta",
      },
      {
        name: "Ahmad Farhan, M.Eng.",
        role: "Partner & Investment Lead",
        institution: "Nusantara Seed Venture",
      },
      {
        name: "Laras Kirana, S.Ds.",
        role: "Head of Product Innovation",
        institution: "Karya Solusi Nusantara",
      },
    ],
    rundown: [
      {
        time: "08:30 - 09:00",
        activity: "Registrasi Peserta & Check-in",
        details:
          "Pengambilan name tag dan berkas agenda acara di meja registrasi.",
      },
      {
        time: "09:00 - 09:30",
        activity: "Opening Remarks & Keynote",
        speaker: "Dr. Ir. Bambang Hendratmo, M.Kom.",
        details:
          "Arah ekosistem kewirausahaan dan hilirisasi riset mahasiswa UTY.",
      },
      {
        time: "09:30 - 12:00",
        activity: "Pitching Sesi 1: Kategori Smart Hardware & IoT",
        details:
          "Presentasi 6 tim inovator dengan durasi 10 menit pitch dan 5 menit Q&A dewan juri.",
      },
      {
        time: "12:00 - 13:15",
        activity: "Istirahat, Sholat & Networking Lunch",
        details:
          "Pameran mini booth prototipe karya mahasiswa di selasar auditorium.",
      },
      {
        time: "13:15 - 15:15",
        activity: "Pitching Sesi 2: Kategori Software & Digital Solution",
        details:
          "Presentasi 6 tim inovator kategori aplikasi web, AI, dan platform digital.",
      },
      {
        time: "15:15 - 16:00",
        activity: "Awarding Ceremony & Investor Networking",
        details:
          "Pengumuman inovator terbaik, seed funding, dan penutupan acara.",
      },
    ],
    benefits: [
      "Akses eksklusif menyaksikan 12 tim inovator mempresentasikan produk teruji",
      "Sesi jejaring langsung bersama investor ventura dan inkubator bisnis",
      "E-Sertifikat resmi kehadiran dari UTY Creative Hub",
      "Akses booth pameran prototipe perangkat keras dan demonstrasi software",
      "Paket konsumsi dan seminar kit resmi",
    ],
    prerequisites: [
      "Terbuka untuk mahasiswa aktif seluruh program studi UTY dan tamu undangan industri",
      "Melakukan pendaftaran online dan menunjukkan e-tiket QR saat kedatangan",
      "Berpakaian rapi dan sopan (kemeja atau batik formal)",
    ],
    contactPerson: {
      name: "Rizky Pratama",
      role: "Koordinator Acara Demo Day",
      phone: "+62 812-3456-7890",
      email: "creativehub@uty.ac.id",
    },
  },
  {
    id: "fastlab-iot-ai-esp32-workshop",
    slug: "workshop-fastlab-prototyping-iot-dan-ai-dengan-esp32",
    title: "Workshop FastLab: Prototyping Smart IoT & AI",
    description:
      "Hands-on workshop perancangan hardware cerdas berbasis sensor pintar dan integrasi cloud di Laboratorium Prototyping UCH.",
    longDescription:
      "Workshop intensif FastLab ini dirancang khusus untuk mahasiswa yang ingin mendalami pembuatan prototipe hardware cerdas. Peserta akan dibimbing langsung oleh mentor lab dalam merakit modul ESP32, mengintegrasikan berbagai modul sensor (lingkungan, jarak, dan kamera mikro), hingga menghubungkan data sensor ke platform dashboard berbasis IoT Cloud dengan inferensi model AI tepi (edge AI).",
    date: {
      day: "30",
      month: "SEP",
      year: "2026",
      fullText: "Rabu, 30 September 2026",
    },
    time: "09:00 - 13:00 WIB",
    location: {
      name: "Laboratorium FastLab UCH",
      room: "Ruang Prototyping Hardware Lt. 2",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
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
    featured: true,
    fee: "Gratis (Termasuk Peminjaman Hardware Kit Selama Sesi)",
    registrationDeadline: "28 September 2026, 17:00 WIB",
    targetAudience:
      "Mahasiswa Informatika, Teknik Elektro, Sistem Komputer, dan mahasiswa yang sedang mempersiapkan PKM-KC atau tugas akhir hardware.",
    speakers: [
      {
        name: "Yusuf Wicaksono, S.T., M.Eng.",
        role: "Lead Hardware Engineer FastLab",
        institution: "UTY Creative Hub",
      },
      {
        name: "Dian Anggraini, S.Kom.",
        role: "Embedded Systems & AI Specialist",
        institution: "Laboratorium FastLab UTY",
      },
    ],
    rundown: [
      {
        time: "09:00 - 09:20",
        activity: "Pengantar Arsitektur ESP32 & Setup Toolchain",
        details:
          "Instalasi compiler ESP-IDF/Arduino IDE dan driver USB serial.",
      },
      {
        time: "09:20 - 10:45",
        activity: "Hands-on Praktikum 1: Interfacing Sensor & Aktuator",
        details:
          "Pembacaan sensor analog/digital dan kontrol aktuator melalui GPIO.",
      },
      {
        time: "10:45 - 11:00",
        activity: "Coffee Break & Diskusi Teknis",
        details:
          "Istirahat singkat dan konsultasi kendala kabel serta pemetaan pin.",
      },
      {
        time: "11:00 - 12:30",
        activity:
          "Hands-on Praktikum 2: Telemetri MQTT & Integrasi Cloud Dashboard",
        details:
          "Pengiriman data waktu-nyata ke broker MQTT dan visualisasi dasbor data.",
      },
      {
        time: "12:30 - 13:00",
        activity: "Review Project & Sesi Tanya Jawab",
        details:
          "Ulasan hasil implementasi peserta dan panduan peminjaman fasilitas FastLab mandiri.",
      },
    ],
    benefits: [
      "Kit praktikum ESP32 lengkap (board, breadboard, sensor kit) disediakan selama acara",
      "Akses berkelanjutan ke workstation pengujian FastLab untuk proyek lanjutan",
      "Source code starter pack dan modul panduan PDF praktikum",
      "E-Sertifikat keahlian praktis dari UTY Creative Hub",
      "Konsumsi ringan dan sertifikat pendukung SKPI",
    ],
    prerequisites: [
      "Membawa laptop pribadi dengan sistem operasi Windows, Linux, atau macOS",
      "Memiliki pemahaman dasar logika pemrograman (C/C++ atau Python dasar)",
      "Telah menginstal software Arduino IDE 2.x sebelum hadir di sesi",
    ],
    contactPerson: {
      name: "Fajar Nugraha",
      role: "Laboran FastLab UTY",
      phone: "+62 821-9876-5432",
      email: "fastlab@uty.ac.id",
    },
  },
  {
    id: "klinik-proposal-pkm-2026",
    slug: "klinik-proposal-pkm-bedah-ide-menuju-pimnas-2026",
    title: "Klinik Proposal PKM: Bedah Ide Menuju PIMNAS",
    description:
      "Klinik pendampingan eksklusif bedah proposal ide kreatif bersama dosen pembimbing dan reviewer nasional PKM.",
    longDescription:
      "Program Pengkreatifan Mahasiswa (PKM) adalah momentum strategis bagi mahasiswa UTY untuk mengharumkan almamater di ajang PIMNAS. Klinik proposal ini memfasilitasi tim mahasiswa yang telah memiliki draf awal atau ide proposal untuk dibedah secara komprehensif oleh dewan reviewer universitas: dari perumusan latar belakang masalah, ketepatan skema, metode pelaksanaan, hingga kelayakan anggaran biaya (RAB).",
    date: {
      day: "04",
      month: "OKT",
      year: "2026",
      fullText: "Minggu, 04 Oktober 2026",
    },
    time: "13:00 - 17:00 WIB",
    location: {
      name: "Think-Tank Space Kampus 1",
      room: "Ruang Kolaborasi Tim Lt. 1",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
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
    featured: true,
    fee: "Gratis untuk Seluruh Tim Mahasiswa UTY",
    registrationDeadline: "02 Oktober 2026, 20:00 WIB",
    targetAudience:
      "Tim mahasiswa UTY lintas program studi yang sedang menyusun proposal PKM-RE, PKM-K, PKM-KC, PKM-PM, PKM-PI, atau PKM-VGK.",
    speakers: [
      {
        name: "Prof. Dr. Suryadi, M.Sc.",
        role: "Reviewer Nasional PKM Kemendiktisaintek",
        institution: "Tim Pembina Penalaran Mahasiswa",
      },
      {
        name: "Nurul Hidayati, S.T., M.T.",
        role: "Koordinator PKM Center UTY",
        institution: "Universitas Teknologi Yogyakarta",
      },
    ],
    rundown: [
      {
        time: "13:00 - 13:45",
        activity: "Paparan Kunci: Anatomi Proposal Lolos Pendanaan & PIMNAS",
        speaker: "Prof. Dr. Suryadi, M.Sc.",
        details:
          "Analisis rubrik penilaian, kesalahan umum administrasi, dan nilai kebaruan ide.",
      },
      {
        time: "13:45 - 15:30",
        activity: "Bedah Proposal Terarah per Kelompok Skema",
        details:
          "Pemisahan kelompok kerja sesuai skema PKM dengan bimbingan reviewer intensif.",
      },
      {
        time: "15:30 - 15:45",
        activity: "Rehat & Diskusi Meja Bundar",
        details: "Penyelarasan catatan masukan dewan reviewer.",
      },
      {
        time: "15:45 - 16:45",
        activity: "Konsultasi Rancangan Anggaran Biaya (RAB) & Justifikasi",
        details: "Penyusunan anggaran sesuai buku panduan pedoman PKM terbaru.",
      },
      {
        time: "16:45 - 17:00",
        activity: "Penyusunan Action Plan Revisi & Penutupan",
        details:
          "Jadwal tenggat waktu pengunggahan draf final ke portal internal UTY.",
      },
    ],
    benefits: [
      "Review langsung one-on-one draf proposal oleh reviewer berpengalaman",
      "Lembar evaluasi rubrik tertulis khusus untuk masing-masing tim",
      "Akses prioritas mentoring lanjutan hingga tahap unggah nasional",
      "E-Sertifikat partisipasi klinik penalaran ilmiah",
      "Koneksi dengan mahasiswa berprestasi dan alumni pemenang PIMNAS",
    ],
    prerequisites: [
      "Terdiri dari tim mahasiswa aktif UTY (minimal 3 orang anggota)",
      "Telah memiliki draf proposal awal minimal bab 1 dan 2 dalam format PDF",
      "Membawa minimal 1 laptop per tim saat menghadiri klinik",
    ],
    contactPerson: {
      name: "Anisa Rahmawati",
      role: "Sekretariat PKM Center UTY",
      phone: "+62 857-1234-5678",
      email: "pkmcenter@uty.ac.id",
    },
  },
  {
    id: "creative-talk-ui-ux-design-system",
    slug: "creative-talk-ui-ux-design-system-dan-product-scale",
    title: "Creative Talk: Membangun Design System untuk Skala Produk",
    description:
      "Diskusi panel dan studi kasus implementasi design system digital dari tim produk industri untuk mempercepat kolaborasi desainer dan engineer.",
    longDescription:
      "Dalam pengembangan produk digital modern, kecepatan dan konsistensi antarmuka adalah faktor krusial. Melalui sesi Creative Talk ini, praktisi desain produk dan front-end engineer akan membedah bagaimana merancang token desain, komponen atomik, hingga dokumentasi terpadu yang membuat alur serah terima (handoff) antara desainer dan programmer berjalan mulus dan efisien.",
    date: {
      day: "10",
      month: "OKT",
      year: "2026",
      fullText: "Sabtu, 10 Oktober 2026",
    },
    time: "09:30 - 12:00 WIB",
    location: {
      name: "Coworking Space UTY Creative Hub",
      room: "Ruang Diskusi Utama Lt. 1",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
      type: "hybrid",
    },
    category: {
      name: "Seminar & Tech Talk",
      variant: "secondary",
    },
    coverImage: "/images/porto1.jpeg",
    quota: {
      total: 80,
      filled: 45,
      status: "open",
      statusLabel: "Pendaftaran Dibuka",
    },
    fee: "Gratis untuk Mahasiswa & Umum",
    registrationDeadline: "08 Oktober 2026, 23:59 WIB",
    targetAudience:
      "Mahasiswa prodi Informatika, Sistem Informasi, Desain Komunikasi Visual, serta pegiat UI/UX dan frontend web.",
    speakers: [
      {
        name: "Galih Prasetya, S.Kom.",
        role: "Lead Product Designer",
        institution: "Kreatif Digital Studio",
      },
      {
        name: "Siti Nurhaliza, S.T.",
        role: "Senior Frontend Engineer",
        institution: "TechVentures Asia",
      },
    ],
    rundown: [
      {
        time: "09:30 - 10:00",
        activity: "Registrasi & Sambutan Pengantar",
        details: "Pembukaan dan perkenalan topik evolusi design system modern.",
      },
      {
        time: "10:00 - 11:00",
        activity: "Sesi Inti: Anatomi Token Desain & Struktur Komponen Figma",
        speaker: "Galih Prasetya, S.Kom.",
        details:
          "Studi kasus pembuatan sistem warna, tipografi, dan varian komponen di Figma.",
      },
      {
        time: "11:00 - 11:45",
        activity:
          "Sesi Kolaborasi: Menjembatani Figma ke Kode (Tailwind & React)",
        speaker: "Siti Nurhaliza, S.T.",
        details:
          "Menerjemahkan token ke utilitas Tailwind CSS dan komponen React yang teruji.",
      },
      {
        time: "11:45 - 12:00",
        activity: "Tanya Jawab Interaktif & Foto Bersama",
        details:
          "Diskusi terbuka dengan para narasumber dan penyerahan cenderamata.",
      },
    ],
    benefits: [
      "Studi kasus nyata arsitektur design system produk berskala jutaan pengguna",
      "Akses file template Figma UI Kit dan dokumentasi komponen",
      "E-Sertifikat resmi dari UTY Creative Hub",
      "Peluang diskusi dan mentoring portofolio desain langsung bersama praktisi",
    ],
    prerequisites: [
      "Terbuka untuk umum dan sivitas akademika",
      "Disarankan telah mengenal dasar alat desain Figma atau styling kode CSS",
    ],
    contactPerson: {
      name: "Danang Wijaya",
      role: "Divisi Program Komunitas UCH",
      phone: "+62 813-2468-1357",
      email: "community@uty.ac.id",
    },
  },
  {
    id: "bootcamp-rapid-mvp-development",
    slug: "bootcamp-kreanovasi-rapid-mvp-development-2026",
    title: "Bootcamp Kreanovasi: Rapid MVP Development",
    description:
      "Program intensif 2 hari membangun Minimum Viable Product siap uji pasar menggunakan stack modern Next.js dan Supabase.",
    longDescription:
      "Banyak ide inovasi mahasiswa terhenti di tahap gagasan karena lamanya proses pengembangan teknis. Bootcamp Kreanovasi memandu peserta membangun prototipe fungsional (MVP) dalam tempo 2 hari menggunakan Next.js App Router, Tailwind CSS, dan BaaS Supabase. Peserta diajarkan membuat alur autentikasi, manajemen basis data, integrasi API, hingga deployment otomatis ke cloud publik.",
    date: {
      day: "17",
      month: "OKT",
      year: "2026",
      fullText: "Sabtu - Minggu, 17 - 18 Oktober 2026",
    },
    time: "08:30 - 16:30 WIB",
    location: {
      name: "Laboratorium Multimedia Kampus 1",
      room: "Lab Komputer 3 Lt. 3",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
      type: "offline",
    },
    category: {
      name: "Hands-on Workshop",
      variant: "primary",
    },
    coverImage: "/images/room2.jpeg",
    quota: {
      total: 35,
      filled: 35,
      status: "full",
      statusLabel: "Kuota Penuh",
    },
    fee: "Gratis (Didanai Program Hibah Inovasi Kampus)",
    registrationDeadline: "14 Oktober 2026, 18:00 WIB",
    targetAudience:
      "Mahasiswa tingkat 2-4 yang sedang mengerjakan prototipe startup atau tugas akhir berbasis web aplikasi.",
    speakers: [
      {
        name: "Muhammad Ilham, S.Kom., M.T.",
        role: "Full-Stack Software Architect",
        institution: "Pusat Riset Perangkat Lunak UTY",
      },
    ],
    rundown: [
      {
        time: "08:30 - 10:00",
        activity: "Hari 1: Perumusan Ruang Lingkup MVP & Skema Database",
        details:
          "Teknik membatasi fitur produk esensial dan perancangan relasi data.",
      },
      {
        time: "10:00 - 12:00",
        activity: "Hari 1: Setup Proyek Next.js & Autentikasi Pengguna",
        details:
          "Konfigurasi autentikasi aman dengan row-level security (RLS).",
      },
      {
        time: "13:00 - 16:30",
        activity: "Hari 1: Pembangunan Fitur Utama & Server Actions",
        details:
          "Pengelolaan CRUD fungsional tanpa backend boilerplate berlebih.",
      },
      {
        time: "08:30 - 12:00",
        activity: "Hari 2: Integrasi UI Interaktif & Pengujian Alur Pengguna",
        details: "Penyempurnaan antarmuka menggunakan komponen UI aksesibel.",
      },
      {
        time: "13:00 - 16:30",
        activity: "Hari 2: Deployment Cloud, Pengujian Beban & Demo Internal",
        details:
          "Proses publikasi aplikasi dan presentasi demo masing-masing kelompok.",
      },
    ],
    benefits: [
      "Aplikasi web utuh yang siap dijadikan portofolio dan diuji ke target pengguna",
      "Repository kode acuan lengkap dengan lisensi open source",
      "E-Sertifikat kelulusan bootcamp bersertifikasi universitas",
      "Konsumsi penuh selama 2 hari pelaksanaan",
    ],
    prerequisites: [
      "Menguasai dasar JavaScript / TypeScript dan konsep dasar HTML/CSS",
      "Membawa laptop pribadi dengan Node.js versi LTS terinstal",
      "Memiliki akun GitHub aktif",
    ],
    contactPerson: {
      name: "Taufik Hidayat",
      role: "Asisten Lab Multimedia UTY",
      phone: "+62 895-3344-5566",
      email: "labkomputer@uty.ac.id",
    },
  },
  {
    id: "masterclass-paten-hki-mahasiswa",
    slug: "masterclass-intellectual-property-dan-paten-mahasiswa",
    title: "Masterclass: Hak Kekayaan Intelektual & Paten Karya Mahasiswa",
    description:
      "Panduan lengkap perlindungan hukum hak cipta, paten sederhana, dan merek produk inovasi mahasiswa bersama Sentra HKI UTY.",
    longDescription:
      "Setiap karya inovasi riset dan aplikasi teknologi memiliki nilai komersial yang patut dilindungi secara hukum. Masterclass ini menghadirkan pakar hukum kekayaan intelektual untuk memandu mahasiswa langkah demi langkah dalam menyusun deskripsi klaim paten sederhana, mendaftarkan hak cipta kode program, hingga memanfaatkan fasilitas insentif biaya pendaftaran HKI dari kampus.",
    date: {
      day: "24",
      month: "OKT",
      year: "2026",
      fullText: "Sabtu, 24 Oktober 2026",
    },
    time: "10:00 - 12:30 WIB",
    location: {
      name: "Ruang Seminar Kampus 1 UTY",
      room: "Gedung Dekanat Lt. 2",
      address:
        "Jl. Siliwangi (Ringroad Utara), Jombor, Sleman, D.I. Yogyakarta",
      type: "offline",
    },
    category: {
      name: "Klinik & Mentoring",
      variant: "accent",
    },
    coverImage: "/images/coworking-space.jpg",
    quota: {
      total: 60,
      filled: 28,
      status: "open",
      statusLabel: "Pendaftaran Dibuka",
    },
    fee: "Gratis (Termasuk Bimbingan Formulir Pendaftaran HKI)",
    registrationDeadline: "22 Oktober 2026, 17:00 WIB",
    targetAudience:
      "Dosen pembimbing, mahasiswa tingkat akhir, dan tim inventor PKM/skripsi yang telah menghasilkan prototipe alat atau karya cipta piranti lunak.",
    speakers: [
      {
        name: "Dr. Hendra Gunawan, S.H., M.Hum.",
        role: "Ketua Sentra HKI & Konsultan Paten Terdaftar",
        institution: "Sentra HKI Universitas Teknologi Yogyakarta",
      },
    ],
    rundown: [
      {
        time: "10:00 - 10:15",
        activity:
          "Pengantar Pentingnya Perlindungan Aset Intelektual Mahasiswa",
        details:
          "Memahami perbedaan Hak Cipta, Paten, Merek, dan Desain Industri.",
      },
      {
        time: "10:15 - 11:30",
        activity:
          "Tata Cara Penulisan Deskripsi Paten & Drafting Klaim Mandiri",
        speaker: "Dr. Hendra Gunawan, S.H., M.Hum.",
        details:
          "Latihan praktis menyusun uraian invensi, gambar teknik, dan batasan klaim hukum.",
      },
      {
        time: "11:30 - 12:15",
        activity: "Prosedur Pengajuan Insentif Pembiayaan HKI Kampus",
        details:
          "Alur submit berkas melalui Sentra HKI UTY hingga penerbitan sertifikat resmi DJKI.",
      },
      {
        time: "12:15 - 12:30",
        activity: "Konsultasi Cepat & Penutupan",
        details:
          "Pemeriksaan awal kelayakan berkas inovasi mahasiswa oleh tim sentra.",
      },
    ],
    benefits: [
      "Bimbingan gratis pengisian borang permohonan HKI resmi Kemenkumham RI",
      "Peluang mendapatkan fasilitas pembiayaan pendaftaran hak cipta/paten dari universitas",
      "E-Sertifikat resmi dari Sentra HKI UTY",
      "Materi presentasi dan contoh dokumen drafting paten berstandar nasional",
    ],
    prerequisites: [
      "Membawa ringkasan deskripsi karya inovasi atau prototipe yang hendak didaftarkan",
      "Terbuka untuk seluruh mahasiswa dan dosen sivitas akademika UTY",
    ],
    contactPerson: {
      name: "Retno Wulandari",
      role: "Staf Administrasi Sentra HKI UTY",
      phone: "+62 811-2233-4455",
      email: "hki@uty.ac.id",
    },
  },
];

/**
 * Curated upcoming events and workshop agenda for landing page.
 * Keeps exactly 3 events to preserve test compatibility with events.test.ts.
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
  events: allEvents.slice(0, 3),
};

/**
 * Mengambil semua event yang tersedia
 */
export function getAllEvents(): EventItem[] {
  return allEvents;
}

/**
 * Mengambil event berdasarkan slug
 */
export function getEventBySlug(slug: string): EventItem | undefined {
  return allEvents.find((event) => event.slug === slug);
}

/**
 * Mengambil event terkait (kategori sama atau acak selain event saat ini)
 */
export function getRelatedEvents(currentSlug: string, limit = 3): EventItem[] {
  const currentEvent = getEventBySlug(currentSlug);
  if (!currentEvent) return allEvents.slice(0, limit);

  const otherEvents = allEvents.filter((event) => event.slug !== currentSlug);
  const sameCategory = otherEvents.filter(
    (event) => event.category.name === currentEvent.category.name,
  );
  const differentCategory = otherEvents.filter(
    (event) => event.category.name !== currentEvent.category.name,
  );

  return [...sameCategory, ...differentCategory].slice(0, limit);
}

/**
 * Mengambil daftar kategori unik dari seluruh agenda
 */
export function getEventCategories(): string[] {
  const categories = new Set(allEvents.map((event) => event.category.name));
  return Array.from(categories);
}
