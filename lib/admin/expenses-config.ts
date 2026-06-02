// 클라이언트/서버 공용 상수 (server-only 없음)
export const EXPENSE_CATEGORIES = [
  ["platform_fee", "플랫폼 수수료"],
  ["tools", "도구·구독"],
  ["marketing", "마케팅"],
  ["outsourcing", "외주"],
  ["tax_office", "세금·사무"],
  ["assets", "자산"],
  ["other", "기타"],
] as const;

export const RECURRING_CYCLES = [
  ["monthly", "월간"],
  ["quarterly", "분기"],
  ["yearly", "연간"],
  ["prepaid", "선결제"],
  ["custom", "커스텀"],
] as const;

export const PAYMENT_METHODS = [
  ["card_business", "사업 카드"],
  ["card_personal", "개인 카드"],
  ["bank_transfer", "계좌이체"],
  ["cash", "현금"],
  ["platform_credit", "플랫폼 크레딧"],
  ["other", "기타"],
] as const;
