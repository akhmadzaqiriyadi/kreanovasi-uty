import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/auth/auth-modal";
import { GlobalLoadingBar } from "@/components/global-loading-bar";
import { NotificationPermissionPrompt } from "@/components/notifications/notification-permission-prompt";
import { PwaRegister } from "@/components/pwa-register";
import { JsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { AuthProvider } from "@/context/auth-context";
import { NotificationProvider } from "@/context/notification-context";
import { RoomsProvider } from "@/context/rooms-context";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: "UTY Creative Hub",
  title: {
    default: `${siteConfig.name} - Inovasi, Kolaborasi & Kreativitas`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "UTY Creative Hub Team" }],
  creator: siteConfig.organization.name,
  publisher: siteConfig.organization.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UCH Apps",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Inovasi, Kolaborasi & Kreativitas`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Inovasi, Kolaborasi & Kreativitas`,
    description: siteConfig.description,
    creator: "@utycreativehub",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <head>
        <JsonLd />
      </head>
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
            <AuthProvider>
              <NotificationProvider>
                <RoomsProvider>
                  <PwaRegister />
                  <NotificationPermissionPrompt />
                  <GlobalLoadingBar />
                  {children}
                  <AuthModal />
                  <Toaster position="top-right" />
                </RoomsProvider>
              </NotificationProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
