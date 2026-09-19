"use client";
import { useEffect, useRef, useState } from "react";
type Notice = { version: string; text: string; enabled: boolean };
export function QuoteForm() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const key = useRef("");
  const locked = useRef(false);
  useEffect(() => {
    key.current = crypto.randomUUID();
    try {
      const pending = sessionStorage.getItem("aio_marketing_quote_key");
      if (pending && /^[a-f0-9-]{36}$/.test(pending)) key.current = pending;
      sessionStorage.setItem("aio_marketing_quote_key", key.current);
    } catch {
      /* Storage-disabled browsers retain the in-memory key. */
    }
    fetch("/api/quote/notice")
      .then((r) => r.json())
      .then(setNotice)
      .catch(() =>
        setError(
          "접수 안내를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.",
        ),
      );
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || !notice?.enabled) return;
    locked.current = true;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const qs = new URLSearchParams(location.search);
    let initial: Record<string, string> = {
      entry_path: location.pathname,
      referrer: document.referrer.slice(0, 1000),
    };
    try {
      initial =
        JSON.parse(sessionStorage.getItem("aio_marketing_entry") || "null") ||
        initial;
    } catch {}
    const attribution = {
      ...initial,
      ...Object.fromEntries(
        [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "content_id",
          "reference_case",
        ].map((k) => [k, (qs.get(k) || initial[k] || "").slice(0, 200)]),
      ),
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          category: "marketing",
          locale: "ko",
          idempotencyKey: key.current,
          consent_privacy: form.get("consent_privacy") === "on",
          consent_version: notice.version,
          attribution,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "접수하지 못했습니다.");
      setQuoteId(data.data.quoteId);
      try {
        sessionStorage.removeItem("aio_marketing_quote_key");
      } catch {}
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "접수하지 못했습니다. 같은 화면에서 다시 시도해 주세요.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  if (quoteId)
    return (
      <section className="m-form">
        <div className="m-success" role="status">
          <h1>상담이 접수되었습니다.</h1>
          <p>접수번호: {quoteId}</p>
          <p>
            내용을 확인한 뒤 남겨 주신 연락처로 답변드리겠습니다. 접수는
            계약이나 할인 순번 확정이 아닙니다.
          </p>
        </div>
      </section>
    );
  return (
    <section className="m-form">
      <p className="m-eyebrow">마케팅 상담 신청</p>
      <h1>
        지금의 고민을
        <br />
        들려주세요.
      </h1>
      <p>현재 마케팅 서비스 상담을 받습니다. * 표시는 필수 항목입니다.</p>
      <form onSubmit={submit}>
        <div className="m-form-grid">
          {[
            ["company", "업체명"],
            ["name", "담당자명"],
            ["email", "이메일"],
            ["phone", "전화번호"],
            ["industry", "업종"],
            ["region", "지역"],
          ].map(([name, label]) => (
            <label key={name}>
              {label} *
              <input
                name={name}
                type={
                  name === "email" ? "email" : name === "phone" ? "tel" : "text"
                }
                required
                maxLength={name === "phone" ? 30 : 100}
                autoComplete={
                  name === "email"
                    ? "email"
                    : name === "phone"
                      ? "tel"
                      : name === "name"
                        ? "name"
                        : name === "company"
                          ? "organization"
                          : "off"
                }
              />
            </label>
          ))}
        </div>
        <label>
          상담 내용 *
          <textarea
            name="description"
            required
            maxLength={5000}
            placeholder="어떤 매장인지, 마케팅에서 무엇이 어려운지 알려주세요."
          />
        </label>
        <label>
          운영 채널·홈페이지
          <input name="channels" maxLength={1000} />
        </label>
        <label>
          목표
          <input name="goal" maxLength={1000} />
        </label>
        <div className="m-form-grid">
          <label>
            월 예산
            <select name="budget_range">
              <option>미정</option>
              <option>30만원 이하</option>
              <option>30~60만원</option>
              <option>60~90만원</option>
              <option>90만원 이상</option>
            </select>
          </label>
          <label>
            희망 시작 시점
            <select name="timeline">
              <option>미정</option>
              <option>다음 달</option>
              <option>2~3개월 내</option>
              <option>상담 후 결정</option>
            </select>
          </label>
        </div>
        <label>
          참고 링크
          <input name="reference_links" maxLength={2000} />
        </label>
        <div className="m-card">
          <h3>개인정보 수집·이용 안내</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {notice?.text || "안내를 불러오는 중입니다."}
          </p>
          <small>동의 버전: {notice?.version || "확인 중"}</small>
        </div>
        <label className="m-consent">
          <input name="consent_privacy" type="checkbox" required />
          <span>개인정보 수집·이용에 동의합니다. *</span>
        </label>
        {notice && !notice.enabled && (
          <p role="status">
            온라인 접수 준비 중입니다. 개인정보 처리 안내와 접수 환경 확인 후
            신청할 수 있습니다.
          </p>
        )}
        {error && (
          <p className="m-error" role="alert">
            {error}
          </p>
        )}
        <button className="m-button" disabled={busy || !notice?.enabled}>
          {busy ? "저장 중…" : "마케팅 상담 신청하기 ↗"}
        </button>
        <p className="m-note">
          문의 접수만으로 할인 순번이나 착수 일정이 확정되지 않습니다.
        </p>
      </form>
    </section>
  );
}
