import "server-only";
/* 컨텐츠 서비스 페이지의 고객 사례 선택(서버 전용, RESULT_FIX_P34 교훈 적용).
 * 고객 작품 18개는 공개 권리 UNKNOWN/HOLD라 visibility "review"다. displayWorkCatalog는
 * NEXT_PUBLIC_AIO_REFERENCE_REVIEW가 정확히 "1"일 때만 검토 작품을 넣으므로 기본 빌드에서는
 * 결과가 빈 배열이고 사례 섹션(CsWorks)이 렌더되지 않는다. 고객 문자열(87언니 라벨·시안 slug)도
 * 같은 게이트 안에만 둔다. 클라이언트 컴포넌트는 이 모듈을 import하지 않는다(테스트 grep). */
import { publicEntries } from "../db.ts";
import { mergeGuideEntries } from "../guide-content.ts";
import {
  displayWorkCatalog,
  workMatchesService,
  type WorkItem,
} from "../work-catalog.ts";
import type { ContentServiceId, CsWorkCard } from "./types.ts";

/** FACTS_AI_INFLUENCER.md: 87언니(자체 AI 가상인물)가 출연한 제안용 시안 3편. 어느 페이지에서든 이 라벨. */
const aiPersonDraft =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        slugs: ["bwl-aqua-ad", "bwl-cplus-ad", "bwl-cleanser-ad"],
        label: "87언니(AI 가상인물) 출연 · 제안용 시안",
      }
    : { slugs: [] as string[], label: "" };

/** 서비스 고유 섹션에 실물을 붙이는 작품(R6·R7). 같은 서비스의 사례 목록에서는 placement 표시로 뺀다.
 * 모션그래픽 캐릭터 제작 사례(검토판)가 30초 광고 3편을 쓰고, SNS 광고 시그니처(R7)도 같은 작품의 9:16 3편을 쓴다.
 * placement가 붙은 작품은 목록 상한 계산에서 뺀다(광고 작품이 늘어도 잘리지 않는다). */
type SectionWork = {
  slug: string;
  placement: NonNullable<CsWorkCard["placement"]>;
  labels?: NonNullable<CsWorkCard["signatureLabels"]>;
};
const sectionWork: Partial<Record<ContentServiceId, SectionWork>> =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        "motion-graphics": { slug: "yofree-mg30", placement: "character-case" },
        /* 시그니처 3장면 이름: 9:16 3편(S1·S2·S3)의 톤을 설명하는 고객명 없는 문구. 공개 번들에 들어가지 않게 서버 데이터로만 둔다 */
        ad: {
          slug: "yofree-mg30",
          placement: "ad-signature",
          labels: ["가벼운 키네틱 톤", "한지와 먹의 프리미엄 톤", "웹툰 모션코믹 톤"],
        },
      }
    : {};

/** SNS 광고 히어로 레일 앞칸에 9:16 포스터를 먼저 두는 작품(30초 3편 → 4안 순). 배열 순서가 곧 레일 순서다 */
const adRailLead: readonly string[] =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" ? ["yofree-mg30", "yofree-mg-short"] : [];

const isPortraitVideo = (m: WorkItem["media"][number]) => m.kind === "video" && m.presentation === "portrait";

/** 서비스 사례 기본 상한 */
const MAX_WORKS = 4;
/** 서비스별 상한(없으면 MAX_WORKS, placement 작품은 세지 않는다). SNS 광고는 AI 가상인물 시안 3편 · 모션 광고 1편 등 목록 5건까지 보인다(R6: 브랜드 광고 30초 시안은 primaryService를 brand-film으로 옮겨 브랜드 홍보 페이지로 이동). */
const MAX_WORKS_BY_SERVICE: Partial<Record<ContentServiceId, number>> = {
  ad: 5,
};

export function maxContentWorks(id: ContentServiceId): number {
  return MAX_WORKS_BY_SERVICE[id] ?? MAX_WORKS;
}

export function workLabel(work: WorkItem): string {
  return aiPersonDraft.slugs.includes(work.slug)
    ? aiPersonDraft.label
    : work.productionStatus;
}

function toCard(work: WorkItem, service: ContentServiceId): CsWorkCard {
  const section = sectionWork[service];
  const placed = section && section.slug === work.slug ? section : undefined;
  const portraitVideos = work.media.filter(isPortraitVideo).length;
  return {
    slug: work.slug,
    brand: work.brand,
    title: work.title,
    scope: work.scope,
    label: workLabel(work),
    href: `/content/projects/${work.slug}?service=${service}`,
    ...(placed ? { placement: placed.placement } : service === "ai-influencer" && aiPersonDraft.slugs.includes(work.slug) ? { placement: "ai-product" as const } : {}),
    ...(placed?.labels ? { signatureLabels: placed.labels } : {}),
    ...(service === "ad" && adRailLead.includes(work.slug) ? { railLead: true as const } : {}),
    ...(service === "ad" && !placed && portraitVideos > 1 ? { variantLabel: `${portraitVideos}안` } : {}),
    media: work.media.map((m) => ({
      kind: m.kind,
      src: m.src,
      alt: m.alt,
      ...(m.poster ? { poster: m.poster } : {}),
      ...(m.width ? { width: m.width } : {}),
      ...(m.height ? { height: m.height } : {}),
      ...(m.presentation ? { presentation: m.presentation } : {}),
    })),
  };
}

/** 카탈로그에서 서비스 사례를 고른다(순수 함수, 테스트가 고정 데이터로 직접 부른다).
 * 1) placement가 붙은 작품은 상한에서 빼고 앞에 둔다(시그니처·고유 섹션이 쓴다. 사례 목록은 service-landing이 거른다).
 * 2) 나머지는 영상 우선(웹툰은 웹툰 미디어 우선) → SNS 광고는 9:16 영상이 많은 순 → order로 정렬해 상한까지 자른다. */
export function pickContentWorks(id: ContentServiceId, catalog: WorkItem[]): CsWorkCard[] {
  const preferred = (work: WorkItem) =>
    Number(
      id === "webtoon"
        ? work.media[0]?.kind === "webtoon"
        : work.media[0]?.kind === "video",
    );
  const portraitCount = (work: WorkItem) => (id === "ad" ? work.media.filter(isPortraitVideo).length : 0);
  const eligible = catalog
    .filter((work) => workMatchesService(work, id, "video"))
    .filter((work) => work.media.length > 0)
    .filter((work) => work.productionStatus !== "제작 예시")
    .sort((a, b) => preferred(b) - preferred(a) || portraitCount(b) - portraitCount(a) || a.order - b.order);
  const placedSlug = sectionWork[id]?.slug;
  const placed = eligible.filter((work) => work.slug === placedSlug);
  const listed = eligible.filter((work) => work.slug !== placedSlug).slice(0, maxContentWorks(id));
  return [...placed, ...listed].map((work) => toCard(work, id));
}

/** 서비스에 맞는 사례: 목록 최대 maxContentWorks(id)개(기본 4, SNS 광고 5)에 placement 작품을 더한다. 기본 빌드는 []. */
export async function selectContentWorks(
  id: ContentServiceId,
): Promise<CsWorkCard[]> {
  const catalog = displayWorkCatalog(
    mergeGuideEntries(await publicEntries("reference", "video"), "reference", "video"),
  );
  return pickContentWorks(id, catalog);
}
