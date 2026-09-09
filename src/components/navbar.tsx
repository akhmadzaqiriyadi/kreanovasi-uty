"use client";

import {
  Calendar,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
} from "lucide-react";
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
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
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
            ? "bg-background/80 dark:bg-background/85 backdrop-blur-xl border border-border/60 mx-3 sm:mx-6 md:mx-10 lg:mx-16 mt-2.5 rounded-2xl md:rounded-full shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-background/95 border-b border-border/40 shadow-xs",
        )}
      >
        <div
          className={cn(
            "container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl transition-all duration-300",
            scrolled ? "h-16" : "h-20",
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-left font-bold text-xs leading-tight tracking-tight text-primary select-none">
              <div>UTY</div>
              <div>CREATIVE</div>
              <div>HUB</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-4">
            {navItems.map((item) => {
              const active = isActivePath(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap transition-colors py-1 px-2.5 rounded-lg text-primary",
                    active
                      ? "text-primary font-bold bg-primary/10"
                      : "text-primary/85 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  {item.label}
                  {active && (
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
                    "relative text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap flex items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer text-primary",
                    isProgramActive()
                      ? "text-primary font-bold bg-primary/10"
                      : "text-primary/85 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  <span>Program</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  {isProgramActive() && (
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

            {/* Dashboard Link for Logged In Users */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={cn(
                  "relative text-xs md:text-sm lg:text-base font-medium whitespace-nowrap transition-colors py-1 px-2.5 rounded-lg",
                  pathname.startsWith("/dashboard")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <ThemeToggle />

            {/* Cek Jadwal Button */}
            <Link
              href="/schedule"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-primary/40 text-primary hover:bg-primary/10 font-medium rounded-xl text-xs md:text-sm whitespace-nowrap",
                scrolled ? "h-9 px-3.5" : "h-10 px-4",
              )}
            >
              Cek Jadwal
            </Link>

            {/* Authenticated State vs Book Now / Login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5 border border-border/50 bg-accent/40 rounded-full pl-2.5 pr-1.5 py-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-right hover:opacity-80 transition-opacity"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold border border-primary/25">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-foreground leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {user?.role}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 hover:text-destructive text-muted-foreground rounded-full transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20 hover:shadow-lg rounded-xl text-xs md:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-1.5",
                  scrolled ? "h-9 px-3.5" : "h-10 px-4",
                )}
              >
                <Calendar className="h-4 w-4" />
                <span>Book Now</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Bar: Theme Toggle + Drawer Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

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

                    {/* Mobile Dashboard Link */}
                    {isAuthenticated && (
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className={cn(
                          "text-sm font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-2",
                          pathname.startsWith("/dashboard")
                            ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                        )}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                  </nav>
                </div>

                {/* Mobile Drawer Bottom Actions */}
                <div className="p-4 border-t border-border/40 space-y-2.5 bg-background/40">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-1">
                        <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-sm font-bold">
                          <User className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setOpen(false);
                          logout();
                        }}
                        className="w-full rounded-xl flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
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
                        href="/login"
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
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
