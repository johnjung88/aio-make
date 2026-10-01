// Source: development BUSINESS_STRUCTURE_v12, DECISIONS_v10 and product v08.
// Prices are approved; delivery, revisions, support and VAT are agreed per quote.
const website = {
  title: "홈페이지 10만 원부터",
  summary:
    "1~9페이지 10만 원 · 10~20페이지 20만 원 · 21페이지 이상 30만 원부터 별도 문의 · 대시보드 +3만 원",
  lines: [
    "1~9페이지: 100,000원",
    "10~20페이지: 200,000원 (20페이지 포함)",
    "21페이지 이상: 300,000원부터 · 별도 문의",
    "대시보드 추가: +30,000원 · 기능 범위 사전 합의",
    "첨부 이미지 자료가 없으면 AI 이미지 제작·적용 포함",
  ],
};
const shop = {
  title: "카페24 복사 15만 원 · 풀 세팅 30만 원",
  summary: "단순 복사 150,000원 · 풀 세팅 300,000원 · 상품등록·오픈설정 제외",
  lines: [
    "단순 복사: 완성 템플릿의 디자인 복사 · 150,000원",
    "풀 세팅: 복사 + 기본 로고·배너 등 이미지 제작·적용 · 300,000원",
    "두 상품은 각각의 총가격이며 합산하지 않습니다",
    "상품등록·PG·배송 등 오픈설정은 포함되지 않습니다",
    "실제 선택 템플릿의 이용권과 PC·모바일 지원 범위 확인",
  ],
};
const quoted = {
  title: "범위 확인 후 견적",
  summary: "요청별 개별 견적",
  lines: [],
};
export const developmentQuoteTerms =
  "VAT 포함 여부, 외부 서비스 비용, 납기·수정·지원·결제 일정은 개별 견적에서 정합니다.";
export function developmentOffer(service: string) {
  return service === "website"
    ? website
    : service === "shop" || service === "shopping-mall"
      ? shop
      : quoted;
}
