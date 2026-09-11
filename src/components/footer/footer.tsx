"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FooterBottom } from "./footer-bottom";
import { FooterBrand } from "./footer-brand";
import { FooterContact } from "./footer-contact";
import { FooterProgramLinks, FooterQuickLinks } from "./footer-links";
import { ScrollToTop } from "./scroll-to-top";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (gridRef.current?.children) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
            },
          },
        );
      }

      if (bottomBarRef.current) {
        gsap.fromTo(
          bottomBarRef.current,
          { y: 15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.2,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
            },
          },
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-border/60 pt-12 sm:pt-16 pb-6 sm:pb-8 relative overflow-hidden"
    >
      {/* Background Texture Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.18] dark:invert pointer-events-none select-none"
        style={{
          backgroundImage: "url('/images/pattern-bg.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 sm:pb-12"
        >
          {/* Column 1: About UTY Creative Hub & Social Media */}
          <FooterBrand />

          {/* Column 2: Quick Links */}
          <FooterQuickLinks />

          {/* Column 3: Our Programs */}
          <FooterProgramLinks />

          {/* Column 4: Contact Us */}
          <FooterContact />
        </div>

        {/* Separator Line */}
        <div className="border-t border-border/70 my-4 sm:my-6" />

        {/* Bottom Bar: Copyright & Policy Links */}
        <FooterBottom bottomBarRef={bottomBarRef} />
      </div>

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </footer>
  );
}
