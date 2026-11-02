export type PlatformSource = "soomgo" | "kmong" | "wishket" | "elancer" | "notefolio" | "upwork" | "contra";

export type QuoteCategory = "website" | "shop" | "logo" | "detail" | "ppt" | "automation" | "video" | "other";

export type QuoteDraft = {
  source: PlatformSource;
  category: QuoteCategory;
  confidence: number;
  priceTier: "standard" | "deluxe" | "premium" | "custom";
  eventPrice: number;
  regularPrice: number;
  deliveryDays: string;
  summary: string;
  responseText: string;
  usedFallback: boolean;
};

type PriceTier = QuoteDraft["priceTier"];

type PricePreset = {
  category: QuoteCategory;
  label: string;
  tier: PriceTier;
  eventPrice: number;
  regularPrice: number;
  deliveryDays: string;
  workScope: string[];
};

const QUOTE_CATEGORIES = ["website", "shop", "logo", "detail", "ppt", "automation", "video", "other"] as const;
const PRICE_TIERS = ["standard", "deluxe", "premium", "custom"] as const;

const CHANNEL_LABELS: Record<PlatformSource, string> = {
  soomgo: "숨고",
  kmong: "크몽",
  wishket: "위시켓",
  elancer: "이랜서",
  notefolio: "노트폴리오",
  upwork: "Upwork",
  contra: "Contra",
};

const PRICE_PRESETS: Record<QuoteCategory, PricePreset> = {
  website: {
    category: "website",
    label: "홈페이지/랜딩페이지",
    tier: "deluxe",
    eventPrice: 100000,
    regularPrice: 250000,
    deliveryDays: "결제 후 5일 내",
    workScope: ["기본 원고 정리·이미지/배너 구성 포함", "랜딩 50,000원~ / 5페이지 이하 100,000원~ / 10페이지 이하 250,000원~", "기능형(관리자·결제·예약 등)은 별도 견적"],
  },
  shop: {
    category: "shop",
    label: "쇼핑몰/카페24",
    tier: "deluxe",
    eventPrice: 300000,
    regularPrice: 800000,
    deliveryDays: "3-5일",
    workScope: ["상품 진열 구조", "메인/상세 진입 동선", "카페24 또는 커머스 환경 맞춤"],
  },
  logo: {
    category: "logo",
    label: "로고/명함",
    tier: "deluxe",
    eventPrice: 30000,
    regularPrice: 150000,
    deliveryDays: "1-2일",
    workScope: ["로고 2안", "명함 양면", "PNG/JPG/PDF 납품"],
  },
  detail: {
    category: "detail",
    label: "상세페이지",
    tier: "deluxe",
    eventPrice: 120000,
    regularPrice: 300000,
    deliveryDays: "2-3일",
    workScope: ["5섹션 세트", "카피 정리", "모바일/PC 흐름 설계"],
  },
  ppt: {
    category: "ppt",
    label: "PPT/제안서",
    tier: "standard",
    eventPrice: 80000,
    regularPrice: 130000,
    deliveryDays: "1-2일",
    workScope: ["10~20P PPT 디자인", "도식화/레이아웃 정리", "PPTX/PDF 동시 납품"],
  },
  automation: {
    category: "automation",
    label: "자동화/앱 MVP",
    tier: "deluxe",
    eventPrice: 800000,
    regularPrice: 2500000,
    deliveryDays: "5일",
    workScope: ["DB/API 포함 자동화", "운영 대시보드", "배포 및 운영 가이드"],
  },
  video: {
    category: "video",
    label: "영상 콘텐츠",
    tier: "deluxe",
    eventPrice: 150000,
    regularPrice: 400000,
    deliveryDays: "2-3일",
    workScope: ["브랜드/홍보 영상 구성", "자막/컷 편집", "숏폼 변환 협의"],
  },
  other: {
    category: "other",
    label: "맞춤 제작",
    tier: "custom",
    eventPrice: 100000,
    regularPrice: 300000,
    deliveryDays: "협의",
    workScope: ["요구사항 확인", "범위 확정 후 견적", "일정 협의"],
  },
};

function compactText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractJsonObject(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? text.trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function parseClaudeDraft(text: string): Partial<QuoteDraft> | null {
  const jsonText = extractJsonObject(text);
  if (!jsonText) return null;

  try {
    return JSON.parse(jsonText) as Partial<QuoteDraft>;
  } catch {
    return null;
  }
}

function isQuoteCategory(value: unknown): value is QuoteCategory {
  return typeof value === "string" && QUOTE_CATEGORIES.includes(value as QuoteCategory);
}

function isPriceTier(value: unknown): value is PriceTier {
  return typeof value === "string" && PRICE_TIERS.includes(value as PriceTier);
}

function asFiniteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

export function detectQuoteCategory(rawText: string): { category: QuoteCategory; confidence: number } {
  const text = rawText.toLowerCase();
  const rules: Array<{ category: QuoteCategory; keywords: string[] }> = [
    { category: "ppt", keywords: ["ppt", "피피티", "제안서", "ir", "사업계획서", "발표자료", "deck"] },
    { category: "website", keywords: ["홈페이지", "웹사이트", "랜딩", "사이트", "next", "반응형"] },
    { category: "shop", keywords: ["쇼핑몰", "카페24", "상품", "스토어", "커머스", "상점"] },
    { category: "logo", keywords: ["로고", "명함", "브랜딩", "ci", "bi"] },
    { category: "detail", keywords: ["상세페이지", "상세", "페이지 디자인", "판매 이미지"] },
    { category: "automation", keywords: ["자동화", "앱", "mvp", "크롤링", "대시보드", "api", "프로그램"] },
    { category: "video", keywords: ["영상", "쇼츠", "릴스", "편집", "모션", "유튜브"] },
  ];

  for (const rule of rules) {
    const matches = rule.keywords.filter((keyword) => text.includes(keyword)).length;
    if (matches > 0) {
      return { category: rule.category, confidence: Math.min(0.68 + matches * 0.12, 0.96) };
    }
  }

  return { category: "other", confidence: 0.52 };
}

export function createLocalQuoteDraft(source: PlatformSource, rawText: string): QuoteDraft {
  const { category, confidence } = detectQuoteCategory(rawText);
  const preset = PRICE_PRESETS[category];
  const summary = compactText(rawText).slice(0, 120) || `${preset.label} 요청`;
  const sourceLine =
    source === "kmong"
      ? "크몽 패키지 기준으로 Basic/Standard/Premium 범위 조정 가능합니다."
      : source === "upwork" || source === "contra"
        ? "I can structure the delivery scope and timeline clearly before we start."
        : `${CHANNEL_LABELS[source]} 요청 기준으로 바로 검토했습니다.`;

  const responseText =
    source === "upwork" || source === "contra"
      ? [
          "Hello, this is AIO Agency.",
          "",
          `I reviewed your request as: "${summary}".`,
          "",
          "Estimate",
          `- Suggested package: ${preset.label} / ${preset.tier.toUpperCase()}`,
          `- Starting price reference: KRW ${preset.eventPrice.toLocaleString("ko-KR")}~`,
          `- Upper range reference: KRW ${preset.regularPrice.toLocaleString("ko-KR")}~ (scope-dependent)`,
          "",
          "Delivery",
          `- Estimated timeline: ${preset.deliveryDays}`,
          "- 5-business-day delivery commitment where applicable",
          "- 14-day free after-service and source files included",
          "",
          "Scope",
          ...preset.workScope.map((item) => `- ${item}`),
          "",
          sourceLine,
          "I can refine the exact quote after checking the final scope.",
        ].join("\n")
      : [
          "안녕하세요, AIO에이전시입니다.",
          "",
          `"${summary}" 건으로 보고 견적 드립니다.`,
          "",
          "【견적】",
          `- 시작가: ₩${preset.eventPrice.toLocaleString("ko-KR")}~`,
          `- 범위에 따라: ₩${preset.regularPrice.toLocaleString("ko-KR")}~ (참고)`,
          `- 추천 패키지: ${preset.label} / ${preset.tier.toUpperCase()}`,
          "",
          "【작업 일정】",
          `- 요청 사양 기준 ${preset.deliveryDays} 내 완성`,
          "- 5일 작업일 보장 (못 지키면 10% 자발적 환불)",
          "- 14일 무상 A/S 포함 + 원본 파일 무료 제공",
          "",
          "【작업 가능 영역】",
          ...preset.workScope.map((item) => `- ${item}`),
          "",
          "【포트폴리오】",
          "숨고/크몽 프로필과 aio-make.com에서 실제 작업물 확인 가능합니다.",
          "",
          sourceLine,
          "30분 무료 상담 가능합니다. 정확한 범위 확인 후 최종 견적 드리겠습니다.",
        ].join("\n");

  return {
    source,
    category,
    confidence,
    priceTier: preset.tier,
    eventPrice: preset.eventPrice,
    regularPrice: preset.regularPrice,
    deliveryDays: preset.deliveryDays,
    summary,
    responseText,
    usedFallback: true,
  };
}

export async function generateQuoteDraft(source: PlatformSource, rawText: string): Promise<QuoteDraft> {
  const localDraft = createLocalQuoteDraft(source, rawText);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return localDraft;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
        max_tokens: 1400,
        temperature: 0.3,
        system:
          "You write AIO Agency quote replies. Never mention AI. Return only JSON with keys: category, confidence, priceTier, eventPrice, regularPrice, deliveryDays, summary, responseText. The responseText must include 5-business-day commitment, 14-day after-service, source files, quote, schedule, scope, and portfolio.",
        messages: [
          {
            role: "user",
            content: `source=${source}\nrequest=${rawText}\nlocal_reference=${JSON.stringify(localDraft)}`,
          },
        ],
      }),
    });

    if (!response.ok) return localDraft;

    const json = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = json.content?.find((item) => item.type === "text")?.text;
    if (!text) return localDraft;

    const parsed = parseClaudeDraft(text);
    if (!parsed) return localDraft;

    const confidence = asFiniteNumber(parsed.confidence);
    const eventPrice = asFiniteNumber(parsed.eventPrice);
    const regularPrice = asFiniteNumber(parsed.regularPrice);

    return {
      ...localDraft,
      source,
      category: isQuoteCategory(parsed.category) ? parsed.category : localDraft.category,
      confidence: confidence === undefined ? localDraft.confidence : Math.min(Math.max(confidence, 0), 1),
      priceTier: isPriceTier(parsed.priceTier) ? parsed.priceTier : localDraft.priceTier,
      eventPrice: eventPrice === undefined ? localDraft.eventPrice : Math.max(Math.round(eventPrice), 0),
      regularPrice: regularPrice === undefined ? localDraft.regularPrice : Math.max(Math.round(regularPrice), 0),
      deliveryDays: asNonEmptyString(parsed.deliveryDays) ?? localDraft.deliveryDays,
      summary: asNonEmptyString(parsed.summary) ?? localDraft.summary,
      responseText: asNonEmptyString(parsed.responseText) ?? localDraft.responseText,
      usedFallback: false,
    };
  } catch {
    return localDraft;
  }
}
