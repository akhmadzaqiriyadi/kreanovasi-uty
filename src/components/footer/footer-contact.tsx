import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FooterContact() {
  const { address, contactPoint } = siteConfig.organization;

  return (
    <section
      aria-labelledby="footer-contact-title"
      className="space-y-3 sm:space-y-4"
    >
      <h3
        id="footer-contact-title"
        className="text-sm sm:text-base font-bold text-primary tracking-tight"
      >
        Contact Us
      </h3>
      <address className="not-italic space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <MapPin
            className="h-4 w-4 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span className="leading-relaxed">
            {address.streetAddress}, {siteConfig.organization.name},{" "}
            {address.addressLocality}, {address.addressRegion}
          </span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <a
            href={`tel:${contactPoint.telephone.replace(/\s+/g, "")}`}
            className="hover:text-primary transition-colors"
          >
            {contactPoint.telephone}
          </a>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <a
            href={`mailto:${contactPoint.email}`}
            className="break-all hover:text-primary transition-colors"
          >
            {contactPoint.email}
          </a>
        </div>
      </address>
    </section>
  );
}
