// R7 WP-3: 메인 #work 컨텐츠 단계의 플랫폼 카드 데이터와 캐러셀 계산(클라이언트 안전).
// 회사 메인도 콘텐츠 홈과 같은 승인된 실제 소재를 쓴다. 별도 검토 작품은 서버가 고른 props로만 들어온다.
import type { ContentSelection, ContentTabId } from "./home-journey.ts";
import type { PlatformFrameKind } from "../components/platform-frame/platform-frame";
import type { PlatformLogoId } from "../components/platform-frame/logos";
import { homeCardMedia } from "./content-home.ts";

export type CardImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type CardMediaSpec =
  | { kind: "strip"; pages: CardImage[] }
  | ({ kind: "image" } & CardImage)
  | ({ kind: "video"; poster?: string } & CardImage);

export type PlatformCardSpec = {
  platform: PlatformFrameKind;
  logo?: PlatformLogoId;
  /** 인스타그램 피드의 "광고" 표기 */
  sponsored?: boolean;
  /** 웹툰 뷰어 상단 바 제목(공개판 소재 기준) */
  viewerTitle?: string;
  /** 카드 아래 캡션의 뒷부분. 앞부분은 서비스 이름 */
  note: string;
  /** 모션그래픽 카드의 CSS 글자 모션(공개판 이미지 소재에만) */
  kinetic?: boolean;
  publicMedia: CardMediaSpec;
  tag: string;
  sourceNote: string;
};

// 05는 바로 위 완성 페이지 구간(production-case)에 쓰여 폰 화면에서는 뺀다
const webtoonPages: CardImage[] = [1, 21].map((page) => {
  const n = String(page).padStart(2, "0");
  return {
    src: `/content-renewal-20261019/webtoon-${n}.webp`,
    width: 1024,
    height: 1536,
    alt: `1억의 구단주 1화 실제 완성 페이지 ${n}`,
  };
});

// 서비스 6종 → 플랫폼 프레임(BRIEF_R7 §2-5). 카드 외곽은 모두 같은 9:19.5 폰 프레임이고
// 플랫폼 화면비는 배치 미리보기다. 실제 원본은 contain으로 표시해 잘리지 않게 한다.
export const platformCards: Record<ContentTabId, PlatformCardSpec> = {
  webtoon: {
    platform: "webtoon",
    viewerTitle: "1억의 구단주 · 1화",
    note: "세로 스크롤",
    publicMedia: { kind: "strip", pages: webtoonPages },
    tag: "자체 기획 IP",
    sourceNote: homeCardMedia.webtoon.caseLabel,
  },
  animation: {
    platform: "youtube169",
    logo: "youtube",
    note: "YouTube 16:9",
    publicMedia: {
      kind: "image",
      src: homeCardMedia.animation.poster,
      width: 497,
      height: 942,
      alt: homeCardMedia.animation.alt,
    },
    tag: "캐릭터·모션 활용",
    sourceNote: homeCardMedia.animation.caseLabel,
  },
  "ai-influencer": {
    platform: "reels",
    logo: "instagram",
    note: "Instagram 릴스 9:16",
    publicMedia: {
      kind: "image",
      src: homeCardMedia["ai-influencer"].images![1],
      width: 1086,
      height: 1448,
      alt: homeCardMedia["ai-influencer"].alt,
    },
    tag: "AI 가상인물",
    sourceNote: homeCardMedia["ai-influencer"].caseLabel,
  },
  "motion-graphics": {
    platform: "tiktok",
    logo: "tiktok",
    note: "TikTok 9:16",
    publicMedia: {
      kind: "video",
      src: homeCardMedia["motion-graphics"].video!,
      poster: homeCardMedia["motion-graphics"].poster,
      width: 1920,
      height: 1080,
      alt: homeCardMedia["motion-graphics"].alt,
    },
    tag: "브랜드 모션",
    sourceNote: homeCardMedia["motion-graphics"].caseLabel,
  },
  "brand-film": {
    platform: "fbvideo",
    logo: "facebook",
    note: "Facebook 피드 16:9",
    publicMedia: {
      kind: "video",
      src: homeCardMedia["brand-film"].video!,
      poster: homeCardMedia["brand-film"].poster,
      width: 1920,
      height: 1080,
      alt: homeCardMedia["brand-film"].alt,
    },
    tag: "기업 소개 영상",
    sourceNote: homeCardMedia["brand-film"].caseLabel,
  },
  ad: {
    platform: "feed45",
    logo: "instagram",
    sponsored: true,
    note: "Instagram 피드 4:5",
    publicMedia: {
      kind: "video",
      src: homeCardMedia.ad.video!,
      poster: homeCardMedia.ad.poster,
      width: 1080,
      height: 1920,
      alt: homeCardMedia.ad.alt,
    },
    tag: "제품 광고 영상",
    sourceNote: homeCardMedia.ad.caseLabel,
  },
};

// 카드 외곽 폭(px) 구간. CSS(journey-content.css)의 --wjc-w와 같아야 하고 테스트가 대조한다.
// 높이는 폭 × 19.5 / 9(폰 프레임 외곽 비율)다.
export const cardWidthSteps = [
  { from: 0, width: 200 },
  { from: 390, width: 216 },
  { from: 430, width: 232 },
  { from: 768, width: 240 },
  { from: 1024, width: 248 },
  { from: 1440, width: 280 },
] as const;

// 자동 넘김·입력 값은 /content 3D 카드(lib/content-home.ts homeCarouselMotion)와 같다. 테스트가 대조한다.
export const platformMotion = {
  dwellMs: 3500,
  videoDwellMs: 5200,
  swipeMinPx: 45,
  swipeRatio: 1.2,
  /** 이 폭 이상은 3D 캐러셀, 미만은 scroll-snap 가로 넘김 */
  desktopMin: 768,
  /** 스크롤이 멈춘 뒤 활성 카드를 정하는 대기 시간 */
  settleMs: 110,
} as const;

export function wrapIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}

/** 활성 카드 기준 거리(-count/2..count/2) */
export function depthDistance(index: number, current: number, count: number): number {
  let distance = index - current;
  if (distance > count / 2) distance -= count;
  if (distance < -count / 2) distance += count;
  return distance;
}

export type DepthPos = -2 | -1 | 0 | 1 | 2 | "hidden";

export function depthPos(index: number, current: number, count: number): DepthPos {
  const distance = depthDistance(index, current, count);
  return Math.abs(distance) > 2 ? "hidden" : (distance as -2 | -1 | 0 | 1 | 2);
}

/** 가로가 45px 이상이고 세로의 1.2배 이상일 때만 넘김으로 본다 */
export function isSwipe(dx: number, dy: number): boolean {
  return (
    Math.abs(dx) > platformMotion.swipeMinPx &&
    Math.abs(dx) > Math.abs(dy) * platformMotion.swipeRatio
  );
}

/** scroll-snap 트랙에서 화면 가운데에 가장 가까운 카드 번호 */
export function nearestIndex(centers: number[], viewCenter: number): number {
  let best = 0;
  let bestGap = Infinity;
  centers.forEach((center, index) => {
    const gap = Math.abs(center - viewCenter);
    if (gap < bestGap) {
      best = index;
      bestGap = gap;
    }
  });
  return best;
}

export function cardHeightFor(width: number): number {
  return (width * 19.5) / 9;
}

export type CardPlan = {
  id: ContentTabId;
  label: string;
  platform: PlatformFrameKind;
  logo?: PlatformLogoId;
  sponsored: boolean;
  /** 웹툰 뷰어 상단 바 제목 */
  title?: string;
  /** 프레임 안 왼쪽 위 태그. 연출 예시·AI 가상인물 표기를 지킨다 */
  tag: string | null;
  /** 검토판 작업물의 출처 줄(카드 아래). 공개판은 null */
  note: string | null;
  /** 카드 아래 한 줄 캡션 */
  caption: string;
  href: string;
  linkLabel: string;
  kinetic: boolean;
  media: CardMediaSpec;
};

function reviewMedia(selection: ContentSelection): CardMediaSpec {
  const { media, work } = selection;
  if (selection.tab.id === "webtoon" && work) {
    const pages = work.media
      .filter((item) => item.kind !== "video")
      .slice(0, 6)
      .map((item) => ({
        src: item.src,
        width: item.width ?? 1024,
        height: item.height ?? 1536,
        alt: item.alt,
      }));
    if (pages.length >= 2) return { kind: "strip", pages };
    if (pages.length === 1) return { kind: "image", ...pages[0] };
  }
  if (media.kind === "video") {
    return {
      kind: "video",
      src: media.src,
      poster: media.poster,
      width: media.width,
      height: media.height,
      alt: media.alt,
    };
  }
  return {
    kind: "image",
    src: media.src,
    width: media.width,
    height: media.height,
    alt: media.alt,
  };
}

/** 서버가 고른 선택지(ContentSelection) 하나를 카드 한 장의 표시 정보로 바꾼다.
 *  work가 있으면 그 자료를, 없으면 콘텐츠 홈과 같은 승인된 실제 자료를 쓴다 */
export function cardPlan(selection: ContentSelection): CardPlan {
  const spec = platformCards[selection.tab.id];
  const reviewed = Boolean(selection.work);
  const label = selection.tab.label;
  return {
    id: selection.tab.id,
    label,
    platform: spec.platform,
    logo: spec.logo,
    sponsored: Boolean(spec.sponsored),
    title: reviewed ? (selection.work?.title ?? spec.viewerTitle) : spec.viewerTitle,
    tag: reviewed ? selection.tag : spec.tag,
    note: reviewed ? selection.caption : spec.sourceNote,
    caption: `${label} · ${spec.note}`,
    href: `/content/services/${selection.tab.id}`,
    linkLabel: `${label} 서비스 보기, 새 탭`,
    kinetic: Boolean(spec.kinetic) && !reviewed,
    media: reviewed ? reviewMedia(selection) : spec.publicMedia,
  };
}
