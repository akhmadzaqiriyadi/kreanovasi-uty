import { ArrowRight, BookmarkCheck, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/config/articles";

interface ArticlesFeaturedBannerProps {
  article: Article;
}

export function ArticlesFeaturedBanner({
  article,
}: ArticlesFeaturedBannerProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      aria-label={`Artikel Utama: ${article.title}`}
      className="group relative block overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-1 sm:p-2 shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-4 sm:p-8">
        {/* Visual Cover Area */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl lg:col-span-6 shadow-md bg-muted">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground font-bold shadow-sm flex items-center gap-1.5 px-3 py-1 text-xs">
              <BookmarkCheck className="h-3.5 w-3.5" />
              <span>Artikel Utama</span>
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col justify-center space-y-4 lg:col-span-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
            <span className="font-semibold text-primary">
              {article.category.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-between gap-4 border-t border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                {article.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="text-xs">
                <p className="font-bold text-foreground">
                  {article.author.name}
                </p>
                <p className="text-muted-foreground">{article.author.role}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm group-hover:bg-primary/90 transition-all">
              <span>Baca Lengkap</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
