export const gaPeriods = [7, 28, 90] as const;
export type GaDays = (typeof gaPeriods)[number];
export type GaTotals = {
  activeUsers: number;
  sessions: number;
  views: number;
  leads: number;
};
export type GaRow = { name: string; value: number };
export type GaReport = {
  connected: boolean;
  status:
    | "connected"
    | "not_configured"
    | "invalid_config"
    | "authentication"
    | "permission"
    | "api_disabled"
    | "quota"
    | "unavailable";
  propertyId: string;
  measurementId: string;
  period: string;
  days: GaDays;
  error?: string;
  totals?: GaTotals;
  previous?: GaTotals;
  channels?: GaRow[];
  pages?: GaRow[];
  devices?: GaRow[];
  daily?: { date: string; sessions: number; views: number }[];
  fetchedAt?: string;
  dateRange?: { start: string; end: string };
  timeZone?: string;
  warnings?: string[];
  configuration?: {
    property: boolean;
    measurement: boolean;
    credentials: boolean;
  };
};
export type ApiReport = {
  rows?: {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
  }[];
  metadata?: {
    timeZone?: string;
    subjectToThresholding?: boolean;
    dataLossFromOtherRow?: boolean;
    samplingMetadatas?: unknown[];
  };
};
export function parseGaDays(value: string | null): GaDays | null {
  const days = Number(value ?? 28);
  return gaPeriods.includes(days as GaDays) ? (days as GaDays) : null;
}
export function percentChange(
  current: number,
  previous: number,
): number | null {
  return previous === 0
    ? current === 0
      ? 0
      : null
    : ((current - previous) / previous) * 100;
}
export function reportRequests(days: GaDays) {
  const current = { startDate: `${days}daysAgo`, endDate: "yesterday" };
  const previous = {
    startDate: `${days * 2}daysAgo`,
    endDate: `${days + 1}daysAgo`,
  };
  const make = (
    metrics: string[],
    dimensions: string[] = [],
    prior = false,
  ) => ({
    dateRanges: [prior ? previous : current],
    metrics: metrics.map((name) => ({ name })),
    dimensions: dimensions.map((name) => ({ name })),
    limit: String(dimensions[0] === "date" ? days : 10),
    orderBys:
      dimensions[0] === "date"
        ? [{ dimension: { dimensionName: "date" }, desc: false }]
        : [{ metric: { metricName: metrics[0] }, desc: true }],
  });
  const leadFilter = {
    filter: {
      fieldName: "eventName",
      stringFilter: { matchType: "EXACT", value: "generate_lead" },
    },
  };
  return [
    make(["activeUsers", "sessions", "screenPageViews"]),
    make(["activeUsers", "sessions", "screenPageViews"], [], true),
    { ...make(["eventCount"]), dimensionFilter: leadFilter },
    { ...make(["eventCount"], [], true), dimensionFilter: leadFilter },
    make(["sessions"], ["sessionDefaultChannelGroup"]),
    make(["screenPageViews"], ["pagePath"]),
    make(["sessions"], ["deviceCategory"]),
    make(["sessions", "screenPageViews"], ["date"]),
  ];
}
function metric(report: ApiReport, row: number, column: number) {
  const raw = report.rows?.[row]?.metricValues?.[column]?.value;
  if (raw == null) {
    if (!report.rows?.length) return 0;
    throw new Error("GA4 응답에 필요한 지표가 없습니다.");
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0)
    throw new Error("GA4 지표 형식 오류");
  return value;
}
export function normalizeReports(
  reports: ApiReport[],
  days: GaDays,
  now = new Date(),
) {
  if (reports.length !== 8) throw new Error("GA4 보고서 누락");
  const totals = (index: number, lead: number): GaTotals => ({
    activeUsers: metric(reports[index], 0, 0),
    sessions: metric(reports[index], 0, 1),
    views: metric(reports[index], 0, 2),
    leads: metric(reports[lead], 0, 0),
  });
  const rows = (index: number) =>
    (reports[index].rows ?? []).map((row, i) => ({
      name: row.dimensionValues?.[0]?.value || "(not set)",
      value: metric(reports[index], i, 0),
    }));
  const timeZone = reports[0].metadata?.timeZone || "Asia/Seoul";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find((p) => p.type === name)!.value;
  const today = Date.UTC(
    Number(part("year")),
    Number(part("month")) - 1,
    Number(part("day")),
  );
  const series = new Map(
    (reports[7].rows ?? []).map((r, i) => [
      r.dimensionValues?.[0]?.value,
      { sessions: metric(reports[7], i, 0), views: metric(reports[7], i, 1) },
    ]),
  );
  const daily = Array.from({ length: days }, (_, i) => {
    const date = new Date(today - (days - i) * 86400000)
      .toISOString()
      .slice(0, 10);
    return {
      date,
      ...(series.get(date.replaceAll("-", "")) ?? { sessions: 0, views: 0 }),
    };
  });
  const warnings: string[] = [];
  if (reports.some((r) => r.metadata?.subjectToThresholding))
    warnings.push(
      "개인정보 보호 기준으로 일부 데이터가 표시되지 않을 수 있습니다.",
    );
  if (reports.some((r) => r.metadata?.dataLossFromOtherRow))
    warnings.push("일부 항목이 기타 행으로 묶여 집계됐습니다.");
  if (reports.some((r) => r.metadata?.samplingMetadatas?.length))
    warnings.push("일부 통계에 표본 추출이 적용됐습니다.");
  return {
    totals: totals(0, 2),
    previous: totals(1, 3),
    channels: rows(4),
    pages: rows(5),
    devices: rows(6),
    daily,
    timeZone,
    dateRange: { start: daily[0].date, end: daily.at(-1)!.date },
    warnings,
  };
}
