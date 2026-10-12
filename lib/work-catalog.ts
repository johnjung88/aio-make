import type { Entry } from "./db";
import { divisions, services, type DivisionId } from "./content.ts";
import { preparedWorkMedia } from "./prepared-work-media.ts";

export type WorkMedia = {
  kind: "image" | "video" | "webtoon";
  src: string;
  alt: string;
  poster?: string;
  mobileSrc?: string;
  width?: number;
  height?: number;
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

const workDetails: Record<string, { purpose: string; scope: string; relatedServices?: WorkItem["relatedServices"] }> = {
  "bwl-store": { purpose: "스킨케어 브랜드의 분위기를 유지하면서 제품을 찾고 비교할 수 있도록 구성했습니다", scope: "브랜드 소개, 제품 탐색과 상세 화면, PC·모바일 반응형 디자인을 제작했습니다 공개된 레퍼런스 사이트이며 주문·결제 기능은 운영하지 않습니다" },
  "healernet-website": { purpose: "힐러넷의 회사 소개와 연구 방향을 요프리 제품 소개로 연결했습니다", scope: "회사·제품 정보 구조와 반응형 웹 화면을 설계한 시안입니다 실제 시설을 촬영한 기록이나 최종 배포본을 의미하지 않습니다" },
  "bwl-brand-motion": { purpose: "여러 스킨케어 제품과 브랜드 메시지를 한 편의 짧은 영상에 담았습니다", scope: "제품 이미지, 타이포그래피, 장면 전환을 구성한 30초 가로 모션그래픽입니다" },
  "healernet-motion": { purpose: "연구에서 제품으로 이어지는 회사의 메시지를 영상으로 풀었습니다", scope: "30초 가로판과 15초 세로판을 제작했습니다 아래에서 두 화면 비율을 확인할 수 있습니다" },
  "bwl-brand-webtoon": { purpose: "제품을 고르는 소비자의 고민을 일상적인 장면과 대화로 표현했습니다", scope: "8컷의 브랜드 이야기를 4페이지로 구성한 웹툰 시안입니다" },
  "bwl-aqua-webtoon": { purpose: "바쁜 일상 속 피부 관리 이야기를 제품 소개와 연결했습니다", scope: "아쿠아 부스트 세럼 10을 주제로 6컷·3페이지의 웹툰을 제작했습니다" },
  "yofree-outing-webtoon": { purpose: "가족의 외출에서 시작하는 일상 이야기를 브랜드 웹툰으로 구성했습니다", scope: "장면과 대사를 5페이지의 읽는 흐름으로 정리했습니다 제품 관련 표현은 고객 검토 전 시안입니다" },
  "yofree-night-webtoon": { purpose: "가족의 대화와 밤의 일상을 중심으로 제품 이야기를 풀었습니다", scope: "창작 장면을 포함한 6페이지 웹툰 시안입니다 제품 효능 표현은 확인 대기 상태입니다" },
  "bwl-brand-ad": { purpose: "브랜드 이미지와 제품 장면을 연결해 짧은 광고의 흐름을 만들었습니다", scope: "16:9 브랜드 광고의 기획과 편집 시안입니다", relatedServices: [{division:"video",id:"brand-film"}] },
  "bwl-aqua-ad": { purpose: "아쿠아 부스트 세럼 10의 사용 장면을 세로 광고로 구성했습니다", scope: "인물과 제품이 등장하는 9:16 영상의 장면 구성과 편집 시안입니다", relatedServices: [{division:"video",id:"ai-influencer"}] },
  "bwl-cplus-ad": { purpose: "C Plus 세럼 7S를 소개하는 인물 중심의 세로 영상을 구성했습니다", scope: "제품 소개 장면을 연결한 9:16 광고 편집 시안입니다", relatedServices: [{division:"video",id:"ai-influencer"}] },
  "bwl-cleanser-ad": { purpose: "클렌저 1의 제품 소개를 일상적인 사용 장면으로 풀었습니다", scope: "인물과 제품을 중심으로 구성한 9:16 광고 편집 시안입니다", relatedServices: [{division:"video",id:"ai-influencer"}] },
  "bwl-editorial": { purpose: "제품마다 어울리는 색과 배경으로 쇼핑몰 상세 이미지의 방향을 제안했습니다", scope: "제품 에디토리얼 이미지 15장입니다 생성 이미지의 제품 라벨과 세부 표기는 최종 확인 전입니다" },
  "yofree-outing-motion": { purpose: "외출편 웹툰을 영상으로 볼 수 있도록 장면의 움직임과 읽는 속도를 설계했습니다", scope: "기존 웹툰을 세로 모션그래픽으로 재구성한 v04 검토본입니다", relatedServices: [{division:"video",id:"webtoon"}] },
  "yofree-night-motion": { purpose: "밤편 웹툰의 장면과 대화를 모션 코믹으로 이어 붙였습니다", scope: "6페이지 웹툰을 42장면으로 재구성한 세로 영상의 내부 검토본입니다", relatedServices: [{division:"video",id:"webtoon"}] },
  "yofree-mg-short": { purpose: "선물과 제품 소개라는 두 메시지를 서로 다른 움직임으로 표현했습니다", scope: "두 콘셉트에 각각 절제형·다이내믹형을 적용한 세로 모션그래픽 4안을 제작했습니다" },
  "yofree-mg30": { purpose: "같은 제품을 타이포그래피, 제품 이미지, 모션 코믹으로 각각 소개했습니다", scope: "세 시나리오의 가로·세로 모션그래픽 출력 4개입니다 제품 효능 표현은 확인 대기 상태입니다" },
  "yofree-shop": { purpose: "요프리의 브랜드와 제품 정보를 구매 동선에 맞춰 정리했습니다", scope: "홈·브랜드·제품·원리·고객센터와 루틴·선물 동선을 제작한 고객 시연입니다 실제 주문·결제와 판매 조건은 확정 전입니다" },
};

const featuredReviewSlugs = ["bwl-brand-motion", "yofree-outing-webtoon", "bwl-store", "healernet-website", "yofree-shop", "bwl-brand-webtoon"];
export const reviewWorks: WorkItem[] = reviewWorkMetadata.map((work, index) => ({
  ...work,
  relatedServices: workDetails[work.slug]?.relatedServices ?? [],
  canonicalPath: `/work/${work.slug}`,
  purpose: workDetails[work.slug]?.purpose ?? work.description,
  scope: workDetails[work.slug]?.scope ?? work.description,
  media: preparedWorkMedia[work.slug] ?? [],
  visibility: "review",
  order: (featuredReviewSlugs.includes(work.slug) ? featuredReviewSlugs.indexOf(work.slug) : index + featuredReviewSlugs.length) * 10,
}));

// Only the explicit local review build includes customer work pending release.
// Search feeds always use publicWorkCatalog, never this display helper.
export const localReferenceReview = process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1";
export function displayWorkCatalog(entries: Entry[]): WorkItem[] {
  const published = publicWorkCatalog(entries);
  return (localReferenceReview ? [...reviewWorks, ...published] : published)
    .sort((a, b) => Number(a.productionStatus === "제작 예시") - Number(b.productionStatus === "제작 예시") || a.order - b.order || a.id.localeCompare(b.id));
}

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
