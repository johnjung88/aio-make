/* /content 컨텐츠 사이트 홈 데이터 JSX 없이 순수 데이터와 선택 함수만 둔다
 * 가격은 lib/content-pricing.ts(PRICING_FINAL_2026-10-14.md 3~9번 정본, 부가세 별도)에서만 온다 */

import { MEDIA_TAGS } from "./content-site/types.ts";
import type { ContentServiceId } from "./content-site/types.ts";
export type { ContentServiceId } from "./content-site/types.ts";

export type HeroVideo = { src: string; poster: string };

/* 사용자 지정 v02 전달본과 포스터. 원본과 사본의 해시는 별도 비공개 검증 기록에서 관리한다. */
export const contentHomeHero = {
  title: "AIO MAKE 컨텐츠 스튜디오",
  placeholder: "AIO MAKE CONTENT STUDIO",
  videoPause: "영상 일시정지",
  videoPlay: "영상 재생",
  /** 제작 완료된 전달 영상의 소재 슬롯 ID */
  reelSlot: "home-hero-reel",
  video: { src: "/content-renewal-20261019/content-hero-v02.mp4", poster: "/content-renewal-20261019/content-hero-v02.webp" } as HeroVideo | undefined,
};

/* 승인된 실제 작업물을 기존 카드 슬롯에 배치한다. 영상은 선택 카드에서만 재생하며 이미지 합성은 CSS로 구성한다. */
export type HomeMediaSlot = {
  slotId: `home-card-${ContentServiceId}`;
  poster: string;
  video: string | undefined;
  tag: string;
  alt: string;
  caseLabel: string;
  caseNote: string;
  images?: string[];
  layout?: "comic" | "poses" | "persona";
};

export const homeCardMedia: Record<ContentServiceId, HomeMediaSlot> = {
  webtoon: {
    slotId: "home-card-webtoon",
    poster: "/content-renewal-20261019/webtoon-05.webp",
    video: undefined,
    tag: MEDIA_TAGS.ownWebtoon,
    alt: "1억의 구단주 1화의 실제 완성 페이지 05와 21",
    images: ["/content-renewal-20261019/webtoon-05.webp", "/content-renewal-20261019/webtoon-21.webp"],
    layout: "comic",
    caseLabel: "《1억의 구단주》 · 웹툰 제작",
    caseNote: "자체 기획 IP의 실제 완성 페이지입니다 원고와 장면 구성을 정리해 인물의 행동과 대사를 컷으로 옮겼습니다",
  },
  animation: {
    slotId: "home-card-animation",
    poster: "/content-renewal-20261019/yofree-character-02.webp",
    video: undefined,
    tag: "캐릭터·모션 활용",
    alt: "요프리 제품을 캐릭터로 만든 세 가지 포즈",
    images: ["/content-renewal-20261019/yofree-character-02.webp", "/content-renewal-20261019/yofree-character-03.webp", "/content-renewal-20261019/yofree-character-06.webp"],
    layout: "poses",
    caseLabel: "요프리 · 캐릭터 활용",
    caseNote: "제품을 캐릭터로 만들고 표정과 포즈를 정리한 실제 제작물입니다 캐릭터와 모션을 설계하는 작업 방식을 보여줍니다",
  },
  "ai-influencer": {
    slotId: "home-card-ai-influencer",
    poster: "/content-renewal-20261019/ai-face.webp",
    video: undefined,
    tag: MEDIA_TAGS.aiPerson,
    alt: "자체 기획 AI 가상인물 87언니의 얼굴과 전신 기준 이미지",
    images: ["/content-renewal-20261019/ai-face.webp", "/content-renewal-20261019/ai-full.webp"],
    layout: "persona",
    caseLabel: "87언니 · AI 가상인물",
    caseNote: "자체 기획 AI 가상인물의 얼굴과 전신 기준 이미지입니다 인물의 외형과 스타일을 먼저 정리하고 이미지 제작에 활용합니다",
  },
  "motion-graphics": {
    slotId: "home-card-motion-graphics",
    poster: "/content-renewal-20261019/poster-bwl-brand-motion.webp",
    video: "/content-renewal-20261019/bwl-brand-motion.mp4",
    tag: "브랜드 모션",
    alt: "DR’s Secret 브랜드 모션 영상",
    caseLabel: "DR’s Secret · 브랜드 모션",
    caseNote: "브랜드 이미지와 문구를 움직임으로 구성한 실제 제작 영상입니다",
  },
  "brand-film": {
    slotId: "home-card-brand-film",
    poster: "/content-renewal-20261019/poster-healernet-motion.webp",
    video: "/content-renewal-20261019/healernet-motion.mp4",
    tag: "기업 소개 영상",
    alt: "힐러넷 기업 소개 모션 영상",
    caseLabel: "힐러넷 · 기업 소개 영상",
    caseNote: "회사의 서비스와 정보를 장면과 문구로 정리한 실제 제작 영상입니다",
  },
  ad: {
    slotId: "home-card-ad",
    poster: "/content-renewal-20261019/poster-bwl-cplus-ad.webp",
    video: "/content-renewal-20261019/bwl-cplus-ad.mp4",
    tag: "세로 광고 영상",
    alt: "C Plus 제품을 소개하는 세로 광고 영상",
    caseLabel: "C Plus · SNS 광고 영상",
    caseNote: "제품을 짧은 세로 화면에 담은 실제 제작 영상입니다 도입 장면부터 제품 소개까지 화면의 흐름을 확인할 수 있습니다",
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
  service({ id: "webtoon", label: "웹툰", line: "이야기를 컷으로 완성합니다" }),
  service({ id: "animation", label: "애니메이션", line: "캐릭터의 표정과 동작을 설계합니다" }),
  service({ id: "ai-influencer", label: "AI 인플루언서", line: "브랜드에 맞는 가상인물의 기준을 만듭니다" }),
  service({ id: "motion-graphics", label: "모션그래픽", line: "제품과 문구를 움직임으로 전합니다" }),
  service({ id: "brand-film", label: "브랜드 홍보 영상", line: "회사와 브랜드의 이야기를 담습니다" }),
  service({ id: "ad", label: "SNS 광고 영상", line: "제품의 핵심을 짧고 선명하게 전합니다" }),
];

export const contentHomeServicesHead = {
  eyebrow: "SELECTED WORK",
  title: "기획한 이야기가\n이렇게 완성됩니다",
  /** title 안에서 메인 키워드로 색을 줄 부분(CsSectionHead emphasis). 글자는 title 그대로다 */
  titleEm: "완성",
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
  title: "기획을 확인하고\n단계마다 함께 다듬습니다",
  /** title 안에서 메인 키워드로 색을 줄 부분(CsSectionHead emphasis). 글자는 title 그대로다 */
  titleEm: "함께",
};

export const contentHomeProcess: ContentHomeStep[] = [
  {
    label: "상담",
    text: "목적과 채널, 제작 분량을 정합니다",
    art: "checklist",
  },
  {
    label: "기획",
    text: "이야기와 문구, 장면 구성을 함께 확인합니다",
    art: "storyboard",
  },
  {
    label: "제작",
    text: "확인한 기획으로 장면을 만들고 수정 사항을 반영합니다",
    art: "refine",
  },
  {
    label: "납품",
    text: "최종 검수 후 합의한 형식으로 결과물을 전달합니다",
    art: "frames",
  },
];

export const contentHomeCta = {
  eyebrow: "CONTACT",
  title: "만들고 싶은 콘텐츠를\n이야기해 주세요",
  lead: "용도와 채널, 필요한 분량을 알려주세요 제작 범위와 견적을 안내합니다",
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
