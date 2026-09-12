import type { Metadata } from "next";
import { BookingPageSection } from "@/components/booking";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Reservasi Ruangan & Fasilitas",
  description:
    "Layanan peminjaman co-working space, laboratorium perakitan IoT, ruang brainstorming, dan studio multimedia podcast resmi UTY Creative Hub.",
  alternates: {
    canonical: `${siteConfig.url}/booking`,
  },
  openGraph: {
    title: `Reservasi Ruangan | ${siteConfig.name}`,
    description:
      "Pinjam ruangan kreatif, coworking space, dan laboratorium modern di UTY Creative Hub untuk kegiatan riset dan inovasi mahasiswa.",
    url: `${siteConfig.url}/booking`,
  },
};

export default function BookingPage() {
  return <BookingPageSection />;
}
