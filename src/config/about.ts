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

export interface AboutConfig {
  header: {
    title: string;
    subtitle: string;
  };
  narrative: {
    welcome: string;
    description: string;
  };
  actions: AboutAction[];
  focusAreas: AboutFocusArea[];
  pillarsSection: {
    title: string;
    subtitle: string;
    pillars: AboutPillar[];
  };
  video: AboutVideoConfig;
}

export const aboutConfig: AboutConfig = {
  header: {
    title: "About Us",
    subtitle:
      "Pusat Pengembangan Kreativitas, Inovasi, dan Ekosistem Kolaborasi Resmi Universitas Teknologi Yogyakarta",
  },
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
        badgeColor: "bg-primary/10 text-primary",
      },
      {
        id: "inovasi",
        title: "Inovasi",
        subtitle: "Applied Innovation",
        description:
          "Mendorong akselerasi riset aplikatif, inkubasi startup kampus, hingga perlindungan hak cipta & paten melalui Sentra Kekayaan Intelektual.",
        iconName: "rocket",
        accentColor: "border-secondary/30 hover:border-secondary/70",
        badgeColor: "bg-secondary/15 text-secondary-foreground",
      },
      {
        id: "teknologi",
        title: "Teknologi",
        subtitle: "Future Tech & Engineering",
        description:
          "Pemanfaatan sains komputasi, rekayasa perangkat lunak, AI, dan otomatisasi digital melalui kurikulum praktis di FastLab Academy.",
        iconName: "cpu",
        accentColor: "border-primary/20 hover:border-primary/50",
        badgeColor: "bg-primary/10 text-primary",
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
};
