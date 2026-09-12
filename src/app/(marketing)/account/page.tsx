import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";

export const metadata: Metadata = {
  title: "Akun Saya | UTY Creative Hub",
  description:
    "Kelola informasi data diri pemohon, verifikasi akun, afiliasi organisasi, dan statistik peminjaman fasilitas UCH.",
};

export default function Page() {
  return <AccountPage />;
}
