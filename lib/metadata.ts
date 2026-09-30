import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"
).replace(/\/$/, "");
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: siteUrl + path },
    openGraph: {
      title,
      description,
      url: siteUrl + path,
      siteName: "AIO MAKE",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: siteUrl + "/renewal/hero.webp",
          width: 1536,
          height: 1024,
          alt: "AIO MAKE · 마케팅 개발 영상",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteUrl + "/renewal/hero.webp"],
    },
  };
}
