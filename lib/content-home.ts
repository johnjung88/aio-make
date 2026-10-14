/* /content 컨텐츠 사이트 홈 데이터 JSX 없이 순수 데이터와 선택 함수만 둔다
 * 가격은 lib/content-pricing.ts(PRICING_FINAL_2026-10-14.md 3~9번 정본, 부가세 별도)에서만 온다 */

import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "./content-site/types.ts";
import type { ContentServiceId } from "./content-site/types.ts";
export type { ContentServiceId } from "./content-site/types.ts";

export type HeroVideo = { src: string; poster: string };

/* 쇼릴 슬롯: 사용자가 쇼릴을 주면 video 한 필드만 채운다(public/ 기준 절대경로).
 * 예: video: { src: "/content-home/showreel.mp4", poster: "/content-home/showreel.webp" }
 * 비어 있는 동안은 정지 이미지 + '연출 예시' 태그만 보인다(자리표시 문구 없음). */
export const contentHomeHero = {
  eyebrow: "AI CONTENT PRODUCTION",
  title: "읽고 싶게\n끝까지 보고 싶게",
  accent: "보고 싶게",
  lead: "웹툰부터 브랜드 영상까지\n기획부터 채널에 맞는 납품까지 한 팀에서",
  button: "서비스 살펴보기",
  buttonHref: "#services",
  secondary: "상담 신청",
  secondaryHref: "/content/contact",
  tag: MEDIA_TAGS.staged,
  image: {
    src: CONTENT_SITE_ASSETS.hero.src,
    alt: "보랏빛 유리 리본과 필름 띠가 놓인 장면 · 연출 예시 이미지",
  },
  videoPause: "영상 일시정지",
  videoPlay: "영상 재생",
  video: undefined as HeroVideo | undefined,
};

export type ContentHomeService = {
  id: ContentServiceId;
  label: string;
  kicker: string;
  line: string;
  description: string;
  uses: [string, string, string];
  image: string;
  imageTag: string;
  alt: string;
  href: string;
  scopeNote?: string;
};

const service = (
  s: Omit<ContentHomeService, "href" | "alt"> & { alt?: string },
): ContentHomeService => ({
  ...s,
  alt: s.alt ?? `${s.label} 연출 예시 이미지`,
  href: `/content/services/${s.id}`,
});

export const contentHomeServices: ContentHomeService[] = [
  service({
    id: "webtoon",
    label: "웹툰",
    kicker: "WEBTOON",
    line: "제품을 설명하는 대신 이야기를 읽게 만드는 웹툰",
    description:
      "제품을 쓰는 인물의 이야기를 12컷 한 회로 구성합니다 원하시면 완성한 웹툰을 모션코믹 영상으로 이어서 만듭니다",
    uses: ["인스타툰", "상세페이지", "광고 소재"],
    image: "/creative-v06/video-webtoon.webp",
    imageTag: MEDIA_TAGS.staged,
  }),
  service({
    id: "animation",
    label: "애니메이션",
    kicker: "ANIMATION",
    line: "브랜드 캐릭터가 살아 움직이는 애니메이션",
    description:
      "캐릭터와 배경을 설계하고 장면을 이어 한 편의 애니메이션으로 만듭니다 길이는 30초와 60초 중에서 고릅니다",
    uses: ["릴스", "쇼츠", "캐릭터 영상"],
    image: "/creative-v06/video-animation.webp",
    imageTag: MEDIA_TAGS.staged,
  }),
  service({
    id: "ai-influencer",
    label: "AI 인플루언서",
    kicker: "AI INFLUENCER",
    line: "브랜드 전용 AI 가상인물을 만듭니다",
    description:
      "캐릭터 시트와 기준 이미지로 얼굴과 스타일을 일정하게 유지합니다 이 인물이 등장하는 제품 이미지와 9:16 숏폼 영상을 만듭니다",
    uses: ["제품 소개", "숏폼 영상", "SNS 이미지"],
    image: "/creative-v06/video-ai-influencer.webp",
    imageTag: MEDIA_TAGS.aiPerson,
    alt: "AI 인플루언서 연출 예시 이미지 · AI로 만든 가상인물",
    scopeNote: "계정 게시·운영은 별도 견적",
  }),
  service({
    id: "motion-graphics",
    label: "모션그래픽",
    kicker: "MOTION GRAPHICS",
    line: "제품과 메시지를 간결하게 전하는 모션그래픽",
    description:
      "제품 이미지와 로고, 핵심 문구를 장면 전환으로 엮습니다 맞춤형은 브랜드 전용 캐릭터까지 함께 만듭니다",
    uses: ["제품 소개", "홈페이지", "행사 화면"],
    image: "/renewal/video.webp",
    imageTag: MEDIA_TAGS.staged,
  }),
  service({
    id: "brand-film",
    label: "브랜드 홍보 영상",
    kicker: "BRAND FILM",
    line: "브랜드의 생각을 한 편의 영상으로",
    description:
      "브랜드 자료와 제품 정보를 정리해 이야기 순서를 잡습니다 회사 소개와 홈페이지에 오래 쓸 영상을 만듭니다",
    uses: ["홈페이지", "회사 소개", "전시"],
    image: "/creative-v06/video-brand-film.webp",
    imageTag: MEDIA_TAGS.staged,
  }),
  service({
    id: "ad",
    label: "SNS 광고 영상",
    kicker: "SNS AD",
    line: "첫 장면부터 제품에 집중하는 세로 광고",
    description:
      "제품 하나와 콘셉트 하나로 9:16 세로 광고 영상을 만듭니다 기본 자막과 배경음악을 넣어 1080p로 전달합니다",
    uses: ["릴스", "쇼츠", "피드 광고"],
    image: "/creative-v06/video-sns-ad.webp",
    imageTag: MEDIA_TAGS.staged,
  }),
];

export const contentHomeServicesHead = {
  eyebrow: "SERVICES",
  title: "이야기에 맞는 형식\n결과물로 살펴보세요",
  lead: "카드를 넘겨 제작 형식과 실제 작업물을 살펴보세요",
  toggle: "한 번에 모두 보기",
  carouselLabel: "컨텐츠 서비스 6종",
  tabsLabel: "서비스 선택",
  prev: "이전 서비스",
  next: "다음 서비스",
  detailLink: "서비스 자세히 보기",
  note: "이미지는 서비스 분위기를 보여주는 연출 예시입니다 대량 제작과 정기 제작은 따로 견적을 드립니다",
};

export type ContentHomeStep = {
  label: string;
  title: string;
  body: string;
  output: string;
};

/* 서비스 페이지 과정(BRIEF_P2R_SERVICES 0-3)과 같은 네 단계·같은 수정 기준이다 */
export const contentHomeProcessHead = {
  eyebrow: "PROCESS",
  title: "함께 확인하고\n다음 단계로",
  lead: "기획안 수정 2회, 최종안 수정 1회 포함\n무엇을 확인하고 어떤 파일을 받는지 단계마다 정리합니다",
  tabsLabel: "제작 단계",
  outputLabel: "결과물",
};

export const contentHomeProcess: ContentHomeStep[] = [
  {
    label: "상담",
    title: "만들 컨텐츠를 함께 정합니다",
    body: "사용할 채널과 일정, 가진 자료를 확인해 서비스와 분량을 정하고 견적을 안내합니다",
    output: "작업 범위와 견적",
  },
  {
    label: "기획",
    title: "기획안으로 방향을 맞춥니다",
    body: "이야기 흐름과 장면 구성을 기획안으로 정리하고 두 번까지 수정해 방향을 맞춥니다",
    output: "기획안",
  },
  {
    label: "제작",
    title: "확정한 기획대로 만듭니다",
    body: "AI로 만든 초안을 담당자가 직접 다듬어 최종안을 전달하고 한 번의 수정으로 마무리합니다",
    output: "최종안",
  },
  {
    label: "납품",
    title: "채널에 맞는 파일로 전달합니다",
    body: "게시할 채널의 화면 비율에 맞춰 파일을 정리하며 다른 화면비 추가는 별도로 견적을 드립니다",
    output: "최종 파일",
  },
];

export const contentHomeCta = {
  eyebrow: "CONTACT",
  title: "어떤 컨텐츠가\n필요하신가요?",
  lead: "만들고 싶은 컨텐츠와 일정을 알려주시면 담당자가 범위와 견적을 안내합니다",
  button: "상담 신청",
  href: "/content/contact",
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/* 가격(PRICING_FINAL_2026-10-14.md 3~9번 정본)은 lib/content-pricing.ts에 있다(P2R WP0).
 * 화면 컴포넌트는 lib/content-pricing.ts에서 바로 가져오고, 이 파일은 기존 import·테스트를 위해 같은 이름을 다시 내보낸다 */
export {
  SHOW_STARTING_PRICE,
  contentPricing,
  formatWon,
  startingPrice,
} from "./content-pricing.ts";
export type { StartingPrice } from "./content-pricing.ts";
