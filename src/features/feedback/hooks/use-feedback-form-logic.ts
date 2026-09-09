"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { feedbackSchema } from "../schemas";
import type { FeedbackRequest } from "../types";
import { useSubmitFeedback } from "./use-submit-feedback";

/**
 * Custom hook encapsulating the logic for the feedback form.
 * Handles Zod form validation, Server Action mutation submission, and notification toasts.
 */
export function useFeedbackFormLogic() {
  // Setup React Hook Form with Zod validation resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackRequest>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Custom Mutation hook calling Server Action
  const submitFeedbackMutation = useSubmitFeedback({
    onSuccess: (data) => {
      toast.success("Feedback submitted successfully!", {
        description: data.message,
      });
      reset(); // Reset form states automatically
      setTimeout(() => {
        submitFeedbackMutation.reset();
      }, 3000);
    },
    onError: (error) => {
      toast.error("Form submission failed!", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: FeedbackRequest) => {
    submitFeedbackMutation.mutate(data);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isPending: submitFeedbackMutation.isPending,
    isSuccess: submitFeedbackMutation.isSuccess,
    successData: submitFeedbackMutation.data,
  };
}
