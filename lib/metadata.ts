import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"
).replace(/\/$/, "");
export const siteName = "AIO MAKE";
export const siteDescription =
  "마케팅 대행, 웹사이트·업무 자동화 개발, 영상 제작. 분야별 전문가가 AI를 활용해 기획부터 제작·검수·운영까지 연결합니다.";
export const indexable = process.env.VERCEL_ENV !== "preview";
export function socialImage(path: string) {
  const division = path.split("/")[1];
  const key = ["marketing", "lab", "video"].includes(division)
    ? division
    : "main";
  return siteUrl + `/social/${key}-v09.png`;
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
