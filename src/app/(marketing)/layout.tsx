import type React from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col relative z-10">{children}</main>
      <Footer />
    </>
  );
}
