import type { Metadata } from "next";
import { AboutSection } from "@/components/about";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Selamat datang di UTY Creative Hub, pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta! Wadah bagi para pemikir kreatif, inovator muda, dan calon pemimpin masa depan.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `Tentang Kami | ${siteConfig.name}`,
    description:
      "Selamat datang di UTY Creative Hub, pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta!",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="pt-8 sm:pt-12">
      <AboutSection />
    </div>
  );
}
