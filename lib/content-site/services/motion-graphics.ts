import { r8Sections } from "../r8-sections.ts";
import { r8Details } from "../r8-details.ts";
import { r8Boards } from "../r8-boards.ts";
import { contentPricing, formatWon } from "../../content-pricing.ts";
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
  grammar:r8Details["motion-graphics"]["MOTION GRAMMAR"], cutBoard:r8Boards["motion-graphics"], planning:r8Sections["motion-graphics"]["PLANNING SHEET"],
  characterCase: {
    eyebrow: "BRAND CHARACTER",
    title: "맞춤형에는\n브랜드 전용 캐릭터가 들어갑니다",
    steps: [
      { title: "캐릭터 설정", body: "움직임을 만들기 전에 캐릭터의 기준부터 정리합니다" },
      { title: "포즈 디자인", body: "이미지 생성 도구로 포즈별 캐릭터 이미지를 여러 장 만들어 고릅니다" },
      { title: "모션 제작", body: "배경을 제거한 컷아웃에 움직임을 입혀 30초 영상에 씁니다" },
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
  "eyebrow": "MOTION GRAPHICS",
  "title": "복잡한 설명도\n쉽게 보이도록",
  "lead": "전할 문장을 먼저 정하고 컷별 기획안으로 확인한 뒤 음악 박자에 맞춰 움직이는 30초·60초 영상으로 만듭니다"
},
  process: {
  "title": "정지 화면부터\n함께 맞춥니다",
  "lead": "단계마다 확인하고 다음 단계로 넘어갑니다",
  "steps": [
    {
      "title": "메시지 정리",
      "body": "전할 내용을 한 문장으로 줄이고 읽는 순서를 정합니다",
      "check": "핵심 문구 확인"
    },
    {
      "title": "스타일프레임",
      "body": "색과 서체, 질감을 정지 화면 한 장으로 먼저 보여드립니다",
      "check": "스타일프레임 확인"
    },
    {
      "title": "컷별 비트시트",
      "body": "컷마다 길이와 화면, 자막, 전환을 적은 기획안을 보내드립니다",
      "check": "기획안 수정 2회"
    },
    {
      "title": "애니메이트",
      "body": "확정한 화면에 움직임을 입히고 전환을 박자에 맞춥니다",
      "check": "컷 흐름 확인"
    },
    {
      "title": "사운드 싱크",
      "body": "음악과 효과음의 박에 컷 전환을 맞춰 최종안을 완성합니다",
      "check": "최종안 수정 1회"
    },
    {
      "title": "납품",
      "body": "확정한 영상을 파일로 전달합니다",
      "check": "완성 파일 확인"
    }
  ]
},
  scope: {
    included: [
      "30초 또는 60초 모션그래픽 1편",
      "컷별 비트시트(기획안)",
      "맞춤형은 브랜드 전용 캐릭터 제작",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["대량·정기 제작"],
    prepare: ["로고 원본 파일", "제품 이미지", "넣고 싶은 문구"],
  },
  faq: [
  [
    "단순형과 맞춤형은 무엇이 다른가요?",
    `단순형은 받은 로고와 제품 이미지, 확정 문구로 구성하고 맞춤형은 브랜드 전용 캐릭터 제작이 포함됩니다 30초 기준 단순형은 ${formatWon(contentPricing["motion-graphics"].plans[0].amount)} 맞춤형은 ${formatWon(contentPricing["motion-graphics"].plans[2].amount)}입니다`
  ],
  [
    "길이와 가격은 어떻게 되나요?",
    `30초와 60초 중에서 고를 수 있습니다 단순형은 30초 ${formatWon(contentPricing["motion-graphics"].plans[0].amount)} 60초 ${formatWon(contentPricing["motion-graphics"].plans[1].amount)} 맞춤형은 30초 ${formatWon(contentPricing["motion-graphics"].plans[2].amount)} 60초 ${formatWon(contentPricing["motion-graphics"].plans[3].amount)}입니다`
  ],
  [
    "컷별 기획안에는 무엇이 들어 있나요?",
    "컷마다 길이와 화면 구성, 자막 문구, 전환을 표로 정리하고 색과 서체를 보여주는 스타일프레임을 함께 보내드립니다 기획안은 전달 후 2회까지 수정할 수 있습니다"
  ],
  [
    "가로형과 세로형을 모두 받을 수 있나요?",
    "화면비는 기획안 단계에서 정하며 가로와 세로를 함께 만들 때의 범위는 확인한 뒤 견적을 안내합니다"
  ],
  [
    "음악은 어떻게 정하나요?",
    "영상의 박자에 맞는 곡을 고르고 사용 허락이 확인된 곡만 넣습니다 포함 범위는 견적 상담에서 안내합니다"
  ]
,
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "무엇을 움직이고\n싶으신가요?",
    lead: "넣고 싶은 문구와 자료를 알려주시면 구성과 견적을 안내합니다",
    placeholder: "예: 신제품 소개 문구를 30초 모션그래픽으로 만들고 싶어요",
  },
  signature: motionGraphicsSignature,
};
