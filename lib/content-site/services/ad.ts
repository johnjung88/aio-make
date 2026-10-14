/* SNS 광고 영상 서비스 랜딩 데이터(R6 WP-C).
 * signature.screens = 히어로 레일의 문구 카드에 얹는 가상 광고 문구(장식, 레일 전체가 aria-hidden). 장면 설명 카피는 두지 않는다.
 * 광고 성과(클릭률·전환·노출 수치)는 근거가 없어 쓰지 않는다. 숫자로 된 초 단위 표현도 쓰지 않는다. */
import { COMMON_FAQ } from "../faq.ts";
import type { ServiceLandingData } from "../types.ts";

export const adSignature = {
  screens: ["밤의 향기", "은은한 잔향", "문의하기"],
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
    eyebrow: "SNS AD FILM",
    title: "제품의 매력을\n짧고 선명하게",
    lead: "릴스와 쇼츠에서 제품 하나를 알리는 9:16 광고 영상을 기획하고 자막과 음악까지 편집합니다",
  },
  types: {
    eyebrow: "WHAT WE MAKE",
    title: "제품에 맞춰 고르는\n광고의 표현 방식",
    items: [
      {
        title: "제품 중심 광고",
        body: "제품 전체 모습과 디테일, 쓰이는 상황을 중심으로 소개하는 구성입니다",
      },
      {
        title: "인물 등장 광고",
        body: "AI 가상인물이 제품과 함께 등장하는 장면을 만들고 가상인물 표기를 더합니다",
      },
      {
        title: "모션형 광고",
        body: "제품 사진과 핵심 문구를 그래픽과 화면 전환으로 연결하는 구성입니다",
      },
    ],
  },
  process: {
    title: "첫 장면부터\n함께 정합니다",
    steps: [
      {
        title: "목표와 제품 정리",
        body: "알릴 제품과 광고를 올릴 채널을 함께 정리합니다",
        check: "핵심 메시지 1개 확인",
      },
      {
        title: "기획안 전달",
        body: "첫 장면과 문구, 장면 순서를 담은 기획안을 보내드립니다",
        check: "기획안 수정 2회",
      },
      {
        title: "제작·최종안",
        body: "확정한 기획안대로 장면을 만들고 자막과 배경음악을 넣습니다",
        check: "최종안 수정 1회",
      },
      {
        title: "납품",
        body: "9:16 세로 영상 파일을 전달합니다",
        check: "9:16 · 1080p 파일 확인",
      },
    ],
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
      "제품이나 서비스 1개와 콘셉트 1개를 기준으로 기본 자막과 배경음악을 넣은 9:16 세로 영상(1080p)을 만듭니다",
    ],
    [
      "가로형이나 정사각형도 받을 수 있나요?",
      "기본 9:16 세로형 외에 필요한 화면비는 추가 작업으로 따로 견적을 드립니다",
    ],
    [
      "광고 집행이나 계정 운영도 맡길 수 있나요?",
      "표시한 가격은 영상 제작 비용이며 광고 집행과 계정 운영, 매체비는 별도로 상담합니다",
    ],
    ...COMMON_FAQ,
  ],
  inquiry: {
    title: "어떤 제품을\n알리고 싶으신가요?",
    lead: "제품과 올릴 채널을 알려주시면 기획 범위와 견적을 안내합니다",
    placeholder: "예: 새로 나온 세럼을 릴스 광고로 알리고 싶어요",
  },
  signature: adSignature,
};
