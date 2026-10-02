export const divisions = [
  {
    id: "marketing",
    path: "marketing",
    label: "마케팅",
    brand: "Marketing",
    number: "02",
    headline: "좋은 브랜드가\n고객을 만나는 방법",
    summary:
      "고객의 질문에서 출발해 컨텐츠, 채널, 검색과 문의를 하나의 흐름으로 연결합니다",
    image: "/renewal/marketing-content-v03.webp",
    tagline: "고객을 이해하고, 관계를 설계합니다",
    process: ["현황 진단", "질문과 전략", "컨텐츠 제작", "운영과 개선"],
  },
  {
    id: "development",
    path: "lab",
    label: "개발",
    brand: "Lab",
    number: "03",
    headline: "아이디어를\n작동하는 서비스로",
    summary:
      "웹사이트부터 반복 업무까지 필요한 기능을 분명하게 정하고 실제로 사용할 수 있는 결과물을 만듭니다",
    image: "/images/guide/images/services/development-hero.png",
    tagline: "목적을 정의하고, 필요한 기능을 만듭니다",
    process: [
      "요구사항 정리",
      "구조와 화면 설계",
      "구현과 검수",
      "소스와 운영 인계",
    ],
  },
  {
    id: "video",
    path: "video",
    label: "컨텐츠",
    brand: "Studio",
    number: "01",
    headline: "이야기가\n브랜드의 장면이 되도록",
    summary:
      "웹툰, 애니메이션, AI 인플루언서 전달할 메시지에 맞는 형식을 찾아 이야기를 완성합니다",
    image: "/renewal/brand-film-v03.webp",
    tagline: "메시지를 정하고, 기억에 남는 장면을 만듭니다",
    process: [
      "메시지와 권리 확인",
      "기획과 장면 구성",
      "제작과 검수",
      "형식별 인계",
    ],
  },
] as const;
export type Division = (typeof divisions)[number];
export type DivisionId = Division["id"];
export function divisionByPath(path: string) {
  return divisions.find((d) => d.path === path);
}
export function divisionById(id: string) {
  return divisions.find((d) => d.id === id);
}
export type Service = {
  id: string;
  division: DivisionId;
  name: string;
  subtitle: string;
  description: string;
  audience: string;
  outcomes: string[];
  inputs: string[];
  faq?: { q: string; a: string }[];
};
export const services: Service[] = [
  {
    id: "integrated",
    division: "marketing",
    name: "통합 마케팅",
    subtitle: "채널을 넘어 하나의 방향으로",
    description:
      "분석과 전략, 컨텐츠 중심 컨텐츠, 채널 운영과 검색·문의 접점 개선을 함께 설계합니다",
    audience: "컨텐츠와 채널이 분산되어 일관된 운영 방향이 필요한 브랜드",
    outcomes: [
      "현황 분석과 월간 운영 전략",
      "컨텐츠 중심 원본과 채널별 재구성",
      "지도·검색 접점 분석과 개선",
      "운영 보고와 다음 계획",
    ],
    inputs: [
      "사업과 고객 정보",
      "운영 중인 채널",
      "제품 자료와 이용권",
      "문의 후속 담당과 목표",
    ],
    faq: [
      {
        q: "원본과 게시 수는 같은가요?",
        a: "원본 컨텐츠 수와 채널별 게시 수는 다른 단위입니다 형식과 채널별 수량은 운영 계획에서 구분해 합의합니다",
      },
    ],
  },
  {
    id: "sns",
    division: "marketing",
    name: "SNS 대행 운영",
    subtitle: "소재가 꾸준한 컨텐츠가 되도록",
    description:
      "브랜드의 사진과 제품 자료를 고객의 질문에 맞는 이미지·컨텐츠로 만들고 채널을 운영합니다",
    audience: "소재는 있지만 컨텐츠 기획과 운영을 지속하기 어려운 사업체",
    outcomes: [
      "월간 컨텐츠 계획",
      "이미지와 컨텐츠 원본 제작",
      "채널별 형식 변환과 게시",
      "운영 결과와 개선 정리",
    ],
    inputs: [
      "브랜드와 고객 정보",
      "사진·제품 자료",
      "채널 접근 범위",
      "공개 가능한 사실과 표현",
    ],
  },
  {
    id: "ai-influencer",
    division: "marketing",
    name: "AI 인플루언서 운영",
    subtitle: "브랜드의 이야기를 전하는 가상 인물",
    description:
      "브랜드 전용 캐릭터와 반복 컨텐츠를 구축하고 채널 운영으로 연결합니다",
    audience: "반복 출연자를 확보하기 어렵고 일관된 설명이 필요한 브랜드",
    outcomes: [
      "브랜드 전용 캐릭터 방향",
      "반복 컨텐츠",
      "채널별 변형과 운영",
      "컨텐츠 반응과 개선",
    ],
    inputs: [
      "인물 콘셉트",
      "확인된 제품 정보",
      "초상·음성·제품 권리",
      "운영 채널과 목표",
    ],
  },
  {
    id: "seo",
    division: "marketing",
    name: "SEO · AEO · GEO",
    subtitle: "검색과 AI 답변이 이해할 수 있는 정보",
    description:
      "사이트 구조와 고객 질문을 정리하고, 검색 엔진과 AI 답변이 참고할 정보를 소스·CMS에 적용합니다",
    audience: "수정 가능한 자사 사이트와 제품·질문 자료를 보유한 사업체",
    outcomes: [
      "기술·컨텐츠 진단",
      "정보 구조와 답변 설계",
      "소스 또는 CMS 적용",
      "검수와 운영 방법 인계",
    ],
    inputs: [
      "사이트 URL",
      "소스·CMS 접근 가능 여부",
      "제품 정보와 고객 질문",
      "기존 검색·분석 데이터",
    ],
    faq: [
      {
        q: "검색 순위나 AI 추천을 보장하나요?",
        a: "외부 시스템의 검색 순위와 AI 답변은 보장할 수 없습니다 적용 범위와 확인 가능한 개선 결과를 구분해 안내합니다",
      },
    ],
  },
  {
    id: "website",
    division: "development",
    name: "웹사이트 제작",
    subtitle: "소개에서 문의까지 자연스럽게",
    description:
      "사업 소개와 서비스, 신뢰 자료, 문의 흐름을 정리한 반응형 웹사이트를 제작합니다",
    audience: "사업 소개를 명확히 하고 방문자의 문의 경로를 개선하려는 사업체",
    outcomes: [
      "정보 구조와 반응형 화면",
      "문의 기능과 기본 검색 설정",
      "PC·모바일 검수",
      "소스와 운영 방법 인계",
    ],
    inputs: [
      "사업·서비스 정보",
      "도메인과 기존 사이트",
      "브랜드 자료",
      "필요한 페이지와 기능",
    ],
  },
  {
    id: "shopping-mall",
    division: "development",
    name: "쇼핑몰 제작",
    subtitle: "제품을 보여주는 판매의 공간",
    description:
      "카페24 스킨 구조에 맞는 쇼핑몰 디자인과 기본 브랜드 이미지를 제작·적용합니다",
    audience: "스킨과 상품 자료를 바탕으로 판매 화면을 정리하려는 브랜드",
    outcomes: [
      "카페24 스킨 구조에 맞는 디자인",
      "선택 범위의 로고·배너 이미지",
      "상품 목록·상세 동선 검수",
      "적용과 운영 안내",
    ],
    inputs: [
      "플랫폼과 스킨 이용권",
      "선택 템플릿",
      "제품·브랜드 자료",
      "이미지와 기능 범위",
    ],
    faq: [
      {
        q: "상품 등록과 오픈 설정도 포함되나요?",
        a: "디자인 복사와 브랜드 이미지 제작·적용을 구분합니다 상품 등록과 오픈 설정은 기본 디자인 상품에 포함되지 않으며 별도로 확인합니다",
      },
    ],
  },
  {
    id: "automation",
    division: "development",
    name: "업무 자동화",
    subtitle: "반복 작업을 줄이는 구조",
    description:
      "입력과 처리, 결과 확인의 흐름을 살펴 반복 업무에 필요한 자동화를 건별로 설계합니다",
    audience: "엑셀·CSV 정리나 수집·대조·알림 등의 반복 업무를 운영하는 팀",
    outcomes: [
      "입출력과 예외 처리 설계",
      "합의된 업무 흐름 구현",
      "실제 입력을 통한 검수",
      "실행·복구·운영 안내",
    ],
    inputs: [
      "현재 업무 순서",
      "비식별 샘플 파일",
      "연동 대상과 권한",
      "예외와 성공 기준",
    ],
  },
  {
    id: "program",
    division: "development",
    name: "프로그램 개발",
    subtitle: "팀에 필요한 기능을 정확하게",
    description:
      "관리 화면과 권한, 데이터 연동 등 필요한 기능을 정의하고 맞춤 프로그램을 개발합니다",
    audience: "기존 도구로 처리하기 어려운 관리·연동 기능이 필요한 팀",
    outcomes: [
      "기능과 데이터 구조 설계",
      "관리 화면·권한·연동 구현",
      "기능·예외·접근 검수",
      "코드와 운영 환경 인계",
    ],
    inputs: [
      "사용자와 업무",
      "필요한 기능",
      "데이터·연동 대상",
      "운영·지원 범위",
    ],
  },
  {
    id: "webtoon",
    division: "video",
    name: "웹툰 제작",
    subtitle: "읽히는 이야기, 이어지는 장면",
    description:
      "소재와 캐릭터를 바탕으로 사건과 선택, 반응이 이어지는 웹툰을 기획·제작합니다",
    audience: "브랜드의 이야기를 회차나 이미지 컨텐츠로 전하려는 팀",
    outcomes: [
      "기획과 시나리오",
      "캐릭터와 장면 방향",
      "합의된 분량의 이미지",
      "읽는 흐름과 일관성 검수",
    ],
    inputs: [
      "소재와 메시지",
      "캐릭터·IP 권리",
      "분량과 사용 채널",
      "참고 스타일",
    ],
  },
  {
    id: "animation",
    division: "video",
    name: "애니메이션",
    subtitle: "캐릭터와 메시지에 움직임을",
    description:
      "이야기와 캐릭터의 장면을 설계하고 목적과 형식에 맞는 애니메이션을 제작합니다",
    audience: "캐릭터나 제품 메시지를 움직이는 장면으로 전하려는 브랜드",
    outcomes: [
      "기획과 장면 구성",
      "캐릭터·배경 방향",
      "컨텐츠와 합의된 음향",
      "장면 연속성과 출력 검수",
    ],
    inputs: [
      "캐릭터·자산 이용권",
      "컨텐츠 길이와 비율",
      "음성·음악 이용권",
      "표현 난도와 사용처",
    ],
  },
  {
    id: "ai-influencer",
    division: "video",
    name: "AI 인플루언서 제작",
    subtitle: "일관된 인물로 반복되는 이야기",
    description:
      "브랜드 전용 가상 인물을 구축하고 제품·메시지의 사실에 맞는 반복 컨텐츠를 제작합니다",
    audience: "가상 인물 기반 제품 설명과 브랜드 컨텐츠가 필요한 팀",
    outcomes: [
      "인물 설정과 기준 이미지",
      "합의된 길이의 반복 컨텐츠",
      "제품·인물 일관성 검수",
      "사용 형식에 맞는 파일",
    ],
    inputs: [
      "인물 콘셉트",
      "제품과 메시지",
      "초상·음성·자산 권리",
      "길이와 반복 수량",
    ],
  },
  {
    id: "brand-film",
    division: "video",
    name: "브랜드 홍보 컨텐츠",
    subtitle: "한 장면에 담는 브랜드의 이유",
    description:
      "제품과 서비스의 확인된 정보를 바탕으로 홍보 컨텐츠와 채널별 광고 소재를 제작합니다",
    audience: "브랜드 소개와 제품 설명, 채널 광고용 컨텐츠가 필요한 사업체",
    outcomes: [
      "메시지와 컨텐츠 구성",
      "합의된 장면 제작",
      "자막·음향과 채널별 출력",
      "제품 사실과 권리 검수",
    ],
    inputs: [
      "제품·브랜드 자료",
      "원본 이용권",
      "목표와 채널",
      "길이·버전·수정 범위",
    ],
  },
  {
    id: "ad",
    division: "video",
    name: "SNS 광고 컨텐츠",
    subtitle: "짧은 장면에서 분명한 메시지로",
    description:
      "확인된 제품 정보를 채널별 광고 컨텐츠로 구성합니다 길이와 버전, 수정 범위는 상담에서 정합니다",
    audience: "소셜 채널에 맞는 짧은 광고 컨텐츠가 필요한 브랜드",
    outcomes: [
      "메시지와 장면 기획",
      "합의된 컨텐츠 제작",
      "채널별 출력",
      "제품 사실과 권리 검수",
    ],
    inputs: [
      "제품 자료와 이용권",
      "광고 채널",
      "컨텐츠 길이와 버전",
      "희망 일정",
    ],
  },
  {
    id: "editing",
    division: "video",
    name: "컨텐츠 편집",
    subtitle: "원본에서 필요한 메시지로",
    description:
      "제공된 적법한 컨텐츠 원본을 정리하고 목적에 맞는 편집·자막·클립을 제작합니다",
    audience: "촬영 원본에서 소개 컨텐츠가나 짧은 클립을 만들려는 팀",
    outcomes: [
      "원본 정리와 구성",
      "합의된 편집과 자막",
      "형식별 출력",
      "컨텐츠·음향 검수",
    ],
    inputs: ["원본과 이용권", "원하는 길이", "자막과 메시지", "출력 형식"],
  },
];
export function divisionServices(id: DivisionId) {
  return services.filter((s) => s.division === id);
}
export function serviceById(division: DivisionId, id: string) {
  return services.find((s) => s.division === division && s.id === id);
}
export const companyFaq = [
  {
    q: "견적과 납기는 어떻게 정하나요?",
    a: "목표와 요청 범위, 준비된 자료, 필요한 기능과 수정·검수 기준을 확인한 뒤 견적과 납기를 안내합니다",
  },
  {
    q: "여러 분야를 함께 맡길 수 있나요?",
    a: "마케팅·개발·컨텐츠의 목표와 범위를 함께 확인하고 필요한 분야를 연결해 진행할 수 있습니다",
  },
  {
    q: "AI가 모든 작업을 하나요?",
    a: "AI를 기획과 제작 과정에 활용하고 사람이 자료의 사실, 권리, 품질과 전달 형식을 확인합니다",
  },
];

export function serviceVisual(service: Service) {
  if (service.division !== "video") return null;
  const visuals: Record<string, { image: string; caption: string }> = {
    webtoon: {
      image: "/renewal/webtoon-sample.webp",
      caption: "웹툰 스타일 예시",
    },
    animation: {
      image: "/renewal/animation-sample.webp",
      caption: "애니메이션 스타일 예시",
    },
    "ai-influencer": {
      image: "/renewal/influencer-sample.webp",
      caption: "AI 인플루언서 콘셉트 · AI 생성 가상 인물",
    },
  };
  return visuals[service.id] ?? null;
}
