"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { divisions, divisionServices, type DivisionId } from "@/lib/content";
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
export function ContactForm({
  initialDivision = "marketing",
  initialService,
}: {
  initialDivision?: DivisionId;
  initialService?: string;
}) {
  const [division, setDivision] = useState<DivisionId>(initialDivision),
    [service, setService] = useState(
      initialService ?? divisionServices(initialDivision)[0].id,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(""),
    [requestId, setRequestId] = useState("");
  useEffect(() => setRequestId(crypto.randomUUID()), []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !requestId) return;
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    let sessionUid: string | undefined,
      landingPath = location.pathname,
      utm: Record<string, string> = {};
    try {
      sessionUid =
        sessionStorage.getItem("aio_renewal_session") ?? crypto.randomUUID();
      sessionStorage.setItem("aio_renewal_session", sessionUid);
      landingPath =
        sessionStorage.getItem("aio_renewal_landing") ?? location.pathname;
      const params = new URLSearchParams(location.search);
      for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ]) {
        const value = params.get(key);
        if (value) utm[key] = value;
      }
      const stored = sessionStorage.getItem("aio_renewal_utm");
      if (stored) utm = JSON.parse(stored);
    } catch {}
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          division,
          service,
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
          idempotencyKey: requestId,
          attribution: {
            landingPath,
            submitPath: location.pathname,
            referrer: document.referrer.split("?")[0],
            utm,
            sessionUid,
          },
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "문의 접수를 완료하지 못했습니다.");
      setReceipt(result.data.inquiryId);
      if (
        !result.data.duplicate &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
      )
        window.gtag?.("event", "generate_lead", { division, service });
    } catch (e) {
      setError(e instanceof Error ? e.message : "접수 중 오류가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} />
        <h2>문의가 접수되었습니다.</h2>
        <p>남겨주신 연락처로 요청 범위를 확인하고 안내드리겠습니다.</p>
        <p className="mono">접수번호 {receipt}</p>
        <Link className="button" href="/">
          홈으로 돌아가기 <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          성함 <span>*</span>
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          회사·브랜드
          <input name="company" autoComplete="organization" maxLength={150} />
        </label>
      </div>
      <div className="form-row">
        <label>
          이메일
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            placeholder="이메일 또는 전화번호 중 하나는 필수"
          />
        </label>
        <label>
          전화번호
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="연락 가능한 번호"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          분야 <span>*</span>
          <select
            value={division}
            onChange={(e) => {
              const id = e.target.value as DivisionId;
              setDivision(id);
              setService(divisionServices(id)[0].id);
            }}
          >
            {divisions.map((d) => (
              <option value={d.id} key={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          서비스 <span>*</span>
          <select value={service} onChange={(e) => setService(e.target.value)}>
            {divisionServices(division).map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        어떤 작업이 필요한가요? <span>*</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={5}
          maxLength={4000}
          placeholder={
            division === "marketing"
              ? "업종, 운영 중인 채널, 목표와 희망 일정을 알려주세요."
              : division === "development"
                ? "필요한 기능, 현재 사이트·업무 파일, 희망 일정을 알려주세요."
                : "장르, 분량, 준비된 원본·캐릭터, 희망 일정을 알려주세요."
          }
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          웹사이트
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          문의 응대를 위한{" "}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            개인정보 수집·이용
          </Link>
          에 동의합니다.
        </span>
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={busy || !requestId}>
        {busy ? "접수 중…" : "프로젝트 문의 보내기"}
        <ArrowUpRight size={18} />
      </button>
      <p className="form-hint">
        작업 범위를 확인한 뒤 견적과 납기를 안내합니다.
      </p>
    </form>
  );
}
