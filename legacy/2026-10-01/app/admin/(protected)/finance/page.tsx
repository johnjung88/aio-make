import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays } from "lucide-react";
import { MonthlyFinanceBars } from "@/components/admin/finance-charts";
import { getContracts } from "@/lib/admin/data";
import { EXPENSE_OPS_CATEGORY_LABELS, classifyExpenseCategory, getExpenses } from "@/lib/admin/expenses";
import { formatKRW, getRevenueReport } from "@/lib/admin/revenue";

export const metadata = {
  title: "재무 종합 관리 | AIO 관리자",
};

function monthKey(value: string): string {
  return value.slice(0, 7);
}

function recentMonthOptions(count = 24): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const [report, contractResult, expenseResult] = await Promise.all([
    getRevenueReport(),
    getContracts(200),
    getExpenses(500),
  ]);

  const nowKey = new Date().toISOString().slice(0, 7);
  const monthOptions = Array.from(
    new Set([...(report?.monthly ?? []).map((row) => row.month.slice(0, 7)), ...recentMonthOptions()]),
  ).sort((a, b) => b.localeCompare(a));
  const selectedMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : nowKey;
  const selectedMonthlyRow = report?.monthly.find((row) => row.month.slice(0, 7) === selectedMonth);
  const selectedExpenseRows = expenseResult.expenses.filter((expense) => monthKey(expense.date) === selectedMonth);
  const selectedContracts = contractResult.contracts.filter(
    (contract) => monthKey(contract.createdAt) === selectedMonth || (contract.dueDate && monthKey(contract.dueDate) === selectedMonth),
  );

  const selectedRevenue = selectedMonthlyRow?.revenue ?? 0;
  const selectedExpense = selectedMonthlyRow?.expense ?? selectedExpenseRows.reduce((sum, expense) => sum + expense.amount, 0);
  const selectedProfit = selectedMonthlyRow?.profit ?? selectedRevenue - selectedExpense;
  const selectedOutstanding = selectedContracts.reduce((sum, contract) => sum + contract.outstandingAmount, 0);
  const chartRows = (report?.monthly ?? [])
    .slice(0, 18)
    .map((row) => ({
      month: row.month.slice(0, 7),
      revenue: row.revenue,
      expense: row.expense,
      profit: row.profit,
    }));

  const alerts = [
    report?.dbError ? `재무 뷰 로드 오류: ${report.dbError}` : null,
    contractResult.error ? `계약 데이터 오류: ${contractResult.error}` : null,
    expenseResult.error ? `지출 데이터 오류: ${expenseResult.error}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Finance Control</p>
          <h2 className="mt-2 text-3xl font-semibold">재무 종합 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">월별 매출, 지출, 순익 흐름을 그래프로 보고 선택한 월의 상세 내역을 확인합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/revenue" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            매출 관리
          </Link>
          <Link href="/admin/expenses" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            지출 관리
          </Link>
        </div>
      </div>

      {alerts.length > 0 && (
        <section className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <div className="space-y-1 text-sm text-amber-100">
              {alerts.map((alert) => (
                <p key={alert}>{alert}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">월별 통계 조회</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">그래프에서 월별 매출, 지출, 순익을 한눈에 보고 조회 월을 바꿉니다.</p>
          </div>
          <form action="/admin/finance" className="flex gap-2">
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
        {chartRows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">월별 재무 데이터가 없습니다.</p>
        ) : (
          <>
            <MonthlyFinanceBars rows={chartRows} selectedMonth={selectedMonth} mode="finance" />
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 px-5 py-4 text-sm">
              <span className="text-muted-foreground">조회 월</span>
              <span className="font-medium">{selectedMonth}</span>
              <span>매출 <b className="text-primary">{formatKRW(selectedRevenue)}</b></span>
              <span>지출 <b className="text-red-300">{formatKRW(selectedExpense)}</b></span>
              <span>순익 <b className={selectedProfit >= 0 ? "text-emerald-300" : "text-amber-300"}>{formatKRW(selectedProfit)}</b></span>
              <span className="text-muted-foreground">관련 계약 {selectedContracts.length}건 · 미수 {formatKRW(selectedOutstanding)}</span>
            </div>
          </>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">{selectedMonth} 관련 계약</h3>
          </div>
          <div className="divide-y divide-white/10">
            {selectedContracts.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">해당 월 관련 계약이 없습니다.</p>
            ) : (
              selectedContracts.slice(0, 12).map((contract) => (
                <div key={contract.projectId} className="grid gap-2 px-5 py-3 text-sm md:grid-cols-[1fr_110px_110px] md:items-center">
                  <div>
                    <p className="font-medium">{contract.customerName} · {contract.productName}</p>
                    <p className="text-xs text-muted-foreground">생성 {contract.createdAt.slice(0, 10)} · 납기 {contract.dueDate ?? "-"}</p>
                  </div>
                  <span className="text-right text-primary">{formatKRW(contract.paidAmount)}</span>
                  <span className="text-right text-amber-300">{formatKRW(contract.outstandingAmount)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">{selectedMonth} 지출 내역</h3>
          </div>
          <div className="divide-y divide-white/10">
            {selectedExpenseRows.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">해당 월 지출 내역이 없습니다.</p>
            ) : (
              selectedExpenseRows.slice(0, 12).map((expense) => (
                <div key={expense.id} className="grid gap-2 px-5 py-3 text-sm md:grid-cols-[90px_1fr_120px] md:items-center">
                  <span className="text-xs text-muted-foreground">{expense.date}</span>
                  <div>
                    <p className="font-medium">{expense.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {expense.vendor ?? "-"} · {EXPENSE_OPS_CATEGORY_LABELS[classifyExpenseCategory(expense)]}
                    </p>
                  </div>
                  <span className="text-right text-red-300">{formatKRW(expense.amount)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-card p-5">
        <h3 className="text-sm font-semibold">재무 실행 기준</h3>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          {[
            { href: "/admin/approvals", label: "재무 승인대기 확인", desc: "환불, 정산, 미수 대응, 가격 확정" },
            { href: "/admin/contracts", label: "계약/미수 확인", desc: "프로젝트별 결제 상태 확인" },
            { href: "/admin/expenses", label: "지출 추가 입력", desc: "정기 구독, API 비용, 마케팅비, 기타" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
              <span className="flex items-center justify-between gap-3 font-medium">
                {action.label}
                <ArrowRight className="size-4 text-primary" />
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{action.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
