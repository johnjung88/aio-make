/* /content 컨텐츠 분과 홈 데이터. JSX 없이 순수 데이터와 선택 함수만 둔다.
 * 가격은 PRICING_FINAL_2026-10-14.md 3~9번 정본 값만 쓴다(부가세 별도). */

export type ContentServiceId =
  | "webtoon"
  | "animation"
  | "ai-influencer"
  | "motion-graphics"
  | "brand-film"
  | "ad";

export type HeroVideo = { src: string; poster: string };

/* 쇼릴 슬롯: 사용자가 쇼릴을 주면 video 한 필드만 채운다(public/ 기준 절대경로).
 * 예: video: { src: "/content-home/showreel.mp4", poster: "/content-home/showreel.webp" } */
export const contentHomeHero = {
  eyebrow: "AIO MAKE STUDIO",
  title: "AI가 속도를 내고\n전문가가 완성합니다",
  accent: "AI",
  lead: "웹툰부터 SNS 광고 영상까지 기획과 제작을 한 팀이 맡습니다",
  button: "서비스 살펴보기",
  buttonHref: "#services",
  tag: "연출 예시",
  image: {
    src: "/renewal/brand-film-v03.webp",
    alt: "브랜드 영상 연출 예시 이미지",
  },
  video: undefined as HeroVideo | undefined,
};

export type ContentHomeService = {
  id: ContentServiceId;
  label: string;
  kicker: string;
  line: string;
  description: string;
  uses: [string, string, string];
  image: string;
  imageTag: string;
  alt: string;
  href: string;
  scopeNote?: string;
};

const service = (
  s: Omit<ContentHomeService, "href" | "alt"> & { alt?: string },
): ContentHomeService => ({
  ...s,
  alt: s.alt ?? `${s.label} 연출 예시 이미지`,
  href: `/content/services/${s.id}`,
});

export const contentHomeServices: ContentHomeService[] = [
  service({
    id: "webtoon",
    label: "웹툰",
    kicker: "WEBTOON",
    line: "브랜드 이야기를 세로로 읽히는 컷으로 그립니다",
    description:
      "제품을 쓰는 인물의 이야기를 12컷 한 회로 구성합니다. 원하시면 완성한 웹툰을 모션코믹 영상으로 이어서 만듭니다.",
    uses: ["인스타툰", "상세페이지", "광고 소재"],
    image: "/creative-v06/video-webtoon.webp",
    imageTag: "연출 예시",
  }),
  service({
    id: "animation",
    label: "애니메이션",
    kicker: "ANIMATION",
    line: "캐릭터와 장면에 움직임을 더합니다",
    description:
      "캐릭터와 배경을 설계하고 장면을 이어 한 편의 애니메이션으로 만듭니다. 길이는 30초와 60초 중에서 고릅니다.",
    uses: ["릴스", "쇼츠", "캐릭터 영상"],
    image: "/creative-v06/video-animation.webp",
    imageTag: "연출 예시",
  }),
  service({
    id: "ai-influencer",
    label: "AI 인플루언서",
    kicker: "AI INFLUENCER",
    line: "브랜드 전용 AI 가상인물을 만듭니다",
    description:
      "캐릭터 시트와 기준 이미지로 얼굴과 스타일을 일정하게 유지합니다. 이 인물이 등장하는 제품 이미지와 9:16 숏폼 영상을 만듭니다.",
    uses: ["제품 소개", "숏폼 영상", "SNS 이미지"],
    image: "/creative-v06/video-ai-influencer.webp",
    imageTag: "AI 가상인물 · 연출 예시",
    alt: "AI 인플루언서 연출 예시 이미지 · AI로 만든 가상인물",
    scopeNote: "계정 게시·운영은 별도 견적",
  }),
  service({
    id: "motion-graphics",
    label: "모션그래픽",
    kicker: "MOTION GRAPHICS",
    line: "그래픽과 글자의 움직임으로 메시지를 전합니다",
    description:
      "제품 이미지와 로고, 핵심 문구를 장면 전환으로 엮습니다. 맞춤형은 브랜드 전용 캐릭터까지 함께 만듭니다.",
    uses: ["제품 소개", "홈페이지", "행사 화면"],
    image: "/renewal/video.webp",
    imageTag: "연출 예시",
  }),
  service({
    id: "brand-film",
    label: "브랜드 홍보 영상",
    kicker: "BRAND FILM",
    line: "브랜드가 하는 일과 이유를 한 편에 담습니다",
    description:
      "브랜드 자료와 제품 정보를 정리해 이야기 순서를 잡습니다. 회사 소개와 홈페이지에 오래 쓸 영상을 만듭니다.",
    uses: ["홈페이지", "회사 소개", "전시"],
    image: "/creative-v06/video-brand-film.webp",
    imageTag: "연출 예시",
  }),
  service({
    id: "ad",
    label: "SNS 광고 영상",
    kicker: "SNS AD",
    line: "피드에서 첫 장면으로 시선을 붙잡습니다",
    description:
      "제품 하나와 콘셉트 하나로 9:16 세로 광고 영상을 만듭니다. 기본 자막과 배경음악을 넣어 1080p로 전달합니다.",
    uses: ["릴스", "쇼츠", "피드 광고"],
    image: "/creative-v06/video-sns-ad.webp",
    imageTag: "연출 예시",
  }),
];

export const contentHomeServicesHead = {
  eyebrow: "SERVICES",
  title: "만들고 싶은 컨텐츠를\n골라보세요",
  lead: "서비스마다 만드는 것과 쓰이는 곳을 정리했습니다",
  toggle: "한 번에 모두 보기",
  carouselLabel: "컨텐츠 서비스 6종",
  tabsLabel: "서비스 선택",
  prev: "이전 서비스",
  next: "다음 서비스",
  detailLink: "서비스 자세히 보기",
  note: "이미지는 서비스 분위기를 보여주는 연출 예시입니다. 대량 제작과 정기 제작은 따로 견적을 드립니다.",
};

export type ContentHomeStep = {
  label: string;
  title: string;
  body: string;
  output: string;
};

export const contentHomeProcessHead = {
  eyebrow: "PROCESS",
  title: "기획안을 먼저 맞추고\n제작합니다",
  lead: "모든 컨텐츠는 같은 다섯 단계로 진행합니다. 기획안 수정 2회와 최종안 수정 1회가 기본입니다.",
  tabsLabel: "제작 단계",
  outputLabel: "결과물",
};

export const contentHomeProcess: ContentHomeStep[] = [
  {
    label: "상담",
    title: "만들 컨텐츠를 함께 정합니다",
    body: "사용할 채널과 일정, 가진 자료를 확인합니다. 서비스와 분량을 정하고 견적을 안내합니다.",
    output: "작업 범위와 견적",
  },
  {
    label: "기획",
    title: "기획안으로 방향을 맞춥니다",
    body: "이야기 흐름과 장면 구성을 기획안으로 정리해 전달합니다. 기획안은 두 번까지 수정합니다.",
    output: "기획안",
  },
  {
    label: "제작",
    title: "확정한 기획대로 만듭니다",
    body: "초안은 AI로 빠르게 만들고 연출은 담당자가 직접 다듬습니다. 캐릭터와 장면, 움직임과 자막을 완성합니다.",
    output: "최종안",
  },
  {
    label: "검수",
    title: "최종안을 함께 확인합니다",
    body: "최종안을 전달한 뒤 한 번 수정합니다. 인물과 제품 정보, 자막과 소재의 권리를 확인합니다.",
    output: "수정 반영본",
  },
  {
    label: "납품",
    title: "채널에 맞는 파일로 전달합니다",
    body: "게시할 채널의 규격과 화면 비율에 맞춰 파일을 정리합니다. 추가 화면비와 원본 파일은 상담에서 정합니다.",
    output: "최종 파일",
  },
];

export const contentHomeCta = {
  title: "어떤 컨텐츠가\n필요하신가요?",
  lead: "만들고 싶은 컨텐츠와 일정을 남겨주세요. 담당자가 범위와 견적을 안내합니다.",
  button: "프로젝트 문의",
  href: "/content/contact",
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/* ---------------------------------------------------------------------------
 * 가격(PRICING_FINAL_2026-10-14.md 3~9번 정본). 모든 금액은 부가세 별도.
 * SHOW_STARTING_PRICE가 시작가 표시의 유일한 끄기 스위치다.
 * ------------------------------------------------------------------------- */
export const SHOW_STARTING_PRICE = true;

export const contentPricing = {
  "ai-influencer": {
    plans: [
      { label: "캐릭터 1명 세팅 + 이미지 5장", amount: 100000 },
      { label: "세팅 + 30초 영상 1편", amount: 300000 },
      { label: "세팅 + 이미지 총 20장 + 30초 영상 4편", amount: 1000000 },
    ],
    notes: [
      "총 20장에 세팅용 이미지 포함. 주 이미지 5장·영상 1편 구성 가능.",
      "계정 게시·운영 및 대량 제작은 별도 견적.",
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
    notes: ["맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함."],
  },
  webtoon: {
    plans: [
      { label: "12컷", amount: 100000 },
      { label: "24컷", amount: 180000 },
    ],
  },
  "motion-comic": {
    plans: [
      { label: "30초", amount: 75000 },
      { label: "60초", amount: 120000 },
    ],
    bundles: [
      { label: "웹툰 12컷 + 모션코믹 30초", amount: 175000 },
      { label: "웹툰 24컷 + 모션코믹 60초", amount: 300000 },
    ],
    notes: ["기존 웹툰을 영상화하는 가격. 웹툰 신규 제작은 별도."],
  },
  ad: {
    plans: [
      { label: "30초", amount: 250000 },
      { label: "60초", amount: 450000 },
    ],
    notes: [
      "제품·서비스 1개, 콘셉트 1개 기준. 세로형 9:16·1080p, 기본 자막·BGM 포함.",
      "다른 화면비 추가·광고 집행·계정 운영·매체비는 별도.",
    ],
  },
  common: {
    vat: "부가세 별도",
    revisions: ["기획안 전달 후 수정 2회", "최종안 전달 후 수정 1회"],
    bulk: "브랜드 홍보영상·애니메이션·모션그래픽·웹툰·모션코믹·SNS 숏폼의 대량·정기 제작은 별도 견적",
  },
} as const;

/** 만 원 단위, 소수 첫째 자리까지. 100000 → "10만 원", 75000 → "7.5만 원" */
export function formatWon(amount: number): string {
  const man = Math.round(amount / 1000) / 10;
  return `${Number.isInteger(man) ? man : man.toFixed(1)}만 원`;
}

export type StartingPrice = {
  amount: number;
  amountText: string;
  /** 굵게 보이는 앞부분. 예: "25만 원부터", "웹툰 제작 12컷 10만 원부터" */
  head: string;
  /** " · "로 이어지는 나머지 단위. 마지막은 항상 "부가세 별도" */
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
    prefix: "웹툰 제작 12컷",
    note: `모션코믹 영상화 옵션 · 30초 ${formatWon(contentPricing["motion-comic"].plans[0].amount)}부터`,
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
