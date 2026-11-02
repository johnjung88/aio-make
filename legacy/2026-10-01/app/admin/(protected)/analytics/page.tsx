import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import { Users, MousePointerClick, TrendingUp, Eye, Smartphone, Monitor, Globe, LayoutList } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  website:              "웹사이트",
  "shopping-mall":      "쇼핑몰",
  "logo-business-card": "로고·명함",
  "detail-page":        "상세페이지",
  "ppt-design":         "PPT",
  "automation-app":     "자동화·앱",
  "video-content":      "영상",
};

const EVENT_LABELS: Record<string, string> = {
  pageview:            "페이지뷰",
  click_cta:           "CTA 클릭",
  click_category_card: "카테고리 카드",
  click_portfolio_card:"포트폴리오 클릭",
  click_phone:         "전화 클릭",
  click_email:         "이메일 클릭",
  click_kakao:         "카카오 클릭",
  open_chatbot:        "챗봇 열기",
  submit_chat:         "채팅 전송",
  submit_quote:        "견적 제출",
  submit_contact:      "문의 제출",
  scroll_depth_50:     "스크롤 50%",
  scroll_depth_90:     "스크롤 90%",
  time_30s:            "체류 30초",
  time_2min:           "체류 2분",
};

async function getAnalyticsData() {
  if (!hasSupabaseAdminConfig()) return null;
  const supabase = createSupabaseAdminClient();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let results;
  try {
    results = await Promise.all([
      // KPI
      supabase.from("visitor_sessions").select("id, has_converted, total_pageviews", { count: "exact" }).gte("first_seen_at", since30),
      supabase.from("visitor_events").select("id", { count: "exact" }).gte("occurred_at", since30),
      // 채널 퍼널
      supabase.from("v_channel_funnel").select("*"),
      // 카테고리 관심도
      supabase.from("v_category_interest").select("*"),
      // 기기별
      supabase.from("visitor_sessions").select("device").gte("first_seen_at", since30),
      // 유입 경로 TOP 10
      supabase.from("visitor_sessions").select("referrer_host").gte("first_seen_at", since30).not("referrer_host", "is", null),
      // 랜딩 페이지 TOP 10
      supabase.from("visitor_sessions").select("first_landing_path").gte("first_seen_at", since30).not("first_landing_path", "is", null),
      // 이벤트 타입별
      supabase.from("visitor_events").select("event_type").gte("occurred_at", since30),
      // 일별 트래픽 (최근 14일, 상위 경로 제외하고 합산)
      supabase.from("v_daily_traffic").select("day, events, unique_visitors").gte("day", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)).order("day", { ascending: true }),
      // 최근 세션 10개
      supabase.from("visitor_sessions").select("id, device, referrer_host, first_landing_path, first_utm_source, total_pageviews, has_converted, first_seen_at").order("first_seen_at", { ascending: false }).limit(10),
    ]);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "분석 데이터를 불러오지 못했습니다.",
      kpi: { totalSessions: 0, totalEvents: 0, conversions: 0, convRate: "0.0", avgPageviews: "0", returnVisitors: 0 },
      funnel: [],
      categoryInterest: [],
      deviceMap: {},
      topReferrers: [],
      topLandings: [],
      topEvents: [],
      dailyTraffic: [],
      recentSessions: [],
    };
  }

  const [
    sessions,
    events,
    funnel,
    categoryInterest,
    deviceRows,
    referrerRows,
    landingRows,
    eventTypeRows,
    dailyRows,
    recentSessions,
  ] = results;

  const sessionList = sessions.data ?? [];
  const totalSessions   = sessions.count ?? 0;
  const totalEvents     = events.count ?? 0;
  const conversions     = sessionList.filter((s) => s.has_converted).length;
  const convRate        = totalSessions > 0 ? ((conversions / totalSessions) * 100).toFixed(1) : "0.0";
  const avgPageviews    = totalSessions > 0
    ? (sessionList.reduce((s, x) => s + (x.total_pageviews ?? 1), 0) / totalSessions).toFixed(1)
    : "0";
  const returnVisitors  = sessionList.filter((s) => (s.total_pageviews ?? 1) >= 2).length;

  // 기기별 집계
  const deviceMap: Record<string, number> = {};
  for (const r of deviceRows.data ?? []) {
    const d = String(r.device ?? "other");
    deviceMap[d] = (deviceMap[d] ?? 0) + 1;
  }

  // 유입 경로 TOP 8
  const refMap: Record<string, number> = {};
  for (const r of referrerRows.data ?? []) {
    const h = String(r.referrer_host);
    refMap[h] = (refMap[h] ?? 0) + 1;
  }
  const topReferrers = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // 랜딩 페이지 TOP 8
  const landingMap: Record<string, number> = {};
  for (const r of landingRows.data ?? []) {
    const p = String(r.first_landing_path);
    landingMap[p] = (landingMap[p] ?? 0) + 1;
  }
  const topLandings = Object.entries(landingMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // 이벤트 타입별 집계
  const evtMap: Record<string, number> = {};
  for (const r of eventTypeRows.data ?? []) {
    const t = String(r.event_type);
    evtMap[t] = (evtMap[t] ?? 0) + 1;
  }
  const topEvents = Object.entries(evtMap).sort((a, b) => b[1] - a[1]);

  // 일별 트래픽 합산 (동일 날짜 여러 경로 → 합산)
  const dailyMap: Record<string, { events: number; unique_visitors: number }> = {};
  for (const r of dailyRows.data ?? []) {
    const d = String(r.day).slice(0, 10);
    if (!dailyMap[d]) dailyMap[d] = { events: 0, unique_visitors: 0 };
    dailyMap[d].events += Number(r.events ?? 0);
    dailyMap[d].unique_visitors += Number(r.unique_visitors ?? 0);
  }
  const dailyTraffic = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day: day.slice(5), ...v }));   // "MM-DD" 형식

  return {
    kpi: { totalSessions, totalEvents, conversions, convRate, avgPageviews, returnVisitors },
    funnel: funnel.data ?? [],
    categoryInterest: categoryInterest.data ?? [],
    deviceMap,
    topReferrers,
    topLandings,
    topEvents,
    dailyTraffic,
    recentSessions: recentSessions.data ?? [],
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Analytics</p>
        <h2 className="mt-2 text-3xl font-semibold">방문자 분석</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          최근 30일 기준 · Supabase 자체 추적 (GA4 키 미설정 시 GA 비활성)
        </p>
      </div>

      {!data ? (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase 관리자 환경변수가 없어 분석 데이터를 표시할 수 없습니다.
        </p>
      ) : (
        <>
          {data.error && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              분석 데이터 로드 상태: {data.error}
            </p>
          )}
          {/* ── KPI 6개 ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "총 세션",      value: data.kpi.totalSessions.toLocaleString("ko-KR"),   icon: Users },
              { label: "총 이벤트",    value: data.kpi.totalEvents.toLocaleString("ko-KR"),     icon: MousePointerClick },
              { label: "전환(견적)",   value: data.kpi.conversions.toLocaleString("ko-KR"),     icon: TrendingUp },
              { label: "전환율",       value: `${data.kpi.convRate}%`,                          icon: Eye },
              { label: "평균 페이지뷰", value: `${data.kpi.avgPageviews}p`,                     icon: LayoutList },
              { label: "2페이지+ 세션", value: data.kpi.returnVisitors.toLocaleString("ko-KR"), icon: Globe },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <Icon className="size-4 text-primary" />
                </div>
                <p className="mt-3 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* ── 일별 트래픽 + 기기별 ── */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 일별 방문자 차트 */}
            <section className="lg:col-span-2 rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">일별 방문자 (최근 14일)</h3>
              </div>
              <div className="px-5 py-4">
                {data.dailyTraffic.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
                ) : (
                  <DailyChart rows={data.dailyTraffic} />
                )}
              </div>
            </section>

            {/* 기기별 */}
            <section className="rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">기기별 세션</h3>
              </div>
              <div className="space-y-3 p-5">
                {Object.entries(data.deviceMap).length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">데이터 없음</p>
                ) : (
                  Object.entries(data.deviceMap)
                    .sort((a, b) => b[1] - a[1])
                    .map(([device, count]) => {
                      const total = Object.values(data.deviceMap).reduce((s, v) => s + v, 0);
                      const pct = Math.round((count / total) * 100);
                      const Icon = device === "mobile" ? Smartphone : Monitor;
                      return (
                        <div key={device} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5">
                              <Icon className="size-3 text-muted-foreground" />
                              {device === "desktop" ? "데스크탑" : device === "mobile" ? "모바일" : device === "tablet" ? "태블릿" : device}
                            </span>
                            <span className="text-muted-foreground">{count}세션 ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </section>
          </div>

          {/* ── 채널 퍼널 ── */}
          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">채널별 유입 퍼널</h3>
            </div>
            {data.funnel.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                      <th className="px-5 py-3">채널</th>
                      <th className="px-5 py-3">캠페인</th>
                      <th className="px-5 py-3 text-right">세션</th>
                      <th className="px-5 py-3 text-right">2페이지+</th>
                      <th className="px-5 py-3 text-right">전환</th>
                      <th className="px-5 py-3 text-right">전환율</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {data.funnel.map((row: Record<string, unknown>, i: number) => (
                      <tr key={i} className="hover:bg-white/5">
                        <td className="px-5 py-3 font-medium">{String(row.source ?? "직접")}</td>
                        <td className="px-5 py-3 text-muted-foreground">{String(row.campaign ?? "-")}</td>
                        <td className="px-5 py-3 text-right">{String(row.sessions)}</td>
                        <td className="px-5 py-3 text-right">{String(row.engaged)}</td>
                        <td className="px-5 py-3 text-right">{String(row.converted)}</td>
                        <td className="px-5 py-3 text-right text-primary">{String(row.conversion_rate ?? "0")}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── 유입 경로 + 랜딩 페이지 ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">유입 경로 TOP 8</h3>
              </div>
              <div className="space-y-3 p-5">
                {data.topReferrers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">데이터 없음 (직접 유입)</p>
                ) : (
                  data.topReferrers.map(([host, count]) => {
                    const max = data.topReferrers[0][1];
                    return (
                      <div key={host} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate max-w-[160px]">{host}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10">
                          <div className="h-1.5 rounded-full bg-primary/70" style={{ width: `${Math.round((count / max) * 100)}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">첫 랜딩 페이지 TOP 8</h3>
              </div>
              <div className="space-y-3 p-5">
                {data.topLandings.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">데이터 없음</p>
                ) : (
                  data.topLandings.map(([path, count]) => {
                    const max = data.topLandings[0][1];
                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate max-w-[200px] font-mono text-[11px]">{path}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10">
                          <div className="h-1.5 rounded-full bg-amber-400/60" style={{ width: `${Math.round((count / max) * 100)}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* ── 이벤트 타입별 + 카테고리 관심도 ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">이벤트 타입별 발생 수</h3>
              </div>
              <div className="overflow-x-auto">
                {data.topEvents.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">데이터 없음</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-white/8">
                      {data.topEvents.map(([type, count]) => (
                        <tr key={type} className="hover:bg-white/5">
                          <td className="px-5 py-2.5">
                            <span className="font-medium">{EVENT_LABELS[type] ?? type}</span>
                            <span className="ml-2 text-[10px] text-muted-foreground font-mono">{type}</span>
                          </td>
                          <td className="px-5 py-2.5 text-right font-semibold text-primary">{count.toLocaleString("ko-KR")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-card">
              <div className="border-b border-white/10 px-5 py-4">
                <h3 className="text-sm font-semibold">카테고리별 관심도</h3>
              </div>
              <div className="space-y-3 p-5">
                {data.categoryInterest.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">데이터 없음</p>
                ) : (
                  data.categoryInterest.map((row: Record<string, unknown>) => {
                    const catId = String(row.category_id);
                    const sessions = Number(row.sessions);
                    const maxSessions = Number(data.categoryInterest[0]?.sessions ?? 1);
                    const pct = Math.round((sessions / maxSessions) * 100);
                    return (
                      <div key={catId} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{CATEGORY_LABELS[catId] ?? catId}</span>
                          <span className="text-muted-foreground">{sessions}세션</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* ── 최근 방문 세션 ── */}
          <section className="rounded-xl border border-white/10 bg-card">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="text-sm font-semibold">최근 방문 세션 10개</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-left text-xs text-muted-foreground">
                    <th className="px-5 py-3">시간</th>
                    <th className="px-5 py-3">기기</th>
                    <th className="px-5 py-3">유입</th>
                    <th className="px-5 py-3">랜딩</th>
                    <th className="px-5 py-3 text-right">PV</th>
                    <th className="px-5 py-3 text-center">전환</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {data.recentSessions.map((s: Record<string, unknown>) => (
                    <tr key={String(s.id)} className="hover:bg-white/5">
                      <td className="px-5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(String(s.first_seen_at)).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-2.5 text-xs">{String(s.device ?? "-")}</td>
                      <td className="px-5 py-2.5 text-xs text-muted-foreground">
                        {s.first_utm_source ? String(s.first_utm_source) : (s.referrer_host ? String(s.referrer_host) : "직접")}
                      </td>
                      <td className="px-5 py-2.5 text-xs font-mono text-muted-foreground truncate max-w-[160px]">
                        {s.first_landing_path ? String(s.first_landing_path) : "-"}
                      </td>
                      <td className="px-5 py-2.5 text-right text-xs">{String(s.total_pageviews ?? 1)}</td>
                      <td className="px-5 py-2.5 text-center text-xs">
                        {s.has_converted ? <span className="text-primary font-semibold">✓</span> : <span className="text-muted-foreground/40">-</span>}
                      </td>
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

// ── 일별 방문자 인라인 바 차트 ───────────────────────────────
function DailyChart({ rows }: { rows: { day: string; events: number; unique_visitors: number }[] }) {
  const maxVal = Math.max(...rows.map((r) => r.unique_visitors), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 120 }}>
      {rows.map((r) => {
        const pct = Math.round((r.unique_visitors / maxVal) * 100);
        return (
          <div key={r.day} className="flex flex-1 flex-col items-center gap-1 min-w-0 group relative">
            <div
              className="w-full rounded-t-sm bg-primary/60 hover:bg-primary transition-colors"
              style={{ height: `${Math.max(pct, 4)}%`, minHeight: 4 }}
              title={`${r.day} — 방문자 ${r.unique_visitors}명`}
            />
            <span className="text-[9px] text-muted-foreground">{r.day.slice(3)}</span>
            {/* 툴팁 */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 rounded bg-card border border-white/10 px-2 py-1 text-[10px] whitespace-nowrap shadow-lg">
              {r.day}: {r.unique_visitors}명
            </div>
          </div>
        );
      })}
    </div>
  );
}
