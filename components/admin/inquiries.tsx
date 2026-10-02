"use client";
import { useEffect, useId, useRef } from "react";
import { divisions, services } from "@/lib/content";
import { inquiryStatuses, statusLabels } from "@/lib/domain";
import type { Inquiry, Note, InquiryData } from "./types";
type Props = {
  inquiries: InquiryData;
  filteredInquiries: Inquiry[];
  page: number;
  search: string;
  statusFilter: string;
  selected: Inquiry | null;
  notes: Note[];
  nextStatus: string;
  note: string;
  busy: boolean;
  loading: boolean;
  appliedSearch: string;
  applySearch: () => void;
  clearSearch: () => void;
  setSearch: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setPage: (v: number) => void;
  setSelected: (v: Inquiry | null) => void;
  setNextStatus: (v: string) => void;
  setNote: (v: string) => void;
  detail: (id: string) => Promise<void>;
  saveInquiry: () => Promise<void>;
};
export function InquiryPanel({
  inquiries,
  filteredInquiries,
  page,
  search,
  statusFilter,
  selected,
  notes,
  nextStatus,
  note,
  busy,
  loading,
  appliedSearch,
  applySearch,
  clearSearch,
  setSearch,
  setStatusFilter,
  setPage,
  setSelected,
  setNextStatus,
  setNote,
  detail,
  saveInquiry,
}: Props) {
  const detailHeading = useRef<HTMLHeadingElement>(null),
    detailId = useId();
  const openers = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedId = selected?.id;
  useEffect(() => {
    if (selectedId) detailHeading.current?.focus();
  }, [selectedId]);
  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <h2>문의 목록</h2>
        <form
          className="inquiry-search"
          onSubmit={(event) => {
            event.preventDefault();
            applySearch();
          }}
        >
          <label>
            전체 문의 검색
            <input
              aria-label="문의 검색"
              value={search}
              maxLength={200}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="성함, 회사, 연락처, 내용"
            />
          </label>
          <button type="submit" className="secondary-button" disabled={loading}>
            검색
          </button>
          {(search || appliedSearch) && (
            <button
              type="button"
              className="secondary-button"
              onClick={clearSearch}
            >
              초기화
            </button>
          )}
          <label>
            진행 상태
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
                setSelected(null);
              }}
            >
              <option value="all">전체 상태</option>
              {inquiryStatuses.map((s) => (
                <option value={s} key={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>
        </form>
      </div>
      {!inquiries.connected ? (
        <div className="admin-message">
          {inquiries.error ??
            "데이터베이스 연결이 필요합니다 연결 전에는 실제 문의 수를 표시하지 않습니다"}
        </div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>접수일</th>
                  <th>고객·회사</th>
                  <th>분야</th>
                  <th>상태</th>
                  <th>상담</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((i) => (
                  <tr key={i.id}>
                    <td>
                      {new Date(i.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="wrap">
                      {i.leads?.customer_name ?? "미등록"}
                      <br />
                      {i.leads?.company_name}
                    </td>
                    <td>
                      {divisions.find(
                        (d) => d.id === i.leads?.source_meta?.division,
                      )?.label ?? "기존 문의"}
                    </td>
                    <td>
                      <span className="status-pill">
                        {statusLabels[i.status] ?? i.status}
                      </span>
                    </td>
                    <td>
                      <button
                        ref={(node) => {
                          openers.current[i.id] = node;
                        }}
                        aria-label={
                          (i.leads?.customer_name ?? "문의") + " 상담 열기"
                        }
                        aria-expanded={selected?.id === i.id}
                        aria-controls={
                          selected?.id === i.id ? detailId : undefined
                        }
                        onClick={() => detail(i.id)}
                      >
                        열기 ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredInquiries.length && (
            <p>
              {appliedSearch || statusFilter !== "all"
                ? "검색 조건에 맞는 문의가 없습니다 검색어나 진행 상태를 바꿔보세요"
                : "아직 접수된 문의가 없습니다"}
            </p>
          )}
          <div className="admin-toolbar">
            <p>
              {appliedSearch ? "검색 결과 " : "총 "}
              {inquiries.total ?? 0}건 · {page} /{" "}
              {Math.max(1, Math.ceil((inquiries.total ?? 0) / 50))}페이지
            </p>
            <div>
              <button
                className="secondary-button"
                disabled={loading || page === 1}
                onClick={() => {
                  setPage(page - 1);
                  setSelected(null);
                }}
              >
                이전
              </button>
              <button
                className="secondary-button"
                disabled={loading || page * 50 >= (inquiries.total ?? 0)}
                onClick={() => {
                  setPage(page + 1);
                  setSelected(null);
                }}
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}
      {selected && (
        <div id={detailId} className="admin-detail">
          <div className="admin-toolbar">
            <h3 ref={detailHeading} tabIndex={-1}>
              {selected.leads?.customer_name ?? "문의 상세"}
            </h3>
            <button
              className="secondary-button"
              onClick={() => {
                openers.current[selected.id]?.focus();
                setSelected(null);
              }}
            >
              닫기
            </button>
          </div>
          <div className="contact-info">
            <span>{selected.leads?.company_name}</span>
            {selected.leads?.email && (
              <a href={"mailto:" + selected.leads.email}>
                {selected.leads.email}
              </a>
            )}
            {selected.leads?.phone && (
              <a href={"tel:" + selected.leads.phone}>{selected.leads.phone}</a>
            )}
            <span>{selected.id}</span>
          </div>
          <p>{selected.raw_text}</p>
          <p>
            서비스:{" "}
            {services.find(
              (service) =>
                service.id === selected.leads?.source_meta?.service &&
                service.division === selected.leads?.source_meta?.division,
            )?.name ?? "미분류"}{" "}
            · 유입:{" "}
            {selected.leads?.source_meta?.attribution?.utm?.utm_source ??
              selected.leads?.source_meta?.attribution?.landingPath ??
              "기존 기록"}
          </p>
          <div className="note-list">
            {notes.map((n) => (
              <div key={n.id}>
                <small>
                  {new Date(n.created_at).toLocaleString("ko-KR")} ·{" "}
                  {n.role === "agent"
                    ? "상담 메모"
                    : n.role === "system"
                      ? "변경 기록"
                      : "문의"}
                </small>
                <p>
                  {n.content}
                  {n.metadata?.from &&
                    " · " +
                      (statusLabels[n.metadata.from] ?? n.metadata.from) +
                      " → " +
                      (statusLabels[n.metadata.to ?? ""] ?? n.metadata.to)}
                </p>
              </div>
            ))}
          </div>
          <label>
            진행 상태
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
            >
              {!inquiryStatuses.some((s) => s === nextStatus) && (
                <option value={nextStatus} disabled>
                  {statusLabels[nextStatus] ?? nextStatus} (기존 상태)
                </option>
              )}
              {inquiryStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            새 상담 메모
            <textarea
              maxLength={4000}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="내부 상담 내용을 기록합니다 고객에게 발송되지 않습니다"
            />
          </label>
          <button className="button" disabled={busy} onClick={saveInquiry}>
            {busy ? "저장 중…" : "상담 내역 저장"}
          </button>
        </div>
      )}
    </section>
  );
}
