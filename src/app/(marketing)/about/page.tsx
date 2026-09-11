import type { Metadata } from "next";
import { AboutPageSection } from "@/components/about";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dekat UTY Creative Hub — visi, misi, tim, dan pilar ekosistem inovasi resmi Universitas Teknologi Yogyakarta. Wadah kreativitas, riset, dan kolaborasi mahasiswa UTY.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `Tentang Kami | ${siteConfig.name}`,
    description:
      "UTY Creative Hub — pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta. Kenali visi, misi, dan tim kami.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return <AboutPageSection />;
}
