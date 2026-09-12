import type { Metadata } from "next";
import { NotificationsPage } from "@/components/notifications/notifications-page";

export const metadata: Metadata = {
  title: "Pusat Notifikasi | UTY Creative Hub",
  description:
    "Pusat notifikasi dan pembaruan terkini seputar reservasi fasilitas, kegiatan, dan layanan UTY Creative Hub.",
};

export default function Page() {
  return <NotificationsPage />;
}
