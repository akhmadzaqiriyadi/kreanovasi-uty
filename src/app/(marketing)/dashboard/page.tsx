import type { Metadata } from "next";
import { AdminDashboardPage } from "@/components/admin";

export const metadata: Metadata = {
  title: "Dashboard Administrator | UTY Creative Hub",
  description:
    "Portal kendali dan manajemen administrator sistem UTY Creative Hub: kelola pengguna, audit log, dan hak akses PBAC.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <AdminDashboardPage />;
}
