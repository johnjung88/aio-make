/* /content 컨텐츠 사이트 홈 데이터 JSX 없이 순수 데이터와 선택 함수만 둔다
 * 가격은 lib/content-pricing.ts(PRICING_FINAL_2026-10-14.md 3~9번 정본, 부가세 별도)에서만 온다 */

import { MEDIA_TAGS } from "./content-site/types.ts";
import type { ContentServiceId } from "./content-site/types.ts";
export type { ContentServiceId } from "./content-site/types.ts";

export type HeroVideo = { src: string; poster: string };

/* 히어로는 16:9 영상 슬롯 하나다(R6). 사용자 메이킹 필름이 오면 아래 video 한 줄만 채운다(public/ 기준 절대경로).
 * 예: video: { src: "/content-home/making-film.mp4", poster: "/content-home/making-film.webp" }
 * 비어 있는 동안은 같은 16:9 비율의 어두운 면과 placeholder 한 줄만 보인다. 영상이 들어오면 placeholder는 렌더되지 않는다.
 * title은 화면에 보이지 않는 h1(접근성·검색용)이다. */
export const contentHomeHero = {
  title: "AIO MAKE 컨텐츠 스튜디오",
  placeholder: "AIO MAKE CONTENT STUDIO",
  videoPause: "영상 일시정지",
  videoPlay: "영상 재생",
  /** 소재 슬롯 ID. 영상이 오면 아래 video 한 줄만 채운다 */
  reelSlot: "home-hero-reel",
  video: { src: "/content-home/hero-reel-r7.mp4", poster: "/content-home/hero-reel-r7.webp" } as HeroVideo | undefined,
};

/* 홈 캐러셀 카드 소재 슬롯(R5 WP-H, ASSET_REQUEST_R5)
 * - 슬롯 ID는 home-card-<서비스 slug>이다
 * - poster는 지금 쓰는 AIO 생성 이미지다. 사용자가 Higgsfield 5초 영상을 주면 해당 카드의 video 한 줄만 채운다
 *   예: video: "/content-examples/home-card-webtoon.mp4" (public/ 기준 절대경로, mp4 H.264 1MB 안팎)
 * - video가 있으면 선택된 카드에서만 muted 루프로 재생하고 나머지 카드는 poster를 보여준다
 * - video가 없으면 선택된 카드의 poster에 느린 켄번스를 준다
 * - 검토판에서 실제 작업물이 선택되면 그 작업물이 우선이고 이 슬롯은 공개판 대체 소재다 */
export type HomeMediaSlot = {
  slotId: `home-card-${ContentServiceId}`;
  poster: string;
  video: string | undefined;
  tag: string;
};

export const homeCardMedia: Record<ContentServiceId, HomeMediaSlot> = {
  webtoon: {
    slotId: "home-card-webtoon",
    poster: "/webtoon-v11/cut-01.webp",
    video: undefined,
    tag: MEDIA_TAGS.ownWebtoon,
  },
  animation: {
    slotId: "home-card-animation",
    poster: "/creative-v06/video-animation.webp",
    video: undefined,
    tag: MEDIA_TAGS.staged,
  },
  "ai-influencer": {
    slotId: "home-card-ai-influencer",
    poster: "/creative-v06/video-ai-influencer.webp",
    video: undefined,
    tag: MEDIA_TAGS.aiPerson,
  },
  "motion-graphics": {
    slotId: "home-card-motion-graphics",
    poster: "/renewal/video.webp",
    video: undefined,
    tag: MEDIA_TAGS.staged,
  },
  "brand-film": {
    slotId: "home-card-brand-film",
    poster: "/creative-v06/video-brand-film.webp",
    video: undefined,
    tag: MEDIA_TAGS.staged,
  },
  ad: {
    slotId: "home-card-ad",
    poster: "/creative-v06/video-sns-ad.webp",
    video: undefined,
    tag: MEDIA_TAGS.staged,
  },
};

/* 캐러셀 자동 넘김 값(레퍼런스 dist/app.js updateCarousel 관측값). CSS와 테스트가 같은 수치를 쓴다 */
export const homeCarouselMotion = {
  /** 이미지 카드가 머무는 시간 */
  dwellMs: 3500,
  /** 영상 카드는 5초 루프를 한 번 다 보여준다 */
  videoDwellMs: 5200,
  transitionMs: 650,
  shiftDesktop: 365,
  shiftMobile: 212,
  depthDesktop: 170,
  depthMobile: 95,
  rotateDeg: 42,
  scale: [1, 0.88, 0.72],
  opacity: [1, 0.85, 0.55],
} as const;

/* 서비스 6종의 이름·한 줄 설명·링크. 한 줄 설명은 서비스 페이지의 '다른 컨텐츠 서비스'(CsRelated)도 읽는다 */
export type ContentHomeService = {
  id: ContentServiceId;
  label: string;
  line: string;
  href: string;
};

const service = (s: Omit<ContentHomeService, "href">): ContentHomeService => ({
  ...s,
  href: `/content/services/${s.id}`,
});

export const contentHomeServices: ContentHomeService[] = [
  service({ id: "webtoon", label: "웹툰", line: "제품을 설명하는 대신 이야기를 읽게 만드는 웹툰" }),
  service({ id: "animation", label: "애니메이션", line: "브랜드 캐릭터가 살아 움직이는 애니메이션" }),
  service({ id: "ai-influencer", label: "AI 인플루언서", line: "브랜드 전용 AI 가상인물을 만듭니다" }),
  service({ id: "motion-graphics", label: "모션그래픽", line: "제품과 메시지를 간결하게 전하는 모션그래픽" }),
  service({ id: "brand-film", label: "브랜드 홍보 영상", line: "브랜드의 생각을 한 편의 영상으로" }),
  service({ id: "ad", label: "SNS 광고 영상", line: "첫 장면부터 제품에 집중하는 세로 광고" }),
];

export const contentHomeServicesHead = {
  eyebrow: "SERVICES",
  title: "이야기에 맞는 형식\n결과물로 살펴보세요",
  /** title 안에서 메인 키워드로 색을 줄 부분(CsSectionHead emphasis). 글자는 title 그대로다 */
  titleEm: "형식",
  /** 선택된 카드 아래 캡션의 서비스 페이지 링크 */
  detailLink: "서비스 보기",
};

/* 제작 과정 4단계(R8). 단계마다 이름과 한 문장 설명만 둔다(부제·받는 것 줄 삭제).
 * text는 한 문장이며 문장 끝 마침표가 없다.
 * art는 단계마다 붙는 장면 그림의 종류(자체 소재와 CSS 모션)이다. */
export type ContentHomeStepArt = "checklist" | "storyboard" | "refine" | "frames";

export type ContentHomeStep = {
  label: string;
  text: string;
  art: ContentHomeStepArt;
};

export const contentHomeProcessHead = {
  eyebrow: "PROCESS",
  title: "상담에서 납품까지\n네 단계로 진행합니다",
  /** title 안에서 메인 키워드로 색을 줄 부분(CsSectionHead emphasis). 글자는 title 그대로다 */
  titleEm: "네 단계",
};

export const contentHomeProcess: ContentHomeStep[] = [
  {
    label: "상담",
    text: "서비스와 분량을 확정합니다",
    art: "checklist",
  },
  {
    label: "기획",
    text: "컨텐츠별로 기획한 내용을 전달하고 공유합니다",
    art: "storyboard",
  },
  {
    label: "제작",
    text: "확정한 기획안대로 제작하고 공유합니다",
    art: "refine",
  },
  {
    label: "납품",
    text: "게시할 채널에 맞춰 최종 편집후 결과물을 전달합니다",
    art: "frames",
  },
];

export const contentHomeCta = {
  eyebrow: "CONTACT",
  title: "어떤 컨텐츠가\n필요하신가요?",
  lead: "만들고 싶은 컨텐츠와 일정을 알려주시면 담당자가 범위와 견적을 안내합니다",
  button: "상담 신청",
  href: "/content/contact",
};

/* 가격(PRICING_FINAL_2026-10-14.md 3~9번 정본)은 lib/content-pricing.ts에 있다(P2R WP0).
 * 화면 컴포넌트는 lib/content-pricing.ts에서 바로 가져오고, 이 파일은 기존 import·테스트를 위해 같은 이름을 다시 내보낸다 */
export {
  SHOW_STARTING_PRICE,
  contentPricing,
  formatWon,
  startingPrice,
} from "./content-pricing.ts";
export type { StartingPrice } from "./content-pricing.ts";
