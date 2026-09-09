import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { submitFeedbackAction } from "../actions";
import type { FeedbackRequest, FeedbackResponse } from "../types";

/**
 * Custom hook to submit feedback using TanStack Query useMutation calling a Next.js Server Action
 */
export function useSubmitFeedback(
  options?: Omit<
    UseMutationOptions<FeedbackResponse, Error, FeedbackRequest>,
    "mutationFn"
  >,
) {
  return useMutation<FeedbackResponse, Error, FeedbackRequest>({
    mutationFn: (data) => submitFeedbackAction(data),
    ...options,
  });
}
