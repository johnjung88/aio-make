import { divisionServices } from "./content";

export const labServices = divisionServices("development");
export const labServicePath = (id: string) => `/lab/services/${id}`;
export const labContactPath = (id = "website", message?: string) =>
  `/contact?${new URLSearchParams({ service: id, source: "lab", ...(message ? { message } : {}) })}`;

export const labDetails: Record<
  string,
  {
    eyebrow: string;
    title: string;
    sample: "website" | "shopping-mall" | "automation";
    features: [string, string][];
    gallery: [string, string, string][];
    faq: [string, string][];
  }
> = {
  website: {
    eyebrow: "WEBSITE / EXPLORE THE SPACE",
    title: "사업의 이야기를\n탐색하는 웹사이트",
    sample: "website",
    features: [
      [
        "정보 구조",
        "사업과 방문 목적에 맞춰 소개·서비스·문의 경로를 정리합니다",
      ],
      ["반응형 화면", "PC와 모바일에서 읽기와 선택 흐름을 맞춥니다"],
      [
        "작동하는 표현",
        "공간 탐색과 선택에 따른 정보 전환 등 필요한 표현을 협의합니다",
      ],
    ],
    gallery: [
      [
        "/lab/space-pc.webp",
        "여백결",
        "건축 · 공간과 재료를 보여주는 가상 브랜드 시안",
      ],
      [
        "/lab/stay-pc.webp",
        "활판재",
        "숙박 · 객실과 시설을 둘러보는 가상 브랜드 시안",
      ],
      [
        "/lab/clinic-pc.webp",
        "서리온결",
        "병원 · 진료 안내 가상 브랜드 시안 · AI 생성 인물 포함",
      ],
    ],
    faq: [
      [
        "3D 화면을 꼭 넣어야 하나요?",
        "사업의 설명에 도움이 되는 경우에만 선택합니다 같은 정보를 일반 이미지와 평면 화면으로 전달할 수도 있습니다",
      ],
      [
        "어떤 자료를 준비하나요?",
        "사업 소개와 서비스 내용, 로고·사진의 이용권, 문의에 필요한 항목을 준비하면 범위를 구체화할 수 있습니다",
      ],
    ],
  },
  "shopping-mall": {
    eyebrow: "COMMERCE / CHOOSE YOUR STYLE",
    title: "제품을 살펴보고\n선택하는 쇼핑몰",
    sample: "shopping-mall",
    features: [
      [
        "브랜드 화면",
        "카페24 스킨 구조에 맞춰 로고·배너와 판매 화면을 정리합니다",
      ],
      [
        "상품 탐색",
        "옵션과 이미지, 상품 설명을 살펴볼 수 있는 구성을 협의합니다",
      ],
      [
        "오픈 준비 범위",
        "상품등록·PG·배송 등 오픈설정은 공개 상품에 포함되지 않으며 별도로 확인합니다",
      ],
    ],
    gallery: [
      [
        "/lab-samples/forme-editorial.png",
        "FORME",
        "패션 · 착용 컷과 옵션 선택을 체험하는 가상 브랜드",
      ],
      [
        "/lab/food-pc.webp",
        "모그레빗",
        "식품 · 메뉴 소개를 위한 가상 브랜드 이미지 시안",
      ],
    ],
    faq: [
      [
        "샘플에서 실제 주문이 되나요?",
        "샘플은 상품과 옵션 선택, 장바구니와 주문 요약까지 체험하는 가상 화면입니다 실제 주문과 결제는 이루어지지 않습니다",
      ],
      [
        "템플릿과 상품등록도 포함되나요?",
        "선택 템플릿의 이용권과 PC·모바일 지원 범위를 확인합니다 상품등록·PG·배송 등 오픈설정은 공개 상품 범위에서 제외됩니다",
      ],
    ],
  },
  automation: {
    eyebrow: "AUTOMATION / INPUT TO RESULT",
    title: "반복하는 업무를\n이어지는 흐름으로",
    sample: "automation",
    features: [
      [
        "입력과 대조",
        "엑셀·CSV 등 현재 자료와 중복·누락 판단 기준을 정리합니다",
      ],
      [
        "예외 처리",
        "정상 처리와 보류·실패 상태를 나눠 담당자가 확인할 수 있게 설계합니다",
      ],
      [
        "운영 인계",
        "실행 방법과 결과 확인, 재실행과 복구 조건을 함께 정리합니다",
      ],
    ],
    gallery: [
      [
        "/lab/sample-automation.webp",
        "리드 처리 화면",
        "가상 데이터 · 중복 확인과 조건 분기, 결과 정리 시연",
      ],
    ],
    faq: [
      [
        "자동 발송도 포함되나요?",
        "화면의 시연은 외부 발송을 하지 않습니다 실제 계정 연동과 발송 범위, 승인 조건은 상담에서 별도로 정합니다",
      ],
      [
        "기존 엑셀 업무부터 시작할 수 있나요?",
        "입력 형식과 처리 규칙, 결과를 확인할 담당자를 정리한 뒤 작은 업무 흐름부터 범위를 협의할 수 있습니다",
      ],
    ],
  },
  program: {
    eyebrow: "PROGRAM / A WORKSPACE FOR YOUR TEAM",
    title: "팀의 일하는 방식에\n맞춘 프로그램",
    sample: "automation",
    features: [
      ["기능과 데이터", "관리할 항목과 상태, 입력·조회·수정 흐름을 정의합니다"],
      ["관리 화면", "담당자가 목록과 상세 정보를 확인하는 화면을 협의합니다"],
      [
        "권한과 연동",
        "접근 권한과 외부 도구 연결, 실패 처리와 운영 조건을 합의합니다",
      ],
    ],
    gallery: [
      [
        "/lab/sample-automation.webp",
        "업무 관리 콘셉트",
        "자동화 샘플 재사용 · 목록과 상태, 상세 정보 확인 흐름",
      ],
    ],
    faq: [
      [
        "자동화와 프로그램 개발은 어떻게 다른가요?",
        "자동화는 반복 처리 흐름을 중심으로, 프로그램 개발은 관리 화면·권한·데이터 기능을 중심으로 필요한 범위를 정합니다",
      ],
      [
        "샘플에 로그인과 권한도 구현되어 있나요?",
        "이 페이지는 자동화 샘플을 재사용해 관리 화면 흐름을 보여줍니다 실제 로그인·권한·외부 연동의 구현 범위는 별도로 협의합니다",
      ],
    ],
  },
};
