"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { divisions, divisionServices, type DivisionId } from "@/lib/content";
import { contactSchema } from "@/lib/domain";
function FieldTitle({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="field-title">
      {children}
      {required && <em aria-hidden="true">*</em>}
    </span>
  );
}
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
    [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}),
    [receipt, setReceipt] = useState(""),
    [requestId, setRequestId] = useState("");
  const formRef = useRef<HTMLFormElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null),
    successRef = useRef<HTMLHeadingElement>(null),
    uid = useId();
  useEffect(() => setRequestId(crypto.randomUUID()), []);
  useEffect(() => {
    if (!error) return;
    const field = formRef.current?.elements.namedItem(
      Object.keys(fieldErrors)[0],
    );
    if (field instanceof HTMLElement) field.focus();
    else errorRef.current?.focus();
  }, [error, fieldErrors]);
  useEffect(() => {
    if (receipt) successRef.current?.focus();
  }, [receipt]);
  const inputProps = (name: string) => ({
    name,
    "aria-invalid": !!fieldErrors[name],
    "aria-describedby": fieldErrors[name]
      ? uid + "-error"
      : name === "email" || name === "phone"
        ? uid + "-contact-hint"
        : undefined,
  });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !requestId) return;
    setError("");
    setFieldErrors({});
    const form = event.currentTarget;
    const data = new FormData(form);
    let sessionUid: string | undefined,
      landingPath = location.pathname;
    const utm: Record<string, string> = {};
    try {
      sessionUid =
        sessionStorage.getItem("aio_renewal_session") ?? crypto.randomUUID();
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          sessionUid,
        )
      )
        sessionUid = crypto.randomUUID();
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
        if (value) utm[key] = value.slice(0, 250);
      }
      const stored = sessionStorage.getItem("aio_renewal_utm");
      if (stored) {
        const values: unknown = JSON.parse(stored);
        if (values && typeof values === "object") {
          for (const key of [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_content",
            "utm_term",
          ]) {
            const value = (values as Record<string, unknown>)[key];
            if (typeof value === "string") utm[key] = value.slice(0, 250);
          }
        }
      }
    } catch {}
    const payload = {
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
        landingPath: landingPath.slice(0, 500),
        submitPath: location.pathname.slice(0, 500),
        referrer: document.referrer.split("?")[0].slice(0, 500),
        utm,
        sessionUid,
      },
    };
    const validated = contactSchema.safeParse(payload);
    if (!validated.success) {
      setFieldErrors(
        Object.fromEntries(
          validated.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      setError(validated.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "문의 접수를 완료하지 못했습니다");
      setReceipt(result.data.inquiryId);
      if (
        !result.data.duplicate &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
      )
        window.gtag?.("event", "generate_lead", { division, service });
    } catch (e) {
      setError(e instanceof Error ? e.message : "접수 중 오류가 발생했습니다");
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} />
        <h2 ref={successRef} tabIndex={-1}>
          문의가 접수되었습니다
        </h2>
        <p>남겨주신 연락처로 요청 범위를 확인하고 안내드리겠습니다</p>
        <Link className="button" href="/">
          홈으로 돌아가기 <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={submit}
      aria-busy={busy}
    >
      <div className="form-row">
        <label>
          <FieldTitle required>성함</FieldTitle>
          <input
            {...inputProps("name")}
            autoComplete="name"
            required
            maxLength={100}
          />
        </label>
        <label>
          <FieldTitle>회사·브랜드</FieldTitle>
          <input
            {...inputProps("company")}
            autoComplete="organization"
            maxLength={150}
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          <FieldTitle>이메일</FieldTitle>
          <input
            {...inputProps("email")}
            type="email"
            autoComplete="email"
            maxLength={255}
            placeholder="name@example.com"
          />
        </label>
        <label>
          <FieldTitle>전화번호</FieldTitle>
          <input
            {...inputProps("phone")}
            type="tel"
            autoComplete="tel"
            maxLength={30}
            placeholder="연락 가능한 번호"
          />
        </label>
      </div>
      <p className="form-hint" id={uid + "-contact-hint"}>
        답변을 받을 이메일 또는 전화번호 중 하나를 입력해주세요
      </p>
      <div className="form-row">
        <label>
          <FieldTitle required>분야</FieldTitle>
          <select
            {...inputProps("division")}
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
          <FieldTitle required>서비스</FieldTitle>
          <select
            {...inputProps("service")}
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {divisionServices(division).map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <FieldTitle required>어떤 작업이 필요한가요?</FieldTitle>
        <textarea
          {...inputProps("message")}
          rows={6}
          required
          minLength={5}
          maxLength={4000}
          placeholder={
            division === "marketing"
              ? "업종, 운영 중인 채널, 목표와 희망 일정을 알려주세요"
              : division === "development"
                ? "필요한 기능, 현재 사이트·업무 파일, 희망 일정을 알려주세요"
                : "장르, 분량, 준비된 원본·캐릭터, 희망 일정을 알려주세요"
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
          에 동의합니다
        </span>
      </label>
      {error && (
        <p
          ref={errorRef}
          tabIndex={-1}
          id={uid + "-error"}
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={busy || !requestId}>
        {busy ? "접수 중…" : "프로젝트 문의 보내기"}
        <ArrowUpRight size={18} />
      </button>
      <p className="form-hint">
        필요한 작업과 희망 일정을 알려주세요
      </p>
    </form>
  );
}
