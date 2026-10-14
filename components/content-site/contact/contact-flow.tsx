"use client";
/* /content/contact 서비스 선택 + 문의 폼(client 섬 1개).
 * - 서비스 카드 6개는 라디오(같은 name)라 ←/→/↑/↓로 이동·선택된다. <form> 바깥에 있어 메시지에 섞이지 않는다.
 * - 고른 서비스는 CsInquiry의 고정 서비스(service)로 넘긴다 → 희망 구성 선택지가 그 서비스 플랜으로 바뀌고
 *   /api/contact 페이로드의 service가 그 id가 된다.
 * - 아무것도 고르지 않고 제출하면 제출 이벤트를 캡처 단계에서 멈추고 이 페이지의 안내(요청 서비스를 하나 골라주세요)를
 *   선택 카드 바로 위에 띄운 뒤 첫 카드로 포커스를 옮긴다. 공용 InquiryBridge의 기본 문구(이 페이지에 없는 선택지를
 *   가리키는 문장)는 이 페이지에서 나오지 않는다(VERIFY_G0 6). */
import { useEffect, useId, useRef, useState } from "react";
import type React from "react";
import { startingPrice } from "@/lib/content-pricing";
import {
  CONTENT_SERVICES,
  type ContentServiceId,
} from "@/lib/content-site/types";
import { CsInquiry } from "../blocks/inquiry";
import { CONTACT_COPY } from "./copy";

export function ContactFlow({
  initialService,
  head,
}: {
  initialService?: ContentServiceId;
  /** 서버가 그린 히어로 머리(eyebrow·h1·lead·가격 기준) */
  head: React.ReactNode;
}) {
  const copy = CONTACT_COPY.chooser;
  const uid = useId();
  const legendId = `${uid}-legend`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const [chosen, setChosen] = useState<ContentServiceId | undefined>(
    initialService,
  );
  const [missing, setMissing] = useState(false);
  const chooserRef = useRef<HTMLFieldSetElement>(null);

  // 같은 페이지에서 ?service=만 바뀌어 다시 렌더될 때 따라간다.
  useEffect(() => {
    setChosen(initialService);
    setMissing(false);
  }, [initialService]);

  const onSubmitCapture = (event: React.FormEvent<HTMLDivElement>) => {
    if (chosen) return;
    event.preventDefault();
    event.stopPropagation();
    setMissing(true);
    const node = chooserRef.current;
    if (!node) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    node.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
    node
      .querySelector<HTMLInputElement>('input[type="radio"]')
      ?.focus({ preventScroll: true });
  };

  return (
    <>
      <section
        className="cs-section cs-section--sm cs-contact-hero"
        data-cs-section="hero"
        aria-labelledby="cs-hero-title"
      >
        <div className="cs-container">
          {head}
          <fieldset
            ref={chooserRef}
            className="cs-chooser cs-contact-chooser"
            role="radiogroup"
            aria-labelledby={legendId}
            aria-required="true"
            aria-invalid={missing ? true : undefined}
            data-missing={missing ? "" : undefined}
          >
            <legend id={legendId} className="cs-t-label">
              {copy.legend}
              <abbr title={copy.required} aria-hidden="true">
                *
              </abbr>
            </legend>
            <p id={hintId} className="cs-contact-hint cs-t-small">
              {copy.hint}
            </p>
            {missing ? (
              <p id={errorId} role="alert" className="cs-contact-error cs-t-small">
                {copy.missing}
              </p>
            ) : null}
            <div className="cs-chooser-list">
              {CONTENT_SERVICES.map((s) => {
                const price = startingPrice(s.id);
                return (
                  <label key={s.id} className="cs-chooser-option">
                    <input
                      type="radio"
                      name={`${uid}-service`}
                      value={s.id}
                      checked={chosen === s.id}
                      aria-describedby={
                        missing ? `${errorId} ${hintId}` : hintId
                      }
                      onChange={() => {
                        setChosen(s.id);
                        setMissing(false);
                      }}
                    />
                    <span className="cs-t-body">{s.label}</span>
                    {price ? (
                      <span className="cs-t-small">{price.head}</span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </section>
      <div className="cs-contact-form" onSubmitCapture={onSubmitCapture}>
        <CsInquiry service={chosen} copy={CONTACT_COPY.inquiry} />
      </div>
    </>
  );
}
