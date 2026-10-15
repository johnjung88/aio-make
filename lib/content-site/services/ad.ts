import { contentPricing, formatWon } from "../../content-pricing.ts";
/* SNS 광고 영상 서비스 랜딩 데이터(R6 WP-C).
 * signature.screens = 히어로 레일의 문구 카드에 얹는 가상 광고 문구(장식, 레일 전체가 aria-hidden). 장면 설명 카피는 두지 않는다.
 * 광고 성과(클릭률·전환·노출 수치)는 근거가 없어 쓰지 않는다. 숫자로 된 초 단위 표현도 쓰지 않는다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const adSignature = {
  hooks: ["상황으로 시작", "문구로 시작", "제품 동작으로 시작"],
};

export type AdSignature = typeof adSignature;

export const ad: ServiceLandingData = {
  id: "ad",
  label: "SNS 광고 영상",
  seo: {
    title: "SNS 광고 영상 제작",
    description:
      "릴스와 쇼츠용 9:16 광고 영상 제작 · 기본 자막과 배경음악 포함 · 30초 25만 원부터, 부가세 별도",
  },
  hero: {
  "eyebrow": "SNS AD FILM",
  "title": "제품의 매력을\n짧고 선명하게",
  "lead": "릴스와 쇼츠에서 제품 하나를 알리는 9:16 광고 영상을 첫 장면부터 기획하고 자막과 음악까지 편집합니다"
},
  process: {
  "title": "첫 장면부터\n함께 정합니다",
  "lead": "단계마다 확인하고 다음 단계로 넘어갑니다",
  "steps": [
    {
      "title": "제품·목표 정리",
      "body": "알릴 제품과 광고를 올릴 채널을 정하고 핵심 메시지를 하나로 줄입니다",
      "check": "핵심 메시지 1개 확인"
    },
    {
      "title": "훅 설계",
      "body": "첫 장면에 보여줄 상황과 문구를 먼저 정하고 이어질 이야기를 짭니다",
      "check": "첫 장면 확인"
    },
    {
      "title": "컷 구성",
      "body": "컷마다 길이와 화면, 자막, 소리를 적은 대본을 보내드립니다",
      "check": "기획안 수정 2회"
    },
    {
      "title": "소스 제작",
      "body": "확정한 컷대로 제품 사진과 자료를 바탕으로 장면을 만듭니다",
      "check": "장면 흐름 확인"
    },
    {
      "title": "화면비별 편집",
      "body": "9:16 세로를 기본으로 컷을 잇고 기본 자막과 배경음악을 넣습니다",
      "check": "최종안 수정 1회"
    },
    {
      "title": "납품",
      "body": "9:16 세로 영상 파일을 전달하며 다른 화면비는 추가 작업으로 안내합니다",
      "check": "9:16 · 1080p 파일 확인"
    }
  ]
},
  scope: {
    included: [
      "제품·서비스 1개와 콘셉트 1개",
      "9:16 세로형 · 1080p",
      "기본 자막과 배경음악",
    ],
    separate: ["다른 화면비 추가", "광고 집행과 매체비", "계정 운영"],
    prepare: [
      "제품 사진과 상세페이지",
      "로고와 브랜드 색",
      "참고하고 싶은 광고 링크",
    ],
  },
  faq: [
  [
    "기본 가격에 무엇이 포함되나요?",
    `제품이나 서비스 1개와 콘셉트 1개를 기준으로 기본 자막과 배경음악을 넣은 9:16 세로 영상(1080p)을 만듭니다 가격은 30초 ${formatWon(contentPricing.ad.plans[0].amount)} 60초 ${formatWon(contentPricing.ad.plans[1].amount)}입니다`
  ],
  [
    "첫 장면은 어떻게 정하나요?",
    "기획안의 가장 앞에 첫 장면과 문구를 적어 보내드리고 확인을 받은 뒤 나머지 컷을 구성합니다"
  ],
  [
    "소리를 끄고 봐도 내용이 전달되나요?",
    "기본 자막을 넣어 소리를 켜지 않아도 핵심 내용이 읽히도록 구성합니다"
  ],
  [
    "가로형이나 정사각형도 받을 수 있나요?",
    "기본 9:16 세로형 외에 필요한 화면비는 추가 작업으로 따로 견적을 드립니다"
  ],
  [
    "광고 집행이나 계정 운영도 맡길 수 있나요?",
    "표시한 가격은 영상 제작 비용이며 광고 집행과 계정 운영, 매체비는 별도로 상담합니다"
  ]
,
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 제품을\n알리고 싶으신가요?",
    lead: "제품과 올릴 채널을 알려주시면 기획 범위와 견적을 안내합니다",
    placeholder: "예: 새로 나온 세럼을 릴스 광고로 알리고 싶어요",
  },
  signature: adSignature,
};
