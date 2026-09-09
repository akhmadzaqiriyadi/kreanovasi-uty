import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background Texture & Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div
          className="absolute inset-0 opacity-20 dark:opacity-25 dark:invert"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-secondary/10 dark:bg-secondary/15 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>🚀 Innovate. Collaborate. Create.</span>
            </div>

            {/* Display Title */}
            <div className="space-y-1">
              <div className="text-5xl sm:text-7xl font-black tracking-tight text-primary leading-none">
                UCH
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                UTY <span className="text-secondary">Creative Hub</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Pusat kreativitas dan inovasi resmi Universitas Teknologi
              Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan
              ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/programs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group",
                )}
              >
                <span>Jelajahi Program</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/schedule"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-6 border-2 border-primary/30 text-primary hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-all duration-300",
                )}
              >
                <span>Cek Jadwal</span>
              </Link>

              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-md shadow-secondary/25 transition-all duration-300 flex items-center gap-2",
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 border-t border-border/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  100+
                </div>
                <div className="text-xs text-muted-foreground">
                  Ide & Inovasi
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  4 Lab
                </div>
                <div className="text-xs text-muted-foreground">
                  Ruang Kreatif
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-secondary">
                  Active
                </div>
                <div className="text-xs text-muted-foreground">
                  Komunitas UTY
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[480px] lg:max-w-none">
              {/* Decorative Accent Ring */}
              <div className="absolute -inset-2 bg-secondary/15 rounded-3xl blur-xl opacity-60" />

              <div className="relative rounded-2xl overflow-hidden p-2">
                <Image
                  src="/images/hero.svg"
                  alt="UTY Creative Hub Innovation"
                  width={795}
                  height={653}
                  className="w-full h-auto object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
