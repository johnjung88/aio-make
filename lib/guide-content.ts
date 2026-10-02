import { creativeAsset } from "./creative-assets.ts";
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
    "브랜드와 상품, 고객이 자주 묻는 질문, 현재 운영 채널과 문의 경로를 준비해주세요 기존 콘텐츠와 채널 데이터가 있다면 현재 상태를 함께 확인합니다\n\n원본 콘텐츠 수량과 채널별 게시 수량은 구분합니다 운영할 채널과 월간 제작 범위를 먼저 정하고, 다음 달에는 콘텐츠와 문의 흐름을 함께 점검합니다\n\n통합 운영은 월 200만 원부터, SNS 운영과 AI 인플루언서 마케팅은 각각 월 100만 원이며 VAT는 별도입니다 통합 운영은 최소 3개월을 기준으로 범위를 협의합니다 검색 개선 서비스도 이용할 수 있습니다",
  ],
  development: [
    "개발 상담 전에 준비할 자료",
    "현재 반복하는 업무와 불편한 점을 알려주세요 웹사이트라면 필요한 페이지, 문의·예약·결제·회원 기능과 관리 방식을 정리합니다 자동화라면 입력 자료와 최종 결과물을 함께 확인합니다\n\n기능, 외부 서비스 연결, 데이터 처리와 접근 권한이 작업 범위를 결정합니다 가격과 납기, 납품 후 지원 범위는 요구사항을 확인한 뒤 견적에서 정합니다\n\n계정 비밀번호를 문의 양식에 적지 마세요 연결이 필요한 서비스 이름과 현재 사용 여부만 알려주시면 됩니다",
  ],
  video: [
    "영상 제작 전에 준비할 자료",
    "영상의 목적, 게시할 채널과 시청자가 기억할 한 가지를 알려주세요 로고, 제품 이미지, 참고 영상과 꼭 넣어야 할 문구가 있으면 함께 준비합니다\n\n웹툰, 애니메이션, AI 인플루언서, 브랜드 홍보, SNS 광고, 편집 작업은 결과물의 형태가 서로 다릅니다 길이와 화면 비율, 편수, 수정 범위와 사용할 소재의 권리를 먼저 합의합니다\n\n사이트의 생성 이미지와 가이드 발췌 이미지는 제작 방향을 설명하는 예시입니다 영상 단가와 회차별 분량은 상담 후 안내합니다",
  ],
};
const workflow: Record<string, string> = {
  marketing:
    "먼저 브랜드의 고객, 고객이 자주 묻는 질문과 현재 유입·문의 경로를 확인합니다 통합 마케팅, SNS 운영, AI 인플루언서와 검색 개선 중 필요한 범위를 골라 운영 계획을 정합니다\n\n영상이나 이미지의 원본 수량과 각 채널의 게시 건수는 별도로 합의합니다 월간 주제와 제작 일정, 고객의 검토 시점, 광고 매체비·촬영 등 별도 비용을 구분한 뒤 제작과 게시를 진행합니다\n\n운영 보고에서는 실제 게시 내역과 확인할 수 있는 채널 반응·사이트 문의를 살펴봅니다 검색 순위나 매출 수치를 보장하지 않으며, 확인한 반응을 다음 달 콘텐츠와 운영 계획에 반영합니다",
  development:
    "상담에서 필요한 페이지와 사용자가 할 일을 정합니다 웹사이트·쇼핑몰·업무 자동화·프로그램에 따라 화면, 데이터, 로그인 권한과 외부 서비스 연결 범위를 확인합니다\n\n기본 제작 범위와 추가 기능, 서버·유료 서비스 비용, 제공할 자료와 검토 일정을 견적에서 구분합니다 Cafe24 작업의 상품 등록·PG·배송 설정처럼 기본 범위에 포함되지 않는 항목도 착수 전에 확인합니다\n\n구현 후에는 PC·모바일 화면과 실제 입력→저장→조회 흐름을 검수합니다 기능 오류와 미연결 상태를 확인하고, 합의한 소스·파일과 운영 방법을 인계합니다 배포 계정과 접근 권한은 별도 안전한 절차로 연결합니다",
  video:
    "목적과 게시 채널을 먼저 확인하고 웹툰·애니메이션·AI 인플루언서·브랜드 영상·SNS 광고·편집 중 적합한 형식을 고릅니다 길이, 화면 비율, 편수·회차와 사용할 자료의 권리를 정합니다\n\n시나리오와 장면 구성, 캐릭터나 브랜드 표현을 확인한 뒤 제작합니다 AI 생성 장면도 인물·제품·자막과 장면 연결이 기획에 맞는지 검수합니다\n\n고객 확인과 수정은 계약 전에 합의한 단계·범위를 따릅니다 최종 규격, 원본 파일 포함 여부, 게시·광고 활용 범위와 소재 라이선스를 확인한 뒤 결과물을 인계합니다",
};
const consultationOpening: Record<string, string> = {
  marketing:
    "마케팅 상담에는 상품과 주 고객, 현재 운영 중인 채널, 월간 제작·게시 현황과 문의 경로를 알려주세요 조회수·문의·매출 중 어떤 문제를 해결하려는지와 확인 가능한 자료를 함께 정리하면 범위를 정하는 데 도움이 됩니다",
  development:
    "개발 상담에는 필요한 페이지 또는 반복 업무, 현재 사용하는 프로그램과 입력·출력 자료를 알려주세요 회원·결제·예약·관리자 기능과 외부 연결 여부를 구분하면 필요한 기능과 견적 범위를 구체화할 수 있습니다",
  video:
    "영상 상담에는 게시할 채널, 영상의 목적, 길이·화면 비율·편수와 참고 자료를 알려주세요 로고·제품 사진·기존 촬영본의 보유 여부와 사용 권리, 꼭 들어갈 메시지를 함께 확인합니다",
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
    updated_at:
      type === "insight" && ["process", "consultation"].includes(slug)
        ? "2026-10-02T00:00:00+09:00"
        : "2026-10-01T00:00:00Z",
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
            `${service.description}\n\n상담에서 목적과 현재 자료를 확인하고, 결과물과 작업 범위, 일정과 수정 기준을 먼저 정합니다`,
            creativeAsset(d.id, service.id),
          ),
          service: service.id,
          ...(d.id === "video" && service.id === "webtoon"
            ? {
                title: "1억의 구단주 · 웹툰 제작",
                summary:
                  "《1억의 구단주》로 살펴보는 캐릭터와 장면 연출, 웹툰 제작 레퍼런스",
                body: "《1억의 구단주》에 적용한 캐릭터와 장면 연출을 살펴보세요 웹툰 서비스에서 소개한 제작 레퍼런스입니다\n\n시나리오를 바탕으로 인물의 표정과 대사, 배경과 장면 흐름을 구성합니다 캐릭터 설정부터 연출과 최종 이미지까지 한 회차씩 완성하며, 1회분은 완성 이미지 24컷을 기준으로 제작합니다",
                cover_url: "/images/guide/webtoon-svc-webtoon-cut01.webp",
              }
            : {}),
        }));
      return [
        base(
          d.id,
          type,
          "preparation",
          preparation[d.id][0],
          "상담에 필요한 자료와 범위를 정리하는 방법을 안내합니다",
          preparation[d.id][1],
          images[d.id],
        ),
        base(
          d.id,
          type,
          "process",
          `${d.label} 기획부터 검수와 인계까지`,
          `${d.label} 작업의 범위 합의, 제작·검수와 결과물 인계 과정을 안내합니다`,
          workflow[d.id],
          "/images/guide/hero/team-meeting.jpg",
        ),
        base(
          d.id,
          type,
          "consultation",
          `${d.label} 상담에서 확인하는 목적과 결과물`,
          `${d.label} 의뢰 전에 정리할 현재 상황, 참고 자료와 필요한 결과물을 확인하세요`,
          consultationOpening[d.id] +
            "\n\n서비스를 고르고 참고 자료와 희망 일정, 연락 가능한 이메일 또는 전화번호를 입력합니다 보내주신 내용으로 범위를 확인한 뒤 견적과 일정을 안내합니다 문의만으로 계약이 체결되지는 않습니다\n\n고객 개인정보, 서비스 키와 계정 비밀번호는 문의 내용에 넣지 마세요 연결은 별도 절차로 확인합니다",
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
