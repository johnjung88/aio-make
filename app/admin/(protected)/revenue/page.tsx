import { CalendarDays } from "lucide-react";
import { MonthlyFinanceBars, RankedBarList, StatCard } from "@/components/admin/finance-charts";
import {
  getRevenueReport,
  formatKRW,
  channelLabel,
  categoryLabel,
  type MonthlyDimensionRevenue,
} from "@/lib/admin/revenue";

export const metadata = {
  title: "매출 관리 | AIO 관리자",
};

function recentMonthOptions(count = 24): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
}

function selectedMonthRows(rows: MonthlyDimensionRevenue[], month: string): MonthlyDimensionRevenue[] {
  return rows
    .filter((row) => row.month === month)
    .sort((a, b) => b.paid_amount - a.paid_amount);
}

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const report = await getRevenueReport();
  const nowKey = new Date().toISOString().slice(0, 7);
  const monthOptions = Array.from(
    new Set([...(report?.monthly ?? []).map((row) => row.month.slice(0, 7)), ...recentMonthOptions()]),
  ).sort((a, b) => b.localeCompare(a));
  const selectedMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : nowKey;
  const selectedMonthlyRow = report?.monthly.find((row) => row.month.slice(0, 7) === selectedMonth);
  const channelRows = report ? selectedMonthRows(report.monthlyChannels, selectedMonth) : [];
  const categoryRows = report ? selectedMonthRows(report.monthlyCategories, selectedMonth) : [];
  const selectedRevenue = selectedMonthlyRow?.revenue ?? channelRows.reduce((sum, row) => sum + row.paid_amount, 0);
  const selectedContracts = categoryRows.reduce((sum, row) => sum + row.projects, 0);
  const selectedContracted = categoryRows.reduce((sum, row) => sum + row.contracted_amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Revenue</p>
          <h2 className="mt-2 text-3xl font-semibold">매출 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">월별 매출 흐름과 채널별·서비스별 매출 귀속을 확인합니다.</p>
        </div>
        <form action="/admin/revenue" className="flex gap-2">
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

      {!report ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase 관리자 환경변수가 없어 매출 데이터를 표시할 수 없습니다.
        </p>
      ) : (
        <>
          {report.dbError && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              데이터 로드 실패: {report.dbError}
            </p>
          )}

          <section className="rounded-xl border border-white/10 bg-card">
            <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">월별 매출 그래프</h3>
              </div>
              <p className="text-xs text-muted-foreground">입금 완료 금액 기준</p>
            </div>
            {report.monthly.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
            ) : (
              <MonthlyFinanceBars
                rows={report.monthly.slice(0, 18).map((row) => ({ month: row.month.slice(0, 7), revenue: row.revenue }))}
                selectedMonth={selectedMonth}
                mode="revenue"
              />
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={`${selectedMonth} 매출`} value={formatKRW(selectedRevenue)} sub="입금 기준" />
            <StatCard label="관련 계약건수" value={`${selectedContracts.toLocaleString("ko-KR")}건`} sub="생성 월 기준" />
            <StatCard label="계약 금액" value={formatKRW(selectedContracted)} sub="계약 생성 월 기준" />
            <StatCard label="매출 채널" value={`${channelRows.filter((row) => row.paid_amount > 0).length}개`} sub="입금 발생 채널" />
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-card p-5">
              <h3 className="text-sm font-semibold">{selectedMonth} 채널별 매출 그래프</h3>
              <div className="mt-5">
                <RankedBarList
                  rows={channelRows
                    .filter((row) => row.paid_amount > 0 || row.projects > 0)
                    .map((row) => ({
                      label: channelLabel(row.key),
                      value: row.paid_amount,
                      sub: `계약 ${row.projects}건`,
                    }))}
                />
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-card p-5">
              <h3 className="text-sm font-semibold">{selectedMonth} 서비스별 매출 그래프</h3>
              <div className="mt-5">
                <RankedBarList
                  rows={categoryRows
                    .filter((row) => row.paid_amount > 0 || row.projects > 0)
                    .map((row) => ({
                      label: categoryLabel(row.key),
                      value: row.paid_amount,
                      sub: `계약 ${row.projects}건`,
                    }))}
                />
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">월별 채널 매출 표</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3">월</th>
                    <th className="px-5 py-3">채널</th>
                    <th className="px-5 py-3 text-right">계약</th>
                    <th className="px-5 py-3 text-right">계약금액</th>
                    <th className="px-5 py-3 text-right">입금매출</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {report.monthlyChannels.slice(0, 80).map((row) => (
                    <tr key={`${row.month}-${row.key}`} className={row.month === selectedMonth ? "bg-primary/10" : "hover:bg-white/5"}>
                      <td className="px-5 py-3 font-medium">{row.month}</td>
                      <td className="px-5 py-3">{channelLabel(row.key)}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{row.projects}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{formatKRW(row.contracted_amount)}</td>
                      <td className="px-5 py-3 text-right font-semibold text-primary">{formatKRW(row.paid_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">월별 서비스 매출 표</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3">월</th>
                    <th className="px-5 py-3">서비스</th>
                    <th className="px-5 py-3 text-right">계약</th>
                    <th className="px-5 py-3 text-right">계약금액</th>
                    <th className="px-5 py-3 text-right">입금매출</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {report.monthlyCategories.slice(0, 80).map((row) => (
                    <tr key={`${row.month}-${row.key}`} className={row.month === selectedMonth ? "bg-primary/10" : "hover:bg-white/5"}>
                      <td className="px-5 py-3 font-medium">{row.month}</td>
                      <td className="px-5 py-3">{categoryLabel(row.key)}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{row.projects}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{formatKRW(row.contracted_amount)}</td>
                      <td className="px-5 py-3 text-right font-semibold text-primary">{formatKRW(row.paid_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
