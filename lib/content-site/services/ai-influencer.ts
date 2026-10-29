import { r8Sections } from "../r8-sections.ts";
import { r8Details } from "../r8-details.ts";
/* AI 인플루언서 서비스 랜딩 데이터(WP-B 소유). 사실 기준은 FACTS_AI_INFLUENCER.md.
 * 87언니는 AIO가 직접 만든 AI 가상인물(자체 IP)이라 공개 가능(HANDOFF 결정 10-1). 계정 게시물·성과는 없으므로
 * 팔로워·게시·운영 표현을 쓰지 않는다. 고객 시안(제안용) 문자열은 이 파일에 두지 않는다(works.server.ts 게이트).
 * 계정 게시·운영 별도 견적은 가격 주석(lib/content-pricing.ts) 한 곳에만 둔다(VERIFY_FINAL_P2R WP-B-1). */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

/** 서비스 고유 섹션 문구. 이미지 경로는 components/content-site/services/ai-influencer/landing.tsx 상단 상수. */
export const aiInfluencerSignature = {
  brand:{...r8Sections["ai-influencer"]["BRAND CHARACTER"],items:r8Details["ai-influencer"]["BRAND CHARACTER"]},
  /** 히어로 아치 카드 아래쪽 */
  persona: {
    role: "직접 만든 AI 가상인물",
    name: "87언니",
    alt: "87언니 기준 얼굴 이미지 · AI로 만든 가상인물",
    sheetLink: "캐릭터 시트 보기",
  },
  sheet: {
    eyebrow: "CHARACTER SHEET",
    title: "캐릭터 시트로\n인물을 고정합니다",
    lead: "한 번 정한 인물이 이미지와 영상에서 같은 얼굴로 나오도록 기준을 남깁니다",
    views: [
      { id: "front", label: "정면", alt: "87언니 정면 프로필 · AI로 만든 가상인물" },
      { id: "side", label: "측면", alt: "87언니 옆모습 · AI로 만든 가상인물" },
      { id: "full", label: "전신", alt: "87언니 전신 기준 이미지 · AI로 만든 가상인물" },
      { id: "street", label: "일상 장면", alt: "거리를 걷는 87언니 · AI로 만든 가상인물" },
    ],
    viewsLabel: "87언니 기준 이미지 네 장",
    profile: {
      role: "직접 만든 AI 가상인물",
      name: "87언니",
      body: "일상을 영상일기처럼 기록하는 뷰티 분야의 가상인물입니다",
    },
    rows: [
      { term: "외형 기준", detail: "기준 이미지 20장으로 얼굴과 헤어, 의상을 맞춥니다" },
      { term: "말투", detail: "담백한 ‘~해요’ 말투로 자막과 문구를 씁니다" },
      { term: "컨텐츠 톤", detail: "밝은 실내와 일상 장면을 영상일기처럼 담습니다" },
      { term: "쓰지 않을 표현", detail: "제품 효과를 부풀리는 표현은 쓰지 않습니다" },
    ],
    note: "자체 제작한 가상인물의 시트이며 의뢰할 브랜드의 전용 인물은 새로 정합니다",
  },
  disclosure: {
    title: "AI 가상인물임을\n알립니다",
    body: "영상과 이미지에 AI 가상인물 표기를 안내하고 광고로 쓸 때는 광고 표기도 더합니다",
    items: ["AI 가상인물 표기", "광고 표기", "플랫폼 합성 컨텐츠 설정"],
  },
} as const;

export const aiInfluencer: ServiceLandingData = {
  id: "ai-influencer",
  label: "AI 인플루언서",
  seo: {
    title: "AI 인플루언서 제작",
    description:
      "브랜드 전용 AI 가상인물을 세팅하고 그 인물이 나오는 이미지와 숏폼 영상을 제작 · 캐릭터 1명 세팅 기준 10만 원부터, 부가세 별도",
  },
  hero: {
  "eyebrow": "AI INFLUENCER",
  "title": "브랜드를 닮은\nAI 크리에이터",
  "lead": "얼굴과 말투, 관심사를 정해 브랜드 전용 AI 가상인물을 만들고 제품 이미지와 숏폼을 제작합니다"
},
  process: {
  "title": "인물을 먼저 정하고\n만듭니다",
  "lead": "인물 설계와 기준 이미지를 확정한 뒤에 컨텐츠를 만듭니다",
  "steps": [
    {
      "title": "브랜드·제품 정리",
      "body": "브랜드와 제품과 만나려는 고객을 정리하고 인물이 쓰일 곳을 정합니다",
      "check": "인물 쓰임새 확인"
    },
    {
      "title": "페르소나 설계",
      "body": "이름·직업·말투·관심사를 정해 인물의 기본 설정을 만듭니다",
      "check": "인물 방향 확인"
    },
    {
      "title": "기준 이미지·캐릭터 시트",
      "body": "얼굴·헤어·의상의 기준 이미지와 캐릭터 시트를 만듭니다",
      "check": "외형 확인"
    },
    {
      "title": "컨텐츠 포맷 기획안",
      "body": "인물이 나올 컨텐츠 형식과 장면 구성을 담은 기획안을 보내드립니다",
      "check": "기획안 수정 2회"
    },
    {
      "title": "제작·최종안",
      "body": "기준 이미지에 맞춰 이미지와 영상을 만들어 최종안을 보내드립니다",
      "check": "최종안 수정 1회"
    },
    {
      "title": "납품·운영 범위 확인",
      "body": "확정한 파일을 전달합니다\n계정 게시와 운영이 필요하면 범위를 확인해 따로 견적을 드립니다",
      "check": "운영 범위 확인"
    }
  ]
},
  scope: {
    included: [
      "캐릭터 1명 세팅",
      "구성에 따른 이미지와 30초 영상",
      "기획안 수정 2회 · 최종안 수정 1회",
    ],
    separate: ["구성 밖의 추가 이미지와 영상", "대량·정기 제작"],
    prepare: [
      "제품 사진과 정보",
      "원하는 인물의 분위기",
      "참고 계정 · 원하는 말투와 스타일",
    ],
  },
  faq: [
  [
    "어디까지 만들어 주나요?",
    "브랜드 전용 AI 가상인물을 세팅하고 그 인물이 나오는 이미지와 30초 영상을 만듭니다"
  ],
  [
    "이미지 20장 구성은 어떻게 되나요?",
    "총 20장에는 캐릭터 세팅 이미지가 포함되며 주 이미지 5장과 영상 1편으로 구성할 수도 있습니다"
  ],
  [
    "같은 얼굴이 이미지와 영상에서 유지되나요?",
    "기준 이미지와 캐릭터 시트를 기준으로 얼굴과 스타일을 맞추며 최종안에서 함께 확인합니다"
  ],
  [
    "계정 운영도 맡길 수 있나요?",
    "계정 게시와 운영은 인물 제작과 따로 견적을 드립니다\n사용할 채널과 원하는 게시 방식을 알려주세요"
  ],
  [
    "AI 가상인물이라는 표시가 필요한가요?",
    "영상과 이미지에 AI 가상인물 표기를 안내하고 광고로 쓸 때는 광고 표기도 더합니다"
  ]
,
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 인물이\n필요하신가요?",
    lead: "제품과 원하는 분위기를 알려주시면 인물 방향과 견적을 안내합니다",
    placeholder: "예: 스킨케어 제품을 소개할 차분한 분위기의 가상인물이 필요해요",
  },
  signature: aiInfluencerSignature,
};
