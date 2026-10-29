import { r8Sections } from "../r8-sections.ts";
import { r8Details } from "../r8-details.ts";
/* 웹툰 서비스 랜딩 데이터(WP-A 소유). 카피는 BRIEF_P2R_SERVICES 1절 초안을 R6 BRIEF 5절로 다듬은 것이다.
 * signature 문자열도 카피 테스트 대상이다. 금액은 쓰지 않고 lib/content-pricing.ts로 렌더한다.
 * 이미지 경로·alt는 components/content-site/services/webtoon/landing.tsx 상단 상수에 둔다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구(12P 리더 · 모션코믹). 히어로 표지는 컷 1장이라 문구가 없다 */
export const webtoonSignature = {
  types: r8Details.webtoon["STORY TYPES"], craft: r8Sections.webtoon["ONE CUT"],
  reader: {
    eyebrow: "READ",
    title: "제작 사례 12P를\n직접 넘겨보세요",
    lead: "《1억의 구단주》의 미리보기 12P를 한 페이지씩 넘겨볼 수 있습니다",
    label: "1억의 구단주 12P 미리보기",
  },
  motionComic: {
    eyebrow: "MOTION COMIC",
    title: "완성한 웹툰을\n영상으로 잇습니다",
    lead: "컷에 움직임과 화면 전환을 더해 영상으로 만듭니다",
    videoLabel: "《1억의 구단주》 소개 영상",
    waysLabel: "맡기는 방법",
    ways: [
      {
        title: "웹툰과 함께 맡길 때",
        body: "12P은 30초, 24P은 60초 영상과 묶어 맡길 수 있습니다",
      },
      {
        title: "모션코믹만 맡길 때",
        body: "이미 완성한 웹툰이 있다면 완성 원고 이미지로 영상만 만듭니다",
      },
    ],
  },
} as const;

export const webtoon: ServiceLandingData = {
  id: "webtoon",
  label: "웹툰",
  seo: {
    title: "브랜드 웹툰 제작",
    description:
      "브랜드 웹툰 12P·24P 제작 1P는 가로 1,024px × 세로 1,536px이며 모션코믹도 함께 의뢰할 수 있습니다\n웹툰 12P 10만 원부터, 부가세 별도",
  },
  hero: {
  "eyebrow": "WEBTOON",
  "title": "제품의 이야기를\n웹툰 한 편으로",
  "lead": "제품을 만나는 순간부터 사용하는 장면까지 12P·24P 이야기로 엮어 페이지별 이미지로 전달합니다"
},
  process: {
  "title": "줄거리에서\n페이지별 완성본까지",
  "lead": "기획안과 최종안을 두 번 확인한 뒤 다음 단계로 넘어갑니다",
  "steps": [
    {
      "title": "이야기 정리",
      "body": "알리려는 제품과 독자를 정하고 전하고 싶은 한 가지를 잡습니다",
      "check": "핵심 메시지 확인"
    },
    {
      "title": "형식·분량 결정",
      "body": "이야기 형식과 12P·24P 중 분량을 정하고 줄거리를 씁니다",
      "check": "줄거리 확인"
    },
    {
      "title": "콘티·대사 기획안",
      "body": "컷 나눔과 구도와 대사를 담은 콘티를 보내드립니다",
      "check": "기획안 수정 2회"
    },
    {
      "title": "작화",
      "body": "확정한 콘티대로 인물과 배경을 그립니다",
      "check": "인물과 제품 모습 확인"
    },
    {
      "title": "식자·최종안",
      "body": "말풍선과 효과음을 넣어 최종안을 보내드립니다",
      "check": "최종안 수정 1회"
    },
    {
      "title": "납품",
      "body": "대사와 페이지 순서를 확인한 뒤 페이지별 완성 원고를 전달합니다",
      "check": "페이지별 이미지 확인"
    }
  ]
},
  scope: {
    included: [
      "12P 또는 24P 한 회",
      "줄거리 · 컷별 콘티 · 대사 · 작화 · 식자",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["모션코믹 영상화(옵션)", "대량·정기 제작"],
    prepare: [
      "제품 정보와 알리고 싶은 내용",
      "등장시키고 싶은 인물이나 상황",
      "참고하고 싶은 웹툰 링크",
    ],
  },
  faq: [
  [
    "1P는 어떤 규격이고 분량은 어떻게 고르나요?",
    "1P는 가로 1,024px × 세로 1,536px입니다\n12P·24P 중 필요한 분량을 고르고, 각 페이지의 장면과 대사를 함께 정합니다"
  ],
  [
    "모션코믹은 무엇인가요?",
    "완성한 웹툰을 움직이는 영상으로 바꾸는 작업입니다"
  ],
  [
    "모션코믹만 따로 맡길 수 있나요?",
    "이미 완성한 웹툰이 있다면 완성 원고 이미지로 영상만 만들 수 있으며 30초와 60초 중에서 고릅니다"
  ],
  [
    "대사는 누가 쓰나요?",
    "대사는 저희가 쓰며 꼭 넣을 문구가 있다면 상담할 때 알려주세요"
  ],
  [
    "제품 사진을 보내야 하나요?",
    "제품이 나오는 컷은 제품 사진과 소개 자료를 참고해 그립니다\n포장 글자처럼 정확해야 하는 부분은 최종안에서 함께 확인합니다"
  ]
,
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 이야기를\n그리고 싶으신가요?",
    lead: "제품과 독자를 알려주시면 콘티 방향과 견적을 안내합니다",
    placeholder: "예: 우리 제품을 쓰는 직장인 이야기를 12P로 그리고 싶어요",
  },
  signature: webtoonSignature,
};
