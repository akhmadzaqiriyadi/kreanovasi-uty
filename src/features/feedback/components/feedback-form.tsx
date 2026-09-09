"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFeedbackFormLogic } from "../hooks";

export function FeedbackForm() {
  // Consume form validation and submit states from extracted logic layer
  const { register, handleSubmit, errors, isPending, isSuccess, successData } =
    useFeedbackFormLogic();

  return (
    <Card className="glass-card border-border/40 overflow-hidden relative group">
      {/* Visual Accent Layer */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              Submit Feedback
            </CardTitle>
            <CardDescription className="text-xs">
              Validate and post messages to our mock data layer
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
          >
            Safe inputs
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h3 className="font-bold text-lg text-foreground">Message Sent!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {successData?.message ||
                "Thank you for testing. Your message has been processed successfully."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className={`bg-background/50 ${errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@domain.com"
                  className={`bg-background/50 ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-sm">
                Message (Optional)
              </Label>
              <textarea
                id="message"
                placeholder="Write something cool..."
                className={`flex min-h-[80px] w-full rounded-md border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.message
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "border-input"
                }`}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs font-medium text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-primary hover:opacity-90 text-primary-foreground gap-2"
            >
              {isPending ? (
                <>
                  Submitting <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
