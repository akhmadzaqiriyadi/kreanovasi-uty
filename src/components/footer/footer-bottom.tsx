import Link from "next/link";

export function FooterBottom() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground text-center sm:text-left">
      <p>
        © {new Date().getFullYear()} UTY Creative Hub. Hak Cipta Dilindungi.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <Link href="/about" className="hover:text-primary transition-colors">
          Kebijakan Layanan
        </Link>
        <Link href="/booking" className="hover:text-primary transition-colors">
          Tata Tertib Fasilitas
        </Link>
        <Link href="/about" className="hover:text-primary transition-colors">
          Tentang UTY Creative Hub
        </Link>
      </div>
    </div>
  );
}
