import type { Metadata } from "next";
import { SettingsPage } from "@/components/settings/settings-page";

export const metadata: Metadata = {
  title: "Pengaturan & Preferensi | UTY Creative Hub",
  description:
    "Kelola preferensi notifikasi peminjaman fasilitas, tampilan antarmuka, bahasa, dan keamanan akun Anda.",
};

export default function Page() {
  return <SettingsPage />;
}
