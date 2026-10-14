"use client";
/* 문의 블록(id="inquiry", 바탕 --cs-bg, 폼 카드 --cs-surface).
 * 검증된 InquiryBridge(/api/contact 저장·어트리뷰션·generate_lead)를 그대로 감싼다. 새 추적 이벤트 없음.
 * - service: 서비스 페이지의 고정 서비스, 또는 문의 페이지(contact-flow.tsx)가 폼 밖에서 고른 서비스.
 *   서비스 선택 라디오는 이 블록에 없다(문의 페이지가 직접 그린다). 서비스 없이 제출되면 InquiryBridge는
 *   이 사이트 문구(CS_COPY.inquiry.serviceMissing)만 보인다. 이 사이트에 없는 선택지를 가리키는 공용 기본 문장은 쓰지 않는다.
 * - a[data-plan] 클릭(문서 위임)을 받으면 '희망 구성'을 맞추고 #inquiry로 스크롤한 뒤 그 select에 포커스한다.
 *   R6부터 가격표 카드에는 상담 링크가 없다(희망 구성은 폼에서 직접 고른다). 진행 순서 3단계는 진행 방식(CsProcess)과 겹쳐 삭제했다.
 * 고객 데이터·work-catalog·generated·works.server를 import하지 않는다. */
import { useEffect, useId, useRef, useState } from "react";
import { InquiryBridge } from "@/components/guide/inquiry-bridge";
import { planOptions } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type { ContentServiceId } from "@/lib/content-site/types";

export type CsInquiryCopy = {
  /** h2(\n 줄바꿈) */
  title: string;
  lead: string;
  /** '만들고 싶은 컨텐츠' 입력칸 예시 */
  placeholder: string;
};

const UNDECIDED = CS_COPY.inquiry.planUndecided;

export function CsInquiry({
  service,
  copy,
}: {
  service?: ContentServiceId;
  copy: CsInquiryCopy;
}) {
  const f = CS_COPY.inquiry.fields;
  const uid = useId();
  const [plan, setPlan] = useState<string>(UNDECIDED);
  const planRef = useRef<HTMLSelectElement>(null);
  const current = service;
  const options = current ? planOptions(current) : [];

  // 서비스가 바뀌면(문의 페이지의 선택) 희망 구성을 처음 값으로 되돌린다.
  useEffect(() => {
    setPlan(UNDECIDED);
  }, [service]);

  // 가격표 '이 구성으로 상담' → 희망 구성 선택 + 스크롤 + 포커스
  useEffect(() => {
    if (!current) return;
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[data-plan]")
          : null;
      if (!link) return;
      const picked = planOptions(current).find(
        (p) => p.key === link.dataset.plan,
      );
      if (!picked) return;
      event.preventDefault();
      setPlan(picked.option);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document
        .getElementById("inquiry")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      requestAnimationFrame(() => planRef.current?.focus({ preventScroll: true }));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [current]);

  const id = (name: string) => `${uid}-${name}`;

  return (
    <section
      id="inquiry"
      className="cs-section"
      data-cs-section="inquiry"
      aria-labelledby="cs-inquiry-title"
    >
      <div className="cs-container">
        <div className="cs-grid cs-inquiry-grid">
          <div className="cs-inquiry-intro cs-col-5">
            <p className="cs-t-eyebrow">{CS_COPY.inquiry.eyebrow}</p>
            <h2 id="cs-inquiry-title" className="cs-t-h2">
              {copy.title}
            </h2>
            <p className="cs-t-lead">{copy.lead}</p>
          </div>
          <div className="cs-col-6 cs-col-start-7">
            <div className="cs-inquiry-card">
              <InquiryBridge
                division="video"
                initialService={current}
                homeHref="/content"
                homeLabel={CS_COPY.inquiry.homeLabel}
                unselectedMessage={CS_COPY.inquiry.serviceMissing}
              >
                <div className="cs-form-row">
                  <div className="cs-field">
                    <label htmlFor={id("name")} className="cs-field-label cs-t-label">
                      {f.name}
                      <abbr title={f.required} aria-hidden="true">
                        *
                      </abbr>
                    </label>
                    <input
                      id={id("name")}
                      name="name"
                      autoComplete="name"
                      aria-required="true"
                    />
                  </div>
                  <div className="cs-field">
                    <label htmlFor={id("company")} className="cs-field-label cs-t-label">
                      {f.company}
                    </label>
                    <input
                      id={id("company")}
                      name="company"
                      autoComplete="organization"
                    />
                  </div>
                </div>
                <div className="cs-form-row">
                  <div className="cs-field">
                    <label htmlFor={id("email")} className="cs-field-label cs-t-label">
                      {f.email}
                    </label>
                    <input
                      id={id("email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                  <div className="cs-field">
                    <label htmlFor={id("phone")} className="cs-field-label cs-t-label">
                      {f.phone}
                    </label>
                    <input
                      id={id("phone")}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                </div>
                <div className="cs-form-row">
                  <div className="cs-field">
                    <label htmlFor={id("plan")} className="cs-field-label cs-t-label">
                      {f.plan}
                    </label>
                    <select
                      id={id("plan")}
                      ref={planRef}
                      name={f.plan}
                      value={plan}
                      onChange={(event) => setPlan(event.target.value)}
                    >
                      {options.map((p) => (
                        <option key={p.key} value={p.option}>
                          {p.option}
                        </option>
                      ))}
                      <option value={UNDECIDED}>{UNDECIDED}</option>
                    </select>
                  </div>
                  <div className="cs-field">
                    <label htmlFor={id("schedule")} className="cs-field-label cs-t-label">
                      {f.schedule}
                    </label>
                    <select
                      id={id("schedule")}
                      name={f.schedule}
                      defaultValue={CS_COPY.inquiry.schedules[2]}
                    >
                      {CS_COPY.inquiry.schedules.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="cs-field">
                  <label htmlFor={id("reference")} className="cs-field-label cs-t-label">
                    {f.reference}
                  </label>
                  <input
                    id={id("reference")}
                    name="reference"
                    inputMode="url"
                    placeholder="https://"
                  />
                </div>
                <div className="cs-field">
                  <label htmlFor={id("message")} className="cs-field-label cs-t-label">
                    {f.message}
                    <abbr title={f.required} aria-hidden="true">
                      *
                    </abbr>
                  </label>
                  <textarea
                    id={id("message")}
                    name="message"
                    rows={6}
                    aria-required="true"
                    placeholder={copy.placeholder}
                  />
                </div>
                <label className="cs-check cs-t-small">
                  <input type="checkbox" name="consent" aria-required="true" />
                  <span>{f.consent}</span>
                </label>
                <button
                  type="submit"
                  className="cs-btn cs-btn--primary cs-btn--lg cs-submit"
                >
                  {CS_COPY.inquiry.submit}
                </button>
              </InquiryBridge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
