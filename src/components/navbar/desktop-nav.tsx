"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems, programItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  scrolled: boolean;
  ref?: React.Ref<HTMLElement>;
}

export function DesktopNav({ scrolled, ref }: DesktopNavProps) {
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isProgramActive = () => {
    return pathname === "/fastlab" || pathname.startsWith("/programs");
  };

  return (
    <nav
      ref={ref}
      aria-label="Navigasi Utama"
      className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3"
    >
      <ul className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
        {navItems.map((item) => {
          const active = isActivePath(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold whitespace-nowrap transition-all duration-200 py-1.5 px-3 rounded-full text-primary block",
                  active
                    ? "text-primary font-bold bg-primary/10"
                    : "text-primary/85 hover:text-primary hover:bg-primary/5",
                )}
              >
                {item.label}
                {active && !scrolled && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          );
        })}

        {/* Program Dropdown Menu */}
        <li>
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
                <ChevronDown
                  className="h-4 w-4 transition-transform duration-200"
                  aria-hidden="true"
                />
                {isProgramActive() && !scrolled && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
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
                        <ExternalLink
                          className="h-3.5 w-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}
