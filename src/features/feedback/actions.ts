"use server";

import { feedbackSchema } from "./schemas/feedback.schema";
import type { FeedbackRequest, FeedbackResponse } from "./types";

/**
 * Next.js Server Action for feedback submission
 * Validates inputs securely on the server and mocks database processing latency
 */
export async function submitFeedbackAction(
  data: FeedbackRequest,
): Promise<FeedbackResponse> {
  // Server-side Zod validation
  const result = feedbackSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Validation failed on the server side.");
  }

  const { name } = result.data;

  // Simulate network/database latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    success: true,
    id: Math.random().toString(36).substring(2, 9),
    message: `Feedback for "${name}" validated and processed securely via Server Actions!`,
    receivedAt: new Date().toISOString(),
  };
}
