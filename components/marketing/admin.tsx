"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { statusLabels, statuses } from "@/lib/marketing/validation";
type Consultation = {
  id: string;
  payload: Record<string, string>;
  status: string;
  notes: string;
  next_action: string;
  summary: string;
  reply_revision: number;
  created_at: string;
};
type Draft = {
  id: string;
  version: number;
  subject: string;
  body: string;
  recipient: string;
  state: string;
  approved_by: string | null;
  provider_id: string | null;
};
type Event = {
  id: string;
  kind: string;
  payload: Record<string, unknown>;
  created_at: string;
};
type Detail = {
  consultation: Consultation;
  drafts: Draft[];
  events: Event[];
  outbox: { id: string; kind: string; state: string }[];
};
export function ConsultationAdmin() {
  const [items, setItems] = useState<Consultation[]>([]),
    [detail, setDetail] = useState<Detail | null>(null),
    [error, setError] = useState("");
  async function load(id?: string) {
    try {
      const r = await fetch(
        "/api/admin/marketing-consultations" + (id ? "?id=" + id : ""),
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (id) setDetail(data);
      else setItems(data);
    } catch (e) {
      setError(String(e));
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function save(e: React.FormEvent<HTMLFormElement>, kind: string) {
    e.preventDefault();
    if (!detail) return;
    setError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/admin/marketing-consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fields,
        id: detail.consultation.id,
        action: kind,
        reply_revision:
          kind === "draft" ? detail.consultation.reply_revision : undefined,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      setError(data.error);
      return;
    }
    await load(detail.consultation.id);
    await load();
  }
  return (
    <div className="m-site">
      <section className="m-section">
        <h1>마케팅 상담 관리</h1>
        <p>
          <Link href="/admin/inbox">기존 서비스 문의 이력 →</Link> ·{" "}
          <Link href="/admin/marketing-content">공개 콘텐츠 관리 →</Link>
        </p>
        {error && (
          <p role="alert" className="m-error">
            {error}
          </p>
        )}
        <div className="m-grid two">
          <div>
            {items.map((c) => (
              <button
                key={c.id}
                onClick={() => load(c.id)}
                className="m-card"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  marginBottom: 12,
                }}
              >
                <b>
                  {c.payload.company} · {c.payload.name}
                </b>
                <p>
                  {statusLabels[c.status]} ·{" "}
                  {new Date(c.created_at).toLocaleString("ko-KR")}
                </p>
              </button>
            ))}
          </div>
          {detail && (
            <div key={detail.consultation.id}>
              <h2>{detail.consultation.payload.company}</h2>
              <dl>
                {Object.entries(detail.consultation.payload).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 8 }}>
                    <dt>
                      <b>{k}</b>
                    </dt>
                    <dd
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </dd>
                  </div>
                ))}
              </dl>
              <h3>Grok 요약</h3>
              <p>{detail.consultation.summary || "아직 없음"}</p>
              <form
                className="m-form"
                style={{ padding: 0 }}
                onSubmit={(e) => save(e, "update")}
              >
                <label>
                  상담 상태
                  <select
                    name="status"
                    defaultValue={detail.consultation.status}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  내부 메모
                  <textarea
                    name="notes"
                    defaultValue={detail.consultation.notes}
                  />
                </label>
                <label>
                  다음 행동
                  <input
                    name="next_action"
                    defaultValue={detail.consultation.next_action}
                  />
                </label>
                <button className="m-button">상태·메모 저장</button>
              </form>
              <h3>사람이 작성한 답변 초안</h3>
              <p>
                새 초안은 이전 승인을 무효화합니다. 이메일 발송 승인은 본인의
                Slack 버튼에서 진행합니다.
              </p>
              <form
                className="m-form"
                style={{ padding: 0 }}
                onSubmit={(e) => save(e, "draft")}
              >
                <label>
                  제목
                  <input name="subject" required maxLength={200} />
                </label>
                <label>
                  본문
                  <textarea name="body" required maxLength={12000} />
                </label>
                <button className="m-button">새 버전 저장·검토 요청</button>
              </form>
              <h3>초안·승인·발송 이력</h3>
              {detail.drafts.map((d) => (
                <details key={d.id}>
                  <summary>
                    v{d.version} · {d.state} · {d.subject}
                  </summary>
                  <p>이메일: {d.recipient}</p>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{d.body}</pre>
                  <p>
                    승인자: {d.approved_by || "없음"} · 발송 ID:{" "}
                    {d.provider_id || "없음"}
                  </p>
                </details>
              ))}
              <h3>알림·작업 상태</h3>
              {detail.outbox.map((o) => (
                <div key={o.id}>
                  <p>
                    {o.kind}: {o.state}
                  </p>
                  {["processing", "unknown"].includes(o.state) && (
                    <details>
                      <summary>외부 기록 대조 후 수동 처리</summary>
                      <p>
                        이전 실행을 중단하고 제공자의 발송·작업 기록을 확인한 뒤
                        입력하세요. 실패 처리도 같은 답변의 자동 재전송을
                        허용하지 않습니다.
                      </p>
                      <form
                        className="m-form"
                        style={{ padding: 0 }}
                        onSubmit={(e) => save(e, "reconcile")}
                      >
                        <input type="hidden" name="job_id" value={o.id} />
                        <label>
                          확인 결과
                          <select name="state">
                            <option value="done">실행 완료 확인</option>
                            <option value="failed">실행되지 않음 확인</option>
                          </select>
                        </label>
                        <label>
                          확인 근거·이전 실행 중단 확인
                          <textarea name="evidence" minLength={10} required />
                        </label>
                        <label>
                          이메일 발송 ID
                          <input name="provider_id" />
                        </label>
                        <label>
                          Slack 스레드 시각
                          <input name="thread" />
                        </label>
                        <button className="m-button">확인 결과 기록</button>
                      </form>
                    </details>
                  )}
                </div>
              ))}
              <p className="m-note">
                processing·unknown 상태가 오래 지속되면 외부 기록과 이전 실행
                중단 여부를 확인해야 합니다. 자동 재발송하지 않습니다.
              </p>
              <h3>후속 대화·이벤트</h3>
              {detail.events.map((v) => (
                <details key={v.id}>
                  <summary>
                    {v.kind} · {new Date(v.created_at).toLocaleString("ko-KR")}
                  </summary>
                  <pre
                    style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                  >
                    {JSON.stringify(v.payload, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
