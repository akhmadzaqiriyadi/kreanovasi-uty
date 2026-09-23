import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/config/articles";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const isSecondary = article.category.variant === "secondary";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900/90 border border-border/80 shadow-xs hover:shadow-xl dark:shadow-none hover:border-primary/50 dark:hover:border-primary/60 hover:-translate-y-1.5 transition-all duration-300 active:scale-[0.98] cursor-pointer touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      <div className="space-y-4">
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          />

          {/* Gradient Overlay for Tag Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Category Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-bold shadow-md backdrop-blur-md transition-colors",
                isSecondary
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {article.category.name}
            </Badge>
          </div>

          {/* Date & Read Time Pill on bottom of image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-medium text-white/90 drop-shadow-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 pt-0 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary dark:group-hover:text-blue-300 transition-colors line-clamp-2 tracking-tight leading-snug">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer: Author & Read More Indicator */}
      <div className="px-5 sm:px-6 py-4 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/25 text-primary dark:text-blue-200 font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
            {article.author.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex flex-col justify-center min-w-0 truncate">
            <p className="text-xs font-bold text-foreground truncate leading-tight">
              {article.author.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
              {article.author.role}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary dark:text-blue-200 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0 shadow-xs">
          <span>Baca</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
