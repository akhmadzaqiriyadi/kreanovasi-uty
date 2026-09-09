"use client";

import { LogIn, LogOut, Menu, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/config/navigation";
import { useAuth } from "@/features/auth";
import { ThemeToggle } from "./theme-toggle";

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [ids]);

  return active;
}

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(["features", "dx", "feedback"]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo & Badges */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-purple-500 text-primary-foreground shadow-md shadow-primary/20">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              UCH<span className="text-primary">WebApp</span>
            </span>
          </Link>
          <Badge
            variant="outline"
            className="border-primary/25 bg-primary/5 text-primary text-[10px] leading-[10px] px-2 font-mono rounded-full hidden xs:inline-flex"
          >
            v0.1.0
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const sectionId = item.href.replace("/#", "");
            const isActive = pathname === "/" && activeSection === sectionId;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors py-1 px-2 rounded-md ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`relative text-sm font-medium transition-colors hover:text-foreground py-1 px-2 rounded-md ${
                pathname === "/dashboard"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            // Authenticated Desktop User Section
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground">
                  {user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center gap-2 border border-border/40 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-full pl-2 pr-1 py-1">
                <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold border border-primary/25">
                  <User className="h-3 w-3" />
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1 hover:text-destructive rounded-full transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            // Unauthenticated Desktop Navigation Buttons
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className={`${buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })} flex items-center gap-1.5`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Masuk</span>
              </Link>
              <Link
                href="/#feedback"
                className={`${buttonVariants({
                  size: "sm",
                })} bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 glow-hover`}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Burger Icon and Drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 border border-input bg-background/50 hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
                />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="glass-panel border-l-border/50 w-[280px] sm:w-[350px]"
            >
              <SheetHeader className="text-left border-b border-border/40 pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2 font-bold text-xl tracking-tight">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-purple-500 text-primary-foreground">
                    <Zap className="h-5 w-5 fill-current" />
                  </div>
                  <span>
                    UCH<span className="text-primary">WebApp</span>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground py-2 px-3 rounded-lg hover:bg-accent/40 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground py-2 px-3 rounded-lg hover:bg-accent/40 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Mobile Drawer Auth Actions */}
                {isAuthenticated ? (
                  <div className="border-t border-border/40 pt-4 mt-4 space-y-4">
                    <div className="flex items-center gap-3 px-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary text-sm font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground leading-none">
                          {user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize mt-0.5">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 justify-center text-sm font-semibold py-2 px-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={`${buttonVariants({
                        variant: "outline",
                      })} justify-center`}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Masuk</span>
                    </Link>
                    <Link
                      href="/#feedback"
                      onClick={() => setOpen(false)}
                      className={`${buttonVariants({
                        size: "lg",
                      })} bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-semibold shadow-lg justify-center`}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
