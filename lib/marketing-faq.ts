import { servicePlans } from "./service-plans.ts";
const extra: Record<string, [string, string][]> = {
  integrated: [
    [
      "사이트도 만들어 주나요?",
      "월 운영 상품에는 기본 소개·문의 사이트 구축 또는 리뉴얼 1회가 포함됩니다\n페이지 수와 수정·유지 범위는 견적에서 정합니다",
    ],
    [
      "통합 마케팅은 월 얼마부터 시작하나요?",
      "월 200만 원부터이며 VAT 별도, 착수일부터 최소 3개월 기준입니다",
    ],
  ],
  sns: [
    [
      "SNS 대행 운영 비용은 어떻게 되나요?",
      "월 100만 원이며 VAT 별도, 월 갱신 기준입니다",
    ],
  ],
  "ai-influencer": [
    [
      "AI 인플루언서 운영은 월 얼마인가요?",
      "월 100만 원이며 VAT 별도, 월 갱신 기준입니다 월 8개 원본 제작과 채널 운영을 함께 다룹니다",
    ],
  ],
  seo: [
    [
      "SEO·AEO·GEO 작업은 무엇을 하나요?",
      "사이트 구조와 고객 질문을 정리하고 검색 엔진과 AI 답변이 참고할 정보를 소스·CMS에 적용합니다",
    ],
    [
      "비용은 어떻게 정해지나요?",
      "현재 환경과 자료를 보고 범위·견적·일정을 합의합니다 접근 가능한 환경을 확인한 뒤 견적을 드립니다",
    ],
  ],
};
export function marketingFaq(id: string): [string, string][] {
  return [...servicePlans[id].faq, ...(extra[id] ?? [])];
}
