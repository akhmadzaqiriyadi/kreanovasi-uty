import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArticleAuthorCard,
  ArticleBackButton,
  ArticleContentBody,
  ArticleHeader,
  ArticleRelatedList,
  ArticleShareActions,
} from "@/components/articles";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/config/articles";
import { siteConfig } from "@/config/site";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  const url = `${siteConfig.url}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${article.title} | ${siteConfig.name}`,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, 3);

  return (
    <article className="w-full">
      {/* 1. Signature UTY Deep Navy Hero Banner with Texture & Wave */}
      <ArticleHeader article={article} />

      {/* 2. Main Article Body below the decorative wave */}
      <div className="w-full py-10 sm:py-16 bg-background relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 space-y-10 sm:space-y-12">
          {/* Featured Cover Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/80 shadow-md">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Article Body Content */}
          <ArticleContentBody article={article} />

          {/* Interactive Social Share Bar */}
          <ArticleShareActions title={article.title} slug={article.slug} />

          {/* Author Bio Card */}
          <ArticleAuthorCard author={article.author} />

          {/* Bottom Back to Articles Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border/60">
            <ArticleBackButton label="Kembali ke Katalog Artikel" />
          </div>

          {/* Related Articles Recommendations */}
          <ArticleRelatedList articles={relatedArticles} />
        </div>
      </div>
    </article>
  );
}
