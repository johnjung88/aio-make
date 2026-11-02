"use client";
import { useState } from "react";
import Link from "next/link";
import { InquiryBridge } from "./inquiry-bridge";
import {
  marketingIds,
  marketingNames,
  marketingCopy,
} from "@/lib/marketing-renewal";
export default function MarketingContact({
  service = "",
  initialMessage = "",
  selectedPlan = "",
  entry = "",
}) {
  const [choice, setChoice] = useState(service);
  const [industry, setIndustry] = useState("");
  const current = marketingIds.includes(choice) ? choice : "";
  return (
    <div className="mk-contact">
      <section className="mk-container mk-section">
        <div className="mk-page-title">
          <p className="mk-eyebrow">START MARKETING</p>
          <h1>
            상담만 남기셔도
            <br />
            <em>분석 자료</em>를 드립니다
          </h1>
          <p className="mk-lead">
            업종과 운영 중인 채널을 남겨주시면
            <br />
            시장, 경쟁사, 운영 방향 분석 자료를 정리해 드립니다
          </p>
        </div>
        <div className="mk-contact-grid">
          <aside>
            <h2>
              현재 상황부터
              <br />
              알려주세요
            </h2>
            <p>
              준비된 자료와 원하는 운영 방향을 알려주세요
              <br />
              범위와 일정, 필요한 자료를 함께 정리합니다
            </p>
            {current && (
              <div className="mk-contact-plan">
                <h3>{marketingNames[current]}</h3>
                <strong className="mk-price">
                  {marketingCopy[current].price}
                </strong>
                <p>{marketingCopy[current].term}</p>
              </div>
            )}
            <p className="mk-contact-benefit">
              통합·SNS·AI 인플루언서 월 운영 계약에는 기본 소개·문의 사이트 구축
              또는 리뉴얼 1회를 제공합니다
              <br />
              범위와 운영 실비는 견적에서 확인합니다
            </p>
          </aside>
          <InquiryBridge
            division="marketing"
            initialService={service}
            selection={{
              service:
                choice === "unknown"
                  ? "아직 모르겠어요"
                  : marketingNames[current] || "",
              ind: industry,
            }}
            homeHref="/marketing"
            homeLabel="마케팅 홈으로 돌아가기"
          >
            <fieldset className="mk-choices">
              <legend>원하는 서비스 *</legend>
              <div>
                {[...marketingIds, "unknown"].map((id) => (
                  <button
                    type="button"
                    key={id}
                    aria-pressed={choice === id}
                    onClick={() => setChoice(id)}
                  >
                    {id === "unknown" ? "아직 모르겠어요" : marketingNames[id]}
                  </button>
                ))}
              </div>
            </fieldset>
            {selectedPlan && (
              <p className="mk-selected-plan">선택한 구성 · {selectedPlan}</p>
            )}
            {selectedPlan && (
              <input type="hidden" name="선택한 구성" value={selectedPlan} />
            )}
            {entry && <input type="hidden" name="상담 진입" value={entry} />}
            <div className="mk-form-row">
              <label>
                고객명 *
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="이름을 입력하세요"
                />
              </label>
              <label>
                연락처
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                />
              </label>
            </div>
            <label>
              이메일
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
              />
            </label>
            <p className="mk-caption">
              이메일 또는 연락처 중 하나를 남겨주세요
            </p>
            <label>
              업종
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">업종을 선택하세요</option>
                {[
                  "카페·음식점",
                  "뷰티·헬스",
                  "제품·쇼핑몰",
                  "병원·교육 등 지역 서비스",
                  "B2B·전문 서비스",
                  "기타",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              운영 중인 채널·계정 URL
              <input
                name="reference"
                placeholder="인스타그램, 블로그, 홈페이지 주소 등"
              />
            </label>
            <label>
              요청 내용
              <textarea
                name="message"
                rows={7}
                defaultValue={initialMessage}
                placeholder="브랜드 소개와 원하는 방향을 자유롭게 적어주세요"
              />
            </label>
            <label className="mk-consent">
              <input name="consent" type="checkbox" required />
              개인정보 수집·이용에 동의합니다 (필수)
            </label>
            <p>
              <Link href="/privacy">개인정보처리방침 보기 →</Link>
            </p>
            <button className="mk-primary" type="submit">
              문의 보내기 ↗
            </button>
          </InquiryBridge>
        </div>
      </section>
    </div>
  );
}
