"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contactSchema } from "@/lib/domain";
import { divisionServices, type DivisionId } from "@/lib/content";

type Props = {
  division: DivisionId;
  initialService?: string;
  selection?: Record<string, unknown>;
  quick?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
};
const selectionKeys = [
  "service",
  "purpose",
  "assets",
  "channel",
  "when",
  "feat",
  "have",
  "goal",
  "budget",
  "channels",
  "ind",
  "pain",
  "plans",
  "period",
  "start",
  "platform",
  "format",
  "length",
  "count",
];

/** Connect the supplied form layout to the same validated inquiry API as admin.
 * Success is shown only after a persisted receipt; guide demo submit handlers
 * never participate in the production journey.
 */
export function InquiryBridge({
  division: initialDivision,
  initialService,
  selection = {},
  quick = false,
  children,
  style,
}: Props) {
  const [key, setKey] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState("");
  const formRef = useRef<HTMLFormElement>(null),
    resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => setKey(crypto.randomUUID()), []);
  useEffect(() => {
    if (receipt) resultRef.current?.focus();
  }, [receipt]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !key) return;
    setError("");
    const data = new FormData(event.currentTarget);
    let division = initialDivision;
    if (quick)
      division =
        selection.service === "영상"
          ? "video"
          : selection.service === "개발"
            ? "development"
            : "marketing";
    const options = divisionServices(division);
    const serviceChoice = String(selection.service ?? "");
    if (!quick && !serviceChoice && !initialService) {
      setError(
        "요청 서비스를 선택해주세요 아직 정하지 않았다면 ‘아직 모르겠어요’를 선택할 수 있습니다",
      );
      return;
    }
    const serviceAliases: Record<string, string[]> = {
      integrated: ["통합"],
      sns: ["SNS 운영", "SNS"],
      seo: ["SEO", "AEO", "GEO"],
      "ai-influencer": ["인플루언서"],
      webtoon: ["웹툰"],
      animation: ["애니메이션"],
      "brand-film": ["브랜드 홍보"],
      ad: ["SNS 광고"],
      editing: ["편집"],
      website: ["웹사이트"],
      "shopping-mall": ["쇼핑몰"],
      automation: ["자동화"],
      program: ["프로그램"],
    };
    const selectedService =
      options.find(
        (item) =>
          serviceChoice === item.id ||
          serviceChoice.includes(item.name) ||
          (serviceAliases[item.id] ?? []).some((alias) =>
            serviceChoice.includes(alias),
          ),
      ) ??
      options.find((item) => item.id === initialService) ??
      options[0];
    const details = selectionKeys.flatMap((name) => {
      const value = selection[name];
      return typeof value === "string" && value
        ? [value]
        : Array.isArray(value)
          ? value.filter((v) => typeof v === "string")
          : [];
    });
    const extraFields = [...data.entries()]
      .filter(
        ([name, value]) =>
          ![
            "name",
            "email",
            "phone",
            "company",
            "message",
            "consent",
            "website",
          ].includes(name) && String(value),
      )
      .map(
        ([name, value]) =>
          `${name === "reference" ? "참고 링크" : name}: ${String(value)}`,
      );
    const message = [
      quick ? "간단 상담 요청" : String(data.get("message") ?? ""),
      serviceChoice.includes("모르겠")
        ? "서비스 미정 · 상담 분류는 임시 지정"
        : "",
      ...details,
      ...extraFields,
    ]
      .filter(Boolean)
      .join("\n");
    let sessionUid: string | undefined;
    let landingPath = location.pathname;
    const utm: Record<string, string> = {};
    try {
      sessionUid =
        sessionStorage.getItem("aio_renewal_session") ?? crypto.randomUUID();
      if (!/^[\da-f-]{36}$/i.test(sessionUid)) sessionUid = crypto.randomUUID();
      sessionStorage.setItem("aio_renewal_session", sessionUid);
      landingPath =
        sessionStorage.getItem("aio_renewal_landing") ?? location.pathname;
      const stored: unknown = JSON.parse(
        sessionStorage.getItem("aio_renewal_utm") ?? "{}",
      );
      const params = new URLSearchParams(location.search);
      for (const name of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ]) {
        const value =
          stored && typeof stored === "object"
            ? (stored as Record<string, unknown>)[name]
            : undefined;
        const text = typeof value === "string" ? value : params.get(name);
        if (text) utm[name] = text.slice(0, 250);
      }
    } catch {}
    const payload = contactSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      division,
      service: selectedService.id,
      message,
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      idempotencyKey: key,
      attribution: {
        landingPath: landingPath.slice(0, 500),
        submitPath: location.pathname,
        referrer: document.referrer.split("?")[0].slice(0, 500),
        utm,
        sessionUid,
      },
    });
    if (!payload.success) {
      setError(payload.error.issues[0].message);
      const field = formRef.current?.elements.namedItem(
        String(payload.error.issues[0].path[0]),
      );
      if (field instanceof HTMLElement) {
        field.setAttribute("aria-invalid", "true");
        field.focus();
      }
      return;
    }
    formRef.current
      ?.querySelectorAll("[aria-invalid]")
      .forEach((field) => field.removeAttribute("aria-invalid"));
    setBusy(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.error ?? "문의 접수를 완료하지 못했습니다");
      setReceipt(result.data.inquiryId);
      if (
        !result.data.duplicate &&
        !["127.0.0.1", "localhost"].includes(location.hostname)
      )
        window.gtag?.("event", "generate_lead", {
          division,
          service: selectedService.id,
        });
    } catch (e) {
      setError(e instanceof Error ? e.message : "접수 중 오류가 발생했습니다");
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <div
        className="guide-receipt"
        role="status"
        ref={resultRef}
        tabIndex={-1}
        style={style}
      >
        <h2>문의가 접수되었습니다</h2>
        <p>담당자가 내용을 확인한 후 남겨주신 연락처로 안내드립니다</p>
        <small>접수번호 {receipt}</small>
        <Link href="/">홈으로 돌아가기 →</Link>
      </div>
    );
  return (
    <form
      ref={formRef}
      style={style}
      className={"guide-inquiry" + (busy ? " is-busy" : "")}
      onSubmit={submit}
      aria-busy={busy}
    >
      <fieldset disabled={busy || !key} className="guide-form-fields">
        {children}
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label>
          웹사이트
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="guide-form-note">
        이메일 또는 전화번호를 입력해주세요{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          개인정보 수집·이용 안내
        </Link>
      </p>
      {busy && <p role="status">문의 저장 중…</p>}
      {error && (
        <div role="alert" className="guide-form-error">
          <p>{error}</p>
          <a href="mailto:AIOMAKE2023@GMAIL.COM">이메일로 문의하기 →</a>
        </div>
      )}
    </form>
  );
}
