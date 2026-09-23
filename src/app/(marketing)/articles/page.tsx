import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesCatalog, ArticlesHeroBanner } from "@/components/articles";
import { articlesConfig, getAllArticles } from "@/config/articles";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Artikel & Wawasan Inovasi",
  description:
    "Kumpulan panduan PKM, riset terapan, teknologi IoT FastLab, dan strategi perlindungan HKI mahasiswa Universitas Teknologi Yogyakarta.",
  alternates: {
    canonical: `${siteConfig.url}/articles`,
  },
  openGraph: {
    title: `Artikel & Wawasan Inovasi | ${siteConfig.name}`,
    description:
      "Kumpulan panduan PKM, riset terapan, teknologi IoT FastLab, dan strategi perlindungan HKI mahasiswa Universitas Teknologi Yogyakarta.",
    url: `${siteConfig.url}/articles`,
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const { categories } = articlesConfig;

  return (
    <>
      {/* 1. Signature UTY Deep Navy Hero Banner with Texture & Wave */}
      <ArticlesHeroBanner />

      {/* 2. Main Content Catalog */}
      <main className="w-full py-12 sm:py-16 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <Suspense
            fallback={
              <div className="py-20 text-center text-sm text-muted-foreground animate-pulse">
                Memuat katalog artikel...
              </div>
            }
          >
            <ArticlesCatalog
              initialArticles={articles}
              categories={categories}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
