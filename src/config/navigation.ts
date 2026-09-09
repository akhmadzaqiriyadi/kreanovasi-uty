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
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Booking", href: "/booking" },
  { label: "Artikel", href: "/articles" },
  { label: "Events", href: "/events" },
];

export const programItems: ProgramItem[] = [
  {
    label: "Pendampingan Kreativitas Mahasiswa",
    href: "https://bit.ly/PKMCornerUTY",
    external: true,
  },
  {
    label: "Sentra Kekayaan Intelektual",
    href: "https://sentra-hki.uty.ac.id/",
    external: true,
  },
  {
    label: "Hilirisasi Riset",
    href: "#",
    disabled: true,
  },
  {
    label: "UTY Fastlab Academy",
    href: "/fastlab",
    external: true,
  },
];
