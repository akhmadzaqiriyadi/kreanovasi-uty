"use client";

import { Calendar, ChevronDown, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, programItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function MobileDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false);

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isProgramActive = () => {
    return pathname === "/fastlab" || pathname.startsWith("/programs");
  };

  return (
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
              <SheetTitle asChild>
                <div className="flex items-center">
                  <BrandLogo onClick={() => setOpen(false)} />
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
                            item.external ? "noopener noreferrer" : undefined
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
  );
}
