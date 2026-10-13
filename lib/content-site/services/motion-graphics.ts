/* 모션그래픽 서비스 랜딩 데이터. WP0 초안(BRIEF_P2R_SERVICES 4절 카피) → 이후 WP-B 소유.
 * signature는 WP-B가 채운다(키네틱 타이포 문자열 · 단순형과 맞춤형 · 정지 화면 → 움직임).
 * WP0 수정: seo.description 마지막 문장을 마침표 규칙에 맞게 `…10만 원부터, 부가세 별도.`로 바꿨다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const motionGraphics: ServiceLandingData = {
  id: "motion-graphics",
  label: "모션그래픽",
  seo: {
    title: "모션그래픽 제작",
    description:
      "로고와 제품 이미지, 핵심 문구를 움직이는 모션그래픽으로 만듭니다. 맞춤형은 브랜드 전용 캐릭터까지 함께 만듭니다. 단순형 30초 10만 원부터, 부가세 별도.",
  },
  hero: {
    eyebrow: "MOTION GRAPHICS",
    title: "메시지에\n움직임을 더합니다",
    lead: "로고와 제품 이미지, 핵심 문구를 그래픽 움직임으로 엮습니다",
    facts: ["단순형 · 맞춤형", "30초 · 60초", "맞춤형은 전용 캐릭터 포함"],
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "이런 장면을\n움직입니다",
    items: [
      {
        title: "로고·타이포 모션",
        body: "로고와 핵심 문구가 기억에 남도록 움직임을 설계합니다.",
      },
      {
        title: "제품 소개 모션",
        body: "제품 이미지와 특징을 장면 전환으로 이어 보여줍니다.",
      },
      {
        title: "정보 그래픽",
        body: "복잡한 설명을 도형과 순서로 나눠 읽기 쉽게 만듭니다.",
      },
    ],
  },
  process: {
    title: "정지 화면부터\n함께 맞춥니다",
    steps: [
      {
        title: "상담·자료 정리",
        body: "로고와 제품 이미지, 넣을 문구를 정리합니다.",
        check: "핵심 문구 확인",
      },
      {
        title: "기획안 전달",
        body: "스타일 프레임과 장면 순서를 담은 기획안을 보내드립니다.",
        check: "기획안 수정 2회",
      },
      {
        title: "모션·최종안",
        body: "확정한 화면에 움직임을 입혀 최종안을 보내드립니다.",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "확정한 영상을 파일로 전달합니다.",
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
      "맞춤형에는 브랜드 전용 캐릭터 제작이 포함됩니다. 단순형은 로고와 이미지, 문구를 움직여 만듭니다.",
    ],
    [
      "길이는 어떻게 고르나요?",
      "30초와 60초 중에서 고릅니다. 단순형 30초는 10만 원부터 시작합니다.",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "무엇을 움직이고\n싶으신가요?",
    lead: "넣고 싶은 문구와 자료를 알려주시면 구성과 견적을 안내합니다",
    placeholder: "예: 신제품 소개 문구를 30초 모션그래픽으로 만들고 싶어요",
  },
  signature: {},
};
