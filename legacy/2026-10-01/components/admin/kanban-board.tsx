"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Flag, CalendarDays, Loader2 } from "lucide-react";
import type { TaskRow, TaskScope, TaskStatus } from "@/lib/admin/tasks";

// ── 상수 ──────────────────────────────────────────────────────
const PRIORITY_LABEL: Record<string, { label: string; className: string }> = {
  P0: { label: "P0 긴급", className: "bg-red-500/20 text-red-300 border border-red-500/30" },
  P1: { label: "P1",       className: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
  P2: { label: "P2",       className: "bg-white/10 text-muted-foreground border border-white/10" },
};

const STATUS_COLS: { status: TaskStatus; label: string }[] = [
  { status: "pending",     label: "대기" },
  { status: "in_progress", label: "진행 중" },
  { status: "completed",   label: "완료" },
];

const SCOPE_LABELS: Record<TaskScope, string> = {
  today: "오늘",
  week:  "이번 주",
  month: "이번 달",
};

// ── 타입 ──────────────────────────────────────────────────────
interface KanbanBoardProps {
  todayTasks:  TaskRow[];
  weekTasks:   TaskRow[];
  monthTasks:  TaskRow[];
  today:       string;   // "YYYY-MM-DD"
  weekStart:   string;
  monthStart:  string;
}

// ── 컴포넌트 ──────────────────────────────────────────────────
export function KanbanBoard({
  todayTasks, weekTasks, monthTasks, today, weekStart, monthStart,
}: KanbanBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeScope, setActiveScope] = useState<TaskScope>("today");
  const [addingScope, setAddingScope]  = useState<TaskScope | null>(null);
  const [newTitle,   setNewTitle]      = useState("");
  const [newPriority, setNewPriority]  = useState<"P0" | "P1" | "P2">("P1");

  const tasksByScope: Record<TaskScope, TaskRow[]> = {
    today: todayTasks, week: weekTasks, month: monthTasks,
  };
  const scopeDates: Record<TaskScope, string> = {
    today: today, week: weekStart, month: monthStart,
  };

  const tasks = tasksByScope[activeScope];

  // ── 상태 변경 ─────────────────────────────────────────────
  async function changeStatus(id: string, status: TaskStatus) {
    await fetch("/api/admin/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", id, status }),
    });
    startTransition(() => router.refresh());
  }

  // ── 삭제 ──────────────────────────────────────────────────
  async function deleteTask(id: string) {
    if (!confirm("이 할 일을 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/tasks?id=${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  // ── 새 할 일 추가 ─────────────────────────────────────────
  async function addTask() {
    if (!newTitle.trim() || !addingScope) return;
    await fetch("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:     newTitle.trim(),
        scope:     addingScope,
        scopeDate: scopeDates[addingScope],
        priority:  newPriority,
      }),
    });
    setNewTitle("");
    setAddingScope(null);
    startTransition(() => router.refresh());
  }

  // ── 렌더 ──────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Scope 탭 */}
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-card p-1">
        {(["today", "week", "month"] as TaskScope[]).map((scope) => (
          <button
            key={scope}
            onClick={() => setActiveScope(scope)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              activeScope === scope
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {SCOPE_LABELS[scope]}
            <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[11px]">
              {tasksByScope[scope].length}
            </span>
          </button>
        ))}
      </div>

      {/* 새 할 일 추가 버튼 */}
      {addingScope !== activeScope ? (
        <button
          onClick={() => setAddingScope(activeScope)}
          className="flex items-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          <Plus className="size-4" />
          {SCOPE_LABELS[activeScope]}에 할 일 추가
        </button>
      ) : (
        <div className="rounded-xl border border-white/10 bg-card p-4 space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTask(); if (e.key === "Escape") { setAddingScope(null); setNewTitle(""); } }}
            placeholder="할 일 내용 입력 후 Enter"
            autoFocus
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
          />
          <div className="flex items-center gap-3">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as "P0" | "P1" | "P2")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground outline-none"
            >
              <option value="P0">P0 긴급</option>
              <option value="P1">P1 보통</option>
              <option value="P2">P2 낮음</option>
            </select>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => { setAddingScope(null); setNewTitle(""); }} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">취소</button>
              <button onClick={addTask} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">추가</button>
            </div>
          </div>
        </div>
      )}

      {/* 칸반 컬럼 */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          업데이트 중…
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {STATUS_COLS.map(({ status, label }) => {
          const col = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="rounded-xl border border-white/10 bg-card">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">{col.length}</span>
              </div>
              <div className="divide-y divide-white/8">
                {col.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-muted-foreground/50">없음</p>
                )}
                {col.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={changeStatus}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TaskCard ───────────────────────────────────────────────────
function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: TaskRow;
  onStatusChange: (id: string, s: TaskStatus) => void;
  onDelete:       (id: string) => void;
}) {
  const pri = PRIORITY_LABEL[task.priority] ?? PRIORITY_LABEL.P1;

  const NEXT_STATUS: Partial<Record<TaskStatus, TaskStatus>> = {
    pending:     "in_progress",
    in_progress: "completed",
    completed:   "pending",
  };
  const NEXT_LABEL: Partial<Record<TaskStatus, string>> = {
    pending:     "시작",
    in_progress: "완료",
    completed:   "되돌리기",
  };

  return (
    <div className="group px-4 py-3 space-y-2">
      <div className="flex items-start gap-2">
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pri.className}`}>
          {pri.label}
        </span>
        <p className={`flex-1 text-sm leading-snug ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 text-muted-foreground/30 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {task.due_date && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CalendarDays className="size-3" />
            {task.due_date}
          </span>
        )}
        {task.source === "telegram" && (
          <span className="text-[10px] text-muted-foreground">봇</span>
        )}
        {NEXT_STATUS[task.status] && (
          <button
            onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status]!)}
            className="ml-auto flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Flag className="size-3" />
            {NEXT_LABEL[task.status]}
          </button>
        )}
      </div>
    </div>
  );
}
