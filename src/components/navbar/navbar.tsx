"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { DesktopNav } from "./desktop-nav";
import { MobileDrawer } from "./mobile-drawer";
import { NavActions } from "./nav-actions";

export function Navbar() {
  const scrolled = useScrollThreshold(25);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLElement>(null);

  // GSAP Entrance Animation with strict-mode safe fromTo
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, clearProps: "opacity,transform" },
        );
      }

      if (navLinksRef.current?.children) {
        tl.fromTo(
          Array.from(navLinksRef.current.children),
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            clearProps: "opacity,transform",
          },
          "-=0.4",
        );
      }

      if (actionsRef.current?.children) {
        tl.fromTo(
          Array.from(actionsRef.current.children),
          { x: 15, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.5,
            clearProps: "opacity,transform",
          },
          "-=0.4",
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div
        className={cn(
          "w-full transition-[max-width,padding,margin] duration-300 ease-out pointer-events-auto",
          scrolled
            ? "max-w-7xl px-4 sm:px-6 lg:px-8 mt-3"
            : "max-w-full px-0 mt-0",
        )}
      >
        <header
          ref={headerRef}
          className={cn(
            "w-full transition-[height,background-color,border-color,border-radius,box-shadow,padding] duration-300 ease-out transform-gpu",
            scrolled
              ? "h-14 rounded-full bg-background/85 dark:bg-background/85 backdrop-blur-xl border border-border/80 shadow-md px-4 sm:px-6 flex items-center justify-between"
              : "h-20 rounded-none bg-background/95 border-b border-border/40 shadow-none px-4 sm:px-6 lg:px-8 flex items-center justify-between",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between w-full mx-auto",
              scrolled ? "" : "max-w-7xl",
            )}
          >
            {/* Brand Logo */}
            <BrandLogo ref={logoRef} scrolled={scrolled} />

            {/* Desktop Navigation */}
            <DesktopNav ref={navLinksRef} scrolled={scrolled} />

            {/* Desktop Right Action Buttons */}
            <NavActions ref={actionsRef} />

            {/* Mobile Right Bar: Theme Toggle + Drawer */}
            <MobileDrawer />
          </div>
        </header>
      </div>
    </div>
  );
}
