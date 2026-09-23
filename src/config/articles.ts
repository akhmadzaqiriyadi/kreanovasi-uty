export interface ArticleCategory {
  name: string;
  variant: "primary" | "secondary" | "accent";
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
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
  tags: string[];
  keyTakeaways?: string[];
  sections: ArticleSection[];
  quote?: {
    text: string;
    author: string;
  };
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
  categories: string[];
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
  categories: [
    "Semua",
    "Kreativitas & PKM",
    "Teknologi & IoT",
    "Inovasi & HKI",
    "Startup & Bisnis",
    "Fasilitas Lab",
  ],
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
        avatar: "/mentor/hendriyawan.jpg",
        bio: "Divisi pembina program kreativitas dan penalaran mahasiswa di bawah naungan Wakil Rektor IV Bidang Kreativitas & Kewirausahaan UTY.",
      },
      publishedAt: "8 Sep 2026",
      readTime: "4 min baca",
      featured: true,
      tags: ["PKM", "PIMNAS", "Belmawa", "Kreativitas Mahasiswa", "Inovasi"],
      keyTakeaways: [
        "Pahami skema PKM yang sesuai dengan bidang kepakaran (PKM-RE, PKM-K, PKM-KC, PKM-PI, dll).",
        "Validasi kebaruan ide dan urgensi masalah masyarakat nyata di Yogyakarta dan nasional.",
        "Manfaatkan klinik bedah proposal berkala di UTY Creative Hub sebelum batas unggah nasional.",
      ],
      quote: {
        text: "Kunci keberhasilan di ajang PIMNAS bukan semata ide yang canggih, melainkan ketepatan solusi atas masalah nyata yang diuji dengan metodologi yang kokoh.",
        author: "MS Hendriyawan A, Ph.D. — Pembina UTY Creative Hub",
      },
      sections: [
        {
          heading: "Mengapa PKM Menjadi Batu Loncatan Mahasiswa Inovatif?",
          paragraphs: [
            "Program Kreativitas Mahasiswa (PKM) dari Kemendiktisaintek merupakan tolok ukur bergengsi bagi iklim riset dan kewirausahaan perguruan tinggi di Indonesia. Mahasiswa tidak hanya dituntut menyusun gagasan di atas kertas, tetapi juga merealisasikannya dalam bentuk purwarupa, riset empiris, maupun penerapan teknologi di dunia industri.",
            "Di Universitas Teknologi Yogyakarta, PKM Corner hadir sebagai ekosistem akselerator inkubasi. Mahasiswa dari lintas jurusan — seperti Informatika, Teknik Elektro, Teknik Sipil, hingga Manajemen Bisnis — dapat berkolaborasi membentuk tim multidisiplin yang tangguh.",
          ],
        },
        {
          heading: "Tahapan Pendampingan Intensif di PKM Corner",
          paragraphs: [
            "UTY Creative Hub menyusun alur pendampingan 4 fase terstruktur untuk memastikan setiap proposal memiliki standar kompetisi nasional:",
          ],
          bulletPoints: [
            "Fase 1: Ideation & Problem Discovery — Mengidentifikasi isu krusial di masyarakat dan industri yang membutuhkan intervensi teknologi.",
            "Fase 2: Mentoring Lintas Disiplin — Mengawinkan mahasiswa teknologi dengan mahasiswa bisnis dan komunikasi.",
            "Fase 3: Reviewer Eksternal & Klinik Substansi — Membedah struktur kepatuhan pedoman, RAB realistis, dan metodologi.",
            "Fase 4: Akselerasi Prototyping di FastLab — Pemanfaatan fasilitas 3D printer, sensor lab, dan cloud computing untuk membuktikan feasibility ide.",
          ],
        },
        {
          heading: "Langkah Selanjutnya untuk Mahasiswa UTY",
          paragraphs: [
            "Bagi tim mahasiswa yang telah memiliki embrio gagasan, pendaftaran coaching session PKM Corner dibuka sepanjang semester melalui portal resmi UTY Creative Hub. Tim terpilih akan mendapatkan workspace khusus di Co-Working Space serta akses mentoring 1-on-1 dengan dosen pembina berpengalaman.",
          ],
        },
      ],
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
        bio: "Tim teknis dan perekayasa sistem tertanam (embedded systems), instrumentasi sensor, dan IoT di Laboratorium FastLab UTY Creative Hub.",
      },
      publishedAt: "5 Sep 2026",
      readTime: "5 min baca",
      tags: [
        "IoT",
        "FastLab",
        "Hardware",
        "Arduino",
        "ESP32",
        "Sistem Tertanam",
      ],
      keyTakeaways: [
        "Akses instrumen lab standar industri: solder station digital, osiloskop, 3D printer, dan sensor suite.",
        "Dukungan pengembangan firmware modern berbasis FreeRTOS, ESP-IDF, dan MicroPython.",
        "Integrasi cloud telemetry real-time menggunakan MQTT dan RESTful Next.js API.",
      ],
      sections: [
        {
          heading: "Transformasi Ide Konseptual Menjadi Purwarupa Fisik",
          paragraphs: [
            "Laboratorium FastLab Academy dirancang sebagai ruang fabrikasi cepat (rapid hardware prototyping). Kemampuan mengintegrasikan sensor fisik dengan antarmuka telemetri data menjadi keahlian riset terapan yang sangat krusial bagi mahasiswa teknik.",
            "FastLab menyediakan berbagai mikrokontroler mulai dari keluarga ESP32, STM32, Raspberry Pi, hingga modul sensor lingkungan presisi tinggi seperti kelembapan tanah, kualitas udara MQ-series, dan modul telemetri LoRaWAN.",
          ],
        },
        {
          heading: "Integrasi Telemetri: Dari Sensor Hingga Dashboard Web",
          paragraphs: [
            "Salah satu keunggulan riset terapan di FastLab adalah pipeline data yang terintegrasi penuh. Perangkat keras mengirim data telemetri ke server MQTT broker kampus, yang kemudian divisualisasikan melalui aplikasi web berbasis Next.js dan Tailwind CSS.",
            "Dengan alur kerja ini, mahasiswa tidak hanya belajar elektronika dasar, melainkan juga menguasai arsitektur IoT end-to-end yang siap diimplementasikan untuk smart agriculture, monitoring gedung pintar, dan automasi industri.",
          ],
        },
      ],
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
        bio: "Sentra resmi fasilitasi pendaftaran Hak Cipta, Paten, Desain Industri, dan Merek Dagang bagi sivitas akademika Universitas Teknologi Yogyakarta.",
      },
      publishedAt: "1 Sep 2026",
      readTime: "3 min baca",
      tags: ["HKI", "Paten", "Hak Cipta", "Startup", "Kekayaan Intelektual"],
      keyTakeaways: [
        "Pahami perbedaan perlindungan antara Hak Cipta perangkat lunak dan Paten invensi teknologi.",
        "Lakukan penelusuran paten (patent search) sebelum merilis purwarupa ke publik untuk menghindari plagiasi.",
        "Sivitas akademika UTY berhak atas subsidi pengurusan dan pendampingan drafting dokumen paten.",
      ],
      sections: [
        {
          heading: "Pentingnya Mengamankan Aset Tak Berwujud Sejak Dini",
          paragraphs: [
            "Banyak inovator muda kampus yang bersemangat meluncurkan aplikasi atau produk hardware, namun lupa mengamankan aspek legalitas kekayaan intelektualnya. Ketika produk tersebut mulai menarik perhatian pasar, risiko peniruan menjadi ancaman nyata.",
            "Sentra HKI UTY hadir untuk memberikan proteksi menyeluruh. Mulai dari pendaftaran hak cipta program komputer, merek dagang untuk brand rintisan, hingga penyusunan klaim paten sederhana bagi purwarupa mekanik dan sirkuit elektronik.",
          ],
        },
        {
          heading: "Alur Pendaftaran HKI Terpadu di UTY",
          paragraphs: [
            "Proses pendaftaran HKI di lingkungan UTY kini sepenuhnya terdigitalisasi. Mahasiswa cukup berkonsultasi dengan tim Sentra HKI di Gedung G6 Lantai 3, melampirkan deskripsi invensi atau source code, dan tim ahli akan memandu penyusunan dokumen hingga sertifikat resmi DJKI terbit.",
          ],
        },
      ],
    },
    {
      id: "startup-incubation-pitching-2026",
      slug: "inkubasi-startup-mahasiswa-dari-validasi-ide-ke-pitching-investor",
      title:
        "Inkubasi Startup Mahasiswa: Dari Validasi Ide ke Pitching Investor",
      excerpt:
        "Bagaimana program inkubator UTY Creative Hub membantu founder muda memvalidasi produk, menyusun unit economics, dan tampil percaya diri di depan angel investor.",
      category: {
        name: "Startup & Bisnis",
        variant: "secondary",
      },
      coverImage: "/images/coworking-space.jpg",
      author: {
        name: "Inkubator Bisnis UTY",
        role: "Startup Accelerator Lead",
        bio: "Akselerator startup kampus yang membina puluhan usaha rintisan mahasiswa dari tahap ideation hingga pendanaan tahap awal.",
      },
      publishedAt: "28 Agu 2026",
      readTime: "6 min baca",
      tags: ["Startup", "Pitching", "Inkubator", "Bisnis", "Venture Capital"],
      keyTakeaways: [
        "Validasi problem-solution fit sebelum menghabiskan waktu berbulan-bulan coding produk.",
        "Pelajari pembuatan pitch deck 10 slide yang ringkas dan memikat pemodal ventura.",
        "Gunakan fasilitas Co-Working Space dan Podcast Studio UCH untuk demo dan wawancara pengguna.",
      ],
      sections: [
        {
          heading: "Membangun Ekosistem Wirausaha Berbasis Teknologi",
          paragraphs: [
            "Tidak semua proyek kuliah harus berakhir di lemari arsip. Di UTY Creative Hub, proyek tugas akhir dan inovasi riset mahasiswa diarahkan agar memiliki kelayakan komersial (commercial viability).",
            "Melalui kurikulum inkubasi intensif 12 minggu, para founder diajak membedah target pasar, menganalisis kompetitor, hingga menghitung Customer Acquisition Cost (CAC) dan Lifetime Value (LTV).",
          ],
        },
        {
          heading: "Demo Day & Akses ke Jaringan Mitra Industri",
          paragraphs: [
            "Puncak dari program inkubasi adalah gelaran tahunan Demo Day, di mana 10 startup mahasiswa terbaik berkesempatan mempresentasikan solusinya di hadapan para investor, alumni sukses, dan pimpinan korporasi mitra UTY.",
          ],
        },
      ],
    },
    {
      id: "fasilitas-lab-prototyping-lengkap",
      slug: "panduan-fasilitas-laboratorium-prototyping-cepat-di-uty",
      title: "Panduan Lengkap Fasilitas Laboratorium Prototyping Cepat di UTY",
      excerpt:
        "Mengenal instrumen fabrikasi canggih, etika keselamatan kerja, dan prosedur peminjaman alat di Creative Lab Gedung G6.",
      category: {
        name: "Fasilitas Lab",
        variant: "accent",
      },
      coverImage: "/images/meeting-room.jpg",
      author: {
        name: "Puji Utomo, S.T., M.Eng.",
        role: "Kepala Laboratorium Inovasi",
        avatar: "/mentor/puji-utomo.jpg",
        bio: "Dosen dan pengarah teknis operasional fasilitas laboratorium prototyping dan ruang kreatif UTY Creative Hub.",
      },
      publishedAt: "20 Agu 2026",
      readTime: "4 min baca",
      tags: ["Fasilitas", "Laboratorium", "Prototyping", "Booking", "Alat"],
      keyTakeaways: [
        "Sistem booking ruang dan peminjaman alat terintegrasi langsung lewat portal UCH Web App.",
        "Pelatihan sertifikasi keselamatan operasional alat wajib diikuti sebelum menggunakan instrumen kelas berat.",
        "Ruang diskusi dan multimedia studio dapat digunakan bebas biaya untuk keperluan akademis sivitas UTY.",
      ],
      sections: [
        {
          heading: "Mendukung Budaya 'Maker' di Kalangan Mahasiswa",
          paragraphs: [
            "Laboratorium inovasi di Gedung G6 Lantai 3 UTY dibangun dengan filosofi Open Maker Space. Ruangan ini dilengkapi dengan 8 bilik kerja kolaboratif, meja kerja anti-statis (ESD-safe), serta ventilasi khusus untuk pengerjaan perakitan dan cetak 3 dimensi.",
            "Keberadaan fasilitas ini memangkas hambatan biaya yang kerap dihadapi mahasiswa saat ingin menguji coba inovasi mekanik atau sensor cerdas.",
          ],
        },
        {
          heading: "Cara Memanfaatkan Fasilitas Melalui Web App",
          paragraphs: [
            "Seluruh peminjaman ruangan dan perlengkapan dapat dijadwalkan dengan mudah melalui menu 'Booking' di portal ini. Pilih ruangan yang diinginkan, tentukan tanggal serta jam penggunaan, dan konfirmasi akan diproses secara real-time oleh administrator hub.",
          ],
        },
      ],
    },
  ],
};

/**
 * Helper to fetch all articles
 */
export function getAllArticles(): Article[] {
  return articlesConfig.articles;
}

/**
 * Helper to get a specific article by its slug
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articlesConfig.articles.find((a) => a.slug === slug);
}

/**
 * Helper to get related articles (excluding the current one)
 */
export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) {
    return articlesConfig.articles.slice(0, limit);
  }

  // Prioritize same category first
  const sameCategory = articlesConfig.articles.filter(
    (a) => a.slug !== currentSlug && a.category.name === current.category.name,
  );

  const others = articlesConfig.articles.filter(
    (a) => a.slug !== currentSlug && a.category.name !== current.category.name,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
