// 메인 #work 마케팅 단계: 4단계 스테퍼와 폰 시뮬레이터의 카피·수치·장면 순서(R7 WP-2, BRIEF_R7 §2-3·§2-4).
// 클라이언트에서 쓰는 순수 데이터다. 고객 자료·실제 계정은 없고, 가상 브랜드 하나(하루결)의 화면만 만든다.
// 화면에 보이는 수치는 이 파일의 값만 쓴다. 컴포넌트와 CSS는 숫자를 새로 만들어 넣지 않는다.
// 성과를 단정하는 문구와 별도의 가상 표기는 넣지 않는다(사용자 결정). 상표 고지 한 줄만 화면 아래에 둔다.
import type { PlatformLogoId } from "../components/platform-frame/logos.ts";

export type MarketingStageId = "plan" | "operate" | "data" | "improve";
export type MarketingSceneId =
  | "search"
  | "calendar"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "insight"
  | "improve";

export type MarketingStage = {
  id: MarketingStageId;
  num: string;
  title: string;
  /** "이 단계에서 하는 일" 줄 */
  task: string;
  desc: string;
};

export const marketingStages: MarketingStage[] = [
  {
    id: "plan",
    num: "01",
    title: "플랜 기획",
    task: "SEO·AEO·GEO 분석과 설계",
    desc: "고객이 검색창과 AI 답변에서 무엇을 묻는지 먼저 찾고, 채널마다 무엇을 언제 올릴지 정합니다",
  },
  {
    id: "operate",
    num: "02",
    title: "운영",
    task: "게시·댓글·검색 노출 관리",
    desc: "정한 일정에 맞춰 채널별 규격으로 올리고, 댓글과 메시지, 검색 노출을 함께 관리합니다",
  },
  {
    id: "data",
    num: "03",
    title: "데이터 확인",
    task: "채널·검색 성과 모아 보기",
    desc: "채널별 조회와 반응, 사이트 유입, 검색 키워드를 한 화면에 모아 무엇이 통했는지 확인합니다",
  },
  {
    id: "improve",
    num: "04",
    title: "성과 개선",
    task: "다음 플랜에 반영",
    desc: "반응이 좋은 형식과 문장을 다음 플랜에 반영하고, 검색과 AI 답변에 쓰일 문단을 보강합니다",
  },
];

/** 장면 순서. 단계당 6초, 전체 24초 루프. 운영 단계는 플랫폼이 1.5초마다 바뀐다 */
export type MarketingScene = {
  id: MarketingSceneId;
  stage: 0 | 1 | 2 | 3;
  duration: number;
  platform?: PlatformLogoId;
};

export const marketingScenes: MarketingScene[] = [
  { id: "search", stage: 0, duration: 3000 },
  { id: "calendar", stage: 0, duration: 3000 },
  { id: "instagram", stage: 1, duration: 1500, platform: "instagram" },
  { id: "youtube", stage: 1, duration: 1500, platform: "youtube" },
  { id: "tiktok", stage: 1, duration: 1500, platform: "tiktok" },
  { id: "facebook", stage: 1, duration: 1500, platform: "facebook" },
  { id: "insight", stage: 2, duration: 6000 },
  { id: "improve", stage: 3, duration: 6000 },
];

/** 개선 장면의 마지막 0.8초: 01로 돌아가는 화살표와 01 행 깜박임 */
export const loopHintMs = 800;
export const countUpMs = 600;
export const typingStepMs = 90;

/** 로고 버튼 순서(자동 진행 순서와 같다) */
export const platformOrder: PlatformLogoId[] = [
  "instagram",
  "youtube",
  "tiktok",
  "facebook",
];

// 가상 브랜드. 웹 검색으로 같은 이름의 스킨케어 브랜드를 찾지 못했다(RESULT_R7_WP2.md 기록).
export const marketingBrand = {
  name: "하루결",
  handle: "@harugyeol.daily",
  initial: "결",
  category: "스킨케어",
};

export const marketingCopy = {
  label: "마케팅 운영 흐름",
  sectionAria: "마케팅 4단계 시뮬레이션",
  stepsAria: "마케팅 단계",
  phoneAria: "가상 브랜드 계정 화면",
  logosAria: "플랫폼 화면 선택",
  logoButton: (name: string) => `${name} 화면 보기`,
  stepButton: (num: string, title: string) => `${num} ${title}`,
  tabsAria: "플랜 화면 선택",
};

// 01 플랜 기획 · 검색 분석(0~3초)
export const searchScene = {
  tab: "분석",
  query: "건성 피부 수분크림 추천",
  rows: [
    { key: "SEO", text: "검색 결과 7위 → 목표 3위 안" },
    { key: "AEO", text: "자주 묻는 질문 답변 문단 0개 → 4개" },
    { key: "GEO", text: "AI 요약 인용 출처 0곳 → 브랜드 페이지 인용" },
  ],
};

// 01 플랜 기획 · 채널 플랜 캘린더(3~6초)
export const calendarScene = {
  tab: "일정",
  title: "주간 플랜",
  days: [
    { label: "월", on: true },
    { label: "화", on: false },
    { label: "수", on: true },
    { label: "목", on: false },
    { label: "금", on: true },
    { label: "토", on: true },
    { label: "일", on: false },
  ],
  rows: [
    { day: "월", platform: "instagram" as PlatformLogoId, format: "릴스", title: "아침 루틴 15초" },
    { day: "수", platform: "youtube" as PlatformLogoId, format: "쇼츠", title: "성분 한 줄 설명" },
    { day: "금", platform: "tiktok" as PlatformLogoId, format: "숏폼", title: "보습 비교 챌린지" },
    { day: "토", platform: "facebook" as PlatformLogoId, format: "피드", title: "후기 모음 피드" },
  ],
};

export type Stat = { label: string; value: string };
export type Tile = { value: string | null; image: number };

// 02 운영 · 플랫폼별 계정 화면
export const operateScenes = {
  instagram: {
    title: "Instagram 프로필",
    stats: [
      { label: "게시물", value: "86" },
      { label: "팔로워", value: "1.2만" },
      { label: "팔로잉", value: "180" },
    ] as Stat[],
    tilesLabel: "릴스 조회",
    tiles: [
      { value: "2.4만", image: 0 },
      { value: "8,930", image: 1 },
      { value: "1.1만", image: 2 },
      { value: null, image: 2 },
      { value: null, image: 0 },
      { value: null, image: 1 },
    ] as Tile[],
  },
  youtube: {
    title: "YouTube 쇼츠 채널",
    stats: [{ label: "구독자", value: "8,240명" }] as Stat[],
    tilesLabel: "쇼츠 조회수",
    tiles: [
      { value: "3.1만회", image: 0 },
      { value: "9,870회", image: 1 },
      { value: "1.2만회", image: 2 },
    ] as Tile[],
  },
  tiktok: {
    title: "TikTok 프로필",
    stats: [
      { label: "팔로잉", value: "96" },
      { label: "팔로워", value: "2.6만" },
      { label: "좋아요", value: "18.4만" },
    ] as Stat[],
    tilesLabel: "영상 조회",
    tiles: [
      { value: "5.2만", image: 0 },
      { value: "7,600", image: 1 },
      { value: "1.9만", image: 2 },
    ] as Tile[],
  },
  facebook: {
    title: "Facebook 페이지",
    stats: [{ label: "팔로워", value: "1,040명" }] as Stat[],
    reactionsLabel: "게시물 반응",
    reactions: [
      { label: "반응", value: "126" },
      { label: "댓글", value: "18" },
      { label: "공유", value: "9" },
    ] as Stat[],
  },
};

// 03 데이터 확인 · 인사이트
export const insightScene = {
  title: "인사이트",
  range: "지난 7일",
  kpis: [
    { label: "도달", value: "3.8만" },
    { label: "조회", value: "6.1만" },
    { label: "프로필 방문", value: "1,920" },
    { label: "링크 클릭", value: "412" },
  ] as Stat[],
  // ratio는 막대 길이(조회 값의 비례, 가장 긴 막대 100). CSS의 data-r 규칙과 같은 값을 쓴다.
  bars: [
    { platform: "instagram" as PlatformLogoId, value: "2.6만", ratio: 100 },
    { platform: "tiktok" as PlatformLogoId, value: "2.1만", ratio: 81 },
    { platform: "youtube" as PlatformLogoId, value: "1.1만", ratio: 42 },
    { platform: "facebook" as PlatformLogoId, value: "3,200", ratio: 12 },
  ],
  keywordsLabel: "검색 유입 키워드",
  keywords: ["수분크림 추천", "건성 피부 보습", "성분 비교"],
};

// 04 성과 개선 · A/B 비교
export const improveScene = {
  title: "A/B 비교",
  variants: [
    { key: "A", name: "제품 소개형", label: "조회", value: "9,800", image: 0, winner: false },
    { key: "B", name: "사용 장면형", label: "조회", value: "2.3만", image: 2, winner: true },
  ],
  winnerBadge: "다음 달 기본 형식",
  faq: "FAQ 문단 4개 추가 → AI 요약 인용 1곳",
  loop: "01 플랜 기획으로",
};

// 피드 썸네일: 공개 저장소 자체 소재(사람이 보이는 이미지 없음)
export const marketingImages = [
  "/content-examples/ad/ad-product.webp",
  "/content-examples/ad/ad-ribbon.webp",
  "/renewal/shop-products.webp",
];

/** 단계 i의 장면 인덱스 목록 */
export function scenesOfStage(stage: number): number[] {
  return marketingScenes.flatMap((scene, index) =>
    scene.stage === stage ? [index] : [],
  );
}

/** 장면 인덱스에서 보여줄 진행 채움(전체 장면 수 대비 %, 이전 값) */
export function stageProgress(sceneIndex: number): { from: number; to: number } {
  const scene = marketingScenes[sceneIndex];
  const list = scenesOfStage(scene.stage);
  const within = list.indexOf(sceneIndex);
  return {
    from: Math.round((within / list.length) * 100),
    to: Math.round(((within + 1) / list.length) * 100),
  };
}
