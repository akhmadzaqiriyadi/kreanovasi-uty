import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://uchwebapp.local"),
});

// Safe parse variables on startup
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables configuration:",
    parsed.error.format(),
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
