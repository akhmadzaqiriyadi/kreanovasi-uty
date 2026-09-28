export interface NavItem {
  label: string;
  href: string;
}

export interface ProgramItem {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

/**
 * Global navigation configurations
 */
export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Ruangan", href: "/booking" },
  { label: "Booking Saya", href: "/my-bookings" },
  { label: "Event", href: "/events" },
  { label: "Artikel", href: "/articles" },
  { label: "Tentang", href: "/about" },
];

export const programItems: ProgramItem[] = [
  {
    label: "Pendampingan Kreativitas Mahasiswa (PKM)",
    href: "https://bit.ly/PKMCornerUTY",
    external: true,
  },
  {
    label: "Sentra Kekayaan Intelektual (HKI)",
    href: "https://sentra-hki.uty.ac.id/",
    external: true,
  },
  {
    label: "Inkubasi & Startup Pitch Fest",
    href: "/events",
  },
  {
    label: "UTY Fastlab Academy",
    href: "/articles/eksplorasi-iot-dan-smart-hardware-di-fastlab-academy",
  },
];
