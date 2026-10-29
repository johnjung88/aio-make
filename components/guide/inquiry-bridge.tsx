"use client";
import { trackLegacyLead } from "@/lib/analytics-config";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackedContactSchema } from "@/lib/domain";
import { submissionAttribution } from "@/lib/attribution";
import { track, trackLead, trackFormStart } from "@/lib/tracking-events";
import { divisionServices, type DivisionId } from "@/lib/content";
import { InquiryPurpose } from "../inquiry-purpose";

type Props = {
  division: DivisionId;
  initialService?: string;
  selection?: Record<string, unknown>;
  quick?: boolean;
  purposeProvided?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** 접수 화면의 돌아가기 링크(기본 "/"). 컨텐츠 사이트는 "/content" */
  homeHref?: string;
  /** 접수 화면의 돌아가기 문구(기본 "홈으로 돌아가기") */
  homeLabel?: string;
  /** 서비스를 고르지 않고 제출했을 때 문구. 기본 문장은 '아직 모르겠어요' 선택지가 있는 폼(메인·개발 등)용이다.
   * 그 선택지가 없는 폼(컨텐츠 사이트)은 반드시 자기 문구를 넘긴다. */
  unselectedMessage?: string;
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
  purposeProvided = false,
  children,
  style,
  homeHref = "/",
  homeLabel = "홈으로 돌아가기",
  unselectedMessage = "요청 서비스를 선택해주세요\n아직 정하지 않았다면 ‘아직 모르겠어요’를 선택할 수 있습니다",
}: Props) {
  const [key, setKey] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState("");
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null),
    resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => setKey(crypto.randomUUID()), []);
  useEffect(() => {
    if (receipt) resultRef.current?.focus();
  }, [receipt]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || submitting.current || !key) return;
    setError("");
    const data = new FormData(event.currentTarget);
    let division = initialDivision;
    if (quick)
      division =
        selection.service === "컨텐츠"
          ? "video"
          : selection.service === "개발"
            ? "development"
            : "marketing";
    const options = divisionServices(division);
    const serviceChoice = String(selection.service ?? "");
    if (!quick && !serviceChoice && !initialService) {
      track("aio_form_error", { error_field: "service" });
      setError(unselectedMessage);
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
      "motion-graphics": ["모션그래픽"],
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
            "purpose",
            "found_via",
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
    const quickContact = quick ? String(data.get("phone") ?? "").trim() : "";
    const quickEmail = quickContact.includes("@");
    const payload = trackedContactSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: quickEmail ? quickContact : String(data.get("email") ?? ""),
      phone: quickEmail ? "" : String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      division,
      service: selectedService.id,
      formId: division === "video" ? "content_contact" : "guide_inquiry",
      purpose: data.get("purpose") || undefined,
      found_via: data.get("found_via") || undefined,
      message,
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      idempotencyKey: key,
      attribution: submissionAttribution(),
    });
    if (!payload.success) {
      track("aio_form_error", {
        error_field: String(payload.error.issues[0].path[0]),
      });
      setError(payload.error.issues[0].message);
      const field = formRef.current?.elements.namedItem(
        quick && payload.error.issues[0].path[0] === "email"
          ? "phone"
          : String(payload.error.issues[0].path[0]),
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
    submitting.current = true;
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
      trackLead(result.data, payload.data);
      trackLegacyLead(result.data, { division, service: selectedService.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "접수 중 오류가 발생했습니다");
    } finally {
      submitting.current = false;
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
        <h2 className="t-h2">문의가 접수되었습니다</h2>
        <p className="t-body">
          담당자가 내용을 확인한 후 남겨주신 연락처로 안내드립니다
        </p>
        <Link href={homeHref}>{`${homeLabel} →`}</Link>
      </div>
    );
  return (
    <form
      ref={formRef}
      style={style}
      className={"guide-inquiry" + (busy ? " is-busy" : "")}
      onSubmit={submit}
      onChangeCapture={() => trackFormStart(formRef.current)}
      aria-busy={busy}
    >
      <fieldset disabled={busy || !key} className="guide-form-fields">
        {!purposeProvided &&
        (quick
          ? selection.service === "컨텐츠"
          : initialDivision === "video") ? (
          <InquiryPurpose />
        ) : null}
        {children}
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label className="t-label t-small">
          웹사이트
          <input
            className="t-body"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
      <p className="guide-form-note t-body">
        {initialDivision === "marketing" ? (
          <>
            <span className="mk-form-note-line">
              이메일 또는 전화번호를 입력해 주세요
            </span>
            <span className="mk-form-note-line">
              문의를 보내면 방문 경로 정보(유입 링크·광고 클릭 번호)가 함께
              저장됩니다
            </span>
          </>
        ) : (
          <>
            {
              "이메일 또는 전화번호를 입력해주세요\n문의를 보내면 방문 경로 정보(유입 링크·광고 클릭 번호)가 함께 저장됩니다"
            }{" "}
          </>
        )}
        <br />
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          개인정보 수집·이용 안내
        </Link>
      </p>
      {busy && (
        <p className="t-body" role="status">
          문의 저장 중…
        </p>
      )}
      {error && (
        <div role="alert" className="guide-form-error">
          <p className="t-body">{error}</p>
          <a href="mailto:AIOMAKE2023@GMAIL.COM">이메일로 문의하기 →</a>
        </div>
      )}
    </form>
  );
}
