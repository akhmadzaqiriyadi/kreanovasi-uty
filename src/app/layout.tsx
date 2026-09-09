import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://uchwebapp.local",
  ),
  title: {
    default: "UCH Web App - Next.js 16 & Bun",
    template: "%s | UCH Web App",
  },
  description:
    "UCH Web App - Modern web application built with Next.js 16, Bun, Tailwind CSS v4, and shadcn/ui.",
  keywords: [
    "uchwebapp",
    "next.js 16",
    "bun",
    "tailwind css v4",
    "shadcn ui",
    "react 19",
  ],
  authors: [{ name: "UCH Team" }],
  creator: "UCH Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uchwebapp.local",
    siteName: "UCH Web App",
    title: "UCH Web App - Next.js 16 & Bun",
    description:
      "Modern web application built with Next.js 16, Bun, Tailwind CSS v4, and shadcn/ui.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UCH Web App - Next.js 16 & Bun",
    description:
      "Modern web application built with Next.js 16, Bun, Tailwind CSS v4, and shadcn/ui.",
    creator: "@uchwebapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground font-sans relative overflow-x-hidden"
        suppressHydrationWarning
      >
        {/* Background glow effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
          <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[80px] sm:blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-secondary/5 dark:bg-secondary/10 blur-[80px] sm:blur-[120px] animate-pulse-slow" />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <GlobalLoadingBar />
              {children}
              <Toaster position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
