import { siteDescription, siteName, siteUrl } from "./metadata.ts";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": siteUrl + "/#organization",
  name: siteName,
  legalName: "에이아이오 (AIO)",
  alternateName: ["에이아이오 메이크", "AIO-MAKE"],
  url: siteUrl + "/",
  logo: {
    "@type": "ImageObject",
    url: siteUrl + "/brand/logo-512.png",
    width: 512,
    height: 512,
  },
  description: siteDescription,
  email: "AIOMAKE2023@GMAIL.COM",
  taxID: "682-01-02748",
  address: {
    "@type": "PostalAddress",
    streetAddress: "대곶면 흥신로67",
    addressLocality: "김포시",
    addressRegion: "경기도",
    addressCountry: "KR",
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
