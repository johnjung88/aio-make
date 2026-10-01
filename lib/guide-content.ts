import { divisions, divisionServices } from "./content.ts";
import type { Entry } from "./db";

// Editorial guides and clearly labelled examples are useful before a customer
// authorizes a case study. They are not inserted into the operational database.
const images: Record<string, string> = {
  marketing: "/renewal/marketing-content-v03.webp",
  development: "/images/guide/images/services/development-hero.png",
  video: "/renewal/brand-film-v03.webp",
};
const preparation: Record<string, [string, string]> = {
  marketing: [
    "마케팅 운영 전에 준비할 자료",
    "브랜드와 상품, 고객이 자주 묻는 질문, 현재 운영 채널과 문의 경로를 준비해주세요. 기존 콘텐츠와 채널 데이터가 있다면 현재 상태를 함께 확인합니다.\n\n원본 콘텐츠 수량과 채널별 게시 수량은 구분합니다. 운영할 채널과 월간 제작 범위를 먼저 정하고, 다음 달에는 콘텐츠와 문의 흐름을 함께 점검합니다.\n\n통합 운영은 월 200만 원부터, SNS 운영과 AI 인플루언서 마케팅은 각각 월 100만 원이며 VAT는 별도입니다. 통합 운영은 최소 3개월을 기준으로 범위를 협의합니다. 검색 개선만 필요한 경우 별도 견적을 안내합니다.",
  ],
  development: [
    "개발 상담 전에 준비할 자료",
    "현재 반복하는 업무와 불편한 점을 알려주세요. 웹사이트라면 필요한 페이지, 문의·예약·결제·회원 기능과 관리 방식을 정리합니다. 자동화라면 입력 자료와 최종 결과물을 함께 확인합니다.\n\n기능, 외부 서비스 연결, 데이터 처리와 접근 권한이 작업 범위를 결정합니다. 가격과 납기, 납품 후 지원 범위는 요구사항을 확인한 뒤 견적에서 정합니다.\n\n계정 비밀번호를 문의 양식에 적지 마세요. 연결이 필요한 서비스 이름과 현재 사용 여부만 알려주시면 됩니다.",
  ],
  video: [
    "영상 제작 전에 준비할 자료",
    "영상의 목적, 게시할 채널과 시청자가 기억할 한 가지를 알려주세요. 로고, 제품 이미지, 참고 영상과 꼭 넣어야 할 문구가 있으면 함께 준비합니다.\n\n웹툰, 애니메이션, AI 인플루언서, 브랜드 홍보, SNS 광고, 편집 작업은 결과물의 형태가 서로 다릅니다. 길이와 화면 비율, 편수, 수정 범위와 사용할 소재의 권리를 먼저 합의합니다.\n\n사이트의 생성 이미지와 가이드 발췌 이미지는 제작 방향을 설명하는 예시입니다. 영상 단가와 회차별 분량은 상담 후 안내합니다.",
  ],
};
function base(
  division: string,
  type: Entry["type"],
  slug: string,
  title: string,
  summary: string,
  body: string,
  cover: string,
): Entry {
  return {
    id: `guide-${division}-${slug}`,
    type,
    division,
    service: "",
    slug,
    title,
    summary,
    body,
    cover_url: cover,
    video_url: "",
    kind: "example",
    rights_confirmed: true,
    is_published: true,
    is_featured: false,
    display_order: 0,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-01T00:00:00Z",
  };
}
export function guideEntries(type: Entry["type"], division?: string): Entry[] {
  return divisions
    .filter((d) => !division || d.id === division)
    .flatMap((d) => {
      if (type === "reference")
        return divisionServices(d.id).map((service) => ({
          ...base(
            d.id,
            type,
            `example-${service.id}`,
            `${service.name.replace(/ 제작$/, "")} 제작 방향`,
            service.description,
            `이 항목은 고객 납품 실적이 아닌 제작 방향 예시입니다.\n\n${service.description}\n\n상담에서 목적과 현재 자료를 확인하고, 결과물과 작업 범위, 일정과 수정 기준을 먼저 정합니다. 생성 이미지 및 제공된 가이드 화면은 콘셉트를 설명하는 용도로 사용합니다. 실제 공개 사례는 고객의 공개 확인을 받은 뒤 별도로 등록합니다.`,
            service.id === "webtoon"
              ? "/renewal/webtoon-sample.webp"
              : service.id === "animation"
                ? "/renewal/animation-sample.webp"
                : service.id === "ai-influencer"
                  ? "/renewal/influencer-sample.webp"
                  : service.id === "website"
                    ? "/images/guide/portfolio/corp-novatek/live.png"
                    : service.id === "shopping-mall"
                      ? "/images/guide/images/portfolio/ws-shop-desktop.png"
                      : images[d.id],
          ),
          service: service.id,
        }));
      return [
        base(
          d.id,
          type,
          "preparation",
          preparation[d.id][0],
          "상담에 필요한 자료와 범위를 정리하는 방법을 안내합니다.",
          preparation[d.id][1],
          images[d.id],
        ),
        base(
          d.id,
          type,
          "process",
          "기획부터 검수와 인계까지",
          "작업 전에 기준을 맞추고, 완성된 결과를 확인하는 과정입니다.",
          "상담에서 목표와 결과물을 정리합니다. 범위, 일정, 수정 기준과 외부 서비스 사용 조건은 착수 전에 맞춥니다.\n\nAI로 반복 작업과 초안의 효율을 높이고, 제작 결과는 사람이 확인합니다. 화면은 실제 브라우저에서 살펴보고, 기능은 요청부터 저장과 조회까지 검증합니다.\n\n완료 시 합의한 파일과 사용 방법을 인계합니다. 추가 작업과 유지보수는 처음 합의한 범위를 기준으로 안내합니다.",
          "/images/guide/hero/team-meeting.jpg",
        ),
        base(
          d.id,
          type,
          "consultation",
          "상담에서 확인하는 목적과 결과물",
          "정리되지 않은 아이디어도 현재 상황부터 이야기할 수 있습니다.",
          "먼저 해결하고 싶은 문제를 한 문장으로 알려주세요. 현재 사이트나 채널, 사용 중인 도구와 불편한 지점을 함께 알려주시면 좋습니다.\n\n필요한 분야를 고르고 참고 자료와 희망 일정, 연락 가능한 이메일 또는 전화번호를 입력합니다. 보내주신 내용으로 범위를 확인한 뒤 견적과 일정을 안내합니다.\n\n고객 개인정보, 서비스 키와 계정 비밀번호는 문의 내용에 넣지 마세요. 연결은 별도 절차로 확인합니다.",
          "/images/guide/images/cards/card-marketing.jpg",
        ),
      ];
    });
}
export function mergeGuideEntries(
  published: Entry[],
  type: Entry["type"],
  division?: string,
) {
  const slugs = new Set(published.map((e) => `${e.division}/${e.slug}`));
  return [
    ...published,
    ...guideEntries(type, division).filter(
      (e) => !slugs.has(`${e.division}/${e.slug}`),
    ),
  ];
}
