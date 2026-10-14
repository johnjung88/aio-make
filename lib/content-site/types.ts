/* 컨텐츠 사이트(/content) 공통 타입과 상수. 순수 데이터만 둔다(JSX·process.env·고객 데이터 금지).
 * 서비스별 문구는 lib/content-site/services/<id>.ts, 금액은 lib/content-pricing.ts에만 있다. */

export type ContentServiceId =
  | "webtoon"
  | "animation"
  | "ai-influencer"
  | "motion-graphics"
  | "brand-film"
  | "ad";

/** 헤더·푸터·관련 서비스·테스트가 함께 쓰는 순서와 표기(고정). */
export const CONTENT_SERVICES: readonly {
  id: ContentServiceId;
  label: string;
}[] = [
  { id: "webtoon", label: "웹툰" },
  { id: "animation", label: "애니메이션" },
  { id: "ai-influencer", label: "AI 인플루언서" },
  { id: "motion-graphics", label: "모션그래픽" },
  { id: "brand-film", label: "브랜드 홍보 영상" },
  { id: "ad", label: "SNS 광고 영상" },
];

export const CONTENT_SERVICE_IDS: readonly ContentServiceId[] =
  CONTENT_SERVICES.map((s) => s.id);

export function isContentServiceId(
  value: unknown,
): value is ContentServiceId {
  return (
    typeof value === "string" &&
    (CONTENT_SERVICE_IDS as readonly string[]).includes(value)
  );
}

export const contentServicePath = (id: ContentServiceId) =>
  `/content/services/${id}`;

export type ServiceLandingData = {
  id: ContentServiceId;
  /** 6종 표기와 같다(CONTENT_SERVICES). */
  label: string;
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** 줄바꿈은 \n으로만. 한 줄 9자 이하. */
    title: string;
    /** 한 문장, 마침표 없음 */
    lead: string;
  };
  process: {
    title: string;
    lead?: string;
    steps: { title: string; body: string; check: string }[];
  };
  scope: { included: string[]; separate: string[]; prepare: string[] };
  faq: [question: string, answer: string][];
  inquiry: { title: string; lead: string; placeholder: string };
  /** 서비스 고유 섹션 문구. 문자열은 모두 카피 테스트 대상이다(WP-A/B/C가 채운다). */
  signature: Record<string, unknown>;
};

/** 미디어 상태 태그. 새 태그가 필요하면 이 상수에만 추가한다("WP0 요청"). */
export const MEDIA_TAGS = {
  /** AI가 만든 장면·배경·사물 이미지와 CSS 일러스트 */
  staged: "연출 예시",
  /** AI가 만든 사람이 보이는 이미지·영상은 모두 이 태그 */
  aiPerson: "AI 가상인물 · 연출 예시",
  /** AIO 자체 웹툰 《1억의 구단주》 컷 */
  ownWebtoon: "1억의 구단주 · 제작 예시",
  /** 《1억의 구단주》 소개 영상 */
  ownWebtoonVideo: "1억의 구단주 영상 · 제작 예시",
  /** 브랜드 홍보 영상 배경 영상(무음) */
  stagedMuted: "연출 예시 · 무음",
} as const;

export type MediaTag = (typeof MEDIA_TAGS)[keyof typeof MEDIA_TAGS];

/** 공개 연출 예시 자산(벤치마크 v01 복사본, 열린 질문 Q3). 거절 시 이 표만 바꾼다. */
export const CONTENT_SITE_ASSETS = {
  hero: { src: "/content-site/hero.webp", width: 1920, height: 1081 },
  brand: { src: "/content-site/brand.webp", width: 900, height: 1350 },
  animation: { src: "/content-site/animation.webp", width: 900, height: 1350 },
  creator: { src: "/content-site/creator.webp", width: 900, height: 1350 },
  webtoon: { src: "/content-site/webtoon.webp", width: 900, height: 1350 },
  brandMotion: { src: "/content-site/brand-motion.mp4" },
} as const;

/** 서버(works.server.ts)가 고른 사례 카드. 직렬화 가능한 평범한 객체만. */
export type CsWorkMedia = {
  kind: "image" | "video" | "webtoon";
  src: string;
  alt: string;
  poster?: string;
  width?: number;
  height?: number;
  presentation?: "site" | "wide" | "portrait" | "webtoon" | "square";
};

export type CsWorkCard = {
  slug: string;
  brand: string;
  title: string;
  scope: string;
  label: string;
  href: string;
  media: CsWorkMedia[];
  /** 서비스 고유 섹션에 실물을 붙이는 작품 표시. 이 값이 있으면 사례 목록(CsWorks)에서 빼 같은 작품을 두 번 보이지 않고, 목록 상한 계산에서도 뺀다.
   * "ad-signature"는 SNS 광고 시그니처(세로 3장면)에 붙는 작품이다(R7) */
  placement?: "character-case" | "ad-signature";
  /** 시그니처(placement "ad-signature") 3장면 이름. 서버가 만들어 내려준다. 클라이언트 파일에는 문구를 두지 않는다(R7) */
  signatureLabels?: readonly [string, string, string];
  /** 히어로 레일 앞칸에 이 작품의 9:16 포스터를 먼저 둔다(R7, SNS 광고) */
  railLead?: true;
  /** 9:16 영상이 둘 이상인 작품의 안 수 표시(예: "4안"). 있으면 세로형 사례 카드가 포스터 띠를 붙인다(R7) */
  variantLabel?: string;
};

export type CsWorksLayout = "vertical" | "wide" | "webtoon";
