import type { Entry } from "./db";
import { divisions, services, type DivisionId } from "./content";

export type WorkMedia = {
  kind: "image" | "video" | "webtoon";
  src: string;
  alt: string;
  poster?: string;
};

export type WorkItem = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  primaryService: string;
  relatedServices: string[];
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
export const reviewWorks: WorkItem[] = [
  {
    id: "AIO-WORK-BWL-STORE-01",
    slug: "bwl-store",
    brand: "BWL · DR's Secret",
    title: "DR's Secret 쇼핑몰 레퍼런스",
    primaryService: "shopping-mall",
    relatedServices: ["website", "brand-film", "webtoon"],
    division: "development",
    canonicalPath: "/work/bwl-store",
    description: "제품 탐색과 브랜드 소개를 함께 살펴볼 수 있는 쇼핑몰 레퍼런스",
    purpose: "브랜드와 제품 정보를 한 흐름에서 탐색할 수 있도록 구성",
    scope: "쇼핑몰 화면과 제품 상세, 영상 적용",
    media: [],
    productionStatus: "제작 완료",
    visibility: "review",
    order: 10,
  },
  {
    id: "AIO-WORK-HEALERNET-SITE-01",
    slug: "healernet-website",
    brand: "힐러넷",
    title: "힐러넷 기업 웹사이트 시안",
    primaryService: "website",
    relatedServices: ["brand-film"],
    division: "development",
    canonicalPath: "/work/healernet-website",
    description: "연구부터 제품까지의 방향을 설명하는 기업 웹사이트 검토 시안",
    purpose: "기업과 제품 정보를 연구·협력 문의로 연결",
    scope: "대표 화면 시안과 콘텐츠 연결 검토",
    media: [],
    productionStatus: "제작 후보",
    visibility: "review",
    order: 20,
  },
];

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

export function workMatchesService(work: WorkItem, service: string) {
  return work.primaryService === service || work.relatedServices.includes(service);
}
