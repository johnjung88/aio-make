export type LeadInput = {
  id: string;
  company: string;
  domain: string;
  service: string;
  budget: number;
  contact: string;
};
export type Customer = {
  customerId: string;
  company: string;
  domain: string;
  status: "기존 고객" | "잠재고객";
  followUp?: string;
};
export type LeadResult = LeadInput & {
  normalizedDomain: string;
  customerId: string;
  score: number;
  status: "qualified" | "hold" | "duplicate" | "excluded";
  reasons: string[];
  draft: string;
};
export type LeadRules = {
  minBudget: number;
  minScore: number;
  service: string;
};

export const DEFAULT_RULES: LeadRules = {
  minBudget: 300,
  minScore: 70,
  service: "전체",
};
export const DEFAULT_MASTER: Customer[] = [
  {
    customerId: "DEMO-001",
    company: "모노 스튜디오",
    domain: "mono-studio.example",
    status: "기존 고객",
  },
  {
    customerId: "DEMO-002",
    company: "오래 상점",
    domain: "oldshop.example",
    status: "잠재고객",
    followUp: "다음 상담 일정 확인",
  },
];
export const DEFAULT_LEADS: LeadInput[] = [
  {
    id: "RAW-01",
    company: "블룸 건축사무소",
    domain: "bloom-studio.example",
    service: "웹사이트",
    budget: 700,
    contact: "hello@bloom-studio.example",
  },
  {
    id: "RAW-02",
    company: "온도 뷰티",
    domain: "ondo-beauty.example",
    service: "쇼핑몰",
    budget: 850,
    contact: "team@ondo-beauty.example",
  },
  {
    id: "RAW-03",
    company: "모노 스튜디오",
    domain: "https://www.mono-studio.example/about",
    service: "웹사이트",
    budget: 600,
    contact: "hello@mono-studio.example",
  },
  {
    id: "RAW-04",
    company: "다울 리빙",
    domain: "dawool-living.example",
    service: "자동화",
    budget: 1200,
    contact: "ops@dawool-living.example",
  },
  {
    id: "RAW-05",
    company: "작은 커피",
    domain: "little-coffee.example",
    service: "웹사이트",
    budget: 120,
    contact: "owner@little-coffee.example",
  },
  {
    id: "RAW-06",
    company: "산들 스테이",
    domain: "sandeul-stay.example",
    service: "웹사이트",
    budget: 500,
    contact: "",
  },
  {
    id: "RAW-07",
    company: "블룸 건축사무소 재수집",
    domain: "HTTPS://WWW.BLOOM-STUDIO.EXAMPLE/projects?from=raw",
    service: "웹사이트",
    budget: 700,
    contact: "hello@bloom-studio.example",
  },
  {
    id: "RAW-08",
    company: "확인이 필요한 항목",
    domain: "",
    service: "쇼핑몰",
    budget: 500,
    contact: "",
  },
];

export function normalizeDomain(value: string): string {
  const input = value.trim().toLowerCase();
  if (!input) return "";
  try {
    const url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`,
    );
    if (!["http:", "https:"].includes(url.protocol)) return "";
    const host = url.hostname.replace(/^www\./, "").replace(/\.$/, "");
    return /^[a-z\d](?:[a-z\d.-]*[a-z\d])?\.[a-z]{2,}$/i.test(host) ? host : "";
  } catch {
    return "";
  }
}

function customerId(domain: string): string {
  let hash = 2166136261;
  for (const char of domain)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `DEMO-${(hash >>> 0).toString(16).slice(0, 6).toUpperCase()}`;
}

export function processLeads(
  inputs: LeadInput[],
  master: Customer[],
  rules: LeadRules,
  guide: string,
): LeadResult[] {
  const seen = new Map(
    master.map((c) => [normalizeDomain(c.domain), c.customerId]),
  );
  return inputs.map((lead) => {
    const domain = normalizeDomain(lead.domain);
    const existing = seen.get(domain);
    const result: LeadResult = {
      ...lead,
      normalizedDomain: domain,
      customerId: existing ?? customerId(domain || lead.id),
      score: 0,
      status: "hold",
      reasons: [],
      draft: "",
    };
    if (!domain)
      return {
        ...result,
        status: "excluded",
        reasons: ["유효한 회사 도메인이 없어 담당자 확인이 필요합니다"],
      };
    if (existing)
      return {
        ...result,
        status: "duplicate",
        reasons: [
          `원장 또는 이번 RAW의 ${existing}와 같은 도메인입니다`,
          "프로토콜·www·경로를 정리해 대조했습니다",
        ],
      };
    seen.set(domain, result.customerId);
    const budgetFits = lead.budget >= rules.minBudget;
    const serviceFits =
      rules.service === "전체" || lead.service === rules.service;
    const contactFits = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.contact);
    result.score =
      10 +
      (budgetFits ? 30 : 0) +
      (serviceFits ? 40 : 0) +
      (contactFits ? 20 : 0);
    result.reasons = [
      budgetFits
        ? `예산 ${lead.budget.toLocaleString("ko-KR")}만원이 기준 ${rules.minBudget.toLocaleString("ko-KR")}만원 이상입니다`
        : `예산이 기준 ${rules.minBudget.toLocaleString("ko-KR")}만원보다 낮습니다`,
      serviceFits
        ? `${lead.service} 수요가 선별 서비스와 일치합니다`
        : `선택한 서비스 ${rules.service}와 다릅니다`,
      contactFits
        ? "컨택 초안을 연결할 이메일이 있습니다"
        : "이메일이 없어 연락 경로 확인이 필요합니다",
    ];
    result.status =
      budgetFits && contactFits && result.score >= rules.minScore
        ? "qualified"
        : "hold";
    if (result.status === "qualified") {
      result.draft = `${lead.company} 담당자님, 안녕하세요\n\n${guide.trim() || "현재 업무와 필요한 제작 범위를 먼저 확인하고, 적용 가능한 구성을 안내드립니다"}\n\n${lead.service} 제작에 관심이 있으신 경우 현재 운영 방식과 희망 범위를 알려주세요\n확인한 내용에 맞춰 다음 상담을 준비하겠습니다\n\nAIO MAKE`;
    }
    return result;
  });
}

export function addProspect(master: Customer[], lead: LeadResult): Customer[] {
  if (lead.status !== "qualified") return master;
  const domain = lead.normalizedDomain;
  const existing = master.find((c) => normalizeDomain(c.domain) === domain);
  if (existing)
    return master.map((c) =>
      c === existing
        ? { ...c, status: "잠재고객", followUp: "3일 뒤 회신 확인" }
        : c,
    );
  return [
    ...master,
    {
      customerId: lead.customerId,
      company: lead.company,
      domain,
      status: "잠재고객",
      followUp: "3일 뒤 회신 확인",
    },
  ];
}

export function csvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function leadsToCsv(leads: LeadInput[]): string {
  return [
    ["회사", "도메인", "서비스", "예산만원", "이메일"],
    ...leads.map((l) => [l.company, l.domain, l.service, l.budget, l.contact]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
}

export function parseLeadCsv(text: string): LeadInput[] {
  if (text.length > 100_000)
    throw new Error("샘플은 100KB 이하의 CSV를 사용할 수 있습니다");
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  const source = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if (char === "\n" && !quoted) {
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("CSV의 닫는 따옴표를 확인해주세요");
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2)
    throw new Error("헤더와 고객 데이터가 한 행 이상 필요합니다");
  if (rows.length > 51) throw new Error("샘플에서는 고객 50건까지 처리합니다");
  const expected = ["회사", "도메인", "서비스", "예산만원", "이메일"];
  if (!expected.every((h, i) => rows[0][i] === h))
    throw new Error(
      "헤더는 회사,도메인,서비스,예산만원,이메일 순서로 입력해주세요",
    );
  return rows.slice(1).map((r, i) => {
    if (r.length !== 5 || !r[0])
      throw new Error(`${i + 2}행의 회사명과 열 개수를 확인해주세요`);
    const budget = Number(r[3]);
    if (!Number.isFinite(budget) || budget < 0)
      throw new Error(`${i + 2}행의 예산은 0 이상의 숫자여야 합니다`);
    return {
      id: `RAW-${String(i + 1).padStart(2, "0")}`,
      company: r[0],
      domain: r[1],
      service: r[2],
      budget,
      contact: r[4],
    };
  });
}

export type CartLine = {
  productId: string;
  size: string;
  quantity: number;
  price: number;
};
export function addCartLine(lines: CartLine[], line: CartLine): CartLine[] {
  if (
    !line.size ||
    !Number.isInteger(line.quantity) ||
    line.quantity < 1 ||
    line.quantity > 5 ||
    line.price < 0
  )
    return lines;
  const existing = lines.find(
    (l) => l.productId === line.productId && l.size === line.size,
  );
  return existing
    ? lines.map((l) =>
        l === existing
          ? { ...l, quantity: Math.min(5, l.quantity + line.quantity) }
          : l,
      )
    : [...lines, { ...line }];
}
export function cartAmounts(lines: CartLine[], gift: boolean) {
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
  const shipping = subtotal === 0 || subtotal >= 200_000 ? 0 : 3_500;
  const packaging = gift && subtotal > 0 ? 5_000 : 0;
  return {
    subtotal,
    shipping,
    packaging,
    total: subtotal + shipping + packaging,
  };
}
