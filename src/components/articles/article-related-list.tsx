import type { Article } from "@/config/articles";
import { ArticleCard } from "./article-card";

interface ArticleRelatedListProps {
  articles: Article[];
}

export function ArticleRelatedList({ articles }: ArticleRelatedListProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-6 pt-6">
      <div className="space-y-1">
        <h2
          id="related-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
        >
          Artikel Terkait Lainnya
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Eksplorasi wawasan dan panduan inovasi mahasiswa lainnya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
