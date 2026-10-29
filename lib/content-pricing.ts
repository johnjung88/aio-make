/* 컨텐츠 서비스 가격(PRICING_FINAL_2026-10-14.md + 2026-10-19 사용자 v16 페이지 단위 변경). 모든 금액은 부가세 별도
 * 금액 리터럴은 이 파일에만 있다 lib/content-home.ts는 아래 이름을 그대로 re-export한다
 * SHOW_STARTING_PRICE가 /content 홈 시작가 표시의 유일한 끄기 스위치다
 * (서비스 페이지 가격 블록은 사용자 확정이라 이 스위치와 관계없이 항상 표시한다). */
import type { ContentServiceId } from "./content-site/types.ts";

export const SHOW_STARTING_PRICE = true;

/** v16 사용자 지정: 디지털 웹툰 1P의 제작 기준. 기존 25P 원고와 같은 규격입니다. */
export const WEBTOON_PAGE_STANDARD = {
  width: 1024,
  height: 1536,
  ratio: "2:3",
  label: "가로 1,024px × 세로 1,536px",
} as const;

export const contentPricing = {
  "ai-influencer": {
    plans: [
      { label: "캐릭터 1명 세팅 + 이미지 5장", amount: 100000 },
      { label: "세팅 + 30초 영상 1편", amount: 300000 },
      { label: "세팅 + 이미지 총 20장 + 30초 영상 4편", amount: 1000000 },
    ],
    notes: [
      "총 20장에 세팅용 이미지 포함 주 이미지 5장·영상 1편 구성 가능",
      "계정 게시·운영 및 대량 제작은 별도 견적",
    ],
  },
  "brand-film": {
    plans: [
      { label: "30초", amount: 250000 },
      { label: "60초", amount: 450000 },
    ],
  },
  animation: {
    plans: [
      { label: "30초", amount: 300000 },
      { label: "60초", amount: 550000 },
    ],
  },
  "motion-graphics": {
    plans: [
      { label: "단순형 30초", amount: 100000 },
      { label: "단순형 60초", amount: 180000 },
      { label: "맞춤형 30초", amount: 150000 },
      { label: "맞춤형 60초", amount: 270000 },
    ],
    notes: ["맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함"],
  },
  webtoon: {
    plans: [
      { label: "12P", amount: 100000 },
      { label: "24P", amount: 180000 },
    ],
  },
  "motion-comic": {
    plans: [
      { label: "30초", amount: 75000 },
      { label: "60초", amount: 120000 },
    ],
    bundles: [
      { label: "웹툰 12P + 모션코믹 30초", amount: 175000 },
      { label: "웹툰 24P + 모션코믹 60초", amount: 300000 },
    ],
    notes: ["기존 웹툰을 영상화하는 가격 웹툰 신규 제작은 별도"],
  },
  ad: {
    plans: [
      { label: "30초", amount: 250000 },
      { label: "60초", amount: 450000 },
    ],
    notes: [
      "제품·서비스 1개, 콘셉트 1개 기준 세로형 9:16·1080p, 기본 자막·BGM 포함",
      "다른 화면비 추가·광고 집행·계정 운영·매체비는 별도",
    ],
  },
  common: {
    vat: "부가세 별도",
    revisions: ["기획안 전달 후 수정 2회", "최종안 전달 후 수정 1회"],
    bulk: "브랜드 홍보영상·애니메이션·모션그래픽·웹툰·모션코믹·SNS 숏폼의 대량·정기 제작은 별도 견적",
  },
} as const;

/** 만 원 단위, 소수 첫째 자리까지 100000 → "10만 원", 75000 → "7.5만 원" */
export function formatWon(amount: number): string {
  const man = Math.round(amount / 1000) / 10;
  return `${Number.isInteger(man) ? man : man.toFixed(1)}만 원`;
}

export type StartingPrice = {
  amount: number;
  amountText: string;
  /** 굵게 보이는 앞부분 예: "25만 원부터", "12P 10만 원부터" */
  head: string;
  /** " · "로 이어지는 나머지 단위 마지막은 항상 "부가세 별도" */
  rest: string[];
  /** 화면 한 줄 전체 문자열 */
  line: string;
  note?: string;
};

const startingBasis: Record<
  ContentServiceId,
  { amount: number; prefix?: string; basis?: string; note?: string }
> = {
  webtoon: {
    amount: contentPricing.webtoon.plans[0].amount,
    prefix: "12P",
  },
  animation: {
    amount: contentPricing.animation.plans[0].amount,
    basis: "30초",
  },
  "ai-influencer": {
    amount: contentPricing["ai-influencer"].plans[0].amount,
    basis: "캐릭터 1명 세팅 + 이미지 5장",
  },
  "motion-graphics": {
    amount: contentPricing["motion-graphics"].plans[0].amount,
    basis: "단순형 30초",
  },
  "brand-film": {
    amount: contentPricing["brand-film"].plans[0].amount,
    basis: "30초",
  },
  ad: { amount: contentPricing.ad.plans[0].amount, basis: "30초" },
};

export function startingPrice(
  id: ContentServiceId,
  show: boolean = SHOW_STARTING_PRICE,
): StartingPrice | null {
  if (!show) return null;
  const s = startingBasis[id];
  if (!s) return null;
  const amountText = formatWon(s.amount);
  const head = `${s.prefix ? s.prefix + " " : ""}${amountText}부터`;
  const rest = [
    ...(s.basis ? [`${s.basis} 기준`] : []),
    contentPricing.common.vat,
  ];
  return {
    amount: s.amount,
    amountText,
    head,
    rest,
    line: [head, ...rest].join(" · "),
    ...(s.note ? { note: s.note } : {}),
  };
}

/* ---------------------------------------------------------------------------
 * 서비스 페이지 가격표(CsPricing)·문의 폼 '희망 구성'·JSON-LD offers가 함께 쓰는 구조
 * ------------------------------------------------------------------------- */

/** 모든 서비스 가격표 아래에 붙는 공통 주석(문장 그대로). */
export const PRICING_COMMON = {
  vat: "표시 금액은 모두 부가세 별도입니다",
  revisions: "기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다",
  bulk: "대량 제작과 정기 제작은 따로 견적을 드립니다",
} as const;

export const PRICING_COMMON_LINES: readonly string[] = [
  PRICING_COMMON.vat,
  PRICING_COMMON.revisions,
  PRICING_COMMON.bulk,
];

export type PricingPlan = {
  /** 문서 위임 클릭(data-plan)과 문의 폼 선택을 잇는 키 */
  key: string;
  /** 카드 제목(h3) */
  label: string;
  /** 문의 폼 '희망 구성' 선택지·JSON-LD Offer 이름(묶음 제목까지 붙인 전체 이름) */
  option: string;
  amount: number;
  bundle: boolean;
};

export type PricingGroup = {
  key: string;
  /** 묶음이 여러 개일 때만 있는 묶음 제목(웹툰) */
  title?: string;
  bundle: boolean;
  plans: PricingPlan[];
};

export type ServicePricing = {
  groups: PricingGroup[];
  /** PRICING_FINAL 해당 번호의 서비스별 주석 */
  notes: readonly string[];
};

type RawPlan = { readonly label: string; readonly amount: number };

function group(
  key: string,
  plans: readonly RawPlan[],
  options: { title?: string; bundle?: boolean; prefix?: string } = {},
): PricingGroup {
  const bundle = options.bundle ?? false;
  return {
    key,
    ...(options.title ? { title: options.title } : {}),
    bundle,
    plans: plans.map((plan, index) => ({
      key: `${key}-${index + 1}`,
      label: plan.label,
      option: options.prefix ? `${options.prefix} ${plan.label}` : plan.label,
      amount: plan.amount,
      bundle,
    })),
  };
}

/** 웹툰 서비스 페이지의 모션코믹 주석(서비스 명세 1-5 문장). */
const WEBTOON_NOTE =
  "모션코믹 단독 상품은 완성된 웹툰을 영상으로 편집하는 구성입니다\n웹툰 신규 제작이 필요하면 함께 제작 세트를 선택하세요";

export function pricingPlans(id: ContentServiceId): ServicePricing {
  switch (id) {
    case "webtoon":
      return {
        groups: [
          group("webtoon", contentPricing.webtoon.plans, {
            title: "웹툰 제작",
            prefix: "웹툰 제작",
          }),
          group("motion-comic", contentPricing["motion-comic"].plans, {
            title: "모션코믹",
            prefix: "모션코믹",
          }),
          group("bundle", contentPricing["motion-comic"].bundles, {
            title: "함께 제작",
            bundle: true,
          }),
        ],
        notes: [WEBTOON_NOTE],
      };
    case "ai-influencer":
      return {
        groups: [group("plan", contentPricing["ai-influencer"].plans)],
        notes: contentPricing["ai-influencer"].notes,
      };
    case "motion-graphics":
      return {
        groups: [group("plan", contentPricing["motion-graphics"].plans)],
        notes: contentPricing["motion-graphics"].notes,
      };
    case "ad":
      return {
        groups: [group("plan", contentPricing.ad.plans)],
        notes: contentPricing.ad.notes,
      };
    case "animation":
      return {
        groups: [group("plan", contentPricing.animation.plans)],
        notes: [],
      };
    case "brand-film":
      return {
        groups: [group("plan", contentPricing["brand-film"].plans)],
        notes: [],
      };
  }
}

/** 문의 폼 '희망 구성' 선택지(가격표 순서) */
export function planOptions(id: ContentServiceId): PricingPlan[] {
  return pricingPlans(id).groups.flatMap((g) => g.plans);
}
