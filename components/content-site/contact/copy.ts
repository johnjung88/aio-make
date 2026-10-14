/* /content/contact 고정 문구(순수 데이터, 카피 테스트 tests/content-contact.test.mjs 대상).
 * 가격 기준 3줄은 lib/content-pricing.ts의 PRICING_COMMON_LINES를 그대로 쓴다 */

export const CONTACT_COPY = {
  hero: {
    eyebrow: "CONTACT",
    title: "어떤 컨텐츠가\n필요하신가요?",
    lead: "서비스를 고르고 만들고 싶은 내용을 남겨주세요 담당자가 범위와 견적을 안내합니다",
  },
  chooser: {
    legend: "요청 서비스",
    required: "필수",
    hint: "아직 정하지 못했다면 가까운 서비스를 고르고 고민하는 점을 적어주세요",
    missing: "요청 서비스를 하나 골라주세요",
  },
  basis: {
    title: "가격 기준",
  },
  inquiry: {
    title: "만들고 싶은 내용을\n알려주세요",
    lead: "고른 서비스와 함께 문의가 접수됩니다",
    placeholder: "예: 신제품을 알릴 30초 영상이 필요해요",
  },
} as const;
