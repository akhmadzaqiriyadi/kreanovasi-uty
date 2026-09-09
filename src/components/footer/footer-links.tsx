import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/articles", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/booking", label: "Book Space" },
];

const programLinks = [
  { href: "/programs/workshops", label: "Workshops & Training" },
  { href: "/programs/startup", label: "Startup Incubation" },
  { href: "/programs/mentorship", label: "Mentorship" },
  { href: "/programs/competition", label: "Competition" },
  { href: "/programs/community", label: "Community Events" },
];

export function FooterQuickLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-primary tracking-tight">
        Quick Links
      </h3>
      <ul className="space-y-2.5 text-sm">
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
    </div>
  );
}

export function FooterProgramLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-primary tracking-tight">
        Our Programs
      </h3>
      <ul className="space-y-2.5 text-sm">
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
    </div>
  );
}
