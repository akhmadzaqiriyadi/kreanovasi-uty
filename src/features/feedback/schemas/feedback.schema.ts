import { z } from "zod";

// Zod schema for validating the feedback form data
export const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address format" })
    .trim(),
  message: z
    .string()
    .max(500, { message: "Message cannot exceed 500 characters" })
    .optional()
    .or(z.literal("")), // Accept empty string
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
