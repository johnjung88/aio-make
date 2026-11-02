"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Inbox,
  Loader2,
  PencilLine,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type { CalendarEvent } from "@/lib/admin/command-center";

type CalendarPayload = {
  events: CalendarEvent[];
  warnings: string[];
};

type TaskForm = {
  id: string | null;
  title: string;
  date: string;
  priority: "P0" | "P1" | "P2";
  scope: "today" | "week" | "month";
  status: "pending" | "in_progress" | "completed" | "canceled" | "deferred";
  notes: string;
};

const KIND_META: Record<CalendarEvent["kind"], { label: string; className: string; dotClassName: string }> = {
  task: {
    label: "업무",
    className: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
    dotClassName: "bg-cyan-300",
  },
  project_due: {
    label: "납기",
    className: "border-amber-400/25 bg-amber-400/10 text-amber-100",
    dotClassName: "bg-amber-300",
  },
  inquiry: {
    label: "문의",
    className: "border-primary/25 bg-primary/10 text-primary",
    dotClassName: "bg-primary",
  },
  approval: {
    label: "승인",
    className: "border-rose-400/25 bg-rose-400/10 text-rose-100",
    dotClassName: "bg-rose-300",
  },
  invoice: {
    label: "청구",
    className: "border-violet-400/25 bg-violet-400/10 text-violet-100",
    dotClassName: "bg-violet-300",
  },
};

const KIND_ICON: Record<CalendarEvent["kind"], typeof CalendarDays> = {
  task: CheckSquare,
  project_due: BriefcaseBusiness,
  inquiry: Inbox,
  approval: ShieldCheck,
  invoice: Clock3,
};

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthTitle(date: Date): string {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
}

function buildCalendarDays(monthDate: Date): string[] {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = addDays(first, -mondayOffset);
  return Array.from({ length: 42 }, (_, index) => dateKey(addDays(start, index)));
}

function makeBlankForm(date: string): TaskForm {
  return {
    id: null,
    title: "",
    date,
    priority: "P1",
    scope: "today",
    status: "pending",
    notes: "",
  };
}

function eventToForm(event: CalendarEvent): TaskForm {
  return {
    id: event.sourceId ?? event.id.replace(/^task-/, ""),
    title: event.title,
    date: event.date,
    priority: event.priority ?? "P1",
    scope: event.scope ?? "today",
    status:
      event.status === "in_progress" ||
      event.status === "completed" ||
      event.status === "canceled" ||
      event.status === "deferred"
        ? event.status
        : "pending",
    notes: event.notes ?? "",
  };
}

function groupEvents(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    acc[event.date] ??= [];
    acc[event.date].push(event);
    return acc;
  }, {});
}

export function AdminCalendarClient({
  initialEvents,
  initialWarnings,
}: {
  initialEvents: CalendarEvent[];
  initialWarnings: string[];
}) {
  const today = dateKey(new Date());
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState(initialEvents);
  const [warnings, setWarnings] = useState(initialWarnings);
  const [form, setForm] = useState<TaskForm>(() => makeBlankForm(today));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
  const rangeStart = days[0];
  const rangeEnd = days[days.length - 1];
  const grouped = useMemo(() => groupEvents(events), [events]);
  const selectedEvents = useMemo(
    () => [...(grouped[selectedDate] ?? [])].sort((a, b) => a.kind.localeCompare(b.kind)),
    [grouped, selectedDate],
  );

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/calendar?start=${rangeStart}&end=${rangeEnd}`, {
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("일정 조회에 실패했습니다.");
      const payload = (await response.json()) as CalendarPayload;
      setEvents(payload.events);
      setWarnings(payload.warnings);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "일정 조회에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [rangeEnd, rangeStart]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  function selectDate(date: string) {
    setSelectedDate(date);
    setForm(makeBlankForm(date));
    setMessage(null);
  }

  function startCreate() {
    setForm(makeBlankForm(selectedDate));
    setMessage(null);
  }

  function startEdit(event: CalendarEvent) {
    if (!event.editable) {
      window.location.href = event.href;
      return;
    }
    setSelectedDate(event.date);
    setForm(eventToForm(event));
    setMessage(null);
  }

  async function saveTask() {
    if (!form.title.trim()) {
      setMessage("일정 제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const isEditing = Boolean(form.id);
      const response = await fetch(isEditing ? "/api/admin/tasks" : "/api/admin/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(
          isEditing
            ? {
                action: "update",
                id: form.id,
                title: form.title,
                dueDate: form.date,
                scope: form.scope,
                scopeDate: form.date,
                priority: form.priority,
                status: form.status,
                notes: form.notes,
              }
            : {
                title: form.title,
                dueDate: form.date,
                scope: form.scope,
                scopeDate: form.date,
                priority: form.priority,
                notes: form.notes,
              },
        ),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "저장에 실패했습니다.");
      }
      setMessage(isEditing ? "일정을 수정했습니다." : "일정을 추가했습니다.");
      setForm(makeBlankForm(form.date));
      await loadEvents();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTask() {
    if (!form.id) return;
    if (!window.confirm("이 업무 일정을 삭제할까요?")) return;

    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/tasks?id=${encodeURIComponent(form.id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "삭제에 실패했습니다.");
      }
      setMessage("일정을 삭제했습니다.");
      setForm(makeBlankForm(selectedDate));
      await loadEvents();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "삭제에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {warnings[0]}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-white/10 bg-card">
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMonthDate((current) => addMonths(current, -1))}
                className="grid size-9 place-items-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="이전 달"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setMonthDate(now);
                  selectDate(dateKey(now));
                }}
                className="h-9 rounded-md border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                오늘
              </button>
              <button
                type="button"
                onClick={() => setMonthDate((current) => addMonths(current, 1))}
                className="grid size-9 place-items-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label="다음 달"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">{monthTitle(monthDate)}</h3>
              {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-white/10 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 py-3">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayEvents = grouped[day] ?? [];
              const date = parseDateKey(day);
              const isCurrentMonth = date.getMonth() === monthDate.getMonth();
              const isSelected = day === selectedDate;
              const isToday = day === today;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`min-h-32 border-b border-r border-white/10 p-2 text-left transition hover:bg-white/[0.04] ${
                    isSelected ? "bg-primary/10 ring-1 ring-inset ring-primary/40" : ""
                  } ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full text-xs font-semibold ${
                      isToday ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 4).map((event) => {
                      const meta = KIND_META[event.kind];
                      return (
                        <span key={event.id} className={`block truncate rounded border px-1.5 py-1 text-[11px] ${meta.className}`}>
                          {event.title}
                        </span>
                      );
                    })}
                    {dayEvents.length > 4 && <span className="text-[11px] text-muted-foreground">+{dayEvents.length - 4}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-white/10 bg-card">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">선택 날짜</p>
                <h3 className="text-base font-semibold">{selectedDate}</h3>
              </div>
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-85"
              >
                <Plus className="size-4" />
                추가
              </button>
            </div>

            <div className="max-h-80 overflow-auto">
              {selectedEvents.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">선택한 날짜에 표시할 일정이 없습니다.</p>
              ) : (
                <div className="divide-y divide-white/10">
                  {selectedEvents.map((event) => {
                    const meta = KIND_META[event.kind];
                    const Icon = KIND_ICON[event.kind];
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => startEdit(event)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.03]"
                      >
                        <span className={`mt-1 size-2 rounded-full ${meta.dotClassName}`} />
                        <span className="min-w-0 flex-1">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${meta.className}`}>
                            <Icon className="size-3" />
                            {meta.label}
                          </span>
                          <span className="mt-1 block truncate text-sm font-medium">{event.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.editable ? "편집 가능" : "읽기 전용"} · {event.status ?? "-"}
                          </span>
                        </span>
                        {event.editable && <PencilLine className="mt-1 size-4 text-muted-foreground" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase text-primary">{form.id ? "Edit Task" : "New Task"}</p>
                <h3 className="mt-1 text-base font-semibold">업무 일정 입력/편집</h3>
              </div>
              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm(makeBlankForm(selectedDate))}
                  className="grid size-8 place-items-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  aria-label="편집 취소"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-title">
                제목
              </label>
              <input
                id="calendar-task-title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                placeholder="예: 견적서 검토, 고객 미팅, 납기 점검"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-date">
                    날짜
                  </label>
                  <input
                    id="calendar-task-date"
                    type="date"
                    value={form.date}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, date: event.target.value }));
                      setSelectedDate(event.target.value);
                    }}
                    className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-priority">
                    우선순위
                  </label>
                  <select
                    id="calendar-task-priority"
                    value={form.priority}
                    onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TaskForm["priority"] }))}
                    className="h-10 w-full rounded-md border border-white/10 bg-card px-3 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="P0">P0</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-scope">
                    범위
                  </label>
                  <select
                    id="calendar-task-scope"
                    value={form.scope}
                    onChange={(event) => setForm((current) => ({ ...current, scope: event.target.value as TaskForm["scope"] }))}
                    className="h-10 w-full rounded-md border border-white/10 bg-card px-3 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="today">일간</option>
                    <option value="week">주간</option>
                    <option value="month">월간</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-status">
                    상태
                  </label>
                  <select
                    id="calendar-task-status"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskForm["status"] }))}
                    className="h-10 w-full rounded-md border border-white/10 bg-card px-3 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="pending">대기</option>
                    <option value="in_progress">진행</option>
                    <option value="completed">완료</option>
                    <option value="deferred">이월</option>
                    <option value="canceled">취소</option>
                  </select>
                </div>
              </div>

              <label className="block text-xs font-medium text-muted-foreground" htmlFor="calendar-task-notes">
                메모
              </label>
              <textarea
                id="calendar-task-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                className="min-h-24 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/60"
                placeholder="필요한 실행 메모를 적어두세요."
              />

              {message && <p className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">{message}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveTask}
                  disabled={isSaving}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  저장
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={deleteTask}
                    disabled={isSaving}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-rose-400/30 px-3 text-sm font-semibold text-rose-200 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="size-4" />
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
