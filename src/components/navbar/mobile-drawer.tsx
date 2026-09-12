"use client";

import {
  ChevronDown,
  ExternalLink,
  History,
  Menu,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { NavNotifications } from "./nav-notifications";
import { dummyUser, NavUserMenu } from "./nav-user-menu";

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
    <div className="flex items-center gap-1.5 md:hidden">
      <ThemeToggle className="h-9 w-9 rounded-full" />
      <NavNotifications />
      <NavUserMenu />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border border-input bg-background/50 hover:bg-accent backdrop-blur-sm rounded-xl ml-0.5"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka menu navigasi</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-background text-foreground border-l border-border/80 w-[290px] sm:w-[350px] p-0 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <SheetHeader className="text-left border-b border-border/50 p-4 bg-background">
              <SheetTitle asChild>
                <div className="flex items-center">
                  <BrandLogo onClick={() => setOpen(false)} />
                </div>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Navigation Links */}
            <nav
              aria-label="Navigasi Menu Mobile"
              className="p-4 overflow-y-auto max-h-[calc(100vh-220px)] bg-background"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActivePath(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors text-primary block",
                          active
                            ? "bg-primary/15 text-primary font-bold border-l-4 border-primary"
                            : "text-primary/85 hover:text-primary hover:bg-primary/10",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

                {/* Mobile Program Accordion */}
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => setMobileProgramOpen(!mobileProgramOpen)}
                    aria-expanded={mobileProgramOpen}
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
                      aria-hidden="true"
                    />
                  </button>

                  {mobileProgramOpen && (
                    <ul className="pl-4 pr-1 py-2 space-y-1.5 border-l border-border/50 ml-3 mt-1">
                      {programItems.map((item) => {
                        if (item.disabled) {
                          return (
                            <li
                              key={item.label}
                              className="text-xs text-muted-foreground/60 py-1.5 px-2"
                            >
                              {item.label}
                            </li>
                          );
                        }

                        return (
                          <li key={item.label}>
                            <Link
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
                                <ExternalLink
                                  className="h-3 w-3 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* Mobile Drawer Bottom User Section */}
          <div className="p-4 border-t border-border/50 bg-slate-50/60 dark:bg-zinc-900/60 space-y-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-border/60">
              <Avatar className="h-9 w-9 border border-primary/30 shrink-0">
                <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                  AZ
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  {dummyUser.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {dummyUser.email}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-[9px] font-bold py-0 px-1.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-none"
              >
                Mahasiswa
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <Link
                href="/my-bookings"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl border border-border bg-white dark:bg-zinc-800 font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <History className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
                <span className="text-[11px]">Riwayat</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl border border-border bg-white dark:bg-zinc-800 font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
                <span className="text-[11px]">Akun</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-xl border border-border bg-white dark:bg-zinc-800 font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-primary dark:text-blue-400" />
                <span className="text-[11px]">Setelan</span>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
