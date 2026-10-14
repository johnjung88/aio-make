/* 모션그래픽 서비스 랜딩 데이터(WP-B 소유). 금액은 lib/content-pricing.ts에서만 렌더한다.
 * WP0 수정: seo.description 마지막 문장을 마침표 규칙에 맞게 `…10만 원부터, 부가세 별도.`로 바꿨다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구.
 * R6: 키네틱 타이포 구성(MOTION STUDY)·단순형/맞춤형 2칸·스타일 프레임 문구를 삭제했다(가격 섹션이 같은 내용).
 * characterCase는 공개판에 그대로 나가는 일반 공정 설명이다. 고객명·제품명·수치·기간은 넣지 않는다
 * (FACTS_YOPRI.md의 확정 사실을 비식별로 옮긴 것만: 제품을 의인화한 점토 질감 캐릭터 · 이미지 생성 도구로 포즈 제작 · 배경 제거 컷아웃을 30초 광고 영상에 사용).
 * 캐릭터 성격·세계관·외형 규칙은 자료가 없어 설정 단계는 일반 서술에 그친다. */
export const motionGraphicsSignature = {
  characterCase: {
    eyebrow: "BRAND CHARACTER",
    title: "브랜드 전용 캐릭터는\n이렇게 만듭니다",
    steps: [
      { title: "캐릭터 설정", body: "브랜드의 말투와 성격, 쓰는 장면의 규칙을 먼저 정합니다" },
      { title: "포즈 디자인", body: "제품을 의인화한 점토 질감의 캐릭터를 이미지 생성 도구로 포즈별로 여러 장 만듭니다" },
      { title: "모션 제작", body: "배경을 제거한 컷아웃에 움직임을 입혀 30초 광고 영상에 씁니다" },
    ],
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
