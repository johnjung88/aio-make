import type { ContractCategory, ContractChannel, ProjectStatus } from "@/lib/admin/contracts";
import { categories, channels, projectStatuses } from "@/lib/admin/contracts";

export type TelegramContractCommand =
  | {
      kind: "help";
    }
  | {
      kind: "create_contract";
      customerName: string;
      companyName?: string;
      email?: string;
      phone?: string;
      channel: ContractChannel;
      category: ContractCategory;
      productName: string;
      contractedAmount: number;
      paidAmount: number;
      startDate?: string;
      dueDate?: string;
      notes?: string;
    }
  | {
      kind: "update_payment";
      projectId?: string;
      customerName?: string;
      email?: string;
      phone?: string;
      paidAmount: number;
    }
  | {
      kind: "update_status";
      projectId: string;
      status: ProjectStatus;
      dueDate?: string;
    };

type ParsedFields = Record<string, string>;

const CHANNEL_ALIASES: Record<string, ContractChannel> = {
  웹사이트: "website",
  홈페이지: "website",
  사이트: "website",
  숨고: "soomgo",
  soomgo: "soomgo",
  크몽: "kmong",
  kmong: "kmong",
  위시켓: "wishket",
  wishket: "wishket",
  이랜서: "elancer",
  elancer: "elancer",
  노트폴리오: "notefolio",
  notefolio: "notefolio",
  업워크: "upwork",
  upwork: "upwork",
  contra: "contra",
  카페24: "cafe24",
  cafe24: "cafe24",
  소개: "referral",
  지인소개: "referral",
  기타: "other",
};

const CATEGORY_ALIASES: Record<string, ContractCategory> = {
  홈페이지: "website",
  웹사이트: "website",
  랜딩: "website",
  랜딩페이지: "website",
  쇼핑몰: "shop",
  카페24: "shop",
  커머스: "shop",
  로고: "logo",
  명함: "logo",
  브랜딩: "logo",
  상세: "detail",
  상세페이지: "detail",
  ppt: "ppt",
  피피티: "ppt",
  제안서: "ppt",
  사업계획서: "ppt",
  자동화: "automation",
  앱: "automation",
  mvp: "automation",
  영상: "video",
  숏폼: "video",
  패키지: "bundle",
  번들: "bundle",
  기타: "other",
};

const STATUS_ALIASES: Record<string, ProjectStatus> = {
  진행: "in_progress",
  진행중: "in_progress",
  보류: "blocked",
  블락: "blocked",
  검수: "review",
  리뷰: "review",
  완료: "completed",
  납품완료: "completed",
  취소: "canceled",
};

const LABEL_ALIASES: Record<string, string> = {
  고객: "customerName",
  고객명: "customerName",
  이름: "customerName",
  성함: "customerName",
  회사: "companyName",
  회사명: "companyName",
  채널: "channel",
  플랫폼: "channel",
  출처: "channel",
  서비스: "category",
  카테고리: "category",
  분류: "category",
  계약명: "productName",
  프로젝트: "productName",
  작업명: "productName",
  납품물: "productName",
  금액: "contractedAmount",
  계약금액: "contractedAmount",
  계약금: "contractedAmount",
  총액: "contractedAmount",
  입금: "paidAmount",
  입금액: "paidAmount",
  선입금: "paidAmount",
  받은금액: "paidAmount",
  마감: "dueDate",
  마감일: "dueDate",
  납기: "dueDate",
  납품일: "dueDate",
  시작: "startDate",
  시작일: "startDate",
  연락처: "phone",
  전화: "phone",
  전화번호: "phone",
  휴대폰: "phone",
  이메일: "email",
  메일: "email",
  메모: "notes",
  비고: "notes",
  상태: "status",
  프로젝트ID: "projectId",
  프로젝트id: "projectId",
  projectid: "projectId",
  project_id: "projectId",
};

function normalizeKey(key: string): string {
  return key.replace(/\s+/g, "").replace(/[:：]/g, "").trim();
}

function parseFields(text: string): ParsedFields {
  const fields: ParsedFields = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^:：=]+)\s*[:：=]\s*(.+)$/);
    if (!match) continue;
    const key = LABEL_ALIASES[normalizeKey(match[1])] ?? normalizeKey(match[1]);
    fields[key] = match[2].trim();
  }
  return fields;
}

export function parseWon(value?: string): number {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").replace(/\s+/g, "").toLowerCase();
  const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!numberMatch) return 0;
  const base = Number(numberMatch[1]);
  if (!Number.isFinite(base)) return 0;
  if (normalized.includes("만원") || normalized.includes("만")) return Math.round(base * 10000);
  if (normalized.includes("천")) return Math.round(base * 1000);
  return Math.round(base);
}

export function parseDateText(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const today = new Date();
  const currentYear = today.getFullYear();

  const iso = trimmed.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;

  const monthDay = trimmed.match(/(\d{1,2})\s*(?:월|[-./])\s*(\d{1,2})\s*(?:일)?/);
  if (monthDay) return `${currentYear}-${monthDay[1].padStart(2, "0")}-${monthDay[2].padStart(2, "0")}`;

  return undefined;
}

function parseChannel(value?: string): ContractChannel {
  if (!value) return "other";
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "");
  if ((channels as readonly string[]).includes(normalized)) return normalized as ContractChannel;
  return CHANNEL_ALIASES[normalized] ?? "other";
}

function parseCategory(value?: string, fallbackText = ""): ContractCategory {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, "");
  if (normalized && (categories as readonly string[]).includes(normalized)) return normalized as ContractCategory;
  if (normalized && CATEGORY_ALIASES[normalized]) return CATEGORY_ALIASES[normalized];

  const haystack = `${value ?? ""} ${fallbackText}`.toLowerCase();
  const matched = Object.entries(CATEGORY_ALIASES).find(([keyword]) => haystack.includes(keyword));
  return matched?.[1] ?? "other";
}

function parseStatus(value?: string): ProjectStatus | undefined {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, "");
  if (!normalized) return undefined;
  if ((projectStatuses as readonly string[]).includes(normalized)) return normalized as ProjectStatus;
  return STATUS_ALIASES[normalized];
}

function compactText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function inferCommandKind(text: string): TelegramContractCommand["kind"] {
  const normalized = text.trim().toLowerCase();
  if (normalized === "/help" || normalized === "도움말" || normalized === "help") return "help";
  if (normalized.startsWith("입금") || normalized.startsWith("/paid")) return "update_payment";
  if (normalized.startsWith("상태") || normalized.startsWith("/status")) return "update_status";
  return "create_contract";
}

export function parseTelegramContractCommand(text: string): TelegramContractCommand {
  const kind = inferCommandKind(text);
  if (kind === "help") return { kind };

  const fields = parseFields(text);
  if (kind === "update_payment") {
    return {
      kind,
      projectId: fields.projectId,
      customerName: fields.customerName,
      email: fields.email,
      phone: fields.phone,
      paidAmount: parseWon(fields.paidAmount ?? fields.contractedAmount ?? compactText(text)),
    };
  }

  if (kind === "update_status") {
    const status = parseStatus(fields.status) ?? "in_progress";
    return {
      kind,
      projectId: fields.projectId ?? "",
      status,
      dueDate: parseDateText(fields.dueDate),
    };
  }

  const summary = compactText(text);
  const customerName = fields.customerName || summary.match(/고객\s*[:：]?\s*([^\s,]+)/)?.[1] || "";
  const category = parseCategory(fields.category ?? fields.productName, summary);
  const productName = fields.productName || fields.category || `${customerName || "고객"} ${category} 계약`;
  const contractedAmount = parseWon(fields.contractedAmount);

  return {
    kind,
    customerName,
    companyName: fields.companyName,
    email: fields.email,
    phone: fields.phone,
    channel: parseChannel(fields.channel),
    category,
    productName,
    contractedAmount,
    paidAmount: parseWon(fields.paidAmount),
    startDate: parseDateText(fields.startDate),
    dueDate: parseDateText(fields.dueDate),
    notes: fields.notes || summary.slice(0, 1000),
  };
}

export function validateTelegramCommand(command: TelegramContractCommand): string | null {
  if (command.kind === "create_contract") {
    if (!command.customerName) return "고객명을 입력해주세요.";
    if (!command.productName) return "계약명 또는 작업명을 입력해주세요.";
    if (command.contractedAmount <= 0) return "계약 금액을 입력해주세요.";
  }
  if (command.kind === "update_payment") {
    if (!command.projectId && !command.customerName && !command.email && !command.phone) {
      return "프로젝트ID, 고객명, 이메일, 전화번호 중 하나가 필요합니다.";
    }
    if (command.paidAmount <= 0) return "입금액을 입력해주세요.";
  }
  if (command.kind === "update_status") {
    if (!command.projectId) return "상태 변경에는 프로젝트ID가 필요합니다.";
  }
  return null;
}

export const TELEGRAM_CONTRACT_HELP = [
  "계약 자동등록 형식",
  "",
  "계약확정",
  "고객: 홍길동",
  "채널: 숨고",
  "서비스: PPT",
  "계약명: 회사소개서 20P",
  "금액: 30만원",
  "입금: 10만원",
  "마감: 2026-05-15",
  "연락처: 010-0000-0000",
  "이메일: customer@example.com",
  "메모: 원본 자료 금요일 전달",
  "",
  "입금 업데이트 형식",
  "",
  "입금",
  "프로젝트ID: 생성 후 안내된 ID",
  "입금: 30만원",
].join("\n");
