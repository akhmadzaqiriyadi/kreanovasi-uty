"use client";

import { Calendar, ChevronDown, ExternalLink, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Check if current path matches
  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Check if Program menu is active
  const isProgramActive = () => {
    return pathname === "/fastlab" || pathname.startsWith("/programs");
  };

  // Scroll listener for floating navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      <header
        className={cn(
          "transition-all duration-300 pointer-events-auto",
          scrolled
            ? "bg-background/90 dark:bg-background/90 backdrop-blur-xl border border-border/70 mx-3 sm:mx-6 md:mx-auto max-w-5xl lg:max-w-6xl mt-2 rounded-full shadow-md py-0.5 px-3 sm:px-4"
            : "bg-background/95 border-b border-border/40 shadow-xs py-0",
        )}
      >
        <div
          className={cn(
            "container mx-auto flex items-center justify-between transition-all duration-300",
            scrolled
              ? "h-11 sm:h-12 px-1 sm:px-2"
              : "h-20 px-4 sm:px-6 lg:px-8 max-w-7xl",
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            <div
              className={cn(
                "relative shrink-0 transition-all duration-300",
                scrolled
                  ? "h-7 w-7 sm:h-8 sm:w-8"
                  : "h-10 w-10 sm:h-11 sm:w-11",
              )}
            >
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div
              className={cn(
                "flex flex-col text-left font-bold tracking-tight text-primary select-none transition-all duration-300",
                scrolled
                  ? "text-[10px] leading-[11px]"
                  : "text-xs leading-tight",
              )}
            >
              <div>UTY</div>
              <div>CREATIVE</div>
              <div>HUB</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              scrolled
                ? "space-x-0.5 lg:space-x-1"
                : "space-x-1 lg:space-x-2 xl:space-x-4",
            )}
          >
            {navItems.map((item) => {
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative font-semibold whitespace-nowrap transition-all duration-200 text-primary",
                    scrolled
                      ? "text-xs md:text-sm py-1 px-2 lg:px-2.5 rounded-full"
                      : "text-xs md:text-sm lg:text-base py-1.5 px-2.5 lg:px-3 rounded-lg",
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
                    "relative font-semibold whitespace-nowrap flex items-center gap-1 transition-all duration-200 cursor-pointer text-primary",
                    scrolled
                      ? "text-xs md:text-sm py-1 px-2 lg:px-2.5 rounded-full"
                      : "text-xs md:text-sm lg:text-base py-1.5 px-2.5 lg:px-3 rounded-lg",
                    isProgramActive()
                      ? "text-primary font-bold bg-primary/10"
                      : "text-primary/85 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  <span>Program</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
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
                        rel={item.external ? "noopener noreferrer" : undefined}
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
            className={cn(
              "hidden md:flex items-center transition-all duration-300",
              scrolled ? "gap-1.5" : "gap-2 lg:gap-3",
            )}
          >
            <ThemeToggle
              className={
                scrolled ? "h-8 w-8 rounded-full" : "h-9 w-9 rounded-xl"
              }
            />

            {/* Cek Jadwal Button */}
            <Link
              href="/schedule"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-primary/40 text-primary hover:bg-primary/10 font-medium whitespace-nowrap transition-all duration-200",
                scrolled
                  ? "h-8 px-3 text-xs rounded-full"
                  : "h-10 px-4 text-sm rounded-xl",
              )}
            >
              Cek Jadwal
            </Link>

            {/* Book Now Button */}
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5",
                scrolled
                  ? "h-8 px-3 text-xs rounded-full"
                  : "h-10 px-4 text-sm rounded-xl",
              )}
            >
              <Calendar className={scrolled ? "h-3.5 w-3.5" : "h-4 w-4"} />
              <span>Book Now</span>
            </Link>
          </div>

          {/* Mobile Right Bar: Theme Toggle + Drawer Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
            <ThemeToggle
              className={
                scrolled ? "h-8 w-8 rounded-full" : "h-9 w-9 rounded-xl"
              }
            />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "border border-input bg-background/50 hover:bg-accent backdrop-blur-sm transition-all duration-200",
                    scrolled ? "h-8 w-8 rounded-full" : "h-9 w-9 rounded-xl",
                  )}
                >
                  <Menu className={scrolled ? "h-4 w-4" : "h-5 w-5"} />
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
                      <div className="relative h-9 w-9 shrink-0">
                        <Image
                          src="/images/uch.png"
                          alt="UTY Creative Hub Logo"
                          fill
                          sizes="36px"
                          className="object-contain"
                        />
                      </div>
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
                        onClick={() => setMobileProgramOpen(!mobileProgramOpen)}
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
                      "w-full rounded-xl border-primary/40 text-primary hover:bg-primary/10 font-medium",
                    )}
                  >
                    Cek Jadwal
                  </Link>
                  <Link
                    href="/booking"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ size: "default" }),
                      "w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-1.5 shadow-md",
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
  );
}
