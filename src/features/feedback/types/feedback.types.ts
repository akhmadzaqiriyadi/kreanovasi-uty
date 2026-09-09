import type { z } from "zod";
import type { feedbackSchema } from "../schemas/feedback.schema";

export type FeedbackRequest = z.infer<typeof feedbackSchema>;

export interface FeedbackResponse {
  success: boolean;
  id: string;
  message: string;
  receivedAt: string;
}
