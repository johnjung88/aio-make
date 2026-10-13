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
  | "journey-consult"
  | "journey-brand"
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
  title: "상담부터 성과까지\n하나로 이어집니다",
  lead: "필요한 단계만 맡기셔도 됩니다. 단계마다 하는 일과 결과물을 살펴보세요.",
};

export const journeySteps: JourneyStep[] = [
  {
    id: "journey-consult",
    num: "01",
    eyebrow: "01 CONSULT",
    railLabel: "상담",
    title: "필요한 일부터\n함께 정합니다",
    lead: "개발·컨텐츠·마케팅 중 무엇이 먼저인지 상담에서 정리합니다. 목표와 일정, 가진 자료를 알려주시면 범위와 맞춤 견적을 안내합니다.",
  },
  {
    id: "journey-brand",
    num: "02",
    eyebrow: "02 BRAND GUIDE",
    railLabel: "브랜드 가이드",
    title: "브랜드 가이드로\n기준을 세웁니다",
    lead: "로고와 제품 사진, 기존 홈페이지와 SNS 자료를 모아 정리합니다. 컬러와 서체, 말투를 정해두면 개발·컨텐츠·마케팅이 같은 기준으로 움직입니다.",
  },
  {
    id: "journey-dev",
    num: "03",
    eyebrow: "03 DEVELOPMENT",
    railLabel: "개발",
    title: "웹사이트와 쇼핑몰을\n가이드대로 만듭니다",
    lead: "정리한 브랜드 자료를 화면에 녹입니다. 방문한 고객이 제품을 살펴보고 문의나 구매로 이어지도록 동선을 설계합니다.",
  },
  {
    id: "journey-content",
    num: "04",
    eyebrow: "04 CONTENT",
    railLabel: "컨텐츠",
    title: "채널에 맞는 컨텐츠를\n직접 만듭니다",
    lead: "같은 브랜드 가이드로 타깃과 플랫폼에 맞는 형식을 고릅니다. 웹툰부터 광고 영상까지 기획과 제작을 한 팀이 맡습니다.",
  },
  {
    id: "journey-marketing",
    num: "05",
    eyebrow: "05 MARKETING",
    railLabel: "마케팅",
    title: "계획하고 운영하고\n데이터로 고칩니다",
    lead: "누구에게 어떤 메시지를 어느 채널에서 보여줄지 먼저 정합니다. 계획대로 SNS와 광고, 검색 노출을 운영하고 쌓인 데이터를 보며 계속 고칩니다.",
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

// 02 브랜드 가이드 (중립 견본만 쓴다. 고객 색·로고는 쓰지 않는다)
export const brandPanel = {
  label: "가이드 구성",
  tag: "구성 예시",
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

// 05 마케팅 (흐름만 보여준다. 숫자·그래프·성과 지표는 넣지 않는다)
export const marketingPanel = {
  label: "마케팅 운영 흐름",
  tag: "연출 예시",
  nodes: [
    {
      id: "plan",
      title: "플랜 기획",
      detail: "목표 고객 · 채널 · 메시지 · 일정",
    },
    { id: "operate", title: "운영", detail: "게시 · 광고 · 검색 노출 관리" },
    { id: "data", title: "데이터 확인", detail: "유입 · 반응 · 문의 흐름" },
    {
      id: "improve",
      title: "성과 개선",
      detail: "반응 좋은 메시지 늘리기 · 막히는 지점 고치기",
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
