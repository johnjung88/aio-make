import "server-only";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

// =====================================================
// 타입
// =====================================================
export type TaskScope = "today" | "week" | "month";
export type TaskPriority = "P0" | "P1" | "P2";
export type TaskStatus = "pending" | "in_progress" | "completed" | "canceled" | "deferred";
export type TaskSource = "telegram" | "admin" | "excel" | "auto" | "briefing";

export type TaskRow = {
  id: string;
  title: string;
  scope: TaskScope;
  scope_date: string;          // 'YYYY-MM-DD'
  priority: TaskPriority;
  status: TaskStatus;
  source: TaskSource;
  due_date: string | null;
  completed_at: string | null;
  related_project_id: string | null;
  notes: string | null;
  telegram_message_id: number | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = {
  title: string;
  scope: TaskScope;
  scopeDate?: string;          // 미지정 시 자동 계산
  priority?: TaskPriority;
  source?: TaskSource;
  dueDate?: string;
  notes?: string;
  relatedProjectId?: string;
  telegramMessageId?: number;
};

export type UpdateTaskInput = {
  title?: string;
  scope?: TaskScope;
  scopeDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
  notes?: string | null;
  relatedProjectId?: string | null;
};

// =====================================================
// KST 기반 scope_date 계산
// =====================================================
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toKstDate(d: Date = new Date()): Date {
  return new Date(d.getTime() + d.getTimezoneOffset() * 60_000 + KST_OFFSET_MS);
}

function fmtDate(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** 오늘 (KST) */
export function kstToday(now: Date = new Date()): string {
  return fmtDate(toKstDate(now));
}

/** 이번 주 월요일 (KST) */
export function kstWeekStart(now: Date = new Date()): string {
  const kst = toKstDate(now);
  const dow = kst.getUTCDay(); // 0=일 ~ 6=토
  const daysFromMon = (dow + 6) % 7;
  const mon = new Date(kst.getTime() - daysFromMon * 86_400_000);
  return fmtDate(mon);
}

/** 이번 달 1일 (KST) */
export function kstMonthStart(now: Date = new Date()): string {
  const kst = toKstDate(now);
  return `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

/** scope에 따른 기본 scope_date 계산 */
export function defaultScopeDate(scope: TaskScope, now: Date = new Date()): string {
  switch (scope) {
    case "today": return kstToday(now);
    case "week":  return kstWeekStart(now);
    case "month": return kstMonthStart(now);
  }
}

function isSupabaseNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /fetch failed|ENOTFOUND|EAI_AGAIN|getaddrinfo|known host|DNS/i.test(error.message);
}

function taskConnectionError(): Error {
  return new Error("Supabase 연결 실패: 프로젝트 URL, DNS, 네트워크 상태를 확인해야 합니다.");
}

// =====================================================
// CRUD
// =====================================================
export async function createTask(input: CreateTaskInput): Promise<TaskRow> {
  try {
    const supabase = createSupabaseAdminClient();
    const scopeDate = input.scopeDate ?? defaultScopeDate(input.scope);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: input.title.trim(),
        scope: input.scope,
        scope_date: scopeDate,
        priority: input.priority ?? "P1",
        source: input.source ?? "telegram",
        due_date: input.dueDate ?? null,
        notes: input.notes ?? null,
        related_project_id: input.relatedProjectId ?? null,
        telegram_message_id: input.telegramMessageId ?? null,
      })
      .select()
      .single();

    if (error) throw new Error(`task 생성 실패: ${error.message}`);
    return data as TaskRow;
  } catch (error) {
    if (isSupabaseNetworkError(error)) throw taskConnectionError();
    throw error;
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<TaskRow> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`task 상태 변경 실패: ${error.message}`);
    return data as TaskRow;
  } catch (error) {
    if (isSupabaseNetworkError(error)) throw taskConnectionError();
    throw error;
  }
}

export async function updateTaskDetails(id: string, input: UpdateTaskInput): Promise<TaskRow> {
  try {
    const supabase = createSupabaseAdminClient();
    const updates: Record<string, unknown> = {};

    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.scope !== undefined) updates.scope = input.scope;
    if (input.scopeDate !== undefined) updates.scope_date = input.scopeDate;
    if (input.priority !== undefined) updates.priority = input.priority;
    if (input.status !== undefined) updates.status = input.status;
    if (input.dueDate !== undefined) updates.due_date = input.dueDate || null;
    if (input.notes !== undefined) updates.notes = input.notes || null;
    if (input.relatedProjectId !== undefined) updates.related_project_id = input.relatedProjectId || null;

    if (Object.keys(updates).length === 0) {
      throw new Error("변경할 항목이 없습니다.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`task 수정 실패: ${error.message}`);
    return data as TaskRow;
  } catch (error) {
    if (isSupabaseNetworkError(error)) throw taskConnectionError();
    throw error;
  }
}

export async function deferTask(
  id: string,
  newScope: TaskScope,
  newScopeDate?: string,
): Promise<TaskRow> {
  try {
    const supabase = createSupabaseAdminClient();
    const scopeDate = newScopeDate ?? defaultScopeDate(newScope);
    const { data, error } = await supabase
      .from("tasks")
      .update({ scope: newScope, scope_date: scopeDate, status: "pending" })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`task 이월 실패: ${error.message}`);
    return data as TaskRow;
  } catch (error) {
    if (isSupabaseNetworkError(error)) throw taskConnectionError();
    throw error;
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw new Error(`task 삭제 실패: ${error.message}`);
  } catch (error) {
    if (isSupabaseNetworkError(error)) throw taskConnectionError();
    throw error;
  }
}

// =====================================================
// 조회
// =====================================================
export async function listTodayTasks(now: Date = new Date()): Promise<TaskRow[]> {
  return listTasks("today", kstToday(now));
}

export async function listWeekTasks(now: Date = new Date()): Promise<TaskRow[]> {
  return listTasks("week", kstWeekStart(now));
}

export async function listMonthTasks(now: Date = new Date()): Promise<TaskRow[]> {
  return listTasks("month", kstMonthStart(now));
}

async function listTasks(scope: TaskScope, scopeDate: string): Promise<TaskRow[]> {
  if (!hasSupabaseAdminConfig()) return [];

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("scope", scope)
      .eq("scope_date", scopeDate)
      .in("status", ["pending", "in_progress"])
      .order("priority", { ascending: true })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return [];
    return (data ?? []) as TaskRow[];
  } catch (error) {
    if (!isSupabaseNetworkError(error)) console.error("[tasks] listTasks error:", error);
    return [];
  }
}

export async function listCalendarTasks(startDate: string, endDate: string): Promise<TaskRow[]> {
  if (!hasSupabaseAdminConfig()) return [];

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .or(`and(due_date.gte.${startDate},due_date.lte.${endDate}),and(scope_date.gte.${startDate},scope_date.lte.${endDate})`)
      .in("status", ["pending", "in_progress", "completed", "deferred"])
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("scope_date", { ascending: true });

    if (error) return [];
    return (data ?? []) as TaskRow[];
  } catch (error) {
    if (!isSupabaseNetworkError(error)) console.error("[tasks] listCalendarTasks error:", error);
    return [];
  }
}

/** 오늘 완료된 할 일 (저녁 점검용) */
export async function listTodayCompleted(now: Date = new Date()): Promise<TaskRow[]> {
  if (!hasSupabaseAdminConfig()) return [];

  try {
    const supabase = createSupabaseAdminClient();
    const today = kstToday(now);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("scope", "today")
      .eq("scope_date", today)
      .eq("status", "completed")
      .order("completed_at", { ascending: true });
    if (error) return [];
    return (data ?? []) as TaskRow[];
  } catch {
    return [];
  }
}

/** ID 접두사로 task 찾기 (텔레그램 /완료 abc123 같은 명령용) */
export async function findTaskByIdPrefix(idPrefix: string): Promise<TaskRow | null> {
  if (!idPrefix || idPrefix.length < 4) return null;
  if (!hasSupabaseAdminConfig()) return null;

  try {
    const supabase = createSupabaseAdminClient();
    // UUID는 8-4-4-4-12 형식. like 'abc123%' 매칭
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .ilike("id", `${idPrefix.toLowerCase()}%`)
      .limit(2);
    if (error || !data || data.length === 0) return null;
    if (data.length > 1) return null; // 중복 매칭은 거부
    return data[0] as TaskRow;
  } catch {
    return null;
  }
}

/** 활성 할 일을 번호로 찾기 (1, 2, 3 ...) — 목록 표시 순서 기반 */
export async function findActiveTaskByNumber(num: number, scope?: TaskScope): Promise<TaskRow | null> {
  if (num < 1) return null;
  let tasks: TaskRow[] = [];
  if (scope === "today" || !scope) tasks = tasks.concat(await listTodayTasks());
  if (scope === "week"  || !scope) tasks = tasks.concat(await listWeekTasks());
  if (scope === "month" || !scope) tasks = tasks.concat(await listMonthTasks());
  return tasks[num - 1] ?? null;
}

// =====================================================
// 집계 (브리핑용)
// =====================================================
export type TaskCounts = {
  today: { p0: number; p1: number; total: number; completed: number };
  week:  { p0: number; p1: number; total: number };
  month: { p0: number; p1: number; total: number };
};

export async function summarizeTaskCounts(now: Date = new Date()): Promise<TaskCounts> {
  const [todayActive, todayCompleted, week, month] = await Promise.all([
    listTodayTasks(now),
    listTodayCompleted(now),
    listWeekTasks(now),
    listMonthTasks(now),
  ]);
  const count = (rows: TaskRow[], pr: TaskPriority) => rows.filter((r) => r.priority === pr).length;
  return {
    today: {
      p0: count(todayActive, "P0"),
      p1: count(todayActive, "P1"),
      total: todayActive.length,
      completed: todayCompleted.length,
    },
    week:  { p0: count(week, "P0"),  p1: count(week, "P1"),  total: week.length },
    month: { p0: count(month, "P0"), p1: count(month, "P1"), total: month.length },
  };
}
