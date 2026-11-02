// AIO 텔레그램 메시지 템플릿 (헬퍼 + 빌더)
// 명세: docs/_aio_bot_specs/메시지템플릿_v1.md

const KO_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// =====================================================
// 시간대 (KST) 헬퍼
// =====================================================
const KST_OFFSET_MIN = 9 * 60;

export function toKstDate(input?: Date | string | number): Date {
  const d = input instanceof Date ? input : input == null ? new Date() : new Date(input);
  const utc = d.getTime() + d.getTimezoneOffset() * 60_000;
  return new Date(utc + KST_OFFSET_MIN * 60_000);
}

// =====================================================
// 포맷터 — 날짜·시간·금액
// =====================================================
export function formatDate(input?: Date | string | number): string {
  const d = toKstDate(input);
  return `${d.getMonth() + 1}/${d.getDate()} (${KO_DAYS[d.getDay()]})`;
}

export function formatTime(input?: Date | string | number): string {
  const d = toKstDate(input);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatDateTime(input?: Date | string | number): string {
  return `${formatDate(input)} ${formatTime(input)}`;
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

/**
 * 마감 표기. due가 오늘이면 "오늘 마감", 미래면 "D-N", 과거면 "D+N (지연)"
 */
export function formatDueLabel(due: Date | string, now: Date = new Date()): string {
  const dueKst = toKstDate(due);
  const nowKst = toKstDate(now);
  // 일 단위로 자르기
  const a = Date.UTC(dueKst.getFullYear(), dueKst.getMonth(), dueKst.getDate());
  const b = Date.UTC(nowKst.getFullYear(), nowKst.getMonth(), nowKst.getDate());
  const diffDays = Math.round((a - b) / 86_400_000);
  if (diffDays === 0) return "오늘 마감";
  if (diffDays === 1) return "내일 마감 (D-1)";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)} _(지연)_`;
}

export function formatWon(amount: number, options: { bold?: boolean } = {}): string {
  const formatted = `₩${Math.round(amount).toLocaleString("ko-KR")}`;
  return options.bold ? `*${formatted}*` : formatted;
}

export function formatManwon(amount: number, options: { bold?: boolean } = {}): string {
  const v = Math.round(amount / 10_000);
  const formatted = `${v.toLocaleString("ko-KR")}만`;
  return options.bold ? `*${formatted}*` : formatted;
}

// =====================================================
// Markdown escape (Telegram 일반 Markdown)
// 일반 Markdown 모드에서 *_ ` [ ] 만 escape
// =====================================================
export function escapeMd(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/([_*`\[\]])/g, "\\$1");
}

// =====================================================
// 메시지 빌더 — A. 즉시 알림 (Event)
// =====================================================
export type EventNotification = {
  emoji: string;          // 예: "💰"
  title: string;          // 예: "빌더스 PPT 입금 완료"
  lines: string[];        // 본문 (각 줄 1개 정보)
  cta?: string;           // 다음 액션
};

export function buildEventNotification(payload: EventNotification): string {
  const lines = [`${payload.emoji} *${escapeMd(payload.title)}*`, ""];
  for (const line of payload.lines) {
    lines.push(line);
  }
  if (payload.cta) {
    lines.push("", `👉 _${escapeMd(payload.cta)}_`);
  }
  return lines.join("\n");
}

// =====================================================
// 메시지 빌더 — B. 일일 브리핑 (Daily, KST 07:00)
// =====================================================
export type DailyTask = {
  priority: "P0" | "P1";
  text: string;             // "클린앵커 사이트 마감"
  due?: Date | string;      // 마감일
};

export type DailyBriefingPayload = {
  today: Date;
  tasks: DailyTask[];
  pipeline: {
    inProgress: number;
  };
};

export function buildDailyBrief(p: DailyBriefingPayload): string {
  const out: string[] = [];
  out.push(`📅 *${formatDate(p.today)} 일일 브리핑*`);
  out.push("");
  out.push("━━━━━━━━━━━━━━━━━━━━━");
  out.push("🎯 *오늘 할 일*");

  const p0 = p.tasks.filter((t) => t.priority === "P0");
  const p1 = p.tasks.filter((t) => t.priority === "P1");

  if (p0.length > 0) {
    out.push("");
    out.push("🔥 *P0 (필수)*");
    for (const t of p0) {
      out.push(formatTaskLine(t));
    }
  }

  if (p1.length > 0) {
    out.push("");
    out.push("🟢 *P1 (권장)*");
    for (const t of p1) {
      out.push(formatTaskLine(t));
    }
  }

  if (p.tasks.length === 0) {
    out.push("");
    out.push("_등록된 할 일 없음_");
  }

  out.push("");
  out.push("━━━━━━━━━━━━━━━━━━━━━");
  out.push(`👉 _진행 중 ${p.pipeline.inProgress}건 — 돈 관련 브리핑은 재무이사 보고로 분리_`);

  return out.join("\n");
}

function formatTaskLine(t: DailyTask): string {
  let line = `• ${escapeMd(t.text)}`;
  if (t.due) {
    const label = formatDueLabel(t.due);
    line += ` _(${label})_`;
  }
  return line;
}

// =====================================================
// 메시지 빌더 — C. 주간 요약 (Weekly, 월요일 KST 07:00)
// =====================================================
export type WeeklySummaryPayload = {
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  insights?: string[];
  nextWeek: {
    weekNumber: number;
    weekStart: Date;
    weekEnd: Date;
    goals: string[];
  };
  footerNote?: string;          // 예: "숨고 마켓 5/30 폐쇄까지 D-22"
};

export function buildWeeklySummary(p: WeeklySummaryPayload): string {
  const out: string[] = [];
  out.push(`📊 *Week ${p.weekNumber} (${formatDateRange(p.weekStart, p.weekEnd)}) 주간 할 일 요약*`);
  out.push("");
  out.push("━━━━━━━━━━━━━━━━━━━━━");
  out.push("🧭 *업무 현황*");
  out.push("");
  if (!p.insights || p.insights.length === 0) {
    out.push("• 등록된 업무 인사이트 없음");
  } else {
    for (const line of p.insights) {
      out.push(`• ${escapeMd(line)}`);
    }
  }

  // 다음 주 목표
  out.push("");
  out.push("━━━━━━━━━━━━━━━━━━━━━");
  out.push(`🎯 *Week ${p.nextWeek.weekNumber} (${formatDateRange(p.nextWeek.weekStart, p.nextWeek.weekEnd)}) 목표*`);
  out.push("");
  for (const g of p.nextWeek.goals) {
    out.push(`• ${escapeMd(g)}`);
  }
  if (p.nextWeek.goals.length === 0) out.push("• 등록된 P0/P1 없음");

  if (p.footerNote) {
    out.push("");
    out.push(`👉 _${escapeMd(p.footerNote)}_`);
  }

  return out.join("\n");
}
