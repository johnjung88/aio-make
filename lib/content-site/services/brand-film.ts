import { r8Sections } from "../r8-sections.ts";
import { contentPricing, formatWon } from "../../content-pricing.ts";
/* 브랜드 홍보 영상 서비스 랜딩 데이터(WP-C 소유, BRIEF_P2R_SERVICES 5절).
 * signature = 배경 영상 히어로 문구 · 이야기 순서 · 길이별 구성 예시. 현장 촬영 포함 여부는 쓰지 않는다(Q6).
 * 길이별 구성의 length 값은 lib/content-pricing.ts 플랜 라벨("30초"·"60초")과 같아야 금액·상담 링크가 이어진다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const brandFilmSignature = { hero: {videoLabel:"브랜드 홍보 영상 제작 예시 30초",pause:"영상 일시정지",play:"영상 재생"}, story:r8Sections["brand-film"]["STORY STRUCTURE"], length:r8Sections["brand-film"].LENGTH };
export type BrandFilmSignature = typeof brandFilmSignature;
export const brandFilm: ServiceLandingData = {
  id:"brand-film",label:"브랜드 홍보 영상",
  seo: {
    title: "브랜드 홍보 영상 제작",
    description:
      "홈페이지와 회사 소개에 쓸 30초·60초 브랜드 홍보 영상을 기획부터 편집까지 제작 · 30초 25만 원부터, 부가세 별도",
  },
  hero: {
  "eyebrow": "BRAND FILM",
  "title": "회사와 제품을\n소개하는 한 편",
  "lead": "회사와 제품의 이야기를 스토리보드로 먼저 정리하고 홈페이지와 소개 자리에서 보여줄 30초·60초 영상으로 편집합니다"
},
  process: {
  "title": "자료 정리부터\n함께합니다",
  "lead": "단계마다 확인하고 다음 단계로 넘어갑니다",
  "steps": [
    {
      "title": "자료 정리",
      "body": "회사 소개서와 제품 정보에서 전할 이야기를 고르고 한 줄 메시지로 줄입니다",
      "check": "핵심 메시지 확인"
    },
    {
      "title": "스토리보드",
      "body": "장면 순서와 자막 문구, 소재 계획을 담은 스토리보드를 보내드립니다",
      "check": "기획안 수정 2회"
    },
    {
      "title": "소스 수급",
      "body": "보유한 사진과 영상을 고르고 부족한 장면은 계획에 맞춰 제작합니다",
      "check": "사용 소재와 사용 허락 확인"
    },
    {
      "title": "편집",
      "body": "스토리보드대로 컷을 잇고 자막과 그래픽을 입힙니다",
      "check": "컷 흐름 확인"
    },
    {
      "title": "색·사운드",
      "body": "장면 사이의 색을 맞추고 음악과 효과음을 영상에 맞춰 섞어 최종안을 완성합니다",
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
      "30초 또는 60초 영상 1편",
      "스토리보드와 문구 기획",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["대량·정기 제작", "기본 구성 밖의 추가 작업"],
    prepare: [
      "회사 소개서나 제품 정보",
      "로고와 브랜드 색",
      "참고하고 싶은 영상 링크",
    ],
  },
  faq: [
  [
    "길이와 가격은 어떻게 되나요?",
    `30초는 한 가지 메시지에 집중하는 구성이고 60초는 고객의 문제와 제품, 일하는 방식까지 담는 구성입니다\n가격은 30초 ${formatWon(contentPricing["brand-film"].plans[0].amount)} 60초 ${formatWon(contentPricing["brand-film"].plans[1].amount)}입니다`
  ],
  [
    "무엇을 준비하면 되나요?",
    "회사 소개서와 제품 정보, 로고 파일을 보내주시면 부족한 자료는 상담에서 정리합니다"
  ],
  [
    "영상에 쓸 사진과 영상은 어떻게 마련하나요?",
    "보유한 사진과 영상을 먼저 고르고 부족한 장면은 스토리보드의 소재 계획에 맞춰 제작합니다"
  ],
  [
    "제조사나 거래처가 만든 사진과 로고를 써도 되나요?",
    "소재 목록에서 사용 허락 범위를 먼저 확인하고 확인된 소재만 편집에 넣습니다"
  ],
  [
    "음악은 어떻게 정하나요?",
    "영상의 박자에 맞는 곡을 고르고 사용 허락이 확인된 곡만 넣습니다\n포함 범위는 견적 상담에서 안내합니다"
  ]
,
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 이야기를\n담고 싶으신가요?",
    lead: "회사와 제품을 알려주시면 이야기 구성과 견적을 안내합니다",
    placeholder: "예: 회사 소개용 60초 영상을 홈페이지에 올리고 싶어요",
  },
  signature: brandFilmSignature,
};
