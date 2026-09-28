"use client";

import { FooterBottom } from "./footer-bottom";
import { FooterBrand } from "./footer-brand";
import { FooterContact } from "./footer-contact";
import { FooterProgramLinks, FooterQuickLinks } from "./footer-links";
import { ScrollToTop } from "./scroll-to-top";

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-border/60 pt-10 sm:pt-16 pb-6 sm:pb-8 relative overflow-hidden"
    >
      {/* Background Texture Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.18] dark:invert pointer-events-none select-none"
        style={{
          backgroundImage: "url('/images/pattern-bg.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 sm:pb-12">
          {/* Column 1: About UTY Creative Hub & Social Media */}
          <FooterBrand />

          {/* Column 2: Quick Links */}
          <FooterQuickLinks />

          {/* Column 3: Our Programs */}
          <FooterProgramLinks />

          {/* Column 4: Contact Us */}
          <FooterContact />
        </div>

        {/* Separator Line */}
        <div className="border-t border-border/70 my-4 sm:my-6" />

        {/* Bottom Bar: Copyright & Policy Links */}
        <FooterBottom />
      </div>

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />
    </footer>
  );
}
