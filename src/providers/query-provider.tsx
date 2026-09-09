"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Prevent QueryClient from re-instantiating across render cycles
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes stale time
            gcTime: 10 * 60 * 1000, // 10 minutes cache garbage collection time
            refetchOnWindowFocus: false, // Prevent aggressive focus refetches
            retry: 1, // Single retry on failure
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
