import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export function EventsCatalogHero() {
  return (
    <header
      aria-label="Header Agenda dan Event UTY Creative Hub"
      className="relative w-full pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden"
    >
      {/* Background layers matching booking & brand aesthetics */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[oklch(0.28_0.075_270)] dark:from-[oklch(0.13_0.03_266)] dark:via-[oklch(0.16_0.045_266)] dark:to-[oklch(0.10_0.02_270)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb navigasi"
          className="flex items-center gap-1.5 text-xs text-primary-foreground/60 font-medium mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary-foreground/90 transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Beranda</span>
          </Link>
          <ChevronRight
            className="h-3.5 w-3.5 text-primary-foreground/40"
            aria-hidden="true"
          />
          <span className="text-primary-foreground/90">Agenda & Events</span>
        </nav>

        {/* Header Titles matching Booking / About page pattern */}
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight tracking-tight">
              Agenda & Program
            </h1>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-secondary">Kolaboratif Mahasiswa</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/75 leading-relaxed max-w-2xl mx-auto font-medium">
            Ikuti berbagai seminar teknologi, workshop hands-on FastLab, klinik
            proposal PKM, dan demo pitching bersama mentor terbaik di UTY
            Creative Hub.
          </p>
        </div>
      </div>

      {/* Decorative Bottom Wave matching Booking hero banner */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 sm:h-12"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full fill-background"
        >
          <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </header>
  );
}
