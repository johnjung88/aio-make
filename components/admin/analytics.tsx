"use client";
import {
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Link2,
  RefreshCw,
} from "lucide-react";
import {
  percentChange,
  type GaReport,
  type GaDays,
  type GaRow,
} from "@/lib/ga-data";
const number = (n: number) => n.toLocaleString("ko-KR");
const metricNames = [
  ["activeUsers", "활성 사용자", "참여 조건을 충족한 사용자"],
  ["sessions", "방문 횟수", "세션 기준"],
  ["views", "페이지 조회", "중복 조회 포함"],
  ["leads", "문의 완료", "generate_lead 이벤트"],
] as const;
const deviceNames: Record<string, string> = {
  desktop: "컴퓨터",
  mobile: "모바일",
  tablet: "태블릿",
  "(not set)": "미분류",
};
const channelNames: Record<string, string> = {
  Direct: "직접 유입",
  "Organic Search": "자연 검색",
  "Paid Search": "유료 검색",
  "Organic Social": "일반 소셜",
  "Paid Social": "소셜 광고",
  "Organic Video": "일반 컨텐츠",
  "Paid Video": "컨텐츠 광고",
  "Organic Shopping": "일반 쇼핑",
  "Paid Shopping": "쇼핑 광고",
  Referral: "외부 추천 링크",
  Email: "이메일",
  Display: "디스플레이 광고",
  "Cross-network": "교차 네트워크",
  Unassigned: "미분류",
  "(not set)": "미분류",
};
export function GaConnection({
  ga,
  onRetry,
  loading = false,
}: {
  ga: GaReport | null;
  onRetry?: () => void;
  loading?: boolean;
}) {
  const setup =
    !ga ||
    [
      "not_configured",
      "invalid_config",
      "permission",
      "authentication",
      "api_disabled",
    ].includes(ga.status);
  return (
    <section className="admin-panel ga-connect" aria-busy={loading}>
      <div className="panel-title">
        <span className="admin-icon">
          <Link2 size={22} />
        </span>
        <div>
          <p className="admin-kicker">GOOGLE ANALYTICS 4</p>
          <h2>
            {loading
              ? "Google 연결 확인 중"
              : ga?.connected
                ? "방문 통계가 연결됐습니다"
                : setup
                  ? "방문 통계를 한곳에서 확인하세요"
                  : "방문 통계를 다시 불러와주세요"}
          </h2>
        </div>
      </div>
      <p>
        {ga?.connected
          ? "선택한 기간의 실제 Google Analytics 데이터를 조회했습니다"
          : ga?.error ||
            "사이트 방문 기록을 대시보드로 가져오는 연결 상태를 확인합니다"}
      </p>
      {!ga?.connected && setup && (
        <ol className="connection-steps">
          <li>
            {ga?.configuration?.property && ga?.configuration?.measurement ? (
              <CheckCircle2 size={18} />
            ) : (
              <Circle size={18} />
            )}
            <div>
              <strong>분석할 사이트 확인</strong>
              <span>
                GA4 속성 {ga?.propertyId || "설정 필요"} · 측정{" "}
                {ga?.measurementId || "설정 필요"}
              </span>
            </div>
          </li>
          <li>
            {ga?.configuration?.credentials ? (
              <CheckCircle2 size={18} />
            ) : (
              <Circle size={18} />
            )}
            <div>
              <strong>Google 읽기 연결</strong>
              <span>
                방문 기록을 보내는 설정과 통계를 읽는 권한은 별개입니다 서버용
                인증과 이 속성의 보기 권한을 연결합니다
              </span>
            </div>
          </li>
          <li>
            <Circle size={18} />
            <div>
              <strong>데이터 조회 확인</strong>
              <span>
                연결 후 방문자·유입 경로·문의 완료 추이를 이 화면에서
                확인합니다
              </span>
            </div>
          </li>
        </ol>
      )}
      <div className="panel-actions">
        <a
          className="button"
          href={`https://analytics.google.com/analytics/web/#/p${ga?.propertyId || "536780274"}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Analytics 열기 <ArrowUpRight size={16} />
        </a>
        {onRetry && (
          <button
            className="secondary-button"
            onClick={onRetry}
            disabled={loading}
          >
            <RefreshCw size={15} /> 연결 다시 확인
          </button>
        )}
      </div>
      {!ga?.connected && (
        <details className="technical-setup">
          <summary>연결 담당자를 위한 설정 안내</summary>
          <p>
            Google Analytics Data API를 활성화하고 해당 속성에 서버용 서비스
            계정을 뷰어로 추가합니다 서버 환경에 GA4_PROPERTY_ID와
            GOOGLE_APPLICATION_CREDENTIALS(인증 JSON 파일 경로) 또는
            GOOGLE_SERVICE_ACCOUNT_EMAIL·GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY를
            설정한 뒤 서버를 재시작합니다 비밀키를 이 화면이나 문의 양식에
            입력하지 마세요
          </p>
          <a
            href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 공식 연결 안내 ↗
          </a>
        </details>
      )}
    </section>
  );
}
export function TrafficTrend({
  ga,
  compact = false,
}: {
  ga: GaReport;
  compact?: boolean;
}) {
  const daily = ga.daily || [];
  const max = Math.max(1, ...daily.map((d) => d.sessions));
  return (
    <section className="admin-panel traffic-trend">
      <div className="panel-title between">
        <div>
          <h2>방문 추이</h2>
          <p>{ga.period} · 세션</p>
        </div>
        <span className="chart-legend">
          <i />
          방문 횟수
        </span>
      </div>
      {daily.length ? (
        <>
          <div
            className="traffic-chart"
            role="img"
            aria-label={`${ga.days}일간 일별 방문 횟수 아래 데이터 표에서 정확한 값을 볼 수 있습니다`}
          >
            <span className="chart-max">{number(max)}</span>
            <div className="traffic-bars" style={{ gap: ga.days > 28 ? 1 : 4 }}>
              {daily.map((d) => (
                <div key={d.date} className="traffic-day">
                  <span
                    style={{ height: `${(d.sessions / max) * 100}%` }}
                    title={`${d.date}: ${number(d.sessions)}회`}
                  />
                </div>
              ))}
            </div>
            <span className="chart-zero">0</span>
          </div>
          <div className="chart-dates">
            <span>{daily[0].date}</span>
            <span>{daily.at(-1)?.date}</span>
          </div>
          {!compact && (
            <details className="chart-table">
              <summary>일별 데이터 표 보기</summary>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <caption className="sr-only">일별 방문과 페이지 조회</caption>
                  <thead>
                    <tr>
                      <th scope="col">날짜</th>
                      <th scope="col">방문 횟수</th>
                      <th scope="col">페이지 조회</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((d) => (
                      <tr key={d.date}>
                        <td>{d.date}</td>
                        <td>{number(d.sessions)}</td>
                        <td>{number(d.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      ) : (
        <div className="admin-empty">
          <BarChart3 />
          <p>선택한 기간에 방문 데이터가 없습니다</p>
        </div>
      )}
    </section>
  );
}
function MetricList({
  items = [],
  total,
  kind,
}: {
  items?: GaRow[];
  total: number;
  kind?: string;
}) {
  return items.length ? (
    <ol className="rank-list">
      {items.map((r, i) => {
        const name = kind === "device" ? deviceNames[r.name] || r.name : r.name;
        const share = total > 0 ? (r.value / total) * 100 : 0;
        return (
          <li key={r.name + i}>
            <div>
              <span title={name}>{name}</span>
              <strong>
                {number(r.value)} <small>{share.toFixed(1)}%</small>
              </strong>
            </div>
            <div className="rank-track">
              <i style={{ width: Math.min(100, share) + "%" }} />
            </div>
          </li>
        );
      })}
    </ol>
  ) : (
    <div className="admin-empty small">
      <p>해당 기간의 데이터가 없습니다</p>
    </div>
  );
}
export function AnalyticsPanel({
  ga,
  days,
  onDays,
  loading,
  onRetry,
}: {
  ga: GaReport | null;
  days: GaDays;
  onDays: (days: GaDays) => void;
  loading: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="analytics-view" aria-busy={loading}>
      <div className="analytics-toolbar">
        <div>
          <span
            className={"connection-badge " + (ga?.connected ? "connected" : "")}
          >
            {loading
              ? "조회 중"
              : ga?.connected
                ? "GA4 연결됨"
                : "연결 확인 필요"}
          </span>
          {ga?.dateRange && (
            <span>
              {ga.dateRange.start} — {ga.dateRange.end}
            </span>
          )}
        </div>
        <label>
          조회 기간
          <select
            value={days}
            onChange={(e) => onDays(Number(e.target.value) as GaDays)}
          >
            <option value="7">최근 7일</option>
            <option value="28">최근 28일</option>
            <option value="90">최근 90일</option>
          </select>
        </label>
      </div>
      {loading && !ga ? (
        <div className="admin-skeleton" role="status">
          방문 통계를 불러오고 있습니다…
        </div>
      ) : ga?.connected && ga.totals ? (
        <>
          <div className="admin-cards ga-metrics">
            {metricNames.map(([key, label, hint]) => {
              const change = ga.previous
                ? percentChange(ga.totals![key], ga.previous[key])
                : null;
              return (
                <div className="admin-card" key={key}>
                  <p>{label}</p>
                  <strong>{number(ga.totals![key])}</strong>
                  <span className="metric-hint">{hint}</span>
                  <span className="metric-change">
                    {change === null
                      ? ga.previous?.[key] === 0
                        ? "새 발생 · 이전 기간 0"
                        : "이전 기간 비교 없음"
                      : `${change > 0 ? "+" : ""}${change.toFixed(1)}% · 이전 ${days}일 대비`}
                  </span>
                </div>
              );
            })}
          </div>
          <TrafficTrend ga={ga} />
          <div className="admin-two-cols">
            <section className="admin-panel">
              <div className="panel-title">
                <h2>유입 채널</h2>
                <span>방문 횟수</span>
              </div>
              <MetricList
                items={ga.channels?.map((r) => ({
                  ...r,
                  name: channelNames[r.name] || r.name,
                }))}
                total={ga.totals.sessions}
              />
            </section>
            <section className="admin-panel">
              <div className="panel-title">
                <h2>인기 페이지</h2>
                <span>조회 수</span>
              </div>
              <MetricList items={ga.pages} total={ga.totals.views} />
            </section>
          </div>
          <section className="admin-panel">
            <div className="panel-title">
              <h2>접속 기기</h2>
              <span>방문 횟수</span>
            </div>
            <MetricList
              items={ga.devices}
              total={ga.totals.sessions}
              kind="device"
            />
          </section>
          {ga.warnings?.map((w) => (
            <p key={w} className="admin-message">
              {w}
            </p>
          ))}
          <p className="analytics-footnote">
            {ga.fetchedAt
              ? new Date(ga.fetchedAt).toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                })
              : ""}{" "}
            조회 · 속성 시간대 {ga.timeZone} · 최대 5분 간격 갱신
            <br />
            문의 완료는 브라우저에서 전송한 이벤트입니다 저장된 문의 건수와
            집계 기준이 다르며, 일부 데이터는 Google 처리 지연으로 달라질 수
            있습니다
          </p>
        </>
      ) : (
        <GaConnection ga={ga} onRetry={onRetry} loading={loading} />
      )}
    </div>
  );
}
