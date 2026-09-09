import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FooterContact() {
  const { address, contactPoint } = siteConfig.organization;

  return (
    <div className="space-y-4">
      <h3 className="text-sm sm:text-base font-bold text-primary tracking-tight">
        Contact Us
      </h3>
      <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {address.streetAddress}, {siteConfig.organization.name},{" "}
            {address.addressLocality}, {address.addressRegion}
          </span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Phone className="h-4 w-4 text-primary shrink-0" />
          <span>{contactPoint.telephone}</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Mail className="h-4 w-4 text-primary shrink-0" />
          <span className="break-all">{contactPoint.email}</span>
        </div>
      </div>
    </div>
  );
}
