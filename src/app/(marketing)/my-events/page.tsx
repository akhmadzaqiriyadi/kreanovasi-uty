import type { Metadata } from "next";
import { MyEventsPage } from "@/components/my-events/my-events-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tiket & Agenda Saya | UTY Creative Hub",
  description:
    "Pantau status pendaftaran agenda, unduh barcode e-tiket resmi untuk check-in kehadiran di lokasi, dan akses sertifikat acara UTY Creative Hub.",
  alternates: {
    canonical: `${siteConfig.url}/my-events`,
  },
};

export default function Page() {
  return <MyEventsPage />;
}
