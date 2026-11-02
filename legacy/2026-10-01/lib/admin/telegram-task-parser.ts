import type { TaskPriority, TaskScope } from "@/lib/admin/tasks";

// =====================================================
// 명령 타입
// =====================================================
export type TelegramTaskCommand =
  | { kind: "task_help" }
  | { kind: "task_list"; scope?: TaskScope }
  | {
      kind: "task_add";
      scope: TaskScope;
      title: string;
      priority: TaskPriority;
      dueDate?: string;
    }
  | { kind: "task_complete"; idOrNumber: string }
  | { kind: "task_defer"; idOrNumber: string; newScope: TaskScope }
  | { kind: "task_delete"; idOrNumber: string };

// =====================================================
// 트리거 — 이 텍스트가 task 명령으로 보이는가?
// =====================================================
const TASK_TRIGGERS = [
  "/할일", "/할 일", "할일", "할 일",
  "/오늘", "오늘 할일",
  "/주간", "/이주", "이번주 할일", "이 주 할일",
  "/월간", "/이달", "이번달 할일", "이 달 할일",
  "/완료", "완료 ",
  "/이월",
  "/삭제",
  "/목록", "/list", "/tasks",
  "/도움말 할일",
];

export function isTelegramTaskCommand(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t) return false;
  return TASK_TRIGGERS.some((trig) => {
    const trigLower = trig.toLowerCase();
    return t === trigLower || t.startsWith(`${trigLower} `) || t.startsWith(`${trigLower}\n`);
  });
}

// =====================================================
// 파서
// =====================================================
const SCOPE_KEYWORDS: Record<string, TaskScope> = {
  "오늘": "today", "today": "today", "/오늘": "today",
  "이주": "week", "이번주": "week", "주간": "week", "/주간": "week", "/이주": "week", "week": "week",
  "이달": "month", "이번달": "month", "월간": "month", "/월간": "month", "/이달": "month", "month": "month",
};

const PRIORITY_KEYWORDS: Record<string, TaskPriority> = {
  "p0": "P0", "P0": "P0", "긴급": "P0", "🔥": "P0", "필수": "P0",
  "p1": "P1", "P1": "P1", "권장": "P1", "🟢": "P1",
  "p2": "P2", "P2": "P2", "선택": "P2", "🟡": "P2",
};

function detectScope(text: string): TaskScope | undefined {
  const lower = text.toLowerCase();
  for (const [k, v] of Object.entries(SCOPE_KEYWORDS)) {
    if (lower.includes(k.toLowerCase())) return v;
  }
  return undefined;
}

function detectPriority(text: string): TaskPriority | undefined {
  for (const [k, v] of Object.entries(PRIORITY_KEYWORDS)) {
    if (text.includes(k)) return v;
  }
  return undefined;
}

/** "5/15", "5월 15일", "2026-05-15" 같은 마감일 추출 */
function detectDueDate(text: string): string | undefined {
  const iso = text.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const md = text.match(/(\d{1,2})\s*(?:월|[\/.])\s*(\d{1,2})\s*(?:일|마감)?/);
  if (md) {
    const year = new Date().getFullYear();
    return `${year}-${md[1].padStart(2, "0")}-${md[2].padStart(2, "0")}`;
  }
  return undefined;
}

/** 첫 번째 토큰(명령)을 제거하고 본문만 추출. 또한 P0/P1/마감일 토큰도 제거 */
function cleanTitle(text: string): string {
  let t = text.trim();
  // 첫 명령어 제거
  const firstSpace = t.search(/\s/);
  if (t.startsWith("/")) t = firstSpace >= 0 ? t.slice(firstSpace).trim() : "";
  // 우선순위/스코프 키워드 제거 (선행 토큰만)
  const tokens = t.split(/\s+/);
  const skipPatterns = [
    /^(p0|p1|p2)$/i,
    /^(긴급|필수|권장|선택)$/,
    /^🔥$/, /^🟢$/, /^🟡$/,
    /^(오늘|이주|이번주|주간|이달|이번달|월간)$/,
  ];
  while (tokens.length > 0 && skipPatterns.some((p) => p.test(tokens[0]))) {
    tokens.shift();
  }
  // 마감일 토큰 제거 (본문 안에 자연스럽게 있을 수도 있으니 제거는 후행만)
  let body = tokens.join(" ").trim();
  body = body.replace(/\s+(\d{1,2})\/(\d{1,2})\s*마감$/, "").trim();
  body = body.replace(/^[:：\-—]+\s*/, ""); // 콜론/대시 제거
  return body;
}

export function parseTelegramTaskCommand(text: string): TelegramTaskCommand | null {
  const raw = text.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();

  // /도움말 할일
  if (/^(\/?(도움말\s*할일|task\s*help))$/i.test(raw)) {
    return { kind: "task_help" };
  }

  // /목록 [스코프?]
  if (lower.startsWith("/목록") || lower === "/list" || lower === "/tasks") {
    return { kind: "task_list", scope: detectScope(raw) };
  }

  // /완료 [번호 또는 ID]
  if (lower.startsWith("/완료") || /^완료\s+/.test(lower)) {
    const rest = raw.replace(/^(\/완료|완료)\s*/, "").trim();
    if (!rest) return { kind: "task_help" };
    return { kind: "task_complete", idOrNumber: rest.split(/\s+/)[0] };
  }

  // /이월 [번호 또는 ID] [스코프?]
  if (lower.startsWith("/이월")) {
    const rest = raw.replace(/^\/이월\s*/, "").trim();
    if (!rest) return { kind: "task_help" };
    const parts = rest.split(/\s+/);
    const id = parts[0];
    const newScope = detectScope(parts.slice(1).join(" ")) ?? "today";
    return { kind: "task_defer", idOrNumber: id, newScope };
  }

  // /삭제
  if (lower.startsWith("/삭제")) {
    const rest = raw.replace(/^\/삭제\s*/, "").trim();
    if (!rest) return { kind: "task_help" };
    return { kind: "task_delete", idOrNumber: rest.split(/\s+/)[0] };
  }

  // /할일, /오늘, /주간, /월간 — 추가 명령
  const addPrefixMatch = raw.match(/^\/?(할\s*일|오늘|이주|이번주|주간|이달|이번달|월간)\b/);
  if (!addPrefixMatch) return null;

  const prefixed = addPrefixMatch[1].replace(/\s/g, "");
  const scopeFromPrefix: TaskScope =
    prefixed === "오늘" || prefixed === "할일" ? "today" :
    prefixed === "이주" || prefixed === "이번주" || prefixed === "주간" ? "week" :
    prefixed === "이달" || prefixed === "이번달" || prefixed === "월간" ? "month" :
    "today";

  const body = cleanTitle(raw);
  if (!body) {
    // 내용 없이 명령만 보낸 경우 → 목록 응답
    return { kind: "task_list", scope: scopeFromPrefix };
  }

  return {
    kind: "task_add",
    scope: scopeFromPrefix,
    title: body,
    priority: detectPriority(raw) ?? "P1",
    dueDate: detectDueDate(raw),
  };
}

// =====================================================
// 도움말
// =====================================================
export const TELEGRAM_TASK_HELP = [
  "📋 할 일 관리 명령",
  "",
  "*추가*",
  "/할일 [내용]            → 오늘 할 일 (P1)",
  "/할일 P0 [내용]         → 오늘 P0 (필수)",
  "/주간 [내용]            → 이 주 주요 할 일",
  "/월간 [내용]            → 이 달 주요 할 일",
  "",
  "예: `/할일 P0 클린앵커 입금 확인 5/12`",
  "예: `/주간 카페24 디자인 자산 2개 등록`",
  "",
  "*상태 변경*",
  "/완료 [번호]            → 완료 처리",
  "/완료 [ID 앞 6자]       → ID로 직접 완료",
  "/이월 [번호] 주간       → 다음 스코프로 이동",
  "/삭제 [번호]            → 삭제",
  "",
  "*조회*",
  "/목록                  → 모든 스코프 활성",
  "/목록 오늘             → 오늘만",
  "/목록 주간             → 이 주만",
  "/목록 월간             → 이 달만",
].join("\n");
