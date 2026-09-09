"use client";

export default function TestErrorPage() {
  if (typeof window !== "undefined") {
    throw new Error("Triggered test error boundary");
  }

  return (
    <div className="p-8 text-center text-muted-foreground text-sm">
      Loading test error page...
    </div>
  );
}
