/**
 * About Section Configuration & Content Data
 * Pusat Kreativitas & Inovasi Universitas Teknologi Yogyakarta (UTY Creative Hub)
 */

export interface AboutFocusArea {
  id: string;
  title: string;
  description: string;
  iconName: "lightbulb" | "compass" | "users";
  colorScheme: "primary" | "secondary";
}

export interface AboutPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "palette" | "rocket" | "cpu";
  accentColor: string;
  badgeColor: string;
}

export interface AboutAction {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

export interface AboutVideoConfig {
  src: string;
  driveUrl: string;
  caption: string;
  defaultVolume: number;
}

export interface AboutStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  iconName: "users" | "calendar" | "building" | "award";
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface AboutMentor {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface AboutMission {
  id: string;
  title: string;
  description: string;
  iconName: "target" | "zap" | "globe" | "shield";
}

export interface AboutConfig {
  header: {
    title: string;
    subtitle: string;
  };
  heroBanner: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    description: string;
  };
  vision: {
    title: string;
    statement: string;
  };
  missions: AboutMission[];
  narrative: {
    welcome: string;
    description: string;
  };
  actions: AboutAction[];
  focusAreas: AboutFocusArea[];
  stats: AboutStat[];
  team: {
    title: string;
    subtitle: string;
    mentors: AboutMentor[];
    members: AboutTeamMember[];
  };
  pillarsSection: {
    title: string;
    subtitle: string;
    pillars: AboutPillar[];
  };
  video: AboutVideoConfig;
  cta: {
    title: string;
    description: string;
    primaryAction: { label: string; href: string };
    secondaryAction: { label: string; href: string };
  };
}

export const aboutConfig: AboutConfig = {
  header: {
    title: "About Us",
    subtitle:
      "Pusat Pengembangan Kreativitas, Inovasi, dan Ekosistem Kolaborasi Resmi Universitas Teknologi Yogyakarta",
  },
  heroBanner: {
    badge: "Mengenal UTY Creative Hub",
    title: "Rumah Bagi Para",
    highlight: "Inovator & Kreator",
    subtitle: "Muda Indonesia",
    description:
      "UTY Creative Hub adalah pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta — wadah kolaborasi, inkubasi ide, dan pengembangan ekosistem digital bagi mahasiswa dan komunitas kampus.",
  },
  vision: {
    title: "Visi Kami",
    statement:
      "Menjadi ekosistem kreasi, riset, dan inovasi berbasis teknologi yang paling berdampak di perguruan tinggi Indonesia, serta menjadi jembatan antara dunia akademik dan industri kreatif global.",
  },
  missions: [
    {
      id: "inkubasi",
      title: "Inkubasi Ide & Startup",
      description:
        "Mewujudkan gagasan mahasiswa menjadi produk nyata melalui riset aplikatif, prototyping, dan inkubasi startup kampus bersama Sentra HKI UTY.",
      iconName: "target",
    },
    {
      id: "fasilitas",
      title: "Fasilitas Berkualitas",
      description:
        "Menyediakan laboratorium teknologi, co-working space, dan studio kreatif modern yang mendukung proses eksplorasi tanpa batas.",
      iconName: "zap",
    },
    {
      id: "kolaborasi",
      title: "Kolaborasi Lintas Ekosistem",
      description:
        "Membangun jaringan kolaborasi antara mahasiswa, dosen, mentor industri, dan mitra eksternal untuk memperluas dampak karya.",
      iconName: "globe",
    },
    {
      id: "pendidikan",
      title: "Pendidikan Masa Depan",
      description:
        "Menyelenggarakan program pendidikan praktis di FastLab Academy — mencakup AI, rekayasa perangkat lunak, dan desain kreatif digital.",
      iconName: "shield",
    },
  ],
  narrative: {
    welcome:
      "Selamat datang di UTY Creative Hub, pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta! Kami adalah wadah yang dirancang khusus untuk mahasiswa dan komunitas UTY dalam mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.",
    description:
      "Dengan fasilitas modern dan program-program yang inspiratif, UTY Creative Hub menjadi rumah bagi para pemikir kreatif, inovator muda, dan calon pemimpin masa depan yang ingin membuat perubahan positif melalui karya-karya inovatif.",
  },
  actions: [
    {
      label: "Jelajahi Program",
      href: "/programs",
      variant: "primary",
    },
    {
      label: "Reservasi Ruangan",
      href: "/booking",
      variant: "outline",
    },
  ],
  focusAreas: [
    {
      id: "inkubasi",
      title: "Wadah Ide & Inkubasi",
      description:
        "Menjembatani ide kreatif mahasiswa menjadi produk riset, startup, dan kekayaan intelektual bernilai nyata.",
      iconName: "lightbulb",
      colorScheme: "primary",
    },
    {
      id: "fasilitas",
      title: "Fasilitas & Lab Modern",
      description:
        "Dilengkapi sarana workshop, co-working space, dan laboratorium teknologi untuk eksperimen tanpa batas.",
      iconName: "compass",
      colorScheme: "secondary",
    },
    {
      id: "komunitas",
      title: "Komunitas & Ekosistem Kolaboratif",
      description:
        "Menghubungkan mahasiswa lintas fakultas, dosen pembimbing, mentor industri, dan mitra eksternal.",
      iconName: "users",
      colorScheme: "primary",
    },
  ],
  stats: [
    {
      id: "mahasiswa",
      value: 500,
      suffix: "+",
      label: "Mahasiswa Aktif",
      iconName: "users",
    },
    {
      id: "events",
      value: 50,
      suffix: "+",
      label: "Event per Tahun",
      iconName: "calendar",
    },
    {
      id: "ruangan",
      value: 8,
      suffix: "",
      label: "Ruang Kreatif",
      iconName: "building",
    },
    {
      id: "mitra",
      value: 15,
      suffix: "+",
      label: "Mitra Industri",
      iconName: "award",
    },
  ],
  team: {
    title: "Tim Kami",
    subtitle:
      "Temui individu-individu berbakat di balik UTY Creative Hub yang bekerja tanpa lelah untuk mewujudkan kreativitas dan inovasi.",
    mentors: [
      {
        id: "hendri",
        name: "MS Hendriyawan A, S.T., M.Eng., Ph.D.",
        role: "Wakil Rektor IV",
        image: "/mentor/Bapak Hendri.png",
      },
      {
        id: "puji",
        name: "Puji Utomo, S.T., M.Eng.",
        role: "Mentor",
        image: "/mentor/Bapak Puji.png",
      },
    ],
    members: [
      {
        id: "zaqi",
        name: "Akhmad Zaqi Riyadi",
        role: "Video Editor / Web Developer",
        image: "/team/zaqi.png",
      },
      {
        id: "zidan",
        name: "Adam Zidane A",
        role: "Video Editor",
        image: "/team/zidan.png",
      },
      {
        id: "yesi",
        name: "Yesi Kristiani",
        role: "Creative Event",
        image: "/team/yesi.png",
      },
      {
        id: "stev",
        name: "Steevanica Ferbina",
        role: "Creative Event",
        image: "/team/stev.png",
      },
      {
        id: "ayas",
        name: "Kirana Puspa Larasati",
        role: "Story Hunter",
        image: "/team/ayas.png",
      },
      {
        id: "lutphi",
        name: "Lutfiah Dwi Fitriani",
        role: "Graphic Design",
        image: "/team/lutphi.png",
      },
      {
        id: "pitria",
        name: "Fitria Sri Hartati",
        role: "PR and Administration",
        image: "/team/pitria.png",
      },
      {
        id: "karin",
        name: "Ritzqy Karina",
        role: "PR and Administration",
        image: "/team/karin.png",
      },
      {
        id: "yunzi",
        name: "Fitri Wahyuni",
        role: "SosMed",
        image: "/team/yunzi.png",
      },
      {
        id: "sindi",
        name: "Sindhi Kharisma",
        role: "SosMed",
        image: "/team/sindi.png",
      },
    ],
  },
  pillarsSection: {
    title: "3 Pilar Utama Kami",
    subtitle:
      "Fondasi ekosistem kreasi dan riset mahasiswa Universitas Teknologi Yogyakarta",
    pillars: [
      {
        id: "kreativitas",
        title: "Kreativitas",
        subtitle: "Creativity & Design",
        description:
          "Wadah berekspresi bagi mahasiswa untuk melahirkan gagasan orisinal, desain bernilai estetika tinggi, dan solusi kreatif yang berpusat pada manusia.",
        iconName: "palette",
        accentColor: "border-primary/20 hover:border-primary/50",
        badgeColor:
          "bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-300",
      },
      {
        id: "inovasi",
        title: "Inovasi",
        subtitle: "Applied Innovation",
        description:
          "Mendorong akselerasi riset aplikatif, inkubasi startup kampus, hingga perlindungan hak cipta & paten melalui Sentra Kekayaan Intelektual.",
        iconName: "rocket",
        accentColor: "border-secondary/30 hover:border-secondary/70",
        badgeColor:
          "bg-secondary/15 text-amber-600 dark:bg-secondary/20 dark:text-secondary",
      },
      {
        id: "teknologi",
        title: "Teknologi",
        subtitle: "Future Tech & Engineering",
        description:
          "Pemanfaatan sains komputasi, rekayasa perangkat lunak, AI, dan otomatisasi digital melalui kurikulum praktis di FastLab Academy.",
        iconName: "cpu",
        accentColor: "border-primary/20 hover:border-primary/50",
        badgeColor:
          "bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-300",
      },
    ],
  },
  video: {
    src: "/videos/uch-profile.mp4",
    driveUrl:
      "https://drive.google.com/file/d/16Ku7491nu4LqQccb5rvv6qx2VVESJpq0/view",
    caption: "Video Dokumentasi Resmi UTY Creative Hub",
    defaultVolume: 0.2,
  },
  cta: {
    title: "Siap Bergabung Bersama Kami?",
    description:
      "Jadilah bagian dari komunitas inovator muda UTY. Reservasi ruangan, ikuti program, atau kolaborasikan ide brilian kamu bersama ribuan mahasiswa kreatif.",
    primaryAction: {
      label: "Reservasi Ruangan",
      href: "/booking",
    },
    secondaryAction: {
      label: "Lihat Semua Program",
      href: "/programs",
    },
  },
};
