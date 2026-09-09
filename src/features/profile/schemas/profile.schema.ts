import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Nama lengkap minimal 2 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
});

export type ProfileFormInput = z.infer<typeof profileSchema>;
