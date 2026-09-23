import { Calendar, Clock, Home, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Article } from "@/config/articles";
import { cn } from "@/lib/utils";
import { ArticleBackButton } from "./article-back-button";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const isSecondary = article.category.variant === "secondary";

  return (
    <header className="relative w-full pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden">
      {/* Signature UTY Deep Navy Background layers (identik dengan About & Booking) */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-[oklch(0.28_0.075_270)] dark:from-[oklch(0.13_0.03_266)] dark:via-[oklch(0.16_0.045_266)] dark:to-[oklch(0.10_0.02_270)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/images/texture-herobg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-secondary/10 blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 space-y-6">
        {/* Top Navigation: Dedicated Back Button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ArticleBackButton
            label="Kembali ke Artikel"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
          />

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="text-xs sm:text-sm text-primary-foreground/70">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Beranda</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary-foreground/40" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/articles"
                    className="hover:text-white transition-colors"
                  >
                    Artikel
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary-foreground/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[180px] lg:max-w-xs truncate font-medium text-white/90">
                  {article.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Category Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/articles?category=${encodeURIComponent(article.category.name)}`}
            className="hover:scale-105 active:scale-95 transition-all"
          >
            <Badge
              className={cn(
                "font-bold text-xs cursor-pointer shadow-md",
                isSecondary
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "bg-white text-primary hover:bg-white/90",
              )}
            >
              {article.category.name}
            </Badge>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-primary-foreground/80 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.2]">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-xl text-primary-foreground/85 leading-relaxed font-medium">
          {article.excerpt}
        </p>

        {/* Author Card Info */}
        <Link
          href={`/articles?search=${encodeURIComponent(article.author.name)}`}
          className="flex items-center gap-3 py-3.5 px-3 -mx-3 rounded-2xl border-y border-white/15 hover:bg-white/10 transition-colors group cursor-pointer"
          title={`Lihat artikel oleh ${article.author.name}`}
        >
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-white/20 border border-white/30 shrink-0 flex items-center justify-center">
            {article.author.avatar ? (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white group-hover:text-secondary transition-colors truncate">
              {article.author.name}
            </p>
            <p className="text-xs text-primary-foreground/70 truncate">
              {article.author.role}
            </p>
          </div>
          <span className="text-xs text-secondary font-semibold opacity-0 group-hover:opacity-100 transition-opacity pr-2 hidden sm:inline">
            Lihat artikel →
          </span>
        </Link>
      </div>

      {/* Decorative Bottom Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 sm:h-12"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full fill-background"
        >
          <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </header>
  );
}
