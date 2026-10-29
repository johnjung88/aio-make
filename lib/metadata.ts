import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"
).replace(/\/$/, "");
export const siteName = "AIO MAKE";
export const siteDescription =
  "AIO MAKE는 컨텐츠 제작, 마케팅 운영, 웹사이트와 쇼핑몰 개발을 연결하는 에이전시입니다";
export const indexable =
  process.env.VERCEL_ENV !== "preview" &&
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW !== "1";
export function socialImage(path: string) {
  const division = path.split("/")[1];
  const key = ["marketing", "lab", "content"].includes(division)
    ? division === "content"
      ? "video"
      : division
    : "main";
  return siteUrl + `/social/${key}-seo2.jpg`;
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
          type: "image/jpeg",
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
