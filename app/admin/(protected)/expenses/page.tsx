import { getExpenses, getRecurringExpenses } from "@/lib/admin/expenses";
import { ExpensesManager } from "@/components/admin/expenses-manager";

export const metadata = {
  title: "지출 관리 | AIO 관리자",
};

export default async function ExpensesPage() {
  const [{ expenses, error: expErr }, { recurring, error: recErr }] = await Promise.all([
    getExpenses(),
    getRecurringExpenses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Expenses</p>
        <h2 className="mt-2 text-3xl font-semibold">지출 관리</h2>
        <p className="mt-2 text-sm text-muted-foreground">사업 비용 기록과 정기구독 현황을 관리합니다. 매출 리포트의 손익 계산에 자동 반영됩니다.</p>
      </div>

      {(expErr || recErr) && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {expErr ?? recErr}
        </p>
      )}

      <ExpensesManager initialExpenses={expenses} initialRecurring={recurring} />
    </div>
  );
}
