import Image from "next/image";
import type * as React from "react";
import { siteConfig } from "@/config/site";

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

const socialLinks = [
  {
    icon: InstagramIcon,
    href: siteConfig.socials.instagram,
    label: "Instagram",
  },
  {
    icon: FacebookIcon,
    href: siteConfig.socials.facebook,
    label: "Facebook",
  },
  {
    icon: TwitterIcon,
    href: siteConfig.socials.twitter,
    label: "Twitter",
  },
  {
    icon: YoutubeIcon,
    href: siteConfig.socials.youtube,
    label: "Youtube",
  },
];

export function FooterBrand() {
  return (
    <section
      aria-label="Tentang UTY Creative Hub"
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Image
          src="/images/uch.png"
          alt="UTY Creative Hub Logo"
          width={48}
          height={48}
          className="h-10 sm:h-12 w-auto object-contain"
        />
        <div className="text-primary font-bold text-[11px] sm:text-xs tracking-wider leading-tight">
          <div>UTY</div>
          <div>CREATIVE</div>
          <div>HUB</div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {siteConfig.description}
      </p>

      {/* Social Media Links */}
      <nav aria-label="Media Sosial Resmi">
        <ul className="flex items-center gap-2 sm:gap-2.5 pt-1 sm:pt-2">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white dark:bg-zinc-900 border border-border/80 text-primary flex items-center justify-center shadow-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-200"
                >
                  <IconComponent
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
