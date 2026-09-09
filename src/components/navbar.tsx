"use client";

import gsap from "gsap";
import { Calendar, ChevronDown, ExternalLink, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, programItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Check if current path matches
  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Check if Program menu is active
  const isProgramActive = () => {
    return pathname === "/fastlab" || pathname.startsWith("/programs");
  };

  // 120fps Scroll listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 25);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            <Link
              ref={logoRef}
              href="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
            >
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={44}
                height={44}
                className={cn(
                  "object-contain shrink-0 transition-[height,width] duration-300 ease-out",
                  scrolled ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11",
                )}
                priority
              />
              <div className="flex flex-col text-left font-bold text-xs leading-tight tracking-tight text-primary select-none">
                <div>UTY</div>
                <div>CREATIVE</div>
                <div>HUB</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              ref={navLinksRef}
              className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3"
            >
              {navItems.map((item) => {
                const active = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative text-sm font-semibold whitespace-nowrap transition-all duration-200 py-1.5 px-3 rounded-full text-primary",
                      active
                        ? "text-primary font-bold bg-primary/10"
                        : "text-primary/85 hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    {item.label}
                    {active && !scrolled && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              {/* Program Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative text-sm font-semibold whitespace-nowrap flex items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-200 cursor-pointer text-primary",
                      isProgramActive()
                        ? "text-primary font-bold bg-primary/10"
                        : "text-primary/85 hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    <span>Program</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    {isProgramActive() && !scrolled && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-64 glass-panel border-border/50 p-1.5 space-y-1"
                >
                  {programItems.map((item) => {
                    if (item.disabled) {
                      return (
                        <DropdownMenuItem
                          key={item.label}
                          disabled
                          className="text-xs text-muted-foreground/60 cursor-not-allowed px-3 py-2"
                        >
                          {item.label}
                        </DropdownMenuItem>
                      );
                    }

                    return (
                      <DropdownMenuItem asChild key={item.label}>
                        <Link
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={
                            item.external ? "noopener noreferrer" : undefined
                          }
                          className="flex items-center justify-between w-full px-3 py-2 text-xs md:text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                          <span>{item.label}</span>
                          {item.external && (
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Desktop Right Action Buttons */}
            <div
              ref={actionsRef}
              className="hidden md:flex items-center gap-2 lg:gap-2.5"
            >
              <ThemeToggle className="h-9 w-9 rounded-full" />

              {/* Cek Jadwal Button */}
              <Link
                href="/schedule"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-primary/40 text-primary hover:bg-primary/10 font-semibold rounded-full whitespace-nowrap transition-all duration-300 h-9 px-4 text-xs sm:text-sm",
                )}
              >
                Cek Jadwal
              </Link>

              {/* Book Now Button */}
              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs rounded-full whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 h-9 px-4 text-xs sm:text-sm",
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            </div>

            {/* Mobile Right Bar: Theme Toggle + Drawer Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle className="h-9 w-9 rounded-xl" />

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-input bg-background/50 hover:bg-accent backdrop-blur-sm rounded-xl"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Buka menu navigasi</span>
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="glass-panel border-l-border/50 w-[290px] sm:w-[350px] p-0 flex flex-col justify-between"
                >
                  <div>
                    <SheetHeader className="text-left border-b border-border/40 p-4">
                      <SheetTitle className="flex items-center gap-2.5">
                        <Image
                          src="/images/uch.png"
                          alt="UTY Creative Hub Logo"
                          width={36}
                          height={36}
                          className="h-9 w-9 object-contain shrink-0"
                        />
                        <div className="flex flex-col text-left font-bold text-xs leading-tight text-primary">
                          <div>UTY</div>
                          <div>CREATIVE</div>
                          <div>HUB</div>
                        </div>
                      </SheetTitle>
                    </SheetHeader>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100vh-220px)]">
                      {navItems.map((item) => {
                        const active = isActivePath(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors text-primary",
                              active
                                ? "bg-primary/15 text-primary font-bold border-l-4 border-primary"
                                : "text-primary/85 hover:text-primary hover:bg-primary/10",
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      })}

                      {/* Mobile Program Accordion */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileProgramOpen(!mobileProgramOpen)
                          }
                          className={cn(
                            "w-full flex items-center justify-between text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-primary",
                            isProgramActive()
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-primary/85 hover:text-primary hover:bg-primary/10",
                          )}
                        >
                          <span>Program</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              mobileProgramOpen ? "rotate-180" : "",
                            )}
                          />
                        </button>

                        {mobileProgramOpen && (
                          <div className="pl-4 pr-1 py-2 space-y-1.5 border-l border-border/50 ml-3 mt-1">
                            {programItems.map((item) => {
                              if (item.disabled) {
                                return (
                                  <div
                                    key={item.label}
                                    className="text-xs text-muted-foreground/60 py-1.5 px-2"
                                  >
                                    {item.label}
                                  </div>
                                );
                              }

                              return (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  target={item.external ? "_blank" : undefined}
                                  rel={
                                    item.external
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  onClick={() => setOpen(false)}
                                  className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-accent/40 transition-colors"
                                >
                                  <span>{item.label}</span>
                                  {item.external && (
                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </nav>
                  </div>

                  {/* Mobile Drawer Bottom Actions */}
                  <div className="p-4 border-t border-border/40 space-y-2 bg-background/40">
                    <Link
                      href="/schedule"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-semibold",
                      )}
                    >
                      Cek Jadwal
                    </Link>
                    <Link
                      href="/booking"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ size: "default" }),
                        "w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-md",
                      )}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Book Now</span>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
