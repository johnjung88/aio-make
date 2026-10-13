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

/** 서비스 사례 기본 상한 */
const MAX_WORKS = 4;
/** 서비스별 상한(없으면 MAX_WORKS). SNS 광고는 명세 6-4 매핑(AI 가상인물 시안 3편 · 브랜드 광고 1편 · 모션 광고 2편) 6편을 모두 보인다. */
const MAX_WORKS_BY_SERVICE: Partial<Record<ContentServiceId, number>> = {
  ad: 6,
};

export function maxContentWorks(id: ContentServiceId): number {
  return MAX_WORKS_BY_SERVICE[id] ?? MAX_WORKS;
}

export function workLabel(work: WorkItem): string {
  return aiPersonDraft.slugs.includes(work.slug)
    ? aiPersonDraft.label
    : work.productionStatus;
}

function toCard(work: WorkItem): CsWorkCard {
  return {
    slug: work.slug,
    brand: work.brand,
    title: work.title,
    scope: work.scope,
    label: workLabel(work),
    href: `/work/${work.slug}`,
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

/** 서비스에 맞는 사례 최대 maxContentWorks(id)개(기본 4, SNS 광고 6. 웹툰은 웹툰 미디어 우선, 그 외는 영상 우선). 기본 빌드는 []. */
export async function selectContentWorks(
  id: ContentServiceId,
): Promise<CsWorkCard[]> {
  const catalog = displayWorkCatalog(
    mergeGuideEntries(await publicEntries("reference", "video"), "reference", "video"),
  );
  const preferred = (work: WorkItem) =>
    Number(
      id === "webtoon"
        ? work.media[0]?.kind === "webtoon"
        : work.media[0]?.kind === "video",
    );
  return catalog
    .filter((work) => workMatchesService(work, id, "video"))
    .filter((work) => work.media.length > 0)
    .filter((work) => work.productionStatus !== "제작 예시")
    .sort((a, b) => preferred(b) - preferred(a) || a.order - b.order)
    .slice(0, maxContentWorks(id))
    .map(toCard);
}
