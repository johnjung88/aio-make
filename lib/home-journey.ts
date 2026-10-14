// Main page workflow journey: steps, neutral copy, tab setup and types.
// Client-safe: no customer data and no value import from the work catalog.
// Customer work (project labels, before captures, AI persona label, review
// slugs) lives in the server-only home-journey-data.ts, which selects media on
// the server and passes plain props; it selects customer work only for the
// exact local review flag "1".
import type { WorkItem, WorkMedia } from "./work-catalog.ts";
import {
  contentHomeServices,
  type ContentServiceId,
} from "./content-home.ts";

export const requiredContentServices = contentHomeServices
  .map((service) => service.label)
  .join(" · ");

export type JourneyStepId =
  | "journey-dev"
  | "journey-content"
  | "journey-marketing";

export type JourneyStep = {
  id: JourneyStepId;
  num: string;
  eyebrow: string;
  railLabel: string;
  title: string;
  lead: string;
};

export type JourneyLink = { label: string; href: string };

export const journeyIntro = {
  eyebrow: "HOW WE WORK",
  title: "브랜드를 이해하고\n쓰이는 결과물로",
  lead: "상담에서 정한 방향을 화면과 컨텐츠에 담고, 운영하면서 다음 작업을 정합니다",
};

export const journeySteps: JourneyStep[] = [
  {
    id: "journey-dev",
    num: "01",
    eyebrow: "01 DEVELOPMENT",
    railLabel: "개발",
    title: "브랜드를 만나는\n웹사이트와 쇼핑몰",
    lead: "정리한 브랜드 자료를 화면에 담고, 방문한 고객이 제품을 살펴보며 문의나 구매로 이어지도록 동선을 설계합니다",
  },
  {
    id: "journey-marketing",
    num: "02",
    eyebrow: "02 MARKETING",
    railLabel: "마케팅",
    title: "만든 다음에는\n반응을 보고 개선합니다",
    lead: "타깃과 메시지에 맞는 채널을 정해 SNS·광고·검색 노출을 운영하고 쌓인 데이터를 보며 다음 작업을 개선합니다",
  },
  {
    id: "journey-content",
    num: "03",
    eyebrow: "03 CONTENT",
    railLabel: "컨텐츠",
    title: "사람들이 보고 싶은\n브랜드 컨텐츠",
    lead: "같은 브랜드 가이드를 바탕으로 타깃과 플랫폼에 맞는 형식을 골라 웹툰부터 광고 영상까지 한 팀에서 기획하고 제작합니다",
  },
];

// 01 상담
export const consultPanel = {
  fields: ["개발", "컨텐츠", "마케팅"],
  label: "상담에서 정하는 것",
  rows: [
    { term: "목표", text: "알리고 싶은 내용과 기대하는 반응" },
    { term: "작업 범위", text: "개발·컨텐츠·마케팅 중 맡길 일과 분량" },
    { term: "일정", text: "오픈일이나 게시일에 맞춘 작업 순서" },
    { term: "맞춤 견적", text: "정한 범위와 일정에 따른 비용 안내" },
  ],
  links: [{ label: "상담 신청하기", href: "#contact" }] as JourneyLink[],
};

// 02 브랜드 가이드 (중립 견본만 쓴다 고객 색·로고는 쓰지 않는다)
export const brandPanel = {
  label: "가이드 구성",
  tag: "가이드 구성",
  tiles: [
    { id: "logo", title: "로고 사용", text: "여백과 최소 크기, 잘못 쓴 예" },
    { id: "color", title: "컬러", text: "주색과 보조색의 쓰임" },
    { id: "type", title: "서체", text: "제목과 본문 서체의 크기 단계" },
    { id: "tone", title: "톤과 말투", text: "자주 쓰는 표현과 피할 표현" },
    { id: "photo", title: "사진 방향", text: "빛과 배경, 제품 연출 기준" },
  ],
  swatches: ["ink", "paper", "violet", "lavender"] as const,
};

// 03 개발
export type JourneyMedia = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
};

export type JourneyShape =
  | "portrait"
  | "page"
  | "square"
  | "landscape"
  | "wide";

export function mediaShape(media: {
  width: number;
  height: number;
}): JourneyShape {
  const ratio = media.width / media.height;
  if (ratio < 0.62) return "portrait";
  if (ratio < 0.85) return "page";
  if (ratio < 1.25) return "square";
  if (ratio < 1.7) return "landscape";
  return "wide";
}

export const devServiceLinks: JourneyLink[] = [
  { label: "웹사이트 제작", href: "/lab/services/website" },
  { label: "쇼핑몰 제작", href: "/lab/services/shopping-mall" },
];

export const devFallbackTabs = [
  {
    id: "website",
    label: "웹사이트 제작",
    tag: "연출 예시",
    href: "/lab/services/website",
    media: {
      kind: "image",
      src: "/creative-v08/development-website.webp",
      width: 1672,
      height: 941,
      alt: "웹사이트 제작 연출 예시 이미지",
    } as JourneyMedia,
  },
  {
    id: "shopping-mall",
    label: "쇼핑몰 제작",
    tag: "연출 예시",
    href: "/lab/services/shopping-mall",
    media: {
      kind: "image",
      src: "/creative-v06/development-shopping-mall.webp",
      width: 1586,
      height: 992,
      alt: "쇼핑몰 제작 연출 예시 이미지",
    } as JourneyMedia,
  },
];

export const devFallbackSteps = [
  "기존 화면 점검",
  "가이드 적용",
  "PC·모바일 화면 설계",
  "문의·구매 동선 연결",
];

export type DevProjectConfig = {
  slug: string;
  label: string;
  serviceHref: string;
};

export type BeforeShot = {
  pc: JourneyMedia;
  mobile: JourneyMedia;
  caption: string;
};

export const devCopy = {
  beforeHold: "기존 화면 자료 확인 중",
  afterCaption: "AIO 제작 화면",
  beforeLabel: "기존 화면 크게 보기",
  afterLabel: "AIO 제작 화면 크게 보기",
  workLink: "작업 자세히 보기",
  serviceLink: "서비스 자세히 보기",
};

export type DevProject = {
  config: DevProjectConfig;
  work: WorkItem;
  after: JourneyMedia;
  afterMobile: JourneyMedia | null;
  before: BeforeShot | null;
};

const SITE_FALLBACK = { width: 1440, height: 900 };

export function toJourneyMedia(media: WorkMedia): JourneyMedia {
  if (media.kind === "video") {
    const portrait = media.presentation === "portrait";
    return {
      kind: "video",
      src: media.src,
      poster: media.poster,
      width: media.width ?? (portrait ? 720 : 1280),
      height: media.height ?? (portrait ? 1280 : 720),
      alt: media.alt,
    };
  }
  return {
    kind: "image",
    src: media.src,
    width: media.width ?? SITE_FALLBACK.width,
    height: media.height ?? SITE_FALLBACK.height,
    alt: media.alt,
  };
}

// 04 컨텐츠 (label·line·chips는 /content 홈의 contentHomeServices에서 가져온다)
export type ContentTabId = ContentServiceId;

export type ContentTab = {
  id: ContentTabId;
  label: string;
  line: string;
  chips: string[];
  fallback: JourneyMedia & { caption?: string; tag?: string };
};

const contentFallbacks: Record<ContentTabId, ContentTab["fallback"]> = {
  webtoon: {
    kind: "image",
    src: "/webtoon-v11/cut-01.webp",
    width: 800,
    height: 1200,
    alt: "1억의 구단주 웹툰 제작 예시 1컷",
    caption: "1억의 구단주 · 제작 예시",
  },
  animation: {
    kind: "image",
    src: "/creative-v06/video-animation.webp",
    width: 1586,
    height: 992,
    alt: "애니메이션 연출 예시 이미지",
    tag: "연출 예시",
  },
  "ai-influencer": {
    kind: "image",
    src: "/creative-v06/video-ai-influencer.webp",
    width: 1586,
    height: 992,
    alt: "AI 인플루언서 연출 예시 이미지 · AI로 만든 가상인물",
    tag: "AI 가상인물 · 연출 예시",
  },
  "motion-graphics": {
    kind: "image",
    src: "/renewal/video.webp",
    width: 1100,
    height: 1100,
    alt: "모션그래픽 연출 예시 이미지",
    tag: "연출 예시",
  },
  "brand-film": {
    kind: "image",
    src: "/creative-v06/video-brand-film.webp",
    width: 1586,
    height: 992,
    alt: "브랜드 홍보 영상 연출 예시 이미지",
    tag: "연출 예시",
  },
  ad: {
    kind: "image",
    src: "/creative-v06/video-sns-ad.webp",
    width: 1586,
    height: 992,
    alt: "SNS 광고 영상 연출 예시 이미지",
    tag: "연출 예시",
  },
};

export const contentTabs: ContentTab[] = contentHomeServices.map((service) => ({
  id: service.id,
  label: service.label,
  line: service.line,
  chips: [...service.uses],
  fallback: contentFallbacks[service.id],
}));

export const contentCopy = {
  serviceLink: "서비스 자세히 보기",
  workLink: "작업 자세히 보기",
  prev: "이전",
  next: "다음",
  prevLabel: "이전 컨텐츠 보기",
  nextLabel: "다음 컨텐츠 보기",
  stepLinks: [
    { label: "컨텐츠 서비스 전체 보기", href: "/content" },
  ] as JourneyLink[],
};

export type ContentSelection = {
  tab: ContentTab;
  work: WorkItem | null;
  media: JourneyMedia;
  caption: string | null;
  tag: string | null;
};

// Neutral example used when no catalog work matches the tab.
export function fallbackContentSelection(tab: ContentTab): ContentSelection {
  const { caption, tag, ...media } = tab.fallback;
  return { tab, work: null, media, caption: caption ?? null, tag: tag ?? null };
}

// Server-selected props for the 03 개발 and 04 컨텐츠 steps.
export type HomeJourneyData = {
  devProjects: DevProject[];
  contentSelections: ContentSelection[];
};

export const emptyJourneyData: HomeJourneyData = {
  devProjects: [],
  contentSelections: contentTabs.map(fallbackContentSelection),
};

// 05 마케팅 (흐름만 보여준다 숫자·그래프·성과 지표는 넣지 않는다)
export const marketingPanel = {
  label: "기획 · 운영 · 확인 · 개선",
  tag: "운영 구성",
  nodes: [
    {
      id: "plan",
      title: "플랜 기획",
      detail: "누구에게 보여줄지, 어떤 채널과 주제로 만날지 정리",
    },
    { id: "operate", title: "운영", detail: "정한 일정에 맞춰 게시물과 광고, 검색 노출 관리" },
    { id: "data", title: "데이터 확인", detail: "채널 반응과 사이트 유입, 문의가 이어지는 경로 확인" },
    {
      id: "improve",
      title: "성과 개선",
      detail: "확인한 반응으로 다음 소재와 화면, 운영 계획 조정",
    },
  ],
  branches: [
    { from: "화면 수정", to: "개발 단계", href: "#journey-dev" },
    { from: "소재 교체", to: "컨텐츠 단계", href: "#journey-content" },
  ],
  links: [
    { label: "통합 마케팅", href: "/marketing/services/integrated" },
    { label: "SNS 대행 운영", href: "/marketing/services/sns" },
    { label: "SEO·AEO·GEO", href: "/marketing/services/seo" },
  ] as JourneyLink[],
};

export const journeyClosing = {
  lead: "어디서부터 시작할지 상담에서 함께 정합니다",
  button: { label: "견적 문의", href: "#contact" },
};

export const railLabel = "작업 단계";
