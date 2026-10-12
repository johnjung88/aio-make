import type { Entry } from "./db";
import { divisions, services, type DivisionId } from "./content";

export type WorkMedia = {
  kind: "image" | "video" | "webtoon";
  src: string;
  alt: string;
  poster?: string;
  mobileSrc?: string;
  presentation?: "site" | "wide" | "portrait" | "webtoon" | "square";
};

export type WorkItem = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  primaryService: string;
  relatedServices: { division: DivisionId; id: string }[];
  division: DivisionId;
  canonicalPath: string;
  description: string;
  purpose: string;
  scope: string;
  media: WorkMedia[];
  productionStatus: "제작 예시" | "제작 후보" | "제작 완료" | "운영 중";
  visibility: "public" | "review";
  order: number;
};

// Customer work stays out of public pages and the sitemap until publication rights
// and the exact representative assets are recorded in the project work register.
const reviewWorkMetadata: {
  id: string; slug: string; brand: string; title: string; division: DivisionId;
  primaryService: string; productionStatus: WorkItem["productionStatus"]; description: string;
}[] = [
  { id: "AIO-WORK-BWL-STORE-01", slug: "bwl-store", brand: "BWL · DR's Secret", title: "DR's Secret 쇼핑몰 레퍼런스", division: "development", primaryService: "shopping-mall", productionStatus: "제작 완료", description: "브랜드 소개와 제품 탐색을 연결한 정적 쇼핑몰 레퍼런스. 실제 주문과 결제는 받지 않습니다." },
  { id: "AIO-WORK-HEALERNET-SITE-01", slug: "healernet-website", brand: "힐러넷", title: "힐러넷 기업 웹사이트 시안", division: "development", primaryService: "website", productionStatus: "제작 후보", description: "회사 소개, 연구 방향과 제품을 연결한 웹사이트 검토 시안입니다." },
  { id: "AIO-WORK-BWL-MOTION-01", slug: "bwl-brand-motion", brand: "BWL · DR's Secret", title: "브랜드 모션그래픽", division: "video", primaryService: "brand-film", productionStatus: "제작 완료", description: "제품군과 브랜드 문구를 30초 그래픽 흐름으로 구성한 16:9 모션그래픽입니다." },
  { id: "AIO-WORK-HN-MOTION-01", slug: "healernet-motion", brand: "힐러넷", title: "회사 홍보 모션그래픽", division: "video", primaryService: "brand-film", productionStatus: "제작 후보", description: "연구에서 제품까지의 메시지를 가로와 세로 영상으로 구성한 후보입니다." },
  { id: "AIO-WORK-BWL-WEBTOON-01", slug: "bwl-brand-webtoon", brand: "BWL · DR's Secret", title: "장바구니는 꽉, 내 루틴은 물음표", division: "video", primaryService: "webtoon", productionStatus: "제작 후보", description: "브랜드편 웹툰 4페이지의 내부 검토본입니다." },
  { id: "AIO-WORK-YOFREE-WEBTOON-01", slug: "yofree-outing-webtoon", brand: "YoFree", title: "엄마가 자꾸 멈추는 이유", division: "video", primaryService: "webtoon", productionStatus: "제작 후보", description: "요프리 외출편 웹툰 5페이지의 내부 검토본입니다." },
  { id: "AIO-WORK-BWL-WEBTOON-02", slug: "bwl-aqua-webtoon", brand: "BWL · DR's Secret", title: "충전은 챙기면서", division: "video", primaryService: "webtoon", productionStatus: "제작 후보", description: "아쿠아 부스트 세럼 10 제품편 웹툰 3페이지의 내부 검토본입니다." },
  { id: "AIO-WORK-YOFREE-WEBTOON-02", slug: "yofree-night-webtoon", brand: "YoFree", title: "엄마, 오늘은 잘 잤어?", division: "video", primaryService: "webtoon", productionStatus: "제작 후보", description: "요프리 밤편 웹툰 6페이지의 내부 검토본입니다. 효능 표현은 확인 대기입니다." },
  { id: "AIO-WORK-BWL-AD-01", slug: "bwl-brand-ad", brand: "BWL · DR's Secret", title: "브랜드 광고 30초 시안", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "16:9 브랜드 광고의 제안용 편집 시안입니다." },
  { id: "AIO-WORK-BWL-AD-02", slug: "bwl-aqua-ad", brand: "BWL · DR's Secret", title: "아쿠아 세럼 영상 시안", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "아쿠아 부스트 세럼 10의 9:16 제안용 영상입니다." },
  { id: "AIO-WORK-BWL-AD-03", slug: "bwl-cplus-ad", brand: "BWL · DR's Secret", title: "C Plus 세럼 영상 시안", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "C Plus 세럼 7S의 9:16 제안용 영상입니다." },
  { id: "AIO-WORK-BWL-AD-04", slug: "bwl-cleanser-ad", brand: "BWL · DR's Secret", title: "클렌저 1 영상 시안", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "클렌저 1의 9:16 제안용 영상입니다." },
  { id: "AIO-WORK-BWL-EDITORIAL-01", slug: "bwl-editorial", brand: "BWL · DR's Secret", title: "제품 에디토리얼 이미지", division: "development", primaryService: "shopping-mall", productionStatus: "제작 후보", description: "쇼핑몰 판매 상세용 제품 이미지 15장의 원본입니다. 라벨 내용은 확인 대기입니다." },
  { id: "AIO-WORK-YOFREE-MOTION-01", slug: "yofree-outing-motion", brand: "YoFree", title: "외출편 웹툰 모션그래픽", division: "video", primaryService: "animation", productionStatus: "제작 후보", description: "요프리 외출편 웹툰을 움직이는 영상으로 재구성한 검토본입니다." },
  { id: "AIO-WORK-YOFREE-MOTION-02", slug: "yofree-night-motion", brand: "YoFree", title: "밤편 웹툰 모션그래픽", division: "video", primaryService: "animation", productionStatus: "제작 후보", description: "요프리 밤편 웹툰을 장면별로 재구성한 내부 검토본입니다." },
  { id: "AIO-WORK-YOFREE-AD-01", slug: "yofree-mg-short", brand: "YoFree", title: "밸런스 샷 모션그래픽 4안", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "두 콘셉트의 세로 광고 후보 4개 버전입니다." },
  { id: "AIO-WORK-YOFREE-AD-02", slug: "yofree-mg30", brand: "YoFree", title: "30초 광고 모션그래픽 3편", division: "video", primaryService: "ad", productionStatus: "제작 후보", description: "세 시나리오의 가로·세로 영상 후보 4개입니다." },
  { id: "AIO-WORK-YOFREE-SHOP-01", slug: "yofree-shop", brand: "YoFree", title: "쇼핑몰 고객 시연", division: "development", primaryService: "shopping-mall", productionStatus: "제작 후보", description: "브랜드와 제품 탐색 동선을 보여주는 고객 검토용 시연입니다. 실제 판매는 미실행입니다." },
];

const featuredReviewSlugs = ["bwl-brand-motion", "yofree-outing-webtoon", "bwl-store", "healernet-website"];
export const reviewWorks: WorkItem[] = reviewWorkMetadata.map((work, index) => ({
  ...work,
  relatedServices: [],
  canonicalPath: `/work/${work.slug}`,
  purpose: work.description,
  scope: work.description,
  media: [],
  visibility: "review",
  order: (featuredReviewSlugs.includes(work.slug) ? featuredReviewSlugs.indexOf(work.slug) : index + featuredReviewSlugs.length) * 10,
}));

export function workFromEntry(entry: Entry): WorkItem {
  const division = divisions.find((value) => value.id === entry.division);
  if (!division) throw new Error(`Unknown work division: ${entry.division}`);
  const service = services.find((value) => value.id === entry.service && value.division === entry.division);
  return {
    id: entry.id,
    slug: entry.slug,
    brand: entry.kind === "example" ? "AIO MAKE" : entry.title,
    title: entry.title,
    primaryService: entry.service,
    relatedServices: [],
    division: division.id,
    canonicalPath: `/${division.path}/work/${entry.slug}`,
    description: entry.summary,
    purpose: entry.summary,
    scope: service?.description ?? entry.summary,
    media: entry.cover_url ? [{ kind: "image", src: entry.cover_url, alt: `${entry.title} 대표 이미지` }] : [],
    productionStatus: entry.kind === "example" ? "제작 예시" : "제작 완료",
    visibility: entry.is_published && entry.rights_confirmed ? "public" : "review",
    order: entry.display_order,
  };
}

export function publicWorkCatalog(entries: Entry[]): WorkItem[] {
  const catalog = entries.map(workFromEntry).concat(reviewWorks);
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const work of catalog) {
    if (ids.has(work.id) || paths.has(work.canonicalPath)) throw new Error(`Duplicate work ID or URL: ${work.id}`);
    if (work.visibility === "public" && work.id.startsWith("AIO-WORK-") && (work.media.length === 0 || work.productionStatus === "제작 후보" || work.media.some((media) => !media.alt || !media.src.startsWith("/") || (media.kind === "video" && !media.poster)))) {
      throw new Error(`Public work requires verified media and a completed status: ${work.id}`);
    }
    ids.add(work.id);
    paths.add(work.canonicalPath);
  }
  return catalog.filter((work) => work.visibility === "public").sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function workMatchesService(work: WorkItem, service: string, division?: string) {
  return (work.primaryService === service && (!division || work.division === division)) || work.relatedServices.some((item) => item.id === service && (!division || item.division === division));
}
