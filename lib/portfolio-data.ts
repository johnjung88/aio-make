export type PortfolioType = "web" | "app" | "design" | "video" | "automation";
export type MediaPolicy = "external-link" | "rich-gallery";
export type Visibility = "public" | "private-result";
export type ProofType = "live-link" | "screenshots" | "video" | "kpi" | "architecture";
export type LocalizedString = { ko: string; en: string };
export type PortfolioGroup =
  | "website"
  | "shopping-mall"
  | "logo-business-card"
  | "detail-page"
  | "ppt-design"
  | "automation-app"
  | "video-content";

export type PortfolioSubtype =
  | "landing"
  | "homepage-basic"
  | "homepage-detail"
  | "shopping-mall"
  | "mvp-basic"
  | "mvp-standard"
  | "mvp-pro"
  | "logo"
  | "business-card"
  | "detail-page"
  | "ppt"
  | "card-news"
  | "infographic"
  | "marketing-video"
  | "shorts-set"
  | "tutorial"
  | "remotion-asset"
  | "motion-graphics"
  | "automation-simple"
  | "automation-standard"
  | "automation-advanced"
  | "data-crawling"
  | "chatbot";

export interface KpiCard {
  value: string;
  unit?: string;
  label: LocalizedString;
}

export interface BeforeAfter {
  before: string;
  after: string;
  beforeLabel: LocalizedString;
  afterLabel: LocalizedString;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  type: PortfolioType;
  subtype?: PortfolioSubtype;
  visibility: Visibility;
  proofType: ProofType;
  mediaPolicy: MediaPolicy;
  title: LocalizedString;
  summary: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  impact: LocalizedString;
  resultSummary?: LocalizedString;
  deliverables?: LocalizedString[];
  kpis?: KpiCard[];
  stack: string[];
  role: string[];
  duration: string;
  client: string;
  links: {
    live: string | null;
    github: string | null;
    case: string;
    storeIos?: string | null;
    storeAndroid?: string | null;
    video?: string | null;
    architecture?: string | null;
  };
  downloads?: {
    planning?: string;
    deck?: string;
  };
  marketplaceStatus?: "planned";
  responsivePreview?: {
    desktop: string;
    mobile: string;
  };
  cover: string;
  thumbnail?: string;
  gallery: string[];
  beforeAfter?: BeforeAfter;
  size: "sm" | "md" | "lg";
  featured: boolean;
  publishedAt: string;
}

export const portfolioTypeColors: Record<PortfolioType, string> = {
  web: "#7c3aed",
  app: "#f59e0b",
  design: "#f43f5e",
  video: "#06b6d4",
  automation: "#10b981",
};

export const portfolioTypes: {
  label: LocalizedString;
  value: PortfolioType | "all";
}[] = [
  { value: "all", label: { ko: "전체", en: "All" } },
  { value: "web", label: { ko: "웹", en: "Web" } },
  { value: "app", label: { ko: "앱", en: "App" } },
  { value: "design", label: { ko: "디자인", en: "Design" } },
  { value: "video", label: { ko: "영상", en: "Video" } },
  { value: "automation", label: { ko: "자동화", en: "Automation" } },
];

export const portfolioGroups: {
  label: LocalizedString;
  value: PortfolioGroup | "all";
  icon: string;
}[] = [
  { value: "all", label: { ko: "전체", en: "All" }, icon: "" },
  { value: "website", label: { ko: "웹사이트", en: "Website" }, icon: "🌐" },
  { value: "shopping-mall", label: { ko: "쇼핑몰", en: "Store" }, icon: "🛒" },
  { value: "logo-business-card", label: { ko: "로고 및 명함", en: "Logo & Business Card" }, icon: "🎨" },
  { value: "detail-page", label: { ko: "상세페이지", en: "Detail Page" }, icon: "📄" },
  { value: "ppt-design", label: { ko: "PPT 디자인", en: "PPT Design" }, icon: "📊" },
  { value: "automation-app", label: { ko: "자동화 및 앱", en: "Automation & App" }, icon: "⚙️" },
  { value: "video-content", label: { ko: "영상 콘텐츠", en: "Video Content" }, icon: "🎬" },
];

interface LogoConceptSpec {
  slug: string;
  brand: string;
  industry: LocalizedString;
  summary: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  impact: LocalizedString;
  resultSummary: LocalizedString;
  deliverables: LocalizedString[];
  stack: string[];
  role: string[];
  duration: string;
  size: "sm" | "md" | "lg";
}

const logoConceptSpecs: LogoConceptSpec[] = [
  {
    slug: "moru-coffee",
    brand: "MORU Coffee",
    industry: { ko: "F&B 카페", en: "F&B Cafe" },
    summary: {
      ko: "작은 로스터리 카페를 위한 조용하고 밀도 있는 워드마크·심볼 시스템.",
      en: "A quiet, dense wordmark and symbol system for a small specialty roastery.",
    },
    problem: {
      ko: "프랜차이즈형 카페와 달리 깊이 있는 원두 큐레이션을 한눈에 전달할 로고가 필요했습니다.",
      en: "The concept needed to signal curated coffee depth instead of looking like a generic cafe chain.",
    },
    solution: {
      ko: "원두의 둥근 실루엣과 잔의 수면이 하나의 절제된 원형 심볼로 보여 작은 간판과 컵 스탬프에서도 쉽게 읽힙니다.",
      en: "The bean silhouette and cup surface were reduced into one restrained circular mark that stays legible on signs and cup stamps.",
    },
    impact: {
      ko: "처음 보는 고객도 로스터리의 전문성과 편안한 카페 분위기를 동시에 느껴 방문 전 기대감을 갖게 됩니다.",
      en: "The concept balances roastery expertise with the warmth of a neighborhood cafe.",
    },
    resultSummary: {
      ko: "간판, 컵, 스탬프 같은 실제 접점에 얹었을 때 브랜드가 어떻게 보일지 의뢰 전부터 선명하게 가늠됩니다.",
      en: "The set includes a symbol, horizontal wordmark, one-color stamp, and cup sleeve application.",
    },
    deliverables: [
      { ko: "메인 로고 및 심볼", en: "Primary logo and symbol" },
      { ko: "컵·스탬프 적용 보드", en: "Cup and stamp application board" },
      { ko: "브랜드 브리프 및 컬러 방향", en: "Brand brief and color direction" },
    ],
    stack: ["Brand Brief", "Logo System", "Cafe Identity"],
    role: ["브랜드 기획", "로고 디자인", "적용 목업"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "salty-yuzu",
    brand: "Salty Yuzu",
    industry: { ko: "F&B 디저트", en: "F&B Dessert" },
    summary: {
      ko: "상큼한 유자와 소금 디저트의 대비를 강조한 밝은 식음료 로고.",
      en: "A bright food logo emphasizing the contrast of yuzu citrus and salted desserts.",
    },
    problem: {
      ko: "귀엽기만 한 디저트 로고를 넘어, 팝업 스토어와 패키지에서 즉시 기억되는 개성이 필요했습니다.",
      en: "The dessert concept needed more than cuteness: it needed fast recall across pop-ups and packaging.",
    },
    solution: {
      ko: "유자 단면, 소금 결정, 미소 곡선이 결합되어 산뜻하지만 지나치게 유아적이지 않은 심볼로 보입니다.",
      en: "A yuzu slice, salt crystal, and smile curve were combined into a fresh mark that avoids feeling childish.",
    },
    impact: {
      ko: "소형 패키지, 스티커, SNS 썸네일에서 색과 형태만으로도 브랜드를 기억시키는 방향입니다.",
      en: "The identity is designed to be recognizable by color and shape on packaging, stickers, and social thumbnails.",
    },
    resultSummary: {
      ko: "컬러 로고, 단색 로고, 테이크아웃 패키지 적용 컷까지 한 번에 보여주는 컨셉입니다.",
      en: "The concept shows the color logo, monochrome logo, and takeaway packaging application together.",
    },
    deliverables: [
      { ko: "유자 심볼 및 워드마크", en: "Yuzu symbol and wordmark" },
      { ko: "패키지 스티커 적용", en: "Packaging sticker application" },
      { ko: "밝은 F&B 컬러 팔레트", en: "Bright F&B color palette" },
    ],
    stack: ["Brand Brief", "Package-ready Logo", "F&B Color"],
    role: ["콘셉트", "로고 디자인", "패키지 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "danchae-table",
    brand: "Danchae Table",
    industry: { ko: "F&B 한식 다이닝", en: "F&B Korean Dining" },
    summary: {
      ko: "한식 다이닝의 정갈한 상차림을 현대적인 격자 심볼로 풀어낸 로고.",
      en: "A modern grid-based logo inspired by composed Korean dining tables.",
    },
    problem: {
      ko: "전통적인 한식 이미지는 살리되, 젊은 고객에게 무겁거나 오래되어 보이지 않는 균형이 필요했습니다.",
      en: "The brand needed Korean dining cues without feeling heavy or dated for younger guests.",
    },
    solution: {
      ko: "반상 그리드와 나뭇결 곡선을 조합해 정갈함, 손맛, 현대적 편집감을 함께 담았습니다.",
      en: "A table grid and wood-grain curve combine order, craft, and an editorial modern feel.",
    },
    impact: {
      ko: "방문자는 메뉴판, 간판, 예약 페이지 어디에서 보더라도 정갈한 한식 다이닝의 분위기를 일관되게 받아들입니다.",
      en: "The identity can extend calmly across menus, signage, and reservation pages.",
    },
    resultSummary: {
      ko: "오프라인 간판과 메뉴판에 바로 얹어도 어색하지 않은 비율과 형태가 먼저 검토됩니다.",
      en: "A square symbol and vertical logo variant improve usability for offline dining touchpoints.",
    },
    deliverables: [
      { ko: "한식 다이닝 심볼", en: "Korean dining symbol" },
      { ko: "메뉴·사인 적용 보드", en: "Menu and signage board" },
      { ko: "차분한 브랜드 톤 문장", en: "Calm brand tone notes" },
    ],
    stack: ["Brand Brief", "Dining Identity", "Signage System"],
    role: ["브랜드 방향", "심볼 디자인", "사인 적용"],
    duration: "2일",
    size: "lg",
  },
  {
    slug: "onda-hair",
    brand: "Onda Hair",
    industry: { ko: "뷰티 헤어살롱", en: "Beauty Hair Salon" },
    summary: {
      ko: "물결과 머릿결을 하나의 유려한 선으로 연결한 프리미엄 헤어살롱 로고.",
      en: "A premium hair salon logo connecting waves and hair texture through one fluid line.",
    },
    problem: {
      ko: "지역 살롱처럼 보이지 않으면서도 과하게 럭셔리하지 않은 세련된 첫인상이 필요했습니다.",
      en: "The salon needed a refined first impression without feeling either local-generic or overly luxurious.",
    },
    solution: {
      ko: "부드러운 웨이브 라인을 O 이니셜 안에 넣어 시술 결과의 자연스러움과 브랜드명을 동시에 기억시키도록 했습니다.",
      en: "A soft wave inside the O initial makes the name and natural styling outcome memorable together.",
    },
    impact: {
      ko: "예약 프로필, 윈도 사인, 케어 제품 라벨까지 넓게 쓰기 좋은 미니멀 뷰티 로고입니다.",
      en: "The minimal beauty mark works across booking profiles, window signage, and care product labels.",
    },
    resultSummary: {
      ko: "심볼 단독 사용과 워드마크 조합을 모두 준비해 SNS와 매장 적용을 동시에 고려했습니다.",
      en: "Both symbol-only and wordmark lockups were prepared for social and in-store use.",
    },
    deliverables: [
      { ko: "웨이브 심볼 및 워드마크", en: "Wave symbol and wordmark" },
      { ko: "살롱 사인 적용", en: "Salon signage application" },
      { ko: "뷰티 톤앤매너 가이드", en: "Beauty tone guide" },
    ],
    stack: ["Brand Brief", "Beauty Logo", "Salon Signage"],
    role: ["기획", "로고 디자인", "뷰티 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "vela-skin",
    brand: "Vela Skin",
    industry: { ko: "뷰티 스킨케어", en: "Beauty Skincare" },
    summary: {
      ko: "빛, 피부결, 과학적 신뢰를 얇은 V 심볼로 정리한 스킨케어 로고.",
      en: "A skincare logo distilling light, skin texture, and scientific trust into a slim V mark.",
    },
    problem: {
      ko: "클린뷰티의 부드러움과 피부과 수준의 신뢰감을 동시에 담는 시각 언어가 필요했습니다.",
      en: "The concept needed to combine clean beauty softness with clinic-level credibility.",
    },
    solution: {
      ko: "얇은 V 라인과 빛의 점, 넓은 여백이 고기능 제품군에 어울리는 정제된 인상을 만듭니다.",
      en: "A thin V line and light point use generous spacing to create a refined identity for functional skincare.",
    },
    impact: {
      ko: "용기 라벨, 상세페이지, 클리닉 협업 자료에 모두 대응 가능한 스킨케어 로고 방향입니다.",
      en: "The identity can support bottle labels, product pages, and clinic collaboration materials.",
    },
    resultSummary: {
      ko: "라벨, 패키지, 작은 인쇄물에서도 고급감이 유지되는지 의뢰 전에 바로 판단됩니다.",
      en: "Thin lines, low-saturation colors, and monochrome variants make the logo suitable for premium labels.",
    },
    deliverables: [
      { ko: "V 심볼 및 라벨형 워드마크", en: "V symbol and label-style wordmark" },
      { ko: "스킨케어 패키지 적용", en: "Skincare packaging application" },
      { ko: "프리미엄 컬러 시스템", en: "Premium color system" },
    ],
    stack: ["Brand Brief", "Skincare Identity", "Package Logo"],
    role: ["브랜드 방향", "로고 디자인", "라벨 적용"],
    duration: "2일",
    size: "lg",
  },
  {
    slug: "nudekind",
    brand: "Nudekind",
    industry: { ko: "뷰티 클린 코스메틱", en: "Beauty Clean Cosmetics" },
    summary: {
      ko: "민감 피부와 비건 무드를 담은 부드럽고 담백한 클린 코스메틱 로고.",
      en: "A soft, plainspoken clean cosmetics logo for sensitive-skin and vegan positioning.",
    },
    problem: {
      ko: "친환경 브랜드처럼 보이면서도 흔한 잎사귀 로고에 머물지 않는 차별점이 필요했습니다.",
      en: "The concept needed eco-friendly cues without relying on a generic leaf mark.",
    },
    solution: {
      ko: "소문자 n의 획을 피부 보호막처럼 감싸는 형태로 설계해 친절함과 순함을 시각화했습니다.",
      en: "The lowercase n is wrapped like a skin barrier, visualizing kindness and gentleness.",
    },
    impact: {
      ko: "패키지 전면, 성분 카드, SNS 썸네일에서 작은 크기로도 부드러운 인상이 유지됩니다.",
      en: "The gentle impression holds at small sizes across packaging, ingredient cards, and social thumbnails.",
    },
    resultSummary: {
      ko: "제품 라벨과 브랜드 보드에 적용했을 때 성분 중심 뷰티 브랜드의 차분한 인상이 유지됩니다.",
      en: "A soft wordmark, symbol, and package label board were created for clean cosmetics use.",
    },
    deliverables: [
      { ko: "소프트 심볼 및 워드마크", en: "Soft symbol and wordmark" },
      { ko: "성분 카드 적용", en: "Ingredient card application" },
      { ko: "클린뷰티 브리프", en: "Clean beauty brief" },
    ],
    stack: ["Brand Brief", "Clean Beauty", "Package System"],
    role: ["콘셉트", "로고 디자인", "브랜드 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "breath-pilates",
    brand: "Breath Pilates",
    industry: { ko: "웰니스 필라테스", en: "Wellness Pilates" },
    summary: {
      ko: "호흡과 자세 정렬을 잔잔한 선형 심볼로 표현한 필라테스 스튜디오 로고.",
      en: "A pilates studio logo expressing breath and body alignment through calm linear forms.",
    },
    problem: {
      ko: "운동 강도보다 몸의 균형과 회복을 강조하는 스튜디오 포지션이 필요했습니다.",
      en: "The studio needed a position centered on balance and recovery rather than workout intensity.",
    },
    solution: {
      ko: "들숨과 날숨의 리듬을 두 개의 곡선으로, 중심축을 얇은 수직선으로 보여 정렬감이 분명합니다.",
      en: "Two curves express inhale and exhale while a thin center line creates a sense of alignment.",
    },
    impact: {
      ko: "간판, 예약 앱 아이콘, 수업 카드에서 차분한 전문성을 전달하는 웰니스 로고입니다.",
      en: "The wellness logo communicates calm expertise on signage, booking app icons, and class cards.",
    },
    resultSummary: {
      ko: "간판, 예약 페이지, 프로필 이미지에 적용했을 때 프리미엄 스튜디오의 차분한 인상이 유지됩니다.",
      en: "A line-led symbol and spacious wordmark create a premium studio impression.",
    },
    deliverables: [
      { ko: "호흡 심볼 및 워드마크", en: "Breath symbol and wordmark" },
      { ko: "클래스 카드 적용", en: "Class card application" },
      { ko: "웰니스 톤 가이드", en: "Wellness tone guide" },
    ],
    stack: ["Brand Brief", "Wellness Identity", "Studio Logo"],
    role: ["브랜드 기획", "로고 디자인", "스튜디오 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "harufit",
    brand: "HaruFit",
    industry: { ko: "웰니스 피트니스", en: "Wellness Fitness" },
    summary: {
      ko: "하루 루틴과 운동 기록을 밝은 에너지로 묶은 피트니스 로고.",
      en: "A fitness logo connecting daily routine and workout tracking with bright energy.",
    },
    problem: {
      ko: "전문 헬스장보다 일상 루틴형 운동 서비스를 친근하게 보여줄 브랜드 장치가 필요했습니다.",
      en: "The fitness concept needed a friendly device for daily routines rather than a hardcore gym image.",
    },
    solution: {
      ko: "체크 표시, 상승 그래프, H 이니셜을 결합해 매일 쌓이는 작은 성취를 심볼화했습니다.",
      en: "A check mark, rising graph, and H initial combine into a symbol of small daily wins.",
    },
    impact: {
      ko: "앱 아이콘, 운동 챌린지 배너, 굿즈에 쓰기 좋은 활동적인 로고 방향입니다.",
      en: "The active logo direction works well for app icons, challenge banners, and merchandise.",
    },
    resultSummary: {
      ko: "루틴 체크 기반의 심볼과 굵은 워드마크로 디지털 서비스와 오프라인 굿즈를 함께 고려했습니다.",
      en: "A routine-check symbol and bold wordmark support both digital service and offline merchandise use.",
    },
    deliverables: [
      { ko: "루틴 심볼 및 워드마크", en: "Routine symbol and wordmark" },
      { ko: "앱 아이콘 적용", en: "App icon application" },
      { ko: "챌린지 배너 톤", en: "Challenge banner tone" },
    ],
    stack: ["Brand Brief", "Fitness Logo", "App-ready Symbol"],
    role: ["콘셉트", "로고 디자인", "디지털 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "mediroot",
    brand: "MediRoot",
    industry: { ko: "웰니스 클리닉", en: "Wellness Clinic" },
    summary: {
      ko: "의료 신뢰와 근본 회복의 이미지를 결합한 클리닉 브랜드 로고.",
      en: "A clinic logo combining medical trust with the idea of root-cause recovery.",
    },
    problem: {
      ko: "차가운 병원 이미지와 과한 자연주의 이미지 사이에서 신뢰와 편안함의 균형이 필요했습니다.",
      en: "The brand needed balance between cold medical imagery and overly natural wellness cues.",
    },
    solution: {
      ko: "십자 구조와 뿌리 형태를 하나의 안정적인 M 심볼 안에 담아 전문성과 회복감을 함께 표현했습니다.",
      en: "A cross structure and root form are held inside a stable M symbol to express expertise and recovery.",
    },
    impact: {
      ko: "처음 방문한 고객은 간판과 상담 카드만 봐도 차분하고 신뢰감 있는 클리닉이라는 인상을 받습니다.",
      en: "The trust-led logo can apply to clinic signage, care guides, and consultation cards.",
    },
    resultSummary: {
      ko: "의료 안내물, 상담 카드, 사인물에 적용해도 과하게 차갑지 않은 신뢰감이 유지됩니다.",
      en: "The set includes a stable blue-green palette and monochrome medical signage variants.",
    },
    deliverables: [
      { ko: "M 심볼 및 클리닉 워드마크", en: "M symbol and clinic wordmark" },
      { ko: "진료 카드 적용", en: "Care card application" },
      { ko: "의료 신뢰 컬러 시스템", en: "Medical trust color system" },
    ],
    stack: ["Brand Brief", "Clinic Identity", "Trust Mark"],
    role: ["브랜드 방향", "로고 디자인", "의료 적용"],
    duration: "2일",
    size: "lg",
  },
  {
    slug: "nova-node",
    brand: "Nova Node",
    industry: { ko: "테크 SaaS", en: "Tech SaaS" },
    summary: {
      ko: "새로운 연결과 데이터 확장을 별 형태 노드로 표현한 SaaS 로고.",
      en: "A SaaS logo expressing new connections and data expansion through a star-like node.",
    },
    problem: {
      ko: "추상적인 AI·데이터 서비스를 빠르게 이해시키면서도 흔한 회로 아이콘과 구분되어야 했습니다.",
      en: "The AI/data service needed quick clarity while avoiding generic circuit iconography.",
    },
    solution: {
      ko: "중앙 노드에서 네 방향으로 확장되는 빛의 구조를 만들고, 굵은 워드마크로 안정감을 보강했습니다.",
      en: "A central node expands in four light directions, grounded by a bold wordmark.",
    },
    impact: {
      ko: "서비스 화면, 투자자료, 앱 아이콘에 모두 쓰기 좋은 기술 브랜드 로고입니다.",
      en: "The tech identity works across dashboards, investor decks, and app icons.",
    },
    resultSummary: {
      ko: "심볼 단독 사용성이 좋아 작은 파비콘과 다크 화면에서도 선명하게 보입니다.",
      en: "Symbol-only use was prioritized so the mark stays clear in favicons and dark interfaces.",
    },
    deliverables: [
      { ko: "노드 심볼 및 워드마크", en: "Node symbol and wordmark" },
      { ko: "다크 UI 적용", en: "Dark UI application" },
      { ko: "SaaS 브랜드 브리프", en: "SaaS brand brief" },
    ],
    stack: ["Brand Brief", "SaaS Logo", "App Icon"],
    role: ["콘셉트", "로고 디자인", "UI 적용"],
    duration: "2일",
    size: "md",
  },
  {
    slug: "flowstack",
    brand: "Flowstack",
    industry: { ko: "테크 워크플로", en: "Tech Workflow" },
    summary: {
      ko: "업무 흐름과 모듈형 시스템을 계단식 스택 심볼로 표현한 테크 로고.",
      en: "A tech logo turning workflow and modular systems into a stepped stack symbol.",
    },
    problem: {
      ko: "자동화 솔루션의 복잡함을 줄이고, 정리된 업무 흐름이라는 핵심 가치를 보여줘야 했습니다.",
      en: "The automation concept needed to reduce perceived complexity and show organized workflow value.",
    },
    solution: {
      ko: "겹친 레이어와 화살표 흐름을 하나의 F 심볼로 압축해 모듈, 순서, 확장성을 표현했습니다.",
      en: "Layered blocks and arrow flow were compressed into one F symbol for modules, order, and scalability.",
    },
    impact: {
      ko: "B2B 제안서와 제품 화면에 어울리는 단단하고 실무적인 로고 방향입니다.",
      en: "The sturdy, practical logo direction fits B2B proposals and product dashboards.",
    },
    resultSummary: {
      ko: "기하학적 심볼과 고대비 컬러가 복잡한 자동화 서비스를 명료하게 보이도록 돕습니다.",
      en: "A geometric symbol and high-contrast palette make a complex automation service feel clear.",
    },
    deliverables: [
      { ko: "스택 심볼 및 워드마크", en: "Stack symbol and wordmark" },
      { ko: "제품 화면 헤더 적용", en: "Dashboard header application" },
      { ko: "B2B 톤앤매너", en: "B2B tone direction" },
    ],
    stack: ["Brand Brief", "Workflow Identity", "B2B SaaS"],
    role: ["브랜드 기획", "로고 디자인", "제품 적용"],
    duration: "2일",
    size: "lg",
  },
  {
    slug: "promptly-ai",
    brand: "Promptly AI",
    industry: { ko: "테크 AI 도구", en: "Tech AI Tool" },
    summary: {
      ko: "대화형 서비스가 빠르고 정돈되어 보이도록 말풍선과 커서 이미지를 결합한 AI 브랜드 로고.",
      en: "An AI tool logo combining conversational immediacy with an organized answer experience.",
    },
    problem: {
      ko: "AI 서비스가 많아진 시장에서 친근함과 생산성 이미지를 동시에 전달해야 했습니다.",
      en: "In a crowded AI market, the identity needed to communicate both approachability and productivity.",
    },
    solution: {
      ko: "말풍선 안에 커서와 반짝임을 넣어 프롬프트 입력, 답변 생성, 빠른 실행을 하나의 장면으로 압축했습니다.",
      en: "A cursor and spark inside a speech bubble compress prompting, generation, and quick action into one scene.",
    },
    impact: {
      ko: "사용자는 낯선 AI 도구도 가볍고 쉽게 느끼며, 첫 화면에서 부담 없이 사용을 시작합니다.",
      en: "The bright AI identity is ready for browser extensions, web apps, and landing pages.",
    },
    resultSummary: {
      ko: "앱 아이콘과 가로형 워드마크를 함께 설계해 제품 UI와 마케팅 화면을 모두 고려했습니다.",
      en: "An app icon and horizontal wordmark were designed together for both product UI and marketing screens.",
    },
    deliverables: [
      { ko: "AI 말풍선 심볼", en: "AI speech-bubble symbol" },
      { ko: "확장 프로그램 아이콘 적용", en: "Extension icon application" },
      { ko: "테크 브랜드 메시지", en: "Tech brand messaging" },
    ],
    stack: ["Brand Brief", "AI Logo", "Product Icon"],
    role: ["콘셉트", "로고 디자인", "앱 적용"],
    duration: "2일",
    size: "md",
  },
];

const logoConceptProjects: PortfolioProject[] = logoConceptSpecs.map((project) => ({
  id: project.slug,
  slug: project.slug,
  type: "design",
  subtype: "logo",
  visibility: "public",
  proofType: "screenshots",
  mediaPolicy: "rich-gallery",
  title: { ko: `${project.brand} 로고·명함 브랜드 키트`, en: `${project.brand} Logo & Business Card Kit` },
  summary: project.summary,
  problem: project.problem,
  solution: project.solution,
  impact: project.impact,
  resultSummary: project.resultSummary,
  deliverables: [
    ...project.deliverables,
    { ko: "명함·패키지·사인 적용 보드", en: "Business card, package, and signage application boards" },
    { ko: "AI/SVG/PNG/JPG 납품을 고려한 벡터 원본 구성", en: "Vector-ready source structure for AI/SVG/PNG/JPG delivery" },
  ],
  stack: [...project.stack, "Business Card", "Application Mockup"],
  role: project.role,
  duration: project.duration,
  client: `${project.industry.ko} 컨셉 브랜드`,
  links: { live: null, github: null, case: `/portfolio/${project.slug}` },
  cover: `/portfolio/logo-showcase/${project.slug}/premium-presentation.jpg`,
  thumbnail: `/portfolio/logo-showcase/${project.slug}/premium-presentation.jpg`,
  gallery: [
    `/portfolio/logo-showcase/${project.slug}/premium-presentation.jpg`,
    `/portfolio/logo-showcase/${project.slug}/premium-logo-detail.jpg`,
    `/portfolio/logo-showcase/${project.slug}/premium-business-card-detail.jpg`,
    `/portfolio/logo-showcase/${project.slug}/premium-packaging-detail.jpg`,
    `/portfolio/logo-showcase/${project.slug}/premium-application-detail.jpg`,
  ],
  size: project.size,
  featured: false,
  publishedAt: "2026-04-29",
}));

interface StorefrontConceptSpec {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  impact: LocalizedString;
  resultSummary: LocalizedString;
  deliverables: LocalizedString[];
  stack: string[];
  role: string[];
  duration: string;
  client: string;
  cover: string;
  gallery: string[];
  size: "sm" | "md" | "lg";
  featured?: boolean;
}

const cafe24StorefrontSpecs: StorefrontConceptSpec[] = [
  {
    id: "cafe24-farm-fresh",
    title: { ko: "산지직송 식품몰 메인 디자인", en: "Farm Fresh Storefront Design" },
    summary: {
      ko: "신선식품의 산지 신뢰와 오늘 출고 메시지를 전면에 둔 카페24 쇼핑몰 시안.",
      en: "A Cafe24 storefront concept centered on farm trust and same-day fresh delivery.",
    },
    problem: {
      ko: "식품몰은 상품 수가 많아 첫 화면에서 신뢰, 배송, 카테고리 탐색이 동시에 보여야 했습니다.",
      en: "Food stores need trust, delivery promise, and category browsing to be visible immediately.",
    },
    solution: {
      ko: "상단 신뢰 배지, 산지형 히어로, 빠른 카테고리 칩을 묶어 구매 전환에 필요한 정보를 먼저 배치했습니다.",
      en: "Trust badges, a farm-led hero, and category chips place conversion-critical information first.",
    },
    impact: {
      ko: "방문자는 산지 신뢰, 배송 혜택, 카테고리를 빠르게 이해하고 신선식품 구매를 더 쉽게 결정합니다.",
      en: "Visitors can quickly understand origin trust, delivery benefits, and categories, making fresh-food purchases easier to decide.",
    },
    resultSummary: {
      ko: "방문자는 메인 화면에서 산지 신뢰, 혜택, 카테고리, 인증 정보를 바로 읽고 구매 기준을 세웁니다.",
      en: "The layout combines a main visual, benefit strip, category browsing, and certification badges.",
    },
    deliverables: [
      { ko: "카페24 메인 화면 시안", en: "Cafe24 main screen concept" },
      { ko: "식품몰 신뢰 배지 구조", en: "Food commerce trust badge structure" },
      { ko: "배너·카테고리 교체 가이드", en: "Banner and category replacement guide" },
    ],
    stack: ["Cafe24 Smart Design", "Food Commerce", "Trust UI", "HTML/CSS"],
    role: ["시장 리서치", "디자인", "카페24 시안"],
    duration: "1종 완료",
    client: "식품몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d01-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d01-wide.png", "/portfolio/cafe24-design-pack/d01-guide.svg"],
    size: "lg",
    featured: true,
  },
  {
    id: "cafe24-beauty-minimal",
    title: { ko: "클린뷰티 쇼핑몰 메인 디자인", en: "Clean Beauty Storefront Design" },
    summary: {
      ko: "저자극·성분 중심 뷰티 브랜드를 위한 여백형 카페24 메인 시안.",
      en: "A spacious Cafe24 homepage concept for ingredient-led clean beauty brands.",
    },
    problem: {
      ko: "뷰티몰은 제품 효능과 브랜드 무드가 함께 보여야 하지만, 과한 이미지 사용은 신뢰를 떨어뜨릴 수 있었습니다.",
      en: "Beauty stores need efficacy and mood together, but excessive imagery can weaken trust.",
    },
    solution: {
      ko: "큰 여백, 성분 키워드, 제품 라벨형 카드로 방문자가 제품 효능과 브랜드 무드를 차분하게 비교하도록 구성했습니다.",
      en: "Generous spacing, ingredient keywords, and label-like product cards balance credibility and softness.",
    },
    impact: {
      ko: "방문자는 성분과 제품 라인업을 차분하게 비교하며 브랜드 신뢰와 구매 확신을 함께 얻습니다.",
      en: "Visitors can calmly compare ingredients and product lines while building trust and purchase confidence.",
    },
    resultSummary: {
      ko: "방문자는 제품 라인업과 성분 메시지를 먼저 읽고, 자신에게 맞는 제품군으로 자연스럽게 이동합니다.",
      en: "The hero and product grid prioritize product lineups and ingredient messaging.",
    },
    deliverables: [
      { ko: "클린뷰티 메인 시안", en: "Clean beauty main concept" },
      { ko: "제품 카드 UI", en: "Product card UI" },
      { ko: "성분 메시지 배치 가이드", en: "Ingredient message placement guide" },
    ],
    stack: ["Cafe24 Smart Design", "Beauty UX", "Product Grid", "HTML/CSS"],
    role: ["기획", "디자인", "상품 UI"],
    duration: "1종 완료",
    client: "뷰티몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d02-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d02-wide.png", "/portfolio/cafe24-design-pack/d02-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-mealkit",
    title: { ko: "밀키트 쇼핑몰 메인 디자인", en: "Meal Kit Storefront Design" },
    summary: {
      ko: "조리 편의성과 맛의 기대감을 빠르게 전달하는 밀키트 쇼핑몰 시안.",
      en: "A meal-kit storefront concept that quickly communicates convenience and appetite appeal.",
    },
    problem: {
      ko: "밀키트 구매자는 맛, 조리 시간, 구성품을 짧은 시간 안에 비교하려고 합니다.",
      en: "Meal-kit buyers compare taste, prep time, and components in a very short window.",
    },
    solution: {
      ko: "조리 시간 배지, 인기 메뉴 카드, 후기형 추천 영역을 상단에 배치해 선택 피로를 줄였습니다.",
      en: "Prep-time badges, popular menu cards, and review-led recommendations reduce choice fatigue.",
    },
    impact: {
      ko: "조리 시간, 인기 메뉴, 후기 흐름이 먼저 보여 방문자는 메뉴 선택을 빠르게 끝내고 구매로 이동합니다.",
      en: "Prep time, popular menus, and review cues appear first so visitors can choose quickly and move toward purchase.",
    },
    resultSummary: {
      ko: "메뉴 선택 기준이 카드로 보여 첫 화면에서 구매 판단을 돕습니다.",
      en: "Menu decision factors are carded so the first screen supports purchase decisions.",
    },
    deliverables: [
      { ko: "밀키트 메인 시안", en: "Meal kit main concept" },
      { ko: "조리 시간·후기 카드", en: "Prep time and review cards" },
      { ko: "메뉴 그리드 가이드", en: "Menu grid guide" },
    ],
    stack: ["Cafe24 Smart Design", "F&B UX", "Conversion Layout", "HTML/CSS"],
    role: ["기획", "디자인", "커머스 UX"],
    duration: "1종 완료",
    client: "밀키트몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d03-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d03-wide.png", "/portfolio/cafe24-design-pack/d03-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-live-commerce",
    title: { ko: "라이브커머스 쇼핑몰 메인 디자인", en: "Live Commerce Storefront Design" },
    summary: {
      ko: "라이브 예고, 한정 혜택, 빠른 구매 CTA를 강조한 카페24 쇼핑몰 시안.",
      en: "A Cafe24 concept emphasizing live schedules, limited offers, and fast purchase CTAs.",
    },
    problem: {
      ko: "라이브커머스형 쇼핑몰은 방송 전환과 일반 상품 탐색을 한 화면에서 함께 처리해야 했습니다.",
      en: "Live-commerce stores must handle broadcast conversion and normal product browsing together.",
    },
    solution: {
      ko: "방송 카드, 남은 시간, 라이브 특가 영역이 분리되어 지금 봐야 할 이유가 분명하게 보입니다.",
      en: "Broadcast cards, countdowns, and live deal zones create a clear reason to act now.",
    },
    impact: {
      ko: "방송 시간과 한정 혜택이 명확해 방문자는 지금 봐야 할 이유를 느끼고 라이브 구매로 진입합니다.",
      en: "Clear broadcast timing and limited offers help visitors feel urgency and enter the live purchase flow.",
    },
    resultSummary: {
      ko: "방문자는 방송 시간, 특가 이유, 구매 버튼을 한 흐름으로 보고 라이브 상품을 빠르게 선택합니다.",
      en: "A broadcast-led hero and product CTA make the live deal flow easy to understand.",
    },
    deliverables: [
      { ko: "라이브커머스 메인 시안", en: "Live commerce main concept" },
      { ko: "방송 예고·카운트다운 UI", en: "Live schedule and countdown UI" },
      { ko: "특가 CTA 구조", en: "Deal CTA structure" },
    ],
    stack: ["Cafe24 Smart Design", "Live Commerce", "Promotion UI", "HTML/CSS"],
    role: ["시장 리서치", "디자인", "프로모션 UI"],
    duration: "1종 완료",
    client: "라이브커머스 컨셉",
    cover: "/portfolio/cafe24-design-pack/d04-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d04-wide.png", "/portfolio/cafe24-design-pack/d04-guide.svg"],
    size: "lg",
  },
  {
    id: "cafe24-pet-care",
    title: { ko: "반려동물 용품몰 메인 디자인", en: "Pet Care Storefront Design" },
    summary: {
      ko: "반려동물 용품의 귀여움과 성분·안전 신뢰를 함께 담은 쇼핑몰 시안.",
      en: "A pet-care storefront balancing warmth with ingredient and safety trust.",
    },
    problem: {
      ko: "반려동물몰은 감성 이미지가 중요하지만 사료·간식·케어 제품은 안전 정보도 함께 보여야 합니다.",
      en: "Pet stores need emotional appeal, but food, treats, and care products also require safety cues.",
    },
    solution: {
      ko: "귀여운 톤의 히어로와 안전 배지, 나이·종별 카테고리를 결합해 탐색 동선을 단순화했습니다.",
      en: "A warm hero, safety badges, and age/breed categories simplify browsing.",
    },
    impact: {
      ko: "보호자는 감성 이미지와 안전 정보를 함께 보고 반려동물 제품을 더 안심하고 고릅니다.",
      en: "Pet owners can review emotional appeal and safety cues together, helping them choose products with confidence.",
    },
    resultSummary: {
      ko: "감성 배너와 기능형 카테고리를 동시에 보여줘 브랜드 호감과 구매 편의를 함께 잡았습니다.",
      en: "Emotional banners and functional categories support both affinity and purchase ease.",
    },
    deliverables: [
      { ko: "반려동물몰 메인 시안", en: "Pet store main concept" },
      { ko: "안전 배지·카테고리 UI", en: "Safety badge and category UI" },
      { ko: "상품 추천 영역", en: "Product recommendation section" },
    ],
    stack: ["Cafe24 Smart Design", "Pet Commerce", "Category UX", "HTML/CSS"],
    role: ["기획", "디자인", "카테고리 설계"],
    duration: "1종 완료",
    client: "반려동물몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d05-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d05-wide.png", "/portfolio/cafe24-design-pack/d05-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-digital-goods",
    title: { ko: "미니멀 라이프스타일몰 메인 디자인", en: "Minimal Lifestyle Storefront Design" },
    summary: {
      ko: "덜어낸 화면 구성과 큰 배너로 브랜드 취향을 차분하게 보여주는 미니멀 쇼핑몰 시안.",
      en: "A minimal storefront that presents brand taste with restrained layout and a strong hero.",
    },
    problem: {
      ko: "미니멀 브랜드는 과하게 꾸미면 오히려 제품 감도가 흐려져 첫 화면의 여백과 메시지가 중요했습니다.",
      en: "Minimal brands need careful spacing and message hierarchy so the product mood does not get diluted.",
    },
    solution: {
      ko: "큰 히어로 이미지, 정돈된 카테고리, 저널형 정보 흐름으로 브랜드 톤이 먼저 전달됩니다.",
      en: "A large hero, clean categories, and journal-like flow make the brand tone immediately clear.",
    },
    impact: {
      ko: "방문자는 상품을 보기 전 브랜드의 분위기와 취향을 먼저 이해하고 더 자연스럽게 탐색을 시작합니다.",
      en: "Visitors understand the brand mood before browsing products, making exploration feel more natural.",
    },
    resultSummary: {
      ko: "과한 장식 없이 브랜드의 첫인상과 상품 탐색을 연결한 미니멀형 레이아웃입니다.",
      en: "A minimal layout that connects first impression and product discovery without excess decoration.",
    },
    deliverables: [
      { ko: "미니멀 라이프스타일몰 메인 시안", en: "Minimal lifestyle main concept" },
      { ko: "브랜드 히어로 영역", en: "Brand hero section" },
      { ko: "저널형 탐색 구조", en: "Journal-style browsing flow" },
    ],
    stack: ["Cafe24 Smart Design", "Minimal UX", "Lifestyle Commerce", "HTML/CSS"],
    role: ["기획", "디자인", "상품 구조"],
    duration: "1종 완료",
    client: "미니멀 라이프스타일몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d06-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d06-wide.png", "/portfolio/cafe24-design-pack/d06-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-health-supplement",
    title: { ko: "건강기능식품몰 메인 디자인", en: "Supplement Storefront Design" },
    summary: {
      ko: "성분 신뢰, 연령별 고민, 정기구독 흐름을 담은 건강식품 쇼핑몰 시안.",
      en: "A supplement storefront built around ingredient trust, age needs, and subscriptions.",
    },
    problem: {
      ko: "건강식품몰은 효능 과장 없이 성분, 인증, 섭취 루틴을 설득력 있게 전달해야 했습니다.",
      en: "Supplement stores must communicate ingredients, certifications, and routines without overclaiming.",
    },
    solution: {
      ko: "고민별 카테고리, 성분 카드, 정기구독 CTA를 분리해 정보 탐색과 구매 전환을 안정적으로 연결했습니다.",
      en: "Need-state categories, ingredient cards, and subscription CTAs connect browsing to conversion.",
    },
    impact: {
      ko: "방문자는 성분, 인증, 섭취 루틴을 기준으로 건강식품을 더 안심하고 비교합니다.",
      en: "Ingredients, certifications, and routines are clear, helping visitors trust and compare supplement products.",
    },
    resultSummary: {
      ko: "인증 정보와 루틴 제안을 명확히 보여주는 신뢰 중심 쇼핑몰 화면입니다.",
      en: "A trust-led storefront that clarifies certifications and routine suggestions.",
    },
    deliverables: [
      { ko: "건강식품몰 메인 시안", en: "Supplement main concept" },
      { ko: "성분·인증 카드 UI", en: "Ingredient and certification cards" },
      { ko: "정기구독 CTA 구조", en: "Subscription CTA structure" },
    ],
    stack: ["Cafe24 Smart Design", "Health Commerce", "Trust UI", "HTML/CSS"],
    role: ["기획", "디자인", "신뢰 UI"],
    duration: "1종 완료",
    client: "건강식품몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d07-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d07-wide.png", "/portfolio/cafe24-design-pack/d07-guide.svg"],
    size: "lg",
  },
  {
    id: "cafe24-stationery",
    title: { ko: "볼드 모던 브랜드몰 메인 디자인", en: "Bold Modern Brand Storefront Design" },
    summary: {
      ko: "강한 대비와 굵은 타이포로 1인 브랜드의 존재감을 크게 보여주는 쇼핑몰 시안.",
      en: "A bold storefront that uses strong contrast and typography to make a solo brand memorable.",
    },
    problem: {
      ko: "소품몰은 상품 단가가 낮아 브랜드 감도와 묶음 구매 제안이 첫 화면에서 중요했습니다.",
      en: "Small-goods stores need brand taste and bundle suggestions because item prices are low.",
    },
    solution: {
      ko: "룩북형 배너, 컬렉션 카드, 묶음 제안 영역을 배치해 탐색 자체가 구매 욕구를 만들도록 했습니다.",
      en: "Lookbook banners, collection cards, and bundle sections make browsing create purchase intent.",
    },
    impact: {
      ko: "컬렉션 무드와 묶음 제안이 먼저 보여 방문자가 브랜드 취향을 느끼고 여러 상품을 함께 탐색하게 됩니다.",
      en: "Collection mood and bundle suggestions appear first, encouraging visitors to feel the brand taste and browse multiple products.",
    },
    resultSummary: {
      ko: "상품보다 컬렉션 무드를 먼저 보여줘 브랜드 취향을 빠르게 전달합니다.",
      en: "Collection mood comes before individual products to communicate taste quickly.",
    },
    deliverables: [
      { ko: "문구몰 메인 시안", en: "Stationery store main concept" },
      { ko: "룩북형 컬렉션 카드", en: "Lookbook collection cards" },
      { ko: "묶음 구매 영역", en: "Bundle purchase section" },
    ],
    stack: ["Cafe24 Smart Design", "Lifestyle UX", "Editorial Layout", "HTML/CSS"],
    role: ["브랜드 방향", "디자인", "컬렉션 UI"],
    duration: "1종 완료",
    client: "라이프스타일몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d08-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d08-wide.png", "/portfolio/cafe24-design-pack/d08-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-fashion-basic",
    title: { ko: "트렌디 팝 라이브커머스몰 메인 디자인", en: "Trendy Pop Live Commerce Design" },
    summary: {
      ko: "강한 컬러와 혜택 배너로 라이브 특가와 즉시 구매 흐름을 강조한 쇼핑몰 시안.",
      en: "A vivid live commerce storefront that emphasizes deals and fast purchase movement.",
    },
    problem: {
      ko: "패션몰은 이미지가 많아질수록 구매 기준이 흐려져 핏과 컬러 탐색을 명확히 해야 했습니다.",
      en: "Fashion stores can blur decision criteria when imagery gets heavy, so fit and color browsing must be clear.",
    },
    solution: {
      ko: "시즌 히어로, 핏별 카테고리, 컬러 스와치를 상단에 배치해 첫 클릭을 빠르게 유도했습니다.",
      en: "A seasonal hero, fit categories, and color swatches drive fast first clicks.",
    },
    impact: {
      ko: "핏, 컬러, 시즌 정보가 빠르게 비교되어 방문자는 원하는 상품군으로 바로 이동합니다.",
      en: "Fit, color, and season cues are easy to compare, helping visitors move directly to the products they want.",
    },
    resultSummary: {
      ko: "방문자는 상품 상세로 들어가기 전 핏, 컬러, 시즌 기준을 먼저 잡고 원하는 상품군으로 이동합니다.",
      en: "Fit, color, and season cues are compressed on the main page before product detail entry.",
    },
    deliverables: [
      { ko: "패션몰 메인 시안", en: "Fashion store main concept" },
      { ko: "핏별 카테고리 UI", en: "Fit category UI" },
      { ko: "컬러 스와치 구조", en: "Color swatch structure" },
    ],
    stack: ["Cafe24 Smart Design", "Fashion UX", "Product Discovery", "HTML/CSS"],
    role: ["시장 리서치", "디자인", "탐색 UI"],
    duration: "1종 완료",
    client: "패션몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d09-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d09-wide.png", "/portfolio/cafe24-design-pack/d09-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-one-person-brand",
    title: { ko: "스튜디오 브라이트 라이브커머스몰 메인 디자인", en: "Studio Bright Live Commerce Design" },
    summary: {
      ko: "스튜디오 조명처럼 밝은 컬러와 방송형 CTA로 라이브 판매 흐름을 보여주는 시안.",
      en: "A bright studio-style live commerce concept with broadcast-oriented CTAs.",
    },
    problem: {
      ko: "1인 브랜드는 상품 수가 적어 빈약해 보이지 않도록 브랜드 스토리와 구매 이유를 함께 보여야 했습니다.",
      en: "Solo brands often have few products, so story and purchase reasons must prevent the store from feeling thin.",
    },
    solution: {
      ko: "브랜드 스토리 히어로, 대표 상품, 제작자 메시지, 후기 영역을 한 흐름으로 연결했습니다.",
      en: "Brand story, hero product, maker message, and reviews are connected into one flow.",
    },
    impact: {
      ko: "상품 수가 적어도 브랜드의 이유와 신뢰 요소가 함께 보여 방문자가 작은 브랜드를 더 쉽게 이해합니다.",
      en: "Even with a small catalog, visitors can understand the brand reason and trust cues more easily.",
    },
    resultSummary: {
      ko: "상품 수가 적어도 브랜드의 이유와 신뢰가 보이도록 첫 화면의 정보 밀도를 조절했습니다.",
      en: "The first screen balances information density so story and trust show even with a small catalog.",
    },
    deliverables: [
      { ko: "1인 브랜드 메인 시안", en: "Solo brand main concept" },
      { ko: "브랜드 스토리 영역", en: "Brand story section" },
      { ko: "대표 상품·후기 구조", en: "Hero product and review structure" },
    ],
    stack: ["Cafe24 Smart Design", "Founder Brand", "Story Commerce", "HTML/CSS"],
    role: ["기획", "디자인", "브랜드 구성"],
    duration: "1종 완료",
    client: "1인 브랜드 컨셉",
    cover: "/portfolio/cafe24-design-pack/d10-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d10-wide.png", "/portfolio/cafe24-design-pack/d10-guide.svg"],
    size: "lg",
  },
  {
    id: "cafe24-kids-goods",
    title: { ko: "프리미엄 펫 메종 쇼핑몰 메인 디자인", en: "Premium Pet Maison Storefront Design" },
    summary: {
      ko: "고급스러운 다크 톤으로 펫 브랜드의 재료 신뢰와 선물 가치를 보여주는 쇼핑몰 시안.",
      en: "A premium pet storefront using a dark editorial tone to show ingredient trust and gifting value.",
    },
    problem: {
      ko: "키즈용품은 귀여운 무드뿐 아니라 연령, 소재, 안전 인증 정보가 빠르게 보여야 했습니다.",
      en: "Kids goods need cute mood plus age, material, and safety information at a glance.",
    },
    solution: {
      ko: "연령별 카테고리, 소재 배지, 선물 추천 카드를 상단에 배치해 부모의 탐색 시간을 줄였습니다.",
      en: "Age categories, material badges, and gift recommendation cards reduce browsing time for parents.",
    },
    impact: {
      ko: "부모 고객은 연령, 소재, 안전 정보를 먼저 보고 구매 기준을 빠르게 세웁니다.",
      en: "Parents can check age, material, and safety information first, helping them form purchase criteria quickly.",
    },
    resultSummary: {
      ko: "감성보다 구매 기준을 먼저 보여주는 부모 타깃형 레이아웃입니다.",
      en: "A parent-targeted layout that puts purchase criteria before mood alone.",
    },
    deliverables: [
      { ko: "키즈용품몰 메인 시안", en: "Kids goods main concept" },
      { ko: "연령별 탐색 UI", en: "Age-based browsing UI" },
      { ko: "안전 정보 카드", en: "Safety information cards" },
    ],
    stack: ["Cafe24 Smart Design", "Kids Commerce", "Safety UI", "HTML/CSS"],
    role: ["기획", "디자인", "카테고리 설계"],
    duration: "1종 완료",
    client: "키즈용품몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d11-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d11-wide.png", "/portfolio/cafe24-design-pack/d11-guide.svg"],
    size: "md",
  },
  {
    id: "cafe24-premium-tea",
    title: { ko: "액티브 아웃도어 펫몰 메인 디자인", en: "Active Outdoor Pet Storefront Design" },
    summary: {
      ko: "산책, 하네스, GPS 트래커 등 야외 활동형 펫 제품을 힘 있게 보여주는 쇼핑몰 시안.",
      en: "An active outdoor pet storefront for harnesses, trackers, and walking gear.",
    },
    problem: {
      ko: "아웃도어 펫 제품은 튼튼함, 안전성, 활동 장면이 첫 화면에서 바로 전달되어야 했습니다.",
      en: "Outdoor pet gear needs durability, safety, and use scenes to be clear immediately.",
    },
    solution: {
      ko: "강한 히어로 이미지, 산책 인증 메시지, 카테고리별 장비 탐색을 전면에 배치했습니다.",
      en: "A strong hero, walking-proof messaging, and gear categories are placed up front.",
    },
    impact: {
      ko: "방문자는 제품의 사용 장면과 안전 포인트를 빠르게 이해하고 야외 활동용 펫 제품을 더 쉽게 고릅니다.",
      en: "Visitors can quickly understand use cases and safety points, making outdoor pet products easier to compare.",
    },
    resultSummary: {
      ko: "활동 장면, 혜택, 장비 카테고리가 한 번에 보이는 아웃도어 펫몰 레이아웃입니다.",
      en: "An outdoor pet layout where activity scenes, benefits, and gear categories are visible at once.",
    },
    deliverables: [
      { ko: "아웃도어 펫몰 메인 시안", en: "Outdoor pet main concept" },
      { ko: "장비 카테고리 UI", en: "Gear category UI" },
      { ko: "산책 혜택 CTA", en: "Walking benefit CTA" },
    ],
    stack: ["Cafe24 Smart Design", "Pet Commerce", "Outdoor UX", "HTML/CSS"],
    role: ["브랜드 방향", "디자인", "커머스 구성"],
    duration: "1종 완료",
    client: "아웃도어 펫몰 컨셉",
    cover: "/portfolio/cafe24-design-pack/d12-wide.png",
    gallery: ["/portfolio/cafe24-design-pack/d12-wide.png", "/portfolio/cafe24-design-pack/d12-guide.svg"],
    size: "md",
  },
];

const cafe24StorefrontProjects: PortfolioProject[] = cafe24StorefrontSpecs.map((project) => ({
  id: project.id,
  slug: project.id,
  type: "design",
  subtype: "shopping-mall",
  visibility: "private-result",
  proofType: "screenshots",
  mediaPolicy: "rich-gallery",
  title: project.title,
  summary: project.summary,
  problem: project.problem,
  solution: project.solution,
  impact: project.impact,
  resultSummary: project.resultSummary,
  deliverables: project.deliverables,
  stack: project.stack,
  role: project.role,
  duration: project.duration,
  client: project.client,
  links: { live: null, github: null, case: `/portfolio/${project.id}` },
  marketplaceStatus: "planned",
  responsivePreview: {
    desktop: project.cover,
    mobile: project.cover.replace("-wide.png", "-mobile-photo.png"),
  },
  cover: project.cover,
  gallery: [project.cover, project.cover.replace("-wide.png", "-mobile-photo.png"), ...project.gallery.slice(1)],
  size: project.size,
  featured: project.featured ?? false,
  publishedAt: "2026-04-28",
}));

const pptPortfolioProjects: PortfolioProject[] = [
  {
    id: "ppt-government-grant",
    slug: "ppt-government-grant",
    type: "design",
    subtype: "ppt",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "예비창업패키지 발표 PPT", en: "Pre-Startup Grant Presentation Deck" },
    summary: {
      ko: "예비창업패키지 심사자가 사업성, 실행 계획, 팀 역량을 빠르게 이해하도록 정리한 발표용 PPT입니다.",
      en: "A pre-startup grant deck that helps reviewers quickly understand business viability, execution plan, and team readiness.",
    },
    problem: {
      ko: "지원사업 발표자료는 예쁜 화면보다 평가 항목, 정량 근거, 추진 일정, 예산 계획이 명확해야 심사자가 사업성을 빠르게 이해합니다.",
      en: "Grant decks must help reviewers quickly judge fit, evidence, timeline, budget, and execution readiness.",
    },
    solution: {
      ko: "사업별 평가표에 맞춘 목차, 핵심 메시지, 데이터 근거를 한 장씩 읽히게 정리해 발표 시간 안에 판단 근거가 남도록 구성합니다.",
      en: "We rebuilt the flow around each program's scoring criteria so every slide has one clear message and evidence point.",
    },
    impact: {
      ko: "발표자는 제한된 시간 안에 사업성, 실행 가능성, 팀 신뢰도를 또렷하게 전달하고, 심사자는 평가에 필요한 근거를 빠르게 찾습니다.",
      en: "The presenter can explain viability, execution, and team trust within a short pitch while reviewers can find the proof they need.",
    },
    resultSummary: {
      ko: "평가 기준에 맞춘 발표 흐름, 핵심 근거 배치, 편집 가능한 원본 구성을 확인하고 바로 의뢰 수준을 판단할 수 있습니다.",
      en: "The planning file and editable deck let clients review the structure, readability, and finish before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개 구성", en: "One planning document plus one editable PPT deck" },
      { ko: "사업별 발표 목차 및 평가 기준 반영", en: "Program-specific story structure and scoring criteria" },
      { ko: "정량 데이터·예산·일정 중심 슬라이드", en: "Slides for data, budget, timeline, and milestones" },
    ],
    kpis: [
      { value: "30", unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
      { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
      { value: "1+1", label: { ko: "기획서 + PPT", en: "Plan + PPT" } },
    ],
    stack: ["Grant Deck", "Business Plan", "Data Story", "Editable PPTX"],
    role: ["기획", "자료 구조화", "카피 정리", "PPT 디자인"],
    duration: "2-4일",
    client: "PPT 제작 의뢰 고객",
    links: { live: null, github: null, case: "/portfolio/ppt-government-grant" },
    downloads: {
      planning: "/portfolio/ppt-design/government-grant/planning.md",
      deck: "/portfolio/ppt-design/government-grant/deck.pptx",
    },
    cover: "/portfolio/ppt-design/government-grant/cover-slide.png",
    gallery: [
      "/portfolio/ppt-design/government-grant/cover-slide.png",
      "/portfolio/ppt-design/government-grant/sample-2.png",
      "/portfolio/ppt-design/government-grant/sample-3.png",
      "/portfolio/ppt-design/government-grant/sample-4.png",
      "/portfolio/ppt-design/government-grant/sample-5.png",
      "/portfolio/ppt-design/government-grant/sample-6.png",
    ],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
  {
    id: "ppt-ir-investment",
    slug: "ppt-ir-investment",
    type: "design",
    subtype: "ppt",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "Seed 투자유치 피치덱", en: "Seed Investment Pitch Deck" },
    summary: {
      ko: "초기 투자자가 시장성, 문제 해결력, 수익모델, 실행 가능성을 빠르게 판단할 수 있도록 정리한 Seed 단계 피치덱입니다.",
      en: "A seed-stage pitch deck built for quick investor review of market, solution, business model, and execution readiness.",
    },
    problem: {
      ko: "투자자용 자료는 기능 설명만 많으면 설득력이 약해지고, 시장성·트랙션·수익모델·확장성이 한 흐름으로 보여야 합니다.",
      en: "Investor decks need a clear flow from market and traction to business model and scale, not just feature descriptions.",
    },
    solution: {
      ko: "문제, 시장, 해결책, 트랙션, BM, 팀, 투자 요청 금액이 자연스럽게 이어져 투자자가 다음 질문을 떠올리기 전에 핵심 근거를 보게 합니다.",
      en: "We organized the pitch around problem, market, solution, traction, business model, team, and funding ask.",
    },
    impact: {
      ko: "발표자는 핵심 투자 포인트를 짧게 전달하고, 투자자는 현재 단계·트랙션·성장 가능성을 빠르게 비교합니다.",
      en: "Founders can present the investment thesis clearly while investors can compare stage, traction, and growth potential.",
    },
    resultSummary: {
      ko: "투자자가 가장 먼저 보는 시장성, 트랙션, 수익모델 흐름이 어떻게 설득 화면으로 바뀌는지 확인할 수 있습니다.",
      en: "The planning file and editable deck let founders review the investor-facing story and visual finish before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개 구성", en: "One planning document plus one editable PPT deck" },
      { ko: "투자 단계별 스토리라인", en: "Stage-specific investor storyline" },
      { ko: "시장·트랙션·BM 슬라이드 구성", en: "Market, traction, and business model slides" },
    ],
    kpis: [
      { value: "17", unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
      { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
      { value: "1+1", label: { ko: "기획서 + PPT", en: "Plan + PPT" } },
    ],
    stack: ["IR Deck", "Pitch Story", "Traction", "Editable PPTX"],
    role: ["스토리 설계", "카피 정리", "지표 구성", "PPT 디자인"],
    duration: "2-4일",
    client: "PPT 제작 의뢰 고객",
    links: { live: null, github: null, case: "/portfolio/ppt-ir-investment" },
    downloads: {
      planning: "/portfolio/ppt-design/ir-investment/planning.md",
      deck: "/portfolio/ppt-design/ir-investment/deck.pptx",
    },
    cover: "/portfolio/ppt-design/ir-investment/cover-slide.png",
    gallery: [
      "/portfolio/ppt-design/ir-investment/cover-slide.png",
      "/portfolio/ppt-design/ir-investment/sample-2.png",
      "/portfolio/ppt-design/ir-investment/sample-3.png",
      "/portfolio/ppt-design/ir-investment/sample-4.png",
      "/portfolio/ppt-design/ir-investment/sample-5.png",
      "/portfolio/ppt-design/ir-investment/sample-6.png",
      "/portfolio/ppt-design/ir-investment/sample-7.png",
    ],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
  {
    id: "ppt-brand-proposal",
    slug: "ppt-brand-proposal",
    type: "design",
    subtype: "ppt",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "스튜디오 회사소개서 PPT", en: "Studio Company Profile Deck" },
    summary: {
      ko: "스튜디오의 분위기, 서비스 범위, 작업 방식을 첫 상담 전에 선명하게 보여줄 수 있도록 정리한 회사소개서 PPT입니다.",
      en: "A studio profile deck that presents brand mood, service scope, and work process before the first sales call.",
    },
    problem: {
      ko: "영업 제안서는 받는 사람이 서비스 범위, 강점, 가격, 진행 방식을 빠르게 이해하고 내부 공유까지 이어져야 합니다.",
      en: "Sales decks must make scope, strengths, pricing, and process easy to understand and share internally.",
    },
    solution: {
      ko: "첫인상, 서비스 구조, 사례, 견적 근거, 다음 액션이 순서대로 보여 받는 사람이 제안 내용을 바로 이해하게 구성합니다.",
      en: "We built a proposal flow that moves from first impression to services, proof, pricing logic, and next steps.",
    },
    impact: {
      ko: "제안서를 받는 사람은 서비스 가치와 진행 범위를 빠르게 이해하고, 내부 공유나 의사결정에 필요한 정보를 한 번에 정리합니다.",
      en: "Prospects can compare the service value quickly, and sales teams can clarify scope and budget before a call.",
    },
    resultSummary: {
      ko: "브랜드 첫인상, 서비스 소개, 제안 흐름이 한 번에 정리된 영업용 PPT 완성도를 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the sales-ready tone and information structure before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개 구성", en: "One planning document plus one editable PPT deck" },
      { ko: "브랜드 첫인상용 표지·소개 구조", en: "Cover and company introduction structure" },
      { ko: "서비스·가격·프로세스 제안 슬라이드", en: "Service, pricing, and process proposal slides" },
    ],
    kpis: [
      { value: "20", unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
      { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
      { value: "1+1", label: { ko: "기획서 + PPT", en: "Plan + PPT" } },
    ],
    stack: ["Company Deck", "Proposal", "Sales Copy", "Editable PPTX"],
    role: ["브랜드 구조화", "제안 카피", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    client: "PPT 제작 의뢰 고객",
    links: { live: null, github: null, case: "/portfolio/ppt-brand-proposal" },
    downloads: {
      planning: "/portfolio/ppt-design/brand-proposal/planning.md",
      deck: "/portfolio/ppt-design/brand-proposal/deck.pptx",
    },
    cover: "/portfolio/ppt-design/brand-proposal/cover-slide.png",
    gallery: [
      "/portfolio/ppt-design/brand-proposal/cover-slide.png",
      "/portfolio/ppt-design/brand-proposal/sample-2.png",
      "/portfolio/ppt-design/brand-proposal/sample-3.png",
      "/portfolio/ppt-design/brand-proposal/sample-4.png",
      "/portfolio/ppt-design/brand-proposal/sample-5.png",
    ],
    size: "md",
    featured: true,
    publishedAt: "2026-04-29",
  },
  {
    id: "ppt-seminar-lecture",
    slug: "ppt-seminar-lecture",
    type: "design",
    subtype: "ppt",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "ESG CEO 강연 PPT", en: "ESG CEO Lecture Deck" },
    summary: {
      ko: "CEO·리더 대상 ESG 강연에서 메시지, 사례, 핵심 요약이 자연스럽게 이어지도록 정리한 발표용 PPT입니다.",
      en: "An ESG executive lecture deck built around message clarity, examples, and speaker pacing.",
    },
    problem: {
      ko: "강연 자료는 읽는 문서가 아니라 듣는 사람이 따라올 수 있는 흐름, 예시, 강조 장면이 중요합니다.",
      en: "Lecture decks need a rhythm that audiences can follow, with examples and emphasis points, not dense reading pages.",
    },
    solution: {
      ko: "섹션 전환, 핵심 문장, 설명용 다이어그램, 요약 슬라이드를 나누어 청중이 놓치지 않고 따라오도록 구성합니다.",
      en: "We structured section breaks, key statements, explainers, and summaries so speakers can deliver naturally.",
    },
    impact: {
      ko: "청중은 핵심 개념을 단계적으로 이해하고, 발표자는 시간 안배와 메시지 강조를 안정적으로 가져갑니다.",
      en: "Audiences can follow the content step by step, while speakers can control timing and emphasis.",
    },
    resultSummary: {
      ko: "청중이 따라오기 쉬운 강연 흐름, 메시지 강조 장면, 발표자가 바로 쓰기 좋은 화면 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let speakers review pacing, audience fit, and message delivery before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개 구성", en: "One planning document plus one editable PPT deck" },
      { ko: "강연 흐름 설계와 섹션 구조", en: "Lecture flow and section structure" },
      { ko: "개념 설명·예시·요약 슬라이드", en: "Concept, example, and recap slides" },
    ],
    kpis: [
      { value: "12", unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
      { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
      { value: "1+1", label: { ko: "기획서 + PPT", en: "Plan + PPT" } },
    ],
    stack: ["Seminar Deck", "Keynote", "Education", "Editable PPTX"],
    role: ["강연 구성", "교육 흐름", "슬라이드 디자인", "카피 정리"],
    duration: "2-4일",
    client: "PPT 제작 의뢰 고객",
    links: { live: null, github: null, case: "/portfolio/ppt-seminar-lecture" },
    downloads: {
      planning: "/portfolio/ppt-design/seminar-lecture/planning.md",
      deck: "/portfolio/ppt-design/seminar-lecture/deck.pptx",
    },
    cover: "/portfolio/ppt-design/seminar-lecture/cover-slide.png",
    gallery: [
      "/portfolio/ppt-design/seminar-lecture/cover-slide.png",
      "/portfolio/ppt-design/seminar-lecture/sample-2.png",
      "/portfolio/ppt-design/seminar-lecture/sample-3.png",
      "/portfolio/ppt-design/seminar-lecture/sample-4.png",
      "/portfolio/ppt-design/seminar-lecture/sample-5.png",
    ],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
  {
    id: "ppt-school-assignment",
    slug: "ppt-school-assignment",
    type: "design",
    subtype: "ppt",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "자기소개 발표 PPT", en: "Career Self-Introduction Deck" },
    summary: {
      ko: "지원자의 강점, 경험, 목표가 면접·발표 자리에서 또렷하게 전달되도록 정리한 자기소개 PPT입니다.",
      en: "A career self-introduction deck that makes strengths, experience, and goals easy to understand in interviews or presentations.",
    },
    problem: {
      ko: "과제 발표는 내용 정리와 발표 가독성이 동시에 필요하고, 팀원별 역할과 결과가 명확히 보여야 평가자가 이해하기 쉽습니다.",
      en: "Academic decks need both clear content structure and presentation readability, with roles and outcomes easy to evaluate.",
    },
    solution: {
      ko: "주제, 문제 정의, 조사 내용, 결과, 느낀 점 또는 제안까지 발표 순서에 맞춰 평가자가 쉽게 따라오도록 정리합니다.",
      en: "We organized topic, problem, research, results, and takeaways into a polished presentation flow.",
    },
    impact: {
      ko: "발표자는 자료를 보며 안정적으로 설명하고, 평가자는 핵심 내용과 팀 기여도를 빠르게 이해합니다.",
      en: "Presenters can speak confidently from the deck, while evaluators can quickly understand the content and team contribution.",
    },
    resultSummary: {
      ko: "발표 목적에 맞춘 이야기 흐름, 한눈에 읽히는 화면 구성, 제출용 원본 완성도를 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review structure, readability, and design quality before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개 구성", en: "One planning document plus one editable PPT deck" },
      { ko: "과제 주제별 발표 흐름 정리", en: "Topic-specific presentation structure" },
      { ko: "팀 역할·조사·결과 시각화", en: "Role, research, and result visualization" },
    ],
    kpis: [
      { value: "10", unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
      { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
      { value: "1+1", label: { ko: "기획서 + PPT", en: "Plan + PPT" } },
    ],
    stack: ["Academic Deck", "Team Project", "Report", "Editable PPTX"],
    role: ["자료 정리", "발표 구성", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    client: "PPT 제작 의뢰 고객",
    links: { live: null, github: null, case: "/portfolio/ppt-school-assignment" },
    downloads: {
      planning: "/portfolio/ppt-design/school-assignment/planning.md",
      deck: "/portfolio/ppt-design/school-assignment/deck.pptx",
    },
    cover: "/portfolio/ppt-design/school-assignment/cover-slide.png",
    gallery: [
      "/portfolio/ppt-design/school-assignment/cover-slide.png",
      "/portfolio/ppt-design/school-assignment/sample-2.png",
      "/portfolio/ppt-design/school-assignment/sample-3.png",
      "/portfolio/ppt-design/school-assignment/sample-4.png",
      "/portfolio/ppt-design/school-assignment/sample-5.png",
    ],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
];

interface AdditionalPptSpec {
  slug: string;
  assetDir: string;
  title: LocalizedString;
  summary: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  impact: LocalizedString;
  resultSummary: LocalizedString;
  deliverables: LocalizedString[];
  stack: string[];
  role: string[];
  duration: string;
  slides: string;
  sampleCount: number;
  featured?: boolean;
}

const createPptGallery = (assetDir: string, sampleCount: number) => [
  `/portfolio/ppt-design/${assetDir}/cover-slide.png`,
  ...Array.from({ length: Math.max(sampleCount - 1, 0) }, (_, index) => `/portfolio/ppt-design/${assetDir}/sample-${index + 2}.png`),
];

const additionalPptSpecs: AdditionalPptSpec[] = [
  {
    slug: "ppt-tips-vibestack",
    assetDir: "tips-vibestack",
    title: { ko: "TIPS R&D 발표 PPT", en: "TIPS R&D Presentation Deck" },
    summary: {
      ko: "기술성, 사업화 가능성, 개발 일정, 시장 확장성을 TIPS 심사 흐름에 맞춰 보여주는 R&D 발표자료입니다.",
      en: "A TIPS R&D deck that presents technology, commercialization plan, roadmap, and market expansion for reviewer evaluation.",
    },
    problem: {
      ko: "기술 과제는 설명이 길어질수록 핵심 가치가 흐려지기 쉬워, 심사자가 판단할 기술성과 사업화 근거를 빠르게 보여줘야 합니다.",
      en: "Technical grant decks must make technology and commercialization evidence easy to judge without overwhelming reviewers.",
    },
    solution: {
      ko: "기술 문제, 해결 방식, 개발 로드맵, 사업화 계획을 한 흐름으로 묶어 발표자가 제한 시간 안에 핵심 근거를 전달하게 구성했습니다.",
      en: "The deck connects technical problem, solution, development roadmap, and commercialization plan in one review-friendly flow.",
    },
    impact: {
      ko: "심사자는 기술의 차별점과 실행 계획을 빠르게 이해하고, 발표자는 복잡한 내용을 평가 기준에 맞춰 안정적으로 설명할 수 있습니다.",
      en: "Reviewers can quickly grasp differentiation and execution plan, while presenters can explain complex material with confidence.",
    },
    resultSummary: {
      ko: "기술 설명이 길어지지 않도록 핵심 근거와 사업화 계획을 압축한 R&D 발표 화면을 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the density and flow of an R&D presentation before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "기술성·사업화·로드맵 구조", en: "Technology, commercialization, and roadmap structure" },
      { ko: "심사용 발표 흐름 정리", en: "Reviewer-friendly pitch flow" },
    ],
    stack: ["Grant Deck", "R&D Story", "Roadmap", "Editable PPTX"],
    role: ["기획", "자료 구조화", "PPT 디자인"],
    duration: "2-4일",
    slides: "30",
    sampleCount: 6,
  },
  {
    slug: "ppt-youngceo-greenpet",
    assetDir: "youngceo-greenpet",
    title: { ko: "청년창업 지원사업 발표 PPT", en: "Youth Startup Grant Deck" },
    summary: {
      ko: "창업 아이템의 시장성, 고객 문제, 실행 계획을 청년창업 지원사업 발표에 맞춰 정리한 PPT입니다.",
      en: "A youth startup grant deck that organizes market fit, customer pain, and execution plan for evaluation.",
    },
    problem: {
      ko: "초기 창업 발표는 아이디어만 강조하면 실행력이 약해 보이기 때문에 문제, 고객, 수익 구조, 일정이 함께 보여야 합니다.",
      en: "Early startup decks need more than an idea; they must show customer problem, business model, and execution plan.",
    },
    solution: {
      ko: "아이템 소개, 고객 문제, 시장 검증, 실행 일정, 기대 성과를 발표 순서에 맞춰 정리해 심사자가 사업성을 빠르게 판단하게 했습니다.",
      en: "The deck orders item overview, customer problem, validation, execution timeline, and expected outcome for clear review.",
    },
    impact: {
      ko: "심사자는 아이템의 가능성과 준비 수준을 쉽게 비교하고, 발표자는 사업 계획을 한눈에 이해되는 화면으로 전달할 수 있습니다.",
      en: "Reviewers can compare opportunity and readiness, while founders can present the plan through easy-to-read slides.",
    },
    resultSummary: {
      ko: "아이디어, 고객 문제, 실행 계획이 심사자에게 빠르게 읽히는 창업 발표자료의 완성 톤을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the tone and structure of a startup grant presentation.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "아이템·고객·실행계획 슬라이드", en: "Item, customer, and execution slides" },
      { ko: "지원사업 발표용 구성", en: "Grant presentation structure" },
    ],
    stack: ["Startup Deck", "Grant Story", "Editable PPTX"],
    role: ["기획", "카피 정리", "PPT 디자인"],
    duration: "2-4일",
    slides: "25",
    sampleCount: 1,
  },
  {
    slug: "ppt-prea-silvercarelab",
    assetDir: "prea-silvercarelab",
    title: { ko: "Pre-A 투자유치 피치덱", en: "Pre-A Investment Pitch Deck" },
    summary: {
      ko: "제품 검증 이후 투자자가 확인해야 할 트랙션, 확장 전략, 수익 구조를 중심으로 정리한 Pre-A 피치덱입니다.",
      en: "A Pre-A pitch deck focused on traction, expansion strategy, and business model after product validation.",
    },
    problem: {
      ko: "Pre-A 단계에서는 아이디어보다 실제 지표와 확장 가능성이 중요해, 투자자가 다음 성장을 가늠할 근거가 필요합니다.",
      en: "At Pre-A, investors need evidence of traction and scalability rather than only product vision.",
    },
    solution: {
      ko: "현재 성과, 고객 반응, 시장 확장, 투자금 사용 계획을 연결해 투자자가 성장 경로를 빠르게 이해하도록 구성했습니다.",
      en: "The deck connects current traction, customer response, market expansion, and use of funds into a clear growth story.",
    },
    impact: {
      ko: "투자자는 현재 단계와 다음 성장 가능성을 비교하기 쉽고, 발표자는 핵심 지표 중심으로 설득력을 높일 수 있습니다.",
      en: "Investors can assess the current stage and next growth path, while founders can lead with stronger proof.",
    },
    resultSummary: {
      ko: "현재 성과와 다음 성장 계획이 투자 검토 흐름에 맞게 정리된 Pre-A 피치덱 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review metric structure and Pre-A story flow before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "트랙션·시장·투자금 사용 구조", en: "Traction, market, and fund-use structure" },
      { ko: "투자자 검토용 발표 흐름", en: "Investor review flow" },
    ],
    stack: ["IR Deck", "Traction", "Growth Story", "Editable PPTX"],
    role: ["스토리 설계", "지표 정리", "PPT 디자인"],
    duration: "2-4일",
    slides: "18",
    sampleCount: 2,
  },
  {
    slug: "ppt-seriesa-greenpet",
    assetDir: "seriesa-greenpet",
    title: { ko: "Series A 투자유치 피치덱", en: "Series A Investment Pitch Deck" },
    summary: {
      ko: "검증된 서비스의 성장 지표, 시장 점유 전략, 조직 확장 계획을 Series A 투자 검토용으로 정리한 PPT입니다.",
      en: "A Series A deck that organizes growth metrics, market strategy, and team expansion for investor review.",
    },
    problem: {
      ko: "Series A 자료는 시장 기회와 실행 규모가 동시에 보여야 하며, 투자자가 큰 성장 그림을 빠르게 판단할 수 있어야 합니다.",
      en: "Series A decks must show both market opportunity and execution scale so investors can judge the next growth phase.",
    },
    solution: {
      ko: "핵심 지표, 고객 확장, 경쟁 우위, 조직 계획, 투자 요청을 한 흐름으로 연결해 성장 가능성이 선명하게 보이도록 구성했습니다.",
      en: "The deck connects metrics, customer growth, competitive edge, organization plan, and funding ask into one scale story.",
    },
    impact: {
      ko: "투자자는 성장 근거와 자금 사용 방향을 빠르게 확인하고, 발표자는 큰 시장 안에서의 확장 전략을 일관되게 전달합니다.",
      en: "Investors can review growth proof and use of funds quickly, while founders can present a coherent scaling strategy.",
    },
    resultSummary: {
      ko: "성장 지표, 시장 전략, 투자금 사용 계획이 큰 투자 검토에 맞게 정리된 화면 밀도를 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the information density and presentation flow for Series A.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "성장 지표·시장 전략·조직 계획", en: "Growth metrics, market strategy, and team plan" },
      { ko: "투자 검토용 피치덱 구조", en: "Investor-ready pitch structure" },
    ],
    stack: ["IR Deck", "Series A", "Market Strategy", "Editable PPTX"],
    role: ["투자 스토리", "자료 구조화", "PPT 디자인"],
    duration: "2-4일",
    slides: "25",
    sampleCount: 2,
  },
  {
    slug: "ppt-vibestack-company-profile",
    assetDir: "vibestack-company-profile",
    title: { ko: "기업 회사소개서 PPT", en: "Corporate Company Profile Deck" },
    summary: {
      ko: "기업의 서비스 구조, 강점, 협업 방식, 문의 흐름을 처음 보는 고객도 빠르게 이해하도록 정리한 회사소개서입니다.",
      en: "A corporate profile deck that helps prospects understand services, strengths, collaboration flow, and next steps.",
    },
    problem: {
      ko: "회사소개서는 브랜드가 무엇을 잘하는지와 어떤 방식으로 함께 일하는지가 짧은 시간 안에 보여야 합니다.",
      en: "Company decks must quickly show what the brand does well and how prospects can work with it.",
    },
    solution: {
      ko: "첫인상, 서비스 범위, 차별점, 진행 과정, 상담 유도 흐름을 순서대로 배치해 영업 자료로 바로 활용할 수 있게 구성했습니다.",
      en: "The deck sequences first impression, scope, differentiation, process, and inquiry flow for sales use.",
    },
    impact: {
      ko: "고객은 서비스 적합성과 의뢰 범위를 빠르게 판단하고, 내부 공유가 필요한 경우에도 자료만으로 핵심 내용을 전달할 수 있습니다.",
      en: "Prospects can judge fit and scope quickly, and the deck can carry the key message when shared internally.",
    },
    resultSummary: {
      ko: "처음 보는 고객도 서비스 범위와 강점을 빠르게 이해하는 회사소개서 흐름과 디자인 톤을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the information structure and design tone before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "회사소개·서비스·프로세스 구조", en: "Company, service, and process structure" },
      { ko: "영업 상담용 화면 구성", en: "Sales consultation slide flow" },
    ],
    stack: ["Company Deck", "Sales Copy", "Editable PPTX"],
    role: ["브랜드 구조화", "카피 정리", "PPT 디자인"],
    duration: "1-3일",
    slides: "20",
    sampleCount: 1,
    featured: true,
  },
  {
    slug: "ppt-beanbrew-b2b-proposal",
    assetDir: "beanbrew-b2b-proposal",
    title: { ko: "B2B 제안서 PPT", en: "B2B Proposal Deck" },
    summary: {
      ko: "제안 받는 담당자가 서비스 가치, 도입 방식, 기대 사용 장면을 빠르게 검토할 수 있도록 만든 B2B 제안서입니다.",
      en: "A B2B proposal deck that helps buyers review value, adoption flow, and use cases quickly.",
    },
    problem: {
      ko: "B2B 제안서는 담당자뿐 아니라 내부 결재자까지 이해해야 하므로, 제안 가치와 도입 근거가 명확해야 합니다.",
      en: "B2B proposals need to be clear enough for both the direct contact and internal decision makers.",
    },
    solution: {
      ko: "문제 상황, 제안 솔루션, 적용 사례, 진행 방식, 다음 액션을 한 흐름으로 정리해 내부 공유가 쉬운 제안서로 구성했습니다.",
      en: "The deck organizes problem, proposed solution, use case, process, and next step for internal sharing.",
    },
    impact: {
      ko: "담당자는 제안 내용을 빠르게 파악하고, 내부 검토 시 필요한 근거와 화면을 그대로 공유할 수 있습니다.",
      en: "The buyer can understand the proposal quickly and share the required proof and visuals internally.",
    },
    resultSummary: {
      ko: "제안 가치, 도입 근거, 다음 액션이 내부 공유까지 이어지도록 정리된 B2B 제안서 완성도를 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review B2B persuasion flow and delivery quality.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "문제·제안·도입 흐름", en: "Problem, offer, and adoption flow" },
      { ko: "내부 공유용 제안 구조", en: "Internal-share proposal structure" },
    ],
    stack: ["Proposal", "B2B Sales", "Editable PPTX"],
    role: ["제안 구조", "카피 정리", "PPT 디자인"],
    duration: "1-3일",
    slides: "20",
    sampleCount: 1,
  },
  {
    slug: "ppt-ai-automation-seminar",
    assetDir: "ai-automation-seminar",
    title: { ko: "AI 자동화 세미나 PPT", en: "AI Automation Seminar Deck" },
    summary: {
      ko: "처음 듣는 청중도 자동화 개념, 활용 장면, 실행 순서를 따라올 수 있도록 정리한 세미나 발표자료입니다.",
      en: "A seminar deck that helps audiences understand automation concepts, use cases, and execution steps.",
    },
    problem: {
      ko: "기술 주제 세미나는 용어가 많아질수록 청중이 흐름을 놓치기 쉬워, 개념과 예시가 단계적으로 보여야 합니다.",
      en: "Technical seminars can lose audiences when jargon dominates, so concepts and examples must unfold step by step.",
    },
    solution: {
      ko: "개념 설명, 실제 업무 예시, 적용 순서, 정리 슬라이드를 나누어 발표자가 자연스럽게 설명할 수 있게 구성했습니다.",
      en: "The deck separates concept, practical examples, application sequence, and recap for natural delivery.",
    },
    impact: {
      ko: "청중은 자동화가 내 업무에 어떻게 적용되는지 쉽게 이해하고, 발표자는 복잡한 내용을 안정적으로 전달할 수 있습니다.",
      en: "Audiences can see how automation applies to their work, while speakers can explain complex ideas clearly.",
    },
    resultSummary: {
      ko: "어려운 개념도 청중이 따라올 수 있게 나눈 설명 흐름과 세미나용 화면 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review seminar pacing and visual structure before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "개념·예시·실행 순서 구성", en: "Concept, example, and execution structure" },
      { ko: "강연용 요약 슬라이드", en: "Speaker recap slides" },
    ],
    stack: ["Seminar Deck", "Education", "Editable PPTX"],
    role: ["교육 구성", "카피 정리", "PPT 디자인"],
    duration: "1-3일",
    slides: "10",
    sampleCount: 1,
  },
  {
    slug: "ppt-solopreneur-talk",
    assetDir: "solopreneur-talk",
    title: { ko: "솔로프리너 강연 PPT", en: "Solopreneur Talk Deck" },
    summary: {
      ko: "1인 사업자가 청중에게 경험, 전략, 실행 루틴을 명확하게 전달할 수 있도록 만든 강연용 PPT입니다.",
      en: "A talk deck that helps solopreneurs present experience, strategy, and execution routines clearly.",
    },
    problem: {
      ko: "경험 기반 강연은 이야기가 흩어지기 쉬워, 청중이 기억할 핵심 메시지와 장면이 필요합니다.",
      en: "Experience-based talks need memorable messages and scenes so the story does not feel scattered.",
    },
    solution: {
      ko: "문제 제기, 경험 사례, 실행 방식, 청중 적용 포인트를 강연 흐름에 맞춰 정리했습니다.",
      en: "The deck structures problem, experience, execution method, and audience takeaway into a clear talk flow.",
    },
    impact: {
      ko: "청중은 발표자의 경험을 자신의 상황에 연결해 이해하고, 발표자는 메시지를 흔들림 없이 전달할 수 있습니다.",
      en: "Audiences can connect the speaker's experience to their own situation, while speakers keep the message focused.",
    },
    resultSummary: {
      ko: "경험, 전략, 실행 루틴이 청중에게 기억되는 이야기로 정리된 개인 브랜딩 강연 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review the structure of a personal-brand talk deck.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "경험 사례·실행 루틴 구조", en: "Experience and execution routine structure" },
      { ko: "청중 적용 포인트 정리", en: "Audience takeaway slides" },
    ],
    stack: ["Lecture Deck", "Personal Branding", "Editable PPTX"],
    role: ["강연 구성", "메시지 정리", "PPT 디자인"],
    duration: "1-3일",
    slides: "10",
    sampleCount: 1,
  },
  {
    slug: "ppt-capstone-recycleme",
    assetDir: "capstone-recycleme",
    title: { ko: "캡스톤 발표 PPT", en: "Capstone Presentation Deck" },
    summary: {
      ko: "팀 프로젝트의 문제 정의, 개발 과정, 결과물을 평가자가 쉽게 이해하도록 정리한 캡스톤 발표자료입니다.",
      en: "A capstone deck that makes problem definition, build process, and outcome easy for evaluators to understand.",
    },
    problem: {
      ko: "캡스톤 발표는 결과물만 보여주면 과정과 기여도가 약해 보일 수 있어, 문제 해결 흐름이 함께 보여야 합니다.",
      en: "Capstone decks need to show not just the output but the problem-solving process and contribution.",
    },
    solution: {
      ko: "문제 정의, 조사, 구현 과정, 결과, 개선 방향을 발표 순서에 맞춰 배치했습니다.",
      en: "The deck orders problem definition, research, build process, result, and improvement direction.",
    },
    impact: {
      ko: "평가자는 팀의 문제 해결 과정과 결과물을 빠르게 이해하고, 발표자는 맡은 역할과 성과를 명확하게 보여줄 수 있습니다.",
      en: "Evaluators can understand process and result quickly, while presenters can show roles and outcomes clearly.",
    },
    resultSummary: {
      ko: "문제 해결 과정과 팀 결과물이 평가자에게 선명하게 보이는 캡스톤 발표자료 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review capstone presentation structure and finish before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "문제 정의·구현·결과 구조", en: "Problem, build, and result structure" },
      { ko: "팀 발표용 화면 구성", en: "Team presentation slide flow" },
    ],
    stack: ["Academic Deck", "Capstone", "Editable PPTX"],
    role: ["자료 정리", "발표 구성", "PPT 디자인"],
    duration: "1-3일",
    slides: "10",
    sampleCount: 1,
  },
  {
    slug: "ppt-academic-paper",
    assetDir: "academic-paper",
    title: { ko: "논문 발표 PPT", en: "Academic Paper Presentation Deck" },
    summary: {
      ko: "논문의 배경, 연구 방법, 핵심 결과, 시사점을 발표자가 설명하기 쉽게 정리한 발표용 PPT입니다.",
      en: "An academic paper deck that organizes background, method, key findings, and implications for presentation.",
    },
    problem: {
      ko: "논문 발표는 원문을 그대로 옮기면 이해가 어렵기 때문에, 청중이 따라올 수 있는 요약과 흐름이 필요합니다.",
      en: "Paper presentations become hard to follow when the original text is copied directly into slides.",
    },
    solution: {
      ko: "연구 배경, 질문, 방법, 결과, 시사점을 슬라이드 단위로 나누어 발표자가 핵심만 전달하도록 구성했습니다.",
      en: "The deck separates background, question, method, result, and implication so presenters can focus on the essentials.",
    },
    impact: {
      ko: "청중은 논문의 핵심을 짧은 시간 안에 이해하고, 발표자는 복잡한 내용을 구조화된 화면으로 설명할 수 있습니다.",
      en: "Audiences can grasp the paper quickly, while presenters can explain complex material through structured slides.",
    },
    resultSummary: {
      ko: "논문 핵심을 짧은 발표 시간 안에 전달할 수 있도록 요약된 흐름과 가독성 있는 화면 구성을 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review summarization style and readability before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "연구 배경·방법·결과 구조", en: "Research background, method, and result structure" },
      { ko: "발표용 요약 슬라이드", en: "Presentation-ready summary slides" },
    ],
    stack: ["Academic Deck", "Paper Review", "Editable PPTX"],
    role: ["논문 요약", "발표 구성", "PPT 디자인"],
    duration: "1-3일",
    slides: "12",
    sampleCount: 1,
  },
  {
    slug: "ppt-seriesb-flowdesk",
    assetDir: "seriesb-flowdesk",
    title: { ko: "Series B 투자유치 피치덱", en: "Series B Investment Pitch Deck" },
    summary: {
      ko: "ARR 성장률·NRR·글로벌 확장 트랙을 Series B VC가 빠르게 판단할 수 있도록 정리한 투자유치 피치덱입니다.",
      en: "A Series B pitch deck built for VC review of ARR growth, NRR, and global expansion track in one clear flow.",
    },
    problem: {
      ko: "Series B에서는 아이디어보다 ARR 지표, 단위 경제, 글로벌 확장 가능성이 한 흐름으로 보여야 투자자가 다음 질문 없이 판단합니다.",
      en: "At Series B, investors need ARR metrics, unit economics, and global expansion potential in one coherent narrative.",
    },
    solution: {
      ko: "핵심 지표($48M ARR·142% YoY·NRR 138%), 제품 모듈, 글로벌 트랙션, 단위 경제, 팀, 재무 추정을 자연스럽게 연결해 투자 논리가 흐르게 구성했습니다.",
      en: "We connected key metrics, product modules, global traction, unit economics, team, and financials into a persuasive investment narrative.",
    },
    impact: {
      ko: "투자자는 현재 ARR과 성장 경로를 빠르게 비교하고, 발표자는 핵심 수치 중심으로 Series B 설득력을 높일 수 있습니다.",
      en: "Investors can assess current ARR and the growth path quickly, while founders can lead with stronger financial proof.",
    },
    resultSummary: {
      ko: "ARR·NRR·글로벌 확장 흐름이 어떻게 투자자 설득 화면으로 구성되는지 완성된 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let founders review the ARR narrative and investor-ready finish before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "핵심 지표·글로벌 트랙션 슬라이드", en: "Key metrics and global traction slides" },
      { ko: "단위 경제·재무 추정 구성", en: "Unit economics and financial projection structure" },
    ],
    stack: ["Series B Deck", "IR Story", "Global Traction", "Editable PPTX"],
    role: ["스토리 설계", "지표 구성", "카피 정리", "PPT 디자인"],
    duration: "2-4일",
    slides: "30",
    sampleCount: 1,
  },
  {
    slug: "ppt-demoday-noderush",
    assetDir: "demoday-noderush",
    title: { ko: "데모데이 5분 피칭 PPT", en: "Demo Day 5-Minute Pitch Deck" },
    summary: {
      ko: "100명 이상의 투자자가 동시에 보는 데모데이에서 5분 안에 핵심 메시지와 임팩트를 전달하는 피칭덱입니다.",
      en: "A demo day pitch deck built to deliver a single clear message and impact within a 5-minute investor presentation.",
    },
    problem: {
      ko: "데모데이는 30개 스타트업이 같은 무대에서 경쟁하므로, 5분 안에 문제·해결책·트랙션·투자 요청이 한 번에 박혀야 합니다.",
      en: "At demo days, 30+ startups compete on stage — 5 minutes must land problem, solution, traction, and ask simultaneously.",
    },
    solution: {
      ko: "텍스트를 최소화하고 거대한 숫자와 시각 임팩트 중심으로 10장 안에 핵심 피칭 흐름을 구성했습니다.",
      en: "We built a 10-slide flow with minimal text, large numbers, and maximum visual impact for quick investor absorption.",
    },
    impact: {
      ko: "짧은 무대 시간에 투자자의 기억에 남는 핵심 메시지를 심고, 발표 후 명함 교환으로 이어지는 첫인상을 만듭니다.",
      en: "The deck plants a memorable core message in a short stage slot and creates the first impression that leads to follow-up.",
    },
    resultSummary: {
      ko: "5분 피칭에서 투자자 기억에 남는 숫자와 흐름이 어떻게 구성되는지 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let founders review the demo-day flow and visual pacing before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "5분 피칭 타임라인·슬라이드 구성", en: "5-minute pitch timeline and slide structure" },
      { ko: "임팩트 숫자·비주얼 중심 레이아웃", en: "Impact-number and visual-first layout" },
    ],
    stack: ["Demo Day Deck", "Pitch Story", "Bold Visuals", "Editable PPTX"],
    role: ["피칭 구성", "카피 정리", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    slides: "10",
    sampleCount: 1,
  },
  {
    slug: "ppt-kstartup-luminex",
    assetDir: "kstartup-luminex",
    title: { ko: "K-Startup 글로벌 진출 PPT", en: "K-Startup Global Expansion Deck" },
    summary: {
      ko: "국내 트랙션과 일본 시장 진출 전략을 K-Startup 평가 기준에 맞춰 정리한 글로벌 진출 패키지 신청 자료입니다.",
      en: "A K-Startup global expansion deck that aligns domestic traction and Japan market strategy with program evaluation criteria.",
    },
    problem: {
      ko: "글로벌 진출 지원사업은 국내 검증 지표와 진출 국가 시장조사·전략 구체성이 함께 보여야 심사 기준을 충족합니다.",
      en: "Global expansion programs require both domestic validation metrics and concrete market research and strategy for the target country.",
    },
    solution: {
      ko: "국내 매출·트랙션, 일본 시장 분석, 진출 채널·일정·자금 운용 계획을 평가 가중치에 맞춰 한 흐름으로 구성했습니다.",
      en: "We built the deck around evaluation weights: domestic traction, Japan market data, channel strategy, timeline, and use of funds.",
    },
    impact: {
      ko: "심사자는 진출 준비 완성도와 실행 가능성을 빠르게 판단하고, 신청자는 설득력 있는 글로벌 전략을 한 장씩 전달할 수 있습니다.",
      en: "Reviewers can quickly assess readiness and feasibility, while applicants can present a compelling global strategy slide by slide.",
    },
    resultSummary: {
      ko: "국내 트랙션과 일본 진출 전략이 K-Startup 평가 기준에 맞게 구성된 완성 덱을 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let applicants review the K-Startup-aligned narrative and market strategy before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "국내 검증·일본 시장 분석 슬라이드", en: "Domestic validation and Japan market analysis slides" },
      { ko: "진출 전략·자금 운용 계획", en: "Market entry strategy and use-of-funds plan" },
    ],
    stack: ["Grant Deck", "Global Strategy", "Market Research", "Editable PPTX"],
    role: ["기획", "시장 구조화", "카피 정리", "PPT 디자인"],
    duration: "2-4일",
    slides: "25",
    sampleCount: 1,
  },
  {
    slug: "ppt-rnd-neuralwave",
    assetDir: "rnd-neuralwave",
    title: { ko: "정부 R&D 과제 사업계획서 PPT", en: "Government R&D Grant Application Deck" },
    summary: {
      ko: "의료 영상 AI 분석 과제의 연구 필요성, 정량 목표, WBS, 연구비 계획을 R&D 평가 기준에 맞춰 정리한 사업계획서 PPT입니다.",
      en: "An R&D grant deck that aligns research necessity, quantitative goals, WBS, and budget breakdown with evaluation criteria.",
    },
    problem: {
      ko: "R&D 과제는 기술 혁신성, 연구 목표 정량 명시, 인력·일정·예산 구성이 평가 항목 가중치에 맞아야 선정됩니다.",
      en: "R&D grants require quantified research goals, team structure, WBS, and budget justification matched to weighted criteria.",
    },
    solution: {
      ko: "연구 필요성·혁신성, 정량 목표, 추진 일정(24개월 Gantt), 연구 인력, 비목별 연구비를 평가 가중치 순서로 구성했습니다.",
      en: "We organized research necessity, quantified goals, 24-month Gantt, team, and itemized budget in evaluation-weight order.",
    },
    impact: {
      ko: "평가위원은 기술성·실현 가능성·사업화 가능성을 빠르게 판단하고, 연구자는 복잡한 내용을 슬라이드 단위로 설명할 수 있습니다.",
      en: "Reviewers can quickly judge technology, feasibility, and commercialization, while researchers can present complex content slide by slide.",
    },
    resultSummary: {
      ko: "R&D 평가 기준에 맞게 연구 목표·일정·인력·예산이 구성된 완성 덱을 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let researchers review the evaluation-aligned structure and completeness before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "연구 목표·WBS·Gantt 슬라이드", en: "Research goals, WBS, and Gantt slides" },
      { ko: "연구비 비목별 사용 계획", en: "Itemized budget and use-of-funds plan" },
    ],
    stack: ["R&D Deck", "Grant Story", "WBS Gantt", "Editable PPTX"],
    role: ["기획", "자료 구조화", "연구비 정리", "PPT 디자인"],
    duration: "2-4일",
    slides: "30",
    sampleCount: 1,
  },
  {
    slug: "ppt-lifecare-insurance",
    assetDir: "lifecare-insurance",
    title: { ko: "보험 상품 설명 PPT", en: "Insurance Product Explanation Deck" },
    summary: {
      ko: "복잡한 보험 약관을 잠재 가입자가 한 번에 이해할 수 있도록 보장 내용·가격·가입 사례를 시각화한 상품 설명 자료입니다.",
      en: "An insurance product deck that turns complex policy terms into clear visuals for benefit, pricing, and enrollment cases.",
    },
    problem: {
      ko: "보험 가입자는 약관 복잡성이 가장 큰 장벽이므로, 보장 명확성·가격 투명성·신뢰 전달이 한 장씩 이어져야 합니다.",
      en: "Policy complexity is the top barrier for buyers, so clarity, pricing transparency, and trust must flow through each slide.",
    },
    solution: {
      ko: "핵심 보장 항목, 가입 사례별 시뮬레이션, 청구 절차를 시각화해 중장년 가입 대상이 쉽게 이해하도록 구성했습니다.",
      en: "We visualized key benefits, simulation by case, and claim steps so the 40-60s audience can understand quickly.",
    },
    impact: {
      ko: "잠재 가입자는 보장 내용과 가격을 명확히 이해하고 상담사는 설명 시간을 줄이며 신뢰를 먼저 전달할 수 있습니다.",
      en: "Prospects can clearly understand coverage and pricing, while agents can build trust and reduce explanation time.",
    },
    resultSummary: {
      ko: "복잡한 보험 조건이 어떻게 이해하기 쉬운 슬라이드로 바뀌는지 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let clients review how complex insurance terms become readable slides before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "핵심 보장·가격 시뮬레이션 슬라이드", en: "Key benefit and pricing simulation slides" },
      { ko: "가입 사례·청구 절차 시각화", en: "Enrollment case and claim process visualization" },
    ],
    stack: ["Product Deck", "Insurance", "B2C Proposal", "Editable PPTX"],
    role: ["구조화", "카피 정리", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    slides: "15",
    sampleCount: 1,
  },
  {
    slug: "ppt-growthpie-marketing",
    assetDir: "growthpie-marketing",
    title: { ko: "디지털 마케팅 영업 제안서 PPT", en: "Digital Marketing Agency Proposal Deck" },
    summary: {
      ko: "퍼포먼스 마케팅 에이전시의 실적, 서비스 구조, 사례, 가격 모델을 B2B 의사결정자가 빠르게 비교하도록 정리한 영업 제안서입니다.",
      en: "A B2B marketing agency proposal deck that helps decision-makers compare track record, services, case studies, and pricing quickly.",
    },
    problem: {
      ko: "에이전시 제안서는 ROAS·CAC 같은 실적 수치와 진행 방식이 의사결정자가 내부 공유하기 쉽게 정리돼야 계약으로 이어집니다.",
      en: "Agency proposals must present ROAS, CAC, and work process in a format easy to share internally to close deals.",
    },
    solution: {
      ko: "5.8x ROAS 등 핵심 숫자를 표지부터 강조하고, 서비스 범주·사례·가격 모델·온보딩·다음 단계를 순서대로 제안합니다.",
      en: "We lead with headline numbers like 5.8x ROAS and flow through services, case studies, pricing, onboarding, and next steps.",
    },
    impact: {
      ko: "의사결정자는 서비스 가치와 기대 성과를 한눈에 비교하고, 에이전시는 미팅 전에 신뢰를 먼저 전달할 수 있습니다.",
      en: "Decision-makers can compare service value and expected results quickly, while the agency builds trust before the first call.",
    },
    resultSummary: {
      ko: "마케팅 실적 수치와 영업 흐름이 어떻게 설득력 있는 제안서로 구성되는지 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let agencies review how their metrics become a compelling proposal before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "실적 수치·사례 중심 슬라이드", en: "Performance metrics and case study slides" },
      { ko: "가격 모델·온보딩·다음 단계 구성", en: "Pricing model, onboarding, and next-steps structure" },
    ],
    stack: ["Agency Proposal", "B2B Sales", "Performance Deck", "Editable PPTX"],
    role: ["제안 구성", "카피 정리", "사례 정리", "PPT 디자인"],
    duration: "1-3일",
    slides: "20",
    sampleCount: 1,
  },
  {
    slug: "ppt-marketing-keynote",
    assetDir: "marketing-keynote",
    title: { ko: "마케팅 컨퍼런스 키노트 PPT", en: "Marketing Conference Keynote Deck" },
    summary: {
      ko: "500명 마케팅 디렉터·CMO를 대상으로 2026 디지털 마케팅 트렌드와 AI 광고 전환을 설명하는 컨퍼런스 키노트 자료입니다.",
      en: "A conference keynote deck presenting 2026 digital marketing trends and AI ad transformation to 500 CMOs and directors.",
    },
    problem: {
      ko: "컨퍼런스 키노트는 많은 청중이 동시에 참석하므로, 한 장 한 장이 발표자 없이도 이해될 만큼 명확하고 임팩트 있어야 합니다.",
      en: "Conference keynotes need slides clear and impactful enough to stand alone as the audience follows a large-room presentation.",
    },
    solution: {
      ko: "섹션별 핵심 수치(AI 도입 ROAS +47%, TikTok +180%), 사례, 실행 가능한 Action Plan을 발표자 흐름에 맞춰 구성했습니다.",
      en: "We built the deck around section headline stats, case studies, and an actionable plan matched to the speaker's flow.",
    },
    impact: {
      ko: "청중은 트렌드와 실행 포인트를 빠르게 이해하고, 발표자는 컨퍼런스 무대에서 전문성과 신뢰를 전달할 수 있습니다.",
      en: "Audiences can absorb trends and action points quickly, while speakers can project credibility on a conference stage.",
    },
    resultSummary: {
      ko: "컨퍼런스 무대에서 트렌드와 인사이트가 어떻게 임팩트 있는 화면으로 전달되는지 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let speakers review how trends and insights translate to conference-ready slides.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "트렌드 데이터·사례 슬라이드", en: "Trend data and case study slides" },
      { ko: "실행 Action Plan 구성", en: "Actionable plan structure" },
    ],
    stack: ["Keynote Deck", "Conference", "Trend Report", "Editable PPTX"],
    role: ["강연 구성", "트렌드 정리", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    slides: "15",
    sampleCount: 1,
  },
  {
    slug: "ppt-data-intro-seminar",
    assetDir: "data-intro-seminar",
    title: { ko: "데이터 분석 입문 사내 세미나 PPT", en: "Data Analysis Intro Seminar Deck" },
    summary: {
      ko: "비개발 직군(마케팅·기획·CS)을 대상으로 SQL·GA4·Looker 데이터 분석 도구를 소개하는 사내 세미나 자료입니다.",
      en: "An in-house seminar deck introducing SQL, GA4, and Looker to non-developer teams like marketing and planning.",
    },
    problem: {
      ko: "사내 교육 자료는 읽는 문서가 아니라 발표자가 실습과 함께 설명하는 흐름이어야 비개발 직군이 따라올 수 있습니다.",
      en: "In-house training decks need a step-by-step flow that non-developers can follow alongside hands-on practice.",
    },
    solution: {
      ko: "도구별 개념 설명, 실습 예시, 1주 학습 플랜을 단계적으로 구성해 청중이 세미나 후 바로 활용할 수 있게 정리했습니다.",
      en: "We organized tool concepts, practice examples, and a 1-week learning plan so the audience can start using them after the session.",
    },
    impact: {
      ko: "비개발 직군은 데이터 도구를 두려움 없이 시작하고, 발표자는 세미나 시간 안에 핵심 개념을 효과적으로 전달할 수 있습니다.",
      en: "Non-developers can start with data tools without fear, while speakers can deliver key concepts effectively in seminar time.",
    },
    resultSummary: {
      ko: "비개발 직군이 이해하기 쉬운 데이터 분석 도구 소개 흐름과 실습 구성을 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let speakers review the tool intro flow and practice layout before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "도구별 개념·실습 슬라이드", en: "Tool concept and practice slides" },
      { ko: "1주 학습 플랜 정리", en: "1-week learning plan structure" },
    ],
    stack: ["Seminar Deck", "Data Literacy", "SQL GA4", "Editable PPTX"],
    role: ["강의 구성", "내용 정리", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    slides: "12",
    sampleCount: 1,
  },
  {
    slug: "ppt-teamproject-coffee",
    assetDir: "teamproject-coffee",
    title: { ko: "팀 프로젝트 발표 PPT", en: "Team Project Presentation Deck" },
    summary: {
      ko: "캠퍼스 카페 매출 데이터를 분석해 개선 제안을 도출한 팀 프로젝트 발표용 PPT입니다.",
      en: "A team project presentation deck analyzing campus café sales data and proposing actionable improvement strategies.",
    },
    problem: {
      ko: "팀 프로젝트 발표는 분석 방법·결과·제안이 평가자가 각 팀원의 기여도를 이해하기 쉽게 정리돼야 좋은 평가를 받습니다.",
      en: "Team project decks need clear method, results, and proposals so evaluators can easily assess each member's contribution.",
    },
    solution: {
      ko: "문제 정의, 데이터 수집, 분석 방법, 시간대별·메뉴별·좌석 회전율 결과, 개선 제안 5가지를 발표 순서에 맞춰 정리했습니다.",
      en: "We organized problem, data collection, analysis method, three result categories, and five proposals in presentation order.",
    },
    impact: {
      ko: "교수·평가위원은 분석 과정과 제안의 실행 가능성을 빠르게 판단하고, 팀은 발표 시간 안에 핵심을 안정적으로 전달합니다.",
      en: "Evaluators can quickly judge analysis quality and feasibility, while the team can deliver the core content confidently.",
    },
    resultSummary: {
      ko: "데이터 분석 결과와 개선 제안이 발표용으로 읽히는 흐름을 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let students review the analysis flow and proposal readability before ordering.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "데이터 수집·분석 결과 슬라이드", en: "Data collection and analysis result slides" },
      { ko: "개선 제안·한계 정리", en: "Improvement proposals and limitations" },
    ],
    stack: ["Academic Deck", "Data Analysis", "Team Project", "Editable PPTX"],
    role: ["자료 정리", "발표 구성", "시각 디자인", "PPT 편집"],
    duration: "1-3일",
    slides: "12",
    sampleCount: 1,
  },
  {
    slug: "ppt-internship-report",
    assetDir: "internship-report",
    title: { ko: "인턴십 결과 보고 PPT", en: "Internship Report Deck" },
    summary: {
      ko: "12주 마케팅 인턴십의 담당 업무, 성과, 배운 점을 학과 평가위원과 교수에게 보고하는 인턴십 결과 보고 PPT입니다.",
      en: "An internship report deck presenting 12-week marketing internship duties, results, and learning to academic evaluators.",
    },
    problem: {
      ko: "인턴십 보고 발표는 실무 경험을 평가자가 이해하기 쉽게 정리해야 하며, 학습·기여·성장이 한 흐름으로 보여야 합니다.",
      en: "Internship presentations must organize work experience so evaluators can see learning, contribution, and growth in one flow.",
    },
    solution: {
      ko: "회사 소개, 12주 일정, 담당 업무 3가지, 성과(ROAS 개선 사례), 배운 점, 향후 계획을 발표 순서에 맞춰 구성했습니다.",
      en: "We organized company intro, 12-week timeline, three work areas, performance proof, learnings, and future plans in order.",
    },
    impact: {
      ko: "평가위원은 인턴의 기여도와 성장을 빠르게 이해하고, 발표자는 인턴십 경험을 설득력 있게 전달할 수 있습니다.",
      en: "Evaluators can quickly grasp contribution and growth, while presenters can articulate their internship experience persuasively.",
    },
    resultSummary: {
      ko: "인턴십 경험이 어떻게 발표용으로 구조화되는지 완성 덱으로 미리 확인할 수 있습니다.",
      en: "The planning file and editable deck let students review how internship experience translates to a presentation-ready structure.",
    },
    deliverables: [
      { ko: "기획서 1개 + PPT 원본 1개", en: "One planning document plus one editable PPT deck" },
      { ko: "업무·성과·배운 점 슬라이드", en: "Work duties, results, and learning slides" },
      { ko: "향후 계획·결론 구성", en: "Future plans and conclusion structure" },
    ],
    stack: ["Report Deck", "Internship", "Career", "Editable PPTX"],
    role: ["자료 정리", "발표 구성", "시각 디자인", "PPT 편집"],
    duration: "1일",
    slides: "10",
    sampleCount: 1,
  },
];

const additionalPptPortfolioProjects: PortfolioProject[] = additionalPptSpecs.map((project) => ({
  id: project.slug,
  slug: project.slug,
  type: "design",
  subtype: "ppt",
  visibility: "private-result",
  proofType: "screenshots",
  mediaPolicy: "rich-gallery",
  title: project.title,
  summary: project.summary,
  problem: project.problem,
  solution: project.solution,
  impact: project.impact,
  resultSummary: project.resultSummary,
  deliverables: project.deliverables,
  kpis: [
    { value: project.slides, unit: "P", label: { ko: "PPT 분량", en: "Slides" } },
    { value: "1", unit: "개", label: { ko: "기획서", en: "Planning doc" } },
    { value: "1", unit: "개", label: { ko: "PPT 원본", en: "Editable deck" } },
  ],
  stack: project.stack,
  role: project.role,
  duration: project.duration,
  client: "PPT 제작 의뢰 고객",
  links: { live: null, github: null, case: `/portfolio/${project.slug}` },
  downloads: {
    planning: `/portfolio/ppt-design/${project.assetDir}/planning.md`,
    deck: `/portfolio/ppt-design/${project.assetDir}/deck.pptx`,
  },
  cover: `/portfolio/ppt-design/${project.assetDir}/cover-slide.png`,
  gallery: createPptGallery(project.assetDir, project.sampleCount),
  size: "md",
  featured: project.featured ?? false,
  publishedAt: "2026-04-30",
}));

interface DetailPageSpec {
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  problem: LocalizedString;
  solution: LocalizedString;
  impact: LocalizedString;
  resultSummary: LocalizedString;
  stack: string[];
  role: string[];
  duration: string;
  featured?: boolean;
}

const detailPageSpecs: DetailPageSpec[] = [
  {
    slug: "ampoule-anti-aging",
    title: { ko: "안티에이징 앰플 상세페이지", en: "Anti-Aging Ampoule Detail Page" },
    summary: {
      ko: "성분 신뢰, 피부 고민, 사용 루틴을 한 흐름으로 연결한 뷰티 앰플 판매 상세페이지입니다.",
      en: "A beauty ampoule detail page connecting ingredient trust, skin concerns, and usage routine.",
    },
    problem: {
      ko: "기능성 앰플은 성분과 효과를 어렵게 설명하면 구매자가 차이를 느끼기 어렵습니다.",
      en: "Functional ampoules are hard to compare when ingredients and effects are explained too technically.",
    },
    solution: {
      ko: "첫 화면에서 핵심 효능을 먼저 보여주고, 성분 근거와 사용 장면을 순서대로 배치해 구매 이유가 자연스럽게 쌓이도록 구성했습니다.",
      en: "The page leads with the key benefit, then organizes ingredient proof and usage scenes in order.",
    },
    impact: {
      ko: "구매자는 내 피부 고민에 맞는 제품인지 빠르게 판단하고, 상세페이지를 읽는 동안 구매 확신을 단계적으로 얻습니다.",
      en: "Shoppers can judge fit quickly and build purchase confidence as they scroll.",
    },
    resultSummary: {
      ko: "앰플의 기능성, 신뢰 근거, 사용 루틴이 한눈에 이어지는 세로형 상세페이지 결과물입니다.",
      en: "A vertical sales page that connects function, trust proof, and product routine.",
    },
    stack: ["Beauty Detail", "Ingredient Trust", "Sales Copy", "Vertical Design"],
    role: ["상품 구조화", "카피", "상세페이지 디자인"],
    duration: "1-2일",
    featured: true,
  },
  {
    slug: "vegan-cleanser",
    title: { ko: "비건 클렌저 상세페이지", en: "Vegan Cleanser Detail Page" },
    summary: {
      ko: "저자극, 세정력, 비건 포인트를 첫 구매자가 쉽게 이해하도록 정리한 클렌저 상세페이지입니다.",
      en: "A cleanser detail page that makes gentle cleansing, vegan positioning, and usage value easy to understand.",
    },
    problem: {
      ko: "클렌저는 비슷한 제품이 많아 저자극과 세정력을 동시에 설득하지 못하면 구매 이유가 약해집니다.",
      en: "Cleansers need to prove both gentleness and cleansing power to stand out.",
    },
    solution: {
      ko: "피부 자극 걱정, 사용감, 세정 후 만족감을 순서대로 보여줘 구매자가 제품 장점을 빠르게 비교하도록 구성했습니다.",
      en: "The page sequences irritation concern, usage feel, and after-cleansing satisfaction.",
    },
    impact: {
      ko: "구매자는 민감 피부에도 쓸 수 있는지와 실제 사용감이 어떤지 빠르게 이해해 장바구니 진입 장벽이 낮아집니다.",
      en: "Shoppers can quickly understand skin fit and expected usage feel, reducing purchase hesitation.",
    },
    resultSummary: {
      ko: "저자극 클렌징 제품의 구매 포인트를 모바일에서 읽기 쉽게 정리한 상세페이지입니다.",
      en: "A mobile-readable detail page for a gentle cleansing product.",
    },
    stack: ["Beauty Detail", "Vegan Concept", "Mobile Sales Page"],
    role: ["상품 메시지", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "herbal-cream",
    title: { ko: "한방 크림 상세페이지", en: "Herbal Cream Detail Page" },
    summary: {
      ko: "프리미엄 선물감, 원료 신뢰, 보습 케어를 고급스럽게 전달하는 한방 크림 상세페이지입니다.",
      en: "A premium herbal cream detail page built around gift value, ingredient trust, and moisture care.",
    },
    problem: {
      ko: "고가 크림은 첫 화면에서 선물 가치와 제품 신뢰가 동시에 느껴지지 않으면 가격 설득이 어렵습니다.",
      en: "Premium creams need to communicate gift value and product trust from the first screen.",
    },
    solution: {
      ko: "고급스러운 비주얼 톤과 원료·효능 설명을 함께 배치해 제품의 가격대와 구매 명분이 자연스럽게 보이도록 구성했습니다.",
      en: "The page pairs premium visuals with ingredient and benefit explanations to support price perception.",
    },
    impact: {
      ko: "구매자는 선물용으로 적합한지, 고가 제품다운 신뢰가 있는지 빠르게 판단할 수 있습니다.",
      en: "Shoppers can quickly judge whether it fits gifting and premium skincare expectations.",
    },
    resultSummary: {
      ko: "고급 화장품의 선물감과 제품 신뢰를 함께 보여주는 세로형 상세페이지입니다.",
      en: "A vertical detail page balancing premium gifting and product trust.",
    },
    stack: ["Premium Beauty", "Gift Positioning", "Detail Design"],
    role: ["비주얼 방향", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "premium-mealkit",
    title: { ko: "프리미엄 밀키트 상세페이지", en: "Premium Meal Kit Detail Page" },
    summary: {
      ko: "조리 편의성, 맛 기대감, 홈스토랑 분위기를 빠르게 전달하는 밀키트 상세페이지입니다.",
      en: "A meal kit detail page that sells convenience, taste expectation, and home-restaurant mood.",
    },
    problem: {
      ko: "밀키트는 맛있어 보이는 사진만으로는 부족하고, 조리 난이도와 완성 결과가 함께 보여야 구매가 쉬워집니다.",
      en: "Meal kits need to show cooking ease and final result, not just appetizing images.",
    },
    solution: {
      ko: "완성 비주얼, 조리 시간, 구성품, 식사 장면을 순서대로 보여줘 구매자가 머릿속으로 식탁을 그리게 구성했습니다.",
      en: "The page shows final visuals, cooking time, ingredients, and dining scenes in order.",
    },
    impact: {
      ko: "구매자는 오늘 저녁에 바로 만들 수 있는지 판단하고, 완성 모습에 대한 기대감으로 구매 결정을 앞당깁니다.",
      en: "Shoppers can imagine tonight's meal and decide faster.",
    },
    resultSummary: {
      ko: "식품 상세페이지에 필요한 맛, 편의성, 구성 정보를 한 흐름으로 묶은 결과물입니다.",
      en: "A food detail page combining taste, convenience, and package information.",
    },
    stack: ["Food Detail", "Meal Kit", "Commerce Copy"],
    role: ["판매 흐름", "카피", "디자인"],
    duration: "1-2일",
    featured: true,
  },
  {
    slug: "office-vitamin",
    title: { ko: "직장인 비타민 상세페이지", en: "Office Vitamin Detail Page" },
    summary: {
      ko: "피로 관리, 섭취 루틴, 성분 체크 포인트를 직장인 고객에게 맞춘 건강식품 상세페이지입니다.",
      en: "A supplement detail page for office workers focused on fatigue care, routine, and ingredient checkpoints.",
    },
    problem: {
      ko: "건강식품은 성분표만 나열하면 구매자가 내 상황에 필요한 제품인지 바로 판단하기 어렵습니다.",
      en: "Supplements are hard to judge when only ingredient tables are shown.",
    },
    solution: {
      ko: "직장인의 하루 루틴과 피로 상황을 먼저 보여주고, 성분·섭취 이유·구매 포인트를 체크리스트처럼 정리했습니다.",
      en: "The page starts from the office worker routine and organizes ingredients and reasons to buy as clear checkpoints.",
    },
    impact: {
      ko: "구매자는 내 생활 패턴에 맞는 제품인지 빠르게 이해하고, 복잡한 성분 정보를 부담 없이 확인합니다.",
      en: "Shoppers can connect the product to their routine and review ingredients without friction.",
    },
    resultSummary: {
      ko: "건강식품의 신뢰 정보와 구매 이유를 체크리스트형 흐름으로 정리한 상세페이지입니다.",
      en: "A checklist-style supplement detail page for trust and purchase reasoning.",
    },
    stack: ["Health Detail", "Checklist Copy", "Ingredient UX"],
    role: ["상품 구조화", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "senior-protein",
    title: { ko: "시니어 단백질 상세페이지", en: "Senior Protein Detail Page" },
    summary: {
      ko: "시니어 건강 고민, 섭취 이유, 가족 구매 관점을 함께 고려한 단백질 상세페이지입니다.",
      en: "A senior protein detail page built around health concerns, intake reasons, and family purchase decisions.",
    },
    problem: {
      ko: "시니어 제품은 실제 섭취 대상과 구매자가 다를 수 있어 안심 근거와 효능 이해가 함께 필요합니다.",
      en: "Senior products often involve both the user and family buyer, so trust and benefit clarity matter.",
    },
    solution: {
      ko: "근력·영양 케어 메시지와 가족이 확인할 성분·섭취 방식 정보를 함께 배치했습니다.",
      en: "The page combines muscle and nutrition care messaging with ingredient and intake guidance for family buyers.",
    },
    impact: {
      ko: "구매자는 부모님이나 시니어 고객에게 적합한 제품인지 신뢰 기준을 가지고 판단할 수 있습니다.",
      en: "Buyers can evaluate whether the product fits parents or senior customers with clearer trust cues.",
    },
    resultSummary: {
      ko: "시니어 건강식품의 효능, 신뢰, 섭취 편의성을 균형 있게 보여주는 상세페이지입니다.",
      en: "A senior supplement detail page balancing benefits, trust, and ease of intake.",
    },
    stack: ["Health Detail", "Senior Care", "Trust Copy"],
    role: ["상품 메시지", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "linen-onepiece",
    title: { ko: "여성 린넨 원피스 상세페이지", en: "Linen One-Piece Detail Page" },
    summary: {
      ko: "출근룩과 주말룩을 함께 보여줘 착용 장면이 바로 그려지는 패션 상세페이지입니다.",
      en: "A fashion detail page showing weekday and weekend styling for a linen one-piece.",
    },
    problem: {
      ko: "의류 상세페이지는 핏과 활용 장면이 충분히 보이지 않으면 사이즈와 코디 걱정으로 구매가 늦어집니다.",
      en: "Fashion pages need to reduce concerns around fit, styling, and occasion.",
    },
    solution: {
      ko: "소재감, 실루엣, 출근·주말 코디 장면을 순서대로 배치해 구매자가 입을 상황을 쉽게 상상하게 했습니다.",
      en: "The page presents fabric, silhouette, and styling scenes so shoppers can picture wearing it.",
    },
    impact: {
      ko: "구매자는 내 옷장에 어떻게 활용할지 빠르게 판단하고, 소재와 핏에 대한 불안을 줄입니다.",
      en: "Shoppers can judge styling fit quickly and reduce hesitation around material and silhouette.",
    },
    resultSummary: {
      ko: "패션 상품의 소재, 핏, 코디 장면을 판매 흐름으로 연결한 상세페이지입니다.",
      en: "A fashion detail page connecting material, fit, and styling scenes.",
    },
    stack: ["Fashion Detail", "Lookbook Flow", "Mobile Design"],
    role: ["상품 연출", "카피", "디자인"],
    duration: "1-2일",
    featured: true,
  },
  {
    slug: "business-shirt",
    title: { ko: "남성 비즈니스 셔츠 상세페이지", en: "Men's Business Shirt Detail Page" },
    summary: {
      ko: "출근 셔츠의 핏, 기능성, 관리 편의성을 직장인 구매자 기준으로 정리한 상세페이지입니다.",
      en: "A men's business shirt page organized around fit, functionality, and easy care.",
    },
    problem: {
      ko: "셔츠는 디자인보다 핏, 구김, 활동성이 구매 판단에 중요해 기능 포인트가 명확해야 합니다.",
      en: "Business shirts are judged by fit, wrinkle resistance, and movement as much as design.",
    },
    solution: {
      ko: "착용 상황, 활동성, 소재 기능, 관리 편의성을 한 흐름으로 보여줘 출근복 구매 기준을 빠르게 세우게 했습니다.",
      en: "The page presents wearing scenes, movement, fabric function, and care points in one flow.",
    },
    impact: {
      ko: "구매자는 매일 입기 좋은 셔츠인지 판단하고, 기능성 차이를 쉽게 비교할 수 있습니다.",
      en: "Shoppers can judge daily usability and compare functional differences easily.",
    },
    resultSummary: {
      ko: "남성 의류의 실용성과 핏을 구매 기준으로 풀어낸 상세페이지입니다.",
      en: "A menswear detail page built around practical value and fit.",
    },
    stack: ["Fashion Detail", "Functional Copy", "Commerce UX"],
    role: ["상품 메시지", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "kids-organic-wear",
    title: { ko: "키즈 친환경 의류 상세페이지", en: "Kids Organic Wear Detail Page" },
    summary: {
      ko: "등원복 활용성, 오가닉 소재, 아이 피부 안심 포인트를 부모 구매자 기준으로 정리했습니다.",
      en: "A kidswear detail page built around school-day use, organic material, and parent trust.",
    },
    problem: {
      ko: "키즈 의류는 예쁜 디자인보다 소재 안전성, 활동성, 세탁 편의성이 구매 결정에 크게 작용합니다.",
      en: "Kidswear purchases depend heavily on safety, movement, and washing convenience.",
    },
    solution: {
      ko: "부모가 먼저 보는 소재·안전·활동성 정보를 앞쪽에 두고, 등원복 활용 장면을 함께 보여줬습니다.",
      en: "The page prioritizes material, safety, and movement information with school-day use scenes.",
    },
    impact: {
      ko: "부모 고객은 아이에게 입혀도 되는지 빠르게 판단하고, 실사용 장면을 보고 구매 확신을 얻습니다.",
      en: "Parents can quickly judge safety and gain confidence from practical use scenes.",
    },
    resultSummary: {
      ko: "키즈 의류의 신뢰 정보와 착용 장면을 부모 눈높이에 맞춘 상세페이지입니다.",
      en: "A kidswear detail page tailored to parent decision-making.",
    },
    stack: ["Kids Fashion", "Parent Trust", "Detail Design"],
    role: ["상품 구조화", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "hotel-bedding",
    title: { ko: "호텔식 침구 상세페이지", en: "Hotel Bedding Detail Page" },
    summary: {
      ko: "호텔 침실 분위기, 촉감, 소재 신뢰를 고급스럽게 보여주는 리빙 상세페이지입니다.",
      en: "A bedding detail page presenting hotel mood, texture, and material trust.",
    },
    problem: {
      ko: "침구는 직접 만져볼 수 없어 촉감과 분위기를 화면에서 설득하지 못하면 구매 전환이 어렵습니다.",
      en: "Bedding needs to sell texture and room mood without physical touch.",
    },
    solution: {
      ko: "첫 화면에서 침실 분위기를 만들고, 소재·촉감·관리 포인트를 이어 보여줘 구매자가 사용 장면을 상상하게 했습니다.",
      en: "The page builds bedroom mood first, then explains material, texture, and care points.",
    },
    impact: {
      ko: "구매자는 내 침실이 어떻게 바뀔지 떠올리고, 소재와 관리 기준을 확인해 구매 불안을 줄입니다.",
      en: "Shoppers can imagine the room transformation and check material and care criteria.",
    },
    resultSummary: {
      ko: "리빙 상품의 분위기와 제품 정보를 함께 설득하는 상세페이지입니다.",
      en: "A living product detail page balancing mood and product information.",
    },
    stack: ["Living Detail", "Mood Selling", "Material Copy"],
    role: ["비주얼 방향", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "one-room-furniture",
    title: { ko: "1인가구 가구 상세페이지", en: "Small Space Furniture Detail Page" },
    summary: {
      ko: "작은 공간에 맞는 사이즈, 배치, 활용성을 실측 관점으로 보여주는 가구 상세페이지입니다.",
      en: "A furniture detail page showing size, placement, and usability for small spaces.",
    },
    problem: {
      ko: "가구는 사이즈와 배치가 불확실하면 구매 망설임이 커져 실측 정보와 사용 장면이 중요합니다.",
      en: "Furniture purchases hesitate when size and placement are unclear.",
    },
    solution: {
      ko: "공간 배치, 실측 정보, 수납·작업 활용 장면을 순서대로 보여줘 구매자가 내 방에 놓인 모습을 가늠하게 했습니다.",
      en: "The page presents layout, measurements, storage, and work scenes in order.",
    },
    impact: {
      ko: "구매자는 내 공간에 맞는지 빠르게 판단하고, 설치 후 활용 모습을 미리 상상할 수 있습니다.",
      en: "Shoppers can judge fit for their space and imagine actual use after setup.",
    },
    resultSummary: {
      ko: "가구 상세페이지에 필요한 실측, 배치, 활용 장면을 한 흐름으로 정리한 결과물입니다.",
      en: "A furniture detail page organizing measurements, placement, and use cases.",
    },
    stack: ["Furniture Detail", "Space UX", "Use Case Copy"],
    role: ["상품 구조화", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "mood-light",
    title: { ko: "무드등 상세페이지", en: "Mood Light Detail Page" },
    summary: {
      ko: "침대 옆 사용 장면, 조도 분위기, 선물 가치를 짧고 감성적으로 전달하는 상세페이지입니다.",
      en: "A mood light detail page communicating bedside use, lighting mood, and gift value.",
    },
    problem: {
      ko: "조명 상품은 실제 분위기가 화면에서 느껴지지 않으면 디자인 차이가 약하게 보입니다.",
      en: "Lighting products need to make the mood visible on screen.",
    },
    solution: {
      ko: "불빛 분위기, 사용 위치, 선물 포인트를 중심으로 구성해 짧은 스크롤 안에서도 감성 구매 이유가 보이게 했습니다.",
      en: "The page centers light mood, placement, and gifting cues within a short sales flow.",
    },
    impact: {
      ko: "구매자는 방 안 분위기가 어떻게 달라질지 쉽게 상상하고, 선물용 구매 가치도 함께 판단합니다.",
      en: "Shoppers can imagine the room mood and judge gift value quickly.",
    },
    resultSummary: {
      ko: "감성 리빙 상품의 사용 장면과 구매 이유를 압축한 상세페이지입니다.",
      en: "A compact emotional detail page for a living product.",
    },
    stack: ["Living Detail", "Mood Copy", "Visual Sales"],
    role: ["감성 카피", "상품 연출", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "premium-pet-food",
    title: { ko: "프리미엄 반려견 화식 상세페이지", en: "Premium Pet Food Detail Page" },
    summary: {
      ko: "원재료, 한 끼 구성, 보호자 안심 포인트를 중심으로 만든 반려견 화식 상세페이지입니다.",
      en: "A premium dog food detail page focused on ingredients, meal composition, and owner trust.",
    },
    problem: {
      ko: "반려동물 식품은 보호자가 원재료와 안전성을 납득해야 구매로 이어집니다.",
      en: "Pet food needs ingredient and safety trust before owners purchase.",
    },
    solution: {
      ko: "원재료가 보이는 비주얼, 급여 장면, 영양 포인트를 앞쪽에 배치해 보호자가 안심하고 비교하게 했습니다.",
      en: "The page highlights visible ingredients, feeding scenes, and nutrition points early.",
    },
    impact: {
      ko: "보호자는 반려견에게 먹여도 되는 제품인지 신뢰 기준을 가지고 판단하고, 한 끼 구성을 쉽게 이해합니다.",
      en: "Owners can evaluate trust and understand the meal composition easily.",
    },
    resultSummary: {
      ko: "펫푸드의 원재료 신뢰와 급여 장면을 구매 흐름으로 연결한 상세페이지입니다.",
      en: "A pet food detail page connecting ingredient trust and feeding scenes.",
    },
    stack: ["Pet Detail", "Ingredient Trust", "Owner UX"],
    role: ["상품 구조화", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "auto-pet-feeder",
    title: { ko: "자동급식기 상세페이지", en: "Automatic Pet Feeder Detail Page" },
    summary: {
      ko: "외출 중 정확한 급식, 예약 기능, 보호자 안심 포인트를 보여주는 펫 기기 상세페이지입니다.",
      en: "A pet device detail page showing scheduled feeding, accuracy, and owner peace of mind.",
    },
    problem: {
      ko: "펫 기기는 기능이 많아도 사용 상황과 안심 효과가 보이지 않으면 필요성이 약하게 느껴집니다.",
      en: "Pet devices need to show use cases and peace-of-mind value, not just features.",
    },
    solution: {
      ko: "외출 상황, 예약 급식, 사용 편의성, 관리 포인트를 순서대로 보여줘 기능이 생활 문제 해결로 이어지게 구성했습니다.",
      en: "The page connects going-out situations, scheduled feeding, ease of use, and care points.",
    },
    impact: {
      ko: "보호자는 외출 중에도 급식이 안정적으로 관리되는지 이해하고, 제품 필요성을 빠르게 판단합니다.",
      en: "Owners can understand how feeding stays managed while away and decide faster.",
    },
    resultSummary: {
      ko: "펫 기기의 기능과 생활 속 사용 가치를 함께 보여주는 상세페이지입니다.",
      en: "A pet device detail page combining features and everyday use value.",
    },
    stack: ["Pet Device", "Feature UX", "Detail Design"],
    role: ["기능 구조화", "카피", "디자인"],
    duration: "1-2일",
  },
  {
    slug: "senior-pet-supplement",
    title: { ko: "시니어 반려견 영양제 상세페이지", en: "Senior Pet Supplement Detail Page" },
    summary: {
      ko: "노견 관절 루틴, 급여 이유, 보호자 안심 정보를 중심으로 구성한 펫 영양제 상세페이지입니다.",
      en: "A senior pet supplement page focused on joint-care routine, feeding reason, and owner trust.",
    },
    problem: {
      ko: "시니어 반려동물 제품은 보호자가 증상, 급여 이유, 안전성을 함께 이해해야 구매로 이어집니다.",
      en: "Senior pet products need to explain symptoms, feeding reasons, and safety together.",
    },
    solution: {
      ko: "노견의 일상 변화, 관절 케어 필요성, 성분 신뢰, 급여 루틴을 단계적으로 보여줬습니다.",
      en: "The page shows senior pet changes, joint-care needs, ingredient trust, and feeding routine step by step.",
    },
    impact: {
      ko: "보호자는 반려견 상태와 제품 필요성을 연결해 이해하고, 꾸준히 급여할 이유를 명확히 확인합니다.",
      en: "Owners can connect pet condition with product need and understand why routine intake matters.",
    },
    resultSummary: {
      ko: "펫 영양제의 케어 필요성과 보호자 신뢰를 함께 설득하는 상세페이지입니다.",
      en: "A pet supplement detail page that sells care need and owner trust together.",
    },
    stack: ["Pet Health", "Routine Copy", "Trust Detail"],
    role: ["상품 메시지", "카피", "디자인"],
    duration: "1-2일",
  },
];

const detailPagePortfolioProjects: PortfolioProject[] = detailPageSpecs.map((project, index) => ({
  id: `detail-page-${project.slug}`,
  slug: `detail-page-${project.slug}`,
  type: "design",
  subtype: "detail-page",
  visibility: "private-result",
  proofType: "screenshots",
  mediaPolicy: "rich-gallery",
  title: project.title,
  summary: project.summary,
  problem: project.problem,
  solution: project.solution,
  impact: project.impact,
  resultSummary: project.resultSummary,
  deliverables: [
    { ko: "세로형 상세페이지 결과 화면", en: "Vertical detail page result screen" },
    { ko: "상품별 판매 카피 흐름", en: "Product-specific sales copy flow" },
    { ko: "모바일 쇼핑몰 등록용 이미지 구성", en: "Image structure for mobile commerce listing" },
  ],
  stack: project.stack,
  role: project.role,
  duration: project.duration,
  client: "상세페이지 제작 의뢰 고객",
  links: { live: null, github: null, case: `/portfolio/detail-page-${project.slug}` },
  cover: `/portfolio/detail-page/${project.slug}/cover.webp`,
  gallery: [`/portfolio/detail-page/${project.slug}/cover.webp`, `/portfolio/detail-page/${project.slug}/detail.jpg`],
  size: index % 5 === 0 ? "lg" : "md",
  featured: project.featured ?? false,
  publishedAt: "2026-05-01",
}));

export const portfolioProjects: PortfolioProject[] = [
  ...logoConceptProjects,
  ...pptPortfolioProjects,
  ...additionalPptPortfolioProjects,
  {
    id: "data-crawling-demo",
    slug: "data-crawling-demo",
    type: "automation",
    subtype: "data-crawling",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "공개 데이터 크롤링 데모", en: "Public Data Crawling Demo" },
    summary: {
      ko: "공개 데이터를 수집·정리·엑셀화하는 1일 자동화 데모.",
      en: "A one-day automation demo that collects, cleans, and exports public data.",
    },
    problem: {
      ko: "반복 검색과 복사 작업으로 시간이 낭비되고 데이터 누락이 발생했습니다.",
      en: "Manual searching and copying wasted time and caused missing records.",
    },
    solution: {
      ko: "수집 대상, 정리 기준, 엑셀/CSV 납품 형식을 먼저 정해 반복 요청에도 같은 품질의 데이터를 받는 구조입니다.",
      en: "Built a repeatable data pipeline with fixed collection, cleaning, and export rules.",
    },
    impact: {
      ko: "담당자는 반복 검색 시간을 줄이고, 정리된 표를 보고서·영업 리스트·운영 자료로 바로 활용합니다.",
      en: "Converted the workflow into a service that scales from one-off collection to recurring reports.",
    },
    deliverables: [
      { ko: "정리된 데이터 표", en: "Cleaned data table" },
      { ko: "엑셀/CSV 내보내기", en: "Excel/CSV export" },
      { ko: "반복 실행용 운영 가이드", en: "Runbook for repeated execution" },
    ],
    kpis: [
      { value: "1", unit: "일", label: { ko: "초기 납기", en: "Initial delivery" } },
      { value: "1,000+", unit: "건", label: { ko: "데모 처리량", en: "Demo records" } },
    ],
    stack: ["Python", "Data Pipeline", "Excel Export"],
    role: ["요구사항 정리", "수집 설계", "자동화"],
    duration: "1일",
    client: "데모 프로젝트",
    links: { live: null, github: null, case: "/portfolio/data-crawling-demo" },
    cover: "/portfolio/data-crawling-demo/cover.svg",
    gallery: ["/portfolio/data-crawling-demo/cover.svg"],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
  ...detailPagePortfolioProjects,
  {
    id: "aio-motion-intro",
    slug: "aio-motion-intro",
    type: "video",
    subtype: "motion-graphics",
    visibility: "private-result",
    proofType: "video",
    mediaPolicy: "rich-gallery",
    title: { ko: "AIO 브랜드 숏폼 영상 패키지", en: "AIO Brand Shorts Package" },
    summary: {
      ko: "브랜드 인트로, 자막, CTA를 쇼츠·릴스용 9:16 포맷으로 구성한 영상 콘텐츠 샘플.",
      en: "A short-form video content sample with brand intro, subtitles, and CTA in 9:16 format.",
    },
    problem: {
      ko: "영상 의뢰 전에는 실제 움직임, 자막 밀도, CTA 노출 방식이 어느 정도인지 확인하기 어렵습니다.",
      en: "Video leads needed a moving sample rather than static design proof.",
    },
    solution: {
      ko: "브랜드 메시지, 썸네일, 자막, CTA가 30초 내외 숏폼에서 어떻게 보이는지 한 번에 판단되도록 구성합니다.",
      en: "Reframed the brand message into a 30-second short-form package with thumbnail, captions, and CTA.",
    },
    impact: {
      ko: "의뢰자는 짧은 영상 안에서 로고 모션, 메시지, CTA의 노출 방식을 보고 홍보용 영상 범위를 빠르게 정합니다.",
      en: "Works as a flagship proof sample for the video content category.",
    },
    deliverables: [
      { ko: "9:16 숏폼 영상 구성", en: "9:16 short-form video structure" },
      { ko: "자막·썸네일·CTA 변형", en: "Caption, thumbnail, and CTA variations" },
    ],
    stack: ["Motion Graphics", "Remotion", "Subtitle Ready"],
    role: ["콘셉트", "모션 설계", "영상 출력"],
    duration: "1-3일",
    client: "자체 브랜드",
    links: { live: null, github: null, case: "/portfolio/aio-motion-intro", video: null },
    cover: "/portfolio/video-content-samples/brand-shorts.png",
    gallery: ["/portfolio/video-content-samples/brand-shorts.png", "/portfolio/aio-motion-intro/cover.svg"],
    size: "md",
    featured: false,
    publishedAt: "2026-04-29",
  },
  ...cafe24StorefrontProjects,
  {
    id: "chueok-korea",
    slug: "chueok-korea",
    type: "web",
    subtype: "homepage-basic",
    visibility: "public",
    proofType: "live-link",
    mediaPolicy: "external-link",
    title: { ko: "추억코리아 여행 랜딩페이지", en: "Chueok Korea Travel Landing" },
    summary: {
      ko: "여행 서비스의 첫인상, 상품 신뢰도, 문의 전환 흐름이 한 화면에서 바로 읽히는 반응형 랜딩페이지입니다.",
      en: "A responsive landing page that shows the travel brand impression, offer trust, and inquiry flow at a glance.",
    },
    problem: {
      ko: "여행 상품은 사진 분위기와 일정 신뢰가 함께 보여야 문의로 이어지기 쉽습니다.",
      en: "Travel offers need both visual mood and schedule credibility before visitors are ready to inquire.",
    },
    solution: {
      ko: "첫 화면에서 여행 감성, 핵심 상품, 예약 CTA, 모바일 흐름이 바로 읽히도록 구성합니다.",
      en: "The first screen combines destination mood, core offer, booking CTA, and mobile-ready flow so visitors understand quickly.",
    },
    impact: {
      ko: "방문자가 여행 분위기와 예약 흐름을 동시에 이해해 상품 신뢰를 느끼고 문의로 이동하기 쉬워집니다.",
      en: "Visitors can understand the travel mood and booking flow together, making it easier to trust the offer and inquire.",
    },
    deliverables: [
      { ko: "PC·모바일 반응형 랜딩페이지", en: "Desktop and mobile responsive landing page" },
      { ko: "예약·문의 CTA 구성", en: "Booking and inquiry CTA structure" },
      { ko: "라이브 사이트 배포", en: "Live site deployment" },
    ],
    stack: ["Next.js", "Tailwind", "Vercel"],
    role: ["기획", "디자인", "개발", "배포"],
    duration: "2일",
    client: "chueok-korea",
    links: {
      live: "https://chueok-korea.vercel.app",
      github: "https://github.com/johnjung88/chueok-korea",
      case: "/portfolio/chueok-korea",
    },
    responsivePreview: {
      desktop: "/portfolio/chueok-korea/live.png",
      mobile: "/portfolio/chueok-korea/mobile-preview.png",
    },
    cover: "/portfolio/chueok-korea/live.png",
    gallery: ["/portfolio/chueok-korea/live.png", "/portfolio/chueok-korea/mobile-preview.png"],
    size: "md",
    featured: true,
    publishedAt: "2026-02-21",
  },
  {
    id: "aio-design-agency",
    slug: "aio-design-agency",
    type: "web",
    subtype: "homepage-detail",
    visibility: "public",
    proofType: "live-link",
    mediaPolicy: "external-link",
    title: { ko: "AIO 포트폴리오 사이트", en: "AIO Portfolio Site" },
    summary: {
      ko: "외주 의뢰자가 서비스 범위, 실제 결과물, 가격, 견적 문의를 한 번에 비교하고 상담 여부를 결정할 수 있는 포트폴리오 사이트입니다.",
      en: "AIO's sales portfolio site where visitors can review services, proof, pricing, and quote flow in one place.",
    },
    problem: {
      ko: "고객이 의뢰 전 확인해야 하는 작업 범위, 실제 사례, 가격 기준이 흩어져 있으면 상담 전환이 느려집니다.",
      en: "When scope, proof, and pricing are scattered, potential clients take longer to move into consultation.",
    },
    solution: {
      ko: "7개 서비스 카테고리, 실제 결과물, 가격표, 견적 문의 흐름을 이어 방문자가 필요한 정보를 빠르게 찾도록 구성합니다.",
      en: "Seven service categories, real project proof, pricing, and a structured quote form are connected for fast client review.",
    },
    impact: {
      ko: "방문자는 서비스 종류, 실제 사례, 가격, 문의 방법을 한 번에 보고 상담 전 의사결정 시간을 줄입니다.",
      en: "Visitors can review services, proof, pricing, and inquiry options in one place, reducing decision time before consultation.",
    },
    deliverables: [
      { ko: "한·영 라우팅", en: "Korean/English routing" },
      { ko: "PC·모바일 포트폴리오 상세", en: "Desktop and mobile portfolio details" },
      { ko: "서비스·가격·견적 문의 구조", en: "Services, pricing, and quote inquiry structure" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    role: ["기획", "디자인", "개발", "배포"],
    duration: "3일",
    client: "자체 프로젝트",
    links: {
      live: "https://ai-design-agency.vercel.app",
      github: "https://github.com/johnjung88/ai-design-agency",
      case: "/portfolio/aio-design-agency",
    },
    responsivePreview: {
      desktop: "/portfolio/aio-design-agency/preview.png",
      mobile: "/portfolio/aio-design-agency/mobile-preview.png",
    },
    cover: "/portfolio/aio-design-agency/preview.png",
    gallery: ["/portfolio/aio-design-agency/preview.png", "/portfolio/aio-design-agency/mobile-preview.png"],
    size: "lg",
    featured: true,
    publishedAt: "2026-04-29",
  },
  {
    id: "v-aio-website",
    slug: "v-aio-website",
    type: "web",
    subtype: "homepage-detail",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "V-AIO 비자 서비스 웹사이트", en: "V-AIO Visa Service Website" },
    summary: {
      ko: "E-7/E-9 비자 상담 고객이 서비스 흐름을 이해하고 문의까지 이동할 수 있도록 정리한 웹사이트 결과 화면입니다.",
      en: "A private website result screen designed to help E-7/E-9 visa clients understand the service and move into inquiry.",
    },
    problem: {
      ko: "비자 서비스는 절차가 복잡해 처음 방문한 상담 고객이 대상, 진행 순서, 상담 방법을 빠르게 이해해야 문의로 이어집니다.",
      en: "Visa services are complex, so first-time visitors need to quickly understand eligibility, process, and consultation options.",
    },
    solution: {
      ko: "서비스 소개, E-7/E-9 상담 CTA, 진행 프로세스, 운영 화면 연결 흐름을 한 웹 경험 안에 정리합니다.",
      en: "Service explanation, E-7/E-9 inquiry CTA, process guide, and admin handoff are organized into one web experience.",
    },
    impact: {
      ko: "방문자는 복잡한 비자 절차를 한눈에 이해하고, 상담이 필요한 지점을 빠르게 찾아 문의합니다.",
      en: "Visitors can understand the complex visa process at a glance and quickly find where to request consultation.",
    },
    deliverables: [
      { ko: "PC·모바일 서비스 화면", en: "Desktop and mobile service screens" },
      { ko: "E-7/E-9 상담 전환 동선", en: "E-7/E-9 consultation conversion flow" },
      { ko: "상담 운영 화면 연결 구조", en: "Consultation operations handoff structure" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    role: ["기획", "웹 UI", "개발", "운영 구조"],
    duration: "5일+",
    client: "비공개 결과물",
    links: { live: null, github: null, case: "/portfolio/v-aio-website" },
    responsivePreview: {
      desktop: "/portfolio/v-aio-website/live.png",
      mobile: "/portfolio/v-aio-website/mobile-preview.png",
    },
    cover: "/portfolio/v-aio-website/live.png",
    gallery: [
      "/portfolio/v-aio-website/live.png",
      "/portfolio/v-aio-website/mobile-preview.png",
      "/portfolio/v-aio-admin/dashboard.png",
      "/portfolio/v-aio-admin/chatbot.png",
    ],
    size: "lg",
    featured: true,
    publishedAt: "2026-04-28",
  },
  {
    id: "t-aio",
    slug: "t-aio",
    type: "automation",
    subtype: "automation-standard",
    visibility: "public",
    proofType: "live-link",
    mediaPolicy: "rich-gallery",
    title: { ko: "T-AIO Threads 마케팅 자동화", en: "T-AIO Threads Marketing Automation" },
    summary: {
      ko: "콘텐츠 생성, 예약 발행, 분석 흐름을 하나로 묶은 공개 자동화 사례.",
      en: "A public automation case combining content creation, scheduling, and analytics.",
    },
    problem: { ko: "SNS 운영은 작성, 예약, 성과 확인이 반복되어 매일 많은 시간이 들어갑니다.", en: "Daily SNS operations required repetitive manual time." },
    solution: { ko: "작성, 예약, 성과 확인 흐름을 한 화면으로 이어 반복 운영 시간을 줄이는 구조입니다.", en: "Built an operations pipeline connecting writing, scheduling, and analytics." },
    impact: { ko: "운영자는 매일 반복하던 콘텐츠 관리 시간을 줄이고, 예약 발행과 성과 확인을 더 안정적으로 처리합니다.", en: "A public automation proof that significantly reduces daily ops time." },
    deliverables: [
      { ko: "운영 현황 화면", en: "Dashboard screen" },
      { ko: "예약 발행 흐름", en: "Scheduling flow" },
      { ko: "분석 리포트 구조", en: "Analytics report structure" },
    ],
    kpis: [{ value: "80", unit: "%", label: { ko: "운영 시간 절감", en: "Ops time saved" } }],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    role: ["기획", "개발", "배포", "운영"],
    duration: "5일",
    client: "자체 프로젝트",
    links: {
      live: "https://t-aio.vercel.app",
      github: "https://github.com/johnjung88/t-aio",
      case: "/portfolio/t-aio",
    },
    cover: "/portfolio/t-aio/live.png",
    gallery: ["/portfolio/t-aio/live.png", "/portfolio/t-aio/cover.svg"],
    size: "md",
    featured: true,
    publishedAt: "2026-03-10",
  },
  {
    id: "blogautopilot-multinational",
    slug: "blogautopilot-multinational",
    type: "automation",
    subtype: "automation-advanced",
    visibility: "private-result",
    proofType: "video",
    mediaPolicy: "rich-gallery",
    title: {
      ko: "BlogAutoPilot 8개국 콘텐츠 자동화",
      en: "BlogAutoPilot 8-Country Content Automation",
    },
    summary: {
      ko: "8개국·18계정·55스케줄을 운영하는 콘텐츠 자동화 결과 화면 중심 사례.",
      en: "A result-focused case for a private system operating 8 countries, 18 accounts, and 55 schedules.",
    },
    problem: {
      ko: "여러 국가와 계정의 콘텐츠 운영을 수동으로 관리하기 어려웠습니다.",
      en: "Managing content across multiple countries and accounts manually was not scalable.",
    },
    solution: {
      ko: "수집, 작성, 발행, 스케줄, 모니터링 흐름을 분리해 운영자가 현재 상태를 빠르게 읽도록 구성합니다.",
      en: "Separated collection, writing, publishing, scheduling, and monitoring into an operable system.",
    },
    impact: {
      ko: "운영 담당자는 민감한 계정 정보를 노출하지 않고도 자동화 규모, 발행 흐름, 처리 지표를 보고 도입 범위를 정합니다.",
      en: "Only sanitized result screens and KPIs are shown, so sensitive operating details stay private.",
    },
    resultSummary: {
      ko: "계정명과 민감 데이터는 가리고, 운영 화면과 지표만으로 실제 적용 방식과 관리 난이도를 파악합니다.",
      en: "Because this is private, account names and sensitive data are masked in demo screens.",
    },
    deliverables: [
      { ko: "운영 현황 화면", en: "Operations dashboard" },
      { ko: "스케줄러 및 발행 로그", en: "Scheduler and publishing logs" },
      { ko: "운영 가이드", en: "Operations guide" },
    ],
    kpis: [
      { value: "8", unit: "개국", label: { ko: "글로벌 커버", en: "Countries" } },
      { value: "18", unit: "계정", label: { ko: "통합 운영", en: "Accounts" } },
      { value: "55", unit: "개", label: { ko: "동시 스케줄", en: "Schedules" } },
      { value: "68/68", unit: "", label: { ko: "테스트 통과", en: "Tests passing" } },
    ],
    stack: ["Python", "Scheduler", "Database", "Content Ops"],
    role: ["기획", "아키텍처", "개발", "운영"],
    duration: "5일+",
    client: "비공개 결과물",
    links: {
      live: null,
      github: null,
      case: "/portfolio/blogautopilot-multinational",
      video: "/portfolio/blogautopilot-multinational/blogautopilot-proof.mp4",
      architecture: "/portfolio/blogautopilot-multinational/cover.svg",
    },
    cover: "/portfolio/blogautopilot-multinational/published-post-ko.png",
    gallery: [
      "/portfolio/blogautopilot-multinational/published-post-ko.png",
      "/portfolio/blogautopilot-multinational/published-post-us.png",
      "/portfolio/blogautopilot-multinational/live-run-affiliate.jpg",
      "/portfolio/blogautopilot-multinational/live-run-proof.svg",
    ],
    size: "lg",
    featured: true,
    publishedAt: "2026-04-01",
  },
  {
    id: "youtube-autopilot",
    slug: "youtube-autopilot",
    type: "automation",
    subtype: "automation-standard",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "YouTube AutoPilot 영상 자동화 운영 시스템", en: "YouTube AutoPilot Video Automation Pipeline" },
    summary: {
      ko: "대본, 음성, 렌더, 업로드 흐름을 묶은 영상 자동화 및 앱 결과물.",
      en: "A private automation/app workflow covering script, voice, render, and upload steps.",
    },
    problem: {
      ko: "영상 제작과 업로드 과정이 여러 화면에 흩어져 반복 비용이 컸습니다.",
      en: "Video production and upload steps were scattered and repetitive.",
    },
    solution: {
      ko: "대본 작성부터 영상 생성, 업로드 준비까지의 단계를 한 운영 흐름으로 묶어 상태가 바로 보이게 합니다.",
      en: "Connected dashboard, pipeline, rendering, and upload screens into one workflow.",
    },
    impact: {
      ko: "운영 담당자는 민감한 내부 정보 없이도 대본, 렌더, 업로드 준비 단계를 보고 자동화할 업무 범위를 정합니다.",
      en: "Code remains private; result screens and workflow are used as automation/app proof.",
    },
    deliverables: [
      { ko: "영상 제작 흐름 화면", en: "Pipeline dashboard" },
      { ko: "영상 렌더 화면", en: "Video render screen" },
      { ko: "운영 설정 화면", en: "Operations settings screen" },
    ],
    stack: ["Next.js", "Remotion", "Supabase", "Video Pipeline"],
    role: ["기획", "개발", "영상 워크플로"],
    duration: "진행 중",
    client: "비공개 결과물",
    links: { live: null, github: null, case: "/portfolio/youtube-autopilot" },
    cover: "/portfolio/youtube-autopilot/cover.svg",
    gallery: ["/portfolio/youtube-autopilot/cover.svg"],
    size: "md",
    featured: false,
    publishedAt: "2026-04-28",
  },
  {
    id: "koready",
    slug: "koready",
    type: "app",
    subtype: "mvp-basic",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "KoReady 국어 교육 앱 MVP", en: "KoReady Korean Education App MVP" },
    summary: {
      ko: "학습 진도, 퀴즈, 어휘 카드 흐름을 갖춘 앱 MVP 결과물.",
      en: "A mobile MVP with progress, quiz, and vocabulary card flows.",
    },
    problem: { ko: "앱 아이디어 검토 단계에서는 가입, 학습, 퀴즈 흐름이 실제 화면처럼 보여야 의사결정이 빨라집니다.", en: "A quick mobile app was needed for idea validation." },
    solution: { ko: "온보딩, 홈, 학습 진도, 퀴즈 화면을 중심으로 사용자가 앱을 어떻게 이동하는지 먼저 보여줍니다.", en: "Built an MVP around core screens and packaged it as app proof." },
    impact: { ko: "의뢰자는 출시 전에도 핵심 화면과 사용 동선을 보고 MVP 제작 범위와 우선순위를 결정합니다.", en: "Can be used as app portfolio proof even before store submission." },
    deliverables: [
      { ko: "온보딩·홈·퀴즈 화면", en: "Onboarding, home, and quiz screens" },
      { ko: "학습 진도 구조", en: "Learning progress structure" },
    ],
    stack: ["React Native", "TypeScript", "Supabase"],
    role: ["기획", "디자인", "개발"],
    duration: "5일",
    client: "비공개 결과물",
    links: { live: null, github: null, case: "/portfolio/koready", storeIos: null, storeAndroid: null },
    cover: "/portfolio/koready/cover.svg",
    gallery: ["/portfolio/koready/cover.svg"],
    size: "md",
    featured: false,
    publishedAt: "2026-02-27",
  },
  {
    id: "v-aio-chatbot",
    slug: "v-aio-chatbot",
    type: "automation",
    subtype: "chatbot",
    visibility: "private-result",
    proofType: "screenshots",
    mediaPolicy: "rich-gallery",
    title: { ko: "V-AIO 관리자·챗봇 운영 시스템", en: "V-AIO Admin & Chatbot Operations System" },
    summary: {
      ko: "E-7/E-9 비자 상담, 관리자 대시보드, VisaBot 챗봇, API/DB 운영 흐름을 영상으로 정리한 자동화 사례.",
      en: "A video proof case connecting E-7/E-9 consultations, admin dashboards, VisaBot, APIs, and DB operations.",
    },
    problem: {
      ko: "상담 문의, 비자 타입, 기업/근로자 상태, 서류 확인이 흩어져 있어 운영자가 한 화면에서 관리하기 어려웠습니다.",
      en: "Consultations, visa types, company/worker status, and documents were scattered across the workflow.",
    },
    solution: {
      ko: "상담 접수, 기업 진단, 서류 상태, 챗봇 응답, API와 DB 상태를 한 운영 화면 안에서 이어지게 구성합니다.",
      en: "Built admin dashboards and consultation management screens, then connected a VisaBot chat flow aware of E-7/E-9 context.",
    },
    impact: {
      ko: "운영자는 상담 현황과 챗봇 응답, 비자 진행 단계, DB 상태를 함께 보며 반복 안내와 관리 누락을 줄입니다.",
      en: "Sensitive operating details are removed, while admin screens, chatbot screens, and feature structure remain reviewable.",
    },
    kpis: [
      { value: "E-7/E-9", unit: "", label: { ko: "비자 타입 대응", en: "Visa type coverage" } },
      { value: "9", unit: "개", label: { ko: "관리 메뉴 구조", en: "Admin menu modules" } },
      { value: "3", unit: "개", label: { ko: "API/DB 연동 축", en: "API/DB layers" } },
    ],
    deliverables: [
      { ko: "운영 현황 화면", en: "Operations dashboard" },
      { ko: "상담 문의 관리", en: "Consultation management" },
      { ko: "VisaBot 챗봇 화면", en: "VisaBot chatbot screen" },
      { ko: "API·DB·업무 로직 구조도", en: "API, DB, and workflow logic map" },
      { ko: "기업 진단·비자 신청·서류 관리 흐름", en: "Company check, application, and document flow" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI API", "n8n", "Chat Workflow"],
    role: ["기획", "관리자 UI", "챗봇 흐름", "운영 설계"],
    duration: "5일+",
    client: "비공개 결과물",
    links: {
      live: null,
      github: null,
      case: "/portfolio/v-aio-chatbot",
      video: "/portfolio/v-aio-admin/v-aio-admin-proof.mp4",
    },
    cover: "/portfolio/v-aio-admin/dashboard.png",
    gallery: [
      "/portfolio/v-aio-admin/dashboard.png",
      "/portfolio/v-aio-admin/chatbot.png",
      "/portfolio/v-aio-admin/admin-module-map.svg",
      "/portfolio/v-aio-admin/logic-api-db.svg",
      "/portfolio/v-aio-admin/masked-db-table.svg",
      "/portfolio/v-aio-chatbot/cover.svg",
    ],
    size: "lg",
    featured: true,
    publishedAt: "2026-04-28",
  },
];

export function getPortfolioProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): PortfolioProject[] {
  const featured = portfolioProjects.filter((p) => p.featured);
  const featuredIds = new Set(featured.map((p) => p.id));
  const supplemental = portfolioProjects.filter(
    (p) =>
      !featuredIds.has(p.id) &&
      p.cover &&
      p.cover !== "/portfolio/placeholder.svg" &&
      !p.cover.endsWith(".svg")
  );

  return [...featured, ...supplemental].slice(0, 9);
}

export function getProjectsByType(type: PortfolioType): PortfolioProject[] {
  return portfolioProjects.filter((p) => p.type === type);
}

export function getPortfolioGroup(project: PortfolioProject): PortfolioGroup {
  if (project.subtype === "shopping-mall") {
    return "shopping-mall";
  }
  if (project.subtype === "ppt") {
    return "ppt-design";
  }
  if (project.subtype === "detail-page") {
    return "detail-page";
  }
  if (["logo", "business-card", "card-news", "infographic"].includes(project.subtype ?? "")) {
    return "logo-business-card";
  }
  if (project.type === "video") {
    return "video-content";
  }
  if (project.type === "app" || project.type === "automation") {
    return "automation-app";
  }
  return "website";
}

export function getProjectsByPortfolioGroup(group: PortfolioGroup): PortfolioProject[] {
  return portfolioProjects.filter((project) => getPortfolioGroup(project) === group);
}

export function formatProjectDuration(duration: string, locale: "ko" | "en"): string {
  if (locale === "ko") return duration;

  if (duration === "진행 중") return "In progress";
  if (duration === "12종 완료") return "12 done";

  return duration
    .replaceAll("일", "d")
    .replaceAll("종", " designs")
    .replaceAll("완료", "done")
    .replaceAll("개국", " countries")
    .replaceAll("계정", " accounts")
    .replaceAll("개", "");
}
