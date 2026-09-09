"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function WelcomeCta() {
  return (
    <div className="pt-2">
      <Link
        href="/dashboard"
        className={buttonVariants({
          className: "w-full font-bold shadow-lg shadow-primary/20",
        })}
      >
        Mulai Gunakan Dashboard
      </Link>
    </div>
  );
}
