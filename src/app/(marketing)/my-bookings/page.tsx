import type { Metadata } from "next";
import { MyBookingsPage } from "@/components/my-bookings/my-bookings-page";

export const metadata: Metadata = {
  title: "Booking Saya & Riwayat | UTY Creative Hub",
  description:
    "Pantau status peminjaman aktif, unduh e-tiket resmi, dan kelola riwayat penggunaan fasilitas UTY Creative Hub.",
};

export default function Page() {
  return <MyBookingsPage />;
}
