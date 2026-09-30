import { formatKRW } from "@/lib/admin/revenue";

export type MonthlyFinanceChartRow = {
  month: string;
  revenue?: number;
  expense?: number;
  profit?: number;
};

export type RankedBarRow = {
  label: string;
  value: number;
  sub?: string;
};

export function MonthlyFinanceBars({
  rows,
  selectedMonth,
  mode = "finance",
}: {
  rows: MonthlyFinanceChartRow[];
  selectedMonth?: string;
  mode?: "finance" | "revenue" | "expense";
}) {
  const visibleRows = rows.slice().reverse();
  const max = Math.max(
    ...visibleRows.flatMap((row) => [row.revenue ?? 0, row.expense ?? 0, Math.abs(row.profit ?? 0)]),
    1,
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[720px] items-end gap-3 px-5 pb-5 pt-6" style={{ height: 230 }}>
        {visibleRows.map((row) => {
          const revenueHeight = Math.max(4, Math.round(((row.revenue ?? 0) / max) * 150));
          const expenseHeight = Math.max(4, Math.round(((row.expense ?? 0) / max) * 150));
          const profitHeight = Math.max(4, Math.round((Math.abs(row.profit ?? 0) / max) * 150));
          const selected = selectedMonth === row.month.slice(0, 7);

          return (
            <div key={row.month} className="flex flex-1 min-w-0 flex-col items-center gap-2">
              <div className={`flex h-[160px] w-full items-end justify-center gap-1 rounded-md px-1 py-1 ${selected ? "bg-primary/10" : ""}`}>
                {(mode === "finance" || mode === "revenue") && (
                  <div
                    className="w-4 rounded-t-sm bg-primary/75"
                    style={{ height: revenueHeight }}
                    title={`매출 ${formatKRW(row.revenue ?? 0)}`}
                  />
                )}
                {(mode === "finance" || mode === "expense") && (
                  <div
                    className="w-4 rounded-t-sm bg-red-400/55"
                    style={{ height: expenseHeight }}
                    title={`지출 ${formatKRW(row.expense ?? 0)}`}
                  />
                )}
                {mode === "finance" && (
                  <div
                    className={`w-4 rounded-t-sm ${(row.profit ?? 0) >= 0 ? "bg-emerald-400/65" : "bg-amber-400/65"}`}
                    style={{ height: profitHeight }}
                    title={`순익 ${formatKRW(row.profit ?? 0)}`}
                  />
                )}
              </div>
              <span className={`w-full truncate text-center text-[10px] ${selected ? "text-primary" : "text-muted-foreground"}`}>
                {row.month.slice(2, 7)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-3 text-xs text-muted-foreground">
        {(mode === "finance" || mode === "revenue") && <LegendDot className="bg-primary/75" label="매출" />}
        {(mode === "finance" || mode === "expense") && <LegendDot className="bg-red-400/55" label="지출" />}
        {mode === "finance" && <LegendDot className="bg-emerald-400/65" label="순익" />}
      </div>
    </div>
  );
}

export function RankedBarList({ rows }: { rows: RankedBarRow[] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">표시할 데이터가 없습니다.</p>
      ) : (
        rows.map((row) => (
          <div key={row.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium">{row.label}</span>
              <span className="shrink-0 text-muted-foreground">{formatKRW(row.value)}{row.sub ? ` · ${row.sub}` : ""}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.max(3, Math.round((row.value / max) * 100))}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}
