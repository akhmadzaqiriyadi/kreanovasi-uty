# 🤖 AI Prompt Templates — NextBoi Starter Kit

Kumpulan template prompt siap pakai untuk memulai sesi ngoding bareng AI.
Gunakan salah satu template di bawah sesuai kebutuhan sesi kamu.

---

## 🚀 Template 1: Sesi Standar (Paling Sering Dipakai)

Gunakan ini untuk memulai hampir semua sesi ngoding biasa.

```
Halo! Kita akan ngoding di project NextBoi Starter Kit.

Sebelum mulai, tolong baca dan pahami file-file berikut:
- AGENTS.md — coding rules dan konvensi project
- docs/architecture.md — struktur arsitektur project
- docs/coding-standards.md — standar penulisan kode

Setelah membaca, konfirmasi bahwa kamu sudah paham rules-nya,
lalu kita mulai task berikut:

[TULIS TASK KAMU DI SINI]
```

---

## ⚡ Template 2: Quick Task (Task Kecil & Cepat)

Untuk task ringan seperti bugfix, tweak UI, atau update teks.

```
Project: NextBoi Starter Kit (Next.js 16, Bun, Tailwind v4, Biome)
Rules: AGENTS.md aktif.

Task: [TULIS TASK KAMU DI SINI]

Setelah selesai, jalankan `bun run check` dan `bun run build`.
```

---

## 🏗️ Template 3: Fitur Baru (Feature Development)

Untuk membangun fitur baru dari nol di dalam `src/features/`.

```
Halo! Kita akan membuat fitur baru di NextBoi Starter Kit.

Baca dulu:
- AGENTS.md
- docs/architecture.md

Fitur yang ingin dibangun:
- Nama fitur : [NAMA FITUR]
- Deskripsi  : [DESKRIPSI SINGKAT APA YANG DILAKUKAN FITUR INI]
- Lokasi     : src/features/[nama-fitur]/

Ikuti struktur modular yang sudah ada:
  components/ → UI components
  hooks/      → custom hooks (useXxxLogic)
  schemas/    → Zod validation schemas
  services/   → API request functions
  types/      → TypeScript interfaces
  index.ts    → central exporter

Gunakan Server Actions untuk mutations, bukan API route handler.
Pisahkan logic ke dalam hooks, jangan taruh useState di UI component.

Setelah selesai:
1. `bun run check`
2. `bun run build`
3. `bun run test:e2e`
```

---

## 🐛 Template 4: Debugging & Fix

Untuk melaporkan bug atau error dan minta AI menyelesaikannya.

```
Project: NextBoi Starter Kit

Ada bug yang perlu diselesaikan. Berikut detailnya:

- File yang bermasalah : [PATH FILE]
- Error message        : [PASTE ERROR DI SINI]
- Expected behavior    : [APA YANG SEHARUSNYA TERJADI]
- Actual behavior      : [APA YANG TERJADI SEKARANG]

Tolong fix sesuai rules di AGENTS.md.
Setelah fix, jalankan `bun run check` dan `bun run build`.
```

---

## 🎨 Template 5: UI & Styling

Khusus untuk pekerjaan yang menyangkut tampilan, layout, dan komponen UI.

```
Project: NextBoi Starter Kit (Tailwind CSS v4, Base UI, Glassmorphism)

Task UI yang perlu dikerjakan:
[DESKRIPSI PERUBAHAN UI]

Ingat rules styling:
- Gunakan oklch() untuk warna di globals.css
- Gunakan class glass-panel / glass-card untuk frosted glass
- Jangan campur ring-* dan border-* di container yang sama
- Minimalisir wrapper div yang tidak perlu
- Gunakan flex/grid gap untuk spacing, bukan margin manual

Setelah selesai jalankan `bun run check`.
```

---

## 📝 Template 6: Update Dokumentasi

Untuk memperbarui atau menambah dokumentasi project.

```
Project: NextBoi Starter Kit

Tolong update dokumentasi berikut:
- File target : [docs/nama-file.md atau README.md]
- Perubahan   : [DESKRIPSI APA YANG PERLU DIUPDATE]

Pastikan konsisten dengan gaya penulisan docs yang sudah ada.
Setelah selesai, commit dengan pesan: "docs: [deskripsi singkat]"
```

---

## ✅ Checklist Wajib Sebelum Commit

Selalu sertakan ini di akhir prompt kalau kamu mau AI ikut verifikasi:

```
Sebelum selesai, pastikan:
- [ ] `bun run check` → 0 warnings
- [ ] `bun run build` → compiled successfully
- [ ] `bun run test:e2e` → semua tests passed
- [ ] Tidak ada penggunaan `any` di TypeScript
- [ ] Tidak ada `useMemo` / `useCallback` manual (React Compiler handles it)
- [ ] Logic sudah dipisah ke custom hook jika ada useState / useForm
```

---

> **Tip**: Simpan template yang paling sering kamu pakai sebagai snippet
> di VS Code / Cursor dengan shortcut key agar langsung bisa dipaste! 🚀
