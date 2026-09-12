import { z } from "zod";

export const bookingFormSchema = z
  .object({
    role: z.enum(["mahasiswa", "dosen", "umum"]),
    room: z.string().min(1, "Silakan pilih ruangan yang ingin dipesan"),
    name: z.string().min(3, "Nama penanggung jawab minimal 3 karakter"),
    npm: z
      .string()
      .min(6, "Nomor identitas (NPM/NIDN/NIK) minimal 6 digit")
      .regex(/^[0-9]+$/, "Nomor identitas hanya boleh berisi angka"),
    prodi: z.string().min(3, "Program studi wajib diisi"),
    purpose: z
      .string()
      .min(10, "Deskripsi tujuan kegiatan minimal 10 karakter")
      .max(500, "Deskripsi tujuan kegiatan maksimal 500 karakter"),
    audience: z
      .number({ message: "Jumlah peserta harus berupa angka" })
      .min(1, "Jumlah peserta minimal 1 orang")
      .max(100, "Jumlah peserta melebihi batas kapasitas maksimal"),
    date: z.string().min(1, "Tanggal pemesanan wajib dipilih"),
    startTime: z.string().min(1, "Jam mulai kegiatan wajib dipilih"),
    endTime: z.string().min(1, "Jam selesai kegiatan wajib dipilih"),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "Jam selesai harus setelah jam mulai",
      path: ["endTime"],
    },
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
