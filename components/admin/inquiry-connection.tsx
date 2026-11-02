"use client";
import { useCallback, useEffect, useState } from "react";

type Connection = {
  storage: string;
  emailConfigured: boolean;
  notificationCounts: Record<string, number>;
};
export function InquiryConnection() {
  const [data, setData] = useState<Connection | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/inquiry-status", {
        cache: "no-store",
      });
      if (!response.ok) throw Error("문의 연결 상태를 확인하지 못했습니다");
      setData(await response.json());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "연결 상태 확인 실패");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function sendPending() {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/inquiry-status", {
        method: "POST",
      });
      if (!response.ok) throw Error("대기 알림을 보내지 못했습니다");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "알림 발송 실패");
    } finally {
      setBusy(false);
    }
  }
  const counts = data?.notificationCounts;
  return (
    <section className="admin-panel">
      <h2>문의 알림·백업</h2>
      <p>사이트 문의는 관리자에 바로 저장되며 30초마다 목록을 갱신합니다.</p>
      <p>알림 수신: aiomake2023@gmail.com</p>
      <p>
        이메일 설정:{" "}
        {data ? (data.emailConfigured ? "설정됨" : "연결 필요") : "확인 중"}
      </p>
      {counts && (
        <p>
          발송 요청 완료 {counts.sent ?? 0}건 · 대기 {counts.pending ?? 0}건 ·
          실패 {counts.failed ?? 0}건 · 결과 확인 필요{" "}
          {(counts.unknown ?? 0) + (counts.sending ?? 0)}건
        </p>
      )}
      <p>
        발송 요청 완료는 수신 확인과 다릅니다. 이메일 오류가 있어도 문의는
        보관됩니다.
      </p>
      <div className="admin-toolbar">
        <button
          className="secondary-button"
          onClick={sendPending}
          disabled={busy || !data?.emailConfigured}
        >
          대기 알림 보내기
        </button>
        <a
          className="secondary-button"
          download
          href="/api/admin/local-data?format=csv"
        >
          CSV 내려받기
        </a>
        <a
          className="secondary-button"
          download
          href="/api/admin/local-data?format=backup"
        >
          전체 백업 내려받기
        </a>
      </div>
      <p>결과가 불명확한 알림은 중복 발송을 막기 위해 다시 보내지 않습니다.</p>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
