"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleBackButtonProps {
  className?: string;
  label?: string;
}

export function ArticleBackButton({
  className,
  label = "Kembali ke Semua Artikel",
}: ArticleBackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold bg-background hover:bg-muted text-foreground border-border/80 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer",
        className,
      )}
    >
      <Link href="/articles" onClick={handleClick}>
        <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}
