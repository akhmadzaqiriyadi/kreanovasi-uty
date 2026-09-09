"use client";

import { Heart, Zap } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterLogic } from "@/hooks/use-newsletter-logic";

export function Footer() {
  const { email, setEmail, subscribed, handleSubscribe } = useNewsletterLogic();

  return (
    <footer className="w-full border-t border-border/40 bg-background/30 backdrop-blur-md">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight"
            >
              <div className="flex h-7 w-7 items-center justify-between rounded-md bg-gradient-to-tr from-primary to-purple-500 p-1.5 text-primary-foreground shadow-sm">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span>
                UCH<span className="text-primary">WebApp</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              UCH Web Application built with Next.js 16 and Bun.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                aria-label="GitHub"
                className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 rounded-full border border-border/40 bg-background/50 hover:bg-accent hover:text-accent-foreground flex items-center justify-center`}
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="Twitter"
                className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 rounded-full border border-border/40 bg-background/50 hover:bg-accent hover:text-accent-foreground flex items-center justify-center`}
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
                className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-8 w-8 rounded-full border border-border/40 bg-background/50 hover:bg-accent hover:text-accent-foreground flex items-center justify-center`}
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://nextjs.org"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next.js Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://bun.sh"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bun Runtime
                </Link>
              </li>
              <li>
                <Link
                  href="https://ui.shadcn.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  shadcn/ui
                </Link>
              </li>
              <li>
                <Link
                  href="https://tailwindcss.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tailwind CSS v4
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground mb-4">
              Template
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/showcase"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  UI Components
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features Walkthrough
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  MIT License
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground mb-4">
              Subscribe
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stay updated with the latest templates, techniques, and tool
              releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-border/50 text-sm h-9"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 bg-primary hover:opacity-90 text-primary-foreground"
              >
                {subscribed ? "Subbed!" : "Join"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} UCH Web App. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with{" "}
            <Heart className="h-3 w-3 fill-current text-red-500 animate-pulse" />{" "}
            using Next.js 16 & Bun
          </p>
        </div>
      </div>
    </footer>
  );
}
