export type ServiceCategory =
  | "website"
  | "shopping-mall"
  | "logo-business-card"
  | "detail-page"
  | "ppt-design"
  | "automation-app"
  | "video-content";

export interface LocalizedString {
  ko: string;
  en: string;
}

export interface PricingTier {
  name: LocalizedString;
  eventPrice: string;
  regularPrice: string;
  duration: string;
  includes: LocalizedString[];
  recommended?: boolean;
  enterprise?: boolean;
}

export interface AddonItem {
  name: LocalizedString;
  price: string;
  detail?: LocalizedString;
}

export interface FaqItem {
  q: LocalizedString;
  a: LocalizedString;
}

export interface ServiceDetail {
  id: ServiceCategory;
  title: LocalizedString;
  subtitle: string;
  description: LocalizedString;
  items: { icon: string; name: LocalizedString; detail: LocalizedString }[];
  process: { step: string; title: LocalizedString; description: LocalizedString }[];
  pricing: PricingTier[];
  addons?: AddonItem[];
  relatedPortfolio: string[];
  cta: LocalizedString;
  faqs?: FaqItem[];
}

const sharedProcess = [
  {
    step: "01",
    title: { ko: "상담 및 범위 확정", en: "Consultation & scope" },
    description: { ko: "목표, 예산, 일정, 참고 레퍼런스를 빠르게 정리합니다", en: "Clarify goals, budget, timeline, and references." },
  },
  {
    step: "02",
    title: { ko: "견적 제안", en: "Quote proposal" },
    description: { ko: "납품 범위, 수정 횟수, 일정, 비용을 문서로 안내합니다", en: "Confirm deliverables, revisions, timeline, and cost." },
  },
  {
    step: "03",
    title: { ko: "작업 및 중간 공유", en: "Production & check-in" },
    description: { ko: "초안 또는 중간 결과물을 공유하고 피드백을 반영합니다", en: "Share drafts or working results and apply feedback." },
  },
  {
    step: "04",
    title: { ko: "납품 및 유지보수", en: "Delivery & support" },
    description: { ko: "최종 파일, 운영 가이드, 14일 기본 A/S를 제공합니다", en: "Deliver final files, guide, and 14-day support." },
  },
];

export const servicesData: ServiceDetail[] = [
  {
    id: "website",
    title: { ko: "웹사이트", en: "Website" },
    subtitle: "Website",
    description: {
      ko: "랜딩페이지, 회사 홈페이지, 포트폴리오 사이트를 전환 중심으로 제작합니다",
      en: "Conversion-focused landing pages, company sites, and portfolio websites.",
    },
    items: [
      { icon: "◈", name: { ko: "랜딩페이지", en: "Landing page" }, detail: { ko: "문의 전환을 목표로 한 1페이지 구성", en: "Single-page structure built for inquiries" } },
      { icon: "◈", name: { ko: "회사 홈페이지", en: "Company website" }, detail: { ko: "서비스, 소개, 포트폴리오, 문의까지 구성", en: "Services, about, portfolio, and quote flow" } },
      { icon: "◈", name: { ko: "반응형 UI", en: "Responsive UI" }, detail: { ko: "모바일과 데스크톱 모두 최적화", en: "Optimized for mobile and desktop" } },
      { icon: "◈", name: { ko: "SEO 기본 세팅", en: "SEO basics" }, detail: { ko: "메타, 사이트맵, 공유 이미지 정리", en: "Meta, sitemap, and social preview setup" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "랜딩 1페이지", en: "랜딩 1페이지" },
        eventPrice: "50,000원~",
        regularPrice: "",
        duration: "",
        includes: [
          { ko: "단일 홍보/문의 페이지", en: "단일 홍보/문의 페이지" },
          { ko: "기본 원고 정리", en: "기본 원고 정리" },
          { ko: "기본 이미지/배너 구성", en: "기본 이미지/배너 구성" },
          { ko: "모바일 반응형", en: "모바일 반응형" },
          { ko: "문의 버튼 연결", en: "문의 버튼 연결" },
        ],
      },
      {
        name: { ko: "기본 홈페이지 5페이지 이하", en: "기본 홈페이지 5페이지 이하" },
        eventPrice: "100,000원~",
        regularPrice: "",
        duration: "",
        recommended: true,
        includes: [
          { ko: "회사소개/서비스/문의 등 기본 홈페이지", en: "회사소개/서비스/문의 등 기본 홈페이지" },
          { ko: "기본 원고 정리", en: "기본 원고 정리" },
          { ko: "기본 이미지/배너 구성", en: "기본 이미지/배너 구성" },
          { ko: "메뉴 구성", en: "메뉴 구성" },
          { ko: "모바일 반응형", en: "모바일 반응형" },
          { ko: "기본 SEO", en: "기본 SEO" },
          { ko: "문의 연결 확인", en: "문의 연결 확인" },
        ],
      },
      {
        name: { ko: "홈페이지 10페이지 이하", en: "홈페이지 10페이지 이하" },
        eventPrice: "250,000원~",
        regularPrice: "",
        duration: "",
        includes: [
          { ko: "브랜드/회사/포트폴리오형 홈페이지", en: "브랜드/회사/포트폴리오형 홈페이지" },
          { ko: "최대 10페이지 구성", en: "최대 10페이지 구성" },
          { ko: "기본 원고 정리", en: "기본 원고 정리" },
          { ko: "기본 이미지/배너 구성", en: "기본 이미지/배너 구성" },
          { ko: "모바일 반응형", en: "모바일 반응형" },
          { ko: "기본 SEO", en: "기본 SEO" },
          { ko: "문의 연결 확인", en: "문의 연결 확인" },
        ],
      },
      {
        name: { ko: "기능형 홈페이지", en: "기능형 홈페이지" },
        eventPrice: "별도 견적",
        regularPrice: "",
        duration: "",
        includes: [
          { ko: "관리자 페이지", en: "관리자 페이지" },
          { ko: "예약 기능", en: "예약 기능" },
          { ko: "결제 기능", en: "결제 기능" },
          { ko: "회원 기능", en: "회원 기능" },
          { ko: "게시판", en: "게시판" },
          { ko: "DB/API 연동", en: "DB/API 연동" },
          { ko: "자동화 연동", en: "자동화 연동" },
          { ko: "다국어/글로벌 홈페이지", en: "다국어/글로벌 홈페이지" },
        ],
      },
    ],
    addons: [
      {
        name: { ko: "관리자 페이지 세팅", en: "관리자 페이지 세팅" },
        price: "+50,000원~",
        detail: { ko: "고객이 직접 수정 가능한 관리자/CMS 세팅 (아임웹·워드프레스·노션형·자체 관리자 등 범위에 따라 변동)", en: "고객이 직접 수정 가능한 관리자/CMS 세팅 (아임웹·워드프레스·노션형·자체 관리자 등 범위에 따라 변동)" },
      },
      {
        name: { ko: "문의 텔레그램 알림 연동", en: "문의 텔레그램 알림 연동" },
        price: "+50,000원~",
        detail: { ko: "홈페이지 문의 접수 시 텔레그램으로 알림 전송", en: "홈페이지 문의 접수 시 텔레그램으로 알림 전송" },
      },
      {
        name: { ko: "문의 DB/구글시트/이메일 연동", en: "문의 DB/구글시트/이메일 연동" },
        price: "+50,000원~",
        detail: { ko: "문의 내용을 구글시트·이메일·DB 등에 저장/전송", en: "문의 내용을 구글시트·이메일·DB 등에 저장/전송" },
      },
      {
        name: { ko: "다국어 페이지 추가", en: "다국어 페이지 추가" },
        price: "언어당 +50,000원~",
        detail: { ko: "한국어 기본 + 언어 1개당 추가 (번역 원문 제공 여부에 따라 변동)", en: "한국어 기본 + 언어 1개당 추가 (번역 원문 제공 여부에 따라 변동)" },
      },
      {
        name: { ko: "예약/결제/회원/게시판 기능", en: "예약/결제/회원/게시판 기능" },
        price: "기능별 +100,000원~",
        detail: { ko: "단순 링크 연결이 아닌 실제 기능 세팅이 필요한 경우", en: "단순 링크 연결이 아닌 실제 기능 세팅이 필요한 경우" },
      },
      {
        name: { ko: "커스텀 개발/API/DB 연동", en: "커스텀 개발/API/DB 연동" },
        price: "별도 견적",
        detail: { ko: "외부 API·데이터베이스·자동화·관리자 기능·복잡한 폼 등", en: "외부 API·데이터베이스·자동화·관리자 기능·복잡한 폼 등" },
      },
    ],
    relatedPortfolio: ["chueok-korea", "aio-design-agency", "v-aio-website"],
    cta: { ko: "웹사이트 견적 문의", en: "Request website quote" },
    faqs: [
      {
        q: { ko: "웹사이트 제작 기간은 얼마나 걸리나요?", en: "웹사이트 제작 기간은 얼마나 걸리나요?" },
        a: { ko: "결제 후 5일 내 완성을 기본으로 합니다. 기능형 홈페이지(예약·결제·회원 등)는 범위에 따라 별도 협의합니다.", en: "결제 후 5일 내 완성을 기본으로 합니다. 기능형 홈페이지(예약·결제·회원 등)는 범위에 따라 별도 협의합니다." },
      },
      {
        q: { ko: "원고나 이미지가 없어도 제작이 가능한가요?", en: "원고나 이미지가 없어도 제작이 가능한가요?" },
        a: { ko: "가능합니다. 기본 원고 정리·기본 이미지/배너 구성은 기본 제작에 포함됩니다. 원고가 부족해도 기본 정리를 도와드립니다.", en: "가능합니다. 기본 원고 정리·기본 이미지/배너 구성은 기본 제작에 포함됩니다. 원고가 부족해도 기본 정리를 도와드립니다." },
      },
      {
        q: { ko: "도메인과 호스팅도 포함인가요?", en: "도메인과 호스팅도 포함인가요?" },
        a: { ko: "도메인·호스팅은 별도이며, 구매 후 연결 설정은 지원 드립니다.", en: "도메인·호스팅은 별도이며, 구매 후 연결 설정은 지원 드립니다." },
      },
      {
        q: { ko: "완성 후 직접 수정할 수 있나요?", en: "완성 후 직접 수정할 수 있나요?" },
        a: { ko: "기본 수정 1회가 포함됩니다. 직접 수정이 필요하시면 관리자 페이지 세팅(+50,000원~)을 추가하실 수 있습니다.", en: "기본 수정 1회가 포함됩니다. 직접 수정이 필요하시면 관리자 페이지 세팅(+50,000원~)을 추가하실 수 있습니다." },
      },
      {
        q: { ko: "결제·예약·회원가입 기능도 추가할 수 있나요?", en: "결제·예약·회원가입 기능도 추가할 수 있나요?" },
        a: { ko: "가능합니다. 기본 패키지 외 기능(결제·예약·회원·게시판 등)은 기능별 +100,000원~으로 별도 견적 진행합니다.", en: "가능합니다. 기본 패키지 외 기능(결제·예약·회원·게시판 등)은 기능별 +100,000원~으로 별도 견적 진행합니다." },
      },
      {
        q: { ko: "어떤 기술로 제작되나요?", en: "어떤 기술로 제작되나요?" },
        a: { ko: "주로 Next.js 기반으로 제작하며, 용도와 예산에 따라 가장 적합한 스택을 제안합니다.", en: "주로 Next.js 기반으로 제작하며, 용도와 예산에 따라 가장 적합한 스택을 제안합니다." },
      },
    ],
  },
  {
    id: "shopping-mall",
    title: { ko: "쇼핑몰", en: "Shopping Mall" },
    subtitle: "Commerce",
    description: {
      ko: "카페24, 커머스 메인, 상품 진열, 배너 디자인을 실제 판매 화면 중심으로 정리합니다",
      en: "Cafe24 and commerce storefront design focused on real selling screens.",
    },
    items: [
      { icon: "◈", name: { ko: "카페24 메인", en: "Cafe24 main" }, detail: { ko: "업종별 쇼핑몰 첫 화면 디자인", en: "Industry-specific storefront home design" } },
      { icon: "◈", name: { ko: "상품 진열", en: "Product display" }, detail: { ko: "카테고리, 배너, 베스트 상품 구성", en: "Category, banner, and best-item layout" } },
      { icon: "◈", name: { ko: "모바일 최적화", en: "Mobile optimization" }, detail: { ko: "모바일 쇼핑 흐름 우선 설계", en: "Mobile-first shopping flow" } },
      { icon: "◈", name: { ko: "운영 가이드", en: "Ops guide" }, detail: { ko: "이미지 교체와 상품 관리 기준 제공", en: "Guide for image and product updates" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "자사몰 단순복사", en: "자사몰 단순복사" },
        eventPrice: "129,000원~",
        regularPrice: "",
        duration: "",
        includes: [
          { ko: "카페24 기본 디자인/스킨 단순복사", en: "카페24 기본 디자인/스킨 단순복사" },
          { ko: "기본 로고/색상 반영", en: "기본 로고/색상 반영" },
          { ko: "기본 배너/이미지 교체", en: "기본 배너/이미지 교체" },
          { ko: "모바일 기본 확인", en: "모바일 기본 확인" },
          { ko: "간단 운영 안내", en: "간단 운영 안내" },
          { ko: "1개월 AS", en: "1개월 AS" },
        ],
      },
      {
        name: { ko: "자사몰 풀세팅", en: "자사몰 풀세팅" },
        eventPrice: "249,000원~",
        regularPrice: "",
        duration: "",
        recommended: true,
        includes: [
          { ko: "기본 디자인 적용", en: "기본 디자인 적용" },
          { ko: "메인/카테고리 구성", en: "메인/카테고리 구성" },
          { ko: "기본 배너/이미지 구성", en: "기본 배너/이미지 구성" },
          { ko: "상품 기본 등록", en: "상품 기본 등록" },
          { ko: "배송/교환/문의 안내", en: "배송/교환/문의 안내" },
          { ko: "카카오/톡톡 등 기본 링크 연결", en: "카카오/톡톡 등 기본 링크 연결" },
          { ko: "기본 SEO 문구", en: "기본 SEO 문구" },
          { ko: "모바일 확인", en: "모바일 확인" },
          { ko: "간단 운영 안내", en: "간단 운영 안내" },
          { ko: "1개월 AS", en: "1개월 AS" },
        ],
      },
    ],
    addons: [
      {
        name: { ko: "대량 상품 등록 추가", en: "대량 상품 등록 추가" },
        price: "50,000원~",
        detail: { ko: "기본 포함 수량을 넘는 대량 상품 등록 · 옵션 복잡 상품 정리", en: "기본 포함 수량을 넘는 대량 상품 등록 · 옵션 복잡 상품 정리" },
      },
      {
        name: { ko: "광고/분석 추적 고급 세팅", en: "광고/분석 추적 고급 세팅" },
        price: "100,000원~",
        detail: { ko: "GA4 · Meta/Google/Naver/Kakao 픽셀 · 구매/장바구니/문의 전환 이벤트", en: "GA4 · Meta/Google/Naver/Kakao 픽셀 · 구매/장바구니/문의 전환 이벤트" },
      },
      {
        name: { ko: "운영 유지관리 / 월관리", en: "운영 유지관리 / 월관리" },
        price: "100,000원~/월",
        detail: { ko: "월 배너 교체 · 상품관리 · 간단 수정 · 반복 운영관리", en: "월 배너 교체 · 상품관리 · 간단 수정 · 반복 운영관리" },
      },
      {
        name: { ko: "고급 커스텀 / 외부 시스템 연동", en: "고급 커스텀 / 외부 시스템 연동" },
        price: "별도 견적",
        detail: { ko: "ERP · 재고/API · 자동화 · 다국어 · B2B · 회원등급 · 관리자 커스텀 등 개발성 작업", en: "ERP · 재고/API · 자동화 · 다국어 · B2B · 회원등급 · 관리자 커스텀 등 개발성 작업" },
      },
    ],
    relatedPortfolio: ["cafe24-farm-fresh", "cafe24-live-commerce", "cafe24-premium-tea"],
    cta: { ko: "쇼핑몰 견적 문의", en: "Request store quote" },
    faqs: [
      {
        q: { ko: "카페24가 아닌 다른 플랫폼도 가능한가요?", en: "Do you support platforms other than Cafe24?" },
        a: { ko: "카페24를 기본으로 지원합니다. 쇼피파이 등 다른 플랫폼은 별도 문의 주세요", en: "Cafe24 is our primary platform. Contact us for other platforms like Shopify." },
      },
      {
        q: { ko: "상품 등록은 몇 개까지 포함되나요?", en: "How many products are included in setup?" },
        a: { ko: "패키지에 따라 3-10개이며, 추가 상품 등록은 개당 별도 금액입니다", en: "3-10 products depending on the package; additional uploads are quoted per item." },
      },
      {
        q: { ko: "기존 쇼핑몰 리뉴얼도 가능한가요?", en: "Can you redesign an existing store?" },
        a: { ko: "네, 기존 쇼핑몰 리뉴얼도 동일 조건으로 진행 가능합니다", en: "Yes, existing store redesigns are handled under the same terms." },
      },
      {
        q: { ko: "모바일 화면도 함께 제작되나요?", en: "Is mobile optimization included?" },
        a: { ko: "모든 패키지에 모바일 최적화가 포함됩니다", en: "Mobile optimization is included in all packages." },
      },
      {
        q: { ko: "결제·배송·PG 설정도 도와주나요?", en: "Do you help with payment and shipping setup?" },
        a: { ko: "설정 가이드를 제공하며, 실제 PG 계약 등 플랫폼 계정 설정은 별도 안내 드립니다", en: "We provide setup guides; actual PG contracts and platform account setup are handled separately." },
      },
    ],
  },
  {
    id: "logo-business-card",
    title: { ko: "로고 및 명함", en: "Logo & Business Card" },
    subtitle: "Brand Kit",
    description: {
      ko: "새 브랜드를 시작할 때 필요한 로고와 명함을 부담 없는 5월 이벤트가로 준비할 수 있습니다. 온라인 프로필, 인쇄, 상담 자료에 바로 적용할 수 있는 실사용 파일로 받아보세요",
      en: "Prepare the logo and business card assets needed for a new brand at limited May launch pricing, delivered as practical files for profiles, print, and sales materials.",
    },
    items: [
      { icon: "◈", name: { ko: "부담 없는 시작 비용", en: "Affordable launch cost" }, detail: { ko: "초기 창업자와 소상공인도 로고와 명함을 합리적인 가격으로 먼저 갖출 수 있습니다", en: "A practical starting point for founders and small businesses that need brand assets quickly." } },
      { icon: "◈", name: { ko: "빠른 시안 확인", en: "Fast draft review" }, detail: { ko: "브랜드 방향을 빠르게 확인하고, 마음에 드는 안을 골라 최종 파일로 받을 수 있습니다", en: "Review directions quickly, choose the preferred concept, and receive final files." } },
      { icon: "◈", name: { ko: "바로 쓰는 납품 파일", en: "Ready-to-use files" }, detail: { ko: "SNS 프로필, 명함 인쇄, 소개 자료에 바로 적용할 수 있는 형식으로 제공합니다", en: "Delivered in formats ready for SNS profiles, card printing, and sales materials." } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "입문형 로고·명함", en: "Starter Logo & Card" },
        eventPrice: "₩29,000",
        regularPrice: "₩59,000",
        duration: "1일",
        includes: [
          { ko: "로고 1안", en: "1 logo concept" },
          { ko: "명함 1안", en: "1 business card concept" },
          { ko: "수정 1회", en: "1 revision" },
          { ko: "PNG/JPG/PDF 납품", en: "PNG/JPG/PDF delivery" },
        ],
      },
      {
        name: { ko: "실속형 로고 3안·명함", en: "Value Logo 3 Concepts & Card" },
        eventPrice: "₩49,000",
        regularPrice: "₩99,000",
        duration: "1-2일",
        recommended: true,
        includes: [
          { ko: "로고 3안", en: "3 logo concepts" },
          { ko: "최종 1안 선택", en: "Choose 1 final concept" },
          { ko: "명함 1안", en: "1 business card concept" },
          { ko: "수정 2회", en: "2 revisions" },
          { ko: "PNG/JPG/PDF 납품", en: "PNG/JPG/PDF delivery" },
        ],
      },
      {
        name: { ko: "창업형 브랜드 키트", en: "Startup Brand Kit" },
        eventPrice: "₩99,000",
        regularPrice: "₩199,000",
        duration: "2-3일",
        includes: [
          { ko: "로고 3안 + 명함 1안", en: "3 logo concepts + 1 card concept" },
          { ko: "SNS 프로필", en: "SNS profile asset" },
          { ko: "실사 목업 3컷", en: "3 realistic mockups" },
          { ko: "미니 가이드", en: "Mini brand guide" },
          { ko: "PNG/JPG/PDF/SVG 납품", en: "PNG/JPG/PDF/SVG delivery" },
        ],
      },
    ],
    addons: [
      { name: { ko: "AI(일러스트레이터) 원본 파일 추가", en: "Add Adobe Illustrator source file" }, price: "+₩20,000" },
      { name: { ko: "명함 인원 추가 1명", en: "Add 1 business card person" }, price: "+₩10,000" },
      { name: { ko: "수정 1회 추가", en: "Add 1 revision" }, price: "+₩10,000" },
      { name: { ko: "실사 목업 3컷 추가", en: "Add 3 realistic mockups" }, price: "+₩20,000" },
      { name: { ko: "급행 24시간 납품", en: "24-hour rush delivery" }, price: "+₩20,000" },
    ],
    relatedPortfolio: ["aio-brand-kit"],
    cta: { ko: "로고·명함 견적 문의", en: "Request brand quote" },
  },
  {
    id: "detail-page",
    title: { ko: "상세페이지", en: "Detail Page" },
    subtitle: "Sales Detail",
    description: {
      ko: "상품, 서비스, 플랫폼 판매 페이지를 이미지 중심의 세로형 상세페이지로 제작합니다",
      en: "Vertical sales detail pages for products, services, and marketplace listings.",
    },
    items: [
      { icon: "◈", name: { ko: "상품 상세", en: "Product detail" }, detail: { ko: "판매 포인트와 이미지 흐름 정리", en: "Sales points and image flow" } },
      { icon: "◈", name: { ko: "서비스 상세", en: "Service detail" }, detail: { ko: "문제, 해결, 결과, 가격 흐름 정리", en: "Problem, solution, result, and pricing" } },
      { icon: "◈", name: { ko: "플랫폼용 이미지", en: "Marketplace assets" }, detail: { ko: "숨고, 크몽, 쇼핑몰 등록용", en: "For Soomgo, Kmong, and stores" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "라이트 기본형", en: "Light Basic" },
        eventPrice: "₩49,000",
        regularPrice: "₩100,000~",
        duration: "1일",
        includes: [
          { ko: "기존 자료 기반 짧은 상세페이지 정리", en: "Short detail page from existing materials" },
          { ko: "모바일 최적화", en: "Mobile optimized" },
          { ko: "PNG/JPG 납품", en: "PNG/JPG delivery" },
        ],
      },
      {
        name: { ko: "스탠다드 기획형", en: "Standard Planning" },
        eventPrice: "₩79,000",
        regularPrice: "₩300,000~",
        duration: "1-2일",
        recommended: true,
        includes: [
          { ko: "상품 장점/구매 포인트/섹션 구성", en: "Product strengths, buying points, and section structure" },
          { ko: "문구 정리", en: "Copy cleanup" },
          { ko: "수정 2회", en: "2 revisions" },
        ],
      },
      {
        name: { ko: "프리미엄 전환형", en: "Premium Conversion" },
        eventPrice: "₩129,000",
        regularPrice: "₩600,000~",
        duration: "2-3일",
        includes: [
          { ko: "문제 제기/비교/후기·신뢰 요소", en: "Problem framing, comparison, reviews, and trust elements" },
          { ko: "구매 설득 흐름 구성", en: "Conversion-focused buying flow" },
          { ko: "수정 2회", en: "2 revisions" },
        ],
      },
    ],
    addons: [
      { name: { ko: "이미지 길이 추가", en: "Extra image length" }, price: "섹션당 +₩10,000" },
      { name: { ko: "제품/경쟁사 리서치 강화", en: "Product/competitor research enhancement" }, price: "+₩30,000" },
      { name: { ko: "상세페이지 원고가 아예 없는 경우", en: "No detail-page copy provided" }, price: "+₩30,000~" },
      { name: { ko: "누끼/보정 대량 작업", en: "Bulk cutout/retouching" }, price: "별도" },
      { name: { ko: "긴급 제작", en: "Rush production" }, price: "+₩30,000" },
    ],
    relatedPortfolio: ["detail-page-ampoule-anti-aging", "detail-page-premium-mealkit", "detail-page-linen-onepiece"],
    cta: { ko: "상세페이지 견적 문의", en: "Request detail page quote" },
    faqs: [
      {
        q: { ko: "상세페이지 제작에 얼마나 걸리나요?", en: "How long does detail page production take?" },
        a: { ko: "기본 패키지 기준 2-5일입니다. 자료 제출이 빠를수록 납기가 단축됩니다", en: "2-5 days for the base package. Faster asset delivery means faster turnaround." },
      },
      {
        q: { ko: "쿠팡, 스마트스토어, 11번가 등 어떤 플랫폼도 가능한가요?", en: "Do you support Coupang, SmartStore, and other platforms?" },
        a: { ko: "네, 모든 오픈마켓 및 쇼핑몰 플랫폼에 맞는 규격으로 제작합니다", en: "Yes, we produce to spec for all major marketplace and storefront platforms." },
      },
      {
        q: { ko: "제품 사진이 없어도 제작이 가능한가요?", en: "Can you create a detail page without product photos?" },
        a: { ko: "기본 이미지가 있으면 작업이 가능합니다. 고퀄리티 촬영이 필요한 경우 별도 안내 드립니다", en: "Basic images are sufficient to start. Professional photography can be arranged separately if needed." },
      },
      {
        q: { ko: "수정은 몇 번이나 가능한가요?", en: "How many revisions are included?" },
        a: { ko: "패키지에 따라 1-3회 기본 포함이며, 추가 수정은 건당 별도 견적입니다", en: "1-3 revisions depending on the package; additional revisions are quoted per round." },
      },
      {
        q: { ko: "납품 파일 형식은 어떻게 되나요?", en: "What file formats are delivered?" },
        a: { ko: "PSD 원본과 플랫폼 업로드용 JPG/PNG 파일로 납품합니다", en: "PSD source files plus platform-ready JPG/PNG files." },
      },
    ],
  },
  {
    id: "ppt-design",
    title: { ko: "PPT 디자인", en: "PPT Design" },
    subtitle: "Presentation",
    description: {
      ko: "회사소개서, 제안서, 피치덱을 바로 발표 가능한 원본 파일로 제작합니다",
      en: "Company decks, proposals, and pitch decks delivered as editable files.",
    },
    items: [
      { icon: "◈", name: { ko: "회사소개서", en: "Company deck" }, detail: { ko: "서비스와 강점을 명확히 보여주는 구성", en: "Clear structure for service and strengths" } },
      { icon: "◈", name: { ko: "제안서", en: "Proposal" }, detail: { ko: "가격, 프로세스, 범위 설득 구조", en: "Pricing, process, and scope persuasion" } },
      { icon: "◈", name: { ko: "피치덱", en: "Pitch deck" }, detail: { ko: "투자자/파트너용 핵심 슬라이드", en: "Core slides for investors or partners" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "라이트 1~9P", en: "Light 1-9P" },
        eventPrice: "₩40,000",
        regularPrice: "₩60,000",
        duration: "1일",
        includes: [
          { ko: "1~9슬라이드 디자인", en: "1-9 slide design" },
          { ko: "PPTX + PDF 납품", en: "PPTX + PDF delivery" },
          { ko: "수정 1회", en: "1 revision" },
        ],
      },
      {
        name: { ko: "스탠다드 10~20P", en: "Standard 10-20P" },
        eventPrice: "₩80,000",
        regularPrice: "₩130,000",
        duration: "1-2일",
        recommended: true,
        includes: [
          { ko: "10~20슬라이드 디자인", en: "10-20 slide design" },
          { ko: "도식화 및 레이아웃 정리", en: "Diagram and layout cleanup" },
          { ko: "수정 2회", en: "2 revisions" },
        ],
      },
      {
        name: { ko: "프리미엄 21~30P", en: "Premium 21-30P" },
        eventPrice: "₩120,000",
        regularPrice: "₩200,000",
        duration: "2-3일",
        includes: [
          { ko: "21~30슬라이드 디자인", en: "21-30 slide design" },
          { ko: "기획 흐름 및 도식화", en: "Structure and diagramming" },
          { ko: "수정 2회", en: "2 revisions" },
        ],
      },
    ],
    addons: [{ name: { ko: "슬라이드 추가", en: "Extra slide" }, price: "+₩5,000~" }],
    relatedPortfolio: ["ppt-brand-proposal", "ppt-government-grant", "ppt-ir-investment"],
    cta: { ko: "PPT 견적 문의", en: "Request deck quote" },
  },
  {
    id: "automation-app",
    title: { ko: "자동화 및 앱", en: "Automation & App" },
    subtitle: "Automation & App",
    description: {
      ko: "반복 업무 자동화, 데이터 수집, MVP 앱, 운영 대시보드를 빠르게 구축합니다",
      en: "Workflow automation, data collection, MVP apps, and operation dashboards.",
    },
    items: [
      { icon: "◈", name: { ko: "데이터 크롤링", en: "Data crawling" }, detail: { ko: "공개 데이터 수집, 정리, 엑셀/CSV 납품", en: "Public data collection and Excel/CSV delivery" } },
      { icon: "◈", name: { ko: "업무 자동화", en: "Workflow automation" }, detail: { ko: "반복 업무를 스케줄과 알림으로 자동화", en: "Automate repeat tasks with schedules and alerts" } },
      { icon: "◈", name: { ko: "MVP 앱", en: "MVP app" }, detail: { ko: "검증용 웹/모바일 앱 빠른 제작", en: "Fast web/mobile MVP for validation" } },
      { icon: "◈", name: { ko: "운영 대시보드", en: "Ops dashboard" }, detail: { ko: "로그, 상태, 결과물을 한 화면에서 관리", en: "Manage logs, status, and results in one screen" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "엑셀·구글시트 간단 자동화", en: "Excel / Google Sheets Automation" },
        eventPrice: "₩49,000~",
        regularPrice: "₩70,000~",
        duration: "1~2일",
        includes: [
          { ko: "엑셀 양식 자동화", en: "Excel form automation" },
          { ko: "구글시트 자동 계산", en: "Google Sheets auto calc" },
          { ko: "버튼 클릭형 정리", en: "One-click organization" },
          { ko: "파일명·폴더 정리", en: "File & folder renaming" },
        ],
      },
      {
        name: { ko: "단순 매크로·반복작업 자동화", en: "Simple Macro / Repetitive Task" },
        eventPrice: "₩79,000~",
        regularPrice: "₩120,000~",
        duration: "1~3일",
        includes: [
          { ko: "단순 클릭·입력 반복", en: "Click & input repetition" },
          { ko: "파일 이동·정리", en: "File move & organize" },
          { ko: "반복 업무 1개 흐름", en: "Single workflow automation" },
          { ko: "단순 브라우저 조작", en: "Basic browser control" },
        ],
      },
      {
        name: { ko: "웹크롤링·데이터 수집 기본", en: "Web Crawling / Data Collection" },
        eventPrice: "₩99,000~",
        regularPrice: "₩150,000~",
        duration: "2~3일",
        includes: [
          { ko: "공개 페이지 데이터 수집", en: "Public page data collection" },
          { ko: "목록·상세 페이지 수집", en: "List & detail page scraping" },
          { ko: "엑셀/CSV 저장", en: "Excel/CSV export" },
          { ko: "1개 사이트 기준", en: "Single-site scope" },
        ],
      },
      {
        name: { ko: "업무자동화 프로그램 기본", en: "Workflow Automation Program" },
        eventPrice: "₩149,000~",
        regularPrice: "₩250,000~",
        duration: "3~5일",
        recommended: true,
        includes: [
          { ko: "입력→처리→결과 저장", en: "Input → Process → Save" },
          { ko: "반복 업무 1개 프로세스", en: "Single process automation" },
          { ko: "간단 설정값 포함", en: "Configurable settings" },
          { ko: "로컬 실행 스크립트", en: "Local script / executable" },
        ],
      },
      {
        name: { ko: "UI 포함 자동화 프로그램", en: "Automation with UI" },
        eventPrice: "₩299,000~",
        regularPrice: "₩500,000~",
        duration: "5~7일",
        includes: [
          { ko: "버튼형 실행 프로그램", en: "GUI-driven program" },
          { ko: "파일 선택·실행·중지", en: "File pick, run, stop" },
          { ko: "결과 확인 화면", en: "Results display screen" },
          { ko: "간단 사용자 입력창", en: "User input interface" },
        ],
      },
      {
        name: { ko: "스케줄러·알림·DB 포함 자동화", en: "Scheduler / Alert / DB Automation" },
        eventPrice: "₩499,000~",
        regularPrice: "₩800,000~",
        duration: "5~10일",
        includes: [
          { ko: "정해진 시간 자동 실행", en: "Scheduled auto-run" },
          { ko: "텔레그램·메일 알림", en: "Telegram / Email alerts" },
          { ko: "DB·구글시트 저장", en: "DB or Google Sheets storage" },
          { ko: "로그·오류 처리", en: "Logging & error handling" },
        ],
      },
      {
        name: { ko: "RPA·API·AI·관리자형 시스템", en: "RPA / API / AI / Admin System" },
        eventPrice: "₩1,000,000~",
        regularPrice: "₩1,500,000~",
        duration: "별도 협의",
        enterprise: true,
        includes: [
          { ko: "내부 업무·관리자 시스템", en: "Internal workflow & admin system" },
          { ko: "API·ERP·CRM 연동", en: "API / ERP / CRM integration" },
          { ko: "AI 자동분류·요약·응답", en: "AI auto-classify, summarize, respond" },
          { ko: "다중 사용자 지원", en: "Multi-user support" },
          { ko: "장기 유지보수형", en: "Long-term maintenance" },
        ],
      },
    ],
    addons: [{ name: { ko: "운영 유지보수", en: "Ops maintenance" }, price: "월 ₩300,000~" }],
    relatedPortfolio: [
      "blogautopilot-multinational",
      "v-aio-chatbot",
      "youtube-autopilot",
      "t-aio",
      "data-crawling-demo",
      "koready",
    ],
    cta: { ko: "자동화·앱 견적 문의", en: "Request automation quote" },
  },
  {
    id: "video-content",
    title: { ko: "영상 콘텐츠", en: "Video Content" },
    subtitle: "Video",
    description: {
      ko: "브랜드 인트로, 홍보 영상, 쇼츠·릴스, 튜토리얼 영상을 제작합니다",
      en: "Brand intros, promotional videos, shorts/reels, and tutorial videos.",
    },
    items: [
      { icon: "◈", name: { ko: "브랜드 인트로", en: "Brand intro" }, detail: { ko: "로고와 메시지를 담은 짧은 모션", en: "Short motion with logo and message" } },
      { icon: "◈", name: { ko: "쇼츠·릴스", en: "Shorts/Reels" }, detail: { ko: "세로형 SNS 영상 구성", en: "Vertical social video format" } },
      { icon: "◈", name: { ko: "홍보 영상", en: "Promo video" }, detail: { ko: "서비스 소개와 CTA 중심 편집", en: "Service intro and CTA-focused edit" } },
      { icon: "◈", name: { ko: "튜토리얼", en: "Tutorial" }, detail: { ko: "화면 녹화, 자막, 챕터 구성", en: "Screen recording, captions, and chapters" } },
    ],
    process: sharedProcess,
    pricing: [
      {
        name: { ko: "30초 숏폼 1개", en: "30s short-form video" },
        eventPrice: "₩100,000~",
        regularPrice: "₩150,000~",
        duration: "1-3일",
        recommended: true,
        includes: [
          { ko: "30초 숏폼 1개", en: "One 30s short-form video" },
          { ko: "BGM 및 자막", en: "BGM and captions" },
          { ko: "수정 1회", en: "1 revision" },
        ],
      },
      {
        name: { ko: "60초 또는 숏폼 3개", en: "60s video or 3 shorts" },
        eventPrice: "₩250,000~",
        regularPrice: "₩350,000~",
        duration: "2-3일",
        includes: [
          { ko: "60초 홍보 영상 또는 숏폼 3개", en: "60s promo video or 3 short-form videos" },
          { ko: "썸네일/캡션 포함", en: "Thumbnail and caption included" },
          { ko: "플랫폼별 내보내기", en: "Platform-ready exports" },
        ],
      },
      {
        name: { ko: "브랜드 영상 세트", en: "Brand video set" },
        eventPrice: "₩600,000~",
        regularPrice: "₩900,000~",
        duration: "3-7일",
        includes: [
          { ko: "브랜드 영상 세트", en: "Brand video set" },
          { ko: "구성안 포함", en: "Storyboard included" },
          { ko: "수정 2회", en: "2 revisions" },
        ],
      },
    ],
    addons: [{ name: { ko: "비율 추가", en: "Extra aspect ratio" }, price: "+₩20,000/비율" }],
    relatedPortfolio: ["aio-motion-intro"],
    cta: { ko: "영상 견적 문의", en: "Request video quote" },
  },
];

export function getServiceById(id: ServiceCategory): ServiceDetail | undefined {
  return servicesData.find((service) => service.id === id);
}

export const serviceCategories: { label: LocalizedString; value: ServiceCategory; icon: string }[] = [
  { label: { ko: "웹사이트", en: "Website" }, value: "website", icon: "Globe" },
  { label: { ko: "쇼핑몰", en: "Shopping Mall" }, value: "shopping-mall", icon: "ShoppingBag" },
  { label: { ko: "로고 및 명함", en: "Logo & Business Card" }, value: "logo-business-card", icon: "BadgeCheck" },
  { label: { ko: "상세페이지", en: "Detail Page" }, value: "detail-page", icon: "FileImage" },
  { label: { ko: "PPT 디자인", en: "PPT Design" }, value: "ppt-design", icon: "Presentation" },
  { label: { ko: "자동화 및 앱", en: "Automation & App" }, value: "automation-app", icon: "Bot" },
  { label: { ko: "영상 콘텐츠", en: "Video Content" }, value: "video-content", icon: "Video" },
];

// ── 대분류 메타 카테고리 ────────────────────────────────────────────

export type MetaCategoryId = "design" | "development" | "video" | "marketing";

export interface MetaCategory {
  id: MetaCategoryId;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  icon: string;
  subcategories: ServiceCategory[];
  comingSoon: boolean;
}

export const metaCategoriesData: MetaCategory[] = [
  {
    id: "design",
    title: { ko: "디자인", en: "Design" },
    subtitle: { ko: "브랜드디자인 · 상세페이지 · PPT", en: "Brand design · Detail pages · PPT" },
    description: {
      ko: "로고, 브랜드 아이덴티티부터 상품 상세페이지, 제안서 디자인까지 시각적 결과물 전반을 담당합니다",
      en: "From logo and brand identity to product detail pages and presentation design.",
    },
    icon: "Palette",
    subcategories: ["logo-business-card", "detail-page", "ppt-design"],
    comingSoon: false,
  },
  {
    id: "development",
    title: { ko: "개발", en: "Development" },
    subtitle: { ko: "쇼핑몰 · 웹사이트 · 앱", en: "Storefront · Website · App" },
    description: {
      ko: "쇼핑몰, 랜딩페이지, 회사 홈페이지, 자동화 앱까지 코드로 구현하는 모든 것",
      en: "Shopping malls, landing pages, company sites, and automation apps — all in code.",
    },
    icon: "Code2",
    subcategories: ["shopping-mall", "website", "automation-app"],
    comingSoon: false,
  },
  {
    id: "video",
    title: { ko: "영상", en: "Video" },
    subtitle: { ko: "준비 중", en: "Coming Soon" },
    description: {
      ko: "브랜드 인트로, 홍보 영상, 쇼츠·릴스 제작 서비스를 준비 중입니다",
      en: "Brand intro, promo videos, and Shorts/Reels — coming soon.",
    },
    icon: "Video",
    subcategories: ["video-content"],
    comingSoon: true,
  },
  {
    id: "marketing",
    title: { ko: "마케팅", en: "Marketing" },
    subtitle: { ko: "준비 중", en: "Coming Soon" },
    description: {
      ko: "SNS 콘텐츠, 광고 소재, 퍼포먼스 마케팅 서비스를 준비 중입니다",
      en: "Social content, ad creatives, and performance marketing — coming soon.",
    },
    icon: "Megaphone",
    subcategories: [],
    comingSoon: true,
  },
];

export const relatedCategoriesMap: Record<ServiceCategory, ServiceCategory[]> = {
  "website":            ["logo-business-card", "automation-app"],
  "shopping-mall":      ["detail-page", "video-content"],
  "logo-business-card": ["website", "ppt-design"],
  "detail-page":        ["shopping-mall", "video-content", "logo-business-card"],
  "ppt-design":         ["logo-business-card"],
  "automation-app":     ["website"],
  "video-content":      ["detail-page", "shopping-mall"],
};
