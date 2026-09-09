import { siteConfig } from "@/config/site";

/**
 * EducationalOrganization & WebSite JSON-LD Schema for rich Google search cards
 */
export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/uch.png`,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.organization.address.streetAddress,
          addressLocality: siteConfig.organization.address.addressLocality,
          addressRegion: siteConfig.organization.address.addressRegion,
          postalCode: siteConfig.organization.address.postalCode,
          addressCountry: siteConfig.organization.address.addressCountry,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.organization.contactPoint.telephone,
          email: siteConfig.organization.contactPoint.email,
          contactType: siteConfig.organization.contactPoint.contactType,
        },
        sameAs: [
          siteConfig.socials.instagram,
          siteConfig.socials.facebook,
          siteConfig.socials.twitter,
          siteConfig.socials.youtube,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        inLanguage: "id-ID",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
