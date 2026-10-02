"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { AnalyticsPanel } from "./admin/analytics";
import type { GaReport, GaDays } from "@/lib/ga-data";
import type { Inquiry, Note } from "./admin/types";
import { inquiryStatuses, statusLabels } from "@/lib/domain";
type Connection = {
  configured: boolean;
  read: boolean;
  send: boolean;
  lastSync?: { syncedAt?: string };
};
export function LocalAdmin() {
  const [items, setItems] = useState<Inquiry[]>([]),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState<Inquiry | null>(null),
    [notes, setNotes] = useState<Note[]>([]),
    [status, setStatus] = useState("new"),
    [note, setNote] = useState(""),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [page, setPage] = useState(1),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [connection, setConnection] = useState<Connection | null>(null),
    [ga, setGa] = useState<GaReport | null>(null),
    [days, setDays] = useState<GaDays>(7),
    [gaLoading, setGaLoading] = useState(false),
    [tab, setTab] = useState("inquiries");
  const api = async (url: string, options?: RequestInit) => {
    const r = await fetch(url, options);
    const d = await r.json();
    if (!r.ok) throw Error(d.error || "요청을 완료하지 못했습니다");
    return d;
  };
  const listRequest = useRef(0),
    gaRequest = useRef(0);
  const load = useCallback(async () => {
    const request = ++listRequest.current;
    try {
      const r = await fetch(
        "/api/admin/inquiries?" +
          new URLSearchParams({
            search: query,
            status: filter,
            page: String(page),
          }),
      );
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      if (request !== listRequest.current) return;
      setItems(d.items);
      setTotal(d.total);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }, [query, filter, page]);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);
  const connectStatus = useCallback(async () => {
    const r = await fetch("/api/admin/google/status");
    if (r.ok) setConnection(await r.json());
  }, []);
  const sync = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/admin/google/sync", { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setMessage("새 문의 " + d.imported + "건 가져옴");
      await loadRef.current();
      await connectStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "가져오기 실패");
    } finally {
      setBusy(false);
    }
  }, [connectStatus]);
  const readGa = useCallback(async () => {
    const request = ++gaRequest.current;
    setGaLoading(true);
    setGa(null);
    try {
      const r = await fetch("/api/admin/analytics?days=" + days);
      if (r.ok) {
        const report = await r.json();
        if (request === gaRequest.current) setGa(report);
      } else setError("GA4 조회를 완료하지 못했습니다");
    } catch {
      setError("GA4 연결 상태를 확인해주세요");
    } finally {
      if (request === gaRequest.current) setGaLoading(false);
    }
  }, [days]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    void connectStatus();
    void readGa();
  }, [connectStatus, readGa]);
  useEffect(() => {
    if (!connection?.read) return;
    void sync();
    const t = setInterval(() => void sync(), 300000);
    return () => clearInterval(t);
  }, [connection?.read, sync]);
  async function detail(id: string) {
    try {
      const d = await api("/api/admin/inquiries/" + id);
      setSelected(d.item);
      setStatus(d.item.status);
      setNotes(d.notes);
      setNote("");
    } catch (e) {
      setError(String(e));
    }
  }
  async function save() {
    if (!selected) return;
    setBusy(true);
    try {
      await api("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, status, note }),
      });
      await detail(selected.id);
      await load();
      setMessage("상담 내역을 저장했습니다");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function restore(file?: File) {
    if (!file) return;
    if (
      !confirm(
        "백업 파일에서 누락된 문의와 메모를 추가합니다 기존 자료는 덮어쓰지 않습니다",
      )
    )
      return;
    setBusy(true);
    try {
      const text = await file.text();
      await api("/api/admin/local-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      await load();
      setMessage("백업 가져오기를 완료했습니다");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="local-admin">
      <header>
        <div>
          <span>AIO MAKE · LOCAL</span>
          <h1>문의와 방문 통계</h1>
          <p>이 PC에 문의와 상담 내역을 저장합니다</p>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            location.href = "/admin/login";
          }}
        >
          로그아웃
        </button>
      </header>
      <nav aria-label="관리자 메뉴">
        {[
          ["inquiries", "문의 관리"],
          ["analytics", "GA4 방문 통계"],
          ["settings", "연결·백업"],
        ].map(([id, title]) => (
          <button
            key={id}
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
          >
            {title}
          </button>
        ))}
      </nav>
      {message && <p role="status">{message}</p>}
      {error && (
        <p role="alert" className="local-error">
          {error}
        </p>
      )}
      {tab === "inquiries" && (
        <>
          <section className="admin-panel">
            <div className="local-toolbar">
              <h2>문의 {total}건</h2>
              <button onClick={sync} disabled={busy}>
                이메일에서 가져오기
              </button>
              <a download href="/api/admin/local-data?format=csv">
                CSV 내려받기
              </a>
            </div>
            <p>
              마지막 가져오기{" "}
              {connection?.lastSync?.syncedAt
                ? new Date(connection.lastSync.syncedAt).toLocaleString("ko-KR")
                : "아직 없음"}
            </p>
            <div className="local-toolbar">
              <label>
                검색
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="성함·회사·연락처·내용"
                />
              </label>
              <label>
                진행 상태
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">전체</option>
                  {inquiryStatuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>접수일</th>
                    <th>고객</th>
                    <th>요청</th>
                    <th>상태</th>
                    <th>상담</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td>
                        {new Date(i.created_at).toLocaleDateString("ko-KR")}
                      </td>
                      <td>
                        {i.leads?.customer_name}
                        <br />
                        {i.leads?.company_name}
                      </td>
                      <td>{i.raw_text.slice(0, 70)}</td>
                      <td>{statusLabels[i.status]}</td>
                      <td>
                        <button onClick={() => detail(i.id)}>열기</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!items.length && (
              <p>표시할 문의가 없습니다 Google 연결 후 새 문의를 가져오세요</p>
            )}
            <div className="local-toolbar">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </button>
              <span>{page}페이지</span>
              <button
                disabled={page * 50 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </button>
            </div>
          </section>
          {selected && (
            <section className="admin-panel">
              <div className="local-toolbar">
                <h2>{selected.leads?.customer_name}님의 문의</h2>
                <button onClick={() => setSelected(null)}>닫기</button>
              </div>
              <p>
                {selected.leads?.email} · {selected.leads?.phone}
              </p>
              <p style={{ whiteSpace: "pre-wrap", margin: "24px 0" }}>
                {selected.raw_text}
              </p>
              <label>
                진행 상태
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {inquiryStatuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                상담 메모
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={4000}
                />
              </label>
              <button disabled={busy} onClick={save}>
                저장
              </button>
              {notes.map((n) => (
                <p key={n.id}>
                  {new Date(n.created_at).toLocaleString("ko-KR")} · {n.content}
                </p>
              ))}
            </section>
          )}
        </>
      )}
      {tab === "analytics" && (
        <AnalyticsPanel
          ga={ga}
          days={days}
          onDays={setDays}
          loading={gaLoading}
          onRetry={readGa}
        />
      )}
      {tab === "settings" && (
        <>
          <section className="admin-panel">
            <h2>Google 이메일 연결</h2>
            <p>수신 계정: aiomake2023@gmail.com</p>
            <p>
              읽기 {connection?.read ? "연결됨" : "연결 필요"} · 발송{" "}
              {connection?.send ? "연결됨" : "연결 필요"}
            </p>
            {!connection?.configured ? (
              <p>
                Google OAuth 클라이언트 설정이 필요합니다 아래 운영 안내의 연결
                절차를 완료하면 연결 버튼이 활성화됩니다
              </p>
            ) : (
              <div className="local-toolbar">
                <button
                  onClick={() => {
                    location.href = "/api/admin/google/connect?mode=read";
                  }}
                >
                  문의 가져오기 연결
                </button>
                <button
                  onClick={() => {
                    location.href = "/api/admin/google/connect?mode=send";
                  }}
                >
                  사이트 발송 연결
                </button>
              </div>
            )}
            <p>
              PC가 꺼져 있어도 Gmail에 문의가 남으며 관리자를 다시 열면
              가져옵니다
            </p>
          </section>
          <section className="admin-panel">
            <h2>백업과 복원</h2>
            <p>
              백업에는 문의와 상담 메모만 포함되며 Google 인증 정보는 포함되지
              않습니다
            </p>
            <a download href="/api/admin/local-data?format=backup">
              전체 백업 내려받기
            </a>
            <label>
              백업 가져오기
              <input
                type="file"
                accept=".json"
                disabled={busy}
                onChange={(e) => void restore(e.target.files?.[0])}
              />
            </label>
          </section>
        </>
      )}
    </div>
  );
}
