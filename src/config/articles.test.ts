import { describe, expect, it } from "bun:test";
import { articlesConfig } from "./articles";

describe("articlesConfig", () => {
  it("has valid header configuration", () => {
    expect(articlesConfig.header.title).toBe("Artikel & Wawasan");
    expect(articlesConfig.header.subtitle).toContain("UTY Creative Hub");
  });

  it("contains exactly 3 curated articles for landing page", () => {
    expect(articlesConfig.articles.length).toBe(3);
  });

  it("ensures each article has all required properties", () => {
    for (const article of articlesConfig.articles) {
      expect(article.id).toBeDefined();
      expect(article.slug).toBeDefined();
      expect(article.title.length).toBeGreaterThan(10);
      expect(article.excerpt.length).toBeGreaterThan(20);
      expect(article.category.name).toBeDefined();
      expect(article.category.variant).toMatch(/^(primary|secondary|accent)$/);
      expect(article.coverImage).toBeDefined();
      expect(article.author.name).toBeDefined();
      expect(article.author.role).toBeDefined();
      expect(article.publishedAt).toBeDefined();
      expect(article.readTime).toContain("baca");
    }
  });

  it("has a valid CTA link to articles page", () => {
    expect(articlesConfig.cta.href).toBe("/articles");
    expect(articlesConfig.cta.label).toBeDefined();
  });
});
