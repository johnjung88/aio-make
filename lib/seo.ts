import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com").replace(/\/+$/, "");

export const SUPPORTED_LOCALES = ["ko"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function toCanonicalPath(path = ""): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function localeUrl(locale: string, path = ""): string {
  return `${SITE_URL}/${locale}${toCanonicalPath(path)}`;
}

export function localizedAlternates(locale: string, path = ""): NonNullable<Metadata["alternates"]> {
  const canonical = localeUrl(locale, path);
  return {
    canonical,
    languages: {
      ko: localeUrl("ko", path),
      "x-default": localeUrl("ko", path),
    },
  };
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/aio-agency-logo-final/aio-agency-board-1800.png`;

export function localizedPageMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  ogImage?: string;
}): Metadata {
  const canonical = localeUrl(locale, path);
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "ko_KR",
      siteName: "AIO에이전시",
      images: [{ url: image, width: 1800, height: 945, alt: "AIO에이전시" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
