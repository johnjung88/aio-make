"use client";

import { useState } from "react";
import { serviceCategories, type ServiceCategory } from "@/lib/services-data";
import { getHandoffInfo, normalizeEntryPath } from "@/lib/service-handoff";
import { trackEvent, getOrCreateSessionUid } from "@/lib/analytics/client";

const FIELDS: { value: string; ko: string; en: string; subs: { value: string; ko: string; en: string; category: string }[] }[] = [
  { value: "development", ko: "개발", en: "Development", subs: [
    { value: "website", ko: "웹사이트 제작", en: "Website", category: "website" },
    { value: "shopping-mall", ko: "쇼핑몰·카페24", en: "Shopping mall (Cafe24)", category: "shopping-mall" },
    { value: "automation", ko: "자동화·프로그램", en: "Automation/Program", category: "automation-app" },
    { value: "app-mvp", ko: "앱 MVP", en: "App MVP", category: "automation-app" },
  ] },
  { value: "design", ko: "디자인", en: "Design", subs: [
    { value: "logo", ko: "로고·명함", en: "Logo & business card", category: "logo-business-card" },
    { value: "detail-page", ko: "상세페이지", en: "Detail page", category: "detail-page" },
    { value: "ppt", ko: "PPT·제안서", en: "PPT/Proposal", category: "ppt-design" },
  ] },
  { value: "video", ko: "영상", en: "Video", subs: [
    { value: "brand", ko: "브랜드 영상", en: "Brand video", category: "video-content" },
    { value: "promo", ko: "홍보·마케팅 영상", en: "Promo/Marketing video", category: "video-content" },
    { value: "shorts", ko: "숏폼·릴스", en: "Shorts/Reels", category: "video-content" },
    { value: "youtube", ko: "유튜브 편집", en: "YouTube editing", category: "video-content" },
  ] },
  { value: "marketing", ko: "마케팅", en: "Marketing", subs: [
    { value: "blog-ops", ko: "블로그 운영대행", en: "Blog operation", category: "marketing" },
    { value: "sns-ops", ko: "SNS 운영대행", en: "SNS operation", category: "marketing" },
    { value: "channel-ops", ko: "영상채널 운영대행", en: "Video channel operation", category: "marketing" },
  ] },
];

const BUDGET_OPTIONS = [
  { value: "", ko: "-", en: "-" },
  { value: "under-50k", ko: "5만원 이하", en: "Under ₩50,000" },
  { value: "50k-300k", ko: "5만~30만원", en: "₩50,000-₩300,000" },
  { value: "300k-1m", ko: "30만~100만원", en: "₩300,000-₩1,000,000" },
  { value: "1m-3m", ko: "100만~300만원", en: "₩1,000,000-₩3,000,000" },
  { value: "3m-plus", ko: "300만원 이상", en: "₩3,000,000+" },
];

const TIMELINE_OPTIONS = [
  { value: "", ko: "-", en: "-" },
  { value: "1-day", ko: "1일", en: "1 day" },
  { value: "3-days", ko: "3일", en: "3 days" },
  { value: "5-days", ko: "5일", en: "5 days" },
  { value: "1-week-plus", ko: "1주 이상", en: "1 week+" },
];

interface QuoteFormProps {
  locale: "ko" | "en";
  initialCategory?: string;
  initialSubtype?: string;
  initialSource?: string;
  initialEntryPath?: string;
}

// 매거진 톤 입력 공통 스타일
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--tone-magazine-paper-2)",
  border: "1px solid var(--tone-magazine-line-2)",
  borderRadius: 2,
  fontFamily: "var(--font-pretendard)",
  fontSize: 15,
  color: "var(--tone-magazine-ink)",
  fontWeight: 400,
  letterSpacing: "-0.005em",
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontFamily: "var(--font-jetbrains)",
  fontSize: "10.5px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "var(--tone-magazine-ink-3)",
};

export function QuoteForm({ locale, initialCategory, initialSubtype, initialSource, initialEntryPath }: QuoteFormProps) {
  const initialField =
    FIELDS.find((f) => f.subs.some((sub) => sub.category === initialCategory)) ?? FIELDS[0];
  const initialSub =
    initialField.subs.find((sub) => sub.value === initialSubtype) ??
    initialField.subs.find((sub) => sub.category === initialCategory) ??
    initialField.subs[0];
  const initialHandoff = getHandoffInfo(initialSub.category as ServiceCategory, initialSub.value);
  const safeSource = ["soomgo", "kmong", "email", "direct", "search", "referral", "portfolio", "service_page", "home"].includes(initialSource ?? "")
    ? (initialSource as string)
    : "direct";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    field: initialField.value,
    category: initialSub.category,
    subtype: initialSub.value,
    budget_range: "",
    timeline: "",
    rush: false,
    source: safeSource,
    contact_method: "email",
    description: "",
    entry_path: normalizeEntryPath(initialEntryPath, typeof window === "undefined" ? `/${locale}/quote` : window.location.pathname),
    service_key: initialHandoff.serviceKey,
    assigned_pm_queue: initialHandoff.assignedPmQueue,
    handoff_status: initialHandoff.handoffStatus,
    handoff_reason: initialHandoff.handoffReason,
    consent_privacy: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "field") {
        const f = FIELDS.find((x) => x.value === value) ?? FIELDS[0];
        next.subtype = f.subs[0].value;
        next.category = f.subs[0].category;
      }
      if (field === "subtype") {
        const f = FIELDS.find((x) => x.value === next.field) ?? FIELDS[0];
        const sub = f.subs.find((x) => x.value === value) ?? f.subs[0];
        next.category = sub.category;
      }
      if (field === "field" || field === "subtype") {
        const handoff = getHandoffInfo(next.category as ServiceCategory, next.subtype);
        next.service_key = handoff.serviceKey;
        next.assigned_pm_queue = handoff.assignedPmQueue;
        next.handoff_status = handoff.handoffStatus;
        next.handoff_reason = handoff.handoffReason;
      }
      return next;
    });
  };

  const copy = {
    ko: {
      name: "이름", email: "이메일", phone: "연락처",
      category: "서비스", subtype: "세부 작업",
      budget: "예산", timeline: "희망 일정",
      source: "유입 채널", contact: "연락 방법", description: "요구사항",
      rush: "긴급 1일 작업 상담 희망",
      consent: "개인정보 수집·이용에 동의합니다. 견적 상담 및 담당 PM 인계를 위해 입력 정보를 저장합니다.",
      handoff: "담당 인계",
      submit: "견적 문의 보내기",
      sending: "발송 중...",
      success: "견적 문의가 접수됐습니다. 빠르게 확인하겠습니다.",
      error: "전송 중 오류가 발생했습니다. 이메일로 직접 문의해주세요.",
      placeholder: "업종, 원하는 결과물, 참고 링크, 마감일을 적어주세요.",
    },
    en: {
      name: "Name", email: "Email", phone: "Phone",
      category: "Service", subtype: "Task type",
      budget: "Budget", timeline: "Timeline",
      source: "Source", contact: "Preferred contact", description: "Requirements",
      rush: "Need a 1-day rush consultation",
      consent: "I agree to the collection and use of my information for quote consultation and PM handoff.",
      handoff: "PM handoff",
      submit: "Send structured quote request",
      sending: "Sending...",
      success: "Quote request received. We will review it shortly.",
      error: "Something went wrong. Please email directly.",
      placeholder: "Tell me your business, desired result, references, and deadline.",
    },
  }[locale];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale, sessionUid: getOrCreateSessionUid() }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        trackEvent("submit_quote", { category: form.category, channel: form.source });
        setForm((current) => ({ ...current, name: "", email: "", phone: "", description: "" }));
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6"
      style={{
        background: "var(--tone-magazine-paper)",
        border: "1px solid var(--tone-magazine-ink)",
        padding: "clamp(18px, 3vw, 40px)",
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label style={labelStyle}>{copy.name} *</label>
          <input style={inputStyle} required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>{copy.email} *</label>
          <input style={inputStyle} required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label style={labelStyle}>{copy.phone}</label>
          <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>{copy.source}</label>
          <select style={inputStyle} value={form.source} onChange={(e) => set("source", e.target.value)}>
            <option value="direct">{locale === "ko" ? "직접 방문" : "Direct"}</option>
            <option value="home">{locale === "ko" ? "홈페이지" : "Home"}</option>
            <option value="service_page">{locale === "ko" ? "서비스 페이지" : "Service page"}</option>
            <option value="portfolio">{locale === "ko" ? "포트폴리오" : "Portfolio"}</option>
            <option value="search">{locale === "ko" ? "검색" : "Search"}</option>
            <option value="referral">{locale === "ko" ? "추천" : "Referral"}</option>
            <option value="soomgo">{locale === "ko" ? "숨고" : "Soomgo"}</option>
            <option value="kmong">{locale === "ko" ? "크몽" : "Kmong"}</option>
            <option value="email">{locale === "ko" ? "이메일" : "Email"}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label style={labelStyle}>{copy.category} *</label>
          <select style={inputStyle} value={form.field} onChange={(e) => set("field", e.target.value)}>
            {FIELDS.map((f) => (
              <option key={f.value} value={f.value}>
                {locale === "ko" ? f.ko : f.en}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{copy.subtype}</label>
          <select style={inputStyle} value={form.subtype} onChange={(e) => set("subtype", e.target.value)}>
            {(FIELDS.find((f) => f.value === form.field) ?? FIELDS[0]).subs.map((item) => (
              <option key={item.value} value={item.value}>
                {locale === "ko" ? item.ko : item.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label style={labelStyle}>{copy.budget}</label>
          <select style={inputStyle} value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)}>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{copy.timeline}</label>
          <select style={inputStyle} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
            {TIMELINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option[locale]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{copy.contact}</label>
          <select style={inputStyle} value={form.contact_method} onChange={(e) => set("contact_method", e.target.value)}>
            <option value="email">{locale === "ko" ? "이메일" : "Email"}</option>
            <option value="phone">{locale === "ko" ? "전화" : "Phone"}</option>
          </select>
        </div>
      </div>

      <label
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: "var(--tone-magazine-paper-2)",
          border: "1px solid var(--tone-magazine-line-2)",
          borderRadius: 2,
          fontFamily: "var(--font-pretendard)",
          fontSize: 14,
          color: "var(--tone-magazine-ink)",
          fontWeight: 400,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={form.rush}
          onChange={(e) => set("rush", e.target.checked)}
          className="size-4"
          style={{ accentColor: "var(--tone-magazine-red)" }}
        />
        {copy.rush}
      </label>

      

      <label
        className="flex items-start gap-3 px-4 py-3"
        style={{
          background: "var(--tone-magazine-paper-2)",
          border: "1px solid var(--tone-magazine-line-2)",
          borderRadius: 2,
          fontFamily: "var(--font-pretendard)",
          fontSize: 13.5,
          lineHeight: 1.6,
          color: "var(--tone-magazine-ink)",
          fontWeight: 400,
          cursor: "pointer",
        }}
      >
        <input
          required
          type="checkbox"
          checked={form.consent_privacy}
          onChange={(e) => set("consent_privacy", e.target.checked)}
          className="mt-1 size-4"
          style={{ accentColor: "var(--tone-magazine-red)" }}
        />
        {copy.consent}
      </label>

      <div>
        <label style={labelStyle}>{copy.description} *</label>
        <textarea
          required
          rows={6}
          style={{ ...inputStyle, resize: "none" }}
          placeholder={copy.placeholder}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {status === "success" && (
        <p
          className="px-4 py-3"
          style={{
            background: "rgba(125, 173, 76, 0.12)",
            border: "1px solid rgba(125, 173, 76, 0.3)",
            color: "#3a5e1f",
            fontFamily: "var(--font-pretendard)",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          {copy.success}
        </p>
      )}
      {status === "error" && (
        <p
          className="px-4 py-3"
          style={{
            background: "rgba(200, 71, 45, 0.12)",
            border: "1px solid rgba(200, 71, 45, 0.3)",
            color: "var(--tone-magazine-red)",
            fontFamily: "var(--font-pretendard)",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          {copy.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 w-full sm:w-auto"
        style={{
          height: 52,
          padding: "0 32px",
          background: "var(--tone-magazine-ink)",
          color: "var(--tone-magazine-paper)",
          border: "1px solid var(--tone-magazine-ink)",
          fontFamily: "var(--font-pretendard)",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          borderRadius: 2,
          cursor: "pointer",
        }}
      >
        {status === "loading" ? copy.sending : copy.submit + " →"}
      </button>
    </form>
  );
}
