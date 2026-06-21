import Link from "next/link";
import { AlertTriangle, ArrowRight, Banknote, CalendarDays, CreditCard, Receipt, TrendingUp, Wallet } from "lucide-react";
import { getContracts } from "@/lib/admin/data";
import { getExpenses, getRecurringExpenses } from "@/lib/admin/expenses";
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
  const [report, contractResult, expenseResult, recurringResult] = await Promise.all([
    getRevenueReport(),
    getContracts(100),
    getExpenses(200),
    getRecurringExpenses(),
  ]);

  const nowKey = new Date().toISOString().slice(0, 7);
  const monthOptions = Array.from(new Set([...(report?.monthly ?? []).map((row) => row.month.slice(0, 7)), ...recentMonthOptions()])).sort((a, b) => b.localeCompare(a));
  const selectedMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : nowKey;
  const selectedMonthlyRow = report?.monthly.find((row) => row.month.slice(0, 7) === selectedMonth);
  const selectedMonthExpenses = expenseResult.expenses
    .filter((expense) => monthKey(expense.date) === selectedMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthExpenses = expenseResult.expenses
    .filter((expense) => monthKey(expense.date) === nowKey)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const selectedExpenseRows = expenseResult.expenses.filter((expense) => monthKey(expense.date) === selectedMonth);
  const selectedContractRows = contractResult.contracts.filter((contract) => monthKey(contract.createdAt) === selectedMonth || (contract.dueDate && monthKey(contract.dueDate) === selectedMonth));
  const activeRecurring = recurringResult.recurring.filter((expense) => expense.active);
  const monthlyRecurringEstimate = activeRecurring.reduce((sum, expense) => {
    const amount = expense.amount ?? 0;
    if (expense.cycle === "yearly") return sum + Math.round(amount / 12);
    if (expense.cycle === "quarterly") return sum + Math.round(amount / 3);
    return sum + amount;
  }, 0);
  const unpaidContracts = contractResult.contracts.filter((contract) => contract.outstandingAmount > 0);
  const riskContracts = contractResult.contracts.filter((contract) => contract.projectStatus === "blocked" || contract.paymentStatus !== "paid");

  const totalPaid = report?.kpi.totalPaid ?? contractResult.contracts.reduce((sum, contract) => sum + contract.paidAmount, 0);
  const totalOutstanding = report?.kpi.totalOutstanding ?? unpaidContracts.reduce((sum, contract) => sum + contract.outstandingAmount, 0);
  const thisMonthRevenue = report?.kpi.thisMonthRevenue ?? 0;
  const thisMonthExpense = report?.kpi.thisMonthExpense ?? currentMonthExpenses;
  const thisMonthProfit = report?.kpi.thisMonthProfit ?? thisMonthRevenue - thisMonthExpense;
  const selectedRevenue = selectedMonthlyRow?.revenue ?? 0;
  const selectedExpense = selectedMonthlyRow?.expense ?? selectedMonthExpenses;
  const selectedProfit = selectedMonthlyRow?.profit ?? selectedRevenue - selectedExpense;
  const selectedMargin = selectedRevenue > 0 ? Math.round((selectedProfit / selectedRevenue) * 100) : 0;
  const runwayExpense = thisMonthExpense + monthlyRecurringEstimate;

  const alerts = [
    totalOutstanding > 0 ? `미수금 ${formatKRW(totalOutstanding)} 확인 필요` : null,
    monthlyRecurringEstimate > 0 ? `월 정기비용 예상 ${formatKRW(monthlyRecurringEstimate)}` : null,
    report?.dbError ? `재무 뷰 로드 오류: ${report.dbError}` : null,
    contractResult.error ? `계약 데이터 오류: ${contractResult.error}` : null,
    expenseResult.error ? `지출 데이터 오류: ${expenseResult.error}` : null,
    recurringResult.error ? `정기비용 데이터 오류: ${recurringResult.error}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Finance Control</p>
          <h2 className="mt-2 text-3xl font-semibold">재무 종합 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">매출, 입금, 미수, 지출, 정기비용을 한 화면에서 보고 의사결정합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/finance?month=${nowKey}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            현재 월
          </Link>
          <Link href="/admin/revenue" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            매출 리포트
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
              {alerts.slice(0, 5).map((alert) => (
                <p key={alert}>{alert}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-white/10 bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">월별 통계 조회</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">현재 월뿐 아니라 과거 월의 매출, 지출, 순익, 관련 계약/지출 내역을 조회합니다.</p>
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: `${selectedMonth} 매출`, value: formatKRW(selectedRevenue), sub: selectedMonthlyRow ? "월별 뷰 기준" : "월별 뷰 없음" },
            { label: `${selectedMonth} 지출`, value: formatKRW(selectedExpense), sub: `${selectedExpenseRows.length}건` },
            { label: `${selectedMonth} 순익`, value: formatKRW(selectedProfit), sub: `${selectedMargin}% 마진` },
            { label: "관련 계약", value: `${selectedContractRows.length}건`, sub: "생성/납기 기준" },
            { label: "해당 월 미수", value: formatKRW(selectedContractRows.reduce((sum, contract) => sum + contract.outstandingAmount, 0)), sub: "관련 계약 기준" },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "이번 달 매출", value: formatKRW(thisMonthRevenue), sub: "입금 기준", icon: TrendingUp },
          { label: "이번 달 지출", value: formatKRW(thisMonthExpense), sub: "지출 기록 기준", icon: Receipt },
          { label: "이번 달 순익", value: formatKRW(thisMonthProfit), sub: thisMonthProfit >= 0 ? "흑자" : "적자", icon: Wallet },
          { label: "미수금", value: formatKRW(totalOutstanding), sub: `${unpaidContracts.length}건`, icon: CreditCard },
          { label: "월 고정비 추정", value: formatKRW(monthlyRecurringEstimate), sub: `활성 ${activeRecurring.length}건`, icon: Banknote },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">월별 재무 흐름</h3>
          </div>
          {!report || report.monthly.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">월별 손익 데이터가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3">월</th>
                    <th className="px-5 py-3 text-right">매출</th>
                    <th className="px-5 py-3 text-right">지출</th>
                    <th className="px-5 py-3 text-right">순익</th>
                    <th className="px-5 py-3 text-right">마진</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {report.monthly.slice(0, 24).map((row) => {
                    const margin = row.revenue > 0 ? Math.round((row.profit / row.revenue) * 100) : 0;
                    const isSelected = row.month.slice(0, 7) === selectedMonth;
                    return (
                      <tr key={row.month} className={isSelected ? "bg-primary/10" : "hover:bg-white/[0.03]"}>
                        <td className="px-5 py-3 font-medium">{row.month.slice(0, 7)}</td>
                        <td className="px-5 py-3 text-right">{formatKRW(row.revenue)}</td>
                        <td className="px-5 py-3 text-right text-red-300">{formatKRW(row.expense)}</td>
                        <td className={`px-5 py-3 text-right font-semibold ${row.profit >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                          {row.profit >= 0 ? "+" : ""}{formatKRW(row.profit)}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">{margin}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-white/10 bg-card p-5">
          <h3 className="text-sm font-semibold">재무 판단 메모</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>누적 실입금: <span className="font-semibold text-foreground">{formatKRW(totalPaid)}</span></p>
            <p>미수/정산/환불/가격 조정은 승인센터에서 의장님 승인 후 실행합니다.</p>
            <p>이번 달 지출 + 월 고정비 기준 관리 필요 비용: <span className="font-semibold text-foreground">{formatKRW(runwayExpense)}</span></p>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              { href: "/admin/approvals", label: "재무 승인대기 확인", desc: "환불, 정산, 미수 대응, 가격 확정" },
              { href: "/admin/contracts", label: "미수/계약 확인", desc: "프로젝트별 결제 상태 확인" },
              { href: "/admin/expenses", label: "비용 추가 입력", desc: "지출과 정기구독을 등록" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
                <span className="flex items-center justify-between gap-3 text-sm font-medium">
                  {action.label}
                  <ArrowRight className="size-4 text-primary" />
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{action.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">주의 계약/미수 항목</h3>
        </div>
        <div className="divide-y divide-white/10">
          {riskContracts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">주의할 계약/미수 항목이 없습니다.</p>
          ) : (
            riskContracts.slice(0, 10).map((contract) => (
              <div key={contract.projectId} className="grid gap-2 px-5 py-3 text-sm md:grid-cols-[1fr_120px_120px_120px] md:items-center">
                <div>
                  <p className="font-medium">{contract.customerName} · {contract.productName}</p>
                  <p className="text-xs text-muted-foreground">{contract.projectStatus} / {contract.paymentStatus}</p>
                </div>
                <span className="text-right text-muted-foreground">{formatKRW(contract.contractedAmount)}</span>
                <span className="text-right text-primary">{formatKRW(contract.paidAmount)}</span>
                <span className="text-right text-amber-300">{formatKRW(contract.outstandingAmount)}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
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
                    <p className="text-xs text-muted-foreground">{expense.vendor ?? "-"} · {expense.category}</p>
                  </div>
                  <span className="text-right text-red-300">{formatKRW(expense.amount)}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">{selectedMonth} 관련 계약</h3>
          </div>
          <div className="divide-y divide-white/10">
            {selectedContractRows.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">해당 월 관련 계약이 없습니다.</p>
            ) : (
              selectedContractRows.slice(0, 12).map((contract) => (
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
      </div>
    </div>
  );
}
