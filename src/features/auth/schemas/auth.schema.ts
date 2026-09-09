import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Password minimal harus 6 karakter" })
    .trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nama minimal harus 2 karakter" })
      .max(50)
      .trim(),
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" })
      .trim(),
    password: z
      .string()
      .min(6, { message: "Password minimal harus 6 karakter" })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Konfirmasi password wajib diisi" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password konfirmasi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
