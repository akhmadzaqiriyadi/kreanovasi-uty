import type React from "react";
import { articlesConfig } from "@/config/articles";
import { ArticleCard } from "./article-card";

interface ArticlesGridProps {
  gridRef?: React.Ref<HTMLDivElement>;
}

export function ArticlesGrid({ gridRef }: ArticlesGridProps) {
  const { articles } = articlesConfig;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
    >
      {articles.map((article, index) => {
        const isThirdOnTablet = index === 2;
        return (
          <ArticleCard
            key={article.id}
            article={article}
            className={
              isThirdOnTablet
                ? "md:col-span-2 md:w-[calc(50%-0.75rem)] lg:w-full md:mx-auto lg:col-span-1"
                : ""
            }
          />
        );
      })}
    </div>
  );
}
