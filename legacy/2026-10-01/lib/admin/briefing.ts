import "server-only";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import {
  buildDailyBrief,
  buildWeeklySummary,
  escapeMd,
  formatDueLabel,
  type DailyBriefingPayload,
  type DailyTask,
  type WeeklySummaryPayload,
  toKstDate,
} from "@/lib/admin/telegram-templates";
import {
  kstToday,
  listTodayCompleted,
  listTodayTasks,
  listWeekTasks,
} from "@/lib/admin/tasks";

// =====================================================
// 시간대 헬퍼 — KST 기준 day boundary 계산
// =====================================================
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function addDaysUtc(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

function getIsoWeekNumberKst(d: Date): number {
  // 단순 ISO 주차 (월요일 시작)
  const kst = toKstDate(d);
  const target = new Date(Date.UTC(kst.getFullYear(), kst.getMonth(), kst.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstThursdayDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNr + 3);
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
}

function startOfKstWeek(d: Date): Date {
  // 주의 시작: 월요일 00:00 KST
  const kst = toKstDate(d);
  const dow = kst.getDay(); // 0=일 ~ 6=토
  const daysFromMon = (dow + 6) % 7;
  return new Date(
    Date.UTC(kst.getFullYear(), kst.getMonth(), kst.getDate() - daysFromMon) - KST_OFFSET_MS,
  );
}

// =====================================================
// 데이터 fetch — Supabase
// =====================================================

type ProjectRow = {
  id: string;
  product_name: string | null;
  contracted_amount: number | null;
  due_date: string | null;
  status: string | null;
  channel: string | null;
};

async function fetchActiveProjects(): Promise<ProjectRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, product_name, contracted_amount, due_date, status, channel")
    .in("status", ["in_progress", "review", "blocked"])
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) {
    console.error("[briefing] fetchActiveProjects error:", error.message);
    return [];
  }
  return (data ?? []) as ProjectRow[];
}

// =====================================================
// 빌더 — 일일 브리핑 데이터 조립
// =====================================================
export async function buildDailyBriefingMessage(now: Date = new Date()): Promise<string> {
  if (!hasSupabaseAdminConfig()) {
    return buildFallbackDaily(now, "Supabase 설정 미완료");
  }

  try {
    const projects = await fetchActiveProjects();

    // 오늘 할 일 — 진행 중 프로젝트 due_date 기반
    const tasks: DailyTask[] = projects.slice(0, 10).map((p): DailyTask => {
      const isP0 = isP0Task(p, now);
      return {
        priority: isP0 ? "P0" : "P1",
        text: p.product_name ?? "외주 작업",
        due: p.due_date ?? undefined,
      };
    });

    const inProgress = projects.filter((p) => p.status === "in_progress").length;

    const payload: DailyBriefingPayload = {
      today: now,
      tasks,
      pipeline: {
        inProgress,
      },
    };

    return buildDailyBrief(payload);
  } catch (error) {
    console.error("[briefing] daily error:", error instanceof Error ? error.message : error);
    return buildFallbackDaily(now, "데이터 조회 실패");
  }
}

function buildFallbackDaily(now: Date, reason: string): string {
  return buildDailyBrief({
    today: now,
    tasks: [],
    pipeline: { inProgress: 0 },
  }) + `\n\n_⚠️ ${reason} — Supabase 데이터 입력 후 정상화_`;
}

function isP0Task(p: ProjectRow, now: Date): boolean {
  // P0 = 마감 D-1 이내 또는 status === "review"
  if (p.status === "review") return true;
  if (!p.due_date) return false;
  const dueKst = toKstDate(p.due_date);
  const todayKst = toKstDate(now);
  const a = Date.UTC(dueKst.getFullYear(), dueKst.getMonth(), dueKst.getDate());
  const b = Date.UTC(todayKst.getFullYear(), todayKst.getMonth(), todayKst.getDate());
  const diff = Math.round((a - b) / 86_400_000);
  return diff <= 1; // 오늘 또는 내일 마감
}


// =====================================================
// 빌더 — 저녁 점검 데이터 조립
// =====================================================
export async function buildEveningCheckMessage(now: Date = new Date()): Promise<string> {
  if (!hasSupabaseAdminConfig()) {
    return buildFallbackEvening(now, "Supabase 설정 미완료");
  }

  try {
    const [todayTasks, weekTasks, completedToday, activeProjects] =
      await Promise.all([
        listTodayTasks(now),
        listWeekTasks(now),
        listTodayCompleted(now),
        fetchActiveProjects(),
      ]);

    const overdueProjects = activeProjects.filter((p) => p.due_date && isP0Task(p, addDaysUtc(now, 2)));
    const p0Tomorrow = activeProjects.filter((p) => isP0Task(p, addDaysUtc(now, 1))).slice(0, 5);
    const remainingToday = todayTasks.filter((t) => t.status !== "completed");
    const weekP0 = weekTasks.filter((t) => t.priority === "P0");

    const lines: string[] = [];
    lines.push(`🌙 *${escapeMd(kstToday(now))} 저녁 점검*`);
    lines.push("");
    lines.push("📋 *오늘 할 일*");
    lines.push(`- 완료: *${completedToday.length}건*`);
    lines.push(`- 미완: *${remainingToday.length}건*${remainingToday.some((t) => t.priority === "P0") ? " 🚨 P0 포함" : ""}`);
    if (remainingToday.length > 0) {
      for (const task of remainingToday.slice(0, 5)) {
        lines.push(`  · ${task.priority} ${escapeMd(task.title)}${task.due_date ? ` (${formatDueLabel(task.due_date, now)})` : ""}`);
      }
      if (remainingToday.length > 5) lines.push(`  · 외 ${remainingToday.length - 5}건`);
    }
    lines.push("");
    lines.push("🚀 *외주 진행*");
    lines.push(`- 진행/검수/블로킹: *${activeProjects.length}건*`);
    lines.push(`- D-day 위험: *${p0Tomorrow.length}건* / 지연 후보: *${overdueProjects.length}건*`);
    for (const project of p0Tomorrow.slice(0, 3)) {
      lines.push(`  · ${escapeMd(project.product_name ?? "외주 작업")}${project.due_date ? ` (${formatDueLabel(project.due_date, now)})` : ""}`);
    }
    lines.push("");
    lines.push("🧭 *내일/이번 주 우선순위*");
    if (weekP0.length === 0 && p0Tomorrow.length === 0) {
      lines.push("- 등록된 P0 없음 — 신규 영업/포트폴리오 생산 루틴 유지");
    } else {
      const nextItems = [...p0Tomorrow.map((p) => p.product_name ?? "외주 작업"), ...weekP0.map((t) => t.title)];
      for (const item of nextItems.slice(0, 5)) lines.push(`- ${escapeMd(item)}`);
    }
    lines.push("");
    lines.push("_돈 관련 브리핑은 재무이사 보고로 분리합니다._");

    return lines.join("\n");
  } catch (error) {
    console.error("[briefing] evening error:", error instanceof Error ? error.message : error);
    return buildFallbackEvening(now, "데이터 조회 실패");
  }
}

function buildFallbackEvening(now: Date, reason: string): string {
  return [
    `🌙 *${escapeMd(kstToday(now))} 저녁 점검*`,
    "",
    `_⚠️ ${escapeMd(reason)} — Supabase 데이터 입력 후 정상화_`,
    "",
    "_돈 관련 브리핑은 재무이사 보고로 분리합니다._",
  ].join("\n");
}

// =====================================================
// 빌더 — 주간 요약 데이터 조립
// =====================================================
export async function buildWeeklySummaryMessage(now: Date = new Date()): Promise<string> {
  if (!hasSupabaseAdminConfig()) {
    return buildFallbackWeekly(now, "Supabase 설정 미완료");
  }

  try {
    const weekEnd = startOfKstWeek(now);            // 이번 주 월요일 00:00 KST (today)
    const lastWeekDisplayStart = addDaysUtc(weekEnd, -7);
    const lastWeekDisplayEnd = addDaysUtc(weekEnd, -1);
    const nextWeekStart = weekEnd;
    const nextWeekEnd = addDaysUtc(weekEnd, 6);

    const [activeProjects, weekTasks] = await Promise.all([
      fetchActiveProjects(),
      listWeekTasks(now),
    ]);

    const weekP0 = weekTasks.filter((t) => t.priority === "P0");
    const weekP1 = weekTasks.filter((t) => t.priority === "P1");
    const reviewProjects = activeProjects.filter((p) => p.status === "review").length;
    const blockedProjects = activeProjects.filter((p) => p.status === "blocked").length;

    const payload: WeeklySummaryPayload = {
      weekNumber: getIsoWeekNumberKst(lastWeekDisplayStart),
      weekStart: lastWeekDisplayStart,
      weekEnd: lastWeekDisplayEnd,
      insights: [
        `진행/검수/블로킹 프로젝트 ${activeProjects.length}건`,
        `검수 ${reviewProjects}건 / 블로킹 ${blockedProjects}건`,
        `이번 주 P0 ${weekP0.length}건 / P1 ${weekP1.length}건`,
      ],
      nextWeek: {
        weekNumber: getIsoWeekNumberKst(nextWeekStart),
        weekStart: nextWeekStart,
        weekEnd: nextWeekEnd,
        goals: weekTasks.slice(0, 8).map((t) => `${t.priority} ${t.title}`),
      },
    };

    return buildWeeklySummary(payload);
  } catch (error) {
    console.error("[briefing] weekly error:", error instanceof Error ? error.message : error);
    return buildFallbackWeekly(now, "데이터 조회 실패");
  }
}

function buildFallbackWeekly(now: Date, reason: string): string {
  const weekEnd = startOfKstWeek(now);
  const weekStart = addDaysUtc(weekEnd, -7);
  return buildWeeklySummary({
    weekNumber: getIsoWeekNumberKst(weekStart),
    weekStart,
    weekEnd: addDaysUtc(weekEnd, -1),
    nextWeek: {
      weekNumber: getIsoWeekNumberKst(weekEnd),
      weekStart: weekEnd,
      weekEnd: addDaysUtc(weekEnd, 6),
      goals: [],
    },
  }) + `\n\n_⚠️ ${reason} — Supabase 데이터 입력 후 정상화_`;
}
