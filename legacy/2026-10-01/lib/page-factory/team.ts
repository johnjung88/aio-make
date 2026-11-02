export type FactoryRole = "client" | "planner" | "designer" | "copywriter" | "reviewer";

export type FactoryColumnId =
  | "brief"
  | "strategy"
  | "design"
  | "copy"
  | "feedback"
  | "review"
  | "done";

export type FactoryTaskStatus = "queued" | "working" | "needs-revision" | "approved" | "done";

export type FactoryComment = {
  id: string;
  authorRole: FactoryRole;
  authorName: string;
  targetRole?: FactoryRole;
  tone: "handoff" | "feedback" | "revision" | "approval";
  message: string;
};

export type FactoryDeliverable = {
  title: string;
  items: string[];
};

export type FactoryLearningMemory = {
  categoryKey: string;
  categoryLabel: string;
  dbReadyFields: string[];
  portfolioRecord: string[];
  reusableInsights: string[];
  nextRunSignals: string[];
};

export type FactoryTask = {
  id: string;
  columnId: FactoryColumnId;
  title: string;
  ownerRole: FactoryRole;
  status: FactoryTaskStatus;
  summary: string;
  receivedFrom: FactoryRole | "start";
  handoffTo: FactoryRole | "finish";
  inputBrief: string[];
  workLog: string[];
  handoffOutput: string[];
  deliverables: FactoryDeliverable[];
  comments: FactoryComment[];
  revisionRequests: string[];
  resolvedRequests: string[];
  approved: boolean;
};

export type FactoryProject = {
  id: string;
  title: string;
  brief: string;
  productName: string;
  brandName: string;
  targetChannel: string;
  currentColumnId: FactoryColumnId;
  humanApproval: "waiting-brief" | "running" | "ready-for-final" | "approved";
  rolesApproved: Record<Exclude<FactoryRole, "client">, boolean>;
  tasks: FactoryTask[];
  finalHtml: string;
  promptBoard: string;
  reviewReport: string;
  learningMemory: FactoryLearningMemory;
  usedFallback: boolean;
};

export type FactoryRunInput = {
  brief: string;
  productInfo?: string;
  references?: string;
  targetChannel?: string;
  brandName?: string;
  productName?: string;
  category?: string;
  categoryLabel?: string;
  subCategory?: string;
  packageTier?: string;
  deliveryFormat?: string;
  deliveryFormatLabel?: string;
  targetAge?: string;
  brandTone?: string;
  visualStyle?: string;
};

type ProjectSeed = {
  brandName: string;
  productName: string;
  categoryKey: string;
  categoryLabel: string;
  subCategory: string;
  packageTier: string;
  target: string;
  usp: string;
  proof: string;
  channel: string;
  deliveryFormat: string;
  brief: string;
};

const roleLabels: Record<FactoryRole, string> = {
  client: "사용자",
  planner: "기획/마케터 AI",
  designer: "디자이너 AI",
  copywriter: "카피라이터 AI",
  reviewer: "검수자 AI",
};

export async function runFactoryTeam(input: FactoryRunInput): Promise<FactoryProject> {
  const localProject = createLocalFactoryProject(input);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return localProject;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
        max_tokens: 5000,
        temperature: 0.35,
        system:
          "You are an AI ecommerce detail-page production team. Return only valid JSON matching the provided local_reference shape. Keep all keys. Write Korean output. Each task must show the real handoff chain: receivedFrom, inputBrief, workLog, handoffOutput, handoffTo. Planner output must become designer input, designer output must become copywriter input, copywriter output must become reviewer input. Also keep learningMemory for DB-ready category learning, portfolio records, reusable insights, and next-run signals.",
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              input,
              local_reference: localProject,
            }),
          },
        ],
      }),
    });

    if (!response.ok) return localProject;

    const json = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = json.content?.find((item) => item.type === "text")?.text;
    const parsed = parseProject(text);

    return parsed ? normalizeProject(parsed, localProject) : localProject;
  } catch {
    return localProject;
  }
}

export function createLocalFactoryProject(input: FactoryRunInput): FactoryProject {
  const seed = makeSeed(input);
  const tasks: FactoryTask[] = [
    {
      id: "brief-intake",
      columnId: "brief",
      title: "브리프 접수 및 작업 범위 고정",
      ownerRole: "client",
      status: "done",
      summary: `${seed.brandName} / ${seed.productName} 상세페이지 제작 요청을 접수했습니다.`,
      receivedFrom: "start",
      handoffTo: "planner",
      inputBrief: ["브랜드/상품 기본 정보", "카테고리/세부 카테고리", "타겟 고객", "USP와 증빙 자료", "목표 채널/납품 형식"],
      workLog: ["사용자가 세부 입력 폼을 작성", "DB 저장 필드와 제작용 브리프를 분리", "AI 제작팀이 사용할 작업 범위를 고정"],
      handoffOutput: ["기획/마케터 AI가 전략을 세울 수 있는 구조화 브리프", "카테고리 학습 메모리에 누적할 분류값"],
      deliverables: [
        {
          title: "접수 정보",
          items: [
            `브랜드: ${seed.brandName}`,
            `상품: ${seed.productName}`,
            `카테고리: ${seed.categoryLabel} / ${seed.subCategory}`,
            `제작 등급: ${seed.packageTier}`,
            `채널: ${seed.channel}`,
            `납품 형식: ${seed.deliveryFormat}`,
            `초기 타겟: ${seed.target}`,
          ],
        },
      ],
      comments: [
        comment("client", "approval", "최초 브리프를 제출했습니다. 중간 제작은 AI 제작팀이 진행합니다."),
        comment("planner", "handoff", "브랜드 기준과 구매 설득 구조부터 정리하겠습니다.", "client"),
      ],
      revisionRequests: [],
      resolvedRequests: [],
      approved: true,
    },
    {
      id: "strategy-map",
      columnId: "strategy",
      title: "기획/전략 설계",
      ownerRole: "planner",
      status: "approved",
      summary: "브랜드 통일성, 타겟, USP, 섹션 흐름을 확정했습니다.",
      receivedFrom: "client",
      handoffTo: "designer",
      inputBrief: [`원본 브리프: ${seed.brandName} / ${seed.productName}`, `카테고리 학습 기준: ${seed.categoryLabel}`, `초기 타겟: ${seed.target}`, `초기 USP: ${seed.usp}`],
      workLog: ["타겟 고객의 구매 전 망설임 정리", "상품 소구포인트 우선순위 결정", "상세페이지 섹션 설득 흐름 설계"],
      handoffOutput: ["Hero에서 강조할 고객 문제와 대표 소구", "디자인이 따라야 할 브랜드 톤", "섹션별 정보 우선순위"],
      deliverables: [
        {
          title: "마케팅 전략",
          items: [
            `핵심 타겟: ${seed.target}`,
            `대표 소구: ${seed.usp}`,
            `구매 전 불안 해소 근거: ${seed.proof}`,
            "섹션 흐름: 문제 공감 -> 해결 제안 -> 근거 -> 사용 장면 -> CTA",
          ],
        },
        {
          title: "브랜드 기준",
          items: ["톤: 신뢰감, 명확함, 과장 없는 설득", "표현 기준: 숫자는 근거와 함께 사용", "CTA는 구매 직전 행동 하나만 남김"],
        },
      ],
      comments: [
        comment("planner", "handoff", "디자인은 첫 화면에서 제품명보다 고객 문제와 대표 소구가 먼저 보이게 잡아주세요.", "designer"),
        comment("designer", "feedback", "Hero에서 텍스트 밀도가 높으면 모바일 가독성이 떨어질 수 있어 시각 블록을 3개 이하로 제한하겠습니다.", "planner"),
      ],
      revisionRequests: [],
      resolvedRequests: ["타겟과 USP 우선순위 확정"],
      approved: true,
    },
    {
      id: "visual-direction",
      columnId: "design",
      title: "디자인 방향 및 이미지 슬롯 설계",
      ownerRole: "designer",
      status: "approved",
      summary: "상세페이지 레이아웃, 이미지/GIF 슬롯, 프롬프트 방향을 잡았습니다.",
      receivedFrom: "planner",
      handoffTo: "copywriter",
      inputBrief: ["기획/마케터가 확정한 타겟과 USP", "섹션 설득 흐름", "브랜드 톤과 금지 표현 기준"],
      workLog: ["모바일 우선 화면 밀도 결정", "섹션별 이미지/GIF 슬롯 배치", "카피 길이와 CTA 위치 제한"],
      handoffOutput: ["섹션별 시각 우선순위", "카피라이터가 지켜야 할 문장 길이", "이미지 프롬프트 생성 기준"],
      deliverables: [
        {
          title: "디자인 시스템",
          items: ["밝은 배경, 높은 대비, 제품 정보는 카드형 블록", "모바일 720px 기준으로 섹션 길이와 CTA 간격 설계", "Hero, 근거, 사용 장면, 후기 섹션에 이미지 우선 배치"],
        },
        {
          title: "이미지/GIF 슬롯",
          items: ["Hero 제품 연출", "문제 상황 컷", "원료/성분 클로즈업", "사용법 3컷", "후기/인증 보강 이미지", "스크롤 전환용 짧은 GIF 1개"],
        },
      ],
      comments: [
        comment("designer", "handoff", "카피는 한 섹션당 제목 18자 안팎, 본문은 2문장 이내로 맞춰주세요.", "copywriter"),
        comment("copywriter", "feedback", "좋습니다. CTA는 마지막 섹션 외에는 보조 CTA로 낮추겠습니다.", "designer"),
      ],
      revisionRequests: [],
      resolvedRequests: ["Hero 카피 길이 제한 반영"],
      approved: true,
    },
    {
      id: "sales-copy",
      columnId: "copy",
      title: "카피 작성 및 전환 문구 정리",
      ownerRole: "copywriter",
      status: "approved",
      summary: "후킹, 섹션별 카피, CTA를 구매 전환 관점으로 작성했습니다.",
      receivedFrom: "designer",
      handoffTo: "reviewer",
      inputBrief: ["디자이너가 제한한 Hero 텍스트 길이", "이미지 슬롯별 목적", "섹션별 CTA 노출 기준"],
      workLog: ["후킹 문구 작성", "섹션별 제목/본문/CTA 작성", "근거 없는 강한 표현 제거"],
      handoffOutput: ["검수자가 확인할 최종 카피", "숫자/인증 표현 목록", "CTA와 구매 전환 문구"],
      deliverables: [
        {
          title: "핵심 카피",
          items: [
            `Hero: ${seed.productName}, 선택 기준부터 다릅니다`,
            `문제 공감: ${seed.target}이 망설이는 이유를 먼저 해결합니다`,
            `근거 카피: ${seed.proof}`,
            "CTA: 지금 상세 구성 확인하기",
          ],
        },
        {
          title: "섹션 카피 흐름",
          items: ["0.3초 후킹", "고객 문제", "제품 해결책", "USP 근거", "사용 장면", "구매 전 확인", "최종 CTA"],
        },
      ],
      comments: [
        comment("copywriter", "handoff", "검수 단계에서는 금지 표현과 숫자 근거가 맞는지 먼저 확인해주세요.", "reviewer"),
        comment("reviewer", "revision", "숫자 표현은 근거 이미지나 인증 문구가 없으면 약하게 바꿔야 합니다.", "copywriter"),
      ],
      revisionRequests: [],
      resolvedRequests: ["숫자/인증 표현에는 출처 표기 필요", "CTA 과다 노출 제거"],
      approved: true,
    },
    {
      id: "team-feedback",
      columnId: "feedback",
      title: "상호 피드백 반영",
      ownerRole: "planner",
      status: "done",
      summary: "기획, 디자인, 카피 간 충돌 지점을 정리하고 수정요청을 반영했습니다.",
      receivedFrom: "copywriter",
      handoffTo: "reviewer",
      inputBrief: ["디자이너의 모바일 가독성 피드백", "카피라이터의 CTA 조정 결과", "검수자가 예고한 숫자 근거 이슈"],
      workLog: ["역할 간 충돌 지점 정리", "Hero 텍스트 길이 조정", "숫자/인증 표현 출처 표기"],
      handoffOutput: ["최종 검수자가 확인할 통합 산출물", "해결된 수정요청 목록"],
      deliverables: [
        {
          title: "반영 사항",
          items: ["Hero 텍스트 3블록 제한", "근거 없는 최상급 표현 제외", "이미지 슬롯별 목적 명시", "모바일 우선 섹션 길이 조정"],
        },
      ],
      comments: [
        comment("planner", "approval", "디자인/카피 피드백을 반영해 최종 검수로 넘깁니다.", "reviewer"),
        comment("designer", "approval", "모바일에서 읽히는 밀도로 정리됐습니다.", "reviewer"),
        comment("copywriter", "approval", "카피와 CTA 흐름 승인합니다.", "reviewer"),
      ],
      revisionRequests: [],
      resolvedRequests: ["숫자/인증 표현 출처 표기", "Hero 텍스트 길이 조정"],
      approved: true,
    },
    {
      id: "final-review",
      columnId: "review",
      title: "최종 검수",
      ownerRole: "reviewer",
      status: "approved",
      summary: "오탈자, 금지 표현, 근거 누락, 이미지 슬롯 누락을 검수했습니다.",
      receivedFrom: "planner",
      handoffTo: "finish",
      inputBrief: ["통합된 기획/디자인/카피 산출물", "해결된 수정요청 목록", "이미지/GIF 슬롯 목적"],
      workLog: ["오탈자와 문장 이상 여부 확인", "금지 표현과 과장 표현 확인", "이미지/GIF 누락 여부 확인"],
      handoffOutput: ["사용자 최종 승인을 받을 납품 후보", "검수 리포트", "Export 가능 조건"],
      deliverables: [
        {
          title: "검수 결과",
          items: ["오탈자 이상 없음", "금지 표현 없음", "이미지/GIF 슬롯 목적 확인", "납품 전 사용자 최종 승인 필요"],
        },
      ],
      comments: [
        comment("reviewer", "approval", "모든 역할 산출물이 승인됐습니다. 최종 결과물 확인 후 납품 승인만 남았습니다.", "client"),
      ],
      revisionRequests: [],
      resolvedRequests: ["검수 수정요청 모두 해결"],
      approved: true,
    },
    {
      id: "delivery-package",
      columnId: "done",
      title: "납품 패키지 준비",
      ownerRole: "reviewer",
      status: "done",
      summary: "상세페이지 HTML, 이미지 프롬프트, 검수 리포트를 준비했습니다.",
      receivedFrom: "reviewer",
      handoffTo: "finish",
      inputBrief: ["최종 검수 승인", "사용자 최종 승인 대기 상태"],
      workLog: ["HTML 납품 코드 준비", "이미지/GIF 프롬프트 보드 정리", "검수 리포트 패키징"],
      handoffOutput: ["상세페이지 HTML", "이미지/GIF 프롬프트", "검수 리포트"],
      deliverables: [
        {
          title: "납품물",
          items: ["상세페이지 HTML", "이미지/GIF 프롬프트 보드", "최종 검수 리포트", "섹션별 납품 체크리스트"],
        },
      ],
      comments: [comment("reviewer", "handoff", "사용자 최종 승인 후 Export 가능합니다.", "client")],
      revisionRequests: [],
      resolvedRequests: [],
      approved: true,
    },
  ];

  return {
    id: `factory-${Date.now()}`,
    title: `${seed.brandName} ${seed.productName} 상세페이지`,
    brief: seed.brief,
    productName: seed.productName,
    brandName: seed.brandName,
    targetChannel: seed.channel,
    currentColumnId: "done",
    humanApproval: "ready-for-final",
    rolesApproved: {
      planner: true,
      designer: true,
      copywriter: true,
      reviewer: true,
    },
    tasks,
    finalHtml: buildHtml(seed),
    promptBoard: buildPromptBoard(seed),
    reviewReport: buildReviewReport(seed),
    learningMemory: buildLearningMemory(seed),
    usedFallback: true,
  };
}

function makeSeed(input: FactoryRunInput): ProjectSeed {
  const text = [input.brief, input.productInfo, input.references].filter(Boolean).join("\n");
  const pick = (patterns: RegExp[], fallback: string) => {
    for (const pattern of patterns) {
      const matched = text.match(pattern);
      if (matched?.[1]) return matched[1].trim().slice(0, 80);
    }
    return fallback;
  };

  const brandName = input.brandName?.trim() || pick([/브랜드명?\s*[:：]\s*([^\n]+)/i, /브랜드\s*[:：]\s*([^\n]+)/i], "AIO 브랜드");
  const productName = input.productName?.trim() || pick([/상품명?\s*[:：]\s*([^\n]+)/i, /제품명?\s*[:：]\s*([^\n]+)/i], "대표 상품");
  const target = pick([/타겟\s*[:：]\s*([^\n]+)/i, /고객\s*[:：]\s*([^\n]+)/i], "구매 전 비교가 많은 고객");
  const usp = pick([/USP\s*[:：]\s*([^\n]+)/i, /소구\s*[:：]\s*([^\n]+)/i], "명확한 차별점과 확인 가능한 근거");
  const proof = pick([/근거\s*[:：]\s*([^\n]+)/i, /인증\s*[:：]\s*([^\n]+)/i], "상세페이지 내 증빙 이미지와 수치 기준");

  return {
    brandName,
    productName,
    categoryKey: input.category?.trim() || "other",
    categoryLabel: input.categoryLabel?.trim() || pick([/카테고리\s*[:：]\s*([^\n/]+)/i], "기타"),
    subCategory: input.subCategory?.trim() || pick([/카테고리\s*[:：]\s*[^\n/]+\/\s*([^\n]+)/i], "세부 카테고리 미지정"),
    packageTier: input.packageTier?.trim() || "standard",
    target,
    usp,
    proof,
    channel: input.targetChannel?.trim() || "스마트스토어 / 카페24",
    deliveryFormat: input.deliveryFormatLabel?.trim() || input.deliveryFormat?.trim() || "HTML + 프롬프트 + 검수 리포트",
    brief: input.brief.trim(),
  };
}

function comment(
  authorRole: FactoryRole,
  tone: FactoryComment["tone"],
  message: string,
  targetRole?: FactoryRole,
): FactoryComment {
  return {
    id: `${authorRole}-${tone}-${Math.random().toString(36).slice(2, 8)}`,
    authorRole,
    authorName: roleLabels[authorRole],
    targetRole,
    tone,
    message,
  };
}

function buildHtml(seed: ProjectSeed) {
  const sections = [
    ["Hero", `${seed.productName}, 선택 기준부터 다릅니다`, `${seed.target}을 위해 ${seed.usp}을 먼저 보여줍니다.`],
    ["Problem", "구매 전 망설임을 먼저 해결합니다", "가격, 품질, 사용 장면, 근거를 한 흐름으로 정리했습니다."],
    ["Proof", "확인 가능한 근거로 설득합니다", seed.proof],
    ["Usage", "실제 사용하는 장면까지 보여줍니다", "이미지와 짧은 GIF로 사용 상황을 빠르게 이해시킵니다."],
    ["CTA", "지금 상세 구성을 확인하세요", `${seed.channel} 등록에 맞춘 최종 CTA입니다.`],
  ];

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${seed.brandName} ${seed.productName}</title>
<style>
body{margin:0;font-family:Pretendard,system-ui,sans-serif;background:#fff;color:#172033}
.page{max-width:720px;margin:0 auto}
.section{padding:86px 32px;border-bottom:1px solid #e7edf6}
.section:nth-child(even){background:#f7fbff}
.kicker{color:#156bff;font-size:13px;font-weight:900}
h1{font-size:38px;line-height:1.18;margin:12px 0 16px}
p{font-size:18px;line-height:1.72;color:#4b5a70}
.image{height:320px;border-radius:22px;background:linear-gradient(135deg,#156bff,#10a36f,#f2b84b);display:grid;place-items:center;color:#fff;font-weight:900;margin:28px 0}
.cta{display:inline-block;background:#156bff;color:#fff;border-radius:14px;padding:16px 22px;font-weight:900;text-decoration:none}
</style>
</head>
<body>
<main class="page">
${sections
  .map(
    ([kicker, title, body], index) => `<section class="section">
  <span class="kicker">${String(index + 1).padStart(2, "0")} / ${kicker}</span>
  <h1>${title}</h1>
  <div class="image">${seed.productName} ${kicker} 이미지</div>
  <p>${body}</p>
  ${index === sections.length - 1 ? '<a class="cta" href="#">구매 옵션 확인하기</a>' : ""}
</section>`,
  )
  .join("\n")}
</main>
</body>
</html>`;
}

function buildPromptBoard(seed: ProjectSeed) {
  return [
    `[Hero] ${seed.productName} premium ecommerce hero image, bright studio lighting, clear product focus, no text, no watermark`,
    `[Problem] target customer scene for ${seed.target}, clean Korean commerce visual, natural light, no text`,
    `[Proof] evidence visual for ${seed.proof}, certification or ingredient close-up, trustworthy, no text`,
    `[Usage GIF] short loop showing practical use of ${seed.productName}, 3 steps, bright background, no text`,
    `[CTA] final purchase confidence image for ${seed.channel}, clean product arrangement, no text`,
  ].join("\n\n");
}

function buildReviewReport(seed: ProjectSeed) {
  return [
    "최종 검수 리포트",
    `- 프로젝트: ${seed.brandName} ${seed.productName}`,
    `- 카테고리: ${seed.categoryLabel} / ${seed.subCategory}`,
    "- 오탈자: 이상 없음",
    "- 금지 표현: 최고/완벽/치료/예방 등 고위험 표현 제외",
    `- 근거 확인: ${seed.proof}`,
    "- 이미지/GIF: 목적별 슬롯 준비",
    "- 납품 상태: 사용자 최종 승인 대기",
  ].join("\n");
}

function buildLearningMemory(seed: ProjectSeed): FactoryLearningMemory {
  return {
    categoryKey: seed.categoryKey,
    categoryLabel: seed.categoryLabel,
    dbReadyFields: [
      "projects.brand_name",
      "projects.product_name",
      "projects.category_key",
      "projects.sub_category",
      "projects.target_channel",
      "briefs.target",
      "briefs.usp",
      "briefs.proof",
      "deliverables.final_html",
      "deliverables.prompt_board",
      "reviews.review_report",
    ],
    portfolioRecord: [
      `${seed.categoryLabel} 포트폴리오에 ${seed.brandName} ${seed.productName} 사례 저장`,
      "Hero/USP/인증/사용법/CTA 섹션 구조 저장",
      "이미지/GIF 슬롯과 프롬프트를 다음 제작 레퍼런스로 저장",
    ],
    reusableInsights: [
      `${seed.categoryLabel} 카테고리에서는 증빙 가능한 근거를 USP와 함께 저장`,
      "검수에서 걸린 표현과 해결 방식을 카테고리 금지어 룰로 누적",
      "승인된 섹션 흐름을 동일 카테고리 기본 템플릿 후보로 누적",
    ],
    nextRunSignals: [
      "같은 카테고리 신규 제작 시 이전 승인 섹션 구조 우선 제안",
      "동일 타겟층 반복 시 후킹/CTA 성과 문구 재사용 후보 표시",
      "포트폴리오 등록 후 이미지 톤과 카피 톤을 카테고리 레퍼런스로 연결",
    ],
  };
}

function parseProject(text?: string): Partial<FactoryProject> | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? text.trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Partial<FactoryProject>;
  } catch {
    return null;
  }
}

function normalizeProject(parsed: Partial<FactoryProject>, fallback: FactoryProject): FactoryProject {
  return {
    ...fallback,
    ...parsed,
    id: typeof parsed.id === "string" ? parsed.id : fallback.id,
    title: typeof parsed.title === "string" ? parsed.title : fallback.title,
    tasks: normalizeTasks(parsed.tasks, fallback.tasks),
    rolesApproved: {
      planner: Boolean(parsed.rolesApproved?.planner ?? fallback.rolesApproved.planner),
      designer: Boolean(parsed.rolesApproved?.designer ?? fallback.rolesApproved.designer),
      copywriter: Boolean(parsed.rolesApproved?.copywriter ?? fallback.rolesApproved.copywriter),
      reviewer: Boolean(parsed.rolesApproved?.reviewer ?? fallback.rolesApproved.reviewer),
    },
    finalHtml: typeof parsed.finalHtml === "string" ? parsed.finalHtml : fallback.finalHtml,
    promptBoard: typeof parsed.promptBoard === "string" ? parsed.promptBoard : fallback.promptBoard,
    reviewReport: typeof parsed.reviewReport === "string" ? parsed.reviewReport : fallback.reviewReport,
    learningMemory: parsed.learningMemory ?? fallback.learningMemory,
    usedFallback: false,
  };
}

function normalizeTasks(parsed: unknown, fallbackTasks: FactoryTask[]): FactoryTask[] {
  if (!Array.isArray(parsed) || parsed.length === 0) return fallbackTasks;

  return fallbackTasks.map((fallbackTask, index) => {
    const candidate = parsed[index] as Partial<FactoryTask> | undefined;
    if (!candidate || typeof candidate !== "object") return fallbackTask;

    return {
      ...fallbackTask,
      ...candidate,
      receivedFrom: candidate.receivedFrom ?? fallbackTask.receivedFrom,
      handoffTo: candidate.handoffTo ?? fallbackTask.handoffTo,
      inputBrief: Array.isArray(candidate.inputBrief) ? candidate.inputBrief : fallbackTask.inputBrief,
      workLog: Array.isArray(candidate.workLog) ? candidate.workLog : fallbackTask.workLog,
      handoffOutput: Array.isArray(candidate.handoffOutput) ? candidate.handoffOutput : fallbackTask.handoffOutput,
      deliverables: Array.isArray(candidate.deliverables) ? candidate.deliverables : fallbackTask.deliverables,
      comments: Array.isArray(candidate.comments) ? candidate.comments : fallbackTask.comments,
      revisionRequests: Array.isArray(candidate.revisionRequests)
        ? candidate.revisionRequests
        : fallbackTask.revisionRequests,
      resolvedRequests: Array.isArray(candidate.resolvedRequests)
        ? candidate.resolvedRequests
        : fallbackTask.resolvedRequests,
      approved: Boolean(candidate.approved ?? fallbackTask.approved),
    };
  });
}
