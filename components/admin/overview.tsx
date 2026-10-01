"use client";
import {
  ArrowUpRight,
  MessagesSquare,
  Images,
  Users,
  CircleAlert,
} from "lucide-react";
import { statusLabels } from "@/lib/domain";
import type { GaReport } from "@/lib/ga-data";
import type { InquiryData, EntryData } from "./types";
import { TrafficTrend } from "./analytics";
export function Overview({
  inquiries,
  entries,
  ga,
  gaLoading,
  loading,
  openInquiries,
  openEntries,
  openAnalytics,
  openSettings,
  openInquiry,
}: {
  inquiries: InquiryData;
  entries: EntryData;
  ga: GaReport | null;
  gaLoading: boolean;
  loading: boolean;
  openInquiries: () => void;
  openEntries: () => void;
  openAnalytics: () => void;
  openSettings: () => void;
  openInquiry: (id: string) => void;
}) {
  const missing = [
    !inquiries.connected && "문의 저장소",
    !entries.connected && "콘텐츠 저장소",
    !gaLoading && !ga?.connected && "Google 방문 통계",
  ].filter(Boolean);
  const cards = [
    {
      title: "확인할 신규 문의",
      value: inquiries.connected ? inquiries.newCount : null,
      hint: "아직 상담을 시작하지 않은 문의",
      icon: MessagesSquare,
      action: openInquiries,
    },
    {
      title: "전체 문의",
      value: inquiries.connected
        ? (inquiries.globalTotal ?? inquiries.total)
        : null,
      hint: "저장된 전체 상담 내역",
      icon: MessagesSquare,
      action: openInquiries,
    },
    {
      title: "공개 콘텐츠",
      value: entries.connected ? entries.publishedCount : null,
      hint: "관리자가 등록한 공개 콘텐츠",
      icon: Images,
      action: openEntries,
    },
    {
      title: `최근 ${ga?.days ?? 28}일 방문자`,
      value: ga?.totals?.activeUsers,
      hint: "GA4 활성 사용자 · 어제까지",
      icon: Users,
      action: openAnalytics,
    },
  ];
  return (
    <>
      {missing.length > 0 && !loading && (
        <div className="setup-banner">
          <CircleAlert size={20} />
          <div>
            <strong>{missing.join(" · ")} 연결을 확인해주세요.</strong>
            <p>
              조회할 수 없는 항목은 ‘—’로 표시됩니다. 연결된 데이터는 계속
              확인할 수 있습니다.
            </p>
          </div>
          <button onClick={openSettings}>
            연결 상태 보기 <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      <div className="admin-cards overview-cards">
        {cards.map((c) => (
          <button className="admin-card" key={c.title} onClick={c.action}>
            <span className="card-top">
              <span>{c.title}</span>
              <c.icon size={17} />
            </span>
            <strong>
              {(c.icon === Users ? gaLoading : loading)
                ? "…"
                : c.value == null
                  ? "—"
                  : c.value.toLocaleString("ko-KR")}
            </strong>
            <span className="metric-hint">
              {c.icon === Users && gaLoading
                ? "Google 통계 확인 중"
                : !loading && c.value == null
                  ? "데이터 연결 대기"
                  : c.hint}
            </span>
          </button>
        ))}
      </div>
      <div className="overview-grid">
        <section className="admin-panel">
          <div className="panel-title between">
            <div>
              <p className="admin-kicker">INQUIRIES</p>
              <h2>최근 문의</h2>
            </div>
            <button className="text-action" onClick={openInquiries}>
              전체 보기 <ArrowUpRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="admin-skeleton" role="status">
              문의 확인 중…
            </div>
          ) : !inquiries.connected ? (
            <div className="admin-empty">
              <MessagesSquare size={28} />
              <strong>문의 저장소 연결이 필요합니다</strong>
              <p>연결이 완료되면 새로운 문의부터 이곳에 표시됩니다.</p>
              <button className="secondary-button" onClick={openSettings}>
                연결 상태 확인
              </button>
            </div>
          ) : inquiries.items.length ? (
            <ul className="recent-inquiries">
              {inquiries.items.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <button onClick={() => openInquiry(i.id)}>
                    <span className="inquiry-avatar">
                      {(i.leads?.customer_name || "문").slice(0, 1)}
                    </span>
                    <span className="recent-copy">
                      <strong>
                        {i.leads?.customer_name || "고객명 미등록"}
                      </strong>
                      <span>
                        {i.leads?.company_name || i.raw_text.slice(0, 54)}
                      </span>
                    </span>
                    <span className="recent-meta">
                      <span className="status-pill">
                        {statusLabels[i.status as keyof typeof statusLabels] ||
                          i.status}
                      </span>
                      <time>
                        {new Date(i.created_at).toLocaleDateString("ko-KR")}
                      </time>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="admin-empty">
              <MessagesSquare size={28} />
              <strong>아직 접수된 문의가 없습니다</strong>
              <p>
                사이트에서 문의가 접수되면 이곳에서 상담을 시작할 수 있습니다.
              </p>
            </div>
          )}
        </section>
        <section className="admin-panel quick-work">
          <div className="panel-title">
            <div>
              <p className="admin-kicker">WORKSPACE</p>
              <h2>운영 바로가기</h2>
            </div>
          </div>
          <button onClick={openInquiries}>
            <MessagesSquare size={20} />
            <span>
              <strong>상담 이어가기</strong>
              <small>진행 상태와 상담 메모 관리</small>
            </span>
            <ArrowUpRight size={18} />
          </button>
          <button onClick={openEntries}>
            <Images size={20} />
            <span>
              <strong>콘텐츠 관리</strong>
              <small>레퍼런스·인사이트 등록 및 수정</small>
            </span>
            <ArrowUpRight size={18} />
          </button>
          <button onClick={openAnalytics}>
            <Users size={20} />
            <span>
              <strong>방문 통계 보기</strong>
              <small>유입 경로와 문의 이벤트 확인</small>
            </span>
            <ArrowUpRight size={18} />
          </button>
          <div className="workspace-connections">
            <span>데이터 연결</span>
            <span
              className={
                "connection-badge " +
                (inquiries.connected && entries.connected ? "connected" : "")
              }
            >
              문의·콘텐츠{" "}
              {inquiries.connected && entries.connected
                ? "연결됨"
                : "확인 필요"}
            </span>
            <span
              className={
                "connection-badge " + (ga?.connected ? "connected" : "")
              }
            >
              GA4{" "}
              {gaLoading ? "확인 중" : ga?.connected ? "연결됨" : "확인 필요"}
            </span>
          </div>
        </section>
      </div>
      {gaLoading ? (
        <div className="admin-panel admin-skeleton" role="status">
          Google 방문 통계 확인 중…
        </div>
      ) : ga?.connected ? (
        <TrafficTrend ga={ga} compact />
      ) : (
        <section className="admin-panel overview-analytics">
          <div>
            <p className="admin-kicker">ANALYTICS</p>
            <h2>어디에서 방문하고, 무엇을 보는지</h2>
            <p>
              Google Analytics를 연결하면 방문 추이와 유입 경로를 확인할 수
              있습니다.
            </p>
          </div>
          <button className="secondary-button" onClick={openAnalytics}>
            방문 통계 연결 <ArrowUpRight size={16} />
          </button>
        </section>
      )}
    </>
  );
}
