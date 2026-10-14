/* 모션그래픽 서비스 랜딩 데이터(WP-B 소유). 금액은 lib/content-pricing.ts에서만 렌더한다.
 * WP0 수정: seo.description 마지막 문장을 마침표 규칙에 맞게 `…10만 원부터, 부가세 별도.`로 바꿨다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구. 키네틱 타이포 문자열도 여기 둔다(카피 테스트 대상).
 * 장식 구도의 글자는 히어로·단순형·맞춤형·스타일 프레임마다 다르다(같은 구도가 되풀이되지 않게, VERIFY_FINAL_P2R WP-B-4).
 * 스타일 프레임의 두 칸(정지·모션 적용)은 같은 화면의 전후라 같은 글자를 쓴다. */
export const motionGraphicsSignature = {
  /** 히어로 무대의 키네틱 타이포(aria-hidden 장식) */
  stage: { title: "움직이는\n메시지" },
  compare: {
    eyebrow: "COMPARE",
    title: "단순형과 맞춤형\n무엇이 다를까요",
    lead: "두 구성 모두 30초와 60초 중에서 길이를 고릅니다",
    plans: [
      {
        id: "simple",
        name: "단순형",
        body: "전달받은 로고와 제품 이미지, 확정 문구를 중심으로 화면과 전환을 구성합니다",
        items: ["로고", "제품 이미지", "핵심 문구"],
        word: "로고와\n핵심 문구",
      },
      {
        id: "custom",
        name: "맞춤형",
        body: "브랜드 전용 캐릭터를 함께 제작하고 캐릭터가 설명에 참여하는 장면을 구성합니다",
        items: ["로고", "제품 이미지", "핵심 문구", "전용 캐릭터"],
        word: "캐릭터가\n안내해요",
      },
    ],
    itemsLabel: "들어가는 요소",
    priceLink: "가격 보기",
  },
  frame: {
    eyebrow: "STYLE FRAME",
    title: "멈춘 화면을\n먼저 맞춥니다",
    lead: "움직이기 전에 색과 글자 배치를 정지 화면으로 기획안에 담습니다",
    still: { label: "스타일 프레임", caption: "기획안에서 색과 배치를 확인합니다" },
    moving: { label: "다음 장면 구성", caption: "요소의 위치와 강조할 문구를 바꿔 다음 장면을 설계합니다" },
    word: "한 장면\n한 메시지",
  },
} as const;

export const motionGraphics: ServiceLandingData = {
  id: "motion-graphics",
  label: "모션그래픽",
  seo: {
    title: "모션그래픽 제작",
    description:
      "로고와 제품 이미지에 핵심 문구를 더한 모션그래픽 제작 · 맞춤형은 전용 캐릭터 포함 · 단순형 30초 10만 원부터, 부가세 별도",
  },
  hero: {
    eyebrow: "MOTION GRAPHICS",
    title: "복잡한 설명도\n쉽게 보이도록",
    lead: "로고와 제품 이미지, 숫자와 문구를 읽는 순서에 맞춰 움직이는 30초 또는 60초 영상으로 만듭니다",
    facts: ["단순형 · 맞춤형", "30초 · 60초", "맞춤형은 전용 캐릭터 포함"],
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "이런 장면을\n움직입니다",
    items: [
      {
        title: "로고·타이포 모션",
        body: "브랜드 이름과 핵심 문구가 들어오고 사라지는 순서를 정해 짧은 오프닝으로 구성합니다",
      },
      {
        title: "제품 소개 모션",
        body: "제품 전체와 세부 이미지를 나누고 기능별 문구를 순서대로 보여줍니다",
      },
      {
        title: "정보 그래픽",
        body: "이용 순서와 구조, 비교 내용을 도형과 선으로 정리해 한 장면씩 설명합니다",
      },
    ],
  },
  process: {
    title: "정지 화면부터\n함께 맞춥니다",
    steps: [
      {
        title: "상담·자료 정리",
        body: "로고와 제품 이미지, 넣을 문구를 정리합니다",
        check: "핵심 문구 확인",
      },
      {
        title: "기획안 전달",
        body: "스타일 프레임과 장면 순서를 담은 기획안을 보내드립니다",
        check: "기획안 수정 2회",
      },
      {
        title: "모션·최종안",
        body: "확정한 화면에 움직임을 입혀 최종안을 보내드립니다",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "확정한 영상을 파일로 전달합니다",
        check: "완성 파일 확인",
      },
    ],
  },
  scope: {
    included: [
      "30초 또는 60초 모션그래픽 1편",
      "맞춤형은 브랜드 전용 캐릭터 제작",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["대량·정기 제작"],
    prepare: ["로고 원본 파일", "제품 이미지", "넣고 싶은 문구"],
  },
  faq: [
    [
      "단순형과 맞춤형은 무엇이 다른가요?",
      "단순형은 받은 로고와 제품 이미지, 확정 문구로 구성하고 맞춤형에는 브랜드 전용 캐릭터 제작을 더합니다",
    ],
    [
      "길이는 어떻게 고르나요?",
      "30초와 60초 중에서 고를 수 있으며 단순형 30초는 10만 원부터 시작합니다",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "무엇을 움직이고\n싶으신가요?",
    lead: "넣고 싶은 문구와 자료를 알려주시면 구성과 견적을 안내합니다",
    placeholder: "예: 신제품 소개 문구를 30초 모션그래픽으로 만들고 싶어요",
  },
  signature: motionGraphicsSignature,
};
