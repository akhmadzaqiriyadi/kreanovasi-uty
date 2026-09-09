import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  scrolled?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
  onClick?: () => void;
}

export function BrandLogo({ scrolled = false, ref, onClick }: BrandLogoProps) {
  return (
    <Link
      ref={ref}
      href="/"
      onClick={onClick}
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
  );
}
