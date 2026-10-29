import { siteDescription, siteName, siteUrl } from "./metadata.ts";
import {
  BUSINESS_LEGAL_NAME,
  BUSINESS_TAX_ID,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
} from "./business-info.ts";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": siteUrl + "/#organization",
  name: siteName,
  legalName: BUSINESS_LEGAL_NAME,
  alternateName: ["에이아이오 메이크", "AIO-MAKE"],
  url: siteUrl + "/",
  logo: {
    "@type": "ImageObject",
    url: siteUrl + "/brand/logo-512.png",
    width: 512,
    height: 512,
  },
  description: siteDescription,
  email: BUSINESS_EMAIL,
  taxID: BUSINESS_TAX_ID,
  address: {
    "@type": "PostalAddress",
    ...BUSINESS_ADDRESS,
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": siteUrl + "/#website",
  name: siteName,
  alternateName: ["에이아이오 메이크", "AIO-MAKE"],
  url: siteUrl + "/",
  inLanguage: "ko-KR",
  publisher: { "@id": siteUrl + "/#organization" },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl + item.path,
    })),
  };
}
