"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import type { Expense, RecurringExpense } from "@/lib/admin/expenses";
import { EXPENSE_CATEGORIES, RECURRING_CYCLES } from "@/lib/admin/expenses-config";

function formatKRW(n?: number) {
  if (n == null) return "변동";
  if (n >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만`;
  return `${n.toLocaleString("ko-KR")}원`;
}

const CAT_LABELS = Object.fromEntries(EXPENSE_CATEGORIES);
const CYCLE_LABELS = Object.fromEntries(RECURRING_CYCLES);

// ── 지출 추가 폼 ─────────────────────────────────────────────

function AddExpenseForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      date: fd.get("date"),
      category: fd.get("category"),
      vendor: fd.get("vendor") || "",
      item: fd.get("item"),
      amount: Number(fd.get("amount")),
      currency: "KRW",
      payment_method: fd.get("payment_method") || undefined,
      vat_deductible: fd.get("vat_deductible") === "true",
      notes: fd.get("notes") || "",
    };
    startTransition(async () => {
      const res = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json();
        setErr(j.error ?? "저장 실패");
        return;
      }
      onSaved();
      onClose();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-card p-5 space-y-4">
      <h4 className="font-semibold">지출 추가</h4>
      {err && <p className="text-sm text-red-400">{err}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">날짜 *</label>
          <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">카테고리 *</label>
          <select name="category" required className="w-full rounded border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm">
            {EXPENSE_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">벤더/공급사</label>
          <input name="vendor" type="text" placeholder="Anthropic, 숨고 등" maxLength={100}
            className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">항목 *</label>
          <input name="item" type="text" required placeholder="Claude Max 구독" maxLength={200}
            className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">금액 (KRW) *</label>
          <input name="amount" type="number" min="0" required placeholder="290400"
            className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">결제 수단</label>
          <select name="payment_method" className="w-full rounded border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm">
            <option value="">선택</option>
            <option value="card_business">사업 카드</option>
            <option value="card_personal">개인 카드</option>
            <option value="bank_transfer">계좌이체</option>
            <option value="cash">현금</option>
            <option value="platform_credit">플랫폼 크레딧</option>
            <option value="other">기타</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input name="vat_deductible" type="checkbox" id="vat" value="true" className="size-4" />
          <label htmlFor="vat" className="text-sm text-muted-foreground">부가세 공제 가능</label>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">메모</label>
        <textarea name="notes" rows={2} maxLength={1000} placeholder="추가 설명"
          className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm resize-none" />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/5">
          취소
        </button>
        <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {isPending ? "저장 중…" : "저장"}
        </button>
      </div>
    </form>
  );
}

// ── 지출 목록 ────────────────────────────────────────────────

function ExpenseRow({ expense, onDeleted }: { expense: Expense; onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`'${expense.item}' 지출을 삭제할까요?`)) return;
    startTransition(async () => {
      await fetch("/api/admin/expenses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: expense.id }) });
      onDeleted();
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{expense.item}</span>
          {expense.vendor && <span className="text-xs text-muted-foreground">· {expense.vendor}</span>}
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{CAT_LABELS[expense.category] ?? expense.category}</span>
          {expense.vatDeductible && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">부가세↓</span>}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{expense.date}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold tabular-nums">{formatKRW(expense.amount)}</span>
        <button onClick={handleDelete} disabled={isPending} title="삭제"
          className="text-muted-foreground transition hover:text-red-400 disabled:opacity-30">
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ── 정기구독 행 ───────────────────────────────────────────────

function RecurringRow({ rec, onRefresh }: { rec: RecurringExpense; onRefresh: () => void }) {
  const [isPending, startTransition] = useTransition();

  function toggleActive() {
    startTransition(async () => {
      await fetch("/api/admin/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "recurring", id: rec.id, active: !rec.active }),
      });
      onRefresh();
    });
  }

  return (
    <div className={`flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0 ${!rec.active ? "opacity-40" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{rec.vendor}</span>
          <span className="text-xs text-muted-foreground">· {rec.item}</span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{CYCLE_LABELS[rec.cycle] ?? rec.cycle}</span>
          {rec.vatDeductible && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">부가세↓</span>}
        </div>
        {rec.nextCharge && <p className="mt-0.5 text-xs text-muted-foreground">다음 결제: {rec.nextCharge}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold tabular-nums">{formatKRW(rec.amount)}</span>
        <button onClick={toggleActive} disabled={isPending} title={rec.active ? "일시정지" : "재개"}
          className="text-muted-foreground transition hover:text-primary disabled:opacity-30">
          <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────

export function ExpensesManager({
  initialExpenses,
  initialRecurring,
}: {
  initialExpenses: Expense[];
  initialRecurring: RecurringExpense[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"expenses" | "recurring">("expenses");
  const [showAdd, setShowAdd] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState("");

  const refresh = () => router.refresh();

  const filtered = expenses.filter((e) => {
    const q = search.toLowerCase();
    return !q || e.item.toLowerCase().includes(q) || (e.vendor ?? "").toLowerCase().includes(q) || (e.notes ?? "").toLowerCase().includes(q);
  });

  const totalThisMonth = (() => {
    const m = new Date().toISOString().slice(0, 7);
    return expenses.filter((e) => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0);
  })();

  const monthlyRecurringTotal = initialRecurring
    .filter((r) => r.active && r.cycle === "monthly" && r.amount)
    .reduce((s, r) => s + (r.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-card p-4">
          <p className="text-xs text-muted-foreground">이번 달 지출</p>
          <p className="mt-2 text-2xl font-semibold">{formatKRW(totalThisMonth)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-card p-4">
          <p className="text-xs text-muted-foreground">월 정기구독 합계</p>
          <p className="mt-2 text-2xl font-semibold">{formatKRW(monthlyRecurringTotal)}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-card p-1 w-fit">
        <button onClick={() => setTab("expenses")} className={`rounded px-4 py-1.5 text-sm transition ${tab === "expenses" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          지출 내역
        </button>
        <button onClick={() => setTab("recurring")} className={`rounded px-4 py-1.5 text-sm transition ${tab === "recurring" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          정기구독
        </button>
      </div>

      {/* 지출 탭 */}
      {tab === "expenses" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="항목·벤더 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => setShowAdd((v) => !v)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="size-4" />
              지출 추가
            </button>
          </div>

          {showAdd && (
            <AddExpenseForm
              onClose={() => setShowAdd(false)}
              onSaved={() => { setShowAdd(false); refresh(); }}
            />
          )}

          <div className="rounded-lg border border-white/10 bg-card px-5 py-2">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">지출 내역이 없습니다.</p>
            ) : (
              filtered.map((e) => (
                <ExpenseRow key={e.id} expense={e} onDeleted={() => { setExpenses((prev) => prev.filter((x) => x.id !== e.id)); }} />
              ))
            )}
          </div>
        </div>
      )}

      {/* 정기구독 탭 */}
      {tab === "recurring" && (
        <div className="rounded-lg border border-white/10 bg-card px-5 py-2">
          {initialRecurring.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">정기구독 데이터가 없습니다.</p>
          ) : (
            initialRecurring.map((r) => (
              <RecurringRow key={r.id} rec={r} onRefresh={refresh} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
