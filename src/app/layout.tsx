import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { Toaster } from "@/components/ui/sonner";
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
    process.env.NEXT_PUBLIC_SITE_URL || "https://uch.uty.ac.id",
  ),
  title: {
    default: "UTY Creative Hub - Inovasi, Kolaborasi & Kreativitas",
    template: "%s | UTY Creative Hub",
  },
  description:
    "Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.",
  keywords: [
    "UTY Creative Hub",
    "Universitas Teknologi Yogyakarta",
    "Inovasi",
    "Kreativitas",
    "Startup Incubation",
    "Fastlab",
    "Co-working Space",
  ],
  authors: [{ name: "UTY Creative Hub Team" }],
  creator: "Universitas Teknologi Yogyakarta",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://uch.uty.ac.id",
    siteName: "UTY Creative Hub",
    title: "UTY Creative Hub - Inovasi, Kolaborasi & Kreativitas",
    description:
      "Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UTY Creative Hub - Inovasi, Kolaborasi & Kreativitas",
    description:
      "Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta.",
    creator: "@utycreativehub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground font-sans relative overflow-x-hidden"
        suppressHydrationWarning
      >
        {/* Background ambient texture & subtle lights */}
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
            <GlobalLoadingBar />
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
