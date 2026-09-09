"use client";

import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      icon: InstagramIcon,
      href: "https://instagram.com/creativehubuty",
      label: "Instagram",
    },
    {
      icon: FacebookIcon,
      href: "https://facebook.com/utycreativehub",
      label: "Facebook",
    },
    {
      icon: TwitterIcon,
      href: "https://twitter.com/utycreativehub",
      label: "Twitter",
    },
    {
      icon: YoutubeIcon,
      href: "https://youtube.com/utycreativehub",
      label: "Youtube",
    },
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Programs" },
    { href: "/articles", label: "News" },
    { href: "/events", label: "Events" },
    { href: "https://uchbooking.vercel.app/", label: "Book Space" },
  ];

  const programLinks = [
    { href: "/programs/workshops", label: "Workshops & Training" },
    { href: "/programs/startup", label: "Startup Incubation" },
    { href: "/programs/mentorship", label: "Mentorship" },
    { href: "/programs/competition", label: "Competition" },
    { href: "/programs/community", label: "Community Events" },
  ];

  return (
    <footer className="w-full bg-slate-50 dark:bg-zinc-950 border-t border-border/60 pt-16 pb-8 relative overflow-hidden">
      {/* Background Texture Pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.18] dark:invert pointer-events-none select-none">
        <Image
          src="/images/pattern-bg.svg"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12">
          {/* Column 1: About UTY Creative Hub */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/uch.png"
                alt="UTY Creative Hub Logo"
                width={48}
                height={48}
                className="h-12 w-auto object-contain"
              />
              <div className="text-primary font-bold text-xs tracking-wider leading-tight">
                <div>UTY</div>
                <div>CREATIVE</div>
                <div>HUB</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pusat kreativitas dan inovasi resmi Universitas Teknologi
              Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan
              ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="h-9 w-9 rounded-full bg-white dark:bg-zinc-900 border border-border/80 text-primary flex items-center justify-center shadow-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center hover:translate-x-1 transition-transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Programs */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary tracking-tight">
              Our Programs
            </h3>
            <ul className="space-y-2.5 text-sm">
              {programLinks.map((program) => (
                <li key={program.label}>
                  <Link
                    href={program.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center hover:translate-x-1 transition-transform"
                  >
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-primary tracking-tight">
              Contact Us
            </h3>
            <div className="space-y-3.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Gedung G6 Lantai 3, Universitas Teknologi Yogyakarta, Jl.
                  Siliwangi, Ringroad Utara, Sleman, Yogyakarta
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+62 274 623310</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>kreanovasi@uty.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-border/70 my-6" />

        {/* Bottom Bar: Copyright & Policy Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} UTY Creative Hub. All rights reserved.
          </p>
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
            <Link
              href="/sitemap"
              className="hover:text-primary transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
