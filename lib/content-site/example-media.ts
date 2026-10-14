/* R5 공개판 연출 예시 소재 슬롯(WP-S1 소유, WP-S2는 읽기만).
 * 고객 레퍼런스는 공개 권리 HOLD라 공개판(검토 플래그 미설정)에서는 여기 슬롯만 쓴다. 검토판은 실제 작업물을 먼저 쓴다.
 * 소재 교체: 사용자가 만든 이미지·5초 영상을 public/content-examples/<service>/에 넣고 아래 슬롯의 src(+poster) 한 줄만 바꾼다.
 * 출처·해시는 public/content-examples/MANIFEST.json. 고객 이름·작품 경로는 이 파일에 두지 않는다(client 번들 경계). */
import { MEDIA_TAGS } from "./types.ts";

export type ExampleService =
  | "webtoon"
  | "animation"
  | "ai-influencer"
  | "motion-graphics"
  | "brand-film"
  | "ad";

export type ExampleAspect = "16x9" | "9x16" | "2x3" | "4x5" | "1x1" | "3x2";

export type ExampleSlot = {
  /** `<service>-<section>-<n>` 또는 `<service>-main` */
  readonly id: string;
  readonly service: ExampleService;
  /** 슬롯을 쓰는 화면 구역(cut·scene·bg·rail·card·main·hero·key) */
  readonly section: string;
  readonly kind: "image" | "video";
  readonly src: string;
  /** 영상 첫 화면(이미지 슬롯은 생략) */
  readonly poster?: string;
  readonly alt: string;
  /** 화면 표기. AI 인물은 'AI 가상인물 · 연출 예시', 자체 웹툰은 '제작 예시' */
  readonly label: string;
  /** 슬롯이 놓이는 화면 비율 */
  readonly aspect: ExampleAspect;
  /** 원본 픽셀 크기(next/image) */
  readonly width: number;
  readonly height: number;
  /** object-position [x%, y%], 10 단위(CSS data-fx·data-fy 규칙). 같은 원본을 다른 구도로 쓸 때 */
  readonly focus?: readonly [number, number];
};

const DIR = "/content-examples";
const STAGED = MEDIA_TAGS.staged;

/** 《1억의 구단주》 1회 12컷 장면 설명(AIO 자체 웹툰, 800×1200) */
const WEBTOON_SCENES = [
  "독립구단 창단식 무대 위 선수들과 객석에서 응원 영상을 보는 두 주인공",
  "기업 인수 체결식에서 악수하는 형과 피곤한 얼굴로 먼저 자리를 뜨는 주인공",
  "회사를 판 뒤 평일 알람을 모두 끄고 쉬다가 월드컵 중계를 켜는 주인공",
  "소파에서 축구 경기를 보다 골 장면에 환호하는 주인공",
  "형과 경기 이야기를 메시지로 나누고 옛 응원 머플러를 꺼내는 주인공",
  "강등된 축구팀의 다큐멘터리를 보며 아쉬워하는 주인공",
  "구단의 예산 고민을 다룬 다큐멘터리를 보고 다음 회를 켜는 주인공",
  "작은 구단을 인수한 두 배우의 다큐멘터리를 보며 구단 운영에 눈뜨는 주인공",
  "경기를 지켜보는 구단주들의 표정을 보며 생각에 잠긴 주인공",
  "구단 운영을 검색하다 축구 경영 게임을 설치하는 주인공",
  "게임 속 구단을 운영하며 첫 승리에 기뻐하는 주인공",
  "형의 저녁 전화에 게임을 저장하고 급히 나가는 주인공",
] as const;

const webtoonCuts: ExampleSlot[] = WEBTOON_SCENES.map((scene, i) => ({
  id: `webtoon-cut-${i + 1}`,
  service: "webtoon",
  section: "cut",
  kind: "image",
  src: `/webtoon-v11/cut-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `《1억의 구단주》 1회 ${i + 1}번째 컷 · ${scene}`,
  label: MEDIA_TAGS.ownWebtoon,
  aspect: "2x3",
  width: 800,
  height: 1200,
}));

export const EXAMPLE_MEDIA: readonly ExampleSlot[] = [
  ...webtoonCuts,
  { id: "webtoon-key-1", service: "webtoon", section: "key", kind: "image", src: `${DIR}/webtoon/webtoon-key.webp`, alt: "보라색 노트를 든 인물과 떠 있는 두 컷의 웹툰 표지 연출 예시", label: STAGED, aspect: "2x3", width: 900, height: 1350 },

  { id: "animation-hero-1", service: "animation", section: "hero", kind: "image", src: `${DIR}/animation/animation-character.webp`, alt: "산호색 아치 아래 계단에 선 보라색 입체 캐릭터 연출 예시", label: STAGED, aspect: "2x3", width: 900, height: 1350, focus: [50, 30] },
  { id: "animation-scene-1", service: "animation", section: "scene", kind: "image", src: `${DIR}/animation/animation-character.webp`, alt: "아치 아래로 걸어 나오는 입체 캐릭터 장면 연출 예시", label: STAGED, aspect: "16x9", width: 900, height: 1350, focus: [50, 30] },
  { id: "animation-scene-2", service: "animation", section: "scene", kind: "image", src: "/creative-v06/video-animation.webp", alt: "비 오는 밤 다리 위에서 빛나는 선물 상자를 든 너구리 캐릭터 장면 연출 예시", label: STAGED, aspect: "16x9", width: 1586, height: 992, focus: [40, 40] },
  { id: "animation-scene-3", service: "animation", section: "scene", kind: "image", src: "/renewal/animation-sample.webp", alt: "노을 진 성곽 마을 다리 위에서 등불을 든 캐릭터 장면 연출 예시", label: STAGED, aspect: "16x9", width: 1100, height: 733, focus: [40, 50] },

  { id: "motion-bg-1", service: "motion-graphics", section: "bg", kind: "image", src: `${DIR}/motion-graphics/motion-ribbon.webp`, alt: "", label: STAGED, aspect: "16x9", width: 1920, height: 1081, focus: [70, 50] },
  { id: "motion-hero-1", service: "motion-graphics", section: "hero", kind: "image", src: `${DIR}/motion-graphics/motion-ribbon.webp`, alt: "보라색 유리 리본과 구슬로 구성한 모션그래픽 화면 연출 예시", label: STAGED, aspect: "16x9", width: 1920, height: 1081, focus: [70, 50] },
  { id: "motion-scene-1", service: "motion-graphics", section: "scene", kind: "image", src: `${DIR}/motion-graphics/motion-ribbon.webp`, alt: "유리 리본의 색과 질감으로 시작하는 장면 연출 예시", label: STAGED, aspect: "16x9", width: 1920, height: 1081, focus: [80, 50] },
  { id: "motion-scene-2", service: "motion-graphics", section: "scene", kind: "image", src: `${DIR}/motion-graphics/motion-product.webp`, alt: "화면 중앙에 제품 병을 세운 장면 연출 예시", label: STAGED, aspect: "16x9", width: 900, height: 1350, focus: [50, 40] },
  { id: "motion-scene-3", service: "motion-graphics", section: "scene", kind: "image", src: `${DIR}/motion-graphics/motion-ribbon.webp`, alt: "문구가 들어갈 여백을 남긴 마무리 장면 연출 예시", label: STAGED, aspect: "16x9", width: 1920, height: 1081, focus: [20, 50] },

  /* 카드 슬롯은 파일명에 계정 id(unnie87·yeopjip·grace·ssal)가 들어 있어야 creator-experience의 카드 조회가 슬롯을 쓴다. 계정별 카드 사진·영상이 오면 src(영상은 poster도)만 바꾼다 */
  { id: "ai-card-1", service: "ai-influencer", section: "card", kind: "image", src: "/content-site/ai-influencer/unnie87-face.webp", alt: "기록하는87 · AI 가상인물", label: MEDIA_TAGS.aiPerson, aspect: "2x3", width: 900, height: 1350, focus: [50, 30] },
  { id: "ai-card-2", service: "ai-influencer", section: "card", kind: "image", src: "/content-site/ai-influencer/yeopjip-portrait.webp", alt: "옆집엄마 · AI 가상인물", label: MEDIA_TAGS.aiPerson, aspect: "2x3", width: 900, height: 1350, focus: [50, 30] },
  { id: "ai-card-3", service: "ai-influencer", section: "card", kind: "image", src: "/content-site/ai-influencer/grace-portrait.webp", alt: "그레이스의정원 · AI 가상인물", label: MEDIA_TAGS.aiPerson, aspect: "2x3", width: 900, height: 1350, focus: [50, 30] },
  { id: "ai-card-4", service: "ai-influencer", section: "card", kind: "image", src: "/content-site/ai-influencer/ssal-portrait.webp", alt: "쌀만드는아저씨 · AI 가상인물", label: MEDIA_TAGS.aiPerson, aspect: "2x3", width: 900, height: 1350, focus: [50, 30] },

  { id: "brandfilm-main", service: "brand-film", section: "main", kind: "video", src: `${DIR}/brand-film/brandfilm-motion.mp4`, poster: `${DIR}/brand-film/brandfilm-poster.webp`, alt: "보라색 유리 리본 위로 카메라가 다가가는 브랜드 영상 연출 예시", label: MEDIA_TAGS.stagedMuted, aspect: "16x9", width: 1920, height: 1081 },

  /* 가운데 고정 9:16 화면. 2:3 원본을 CSS object-fit: cover로 세로 잘라 쓴다(파일 생성 없음). 9:16 영상이 오면 kind·src·poster만 바꾼다 */
  /* 장면 전환(SceneSequence) 3컷: 광고 후크 소재(ad-hook-*)가 오기 전까지 기존 광고 이미지를 재사용한다. 9:16 화면에 cover로 세운다 */
  { id: "ad-scene-1", service: "ad", section: "scene", kind: "image", src: `${DIR}/ad/ad-character.webp`, alt: "첫 장면에서 상황을 전하는 세로 광고 연출 예시", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 30] },
  { id: "ad-scene-2", service: "ad", section: "scene", kind: "image", src: `${DIR}/ad/ad-creator.webp`, alt: "사용 방법을 자막으로 보여 주는 세로 광고 연출 예시", label: MEDIA_TAGS.aiPerson, aspect: "9x16", width: 900, height: 1350, focus: [50, 30] },
  { id: "ad-scene-3", service: "ad", section: "scene", kind: "image", src: `${DIR}/ad/ad-product.webp`, alt: "제품을 사용하는 장면으로 마무리하는 세로 광고 연출 예시", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 50] },
  { id: "ad-rail-1", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-product.webp`, alt: "", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 40] },
  { id: "ad-rail-2", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-ribbon.webp`, alt: "", label: STAGED, aspect: "9x16", width: 1920, height: 1081, focus: [70, 50] },
  { id: "ad-rail-3", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-creator.webp`, alt: "", label: MEDIA_TAGS.aiPerson, aspect: "9x16", width: 900, height: 1350, focus: [50, 30] },
  { id: "ad-rail-4", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-character.webp`, alt: "", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 30] },
  { id: "ad-rail-5", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-webtoon.webp`, alt: "", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 40] },
  { id: "ad-rail-6", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-ribbon.webp`, alt: "", label: STAGED, aspect: "9x16", width: 1920, height: 1081, focus: [30, 50] },
  { id: "ad-rail-7", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-ribbon.webp`, alt: "", label: STAGED, aspect: "9x16", width: 1920, height: 1081, focus: [90, 50] },
  { id: "ad-rail-8", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-product.webp`, alt: "", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 80] },
  { id: "ad-rail-9", service: "ad", section: "rail", kind: "image", src: `${DIR}/ad/ad-webtoon.webp`, alt: "", label: STAGED, aspect: "9x16", width: 900, height: 1350, focus: [50, 70] },
];

/** 서비스의 슬롯 전체(정의 순서 유지) */
export function getExampleMedia(service: ExampleService, section?: string): ExampleSlot[] {
  return EXAMPLE_MEDIA.filter((slot) => slot.service === service && (section === undefined || slot.section === section));
}

/** focus를 이미지 속성으로(인라인 style 대신 service-motion.css의 data-fx·data-fy 규칙) */
export function focusData(focus?: readonly [number, number]): { "data-fx"?: string; "data-fy"?: string } {
  if (!focus) return {};
  const step = (value: number) => String(Math.max(0, Math.min(100, Math.round(value / 10) * 10)));
  return { "data-fx": step(focus[0]), "data-fy": step(focus[1]) };
}

/** 슬롯 하나. 없는 ID는 오류(오타가 조용히 빈 화면이 되지 않게) */
export function getSlot(id: string): ExampleSlot {
  const slot = EXAMPLE_MEDIA.find((item) => item.id === id);
  if (!slot) throw new Error(`example media slot not found: ${id}`);
  return slot;
}
