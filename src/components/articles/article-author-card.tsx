import { ArrowRight, Award, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ArticleAuthor } from "@/config/articles";

interface ArticleAuthorCardProps {
  author: ArticleAuthor;
}

export function ArticleAuthorCard({ author }: ArticleAuthorCardProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-gradient-to-r from-card to-primary/5 shadow-xs overflow-hidden">
      <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 flex-1">
          <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 shrink-0 flex items-center justify-center shadow-xs">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-primary" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-primary flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                <span>Tentang Penulis</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground">{author.name}</h3>
            <p className="text-xs font-semibold text-muted-foreground">
              {author.role}
            </p>
            {author.bio && (
              <p className="text-sm text-foreground/80 leading-relaxed pt-1">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs shrink-0 self-start sm:self-auto hover:bg-primary hover:text-primary-foreground group"
        >
          <Link
            href={`/articles?search=${encodeURIComponent(author.name)}`}
            className="flex items-center gap-1.5"
          >
            <span>Semua Artikel</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
