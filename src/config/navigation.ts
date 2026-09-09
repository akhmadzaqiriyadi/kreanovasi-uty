export interface NavItem {
  label: string;
  href: string;
}

/**
 * Global navigation configurations
 */
export const navItems: NavItem[] = [
  { label: "Features", href: "/#features" },
  { label: "DX Specs", href: "/#dx" },
  { label: "Feedback", href: "/#feedback" },
];
