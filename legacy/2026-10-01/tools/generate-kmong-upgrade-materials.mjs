import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "marketplace", "kmong-upgrade");
const docPath = path.join(root, "docs", "marketplace", "kmong-upgrade-copy.md");
const dataPath = path.join(root, "docs", "marketplace", "kmong-upgrade-data.json");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(docPath), { recursive: true });

const commonRules = [
  "외부 연락처, 이메일, 카카오톡, SNS, 사이트 URL은 상품 설명과 이미지에 넣지 않습니다.",
  "최저가, 1위, 무제한, 100% 만족, 매출 보장, 환불 보장 문구는 사용하지 않습니다.",
  "2026년 5월 이벤트가는 진입 상품의 장점으로만 표현하고, 본문은 결과물과 범위 중심으로 작성합니다.",
  "원본파일과 상업적 이용 가능 여부는 패키지/추가 옵션에서 명확히 구분합니다.",
];

const services = [
  {
    id: "website",
    name: "웹사이트",
    title: "맞춤형 웹사이트 제작",
    category: "IT·프로그래밍 > 홈페이지 신규 제작",
    accent: "#0ea5e9",
    keywords: ["홈페이지", "웹사이트", "랜딩페이지", "반응형", "회사소개"],
    intro:
      "방문자가 브랜드를 이해하고 문의까지 이동할 수 있도록 정보 구조, 화면 흐름, 반응형 UI를 함께 설계합니다. 단순 제작보다 첫 화면 메시지, 서비스 설명, 신뢰 요소, CTA 배치를 먼저 정리해 실제 영업에 쓰기 좋은 웹사이트로 만듭니다.",
    positioning: [
      "첫 화면에서 무엇을 하는 회사인지 바로 보이도록 메시지를 정리합니다.",
      "PC와 모바일을 함께 고려해 반복 수정이 적은 구조로 제작합니다.",
      "문의, 예약, 상담 버튼 등 전환 동선을 화면 안에 자연스럽게 배치합니다.",
      "납품 후 운영자가 문구와 이미지를 교체할 수 있도록 기준을 안내합니다.",
    ],
    recommend: [
      "회사 소개와 서비스 안내가 필요한 개인사업자·소상공인",
      "랜딩페이지로 광고나 문의 전환을 받고 싶은 브랜드",
      "포트폴리오, 후기, 문의 동선을 한 번에 정리하고 싶은 팀",
      "짧은 일정 안에 검토 가능한 웹 결과물이 필요한 초기 사업자",
    ],
    scope: [
      "메뉴 구조와 섹션 흐름 정리",
      "PC·모바일 반응형 화면 제작",
      "문의 CTA, 버튼, 폼, 지도 등 기본 전환 동선",
      "기본 SEO 메타 정보와 공유 이미지 기준 안내",
      "배포 또는 운영 가이드 제공",
    ],
    packages: [
      ["STANDARD", "랜딩 1P", "50,000원", "정상가 250,000원", "1일", "수정 1회", "1페이지 반응형 랜딩"],
      ["DELUXE", "홈페이지 5P", "300,000원", "정상가 800,000원", "3일", "수정 2회", "회사소개형 기본 홈페이지"],
      ["PREMIUM", "홈페이지 10P", "800,000원", "정상가 2,000,000원", "5일", "수정 3회", "서비스/포트폴리오형 확장 홈페이지"],
    ],
    process: [
      "목표, 업종, 참고 사이트, 필요한 페이지 확인",
      "메뉴 구조와 섹션별 메시지 정리",
      "PC·모바일 화면 제작 및 중간 공유",
      "피드백 반영과 기본 동작 점검",
      "최종 결과물, 배포 정보, 운영 가이드 전달",
    ],
    deliverables: ["웹사이트 결과물", "PC·모바일 확인 자료", "기본 SEO 정보", "운영 가이드"],
    revision: "오탈자, 문구 교체, 이미지 교체, 버튼/섹션 내 단순 배치 조정은 패키지별 수정 횟수 안에서 반영합니다. 페이지 추가, 기능 추가, 전체 콘셉트 변경, 외부 시스템 연동은 별도 협의합니다.",
    requestItems: ["사업/브랜드 소개", "필요한 페이지 목록", "로고와 브랜드 컬러", "참고 사이트 2~3개", "필수 문구와 이미지"],
    faqs: [
      ["자료가 정리되어 있지 않아도 가능한가요?", "가능합니다. 상담 단계에서 필요한 페이지와 우선순위를 먼저 정리합니다."],
      ["모바일 화면도 포함되나요?", "모든 패키지는 모바일 확인을 포함합니다. 범위는 패키지별 페이지 수에 따라 달라집니다."],
      ["도메인 연결도 가능한가요?", "가능합니다. 보유 도메인과 호스팅 환경을 확인한 뒤 연결 범위를 안내합니다."],
      ["직접 수정할 수 있나요?", "제작 방식에 따라 수정 가능한 구조와 운영 가이드를 함께 안내합니다."],
    ],
    addons: [
      ["빠른 작업", "기본가의 30%~", "일정 가능 여부 확인 후 적용"],
      ["페이지 추가", "30,000원~", "섹션 길이와 기능에 따라 협의"],
      ["원본/소스 제공", "100,000원~", "제작 방식과 라이선스 범위 확인"],
      ["상업적 이용 가능", "기본 포함", "의뢰인 사업 홍보 목적 사용 가능"],
      ["유지보수 안내", "50,000원~", "문구·이미지 교체 등 단순 운영 지원"],
    ],
  },
  {
    id: "shopping-mall",
    name: "쇼핑몰",
    title: "쇼핑몰 세팅 제작합니다",
    category: "IT·프로그래밍 > 쇼핑몰 신규 제작 > 쇼핑몰 웹빌더",
    accent: "#10b981",
    keywords: ["쇼핑몰", "카페24", "브랜드몰", "상점세팅", "상품진열"],
    intro:
      "쇼핑몰은 예쁜 첫 화면보다 상품을 빨리 이해시키는 구조가 중요합니다. 업종, 상품군, 브랜드 톤에 맞춰 메인 비주얼, 카테고리, 배너, 베스트 상품 영역을 정리하고 모바일 구매 흐름까지 고려해 제작합니다.",
    positioning: [
      "고객이 첫 화면에서 대표 상품과 브랜드 분위기를 바로 이해하도록 구성합니다.",
      "카테고리, 배너, 추천 상품 영역의 우선순위를 정리합니다.",
      "운영자가 시즌 배너와 상품 이미지를 교체하기 쉬운 기준을 제공합니다.",
      "카페24 등 웹빌더 환경에서 적용 가능한 범위를 먼저 확인합니다.",
    ],
    recommend: [
      "쇼핑몰 오픈 전 메인 화면이 필요한 브랜드",
      "기존 쇼핑몰 첫인상과 상품 진열을 개선하고 싶은 운영자",
      "배너, 카테고리, 베스트 상품 구성이 정리되지 않은 판매자",
      "모바일 쇼핑 흐름을 기준으로 화면을 다시 잡고 싶은 사업자",
    ],
    scope: [
      "쇼핑몰 메인 구조와 섹션 순서 설계",
      "배너와 상품 진열 영역 디자인",
      "카테고리와 대표 상품 노출 기준 제안",
      "모바일 기준 쇼핑 흐름 정리",
      "이미지 교체와 운영 기준 안내",
    ],
    packages: [
      ["STANDARD", "쇼핑몰 메인", "150,000원", "정상가 500,000원", "2일", "수정 1회", "메인 화면과 핵심 배너"],
      ["DELUXE", "쇼핑몰 풀세팅", "300,000원", "정상가 1,000,000원", "3~5일", "수정 2회", "메인·카테고리·배너 세트"],
      ["PREMIUM", "쇼핑몰 풀커스텀", "1,000,000원", "정상가 3,000,000원", "7~10일", "수정 3회", "브랜드몰 맞춤 구성"],
    ],
    process: [
      "업종, 상품군, 참고몰, 브랜드 톤 확인",
      "메인 화면 구조와 핵심 배너 방향 정리",
      "PC·모바일 기준 디자인 제작",
      "피드백 반영 및 상품 진열 흐름 점검",
      "최종 이미지와 운영 가이드 전달",
    ],
    deliverables: ["메인 화면 이미지", "배너/섹션 이미지", "모바일 확인 이미지", "이미지 교체 가이드"],
    revision: "문구 교체, 상품 이미지 교체, 색상 일부 조정, 배너 문구 수정은 패키지별 수정 횟수 안에서 반영합니다. 상품 촬영, 전체 리브랜딩, 결제/회원 기능 개발, 외부 솔루션 고도화는 별도 협의합니다.",
    requestItems: ["쇼핑몰 URL 또는 오픈 예정 플랫폼", "브랜드 로고와 컬러", "대표 상품 이미지", "상품 카테고리", "참고 쇼핑몰 2~3개"],
    faqs: [
      ["카페24가 아니어도 가능한가요?", "가능합니다. 다만 실제 적용 방식은 플랫폼에 따라 달라질 수 있어 먼저 환경을 확인합니다."],
      ["상품 등록까지 포함되나요?", "기본은 화면 구성과 디자인입니다. 상품 등록 대행은 별도 옵션으로 협의합니다."],
      ["모바일 화면도 같이 보나요?", "쇼핑몰은 모바일 구매 비중이 높기 때문에 모바일 흐름을 함께 확인합니다."],
      ["운영자가 나중에 배너를 바꿀 수 있나요?", "교체 기준과 이미지 사이즈를 안내해 운영자가 관리하기 쉬운 형태로 전달합니다."],
    ],
    addons: [
      ["빠른 작업", "기본가의 30%~", "자료 준비 상태와 일정 확인 후 적용"],
      ["배너 추가", "20,000원~", "사이즈와 수량에 따라 협의"],
      ["상품 등록 대행", "50,000원~", "상품 수와 옵션 수 기준 협의"],
      ["원본파일 제공", "50,000원~", "PSD/Figma 등 제작 방식에 따라 협의"],
      ["상업적 이용 가능", "기본 포함", "의뢰인 쇼핑몰 운영 목적 사용 가능"],
    ],
  },
  {
    id: "logo-business-card",
    name: "로고·명함",
    title: "로고와 명함 디자인 제작",
    category: "디자인 > 로고·브랜딩",
    accent: "#ec4899",
    keywords: ["로고", "명함", "브랜딩", "심볼", "브랜드"],
    intro:
      "브랜드명만 있는 상태에서도 바로 사용할 수 있는 로고, 심볼, 명함, 온라인 프로필 이미지를 정리합니다. 인쇄와 온라인 노출을 함께 고려해 작은 브랜드가 처음 필요한 시각 자산을 빠르게 갖출 수 있도록 제작합니다.",
    positioning: [
      "로고만 예쁘게 만드는 것이 아니라 실제 사용처에 맞춰 확장합니다.",
      "명함, 프로필, 견적서, SNS에서 톤이 맞도록 파일을 정리합니다.",
      "초기 브랜드가 과한 제작비 없이 기본 이미지를 갖추도록 구성합니다.",
      "인쇄용과 웹용 파일을 구분해 납품합니다.",
    ],
    recommend: [
      "신규 브랜드를 시작하는 소상공인",
      "로고와 명함을 한 번에 정리하고 싶은 대표님",
      "SNS와 견적서에 통일된 이미지를 쓰고 싶은 사업자",
      "기존 로고를 더 깔끔하게 정리하고 싶은 브랜드",
    ],
    scope: ["메인 로고 또는 심볼", "가로형/세로형 적용 방향", "명함 양면 디자인", "웹용/인쇄용 파일", "간단 컬러 사용 기준"],
    packages: [
      ["STANDARD", "로고 단독", "10,000원", "정상가 50,000원", "1일", "수정 1회", "로고 또는 심볼 1안"],
      ["DELUXE", "로고+명함", "30,000원", "정상가 150,000원", "1~2일", "수정 2회", "로고와 양면 명함"],
      ["PREMIUM", "풀브랜딩", "100,000원", "정상가 400,000원", "3일", "수정 3회", "로고 시스템과 프로필 키트"],
    ],
    process: ["브랜드명, 업종, 원하는 분위기 확인", "콘셉트 방향 정리", "로고 시안 제작", "선택안 수정 및 명함 적용", "최종 파일 전달"],
    deliverables: ["로고 이미지 파일", "명함 인쇄용 파일", "온라인 사용 이미지", "컬러와 사용 방향 안내"],
    revision: "색상, 폰트 톤, 간격, 문구, 명함 정보 수정은 패키지별 수정 횟수 안에서 반영합니다. 브랜드명 변경, 완전한 콘셉트 변경, 추가 시안 제작, 인쇄 대행은 별도 협의합니다.",
    requestItems: ["브랜드명", "업종과 타깃 고객", "원하는 분위기 키워드", "명함에 넣을 정보", "참고 이미지 2~3개"],
    faqs: [
      ["로고만 먼저 진행할 수 있나요?", "가능합니다. 명함과 프로필 이미지는 패키지에 따라 추가됩니다."],
      ["인쇄까지 포함되나요?", "기본은 디자인 파일 납품입니다. 인쇄 대행은 별도 협의가 필요합니다."],
      ["원본파일을 받을 수 있나요?", "패키지 또는 추가 옵션에 따라 SVG, PDF, AI 호환 파일 제공 범위를 안내합니다."],
      ["상업적으로 사용할 수 있나요?", "의뢰인 사업 홍보 목적 사용이 가능하도록 범위를 안내합니다."],
    ],
    addons: [
      ["빠른 작업", "20,000원~", "당일 일정 가능 시 적용"],
      ["추가 시안", "30,000원~", "콘셉트 1안 추가"],
      ["원본파일 제공", "30,000원~", "SVG/PDF/AI 호환 파일"],
      ["상업적 이용 가능", "기본 포함", "의뢰인 브랜드 사용 목적"],
      ["명함 인쇄용 세부 수정", "10,000원~", "정보 변경 또는 규격 조정"],
    ],
  },
  {
    id: "detail-page",
    name: "상세페이지",
    title: "상세페이지 디자인 제작",
    category: "디자인 > 상세페이지",
    accent: "#f97316",
    keywords: ["상세페이지", "상세페이지제작", "상품페이지", "스마트스토어", "배너"],
    intro:
      "상세페이지는 제품 사진을 길게 붙이는 작업이 아니라 고객이 구매 이유를 순서대로 이해하도록 설계하는 작업입니다. 제품 특징, 사용 장면, 신뢰 요소, FAQ, 구매 전 확인 사항을 세로형 흐름으로 정리해 모바일에서 읽기 쉬운 판매 페이지로 제작합니다.",
    positioning: [
      "제품의 핵심 장점을 구매 흐름에 맞게 재배치합니다.",
      "모바일 기준 가독성과 섹션 간 리듬을 우선합니다.",
      "이미지, 카피, 스펙, FAQ를 한 화면 흐름으로 정리합니다.",
      "플랫폼 업로드용 JPG/PNG 형태로 납품합니다.",
    ],
    recommend: [
      "스마트스토어, 오픈마켓, 카페24 상세페이지가 필요한 판매자",
      "제품 설명은 있지만 디자인 흐름이 부족한 브랜드",
      "모바일에서 읽기 쉬운 판매 페이지가 필요한 사업자",
      "기존 상세페이지를 개선하고 싶은 운영자",
    ],
    scope: ["상세페이지 구조 설계", "제품 핵심 카피 정리", "모바일 기준 세로형 디자인", "이미지 보정과 섹션 구성", "웹용 JPG/PNG 납품"],
    packages: [
      ["STANDARD", "상세 1장", "30,000원", "정상가 100,000원", "1일", "수정 1회", "배너 또는 짧은 상세 이미지"],
      ["DELUXE", "상세 5장 세트", "120,000원", "정상가 300,000원", "2~3일", "수정 2회", "5섹션 상세페이지"],
      ["PREMIUM", "상세 풀스택", "250,000원", "정상가 600,000원", "3~5일", "수정 3회", "기획·카피·디자인 구성"],
    ],
    process: ["제품 정보와 타깃 고객 확인", "핵심 소구 포인트 정리", "세로형 흐름 구성", "디자인 제작 및 수정 반영", "최종 이미지 전달"],
    deliverables: ["상세페이지 JPG/PNG", "모바일 확인 이미지", "섹션별 카피 정리본", "플랫폼 업로드용 이미지"],
    revision: "오탈자, 문구 수정, 이미지 교체, 일부 색상/배치 조정은 패키지별 수정 횟수 안에서 반영합니다. 제품 촬영, 모델컷 제작, 전체 기획 변경, 길이 추가는 별도 협의합니다.",
    requestItems: ["제품 사진", "제품명과 주요 특징", "판매 타깃", "상세 스펙", "참고 상세페이지 2~3개"],
    faqs: [
      ["제품 사진이 부족해도 가능한가요?", "가능한 범위 안에서 구성할 수 있지만, 고해상도 제품 이미지가 많을수록 결과물이 안정적입니다."],
      ["스마트스토어에 바로 올릴 수 있나요?", "플랫폼 규격에 맞는 이미지 형태로 전달합니다."],
      ["기획부터 가능한가요?", "제품 정보가 있으면 핵심 소구 포인트와 섹션 흐름을 함께 정리할 수 있습니다."],
      ["원본파일은 제공되나요?", "기본 납품은 JPG/PNG이며, 원본파일은 추가 옵션 또는 패키지 범위로 안내합니다."],
    ],
    addons: [
      ["빠른 작업", "기본가의 30%~", "자료 준비 완료 시 적용"],
      ["길이 추가", "10,000원~", "1,000px 또는 섹션 단위"],
      ["원본파일 제공", "50,000원~", "PSD/Figma 등 제작 방식에 따라 협의"],
      ["상업적 이용 가능", "기본 포함", "의뢰인 판매 채널 사용 목적"],
      ["추가 수정", "20,000원~", "패키지 수정 횟수 초과 시"],
    ],
  },
  {
    id: "ppt-design",
    name: "PPT",
    title: "PPT 디자인 제작",
    category: "디자인 > PPT·인포그래픽 > PPT",
    accent: "#8b5cf6",
    keywords: ["PPT", "PPT제작", "제안서", "회사소개서", "피치덱"],
    intro:
      "PPT는 예쁜 슬라이드보다 읽히는 순서와 설득 흐름이 중요합니다. 사업소개서, 제안서, 강의자료, 투자 설명 자료를 목적과 청중에 맞춰 재구성하고, 가독성 높은 레이아웃과 일관된 톤으로 제작합니다.",
    positioning: [
      "원고의 핵심 메시지를 먼저 정리하고 슬라이드 흐름을 잡습니다.",
      "표, 그래프, 도식, 아이콘을 사용해 복잡한 내용을 쉽게 보이게 합니다.",
      "PPTX 원본과 PDF를 함께 납품해 발표와 제출에 바로 사용할 수 있습니다.",
      "브랜드 컬러와 로고가 있다면 전체 톤에 반영합니다.",
    ],
    recommend: [
      "회사소개서나 제안서가 필요한 사업자",
      "기존 PPT를 전문적으로 리디자인하고 싶은 팀",
      "IR, 정부지원사업, 입찰 자료의 가독성을 높이고 싶은 대표님",
      "강의·세미나 자료를 일관된 톤으로 정리하고 싶은 분",
    ],
    scope: ["표지, 목차, 본문 슬라이드 디자인", "도식화, 아이콘, 그래프 정리", "PPTX와 PDF 납품", "기본 발표 흐름 제안", "브랜드 톤 반영"],
    packages: [
      ["STANDARD", "PPT 10P", "50,000원", "정상가 100,000원", "1~2일", "수정 1회", "10장 디자인 정리"],
      ["DELUXE", "PPT 20P", "100,000원", "정상가 250,000원", "2일", "수정 2회", "20장 디자인과 도식화"],
      ["PREMIUM", "PPT 30P+", "250,000원", "정상가 500,000원", "3~5일", "수정 3회", "30장 이상 기획 흐름 포함"],
    ],
    process: ["발표 목적과 대상 확인", "원고와 기존 자료 검토", "톤앤매너 1~2장 제안", "전체 슬라이드 디자인", "수정 반영 후 PPTX/PDF 전달"],
    deliverables: ["PPTX 원본", "PDF 파일", "사용 이미지/폰트 안내", "슬라이드별 간단 메모"],
    revision: "오탈자, 문구 교체, 색상 일부 조정, 이미지 교체, 도식 일부 수정은 패키지별 수정 횟수 안에서 반영합니다. 원고 전체 재작성, 자료 조사, 대량 장수 추가, 전체 콘셉트 변경은 별도 협의합니다.",
    requestItems: ["기존 PPT 또는 원고", "발표 목적과 대상", "원하는 장수", "브랜드 로고와 컬러", "참고 스타일"],
    faqs: [
      ["원고만 있어도 가능한가요?", "가능합니다. 다만 기획과 구성 정리가 필요한 경우 PREMIUM 범위에 가깝습니다."],
      ["원본 파일을 받을 수 있나요?", "PPTX 원본과 PDF를 함께 전달합니다."],
      ["급한 발표 자료도 가능한가요?", "자료 준비 상태와 일정에 따라 빠른 작업 옵션으로 진행 가능 여부를 확인합니다."],
      ["이미지나 폰트 라이선스는 어떻게 하나요?", "상업 이용 가능한 범위의 소스를 기준으로 작업하고, 별도 유료 소스는 협의 후 반영합니다."],
    ],
    addons: [
      ["빠른 작업", "50,000원~", "당일/익일 일정 가능 시 적용"],
      ["슬라이드 추가", "5,000원~", "난이도와 원고 상태에 따라 협의"],
      ["원본파일 제공", "기본 포함", "PPTX와 PDF 납품"],
      ["상업적 이용 가능", "기본 포함", "사업 발표·제안 목적 사용 가능"],
      ["리서치", "50,000원~", "자료 조사와 내용 정리 추가 시"],
    ],
  },
  {
    id: "automation-app",
    name: "자동화·앱",
    title: "업무 자동화와 앱 MVP 제작",
    category: "IT·프로그래밍 > 프로그램·시스템",
    accent: "#3b82f6",
    keywords: ["업무자동화", "앱개발", "MVP", "대시보드", "데이터"],
    intro:
      "반복 업무, 데이터 정리, 운영 대시보드, MVP 화면을 실제 업무 흐름에 맞춰 제작합니다. 기능을 크게 벌리기보다 지금 필요한 입력, 처리, 출력 구조를 먼저 정의하고 검증 가능한 결과물 중심으로 구현합니다.",
    positioning: [
      "현재 업무 흐름을 먼저 분석해 자동화 가능한 부분을 분리합니다.",
      "입력 데이터, 처리 규칙, 결과물 형식을 문서화한 뒤 제작합니다.",
      "단순 스크립트부터 내부 도구, 대시보드, MVP 화면까지 단계별로 제안합니다.",
      "납품 후 사용 방법과 운영 시 주의사항을 안내합니다.",
    ],
    recommend: [
      "엑셀·CSV 반복 작업을 줄이고 싶은 사업자",
      "수집, 정리, 알림, 보고서 생성을 자동화하고 싶은 팀",
      "MVP나 내부 운영 화면이 필요한 초기 사업자",
      "외부 API나 DB 연동이 필요한 운영자",
    ],
    scope: ["요구사항 정리", "데이터 입력/출력 구조 설계", "자동화 스크립트 또는 화면 제작", "테스트 데이터 검증", "사용 가이드 전달"],
    packages: [
      ["STANDARD", "자동화 단순", "100,000원", "정상가 300,000원", "1일", "수정 1회", "단일 반복 작업 자동화"],
      ["DELUXE", "자동화 일반", "800,000원", "정상가 2,500,000원", "5일", "수정 2회", "복합 업무 흐름 자동화"],
      ["PREMIUM", "고급/앱 MVP", "1,500,000원", "정상가 5,000,000원", "5~7일", "수정 3회", "MVP 화면과 운영 구조"],
    ],
    process: ["현재 업무 흐름과 문제 확인", "입력 데이터, 처리 방식, 결과물 형식 정의", "기능 범위 확정", "개발 및 테스트", "결과물과 사용 가이드 전달"],
    deliverables: ["자동화 결과물 또는 MVP 화면", "사용 가이드", "테스트 결과", "필요한 경우 실행/배포 안내"],
    revision: "오류 수정, 출력 형식 일부 변경, 문구/표시 항목 수정은 패키지별 수정 횟수 안에서 반영합니다. 기능 추가, 외부 서비스 추가 연동, 데이터 구조 변경, 앱스토어 등록은 별도 협의합니다.",
    requestItems: ["자동화하고 싶은 업무 설명", "샘플 엑셀/CSV 또는 화면 자료", "원하는 결과물 형태", "반복 주기와 예외 상황", "참고 서비스 또는 화면"],
    faqs: [
      ["어떤 자동화가 가능한지 모르겠는데 상담 가능한가요?", "가능합니다. 현재 반복 업무를 설명해 주시면 자동화 가능 범위를 정리합니다."],
      ["완성 후 사용 방법도 알려주나요?", "기본 사용 가이드를 함께 전달합니다."],
      ["외부 서비스 연동도 가능한가요?", "API 제공 여부와 권한 범위를 확인한 뒤 가능 여부를 안내합니다."],
      ["소스코드 제공이 가능한가요?", "패키지 또는 추가 옵션으로 제공 범위를 협의합니다."],
    ],
    addons: [
      ["빠른 작업", "기본가의 30%~", "기능 범위 축소 또는 일정 가능 시"],
      ["기능 추가", "100,000원~", "기능 단위로 산정"],
      ["원본/소스 제공", "300,000원~", "저장소 전달 범위와 라이선스 협의"],
      ["상업적 이용 가능", "범위 협의", "서비스 운영·사내 사용 목적 확인"],
      ["운영 유지보수", "300,000원~", "월 단위 관리 또는 장애 대응"],
    ],
  },
  {
    id: "video-content",
    name: "영상 콘텐츠",
    title: "숏폼·브랜드 영상 제작",
    category: "영상·사진·음향 > 영상 편집",
    accent: "#eab308",
    keywords: ["영상편집", "숏폼", "릴스", "홍보영상", "브랜드영상"],
    intro:
      "브랜드 인트로, 서비스 홍보 영상, 쇼츠·릴스용 세로 영상을 목적에 맞게 제작합니다. 짧은 시간 안에 메시지, 장면 흐름, 자막, 행동 유도 문구가 보이도록 구성하고 플랫폼별 비율에 맞춰 납품합니다.",
    positioning: [
      "영상 목적과 플랫폼을 먼저 정해 불필요한 편집을 줄입니다.",
      "짧은 영상에서도 브랜드 메시지와 핵심 장면이 보이도록 구성합니다.",
      "자막, BGM, 전환 효과를 과하지 않게 적용합니다.",
      "업로드 목적에 맞춰 16:9 또는 9:16 비율로 내보냅니다.",
    ],
    recommend: [
      "짧은 브랜드 홍보 영상이 필요한 사업자",
      "인스타그램, 유튜브 쇼츠, 릴스용 영상이 필요한 브랜드",
      "서비스 소개를 영상으로 정리하고 싶은 팀",
      "기존 이미지와 화면 자료를 영상으로 바꾸고 싶은 분",
    ],
    scope: ["영상 구성안", "자막과 장면 흐름", "BGM과 기본 효과", "16:9 또는 9:16 영상 제작", "플랫폼용 출력 파일"],
    packages: [
      ["STANDARD", "30초 숏폼 1개", "100,000원", "정상가 150,000원", "1~3일", "수정 1회", "짧은 홍보 영상 1개"],
      ["DELUXE", "쇼츠 세트", "250,000원", "정상가 350,000원", "2~3일", "수정 2회", "숏폼 3개 또는 60초 영상"],
      ["PREMIUM", "브랜드 영상 세트", "600,000원", "정상가 900,000원", "3~7일", "수정 3회", "구성안 포함 브랜드 영상"],
    ],
    process: ["영상 목적과 플랫폼 확인", "사용할 이미지, 화면, 문구 정리", "구성안 작성", "영상 편집 및 자막 적용", "수정 반영 후 최종 파일 전달"],
    deliverables: ["MP4 영상 파일", "자막 적용본", "썸네일 이미지", "플랫폼별 비율 안내"],
    revision: "오탈자, 자막 교체, 이미지/클립 일부 교체, BGM 조정은 패키지별 수정 횟수 안에서 반영합니다. 촬영, 성우 녹음, 전체 스토리 변경, 추가 비율 제작은 별도 협의합니다.",
    requestItems: ["영상 목적", "사용할 사진·영상·로고", "넣을 문구", "참고 영상 2~3개", "원하는 플랫폼과 비율"],
    faqs: [
      ["촬영 없이 제작 가능한가요?", "보유 이미지, 화면 녹화, 로고, 텍스트 자료를 기반으로 제작할 수 있습니다."],
      ["쇼츠와 일반 영상 비율을 같이 받을 수 있나요?", "기본은 1개 비율입니다. 추가 비율은 옵션으로 협의합니다."],
      ["BGM과 자막도 포함되나요?", "기본 BGM과 자막 적용을 포함하며, 별도 유료 음원은 협의 후 반영합니다."],
      ["원본 프로젝트 파일 제공이 가능한가요?", "제작 방식과 사용 소스 라이선스에 따라 추가 옵션으로 협의합니다."],
    ],
    addons: [
      ["빠른 작업", "기본가의 30%~", "자료 준비 완료 시 일정 확인"],
      ["비율 추가", "20,000원~", "16:9, 9:16 등 추가 출력"],
      ["원본파일 제공", "100,000원~", "프로젝트 파일 제공 가능 범위 협의"],
      ["상업적 이용 가능", "기본 포함", "의뢰인 브랜드 홍보 목적 사용 가능"],
      ["추가 수정", "30,000원~", "패키지 수정 횟수 초과 시"],
    ],
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textWeight(value) {
  return Array.from(String(value)).reduce((sum, char) => {
    if (/\s/.test(char)) return sum + 0.45;
    if (/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u3000-\u9fff]/.test(char)) return sum + 1.62;
    if (/[A-Z0-9]/.test(char)) return sum + 0.92;
    return sum + 0.78;
  }, 0);
}

function splitLongToken(token, max) {
  const chunks = [];
  let current = "";
  for (const char of Array.from(String(token))) {
    const next = current + char;
    if (current && textWeight(next) > max) {
      chunks.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function wrapText(text, max = 28) {
  const chunks = [];
  let current = "";
  const tokens = String(text).split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    const pieces = textWeight(token) > max ? splitLongToken(token, max) : [token];
    for (const piece of pieces) {
      const next = current ? `${current} ${piece}` : piece;
      if (current && textWeight(next) > max) {
        chunks.push(current);
        current = piece;
      } else {
        current = next;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function tspan(lines, x, dy = 36) {
  return lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : dy}">${esc(line)}</tspan>`).join("");
}

function bulletList(items, x, y, width, color = "#e5e7eb") {
  let out = "";
  let cursor = y;
  for (const item of items) {
    const lines = wrapText(item, width);
    out += `<circle cx="${x}" cy="${cursor - 9}" r="7" fill="#ffffff" opacity="0.9"/>`;
    out += `<text x="${x + 28}" y="${cursor}" fill="${color}" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="27" font-weight="600">${tspan(lines, x + 28, 34)}</text>`;
    cursor += 42 + (lines.length - 1) * 34;
  }
  return out;
}

function header(service, pageTitle) {
  return `
    <rect width="1200" height="1800" fill="#0f172a"/>
    <rect x="0" y="0" width="1200" height="310" fill="${service.accent}"/>
    <text x="86" y="92" fill="#0f172a" font-family="Arial, sans-serif" font-size="26" font-weight="900" letter-spacing="4">AIO KMONG SERVICE PAGE</text>
    <text x="86" y="172" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="60" font-weight="900">${esc(service.name)}</text>
    <text x="86" y="244" fill="#f8fafc" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="34" font-weight="800">${esc(pageTitle)}</text>
    <text x="86" y="362" fill="${service.accent}" font-family="Arial, sans-serif" font-size="24" font-weight="900">AIO 에이전시</text>`;
}

function card(x, y, w, h, title, body, accent) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#111827" stroke="#334155"/>
    <text x="${x + 34}" y="${y + 56}" fill="${accent}" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="29" font-weight="900">${esc(title)}</text>
    <text x="${x + 34}" y="${y + 88}" fill="#e5e7eb" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="23" font-weight="600">${tspan(wrapText(body, Math.floor(w / 17)), x + 34, 29)}</text>`;
}

function overviewSvg(service) {
  return `
  <svg width="1200" height="1800" viewBox="0 0 1200 1800" xmlns="http://www.w3.org/2000/svg">
    ${header(service, "구매자가 바로 이해하는 전문 제작 구성")}
    <text x="86" y="430" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">왜 이 서비스가 필요한가요?</text>
    <text x="86" y="496" fill="#e2e8f0" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="29" font-weight="600">${tspan(wrapText(service.intro, 48), 86, 39)}</text>
    <text x="86" y="760" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">AIO가 다르게 보는 지점</text>
    ${bulletList(service.positioning, 96, 830, 39)}
    <text x="86" y="1185" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">이런 분께 추천합니다</text>
    ${bulletList(service.recommend, 96, 1255, 40)}
    <rect x="86" y="1585" width="1028" height="110" rx="28" fill="#020617" stroke="${service.accent}" stroke-opacity="0.8"/>
    <text x="116" y="1654" fill="#f8fafc" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="28" font-weight="800">기획부터 납품 기준까지 먼저 정리한 뒤 작업 범위를 확정합니다.</text>
  </svg>`;
}

function packageSvg(service) {
  const rows = service.packages
    .map((pkg, index) => {
      const y = 520 + index * 255;
      return `
      <rect x="86" y="${y}" width="1028" height="210" rx="26" fill="#111827" stroke="${pkg[0] === "DELUXE" ? service.accent : "#334155"}" stroke-width="${pkg[0] === "DELUXE" ? 3 : 1}"/>
      <text x="126" y="${y + 56}" fill="${service.accent}" font-family="Arial, sans-serif" font-size="24" font-weight="900">${pkg[0]}</text>
      <text x="126" y="${y + 104}" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="36" font-weight="900">${esc(pkg[1])}</text>
      <text x="126" y="${y + 154}" fill="#cbd5e1" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="26" font-weight="700">${esc(pkg[6])}</text>
      <text x="620" y="${y + 72}" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="900">${esc(pkg[2])}</text>
      <text x="620" y="${y + 116}" fill="#94a3b8" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="23" font-weight="700">${esc(pkg[3])}</text>
      <text x="620" y="${y + 162}" fill="#e5e7eb" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="26" font-weight="800">${esc(pkg[4])} · ${esc(pkg[5])}</text>`;
    })
    .join("");
  return `
  <svg width="1200" height="1800" viewBox="0 0 1200 1800" xmlns="http://www.w3.org/2000/svg">
    ${header(service, "패키지와 추가 옵션을 명확하게 비교")}
    <text x="86" y="430" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">2026년 5월 오픈 이벤트가</text>
    <text x="86" y="486" fill="#cbd5e1" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="28" font-weight="700">판매가는 이벤트가 기준으로 입력하고, 정상가는 패키지 설명에 함께 안내합니다.</text>
    ${rows}
    <text x="86" y="1345" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">추가 옵션 운영 기준</text>
    ${service.addons
      .map((addon, index) => {
        const x = index % 2 === 0 ? 86 : 620;
        const y = 1405 + Math.floor(index / 2) * 118;
        return card(x, y, 494, 104, `${addon[0]} · ${addon[1]}`, addon[2], service.accent);
      })
      .join("")}
  </svg>`;
}

function processSvg(service) {
  return `
  <svg width="1200" height="1800" viewBox="0 0 1200 1800" xmlns="http://www.w3.org/2000/svg">
    ${header(service, "작업 과정·납품물·FAQ까지 한 번에 안내")}
    <text x="86" y="430" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">작업 과정</text>
    ${service.process
      .map((item, index) => {
        const y = 500 + index * 92;
        return `
        <circle cx="112" cy="${y - 11}" r="22" fill="${service.accent}"/>
        <text x="104" y="${y - 2}" fill="#0f172a" font-family="Arial, sans-serif" font-size="20" font-weight="900">${index + 1}</text>
        <text x="160" y="${y}" fill="#e5e7eb" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="29" font-weight="700">${tspan(wrapText(item, 48), 160, 34)}</text>`;
      })
      .join("")}
    <text x="86" y="1010" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">납품물</text>
    ${bulletList(service.deliverables, 96, 1080, 38)}
    <text x="620" y="1010" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="42" font-weight="900">준비 자료</text>
    ${bulletList(service.requestItems, 630, 1080, 32)}
    <rect x="86" y="1390" width="1028" height="130" rx="26" fill="#111827" stroke="#334155"/>
    <text x="122" y="1444" fill="${service.accent}" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="29" font-weight="900">수정 범위</text>
    <text x="122" y="1490" fill="#e5e7eb" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="23" font-weight="600">${tspan(wrapText(service.revision, 62), 122, 29)}</text>
    <text x="86" y="1605" fill="#ffffff" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="38" font-weight="900">자주 묻는 질문</text>
    ${service.faqs
      .slice(0, 2)
      .map((faq, index) => {
        const y = 1660 + index * 70;
        return `<text x="86" y="${y}" fill="${service.accent}" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="24" font-weight="900">${tspan(wrapText(`Q. ${faq[0]}`, 66), 86, 29)}</text>
        <text x="86" y="${y + 34}" fill="#cbd5e1" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="22" font-weight="700">${tspan(wrapText(`A. ${faq[1]}`, 76), 86, 28)}</text>`;
      })
      .join("")}
  </svg>`;
}

function makeDescription(service) {
  return `안녕하세요. AIO에이전시입니다.

${service.intro}

[추천 대상]
${service.recommend.map((item) => `- ${item}`).join("\n")}

[제공 범위]
${service.scope.map((item) => `- ${item}`).join("\n")}

[패키지 안내]
${service.packages.map((pkg) => `- ${pkg[0]} ${pkg[1]}: 2026년 5월 이벤트가 ${pkg[2]} / ${pkg[3]} / ${pkg[4]} / ${pkg[5]} / ${pkg[6]}`).join("\n")}

[작업 과정]
${service.process.map((item, index) => `${index + 1}. ${item}`).join("\n")}

[납품물]
${service.deliverables.map((item) => `- ${item}`).join("\n")}

[수정 범위]
${service.revision}

[준비 자료]
${service.requestItems.map((item) => `- ${item}`).join("\n")}

[진행 전 안내]
작업 범위는 상담 단계에서 먼저 확인합니다. 최초 합의된 범위를 벗어나는 신규 페이지, 신규 기능, 전체 방향 변경, 추가 촬영, 대량 자료 정리는 별도 협의가 필요합니다.
`;
}

function markdownForService(service) {
  return `## ${service.name}

- 크몽 상품명: ${service.title}
- 권장 카테고리: ${service.category}
- 검색 키워드: ${service.keywords.join(", ")}
- 상세 이미지:
  - \`public/marketplace/kmong-upgrade/${service.id}-kmong-detail-01-overview.png\`
  - \`public/marketplace/kmong-upgrade/${service.id}-kmong-detail-02-packages.png\`
  - \`public/marketplace/kmong-upgrade/${service.id}-kmong-detail-03-process.png\`

### 서비스 설명

${makeDescription(service)}

### 추가 가격

| 옵션 | 권장 가격 | 설명 |
| --- | ---: | --- |
${service.addons.map((addon) => `| ${addon[0]} | ${addon[1]} | ${addon[2]} |`).join("\n")}

### FAQ

${service.faqs.map((faq) => `Q. ${faq[0]}\nA. ${faq[1]}`).join("\n\n")}

### 작업 전 요청사항

${service.requestItems.map((item) => `- ${item}`).join("\n")}
`;
}

const md = [
  "# 크몽 고도화 등록 원고",
  "",
  `작성일: 2026-04-30`,
  "",
  "## 공통 운영 원칙",
  "",
  ...commonRules.map((rule) => `- ${rule}`),
  "",
  "## 경쟁사 벤치마킹 반영",
  "",
  "- 상위 상품은 짧은 소개글보다 긴 상세 이미지와 명확한 패키지 비교를 사용합니다.",
  "- 원본파일 제공, 상업적 이용 가능, 빠른 작업, 추가 수정, 추가 시안 같은 옵션을 서비스 성격에 맞춰 분리합니다.",
  "- 구매 전 요청사항과 FAQ를 반드시 채워 문의 전환 부담을 낮춥니다.",
  "- 외부 URL 대신 크몽 내부 포트폴리오와 상품 상세 이미지로 신뢰를 보완합니다.",
  "",
  ...services.map(markdownForService),
].join("\n");

fs.writeFileSync(docPath, md, "utf8");
fs.writeFileSync(
  dataPath,
  JSON.stringify(
    services.map((service) => ({
      ...service,
      description: makeDescription(service),
      processText: service.process.map((item, index) => `${index + 1}. ${item}`).join("\n"),
      requestText: service.requestItems.map((item) => `- ${item}`).join("\n"),
      images: [
        path.join(outDir, `${service.id}-kmong-detail-01-overview.png`),
        path.join(outDir, `${service.id}-kmong-detail-02-packages.png`),
        path.join(outDir, `${service.id}-kmong-detail-03-process.png`),
      ],
    })),
    null,
    2,
  ),
  "utf8",
);

for (const service of services) {
  await sharp(Buffer.from(overviewSvg(service))).png().toFile(path.join(outDir, `${service.id}-kmong-detail-01-overview.png`));
  await sharp(Buffer.from(packageSvg(service))).png().toFile(path.join(outDir, `${service.id}-kmong-detail-02-packages.png`));
  await sharp(Buffer.from(processSvg(service))).png().toFile(path.join(outDir, `${service.id}-kmong-detail-03-process.png`));
}

console.log(`Generated ${services.length * 3} upgraded Kmong images in ${outDir}`);
console.log(`Wrote ${docPath}`);
console.log(`Wrote ${dataPath}`);
