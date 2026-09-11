# 🚀 UTY Creative Hub (Kreanovasi UTY)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Biome](https://img.shields.io/badge/Biome-Linter-60a5fa?style=for-the-badge&logo=biome)](https://biomejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**UTY Creative Hub (Kreanovasi UTY)** adalah platform digital resmi pusat pengembangan kreativitas, inovasi, inkubasi ide, dan ekosistem riset terapan **Universitas Teknologi Yogyakarta (UTY)**. Dibangun dengan standar web modern untuk menyajikan pengalaman pengguna yang cepat, responsif, elegan, dan berkinerja tinggi bagi mahasiswa, dosen, mentor industri, dan masyarakat kampus.

🌐 **Production URL:** [https://kreanovasi.uty.ac.id](https://kreanovasi.uty.ac.id)  
📦 **Repository:** [https://github.com/akhmadzaqiriyadi/kreanovasi-uty](https://github.com/akhmadzaqiriyadi/kreanovasi-uty)

---

## 🌟 Fitur Utama

- **🎨 Modern UI & Glassmorphism Design:** Tampilan antarmuka berstandar premium dengan Tailwind CSS v4, dynamic dark/light mode, palet warna Navy & Gold khas kampus, serta micro-interactions yang halus.
- **⚡ Next.js 16 + React 19 (App Router):** Performa loading secepat kilat dengan React Server Components (RSC), Turbopack compilation, dan static prerendering.
- **🛡️ Keamanan Teruji & Terproteksi:** Dibangun dengan arsitektur bebas celah keamanan RSC (aman dari CVE-2025-55182) serta sanitasi input dan validasi data berbasis Zod.
- **👥 Halaman "About Us" Interaktif (`/about`):**
  - **Visi & Misi UTY Creative Hub:** Narasi strategis arah pengembangan inovasi kampus.
  - **Statistik Ekosistem:** Metrik pencapaian (500+ mahasiswa aktif, 50+ event/tahun, 8 ruang kreatif, 15+ mitra industri).
  - **Showcase Mentor & Dosen:** Profil pembina strategis dan pengarah program (Wakil Rektor IV & Mentor).
  - **Carousel Tim Kreatif:** Slider responsif dengan navigasi swipe/touch dan auto-play untuk seluruh divisi tim mahasiswa.
  - **Video Dokumentasi Profil:** Video player terintegrasi dengan kustomisasi volume slider, scrubber bar, fullscreen, dan fallback streaming Google Drive.
  - **Tiga Pilar Keunggulan:** Kreativitas & Desain, Inovasi Terapan & Startup, serta Teknologi Masa Depan & FastLab Academy.
- **📰 Artikel & Wawasan Inovasi (`/articles`):** Publikasi artikel PKM, riset terapan, panduan paten HKI, dan teknologi hardware.
- **🏛️ Fasilitas & Ruang Kreatif (`/rooms`):** Informasi Co-Working Space, Podcast Studio, Meeting Room, dan Prototyping Lab.
- **📅 Manajemen Event & Program:** Jadwal workshop, pitching bootcamp, dan seminar teknologi mahasiswa.
- **📱 Responsif & Mobile-First:** Optimal diakses di semua resolusi layar mulai dari mobile smartphone, tablet, hingga layar desktop ultrawide.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 16.2.10 (App Router) | React Server Components & Turbopack |
| **Library UI** | React 19.2.4 | Modern rendering & concurrency hooks |
| **Styling** | Tailwind CSS v4 + tw-animate-css | CSS utilities & animation primitives |
| **Komponen UI** | Radix UI / Shadcn UI | Accessible & unstyled UI primitives |
| **Animasi** | GSAP 3 & ScrollTrigger | Scroll parallax, morphing hero & transitions |
| **Icons** | Lucide React | Modern feather-style iconography |
| **Formatting & Lint** | Biome v2 | Linter & formatter super cepat (<150ms) |
| **Runtime & PM** | Node.js v22 / Bun v1.3 / npm v10 | Package manager & runtime |
| **Process Manager** | PM2 | Background service runner di server VPS |
| **Web Server** | Nginx Reverse Proxy | SSL handling & proxy forward ke Next.js |

---

## 📂 Struktur Direktori Proyek

```text
kreanovasi-uty/
├── public/
│   ├── images/              # Aset statis tekstur, pattern SVG, dan ilustrasi portofolio
│   ├── mentor/              # Foto resmi mentor & pembina UTY Creative Hub
│   ├── team/                # Foto anggota tim mahasiswa UTY Creative Hub
│   └── videos/              # Video profil institusional (uch-profile.mp4)
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── about/       # Halaman Tentang Kami (/about)
│   │   │   ├── layout.tsx   # Marketing shared layout (Navbar & Footer)
│   │   │   └── page.tsx     # Homepage landing page (/)
│   │   ├── globals.css      # Design token variables & global CSS
│   │   ├── layout.tsx       # Root document layout
│   │   ├── robots.ts        # Dynamic crawler directives
│   │   └── sitemap.ts       # XML sitemap generator
│   ├── components/
│   │   ├── about/           # Komponen modular halaman About Us
│   │   │   ├── about-cta.tsx
│   │   │   ├── about-hero-banner.tsx
│   │   │   ├── about-page-section.tsx
│   │   │   ├── about-pillars.tsx
│   │   │   ├── about-stats.tsx
│   │   │   ├── about-story.tsx
│   │   │   ├── about-team.tsx       # Mentors & Team carousel slider
│   │   │   ├── about-video.tsx      # Video player component
│   │   │   └── about-vision-mission.tsx
│   │   ├── articles/        # Grid dan kartu artikel
│   │   ├── events/          # Grid dan kartu jadwal kegiatan
│   │   ├── footer/          # Global footer & social links
│   │   ├── hero/            # Landing page hero & morph vector
│   │   ├── navbar/          # Header menu & mobile drawer
│   │   ├── rooms/           # Ruang kreatif & studio showcase
│   │   └── ui/              # Shadcn UI primitives (Button, Card, Dialog, dll)
│   ├── config/              # Centralized configuration & content data
│   │   ├── about.ts         # Konten About Us, team, mentors, & video
│   │   ├── articles.ts      # Data artikel & wawasan
│   │   ├── events.ts        # Data program & agenda
│   │   ├── rooms.ts         # Data ruang kreatif & fasilitas
│   │   └── site.ts          # Metadata, SEO tags, dan navigasi situs
│   ├── hooks/               # Custom reusable React hooks
│   │   ├── use-hero-morph.ts
│   │   └── use-video-player.ts
│   └── lib/                 # Utility helpers (cn, api-client, env schema)
├── next.config.ts           # Konfigurasi Next.js (remotePatterns, rewrites)
├── package.json             # Dependensi dan script project
└── tsconfig.json            # Konfigurasi TypeScript
```

---

## 🚀 Panduan Instalasi Lokal

### 1. Prasyarat Sistem
- **Node.js**: Versi 20.9.0 atau 22.x LTS (disarankan Node.js 22+)
- **Package Manager**: npm, pnpm, atau Bun

### 2. Clone Repository
```bash
git clone https://github.com/akhmadzaqiriyadi/kreanovasi-uty.git
cd kreanovasi-uty
```

### 3. Instalasi Dependensi
```bash
# Menggunakan npm
npm install

# Atau menggunakan Bun
bun install
```

### 4. Menjalankan Server Development
```bash
npm run dev
# atau: bun dev
```
Akses aplikasi melalui browser di **`http://localhost:3000`**.

### 5. Build Produksi Lokal
```bash
npm run build
npm run start
```

---

## 🚢 Panduan Deployment Produksi (VPS / Server)

Aplikasi ini dideploy pada server Ubuntu menggunakan **PM2** sebagai process manager dan **Nginx** sebagai reverse proxy.

### 1. Setup Awal di Server
```bash
# Clone ke direktori server
git clone https://github.com/akhmadzaqiriyadi/kreanovasi-uty.git /home/vps/uchwebapp/uch-creative-hub-frontend
cd /home/vps/uchwebapp/uch-creative-hub-frontend

# Install dependensi dan build
npm ci
npm run build
```

### 2. Konfigurasi PM2
Jalankan service Next.js pada port yang ditentukan (default port `3002`):
```bash
# Menjalankan Next.js via PM2
pm2 start npm --name "uch-frontend" -- start -- -p 3002

# Simpan konfigurasi PM2 agar auto-start saat VPS restart
pm2 save
```

### 3. Update & Redeploy Cepat
Untuk melakukan update versi terbaru dari GitHub:
```bash
cd /home/vps/uchwebapp/uch-creative-hub-frontend
git pull origin main
npm run build
pm2 reload uch-frontend
```

---

## 🔒 Konfigurasi Keamanan & Aset Gambar

Domain eksternal untuk gambar dikonfigurasi pada file [`next.config.ts`](file:///Users/zaq/uchapps/uchwebapp/next.config.ts):
```typescript
images: {
  remotePatterns: [
    { protocol: "http", hostname: "localhost" },
    { protocol: "https", hostname: "kreanovasi.uty.ac.id" },
    { protocol: "https", hostname: "uch.uty.ac.id" },
    { protocol: "https", hostname: "drive.google.com" },
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
}
```

---

## 👥 Kontributor & Pengembang

Platform ini dikembangkan dan dikelola oleh tim **UTY Creative Hub** bersama mahasiswa berprestasi **Universitas Teknologi Yogyakarta**:
* **Pembina / Mentor:** MS Hendriyawan A, S.T., M.Eng., Ph.D. & Puji Utomo, S.T., M.Eng.
* **Lead Developer & Video Editor:** Akhmad Zaqi Riyadi ([@akhmadzaqiriyadi](https://github.com/akhmadzaqiriyadi))
* **Creative Event & Content Team:** Tim Kreatif Mahasiswa UTY

---

## 📄 Lisensi

Hak Cipta © 2026 **Universitas Teknologi Yogyakarta (UTY)**.  
Didistribusikan di bawah lisensi [MIT License](LICENSE).
