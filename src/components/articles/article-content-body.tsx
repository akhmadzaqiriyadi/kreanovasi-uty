import { CheckCircle2, Quote } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Article } from "@/config/articles";

interface ArticleContentBodyProps {
  article: Article;
}

export function ArticleContentBody({ article }: ArticleContentBodyProps) {
  return (
    <div className="space-y-8 text-foreground">
      {/* Key Takeaways Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <Card className="border-l-4 border-l-primary bg-primary/5 dark:bg-primary/10 border-border/80 rounded-2xl overflow-hidden shadow-xs">
          <CardContent className="p-5 sm:p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Poin Kunci & Intisari Artikel</span>
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/90">
              {article.keyTakeaways.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Article Sections */}
      <div className="space-y-8">
        {article.sections.map((section, idx) => (
          <section key={section.heading} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
              {section.heading}
            </h2>

            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-foreground/85">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>

            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2 pl-4 list-disc text-base sm:text-lg leading-relaxed text-foreground/85">
                {section.bulletPoints.map((bp) => (
                  <li key={bp.slice(0, 30)}>{bp}</li>
                ))}
              </ul>
            )}

            {/* Optional Quote insertion after first section */}
            {idx === 0 && article.quote && (
              <blockquote className="my-6 p-6 rounded-2xl bg-secondary/10 border-l-4 border-secondary text-secondary-foreground relative">
                <Quote className="h-8 w-8 text-secondary/40 absolute right-4 top-4 pointer-events-none" />
                <p className="text-base sm:text-lg font-medium italic text-foreground leading-relaxed">
                  &ldquo;{article.quote.text}&rdquo;
                </p>
                <footer className="mt-3 text-xs sm:text-sm font-semibold text-muted-foreground">
                  — {article.quote.author}
                </footer>
              </blockquote>
            )}
          </section>
        ))}
      </div>

      {/* Article Tags: Clickable Links to Search */}
      {article.tags.length > 0 && (
        <div className="pt-6 border-t border-border/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Topik:
          </span>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?search=${encodeURIComponent(tag)}`}
              className="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              <Badge
                variant="outline"
                className="text-xs rounded-lg py-1 px-2.5 font-normal bg-muted/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
