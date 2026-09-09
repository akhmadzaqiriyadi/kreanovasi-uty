"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const current = resolvedTheme || theme || "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      onTouchEnd={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative h-9 w-9 rounded-full border border-primary/30 bg-background/70 hover:bg-primary/10 text-primary backdrop-blur-sm cursor-pointer shrink-0 select-none transition-all duration-200 active:scale-95 touch-manipulation z-20",
        className,
      )}
    >
      {mounted ? (
        <>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-primary pointer-events-none" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-primary pointer-events-none" />
        </>
      ) : (
        <Sun className="h-4 w-4 text-primary opacity-70 pointer-events-none" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
