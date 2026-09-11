export interface ArticleCategory {
  name: string;
  variant: "primary" | "secondary" | "accent";
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  coverImage: string;
  author: ArticleAuthor;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

export interface ArticlesConfig {
  header: {
    title: string;
    subtitle: string;
  };
  cta: {
    label: string;
    href: string;
  };
  articles: Article[];
}

/**
 * Curated article and news configurations for landing page and insights section
 */
export const articlesConfig: ArticlesConfig = {
  header: {
    title: "Artikel & Wawasan",
    subtitle:
      "Kumpulan panduan inspiratif, kabar teknologi, riset terapan, dan ekosistem kreasi mahasiswa UTY Creative Hub.",
  },
  cta: {
    label: "Lihat Semua Artikel",
    href: "/articles",
  },
  articles: [
    {
      id: "pkm-corner-pimnas-2026",
      slug: "pkm-corner-akselerasi-kreativitas-mahasiswa-menuju-pimnas",
      title: "PKM Corner: Akselerasi Kreativitas Mahasiswa Menuju PIMNAS",
      excerpt:
        "Panduan terstruktur dan klinik pendampingan proposal Program Kreativitas Mahasiswa bersama mentor berpengalaman untuk lolos pendanaan nasional.",
      category: {
        name: "Kreativitas & PKM",
        variant: "primary",
      },
      coverImage: "/images/porto1.jpeg",
      author: {
        name: "Tim PKM Corner",
        role: "Mentor Kreativitas UTY",
      },
      publishedAt: "8 Sep 2026",
      readTime: "4 min baca",
      featured: true,
    },
    {
      id: "iot-fastlab-prototyping-2026",
      slug: "eksplorasi-iot-dan-smart-hardware-di-fastlab-academy",
      title: "Eksplorasi IoT & Smart Hardware di Fasilitas FastLab Academy",
      excerpt:
        "Praktik langsung perancangan prototipe perangkat cerdas dan sistem komputasi terdistribusi menggunakan laboratorium modern UTY Creative Hub.",
      category: {
        name: "Teknologi & IoT",
        variant: "secondary",
      },
      coverImage: "/images/prototyping-room.jpg",
      author: {
        name: "FastLab Engineering",
        role: "Lab Supervisor",
      },
      publishedAt: "5 Sep 2026",
      readTime: "5 min baca",
    },
    {
      id: "sentra-hki-startup-paten-2026",
      slug: "panduan-perlindungan-hak-cipta-dan-paten-startup-mahasiswa",
      title: "Strategi Perlindungan Hak Cipta & Paten Melalui Sentra HKI",
      excerpt:
        "Langkah mudah mengamankan kekayaan intelektual, paten sederhana, dan merek produk startup kampus agar siap bersaing di industri global.",
      category: {
        name: "Inovasi & HKI",
        variant: "primary",
      },
      coverImage: "/images/think-tank-room.jpg",
      author: {
        name: "Sentra HKI UTY",
        role: "Konsultan Kekayaan Intelektual",
      },
      publishedAt: "1 Sep 2026",
      readTime: "3 min baca",
    },
  ],
};
