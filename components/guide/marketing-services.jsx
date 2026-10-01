"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
import {
  GuideLogic,
  GuideImage,
  GuideMedia,
  GuideLink,
  GuideNav,
  ServiceTabs,
  GuideCloud,
  GuideEffects,
  GuideOffer,
  developmentOffer,
  guideAsset,
  guideServiceHref,
  guideContactKey,
  adaptGuideValues,
  marketingExamples,
} from "./primitives";
import { InquiryBridge } from "./inquiry-bridge";
import LAB_DATA from "./lab-data";

const U = (id) => guideAsset(id);
const N = (arr) =>
  arr.map((text, i) => ({ no: String(i + 1).padStart(2, "0"), text }));
const CASES = marketingExamples;
const SVC = {
  integrated: {
    name: "통합 마케팅",
    en: "INTEGRATED MARKETING",
    heroImg: U("1542744173-8e7e53415bb0"),
    caseSvc: "통합 마케팅",
    intro:
      "영상 위주로 원본 20개를 만들고, 다섯 채널 규격에 맞춰 다시 편집해 한 달에 100개를 올립니다. 구글·네이버 스토어와 검색·AI 답변은 매달 분석하고 개선합니다",
    price: "월 2,000,000원부터",
    priceUnit: "월 운영료 · 부가세 별도",
    priceNote:
      "착수일부터 최소 3개월입니다. 스레드 운영은 별도 협의이며 추가 금액이 있습니다",
    volumes: [
      ["20", "개", "원본 콘텐츠 (영상 위주)"],
      ["100", "개", "5개 채널 게시 콘텐츠"],
      ["1", "회", "구글·네이버 스토어 분석·개선"],
      ["1", "회", "SEO·AEO·GEO 분석·개선"],
    ],
    forWhom: N([
      "영상 콘텐츠를 꾸준히 올려야 하는데 만들 시간이 없는 곳",
      "구글맵·네이버 플레이스의 정보와 리뷰를 관리할 여력이 없는 곳",
      "SNS, 지도, 검색을 따로 맡기지 않고 한 곳에서 운영하고 싶은 곳",
    ]),
    work: [
      [
        "상담·분석",
        "사업·경쟁 대안·타깃과 운영 채널, 사이트 상태를 확인하고 정리합니다",
        "분석 자료\n시장 · 경쟁사 · 운영 방향",
      ],
      [
        "콘텐츠 제작·게시",
        "영상 위주 원본 20개를 만들고 채널 형식에 맞게 변형해 게시합니다",
        "월 100개 게시\n5개 채널 합계",
      ],
      [
        "구글·네이버 스토어",
        "구글맵과 네이버 플레이스의 업체 정보·리뷰를 분석하고 개선합니다",
        "월 1회\n분석·개선",
      ],
      [
        "SEO·AEO·GEO",
        "검색 결과, 답변 영역, 생성형 AI 답변의 노출을 분석하고 개선합니다",
        "월 1회\n분석·개선",
      ],
      [
        "사이트 구축·리뉴얼",
        "기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다",
        "구축 또는 리뉴얼\n계약 고객 혜택",
      ],
    ],
    scope: [
      "월 원본 콘텐츠 20개 제작 (영상 위주)",
      "원본 멀티 유즈: 채널별 변형·게시 월 100개",
      "유튜브 숏츠 게시",
      "인스타그램 게시",
      "페이스북 게시",
      "네이버 클립 게시",
      "네이버 블로그 게시",
      "구글맵 업체 정보·리뷰 월 1회 분석·개선",
      "네이버 플레이스 업체 정보·리뷰 월 1회 분석·개선",
      "SEO·AEO·GEO 월 1회 분석·개선",
      "시장·경쟁사·운영 방향 분석 자료 (상담 시)",
      "사이트 구축·리뉴얼 (계약 시)",
    ],
    scopeNote: "월 기준",
    excl: [
      "스레드 운영 (별도 협의, 추가 금액)",
      "유료 광고 집행·매체비",
      "체험단",
      "현장 촬영·롱폼 영상",
      "AI 인플루언서",
      "독립 SEO 구축·코드 배포",
    ],
    steps: [
      ["상담·분석", "시장·경쟁사 자료 수집", "운영 방향 결정, 분석 자료 전달"],
      ["계약·구축", "현재 사이트 점검, 구조 초안", "구축·리뉴얼 범위 확정"],
      [
        "제작·게시",
        "원본 20개와 채널별 변형 초안",
        "사실·권리 검수 후 5개 채널 게시",
      ],
      [
        "월 분석·개선",
        "스토어·검색·AI 답변 데이터 정리",
        "개선 항목 결정과 적용",
      ],
    ],
    faqs: [
      [
        "월 20회는 무엇을 뜻하나요?",
        "원본 콘텐츠 20개를 만들고 채널 형식에 맞게 변형해 5개 채널에 게시합니다. 채널별 수량과 형식은 월 플랜에서 합의하며, 5개 채널 합계는 100개입니다",
      ],
      [
        "상담만 받아도 자료를 받을 수 있나요?",
        "상담하신 고객께 시장, 경쟁사, 운영 방향 분석 자료를 제공합니다",
      ],
      [
        "계약하면 사이트도 만들어 주나요?",
        "기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다",
      ],
      [
        "스레드도 운영해 주나요?",
        "스레드 운영은 별도 협의이며 추가 금액이 있습니다",
      ],
      [
        "매출이나 순위를 보장하나요?",
        "조회·문의·매출 증대와 검색 순위는 보장하지 않습니다",
      ],
      [
        "무엇을 준비해야 하나요?",
        "상품·가격·영업시간 같은 사실 정보, 사진·영상 사용권, 구글·네이버 업체 계정 권한을 준비해 주세요",
      ],
    ],
    posts: [
      [
        "구글·네이버 지도, 매달 무엇을 확인할까",
        U("1516321318423-f06f85e504b3", 700),
      ],
      [
        "영상 원본 하나를 여러 채널에 쓰는 법",
        U("1563986768609-322da13575f3", 700),
      ],
      [
        "AI 답변에 우리 브랜드가 나오게 하려면",
        U("1460925895917-afdab827c52f", 700),
      ],
    ],
  },
  sns: {
    name: "SNS 대행 운영",
    en: "SNS MANAGEMENT",
    heroImg: U("1563986768609-322da13575f3"),
    caseSvc: "SNS 대행 운영",
    intro:
      "월 12회 이미지 콘텐츠와 월 4회 영상 콘텐츠를 제작해 게시합니다. 원본 소스를 채널 형식에 맞게 바꿔 멀티 유즈합니다",
    price: "월 1,000,000원",
    priceUnit: "월 운영료 · 부가세 별도",
    priceNote: "기본 채널은 유튜브 숏츠, 인스타그램, 네이버 블로그입니다",
    volumes: [
      ["12", "회", "이미지 콘텐츠 제작·게시"],
      ["4", "회", "영상 콘텐츠 제작·게시"],
      ["3", "개", "기본 채널"],
    ],
    forWhom: N([
      "SNS를 꾸준히 올려야 하는데 손이 모자란 곳",
      "채널마다 형식을 바꿔 올리기 번거로운 곳",
      "지도·검색 관리 없이 콘텐츠 운영만 필요한 곳",
    ]),
    work: [
      [
        "상담·분석",
        "사업과 운영 채널을 확인하고 시장·경쟁사·운영 방향을 정리합니다",
        "분석 자료\n시장 · 경쟁사 · 운영 방향",
      ],
      [
        "콘텐츠 제작",
        "이미지 12회, 영상 4회 분량의 원본을 만들고 사실·권리를 검수합니다",
        "월 16개 원본\n이미지 12 · 영상 4",
      ],
      [
        "멀티 유즈·게시",
        "원본 소스를 채널 형식에 맞게 바꿔 기본 채널에 게시합니다",
        "기본 3개 채널\n유튜브 숏츠 · 인스타그램 · 네이버 블로그",
      ],
      [
        "사이트 구축·리뉴얼",
        "기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다",
        "구축 또는 리뉴얼\n계약 고객 혜택",
      ],
    ],
    scope: [
      "월 12회 이미지 콘텐츠 제작·게시",
      "월 4회 영상 콘텐츠 제작·게시",
      "원본 소스 멀티 유즈",
      "유튜브 숏츠",
      "인스타그램",
      "네이버 블로그",
      "시장·경쟁사·운영 방향 분석 자료 (상담 시)",
      "사이트 구축·리뉴얼 (계약 시)",
    ],
    scopeNote: "월 기준",
    excl: [
      "기본 채널 외 추가 채널 (협의)",
      "구글·네이버 스토어 관리",
      "SEO·AEO·GEO 분석·개선",
      "유료 광고 집행",
      "현장 촬영·롱폼 영상",
    ],
    steps: [
      ["상담·분석", "시장·경쟁사 자료 수집", "운영 방향 결정"],
      ["제작", "이미지·영상 원본 초안", "사실·권리·형식 검수"],
      ["게시", "채널별 변형과 게시 예약", "실제 게시 확인"],
      ["개선", "채널 지표 정리", "유지·중단·시험 결정"],
    ],
    faqs: [
      [
        "어떤 채널을 운영하나요?",
        "기본 채널은 유튜브 숏츠, 인스타그램, 네이버 블로그입니다. 그 밖의 채널은 협의합니다",
      ],
      [
        "멀티 유즈는 무엇인가요?",
        "하나의 원본 소스를 채널 형식에 맞게 바꿔 여러 채널에 게시하는 방식입니다",
      ],
      [
        "통합 마케팅과 무엇이 다른가요?",
        "통합 마케팅은 영상 위주 월 20회, 5개 채널 게시에 구글·네이버 스토어와 SEO·AEO·GEO 월 1회 분석·개선이 더해집니다. SNS 대행 운영은 콘텐츠 제작·게시에 집중합니다",
      ],
    ],
    posts: [
      [
        "인스타그램 운영, 한 달에 몇 개를 올려야 할까",
        U("1611162616305-c69b3fa7fbe0", 700),
      ],
      [
        "쇼츠와 릴스, 같은 영상을 올려도 될까",
        U("1563986768609-322da13575f3", 700),
      ],
      [
        "블로그 글 하나로 여러 채널 콘텐츠 만들기",
        U("1432888498266-38ffec3eaf0a", 700),
      ],
    ],
  },
  ai: {
    name: "AI 인플루언서 마케팅",
    en: "AI INFLUENCER",
    heroImg: U("1531746020798-e6953c6e8e04"),
    caseSvc: "",
    intro:
      "브랜드 전용 가상 인물로 월 8회, 30초 기준 콘텐츠를 제작해 게시합니다",
    price: "월 1,000,000원",
    priceUnit: "월 운영료 · 부가세 별도",
    priceNote:
      "캐릭터 구축은 별도 비용 없이 서비스로 제공합니다. 통합 마케팅과는 별도 상품입니다",
    volumes: [
      ["무상", "", "캐릭터 구축 (서비스 제공)"],
      ["8", "회", "콘텐츠 제작·게시"],
      ["30", "초", "콘텐츠 1회 기준"],
    ],
    forWhom: N([
      "같은 인물로 브랜드 콘텐츠를 꾸준히 내고 싶은 곳",
      "모델 섭외 비용과 일정이 부담되는 브랜드",
      "가상 인물 계정을 따로 키우고 싶은 곳",
    ]),
    work: [
      [
        "상담·분석",
        "사업과 운영 채널을 확인하고 시장·경쟁사·운영 방향을 정리합니다",
        "분석 자료\n시장 · 경쟁사 · 운영 방향",
      ],
      [
        "캐릭터 구축",
        "가상 인물의 외형·말투·표기 방식을 정하고 권리를 확인합니다",
        "캐릭터 기준\n구축비 없음 (서비스)",
      ],
      [
        "콘텐츠 제작·게시",
        "캐릭터로 30초 콘텐츠를 만들고 인물·제품 정확성을 검수해 게시합니다",
        "월 8회\n30초 기준",
      ],
      [
        "사이트 구축·리뉴얼",
        "기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다",
        "구축 또는 리뉴얼\n계약 고객 혜택",
      ],
    ],
    scope: [
      "캐릭터 구축 (별도 비용 없이 서비스 제공)",
      "월 8회 콘텐츠 제작·게시",
      "콘텐츠 1회 30초 기준",
      "인물·제품 정확성 검수",
      "시장·경쟁사·운영 방향 분석 자료 (상담 시)",
      "사이트 구축·리뉴얼 (계약 시)",
    ],
    scopeNote: "월 기준",
    excl: [
      "월 8회를 넘는 제작",
      "캐릭터 재설계·다른 인물",
      "정교한 립싱크",
      "다인물·복잡한 제품 동작",
      "실존 인물 복제",
    ],
    steps: [
      ["설계", "외형·말투 시안 생성", "브랜드 기준·권리 확인"],
      ["캐릭터 확정", "기준 이미지 정리", "일관성 검수 후 확정"],
      ["제작·게시", "콘텐츠 초안", "인물·제품 검수 후 게시"],
      ["개선", "게시·반응 정리", "다음 달 방향 결정"],
    ],
    faqs: [
      [
        "캐릭터 구축비가 따로 있나요?",
        "없습니다. 캐릭터 구축은 서비스로 제공하고 월 운영료만 받습니다",
      ],
      [
        "통합 마케팅에 포함되나요?",
        "통합 마케팅에는 포함되지 않는 별도 상품입니다. 함께 계약할 수 있습니다",
      ],
      [
        "캐릭터를 다른 고객에게도 쓰나요?",
        "합의한 캐릭터 자산은 다른 고객에게 재사용하지 않습니다. 제3자의 유사 생성까지 막는 것은 보장하지 않습니다",
      ],
      [
        "실존 인물을 닮게 만들 수 있나요?",
        "실존 인물 복제는 권리자 허락이 확인되기 전까지 진행하지 않습니다",
      ],
    ],
    posts: [
      [
        "AI 인플루언서를 운영하기 전에 정해야 할 것들",
        U("1531746020798-e6953c6e8e04", 700),
      ],
      [
        "가상 인물 표기, 어떻게 해야 할까",
        U("1611162616305-c69b3fa7fbe0", 700),
      ],
      [
        "캐릭터 일관성을 지키는 검수 기준",
        U("1563986768609-322da13575f3", 700),
      ],
    ],
  },
  seo: {
    name: "SEO·AEO·GEO",
    en: "SEO · AEO · GEO",
    heroImg: U("1460925895917-afdab827c52f"),
    caseSvc: "SEO·AEO·GEO",
    intro:
      "기존 사이트의 검색 접근성과 질문 대응, 기술 오류를 진단하고 실제 코드·CMS에 적용해 검수까지 합니다. 월 유지는 선택입니다",
    price: "개별 견적",
    priceUnit: "일회 구축 + 선택 월 유지 · 부가세 별도",
    priceNote:
      "URL·템플릿 수, CMS와 소스·배포 권한, 수정 난도에 따라 견적합니다",
    forWhom: N([
      "사이트는 있는데 검색에서 잘 보이지 않는 곳",
      "고객이 묻는 질문에 사이트가 답하지 못하는 곳",
      "메타·구조화 데이터 같은 기술 설정을 점검받고 싶은 곳",
    ]),
    work: [
      [
        "진단",
        "대상 URL·템플릿의 색인·응답·메타·본문·구조화 데이터 상태를 기록합니다",
        "기준값 진단서\n현재 상태 기록",
      ],
      [
        "설계",
        "고객 질문과 URL 대응, 수정할 템플릿·우선순위·롤백 방법을 합의합니다",
        "수정 설계안\n범위·롤백 합의",
      ],
      [
        "적용",
        "합의한 소스·CMS에서 메타·canonical·sitemap·구조화 데이터를 수정합니다",
        "코드·설정 변경\n변경 기록 제공",
      ],
      [
        "검수·인계",
        "스테이징 검수, 운영 배포, 배포 후 재검수를 진행합니다",
        "배포 결과\n사용 안내",
      ],
    ],
    scope: [
      "현재 상태 진단",
      "질문·페이지 설계",
      "메타·canonical·robots·sitemap",
      "본문 구조·내부링크",
      "구조화 데이터",
      "스테이징·운영 검수",
      "선택 월 유지 (관측·경미한 수정·보고)",
    ],
    scopeNote: "실제 수정 가능한 CMS·소스가 있는 기존 사이트 1개 기준",
    excl: [
      "사이트 신규 제작·플랫폼 이전",
      "회원·결제·DB 기능",
      "다국어·대규모 동적 라우트",
      "새 페이지 원본 작성",
      "5채널 SNS 운영",
      "색인·AI 인용·순위 보장",
    ],
    steps: [
      ["진단", "크롤링·색인 상태 수집", "우선순위 판단"],
      ["설계", "질문·URL 대응 초안", "수정 범위·롤백 합의"],
      ["적용", "설정·마크업 초안", "코드 적용과 스테이징 검수"],
      ["배포·유지", "배포 후 관측", "운영 배포 승인·재검수"],
    ],
    faqs: [
      [
        "AI 답변용 특수 파일이 필요한가요?",
        "Google 공식 안내는 AI 기능을 위해 별도 특수 스키마나 AI 파일이 필요하지 않다고 설명합니다. 저희는 검증 가능한 검색·콘텐츠 개선에 집중합니다",
      ],
      [
        "통합 마케팅의 SEO·AEO·GEO와 무엇이 다른가요?",
        "통합 마케팅은 월 1회 분석·개선입니다. 별도 견적은 사이트 코드·CMS에 직접 적용하는 구축 작업입니다",
      ],
      [
        "순위를 보장하나요?",
        "색인, AI 인용, 순위, 매출은 보장하지 않습니다. 변경·관측·미확인 원인을 나눠 보고합니다",
      ],
      [
        "사이트 수정 권한이 없으면요?",
        "소스·호스팅·배포 권한이 없으면 가능한 CMS 설정만 명시하거나 견적을 다시 만듭니다",
      ],
    ],
    posts: [
      [
        "AI 답변에 우리 브랜드가 나오게 하려면",
        U("1516321318423-f06f85e504b3", 700),
      ],
      [
        "구조화 데이터가 검색 결과에 주는 영향",
        U("1460925895917-afdab827c52f", 700),
      ],
      [
        "새 사이트에 검색 기본 설정이 필요한 이유",
        U("1432888498266-38ffec3eaf0a", 700),
      ],
    ],
  },
};
const CAL_TAGS = {
  0: "영상",
  1: "영상",
  2: "클립",
  3: "블로그",
  4: "영상",
  7: "영상",
  8: "영상",
  9: "클립",
  10: "블로그",
  11: "스토어",
};
const TAG_C = {
  블로그: ["#0D0D12", "#fff"],
  영상: ["#6B4DFF", "#fff"],
  클립: ["#A99BFF", "#0D0D12"],
  스토어: ["#DAD8D1", "#0D0D12"],
};
const rc = React.createElement,
  VV = "#6B4DFF",
  VL = "#A99BFF",
  FF = "'Pretendard Variable',Pretendard,sans-serif";
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
  pr = (t, a, b) => cl((t - a) / (b - a)),
  ez = (x) => 1 - Math.pow(1 - x, 3);
const R = (k, x, y, w, hh, o = {}) =>
  rc("rect", {
    key: k,
    x,
    y,
    width: Math.max(0, w),
    height: Math.max(0, hh),
    fill: "none",
    ...o,
  });
const T = (k, x, y, s, o = {}) =>
  rc(
    "text",
    {
      key: k,
      x,
      y,
      fill: "#fff",
      fontSize: 16,
      fontFamily: FF,
      fontWeight: 600,
      ...o,
    },
    s,
  );
const PA = (k, d, o = {}) => rc("path", { key: k, d, fill: "none", ...o });
const CI = (k, cx, cy, r, o = {}) => rc("circle", { key: k, cx, cy, r, ...o });
const UN = "Unbounded,sans-serif";
const LEN = { integrated: 11, sns: 10, ai: 11, seo: 13 };
const IM = (id) =>
  "https://images.unsplash.com/photo-" +
  id +
  "?w=500&q=70&auto=format&fit=crop";
const TILES = [
  "1484723091739-30a097e8f929",
  "1509042239860-f550ce710b93",
  "1495474472287-4d71bcdd2085",
  "1565299624946-b28f40a0ae38",
  "1567620905732-2d1ec7ab7445",
  "1546069901-ba9599a7e63c",
];
const PIM = (k, id, x, y, w, h, o = {}) =>
  rc("image", {
    key: k,
    href: IM(id),
    x,
    y,
    width: Math.max(0, w),
    height: Math.max(0, h),
    preserveAspectRatio: "xMidYMid slice",
    ...o,
  });
const bz = (u, a, b, c, d) => {
  const m = 1 - u;
  return m * m * m * a + 3 * m * m * u * b + 3 * m * u * u * c + u * u * u * d;
};
const GL = { filter: "url(#gl)" };
const SCENES = {
  integrated: (t) => {
    const e = [],
      names = [
        "유튜브 숏츠",
        "인스타그램",
        "페이스북",
        "네이버 클립",
        "네이버 블로그",
      ],
      ini = ["Y", "I", "F", "C", "B"];
    let sum = 0;
    e.push(
      T("h1", 36, 34, "ORIGINAL", { fontSize: 11, fill: VL, fontFamily: UN }),
      T("h2", 300, 34, "5 CHANNELS", {
        fontSize: 11,
        fill: VL,
        fontFamily: UN,
      }),
    );
    e.push(
      R("s2", 52, 166, 148, 180, { stroke: "#2A2A32" }),
      R("s1", 44, 158, 148, 180, { stroke: "#3A3A46", fill: "#101016" }),
      PIM("im", "1504754524776-8f4f37790ca0", 36, 150, 148, 180),
      R("ov", 36, 150, 148, 180, { fill: "#0D0D12", opacity: 0.5 }),
      R("c", 36, 150, 148, 180, { stroke: VV, strokeWidth: 2, ...GL }),
    );
    e.push(
      CI("pc", 110, 194, 22 + 2.5 * Math.sin(t * 4), { fill: VV }),
      PA("pl", "M103 183 L103 205 L122 194 Z", { fill: "#fff" }),
    );
    for (let i = 0; i < 14; i++) {
      const hh = 4 + 18 * Math.abs(Math.sin(t * 3 + i * 0.7));
      e.push(R("w" + i, 52 + i * 8.5, 262 - hh, 5, hh, { fill: VL }));
    }
    e.push(
      T("c1", 110, 298, "20", {
        textAnchor: "middle",
        fontSize: 26,
        fontFamily: UN,
      }),
      T("c2", 110, 320, "원본 콘텐츠", {
        textAnchor: "middle",
        fontSize: 12,
        fill: "#C9C9D1",
        fontWeight: 400,
      }),
    );
    names.forEach((n, i) => {
      const y = 50 + i * 64,
        a = 1 + i * 0.7,
        d = pr(t, a - 0.5, a + 0.3),
        p = ez(pr(t, a, a + 2)),
        c = Math.round(20 * p);
      sum += c;
      const d0 = "M184 240 C 242 240 242 " + (y + 26) + " 300 " + (y + 26);
      e.push(
        PA("b" + i, d0, { stroke: "#2A2A32", strokeWidth: 1.5 }),
        PA("l" + i, d0, {
          stroke: VL,
          strokeWidth: 2,
          pathLength: 1,
          strokeDasharray: 1,
          strokeDashoffset: 1 - d,
          ...GL,
        }),
      );
      for (let m = 0; m < 3; m++) {
        const u = (t * 0.55 + m / 3 + i * 0.11) % 1,
          op = d >= 1 ? (p < 1 ? 1 : 0.3) : 0;
        e.push(
          CI(
            "p" + i + m,
            bz(u, 184, 242, 242, 300),
            bz(u, 240, 240, y + 26, y + 26),
            3,
            { fill: "#fff", opacity: op, ...GL },
          ),
        );
      }
      e.push(
        R("r" + i, 300, y, 300, 52, {
          fill: "#16161C",
          stroke: p > 0 ? VV : "#2A2A32",
          strokeWidth: 1.5,
        }),
        R("i" + i, 300, y, 52, 52, { fill: p > 0 ? VV : "#22222C" }),
        T("t" + i, 326, y + 33, ini[i], {
          textAnchor: "middle",
          fontFamily: UN,
          fontSize: 15,
        }),
        T("n" + i, 368, y + 32, n, { fontSize: 15 }),
        R("g" + i, 486, y + 22, 66, 6, { fill: "#2A2A32" }),
        R("f" + i, 486, y + 22, 66 * p, 6, { fill: VL }),
        T("v" + i, 588, y + 33, String(c), {
          textAnchor: "end",
          fontSize: 14,
          fontFamily: UN,
        }),
      );
    });
    const o = ez(pr(t, 6.2, 7));
    e.push(
      T("z1", 36, 436, "원본 1개 = 채널별 변형 5개", {
        fontSize: 14,
        fill: "#C9C9D1",
        fontWeight: 400,
        opacity: o,
      }),
      T("z2", 600, 404, "게시 콘텐츠", {
        textAnchor: "end",
        fontSize: 12,
        fill: "#9A9AA3",
        fontWeight: 400,
        opacity: o,
      }),
      T("z3", 600, 446, String(sum), {
        textAnchor: "end",
        fontSize: 44,
        fontFamily: UN,
        fill: "#fff",
        opacity: o,
        ...GL,
      }),
    );
    return e;
  },
  sns: (t) => {
    const e = [],
      ch = ["유튜브 숏츠", "인스타그램", "네이버 블로그"],
      hi = t > 3.6 ? Math.floor((t - 3.6) * 7) % 16 : -1;
    e.push(
      T("h1", 36, 40, "ORIGINAL SOURCE", {
        fontSize: 11,
        fill: VL,
        fontFamily: UN,
      }),
      T("h2", 390, 40, "MULTI USE", { fontSize: 11, fill: VL, fontFamily: UN }),
    );
    for (let i = 0; i < 16; i++) {
      const x = 36 + (i % 4) * 66,
        y = 66 + Math.floor(i / 4) * 66,
        s = ez(pr(t, 0.3 + i * 0.16, 0.7 + i * 0.16)),
        v = i >= 12;
      e.push(
        v
          ? R("t" + i, x + 27 * (1 - s), y + 27 * (1 - s), 54 * s, 54 * s, {
              fill: "#fff",
            })
          : PIM(
              "t" + i,
              TILES[i % 6],
              x + 27 * (1 - s),
              y + 27 * (1 - s),
              54 * s,
              54 * s,
            ),
        R("h" + i, x, y, 54, 54, {
          stroke: hi === i ? "#fff" : "none",
          strokeWidth: 2,
          opacity: s,
          ...(hi === i ? GL : {}),
        }),
      );
      if (v)
        e.push(
          PA(
            "p" + i,
            "M" +
              (x + 21) +
              " " +
              (y + 17) +
              " L" +
              (x + 21) +
              " " +
              (y + 37) +
              " L" +
              (x + 38) +
              " " +
              (y + 27) +
              " Z",
            { fill: "#0D0D12", opacity: s },
          ),
        );
    }
    e.push(
      T("l1", 36, 358, "이미지 12", {
        fontSize: 13,
        fill: "#C9C9D1",
        fontWeight: 400,
      }),
      T("l2", 136, 358, "영상 4", { fontSize: 13, fill: "#fff" }),
    );
    ch.forEach((n, i) => {
      const y = 76 + i * 100,
        a = 4.2 + i * 0.5,
        lit = ez(pr(t, a, a + 0.7)),
        d = pr(t, a - 0.5, a + 0.3),
        d0 = "M306 210 C 350 210 350 " + (y + 32) + " 390 " + (y + 32);
      e.push(
        PA("b" + i, d0, { stroke: "#2A2A32", strokeWidth: 1.5 }),
        PA("c" + i, d0, {
          stroke: VL,
          strokeWidth: 2,
          pathLength: 1,
          strokeDasharray: 1,
          strokeDashoffset: 1 - d,
          ...GL,
        }),
      );
      for (let m = 0; m < 3; m++) {
        const u = (t * 0.6 + m / 3 + i * 0.17) % 1;
        e.push(
          CI(
            "q" + i + m,
            bz(u, 306, 350, 350, 390),
            bz(u, 210, 210, y + 32, y + 32),
            3,
            { fill: "#fff", opacity: lit, ...GL },
          ),
        );
      }
      e.push(
        R("k" + i, 390, y, 210, 64, {
          fill: lit > 0.5 ? VV : "#16161C",
          stroke: lit > 0 ? VV : "#2A2A32",
          strokeWidth: 1.5,
        }),
      );
      const pv =
        i === 0
          ? R("pv" + i, 412, y + 14, 22, 36, { fill: "#fff", opacity: lit })
          : i === 1
            ? R("pv" + i, 408, y + 16, 32, 32, { fill: "#fff", opacity: lit })
            : PA(
                "pv" + i,
                "M408 " +
                  (y + 18) +
                  " H440 M408 " +
                  (y + 28) +
                  " H440 M408 " +
                  (y + 38) +
                  " H430",
                { stroke: "#fff", strokeWidth: 3, opacity: lit },
              );
      e.push(
        pv,
        T("m" + i, 458, y + 38, n, {
          fontSize: 15,
          opacity: 0.55 + 0.45 * lit,
        }),
      );
    });
    e.push(
      T("b", 320, 440, "원본 소스 하나를 채널 형식에 맞게 변형합니다", {
        textAnchor: "middle",
        fontSize: 14,
        fill: "#C9C9D1",
        fontWeight: 400,
        opacity: ez(pr(t, 6.2, 7)),
      }),
    );
    return e;
  },
  ai: (t) => {
    const e = [],
      d = pr(t, 0.2, 2),
      sc = pr(t, 1.5, 2) * (1 - pr(t, 4, 4.6));
    e.push(
      T("h1", 36, 40, "CHARACTER", { fontSize: 11, fill: VL, fontFamily: UN }),
      T("h2", 360, 40, "MONTHLY 8", { fontSize: 11, fill: VL, fontFamily: UN }),
    );
    const st = {
      stroke: VL,
      strokeWidth: 2.5,
      pathLength: 1,
      strokeDasharray: 1,
      strokeDashoffset: 1 - d,
      fill: "#16161C",
      fillOpacity: d,
    };
    e.push(
      PIM("pt", "1494790108377-be9c29b29330", 36, 76, 160, 296, { opacity: d }),
      R("pf", 36, 76, 160, 296, {
        stroke: VL,
        strokeWidth: 2,
        pathLength: 1,
        strokeDasharray: 1,
        strokeDashoffset: 1 - d,
      }),
    );
    e.push(
      PA(
        "sc",
        "M30 " + (80 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 288) + " H202",
        { stroke: "#fff", strokeWidth: 2, opacity: 0.85 * sc, ...GL },
      ),
    );
    [
      ["외형", 140, 2.6],
      ["말투", 200, 3.2],
      ["표기·권리", 260, 3.8],
    ].forEach(([n, y, a], i) => {
      const s = ez(pr(t, a, a + 0.5));
      e.push(
        PA("q" + i, "M196 " + (y + 16) + " H215", {
          stroke: VL,
          strokeWidth: 1.5,
          opacity: s,
        }),
        R("g" + i, 215, y, 110, 32, {
          fill: "#16161C",
          stroke: VL,
          opacity: s,
        }),
        T("w" + i, 270, y + 21, n, {
          textAnchor: "middle",
          fontSize: 14,
          opacity: s,
        }),
      );
    });
    let dn = 0;
    for (let i = 0; i < 8; i++) {
      const x = 360 + (i % 4) * 62,
        y = 70 + Math.floor(i / 4) * 116,
        p = ez(pr(t, 5 + i * 0.45, 5.9 + i * 0.45));
      if (p >= 1) dn++;
      e.push(
        R("f" + i, x, y, 48, 86, {
          fill: "#16161C",
          stroke: p >= 1 ? VL : "#2A2A32",
        }),
        R("p" + i, x, y + 86 * (1 - p), 48, 86 * p, { fill: VV }),
        T("s" + i, x + 24, y + 48, "30초", {
          textAnchor: "middle",
          fontSize: 11,
          opacity: p,
        }),
      );
    }
    e.push(
      R("tk", 360, 316, 236, 4, { fill: "#2A2A32" }),
      R("tf", 360, 316, (236 * dn) / 8, 4, { fill: "#fff" }),
      T("m", 360, 350, "월 8회 · 30초 기준", {
        fontSize: 14,
        fill: "#C9C9D1",
        fontWeight: 400,
        opacity: ez(pr(t, 5, 6)),
      }),
      T("mn", 596, 350, dn + " / 8", {
        fontSize: 14,
        fontFamily: UN,
        textAnchor: "end",
        opacity: ez(pr(t, 5, 6)),
      }),
    );
    const b = ez(pr(t, 4.2, 4.9));
    e.push(
      R("bd", 36, 410 + 14 * (1 - b), 304, 44, { fill: VV, opacity: b, ...GL }),
      T("bt", 188, 438 + 14 * (1 - b), "캐릭터 구축 무상 제공", {
        textAnchor: "middle",
        fontSize: 16,
        opacity: b,
      }),
    );
    return e;
  },
  seo: (t) => {
    const e = [],
      Q = "강남 여드름 흉터 치료 잘하는 곳 추천해줘",
      nq = Math.floor(pr(t, 0.3, 2.3) * Q.length),
      sent = t > 2.6,
      ub = ez(pr(t, 2.6, 3.1));
    e.push(
      R("w", 36, 24, 568, 432, { fill: "#101016", stroke: "#2A2A32", rx: 14 }),
      CI("d1", 62, 46, 4.5, { fill: "#3A3A46" }),
      CI("d2", 78, 46, 4.5, { fill: "#3A3A46" }),
      CI("d3", 94, 46, 4.5, { fill: "#3A3A46" }),
      T("ti", 320, 51, "AI 답변", {
        textAnchor: "middle",
        fontSize: 13,
        fill: "#9A9AA3",
        fontWeight: 500,
      }),
      PA("ln", "M36 68 H604", { stroke: "#2A2A32" }),
    );
    e.push(
      R("ub", 240 + 40 * (1 - ub), 92 + 10 * (1 - ub), 340, 40, {
        fill: "#2A2A32",
        rx: 20,
        opacity: ub,
      }),
      T("ut", 260 + 40 * (1 - ub), 117 + 10 * (1 - ub), Q, {
        fontSize: 14.5,
        fontWeight: 500,
        opacity: ub,
      }),
    );
    const th = pr(t, 3.2, 3.5) * (1 - pr(t, 4.4, 4.7)),
      sp = ez(pr(t, 3.2, 3.6));
    e.push(
      CI("ai", 66, 176, 15, { fill: VV, opacity: sp, ...GL }),
      PA(
        "st",
        "M66 166 L68.4 173.6 L76 176 L68.4 178.4 L66 186 L63.6 178.4 L56 176 L63.6 173.6 Z",
        {
          fill: "#fff",
          opacity: sp,
          transform: "rotate(" + (t < 4.6 ? t * 90 : 0) + " 66 176)",
        },
      ),
    );
    for (let k = 0; k < 3; k++)
      e.push(
        CI("td" + k, 100 + k * 16, 176, 4.5, {
          fill: VL,
          opacity: th * (0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - k * 0.9))),
        }),
      );
    const L = [
        "흉터 단계별 치료 과정을 자세히 공개한",
        "리엔피부과가 자주 언급됩니다.",
        "후기와 상담 안내도 꾸준히 올라와 있어요.",
      ],
      tot = L.join("").length,
      m = Math.floor(pr(t, 4.7, 9) * tot);
    let used = 0;
    L.forEach((l, k) => {
      const c = Math.max(0, Math.min(l.length, m - used));
      used += l.length;
      if (!c) return;
      const y = 172 + k * 30;
      if (k === 1) {
        const b = Math.min(c, 5);
        e.push(
          rc(
            "text",
            {
              key: "a" + k,
              x: 96,
              y,
              fontSize: 17,
              fontFamily: FF,
              fontWeight: 500,
              fill: "#D6D6DC",
            },
            rc(
              "tspan",
              { key: "b", fill: "#fff", fontWeight: 800 },
              l.slice(0, b),
            ),
            l.slice(b, c),
          ),
          R("ul", 96, y + 7, 87 * Math.min(1, b / 5), 3, { fill: VV, ...GL }),
        );
      } else
        e.push(
          T("a" + k, 96, y, l.slice(0, c), {
            fontSize: 17,
            fontWeight: 500,
            fill: "#D6D6DC",
          }),
        );
    });
    if (m >= tot && Math.floor(t * 2) % 2 === 0 && t < 9.6)
      e.push(R("cu", 96 + 8, 240, 2, 0, {}));
    const s0 = ez(pr(t, 9.2, 9.8)),
      s1 = ez(pr(t, 9.5, 10.1));
    e.push(
      T("sl", 96, 296, "출처", {
        fontSize: 11,
        fill: "#9A9AA3",
        fontFamily: UN,
        opacity: s0,
      }),
      R("c1", 96, 308, 168, 30, {
        fill: "#16161C",
        stroke: VV,
        rx: 15,
        opacity: s0,
      }),
      CI("c1d", 114, 323, 4, { fill: VV, opacity: s0 }),
      T("c1t", 126, 328, "rien-derma.co.kr", { fontSize: 13, opacity: s0 }),
      R("c2", 274, 308, 150, 30, {
        fill: "#16161C",
        stroke: "#3A3A46",
        rx: 15,
        opacity: s1,
      }),
      CI("c2d", 292, 323, 4, { fill: "#3A3A46", opacity: s1 }),
      T("c2t", 304, 328, "블로그 · 방문 후기", { fontSize: 13, opacity: s1 }),
    );
    const it = sent ? "" : Q.slice(0, nq) + (Math.floor(t * 2) % 2 ? "|" : "");
    e.push(
      R("ib", 56, 384, 528, 46, {
        fill: "#16161C",
        stroke: sent ? "#2A2A32" : VV,
        rx: 23,
        strokeWidth: 1.5,
      }),
      T("it", 78, 413, it || "질문을 입력하세요", {
        fontSize: 14.5,
        fontWeight: 400,
        fill: it ? "#fff" : "#6E6E78",
      }),
      CI("sb", 560, 407, 16, {
        fill: nq >= Q.length && !sent ? VV : "#2A2A32",
        ...(nq >= Q.length && !sent ? GL : {}),
      }),
      PA("sa", "M560 414 V400 M553 406 L560 399 L567 406", {
        stroke: "#fff",
        strokeWidth: 2,
      }),
    );
    return e;
  },
};
class Stage extends React.Component {
  state = { t: 8 };
  componentDidMount() {
    if (
      window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const L = LEN[this.props.kind],
      t0 = performance.now();
    const f = (n) => {
      this.setState({ t: ((n - t0) / 1000) % L });
      this.raf = requestAnimationFrame(f);
    };
    this.raf = requestAnimationFrame(f);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }
  render() {
    const k = this.props.kind,
      L = LEN[k],
      t = this.state.t,
      o = Math.min(pr(t, 0, 0.4), 1 - pr(t, L - 0.5, L));
    const defs = rc(
      "defs",
      { key: "df" },
      rc(
        "filter",
        { id: "gl", x: "-50%", y: "-50%", width: "200%", height: "200%" },
        rc("feGaussianBlur", { stdDeviation: 3.5, result: "b" }),
        rc(
          "feMerge",
          null,
          rc("feMergeNode", { in: "b" }),
          rc("feMergeNode", { in: "SourceGraphic" }),
        ),
      ),
    );
    return rc(
      "svg",
      {
        viewBox: "0 0 640 480",
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        },
      },
      defs,
      rc("g", { key: "g", opacity: o }, SCENES[k](t)),
    );
  }
}
const TICK = {
  integrated: [
    "원본 콘텐츠 20개",
    "5개 채널 100개 게시",
    "유튜브 숏츠",
    "인스타그램",
    "페이스북",
    "네이버 클립",
    "네이버 블로그",
    "구글·네이버 스토어",
    "SEO·AEO·GEO",
  ],
  sns: [
    "이미지 콘텐츠 월 12회",
    "영상 콘텐츠 월 4회",
    "원본 소스 멀티 유즈",
    "유튜브 숏츠",
    "인스타그램",
    "네이버 블로그",
  ],
  ai: [
    "캐릭터 구축 무상 제공",
    "월 8회 콘텐츠",
    "30초 기준",
    "브랜드 전용 가상 인물",
  ],
  seo: [
    "현재 상태 진단",
    "질문·페이지 설계",
    "메타·sitemap·구조화 데이터",
    "스테이징 검수",
    "운영 배포 검수",
  ],
};
const FEAT = {
  integrated: {
    title: "한 번 만든 영상으로 다섯 채널을 채웁니다",
    sub: "원본 20개를 채널마다 다른 규격으로 다시 편집해 올립니다. 채널별 수량은 월 플랜에서 합계 100개로 합의합니다. 아래는 20개씩 배치한 운영 예시입니다",
    rows: [
      ["유튜브 숏츠", 1, "배치 예시 · 20개"],
      ["인스타그램", 1, "배치 예시 · 20개"],
      ["페이스북", 1, "배치 예시 · 20개"],
      ["네이버 클립", 1, "배치 예시 · 20개"],
      ["네이버 블로그", 1, "배치 예시 · 20개"],
    ],
  },
  sns: {
    title: "원본 소스 하나를 채널마다 바꿔 씁니다",
    sub: "이미지와 영상 원본을 만든 뒤 기본 채널 형식에 맞게 멀티 유즈합니다",
    rows: [
      ["이미지 콘텐츠", 1, "월 12회"],
      ["영상 콘텐츠", 1 / 3, "월 4회"],
      ["기본 채널", 0.25, "3개"],
    ],
  },
  ai: {
    title: "캐릭터 구축은 서비스로 제공합니다",
    sub: "외형, 말투, 가상 인물 표기와 권리 확인까지 별도 구축비 없이 설정합니다",
    rows: [
      ["캐릭터 구축", 1, "서비스 제공"],
      ["월 콘텐츠 제작·게시", 1, "8회"],
      ["콘텐츠 길이", 1, "30초 기준"],
    ],
  },
  seo: {
    title: "진단부터 운영 검수까지 실제 코드에 적용합니다",
    sub: "기존 사이트를 진단하고 수정 설계를 합의한 뒤, 코드·CMS에 적용하고 스테이징과 운영에서 검수합니다",
    rows: [
      ["현재 상태 진단", 1, "01"],
      ["수정 설계", 1, "02"],
      ["코드·CMS 적용", 1, "03"],
      ["스테이징·운영 검수", 1, "04"],
    ],
  },
};
const KEYS = Object.keys(SVC);
const q = () => {
  try {
    const v = new URLSearchParams(location.search).get("s");
    return KEYS.includes(v) ? v : null;
  } catch (e) {
    return null;
  }
};
class Component extends GuideLogic {
  state = {
    key: this.props.service || "integrated",
    open: 0,
    active: 0,
    k: 0,
    k2: 0,
    vw: typeof window !== "undefined" ? 1200 : 1200,
  };
  onVw = () => this.setState({ vw: window.innerWidth });
  statsRef = React.createRef();
  featRef = React.createRef();
  stepEls = [];
  componentDidMount() {
    this.onVw();
    window.addEventListener("resize", this.onVw);
    this.stepIO = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const i = this.stepEls.indexOf(e.target);
            if (i >= 0 && i !== this.state.active) this.setState({ active: i });
          }
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    this.io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const w = e.target === this.featRef.current ? "b" : "a";
            if (!this["d" + w]) this.countUp(w);
          }
        }),
      { threshold: 0.12 },
    );
    this.rv = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            el.style.opacity = 1;
            el.style.transform = "none";
            this.rv.unobserve(el);
          }
        }),
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" },
    );
    this.t = setTimeout(() => {
      this.stepEls.forEach((el) => el && this.stepIO.observe(el));
      this.statsRef.current && this.io.observe(this.statsRef.current);
      this.featRef.current && this.io.observe(this.featRef.current);
      this.initReveal();
    }, 100);
    this.t2 = setTimeout(() => this.initReveal(), 1200);
  }
  componentWillUnmount() {
    clearTimeout(this.t);
    clearTimeout(this.t2);
    cancelAnimationFrame(this.ra);
    cancelAnimationFrame(this.rb);
    [this.stepIO, this.io, this.rv].forEach((o) => o && o.disconnect());
    window.removeEventListener("resize", this.onVw);
  }
  initReveal() {
    document.querySelectorAll("[data-rv]").forEach((el) => {
      if (el.dataset.rvd) return;
      el.dataset.rvd = "1";
      const i = +el.dataset.rv || 0;
      el.style.opacity = 0;
      el.style.transform = "translateY(28px)";
      el.style.transition =
        "opacity .8s ease " +
        i * 90 +
        "ms, transform .8s cubic-bezier(.2,.7,.2,1) " +
        i * 90 +
        "ms";
      this.rv.observe(el);
    });
  }
  countUp(w) {
    const key = w === "a" ? "k" : "k2";
    this["d" + w] = true;
    cancelAnimationFrame(this["r" + w]);
    const t0 = performance.now();
    const f = (now) => {
      const t = Math.min(1, (now - t0) / 1600);
      this.setState({ [key]: 1 - Math.pow(1 - t, 3) });
      if (t < 1) this["r" + w] = requestAnimationFrame(f);
    };
    this["r" + w] = requestAnimationFrame(f);
  }
  pick(key) {
    this.da = this.db = false;
    this.setState({ key, open: 0, k: 0, k2: 0 }, () => {
      this.initReveal();
      [
        ["a", this.statsRef],
        ["b", this.featRef],
      ].forEach(([w, r]) => {
        const el = r.current;
        if (el) {
          const b = el.getBoundingClientRect();
          if (b.top < window.innerHeight * 0.9 && b.bottom > 0) this.countUp(w);
        }
      });
    });
    location.assign(guideServiceHref("marketing", key));
  }
  renderVals() {
    const k = this.state.key,
      d = SVC[k],
      a = this.state.active,
      kk = this.state.k,
      k2 = this.state.k2,
      F = FEAT[k];
    const s = {
      ...d,
      featTitle: F.title,
      featSub: F.sub,
      volNote:
        k === "integrated"
          ? "스레드 운영은 별도 협의이며 추가 금액이 있습니다"
          : "월 기준",
      work: d.work.map(([stage, task, result], i) => ({
        no: String(i + 1).padStart(2, "0"),
        stage,
        task,
        result,
      })),
      volumes: (d.volumes || []).map(([v, u, l]) => {
        const n = Number(v);
        return { v: isNaN(n) ? v : String(Math.round(n * kk)), u, l };
      }),
      posts: d.posts.map(([title, img], i) => ({
        title,
        img,
        date: "서비스 안내",
      })),
    };
    const cases = d.caseSvc ? CASES.filter((c) => c.svc === d.caseSvc) : [],
      tk = TICK[k].map((t) => ({ t }));
    return {
      workCols:
        this.state.vw >= 760
          ? "minmax(0,.8fr) minmax(0,1.6fr) minmax(0,1.4fr)"
          : "minmax(0,1fr)",
      workHead: this.state.vw >= 760 ? "grid" : "none",
      volCols:
        "repeat(" +
        (this.state.vw >= 900
          ? Math.min(4, (d.volumes || []).length || 1)
          : this.state.vw >= 560
            ? 2
            : 1) +
        ",minmax(0,1fr))",
      s,
      hasVol: !!d.volumes,
      hasCases: cases.length > 0,
      statsRef: this.statsRef,
      featRef: this.featRef,
      ticker: [...tk, ...tk, ...tk, ...tk],
      heroAnim: React.createElement(Stage, { kind: k, key: k }),
      featRows: F.rows.map(([l, v, tx], i) => ({
        l,
        t: tx,
        w:
          (v * Math.min(1, Math.max(0, (k2 - i * 0.12) / 0.5)) * 100).toFixed(
            1,
          ) + "%",
      })),
      steps: d.steps.map(([title, ai, pro], i) => ({
        no: String(i + 1).padStart(2, "0"),
        title,
        ai,
        pro,
        ref: (el) => {
          this.stepEls[i] = el;
        },
        op: i === a ? 1 : 0.4,
        bd: i === a ? "#6B4DFF" : "#DAD8D1",
        nc: i === a ? "#6B4DFF" : "#A8A69E",
        dot: i <= a ? "#6B4DFF" : "#DAD8D1",
      })),
      cases,
      contactHref: "Marketing 문의.dc.html?s=" + k,
      tabs: KEYS.map((key, i) => {
        const on = key === k;
        return {
          no: String(i + 1).padStart(2, "0"),
          label: SVC[key].name,
          fg: on ? "#fff" : "#9A9AA3",
          nc: on ? "#A99BFF" : "#6E6E78",
          bd: on ? "#A99BFF" : "transparent",
          pick: () => this.pick(key),
        };
      }),
      faqs: d.faqs.map(([q, a2], i) => ({
        q,
        a: a2,
        open: this.state.open === i,
        sign: this.state.open === i ? "−" : "+",
        toggle: () => this.setState({ open: this.state.open === i ? -1 : i }),
      })),
    };
  }

  render() {
    const values = adaptGuideValues(
      "marketing-services",
      this.renderVals(),
      this.props,
    );
    const {
      cases,
      contactHref,
      faqs,
      featRef,
      featRows,
      hasCases,
      hasVol,
      heroAnim,
      s,
      statsRef,
      steps,
      tabs,
      volCols,
      workCols,
      workHead,
    } = values;
    return (
      <div className="guide-page guide-marketing-services">
        <GuideEffects />
        <div
          style={{
            background: "#fff",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="marketing" active="services" />
          <section style={{ background: "#0D0D12", color: "#fff" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "0 clamp(20px,4vw,56px)",
                display: "flex",
                gap: "clamp(20px,3vw,44px)",
                flexWrap: "wrap",
                borderBottom: "1px solid #2A2A32",
              }}
            >
              <ServiceTabs division="marketing" />
            </div>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(56px,7vw,104px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,460px),1fr))",
                gap: "56px clamp(40px,5vw,88px)",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".18em",
                    color: "#A99BFF",
                  }}
                >
                  {s.en}
                </span>
                <h1
                  style={{
                    margin: "0",
                    fontSize: "clamp(44px,6vw,96px)",
                    lineHeight: "1.08",
                    letterSpacing: "-.055em",
                    fontWeight: "800",
                  }}
                >
                  {s.name}
                </h1>
                <p
                  style={{
                    margin: "0",
                    fontSize: "clamp(17px,1.5vw,20px)",
                    lineHeight: "1.8",
                    color: "#D6D6DC",
                    maxWidth: "40ch",
                  }}
                >
                  {s.intro}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    borderTop: "1px solid #2A2A32",
                    paddingTop: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "clamp(30px,3.2vw,46px)",
                        letterSpacing: "-.04em",
                        fontWeight: "800",
                        lineHeight: "1.2",
                      }}
                    >
                      {s.price}
                    </strong>
                    <span style={{ fontSize: "14px", color: "#C9C9D1" }}>
                      {s.priceUnit}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "14.5px",
                      lineHeight: "1.7",
                      color: "#C9C9D1",
                      maxWidth: "46ch",
                    }}
                  >
                    {s.priceNote}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <GuideLink
                    href={contactHref}
                    style={{
                      background: "#6B4DFF",
                      color: "#fff",
                      padding: "18px 30px",
                      fontWeight: "600",
                    }}
                    className="gh-59b0af27"
                    context="marketing"
                  >
                    {"견적 문의"}
                  </GuideLink>
                  <GuideLink
                    href="#work"
                    style={{
                      border: "1.5px solid #fff",
                      color: "#fff",
                      padding: "16.5px 28px",
                      fontWeight: "600",
                    }}
                    className="gh-4ed674bc"
                    context="marketing"
                  >
                    {"맡는 일 보기"}
                  </GuideLink>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  background: "#101016",
                  border: "1px solid #2A2A32",
                }}
              >
                {heroAnim}
              </div>
            </div>
          </section>
          {hasVol ? (
            <React.Fragment>
              <section ref={statsRef}>
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,64px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      data-rv=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "12px",
                          letterSpacing: ".16em",
                          color: "#6B4DFF",
                        }}
                      >
                        {"VOLUME"}
                      </span>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "clamp(30px,4vw,56px)",
                          letterSpacing: "-.045em",
                          fontWeight: "800",
                          lineHeight: "1.15",
                        }}
                      >
                        {"월 제공 범위"}
                      </h2>
                    </div>
                    <span
                      data-rv="1"
                      style={{ fontSize: "15px", color: "#6E6E78" }}
                    >
                      {s.volNote}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: volCols,
                      gap: "36px 32px",
                    }}
                  >
                    {(s.volumes || []).map((st, __index5) => (
                      <React.Fragment key={__index5}>
                        <div
                          style={{
                            borderTop: "1.5px solid #0D0D12",
                            paddingTop: "22px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "clamp(44px,5.4vw,84px)",
                              fontWeight: "300",
                              letterSpacing: "-.05em",
                              lineHeight: "1",
                            }}
                          >
                            {st.v}
                            <span
                              style={{
                                fontSize: ".32em",
                                color: "#6B4DFF",
                                marginLeft: "6px",
                                fontWeight: "600",
                                letterSpacing: "0",
                              }}
                            >
                              {st.u}
                            </span>
                          </span>
                          <span
                            style={{
                              fontSize: "15.5px",
                              lineHeight: "1.6",
                              color: "#3A3A42",
                            }}
                          >
                            {st.l}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          <section
            ref={featRef}
            style={{ background: "#6B4DFF", color: "#fff" }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "56px clamp(40px,6vw,96px)",
                alignItems: "center",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                  }}
                >
                  {"FEATURE"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.18",
                  }}
                >
                  {s.featTitle}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    maxWidth: "40ch",
                  }}
                >
                  {s.featSub}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1px solid rgba(255,255,255,.5)",
                }}
              >
                {(featRows || []).map((r, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(0,1.1fr) minmax(0,1.4fr) minmax(64px,auto)",
                        alignItems: "center",
                        gap: "18px",
                        padding: "22px 0",
                        borderBottom: "1px solid rgba(255,255,255,.5)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16.5px",
                          fontWeight: "600",
                          lineHeight: "1.4",
                        }}
                      >
                        {r.l}
                      </span>
                      <span
                        style={{
                          height: "6px",
                          background: "#5236D6",
                          display: "block",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            height: "100%",
                            width: r.w,
                            background: "#fff",
                          }}
                        ></span>
                      </span>
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "13px",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.t}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#6B4DFF",
                  }}
                >
                  {"FIT"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"이런 곳에 맞습니다"}
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                  gap: "40px 40px",
                }}
              >
                {(s.forWhom || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      data-rv=""
                      style={{
                        borderTop: "1.5px solid #0D0D12",
                        paddingTop: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "13px",
                          color: "#6B4DFF",
                        }}
                      >
                        {f.no}
                      </span>
                      <strong
                        style={{
                          fontSize: "clamp(20px,1.8vw,24px)",
                          lineHeight: "1.5",
                          letterSpacing: "-.025em",
                          fontWeight: "700",
                        }}
                      >
                        {f.text}
                      </strong>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section id="work" style={{ background: "#F4F3EF" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#6B4DFF",
                  }}
                >
                  {"WORK"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"저희가 맡는 일"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #0D0D12",
                }}
              >
                <div
                  style={{
                    display: workHead,
                    gridTemplateColumns:
                      "minmax(0,.8fr) minmax(0,1.6fr) minmax(0,1.4fr)",
                    gap: "24px",
                    padding: "16px 0",
                    borderBottom: "1px solid #DAD8D1",
                    fontSize: "13px",
                    color: "#6E6E78",
                  }}
                >
                  <span>{"단계"}</span>
                  <span>{"업무"}</span>
                  <span>{"결과"}</span>
                </div>
                {(s.work || []).map((w, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: workCols,
                        gap: "12px 24px",
                        padding: "28px 0",
                        minHeight: "140px",
                        boxSizing: "border-box",
                        borderBottom: "1px solid #DAD8D1",
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "13px",
                            color: "#6B4DFF",
                          }}
                        >
                          {w.no}
                        </span>
                        <strong
                          style={{
                            fontSize: "clamp(19px,1.6vw,22px)",
                            letterSpacing: "-.025em",
                            lineHeight: "1.4",
                          }}
                        >
                          {w.stage}
                        </strong>
                      </div>
                      <span
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.8",
                          color: "#3A3A42",
                          maxWidth: "34ch",
                        }}
                      >
                        {w.task}
                      </span>
                      <span
                        style={{
                          whiteSpace: "pre-line",
                          fontSize: "16px",
                          lineHeight: "1.8",
                          fontWeight: "600",
                        }}
                      >
                        {w.result}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ background: "#0D0D12", color: "#fff" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
                      color: "#A99BFF",
                    }}
                  >
                    {"INCLUDED"}
                  </span>
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "clamp(30px,4vw,56px)",
                      letterSpacing: "-.045em",
                      fontWeight: "800",
                      lineHeight: "1.15",
                    }}
                  >
                    {"포함 항목"}
                  </h2>
                </div>
                <span
                  data-rv="1"
                  style={{ fontSize: "15px", color: "#C9C9D1" }}
                >
                  {s.scopeNote}
                </span>
              </div>
              <ul
                style={{
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,300px),1fr))",
                  gap: "0 40px",
                  borderTop: "1px solid #2A2A32",
                }}
              >
                {(s.scope || []).map((x, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "baseline",
                        padding: "20px 0",
                        borderBottom: "1px solid #2A2A32",
                        fontSize: "16.5px",
                        lineHeight: "1.55",
                        fontWeight: "500",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#A99BFF",
                          display: "block",
                          flex: "none",
                          transform: "translateY(-3px)",
                        }}
                      ></span>
                      {x}
                    </li>
                  </React.Fragment>
                ))}
              </ul>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <strong
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#C9C9D1",
                  }}
                >
                  {"기본에 포함되지 않는 것"}
                </strong>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(s.excl || []).map((x, __index5) => (
                    <React.Fragment key={__index5}>
                      <span
                        style={{
                          fontSize: "14.5px",
                          padding: "9px 15px",
                          border: "1px solid #3A3A46",
                          color: "#D6D6DC",
                          lineHeight: "1.4",
                        }}
                      >
                        {x}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#6B4DFF",
                  }}
                >
                  {"BENEFITS"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"상담과 계약 혜택"}
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,400px),1fr))",
                  gap: "16px",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    background: "#F4F3EF",
                    padding: "clamp(28px,3.4vw,48px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    minHeight: "280px",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>
                    {"상담 고객"}
                  </span>
                  <strong
                    style={{
                      fontSize: "clamp(26px,2.8vw,38px)",
                      letterSpacing: "-.04em",
                      lineHeight: "1.25",
                    }}
                  >
                    {"분석 자료 제공"}
                  </strong>
                  <span
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#3A3A42",
                      marginTop: "auto",
                    }}
                  >
                    {"시장, 경쟁사, 운영 방향을 자료로 정리해 드립니다"}
                  </span>
                </div>
                <div
                  data-rv="1"
                  style={{
                    background: "#0D0D12",
                    color: "#fff",
                    padding: "clamp(28px,3.4vw,48px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    minHeight: "280px",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#A99BFF",
                    }}
                  >
                    {"계약 고객"}
                  </span>
                  <strong
                    style={{
                      fontSize: "clamp(26px,2.8vw,38px)",
                      letterSpacing: "-.04em",
                      lineHeight: "1.25",
                    }}
                  >
                    {"사이트 구축 및 리뉴얼 제공"}
                  </strong>
                  <span
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#D6D6DC",
                      marginTop: "auto",
                    }}
                  >
                    {
                      "기본 소개·문의용 사이트의 신규 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다"
                    }
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section style={{ background: "#F4F3EF" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(40px,6vw,96px)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flex: "1 1 360px",
                  position: "sticky",
                  top: "160px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#6B4DFF",
                  }}
                >
                  {"PROCESS"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"진행 과정"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#3A3A42",
                    maxWidth: "30ch",
                  }}
                >
                  {"제작과 분석에는 "}
                  <strong style={{ color: "#6B4DFF" }}>{"AI"}</strong>
                  {" 도구를 쓰고, 계획·검수·게시 판단은 마케터가 직접 합니다"}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(steps || []).map((p, __index5) => (
                    <React.Fragment key={__index5}>
                      <span
                        style={{
                          display: "block",
                          width: "40px",
                          height: "3px",
                          background: p.dot,
                          transition: "background .4s",
                        }}
                      ></span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <ol
                style={{
                  flex: "1.4 1 480px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {(steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      ref={p.ref}
                      style={{
                        background: "#fff",
                        border: "1.5px solid " + p.bd,
                        opacity: p.op,
                        transition: "opacity .45s ease,border-color .45s ease",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "clamp(24px,3vw,36px)",
                          display: "flex",
                          gap: "24px",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "clamp(36px,4vw,56px)",
                            fontWeight: "300",
                            color: p.nc,
                            lineHeight: "1",
                            transition: "color .45s",
                          }}
                        >
                          {p.no}
                        </span>
                        <strong
                          style={{
                            fontSize: "clamp(22px,2.2vw,28px)",
                            letterSpacing: "-.03em",
                            lineHeight: "1.3",
                          }}
                        >
                          {p.title}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit,minmax(min(100%,220px),1fr))",
                        }}
                      >
                        <div
                          style={{
                            borderTop: "1px solid #DAD8D1",
                            padding: "18px clamp(24px,3vw,36px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "11px",
                              letterSpacing: ".14em",
                              color: "#6B4DFF",
                            }}
                          >
                            {"AI"}
                          </span>
                          <span
                            style={{
                              fontSize: "15px",
                              lineHeight: "1.6",
                              color: "#3A3A42",
                            }}
                          >
                            {p.ai}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#6B4DFF",
                            color: "#fff",
                            padding: "18px clamp(24px,3vw,36px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "11px",
                              letterSpacing: ".14em",
                            }}
                          >
                            {"MARKETER"}
                          </span>
                          <span style={{ fontSize: "15px", lineHeight: "1.6" }}>
                            {p.pro}
                          </span>
                        </div>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </section>
          {hasCases ? (
            <React.Fragment>
              <section id="cases">
                <div
                  style={{
                    maxWidth: "1440px",
                    margin: "0 auto",
                    padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(40px,5vw,64px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      data-rv=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "12px",
                          letterSpacing: ".16em",
                          color: "#6B4DFF",
                        }}
                      >
                        {"CASES"}
                      </span>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "clamp(30px,4vw,56px)",
                          letterSpacing: "-.045em",
                          fontWeight: "800",
                          lineHeight: "1.15",
                        }}
                      >
                        {s.name}
                        {" 운영 사례"}
                      </h2>
                    </div>
                    <GuideLink
                      href="Marketing 운영 사례.dc.html"
                      style={{
                        fontFamily: "Unbounded,sans-serif",
                        fontSize: "13px",
                        letterSpacing: ".1em",
                        borderBottom: "1px solid #0D0D12",
                        paddingBottom: "4px",
                      }}
                      context="marketing"
                    >
                      {"ALL CASES →"}
                    </GuideLink>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(min(100%,360px),1fr))",
                      gap: "16px",
                    }}
                  >
                    {(cases || []).map((c, __index5) => (
                      <React.Fragment key={__index5}>
                        <GuideNav division="marketing" active="home" />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </React.Fragment>
          ) : null}
          <section style={{ borderTop: "1px solid #DAD8D1" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px clamp(40px,6vw,96px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#6B4DFF",
                  }}
                >
                  {"FAQ"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"자주 묻는 질문"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #0D0D12",
                }}
              >
                {(faqs || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div style={{ borderBottom: "1px solid #DAD8D1" }}>
                      <button
                        onClick={f.toggle}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "26px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "20px",
                          fontSize: "18px",
                          lineHeight: "1.5",
                          fontWeight: "600",
                        }}
                        type="button"
                        aria-expanded={f.open}
                      >
                        {f.q}
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontWeight: "300",
                            color: "#6B4DFF",
                            flex: "none",
                          }}
                        >
                          {f.sign}
                        </span>
                      </button>
                      {f.open ? (
                        <React.Fragment>
                          <p
                            style={{
                              margin: "0 0 28px",
                              color: "#3A3A42",
                              fontSize: "16px",
                              lineHeight: "1.85",
                              maxWidth: "56ch",
                            }}
                          >
                            {f.a}
                          </p>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ background: "#F4F3EF" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
                      color: "#6B4DFF",
                    }}
                  >
                    {"INSIGHTS"}
                  </span>
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "clamp(30px,4vw,56px)",
                      letterSpacing: "-.045em",
                      fontWeight: "800",
                      lineHeight: "1.15",
                    }}
                  >
                    {s.name}
                    {" 인사이트"}
                  </h2>
                </div>
                <GuideLink
                  href="Marketing 인사이트.dc.html"
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "13px",
                    letterSpacing: ".1em",
                    borderBottom: "1px solid #0D0D12",
                    paddingBottom: "4px",
                  }}
                  context="marketing"
                >
                  {"ALL INSIGHTS →"}
                </GuideLink>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,300px),1fr))",
                  gap: "24px 16px",
                }}
              >
                {(s.posts || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={p.href}
                      style={{
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      context="marketing"
                    >
                      <div
                        style={{
                          aspectRatio: "16/10",
                          position: "relative",
                          overflow: "hidden",
                          background: "#EEECE6",
                        }}
                      >
                        <img
                          alt=""
                          loading="lazy"
                          src={guideAsset(p.img)}
                          style={{
                            position: "absolute",
                            inset: "0",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12.5px",
                            color: "#6E6E78",
                            fontFamily: "Unbounded,sans-serif",
                            letterSpacing: ".06em",
                          }}
                        >
                          {p.date === "制作" ? "제작 가이드" : p.date}
                        </span>
                        <strong
                          style={{
                            fontSize: "18px",
                            lineHeight: "1.55",
                            letterSpacing: "-.02em",
                          }}
                        >
                          {p.title}
                        </strong>
                      </div>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ background: "#6B4DFF", color: "#fff" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(64px,8vw,112px) clamp(20px,4vw,56px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                <div
                  data-fit="balance"
                  style={{ width: "fit-content", maxWidth: "100%" }}
                >
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "clamp(30px,4.2vw,60px)",
                      letterSpacing: "-.05em",
                      fontWeight: "800",
                      lineHeight: "1.16",
                    }}
                  >
                    <span data-fit-line="">
                      {s.name}
                      {","}
                    </span>
                    <span data-fit-line="">{"견적부터 받아보세요"}</span>
                  </h2>
                </div>
                <span style={{ fontSize: "17px", lineHeight: "1.7" }}>
                  {
                    "업종과 운영 중인 채널을 알려주시면 분석 자료와 함께 범위와 견적을 안내드립니다"
                  }
                </span>
              </div>
              <GuideLink
                href={contactHref}
                style={{
                  background: "#fff",
                  color: "#0D0D12",
                  padding: "18px 30px",
                  fontWeight: "600",
                }}
                context="marketing"
              >
                {"견적 문의 →"}
              </GuideLink>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
