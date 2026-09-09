import Link from "next/link";
import type React from "react";

interface FooterBottomProps {
  bottomBarRef?: React.Ref<HTMLDivElement>;
}

export function FooterBottom({ bottomBarRef }: FooterBottomProps) {
  return (
    <div
      ref={bottomBarRef}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground"
    >
      <p>© {new Date().getFullYear()} UTY Creative Hub. All rights reserved.</p>
      <div className="flex items-center gap-6">
        <Link
          href="/privacy-policy"
          className="hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms-of-service"
          className="hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>
        <Link href="/sitemap" className="hover:text-primary transition-colors">
          Sitemap
        </Link>
      </div>
    </div>
  );
}
