import { CalendarDays } from "lucide-react";
import { ExpensesManager } from "@/components/admin/expenses-manager";
import { MonthlyFinanceBars, RankedBarList, StatCard } from "@/components/admin/finance-charts";
import {
  buildExpenseCategorySummary,
  buildMonthlyExpenseSummary,
  getExpenses,
  getRecurringExpenses,
} from "@/lib/admin/expenses";
import { formatKRW } from "@/lib/admin/revenue";

export const metadata = {
  title: "지출 관리 | AIO 관리자",
};

function recentMonthOptions(count = 24): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const [{ expenses, error: expErr }, { recurring, error: recErr }] = await Promise.all([
    getExpenses(1200),
    getRecurringExpenses(),
  ]);

  const nowKey = new Date().toISOString().slice(0, 7);
  const monthly = buildMonthlyExpenseSummary(expenses);
  const monthOptions = Array.from(
    new Set([...monthly.map((row) => row.month), ...recentMonthOptions()]),
  ).sort((a, b) => b.localeCompare(a));
  const selectedMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : nowKey;
  const selectedMonthRows = expenses.filter((expense) => expense.date.slice(0, 7) === selectedMonth);
  const selectedMonthly = monthly.find((row) => row.month === selectedMonth);
  const selectedCategories = buildExpenseCategorySummary(selectedMonthRows);
  const activeMonthlyRecurring = recurring
    .filter((row) => row.active && row.cycle === "monthly" && row.amount)
    .reduce((sum, row) => sum + (row.amount ?? 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Expenses</p>
          <h2 className="mt-2 text-3xl font-semibold">지출 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            정기 구독, API 비용, 마케팅비, 기타 지출을 월별 그래프로 확인하고 지출 내역을 관리합니다.
          </p>
        </div>
        <form action="/admin/expenses" className="flex gap-2">
          <select
            name="month"
            defaultValue={selectedMonth}
            className="h-10 min-w-40 rounded-md border border-white/10 bg-card px-3 text-sm outline-none focus:border-primary/60"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-85">
            조회
          </button>
        </form>
      </div>

      {(expErr || recErr) && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {expErr ?? recErr}
        </p>
      )}

      <section className="rounded-xl border border-white/10 bg-card">
        <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">월별 지출 그래프</h3>
          </div>
          <p className="text-xs text-muted-foreground">지출 입력일 기준</p>
        </div>
        {monthly.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">지출 데이터가 없습니다.</p>
        ) : (
          <MonthlyFinanceBars
            rows={monthly.slice(0, 18).map((row) => ({ month: row.month, expense: row.total }))}
            selectedMonth={selectedMonth}
            mode="expense"
          />
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={`${selectedMonth} 총 지출`} value={formatKRW(selectedMonthly?.total ?? 0)} sub={`${selectedMonthly?.count ?? 0}건`} />
        {selectedCategories.map((category) => (
          <StatCard
            key={category.key}
            label={category.label}
            value={formatKRW(category.amount)}
            sub={category.key === "api" ? "API 비용 추후 연결" : `${category.count}건`}
          />
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <section className="rounded-xl border border-white/10 bg-card p-5">
          <h3 className="text-sm font-semibold">{selectedMonth} 지출 카테고리</h3>
          <div className="mt-5">
            <RankedBarList
              rows={selectedCategories.map((category) => ({
                label: category.label,
                value: category.amount,
                sub: category.key === "api" ? "API 비용 추후 연결" : `${category.count}건`,
              }))}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            활성 월간 정기구독 추정: {formatKRW(activeMonthlyRecurring)}
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">{selectedMonth} 지출 내역</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3">날짜</th>
                  <th className="px-5 py-3">항목</th>
                  <th className="px-5 py-3">공급사</th>
                  <th className="px-5 py-3 text-right">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {selectedMonthRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      선택한 월의 지출 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  selectedMonthRows.slice(0, 10).map((expense) => (
                    <tr key={expense.id} className="hover:bg-white/5">
                      <td className="px-5 py-3 text-muted-foreground">{expense.date}</td>
                      <td className="px-5 py-3 font-medium">{expense.item}</td>
                      <td className="px-5 py-3 text-muted-foreground">{expense.vendor ?? "-"}</td>
                      <td className="px-5 py-3 text-right font-semibold">{formatKRW(expense.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ExpensesManager initialExpenses={expenses} initialRecurring={recurring} />
    </div>
  );
}
