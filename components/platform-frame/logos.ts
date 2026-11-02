/* 플랫폼 공식 로고 목록(R7 WP-0). 파일은 각 사 공식 배포처에서 받은 것이고 색·모양을 바꾸지 않는다.
 * (PNG는 비율을 유지한 축소만 했다. 원본·SHA-256·출처 페이지는 docs/renewal-2026-10-13/license-evidence-r7/logos/ 에 있다.)
 * src가 null이면 UNKNOWN이다. 그때는 직접 그리거나 다른 아이콘 세트로 대신하지 않고 이름 글자만 보여준다.
 * 가상 예시 표기는 쓰지 않는다(사용자 결정). 상표 고지는 PLATFORM_TRADEMARK_NOTICE 한 줄만 쓴다. */

export type PlatformLogoId = "instagram" | "facebook" | "youtube" | "tiktok";

export interface PlatformLogo {
  id: PlatformLogoId;
  /** alt와 UNKNOWN 대체 글자에 쓰는 이름 */
  name: string;
  /** null = UNKNOWN(받지 못함). 이름 글자로 대신한다 */
  src: string | null;
  status: "official" | "unknown";
  /** 공식 배포처 */
  sourceUrl: string;
  /** 받은 날짜 */
  retrieved: string;
}

/** 화면에서 로고 한 변(가장 긴 쪽) 허용 범위(px). 브리프 §2-4-5: 16~24px */
export const LOGO_SIZE_MIN = 16;
export const LOGO_SIZE_MAX = 24;
export const LOGO_SIZE_DEFAULT = 20;

export const PLATFORM_TRADEMARK_NOTICE =
  "Instagram, Facebook, YouTube, TikTok은 각 회사의 상표입니다";

export const platformLogos: Record<PlatformLogoId, PlatformLogo> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    src: "/platform-logos/instagram.png",
    status: "official",
    sourceUrl: "https://www.meta.com/brand/resources/instagram/instagram-brand/",
    retrieved: "2026-10-15",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    src: "/platform-logos/facebook.png",
    status: "official",
    sourceUrl: "https://www.meta.com/brand/resources/facebook/logo/",
    retrieved: "2026-10-15",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    src: "/platform-logos/youtube.svg",
    status: "official",
    sourceUrl: "https://developers.google.com/youtube/branding",
    retrieved: "2026-10-15",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    src: "/platform-logos/tiktok.png",
    status: "official",
    sourceUrl: "https://developers.tiktok.com/doc/getting-started-design-guidelines",
    retrieved: "2026-10-15",
  },
};

export const platformLogoIds = Object.keys(platformLogos) as PlatformLogoId[];

export function getPlatformLogo(id: PlatformLogoId): PlatformLogo {
  return platformLogos[id];
}
