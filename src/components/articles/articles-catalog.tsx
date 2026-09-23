"use client";

import { Newspaper, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Article } from "@/config/articles";
import { ArticleCard } from "./article-card";
import { ArticlesFeaturedBanner } from "./articles-featured-banner";

interface ArticlesCatalogProps {
  initialArticles: Article[];
  categories: string[];
}

export function ArticlesCatalog({
  initialArticles,
  categories,
}: ArticlesCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category") || "Semua";
  const urlSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
  }, [urlCategory, urlSearch]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "Semua") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`/articles?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    router.replace("/articles", { scroll: false });
  };

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "Semua" ||
        article.category.name.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  const featuredArticle = initialArticles.find((a) => a.featured);
  const isDefaultView =
    searchQuery.trim() === "" && selectedCategory === "Semua";

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari artikel, topik PKM, IoT, atau HKI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 h-11 rounded-xl bg-background text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategorySelect(category)}
                className="rounded-full text-xs font-semibold shrink-0 h-9 px-4 transition-all active:scale-95 cursor-pointer"
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Featured Banner */}
      {isDefaultView && featuredArticle && (
        <ArticlesFeaturedBanner article={featuredArticle} />
      )}

      {/* Results Header */}
      {!isDefaultView && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <p>
            Menampilkan{" "}
            <span className="font-bold text-foreground">
              {filteredArticles.length}
            </span>{" "}
            artikel
            {selectedCategory !== "Semua" && (
              <span> pada kategori &quot;{selectedCategory}&quot;</span>
            )}
            {searchQuery && (
              <span> dengan kata kunci &quot;{searchQuery}&quot;</span>
            )}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-8 text-primary hover:text-primary cursor-pointer"
          >
            Reset Filter
          </Button>
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-muted/20 space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Newspaper className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Tidak Ada Artikel Ditemukan
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tidak ada artikel yang cocok dengan kriteria pencarian Anda. Coba
              gunakan kata kunci lain atau ubah kategori.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl text-xs cursor-pointer"
          >
            Tampilkan Semua Artikel
          </Button>
        </div>
      )}
    </div>
  );
}
