import { TrendingUp, Wallet, BarChart2, CreditCard } from "lucide-react";
import {
  getRevenueReport,
  formatKRW,
  channelLabel,
  categoryLabel,
} from "@/lib/admin/revenue";

export const metadata = {
  title: "매출 리포트 | AIO 관리자",
};

export default async function RevenuePage() {
  const report = await getRevenueReport();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Revenue</p>
        <h2 className="mt-2 text-3xl font-semibold">매출 리포트</h2>
        <p className="mt-2 text-sm text-muted-foreground">전체 매출 · 채널별 귀속 · 월별 손익</p>
      </div>

      {!report ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase 관리자 환경변수가 없어 매출 데이터를 표시할 수 없습니다.
        </p>
      ) : (
        <>
          {/* KPI 카드 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "이번 달 매출",
                value: formatKRW(report.kpi.thisMonthRevenue),
                sub:   `비용 ${formatKRW(report.kpi.thisMonthExpense)}`,
                icon:  TrendingUp,
              },
              {
                label: "이번 달 순이익",
                value: formatKRW(report.kpi.thisMonthProfit),
                sub:   report.kpi.thisMonthProfit >= 0 ? "흑자" : "적자",
                icon:  BarChart2,
              },
              {
                label: "누적 실입금",
                value: formatKRW(report.kpi.totalPaid),
                sub:   "전체 기간",
                icon:  Wallet,
              },
              {
                label: "미수금 총액",
                value: formatKRW(report.kpi.totalOutstanding),
                sub:   `평균 계약 ${formatKRW(report.kpi.avgContractAmount)}`,
                icon:  CreditCard,
              },
            ].map(({ label, value, sub, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className="size-4 text-primary" />
                </div>
                <p className="mt-4 text-2xl font-semibold">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {/* 월별 매출 추이 */}
          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">월별 손익 (최근 24개월)</h3>
            </div>
            {report.monthly.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
            ) : (
              <>
                {/* 막대 그래프 */}
                <div className="px-5 pt-4 pb-2">
                  <MonthlyChart rows={report.monthly.slice(0, 12).reverse()} />
                </div>
                {/* 상세 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-t border-white/8 text-left text-xs text-muted-foreground">
                        <th className="px-5 py-3">월</th>
                        <th className="px-5 py-3 text-right">매출</th>
                        <th className="px-5 py-3 text-right">비용</th>
                        <th className="px-5 py-3 text-right">순이익</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {report.monthly.map((row) => (
                        <tr key={row.month} className="hover:bg-white/5">
                          <td className="px-5 py-3 font-medium">{row.month.slice(0, 7)}</td>
                          <td className="px-5 py-3 text-right">{formatKRW(row.revenue)}</td>
                          <td className="px-5 py-3 text-right text-red-400/80">{formatKRW(row.expense)}</td>
                          <td className={`px-5 py-3 text-right font-semibold ${row.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {row.profit >= 0 ? "+" : ""}{formatKRW(row.profit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* 채널별 매출 */}
          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">채널별 매출 귀속</h3>
            </div>
            {report.channels.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                      <th className="px-5 py-3">채널</th>
                      <th className="px-5 py-3 text-right">리드</th>
                      <th className="px-5 py-3 text-right">계약</th>
                      <th className="px-5 py-3 text-right">실입금</th>
                      <th className="px-5 py-3 text-right">미수금</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {report.channels.map((ch) => (
                      <tr key={ch.channel} className="hover:bg-white/5">
                        <td className="px-5 py-3 font-medium">{channelLabel(ch.channel)}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground">{ch.leads}</td>
                        <td className="px-5 py-3 text-right text-muted-foreground">{ch.projects}</td>
                        <td className="px-5 py-3 text-right text-primary font-semibold">{formatKRW(ch.paid_amount)}</td>
                        <td className="px-5 py-3 text-right text-amber-400">{formatKRW(ch.outstanding_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 카테고리별 매출 */}
          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">서비스별 매출</h3>
            </div>
            {report.categories.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
            ) : (
              <div className="space-y-3 p-5">
                {(() => {
                  const max = Math.max(...report.categories.map((c) => c.paid_amount), 1);
                  return report.categories.map((cat) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{categoryLabel(cat.category)}</span>
                        <span className="text-muted-foreground">
                          {formatKRW(cat.paid_amount)} · 계약 {cat.projects}건
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.round((cat.paid_amount / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

// ── 인라인 막대 차트 컴포넌트 ──────────────────────────────────
function MonthlyChart({ rows }: { rows: { month: string; revenue: number; expense: number; profit: number }[] }) {
  const maxVal = Math.max(...rows.flatMap((r) => [r.revenue, r.expense]), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {rows.map((r) => {
        const rPct = Math.round((r.revenue / maxVal) * 100);
        const ePct = Math.round((r.expense / maxVal) * 100);
        return (
          <div key={r.month} className="flex flex-1 flex-col items-center gap-1 min-w-0">
            <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 96 }}>
              <div
                className="w-3 rounded-t-sm bg-primary/70 transition-all"
                style={{ height: `${rPct}%` }}
                title={`매출 ${formatKRW(r.revenue)}`}
              />
              <div
                className="w-3 rounded-t-sm bg-red-400/40 transition-all"
                style={{ height: `${ePct}%` }}
                title={`비용 ${formatKRW(r.expense)}`}
              />
            </div>
            <span className="text-[9px] text-muted-foreground truncate w-full text-center">
              {r.month.slice(5, 7)}월
            </span>
          </div>
        );
      })}
    </div>
  );
}
