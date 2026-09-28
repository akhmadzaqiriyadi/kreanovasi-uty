import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/booking", label: "Peminjaman Ruangan" },
  { href: "/my-bookings", label: "Booking Saya" },
  { href: "/events", label: "Event & Workshop" },
  { href: "/articles", label: "Berita & Inovasi" },
  { href: "/about", label: "Tentang UTY Creative Hub" },
];

const programLinks = [
  { href: "/events", label: "Workshop & Pelatihan" },
  { href: "/events", label: "Inkubasi & Startup Pitch" },
  { href: "/events", label: "Klinik Proposal PKM" },
  { href: "/articles", label: "Riset & Karya Inovasi" },
  { href: "/booking", label: "Fasilitas Coworking & FastLab" },
];

export function FooterQuickLinks() {
  return (
    <nav
      aria-labelledby="footer-quicklinks-title"
      className="space-y-3 sm:space-y-4"
    >
      <h3
        id="footer-quicklinks-title"
        className="text-sm sm:text-base font-bold text-primary tracking-tight"
      >
        Menu Navigasi
      </h3>
      <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
        {quickLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center hover:translate-x-1 transition-transform"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FooterProgramLinks() {
  return (
    <nav
      aria-labelledby="footer-programs-title"
      className="space-y-3 sm:space-y-4"
    >
      <h3
        id="footer-programs-title"
        className="text-sm sm:text-base font-bold text-primary tracking-tight"
      >
        Program Unggulan
      </h3>
      <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
        {programLinks.map((program) => (
          <li key={program.label}>
            <Link
              href={program.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center hover:translate-x-1 transition-transform"
            >
              {program.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
