export type FieldKey = "development" | "design" | "video" | "marketing";

export const FIELD_CATEGORIES: Record<FieldKey, string[]> = {
  development: ["website", "shopping-mall", "automation-app"],
  design: ["logo-business-card", "detail-page", "ppt-design"],
  video: ["video-content"],
  marketing: [],
};

export const FIELD_META: Record<FieldKey, { title: string; lead: string }> = {
  development: { title: "개발", lead: "웹사이트·쇼핑몰·자동화 — 실제 운영 가능한 결과물" },
  design: { title: "디자인", lead: "로고·명함·상세페이지·PPT — 한 번에 기억되는 디자인" },
  video: { title: "영상", lead: "브랜드·SNS·마케팅·유튜브 — 첫 장면이 시선을 사로잡는 영상" },
  marketing: { title: "마케팅", lead: "블로그·SNS·영상채널 — 꾸준히 쌓이는 운영 결과" },
};
