"use client";

import gsap from "gsap";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const primaryImageRef = useRef<HTMLImageElement>(null);
  const altImageRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Artistic Morph Painting Hover Handlers with GSAP
  const handleMouseEnter = () => {
    if (!primaryImageRef.current || !altImageRef.current) return;

    // Cross-fade out primary with gentle artistic dissolve & brush scale
    gsap.to(primaryImageRef.current, {
      opacity: 0,
      scale: 0.97,
      filter: "blur(4px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    // Cross-fade in alternate entity illustration with reveal
    gsap.fromTo(
      altImageRef.current,
      { opacity: 0, scale: 1.04, filter: "blur(5px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power2.inOut",
        overwrite: "auto",
      },
    );

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.95,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!primaryImageRef.current || !altImageRef.current) return;

    // Revert back to primary character smoothly
    gsap.to(primaryImageRef.current, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    gsap.to(altImageRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: "blur(5px)",
      duration: 0.65,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        scale: 1,
        opacity: 0.8,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
        );
      }

      if (titleRef.current?.children) {
        tl.fromTo(
          Array.from(titleRef.current.children),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            clearProps: "opacity,transform",
          },
          "-=0.4",
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
          "-=0.4",
        );
      }

      if (actionsRef.current?.children) {
        tl.fromTo(
          Array.from(actionsRef.current.children),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            clearProps: "opacity,transform",
          },
          "-=0.4",
        );
      }

      if (highlightsRef.current?.children) {
        tl.fromTo(
          Array.from(highlightsRef.current.children),
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            clearProps: "opacity,transform",
          },
          "-=0.3",
        );
      }

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "opacity,transform,scale",
          },
          "-=0.7",
        );
      }

      // Subtle continuous floating effect for hero illustration
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -8,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full flex items-center pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden"
    >
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
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-secondary/15 dark:bg-secondary/20 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Clean Running Ticker Tagline Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-xs w-full max-w-[320px] sm:max-w-md md:max-w-lg overflow-hidden select-none"
            >
              <div className="flex items-center gap-1.5 shrink-0 bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                </span>
                <span className="text-[11px] uppercase tracking-wider font-bold text-primary">
                  UCH
                </span>
              </div>

              <div className="overflow-hidden whitespace-nowrap flex-1">
                <div className="animate-marquee gap-6 font-medium text-xs sm:text-sm text-primary">
                  <span className="flex items-center gap-6 shrink-0">
                    <span>Innovate. Collaborate. Create.</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>Pusat Kreativitas & Inovasi UTY</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>Empower Ideas</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>FastLab & Incubation</span>
                    <span className="text-secondary font-bold">•</span>
                  </span>
                  <span
                    className="flex items-center gap-6 shrink-0"
                    aria-hidden="true"
                  >
                    <span>Innovate. Collaborate. Create.</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>Pusat Kreativitas & Inovasi UTY</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>Empower Ideas</span>
                    <span className="text-secondary font-bold">•</span>
                    <span>FastLab & Incubation</span>
                    <span className="text-secondary font-bold">•</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Display Title */}
            <div ref={titleRef} className="space-y-1">
              <div className="text-5xl sm:text-7xl font-black tracking-tight text-primary leading-none">
                UCH
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                UTY <span className="text-secondary">Creative Hub</span>
              </h1>
            </div>

            {/* Description */}
            <p
              ref={descRef}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Pusat kreativitas dan inovasi resmi Universitas Teknologi
              Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan
              ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </p>

            {/* Action Buttons */}
            <div
              ref={actionsRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link
                href="/programs"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2 group",
                )}
              >
                <span>Jelajahi Program</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/schedule"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-6 border-2 border-primary/30 text-primary hover:bg-accent hover:border-secondary font-semibold rounded-xl transition-colors",
                )}
              >
                <span>Cek Jadwal</span>
              </Link>

              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2",
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            </div>

            {/* Highlights Bar */}
            <div
              ref={highlightsRef}
              className="pt-6 border-t border-border/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left"
            >
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

          {/* Right Column: Interactive Morphing Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div
              ref={imageRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[440px] lg:max-w-[480px] flex justify-center cursor-pointer group select-none"
            >
              {/* Soft Golden Accent Glow */}
              <div
                ref={glowRef}
                className="absolute inset-6 bg-secondary/20 dark:bg-secondary/25 rounded-3xl blur-2xl opacity-80 pointer-events-none transition-transform duration-700"
              />

              <div className="relative w-full max-h-[520px] rounded-2xl overflow-hidden p-1 z-10 flex items-center justify-center">
                {/* Primary Entity Illustration */}
                <Image
                  ref={primaryImageRef}
                  src="/images/hero.webp"
                  alt="UTY Creative Hub Innovation"
                  width={1024}
                  height={1536}
                  className="w-full max-h-[520px] object-contain drop-shadow-xl will-change-[opacity,transform,filter]"
                  priority
                />

                {/* Alternate Morph Entity Illustration */}
                <Image
                  ref={altImageRef}
                  src="/images/hero-alt-v2.webp"
                  alt="UTY Creative Hub Innovation Alternate Entity"
                  width={1024}
                  height={1536}
                  className="w-full max-h-[520px] object-contain drop-shadow-xl absolute inset-0 m-auto opacity-0 will-change-[opacity,transform,filter]"
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
