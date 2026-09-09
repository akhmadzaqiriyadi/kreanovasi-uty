/**
 * Global Site Configuration & Metadata
 * UTY Creative Hub (Pusat Kreativitas & Inovasi Universitas Teknologi Yogyakarta)
 */

export const siteConfig = {
  name: "UTY Creative Hub",
  shortName: "UCH",
  description:
    "Pusat kreativitas dan inovasi resmi Universitas Teknologi Yogyakarta. Wadah bagi mahasiswa dan komunitas untuk mengembangkan ide-ide brilian di bidang kreativitas, inovasi, dan teknologi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://uch.uty.ac.id",
  ogImage: "https://uch.uty.ac.id/images/uch.png",
  organization: {
    name: "Universitas Teknologi Yogyakarta",
    url: "https://uty.ac.id",
    address: {
      streetAddress: "Gedung G6 Lantai 3, Jl. Siliwangi, Ringroad Utara",
      addressLocality: "Sleman",
      addressRegion: "D.I. Yogyakarta",
      postalCode: "55285",
      addressCountry: "ID",
    },
    contactPoint: {
      telephone: "+62 274 623310",
      email: "kreanovasi@uty.ac.id",
      contactType: "customer service",
    },
  },
  socials: {
    instagram: "https://instagram.com/creativehubuty",
    facebook: "https://facebook.com/utycreativehub",
    twitter: "https://twitter.com/utycreativehub",
    youtube: "https://youtube.com/utycreativehub",
  },
  keywords: [
    "UTY Creative Hub",
    "UCH",
    "Universitas Teknologi Yogyakarta",
    "Inovasi Mahasiswa",
    "Kreativitas Kampus",
    "FastLab Academy",
    "Co-working Space Jogja",
    "Inkubasi Startup UTY",
    "PKM Corner UTY",
    "Sentra HKI UTY",
  ],
} as const;
