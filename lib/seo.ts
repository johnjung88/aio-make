import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com").replace(/\/+$/, "");

export const SUPPORTED_LOCALES = ["ko", "en"] as const;
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
      en: localeUrl("en", path),
      "x-default": localeUrl("ko", path),
    },
  };
}

export function localizedPageMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = localeUrl(locale, path);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: locale === "en" ? "en_US" : "ko_KR",
      siteName: "AIO에이전시",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
