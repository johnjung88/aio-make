"use client";
import { BarChart3 } from "lucide-react";
import type { GaReport } from "@/lib/ga";
function MetricList({ items }: { items?: { name: string; value: number }[] }) {
  return (
    <div className="metric-list">
      {items?.length ? (
        items.map((v, i) => (
          <div key={v.name + i}>
            <span>{v.name}</span>
            <b>{v.value.toLocaleString()}</b>
          </div>
        ))
      ) : (
        <p>해당 기간의 데이터가 없습니다.</p>
      )}
    </div>
  );
}

export function AnalyticsPanel({ ga }: { ga: GaReport | null }) {
  return (
    <>
      {ga?.connected && ga.totals ? (
        <>
          <p>{ga.period} · GA4에서 조회한 통계</p>
          <div className="admin-cards">
            {[
              ["활성 사용자", ga.totals.activeUsers],
              ["세션", ga.totals.sessions],
              ["페이지 조회", ga.totals.views],
              ["문의 완료 이벤트", ga.totals.leads],
            ].map(([k, v]) => (
              <div className="admin-card" key={String(k)}>
                <p>{k}</p>
                <strong>{Number(v).toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="admin-two-cols">
            <section className="admin-panel">
              <h2>유입 채널 · 세션</h2>
              <MetricList items={ga.channels} />
            </section>
            <section className="admin-panel">
              <h2>페이지 · 조회</h2>
              <MetricList items={ga.pages} />
            </section>
          </div>
          <section className="admin-panel">
            <h2>기기 · 세션</h2>
            <MetricList items={ga.devices} />
            <p>
              문의 이벤트와 저장된 문의 건수는 집계 기준이 다릅니다. 통계는 최대
              5분간 캐시됩니다.
            </p>
          </section>
        </>
      ) : (
        <section className="admin-panel connect-status">
          <BarChart3 size={30} />
          <div>
            <h3>GA4 서버 조회 연결 대기</h3>
            <p>
              <a
                className="secondary-button"
                href="https://analytics.google.com/analytics/web/#/a394051405p536780274"
                target="_blank"
                rel="noopener noreferrer"
              >
                GA4 원본 열기 ↗
              </a>
            </p>
            <p>{ga?.error ?? "연결 상태를 확인 중입니다."}</p>
            <p>
              속성 ID <code>{ga?.propertyId ?? "536780274"}</code>
              <br />
              측정 ID <code>{ga?.measurementId ?? "G-7R9P2N40RW"}</code>
            </p>
            <p>
              연결 전에는 방문자·문의 이벤트를 임의 값으로 표시하지 않습니다.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
