// Common public business details, shared with the content studio footer
export const BUSINESS_LEGAL_NAME = "에이아이오 (AIO)";
export const BUSINESS_TAX_ID = "682-01-02748";
export const BUSINESS_ADDRESS = {
  streetAddress: "대곶면 흥신로67",
  addressLocality: "김포시",
  addressRegion: "경기도",
  addressCountry: "KR",
} as const;
export const BUSINESS_INFO = [
  `사업자명: ${BUSINESS_LEGAL_NAME} | 사업자번호: ${BUSINESS_TAX_ID}`,
  "통신판매업신고: 제 2026-경기김포-3656 호",
  "주소: 경기도 김포시 대곶면 흥신로67",
] as const;
export const BUSINESS_EMAIL = "aiomake2023@gmail.com";
