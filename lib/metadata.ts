import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"
).replace(/\/$/, "");
export const siteName = "AIO MAKE";
export const siteDescription =
  "aio make 올인원 에이전시";
export const indexable = process.env.VERCEL_ENV !== "preview";
export function socialImage(path: string) {
  const division = path.split("/")[1];
  const key = ["marketing", "lab", "video"].includes(division)
    ? division
    : "main";
  return siteUrl + `/social/${key}-v19.png`;
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const shareTitle = title.includes(siteName)
    ? title
    : `${title} | ${siteName}`;
  const image = socialImage(path);
  return {
    title,
    description,
    alternates: { canonical: siteUrl + path },
    openGraph: {
      title: shareTitle,
      description,
      url: siteUrl + path,
      siteName,
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: shareTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [{ url: image, alt: shareTitle }],
    },
  };
}
